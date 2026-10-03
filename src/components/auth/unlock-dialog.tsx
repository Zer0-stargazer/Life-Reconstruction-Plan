'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, LogIn, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useUnlockOpen, } from '@/hooks/use-locked-action';
import { unlockStore } from '@/lib/unlock-store';

/**
 * 全局解锁引导弹窗（挂在 root layout，全站一个实例）。
 *
 * 访客 → 引导去 /user 登录/注册；
 * 已登录未持码 → 就地输入授权码兑换，成功即全站解锁（角色更新后各页自动响应）。
 */
export function UnlockDialog() {
  const open = useUnlockOpen();
  const { user, isPremium, redeemCode } = useAuth();
  const [code, setCode] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!open) return null;

  const close = () => {
    unlockStore.hide();
    setCode('');
    setError('');
    setDone(false);
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
      setTimeout(close, 1200);
    } else {
      setError(result.error || '兑换失败');
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="解锁全部内容"
        className="fixed z-[70] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-primary/25 bg-background shadow-2xl p-6 animate-scale-in"
      >
        <button
          onClick={close}
          aria-label="关闭"
          className="absolute right-3 top-3 h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <Zap className="h-6 w-6 text-primary" />
        </div>

        {done ? (
          <div>
            <h3 className="text-lg font-serif font-bold text-foreground mb-2">解锁成功</h3>
            <p className="text-sm text-muted-foreground">全部模块与 AI 分析已对您开放。</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-serif font-bold text-foreground mb-1.5">解锁全部内容</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              输入授权码后解锁全部模块详情与 AI 分析；授权码向开发者索取（加好友或邮件）。
            </p>

            {!user ? (
              <Link
                href="/user"
                onClick={close}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                先去登录 / 注册
              </Link>
            ) : isPremium ? (
              <p className="text-sm text-muted-foreground">您已是充电用户，无需解锁。</p>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRedeem(); }}
                  placeholder="输入授权码，如 LR-XXXXXX"
                  maxLength={100}
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                {error && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <X className="h-3.5 w-3.5" /> {error}
                  </p>
                )}
                <button
                  onClick={handleRedeem}
                  disabled={!code.trim() || pending}
                  className="w-full px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {pending ? '兑换中…' : '解锁'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
