import { describe, it, expect } from 'vitest';
import { scanText, maxLevel, type Rule } from './moderation-core';

const RULES: Rule[] = [
  { word: '加微信', level: 'warn', category: '引流' },
  { word: '刷单', level: 'warn', category: '诈骗' },
  { word: '违禁品', level: 'high', category: '违法' },
];

describe('内容审核 · 词表扫描', () => {
  it('正常内容不命中', () => {
    const r = scanText('我想转行做产品经理，该怎么准备？', RULES);
    expect(r.level).toBe('none');
    expect(r.hits).toHaveLength(0);
    expect(r.score).toBe(0);
  });

  it('命中中风险词 → medium', () => {
    const r = scanText('有兴趣的加微信详聊', RULES);
    expect(r.level).toBe('medium');
    expect(r.hits.map(h => h.word)).toContain('加微信');
    expect(r.score).toBe(4);
  });

  it('命中高风险词 → high（高风险优先）', () => {
    const r = scanText('加微信，我这里有违禁品', RULES);
    expect(r.level).toBe('high');
    expect(r.hits).toHaveLength(2);
    expect(r.score).toBe(14); // 4 + 10
  });

  it('大小写不敏感', () => {
    // 英文场景：词表若含英文词，大写也应命中
    const rules: Rule[] = [{ word: 'Spam', level: 'warn', category: null }];
    expect(scanText('this is SPAM content', rules).level).toBe('medium');
  });

  it('空文本或空词表直接放行', () => {
    expect(scanText('', RULES).level).toBe('none');
    expect(scanText('加微信', []).level).toBe('none');
  });

  it('停用词不会命中（词表已按 enabled 过滤，这里验证过滤后行为）', () => {
    const active = RULES.filter(r => r.word !== '刷单');
    expect(scanText('刷单兼职', active).level).toBe('none');
  });
});

describe('内容审核 · 等级取严重方', () => {
  it('取更严重的等级', () => {
    expect(maxLevel('low', 'high')).toBe('high');
    expect(maxLevel('high', 'medium')).toBe('high');
    expect(maxLevel('none', 'medium')).toBe('medium');
    expect(maxLevel('medium', 'medium')).toBe('medium');
  });
});
