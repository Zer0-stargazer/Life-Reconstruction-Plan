'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { onboardingSeenKey } from '@/lib/storage-keys';
import { MODULE_IDENTITIES, TIMELINE_IDENTITY } from '@/lib/module-identity';
import { AGE_MAX, AGE_MIN, parseAgeInput, readDefaultAge, writeDefaultAge } from '@/lib/default-age';

/** 每一页：小标 + 标题 + 正文段落 + 可选要点 / 年龄输入 */
type TourPage = {
  tag: string;
  title: string;
  body: string[];
  points?: { label: string; desc: string }[];
  age?: boolean;
};

// 模块名与问题一律取自 module-identity.ts，不在这里手写
const MODULE_POINTS = [
  { label: TIMELINE_IDENTITY.note, desc: TIMELINE_IDENTITY.question },
  ...MODULE_IDENTITIES.map((m) => ({ label: m.title, desc: m.question })),
];

const PAGES: TourPage[] = [
  {
    tag: 'WELCOME',
    title: '一条轴，看完这一生',
    body: [
      '把 0 到 80 岁放在一条轴上：哪些门开着、哪些关了、哪些还没到。',
      '下面三页，一分钟讲完。',
    ],
  },
  {
    tag: 'MODULES',
    title: '一条时间轴，八个模块',
    body: ['左边栏从上到下：'],
    points: MODULE_POINTS,
  },
  {
    tag: 'START',
    title: '从你的年龄开始',
    body: [
      '整站都对着你现在的年龄。填一个数字，直接进入时间轴。',
      '不用填真实姓名。每个模块里的 AI 分析，注册送 50 次；用完可输入续码，或填自己的 Key。',
    ],
    age: true,
  },
];

/**
 * 翻页式介绍文档：登录后首次进入弹出，一页页翻，看完（或跳过）标记 localStorage，
 * 之后不再弹。挂在 root layout，全站一个实例。
 */
export function OnboardingTour() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [ageText, setAgeText] = useState('');
  const [ageError, setAgeError] = useState('');

  useEffect(() => {
    if (isLoading || !user) return;
    try {
      // 按用户区分：同一浏览器里的第二个新账号也要看到介绍
      if (localStorage.getItem(onboardingSeenKey(user.id)) === '1') return;
    } catch { /* ignore */ }
    const existing = readDefaultAge();
    if (existing !== null) setAgeText(String(existing));
    setOpen(true);
  }, [user, isLoading]);

  const finish = () => {
    try { if (user) localStorage.setItem(onboardingSeenKey(user.id), '1'); } catch { /* ignore */ }
    setOpen(false);
  };

  const submitAge = () => {
    const n = parseAgeInput(ageText);
    if (n === null) {
      setAgeError(`请填 ${AGE_MIN}–${AGE_MAX} 的整数`);
      return;
    }
    writeDefaultAge(n);
    finish();
    router.push('/me');
  };

  if (!open || !user) return null;

  const p = PAGES[page];
  const last = page === PAGES.length - 1;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="功能介绍">
      <button aria-label="关闭介绍" onClick={finish} className="absolute inset-0 bg-black/65 md:bg-black/55" />
      <div className="animate-fade-in-up relative w-full max-w-xl overflow-hidden rounded-md border border-border bg-card shadow-2xl">
        {/* 页头 */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{p.tag}</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground/70">
              {String(page + 1).padStart(2, '0')} / {String(PAGES.length).padStart(2, '0')}
            </span>
            <button
              onClick={finish}
              aria-label="跳过介绍"
              className="rounded-md p-1 text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 页身 */}
        <div key={page} style={{ animation: 'fade-in 240ms ease both' }} className="max-h-[52vh] overflow-y-auto px-6 py-6 sm:px-8">
          <h2 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">{p.title}</h2>
          <div className="mt-4 space-y-2.5">
            {p.body.map((line, i) => (
              <p key={i} className="text-sm leading-[1.9] text-muted-foreground">{line}</p>
            ))}
          </div>
          {p.points && (
            <dl className="mt-5 space-y-2.5">
              {p.points.map((pt) => (
                <div key={pt.label} className="flex gap-3 border-l border-border pl-3">
                  <dt className="w-12 shrink-0 font-serif text-sm text-foreground">{pt.label}</dt>
                  <dd className="text-[13px] leading-relaxed text-muted-foreground">{pt.desc}</dd>
                </div>
              ))}
            </dl>
          )}
          {p.age && (
            <form
              className="mt-5"
              onSubmit={(e) => { e.preventDefault(); submitAge(); }}
            >
              <label htmlFor="onboarding-age" className="mb-1.5 block text-xs text-muted-foreground">
                你现在几岁
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="onboarding-age"
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={ageText}
                  onChange={(e) => { setAgeText(e.target.value); setAgeError(''); }}
                  placeholder={`${AGE_MIN}–${AGE_MAX}`}
                  className="w-28 rounded-md border border-border bg-background px-3 py-2 text-sm tabular-nums text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <span className="text-xs text-muted-foreground">岁</span>
              </div>
              {ageError && <p className="mt-2 text-xs text-destructive">{ageError}</p>}
              <p className="mt-2 text-[11px] text-muted-foreground/80">也可以先跳过，之后在时间轴里再填。</p>
            </form>
          )}
        </div>

        {/* 页脚 */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="flex gap-1.5">
            {PAGES.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {page > 0 && (
              <button
                onClick={() => setPage(page - 1)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                上一页
              </button>
            )}
            {!last ? (
              <button
                onClick={() => setPage(page + 1)}
                className="btn-press inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                下一页
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={finish}
                  className="rounded-md px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  跳过
                </button>
                <button
                  onClick={submitAge}
                  className="btn-press inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  进入时间轴
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
