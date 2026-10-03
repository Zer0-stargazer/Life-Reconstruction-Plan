'use client';

import { useAuth } from '@/contexts/auth-context';
import { Lock, Zap, Crown } from 'lucide-react';
import { unlockStore } from '@/lib/unlock-store';

// Module lock overlay - wraps module page content
//
// 2026-10-02 起为预览模式：不再整页拦截——列表/摘要永远渲染，
// 详情弹层、AI 分析等触发动作由各页 useLockedAction().guard 拦截；
// 预览态时在页头下方挂一条解锁引导横幅（PreviewBanner）。
export function ModuleGate({ modulePath, children }: { modulePath: string; children: React.ReactNode }) {
  const { isLoading, canAccessModule } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md text-left">
          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      {!canAccessModule(modulePath) && <PreviewBanner />}
      {children}
    </>
  );
}

/**
 * 访客预览横幅：一句话说明当前是"可逛不可点"的预览态，
 * 解锁动作收口到全局 UnlockDialog（unlockStore.show）。
 */
export function PreviewBanner() {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 pt-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-primary/25 bg-primary/[0.05] px-4 py-2.5">
        <Lock className="h-3.5 w-3.5 shrink-0 text-primary/70" />
        <span className="text-xs text-muted-foreground leading-relaxed">
          访客预览：可浏览全部条目；<span className="text-foreground font-medium">详情与 AI 分析</span>需授权码解锁
          {user ? '' : '（登录后可用码兑换）'}
        </span>
        <button
          onClick={() => unlockStore.show()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors btn-press"
        >
          <Zap className="h-3.5 w-3.5" />
          解锁
        </button>
      </div>
    </div>
  );
}

// Sidebar lock indicator
export function ModuleLockIcon({ modulePath }: { modulePath: string }) {
  const { isLoading, canAccessModule } = useAuth();

  if (isLoading || canAccessModule(modulePath)) return null;

  return (
    <Lock className="w-3 h-3 text-muted-foreground/60" />
  );
}

// Role badge component
export function RoleBadge() {
  const { user, isPremium, isDeveloper } = useAuth();

  if (!user) return null;

  if (isDeveloper) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Crown className="w-3 h-3" />
        开发者
      </span>
    );
  }

  if (isPremium) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
        <Zap className="w-3 h-3" />
        充电用户
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
      普通用户
    </span>
  );
}
