/**
 * 数字显示件（原「机械计数器」）。
 *
 * 历史：曾用每位数字 translateY 滚动做机械计数效果，但在真实页面里
 * （中文衬线字体 + 入场动画的祖先元素）滚轮定位失准，整排数字僵在「0」，
 * 导致 /me 首屏出现「00 岁 · 000 扇门正在开启」。已于 2026-10-15 回退为
 * 普通文本渲染：数字务必以可直接读取的文本呈现，不做装饰性替换。
 *
 * 保留组件名与 props 是为了不改动各处调用点；grouping 仍支持千分位。
 */
export function Odometer({
  value,
  className,
  grouping = false,
}: {
  value: number;
  className?: string;
  /** 大于 999 是否加千分位逗号 */
  grouping?: boolean;
}) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
  const text = safe.toLocaleString('en-US', { useGrouping: grouping });

  return <span className={`tabular-nums ${className ?? ''}`}>{text}</span>;
}
