import 'server-only';
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { rateLimit } from '@/lib/rate-limit';
import { getSessionSecret } from '@/lib/session';
import { isMailConfigured, sendVerificationCodeMail, type MailPurpose } from '@/lib/mailer';
import { isSmsEnabled, sendVerificationCodeSms } from '@/lib/sms';

/**
 * 验证码：生成 → 存哈希 → 校验 → 作废，一条龙。
 *
 * 安全口径：
 *   - 库里只存 HMAC-SHA256 哈希，绝不存明文；盐用 SESSION_SECRET，未配置直接拒绝签发
 *     （和 DEV_PASSWORD 那次教训同源：任何"没配置就放行"的兜底都会变成免验证后门）
 *   - 6 位数字，5 分钟过期，连错 5 次作废，校验成功立刻标记 consumed_at 防重放
 *   - 三重限流：同目标 60 秒冷却、同目标 5 次/小时、同 IP 30 次/天（复用 rate_limits 表）
 */

export type CodeChannel = 'email' | 'phone';
export type CodePurpose = MailPurpose;

const CODE_TTL_MS = 5 * 60_000;
const MAX_ATTEMPTS = 5;
const DAILY_IP_LIMIT = 30;

/** 邮箱归一化：去空白 + 转小写（唯一索引也按 lower() 建，两处口径必须一致） */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * 手机号归一化：统一成 E.164（不带 +）。
 * 国内 11 位号码补 86 前缀；已带国际码的保留原样。
 */
export function normalizePhone(value: string): string {
  const digits = value.replace(/[^\d]/g, '');
  if (digits.length === 11 && digits.startsWith('1')) return `86${digits}`;
  return digits;
}

/** 国内手机号格式校验（11 位、1 开头） */
export function isValidPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value.replace(/[^\d]/g, ''));
}

/** 邮箱格式校验：只做基本形状判断，不做RFC全量正则（过度严格的正则会误杀正常邮箱） */
export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 120 && !v.includes('..');
}

/** 服务端盐：没配就是没配，绝不退化成空串盐 */
function requireSalt(): string {
  // 与会话签名共用同一套密钥策略：生产必须 ≥32 位，否则抛错；开发用进程级随机临时密钥
  return getSessionSecret();
}

function codeHash(channel: CodeChannel, target: string, purpose: CodePurpose, code: string): string {
  return createHmac('sha256', requireSalt())
    .update(`${channel}|${target}|${purpose}|${code}`)
    .digest('hex');
}

function constantTimeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export interface IssueCodeInput {
  channel: CodeChannel;
  target: string;
  purpose: CodePurpose;
  ip?: string;
  userId?: number | null;
}

export interface IssueCodeResult {
  ok: boolean;
  /** 仅 mailer/sms 处于 console 模式时会回传，方便本地自测；生产不要透传给前端 */
  debugCode?: string;
  retryAfter?: number;
  error?: string;
}

/**
 * 生成并下发一个验证码。
 * 调用方必须先做业务校验（邮箱/手机号格式、是否已注册等）。
 */
export async function issueCode(input: IssueCodeInput): Promise<IssueCodeResult> {
  const { channel, target, purpose } = input;
  const ip = input.ip ?? 'unknown';

  if (channel === 'email' && !isMailConfigured()) {
    return { ok: false, error: '邮件通道未配置，请联系管理员' };
  }
  // 手机号通道未接入时，明确拒绝，不让前端误以为发出去了
  if (channel === 'phone' && !isSmsEnabled() && process.env.SMS_PROVIDER !== 'console') {
    return { ok: false, error: '短信通道暂未开通' };
  }

  // 限流 1：同目标 60 秒冷却（防重发轰炸）
  const cooldown = await rateLimit(`code-send:${channel}:${target}`, 1, 60_000);
  if (!cooldown.ok) {
    return { ok: false, retryAfter: cooldown.retryAfter, error: `请 ${cooldown.retryAfter} 秒后再试` };
  }
  // 限流 2：同目标 5 次/小时（防单号码被刷）
  const hourly = await rateLimit(`code-hour:${channel}:${target}`, 5, 3600_000);
  if (!hourly.ok) {
    return { ok: false, retryAfter: hourly.retryAfter, error: '验证码发送过于频繁，请稍后再试' };
  }
  // 限流 3：同 IP 每天上限（防批量注册 / 刷短信费）
  const daily = await rateLimit(`code-ip:${ip}`, DAILY_IP_LIMIT, 24 * 3600_000);
  if (!daily.ok) {
    return { ok: false, retryAfter: daily.retryAfter, error: '今日验证码发送已达上限' };
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const client = getSupabaseClient();

  // 清掉同目标同用途的旧码（无论是否过期），保证"最新一条才是有效码"
  await client
    .from('verification_codes')
    .delete()
    .eq('channel', channel)
    .eq('target', target)
    .eq('purpose', purpose);

  const { error } = await client.from('verification_codes').insert({
    channel,
    target,
    purpose,
    code_hash: codeHash(channel, target, purpose, code),
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
    ip_address: ip,
    user_id: input.userId ?? null,
  });
  if (error) {
    console.error('验证码写入失败:', error.message);
    return { ok: false, error: '验证码发送失败，请稍后重试' };
  }

  const sent =
    channel === 'email'
      ? await sendVerificationCodeMail({ to: target, code, purpose })
      : await sendVerificationCodeSms({ to: target, code, purpose });

  if (!sent.ok) {
    // 发不出去就把码作废，避免"界面说发了、库里也存了、但用户收不到"的僵局
    await client
      .from('verification_codes')
      .delete()
      .eq('channel', channel)
      .eq('target', target)
      .eq('purpose', purpose);
    return { ok: false, error: sent.error ?? '验证码发送失败' };
  }

  // console 模式下把码回传，前端可显示"本地调试验证码"。
  // P0-2 修复：仅开发环境回传。生产/自托管部署若仍用 console 模式（码只进服务端日志），
  // 决不能把验证码交给前端——那等于把找回密码通道向任何知晓昵称的人开放。
  // 2026-10-15：生产环境 console 通道已被 mailer 视为未配置，ALLOW_DEBUG_CODE 后门随之移除。
  const debugCode =
    sent.provider === 'console' && process.env.NODE_ENV !== 'production' ? code : undefined;
  return { ok: true, debugCode };
}

export interface VerifyCodeResult {
  ok: boolean;
  error?: string;
  /** 剩余可尝试次数（错误时回传，用于提示"还可试 N 次"） */
  remaining?: number;
}

/** 校验验证码，成功即作废（防重放） */
export async function verifyCode(input: {
  channel: CodeChannel;
  target: string;
  purpose: CodePurpose;
  code: string;
}): Promise<VerifyCodeResult> {
  const { channel, target, purpose, code } = input;
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('verification_codes')
    .select('id, code_hash, attempts, expires_at')
    .eq('channel', channel)
    .eq('target', target)
    .eq('purpose', purpose)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('验证码查询失败:', error.message);
    return { ok: false, error: '验证失败，请稍后重试' };
  }
  if (!data) return { ok: false, error: '验证码不存在或已失效，请重新获取' };
  if (new Date(data.expires_at).getTime() < Date.now()) {
    return { ok: false, error: '验证码已过期，请重新获取' };
  }
  if ((data.attempts ?? 0) >= MAX_ATTEMPTS) {
    return { ok: false, error: '错误次数过多，请重新获取验证码' };
  }

  if (!constantTimeEqual(data.code_hash as string, codeHash(channel, target, purpose, code))) {
    const attempts = (data.attempts ?? 0) + 1;
    await client.from('verification_codes').update({ attempts }).eq('id', data.id);
    const remaining = Math.max(0, MAX_ATTEMPTS - attempts);
    return { ok: false, error: `验证码错误，还可尝试 ${remaining} 次`, remaining };
  }

  const consumed = await client
    .from('verification_codes')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', data.id)
    .is('consumed_at', null)
    .select('id')
    .maybeSingle();
  // 并发下被别的请求抢先消费掉，视为失败（一人一码，不能复用）
  if (!consumed.data) return { ok: false, error: '验证码已被使用，请重新获取' };

  return { ok: true };
}
