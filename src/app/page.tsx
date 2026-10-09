'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { WindowDensityChart } from '@/components/home/window-density-chart';
import { WINDOW_DENSITY_META } from '@/data/window-density';
import { CHAPTERS, MODULE_IDENTITIES, TIMELINE_IDENTITY } from '@/lib/module-identity';

const ENTRIES = [TIMELINE_IDENTITY, ...MODULE_IDENTITIES];

const DIRECTORY = CHAPTERS.map((chapter) => ({
  ...chapter,
  items: chapter.hrefs.flatMap((href) => {
    const entry = ENTRIES.find((e) => e.href === href);
    return entry ? [entry] : [];
  }),
}));

const quotes = [
  '大多数人把所有精力花在如何更努力地出牌上，却从没看过自己手里到底有什么牌。',
];

const faqs = [
  { q: '这是算命吗？', a: '不是。这是一个基于概率和数据的决策框架。我们不预测未来，我们帮你计算概率、识别窗口。' },
  { q: '数据来源是什么？', a: '数据来自发展心理学、职业研究、社会流动性研究等学术文献的综合整理。' },
  { q: '我应该从哪个模块开始？', a: '建议先从"序章"开始：在时间轴页（/me）告诉我们你的年龄，再看"窗口"模块了解你当前处于哪些关键时机。' },
];

function SectionHead({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h2>
      {desc && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const meta = WINDOW_DENSITY_META;

  return (
    <div className="min-h-screen bg-background">
      {/* ===== 扉页 ===== */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
            人生重构计划
          </h1>
          <p className="mt-8 max-w-2xl font-serif text-xl sm:text-2xl leading-relaxed text-foreground/85">
            命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式。
          </p>
          <div className="mt-10">
            <Link
              href="/me"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              从序章开始
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 目录 ===== */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <SectionHead title="目录" />
        <div className="border-t border-border">
          {DIRECTORY.map((chapter) => (
            <div
              key={chapter.num}
              className="grid gap-4 border-b border-border py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <div>
                <div className="font-serif text-2xl text-primary">{chapter.num}</div>
                <div className="mt-1 font-serif text-sm text-muted-foreground">{chapter.title}</div>
              </div>
              <ul className="divide-y divide-border">
                {chapter.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="font-serif text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{item.question}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 机会窗口 ===== */}
      <section className="border-t border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
          <SectionHead title="机会窗口，集中在前 45 年" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <p className="text-sm text-foreground/80 leading-relaxed">
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

            <div className="lg:col-span-7">
              <div className="rounded-xl border border-border bg-background/40 p-4 sm:p-5">
                <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2.5 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">人生窗口密度分布</h3>
                  <span className="text-xs text-muted-foreground/70">共 {meta.total} 个 · 每 5 岁一格</span>
                </div>
                <WindowDensityChart />
                <div className="mt-3 pt-2.5 border-t border-border text-xs text-muted-foreground/70">
                  峰值区间 {meta.peak.from}–{meta.peak.to} 岁，{meta.peak.count} 个窗口
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 核心洞察 & FAQ ===== */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
          <SectionHead title="核心洞察" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-4 rounded-xl border border-border bg-card/60 p-5">
              {quotes.map((q, i) => (
                <figure key={i} className="relative pl-5">
                  <span className="absolute left-0 top-0 select-none font-serif text-3xl leading-none text-primary/30">
                    &ldquo;
                  </span>
                  <blockquote className="font-serif text-base text-foreground/85 leading-relaxed">
                    {q}
                  </blockquote>
                </figure>
              ))}
            </div>

            <div className="space-y-2">
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
                    className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left"
                  >
                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                    <ChevronDown className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      openFaq === i && 'rotate-180 text-primary'
                    )} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 animate-fade-in">
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-6 text-xs text-muted-foreground/60">
          <span className="font-serif">人生重构计划 · 不是算命，是算概率</span>
        </div>
      </footer>
    </div>
  );
}
