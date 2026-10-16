import { describe, it, expect } from 'vitest';
import {
  lifeCardNumber, countWindows, pickHighlights, buildLifeCardSvg, parseAgeRange, hash4, formatYmd,
  type CardWindowInput,
} from './life-card';

const W: CardWindowInput[] = [
  { id: 1, age: '18-20', title: '专业选择' },
  { id: 2, age: '25-27', title: '职业分水岭', lockForceScore: 2 },
  { id: 3, age: '26-30', title: '买房决策', lockForceScore: 4 },
  { id: 4, age: '26-40', title: '长期积累' },
  { id: 5, age: '28-29', title: '生育窗口', lockForceScore: 5 },
  { id: 6, age: '40+', title: '未来之事' },
  { id: 7, age: '26-31', title: '晋升节点', lockForceScore: 1 },
];

describe('life-card', () => {
  it('编号格式与稳定性', () => {
    const d = new Date(2026, 9, 15);
    const a = lifeCardNumber(d, 27, 5, 3);
    expect(a).toMatch(/^NO\.20261015-[0-9A-F]{4}$/);
    expect(lifeCardNumber(d, 27, 5, 3)).toBe(a);
    expect(lifeCardNumber(d, 28, 5, 3)).not.toBe(a);
    expect(hash4('x')).toHaveLength(4);
    expect(formatYmd(new Date(2026, 0, 5))).toBe('20260105');
  });

  it('年龄区间解析与 /me 一致', () => {
    expect(parseAgeRange('18-20')).toEqual({ start: 18, end: 20 });
    expect(parseAgeRange('40+')).toEqual({ start: 40, end: 200 });
    expect(parseAgeRange('30')).toEqual({ start: 30, end: 30 });
  });

  it('计数口径：开启 = open+urgent；即将关闭 = 剩余 ≤5 年且非 N+', () => {
    // 27 岁：2(25-27,0年)、3(26-30,3年)、4(26-40,13年 open)、5(28-29 未来)、7(26-31,4年) -> open 4, urgent 3
    expect(countWindows(27, W)).toEqual({ open: 4, urgent: 3 });
    // 45 岁：40+ 永远 open
    expect(countWindows(45, W)).toEqual({ open: 1, urgent: 0 });
  });

  it('三项重点：先正在做，再命运报告，再最紧急', () => {
    expect(pickHighlights({ age: 27, doingTitles: ['A', 'B', 'C', 'D'], windows: W })).toEqual(['A', 'B', 'C']);
    expect(pickHighlights({ age: 27, doingTitles: ['A'], destinyNextWindow: '下一窗', windows: W })).toEqual(['A', '下一窗', '职业分水岭']);
    // 无任何标记：剩余年数少者在前，同年按锁死力
    expect(pickHighlights({ age: 27, windows: W })).toEqual(['职业分水岭', '买房决策', '晋升节点']);
    // 去重
    expect(pickHighlights({ age: 27, doingTitles: ['职业分水岭'], windows: W })[0]).toBe('职业分水岭');
    expect(new Set(pickHighlights({ age: 27, doingTitles: ['职业分水岭'], windows: W })).size).toBe(3);
  });

  it('SVG 含必需元素、转义且不含昵称', () => {
    const svg = buildLifeCardSvg({
      age: 27, open: 4, urgent: 3,
      highlights: ['职业分水岭', '<script>', '买房决策'],
      date: new Date(2026, 9, 15), host: 'example.com',
    });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('width="1080"');
    expect(svg).toContain('height="1350"');
    expect(svg).toContain('#f7f3ea');
    expect(svg).toContain('人生沙盘');
    expect(svg).toContain('LIFE SANDBOX · 人生卡片');
    expect(svg).toContain('NO.20261015-');
    expect(svg).toContain('font-size="220"');
    expect(svg).toContain('正在开启');
    expect(svg).toContain('即将关闭');
    expect(svg).toContain('rotate(-6)');
    expect(svg).toContain('2026');
    expect(svg).toContain('10·15');
    expect(svg).toContain('example.com · 不是算命，是算概率');
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
    expect(svg).not.toMatch(/nickname|昵称|姓名/);
  });
});
