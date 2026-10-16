'use client';

import { useEffect, useRef } from 'react';
import { MODULE_IDENTITIES, chapterOf } from '@/lib/module-identity';
import { chapterMeta } from '@/lib/chapter-meta';
import { cn } from '@/lib/utils';
import { IconPlate, TickRule } from '@/components/shared/fig-kit';
import { MODULE_COUNT } from '@/data/content-total';
import { MOTION, gsap, prefersReducedMotion, registerGsap } from '@/lib/motion';

/**
 * 八个模块页的统一页头：章节大号朱砂数字 + 英文小标 + 大标题 + 一句问题 + 细线与印点。
 *
 * 编号、问题、章节全部从 `module-identity.ts` 取，页面只提供自己特有的部分。
 * 页面仍可自定义大标题与描述——「人生规律引擎」这类产品文案不该被「规律」两个字替换掉。
 *
 * 入场只播放一次（GSAP，不循环）。SSR 默认可见，动效只在挂载后补起始态。
 */

const WIDTHS = {
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-6xl 2xl:max-w-[1400px]',
  '5xl': 'max-w-7xl 2xl:max-w-[1600px]',
  '6xl': 'max-w-7xl 2xl:max-w-[1600px]',
} as const;

export function ModulePageHead({
  href,
  title,
  desc,
  aside,
  width = '6xl',
  className,
  children,
}: {
  /** 模块路由，用来查 module-identity */
  href: string;
  /** 页面大标题（H1）。传各页自己的产品文案，不是 module.title */
  title: React.ReactNode;
  /** 页面描述。可传 JSX（例如随步骤变化的文案） */
  desc?: React.ReactNode;
  /** 右侧插槽：搜索框、按钮等。小屏会整行换行到下方 */
  aside?: React.ReactNode;
  /** 内容宽度 */
  width?: keyof typeof WIDTHS;
  className?: string;
  /** 页头下方内容：统计条、分布图、步骤指示器等 */
  children?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION.ease } });
      /* 章节翻页：大编号由上往下揭开（clip-path，600ms）。揭完立刻清掉 clip-path，
         否则 inset(0) 会永久裁掉 leading-[0.8] 下溢出盒子的字形。 */
      tl.fromTo(
        '[data-head="numeral"]',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: MOTION.easeExpo, clearProps: 'clipPath' },
        0
      )
        .from('[data-head="chapter-meta"]', { opacity: 0, y: 8, duration: MOTION.fast }, 0.25)
        .from('[data-head="title"]', { opacity: 0, y: 14, duration: MOTION.base }, 0.12)
        .from('[data-head="question"]', { opacity: 0, y: 10, duration: MOTION.base }, 0.2)
        /* 收束线：TickRule 自左向右画出（scaleX 0→1，700ms，延迟 150ms） */
        .from(
          '[data-head="rule"]',
          { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: MOTION.easeExpo },
          0.15
        )
        .from('[data-head="count"]', { opacity: 0, duration: MOTION.fast }, 0.6);
      const asideEl = rootRef.current?.querySelector('[data-head="aside"]');
      if (asideEl) tl.from(asideEl, { opacity: 0, y: 10, duration: MOTION.base }, 0.3);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const m = MODULE_IDENTITIES.find((x) => x.href === href);
  if (!m) return null;
  const chapter = chapterOf(href);
  const meta = chapter ? chapterMeta(chapter.num) : null;
  // 「N 条」：数值型指标加千分位；无限/非数字（名字的 ∞）原样显示
  const metricNum = Number(m.metric);
  const countText = `${Number.isFinite(metricNum) ? metricNum.toLocaleString('en-US') : m.metric} ${m.unit}`;

  return (
    <div ref={rootRef} className={cn('border-b border-border bg-card', className)}>
      <div className={cn('mx-auto px-6 pb-7 pt-9 sm:px-8', WIDTHS[width])}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            {chapter && (
              <div className="flex items-end gap-5">
                <span
                  data-head="numeral"
                  className="inline-block font-serif text-7xl leading-[0.8] tabular-nums text-primary sm:text-8xl"
                >
                  {chapter.num}
                </span>
                <div data-head="chapter-meta" className="pb-0.5">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    {meta?.en}
                  </div>
                  <div className="mt-1.5 font-serif text-sm text-muted-foreground">{chapter.title}</div>
                </div>
              </div>
            )}
            <div className={cn('flex items-center gap-4', chapter && 'mt-8')}>
              <IconPlate>
                <m.icon className="relative h-7 w-7 text-foreground/85" />
              </IconPlate>
              <h1
                data-head="title"
                className="min-w-0 font-serif text-3xl font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-4xl"
              >
                {title}
              </h1>
            </div>
            <p data-head="question" className="mt-3 text-sm font-medium text-muted-foreground">
              {m.question}
            </p>
            {desc && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{desc}</p>}
          </div>

          {aside && (
            <div data-head="aside" className="w-full shrink-0 sm:w-auto">
              {aside}
            </div>
          )}
        </div>

        {/* 收束线：TickRule 刻度线，右端「01 / 08 · N 条」 */}
        <div className="mt-10 flex items-center gap-4">
          <div data-head="rule" className="min-w-0 flex-1">
            <TickRule />
          </div>
          <span
            data-head="count"
            className="shrink-0 font-mono text-[11px] tabular-nums tracking-[0.15em] text-muted-foreground"
          >
            {m.tag} / {String(MODULE_COUNT).padStart(2, '0')} · {countText}
          </span>
        </div>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
