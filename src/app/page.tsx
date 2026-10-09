'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { WindowDensityChart } from '@/components/home/window-density-chart';
import { SealMark } from '@/components/shared/seal-mark';
import type { ModuleIconComponent } from '@/components/shared/module-icons';
import { WINDOW_DENSITY_META } from '@/data/window-density';
import { CHAPTERS, MODULE_IDENTITIES, TIMELINE_IDENTITY } from '@/lib/module-identity';
import { chapterMeta } from '@/lib/chapter-meta';
import { MOTION, gsap, ScrollTrigger, prefersReducedMotion, registerGsap } from '@/lib/motion';

/** 首页条目的统一形状：时间轴没有 metric / desc，模块有 */
interface Entry {
  href: string;
  title: string;
  question: string;
  icon: ModuleIconComponent;
  tag: string;
  desc?: string;
  metric?: string;
  unit?: string;
}

const ENTRIES: Entry[] = [TIMELINE_IDENTITY, ...MODULE_IDENTITIES];

const CHAPTER_SECTIONS = CHAPTERS.map((chapter, index) => ({
  ...chapter,
  index,
  meta: chapterMeta(chapter.num),
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
        'group inline-flex items-center gap-5 bg-primary px-7 py-4 font-serif text-[15px] tracking-[0.14em] text-primary-foreground transition-colors duration-500 hover:bg-primary/90',
        className
      )}
    >
      从序章开始
      <ArrowRight
        className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1.5"
        strokeWidth={1.25}
        aria-hidden
      />
    </Link>
  );
}

/** 目录条目：图标 + 标题 + 问题 + 指标，右侧箭头 hover 时滑出 */
function EntryRow({ item }: { item: Entry }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      data-entry
      className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-x-5 gap-y-2 border-b border-border py-7 sm:gap-x-6"
    >
      <Icon className="mt-1 h-8 w-8 text-foreground/80 transition-colors duration-500 group-hover:text-primary" />

      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-[11px] tabular-nums tracking-[0.2em] text-primary" aria-hidden>
            {item.tag}
          </span>
          <h3 className="font-serif text-2xl font-semibold text-foreground sm:text-[26px]">
            <span className="ink-sweep">{item.title}</span>
          </h3>
        </div>
        <p className="mt-2.5 text-[15px] font-medium leading-relaxed text-foreground/85">{item.question}</p>
        {item.desc && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>}
      </div>

      <div className="flex flex-col items-end gap-4 text-right">
        {item.metric ? (
          <div className="flex flex-col items-end">
            <span className="font-serif text-3xl font-bold leading-none tabular-nums text-foreground sm:text-4xl">
              {item.metric}
            </span>
            <span className="mt-1.5 text-[11px] tracking-wide text-muted-foreground">{item.unit}</span>
          </div>
        ) : (
          <span className="font-serif text-sm text-muted-foreground">从这里开始</span>
        )}
        <ArrowRight
          className="h-4 w-4 text-muted-foreground transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-hover:text-primary"
          strokeWidth={1.25}
          aria-hidden
        />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const meta = WINDOW_DENSITY_META;

  /**
   * 首页动效。
   *
   * SSR 输出的内容默认可见（没有 opacity:0 的初始类），GSAP 的 from 补丁只在挂载后
   * 才设置起始态，所以 JS 慢或禁用时页面依然完整可读。
   * 关闭动效偏好时整段跳过，保持最终态。
   */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const hero = gsap.timeline({ defaults: { ease: MOTION.ease } });
      hero
        .from('[data-hero="kicker"]', { opacity: 0, y: 10, duration: MOTION.fast }, 0.1)
        .from('[data-hero="line"]', { yPercent: 110, duration: MOTION.slow, ease: MOTION.easeExpo, stagger: 0.16 }, 0.2)
        .from('[data-hero="quote"]', { opacity: 0, y: 14, duration: MOTION.base }, 0.75)
        .from('[data-hero="cta"]', { opacity: 0, y: 18, duration: MOTION.base }, 0.9)
        .from('[data-hero="index"]', { opacity: 0, y: 8, duration: MOTION.base, stagger: 0.05 }, 1.05);

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 26,
          duration: MOTION.base,
          ease: MOTION.ease,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-hairline]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: MOTION.slow,
          ease: MOTION.easeExpo,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-entries]').forEach((group) => {
        const rows = group.querySelectorAll<HTMLElement>('[data-entry]');
        gsap.from(rows, {
          opacity: 0,
          y: 22,
          duration: MOTION.base,
          ease: MOTION.ease,
          stagger: MOTION.stagger,
          scrollTrigger: { trigger: group, start: 'top 84%', once: true },
        });
      });

      /* 章节大数字随滚动微微上移，制造纵深，幅度很小 */
      gsap.utils.toArray<HTMLElement>('[data-numeral]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 0 },
          {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom bottom', scrub: 0.6 },
          }
        );
      });
    }, rootRef);

    // 字体与布局稳定后版心高度会变化，需要重算触发位置（首帧、load、字体就绪各一次）
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready.then(refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-hidden bg-background">
      {/* ===== 扉页 ===== */}
      <section className="relative flex min-h-[92svh] flex-col justify-between border-b border-border px-6 pb-10 pt-12 sm:px-10 lg:px-16">
        <div data-hero="kicker" className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-primary" aria-hidden />
            <span className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
              A Personal Decision Atlas
            </span>
          </div>
          <span className="hidden text-[11px] uppercase tracking-[0.32em] text-muted-foreground sm:inline">
            Vol. 01
          </span>
        </div>

        <div className="relative mt-16 sm:mt-24">
          <h1 className="font-serif text-[clamp(3.6rem,10vw,9.5rem)] font-bold leading-[1.02] tracking-[-0.01em] text-foreground">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero="line" className="block">人生重构</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] pl-[1.1em]">
              <span data-hero="line" className="block">计划</span>
            </span>
          </h1>

          {/* 扉页印章：装饰，不承载信息 */}
          <div className="absolute -top-4 right-0 hidden rotate-[-5deg] lg:block" aria-hidden>
            <SealMark className="h-36 w-36 text-6xl" />
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p
            data-hero="quote"
            className="max-w-xl font-serif text-xl leading-[1.9] text-foreground/80 sm:text-2xl lg:col-span-7"
          >
            <span className="block">命是你拿到的牌，</span>
            <span className="block">运是你出牌的时机，</span>
            <span className="block">努力是你出牌的方式。</span>
          </p>
          <div data-hero="cta" className="lg:col-span-5 lg:justify-self-end">
            <StartButton />
          </div>
        </div>

        {/* 目录：六章一览，锚点直达 */}
        <nav aria-label="章节目录" className="mt-14 grid grid-cols-2 border-t border-border sm:grid-cols-6">
          {CHAPTER_SECTIONS.map((chapter) => (
            <a
              key={chapter.num}
              href={`#chapter-${chapter.index}`}
              data-hero="index"
              className="group flex min-w-0 flex-col gap-1 border-b border-border px-3 py-4 transition-colors duration-500 first:pl-0 hover:text-primary sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0"
            >
              <span className="font-serif text-lg text-primary">{chapter.num}</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-500 group-hover:text-primary">
                {chapter.meta.en}
              </span>
              <span className="font-serif text-[15px] text-foreground/85">{chapter.title}</span>
            </a>
          ))}
        </nav>
      </section>

      {/* ===== 手记 ===== */}
      <section className="border-b border-border bg-card">
        <div data-reveal className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16">
          <div className="lg:col-span-3">
            <span className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">Manifesto</span>
            <span data-hairline className="mt-5 block h-px w-12 bg-primary" aria-hidden />
          </div>
          <div className="lg:col-span-9">
            <p className="font-serif text-2xl leading-[1.9] text-foreground sm:text-[28px]">
              <span className="float-left mr-3 mt-2 font-serif text-[5.5rem] font-bold leading-[0.8] text-primary sm:text-[6.5rem]">
                这
              </span>
              是一个基于概率和数据的决策框架。我们不预测未来，我们帮你计算概率、识别窗口。
            </p>
            <p className="mt-8 max-w-2xl text-[15px] leading-[1.9] text-muted-foreground">
              从姓名、职业、规律、窗口、努力、运气、命运七大维度，重新整理你手里的牌。
            </p>
            <blockquote className="mt-12 border-l border-primary pl-6">
              <p className="font-serif text-lg leading-[1.9] text-foreground/80">
                大多数人把所有精力花在如何更努力地出牌上，却从没看过自己手里到底有什么牌。
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ===== 章节 序 → 终 ===== */}
      {CHAPTER_SECTIONS.map((chapter) => (
        <section
          key={chapter.num}
          id={`chapter-${chapter.index}`}
          className="relative mx-auto grid max-w-6xl scroll-mt-10 gap-12 border-b border-border px-6 py-24 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16"
        >
          <header className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
            <div
              data-numeral
              className="font-serif text-[9rem] font-bold leading-[0.8] tabular-nums text-primary sm:text-[11rem]"
            >
              {chapter.num}
            </div>
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-8 bg-primary" aria-hidden />
              <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{chapter.meta.en}</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl">{chapter.title}</h2>
            <p className="mt-4 max-w-xs font-serif text-[15px] leading-[1.9] text-muted-foreground">
              {chapter.meta.lede}
            </p>
            <div className="mt-6 text-[11px] tabular-nums tracking-[0.2em] text-muted-foreground">
              {String(chapter.items.length).padStart(2, '0')} ENTRIES
            </div>
          </header>

          <div className="lg:col-span-7 lg:pt-6">
            <div data-entries className="border-t border-border">
              {chapter.items.map((item) => (
                <EntryRow key={item.href} item={item} />
              ))}
            </div>

            {chapter.hrefs.includes('/windows') && (
              <div className="mt-14">
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-lg font-semibold text-foreground">人生窗口密度分布</h3>
                  <span className="text-[11px] tracking-wide text-muted-foreground">
                    共 {meta.total} 个 · 每 5 岁一格
                  </span>
                </div>
                <div data-reveal className="border border-border bg-card p-4 sm:p-6">
                  <WindowDensityChart />
                  <div className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                    45 岁之前有 {meta.before45} 扇门，45 岁之后只剩 {meta.after45} 扇；峰值区间 {meta.peak.from}–{meta.peak.to} 岁，{meta.peak.count} 个窗口。
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ===== 常见问题 ===== */}
      <section className="border-b border-border bg-card">
        <div data-reveal className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">Questions</span>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl">常见问题</h2>
            </div>
            <div className="lg:col-span-7">
              <div className="border-t border-border">
                {faqs.map((faq, i) => (
                  <div key={faq.q} className="border-b border-border">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                      aria-expanded={openFaq === i}
                    >
                      <span className="font-serif text-lg text-foreground transition-colors duration-500 group-hover:text-primary">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-500 ease-out',
                          openFaq === i && 'rotate-180 text-primary'
                        )}
                        strokeWidth={1.25}
                        aria-hidden
                      />
                    </button>
                    {openFaq === i && (
                      <div className="animate-fade-in pb-6 pr-10">
                        <p className="text-[15px] leading-[1.9] text-muted-foreground">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 终章 ===== */}
      <section className="relative overflow-hidden">
        <div data-reveal className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:px-8">
          <span className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">Epilogue</span>
          <SealMark className="mt-8 h-12 w-12 text-lg" />
          <p className="mt-10 font-serif text-2xl leading-[1.9] text-foreground/85 sm:text-3xl">
            人生没有标准答案，但有更好的决策框架。
          </p>
          <div className="mt-12">
            <StartButton />
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-7 text-xs text-muted-foreground sm:px-10 lg:px-16">
          <span className="font-serif">人生重构计划 · 不是算命，是算概率</span>
          <span className="hidden text-[11px] uppercase tracking-[0.3em] sm:inline">Vol. 01</span>
        </div>
      </footer>
    </div>
  );
}
