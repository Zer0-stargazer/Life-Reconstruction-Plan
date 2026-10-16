import 'server-only';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { scanText, maxLevel, type RiskHit, type RiskLevel, type Rule } from '@/lib/moderation-core';

export type { RiskHit, RiskLevel, Rule } from '@/lib/moderation-core';
export { scanText } from '@/lib/moderation-core';

/**
 * 内容审核：关键词规则快速筛选 → 命中才送 AI 复核 → 定级。
 *
 * 为什么分两步：
 *   只靠词表会误报（正常讨论被误判），也接不住变体绕过；
 *   每条都过 AI 则每次多花一份 token 钱、多加 1-3 秒延迟。
 *   所以词表当"筛子"（零成本毫秒级），AI 只判那些已经被筛出来的。
 */

// 词表 60 秒缓存：每次对话都查库太浪费，管理员改词表后一分钟生效
let cache: { at: number; rules: Rule[] } | null = null;
const CACHE_TTL_MS = 60_000;

export interface ModerationResult {
  level: RiskLevel;
  score: number;
  hits: RiskHit[];
  reason: string | null;
  /** 词表判定结果（AI 复核可能上调或下调） */
  ruleLevel: RiskLevel;
  aiReviewed: boolean;
}

export async function getRules(): Promise<Rule[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.rules;
  try {
    const { data, error } = await getSupabaseClient()
      .from('moderation_rules')
      .select('word, level, category')
      .eq('enabled', true);
    if (error) throw new Error(error.message);
    const rules = (data ?? []).map(r => ({
      word: String(r.word),
      level: (r.level === 'high' ? 'high' : 'warn') as 'warn' | 'high',
      category: r.category ? String(r.category) : null,
    }));
    cache = { at: Date.now(), rules };
    return rules;
  } catch (err) {
    console.error('违规词表加载失败，本次按空表处理:', err instanceof Error ? err.message : err);
    return cache?.rules ?? [];
  }
}

export function invalidateRuleCache() {
  cache = null;
}

/**
 * AI 复核：把命中的片段交给模型判断是不是真违规。
 * 未配置 AI 或调用失败时返回 null（不阻断，按词表结果处理）。
 */
export async function reviewWithAi(input: {
  prompt: string;
  response: string;
  hits: RiskHit[];
}): Promise<{ violation: boolean; level: RiskLevel; reason: string } | null> {
  const url = process.env.AI_API_URL;
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!url || !key || !model) return null;

  const excerpt = [
    `用户提问：${input.prompt.slice(0, 800)}`,
    `AI 回复：${input.response.slice(0, 1200)}`,
    `命中关键词：${input.hits.map(h => h.word).join('、')}`,
  ].join('\n');

  const system = [
    '你是内容安全复核员。只判断"是否存在违规或不良内容"，不要扩写、不要评价观点对错。',
    '违规指：色情低俗、暴力恐怖、诈骗引流、人身攻击辱骂、违法违禁品交易。',
    '正常的人生规划、职业、健康、情感讨论不算违规，哪怕出现敏感词也可能是误报。',
    '只输出一行 JSON：{"violation":true|false,"level":"none|low|medium|high","reason":"20字以内理由"}',
  ].join('');

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: excerpt },
        ],
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = json.choices?.[0]?.message?.content ?? '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as { violation?: boolean; level?: string; reason?: string };
    const level = (['none', 'low', 'medium', 'high'] as const).includes(parsed.level as RiskLevel)
      ? (parsed.level as RiskLevel)
      : 'low';
    return {
      violation: parsed.violation === true,
      level,
      reason: typeof parsed.reason === 'string' ? parsed.reason.slice(0, 100) : '',
    };
  } catch {
    return null;
  }
}

/** 完整审核流程：词表 → AI 复核 → 定级 */
export async function moderate(prompt: string, response: string): Promise<ModerationResult> {
  const rules = await getRules();
  const text = `${prompt}\n${response}`;
  const scanned = scanText(text, rules);
  const ruleLevel = scanned.level;

  if (ruleLevel === 'none') {
    return { level: 'none', score: 0, hits: [], reason: null, ruleLevel: 'none', aiReviewed: false };
  }

  const ai = await reviewWithAi({ prompt, response, hits: scanned.hits });
  if (!ai) {
    // AI 不可用：按词表结果处理，宁可留痕给人工看，也不静默放过
    return { level: ruleLevel, score: scanned.score, hits: scanned.hits, reason: null, ruleLevel, aiReviewed: false };
  }

  if (!ai.violation) {
    // 词表命中但 AI 判定无违规：降级为 low（留痕、不打扰用户），等人工复核
    return {
      level: 'low',
      score: scanned.score,
      hits: scanned.hits,
      reason: ai.reason || 'AI 复核判定为正常内容',
      ruleLevel,
      aiReviewed: true,
    };
  }

  const finalLevel = maxLevel(ai.level, ruleLevel);
  return {
    level: finalLevel,
    score: scanned.score,
    hits: scanned.hits,
    reason: ai.reason || null,
    ruleLevel,
    aiReviewed: true,
  };
}
