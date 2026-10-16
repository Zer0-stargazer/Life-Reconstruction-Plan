import 'server-only';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { RiskHit, RiskLevel } from '@/lib/moderation';

/**
 * 用户通知 + 阶梯处置。
 *
 * 阶梯口径（可在后台"功能开关"里整体关停自动处置）：
 *   none / low  → 只留后台记录，不打扰用户
 *   medium      → 发站内通知（登录后铃铛可见，不阻断）
 *   high        → 发强制确认通知（必须点"我知道了"才能继续用）
 *   惯犯        → 近 7 天累计 3 次 high 或 5 次 medium，直接停用账号并告知原因
 */

export interface NotificationInput {
  userId: number;
  type?: 'system' | 'warning' | 'info';
  severity?: 'low' | 'medium' | 'high';
  title: string;
  body: string;
  relatedLogId?: number | null;
  requireAck?: boolean;
}

export async function createNotification(input: NotificationInput): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await getSupabaseClient().from('user_notifications').insert({
      user_id: input.userId,
      type: input.type ?? 'warning',
      severity: input.severity ?? 'medium',
      title: input.title.slice(0, 120),
      body: input.body,
      related_log_id: input.relatedLogId ?? null,
      require_ack: input.requireAck ?? false,
    });
    if (error) {
      // 表还没建（batch7 迁移未执行）时不能让主流程挂掉
      console.error('通知写入失败:', error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error('通知写入异常:', err instanceof Error ? err.message : err);
    return { ok: false, error: '通知写入异常' };
  }
}

/** 近 N 天该用户的各级别命中次数，用于判断惯犯 */
async function recentRiskCounts(userId: number, days: number): Promise<{ high: number; medium: number }> {
  try {
    const since = new Date(Date.now() - days * 86_400_000).toISOString();
    const { data, error } = await getSupabaseClient()
      .from('ai_usage_logs')
      .select('risk_level')
      .eq('user_id', userId)
      .gte('created_at', since);
    if (error) return { high: 0, medium: 0 };
    const rows = (data ?? []) as Array<{ risk_level?: string }>;
    return {
      high: rows.filter(r => r.risk_level === 'high').length,
      medium: rows.filter(r => r.risk_level === 'medium').length,
    };
  } catch {
    return { high: 0, medium: 0 };
  }
}

export interface EscalationResult {
  /** 实际采取的处置 */
  action: 'none' | 'warned' | 'ack_required' | 'disabled';
  notified: boolean;
}

/**
 * 按风险等级处置。返回结果写回 ai_usage_logs.action_taken。
 * autoAction=false 时只记录不处置（后台可关掉自动处置，改为纯人工审核）。
 */
export async function escalateRisk(input: {
  userId: number;
  logId: number | null;
  level: RiskLevel;
  hits: RiskHit[];
  autoAction: boolean;
}): Promise<EscalationResult> {
  const { userId, logId, level, hits } = input;

  if (!input.autoAction) return { action: 'none', notified: false };

  if (level === 'none' || level === 'low') return { action: 'none', notified: false };

  const hitWords = hits.map(h => h.word).slice(0, 5).join('、');

  if (level === 'medium') {
    const res = await createNotification({
      userId,
      type: 'warning',
      severity: 'medium',
      title: '内容提醒',
      body: `你最近的提问或 AI 回复触发了内容安全规则（命中：${hitWords || '规则匹配'}）。请避免使用违规内容，多次触发可能影响账号使用。`,
      relatedLogId: logId,
      requireAck: false,
    });
    return { action: res.ok ? 'warned' : 'none', notified: res.ok };
  }

  // high：先看是不是惯犯
  const counts = await recentRiskCounts(userId, 7);
  if (counts.high >= 3 || counts.medium >= 5) {
    await createNotification({
      userId,
      type: 'warning',
      severity: 'high',
      title: '账号已被暂停',
      body: `近期多次触发内容安全规则（7 天内高风险 ${counts.high} 次、中风险 ${counts.medium} 次），账号已暂停使用。如有疑问请联系管理员。`,
      relatedLogId: logId,
      requireAck: true,
    });
    try {
      await getSupabaseClient().from('app_users').update({ is_active: false }).eq('id', userId);
    } catch (err) {
      console.error('停用账号失败:', err instanceof Error ? err.message : err);
    }
    return { action: 'disabled', notified: true };
  }

  const res = await createNotification({
    userId,
    type: 'warning',
    severity: 'high',
    title: '严重违规警告',
    body: `你最近的提问或 AI 回复触发了高风险内容规则（命中：${hitWords || '规则匹配'}）。请立即停止，再犯将暂停账号。`,
    relatedLogId: logId,
    requireAck: true,
  });
  return { action: res.ok ? 'ack_required' : 'none', notified: res.ok };
}
