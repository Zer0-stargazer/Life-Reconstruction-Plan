'use client';

import { usePathname } from 'next/navigation';
import { LOGIN_REQUIRED_MODULES, useAuth } from '@/contexts/auth-context';
import { GateSkeleton, LoginGate } from '@/components/auth/module-gate';

/** pathname 是否命中需登录板块（含子路径、容忍末尾斜杠） */
function matchLoginRequired(pathname: string | null): string | null {
  if (!pathname) return null;
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return LOGIN_REQUIRED_MODULES.find((m) => p === m || p.startsWith(`${m}/`)) ?? null;
}

/**
 * 路由级登录门（挂 root layout）：按 pathname 统一判定，新增板块只需登记进
 * LOGIN_REQUIRED_MODULES，不会再漏门。
 * 被挡住（加载中 / 未登录）时不渲染 children，页面组件及其数据都不会挂载。
 * 通过后各页内的 ModuleGate 判定必为"可看"，不会出现两层 LoginGate。
 */
export function RouteGate({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const pathname = usePathname();
  const modulePath = matchLoginRequired(pathname);

  if (!modulePath) return <>{children}</>;
  if (isLoading) return <GateSkeleton />;
  if (!user) return <LoginGate modulePath={modulePath} />;
  return <>{children}</>;
}
