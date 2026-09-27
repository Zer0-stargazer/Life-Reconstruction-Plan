'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  PenTool,
  Briefcase,
  Compass,
  SlidersHorizontal,
  Clock,
  Dice5,
  User,
  Home,
  Flame,
  Menu,
  X,
  ChevronRight,
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

const navItems = [
  { href: '/', label: '首页', icon: Home, desc: '总览' },
  { href: '/me', label: '时间轴', icon: CalendarRange, tag: '★', desc: '属于你的窗口' },
  { href: '/name', label: '名字', icon: PenTool, tag: '01', desc: '人生第一张牌' },
  { href: '/career', label: '职业', icon: Briefcase, tag: '02', desc: '赛道决定上限' },
  { href: '/destiny', label: '命运', icon: Compass, tag: '03', desc: '命与运的报告' },
  { href: '/laws', label: '规律', icon: Scale, tag: '04', desc: '人生暗箱齿轮' },
  { href: '/simulation', label: '努力', icon: SlidersHorizontal, tag: '05', desc: '命运模拟推演' },
  { href: '/windows', label: '窗口', icon: Clock, tag: '06', desc: '关键时机识别' },
  { href: '/luck', label: '运气', icon: Dice5, tag: '07', desc: '概率结构拆解' },
  { href: '/user', label: '我的', icon: User, tag: '08', desc: '偏好与设置' },
];

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

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
          <Flame className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground tracking-tight font-serif">人生重构计划</span>
          <span className="text-[9px] text-muted-foreground/70 tracking-[0.2em] uppercase font-mono">LIFE REBOOT</span>
        </div>
      </div>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="theme-toggle ml-auto h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isLocked = user && !canAccessModule(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary font-medium shadow-sm'
                  : isLocked
                    ? 'text-muted-foreground/50 hover:bg-accent/30 hover:text-muted-foreground/70'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              )}
            >
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded transition-colors duration-200',
                isActive ? 'bg-primary/15' : 'group-hover:bg-muted'
              )}>
                <Icon className="h-3.5 w-3.5 shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate">{item.label}</span>
                  {isLocked && (
                    <Lock className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                  )}
                  {item.tag && (
                    <span className={cn(
                      'text-[9px] font-mono tabular-nums',
                      isActive ? 'text-primary/50' : 'text-muted-foreground/40'
                    )}>
                      {item.tag}
                    </span>
                  )}
                </div>
              </div>
              {isActive && (
                <ChevronRight className="h-3 w-3 text-primary/40 shrink-0" />
              )}
            </Link>
          );
        })}
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
            'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200',
            pathname === '/admin'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium shadow-sm'
              : isDeveloper
                ? 'text-amber-600/70 dark:text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-600'
                : 'text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-muted/30'
          )}
        >
          <div className={cn(
            'flex h-6 w-6 items-center justify-center rounded',
            isDeveloper ? 'bg-amber-500/10' : 'bg-transparent'
          )}>
            <Shield className="h-3.5 w-3.5 shrink-0" />
          </div>
          <span className="truncate">{isDeveloper ? '开发者后台' : '管理入口'}</span>
        </Link>
        {/* Exit developer mode button */}
        {isDeveloper && (
          <button
            onClick={handleExitDeveloper}
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm w-full text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/30 transition-all duration-200"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded">
              <LogOut className="h-3.5 w-3.5 shrink-0" />
            </div>
            <span className="truncate">退出开发者模式</span>
          </button>
        )}
      </div>

      {/* Footer Quote */}
      <div className="px-5 pb-4 pt-1">
        <div className="flex items-center justify-between mb-2">
          <RoleBadge />
          <p className="text-[9px] text-muted-foreground/30 font-mono">v1.0</p>
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
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
            <Flame className="h-3 w-3" />
          </div>
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
      <aside className={cn(
        'md:hidden fixed top-0 left-0 z-50 h-screen w-56 border-r border-border bg-sidebar flex flex-col transition-transform duration-300 ease-out',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-56 border-r border-border bg-sidebar flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile content offset */}
      <div className="md:hidden h-12" />
    </>
  );
}
