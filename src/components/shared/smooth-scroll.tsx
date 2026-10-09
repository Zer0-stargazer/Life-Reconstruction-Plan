'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion, registerGsap } from '@/lib/motion';

/**
 * 全站唯一的平滑滚动源（Lenis），与 GSAP ticker 同步。
 *
 * - 开着 prefers-reduced-motion 时完全不启动 Lenis，保持原生滚动。
 * - ScrollTrigger 每帧跟随 Lenis 的滚动位置更新，避免进场触发错位。
 * - 侧栏、移动端抽屉等内部滚动区域用 data-lenis-prevent 让出滚轮。
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      anchors: true,
      allowNestedScroll: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
