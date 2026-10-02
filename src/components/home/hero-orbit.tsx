'use client';

import Link from 'next/link';
import { Flame } from 'lucide-react';
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

      {/*
       * 中心：生命核心。用品牌火焰 + 同心雷达环表达「你是这套系统的原点」；
       * 纯文字方块（"你"）在轨道图里没有视觉重心，已弃用。
       * 整块纯装饰，语义由左侧文案与七个模块节点承担。
       */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-28 w-28">
          {/* 呼吸光晕 */}
          <span className="absolute inset-3 rounded-full bg-primary/15 blur-xl animate-pulse" />
          {/* 缓旋虚线外环 */}
          <span className="absolute inset-0 rounded-full border border-dashed border-primary/25 animate-[spin_80s_linear_infinite]" />
          {/* 实线中环 */}
          <span className="absolute inset-[15%] rounded-full border border-primary/30 bg-background/60" />
          {/* 核心火种 */}
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/75 text-primary-foreground shadow-lg shadow-primary/30">
            <Flame className="h-5 w-5" />
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
