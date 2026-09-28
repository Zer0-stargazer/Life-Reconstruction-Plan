'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  PenTool, Briefcase, Compass, SlidersHorizontal,
  Clock, Dice5, ArrowRight, Flame, ChevronDown, Scale, Hourglass
} from 'lucide-react';

const modules = [
  { href: '/name', icon: PenTool, tag: '01', title: '名字', desc: '一个好名字是人生的第一张牌' },
  { href: '/career', icon: Briefcase, tag: '02', title: '职业', desc: '你选的赛道决定了上限' },
  { href: '/destiny', icon: Compass, tag: '03', title: '命运', desc: '命是天注定的，运是自己挣的' },
  { href: '/laws', icon: Scale, tag: '04', title: '规律', desc: '混沌系统中的确定性齿轮' },
  { href: '/simulation', icon: SlidersHorizontal, tag: '05', title: '努力', desc: '切换维度才是破局' },
  { href: '/windows', icon: Clock, tag: '06', title: '窗口', desc: '人生的转折点只开一瞬' },
  { href: '/luck', icon: Dice5, tag: '07', title: '运气', desc: '运气是概率，但你可以改变概率' },
];

const stats = [
  { value: 288, label: '条人生规律' },
  { value: 473, label: '个人生窗口' },
  { value: 250, label: '个运气因子' },
  { value: 1535, label: '种职业分析' },
];

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 900;
          const startTime = performance.now();

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));
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
    <div ref={ref} className="text-center sm:text-left">
      <div className="font-serif text-3xl sm:text-4xl font-bold text-primary tabular-nums leading-none tracking-tight">
        {count}
      </div>
      <div className="mt-2 text-xs text-muted-foreground tracking-wide">{label}</div>
    </div>
  );
}

/**
 * Hero 下方的"人生刻度轴"：0→100 岁按人生阶段切成几段。
 * 既是视觉锚点，也是通往 /me 的入口 —— 悬停某段会亮起。
 */
const LIFE_SPANS = [
  { label: '童年', from: 0, to: 12 },
  { label: '青少年', from: 13, to: 18 },
  { label: '青年起步', from: 19, to: 25 },
  { label: '壮年奋斗', from: 26, to: 35 },
  { label: '中年深耕', from: 36, to: 50 },
  { label: '成熟收获', from: 51, to: 65 },
  { label: '晚年', from: 66, to: 100 },
];

function LifeAxis() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <Link href="/me" className="group/axis block">
      <div className="flex items-end gap-2">
        {LIFE_SPANS.map((s, i) => {
          const span = s.to - s.from + 1;
          const active = hover === i;
          return (
            <div
              key={s.label}
              className="flex-1 cursor-pointer"
              style={{ flexGrow: span }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="mb-1.5 h-[3px] overflow-hidden rounded-full bg-foreground/10">
                <div
                  className={cn(
                    'h-full rounded-full bg-primary transition-all duration-300 ease-out',
                    active ? 'w-full' : 'w-0'
                  )}
                />
              </div>
              <div
                className={cn(
                  'h-8 rounded-sm border transition-all duration-200',
                  active
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-border bg-muted/40 group-hover/axis:bg-muted/70'
                )}
              />
              <div
                className={cn(
                  'mt-1.5 truncate text-[10px] transition-colors duration-200',
                  active ? 'text-primary' : 'text-muted-foreground/50'
                )}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground/70 transition-colors group-hover/axis:text-primary">
        <span>你在这条轴上的哪一段？</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/axis:translate-x-0.5" />
      </div>
    </Link>
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

/** 通用小节头：编号 eyebrow + 标题 + 可选描述 */
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

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border grain-texture">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />
        {/* Warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] via-primary/[0.02] to-transparent" />
        {/* 右下角柔光 */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-10">
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
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-foreground tracking-tight leading-[1.08] mb-6 animate-fade-in-up stagger-1">
            人生重构计划
          </h1>

          <p className="text-xl sm:text-2xl text-foreground/80 max-w-2xl leading-snug mb-4 animate-fade-in-up stagger-2 font-serif">
            如果人生是一场策略游戏，
            <br className="hidden sm:block" />
            你是先看攻略，还是硬闯？
          </p>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed mb-10 animate-fade-in-up stagger-3">
            六大维度拆解命运——从名字的隐性暗示到运气的概率结构，
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
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-accent/40 btn-press"
            >
              浏览 473 个人生窗口
            </Link>
          </div>

          {/* 人生刻度轴 */}
          <div className="mt-14 sm:mt-20 animate-fade-in-up stagger-5">
            <LifeAxis />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            {stats.map((stat, i) => (
              <AnimatedCounter key={i} target={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <SectionHead index="MODULES" title="作战模块" desc="六大维度，拆解你的人生" />

        {/* 个性化主线入口（全宽重点卡） */}
        <Link
          href="/me"
          className="group relative block overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.07] via-primary/[0.03] to-transparent p-6 sm:p-7 mb-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 animate-fade-in-up"
        >
          {/* 水印 */}
          <span className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-[7rem] font-bold leading-none text-primary/[0.05]">
            ★
          </span>
          <div className="relative flex items-center gap-5 sm:gap-6">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
              <Hourglass className="h-7 w-7" />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                NEW
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  你的人生时间轴
                </h3>
                <span className="rounded-full bg-red-500/10 border border-red-500/25 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 card-hover hover:border-primary/30',
                  'animate-fade-in-up',
                  idx < 8 ? `stagger-${idx + 1}` : ''
                )}
              >
                {/* 编号水印 */}
                <span className="pointer-events-none absolute -right-1 -top-3 select-none font-mono text-6xl font-bold leading-none text-foreground/[0.035] transition-colors duration-300 group-hover:text-primary/[0.09]">
                  {m.tag}
                </span>

                <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-foreground/70 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="relative mt-4 text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">
                  {m.title}
                </h3>
                <p className="relative mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>

                <div className="relative mt-4 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary">
                  进入模块
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Core Insight */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
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
          <div className="mt-10 max-w-3xl rounded-xl border border-primary/15 bg-primary/[0.03] p-5 sm:p-6 animate-fade-in-up stagger-3">
            <p className="font-serif text-base sm:text-lg text-foreground/90 leading-relaxed">
              这个工具不做算命——它帮你看清牌面、计算概率、识别窗口。
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <SectionHead index="HOW TO" title="如何使用" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
            {[
              { step: '01', title: '看清牌面', desc: '通过窗口和运气模块，识别你人生中哪些因素可控、哪些不可控。' },
              { step: '02', title: '计算概率', desc: '通过命运报告和模拟器，量化不同选择的预期结果。' },
              { step: '03', title: '把握窗口', desc: '识别人生的关键时机，在对的时间做对的决策。' },
            ].map((item, i) => (
              <div key={i} className={cn('animate-fade-in-up', `stagger-${i + 1}`)}>
                <div className="font-mono text-5xl font-bold text-primary/20 tabular-nums leading-none">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-foreground mt-4 mb-2">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
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

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/50 font-serif">
            人生重构计划 · 不是算命，是算概率
          </p>
          <p className="text-[10px] text-muted-foreground/30 font-mono tabular-nums">v1.0</p>
        </div>
      </footer>
    </div>
  );
}
