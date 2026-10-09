'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronDown, type LucideIcon } from 'lucide-react';
import { WindowDensityChart } from '@/components/home/window-density-chart';
import { Reveal } from '@/components/shared/reveal';
import { WINDOW_DENSITY_META } from '@/data/window-density';
import { CHAPTERS, MODULE_IDENTITIES, TIMELINE_IDENTITY } from '@/lib/module-identity';

/** 首页卡片的统一形状：时间轴没有 metric，模块有 */
interface Entry {
  href: string;
  title: string;
  question: string;
  icon: LucideIcon;
  tag: string;
  desc?: string;
  metric?: string;
  unit?: string;
}

const ENTRIES: Entry[] = [TIMELINE_IDENTITY, ...MODULE_IDENTITIES];

/** 每章一句导语（纯说明文字，不含事实断言） */
const CHAPTER_LEDE: Record<string, string> = {
  序: '先看清自己现在站在人生的哪一段。',
  壹: '机会有开合的时间，先知道哪些门还开着。',
  贰: '名字与职业，是你带到牌桌上的底色。',
  叁: '那些在暗处转动的齿轮，以及概率里的运气。',
  肆: '哪些事是你能动手改的，改了会怎样。',
  终: '把以上叠起来，看清手里的牌面。',
};

const CHAPTER_SECTIONS = CHAPTERS.map((chapter) => ({
  ...chapter,
  lede: CHAPTER_LEDE[chapter.num] ?? '',
  items: chapter.hrefs.flatMap((href) => {
    const entry = ENTRIES.find((e) => e.href === href);
    return entry ? [entry] : [];
  }),
}));

const faqs = [
  { q: '这是算命吗？', a: '不是。这是一个基于概率和数据的决策框架。我们不预测未来，我们帮你计算概率、识别窗口。' },
  { q: '数据来源是什么？', a: '数据来自发展心理学、职业研究、社会流动性研究等学术文献的综合整理。' },
  { q: '我应该从哪个模块开始？', a: '建议先从"序章"开始：在时间轴页（/me）告诉我们你的年龄，再看"窗口"模块了解你当前处于哪些关键时机。' },
];

function StartButton({ className }: { className?: string }) {
  return (
    <Link
      href="/me"
      className={cn(
        'group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90',
        className
      )}
    >
      从序章开始
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function ModuleCard({ item }: { item: Entry }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 grain-texture transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
        </span>
        <span className="font-serif text-xs text-muted-foreground">{item.tag}</span>
      </div>

      <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">
        <span className="ink-sweep">{item.title}</span>
      </h3>
      <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground/80">{item.question}</p>
      {item.desc && (
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{item.desc}</p>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4 mt-5">
        {item.metric ? (
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-foreground tabular-nums">{item.metric}</span>
            <span className="text-xs text-muted-foreground">{item.unit}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">从这里开始</span>
        )}
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const meta = WINDOW_DENSITY_META;

  return (
    <div className="min-h-screen bg-background">
      {/* ===== 扉页 ===== */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-20">
          <h1 className="hero-rise font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
            人生重构计划
          </h1>
          <p className="hero-rise hero-rise-2 mt-8 max-w-2xl font-serif text-xl sm:text-2xl leading-relaxed text-foreground/85">
            命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式。
          </p>
          <div className="hero-rise hero-rise-3 mt-10">
            <StartButton />
          </div>
        </div>

        {/* 朱砂印章的淡影：装饰，不承载信息 */}
        <span
          aria-hidden
          className="seal-stamp pointer-events-none absolute right-10 top-24 hidden h-44 w-44 items-center justify-center rounded-md border-2 border-primary/70 font-serif text-7xl font-bold text-primary/75 lg:flex"
          style={{ animationDelay: '360ms' }}
        >
          重
        </span>
      </section>

      {/* ===== 手记 ===== */}
      <section className="border-b border-border bg-card">
        <Reveal className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="font-serif text-sm text-primary">手记</p>
            <p className="mt-3 font-serif text-lg leading-relaxed text-foreground sm:text-xl">
              这是一个基于概率和数据的决策框架。我们不预测未来，我们帮你计算概率、识别窗口。
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              从姓名、职业、规律、窗口、努力、运气、命运七大维度，重新整理你手里的牌。
            </p>
          </div>
          <blockquote className="relative border-l-2 border-primary/60 pl-6 lg:col-span-5">
            <p className="font-serif text-base leading-relaxed text-foreground/85">
              大多数人把所有精力花在如何更努力地出牌上，却从没看过自己手里到底有什么牌。
            </p>
          </blockquote>
        </Reveal>
      </section>

      {/* ===== 章节 序 → 终 ===== */}
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {CHAPTER_SECTIONS.map((chapter) => (
          <Reveal key={chapter.num}>
            <section className="grid gap-8 border-b border-border py-14 lg:grid-cols-12 lg:gap-12">
              <header className="lg:col-span-4 lg:sticky lg:top-16 lg:self-start">
                <div className="font-serif text-6xl sm:text-7xl leading-none text-primary">{chapter.num}</div>
                <div className="mt-4 font-serif text-xl font-semibold text-foreground">{chapter.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{chapter.lede}</p>
              </header>

              <div className="lg:col-span-8">
                <div
                  className={cn(
                    'grid gap-4',
                    chapter.items.length > 1 && 'sm:grid-cols-2'
                  )}
                >
                  {chapter.items.map((item) => (
                    <ModuleCard key={item.href} item={item} />
                  ))}
                </div>

                {chapter.hrefs.includes('/windows') && (
                  <div className="mt-6 rounded-xl border border-border bg-background/60 p-4 sm:p-5">
                    <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2.5">
                      <h3 className="text-sm font-semibold text-foreground">人生窗口密度分布</h3>
                      <span className="text-xs text-muted-foreground">共 {meta.total} 个 · 每 5 岁一格</span>
                    </div>
                    <WindowDensityChart />
                    <div className="mt-3 border-t border-border pt-2.5 text-xs text-muted-foreground">
                      45 岁之前有 {meta.before45} 扇门，45 岁之后只剩 {meta.after45} 扇；峰值区间 {meta.peak.from}–{meta.peak.to} 岁，{meta.peak.count} 个窗口。
                    </div>
                  </div>
                )}
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      {/* ===== 常见问题 ===== */}
      <section className="bg-muted/20">
        <Reveal className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
          <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">常见问题</h2>
          <div className="grid gap-2">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className={cn(
                  'overflow-hidden rounded-xl border bg-card transition-colors duration-200',
                  openFaq === i ? 'border-primary/25' : 'border-border hover:border-primary/20'
                )}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      openFaq === i && 'rotate-180 text-primary'
                    )}
                  />
                </button>
                {openFaq === i && (
                  <div className="animate-fade-in px-4 pb-3">
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== 终章 ===== */}
      <section className="border-t border-border">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:px-8">
          <span
            aria-hidden
            className="mb-8 flex h-10 w-10 items-center justify-center rounded-sm bg-primary font-serif text-base font-bold text-primary-foreground"
          >
            重
          </span>
          <p className="font-serif text-xl leading-relaxed text-foreground/85 sm:text-2xl">
            人生没有标准答案，但有更好的决策框架。
          </p>
          <div className="mt-10">
            <StartButton />
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-muted-foreground sm:px-8">
          <span className="font-serif">人生重构计划 · 不是算命，是算概率</span>
        </div>
      </footer>
    </div>
  );
}
