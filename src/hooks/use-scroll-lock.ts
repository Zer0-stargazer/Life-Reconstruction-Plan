'use client';

/**
 * useScrollLock —— 弹层打开时锁定背景滚动。
 *
 * 做法与细节：
 * - active=false 时不碰 body（同 useEscapeKey 的挂载时机原则）；
 * - 锁定时给 body 补 padding-right，补偿滚动条消失造成的版面横跳；
 * - 多实例安全：计数器式加锁/解锁，多个弹层叠开时只在最后一个关闭时解锁。
 */

import { useEffect } from 'react';

let lockCount = 0;
let prevOverflow = '';
let prevPaddingRight = '';

export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;
    const body = document.body;
    if (lockCount === 0) {
      prevOverflow = body.style.overflow;
      prevPaddingRight = body.style.paddingRight;
      const gap = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (gap > 0) body.style.paddingRight = `${gap}px`;
    }
    lockCount += 1;
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        body.style.overflow = prevOverflow;
        body.style.paddingRight = prevPaddingRight;
      }
    };
  }, [active]);
}
