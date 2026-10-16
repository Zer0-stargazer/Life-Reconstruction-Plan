'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MODULE_IDENTITIES, TIMELINE_IDENTITY } from '@/lib/module-identity';
import { cn } from '@/lib/utils';
import { type ModuleIconComponent } from './module-icons';
import { Reveal } from './reveal';

/**
 * 阅读路径：时间轴 → 01 名字 → 02 职业 → … → 07 命运 → 08 健康 → 回到时间轴。
 *
 * 以前每个模块页是"信息孤岛"——看完一个不知道下一个该看什么，
 * 于是整站看起来就是一堆散着的卡片。这里把八个模块串成一条能走完的路。
 *
 * 新增模块只改 module-identity.ts，这条路径自动跟上。
 */

interface TrailStep {
  href: string;
  tag: string;
  title: string;
  question: string;
  icon: ModuleIconComponent;
}

const TRAIL: TrailStep[] = [
  {
    href: TIMELINE_IDENTITY.href,
    tag: '★',
    title: TIMELINE_IDENTITY.title,
    question: TIMELINE_IDENTITY.question,
    icon: TIMELINE_IDENTITY.icon,
  },
  ...MODULE_IDENTITIES.map((m) => ({
    href: m.href,
    tag: m.tag,
    title: m.title,
    question: m.question,
    icon: m.icon,
  })),
];

const JOURNEY_STEP: TrailStep = {
  href: '/journey',
  tag: '终',
  title: '这一圈，你走完了',
  question: '回看八章，再决定下一步。',
  icon: TIMELINE_IDENTITY.icon,
};

function TrailCard({ step, dir }: { step: TrailStep; dir: 'prev' | 'next' }) {
  const Icon = step.icon;
  const Arrow = dir === 'prev' ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={step.href}
      className={cn(
        'group flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 transition-all duration-200',
        'hover:border-primary/40 hover:shadow-md active:scale-[0.99]',
        dir === 'next' && 'sm:flex-row-reverse sm:text-right'
      )}
    >
      <Icon className="h-7 w-7 shrink-0 text-foreground/80 transition-colors duration-500 group-hover:text-primary" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Arrow className="h-3 w-3" strokeWidth={1.25} />
          <span>{dir === 'prev' ? '上一步' : '下一步'}</span>
          <span className="font-serif font-semibold text-primary">{step.tag}</span>
        </div>
        <div className="mt-0.5 truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {step.title}
        </div>
        <div className="truncate text-[11px] text-muted-foreground">{step.question}</div>
      </div>
    </Link>
  );
}

export function ModuleNextNav() {
  const pathname = usePathname();
  const i = TRAIL.findIndex((s) => s.href === pathname);
  if (i < 0) return null;

  const prev = TRAIL[(i - 1 + TRAIL.length) % TRAIL.length];
  // 最后一个模块读完 -> 先到收尾页 /journey，再由它回到时间轴
  const next = i === TRAIL.length - 1 ? JOURNEY_STEP : TRAIL[i + 1];

  return (
    <div className="border-t border-border bg-muted/10">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 py-8">
        <Reveal>
          <div className="mb-4 flex items-baseline gap-2.5">
            <span className="font-mono text-[11px] tracking-[0.15em] text-primary/70">NEXT</span>
            <span className="text-xs text-muted-foreground">按顺序走完八个模块，就是一次完整的自我盘点</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TrailCard step={prev} dir="prev" />
            <TrailCard step={next} dir="next" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
