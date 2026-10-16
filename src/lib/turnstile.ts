/**
 * Cloudflare Turnstile 服务端校验（注册防刷）。
 *
 * 环境变量：
 *   TURNSTILE_SECRET_KEY           服务端密钥
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY 客户端站点 key
 *
 * - 两个都没配置：跳过验证（开发友好），服务端 console.warn 一次
 * - 只配了一半：视为配置错误（reason = 'misconfigured'），调用方应返回 500 通用文案
 * - 两个都配置：向 siteverify 校验，超时 8 秒
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TIMEOUT_MS = 8000;

export type TurnstileResult =
  | { ok: true; skipped: boolean }
  | { ok: false; reason: 'misconfigured' | 'missing_token' | 'rejected' | 'timeout' | 'network_error' };

let warnedDisabled = false;

/** 仅供测试：重置「已警告」标记 */
export function __resetTurnstileWarnForTest(): void {
  warnedDisabled = false;
}

export function verifyTurnstileState(): 'disabled' | 'enabled' | 'misconfigured' {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!secret && !siteKey) return 'disabled';
  if (secret && siteKey) return 'enabled';
  return 'misconfigured';
}

export async function verifyTurnstile(token: unknown, ip: string): Promise<TurnstileResult> {
  const state = verifyTurnstileState();
  if (state === 'disabled') {
    if (!warnedDisabled) {
      warnedDisabled = true;
      console.warn('[turnstile] 未配置 TURNSTILE_SECRET_KEY / NEXT_PUBLIC_TURNSTILE_SITE_KEY，已跳过人机验证（生产环境请配置）');
    }
    return { ok: true, skipped: true };
  }
  if (state === 'misconfigured') {
    console.error('[turnstile] 配置不完整：TURNSTILE_SECRET_KEY 与 NEXT_PUBLIC_TURNSTILE_SITE_KEY 必须同时配置');
    return { ok: false, reason: 'misconfigured' };
  }

  if (typeof token !== 'string' || !token || token.length > 4096) {
    return { ok: false, reason: 'missing_token' };
  }

  const form = new URLSearchParams();
  form.set('secret', process.env.TURNSTILE_SECRET_KEY!.trim());
  form.set('response', token);
  // 本地/非 CF 环境 ip 为 'local'，不是合法 IP，不传
  if (ip && ip !== 'local' && !ip.includes('/')) form.set('remoteip', ip);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error('[turnstile] siteverify HTTP', res.status);
      return { ok: false, reason: 'network_error' };
    }
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (data.success === true) return { ok: true, skipped: false };
    console.warn('[turnstile] 验证未通过:', (data['error-codes'] ?? []).join(','));
    return { ok: false, reason: 'rejected' };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('[turnstile] siteverify 超时');
      return { ok: false, reason: 'timeout' };
    }
    console.error('[turnstile] siteverify 请求失败:', err instanceof Error ? err.message : err);
    return { ok: false, reason: 'network_error' };
  } finally {
    clearTimeout(timer);
  }
}
