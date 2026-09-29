import { cn } from '@/lib/utils';

/**
 * 全站统一的「专业仪表盘」视觉件。
 *
 * 设计语言（2026-09-28 定）：
 * - 等宽小写注记（FIG.01 / N=473 / SRC）+ 大号衬线标题的对比
 * - HUD 括号、脉冲点、细分隔线
 * - 琥珀金只在 hover / 关键数字上出现
 */

/** FIG 风格面板头：编号 + 标题 + 右侧数据注记 */
export function PanelHead({
  fig,
  title,
  note,
  className,
}: {
  fig: string;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3 border-b border-border pb-3 mb-4', className)}>
      <div className="flex items-baseline gap-2.5 min-w-0">
        <span className="font-mono text-[10px] tracking-[0.15em] text-primary/70 shrink-0">{fig}</span>
        <h2 className="text-sm font-semibold text-foreground truncate">{title}</h2>
      </div>
      {note && <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">{note}</span>}
    </div>
  );
}

/** 页面顶部 HUD 行：左编号 + 弹性细线 + 右注记 */
export function HudLine({
  index,
  note,
  className,
}: {
  index: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3 mb-8 animate-fade-in-up', className)}>
      <span className="font-mono text-[10px] tracking-[0.2em] text-primary/70 shrink-0">{index}</span>
      <span className="h-px flex-1 bg-border" />
      {note && <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">{note}</span>}
    </div>
  );
}

/** 四角 HUD 括号（放在 relative 容器内；外层容器自管圆角） */
export function HudCorners() {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-primary/40" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-primary/40" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-primary/40" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-primary/40" />
    </>
  );
}
