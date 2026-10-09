import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { SETTING_KEYS } from '@/lib/app-settings';
import { sessionFromRequest } from '@/lib/session';

// Developer password (stored as env var in production)
const DEV_PASSWORD = process.env.DEV_PASSWORD;

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

const isUniqueViolation = (error: { code?: string } | null) => error?.code === '23505';

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
      const { data, error } = await client
        .from('app_users')
        .select('id, nickname, avatar, role, is_active, invite_code_used, ai_credits, last_login_at, created_at')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw new Error(`查询失败: ${error.message}`);
      return NextResponse.json({ success: true, data });

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
      const userId = sessionFromRequest(request)?.userId ?? null;
      // 关键边界：DEV_PASSWORD 未配置时绝不能通过校验。
      // 否则 password 与 DEV_PASSWORD 同为 undefined，`undefined === undefined` 为真，
      // 任何人 POST {action:'verify', userId} 就能免密把自己升级成 developer。
      if (!DEV_PASSWORD) {
        return NextResponse.json({ error: '开发者后台未启用（未配置 DEV_PASSWORD）' }, { status: 503 });
      }
      // 防爆破：verify 是唯一不需要 token 的入口，必须限流，否则可离线/在线暴力猜密码
      const ip = getClientIp(request);
      const rl = await rateLimit(`admin-verify:${ip}`, 8, 5 * 60_000);
      if (!rl.ok) {
        return NextResponse.json({ error: `尝试过于频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
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
            // Save original role before upgrading
            if (userData.role !== 'developer') {
              await client
                .from('app_users')
                .update({ role: 'developer' })
                .eq('id', userId);

              // Log the role change
              await client.from('access_logs').insert({
                user_id: userId,
                action: 'become_developer',
                detail: `用户 ${userData.nickname} 进入开发者后台，自动升级为开发者（原角色: ${userData.role}）`,
              });

              userData.role = 'developer';
            }
            return NextResponse.json({ success: true, token: await issueDevToken(), user: userData });
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
      // Downgrade to premium (they earned premium via invite code)
      const { data: userData, error: userError } = await client
        .from('app_users')
        .select('id, nickname, role, invite_code_used')
        .eq('id', userId)
        .maybeSingle();

      if (userError || !userData) {
        return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      }

      // If they had used an invite code, revert to premium; otherwise normal
      const newRole = userData.invite_code_used ? 'premium' : 'normal';
      const { error: updateError } = await client
        .from('app_users')
        .update({ role: newRole })
        .eq('id', userId);

      if (updateError) throw new Error(`退出开发者模式失败: ${updateError.message}`);

      await client.from('access_logs').insert({
        user_id: userId,
        action: 'exit_developer',
        detail: `用户 ${userData.nickname} 退出开发者模式，角色变为 ${newRole}`,
      });

      return NextResponse.json({ success: true, newRole });
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

      const { data, error } = await client
        .from('invite_codes')
        .insert({
          code: code.trim(),
          label: label || null,
          max_uses: uses,
          ai_credits: credits ?? 0,
          created_by: 'developer',
          expires_at: expiresAtFromDays(days),
        })
        .select()
        .single();

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

      const expiresAt = expiresAtFromDays(days);
      for (let attempt = 0; attempt < 3; attempt++) {
        const rows = Array.from({ length: num }, () => ({
          code: `${codePrefix.toUpperCase()}-${randomCode(10)}`,
          label: `批量生成`,
          max_uses: uses,
          ai_credits: credits ?? 0,
          created_by: 'developer',
          expires_at: expiresAt,
        }));

        const { data, error } = await client
          .from('invite_codes')
          .insert(rows)
          .select();

        if (!error) return NextResponse.json({ success: true, data });
        if (!isUniqueViolation(error)) throw new Error(`批量创建失败: ${error.message}`);
      }
      return NextResponse.json({ error: '生成邀请码冲突，请重试' }, { status: 409 });

    } else if (action === 'update_user') {
      const { userId, role, isActive } = body;
      if (!isPositiveInt(userId)) {
        return badRequest('缺少用户ID');
      }
      if (role !== undefined && !(VALID_ROLES as readonly string[]).includes(role as string)) {
        return badRequest('无效角色');
      }
      if (isActive !== undefined && typeof isActive !== 'boolean') {
        return badRequest('启用状态无效');
      }

      const updates: Record<string, unknown> = {};
      if (role !== undefined) updates.role = role;
      if (isActive !== undefined) updates.is_active = isActive;

      if (Object.keys(updates).length === 0) {
        return badRequest('无更新内容');
      }

      const { error } = await client
        .from('app_users')
        .update(updates)
        .eq('id', userId);

      if (error) throw new Error(`更新失败: ${error.message}`);

      return NextResponse.json({ success: true });

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

    } else {
      return NextResponse.json({ error: '无效操作' }, { status: 400 });
    }

  } catch (err) {
    return serverError(err);
  }
}
