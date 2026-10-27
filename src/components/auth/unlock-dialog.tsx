'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Zap, LogIn, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
  dismissUnlock,
  useRunPendingLockedAction,
  useUnlockOpen,
} from '@/hooks/use-locked-action';
import { unlockStore } from '@/lib/unlock-store';
import { BUSINESS_MODE } from '@/lib/business-mode';

const IS_OPEN_MODE = BUSINESS_MODE === 'open';

// 必须静态引用 process.env.NEXT_PUBLIC_CONTACT，Next 才会在构建时内联
const CONTACT = (process.env.NEXT_PUBLIC_CONTACT ?? '').trim();

/**
 * 全局解锁引导弹窗（挂在 root layout，全站一个实例）。
 *
 * 手写弹窗：Esc 关闭、Tab 焦点循环、遮罩点击关闭。
 * 访客 → 引导去 /user 登录/注册；
 * 已登录未持码 → 就地输入授权码兑换，成功即全站解锁。
 * 解锁后自动执行被拦截的原动作（见 use-locked-action.ts）。
 */
export function UnlockDialog() {
  const open = useUnlockOpen();
  const { user, isPremium, redeemCode } = useAuth();
  useRunPendingLockedAction();

  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (inputRef.current ?? panelRef.current)?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
    // handleDismiss 每次渲染都重建，这里只在 open 变化时绑定一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const resetForm = () => {
    setCode('');
    setError('');
    setDone(false);
  };

  // 用户主动关闭：放弃待执行动作
  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dismissUnlock();
    resetForm();
  };

  // 去登录：只隐藏弹窗，保留待执行动作（登录后回到原页面再执行）
  const goLogin = () => {
    unlockStore.hide();
    resetForm();
  };

  const handleRedeem = async () => {
    const trimmed = code.trim();
    if (!trimmed || pending) return;
    setPending(true);
    setError('');
    const result = await redeemCode(trimmed);
    setPending(false);
    if (result.success) {
      setDone(true);
      // 关闭后由 useRunPendingLockedAction 执行原动作
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        unlockStore.hide();
        resetForm();
      }, 1200);
    } else {
      setError(result.error || '兑换失败');
    }
  };

  if (!open || typeof document === 'undefined') return null;

  const handleTrapTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/65 md:bg-black/55 animate-fade-in"
        onClick={handleDismiss}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        onKeyDown={handleTrapTab}
        className="fixed z-[70] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm rounded-md border border-primary/25 bg-background shadow-2xl p-6 animate-scale-in outline-none"
      >
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="关闭"
            className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>

          {done ? (
            <>
              <h2 id={titleId} className="text-lg font-serif font-bold text-foreground mb-2">
                解锁成功
              </h2>
              <p id={descId} className="text-sm text-muted-foreground">
                {IS_OPEN_MODE ? 'AI 次数已补充。' : '全部模块与 AI 分析已对您开放。'}
              </p>
            </>
          ) : (
            <>
              <h2 id={titleId} className="text-lg font-serif font-bold text-foreground mb-1.5">
                {IS_OPEN_MODE ? '补充 AI 次数' : '解锁全部内容'}
              </h2>
              {IS_OPEN_MODE ? (
                <p id={descId} className="text-xs text-muted-foreground leading-relaxed mb-5">
                  AI 次数用完后，可输入续码补充，也可填入自己的 Key。
                </p>
              ) : (
                <p id={descId} className="text-xs text-muted-foreground leading-relaxed mb-5">
                  授权码分两种：<span className="text-foreground">使用权码</span>解锁全部功能（详情、AI、报告），
                  <span className="text-foreground">AI 额度码</span>为 AI 分析充值；<span className="text-foreground">套餐码</span>两者都含（推荐）。
                  向开发者索取：加好友或邮件。
                </p>
              )}

              {CONTACT && (IS_OPEN_MODE || !isPremium) && (
                <p className="text-xs text-muted-foreground mb-5">
                  {IS_OPEN_MODE ? '获取续码请联系：' : '获取授权码请联系：'}
                  <span className="text-foreground select-all">{CONTACT}</span>
                </p>
              )}

              {!user ? (
                <Link
                  href="/user"
                  onClick={goLogin}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  先去登录 / 注册
                </Link>
              ) : isPremium && !IS_OPEN_MODE ? (
                <p className="text-sm text-muted-foreground">您已是充电用户，无需解锁。</p>
              ) : (
                <div className="space-y-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRedeem(); }}
                    placeholder={IS_OPEN_MODE ? '输入续码' : '输入授权码，如 LR-XXXXXX'}
                    maxLength={100}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base md:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                  {error && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                      <X className="h-3.5 w-3.5" /> {error}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleRedeem}
                    disabled={!code.trim() || pending}
                    className="w-full px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {pending ? '兑换中…' : IS_OPEN_MODE ? '兑换' : '解锁'}
                  </button>
                </div>
              )}
            </>
          )}
      </div>
    </>,
    document.body
  );
}
