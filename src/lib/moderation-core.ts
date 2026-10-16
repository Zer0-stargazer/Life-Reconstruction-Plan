/**
 * 内容审核的纯逻辑层：不碰数据库、不 import 'server-only'，
 * 因此可以直接写单测（`src/lib/moderation.test.ts`）。
 *
 * 需要查词表 / 调 AI 的那部分在 `moderation.ts`（服务端）。
 */

export type RiskLevel = 'none' | 'low' | 'medium' | 'high';

export interface RiskHit {
  word: string;
  level: 'warn' | 'high';
  category: string | null;
}

export interface Rule {
  word: string;
  level: 'warn' | 'high';
  category: string | null;
}

/** 扫描文本：大小写不敏感，返回命中词、分数与等级 */
export function scanText(text: string, rules: Rule[]): { hits: RiskHit[]; score: number; level: RiskLevel } {
  if (!text || rules.length === 0) return { hits: [], score: 0, level: 'none' };
  const lower = text.toLowerCase();
  const hits: RiskHit[] = [];

  for (const rule of rules) {
    const word = rule.word.trim();
    if (!word) continue;
    let count = 0;
    let from = 0;
    while (true) {
      const idx = lower.indexOf(word.toLowerCase(), from);
      if (idx === -1) break;
      count++;
      from = idx + word.length;
    }
    if (count > 0) hits.push({ word, level: rule.level, category: rule.category });
  }

  if (hits.length === 0) return { hits: [], score: 0, level: 'none' };
  const hasHigh = hits.some(h => h.level === 'high');
  const score = hits.reduce((sum, h) => sum + (h.level === 'high' ? 10 : 4), 0);
  return { hits, score, level: hasHigh ? 'high' : 'medium' };
}

/** 等级排序：用于"取更严重的一方" */
export const RISK_ORDER: Record<RiskLevel, number> = { none: 0, low: 1, medium: 2, high: 3 };

/** 取两个等级里更严重的那个 */
export function maxLevel(a: RiskLevel, b: RiskLevel): RiskLevel {
  return RISK_ORDER[a] >= RISK_ORDER[b] ? a : b;
}
