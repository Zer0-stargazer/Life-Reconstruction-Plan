import { describe, expect, it } from 'vitest';
import { parseAgeInput, AGE_MAX } from './default-age';

describe('parseAgeInput', () => {
  it('接受 0-100 的整数（0 合法）', () => {
    expect(parseAgeInput('0')).toBe(0);
    expect(parseAgeInput('35')).toBe(35);
    expect(parseAgeInput('100')).toBe(100);
    expect(AGE_MAX).toBe(100);
  });
  it('兼容历史 JSON 引号编码与空白', () => {
    expect(parseAgeInput('"40"')).toBe(40);
    expect(parseAgeInput(' 28 ')).toBe(28);
  });
  it('越界、空、小数、非数字一律 null', () => {
    for (const bad of ['', ' ', '101', '120', '-1', '3.5', 'abc', '12a', '1e2', 'NaN']) {
      expect(parseAgeInput(bad)).toBeNull();
    }
  });
});
