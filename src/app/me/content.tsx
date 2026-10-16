'use client';

/**
 * /me —— 你的人生时间轴
 *
 * 个性化主线入口：输入年龄 → 从 488 个人生窗口里筛出
 * 「正在开启 / 已经错过 / 尚未到来」，把一个平铺数据库
 * 变成一张"与我有关的地图"。
 *
 * 纯前端计算，年龄存全局主键 localStorage('default-age')（与 /user、/windows、首页共用）。
 */

import { prefersReducedMotion, scrollToEl, scrollToTop } from '@/lib/motion';
import { Odometer } from '@/components/shared/odometer';
import { DailyPageCard } from '@/components/home/daily-page-card';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { lifeWindows, type LifeWindow, REMEDY_LEVEL_CONFIG, MISS_TYPE_CONFIG, LOCK_FORCE_LABELS } from '@/data/windows';
import { WINDOW_DENSITY, WINDOW_DENSITY_META } from '@/data/window-density';
import { cn } from '@/lib/utils';
import { PanelHead, HudCorners, HazardStripe } from '@/components/shared/fig-kit';
import { Reveal } from '@/components/shared/reveal';
import { WindowMarkBar, WindowMarkChip } from '@/components/shared/window-mark-bar';
import { useWindowMarks, type WindowMarkMap } from '@/hooks/use-window-marks';
import { useUserProfile } from '@/hooks/use-user-profile';
import { TIMELINE_IDENTITY, MODULE_IDENTITIES } from '@/lib/module-identity';
import { readDefaultAge, writeDefaultAge, clearDefaultAge, AGE_MAX } from '@/lib/default-age';
import {
  Flame, Hourglass, CheckCircle2, CalendarClock, ChevronDown, ChevronRight,
  ArrowRight, Lock, AlertTriangle, Info, ListChecks, Activity, Compass,
} from 'lucide-react';

/* ============ 工具 ============ */

const MAX_AGE = AGE_MAX;
/** 每档清单默认显示条数，其余折在"展开其余 N 个"里 */
// 主清单每组默认露几条。原先 8/8/5/10/8 加起来三十多张卡，
// 用户从聚焦区往下滑很久还在滑，体感像"永远滑不到底"。
// 聚焦区已经把最要紧的九条摆在最上面了，主清单只负责"想细看时再展开"。
const URGENT_PREVIEW = 4;
const OPEN_PREVIEW = 4;

function parseAgeRange(age: string): { start: number; end: number } {
  const trimmed = age.trim();
  if (trimmed.endsWith('+')) {
    const start = parseInt(trimmed, 10);
    return { start: Number.isNaN(start) ? 0 : start, end: 200 };
  }
  const parts = trimmed.split('-').map((n) => parseInt(n, 10));
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
    return { start: parts[0], end: parts[1] };
  }
  const single = parts[0];
  return { start: Number.isNaN(single) ? 0 : single, end: Number.isNaN(single) ? 0 : single };
}

type WindowState = 'open' | 'urgent' | 'missed' | 'future';

interface ClassifiedWindow extends LifeWindow {
  range: { start: number; end: number };
  state: WindowState;
  /** 剩余年数（仅 open/urgent） */
  yearsLeft?: number;
}

function classify(age: number): ClassifiedWindow[] {
  return lifeWindows.map((w) => {
    const range = parseAgeRange(w.age);
    let state: WindowState;
    let yearsLeft: number | undefined;

    if (age >= range.start && age <= range.end) {
      yearsLeft = range.end - age;
      state = range.end >= 200 || yearsLeft > 5 ? 'open' : 'urgent';
    } else if (range.end < age) {
      state = 'missed';
    } else {
      state = 'future';
    }
    return { ...w, range, state, yearsLeft };
  });
}

/**
 * 把一个清单按"有没有被标记"分成两半。
 *
 * 时间轴在多数年龄下都有几十条，用户真正的动作是"逐条表态"：
 * 表态过的（已在做 / 已完成 / 与我无关）沉到后面单独折叠，
 * 主清单只留还没处理的，数字会随梳理一条条变小。
 */
function partition(list: ClassifiedWindow[], marks: WindowMarkMap) {
  const active: ClassifiedWindow[] = [];
  const marked: ClassifiedWindow[] = [];
  for (const w of list) (marks[w.id] ? marked : active).push(w);
  return { active, marked };
}

/* ============ 小组件 ============ */

/* ============ 聚焦列 ============ */

const FOCUS_TONE = {
  red: { chip: 'bg-red-500/10 text-red-600 dark:text-red-400', border: 'border-red-500/25' },
  green: { chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/25' },
  amber: { chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', border: 'border-amber-500/25' },
} as const;

/** 一档聚焦列：标题 + 最多 3 张卡 + 查看全部 */
function FocusColumn({
  title,
  hint,
  icon,
  tone,
  items,
  total,
  emptyText,
  onSeeAll,
}: {
  title: string;
  hint: string;
  icon: React.ReactNode;
  tone: keyof typeof FOCUS_TONE;
  items: ClassifiedWindow[];
  total: number;
  emptyText: string;
  onSeeAll: () => void;
}) {
  const t = FOCUS_TONE[tone];
  return (
    <div className={cn('flex flex-col rounded-sm border bg-card overflow-hidden', t.border)}>
      {/* 全站只有"马上要关"这一列配斜纹——多一处就不是警示而是噪音 */}
      {tone === 'red' && items.length > 0 && <HazardStripe className="text-primary" />}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', t.chip)}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-semibold text-foreground leading-tight">{title}</h3>
          <p className="text-[11px] text-muted-foreground leading-tight">{hint}</p>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground/75 tabular-nums">
          {total}
        </span>
      </div>

      <div className="flex-1 p-3 space-y-2.5">
        {items.length === 0 ? (
          <p className="py-6 text-center text-[11px] leading-relaxed text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          items.map((w) => <WindowCard key={w.id} w={w} />)
        )}
      </div>

      {total > items.length && (
        <button
          onClick={onSeeAll}
          className="w-full border-t border-border py-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent/40 hover:text-primary"
        >
          查看全部 {total} 个 →
        </button>
      )}
    </div>
  );
}

/**
 * 已表态的一组：折叠成一行抽屉。
 * 默认收起——它们已经退出主清单了，不该再占视线；但必须能一键找回，
 * 否则"与我无关"就成了删除，用户不敢点。
 */
function MarkedFold({
  items,
  open,
  onToggle,
}: {
  items: ClassifiedWindow[];
  open: boolean;
  onToggle: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-6">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-3.5 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
      >
        <ListChecks className="h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0">
          已表态的 <span className="tabular-nums font-semibold">{items.length}</span> 个
          <span className="ml-1.5 text-[11px] opacity-70">已在做 / 已完成 / 与我无关</span>
        </span>
        <ChevronDown className={cn('ml-auto h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="mt-2.5 space-y-2.5 animate-fade-in">
          {items.map((w) => <WindowCard key={w.id} w={w} />)}
        </div>
      )}
    </div>
  );
}

function StateBadge({ w }: { w: ClassifiedWindow }) {
  if (w.state === 'urgent') {
    return (
      <span className="inline-flex items-center gap-1 rounded-[2px] bg-primary/10 border border-primary/25 px-2 py-0.5 text-[11px] font-semibold text-primary">
        <Flame className="h-3 w-3" />
        {w.yearsLeft === 0 ? '今年关上' : `只剩 ${w.yearsLeft} 年`}
      </span>
    );
  }
  if (w.state === 'open') {
    return (
      <span className="inline-flex items-center gap-1 rounded-[2px] bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
        <Hourglass className="h-3 w-3" />
        还剩 {w.yearsLeft !== undefined && w.yearsLeft < 200 ? `${w.yearsLeft} 年` : '很久'}
      </span>
    );
  }
  return null;
}

function WindowCard({ w, defaultOpen = false }: { w: ClassifiedWindow; defaultOpen?: boolean }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const { marks } = useWindowMarks();
  const marked = marks[w.id];
  const remedy = REMEDY_LEVEL_CONFIG[w.remedyLevel];
  const miss = MISS_TYPE_CONFIG[w.missType];
  const lock = LOCK_FORCE_LABELS[w.lockForceScore] ?? null;

  const stateStyle = marked
    ? 'border-l-muted-foreground/15'
    : w.state === 'urgent'
      ? 'border-l-primary'
      : w.state === 'open'
        ? 'border-l-emerald-500'
        : w.state === 'missed'
          ? 'border-l-muted-foreground/20'
          : 'border-l-foreground/40';

  return (
    <div
      id={`me-win-${w.id}`}
      className={cn(
        'rounded-lg border border-border bg-card border-l-2 overflow-hidden transition-colors',
        stateStyle,
        // 标记过 = 已经处理过这件事，视觉上退后，但不藏起来（随时可撤销）
        marked && 'opacity-55 hover:opacity-100'
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-[11px] text-muted-foreground/70 tabular-nums">
              #{String(w.id).padStart(3, '0')}
            </span>
            <span className="text-[11px] font-mono font-semibold text-muted-foreground tabular-nums">
              {w.range.start}
              {w.range.end < 200 ? `-${w.range.end}` : '+'}岁
            </span>
            <h4 className="text-sm font-semibold text-foreground">{w.title}</h4>
            <WindowMarkChip id={w.id} />
          </div>
          {!expanded && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">{w.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StateBadge w={w} />
          {w.state === 'missed' && (
            <span className={cn('text-[11px] font-medium', miss.color)}>{miss.label}</span>
          )}
        </div>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground/70 mt-1 transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 animate-fade-in">
          <p className="text-sm text-foreground/85 leading-relaxed">{w.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {lock && (
              <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                <div className="text-[11px] text-muted-foreground mb-0.5">锁死力</div>
                <div className={cn('text-xs font-semibold', lock.color)}>{lock.label}</div>
              </div>
            )}
            <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
              <div className="text-[11px] text-muted-foreground mb-0.5">错过后果</div>
              <div className={cn('text-xs font-semibold', miss.color)}>{miss.label}</div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
              <div className="text-[11px] text-muted-foreground mb-0.5">补救代价</div>
              <div className={cn('text-xs font-semibold', remedy.color)}>{remedy.label}</div>
            </div>
            {w.bestExecuteAge && (
              <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                <div className="text-[11px] text-muted-foreground mb-0.5">最佳执行期</div>
                <div className="text-xs font-semibold text-foreground">{w.bestExecuteAge}岁</div>
              </div>
            )}
          </div>

          {w.state === 'missed' && (
            <div className="flex items-start gap-2 rounded-md bg-muted/40 border border-border px-3 py-2">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{miss.description}</p>
            </div>
          )}

          <Link
            href="/windows"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-1.5 transition-colors"
          >
            到窗口模块深入查看
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* 表态条：常驻在卡片底部，不藏在展开区里——这个页面的主操作就是逐条表态 */}
      <div className="flex items-center gap-2 border-t border-border/50 bg-muted/10 px-4 py-1.5">
        <WindowMarkBar id={w.id} />
        <span className="ml-auto text-[11px] text-muted-foreground/35">
          {marked ? '已表态' : '未表态'}
        </span>
      </div>
    </div>
  );
}

/* ============ 聚焦轨道图（当前年龄附近） ============ */

const FOCUS_BEFORE = 8;
const FOCUS_AFTER = 15;
function FocusTracks({ age, windows }: { age: number; windows: ClassifiedWindow[] }) {
  const { marks } = useWindowMarks();
  const from = Math.max(0, age - FOCUS_BEFORE);
  const to = age + FOCUS_AFTER;
  const span = to - from;

  // 按年份聚合，而不是按窗口画横条。这样每挪一岁，图形会真的变。
  const yearStats = Array.from({ length: span + 1 }, (_, i) => {
    const year = from + i;
    const active = windows.filter(
      (w) => w.range.start <= year && year <= w.range.end && w.state !== 'missed' && marks[w.id] !== 'skip'
    );
    return {
      year,
      urgent: active.filter((w) => w.state === 'urgent').length,
      open: active.filter((w) => w.state === 'open').length,
      future: active.filter((w) => w.state === 'future').length,
      total: active.length,
    };
  });
  const maxCount = Math.max(1, ...yearStats.map((s) => s.total));
  const currentX = ((age - from) / span) * 100;

  const barColor = (w: ClassifiedWindow) =>
    w.state === 'urgent'
      ? 'bg-red-500 hover:bg-red-400'
      : w.state === 'open'
        ? 'bg-emerald-500/80 hover:bg-emerald-400'
        : 'bg-amber-400/60 hover:bg-amber-300';

  return (
    <div>
      <div className="relative h-40 rounded-lg bg-muted/20 px-2 pt-2">
        {/* 当前年龄线 */}
        <div
          className="absolute inset-y-2 w-0.5 bg-red-500/80 z-10"
          style={{ left: `calc(0.5rem + ${currentX / 100 * 100}% - 1px)` }}
        />
        <div className="flex h-full items-end gap-[2px]">
          {yearStats.map((s) => (
            <div
              key={s.year}
              title={`${s.year} 岁：${s.total} 个窗口（紧急 ${s.urgent} / 开启 ${s.open} / 未来 ${s.future}）`}
              className="flex h-full flex-1 flex-col justify-end gap-[1px]"
            >
              {s.urgent > 0 && (
                <div
                  className="rounded-t-sm bg-primary"
                  style={{ height: `${(s.urgent / maxCount) * 100}%` }}
                />
              )}
              {s.open > 0 && (
                <div
                  className="bg-emerald-500/80"
                  style={{ height: `${(s.open / maxCount) * 100}%` }}
                />
              )}
              {s.future > 0 && (
                <div
                  className="bg-foreground/40"
                  style={{ height: `${(s.future / maxCount) * 100}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 年份刻度 */}
      <div className="relative mt-1 h-4">
        {yearStats
          .filter((s) => s.year % 5 === 0)
          .map((s) => (
            <span
              key={s.year}
              className="absolute -translate-x-1/2 text-[11px] font-mono text-muted-foreground/75 tabular-nums"
              style={{ left: `${((s.year - from) / span) * 100}%` }}
            >
              {s.year}
            </span>
          ))}
      </div>
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-1">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500/80 inline-block" /> 正在开启</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> 即将关闭</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-foreground/40 inline-block" /> 尚未到来</span>
        <span className="text-muted-foreground/75">悬停色带可查看各年份的窗口数</span>
      </div>
    </div>
  );
}

function TimelineSlider({ age, onChange }: { age: number; onChange: (value: number) => void }) {
  const max = Math.max(...WINDOW_DENSITY.map((bucket) => bucket.total), 1);
  const points = WINDOW_DENSITY.map((bucket) => {
    const x = ((bucket.from + bucket.to + 1) / 2 / MAX_AGE) * 100;
    const y = 88 - (bucket.total / max) * 72;
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  const areaPath = `M 0 88 L ${points.join(' L ')} L 100 88 Z`;
  const linePath = `M 0 88 L ${points.join(' L ')}`;
  /* 拖动手感：
     - 拖动中把手 1:1 跟手（用指针的小数位置），数字按取整后的岁数走（Odometer 滚动）；
     - 松手：吸附到整岁（把手 left 过渡 140ms），并做一次 scaleY 1→1.15→1（120ms）的「咔哒」；
     - 键盘 / 点按改值时把手走 left 过渡，平滑跟随。 */
  const [dragFrac, setDragFrac] = useState<number | null>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = dragFrac !== null;
  const currentX = ((dragging ? dragFrac : age) / MAX_AGE) * 100;

  const fracFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return age;
    return Math.min(MAX_AGE, Math.max(0, ((clientX - rect.left) / rect.width) * MAX_AGE));
  };
  const endDrag = () => {
    if (dragFrac === null) return;
    setDragFrac(null);
    if (prefersReducedMotion()) return;
    handleRef.current?.animate(
      [{ scale: '1 1' }, { scale: '1 1.15', offset: 0.5 }, { scale: '1 1' }],
      { duration: 120, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  };
  // 松手发生在滑块之外时（指针捕获失效的浏览器），兜底结束拖动
  useEffect(() => {
    if (!dragging) return;
    const up = () => endDrag();
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }); // 无依赖数组：endDrag 依赖最新的 dragFrac，每次渲染重绑即可

  return (
    <div className="mt-5">
      <div ref={trackRef} className="relative h-20 overflow-hidden rounded-lg bg-muted/20">
        <svg
          className="absolute inset-0 h-full w-full text-primary"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="timeline-density" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#timeline-density)" />
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* 当前位置指示器：只用一个元素（竖向胶囊 + 圆点合成一个把手）。
            原先是「一条贯穿整条曲线的竖线 + 一个圆点」两个元素，
            看起来像两个标记，而且用户会以为其中一个偏了。 */}
        <div
          ref={handleRef}
          className={cn(
            'pointer-events-none absolute top-1/2 z-[2] h-9 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_18%,transparent)]',
            !dragging && 'transition-[left] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
          )}
          style={{ left: `${currentX}%` }}
          aria-hidden
        />
        <input
          type="range"
          min={0}
          max={MAX_AGE}
          step={1}
          value={age}
          onPointerDown={(e) => setDragFrac(fracFromClientX(e.clientX))}
          onPointerMove={(e) => {
            if (dragFrac !== null) setDragFrac(fracFromClientX(e.clientX));
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="age-timeline-slider absolute inset-0 z-10 h-full w-full"
          aria-labelledby="me-age-label"
          aria-valuetext={`${age} 岁`}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-mono text-muted-foreground/70 tabular-nums">
        <span>0</span><span>25</span><span>50</span><span>75</span><span>{MAX_AGE}</span>
      </div>
    </div>
  );
}

/* ============ 首次进入：先问年龄 ============ */

function AgeOnboarding({ onSubmit }: { onSubmit: (age: number) => void }) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  /** 拖动调年龄：把指针横向位置换算回轴上的年龄（轴起点 x=10，每岁 7.25px，见 viewBox 0 0 600 120） */
  const ageFromClientX = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return null;
    const vx = ((clientX - rect.left) / rect.width) * 600;
    return Math.min(MAX_AGE, Math.max(0, Math.round((vx - 10) / 7.25)));
  };
  const onAxisPointerDown = (e: React.PointerEvent) => {
    const n = ageFromClientX(e.clientX);
    if (n === null) return;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraft(String(n));
    setError('');
  };
  const onAxisPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const n = ageFromClientX(e.clientX);
    if (n !== null) setDraft(String(n));
  };
  const endAxisDrag = () => setDragging(false);

  const submit = () => {
    const n = Number(draft.trim());
    if (draft.trim() === '' || !Number.isInteger(n) || n < 0 || n > MAX_AGE) {
      setError(`请输入 0–${MAX_AGE} 之间的整数年龄`);
      return;
    }
    onSubmit(n);
  };

  /** 底部提示带：先让首访者知道输完年龄会得到什么，再让他输 */
  const promises = [
    { dot: 'bg-emerald-500/80', label: '正在开启', en: 'OPENING', desc: '当下正敞开，按紧急度排序' },
    { dot: 'bg-primary/80', label: '即将关闭', en: 'CLOSING', desc: '五年内关上的门，别错过' },
    { dot: 'bg-foreground/40', label: '尚未到来', en: 'UPCOMING', desc: '按年龄排好的未来节点' },
  ];

  /** 序章圆点位置：跟输入框联动。没填时停在 40（0–80 岁的正中间），填了就跟过去 */
  const draftNum = Number(draft);
  const dotAge = draft.trim() === '' || Number.isNaN(draftNum) ? 40 : Math.min(MAX_AGE, Math.max(0, Math.round(draftNum)));
  const dotX = 10 + dotAge * 7.25;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="mx-auto grid w-full max-w-7xl 2xl:max-w-[1600px] flex-1 items-center gap-12 px-6 py-14 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-12">
        <div className="relative lg:col-span-7">
          <div className="flex items-end gap-5">
            <span className="font-serif text-[10rem] font-bold leading-[0.78] text-primary sm:text-[13rem]">序</span>
            <div className="pb-3">
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">PROLOGUE</div>
              <div className="mt-1.5 font-serif text-sm text-muted-foreground">你现在几岁</div>
            </div>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 600 120"
            className="mt-10 w-full cursor-grab touch-pan-y select-none text-foreground active:cursor-grabbing"
            fill="none"
            stroke="currentColor"
            aria-hidden
            focusable="false"
            onPointerDown={onAxisPointerDown}
            onPointerMove={onAxisPointerMove}
            onPointerUp={endAxisDrag}
            onPointerCancel={endAxisDrag}
          >
            <path d="M10 60 H590" strokeWidth="1" opacity="0.35" />
            {Array.from({ length: 41 }, (_, i) => {
              const x = 10 + i * 14.5;
              const major = i % 5 === 0;
              return <line key={i} x1={x} y1={60} x2={x} y2={major ? 44 : 52} strokeWidth={major ? 1 : 0.6} opacity={major ? 0.6 : 0.3} />;
            })}
            <path
              d="M10 60 H590"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              className="prologue-draw"
            />
            {[0, 20, 40, 60, 80].map((age) => (
              <text key={age} x={10 + age * 7.25} y={100} textAnchor="middle" fill="currentColor" stroke="none" fontSize="12" opacity="0.6" className="font-serif">
                {age}
              </text>
            ))}
            {/* 圆点跟右侧输入联动：没填时停在 40（0–80 岁的正中间）。
                支持直接拖动/点按调整（pointer capture 处理拖出边界的情况） */}
            <circle
              cx={dotX}
              cy={60}
              r={dragging ? 7 : 5}
              fill="var(--primary)"
              stroke="none"
              className="prologue-dot"
              style={{ transition: 'r 150ms ease' }}
            />
            <text
              x={Math.min(584, Math.max(16, dotX))}
              y={36}
              textAnchor="middle"
              fill="var(--primary)"
              stroke="none"
              fontSize="15"
              fontWeight="600"
              className="font-serif"
              opacity={dragging ? 1 : 0.88}
            >
              {dotAge}
            </text>
          </svg>
          <p className="mt-6 max-w-md font-serif text-base leading-[1.9] text-muted-foreground">
            每个人都站在这条线的某一格上。拖动圆点或直接输入你的年龄——然后看清哪些窗口正在开启，哪些已经关上。
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative border border-border bg-card p-6 sm:p-8">
            <span className="absolute -left-px -top-px h-2 w-2 bg-primary" aria-hidden />
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Step 00 · 你的年龄</span>
            <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              先告诉我们你现在多大？
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              年龄决定时间轴上哪些人生窗口正在开启、哪些已经关上、哪些尚未到来。只保存在这台设备的浏览器里。
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_AGE}
                value={draft}
                onChange={(e) => { setDraft(e.target.value); setError(''); }}
                aria-label="你的年龄"
                aria-invalid={error !== ''}
                autoFocus
                className="w-24 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground text-center tabular-nums focus-visible:border-ring"
              />
              <span className="text-sm text-muted-foreground">岁</span>
              <button
                type="submit"
                className="ml-auto inline-flex items-center gap-2 bg-primary px-6 py-3 font-serif text-sm tracking-[0.12em] text-primary-foreground transition-colors duration-500 hover:bg-primary/90"
              >
                看我的时间轴
                <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </form>
            {error && (
              <p role="alert" className="mt-3 text-xs text-primary">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* 底部：先交代输完年龄会得到什么，首访者不用猜 */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl 2xl:max-w-[1600px] flex-col gap-4 px-6 py-7 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <div className="flex items-start gap-6">
            <span aria-hidden className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[1px] bg-primary" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">What you get</div>
              <p className="mt-2 font-serif text-lg text-foreground">{WINDOW_DENSITY_META.total} 扇门，先分成三堆。</p>
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3 lg:w-[46rem] lg:gap-8">
            {promises.map((p) => (
              <div key={p.label} className="flex gap-3 border-l border-border pl-4">
                <span aria-hidden className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', p.dot)} />
                <div>
                  <dt className="flex items-baseline gap-2 font-serif text-sm text-foreground">
                    {p.label}
                    <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{p.en}</span>
                  </dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/* ============ 主页面 ============ */

type TabKey = 'open' | 'missed' | 'future';

export default function MePage() {
  /** age 为 null 且 ageLoaded 为 true 时表示用户尚未设置年龄，显示序章询问 */
  const [age, setAge] = useState<number | null>(null);
  const [ageLoaded, setAgeLoaded] = useState(false);
  const [tab, setTab] = useState<TabKey>('open');
  const [missedPermanentShowAll, setMissedPermanentShowAll] = useState(false);
  const [missedOtherShowAll, setMissedOtherShowAll] = useState(false);
  const [openShowAll, setOpenShowAll] = useState(false);
  /**
   * "即将关闭"这一档默认也只给前 8 个。
   * 28 岁这档有 48 个——原来一口气全铺出来，等于把最该看的东西埋进 48 张卡里，
   * 跟"眼睛不知道看什么"是同一个病。急不等于该全显示。
   */
  const [urgentShowAll, setUrgentShowAll] = useState(false);
  /** 已表态的那一组默认折叠（它们已经在主清单里沉底了，不该再占视线） */
  const [showMarked, setShowMarked] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { marks, clearAll, markedCount } = useWindowMarks();
  // 其他模块的快照（健康问卷 / 模拟器 / 命运报告），跨模块联动
  const profile = useUserProfile();

  // 读全局年龄（读写统一走 lib/default-age，兼容旧 me-age 键与历史 JSON 编码）
  useEffect(() => {
    setAge(readDefaultAge());
    setAgeLoaded(true);
  }, []);

  const updateAge = (v: number) => {
    setAge(v);
    writeDefaultAge(v);
  };

  const all = useMemo(() => (age === null ? [] : classify(age)), [age]);

  /**
   * 每个清单都按"有没有表态过"分成两半：
   *   .active —— 还没处理的，主视图只显示这些
   *   .marked —— 已在做 / 已完成 / 与我无关，折叠到清单末尾
   * 顶部仪表读数仍用客观总数，tab 上的数字是"还剩多少没处理"。
   */
  const lists = useMemo(() => {
    const openAll = all
      .filter((w) => w.state === 'open' || w.state === 'urgent')
      .sort((a, b) => (a.yearsLeft ?? 999) - (b.yearsLeft ?? 999));
    const missedAll = all.filter((w) => w.state === 'missed');
    const futureAll = all
      .filter((w) => w.state === 'future')
      .sort((a, b) => a.range.start - b.range.start);

    return {
      open: partition(openAll, marks),
      urgent: partition(openAll.filter((w) => w.state === 'urgent'), marks),
      calm: partition(openAll.filter((w) => w.state !== 'urgent'), marks),
      missedPermanent: partition(
        missedAll.filter((w) => w.missType === 'permanent').sort((a, b) => a.range.end - b.range.end),
        marks
      ),
      missedOther: partition(
        missedAll.filter((w) => w.missType !== 'permanent').sort((a, b) => b.range.end - a.range.end),
        marks
      ),
      missed: partition(missedAll, marks),
      future: partition(futureAll, marks),
    };
  }, [all, marks]);

  // 主清单 = 还没表态的
  const openList = lists.open.active;
  const openMarked = lists.open.marked;
  const urgentList = lists.urgent.active;
  const openCalm = lists.calm.active;
  const calmMarked = lists.calm.marked;
  const missedPermanent = lists.missedPermanent.active;
  const missedOther = lists.missedOther.active;
  const missedMarked = lists.missed.marked;
  const futureListAll = lists.future.active;
  const futureList = futureListAll.slice(0, 5);
  const futureMarked = lists.future.marked;

  // 客观总数（仪表读数用）
  const openTotal = openList.length + openMarked.length;
  const urgentTotal = urgentList.length + lists.urgent.marked.length;
  const missedTotal = missedPermanent.length + missedOther.length + missedMarked.length;
  const futureTotal = futureListAll.length + futureMarked.length;

  /**
   * 聚焦层：每档只取最该看的 3 个。
   *
   * 原来一进页面就是几十张卡平铺（"正在开启"经常 30+），
   * 眼睛根本没有落点。这里按"错过代价最大"排序取前三——
   * 想看全的在下面 tab 里。
   *
   * 优先给还没表态的；那一档全表态完了就退回显示已标记的，别出现空列。
   */
  const focusUrgent = useMemo(
    () => (urgentList.length ? urgentList : lists.urgent.marked).slice(0, 3),
    [urgentList, lists.urgent.marked]
  );
  const focusOpen = useMemo(
    () => (openCalm.length ? openCalm : calmMarked)
      .slice()
      .sort((a, b) => (b.lockForceScore ?? 0) - (a.lockForceScore ?? 0))
      .slice(0, 3),
    [openCalm, calmMarked]
  );
  const focusFuture = useMemo(
    () => (futureListAll.length ? futureListAll : futureMarked).slice(0, 3),
    [futureListAll, futureMarked]
  );

  const tabs: { key: TabKey; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'open', label: '正在开启', count: openList.length, icon: <Flame className="h-3.5 w-3.5" /> },
    { key: 'missed', label: '已经错过', count: missedPermanent.length + missedOther.length, icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    { key: 'future', label: '尚未到来', count: futureListAll.length, icon: <CalendarClock className="h-3.5 w-3.5" /> },
  ];

  // 首次进入（尚未读到本地年龄）：空白占位，避免闪现询问页
  if (!ageLoaded) {
    return <div className="min-h-screen bg-background" />;
  }

  // 未设置年龄：先问年龄，存本地后再展示时间轴
  if (age === null) {
    return <AgeOnboarding onSubmit={updateAge} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero：年龄选择 + 钩子 */}
      <section className="relative overflow-hidden border-b border-border grain-texture order-1">
        {/* 48px 细网格 */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/[0.07] blur-3xl" />

        <div className="relative w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 pt-5 sm:pt-6 pb-8 sm:pb-10">
          {/* HUD 行 */}
          <div className="flex items-center gap-3 mb-5 sm:mb-6 animate-fade-in-up">
            {/* ★ 不是 01–08，从 module-identity 取，别手写编号 */}
            <span className="text-[11px] tracking-[0.2em] text-primary/70 shrink-0">
              {TIMELINE_IDENTITY.tag} {TIMELINE_IDENTITY.note}
            </span>
            <span className="h-px flex-1 bg-border" />
            <button
              type="button"
              onClick={() => {
                clearDefaultAge();
                setAge(null);
                scrollToTop();
              }}
              className="shrink-0 text-[11px] text-muted-foreground/60 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              重新选年龄
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight leading-[1.1] mb-4 animate-fade-in-up stagger-1">
            {openTotal > 0 ? (
              <><Odometer value={age} className="text-primary" /> 岁 ·
              <br className="sm:hidden" />
              <Odometer value={openTotal} className="text-emerald-600 dark:text-emerald-400" /> 扇门正在开启</>
            ) : (
              <>拖动下面的滑块，看看你的人生时间轴</>
            )}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl animate-fade-in-up stagger-2">
            {urgentTotal > 0 ? (
              <>其中 <Odometer value={urgentTotal} className="font-semibold text-primary" /> 扇将在 5 年内关上——
              人生窗口不是隐喻，是发展心理学里真实存在的时机。</>
            ) : (
              <>{WINDOW_DENSITY_META.total} 个人生窗口里，正在开启的、已经关上的、还没来的——都在下面。</>
            )}
          </p>

          {/* 仪表读数行（年龄在下方控制台里调，这里不重复显示） */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground/75 animate-fade-in-up stagger-3">
            <span>正在开启 <b className="text-emerald-600 dark:text-emerald-400"><Odometer value={openTotal} /></b></span>
            <span>即将关闭 <b className="text-primary"><Odometer value={urgentTotal} /></b></span>
            <span>已错过 <b className="text-muted-foreground"><Odometer value={missedTotal} /></b></span>
            <span>尚未到来 <b className="text-foreground/80"><Odometer value={futureTotal} /></b></span>
            {markedCount > 0 && (
              <span className="text-primary/80">已表态 <b className="tabular-nums">{markedCount}</b></span>
            )}
          </div>

          {/* 年龄滑块：控制台 */}
          <div className="relative mt-8 rounded-sm border border-border bg-card p-5 sm:p-6 animate-fade-in-up stagger-4">
            <HudCorners />

            <div className="flex items-baseline justify-between mb-4">
              <span id="me-age-label" className="text-[11px] font-semibold text-muted-foreground tracking-[0.15em]">
                你的年龄
              </span>
              <div className="text-right">
                <Odometer value={age} className="text-3xl font-serif font-bold text-primary" />
                <span className="text-xs text-muted-foreground ml-1">岁</span>
                <span className="text-[11px] text-muted-foreground/70 ml-2">≈<span className="font-mono tabular-nums">{new Date().getFullYear() - age}</span> 年生</span>
              </div>
            </div>
            <TimelineSlider age={age} onChange={updateAge} />
            <p className="mt-3 pt-3 border-t border-border/60 text-[11px] text-muted-foreground/70">
              此年龄全局生效：/user 偏好、/windows 年龄筛选、首页图表指针共用同一个值
            </p>
          </div>

          {/* 今日一页：用本地日期做种子的确定性每日一条 */}
          <DailyPageCard className="mt-6" />
        </div>
      </section>

      {/* 概览直方图 + 聚焦轨道 */}
      {/* ===== 现在最该看的三类：聚焦，不把几十张卡平铺 ===== */}
      <section className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 py-8 sm:py-10 order-3">
        <div className="flex items-baseline justify-between border-b border-border pb-3 mb-5">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-sm font-semibold text-foreground">现在最该看的三类</h2>
          </div>
          <span className="text-[11px] text-muted-foreground/70">
            错过代价最大的排在最前
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal delay={0}>
          <FocusColumn
            title="马上要关"
            hint="5 年内关闭，先处理这些"
            icon={<Flame className="h-3.5 w-3.5" />}
            tone="red"
            items={focusUrgent}
            total={urgentList.length}
            emptyText="这个年纪没有即将关闭的窗口——往下看看「正在开启」。"
            onSeeAll={() => {
              setTab('open');
              scrollToEl(listRef.current, { offset: 64 });
            }}
          />
          </Reveal>
          <Reveal delay={90}>
          <FocusColumn
            title="正在开启"
            hint="按锁死力排序，错过代价最大的在前"
            icon={<Hourglass className="h-3.5 w-3.5" />}
            tone="green"
            items={focusOpen}
            total={openCalm.length}
            emptyText="这个年龄段没有正在开启的窗口。"
            onSeeAll={() => {
              setTab('open');
              scrollToEl(listRef.current, { offset: 64 });
            }}
          />
          </Reveal>
          <Reveal delay={180}>
          <FocusColumn
            title="快到了"
            hint="提前知道，才谈得上准备"
            icon={<CalendarClock className="h-3.5 w-3.5" />}
            tone="amber"
            items={focusFuture}
            total={futureListAll.length}
            emptyText="后面没有还没到来的窗口了。"
            onSeeAll={() => {
              setTab('future');
              scrollToEl(listRef.current, { offset: 64 });
            }}
          />
          </Reveal>
        </div>
      </section>

      {/* ===== 其他模块的快照：你在健康 / 命运里留下的真实数据 ===== */}
      <section className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 py-8 order-3">
        <div className="flex items-baseline justify-between border-b border-border pb-3 mb-5">
          <h2 className="text-sm font-semibold text-foreground">其他模块的快照</h2>
          <span className="text-[11px] text-muted-foreground/70">你在别处留下的真实数据</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* 健康卡 */}
          <Reveal delay={0}>
          <Link
            href="/health"
            className="group flex h-full flex-col rounded-sm border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-sm font-semibold text-foreground">健康体检</span>
                <span className="font-mono text-[11px] tracking-widest text-muted-foreground/60">MODULE · {MODULE_IDENTITIES.find((m) => m.href === '/health')?.tag}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
            </div>
            {profile.health ? (
              <div className="mt-3 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    'font-serif text-3xl font-semibold tabular-nums',
                    profile.health.overall >= 78 ? 'text-emerald-600 dark:text-emerald-400'
                      : profile.health.overall >= 58 ? 'text-amber-600 dark:text-amber-400'
                      : profile.health.overall >= 40 ? 'text-orange-600 dark:text-orange-400'
                      : 'text-red-600 dark:text-red-400',
                  )}>{profile.health.overall}</span>
                  <span className="text-xs text-muted-foreground">
                    综合{profile.health.complete ? '' : '（未答完）'} · 已答 {profile.health.answered}/{profile.health.total} 题
                  </span>
                </div>
                {profile.health.weakest.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {profile.health.weakest.map((w) => (
                      <span key={w.name} className="rounded-sm border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {w.name} {w.score}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  还没做过健康问卷。7 个子域、约 3 分钟——身体是所有其他弹性的地基。
                </p>
              </div>
            )}
            <p className="mt-3 pt-3 border-t border-border/60 text-[11px] text-primary/80">
              {profile.health ? '查看完整报告' : '开始健康问卷'} →
            </p>
          </Link>
          </Reveal>

          {/* 命运卡 */}
          <Reveal delay={90}>
          <Link
            href="/destiny"
            className="group flex h-full flex-col rounded-sm border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 text-primary/70" />
                <span className="text-sm font-semibold text-foreground">命运报告</span>
                <span className="font-mono text-[11px] tracking-widest text-muted-foreground/60">MODULE · {MODULE_IDENTITIES.find((m) => m.href === '/destiny')?.tag}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
            </div>
            {profile.destinyReport ? (
              <div className="mt-3 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-xl font-semibold text-foreground">{profile.destinyReport.phase}</span>
                  <span className="text-xs text-muted-foreground">约 {profile.destinyReport.age} 岁</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  下一个关键窗口：<span className="text-foreground/85">{profile.destinyReport.nextWindow}</span>
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground/70">
                  已结合你标记的 {profile.windowAction.doing + profile.windowAction.done} 个窗口
                  {profile.health ? `与健康自评 ${profile.health.overall} 分` : ''}，重新生成可更新。
                </p>
              </div>
            ) : (
              <div className="mt-3 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  还没生成命运报告。它会结合你的窗口标记与健康问卷，给出一页基本面。
                </p>
              </div>
            )}
            <p className="mt-3 pt-3 border-t border-border/60 text-[11px] text-primary/80">
              {profile.destinyReport ? '重新查看 / 生成' : '去生成命运报告'} →
            </p>
          </Link>
          </Reveal>
        </div>
      </section>

      <section className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 py-10 order-2">
        <div className="rounded-sm border border-border bg-card p-5 animate-fade-in-up">
          <PanelHead
            title="你身边 ±15 年的窗口"
            note={`${Math.max(0, age - 8)}–${age + 15} 岁 · ${
              all.filter((w) => w.range.start <= age + 15 && w.range.end >= age - 8 && w.state !== 'missed').length
            } 条`}
          />
          <FocusTracks age={age} windows={all} />
        </div>
      </section>

      {/* 三档清单 */}
      <section className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 pb-16 order-4" ref={listRef}>
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5 animate-fade-in-up">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setOpenShowAll(false); setMissedPermanentShowAll(false); setMissedOtherShowAll(false); setUrgentShowAll(false); setShowMarked(false); }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-[2px] border px-4 py-2 text-xs font-medium transition-colors',
                tab === t.key
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              )}
            >
              {t.icon}
              {t.label}
              <span className={cn('tabular-nums font-mono', tab === t.key ? 'text-primary-foreground/80' : 'text-muted-foreground/75')}>
                {t.count}
              </span>
            </button>
          ))}
          {markedCount > 0 && (
            <button
              onClick={() => { if (window.confirm('确定清除全部表态吗？此操作不可恢复。')) clearAll(); }}
              title="清除全部表态，清单恢复原样"
              className="ml-auto inline-flex items-center gap-1.5 rounded-[2px] border border-primary/25 bg-primary/[0.06] px-3 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <ListChecks className="h-3.5 w-3.5" />
              已表态 <span className="tabular-nums">{markedCount}</span> 个 · 全部清除
            </button>
          )}
        </div>

        {/* 正在开启：先给当前状态，再给 5 年内关闭的子集；聚焦层负责优先级 */}
        {tab === 'open' && (
          <div className="space-y-4 animate-fade-in">
            {openList.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                {openMarked.length > 0
                  ? '这一档都表态完了——往下能看到已表态的那些。'
                  : '这个年龄段没有正在开启的窗口——往上看看「尚未到来」的。'}
              </div>
            )}
            {openCalm.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Hourglass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-semibold text-foreground">
                    还在开启的 <span className="tabular-nums">{openCalm.length}</span> 个
                    <span className="text-xs text-muted-foreground font-normal ml-2">按剩余时间排序</span>
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {(openShowAll ? openCalm : openCalm.slice(0, OPEN_PREVIEW)).map((w) => (
                    <WindowCard key={w.id} w={w} />
                  ))}
                </div>
                {openCalm.length > OPEN_PREVIEW && (
                  <button
                    onClick={() => setOpenShowAll(!openShowAll)}
                    className="mt-3 w-full rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    {openShowAll ? '收起' : `展开其余 ${openCalm.length - OPEN_PREVIEW} 个`}
                  </button>
                )}
              </div>
            )}
            {urgentList.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    即将关闭的 <span className="tabular-nums">{urgentList.length}</span> 个
                    <span className="text-xs text-muted-foreground font-normal ml-2">5 年内关上，优先处理</span>
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {(urgentShowAll ? urgentList : urgentList.slice(0, URGENT_PREVIEW)).map((w) => (
                    <WindowCard key={w.id} w={w} />
                  ))}
                </div>
                {urgentList.length > URGENT_PREVIEW && (
                  <button
                    onClick={() => setUrgentShowAll(!urgentShowAll)}
                    className="mt-3 w-full rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    {urgentShowAll ? '收起' : `展开其余 ${urgentList.length - URGENT_PREVIEW} 个即将关闭的窗口`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 已经错过 */}
        {tab === 'missed' && (
          <div className="space-y-4 animate-fade-in">
            {missedPermanent.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    永久关闭的 <span className="tabular-nums">{missedPermanent.length}</span> 个
                    <span className="text-xs text-muted-foreground font-normal ml-2">关上就是关上了</span>
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {(missedPermanentShowAll ? missedPermanent : missedPermanent.slice(0, 3)).map((w) => (
                    <WindowCard key={w.id} w={w} />
                  ))}
                </div>
                {missedPermanent.length > 5 && (
                  <button
                    onClick={() => setMissedPermanentShowAll(!missedPermanentShowAll)}
                    className="mt-3 w-full rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    {missedPermanentShowAll ? '收起' : `展开其余 ${missedPermanent.length - 5} 个永久关闭的窗口`}
                  </button>
                )}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  还能补救的 <span className="tabular-nums">{missedOther.length}</span> 个
                  <span className="text-xs text-muted-foreground font-normal ml-2">代价变高，但门没死</span>
                </h3>
              </div>
              <div className="space-y-2.5">
                {(missedOtherShowAll ? missedOther : missedOther.slice(0, 5)).map((w) => (
                  <WindowCard key={w.id} w={w} />
                ))}
              </div>
              {missedOther.length > 10 && (
                <button
                  onClick={() => setMissedOtherShowAll(!missedOtherShowAll)}
                  className="mt-3 w-full rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {missedOtherShowAll ? '收起' : `展开其余 ${missedOther.length - 10} 个`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 尚未到来 */}
        {tab === 'future' && (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              离你最近的 {futureList.length} 个窗口——提前知道，才谈得上准备
            </div>
            {futureList.map((w) => (
              <WindowCard key={w.id} w={w} />
            ))}
            <Link
              href="/windows"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              查看全部 {WINDOW_DENSITY_META.total} 个窗口
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* 已表态的这一组：沉底 + 默认折叠。标记只是让它退出主清单，不是删掉 */}
        <MarkedFold
          items={tab === 'open' ? openMarked : tab === 'missed' ? missedMarked : futureMarked}
          open={showMarked}
          onToggle={() => setShowMarked(!showMarked)}
        />
      </section>

      {/* 底部：一句收束 */}
      <section className="border-t border-border bg-muted/15">
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 py-3 sm:py-4">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <Lock className="h-3.5 w-3.5 text-primary/60 mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-foreground/80 leading-snug font-serif">
              窗口不等人，但看见窗口的人可以做选择。
              数据来自发展心理学与职业研究——它不能预测你的人生，但能告诉你：
              哪些事，现在不做以后会更贵。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
