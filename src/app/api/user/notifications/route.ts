import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { sessionFromRequestVerified } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';

/**
 * 用户通知：
 *   GET  → 拉取自己的通知（默认只回未读 + 需要强制确认的）
 *   POST → 标记已读 / 确认（ack）
 *
 * 只认服务端会话里的 userId，绝不信任请求体自报的身份，
 * 否则任何人都能读别人的警告、也能把自己的违规标记成"已知晓"。
 */

export async function GET(request: NextRequest) {
  const session = await sessionFromRequestVerified(request);
  if (!session) {
    return NextResponse.json({ success: false, error: '登录态无效或已过期' }, { status: 401 });
  }

  const rl = await rateLimit(`notify-read:${session.userId}`, 60, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ success: false, error: `请求过于频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('user_notifications')
      .select('id, type, severity, title, body, require_ack, created_at, read_at, acked_at')
      .eq('user_id', session.userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      // batch7 迁移未执行时表不存在：不该让用户侧弹红字报错
      if (isMissingTable(error)) return NextResponse.json({ success: true, items: [], unavailable: true });
      throw new Error(error.message);
    }

    const items = (data ?? []) as Array<Record<string, unknown>>;
    const pending = items.filter(i => !i.read_at);
    // 需要强制确认的：还没 ack 过的
    const mustAck = pending.filter(i => i.require_ack && !i.acked_at);
    return NextResponse.json({ success: true, items, pendingCount: pending.length, mustAck });
  } catch (err) {
    console.error('通知查询失败:', err);
    return NextResponse.json({ success: false, error: '服务器错误，请稍后重试' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await sessionFromRequestVerified(request);
  if (!session) {
    return NextResponse.json({ success: false, error: '登录态无效或已过期' }, { status: 401 });
  }

  const rl = await rateLimit(`notify-write:${session.userId}`, 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ success: false, error: `操作过于频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
  }

  try {
    const body = (await request.json()) as { action?: string; id?: number; all?: boolean };
    const client = getSupabaseClient();
    const now = new Date().toISOString();

    if (body.action === 'ack') {
      // 确认某条（或全部）需要强制确认的通知
      let query = client
        .from('user_notifications')
        .update({ acked_at: now, read_at: now })
        .eq('user_id', session.userId);
      if (body.all === true) {
        query = query.eq('require_ack', true).is('acked_at', null);
      } else {
        if (typeof body.id !== 'number' || !Number.isInteger(body.id) || body.id < 1) {
          return NextResponse.json({ success: false, error: '缺少通知ID' }, { status: 400 });
        }
        query = query.eq('id', body.id);
      }
      const { error } = await query;
      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'read') {
      let query = client
        .from('user_notifications')
        .update({ read_at: now })
        .eq('user_id', session.userId)
        .is('read_at', null);
      if (body.all !== true) {
        if (typeof body.id !== 'number' || !Number.isInteger(body.id) || body.id < 1) {
          return NextResponse.json({ success: false, error: '缺少通知ID' }, { status: 400 });
        }
        query = client.from('user_notifications').update({ read_at: now }).eq('id', body.id).eq('user_id', session.userId);
      }
      const { error } = await query;
      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: '无效操作' }, { status: 400 });
  } catch (err) {
    console.error('通知更新失败:', err);
    return NextResponse.json({ success: false, error: '服务器错误，请稍后重试' }, { status: 500 });
  }
}

/** 表不存在（迁移未执行）的两种表现都认：Postgres 42P01 / PostgREST 的 schema cache 文案 */
function isMissingTable(error: { code?: string; message?: string }): boolean {
  if (error.code === '42P01' || error.code === 'PGRST205') return true;
  const msg = error.message ?? '';
  return /does not exist/i.test(msg) || /could not find the table/i.test(msg);
}
