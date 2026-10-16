'use client';

import { useEffect, useRef } from 'react';
import { MODULE_IDENTITIES } from '@/lib/module-identity';
import {
  gsap,
  hasPlayedThisSession,
  markPlayedThisSession,
  prefersReducedMotion,
  registerGsap,
} from '@/lib/motion';
import { SESSION_KEYS } from '@/lib/storage-keys';

const HOME_NODES = ['时', '窗', '名', '职', '规', '运', '努', '命'];
/** /journey 的八个节点 = 八个模块（01–08），顺序与 module-identity 一致 */
const JOURNEY_NODES = MODULE_IDENTITIES.map((m) => ({ ch: m.title.charAt(0), href: m.href }));
const CX = 300;
const CY = 300;

function polar(r: number, i: number) {
  const a = (-90 + i * 45) * (Math.PI / 180);
  return [
    Number((CX + r * Math.cos(a)).toFixed(2)),
    Number((CY + r * Math.sin(a)).toFixed(2)),
  ] as const;
}

type AtlasMode = 'home' | 'journey';

const SESSION_KEY: Record<AtlasMode, string> = {
  home: SESSION_KEYS.atlasIntro,
  journey: SESSION_KEYS.journeyLit,
};

/** 这一段开场动效本会话是否还会播放（减少动效 / 已播放过 → 否）。供页面决定是否先隐藏随后淡入的文字 */
export function atlasWillPlay(mode: AtlasMode = 'home') {
  if (typeof window === 'undefined') return false;
  return !prefersReducedMotion() && !hasPlayedThisSession(SESSION_KEY[mode]);
}

/**
 * 首页扉页 / 终章的主视觉：八个节点环绕一枚朱砂印。
 *
 * mode="home"（开场落印，会话内只播一次，总长约 1.6s）：
 *   刻度轨道由内到外依次描出 → 8 个节点淡入 → 中心方印「盖下」（scale 1.12→0.98→1，350ms）
 *   并伴一次极淡的朱砂墨晕（radial 6%，opacity 0→.6→0，600ms，不是辉光）。
 * mode="journey"：轨道同样描出，随后按 `visited`（访问顺序）每 120ms 点亮一个节点
 *   （空心 → 实心朱砂），最后方印落下，结束时回调 onDone（页面据此淡入标题）。
 *
 * 之后外圈刻度 140s 慢转照旧。只用 stroke-dashoffset / transform / opacity。
 * prefers-reduced-motion 或本会话已播过：不播，直接是终态（onDone 立即回调）。
 */
export function HeroAtlas({
  animated = true,
  withSeal = true,
  mode = 'home',
  visited,
  onDone,
}: {
  animated?: boolean;
  withSeal?: boolean;
  mode?: AtlasMode;
  /** journey 专用：已访问模块的 href，按访问顺序；null/undefined = 还在读取，先不播 */
  visited?: string[] | null;
  /** 开场动效结束（或被跳过）时回调 */
  onDone?: () => void;
}) {
  const rootRef = useRef<SVGSVGElement>(null);
  const spinRef = useRef<SVGGElement>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const isJourney = mode === 'journey';
  const visitedKey = visited ? visited.join('|') : null;
  const ready = !isJourney || visited != null;

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const finish = () => onDoneRef.current?.();
    const key = SESSION_KEY[mode];
    if (!animated || prefersReducedMotion() || hasPlayedThisSession(key)) {
      finish();
      return;
    }
    registerGsap();

    const ctx = gsap.context(() => {
      const EASE = 'power2.inOut';
      const tl = gsap.timeline({
        onComplete: () => {
          markPlayedThisSession(key);
          finish();
        },
      });

      /* ① 刻度轨道由内到外依次描出（stagger）：内环 → 虚线环 → 朱砂弧 → 外环 */
      tl.fromTo('[data-atlas="ring-1"]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: EASE }, 0)
        .fromTo('[data-atlas="axis"]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: EASE, stagger: 0.05 }, 0.05)
        .fromTo('[data-atlas="ring-2"]', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power3.out' }, 0.12)
        .fromTo('[data-atlas="draw"]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: EASE }, 0.2)
        .fromTo('[data-atlas="ring-3"]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: EASE }, 0.35)
        .fromTo('[data-atlas="ticks"]', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power3.out' }, 0.6);

      /* ② 八个节点淡入 */
      tl.from(
        '[data-atlas="node"]',
        { opacity: 0, duration: 0.3, ease: 'power3.out', stagger: 0.035 },
        0.62
      );

      let sealAt = 1.0;

      /* ③ journey：按访问顺序每 120ms 点亮一个节点 */
      if (isJourney) {
        const order = visited ?? [];
        const lit = order
          .map((href) => JOURNEY_NODES.findIndex((n) => n.href === href))
          .filter((i, pos, arr) => i >= 0 && arr.indexOf(i) === pos);
        lit.forEach((idx, n) => {
          const at = 1.0 + n * 0.12;
          tl.fromTo(`[data-atlas-lit="${idx}"]`, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power3.out' }, at);
          tl.fromTo(`[data-atlas-lit-text="${idx}"]`, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power3.out' }, at);
        });
        sealAt = 1.0 + lit.length * 0.12 + 0.15;
      }

      /* ④ 中心方印「盖下」：1.12 → 0.98 → 1，共 350ms；同时一次极淡的朱砂墨晕 0 → .6 → 0，600ms */
      if (withSeal) {
        tl.fromTo(
          '[data-atlas="seal"]',
          { opacity: 0, scale: 1.12, transformOrigin: '50% 50%' },
          { opacity: 1, scale: 0.98, duration: 0.2, ease: 'power3.out', transformOrigin: '50% 50%' },
          sealAt
        )
          .to('[data-atlas="seal"]', { scale: 1, duration: 0.15, ease: 'power2.out', transformOrigin: '50% 50%' }, sealAt + 0.2)
          .fromTo('[data-atlas="bloom"]', { opacity: 0 }, { opacity: 0.6, duration: 0.2, ease: 'power2.out' }, sealAt)
          .to('[data-atlas="bloom"]', { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, sealAt + 0.2);
      }
    }, rootRef);
    return () => ctx.revert();
  }, [animated, mode, isJourney, ready, visitedKey, withSeal]); // eslint-disable-line react-hooks/exhaustive-deps -- visited 以 visitedKey 为依赖

  // 离屏时暂停自转，省掉看不见的合成开销
  useEffect(() => {
    const svg = rootRef.current;
    const spin = spinRef.current;
    if (!svg || !spin || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      spin.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const major = i % 9 === 0;
    const [x1, y1] = polar(282, i / 72 * 8);
    const [x2, y2] = polar(major ? 268 : 275, i / 72 * 8);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={major ? 1 : 0.6} />;
  });

  const nodes = isJourney ? JOURNEY_NODES : HOME_NODES.map((ch) => ({ ch, href: '' }));
  const visitedSet = new Set(visited ?? []);

  /* 描线用的圆：pathLength=1 + dasharray=1，stroke-dashoffset 0 即终态（SSR/无 JS 时完整可见） */
  const drawn = { pathLength: 1, strokeDasharray: 1, style: { strokeDashoffset: 0 } } as const;

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 600 600"
      className="h-full w-full text-foreground"
      fill="none"
      stroke="currentColor"
      aria-hidden
      focusable="false"
    >
      <defs>
        {/* 墨晕：primary 6% 的径向渐变（中心 10% × 峰值 .6），边缘归零 */}
        <radialGradient id="atlas-bloom-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g opacity="0.22">
        <circle data-atlas="ring-3" cx={CX} cy={CY} r="290" strokeWidth="1" {...drawn} />
        <circle data-atlas="ring-2" cx={CX} cy={CY} r="180" strokeWidth="0.8" strokeDasharray="2 5" />
        <circle data-atlas="ring-1" cx={CX} cy={CY} r="120" strokeWidth="0.8" {...drawn} />
        <line data-atlas="axis" x1="10" y1={CY} x2="590" y2={CY} strokeWidth="0.6" {...drawn} />
        <line data-atlas="axis" x1={CX} y1="10" x2={CX} y2="590" strokeWidth="0.6" {...drawn} />
      </g>

      <g ref={spinRef} className="hero-atlas-spin" style={{ transformOrigin: '300px 300px' }}>
        <g data-atlas="ticks" opacity="0.45">{ticks}</g>
        <circle
          data-atlas="draw"
          cx={CX}
          cy={CY}
          r="232"
          stroke="var(--primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ strokeDashoffset: 0 }}
          transform={`rotate(-70 ${CX} ${CY})`}
        />
      </g>

      {nodes.map(({ ch, href }, i) => {
        const [x, y] = polar(282, i);
        const isLit = isJourney && visitedSet.has(href);
        return (
          <g key={`${ch}-${i}`} data-atlas="node">
            <circle cx={x} cy={y} r="19" fill="var(--background)" stroke={isLit ? 'var(--primary)' : 'var(--border)'} strokeWidth="1" />
            <text
              x={x}
              y={y + 5.5}
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              className="font-serif"
              fontSize="16"
            >
              {ch}
            </text>
            {isLit && (
              <>
                {/* 点亮 = 实心朱砂点（叠在空心节点上，opacity 0→1） */}
                <circle data-atlas-lit={i} cx={x} cy={y} r="19" fill="var(--primary)" stroke="var(--primary)" strokeWidth="1" />
                <text
                  data-atlas-lit-text={i}
                  x={x}
                  y={y + 5.5}
                  textAnchor="middle"
                  fill="var(--primary-foreground)"
                  stroke="none"
                  className="font-serif"
                  fontSize="16"
                >
                  {ch}
                </text>
              </>
            )}
          </g>
        );
      })}

      {withSeal && (
        <>
          <circle data-atlas="bloom" cx={CX} cy={CY} r="130" fill="url(#atlas-bloom-grad)" stroke="none" opacity="0" />
          {/* 与全站标识 SealMark 同几何：朱砂方印内，一道未闭合圆弧包住两个叠起的空心方块，弧起一枚墨点 */}
          <g transform="translate(240 240) scale(3)">
            <g data-atlas="seal">
              <rect x="0" y="0" width="40" height="40" rx="3" fill="var(--primary)" stroke="none" />
              <path d="M28.4 10.0 A13 13 0 1 1 13.5 8.7" fill="none" stroke="#f6efe2" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="28.4" cy="10.0" r="1.6" fill="#f6efe2" stroke="none" />
              <rect x="15.2" y="14.2" width="9.6" height="5" fill="none" stroke="#f6efe2" strokeWidth="1.3" />
              <rect x="13.4" y="20.6" width="13.2" height="5.4" fill="none" stroke="#f6efe2" strokeWidth="1.3" />
            </g>
          </g>
        </>
      )}
    </svg>
  );
}
