import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// Developer password (stored as env var in production)
const DEV_PASSWORD = process.env.DEV_PASSWORD;

// 会话令牌 = DEV_PASSWORD 的加盐哈希，避免明文密码出服务端/落 localStorage
function devSessionToken(): string {
  return createHash('sha256').update(`lrs-dev-session:${DEV_PASSWORD}`).digest('hex');
}

function verifyDevAuth(request: NextRequest): boolean {
  if (!DEV_PASSWORD) return false;
  const authHeader = request.headers.get('x-dev-token');
  if (!authHeader) return false;
  return authHeader === devSessionToken();
}

const VALID_ROLES = ['normal', 'premium', 'developer'] as const;

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
        .select('id, nickname, avatar, role, is_active, invite_code_used, last_login_at, created_at')
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
    const message = err instanceof Error ? err.message : '服务器错误';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/admin - Create invite code / update user / verify dev password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Verify dev password & auto-upgrade logged-in user to developer
    if (action === 'verify') {
      const { password, userId } = body;
      if (password === DEV_PASSWORD) {
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
      if (!userId) {
        return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
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
      const { code, label, maxUses, expiresInDays } = body;
      if (!code) {
        return NextResponse.json({ error: '请输入邀请码' }, { status: 400 });
      }

      const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
        : null;

      const { data, error } = await client
        .from('invite_codes')
        .insert({
          code,
          label: label || null,
          max_uses: maxUses || null,
          created_by: 'developer',
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('duplicate')) {
          return NextResponse.json({ error: '邀请码已存在' }, { status: 409 });
        }
        throw new Error(`创建失败: ${error.message}`);
      }

      return NextResponse.json({ success: true, data });

    } else if (action === 'batch_invite') {
      const { count, prefix, maxUses, expiresInDays } = body;
      const num = Math.min(count || 5, 50); // max 50 at a time
      const codes: string[] = [];

      for (let i = 0; i < num; i++) {
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        codes.push(`${prefix || 'LR'}-${randomPart}`);
      }

      const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
        : null;

      const rows = codes.map(code => ({
        code,
        label: `批量生成`,
        max_uses: maxUses || null,
        created_by: 'developer',
        expires_at: expiresAt,
      }));

      const { data, error } = await client
        .from('invite_codes')
        .insert(rows)
        .select();

      if (error) throw new Error(`批量创建失败: ${error.message}`);

      return NextResponse.json({ success: true, data });

    } else if (action === 'update_user') {
      const { userId, role, isActive } = body;
      if (!userId) {
        return NextResponse.json({ error: '缺少用户ID' }, { status: 400 });
      }
      if (role !== undefined && !(VALID_ROLES as readonly string[]).includes(role)) {
        return NextResponse.json({ error: `无效角色: ${role}` }, { status: 400 });
      }

      const updates: Record<string, unknown> = {};
      if (role !== undefined) updates.role = role;
      if (isActive !== undefined) updates.is_active = isActive;

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: '无更新内容' }, { status: 400 });
      }

      const { error } = await client
        .from('app_users')
        .update(updates)
        .eq('id', userId);

      if (error) throw new Error(`更新失败: ${error.message}`);

      return NextResponse.json({ success: true });

    } else if (action === 'delete_invite') {
      const { inviteId } = body;
      if (!inviteId) {
        return NextResponse.json({ error: '缺少邀请码ID' }, { status: 400 });
      }

      const { error } = await client
        .from('invite_codes')
        .delete()
        .eq('id', inviteId);

      if (error) throw new Error(`删除失败: ${error.message}`);

      return NextResponse.json({ success: true });

    } else if (action === 'toggle_invite') {
      const { inviteId, isActive } = body;
      if (!inviteId) {
        return NextResponse.json({ error: '缺少邀请码ID' }, { status: 400 });
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
    const message = err instanceof Error ? err.message : '服务器错误';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
