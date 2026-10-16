/**
 * 高级设置的形状校验（云端/本地值都可能是脏数据：非数组、字段缺失、类型错）。
 * 不合法一律回退默认值，防止 windows 页 stages.map / for-of 等处崩溃。纯函数，可单测。
 */

import { AGE_MAX, AGE_MIN } from '@/lib/default-age';

export interface LifeStage { id: string; label: string; range: [number, number]; }
export interface WeightItem { id: string; label: string; value: number; icon: string; }

function isFiniteNum(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function isLifeStage(v: unknown): v is LifeStage {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.label === 'string' &&
    Array.isArray(s.range) &&
    s.range.length === 2 &&
    isFiniteNum(s.range[0]) &&
    isFiniteNum(s.range[1]) &&
    s.range[0] >= AGE_MIN &&
    s.range[1] <= AGE_MAX &&
    s.range[0] <= s.range[1]
  );
}

/** 非空数组且每个元素都是合法人生阶段才采纳，否则回退 fallback */
export function sanitizeLifeStages<F>(value: unknown, fallback: F): LifeStage[] | F {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value.every(isLifeStage) ? (value as LifeStage[]) : fallback;
}

export function isWeightItem(v: unknown): v is WeightItem {
  if (!v || typeof v !== 'object') return false;
  const w = v as Record<string, unknown>;
  return (
    typeof w.id === 'string' &&
    typeof w.label === 'string' &&
    isFiniteNum(w.value) &&
    typeof w.icon === 'string'
  );
}

export function sanitizeWeights<F>(value: unknown, fallback: F): WeightItem[] | F {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value.every(isWeightItem) ? (value as WeightItem[]) : fallback;
}
