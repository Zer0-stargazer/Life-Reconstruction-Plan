'use client';

import { useState, useEffect } from 'react';

export interface LifeStage { id: string; label: string; range: [number, number]; }
export interface WeightItem { id: string; label: string; value: number; icon: string; }

const DEFAULT_STAGES: LifeStage[] = [
  { id: 'childhood', label: '童年', range: [0, 12] },
  { id: 'teen', label: '青少年', range: [13, 18] },
  { id: 'young-adult', label: '青年起步', range: [19, 25] },
  { id: 'adult', label: '壮年奋斗', range: [26, 35] },
  { id: 'midlife', label: '中年深耕', range: [36, 50] },
  { id: 'mature', label: '成熟收获', range: [51, 65] },
  { id: 'elder', label: '晚年', range: [66, 100] },
];

const DEFAULT_WEIGHTS: WeightItem[] = [
  { id: 'health', label: '健康', value: 50, icon: '❤️' },
  { id: 'wealth', label: '财富', value: 50, icon: '💰' },
  { id: 'career', label: '事业', value: 50, icon: '📈' },
  { id: 'relationship', label: '关系', value: 50, icon: '👥' },
  { id: 'growth', label: '成长', value: 50, icon: '📚' },
  { id: 'freedom', label: '自由', value: 50, icon: '🕊️' },
];

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

export function useAdvancedSettings() {
  const [defaultAge, setDefaultAge] = useState(25);
  const [stages, setStages] = useState<LifeStage[]>(DEFAULT_STAGES);
  const [weights, setWeights] = useState<WeightItem[]>(DEFAULT_WEIGHTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDefaultAge(loadJSON('default-age', 25));
    setStages(loadJSON('life-stages', DEFAULT_STAGES));
    setWeights(loadJSON('preference-weights', DEFAULT_WEIGHTS));
    setLoaded(true);
  }, []);

  /** 根据年龄获取人生阶段标签 */
  const getStageLabel = (age: number): string => {
    for (const s of stages) {
      if (age >= s.range[0] && age <= s.range[1]) return s.label;
    }
    return '未知';
  };

  /** 获取权重归一化对象（0-1） */
  const weightMap = loaded
    ? Object.fromEntries(weights.map(w => [w.id, w.value / 100]))
    : Object.fromEntries(DEFAULT_WEIGHTS.map(w => [w.id, w.value / 100]));

  return { defaultAge, stages, weights, weightMap, getStageLabel, loaded };
}
