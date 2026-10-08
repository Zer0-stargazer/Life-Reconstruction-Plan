import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

// Developer password (stored as env var in production)
const DEV_PASSWORD = process.env.DEV_PASSWORD;

const sha256 = (value: string) => createHash('sha256').update(value).digest();

/** 常量时间比较：先各自 sha256 保证等长，再 timingSafeEqual */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

// 会话令牌 = DEV_PASSWORD + UTC 日期桶的加盐哈希，避免明文密码出服务端/落 localStorage。
// 令牌按天轮换：verify 签发今天的桶，校验接受今天与昨天两个桶——
// 等效 24-48h 有效期，跨零点不会立刻失效；过期后 GET 返回 401，
// 由 /admin 页回退到重新验证界面（配合 2026-10-02 的错误处理修复）。
function devSessionToken(dayOffset = 0): string {
  const day = new Date(Date.now() - dayOffset * 86_400_000).toISOString().slice(0, 10);
  return createHash('sha256').update(`lrs-dev-session:${DEV_PASSWORD}:${day}`).digest('hex');
}

function verifyDevAuth(request: NextRequest): boolean {
  if (!DEV_PASSWORD) return false;
  const authHeader = request.headers.get('x-dev-token');
  if (!authHeader) return false;
  const matchToday = safeEqual(authHeader, devSessionToken(0));
  const matchYesterday = safeEqual(authHeader, devSessionToken(1));
  return matchToday || matchYesterday;
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
  if (v === undefined || v === null) return null;
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
  if (!verifyDevAuth(request)) {
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
      const { password, userId } = body;
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
      if (userId !== undefined && userId !== null && !isPositiveInt(userId)) {
        return badRequest('用户ID无效');
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
            return NextResponse.json({ success: true, token: devSessionToken(), user: userData });
          }
        }
        return NextResponse.json({ success: true, token: devSessionToken() });
      }
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    // Exit developer mode - downgrade back to premium
    // 必须携带 x-dev-token：否则任何人可传 userId 把任意用户降级
    if (action === 'exit_developer') {
      if (!verifyDevAuth(request)) {
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
    if (!verifyDevAuth(request)) {
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
      const uses = maxUses === undefined || maxUses === null ? null : maxUses;
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
      const num = count === undefined || count === null ? 5 : count;
      if (!isPositiveInt(num, MAX_BATCH)) {
        return badRequest(`数量需为 1–${MAX_BATCH} 的整数`);
      }
      const codePrefix = prefix === undefined || prefix === null || prefix === '' ? 'LR' : prefix;
      if (typeof codePrefix !== 'string' || !/^[A-Za-z0-9]{1,10}$/.test(codePrefix)) {
        return badRequest('前缀只能是 1–10 位字母或数字');
      }
      const uses = maxUses === undefined || maxUses === null ? null : maxUses;
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

    } else {
      return NextResponse.json({ error: '无效操作' }, { status: 400 });
    }

  } catch (err) {
    return serverError(err);
  }
}
