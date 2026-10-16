'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { STORAGE_KEYS } from '@/lib/storage-keys';

/**
 * 访客下滑登录引导条：只在首页出现。
 * 用户要求「进来先看首页，往下滑之后弹出登录」——不打断浏览，
 * 滚过开头一段后从底部轻轻浮出一条；关掉后本次会话不再弹。
 */
export function VisitorLoginNudge() {
  const { user, isLoading } = useAuth();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (isLoading || user) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(STORAGE_KEYS.visitorNudgeDismissed) === '1';
    } catch { /* ignore */ }
    if (dismissed) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total > 0.45) setShow(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [user, isLoading]);

  if (!show || user) return null;

  const dismiss = () => {
    setLeaving(true);
    try { sessionStorage.setItem(STORAGE_KEYS.visitorNudgeDismissed, '1'); } catch { /* ignore */ }
    window.setTimeout(() => setShow(false), 320);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-300 ease-out ${leaving ? 'translate-y-full opacity-0' : 'animate-fade-in-up'}`}
      role="region"
      aria-label="登录引导"
    >
      <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-border bg-card/95 px-5 py-3.5 shadow-lg">
        <p className="text-sm text-muted-foreground">
          想看<span className="font-medium text-foreground">板块里的内容</span>，登录即可。
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/user"
            className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 btn-press"
          >
            登录 / 注册
          </Link>
          <button
            onClick={dismiss}
            aria-label="关闭"
            className="rounded-md p-1.5 text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
