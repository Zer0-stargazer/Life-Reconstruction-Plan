'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

/**
 * 全站动效的统一参数。
 *
 * 规则：时长 0.5–1.2s，缓动只用 power3.out / expo.out，不用回弹，不做无限循环。
 * 所有 GSAP 入场都从这里取值，避免各处各写一套节奏。
 *
 * 例外（有意保留的无限循环，均有 prefers-reduced-motion 兜底，见 globals.css）：
 * - 首页轨道图 .hero-atlas-spin：140s 一圈的外圈刻度慢转，离屏时由 IntersectionObserver 暂停；
 * - 首页 .home-marquee：60s 的横向字幕条。
 * 除此两处，其余动效一律一次性。
 */
export const MOTION = {
  ease: 'power3.out',
  easeExpo: 'expo.out',
  /** 小元件（箭头、线、标签） */
  fast: 0.5,
  /** 常规入场 */
  base: 0.9,
  /** 大标题、章节 numeral */
  slow: 1.2,
  /** 相邻元素的错开间隔 */
  stagger: 0.09,
} as const;

/**
 * CSS 侧的动效 token（globals.css 的 :root 里是同一套数值，改动需两边同步）：
 *
 *   --duration-fast 150ms    悬停：颜色 / 边框（card-lift）
 *   --duration-normal 250ms  弹层、详情卡翻开（translateY(8px) + opacity）
 *   --duration-slow 400ms    页面进场
 *   --ease-out-expo          cubic-bezier(.16,1,.3,1)，唯一的 CSS 曲线
 *   --dur-press 80ms         按压（btn-press，仅 opacity .85）
 *   --dur-meter 700ms        进度条一次性生长（MeterBar，scaleX）
 *   --rise 8px               进场位移幅度
 */
export const MOTION_CSS = {
  press: 80,
  fast: 150,
  normal: 250,
  slow: 400,
  meter: 700,
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
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

/* ---------- 平滑滚动：Lenis 实例登记 + 统一的程序化滚动入口 ---------- */

let activeLenis: Lenis | null = null;

/** 仅供 SmoothScroll 调用：登记 / 注销当前 Lenis 实例 */
export function setActiveLenis(instance: Lenis | null) {
  activeLenis = instance;
}

/**
 * 程序化滚动到某元素。
 * - prefers-reduced-motion：瞬间跳转；
 * - 有 Lenis：走 Lenis（与滚轮同一套缓动，不会互相打架）；
 * - 否则：原生 smooth。
 * @param offset 额外顶部偏移（px，正数 = 目标距视口顶部留白）
 */
export function scrollToEl(el: Element | null | undefined, opts: { offset?: number; block?: 'start' | 'center' } = {}) {
  if (!el || typeof window === 'undefined') return;
  const { offset = 0, block = 'start' } = opts;
  const rect = el.getBoundingClientRect();
  const base = block === 'center' ? rect.top - (window.innerHeight - rect.height) / 2 : rect.top - offset;
  const top = Math.max(0, base + window.scrollY);
  if (prefersReducedMotion()) {
    window.scrollTo({ top, behavior: 'auto' });
  } else if (activeLenis) {
    activeLenis.scrollTo(top, { duration: 0.9 });
  } else {
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/** 回到页面顶部（同 scrollToEl 的减弱动效规则） */
export function scrollToTop() {
  if (typeof window === 'undefined') return;
  if (prefersReducedMotion()) window.scrollTo({ top: 0, behavior: 'auto' });
  else if (activeLenis) activeLenis.scrollTo(0, { duration: 0.9 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- 「只播一次」：会话级播放标记（键需登记在 storage-keys 的 SESSION_KEYS） ---------- */

/** 本会话是否已播放过某段标志性动效（sessionStorage 不可用时视为已播放，宁可不播也不重复播） */
export function hasPlayedThisSession(key: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem(key) === '1';
  } catch {
    return true;
  }
}

/** 标记本会话已播放 */
export function markPlayedThisSession(key: string) {
  try {
    sessionStorage.setItem(key, '1');
  } catch {
    /* ignore */
  }
}

export { gsap, ScrollTrigger };
