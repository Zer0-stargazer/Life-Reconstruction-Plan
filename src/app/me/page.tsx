'use client';

/**
 * /me —— 你的人生时间轴
 *
 * 个性化主线入口：输入年龄 → 从 473 个人生窗口里筛出
 * "正在开启 / 已经错过 / 尚未到来"，把一个平铺数据库
 * 变成一张"与我有关的地图"。
 *
 * 纯前端计算，年龄存 localStorage('me-age')。
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { lifeWindows, type LifeWindow, REMEDY_LEVEL_CONFIG, MISS_TYPE_CONFIG, LOCK_FORCE_LABELS } from '@/data/windows';
import { cn } from '@/lib/utils';
import {
  Flame, Hourglass, CheckCircle2, CalendarClock, ChevronDown, ChevronRight,
  ArrowRight, Lock, Sparkles, AlertTriangle, Info,
} from 'lucide-react';

/* ============ 工具 ============ */

const CURRENT_YEAR = new Date().getFullYear();
const MAX_AGE = 100;
const AGE_STORAGE_KEY = 'me-age';

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

/* ============ 小组件 ============ */

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
  const remedy = REMEDY_LEVEL_CONFIG[w.remedyLevel];
  const miss = MISS_TYPE_CONFIG[w.missType];
  const lock = LOCK_FORCE_LABELS[w.lockForceScore] ?? null;

  const stateStyle =
    w.state === 'urgent'
      ? 'border-l-red-500'
      : w.state === 'open'
        ? 'border-l-emerald-500'
        : w.state === 'missed'
          ? 'border-l-muted-foreground/20'
          : 'border-l-amber-400';

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card border-l-4 overflow-hidden transition-shadow hover:shadow-sm',
        stateStyle
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-semibold text-muted-foreground tabular-nums">
              {w.range.start}
              {w.range.end < 200 ? `-${w.range.end}` : '+'}岁
            </span>
            <h4 className="text-sm font-semibold text-foreground">{w.title}</h4>
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

  return (
    <div>
      <div className="relative h-28 flex items-end gap-[3px]">
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
      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500/70 inline-block" /> 可及窗口密度</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-muted-foreground/15 inline-block" /> 已错过密度</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2.5 bg-red-500/80 inline-block" /> 你的位置</span>
      </div>
    </div>
  );
}

/* ============ 聚焦轨道图（当前年龄附近） ============ */

const FOCUS_BEFORE = 8;
const FOCUS_AFTER = 15;

function FocusTracks({ age, windows }: { age: number; windows: ClassifiedWindow[] }) {
  const from = Math.max(0, age - FOCUS_BEFORE);
  const to = age + FOCUS_AFTER;
  const span = to - from;

  const inView = windows
    .filter((w) => w.range.start <= to && w.range.end >= from && w.state !== 'missed')
    .sort((a, b) => a.range.start - b.range.start || a.range.end - b.range.end);

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

  return (
    <div>
      <div className="relative" style={{ height: tracks.length * 18 + 28 }}>
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
        {tracks.map((track, t) =>
          track.map((w) => {
            const left = ((Math.max(w.range.start, from) - from) / span) * 100;
            const width = ((Math.min(w.range.end, to) - Math.max(w.range.start, from)) / span) * 100;
            return (
              <div
                key={w.id}
                title={`${w.title}（${w.age}岁）`}
                onClick={() => document.getElementById(`me-win-${w.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className={cn(
                  'absolute h-2.5 rounded-full cursor-pointer transition-colors group',
                  barColor(w)
                )}
                style={{ left: `${left}%`, width: `${Math.max(width, 1.2)}%`, top: 28 + t * 18 }}
              />
            );
          })
        )}
      </div>
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
  const listRef = useRef<HTMLDivElement>(null);

  // 读 localStorage
  useEffect(() => {
    const stored = localStorage.getItem(AGE_STORAGE_KEY);
    const parsed = stored ? parseInt(stored, 10) : NaN;
    setAge(!Number.isNaN(parsed) && parsed >= 0 && parsed <= MAX_AGE ? parsed : 28);
  }, []);

  const updateAge = (v: number) => {
    setAge(v);
    try { localStorage.setItem(AGE_STORAGE_KEY, String(v)); } catch { /* ignore */ }
  };

  const all = useMemo(() => (age === null ? [] : classify(age)), [age]);

  const openList = useMemo(
    () => all.filter((w) => w.state === 'open' || w.state === 'urgent')
      .sort((a, b) => (a.yearsLeft ?? 999) - (b.yearsLeft ?? 999)),
    [all]
  );
  const urgentList = useMemo(() => openList.filter((w) => w.state === 'urgent'), [openList]);
  const missedPermanent = useMemo(
    () => all.filter((w) => w.state === 'missed' && w.missType === 'permanent')
      .sort((a, b) => a.range.end - b.range.end),
    [all]
  );
  const missedOther = useMemo(
    () => all.filter((w) => w.state === 'missed' && w.missType !== 'permanent')
      .sort((a, b) => b.range.end - a.range.end),
    [all]
  );
  const futureList = useMemo(
    () => all.filter((w) => w.state === 'future').sort((a, b) => a.range.start - b.range.start).slice(0, 8),
    [all]
  );

  const tabs: { key: TabKey; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'open', label: '正在开启', count: openList.length, icon: <Flame className="h-3.5 w-3.5" /> },
    { key: 'missed', label: '已经错过', count: all.filter((w) => w.state === 'missed').length, icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    { key: 'future', label: '尚未到来', count: all.filter((w) => w.state === 'future').length, icon: <CalendarClock className="h-3.5 w-3.5" /> },
  ];

  if (age === null) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero：年龄选择 + 钩子 */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <div className="animate-fade-in-up">
            <span className="text-[10px] text-muted-foreground/60 tracking-[0.25em] uppercase font-mono">YOUR TIMELINE</span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight mt-3 mb-2">
              {openList.length > 0 ? (
                <>你今年 <span className="text-primary tabular-nums">{age}</span> 岁，
                <br className="sm:hidden" />
                此刻有 <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{openList.length}</span> 扇门正开着</>
              ) : (
                <>拖动下面的滑块，看看你的人生时间轴</>
              )}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {urgentList.length > 0 ? (
                <>其中 <span className="font-semibold text-red-600 dark:text-red-400 tabular-nums">{urgentList.length}</span> 扇将在 5 年内关上——
                人生窗口不是隐喻，是发展心理学里真实存在的时机。</>
              ) : (
                <>473 个人生窗口里，正在开启的、已经关上的、还没来的——都在下面。</>
              )}
            </p>
          </div>

          {/* 年龄滑块 */}
          <div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6 animate-fade-in-up stagger-2">
            <div className="flex items-baseline justify-between mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">你的年龄</label>
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
              className="w-full accent-red-500 cursor-pointer"
              aria-label="选择年龄"
            />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground/50 tabular-nums mt-1.5">
              <span>0</span><span>25</span><span>50</span><span>75</span><span>{MAX_AGE}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 概览直方图 + 聚焦轨道 */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">全人生窗口密度</h2>
            </div>
            <OverviewBars age={age} windows={all} />
          </div>
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                你身边 ±15 年的窗口
              </h2>
            </div>
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
              onClick={() => setTab(t.key)}
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
        </div>

        {/* 正在开启 */}
        {tab === 'open' && (
          <div className="space-y-2.5 animate-fade-in">
            {openList.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                这个年龄段没有正在开启的窗口——往上看看「尚未到来」的。
              </div>
            )}
            {openList.map((w) => <WindowCard key={w.id} w={w} />)}
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
