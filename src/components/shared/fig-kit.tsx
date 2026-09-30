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

/* ============ 装饰件 ============
 * 这一组只做视觉，不承载信息，必须 pointer-events-none + aria-hidden。
 * 全站底色是"克制的琥珀金"，装饰一律低透明度，别跟内容抢注意力。
 */

/**
 * 刻度尺：一条细线 + 下方等距短刻度。
 * 用来替代纯 border-t——同样是分隔，但带上了"人生刻度"的语义。
 */
export function TickRule({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {label && (
        <span className="shrink-0 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/40">
          {label}
        </span>
      )}
      <span aria-hidden className="relative h-2 flex-1 border-b border-border/70">
        <span
          className="absolute inset-x-0 bottom-0 h-[3px] text-muted-foreground/25"
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 10px)',
          }}
        />
      </span>
    </div>
  );
}

/**
 * 斜纹警示条：3px 高的 45° 斜纹。
 * 只用在"即将关闭 / 高危"这类需要一点紧张感的地方——全站出现次数要少，
 * 多了就不是警示而是噪音。
 */
export function HazardStripe({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('h-[3px] w-full opacity-45', className)}
      style={{
        backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0 2px, transparent 2px 7px)',
      }}
    />
  );
}

/**
 * 同心弧：右上角的三道同心圆弧（圆心在框外，只露出四分之一）。
 * 呼应"人生轨迹 / 雷达扫描"，放在页头或面板右上角填空。
 */
export function ArcGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      fill="none"
      className={cn('pointer-events-none', className)}
    >
      {[
        { r: 30, o: 0.3, dash: undefined },
        { r: 21, o: 0.22, dash: '3 3' },
        { r: 12, o: 0.14, dash: undefined },
      ].map((c) => (
        <circle
          key={c.r}
          cx="62"
          cy="2"
          r={c.r}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray={c.dash}
          opacity={c.o}
        />
      ))}
    </svg>
  );
}
