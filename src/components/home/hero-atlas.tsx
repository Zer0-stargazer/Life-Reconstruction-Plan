'use client';

import { useEffect, useRef } from 'react';
import { MOTION, gsap, prefersReducedMotion, registerGsap } from '@/lib/motion';

const NODES = ['时', '窗', '名', '职', '规', '运', '努', '命'];
const CX = 300;
const CY = 300;

function polar(r: number, i: number) {
  const a = (-90 + i * 45) * (Math.PI / 180);
  return [
    Number((CX + r * Math.cos(a)).toFixed(2)),
    Number((CY + r * Math.sin(a)).toFixed(2)),
  ] as const;
}

/**
 * 首页扉页的主视觉：八个维度环绕一枚朱砂印。
 * 墨线由 GSAP 逐条描出，印章中心落下；外圈刻度通过 CSS 缓慢自转（减少动效时停止）。
 */
export function HeroAtlas({ animated = true, withSeal = true }: { animated?: boolean; withSeal?: boolean }) {
  const rootRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animated || prefersReducedMotion() || !rootRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION.ease } });
      tl.fromTo(
        '[data-atlas="draw"]',
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.25 },
        0.3
      )
        .from('[data-atlas="node"]', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: MOTION.base, stagger: 0.07 }, 0.9)
        .fromTo(
          '[data-atlas="seal"]',
          { opacity: 0, scale: 1.7, rotate: -14, transformOrigin: '50% 50%' },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'power4.out' },
          1.5
        );
    }, rootRef);
    return () => ctx.revert();
  }, [animated]);

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const major = i % 9 === 0;
    const [x1, y1] = polar(282, i / 72 * 8);
    const [x2, y2] = polar(major ? 268 : 275, i / 72 * 8);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={major ? 1 : 0.6} />;
  });

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
      <g opacity="0.22">
        <circle cx={CX} cy={CY} r="290" strokeWidth="1" />
        <circle cx={CX} cy={CY} r="180" strokeWidth="0.8" strokeDasharray="2 5" />
        <circle cx={CX} cy={CY} r="120" strokeWidth="0.8" />
        <line x1="10" y1={CY} x2="590" y2={CY} strokeWidth="0.6" />
        <line x1={CX} y1="10" x2={CX} y2="590" strokeWidth="0.6" />
      </g>

      <g className="hero-atlas-spin" style={{ transformOrigin: '300px 300px' }}>
        <g opacity="0.45">{ticks}</g>
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

      {NODES.map((ch, i) => {
        const [x, y] = polar(282, i);
        return (
          <g key={ch} data-atlas="node" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx={x} cy={y} r="19" fill="var(--background)" stroke="var(--border)" strokeWidth="1" />
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
          </g>
        );
      })}

      {withSeal && (
        <g transform="translate(240 240) scale(3)">
          <g data-atlas="seal">
            <rect x="0" y="0" width="40" height="40" rx="3" fill="var(--primary)" stroke="none" />
            <path d="M28.4 10.0 A13 13 0 1 1 13.5 8.7" stroke="#f6efe2" strokeWidth="0.5" strokeLinecap="round" />
            <circle cx="28.4" cy="10.0" r="1.6" fill="#f6efe2" stroke="none" />
            <rect x="15.2" y="14.2" width="9.6" height="5" stroke="#f6efe2" strokeWidth="0.43" />
            <rect x="13.4" y="20.6" width="13.2" height="5.4" stroke="#f6efe2" strokeWidth="0.43" />
          </g>
        </g>
      )}
    </svg>
  );
}
