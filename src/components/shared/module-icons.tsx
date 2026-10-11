import type { SVGProps } from 'react';

/**
 * 八个模块的手绘式符号。
 *
 * 线条带轻微的起笔与收笔偏移，像用细笔随手画在纸上；
 * 统一 24 viewBox、线宽 1.5、圆头、currentColor 描边，右下角共用一枚朱砂墨点。
 */

export type ModuleIconComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

const BASE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

function InkDot({ cx = 20.6, cy = 20.4, r = 1.3 }: { cx?: number; cy?: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} stroke="none" style={{ fill: 'var(--primary)' }} />;
}

function gearPath(cx: number, cy: number, ro: number, ri: number, teeth: number) {
  const step = (Math.PI * 2) / teeth;
  const at = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  const parts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    parts.push(
      `${i === 0 ? 'M' : 'L'}${at(ri, a - step * 0.3)}`,
      `L${at(ro, a - step * 0.14)}`,
      `L${at(ro, a + step * 0.14)}`,
      `L${at(ri, a + step * 0.3)}`,
    );
  }
  return `${parts.join(' ')} Z`;
}

const GEAR = gearPath(12, 12.2, 8.6, 6.8, 9);

/** 时间：沙漏，上下两枚横木，中间一小堆沙 */
export function TimeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M4.6 3.4Q12 2.8 19.4 3.6" />
      <path d="M4.8 20.7Q12 21.3 19.2 20.5" />
      <path d="M7.2 4.1C7.4 8.4 10.8 9.9 11.7 11.9C10.7 14.1 7.1 15.8 7 19.8" />
      <path d="M16.9 4.2C16.6 8.4 13.2 9.9 12.3 11.9C13.3 14.1 16.8 15.9 17 19.9" />
      <path d="M9.4 17.8Q12 16.3 14.7 17.7" opacity="0.6" />
      <InkDot />
    </svg>
  );
}

/** 窗：拱形门窗，中间一竖一横窗棂，窗台略出头 */
export function WindowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M5.8 20.9L5.5 10.4Q5.2 3.5 12.2 3.1Q19 3.4 18.7 10.6L18.4 21" />
      <path d="M3.5 21.3H20.6" />
      <path d="M12.3 3.6V20.8" />
      <path d="M5.6 13.4Q12 12.7 18.6 13.6" />
      <InkDot />
    </svg>
  );
}

/** 名：一支蘸墨的毛笔，笔尖带一滴墨 */
export function NameIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M16.6 3.9L19.9 7.2" />
      <path d="M14.6 5.9L18 9.3" />
      <path d="M14.3 6.9C12.7 9.4 11 11.9 9.2 14.5C8 16.3 6.6 17.9 4.4 19.9C7.1 18.7 9.2 17.1 11.1 15.1C12.9 13.2 14.9 11.1 16.9 8.4Z" />
      <circle cx="5" cy="20.1" r="0.95" stroke="none" style={{ fill: 'var(--primary)' }} />
    </svg>
  );
}

/** 职：阶梯向上，顶端一面小旗 */
export function CareerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M3.4 20.6H7.1V16.7H10.8V12.9H14.4V9.1H18V5.4" />
      <path d="M18 5.4L21 4.4" />
      <path d="M18 5.4V9.2" opacity="0.4" />
      <path d="M3.4 20.6H20.6" opacity="0.4" />
      <InkDot cx={20.6} cy={20.6} />
    </svg>
  );
}

/** 规律：一枚手画的齿轮，中心留一个圆孔 */
export function LawsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d={GEAR} />
      <circle cx="12" cy="12.2" r="2.5" />
      <InkDot />
    </svg>
  );
}

/** 运：一枚方骰，角略圆，四点加中心 */
export function LuckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M5.1 4.5Q12 3.4 18.9 4.7Q20.7 12 19.3 19.5Q12 20.7 4.5 19.2Q3.3 12 5.1 4.5Z" />
      <circle cx="8.5" cy="8.4" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.6" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="8.4" cy="15.6" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="15.5" r="1.05" fill="currentColor" stroke="none" />
      <InkDot />
    </svg>
  );
}

/** 努：一株破土的幼苗，两片叶，脚下一道土线 */
export function SimulationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12.1 21V11.6" />
      <path d="M12.1 13.2C9.7 13.6 7.7 12 7.1 9.3C9.7 8.9 11.7 10.3 12.1 13.2Z" />
      <path d="M12.1 11.1C12.5 7.9 14.7 6.3 17.5 6.5C17.1 9.5 14.9 11.3 12.1 11.1Z" />
      <path d="M7.4 21.3H16.9" opacity="0.5" />
      <InkDot />
    </svg>
  );
}

/** 命：一个节点分出三条岔路，末端各一笔收尾 */
export function DestinyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M3.2 12.2H6.4" />
      <path d="M9.2 12.1C13.4 12 13.8 5.6 20.4 5.4" />
      <path d="M9.2 12.1C13.4 12.2 13.8 18.6 20.4 18.8" />
      <path d="M9.2 12.1C12 12.3 12.8 9.9 15 8.8" opacity="0.5" />
      <circle cx="8" cy="12.2" r="1.9" style={{ fill: 'var(--primary)' }} stroke="none" />
    </svg>
  );
}

/** 健：一颗手画的心，心口横过一道脉搏线 */
export function HealthIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M12 20.3C7.7 17.2 4.3 14.2 4.3 10.5C4.3 7.7 6.3 5.9 8.6 5.9C10.2 5.9 11.4 6.9 12 8C12.6 6.9 13.8 5.9 15.4 5.9C17.7 5.9 19.7 7.7 19.7 10.5C19.7 14.2 16.3 17.2 12 20.3Z" />
      <path d="M6.4 11.1H9.1L10.5 8.9L12.4 13.5L13.8 11.1H17.6" opacity="0.75" />
      <InkDot />
    </svg>
  );
}
