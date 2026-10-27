'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import {
  type LucideIcon,
  Home,
  Menu,
  X,
  Lock,
  Shield,
  LogOut,
  User,
  Heart,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { useAuth, type UserRole } from '@/contexts/auth-context';
import { useTheme } from 'next-themes';
import { RoleBadge } from '@/components/auth/module-gate';
import { CHAPTERS, MODULE_IDENTITIES } from '@/lib/module-identity';
import { USER_STATE_DIRTY_EVENT } from '@/lib/user-state-sync';
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
const aboutItem = { href: '/about', label: '支持作者', icon: Heart };

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isDeveloper, canAccessModule, updateUserRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [exitError, setExitError] = useState('');
  useEffect(() => { setMounted(true); }, []);

  // 探索进度：只读 visited-modules（写入方是根布局的 ModuleVisitTracker）。
  // 跟随 storage（跨标签）、user-state:dirty（本页写入 / 云同步回写）与路由变化刷新。
  const [visited, setVisited] = useState<string[]>([]);
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.visitedModules);
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        setVisited(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []);
      } catch {
        setVisited([]);
      }
    };
    read();
    window.addEventListener('storage', read);
    window.addEventListener(USER_STATE_DIRTY_EVENT, read);
    return () => {
      window.removeEventListener('storage', read);
      window.removeEventListener(USER_STATE_DIRTY_EVENT, read);
    };
  }, [pathname]);
  const readCount = MODULE_IDENTITIES.filter((m) => visited.includes(m.href)).length;

  // 隐藏后台入口（彩蛋式暗门）：3 秒内连点侧栏题记 5 次进入 /admin。
  // 正常用户不可能触达；知道的人也可以直接输入 /admin 网址进入（页内还有密码门）。
  const secretClicksRef = useRef<number[]>([]);
  const handleSecretTap = () => {
    const now = Date.now();
    secretClicksRef.current = [...secretClicksRef.current.filter(t => now - t < 3000), now];
    if (secretClicksRef.current.length >= 5) {
      secretClicksRef.current = [];
      router.push('/admin');
    }
  };

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
    setExitError('');
    let devToken = '';
    try { devToken = localStorage.getItem(STORAGE_KEYS.devToken) || ''; } catch { /* ignore */ }
    if (!devToken) {
      setExitError('开发者凭证已失效，请先进入开发者后台重新验证');
      return;
    }
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken },
        body: JSON.stringify({ action: 'exit_developer', userId: user.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && data.newRole) {
        updateUserRole(data.newRole as UserRole);
      } else {
        setExitError(data.error || '退出开发者模式失败，请重试');
      }
    } catch {
      setExitError('网络错误，退出开发者模式失败');
    }
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
              人生沙盘
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

        <div className="mt-6 space-y-0.5">
          {renderItem(userItem)}
          {renderItem(aboutItem)}
        </div>
      </nav>

      {/* 探索进度：已浏览 N / 8 章 + 8 格细刻度（已访问为朱砂实格）；仅登录时显示。
          文案说明「打开过」而非「读完/解锁」——只是访问记录，不代表内容都已读完。 */}
      {user && (
        <div className="px-5 pb-3 pt-2" aria-label={`浏览进度：已打开 ${readCount} / ${MODULE_IDENTITIES.length} 个板块`}>
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">已打开</span>
            <span className="font-mono text-[11px] tabular-nums tracking-[0.1em] text-muted-foreground">
              {readCount} / {MODULE_IDENTITIES.length} 个板块
            </span>
          </div>
          <div className="mt-2 flex gap-[3px]" aria-hidden>
            {MODULE_IDENTITIES.map((m) => (
              <span
                key={m.href}
                className={cn('h-1.5 flex-1', visited.includes(m.href) ? 'bg-primary' : 'bg-border')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="px-5">
        <div className="h-px bg-border" />
      </div>

      {/* Developer link —— 仅开发者可见；普通用户通过暗门（连点题记 5 次）或直接输入 /admin 进入 */}
      {isDeveloper && (
        <div className="px-3 pb-1 pt-2">
          <Link
            href="/admin"
            className={cn(
              'flex items-center gap-3 py-2 pl-4 pr-3 text-sm transition-colors duration-500',
              pathname === '/admin'
                ? 'font-medium text-amber-600 dark:text-amber-400'
                : 'text-amber-600/80 hover:text-amber-600 dark:text-amber-400/80 dark:hover:text-amber-400'
            )}
          >
            <Shield className="h-4 w-4 shrink-0" strokeWidth={1.25} />
            <span className="truncate">开发者后台</span>
          </Link>
          {/* Exit developer mode button */}
          <button
            onClick={handleExitDeveloper}
            className="flex w-full items-center gap-3 py-2 pl-4 pr-3 text-sm text-muted-foreground transition-colors duration-500 hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.25} />
            <span className="truncate">退出开发者模式</span>
          </button>
          {exitError && (
            <p role="alert" className="pl-4 pr-3 pb-1 text-[12px] leading-snug text-destructive">{exitError}</p>
          )}
        </div>
      )}

      {/* Footer：角色 + 一句题记 */}
      <div className="px-5 pb-5 pt-2">
        <div className="mb-3">
          <RoleBadge />
        </div>
        {/* 题记：同时是后台暗门（3 秒内连点 5 次 → /admin），对外无任何可见提示 */}
        <p
          className="font-serif text-[12px] italic leading-relaxed text-muted-foreground select-none cursor-default"
          onClick={handleSecretTap}
        >
          「人生没有标准答案，<br />但有更好的决策框架」
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
      <div className="fixed left-0 right-0 top-0 z-50 flex h-12 items-center border-b border-border bg-sidebar px-4 md:hidden">
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
          <span className="font-serif text-sm font-semibold text-foreground">人生沙盘</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-40 bg-black/50 md:hidden"
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
          'fixed left-0 top-0 z-50 flex h-dvh w-60 flex-col border-r border-border bg-sidebar transition-transform duration-500 ease-out md:hidden',
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
