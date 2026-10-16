import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { sessionFromRequestVerified } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';

/**
 * 用户数据云同步（batch8）：
 *   GET  → 拉取自己全部同步键（key/value/updatedAt）
 *   POST → 上报一批键值，仅当客户端 updatedAt 新于服务端时才覆盖（last-write-wins）
 *
 * 安模型与 notifications 一致：只认服务端会话的 userId，绝不信任请求体自报身份。
 * 降级：batch8 迁移未执行（表不存在）时返回空集/静默成功，不弹错。
 */

/** 与 src/lib/user-state-sync.ts 的 SYNC_KEYS 保持一致（服务端白名单，防乱写任意键） */
const SYNC_KEYS = new Set([
  'default-age',
  'life-stages',
  'preference-weights',
  'visited-modules',
  'window-marks.v1',
  // P1-6 修复：AI Key / 激活源不进云同步（value 明文落库，改纯本地保留）
  // 各模块填写内容（batch 联动第一批补入云同步）
  'destiny.input.v1',
  'destiny.report.v1',
  'health.answers.v1',
  'sim.dimensions.v2',
  'sim.answers.v2',
  'name.style.v1',
  'name.gender.v1',
  'name.surname.v1',
  'career-marks.v1',
  'laws-favorites.v1',
  'luck-favorites.v1',
]);

const MAX_VALUE_BYTES = 64 * 1024; // 单键值上限 64KB（这些键都是小配置，远用不满）
const MAX_BATCH = 40;

function isMissingTable(error: { message?: string } | null): boolean {
  if (!error) return false;
  const msg = error.message ?? '';
  return msg.includes("Could not find the table") || msg.includes('does not exist') || msg.includes('schema cache');
}

interface IncomingState {
  key: string;
  value: unknown;
  updatedAt: string;
  /** true = 删除该键（如「重新选年龄」），value 忽略 */
  deleted?: boolean;
}

export async function GET(request: NextRequest) {
  const session = await sessionFromRequestVerified(request);
  if (!session) {
    return NextResponse.json({ success: false, error: '登录态无效或已过期' }, { status: 401 });
  }
  const rl = await rateLimit(`state-read:${session.userId}`, 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ success: false, error: `请求过于频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from('user_state')
      .select('key, value, updated_at')
      .eq('user_id', session.userId);

    if (error) {
      if (isMissingTable(error)) return NextResponse.json({ success: true, states: [], unavailable: true });
      throw new Error(error.message);
    }

    const states = (data ?? []).map(r => ({
      key: String(r.key),
      value: r.value,
      updatedAt: r.updated_at as string,
    }));
    return NextResponse.json({ success: true, states });
  } catch (err) {
    console.error('user/state GET 异常:', err);
    return NextResponse.json({ success: false, error: '服务器错误' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await sessionFromRequestVerified(request);
  if (!session) {
    return NextResponse.json({ success: false, error: '登录态无效或已过期' }, { status: 401 });
  }
  const rl = await rateLimit(`state-write:${session.userId}`, 30, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ success: false, error: `请求过于频繁，请 ${rl.retryAfter} 秒后再试` }, { status: 429 });
  }

  let body: { states?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: '请求格式错误' }, { status: 400 });
  }

  const incoming = Array.isArray(body.states) ? (body.states as IncomingState[]) : [];
  if (incoming.length === 0) {
    return NextResponse.json({ success: true, pushed: 0 });
  }
  if (incoming.length > MAX_BATCH) {
    return NextResponse.json({ success: false, error: '单次上报键数量超限' }, { status: 400 });
  }

  // 白名单 + 值大小校验（P1 修复：被丢弃的键回传 rejected，客户端不再盲记 meta）
  const valid: IncomingState[] = [];
  const deletions: IncomingState[] = [];
  const rejected: { key: string; reason: string }[] = [];
  for (const s of incoming) {
    if (!s || typeof s.key !== 'string' || !SYNC_KEYS.has(s.key)) {
      rejected.push({ key: String(s?.key ?? ''), reason: 'not_allowed' });
      continue;
    }
    if (typeof s.updatedAt !== 'string' || Number.isNaN(Date.parse(s.updatedAt))) {
      rejected.push({ key: s.key, reason: 'invalid_timestamp' });
      continue;
    }
    // 删除推送（P0 修复）：此前「重新选年龄」只清本地，云端旧值会在下次登录复活
    if (s.deleted === true) {
      deletions.push({ key: s.key, value: null, updatedAt: s.updatedAt });
      continue;
    }
    // 空值不入云（2026-10-13 修复）：user_state.value 为 NOT NULL，localStorage 存成 "null"
    // 的键（JSON.parse 后为 null）若放行会违反约束并拖垮整批 upsert；跳过即云端保留旧值，
    // 待客户端产生真值时再覆盖
    if (s.value === null || s.value === undefined) {
      rejected.push({ key: s.key, reason: 'empty_value' });
      continue;
    }
    const json = JSON.stringify(s.value ?? null);
    // P2-1 修复：按 UTF-8 字节数而非字符长度校验（中文 3 字节/字符，length 会漏判超限）
    if (new TextEncoder().encode(json).length > MAX_VALUE_BYTES) {
      rejected.push({ key: s.key, reason: 'oversize' }); // 超限键直接丢弃，不拖垮整批
      continue;
    }
    valid.push({ key: s.key, value: JSON.parse(json), updatedAt: s.updatedAt });
  }
  if (valid.length === 0 && deletions.length === 0) {
    return NextResponse.json({ success: true, pushed: 0, accepted: [], rejected });
  }

  try {
    const client = getSupabaseClient();

    // 取服务端现有 updated_at，用于冲突判定
    const keys = [...valid, ...deletions].map(s => s.key);
    const { data: existing, error: readErr } = await client
      .from('user_state')
      .select('key, updated_at')
      .eq('user_id', session.userId)
      .in('key', keys);

    if (readErr) {
      if (isMissingTable(readErr)) return NextResponse.json({ success: true, pushed: 0, unavailable: true });
      throw new Error(readErr.message);
    }

    const serverMap = new Map((existing ?? []).map(r => [String(r.key), new Date(r.updated_at as string).getTime()]));
    // P1 修复（last-write-wins 时钟偏差）：判序改用服务端接收时钟。
    // 客户端时钟不可信（手动改时间/时区错会让旧数据反超新数据），服务端按到达顺序
    // 写入即天然有序；仅当云端已有值"来自 5 分钟以上的未来"（另一设备新写，或旧协议
    // 时钟漂移产物）时才拒收本次写入，避免误覆盖
    const serverNow = Date.now();
    const FUTURE_DRIFT_MS = 5 * 60 * 1000;
    const toPush = valid
      .filter(s => {
        const serverTs = serverMap.get(s.key);
        return serverTs === undefined || serverTs - serverNow <= FUTURE_DRIFT_MS;
      })
      .map(s => ({ user_id: session.userId, key: s.key, value: s.value, updated_at: new Date(serverNow).toISOString() }));
    const stale = valid
      .filter(s => {
        const serverTs = serverMap.get(s.key);
        return serverTs !== undefined && serverTs - serverNow > FUTURE_DRIFT_MS;
      })
      .map(s => ({ key: s.key, reason: 'stale' }));

    // 删除同样遵守「云端来自远期未来则拒收」的判序
    const delOk = deletions.filter(s => {
      const serverTs = serverMap.get(s.key);
      return serverTs === undefined || serverTs - serverNow <= FUTURE_DRIFT_MS;
    });
    const delStale = deletions
      .filter(s => !delOk.includes(s))
      .map(s => ({ key: s.key, reason: 'stale' }));

    if (toPush.length === 0 && delOk.length === 0) {
      return NextResponse.json({ success: true, pushed: 0, accepted: [], rejected: [...rejected, ...stale, ...delStale] });
    }

    if (toPush.length > 0) {
      const { error: upsertErr } = await client
        .from('user_state')
        .upsert(toPush, { onConflict: 'user_id,key' });

      if (upsertErr) {
        if (isMissingTable(upsertErr)) return NextResponse.json({ success: true, pushed: 0, unavailable: true });
        throw new Error(upsertErr.message);
      }
    }

    if (delOk.length > 0) {
      const { error: delErr } = await client
        .from('user_state')
        .delete()
        .eq('user_id', session.userId)
        .in('key', delOk.map(s => s.key));

      if (delErr) {
        if (isMissingTable(delErr)) return NextResponse.json({ success: true, pushed: 0, unavailable: true });
        throw new Error(delErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      pushed: toPush.length + delOk.length,
      accepted: [...toPush.map(s => s.key), ...delOk.map(s => s.key)],
      rejected: [...rejected, ...stale, ...delStale],
    });
  } catch (err) {
    console.error('user/state POST 异常:', err);
    return NextResponse.json({ success: false, error: '服务器错误' }, { status: 500 });
  }
}
