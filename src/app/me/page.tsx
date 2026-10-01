'use client';

/**
 * /me —— 你的人生时间轴
 *
 * 个性化主线入口：输入年龄 → 从 473 个人生窗口里筛出
 * "正在开启 / 已经错过 / 尚未到来"，把一个平铺数据库
 * 变成一张"与我有关的地图"。
 *
 * 纯前端计算，年龄存全局主键 localStorage('default-age')（与 /user、/windows、首页共用）。
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { lifeWindows, type LifeWindow, REMEDY_LEVEL_CONFIG, MISS_TYPE_CONFIG, LOCK_FORCE_LABELS } from '@/data/windows';
import { cn } from '@/lib/utils';
import { PanelHead, HudCorners, HazardStripe } from '@/components/shared/fig-kit';
import { Reveal } from '@/components/shared/reveal';
import { WindowMarkBar, WindowMarkChip } from '@/components/shared/window-mark-bar';
import { useWindowMarks, type WindowMarkMap } from '@/hooks/use-window-marks';
import { TIMELINE_IDENTITY } from '@/lib/module-identity';
import {
  Flame, Hourglass, CheckCircle2, CalendarClock, ChevronDown, ChevronRight,
  ArrowRight, Lock, AlertTriangle, Info, ListChecks,
} from 'lucide-react';

/* ============ 工具 ============ */

const CURRENT_YEAR = new Date().getFullYear();
const MAX_AGE = 100;
/** 每档清单默认显示条数，其余折在"展开其余 N 个"里 */
const URGENT_PREVIEW = 8;
const OPEN_PREVIEW = 8;
/** 全局年龄主键：/user 设置、/me 滑块、/windows 年龄、首页图表指针共用这一个值 */
const AGE_STORAGE_KEY = 'default-age';
/** 旧键（/me 曾单独存一份），首次读取时迁移到主键 */
const LEGACY_AGE_KEY = 'me-age';

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
    <div className={cn('flex flex-col rounded-xl border bg-card overflow-hidden', t.border)}>
      {/* 全站只有"马上要关"这一列配斜纹——多一处就不是警示而是噪音 */}
      {tone === 'red' && items.length > 0 && <HazardStripe className="text-red-500" />}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md', t.chip)}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-semibold text-foreground leading-tight">{title}</h3>
          <p className="text-[10px] text-muted-foreground leading-tight">{hint}</p>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground/60 tabular-nums">
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
          className="w-full border-t border-border py-2.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent/40 hover:text-primary"
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
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/25 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
        <Flame className="h-3 w-3" />
        {w.yearsLeft === 0 ? '今年关上' : `只剩 ${w.yearsLeft} 年`}
      </span>
    );
  }
  if (w.state === 'open') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
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
      ? 'border-l-red-500'
      : w.state === 'open'
        ? 'border-l-emerald-500'
        : w.state === 'missed'
          ? 'border-l-muted-foreground/20'
          : 'border-l-amber-400';

  return (
    <div
      id={`me-win-${w.id}`}
      className={cn(
        'rounded-lg border border-border bg-card border-l-4 overflow-hidden transition-all hover:shadow-sm',
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
            <span className="font-mono text-[10px] text-muted-foreground/40 tabular-nums">
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
            <span className={cn('text-[10px] font-medium', miss.color)}>{miss.label}</span>
          )}
        </div>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground/40 mt-1 transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 animate-fade-in">
          <p className="text-sm text-foreground/85 leading-relaxed">{w.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {lock && (
              <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                <div className="text-[10px] text-muted-foreground mb-0.5">锁死力</div>
                <div className={cn('text-xs font-semibold', lock.color)}>{lock.label}</div>
              </div>
            )}
            <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
              <div className="text-[10px] text-muted-foreground mb-0.5">错过后果</div>
              <div className={cn('text-xs font-semibold', miss.color)}>{miss.label}</div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
              <div className="text-[10px] text-muted-foreground mb-0.5">补救代价</div>
              <div className={cn('text-xs font-semibold', remedy.color)}>{remedy.label}</div>
            </div>
            {w.bestExecuteAge && (
              <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
                <div className="text-[10px] text-muted-foreground mb-0.5">最佳执行期</div>
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
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:gap-1.5 transition-all"
          >
            到窗口模块深入查看
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* 表态条：常驻在卡片底部，不藏在展开区里——这个页面的主操作就是逐条表态 */}
      <div className="flex items-center gap-2 border-t border-border/50 bg-muted/10 px-4 py-1.5">
        <WindowMarkBar id={w.id} />
        <span className="ml-auto font-mono text-[9px] text-muted-foreground/35 tabular-nums">
          {marked ? 'MARKED' : '#MARK'}
        </span>
      </div>
    </div>
  );
}

/* ============ 全人生直方图 ============ */

function OverviewBars({ age, windows }: { age: number; windows: ClassifiedWindow[] }) {
  const BUCKET = 5;
  const buckets = Array.from({ length: MAX_AGE / BUCKET }, (_, i) => ({
    from: i * BUCKET,
    to: i * BUCKET + BUCKET,
    open: 0,
    missed: 0,
  }));

  for (const w of windows) {
    for (const b of buckets) {
      if (w.range.start < b.to && w.range.end >= b.from) {
        if (w.state === 'missed') b.missed += 1;
        else b.open += 1;
      }
    }
  }

  const maxCount = Math.max(...buckets.map((b) => b.open + b.missed), 1);
  const peakBucket = buckets.reduce((best, b) => (b.open + b.missed > best.open + best.missed ? b : best), buckets[0]);

  return (
    <div>
      <div className="relative h-28 flex items-end gap-[3px]">
        {/* 水平网格线 */}
        {[25, 50, 75].map((r) => (
          <div
            key={r}
            className="absolute left-0 right-0 border-t border-dashed border-foreground/[0.07]"
            style={{ bottom: `${r}%` }}
          />
        ))}
        {buckets.map((b) => {
          const missedH = (b.missed / maxCount) * 100;
          const openH = (b.open / maxCount) * 100;
          const isPast = b.to <= age;
          return (
            <div key={b.from} className="relative flex-1 h-full flex flex-col justify-end" style={{ order: b.from / BUCKET }}>
              <div
                className="w-full rounded-t-sm bg-muted-foreground/15"
                style={{ height: `${isPast ? missedH : 0}%`, position: 'absolute', bottom: 0 }}
                title={`${b.from}-${b.to}岁：${b.missed} 个已错过`}
              />
              <div
                className={cn(
                  'w-full rounded-t-sm transition-all duration-500',
                  isPast ? 'bg-emerald-500/15' : 'bg-emerald-500/70'
                )}
                style={{ height: `${openH}%`, position: 'absolute', bottom: isPast ? `${missedH}%` : 0 }}
                title={`${b.from}-${b.to}岁：${b.open} 个可及窗口`}
              />
            </div>
          );
        })}
        {/* 当前年龄光标 */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500/80 z-10"
          style={{ left: `${(age / MAX_AGE) * 100}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
            {age}岁
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground/60 tabular-nums">
        <span>0</span><span>25</span><span>50</span><span>75</span><span>{MAX_AGE}岁</span>
      </div>
      <div className="flex items-center justify-between gap-4 mt-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500/70 inline-block" /> 可及窗口密度</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-muted-foreground/15 inline-block" /> 已错过密度</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2.5 bg-red-500/80 inline-block" /> 你的位置</span>
        </div>
        <span className="font-mono text-muted-foreground/50 shrink-0">
          PEAK {peakBucket.from}–{peakBucket.to}岁 · {peakBucket.open + peakBucket.missed}
        </span>
      </div>
    </div>
  );
}

/* ============ 聚焦轨道图（当前年龄附近） ============ */

const FOCUS_BEFORE = 8;
const FOCUS_AFTER = 15;
const FOCUS_MAX_TRACKS = 9;

function FocusTracks({ age, windows }: { age: number; windows: ClassifiedWindow[] }) {
  const { marks } = useWindowMarks();
  const from = Math.max(0, age - FOCUS_BEFORE);
  const to = age + FOCUS_AFTER;
  const span = to - from;

  // 标了"与我无关"的连色带都不画——这条轨道图的价值就是让你一眼看见还剩什么
  const inView = windows
    .filter((w) => w.range.start <= to && w.range.end >= from && w.state !== 'missed' && marks[w.id] !== 'skip')
    .sort((a, b) => {
      const priority: Record<ClassifiedWindow['state'], number> = {
        urgent: 0,
        open: 1,
        future: 2,
        missed: 3,
      };
      return priority[a.state] - priority[b.state]
        || a.range.start - b.range.start
        || (b.lockForceScore ?? 0) - (a.lockForceScore ?? 0)
        || a.range.end - b.range.end;
    });

  // 贪心分轨
  const tracks: ClassifiedWindow[][] = [];
  const trackEnds: number[] = [];
  for (const w of inView) {
    let placed = false;
    for (let t = 0; t < tracks.length; t++) {
      if (trackEnds[t] <= w.range.start) {
        tracks[t].push(w);
        trackEnds[t] = w.range.end;
        placed = true;
        break;
      }
    }
    if (!placed) {
      tracks.push([w]);
      trackEnds.push(w.range.end);
    }
  }

  const barColor = (w: ClassifiedWindow) =>
    w.state === 'urgent'
      ? 'bg-red-500 hover:bg-red-400'
      : w.state === 'open'
        ? 'bg-emerald-500/80 hover:bg-emerald-400'
        : 'bg-amber-400/60 hover:bg-amber-300';

  const visibleTracks = tracks.slice(0, FOCUS_MAX_TRACKS);
  const hiddenTrackCount = Math.max(0, tracks.length - FOCUS_MAX_TRACKS);
  const hiddenItemCount = tracks
    .slice(FOCUS_MAX_TRACKS)
    .reduce((sum, track) => sum + track.length, 0);
  const trackStep = 13;

  return (
    <div>
      <div className="relative" style={{ height: visibleTracks.length * trackStep + 28 }}>
        {/* 年龄网格 */}
        {Array.from({ length: span + 1 }, (_, i) => from + i)
          .filter((a) => a % 5 === 0)
          .map((a) => (
            <div key={a} className="absolute top-6 bottom-0 w-px bg-border/60" style={{ left: `${((a - from) / span) * 100}%` }}>
              <span className="absolute -top-1 left-1 -translate-y-full text-[10px] font-mono text-muted-foreground/60 tabular-nums">{a}</span>
            </div>
          ))}

        {/* 当前年龄线 */}
        <div className="absolute top-6 bottom-0 w-0.5 bg-red-500/70 z-10" style={{ left: `${((age - from) / span) * 100}%` }} />

        {/* 色带 */}
        {visibleTracks.map((track, t) =>
          track.map((w) => {
            const left = ((Math.max(w.range.start, from) - from) / span) * 100;
            const width = ((Math.min(w.range.end, to) - Math.max(w.range.start, from)) / span) * 100;
            return (
              <div
                key={w.id}
                title={`${w.title}（${w.age}岁）`}
                onClick={() => document.getElementById(`me-win-${w.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className={cn(
                'absolute h-2 rounded-full cursor-pointer transition-colors group',
                  barColor(w),
                  marks[w.id] && 'opacity-40'
                )}
                style={{ left: `${left}%`, width: `${Math.max(width, 1.2)}%`, top: 28 + t * trackStep }}
              />
            );
          })
        )}
      </div>
      {hiddenTrackCount > 0 && (
        <div className="mt-2 flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
          <span>DENSE · 另有 {hiddenItemCount} 个窗口被收纳</span>
          <span>密集时段已压缩显示</span>
        </div>
      )}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground mt-1">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500/80 inline-block" /> 正在开启</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> 即将关闭</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400/60 inline-block" /> 尚未到来</span>
        <span className="text-muted-foreground/60">点击色带跳到对应窗口</span>
      </div>
    </div>
  );
}

/* ============ 主页面 ============ */

type TabKey = 'open' | 'missed' | 'future';

export default function MePage() {
  const [age, setAge] = useState<number | null>(null);
  const [tab, setTab] = useState<TabKey>('open');
  const [missedShowAll, setMissedShowAll] = useState(false);
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

  // 读全局年龄（兼容旧 me-age 键：首次读取时迁移）
  useEffect(() => {
    const legacy = localStorage.getItem(LEGACY_AGE_KEY);
    const primary = localStorage.getItem(AGE_STORAGE_KEY);
    const raw = primary ?? legacy;
    const parsed = raw ? parseInt(raw, 10) : NaN;
    const v = !Number.isNaN(parsed) && parsed >= 0 && parsed <= MAX_AGE ? parsed : 28;
    setAge(v);
    if (!primary && legacy) {
      try { localStorage.setItem(AGE_STORAGE_KEY, String(v)); } catch { /* ignore */ }
    }
  }, []);

  const updateAge = (v: number) => {
    setAge(v);
    try { localStorage.setItem(AGE_STORAGE_KEY, String(v)); } catch { /* ignore */ }
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
  const futureList = futureListAll.slice(0, 8);
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

  if (age === null) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero：年龄选择 + 钩子 */}
      <section className="relative overflow-hidden border-b border-border grain-texture">
        {/* 48px 细网格 */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/[0.07] blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* HUD 行 */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
            {/* ★ 不是 01–07，从 module-identity 取，别手写编号 */}
            <span className="font-mono text-[10px] tracking-[0.2em] text-primary/70 shrink-0">
              {TIMELINE_IDENTITY.tag} {TIMELINE_IDENTITY.note}
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">YOUR TIMELINE · N=473</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight leading-[1.1] mb-4 animate-fade-in-up stagger-1">
            {openTotal > 0 ? (
              <><span className="text-primary tabular-nums">{age}</span> 岁 ·
              <br className="sm:hidden" />
              <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{openTotal}</span> 扇门正在开启</>
            ) : (
              <>拖动下面的滑块，看看你的人生时间轴</>
            )}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl animate-fade-in-up stagger-2">
            {urgentTotal > 0 ? (
              <>其中 <span className="font-semibold text-red-600 dark:text-red-400 tabular-nums">{urgentTotal}</span> 扇将在 5 年内关上——
              人生窗口不是隐喻，是发展心理学里真实存在的时机。</>
            ) : (
              <>473 个人生窗口里，正在开启的、已经关上的、还没来的——都在下面。</>
            )}
          </p>

          {/* 仪表读数行（年龄在下方控制台里调，这里不重复显示） */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground/60 animate-fade-in-up stagger-3">
            <span>OPEN <b className="text-emerald-600 dark:text-emerald-400 tabular-nums">{openTotal}</b></span>
            <span>URGENT <b className="text-red-500 tabular-nums">{urgentTotal}</b></span>
            <span>MISSED <b className="text-muted-foreground tabular-nums">{missedTotal}</b></span>
            <span>FUTURE <b className="text-foreground/80 tabular-nums">{futureTotal}</b></span>
            {markedCount > 0 && (
              <span className="text-primary/80">已表态 <b className="tabular-nums">{markedCount}</b></span>
            )}
            <span className="hidden sm:inline">SRC windows.ts · N=473</span>
          </div>

          {/* 年龄滑块：控制台 */}
          <div className="relative mt-8 rounded-xl border border-border bg-card p-5 sm:p-6 animate-fade-in-up stagger-4">
            <HudCorners />

            <div className="flex items-baseline justify-between mb-4">
              <span id="me-age-label" className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                CTRL · 01 你的年龄
              </span>
              <div className="text-right">
                <span className="text-3xl font-serif font-bold text-primary tabular-nums">{age}</span>
                <span className="text-xs text-muted-foreground ml-1">岁</span>
                <span className="text-[10px] text-muted-foreground/50 ml-2 font-mono">≈{CURRENT_YEAR - age} 年生</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={MAX_AGE}
              value={age}
              onChange={(e) => updateAge(parseInt(e.target.value, 10))}
              className="w-full accent-primary cursor-pointer"
              aria-labelledby="me-age-label"
              aria-valuetext={`${age} 岁`}
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground/50 tabular-nums mt-1.5">
              <span>0</span><span>25</span><span>50</span><span>75</span><span>{MAX_AGE}</span>
            </div>
            <p className="mt-3 pt-3 border-t border-border/60 font-mono text-[9px] text-muted-foreground/40">
              SYNC · 此年龄全局生效：/user 偏好、/windows 年龄筛选、首页图表指针共用同一个值
            </p>
          </div>
        </div>
      </section>

      {/* 概览直方图 + 聚焦轨道 */}
      {/* ===== 现在最该看的三类：聚焦，不把几十张卡平铺 ===== */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-8 sm:py-10">
        <div className="flex items-baseline justify-between border-b border-border pb-3 mb-5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-[10px] tracking-[0.15em] text-primary/70">FOCUS</span>
            <h2 className="text-sm font-semibold text-foreground">现在最该看的三类</h2>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/50">
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
              listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
          </Reveal>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up">
            <PanelHead fig="FIG. 02" title="全人生窗口密度" note={`N=${all.length} · 5 岁/桶`} />
            <OverviewBars age={age} windows={all} />
          </div>
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up stagger-2">
            <PanelHead
              fig="FIG. 03"
              title="你身边 ±15 年的窗口"
              note={`AGE ${Math.max(0, age - 8)}–${age + 15} · ${
                all.filter((w) => w.range.start <= age + 15 && w.range.end >= age - 8 && w.state !== 'missed').length
              } 条`}
            />
            <FocusTracks age={age} windows={all} />
          </div>
        </div>
      </section>

      {/* 三档清单 */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pb-16" ref={listRef}>
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5 animate-fade-in-up">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setOpenShowAll(false); setMissedShowAll(false); setUrgentShowAll(false); setShowMarked(false); }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                tab === t.key
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              )}
            >
              {t.icon}
              {t.label}
              <span className={cn('tabular-nums font-mono', tab === t.key ? 'text-primary-foreground/80' : 'text-muted-foreground/60')}>
                {t.count}
              </span>
            </button>
          ))}
          {markedCount > 0 && (
            <button
              onClick={clearAll}
              title="清除全部表态，清单恢复原样"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.06] px-3 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <ListChecks className="h-3.5 w-3.5" />
              已表态 <span className="tabular-nums">{markedCount}</span> 个 · 全部清除
            </button>
          )}
        </div>

        {/* 正在开启：紧急的置顶全显，其余默认只看最近 8 个 */}
        {tab === 'open' && (
          <div className="space-y-4 animate-fade-in">
            {openList.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                {openMarked.length > 0
                  ? '这一档都表态完了——往下能看到已表态的那些。'
                  : '这个年龄段没有正在开启的窗口——往上看看「尚未到来」的。'}
              </div>
            )}
            {urgentList.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-4 w-4 text-red-500" />
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
          </div>
        )}

        {/* 已经错过 */}
        {tab === 'missed' && (
          <div className="space-y-4 animate-fade-in">
            {missedPermanent.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-semibold text-foreground">
                    永久关闭的 <span className="tabular-nums">{missedPermanent.length}</span> 个
                    <span className="text-xs text-muted-foreground font-normal ml-2">关上就是关上了</span>
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {(missedShowAll ? missedPermanent : missedPermanent.slice(0, 5)).map((w) => (
                    <WindowCard key={w.id} w={w} />
                  ))}
                </div>
                {missedPermanent.length > 5 && (
                  <button
                    onClick={() => setMissedShowAll(!missedShowAll)}
                    className="mt-3 w-full rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    {missedShowAll ? '收起' : `展开其余 ${missedPermanent.length - 5} 个永久关闭的窗口`}
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
                {(missedShowAll ? missedOther : missedOther.slice(0, 10)).map((w) => (
                  <WindowCard key={w.id} w={w} />
                ))}
              </div>
              {missedOther.length > 10 && (
                <button
                  onClick={() => setMissedShowAll(!missedShowAll)}
                  className="mt-3 w-full rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {missedShowAll ? '收起' : `展开其余 ${missedOther.length - 10} 个`}
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
              查看全部 473 个窗口
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
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
          <div className="flex items-start gap-3 max-w-2xl">
            <Lock className="h-4 w-4 text-primary/60 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground/80 leading-relaxed font-serif">
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
