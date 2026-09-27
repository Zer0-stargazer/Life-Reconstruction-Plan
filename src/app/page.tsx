'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  PenTool, Briefcase, Compass, SlidersHorizontal,
  Clock, Dice5, ArrowRight, Flame, ChevronDown, Scale, Hourglass
} from 'lucide-react';

const modules = [
  {
    href: '/name', icon: PenTool, tag: '01', title: '名字',
    desc: '一个好名字是人生的第一张牌', color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'hover:border-amber-200 dark:hover:border-amber-800/40',
  },
  {
    href: '/career', icon: Briefcase, tag: '02', title: '职业',
    desc: '你选的赛道决定了上限', color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'hover:border-blue-200 dark:hover:border-blue-800/40',
  },
  {
    href: '/destiny', icon: Compass, tag: '03', title: '命运',
    desc: '命是天注定的，运是自己挣的', color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'hover:border-purple-200 dark:hover:border-purple-800/40',
  },
  {
    href: '/laws', icon: Scale, tag: '04', title: '规律',
    desc: '混沌系统中的确定性齿轮', color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'hover:border-orange-200 dark:hover:border-orange-800/40',
  },
  {
    href: '/simulation', icon: SlidersHorizontal, tag: '05', title: '努力',
    desc: '切换维度才是破局', color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'hover:border-green-200 dark:hover:border-green-800/40',
  },
  {
    href: '/windows', icon: Clock, tag: '06', title: '窗口',
    desc: '人生的转折点只开一瞬', color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'hover:border-rose-200 dark:hover:border-rose-800/40',
  },
  {
    href: '/luck', icon: Dice5, tag: '07', title: '运气',
    desc: '运气是概率，但你可以改变概率', color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'hover:border-cyan-200 dark:hover:border-cyan-800/40',
  },
];

const stats = [
  { value: 288, label: '条人生规律', suffix: '' },
  { value: 473, label: '个人生窗口', suffix: '' },
  { value: 250, label: '个运气因子', suffix: '' },
  { value: 1535, label: '种职业分析', suffix: '' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 800;
          const start = 0;
          const diff = target;
          const startTime = performance.now();

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(start + diff * eased));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-serif font-bold text-primary tabular-nums">{count}</span>
        <span className="text-xs text-muted-foreground">{suffix}{stats.find(s => s.value === target)?.label}</span>
      </div>
    </div>
  );
}

const quotes = [
  { text: '命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式。', author: '' },
  { text: '大多数人把所有精力花在如何更努力地出牌上，却从没看过自己手里到底有什么牌。', author: '' },
];

const faqs = [
  { q: '这是算命吗？', a: '不是。这是一个基于概率和数据的决策框架。我们不预测未来，我们帮你计算概率、识别窗口。' },
  { q: '数据来源是什么？', a: '数据来自发展心理学、职业研究、社会流动性研究等学术文献的综合整理。' },
  { q: '我应该从哪个模块开始？', a: '建议先看"窗口"模块——了解你当前处于哪些关键时机，然后通过"运气"模块区分可控与不可控因素。' },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border grain-texture">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />
        {/* Warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                <Flame className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground/60 tracking-[0.25em] uppercase font-mono">LIFE REBOOT PLAN</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight leading-[1.15] mb-5 animate-fade-in-up stagger-1">
            人生重构计划
          </h1>

          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl leading-relaxed mb-2 animate-fade-in-up stagger-2 font-serif">
            如果人生是一场策略游戏，你是先看攻略还是硬闯？
          </p>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed mb-8 animate-fade-in-up stagger-3">
            六大维度拆解命运——从名字的隐性暗示到运气的概率结构，
            每个模块都是一张人生作战地图。不是算命，是算概率。
          </p>

          <div className="flex items-center gap-3 animate-fade-in-up stagger-4">
            <Link
              href="/me"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md btn-press"
            >
              看看你的人生时间轴
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/windows"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:shadow-sm btn-press"
            >
              浏览 473 个人生窗口
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <AnimatedCounter key={i} target={stat.value} suffix={stat.suffix} />
            ))}
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div>
            <h2 className="text-xl font-serif font-semibold text-foreground">作战模块</h2>
            <p className="text-sm text-muted-foreground mt-0.5">六大维度，拆解你的人生</p>
          </div>
        </div>

        {/* 个性化主线入口（全宽重点卡） */}
        <Link
          href="/me"
          className="group relative block overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-transparent p-5 sm:p-6 mb-3 transition-all duration-200 hover:border-primary/40 hover:shadow-md animate-fade-in-up"
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform duration-200 group-hover:scale-105">
              <Hourglass className="h-6 w-6" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                NEW
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">你的人生时间轴</h3>
                <span className="rounded-full bg-red-500/10 border border-red-500/25 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">从这开始</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                拖一下年龄滑块——473 个人生窗口里，哪些正为你开着、哪些已经关上、哪些马上要关。
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={cn(
                  'group relative flex items-start gap-4 rounded-lg border border-border bg-card p-4 sm:p-5 transition-all duration-200 card-hover',
                  m.border,
                  'animate-fade-in-up',
                  idx < 8 ? `stagger-${idx + 1}` : ''
                )}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${m.bg} ${m.color} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">{m.tag}</span>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{m.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary/60 transition-all duration-200 mt-1 group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Core Insight */}
      <section className="border-t border-border bg-muted/15">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="text-xl font-serif font-semibold text-foreground mb-5 animate-fade-in-up">核心洞察</h2>
            <div className="space-y-4 animate-fade-in-up stagger-2">
              {quotes.map((q, i) => (
                <div key={i} className="relative pl-5 border-l-2 border-primary/30">
                  <p className="text-sm text-foreground/80 leading-relaxed font-serif">
                    {q.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg border border-primary/10 bg-primary/[0.02] animate-fade-in-up stagger-3">
              <p className="text-sm text-foreground/90 font-medium font-serif">
                这个工具不做算命——它帮你看清牌面、计算概率、识别窗口。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-8 animate-fade-in-up">如何使用</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: '看清牌面', desc: '通过窗口和运气模块，识别你人生中哪些因素可控、哪些不可控。' },
              { step: '02', title: '计算概率', desc: '通过命运报告和模拟器，量化不同选择的预期结果。' },
              { step: '03', title: '把握窗口', desc: '识别人生的关键时机，在对的时间做对的决策。' },
            ].map((item, i) => (
              <div key={i} className={cn('animate-fade-in-up', `stagger-${i + 1}`)}>
                <span className="text-3xl font-mono font-bold text-primary/15 tabular-nums">{item.step}</span>
                <h3 className="text-sm font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/10">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
          <h2 className="text-lg font-serif font-semibold text-foreground mb-6">常见问题</h2>
          <div className="space-y-2 max-w-2xl">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-200',
                    openFaq === i && 'rotate-180'
                  )} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 animate-fade-in">
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/50 font-serif">
            人生重构计划 · 不是算命，是算概率
          </p>
          <p className="text-[10px] text-muted-foreground/30 font-mono tabular-nums">v1.0</p>
        </div>
      </footer>
    </div>
  );
}
