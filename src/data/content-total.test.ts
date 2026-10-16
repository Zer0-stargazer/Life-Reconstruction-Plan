import { describe, it, expect } from 'vitest';
import { CONTENT_COUNTS, CONTENT_TOTAL } from './content-total';
import { LAW_DIMENSIONS } from './laws';
import { luckNodes } from './luck-nodes';
import { HEALTH_ALL_ITEMS } from './health';

describe('content-total', () => {
  it('与真实数据条数一致', () => {
    expect(CONTENT_COUNTS.laws).toBe(LAW_DIMENSIONS.reduce((s, d) => s + d.items.length, 0));
    expect(CONTENT_COUNTS.luck).toBe(luckNodes.length);
    expect(CONTENT_COUNTS.health).toBe(HEALTH_ALL_ITEMS.length);
  });

  it('总数为 2,019', () => {
    expect(CONTENT_TOTAL).toBe(2019);
  });
});
