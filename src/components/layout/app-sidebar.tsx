'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  type LucideIcon,
  Home,
  Menu,
  X,
  Lock,
  Shield,
  LogOut,
  User,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { useAuth, type UserRole } from '@/contexts/auth-context';
import { useTheme } from 'next-themes';
import { RoleBadge } from '@/components/auth/module-gate';
import { CHAPTERS } from '@/lib/module-identity';
import { chapterMeta } from '@/lib/chapter-meta';
import { SealMark } from '@/components/shared/seal-mark';
import {
  CareerIcon,
  DestinyIcon,
  HealthIcon,
  LawsIcon,
  LuckIcon,
  NameIcon,
  SimulationIcon,
  TimeIcon,
  WindowIcon,
  type ModuleIconComponent,
} from '@/components/shared/module-icons';

const homeItem = { href: '/', label: '首页', icon: Home };
const userItem = { href: '/user', label: '我的', icon: User };

type NavIcon = LucideIcon | ModuleIconComponent;

const chapterItems: Record<string, { href: string; label: string; icon: NavIcon }> = {
  '/me': { href: '/me', label: '时间轴', icon: TimeIcon },
  '/windows': { href: '/windows', label: '窗口', icon: WindowIcon },
  '/name': { href: '/name', label: '名字', icon: NameIcon },
  '/career': { href: '/career', label: '职业', icon: CareerIcon },
  '/laws': { href: '/laws', label: '规律', icon: LawsIcon },
  '/luck': { href: '/luck', label: '运气', icon: LuckIcon },
  '/simulation': { href: '/simulation', label: '努力', icon: SimulationIcon },
  '/health': { href: '/health', label: '健康', icon: HealthIcon },
  '/destiny': { href: '/destiny', label: '命运', icon: DestinyIcon },
};

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isDeveloper, canAccessModule, updateUserRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleExitDeveloper = async () => {
    if (!user || user.role !== 'developer') return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'exit_developer', userId: user.id }),
      });
      const data = await res.json();
      if (data.success && data.newRole) {
        updateUserRole(data.newRole as UserRole);
      }
    } catch { /* ignore */ }
  };

  const renderItem = (item: { href: string; label: string; icon: NavIcon }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    const isLocked = user && !canAccessModule(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group relative flex items-center gap-3 rounded-sm py-2 pl-4 pr-3 text-sm transition-[color,background-color,transform] duration-300 ease-out hover:translate-x-0.5',
          isActive
            ? 'font-medium text-primary'
            : isLocked
              ? 'text-muted-foreground/75 hover:bg-foreground/[0.04] hover:text-muted-foreground'
              : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground'
        )}
      >
        {isActive && <span aria-hidden className="nav-rule" />}
        <Icon className="h-5 w-5 shrink-0" strokeWidth={1.25} />
        <span className="flex-1 truncate">{item.label}</span>
        {isLocked && <Lock className="h-3 w-3 shrink-0 text-muted-foreground/75" strokeWidth={1.25} />}
        {!isActive && !isLocked && (
          <ChevronRight
            className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60"
            strokeWidth={1.25}
            aria-hidden
          />
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo：印章 + 字标 */}
      <div className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-3">
          <SealMark className="h-9 w-9 rounded-[2px] text-[15px]" />
          <div className="min-w-0 flex-1">
            <div className="font-serif text-[15px] font-semibold leading-tight tracking-tight text-foreground">
              人生重构计划
            </div>
          </div>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" strokeWidth={1.25} /> : <Moon className="h-3.5 w-3.5" strokeWidth={1.25} />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation：首页 · 序章 … 终章 · 我的 */}
      <nav data-lenis-prevent className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">{renderItem(homeItem)}</div>

        {CHAPTERS.map((chapter) => {
          const meta = chapterMeta(chapter.num);
          return (
            <div key={chapter.num} className="mt-6">
              <div className="px-4 pb-1.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif text-base leading-none text-primary">{chapter.num}</span>
                  <span className="font-serif text-xs text-muted-foreground">{chapter.title}</span>
                </div>
                <div className="mt-1 pl-[1.4rem] text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                  {meta.en}
                </div>
              </div>
              <div className="space-y-0.5">
                {chapter.hrefs.map((href) => {
                  const item = chapterItems[href];
                  return item ? renderItem(item) : null;
                })}
              </div>
            </div>
          );
        })}

        <div className="mt-6 space-y-0.5">{renderItem(userItem)}</div>
      </nav>

      {/* Divider */}
      <div className="px-5">
        <div className="h-px bg-border" />
      </div>

      {/* Developer link - always visible for convenience */}
      <div className="px-3 pb-1 pt-2">
        <Link
          href="/admin"
          className={cn(
            'flex items-center gap-3 py-2 pl-4 pr-3 text-sm transition-colors duration-500',
            pathname === '/admin'
              ? 'font-medium text-amber-600 dark:text-amber-400'
              : isDeveloper
                ? 'text-amber-600/80 hover:text-amber-600 dark:text-amber-400/80 dark:hover:text-amber-400'
                : 'text-muted-foreground/75 hover:text-muted-foreground'
          )}
        >
          <Shield className="h-4 w-4 shrink-0" strokeWidth={1.25} />
          <span className="truncate">{isDeveloper ? '开发者后台' : '管理入口'}</span>
        </Link>
        {/* Exit developer mode button */}
        {isDeveloper && (
          <button
            onClick={handleExitDeveloper}
            className="flex w-full items-center gap-3 py-2 pl-4 pr-3 text-sm text-muted-foreground transition-colors duration-500 hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.25} />
            <span className="truncate">退出开发者模式</span>
          </button>
        )}
      </div>

      {/* Footer：角色 + 一句题记 */}
      <div className="px-5 pb-5 pt-2">
        <div className="mb-3">
          <RoleBadge />
        </div>
        <p className="font-serif text-[12px] italic leading-relaxed text-muted-foreground">
          &ldquo;人生没有标准答案，<br />但有更好的决策框架&rdquo;
        </p>
        <div className="mt-3 flex gap-3 text-[11px] text-muted-foreground/70">
          <Link href="/terms" className="hover:text-foreground">用户协议</Link>
          <Link href="/privacy" className="hover:text-foreground">隐私政策</Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-12 items-center border-b border-border bg-sidebar/95 px-4 backdrop-blur-sm md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.25} /> : <Menu className="h-5 w-5" strokeWidth={1.25} />}
        </button>
        <div className="ml-3 flex items-center gap-2.5">
          <SealMark className="h-6 w-6 rounded-[2px] text-xs" />
          <span className="font-serif text-sm font-semibold text-foreground">人生重构计划</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        id="mobile-nav"
        data-lenis-prevent
        /* 关闭态 inert：移出视口的同时脱离 Tab 序与读屏，焦点不再"消失"到屏外 */
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-border bg-sidebar transition-transform duration-500 ease-out md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-56 flex-col border-r border-border bg-sidebar md:flex">
        {sidebarContent}
      </aside>
    </>
  );
}
