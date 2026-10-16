import { describe, expect, it } from 'vitest';
import { sanitizeLifeStages, sanitizeWeights } from './settings-shape';

const FALLBACK_STAGES = [{ id: 'x', label: '默认', range: [0, 100] as [number, number] }];
const FALLBACK_WEIGHTS = [{ id: 'w', label: '默认', value: 50, icon: 'i' }];

describe('sanitizeLifeStages', () => {
  it('合法数组原样采纳', () => {
    const ok = [
      { id: 'a', label: 'A', range: [0, 12] },
      { id: 'b', label: 'B', range: [13, 100] },
    ];
    expect(sanitizeLifeStages(ok, FALLBACK_STAGES)).toBe(ok);
  });
  it('非数组 / 空数组 / null 回退', () => {
    for (const bad of [null, undefined, {}, 'str', 5, []]) {
      expect(sanitizeLifeStages(bad, FALLBACK_STAGES)).toBe(FALLBACK_STAGES);
    }
  });
  it('元素结构不对回退', () => {
    const bads: unknown[] = [
      [{ id: 'a', label: 'A' }],
      [{ id: 'a', label: 'A', range: 'x' }],
      [{ id: 'a', label: 'A', range: [1] }],
      [{ id: 'a', label: 'A', range: ['1', '2'] }],
      [{ id: 'a', label: 'A', range: [30, 10] }],
      [{ id: 'a', label: 'A', range: [0, 120] }],
      [null],
      [{ id: 1, label: 'A', range: [0, 1] }],
    ];
    for (const bad of bads) expect(sanitizeLifeStages(bad, FALLBACK_STAGES)).toBe(FALLBACK_STAGES);
  });
});

describe('sanitizeWeights', () => {
  it('合法采纳，非法回退', () => {
    const ok = [{ id: 'a', label: 'A', value: 10, icon: 'i' }];
    expect(sanitizeWeights(ok, FALLBACK_WEIGHTS)).toBe(ok);
    expect(sanitizeWeights({}, FALLBACK_WEIGHTS)).toBe(FALLBACK_WEIGHTS);
    expect(sanitizeWeights([{ id: 'a', label: 'A', value: 'x', icon: 'i' }], FALLBACK_WEIGHTS)).toBe(FALLBACK_WEIGHTS);
    expect(sanitizeWeights([{ id: 'a', label: 'A', value: NaN, icon: 'i' }], FALLBACK_WEIGHTS)).toBe(FALLBACK_WEIGHTS);
  });
});
