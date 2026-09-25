import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/invite/redeem - User redeems an invite code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, code } = body;

    if (!userId || !code) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    const client = getSupabaseClient();

    // Check invite code
    const { data: invite, error } = await client
      .from('invite_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw new Error(`查询失败: ${error.message}`);
    if (!invite) {
      return NextResponse.json({ error: '邀请码无效' }, { status: 404 });
    }

    // Check expiry
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: '邀请码已过期' }, { status: 400 });
    }

    // Check usage limit
    if (invite.max_uses !== null && invite.used_count >= invite.max_uses) {
      return NextResponse.json({ error: '邀请码已被用完' }, { status: 400 });
    }

    // Check if user already premium/developer
    const { data: user, error: userError } = await client
      .from('app_users')
      .select('id, role, nickname')
      .eq('id', userId)
      .maybeSingle();

    if (userError) throw new Error(`查询用户失败: ${userError.message}`);
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }
    if (user.role === 'premium' || user.role === 'developer') {
      return NextResponse.json({ error: '您已是充电用户' }, { status: 400 });
    }

    // Update user role
    const { error: updateError } = await client
      .from('app_users')
      .update({ role: 'premium', invite_code_used: code })
      .eq('id', userId);

    if (updateError) throw new Error(`升级失败: ${updateError.message}`);

    // Increment used_count
    const { error: incError } = await client
      .from('invite_codes')
      .update({ used_count: invite.used_count + 1 })
      .eq('id', invite.id);

    if (incError) throw new Error(`更新邀请码失败: ${incError.message}`);

    // Log access
    await client.from('access_logs').insert({
      user_id: userId,
      action: 'redeem_code',
      detail: `用户 ${user.nickname} 使用邀请码 ${code} 升级为充电用户`,
    });

    return NextResponse.json({ success: true, role: 'premium' });

  } catch (err) {
    const message = err instanceof Error ? err.message : '服务器错误';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
