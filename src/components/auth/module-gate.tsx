'use client';

import { useAuth } from '@/contexts/auth-context';
import { Lock, Zap, Crown, LogIn } from 'lucide-react';
import Link from 'next/link';

// Module lock overlay - wraps module page content
export function ModuleGate({ modulePath, children }: { modulePath: string; children: React.ReactNode }) {
  const { user, isLoading, canAccessModule } = useAuth();

  // 身份状态恢复中不渲染内容，避免登录态闪变。
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

  if (canAccessModule(modulePath)) {
    return <>{children}</>;
  }

  // Locked module
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center max-w-md animate-[fade-in-up_0.5s_ease-out]">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
          {user ? '该功能需要充电' : '请先登录'}
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {user ? (
            <>
              普通用户可免费使用「名字」「职业」「窗口」3个模块。<br />
              充电用户可解锁全部7个模块，畅享完整人生规划体验。
            </>
          ) : (
            <>
              未登录可免费浏览「名字」「职业」「窗口」3个基础模块。<br />
              注册后可使用基础模块；充电后解锁全部 7 个模块。
            </>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/user"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {user ? (
              <>
                <Zap className="w-4 h-4" />
                输入邀请码充电
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                登录 / 注册
              </>
            )}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <Crown className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="font-medium text-foreground">充电用户</div>
            <div className="text-muted-foreground text-xs">7/7 模块</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <Lock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <div className="font-medium text-foreground">普通用户</div>
            <div className="text-muted-foreground text-xs">3/7 模块</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="w-5 h-5 flex items-center justify-center mx-auto mb-1 text-primary font-serif font-bold">?</div>
            <div className="font-medium text-foreground">未登录</div>
            <div className="text-muted-foreground text-xs">需先登录</div>
          </div>
        </div>
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
