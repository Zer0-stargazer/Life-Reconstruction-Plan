'use client';

import { useEffect, useRef } from 'react';
import { MODULE_IDENTITIES, chapterOf } from '@/lib/module-identity';
import { chapterMeta } from '@/lib/chapter-meta';
import { cn } from '@/lib/utils';
import { MOTION, gsap, prefersReducedMotion, registerGsap } from '@/lib/motion';

/**
 * 七个模块页的统一页头：章节大号朱砂数字 + 英文小标 + 大标题 + 一句问题 + 细线与印点。
 *
 * 编号、问题、章节全部从 `module-identity.ts` 取，页面只提供自己特有的部分。
 * 页面仍可自定义大标题与描述——「人生规律引擎」这类产品文案不该被「规律」两个字替换掉。
 *
 * 入场只播放一次（GSAP，不循环）。SSR 默认可见，动效只在挂载后补起始态。
 */

const WIDTHS = {
  '3xl': 'max-w-3xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
} as const;

export function ModulePageHead({
  href,
  title,
  desc,
  aside,
  width = '5xl',
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
      tl.from('[data-head="chapter"]', { opacity: 0, y: 12, duration: MOTION.base })
        .from('[data-head="title"]', { opacity: 0, y: 18, duration: MOTION.slow }, 0.08)
        .from('[data-head="question"]', { opacity: 0, y: 10, duration: MOTION.base }, 0.2)
        .from(
          '[data-head="rule"]',
          { scaleX: 0, transformOrigin: 'left center', duration: MOTION.slow, ease: MOTION.easeExpo },
          0.25
        );
      const asideEl = rootRef.current?.querySelector('[data-head="aside"]');
      if (asideEl) tl.from(asideEl, { opacity: 0, y: 10, duration: MOTION.base }, 0.3);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const m = MODULE_IDENTITIES.find((x) => x.href === href);
  if (!m) return null;
  const chapter = chapterOf(href);
  const meta = chapter ? chapterMeta(chapter.num) : null;

  return (
    <div ref={rootRef} className={cn('border-b border-border bg-card', className)}>
      <div className={cn('mx-auto px-6 pb-9 pt-12 sm:px-8', WIDTHS[width])}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            {chapter && (
              <div data-head="chapter" className="flex items-end gap-5">
                <span className="font-serif text-7xl leading-[0.8] tabular-nums text-primary sm:text-8xl">
                  {chapter.num}
                </span>
                <div className="pb-0.5">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    {meta?.en}
                  </div>
                  <div className="mt-1.5 font-serif text-sm text-muted-foreground">{chapter.title}</div>
                </div>
              </div>
            )}
            <h1
              data-head="title"
              className={cn(
                'font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl',
                chapter && 'mt-8'
              )}
            >
              {title}
            </h1>
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

        {/* 细线 + 朱砂印点 + 编号：章节开篇的收束线 */}
        <div className="relative mt-10 flex items-center">
          <span data-head="rule" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" aria-hidden />
          <span
            aria-hidden
            className="relative h-2.5 w-2.5 shrink-0 rounded-[1px] bg-primary"
          />
          <span className="relative ml-auto bg-card pl-4 font-serif text-[11px] tabular-nums tracking-[0.2em] text-muted-foreground">
            {m.tag} / 07
          </span>
        </div>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
