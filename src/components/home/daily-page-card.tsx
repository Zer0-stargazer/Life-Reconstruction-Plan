'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { dailyPick, localDateKey, type DailyPick } from '@/data/daily-picks';
import { cn } from '@/lib/utils';

/**
 * 今日一页：用本地日期做种子，确定性地从 60 条摘要里挑一条（同一天所有人相同）。
 *
 * 数据只来自 `data/daily-picks.ts` 的摘要级内容——首页访客可见，不能把整份 laws / windows
 * 打进公开 bundle。访客点「去看」会被登录门拦下，这正是引导。
 *
 * 日期在挂载后才读取（服务端与客户端时区可能不同，直接渲染会水合不一致），
 * 挂载前用等高占位，避免版面跳动。
 */
export function DailyPageCard({ className }: { className?: string }) {
  const [state, setState] = useState<{ key: string; pick: DailyPick } | null>(null);

  useEffect(() => {
    const key = localDateKey();
    setState({ key, pick: dailyPick(key) });
  }, []);

  const mmdd = state ? `${state.key.slice(5, 7)}·${state.key.slice(8, 10)}` : '';

  return (
    <article
      className={cn('relative min-h-[8.5rem] rounded-sm border border-border bg-card p-5 sm:p-6', className)}
      aria-label="今日一页"
    >
      <span aria-hidden className="absolute -left-px -top-px h-2 w-2 bg-primary" />
      {state && (
        <div className="animate-fade-in">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              今日 · {mmdd}
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground/70">A PAGE A DAY</span>
          </div>
          <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-foreground sm:text-2xl">
            {state.pick.title}
          </h3>
          <p className="mt-2 text-[15px] leading-[1.8] text-muted-foreground">{state.pick.summary}</p>
          <Link
            href={state.pick.href}
            className="group mt-4 inline-flex items-center gap-2 border-b border-primary/40 pb-0.5 font-serif text-sm text-primary transition-colors hover:border-primary"
          >
            去看
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
              strokeWidth={1.25}
              aria-hidden
            />
          </Link>
        </div>
      )}
    </article>
  );
}
