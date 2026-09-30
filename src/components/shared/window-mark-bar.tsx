'use client';

/**
 * 窗口卡片上的个人标记条 / 标记芯片
 *
 * 放在卡片底部常驻（不藏在展开区里）：这个页面的主操作就是"逐条表态"，
 * 每标记一条，主清单就少一条，多一次点击就会让人少梳理十条。
 */

import { cn } from '@/lib/utils';
import {
  useWindowMarks,
  WINDOW_MARK_ORDER,
  WINDOW_MARK_META,
  type WindowMark,
} from '@/hooks/use-window-marks';

/** 选中态配色：在做=琥珀(主色) / 完成=绿 / 无关=灰 */
const TONE: Record<WindowMark, string> = {
  doing: 'border-amber-500/45 bg-amber-500/12 text-amber-600 dark:text-amber-400',
  done: 'border-emerald-500/45 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
  skip: 'border-border bg-muted text-muted-foreground',
};

export function WindowMarkBar({ id, className }: { id: number; className?: string }) {
  const { marks, setMark } = useWindowMarks();
  const cur = marks[id];

  return (
    <div className={cn('flex items-center gap-1', className)} role="group" aria-label="标记这条窗口">
      {WINDOW_MARK_ORDER.map((m) => {
        const active = cur === m;
        return (
          <button
            key={m}
            type="button"
            title={`${WINDOW_MARK_META[m].label}· ${WINDOW_MARK_META[m].desc}（再点一次取消）`}
            aria-pressed={active}
            onClick={(e) => {
              e.stopPropagation();
              setMark(id, active ? null : m);
            }}
            className={cn(
              'rounded-full border px-2 py-[3px] text-[10px] font-medium leading-none transition-colors',
              active
                ? TONE[m]
                : 'border-border bg-transparent text-muted-foreground/55 hover:border-primary/30 hover:text-foreground'
            )}
          >
            {WINDOW_MARK_META[m].short}
          </button>
        );
      })}
    </div>
  );
}

/** 卡片头部的小芯片：只在已标记时出现，点一下撤销 */
export function WindowMarkChip({ id }: { id: number }) {
  const { marks, setMark } = useWindowMarks();
  const cur = marks[id];
  if (!cur) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setMark(id, null);
      }}
      title="撤销标记"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none transition-opacity hover:opacity-70',
        TONE[cur]
      )}
    >
      {WINDOW_MARK_META[cur].short}
      <span aria-hidden className="text-[9px] opacity-60">×</span>
    </button>
  );
}
