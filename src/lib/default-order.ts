/**
 * 默认排序口径（全站统一）
 *
 * 原则一句话：**打开任何一个列表，前面几条必须是"最要紧的"，
 * 而不是数据文件里恰好排在前面的。**
 *
 * 之前各页各排各的——甚至有两个页面根本没排序，直接吐原始数据顺序
 * （数据顺序是作者录入顺序，对用户没有任何意义）。现在收在这里：
 *
 * | 页面 | 默认口径 | 表达的是什么 |
 * |---|---|---|
 * | `/windows` | 锁死力 → 补救代价 | 错过最贵的在最前 |
 * | `/luck` | \|期望影响\| | 影响最大的在最前 |
 * | `/career` | 趋势上升 → AI 风险高 → 年薪高 | 最值得看/最该警惕的在最前 |
 * | `/me` | 剩余年数（急的在前） | 快关上的在最前 |
 * | `/laws` | 致命程度 → 突破难度 | 先救命再看代价 |
 *
 * `/me` `/laws` 的排序本身就是"要紧程度"的表达，保持各自口径不搬到这里。
 * 用户一旦手动选了排序，一律以用户选择为准（这里只管默认值）。
 */

import type { LifeWindow, RemedyLevel } from '@/data/windows';
import type { LuckNode } from '@/data/luck-nodes';

/** 补救代价的严重度序（用于同锁死力时的次级排序） */
const REMEDY_SEVERITY: Record<RemedyLevel, number> = {
  irreversible: 5,
  extreme: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/** 人生窗口：错过代价最大的在前（锁死力 → 补救代价 → 数据顺序兜底） */
export function byWindowSeverity(a: LifeWindow, b: LifeWindow): number {
  return (
    (b.lockForceScore ?? 0) - (a.lockForceScore ?? 0) ||
    REMEDY_SEVERITY[b.remedyLevel] - REMEDY_SEVERITY[a.remedyLevel] ||
    a.id - b.id
  );
}

/** 运气节点：期望影响（强度 × 概率）绝对值最大的在前 */
export function byLuckSeverity(a: LuckNode, b: LuckNode): number {
  const ea = Math.abs(a.impact * a.probability);
  const eb = Math.abs(b.impact * b.probability);
  return eb - ea || a.id - b.id;
}
