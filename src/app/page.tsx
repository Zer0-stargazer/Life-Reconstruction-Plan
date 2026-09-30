'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ArrowRight, Flame, ChevronDown, Hourglass
} from 'lucide-react';
import { WindowDensityChart } from '@/components/home/window-density-chart';
import { WINDOW_DENSITY_META } from '@/data/window-density';
import { MODULE_IDENTITIES, TIMELINE_IDENTITY } from '@/lib/module-identity';
import { Reveal } from '@/components/shared/reveal';

/** 全站数据点总数：288 规律 + 473 窗口 + 250 运气 + 757 职业 = 1,768 */
const TOTAL_DATA_POINTS = 288 + 473 + 250 + 757;

function AnimatedNumber({ target, className }: { target: number; className?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const step = (t: number) => {
            const p = Math.min((t - start) / 1000, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {count.toLocaleString('en-US')}
    </span>
  );
}

const quotes = [
  { text: '命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式。' },
  { text: '大多数人把所有精力花在如何更努力地出牌上，却从没看过自己手里到底有什么牌。' },
];

const faqs = [
  { q: '这是算命吗？', a: '不是。这是一个基于概率和数据的决策框架。我们不预测未来，我们帮你计算概率、识别窗口。' },
  { q: '数据来源是什么？', a: '数据来自发展心理学、职业研究、社会流动性研究等学术文献的综合整理。' },
  { q: '我应该从哪个模块开始？', a: '建议先看"窗口"模块——了解你当前处于哪些关键时机，然后通过"运气"模块区分可控与不可控因素。' },
];

/** 小节头：编号 eyebrow + 细线 + 标题 + 描述 */
function SectionHead({ index, title, desc }: { index: string; title: string; desc?: string }) {
  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-primary/60">{index}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">{title}</h2>
      {desc && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}

/**
 * 模块导览卡。
 *
 * 视觉主角是「这个模块能回答什么问题」，不是数据量——
 * 用户不关心你有 288 条规律，只关心这能帮他什么。
 */
function ModuleCard({ m, wide = false }: { m: (typeof MODULE_IDENTITIES)[number]; wide?: boolean }) {
  const Icon = m.icon;
  return (
    <Link
      href={m.href}
      className={cn(
        'group relative flex h-full flex-col rounded-xl border border-border bg-card p-5',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.04]',
        m.ring,
        wide && 'sm:flex-row sm:items-center sm:gap-6'
      )}
    >
      {/* 顶：图标 + 数据量 */}
      <div className={cn('flex items-start justify-between', wide ? 'sm:w-auto' : 'mb-4')}>
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
            'transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6',
            m.iconGradient
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className={cn('text-right font-mono leading-none', wide ? 'hidden' : 'block')}>
          <b className="block text-sm font-bold text-foreground/85">{m.metric}</b>
          <span className="text-[9px] text-muted-foreground/50 tracking-wider">{m.unit}</span>
        </span>
      </div>

      <div className={cn('min-w-0', wide && 'flex-1')}>
        {/* 编号 + 名称 */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className={cn('font-mono text-[10px] tracking-[0.15em]', m.tagColor)}>{m.tag}</span>
          <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            {m.title}
          </h3>
        </div>

        {/* 核心：能回答的问题 */}
        <p className={cn(
          'font-semibold text-foreground/90 leading-snug',
          wide ? 'text-base sm:text-lg' : 'text-[15px]'
        )}>
          {m.question}
        </p>

        <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">{m.desc}</p>
      </div>

      {/* 底：进去了 */}
      <div className={cn(
        'flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/50 transition-colors group-hover:text-primary',
        wide ? 'mt-4 sm:mt-0 sm:shrink-0' : 'mt-4'
      )}>
        进去看看
        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

/** KPI 格：数字滚动到位 */
function Kpi({ value, label, hint }: { value: number; label: string; hint?: string }) {
  return (
    <div className="px-6 sm:px-8 py-5">
      <AnimatedNumber
        target={value}
        className="block font-serif text-3xl sm:text-4xl font-bold text-foreground leading-none"
      />
      <div className="mt-2 text-xs text-muted-foreground">{label}</div>
      {hint && <div className="mt-1 font-mono text-[10px] text-primary/60">{hint}</div>}
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const meta = WINDOW_DENSITY_META;

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HUD 状态栏 ===== */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground/60 tracking-wide">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-foreground/70">LIFE REBOOT PLAN</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span>07 MODULES</span>
            <span className="hidden sm:inline">{TOTAL_DATA_POINTS.toLocaleString('en-US')} DATA POINTS</span>
            <span className="hidden md:inline">BUILD v1.0</span>
          </div>
        </div>
      </div>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden border-b border-border grain-texture">
        {/* 细网格 */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/[0.07] blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* 左：文案 */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Flame className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground/60 tracking-[0.25em] uppercase font-mono">
                    Life Reboot Plan
                  </span>
                  <span className="text-[10px] text-muted-foreground/40 tracking-wide font-mono">
                    人生作战室 · v1.0
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight leading-[1.06] mb-5 animate-fade-in-up stagger-1">
                人生重构计划
              </h1>

              <p className="text-lg sm:text-xl text-foreground/80 max-w-md leading-snug mb-4 animate-fade-in-up stagger-2 font-serif">
                如果人生是一场策略游戏，你是先看攻略，还是硬闯？
              </p>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-8 animate-fade-in-up stagger-3">
                七大维度拆解命运——从名字的隐性暗示到运气的概率结构，
                每个模块都是一张人生作战地图。不是算命，是算概率。
              </p>

              <div className="flex flex-wrap items-center gap-3 animate-fade-in-up stagger-4">
                <Link
                  href="/me"
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 btn-press"
                >
                  看看你的人生时间轴
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/windows"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-accent/40 btn-press"
                >
                  浏览 473 个人生窗口
                </Link>
              </div>
            </div>

            {/* 右：七大模块索引 —— 第一屏就说清这产品有哪七块 */}
            <div className="lg:col-span-7 animate-fade-in-up stagger-3">
              <div className="relative rounded-xl border border-border bg-card/70 backdrop-blur-sm p-3 sm:p-4 shadow-sm">
                {/* 面板头 */}
                <div className="flex items-baseline justify-between border-b border-border pb-2.5 mb-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-primary/70">MAP · 01–07</span>
                    <h2 className="text-sm font-semibold text-foreground">七大模块</h2>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/50">
                    身份 → 赛道 → 认知 → 时机 → 推演 → 风险 → 报告
                  </span>
                </div>

                <div className="divide-y divide-border/60">
                  {MODULE_IDENTITIES.map((m) => {
                    const Icon = m.icon;
                    return (
                      <Link
                        key={m.href}
                        href={m.href}
                        className="group flex items-center gap-3 py-[7px] px-1 -mx-1 rounded-md transition-colors hover:bg-primary/[0.05]"
                      >
                        <span
                          className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-sm transition-transform duration-200 group-hover:scale-110',
                            m.iconGradient
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className={cn('font-mono text-[10px] tabular-nums shrink-0', m.tagColor)}>
                          {m.tag}
                        </span>
                        <span className="w-8 shrink-0 text-[13px] font-semibold text-foreground">
                          {m.title}
                        </span>
                        <span className="flex-1 min-w-0 truncate text-[12px] text-muted-foreground transition-colors group-hover:text-foreground/80">
                          {m.question}
                        </span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2.5 border-t border-border flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted-foreground/60">
                  <span>{TOTAL_DATA_POINTS.toLocaleString('en-US')} DATA POINTS</span>
                  <span className="text-border">|</span>
                  <Link href="/me" className="text-primary/80 hover:text-primary transition-colors">
                    先看看我这个年纪该做什么 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 七个模块导览 ===== */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <SectionHead
          index="MODULES · 01–07"
          title="七个模块，回答七个问题"
          desc="从你出生时被写下的名字，到命运的综合牌面——按顺序走一遍，就是一个完整的自我盘点。"
        />

        {/* 01–06：模块卡 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULE_IDENTITIES.slice(0, 6).map((m, i) => (
            <Reveal key={m.href} delay={i * 70}>
              <ModuleCard m={m} />
            </Reveal>
          ))}
        </div>

        {/* 07 命运：压轴全宽——它本来就是前六项的汇总 */}
        <Reveal delay={420} className="mt-4">
          <ModuleCard m={MODULE_IDENTITIES[6]} wide />
        </Reveal>

        {/* 个性化主线：从这开始 */}
        <Reveal delay={480} className="mt-4">
          <Link
            href={TIMELINE_IDENTITY.href}
            className="group relative block overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.07] via-primary/[0.03] to-transparent p-6 sm:p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
          >
            <span className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-[7rem] font-bold leading-none text-primary/[0.05]">
              ★
            </span>
            <div className="relative flex items-center gap-5 sm:gap-6">
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
                <Hourglass className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-base sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    不知道从哪看起？先看你这个年纪
                  </h3>
                  <span className="rounded-full bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-semibold text-primary shrink-0">
                    从这开始
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  拖一下年龄滑块——473 个人生窗口里，哪些正为你开着、哪些已经关上、哪些马上要关。
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
            </div>
          </Link>
        </Reveal>
      </section>

      {/* ===== 关键发现：窗口都集中在哪 ===== */}
      <section className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
          <SectionHead index="FIG. 01" title="机会窗口，集中在前 45 年" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 左：KPI + 结论 */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 divide-x divide-y divide-border rounded-xl border border-border overflow-hidden">
                <Kpi value={meta.total} label="个人生窗口" hint="WINDOWS" />
                <Kpi value={meta.before45} label="45 岁前开启" hint="AGE < 45" />
                <Kpi value={meta.after45} label="45 岁后剩余" hint="AGE ≥ 45" />
                <Kpi value={meta.peak.count} label="单区间峰值密度" hint={`${meta.peak.from}–${meta.peak.to} 岁`} />
              </div>
              <p className="mt-5 text-sm text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">
                  45 岁之前有 {meta.before45} 扇门，45 岁之后只剩 {meta.after45} 扇。
                </span>
                <span className="text-muted-foreground">
                  {' '}人生 {Math.round((meta.before45 / meta.total) * 100)}% 的机会窗口，集中在前 45 年——
                  而大多数人要到 35 岁才开始认真看牌面。
                </span>
              </p>
              <Link
                href="/me"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
              >
                定位我的年龄
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 右：密度图 */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-border bg-background/40 p-4 sm:p-5">
                <div className="flex items-baseline justify-between border-b border-border pb-2.5 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">人生窗口密度分布</h3>
                  <span className="font-mono text-[10px] text-muted-foreground/50">
                    N={meta.total} · 5 岁/桶
                  </span>
                </div>
                <WindowDensityChart />
                <div className="mt-3 pt-2.5 border-t border-border font-mono text-[10px] text-muted-foreground/60">
                  PEAK {meta.peak.from}–{meta.peak.to} 岁 · {meta.peak.count} 个窗口
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 核心洞察 ===== */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <SectionHead index="INSIGHT" title="核心洞察" />
          <div className="max-w-3xl space-y-8 animate-fade-in-up stagger-2">
            {quotes.map((q, i) => (
              <figure key={i} className="relative pl-6 sm:pl-8">
                <span className="absolute left-0 top-0 select-none font-serif text-4xl leading-none text-primary/30">
                  &ldquo;
                </span>
                <blockquote className="font-serif text-lg sm:text-xl text-foreground/85 leading-relaxed">
                  {q.text}
                </blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-t border-border bg-muted/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
          <SectionHead index="FAQ" title="常见问题" />
          <div className="max-w-2xl space-y-2.5">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-xl border bg-card overflow-hidden transition-colors duration-200',
                  openFaq === i ? 'border-primary/25' : 'border-border hover:border-primary/20'
                )}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    openFaq === i && 'rotate-180 text-primary'
                  )} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 animate-fade-in">
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-muted-foreground/50">
          <span className="font-serif text-xs">人生重构计划 · 不是算命，是算概率</span>
          <span>{TOTAL_DATA_POINTS.toLocaleString('en-US')} DATA POINTS · v1.0</span>
        </div>
      </footer>
    </div>
  );
}
