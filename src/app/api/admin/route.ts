import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { createNotification } from '@/lib/notifications';
import { invalidateRuleCache } from '@/lib/moderation';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { SETTING_KEYS } from '@/lib/app-settings';
import { sessionFromRequestVerified } from '@/lib/session';

// Developer password (stored as env var in production)
const MIN_DEV_PASSWORD_LENGTH = 16;
const DEV_PASSWORD = (() => {
  const pw = process.env.DEV_PASSWORD;
  // 生产环境口令过短：视同未配置，所有口令登录/高危操作一律拒绝（503），并打错误日志
  if (process.env.NODE_ENV === 'production' && pw && pw.length < MIN_DEV_PASSWORD_LENGTH) {
    console.error(
      `[admin] DEV_PASSWORD 长度不足 ${MIN_DEV_PASSWORD_LENGTH} 位，生产环境已拒绝所有口令登录；请改成 ≥24 位随机串`
    );
    return undefined;
  }
  return pw;
})();

const sha256 = (value: string) => createHash('sha256').update(value).digest();

/** 常量时间比较：先各自 sha256 保证等长，再 timingSafeEqual */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

// 开发者会话令牌：随机生成，库里只存 sha256 哈希，12 小时过期，可被注销（删除行）。
const DEV_SESSION_TTL_MS = 12 * 3600_000;
const sha256Hex = (value: string) => createHash('sha256').update(value).digest('hex');

async function issueDevToken(): Promise<string> {
  const client = getSupabaseClient();
  await client.from('dev_sessions').delete().lt('expires_at', new Date().toISOString());
  const token = randomBytes(32).toString('base64url');
  const { error } = await client.from('dev_sessions').insert({
    token_hash: sha256Hex(token),
    expires_at: new Date(Date.now() + DEV_SESSION_TTL_MS).toISOString(),
  });
  if (error) throw new Error(`开发者会话签发失败: ${error.message}`);
  return token;
}

async function verifyDevAuth(request: NextRequest): Promise<boolean> {
  const token = request.headers.get('x-dev-token');
  if (!token) return false;
  const { data, error } = await getSupabaseClient()
    .from('dev_sessions')
    .select('token_hash')
    .eq('token_hash', sha256Hex(token))
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  if (error) {
    console.error('开发者会话校验失败:', error.message);
    return false;
  }
  return !!data;
}

const VALID_ROLES = ['normal', 'premium', 'developer'] as const;

// ---- 入参校验 ----
const isPositiveInt = (v: unknown, max = Number.MAX_SAFE_INTEGER): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= max;
const isBoundedString = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.trim().length > 0 && v.length <= max;

const MAX_CREDITS = 100000;
const MAX_USES = 1_000_000;
const MAX_BATCH = 50;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function serverError(err: unknown) {
  console.error('admin 接口异常:', err);
  return NextResponse.json({ error: '服务器错误，请稍后重试' }, { status: 500 });
}

/** 可选整数字段：缺省/null 视为 null；非法返回 undefined */
function optionalInt(v: unknown, min: number, max: number): number | null | undefined {
  if (v === undefined || v === null || v === 0) return null;
  if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max) return undefined;
  return v;
}

function expiresAtFromDays(days: number | null): string | null {
  return days === null ? null : new Date(Date.now() + days * 86_400_000).toISOString();
}

// 去掉 0/O/1/I/L 等易混字符
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomCode(length = 10): string {
  // 丢弃 >= 阈值的字节，避免取模偏差
  const limit = 256 - (256 % CODE_ALPHABET.length);
  let out = '';
  while (out.length < length) {
    for (const byte of randomBytes(length * 2)) {
      if (byte < limit && out.length < length) out += CODE_ALPHABET[byte % CODE_ALPHABET.length];
    }
  }
  return out;
}

/**
 * 高危操作门禁：删除 / 永久清除 / 重置密码等，必须再输一次管理员密码。
 *
 * 为什么：dev token 存在浏览器里，页面被劫持或本人误点时，光有 token 就能删库级数据是灾难。
 * 再加一层"当前操作者知道 DEV_PASSWORD"的证明，把误触和越权的代价都抬高。
 */
async function requireAdminPassword(request: NextRequest, body: Record<string, unknown>): Promise<NextResponse | null> {
  if (!DEV_PASSWORD) {
    return NextResponse.json({ error: '管理员密码未配置，已拒绝高危操作' }, { status: 503 });
  }
  const ip = getClientIp(request);
  const rl = await rateLimit(`admin-dangerous:${ip}`, 8, 5 * 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: `操作过于频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
  }
  const { password } = body;
  if (typeof password !== 'string' || password.length === 0 || password.length > 500 || !safeEqual(password, DEV_PASSWORD)) {
    return NextResponse.json({ error: '管理员密码错误' }, { status: 401 });
  }
  return null; // 通过
}

const isUniqueViolation = (error: { code?: string } | null) => error?.code === '23505';

/**
 * 判断是不是"列不存在"。
 * 三种来源都要认：Postgres 原生 42703、PostgREST 的 schema cache 文案、以及直连报错文案。
 * 只认 42703 是不够的——Supabase 走 PostgREST，返回的是
 * "Could not find the 'email' column of 'app_users' in the schema cache"。
 */
const isMissingColumn = (error: { code?: string; message?: string } | null): boolean => {
  if (!error) return false;
  if (error.code === '42703' || error.code === 'PGRST204') return true;
  const msg = error.message ?? '';
  return /could not find the '.+' column/i.test(msg) || /column .+ does not exist/i.test(msg);
};

// GET /api/admin - List users / invite codes / logs
export async function GET(request: NextRequest) {
  if (!(await verifyDevAuth(request))) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const client = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'users';

    if (type === 'users') {
      // 账号体系 v2 的列（email/phone/deleted_at 等）要执行 batch6 迁移后才有。
      // 迁移没跑时不能让后台直接白屏，所以先试新列，失败就退回旧列并告诉前端"字段不全"。
      const EXTENDED =
        'id, nickname, avatar, avatar_url, role, is_active, invite_code_used, ai_credits, ai_credits_total, last_login_at, last_login_ip, created_at, email, email_verified, phone, phone_verified, city, gender, birthday, bio, deleted_at';
      const LEGACY = 'id, nickname, avatar, role, is_active, invite_code_used, ai_credits, last_login_at, created_at';

      let data: unknown[] | null = null;
      let partial = false;
      const extended = await client
        .from('app_users')
        .select(EXTENDED)
        .order('created_at', { ascending: false })
        .limit(500);
      if (extended.error) {
        console.warn('用户扩展字段查询失败（多半是 batch6 迁移未执行），回退旧字段:', extended.error.message);
        const legacy = await client
          .from('app_users')
          .select(LEGACY)
          .order('created_at', { ascending: false })
          .limit(500);
        if (legacy.error) throw new Error(`查询失败: ${legacy.error.message}`);
        data = legacy.data;
        partial = true;
      } else {
        data = extended.data;
      }

      return NextResponse.json({ success: true, data, columnsPartial: partial });

    } else if (type === 'invites') {
      const { data, error } = await client
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw new Error(`查询失败: ${error.message}`);
      return NextResponse.json({ success: true, data });

    } else if (type === 'logs') {
      const { data, error } = await client
        .from('access_logs')
        .select('id, user_id, action, detail, created_at, app_users(nickname)')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw new Error(`查询失败: ${error.message}`);
      return NextResponse.json({ success: true, data });

    } else if (type === 'ai_logs') {
      // 内容审核列表。正文只回预览（前 120 字），看全文要走 get_ai_log_detail（会留审计）
      let query = client
        .from('ai_usage_logs')
        .select('id, user_id, module, success, error_kind, risk_level, risk_score, risk_hits, risk_reason, reviewed, action_taken, content_purged, created_at, app_users(nickname)')
        .order('created_at', { ascending: false })
        .limit(200);

      const risk = searchParams.get('risk');
      if (risk && ['none', 'low', 'medium', 'high'].includes(risk)) query = query.eq('risk_level', risk);
      if (searchParams.get('reviewed') === '0') query = query.eq('reviewed', false);
      if (searchParams.get('riskOnly') === '1') query = query.neq('risk_level', 'none');

      const res = await query;
      let rows: Array<Record<string, unknown>> = [];
      if (res.error && isMissingColumn(res.error)) {
        // 迁移未执行：退回基础列，页面照常显示（只是没有风险字段）
        const legacy = await client
          .from('ai_usage_logs')
          .select('id, user_id, module, success, error_kind, created_at, app_users(nickname)')
          .order('created_at', { ascending: false })
          .limit(200);
        if (legacy.error) throw new Error(`查询失败: ${legacy.error.message}`);
        rows = (legacy.data ?? []) as Array<Record<string, unknown>>;
      } else if (res.error) {
        throw new Error(`查询失败: ${res.error.message}`);
      } else {
        rows = (res.data ?? []) as Array<Record<string, unknown>>;
      }

      const list = rows.map(r => {
        const user = r.app_users as { nickname?: string } | null | undefined;
        return { ...r, nickname: user?.nickname ?? null, app_users: undefined };
      });
      return NextResponse.json({ success: true, data: list });

    } else if (type === 'rules') {
      const { data, error } = await client
        .from('moderation_rules')
        .select('id, word, level, category, enabled, created_at')
        .order('created_at', { ascending: false })
        .limit(500);
      // 表还没建（batch7 未执行）：返回空表 + 标记，别让整个页签 500
      if (error && (error.code === '42P01' || error.code === 'PGRST205' || /does not exist/i.test(error.message ?? ''))) {
        return NextResponse.json({ success: true, data: [], unavailable: true });
      }
      if (error) throw new Error(`查询失败: ${error.message}`);
      return NextResponse.json({ success: true, data });

    } else if (type === 'stats') {
      // Get counts
      const [usersRes, invitesRes, premiumRes, activeRes] = await Promise.all([
        client.from('app_users').select('*', { count: 'exact', head: true }),
        client.from('invite_codes').select('*', { count: 'exact', head: true }),
        client.from('app_users').select('*', { count: 'exact', head: true }).in('role', ['premium', 'developer']),
        client.from('app_users').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          totalUsers: usersRes.count || 0,
          totalInvites: invitesRes.count || 0,
          premiumUsers: premiumRes.count || 0,
          activeUsers: activeRes.count || 0,
        },
      });

    } else if (type === 'usage') {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data, error } = await client
        .from('ai_usage_logs')
        .select('user_id, module, success, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(5000);

      if (error) throw new Error(`查询失败: ${error.message}`);
      const rows = data ?? [];
      const byModule: Record<string, { total: number; ok: number }> = {};
      const byDay: Record<string, { total: number; ok: number }> = {};
      const users = new Set<number>();
      for (const r of rows) {
        const m = (byModule[r.module] ??= { total: 0, ok: 0 });
        const d = (byDay[r.created_at.slice(0, 10)] ??= { total: 0, ok: 0 });
        m.total++; d.total++;
        if (r.success) { m.ok++; d.ok++; }
        users.add(r.user_id);
      }
      return NextResponse.json({
        success: true,
        data: { sampleSize: rows.length, uniqueUsers: users.size, byModule, byDay },
      });

    } else if (type === 'credit_logs') {
      const userId = Number(searchParams.get('userId'));
      if (!isPositiveInt(userId)) return badRequest('缺少用户ID');
      const { data, error } = await client
        .from('ai_credit_logs')
        .select('id, delta, reason, balance, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw new Error(`查询失败: ${error.message}`);
      return NextResponse.json({ success: true, data });

    } else if (type === 'settings') {
      const { data, error } = await client.from('app_settings').select('key, value');
      if (error) throw new Error(`查询失败: ${error.message}`);
      return NextResponse.json({ success: true, data });

    } else {
      return NextResponse.json({ error: '无效类型' }, { status: 400 });
    }

  } catch (err) {
    return serverError(err);
  }
}

// POST /api/admin - Create invite code / update user / verify dev password
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      const parsed = await request.json();
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return badRequest('请求格式错误');
      body = parsed as Record<string, unknown>;
    } catch {
      return badRequest('请求格式错误');
    }
    const { action } = body;

    // Verify dev password & auto-upgrade logged-in user to developer
    if (action === 'verify') {
      const { password } = body;
      // 升级对象只认服务端会话（用户登录态），不信任请求体自报的 userId
      const userId = (await sessionFromRequestVerified(request))?.userId ?? null;

      // 永久开发者（数据库 role=developer，如站长账号）凭登录态免密换 dev token。
      // 会话是 HMAC 签名的，角色以数据库为准；已认证的捷径不消耗防爆破限流桶。
      if (userId) {
        const client = getSupabaseClient();
        const { data: devUser } = await client
          .from('app_users')
          .select('id, nickname, avatar, role, is_active, invite_code_used, created_at')
          .eq('id', userId)
          .maybeSingle();
        if (devUser && devUser.is_active && devUser.role === 'developer') {
          await client.from('access_logs').insert({
            user_id: userId,
            action: 'become_developer',
            detail: `永久开发者 ${devUser.nickname} 凭登录态免密进入后台`,
          });
          return NextResponse.json({ success: true, token: await issueDevToken(), user: devUser });
        }
      }

      // 关键边界：DEV_PASSWORD 未配置时绝不能通过校验。
      // 否则 password 与 DEV_PASSWORD 同为 undefined，`undefined === undefined` 为真，
      // 任何人 POST {action:'verify', userId} 就能免密把自己升级成 developer。
      if (!DEV_PASSWORD) {
        return NextResponse.json({ error: '开发者后台未启用（未配置 DEV_PASSWORD）' }, { status: 503 });
      }
      // 防爆破：verify 是唯一不需要 token 的入口，必须限流，否则可离线/在线暴力猜密码
      const ip = getClientIp(request);
      // 双维度：单 IP 15 分钟 5 次 + 全局 15 分钟 50 次（防分布式撞库）。
      // 每次口令尝试都计数（rate-limit 工具无「只记失败」接口，先判后记会让第 6 次起的猜中绕过限流）。
      const rlIp = await rateLimit(`admin-verify:ip:${ip}`, 5, 15 * 60_000);
      if (!rlIp.ok) {
        return NextResponse.json({ error: `尝试过于频繁，请 ${rlIp.retryAfter} 秒后再试` }, { status: 429 });
      }
      const rlGlobal = await rateLimit('admin-verify:global', 50, 15 * 60_000);
      if (!rlGlobal.ok) {
        console.error('[admin] 后台口令尝试触发全局限流（疑似分布式爆破）');
        return NextResponse.json({ error: `尝试过于频繁，请 ${rlGlobal.retryAfter} 秒后再试` }, { status: 429 });
      }
      if (typeof password === 'string' && password.length > 0 && password.length <= 500 && safeEqual(password, DEV_PASSWORD)) {
        // If a userId is provided, auto-upgrade that user to developer
        if (userId) {
          const client = getSupabaseClient();
          const { data: userData, error: userError } = await client
            .from('app_users')
            .select('id, nickname, avatar, role, is_active, invite_code_used, created_at')
            .eq('id', userId)
            .maybeSingle();

          if (!userError && userData) {
            // 密码路径只在本会话内授予开发者视图（客户端 updateUserRole），不写数据库——
            // 数据库 role=developer 现在仅代表永久开发者；退出时也无需降级
            await client.from('access_logs').insert({
              user_id: userId,
              action: 'become_developer',
              detail: `用户 ${userData.nickname} 通过密码进入开发者后台（临时，原角色: ${userData.role}）`,
            });
            return NextResponse.json({
              success: true,
              token: await issueDevToken(),
              user: { ...userData, role: 'developer' },
            });
          }
        }
        return NextResponse.json({ success: true, token: await issueDevToken() });
      }
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    // 注销当前开发者令牌（只删自己这一条）
    if (action === 'revoke_dev_token') {
      const token = request.headers.get('x-dev-token');
      if (token) {
        const { error } = await getSupabaseClient()
          .from('dev_sessions')
          .delete()
          .eq('token_hash', sha256Hex(token));
        if (error) throw new Error(`注销失败: ${error.message}`);
      }
      return NextResponse.json({ success: true });
    }

    // Exit developer mode - downgrade back to premium
    // 必须携带 x-dev-token：否则任何人可传 userId 把任意用户降级
    if (action === 'exit_developer') {
      if (!(await verifyDevAuth(request))) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
      }
      const { userId } = body;
      if (!isPositiveInt(userId)) {
        return badRequest('缺少用户ID');
      }
      const client = getSupabaseClient();
      // 只退出会话视图，不再降级数据库角色——role=developer 仅代表永久开发者，
      // 密码路径的临时授予也不写库，退出时无需还原
      const { data: userData, error: userError } = await client
        .from('app_users')
        .select('id, nickname, role, invite_code_used')
        .eq('id', userId)
        .maybeSingle();

      if (userError || !userData) {
        return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      }

      await client.from('access_logs').insert({
        user_id: userId,
        action: 'exit_developer',
        detail: `用户 ${userData.nickname} 退出开发者后台（数据库角色保持 ${userData.role}）`,
      });

      return NextResponse.json({ success: true, newRole: userData.role });
    }

    // All other actions require auth
    if (!(await verifyDevAuth(request))) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const client = getSupabaseClient();

    if (action === 'create_invite') {
      const { code, label, maxUses, expiresInDays, aiCredits } = body;
      if (!isBoundedString(code, 50)) {
        return badRequest('请输入邀请码（最多 50 个字符）');
      }
      if (label !== undefined && label !== null && !(typeof label === 'string' && label.length <= 100)) {
        return badRequest('备注不能超过 100 个字符');
      }
      const uses = maxUses === undefined || maxUses === null || maxUses === 0 ? null : maxUses;
      if (uses !== null && !isPositiveInt(uses, MAX_USES)) {
        return badRequest('使用次数无效');
      }
      const days = optionalInt(expiresInDays, 1, 3650);
      if (days === undefined) {
        return badRequest('有效天数需为 1–3650 的整数');
      }
      const credits = optionalInt(aiCredits, 0, MAX_CREDITS);
      if (credits === undefined) {
        return badRequest(`AI 额度需为 0–${MAX_CREDITS} 的整数`);
      }
      // 码类型（batch9）：access=使用权 / ai=AI额度 / bundle=套餐（默认，兼容旧码）
      const kindRaw = typeof body.kind === 'string' ? body.kind : 'bundle';
      if (!['access', 'ai', 'bundle'].includes(kindRaw)) {
        return badRequest('码类型无效');
      }
      const kind = kindRaw;
      // 类型约束：使用权码不带额度；AI 额度码必须有额度（0 额度的纯额度码没有意义）
      if (kind === 'access' && (credits ?? 0) > 0) {
        return badRequest('使用权码不携带 AI 额度，如需额度请发套餐码');
      }
      if (kind === 'ai' && (credits ?? 0) < 1) {
        return badRequest('AI 额度码的额度至少为 1');
      }

      // kind 列未建（batch9 迁移未执行）时降级为旧行为：不带 kind 插入（服务端默认 bundle 语义）
      let insert = await client
        .from('invite_codes')
        .insert({
          code: code.trim(),
          label: label || null,
          max_uses: uses,
          ai_credits: kind === 'access' ? 0 : (credits ?? 0),
          kind,
          created_by: 'developer',
          expires_at: expiresAtFromDays(days),
        })
        .select()
        .single();

      if (insert.error && insert.error.message.includes("Could not find the 'kind' column")) {
        insert = await client
          .from('invite_codes')
          .insert({
            code: code.trim(),
            label: label || null,
            max_uses: uses,
            ai_credits: kind === 'access' ? 0 : (credits ?? 0),
            created_by: 'developer',
            expires_at: expiresAtFromDays(days),
          })
          .select()
          .single();
      }

      const { data, error } = insert;

      if (error) {
        if (isUniqueViolation(error)) {
          return NextResponse.json({ error: '邀请码已存在' }, { status: 409 });
        }
        throw new Error(`创建失败: ${error.message}`);
      }

      return NextResponse.json({ success: true, data });

    } else if (action === 'batch_invite') {
      const { count, prefix, maxUses, expiresInDays, aiCredits } = body;
      const num = count === undefined || count === null || count === 0 ? 5 : count;
      if (!isPositiveInt(num, MAX_BATCH)) {
        return badRequest(`数量需为 1–${MAX_BATCH} 的整数`);
      }
      const codePrefix = prefix === undefined || prefix === null || prefix === '' ? 'LR' : prefix;
      if (typeof codePrefix !== 'string' || !/^[A-Za-z0-9]{1,10}$/.test(codePrefix)) {
        return badRequest('前缀只能是 1–10 位字母或数字');
      }
      const uses = maxUses === undefined || maxUses === null || maxUses === 0 ? null : maxUses;
      if (uses !== null && !isPositiveInt(uses, MAX_USES)) {
        return badRequest('使用次数无效');
      }
      const days = optionalInt(expiresInDays, 1, 3650);
      if (days === undefined) {
        return badRequest('有效天数需为 1–3650 的整数');
      }
      const credits = optionalInt(aiCredits, 0, MAX_CREDITS);
      if (credits === undefined) {
        return badRequest(`AI 额度需为 0–${MAX_CREDITS} 的整数`);
      }
      const kindRaw = typeof body.kind === 'string' ? body.kind : 'bundle';
      if (!['access', 'ai', 'bundle'].includes(kindRaw)) {
        return badRequest('码类型无效');
      }
      const kind = kindRaw;
      if (kind === 'access' && (credits ?? 0) > 0) {
        return badRequest('使用权码不携带 AI 额度，如需额度请发套餐码');
      }
      if (kind === 'ai' && (credits ?? 0) < 1) {
        return badRequest('AI 额度码的额度至少为 1');
      }

      const expiresAt = expiresAtFromDays(days);
      for (let attempt = 0; attempt < 3; attempt++) {
        const rows = Array.from({ length: num }, () => ({
          code: `${codePrefix.toUpperCase()}-${randomCode(10)}`,
          label: `批量生成`,
        }));
        const withKind = {
          max_uses: uses,
          ai_credits: kind === 'access' ? 0 : (credits ?? 0),
          created_by: 'developer',
          expires_at: expiresAt,
        };
        // kind 列未建（batch9 迁移未执行）时降级：去掉 kind 重插
        let ins = await client
          .from('invite_codes')
          .insert(rows.map(r => ({ ...r, ...withKind, kind })))
          .select();

        if (ins.error && ins.error.message.includes("Could not find the 'kind' column")) {
          ins = await client
            .from('invite_codes')
            .insert(rows.map(r => ({ ...r, ...withKind })))
            .select();
        }

        if (!ins.error) return NextResponse.json({ success: true, data: ins.data });
        if (!isUniqueViolation(ins.error)) throw new Error(`批量创建失败: ${ins.error.message}`);
      }
      return NextResponse.json({ error: '生成邀请码冲突，请重试' }, { status: 409 });

    } else if (action === 'update_user') {
      // 后台改用户资料：角色 / 启用 / 昵称 / 邮箱 / 手机号 / 资料字段，传什么改什么
      const { userId, role, isActive, nickname, email, phone, city, gender, birthday, bio } = body;
      if (!isPositiveInt(userId)) {
        return badRequest('缺少用户ID');
      }
      if (role !== undefined && !(VALID_ROLES as readonly string[]).includes(role as string)) {
        return badRequest('无效角色');
      }
      if (isActive !== undefined && typeof isActive !== 'boolean') {
        return badRequest('启用状态无效');
      }
      if (nickname !== undefined && (!isBoundedString(nickname, 50) || nickname.trim() !== nickname)) {
        return badRequest('昵称无效（1-50 字符，不能有首尾空格）');
      }
      if (email !== undefined && email !== null && email !== '' && !isBoundedString(email, 120)) {
        return badRequest('邮箱无效');
      }
      if (phone !== undefined && phone !== null && phone !== '' && !isBoundedString(phone, 20)) {
        return badRequest('手机号无效');
      }
      if (city !== undefined && city !== null && city !== '' && !isBoundedString(city, 50)) {
        return badRequest('城市无效');
      }
      if (bio !== undefined && bio !== null && bio !== '' && !isBoundedString(bio, 200)) {
        return badRequest('简介过长（最多 200 字符）');
      }
      if (gender !== undefined && gender !== null && gender !== '' && !isBoundedString(gender, 10)) {
        return badRequest('性别无效');
      }
      if (birthday !== undefined && birthday !== null && birthday !== '') {
        if (typeof birthday !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
          return badRequest('生日格式应为 YYYY-MM-DD');
        }
      }

      const updates: Record<string, unknown> = {};
      if (role !== undefined) updates.role = role;
      if (isActive !== undefined) updates.is_active = isActive;
      if (nickname !== undefined) updates.nickname = nickname;
      if (email !== undefined) updates.email = email === '' ? null : String(email).trim().toLowerCase();
      if (phone !== undefined) updates.phone = phone === '' ? null : String(phone).replace(/[^\d+]/g, '');
      if (city !== undefined) updates.city = city === '' ? null : city;
      if (gender !== undefined) updates.gender = gender === '' ? null : gender;
      if (birthday !== undefined) updates.birthday = birthday === '' ? null : birthday;
      if (bio !== undefined) updates.bio = bio === '' ? null : bio;

      if (Object.keys(updates).length === 0) {
        return badRequest('无更新内容');
      }
      // 改昵称时同步记录下来，前端可据此提示"30 天内不能再改"
      if (updates.nickname !== undefined) updates.nickname_changed_at = new Date().toISOString();

      const { error } = await client
        .from('app_users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        if (isUniqueViolation(error)) {
          return NextResponse.json({ error: '昵称 / 邮箱 / 手机号已被占用' }, { status: 409 });
        }
        // batch6 迁移没跑时，email/phone/city 这些列还不存在。
        // 给一句人话提示，别让管理员对着"服务器错误"发懵。
        if (isMissingColumn(error)) {
          return NextResponse.json(
            { error: '账号体系 v2 的数据库迁移未执行，请先运行 supabase/migrations/2026-10-12-batch6-account.sql' },
            { status: 409 }
          );
        }
        throw new Error(`更新失败: ${error.message}`);
      }

      return NextResponse.json({ success: true });

    } else if (action === 'delete_user') {
      // 软删除：停用 + 打 deleted_at，数据还在，可恢复
      const denied = await requireAdminPassword(request, body);
      if (denied) return denied;

      const { userId, confirm } = body;
      if (!isPositiveInt(userId)) return badRequest('缺少用户ID');

      const { data: user, error: readErr } = await client
        .from('app_users')
        .select('id, nickname, role')
        .eq('id', userId)
        .maybeSingle();
      if (readErr) throw new Error(`查询失败: ${readErr.message}`);
      if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      // 必须手打昵称才能删：防"看错行点错按钮"
      if (typeof confirm !== 'string' || confirm.trim() !== user.nickname) {
        return badRequest('确认信息不匹配：请输入该用户的完整昵称');
      }

      // deleted_at 是 batch6 迁移新加的列。没跑迁移时降级成"只停用"，
      // 保证管理员在任何状态下都能先把人停掉，不至于点了删除没反应。
      let deleted = false;
      const full = await client
        .from('app_users')
        .update({ is_active: false, deleted_at: new Date().toISOString() })
        .eq('id', userId);
      if (full.error && isMissingColumn(full.error)) {
        const fallback = await client.from('app_users').update({ is_active: false }).eq('id', userId);
        if (fallback.error) throw new Error(`删除失败: ${fallback.error.message}`);
      } else if (full.error) {
        throw new Error(`删除失败: ${full.error.message}`);
      } else {
        deleted = true;
      }

      await client.from('access_logs').insert({
        user_id: userId,
        action: 'admin_delete_user',
        detail: `管理员删除用户 ${user.nickname}（原角色: ${user.role}${deleted ? '，软删除' : '，仅停用（迁移未执行）'}）`,
        ip_address: getClientIp(request),
      });
      return NextResponse.json({ success: true, softDeleted: deleted });

    } else if (action === 'purge_user') {
      // 永久清除：连子表记录一起抹掉，不可恢复
      const denied = await requireAdminPassword(request, body);
      if (denied) return denied;

      const { userId, confirm } = body;
      if (!isPositiveInt(userId)) return badRequest('缺少用户ID');

      const { data: user, error: readErr } = await client
        .from('app_users')
        .select('id, nickname, role')
        .eq('id', userId)
        .maybeSingle();
      if (readErr) throw new Error(`查询失败: ${readErr.message}`);
      if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      if (typeof confirm !== 'string' || confirm.trim() !== user.nickname) {
        return badRequest('确认信息不匹配：请输入该用户的完整昵称');
      }

      // 外键没有级联，必须自己按"先子后主"的顺序清
      // 审计日志要在删人之前写（access_logs.user_id 有外键，人没了就写不进去）
      await client.from('access_logs').insert({
        user_id: userId,
        action: 'admin_purge_user',
        detail: `管理员永久清除用户 ${user.nickname}（原角色: ${user.role}）`,
        ip_address: getClientIp(request),
      });
      for (const table of ['ai_usage_logs', 'ai_credit_logs', 'access_logs', 'verification_codes']) {
        const { error } = await client.from(table).delete().eq('user_id', userId);
        // 表还不存在（迁移未执行 / 老环境）就跳过，不阻断主流程
        if (error && error.code !== '42P01' && error.code !== 'PGRST205' && !error.message?.includes('does not exist')) {
          throw new Error(`清理 ${table} 失败: ${error.message}`);
        }
      }
      const { error } = await client.from('app_users').delete().eq('id', userId);
      if (error) throw new Error(`永久清除失败: ${error.message}`);

      return NextResponse.json({ success: true });

    } else if (action === 'restore_user') {
      // 恢复被软删除的账号
      const denied = await requireAdminPassword(request, body);
      if (denied) return denied;

      const { userId } = body;
      if (!isPositiveInt(userId)) return badRequest('缺少用户ID');

      const full = await client
        .from('app_users')
        .update({ is_active: true, deleted_at: null })
        .eq('id', userId);
      if (full.error && isMissingColumn(full.error)) {
        const fallback = await client.from('app_users').update({ is_active: true }).eq('id', userId);
        if (fallback.error) throw new Error(`恢复失败: ${fallback.error.message}`);
      } else if (full.error) {
        throw new Error(`恢复失败: ${full.error.message}`);
      }

      await client.from('access_logs').insert({
        user_id: userId,
        action: 'admin_restore_user',
        detail: '管理员恢复用户',
        ip_address: getClientIp(request),
      });
      return NextResponse.json({ success: true });

    } else if (action === 'reset_password') {
      // 重置密码：生成一次性临时密码，并把 token_version +1 强制所有设备下线
      const denied = await requireAdminPassword(request, body);
      if (denied) return denied;

      const { userId } = body;
      if (!isPositiveInt(userId)) return badRequest('缺少用户ID');

      // token_version 是 batch6 的新列，缺列时退回只查基础字段
      let query = await client
        .from('app_users')
        .select('id, nickname, token_version')
        .eq('id', userId)
        .maybeSingle();
      if (query.error && isMissingColumn(query.error)) {
        query = await client
          .from('app_users')
          .select('id, nickname')
          .eq('id', userId)
          .maybeSingle();
      }
      if (query.error) throw new Error(`查询失败: ${query.error.message}`);
      const user = query.data as { id: number; nickname: string; token_version?: number | null } | null;
      if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 404 });

      const tempPassword = randomCode(10);
      const hash = await bcrypt.hash(tempPassword, 10);
      // token_version / login_failed_count 是 batch6 迁移的新列；
      // 没跑迁移时只重置密码，不动这些列（前端会提示迁移未执行）
      const full = await client
        .from('app_users')
        .update({
          password_hash: hash,
          token_version: (user.token_version ?? 0) + 1,
          login_failed_count: 0,
          locked_until: null,
        })
        .eq('id', userId);
      if (full.error && isMissingColumn(full.error)) {
        const fallback = await client.from('app_users').update({ password_hash: hash }).eq('id', userId);
        if (fallback.error) throw new Error(`重置失败: ${fallback.error.message}`);
      } else if (full.error) {
        throw new Error(`重置失败: ${full.error.message}`);
      }

      await client.from('access_logs').insert({
        user_id: userId,
        action: 'admin_reset_password',
        detail: `管理员重置 ${user.nickname} 的密码，已强制其所有设备下线`,
        ip_address: getClientIp(request),
      });
      // 临时密码只在响应里回一次，不落库、不进日志
      return NextResponse.json({ success: true, tempPassword });

    } else if (action === 'delete_invite') {
      const { inviteId } = body;
      if (!isPositiveInt(inviteId)) {
        return badRequest('缺少邀请码ID');
      }

      const { error } = await client
        .from('invite_codes')
        .delete()
        .eq('id', inviteId);

      if (error) throw new Error(`删除失败: ${error.message}`);

      return NextResponse.json({ success: true });

    } else if (action === 'toggle_invite') {
      const { inviteId, isActive } = body;
      if (!isPositiveInt(inviteId)) {
        return badRequest('缺少邀请码ID');
      }
      if (typeof isActive !== 'boolean') {
        return badRequest('启用状态无效');
      }

      const { error } = await client
        .from('invite_codes')
        .update({ is_active: isActive })
        .eq('id', inviteId);

      if (error) throw new Error(`更新失败: ${error.message}`);

      return NextResponse.json({ success: true });

    } else if (action === 'adjust_credits') {
      const { userId, delta, reason } = body;
      if (!isPositiveInt(userId)) {
        return badRequest('缺少用户ID');
      }
      if (typeof delta !== 'number' || !Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 10000) {
        return badRequest('额度变动须为 ±10000 以内的非零整数');
      }
      if (typeof reason !== 'string' || reason.trim().length < 2 || reason.trim().length > 100) {
        return badRequest('调整原因必填，2–100 字');
      }

      const { data, error } = await client.rpc('admin_adjust_credits', {
        p_user_id: userId,
        p_delta: delta,
        p_reason: `admin:${reason.trim()}`,
      });

      if (error) {
        if (error.message.includes('insufficient')) return badRequest('调整后额度不能为负');
        throw new Error(`调整失败: ${error.message}`);
      }
      return NextResponse.json({ success: true, balance: data });

    } else if (action === 'set_setting') {
      const { key, value } = body;
      if (!(SETTING_KEYS as readonly string[]).includes(key as string)) {
        return badRequest('未知开关');
      }
      if (typeof value !== 'boolean') {
        return badRequest('开关值须为布尔');
      }

      const { error } = await client
        .from('app_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });

      if (error) throw new Error(`更新失败: ${error.message}`);
      return NextResponse.json({ success: true });

    // ================= 内容审核（batch7） =================

    } else if (action === 'get_ai_log_detail') {
      // 查看完整正文：必须留审计（谁看了谁的哪条），避免"管理员随便翻用户聊天"
      const { logId } = body;
      if (!isPositiveInt(logId)) return badRequest('缺少日志ID');

      const { data, error } = await client
        .from('ai_usage_logs')
        .select('id, user_id, module, created_at, prompt_text, response_text, risk_level, risk_score, risk_hits, risk_reason, content_purged')
        .eq('id', logId)
        .maybeSingle();
      if (error) throw new Error(`查询失败: ${error.message}`);
      if (!data) return NextResponse.json({ error: '记录不存在' }, { status: 404 });

      const row = data as { user_id?: number };
      if (row.user_id) {
        await client.from('access_logs').insert({
          user_id: row.user_id,
          action: 'admin_view_ai_content',
          detail: `管理员查看 AI 对话正文（日志 #${logId}）`,
          ip_address: getClientIp(request),
        });
      }
      return NextResponse.json({ success: true, data });

    } else if (action === 'review_ai_log') {
      const { logId, reviewed } = body;
      if (!isPositiveInt(logId)) return badRequest('缺少日志ID');
      if (typeof reviewed !== 'boolean') return badRequest('状态无效');

      const { error } = await client
        .from('ai_usage_logs')
        .update({ reviewed, reviewed_at: reviewed ? new Date().toISOString() : null })
        .eq('id', logId);
      if (error) throw new Error(`更新失败: ${error.message}`);
      return NextResponse.json({ success: true });

    } else if (action === 'warn_user') {
      // 给指定用户发一条站内通知（可要求强制确认）
      const { userId, title, message, requireAck } = body;
      if (!isPositiveInt(userId)) return badRequest('缺少用户ID');
      if (!isBoundedString(title, 120)) return badRequest('标题无效（1-120 字）');
      if (!isBoundedString(message, 1000)) return badRequest('内容无效（1-1000 字）');
      if (requireAck !== undefined && typeof requireAck !== 'boolean') return badRequest('参数无效');

      const res = await createNotification({
        userId,
        type: 'warning',
        severity: requireAck ? 'high' : 'medium',
        title: String(title).trim(),
        body: String(message).trim(),
        requireAck: requireAck === true,
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: `通知发送失败：${res.error ?? '未知'}（若提示表不存在，请先执行 batch7 迁移）` },
          { status: 409 }
        );
      }
      await client.from('access_logs').insert({
        user_id: userId,
        action: 'admin_warn_user',
        detail: `管理员发送通知：${String(title).trim()}`,
        ip_address: getClientIp(request),
      });
      return NextResponse.json({ success: true });

    } else if (action === 'delete_ai_log') {
      // 删除审核记录 = 销毁证据，需要管理员密码
      const denied = await requireAdminPassword(request, body);
      if (denied) return denied;

      const { logId } = body;
      if (!isPositiveInt(logId)) return badRequest('缺少日志ID');
      const { error } = await client.from('ai_usage_logs').delete().eq('id', logId);
      if (error) throw new Error(`删除失败: ${error.message}`);
      return NextResponse.json({ success: true });

    } else if (action === 'add_rule') {
      const { word, level, category } = body;
      if (!isBoundedString(word, 60)) return badRequest('关键词无效（1-60 字）');
      if (level !== undefined && level !== 'warn' && level !== 'high') return badRequest('等级无效');
      if (category !== undefined && category !== null && !isBoundedString(category, 30)) return badRequest('分类无效');

      const { error } = await client.from('moderation_rules').insert({
        word: String(word).trim(),
        level: level ?? 'warn',
        category: category ? String(category).trim() : null,
      });
      if (error) {
        if (isUniqueViolation(error)) return NextResponse.json({ error: '该关键词已存在' }, { status: 409 });
        throw new Error(`添加失败: ${error.message}`);
      }
      invalidateRuleCache();
      return NextResponse.json({ success: true });

    } else if (action === 'delete_rule') {
      const { ruleId } = body;
      if (!isPositiveInt(ruleId)) return badRequest('缺少规则ID');
      const { error } = await client.from('moderation_rules').delete().eq('id', ruleId);
      if (error) throw new Error(`删除失败: ${error.message}`);
      invalidateRuleCache();
      return NextResponse.json({ success: true });

    } else if (action === 'toggle_rule') {
      const { ruleId, enabled } = body;
      if (!isPositiveInt(ruleId)) return badRequest('缺少规则ID');
      if (typeof enabled !== 'boolean') return badRequest('状态无效');
      const { error } = await client.from('moderation_rules').update({ enabled }).eq('id', ruleId);
      if (error) throw new Error(`更新失败: ${error.message}`);
      invalidateRuleCache();
      return NextResponse.json({ success: true });

    } else if (action === 'purge_old_ai_logs') {
      // 抹掉过期正文（默认 30 天前），只留元数据
      const denied = await requireAdminPassword(request, body);
      if (denied) return denied;

      const days = typeof body.days === 'number' && body.days >= 1 && body.days <= 365 ? Math.floor(body.days) : 30;
      const { data, error } = await client.rpc('purge_old_ai_content', { days });
      if (error) throw new Error(`清理失败: ${error.message}`);
      return NextResponse.json({ success: true, affected: data ?? 0 });

    } else {
      return NextResponse.json({ error: '无效操作' }, { status: 400 });
    }

  } catch (err) {
    return serverError(err);
  }
}
