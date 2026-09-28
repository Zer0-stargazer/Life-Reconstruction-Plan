'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  WINDOW_DENSITY,
  WINDOW_CUMULATIVE,
  WINDOW_DENSITY_META,
} from '@/data/window-density';

/**
 * 人生窗口密度分布图（首页主视觉）
 *
 * 数据来自 src/data/windows.ts 的预聚合（473 条窗口，5 岁一桶）。
 * 两层信息：
 *  1. 堆叠柱：每桶按 past / current / future / elite 四个状态堆叠
 *  2. 累计曲线：到该年龄为止累计开启过的窗口占比
 * 叠加当前年龄指针（读 localStorage 的 default-age）。
 */

const W = 640;
const H = 216;
const PAD = { t: 30, r: 12, b: 28, l: 12 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;
const N = WINDOW_DENSITY.length;
const MAX_TOTAL = Math.max(...WINDOW_DENSITY.map((b) => b.total));
const TOTAL = WINDOW_DENSITY_META.total;

const BAR_GAP = 3;
const BAR_W = PLOT_W / N - BAR_GAP;

const barY = (v: number) => PLOT_H - (v / MAX_TOTAL) * PLOT_H;

/**
 * 柱心 x 坐标（**相对坐标**）。
 * 绘制时外层 <g> 已经 translate(PAD.l, PAD.t)，这里不能再加 PAD.l，
 * 否则曲线会整体右移、与柱子错开。
 */
const cxRel = (i: number) => i * (PLOT_W / N) + BAR_W / 2 + BAR_GAP / 2;

const SERIES = [
  { key: 'past', label: '已过', opacity: 0.22 },
  { key: 'current', label: '当前', opacity: 0.55 },
  { key: 'future', label: '未至', opacity: 0.32 },
  { key: 'elite', label: '精英', opacity: 1 },
] as const;

/** 累计曲线路径 */
const cumulativePath = WINDOW_CUMULATIVE.map((c, i) => {
  const x = cxRel(i);
  const y = PLOT_H - (c / TOTAL) * PLOT_H;
  return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
}).join(' ');

const areaPath = `${cumulativePath} L${cxRel(N - 1).toFixed(1)},${PLOT_H} L${cxRel(0).toFixed(1)},${PLOT_H} Z`;

/** 峰值桶下标 */
const PEAK_INDEX = Math.max(
  0,
  WINDOW_DENSITY.findIndex((b) => b.from === WINDOW_DENSITY_META.peak.from)
);

const X_TICKS = [0, 20, 40, 60, 80, 100];

export function WindowDensityChart() {
  const [hover, setHover] = useState<number | null>(null);
  const [age, setAge] = useState<number | null>(null);

  // 当前年龄指针：与 /user 页的「默认年龄」共用同一个 localStorage 键
  useEffect(() => {
    try {
      const v = localStorage.getItem('default-age');
      const n = v ? parseInt(v, 10) : NaN;
      setAge(isNaN(n) ? 28 : Math.min(100, Math.max(0, n)));
    } catch {
      setAge(28);
    }
  }, []);

  const ageX = useMemo(() => {
    if (age === null) return null;
    return PAD.l + (age / 100) * PLOT_W;
  }, [age]);

  /** 指针所在的桶，用来在 tooltip 里显示"你在这里" */
  const ageBucket = age === null ? null : Math.min(N - 1, Math.floor(age / 5));

  const hovered = hover !== null ? WINDOW_DENSITY[hover] : null;

  return (
    <div className="relative">
      {/* HUD 角标 */}
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-primary/40" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-primary/40" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-primary/40" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-primary/40" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="人生窗口密度分布图"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="wd-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 水平网格线 */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <line
            key={r}
            x1={PAD.l}
            x2={W - PAD.r}
            y1={PAD.t + PLOT_H * (1 - r)}
            y2={PAD.t + PLOT_H * (1 - r)}
            stroke="currentColor"
            strokeOpacity={0.07}
            strokeDasharray="2 4"
          />
        ))}

        <g transform={`translate(${PAD.l}, ${PAD.t})`}>
          {/* 堆叠柱 */}
          {WINDOW_DENSITY.map((b, i) => {
            const isHover = hover === i;
            let acc = 0;
            return (
              <g
                key={i}
                onMouseEnter={() => setHover(i)}
                style={{ cursor: 'default' }}
              >
                {/* hover 命中区（覆盖整列高度） */}
                <rect
                  x={i * (PLOT_W / N)}
                  y={0}
                  width={PLOT_W / N}
                  height={PLOT_H}
                  fill="transparent"
                />
                {isHover && (
                  <rect
                    x={i * (PLOT_W / N)}
                    y={0}
                    width={PLOT_W / N}
                    height={PLOT_H}
                    fill="currentColor"
                    fillOpacity={0.04}
                  />
                )}
                {SERIES.map((s) => {
                  const v = b[s.key as keyof typeof b] as number;
                  if (!v) return null;
                  const h = (v / MAX_TOTAL) * PLOT_H;
                  const y = PLOT_H - acc - h;
                  acc += h;
                  return (
                    <rect
                      key={s.key}
                      x={i * (PLOT_W / N) + BAR_GAP / 2}
                      y={y}
                      width={BAR_W}
                      height={Math.max(h, 0.8)}
                      fill="var(--primary)"
                      fillOpacity={isHover ? Math.min(1, s.opacity + 0.15) : s.opacity}
                      style={{ transition: 'fill-opacity 150ms ease' }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* 累计曲线 */}
          <path d={areaPath} fill="url(#wd-area)" />
          <path
            d={cumulativePath}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={1.25}
            strokeLinejoin="round"
          />

          {/* 峰值标注 */}
          <g>
            <circle
              cx={cxRel(PEAK_INDEX)}
              cy={barY(MAX_TOTAL)}
              r={2.5}
              fill="var(--primary)"
            />
            <text
              x={cxRel(PEAK_INDEX)}
              y={barY(MAX_TOTAL) - 7}
              textAnchor="middle"
              className="font-mono"
              fontSize={8}
              fill="var(--primary)"
            >
              {WINDOW_DENSITY_META.peak.count}
            </text>
          </g>

          {/* 当前年龄指针 */}
          {ageX !== null && (
            <g>
              <line
                x1={ageX - PAD.l}
                x2={ageX - PAD.l}
                y1={-6}
                y2={PLOT_H}
                stroke="var(--primary)"
                strokeWidth={1}
                strokeDasharray="3 3"
                strokeOpacity={0.8}
              />
              <polygon
                points={`${ageX - PAD.l - 3.5},-8 ${ageX - PAD.l + 3.5},-8 ${ageX - PAD.l},-3`}
                fill="var(--primary)"
              />
              <text
                x={ageX - PAD.l}
                y={-12}
                textAnchor="middle"
                className="font-mono"
                fontSize={9}
                fontWeight={600}
                fill="var(--primary)"
              >
                {age}岁
              </text>
            </g>
          )}

          {/* hover tooltip */}
          {hovered && hover !== null && (
            <g
              transform={`translate(${Math.min(
                Math.max(cxRel(hover), 46),
                PLOT_W - 46
              )}, 6)`}
              pointerEvents="none"
            >
              <rect
                x={-46}
                y={0}
                width={92}
                height={40}
                rx={4}
                fill="var(--card)"
                stroke="var(--border)"
              />
              <text x={0} y={13} textAnchor="middle" fontSize={9} className="font-mono" fill="currentColor" fillOpacity={0.9}>
                {hovered.from}–{hovered.to} 岁 · {hovered.total} 个
              </text>
              <text x={-38} y={27} fontSize={8} className="font-mono" fill="currentColor" fillOpacity={0.55}>
                当前 {hovered.current}
              </text>
              <text x={4} y={27} fontSize={8} className="font-mono" fill="currentColor" fillOpacity={0.55}>
                未至 {hovered.future}
              </text>
              <text x={-38} y={36} fontSize={8} className="font-mono" fill="currentColor" fillOpacity={0.55}>
                精英 {hovered.elite}
              </text>
              <text x={4} y={36} fontSize={8} className="font-mono" fill="currentColor" fillOpacity={0.55}>
                已过 {hovered.past}
              </text>
            </g>
          )}

          {/* x 轴刻度 */}
          {X_TICKS.map((t) => (
            <g key={t}>
              <line
                x1={(t / 100) * PLOT_W}
                x2={(t / 100) * PLOT_W}
                y1={PLOT_H + 3}
                y2={PLOT_H + 6}
                stroke="currentColor"
                strokeOpacity={0.25}
              />
              <text
                x={(t / 100) * PLOT_W}
                y={PLOT_H + 16}
                textAnchor={t === 0 ? 'start' : t === 100 ? 'end' : 'middle'}
                fontSize={9}
                className="font-mono"
                fill="currentColor"
                fillOpacity={0.45}
              >
                {t}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* 图例 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-[1px]"
              style={{ background: 'var(--primary)', opacity: Math.max(0.25, s.opacity) }}
            />
            <span className="font-mono text-[10px] text-muted-foreground/70">{s.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="h-px w-4 bg-foreground/40" />
          <span className="font-mono text-[10px] text-muted-foreground/70">累计占比</span>
        </div>
        {ageBucket !== null && age !== null && (
          <div className="ml-auto font-mono text-[10px] text-primary/80">
            你在「{WINDOW_DENSITY[ageBucket].from}–{WINDOW_DENSITY[ageBucket].to} 岁」区间 ·
            该区间 {WINDOW_DENSITY[ageBucket].total} 个窗口
          </div>
        )}
      </div>
    </div>
  );
}
