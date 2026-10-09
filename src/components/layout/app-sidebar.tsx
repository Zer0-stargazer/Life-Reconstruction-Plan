'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  type LucideIcon,
  PenTool,
  Briefcase,
  Compass,
  SlidersHorizontal,
  Clock,
  Dice5,
  User,
  Home,
  Menu,
  X,
  Scale,
  Lock,
  Shield,
  LogOut,
  CalendarRange,
} from 'lucide-react';
import { useAuth, type UserRole } from '@/contexts/auth-context';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { RoleBadge } from '@/components/auth/module-gate';
import { CHAPTERS } from '@/lib/module-identity';

const homeItem = { href: '/', label: '首页', icon: Home };
const userItem = { href: '/user', label: '我的', icon: User };

const chapterItems: Record<string, { href: string; label: string; icon: LucideIcon }> = {
  '/me': { href: '/me', label: '时间轴', icon: CalendarRange },
  '/windows': { href: '/windows', label: '窗口', icon: Clock },
  '/name': { href: '/name', label: '名字', icon: PenTool },
  '/career': { href: '/career', label: '职业', icon: Briefcase },
  '/laws': { href: '/laws', label: '规律', icon: Scale },
  '/luck': { href: '/luck', label: '运气', icon: Dice5 },
  '/simulation': { href: '/simulation', label: '努力', icon: SlidersHorizontal },
  '/destiny': { href: '/destiny', label: '命运', icon: Compass },
};

/** 朱砂方印，内写「重」——站点 logo */
function Seal({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex items-center justify-center bg-primary font-serif font-bold text-primary-foreground leading-none',
        className
      )}
    >
      重
    </span>
  );
}

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

  const renderItem = (item: { href: string; label: string; icon: LucideIcon }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    const isLocked = user && !canAccessModule(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200',
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : isLocked
              ? 'text-muted-foreground/50 hover:bg-accent/30 hover:text-muted-foreground/70'
              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
        {isLocked && <Lock className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Seal className="h-8 w-8 rounded-sm text-base" />
          <span className="text-sm font-semibold text-foreground tracking-tight font-serif">人生重构计划</span>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-auto h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation：首页 · 序章 … 终章 · 我的 */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-0.5">{renderItem(homeItem)}</div>

        {CHAPTERS.map((chapter) => (
          <div key={chapter.num} className="mt-4">
            <div className="px-3 pb-1 flex items-baseline gap-2 text-[11px] text-muted-foreground/60">
              <span className="font-serif text-xs text-foreground/70">{chapter.num}</span>
              <span className="font-serif">{chapter.title}</span>
            </div>
            <div className="space-y-0.5">
              {chapter.hrefs.map((href) => {
                const item = chapterItems[href];
                return item ? renderItem(item) : null;
              })}
            </div>
          </div>
        ))}

        <div className="mt-4 space-y-0.5">{renderItem(userItem)}</div>
      </nav>

      {/* Divider */}
      <div className="px-5 py-2">
        <div className="h-px bg-border" />
      </div>

      {/* Developer link - always visible for convenience */}
      <div className="px-3 pb-1">
        <Link
          href="/admin"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-200',
            pathname === '/admin'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium'
              : isDeveloper
                ? 'text-amber-600/70 dark:text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-600'
                : 'text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-muted/30'
          )}
        >
          <Shield className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{isDeveloper ? '开发者后台' : '管理入口'}</span>
        </Link>
        {/* Exit developer mode button */}
        {isDeveloper && (
          <button
            onClick={handleExitDeveloper}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm w-full text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/30 transition-colors duration-200"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">退出开发者模式</span>
          </button>
        )}
      </div>

      {/* Footer Quote */}
      <div className="px-5 pb-4 pt-1">
        <div className="mb-2">
          <RoleBadge />
        </div>
        <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-serif italic">
          &ldquo;人生没有标准答案，<br />但有更好的决策框架&rdquo;
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 border-b border-border bg-sidebar/95 backdrop-blur-sm flex items-center px-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2 ml-3">
          <Seal className="h-6 w-6 rounded-sm text-xs" />
          <span className="text-sm font-semibold text-foreground font-serif">人生重构计划</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        id="mobile-nav"
        /* 关闭态 inert：移出视口的同时脱离 Tab 序与读屏，焦点不再"消失"到屏外 */
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
        className={cn(
          'md:hidden fixed top-0 left-0 z-50 h-screen w-56 border-r border-border bg-sidebar flex flex-col transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-56 border-r border-border bg-sidebar flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
