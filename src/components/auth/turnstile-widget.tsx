'use client';

import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile 人机验证组件（仅注册表单使用）。
 * 没有配置 NEXT_PUBLIC_TURNSTILE_SITE_KEY 时不渲染（开发友好，服务端同样跳过校验）。
 */

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => {
        scriptPromise = null; // 允许重试
        s.remove();
        reject(new Error('turnstile script load failed'));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

export const TURNSTILE_ENABLED = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface Props {
  /** token 变化回调：拿到 token 传字符串；过期/失败传 null */
  onToken: (token: string | null) => void;
  /** 父组件递增该值可强制重置（例如注册失败后 token 已被消耗） */
  resetSignal?: number;
}

export function TurnstileWidget({ onToken, resetSignal = 0 }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'auto',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => {
            onTokenRef.current(null);
            if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
          },
          'error-callback': () => {
            onTokenRef.current(null);
            if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
          },
        });
      })
      .catch(() => onTokenRef.current(null));
    return () => {
      cancelled = true;
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current) {
      onTokenRef.current(null);
      window.turnstile?.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="flex justify-center min-h-[65px]" aria-label="人机验证" />;
}
