import type { SVGProps } from 'react';

/**
 * 七模块 + 时间轴的自绘图标集。
 *
 * 统一规格：24 viewBox、单一线宽 1.25、圆头圆角、currentColor 描边。
 * 右下角一枚朱砂墨点（fill 取 --primary）作为全套共用的印记——
 * 图标不再是通用线框图标，而是这套手记的一部分。
 */

export type ModuleIconComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

const BASE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

/** 朱砂墨点：所有图标共用的右下角印记 */
function InkDot({ cx = 20.5, cy = 20.5, r = 1.35 }: { cx?: number; cy?: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} stroke="none" style={{ fill: 'var(--primary)' }} />;
}

/** 生成一个齿轮轮廓（直线段近似，24px 尺寸下足够干净） */
function gearPath(cx: number, cy: number, ro: number, ri: number, teeth: number) {
  const step = (Math.PI * 2) / teeth;
  const at = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  const parts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    parts.push(
      `${i === 0 ? 'M' : 'L'}${at(ri, a - step * 0.3)}`,
      `L${at(ro, a - step * 0.16)}`,
      `L${at(ro, a + step * 0.16)}`,
      `L${at(ri, a + step * 0.3)}`,
    );
  }
  return `${parts.join(' ')} Z`;
}

const GEAR_BIG = gearPath(9, 12.5, 6.4, 4.7, 8);
const GEAR_SMALL = gearPath(16.6, 6.6, 3.5, 2.5, 6);

/** 时间轴：表盘 + 时针分针 */
export function TimeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7.2V12l3.3 2" />
      <path d="M3.25 12h1.1M19.65 12h1.1" opacity="0.5" />
      <InkDot />
    </svg>
  );
}

/** 窗口：拱形窗棂，一扇门 */
export function WindowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M6 21V9.5a6 6 0 0 1 12 0V21Z" />
      <path d="M12 3.5V21M6 13.5h12" />
      <InkDot />
    </svg>
  );
}

/** 名字：一支蘸墨的毛笔 */
export function NameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M14.5 10.5 18.9 6.1l1.5 1.5L16 12Z" />
      <path d="M13.6 9.6 15.4 11.4 11.9 14.9 10.1 13.1Z" />
      <path d="M10.1 13.1C8.2 14.3 7.3 16.4 4 20.5c4.1-.9 6.2-2.3 7.9-5.6" />
      <InkDot />
    </svg>
  );
}

/** 职业：罗盘与指针 */
export function CareerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M15.2 8.8 13.1 13.1 8.8 15.2 10.9 10.9Z" />
      <path d="M12 3.25v1.4M20.75 12h-1.4M12 19.35v1.4M3.25 12h1.4" opacity="0.55" />
      <InkDot />
    </svg>
  );
}

/** 规律：两枚咬合的齿轮 */
export function LawsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d={GEAR_BIG} />
      <circle cx="9" cy="12.5" r="1.6" />
      <path d={GEAR_SMALL} />
      <circle cx="16.6" cy="6.6" r="0.9" />
      <InkDot />
    </svg>
  );
}

/** 运气：一枚骰子，五点 */
export function LuckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <rect x="4" y="4" width="14" height="14" rx="3" />
      <circle cx="8.5" cy="8.5" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="8.5" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="11" cy="11" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="13.5" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="13.5" r="0.95" fill="currentColor" stroke="none" />
      <InkDot />
    </svg>
  );
}

/** 努力：三根滑杆，旋钮留白 */
export function SimulationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M3 6h9.8M17.2 6H21" />
      <circle cx="15" cy="6" r="2.2" />
      <path d="M3 12h2.8M10.2 12H21" />
      <circle cx="8" cy="12" r="2.2" />
      <path d="M3 18h8.8M16.2 18H21" />
      <circle cx="14" cy="18" r="2.2" />
    </svg>
  );
}

/** 命运：一个节点分出三条岔路 */
export function DestinyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M3 12h6" />
      <path d="M9 12c4 0 4.5-6.5 11-6.5" />
      <path d="M9 12c4 0 4.5 6.5 11 6.5" />
      <path d="M9 12c3.2 0 4.2-1.6 5.5-3.2" opacity="0.55" />
      <circle cx="9" cy="12" r="2" style={{ fill: 'var(--primary)' }} stroke="none" />
    </svg>
  );
}
