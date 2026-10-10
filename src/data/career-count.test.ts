import { describe, it, expect } from 'vitest';
import { careers } from './careers';
import { CAREER_COUNT } from './career-count';

describe('career-count', () => {
  it('CAREER_COUNT 与 careers.length 一致', () => {
    expect(CAREER_COUNT).toBe(careers.length);
  });

  it('职业 id 唯一、名称唯一（资源按名称索引，重名会互相覆盖）', () => {
    expect(new Set(careers.map((c) => c.id)).size).toBe(careers.length);
    expect(new Set(careers.map((c) => c.name)).size).toBe(careers.length);
  });
});
