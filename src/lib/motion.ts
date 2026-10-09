'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 全站动效的统一参数。
 *
 * 规则：时长 0.5–1.2s，缓动只用 power3.out / expo.out，不用回弹，不做无限循环。
 * 所有 GSAP 入场都从这里取值，避免各处各写一套节奏。
 */
export const MOTION = {
  ease: 'power3.out',
  easeExpo: 'expo.out',
  /** 小元件（箭头、线、标签） */
  fast: 0.5,
  /** 常规入场 */
  base: 0.9,
  /** 大标题、章节numeral */
  slow: 1.2,
  /** 相邻元素的错开间隔 */
  stagger: 0.09,
} as const;

let registered = false;

/** 注册 ScrollTrigger，全应用只执行一次 */
export function registerGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
