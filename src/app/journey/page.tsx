'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MODULE_IDENTITIES, TIMELINE_IDENTITY } from '@/lib/module-identity';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { HeroAtlas, atlasWillPlay } from '@/components/home/hero-atlas';
import { LifeCardButton } from '@/components/share/life-card';
import { Reveal } from '@/components/shared/reveal';
import { TickRule } from '@/components/shared/fig-kit';
import { useUserProfile } from '@/hooks/use-user-profile';
import { cn } from '@/lib/utils';

/**
 * /journey —— 终章。
 *
 * 复用首页 HeroAtlas 的几何（mode="journey"）：八个节点按 visited-modules 的访问顺序，
 * 每 120ms 点亮一个（空心 → 实心朱砂），最后中心方印落下，标题「这一圈，你走完了」随后淡入。
 * 会话内只播一次；减少动效 / 已播放过时直接是终态。不放彩带、评分、勋章。
 */
export default function JourneyPage() {
  const [visited, setVisited] = useState<string[] | null>(null);
  /** 标题是否还在等方印落下（只有动效真的会播放时才为 true，其余情况标题直接可见） */
  const [holdTitle, setHoldTitle] = useState(false);
  const profile = useUserProfile();

  useLayoutEffect(() => {
    setHoldTitle(atlasWillPlay('journey'));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.visitedModules);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      setVisited(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []);
    } catch {
      setVisited([]);
    }
  }, []);

  const onAtlasDone = useCallback(() => setHoldTitle(false), []);

  const seen = MODULE_IDENTITIES.filter((m) => visited?.includes(m.href)).length;
  const marked = profile.windowAction.doing + profile.windowAction.done + profile.windowAction.skip;
  const health = profile.health;

  const cells = [
    { en: 'CHAPTERS', label: '读过的章', value: `${seen} / ${MODULE_IDENTITIES.length}`, note: '没读的不必补，想回头时再翻' },
    { en: 'WINDOWS', label: '表过态的窗口', value: String(marked), note: marked ? '在做、做完、与我无关，都算' : '还没给任何窗口表态' },
    {
      en: 'HEALTH',
      label: '健康自评',
      value: health ? `${health.answered} / ${health.total}` : '未开始',
      note: health ? (health.complete ? '已答完全部题目' : '还没答完，答完的结果更完整') : '在健康章做一次两步自评',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden grain-texture">
      <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-12 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">EPILOGUE · 终</p>

        {/* 主视觉：八个节点依次点亮 + 方印落下 */}
        <div className="pointer-events-none relative mx-auto mt-6 aspect-square w-full max-w-[26rem]" aria-hidden>
          <HeroAtlas mode="journey" visited={visited} onDone={onAtlasDone} />
        </div>

        <div
          className={cn(
            'mt-8 text-center transition-opacity duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            holdTitle ? 'opacity-0' : 'opacity-100'
          )}
        >
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            这一圈，你走完了
          </h1>
          <p className="mx-auto mt-4 max-w-md font-serif text-base leading-[1.9] text-foreground/80">
            八章里，你读过 {seen} 章。牌已经摊开了，怎么打，还是你的事。
          </p>
        </div>

        {/* 无障碍：主视觉是装饰，八章状态以文字列表提供 */}
        <ul className="sr-only">
          {MODULE_IDENTITIES.map((m) => (
            <li key={m.href}>
              {m.tag} {m.title}：{visited?.includes(m.href) ? '看过' : '未看'}
            </li>
          ))}
        </ul>

        <Reveal className="mt-12">
          <TickRule label="SUMMARY" />
          <dl className="mt-6 grid grid-cols-1 border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-border">
            {cells.map((c) => (
              <div key={c.en} className="border-b border-border p-5 last:border-b-0 sm:border-b-0">
                <dt className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{c.en}</dt>
                <dd className="mt-3 font-serif text-3xl font-bold tabular-nums text-foreground">{c.value}</dd>
                <dd className="mt-1 text-sm text-foreground/80">{c.label}</dd>
                <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.note}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-8" delay={90}>
          <div className="flex flex-wrap items-center gap-3">
            <LifeCardButton />
            <Link
              href={TIMELINE_IDENTITY.href}
              className="btn-press inline-flex items-center gap-2 border border-border px-5 py-3 font-serif text-sm tracking-[0.1em] text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              回到时间轴
              <ArrowRight className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
