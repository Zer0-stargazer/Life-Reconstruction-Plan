'use client';

/**
 * 分段跳转条（小屏专用）
 *
 * 长列表在手机上是一根没有尽头的单列：滚到一半就不知道自己在哪一段了，
 * 也不知道后面还有几段——这是"卡片密集页"在移动端最难用的一点。
 *
 * 这条横向 chip 会吸顶显示当前所在的段，点一下直接跳过去；
 * 当前段变化时会把自己滚到可见位置，所以一直能看见"我在哪"。
 *
 * 桌面端不渲染（md:hidden）：桌面有左侧栏、视口也宽，再加一行纯属占地方。
 */

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface JumpSection {
  /** 目标元素的 DOM id，页面里必须真的存在 */
  id: string;
  label: string;
  count?: number;
}

/** 判定"当前段"的视线高度：元素顶部越过这条线就算进入 */
const TOP_LINE = 140;

export function SectionJumper({
  sections,
  /** 跳转时预留的吸顶高度（顶部栏 + 页面自己的吸顶条） */
  offset = 128,
  className,
}: {
  sections: JumpSection[];
  offset?: number;
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // sections 每次渲染都是新数组；用 id 串做依赖，避免 effect 反复重挂
  const sectionsRef = useRef(sections);
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const key = sections.map((s) => s.id).join('|');

  useEffect(() => {
    const list = sectionsRef.current;
    let raf = 0;

    const update = () => {
      raf = 0;
      let current: string | null = null;
      for (const s of list) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= TOP_LINE) current = s.id;
      }
      setActive(current ?? list[0]?.id ?? null);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key]);

  // 当前段的 chip 自己滚进可见区域（只动这条容器的 scrollLeft，不影响页面）
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    const el = chipRefs.current[active];
    if (!container || !el) return;
    const target = el.offsetLeft - container.clientWidth / 2 + el.offsetWidth / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [active]);

  if (sections.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        'md:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2',
        className
      )}
    >
      {sections.map((s) => (
        <button
          key={s.id}
          ref={(el) => {
            chipRefs.current[s.id] = el;
          }}
          onClick={() => {
            const target = document.getElementById(s.id);
            if (!target) return;
            window.scrollTo({
              top: target.getBoundingClientRect().top + window.scrollY - offset,
              behavior: 'smooth',
            });
          }}
          className={cn(
            'shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
            active === s.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground'
          )}
        >
          {s.label}
          {s.count !== undefined && (
            <span className="font-mono tabular-nums opacity-55">{s.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
