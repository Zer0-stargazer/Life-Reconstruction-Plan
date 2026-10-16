'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

/**
 * 登录过期提示横幅（挂在 AuthProvider 内）。
 * 云同步 / 通知轮询 / AI 请求收到 401 时由 auth-context.handleSessionExpired 触发。
 * 本地数据保留，重新登录同一账号即可继续。
 */
export function SessionExpiredBanner() {
  const { sessionExpired } = useAuth();
  const pathname = usePathname();
  if (!sessionExpired) return null;

  const next = pathname && pathname !== '/user' ? `?next=${encodeURIComponent(pathname)}` : '';

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-12 z-[45] flex items-center justify-center gap-3 border-b border-border bg-card/95 px-4 py-2 text-sm backdrop-blur-sm md:left-56 md:top-0"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden />
      <span className="text-foreground">登录已过期，请重新登录</span>
      <Link
        href={`/user${next}`}
        className="rounded-sm bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        登录
      </Link>
    </div>
  );
}
