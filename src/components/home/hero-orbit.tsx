'use client';

import Link from 'next/link';
import { MODULE_IDENTITIES } from '@/lib/module-identity';
import { cn } from '@/lib/utils';

/**
 * 首页 Hero 的视觉主体。
 *
 * 不再复述下方模块卡的内容，只保留「你 → 七个模块」的轨道关系，
 * 让第一屏更像作战地图，而不是又一份目录。
 */
export function HeroOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-md">
      {/* 背景轨道 */}
      <div className="absolute inset-0 rounded-full border border-dashed border-border/70" />
      <div className="absolute inset-[14%] rounded-full border border-border/50" />
      <div className="absolute inset-[30%] rounded-full border border-border/30" />
      <div className="absolute inset-[38%] rounded-full bg-primary/[0.06] blur-2xl" />

      {/* 中心：用户 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
          <span className="font-serif text-2xl font-bold">你</span>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-background/90 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            LIFE CORE
          </span>
        </div>
      </div>

      {/* 七个模块节点 */}
      {MODULE_IDENTITIES.map((m, i) => {
        const Icon = m.icon;
        const angle = (i / MODULE_IDENTITIES.length) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + 38 * Math.cos(angle);
        const y = 50 + 38 * Math.sin(angle);

        return (
          <Link
            key={m.href}
            href={m.href}
            title={m.title}
            aria-label={m.title}
            className={cn(
              'group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1',
              'transition-transform duration-200 hover:scale-110'
            )}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform',
                m.iconGradient
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className={cn('font-mono text-[10px] tabular-nums', m.tagColor)}>
              {m.tag}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
