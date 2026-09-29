'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  User, Settings, Shield, Moon, Sun, Palette, Clock, BarChart3,
  CheckCircle2, Circle, Loader2, CheckCircle,
  XCircle, Zap, ChevronRight, Cpu, ArrowRight,
  LogOut, RotateCcw, Weight, Milestone, Lock, Crown, Ticket,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, ALL_MODULES, NORMAL_USER_MODULES } from '@/contexts/auth-context';
import { AiSourceManager } from '@/components/ai/ai-source-manager';
import { STORAGE_KEY_ACTIVE, type AiSource } from '@/lib/ai-sources';

const modules = [
  { name: '名字', path: '/name', icon: '01' },
  { name: '职业', path: '/career', icon: '02' },
  { name: '规律', path: '/laws', icon: '03' },
  { name: '窗口', path: '/windows', icon: '04' },
  { name: '努力', path: '/simulation', icon: '05' },
  { name: '运气', path: '/luck', icon: '06' },
  { name: '命运', path: '/destiny', icon: '07' },
];

// ---- AI provider types ----

const BUILTIN_PROVIDER = {
  id: 'builtin' as const,
  name: '内置 AI',
  description: '系统默认 AI，无需配置密钥',
  color: 'text-primary',
  bg: 'bg-primary/10',
};



type AiSourceId = 'builtin' | string;

interface KeyStatus {
  state: 'idle' | 'testing' | 'success' | 'error';
  message?: string;
  responseSnippet?: string;
}

const AVATAR_OPTIONS = ['🧑‍💻', '👩‍🚀', '🧙‍♂️', '🦊', '🐺', '🦁', '🐉', '🦅', '🐋', '🦉', '🌵', '🔥'];

const DEFAULT_LIFE_STAGES = [
  { id: 'childhood', label: '童年', range: [0, 12] },
  { id: 'teen', label: '青少年', range: [13, 18] },
  { id: 'young-adult', label: '青年起步', range: [19, 25] },
  { id: 'adult', label: '壮年奋斗', range: [26, 35] },
  { id: 'midlife', label: '中年深耕', range: [36, 50] },
  { id: 'mature', label: '成熟收获', range: [51, 65] },
  { id: 'elder', label: '晚年', range: [66, 100] },
];

const DEFAULT_WEIGHTS = [
  { id: 'health', label: '健康', value: 50, icon: '❤️' },
  { id: 'wealth', label: '财富', value: 50, icon: '💰' },
  { id: 'career', label: '事业', value: 50, icon: '📈' },
  { id: 'relationship', label: '关系', value: 50, icon: '👥' },
  { id: 'growth', label: '成长', value: 50, icon: '📚' },
  { id: 'freedom', label: '自由', value: 50, icon: '🕊️' },
];

// ---- Simple hash for local auth (kept for legacy compatibility) ----

// ---- Main Component ----

export default function UserPage() {
  const pathname = usePathname();
  const { user: authUser, login: authLogin, register: authRegister, logout: authLogout, redeemCode, isPremium, canAccessModule } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [visitedPaths, setVisitedPaths] = useState<string[]>([]);
  const [activeAiSource, setActiveAiSource] = useState<AiSourceId>('builtin');
  // 用户自定义接入源（独立存储 ai-sources，供顶部"当前使用"显示）
  const [customSources, setCustomSources] = useState<AiSource[]>([]);
  const [keyStatuses, setKeyStatuses] = useState<Record<string, KeyStatus>>({});
  const [defaultAge, setDefaultAge] = useState<number>(25);
  const [showAgeInput, setShowAgeInput] = useState(false);

  // User profile state no longer needed - authUser from AuthContext is used instead
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [loginNickname, setLoginNickname] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Invite code
  const [inviteCode, setInviteCode] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [inviteMessage, setInviteMessage] = useState('');

  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lifeStages, setLifeStages] = useState(DEFAULT_LIFE_STAGES);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  // ---- Load persisted state ----

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));

    // Track visit - mark current path as visited
    try {
      const stored = localStorage.getItem('visited-modules');
      const visited: string[] = stored ? JSON.parse(stored) : [];
      if (!visited.includes(pathname)) {
        visited.push(pathname);
        localStorage.setItem('visited-modules', JSON.stringify(visited));
      }
      setVisitedPaths(visited);
    } catch {
      setVisitedPaths([pathname]);
    }

    try {
      const storedActive = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (storedActive) setActiveAiSource(storedActive as AiSourceId);
    } catch { /* ignore */ }
    try {
      const storedCustom = localStorage.getItem('ai-sources');
      if (storedCustom) setCustomSources(JSON.parse(storedCustom));
    } catch { /* ignore */ }
    try {
      const storedAge = localStorage.getItem('default-age');
      if (storedAge) setDefaultAge(parseInt(storedAge, 10));
    } catch { /* ignore */ }

    // Load advanced settings
    try {
      const storedStages = localStorage.getItem('life-stages');
      if (storedStages) setLifeStages(JSON.parse(storedStages));
    } catch { /* ignore */ }
    try {
      const storedWeights = localStorage.getItem('preference-weights');
      if (storedWeights) setWeights(JSON.parse(storedWeights));
    } catch { /* ignore */ }
  }, [pathname]);

  // Track module page visits
  useEffect(() => {
    if (pathname && pathname !== '/' && pathname !== '/user') {
      setVisitedPaths(prev => {
        if (prev.includes(pathname)) return prev;
        const next = [...prev, pathname];
        try { localStorage.setItem('visited-modules', JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    }
  }, [pathname]);

  // 登录弹层：Esc 关闭（无键盘出口的弹层对键盘用户等于困住）
  useEffect(() => {
    if (!showLoginDialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLoginDialog(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLoginDialog]);

  const persist = useCallback((key: string, value: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, []);

  // ---- Auth logic (delegated to AuthContext) ----

  const handleRegister = async () => {
    if (!loginNickname.trim() || !loginPassword.trim()) {
      setLoginError('请输入昵称和密码');
      return;
    }
    if (loginNickname.trim().length > 20) {
      setLoginError('昵称最多20个字符');
      return;
    }
    if (loginPassword.length < 4) {
      setLoginError('密码至少4位');
      return;
    }
    setLoginPending(true);
    const result = await authRegister(loginNickname.trim(), loginPassword);
    setLoginPending(false);
    if (result.success) {
      setShowLoginDialog(false);
      setLoginError('');
      setLoginNickname('');
      setLoginPassword('');
    } else {
      setLoginError(result.error || '注册失败');
    }
  };

  const handleLogin = async () => {
    if (!loginNickname.trim() || !loginPassword.trim()) {
      setLoginError('请输入昵称和密码');
      return;
    }
    setLoginPending(true);
    const result = await authLogin(loginNickname.trim(), loginPassword);
    setLoginPending(false);
    if (result.success) {
      setShowLoginDialog(false);
      setLoginError('');
      setLoginNickname('');
      setLoginPassword('');
    } else {
      setLoginError(result.error || '登录失败');
    }
  };

  const handleLogout = () => {
    authLogout();
  };

  const handleRedeemCode = async () => {
    if (!inviteCode.trim()) return;
    setInviteStatus('loading');
    setInviteMessage('');
    const result = await redeemCode(inviteCode.trim());
    if (result.success) {
      setInviteStatus('success');
      setInviteMessage('充电成功！已解锁全部模块');
      setInviteCode('');
    } else {
      setInviteStatus('error');
      setInviteMessage(result.error || '兑换失败');
    }
  };

  // ---- Theme / Age / API helpers ----

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };


  // 参数放宽为 string：自定义源 id 是运行时生成的（src_xxx），不在 AiSourceId 字面量里
  const setActiveSource = useCallback((sourceId: AiSourceId | string) => {
    setActiveAiSource(sourceId as AiSourceId);
    persist(STORAGE_KEY_ACTIVE, sourceId);
  }, [persist]);



  const testBuiltin = async () => {
    setKeyStatuses(prev => ({ ...prev, builtin: { state: 'testing' } as KeyStatus }));
    try {
      const response = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'builtin' }),
      });
      const data = await response.json();
      if (data.success) {
        setKeyStatuses(prev => ({ ...prev, builtin: { state: 'success', message: data.message || '内置 AI 正常', responseSnippet: data.responseSnippet } }));
      } else {
        setKeyStatuses(prev => ({ ...prev, builtin: { state: 'error', message: data.error || '内置 AI 异常' } }));
      }
    } catch (err) {
      setKeyStatuses(prev => ({ ...prev, builtin: { state: 'error', message: err instanceof Error ? err.message : '请求失败' } }));
    }
  };

  const updateDefaultAge = useCallback((age: number) => {
    setDefaultAge(age);
    persist('default-age', age);
  }, [persist]);

  // ---- Advanced settings handlers ----

  const updateStageRange = (id: string, field: 'start' | 'end', value: number) => {
    setLifeStages(prev => {
      const next = prev.map(s => {
        if (s.id !== id) return s;
        const range = field === 'start' ? [value, s.range[1]] : [s.range[0], value];
        return { ...s, range };
      });
      persist('life-stages', next);
      return next;
    });
  };

  const updateStageLabel = (id: string, label: string) => {
    setLifeStages(prev => {
      const next = prev.map(s => s.id === id ? { ...s, label } : s);
      persist('life-stages', next);
      return next;
    });
  };

  const updateWeight = (id: string, value: number) => {
    setWeights(prev => {
      const next = prev.map(w => w.id === id ? { ...w, value: Math.max(0, Math.min(100, value)) } : w);
      persist('preference-weights', next);
      return next;
    });
  };

  const resetAdvanced = () => {
    setLifeStages(DEFAULT_LIFE_STAGES);
    setWeights(DEFAULT_WEIGHTS);
    persist('life-stages', DEFAULT_LIFE_STAGES);
    persist('preference-weights', DEFAULT_WEIGHTS);
  };

  // ---- Computed values ----

  const visitedCount = visitedPaths.filter(p => modules.some(m => m.path === p)).length;
  const totalModules = modules.length;
  const progressPercent = Math.round((visitedCount / totalModules) * 100);


  // Role display
  const accessibleModules = authUser ? (isPremium ? ALL_MODULES : NORMAL_USER_MODULES) : ALL_MODULES;
  const accessibleCount = accessibleModules.length;

  const getActiveModelInfo = (): { name: string; source: string } => {
    if (activeAiSource === 'builtin') {
      return { name: '服务端 env（AI_MODEL）', source: '内置 AI' };
    }
    // 自定义源（src_xxx）
    const custom = customSources.find(s => s.id === activeAiSource);
    if (custom) return { name: custom.model, source: custom.name };
    return { name: '未知', source: '未知' };
  };


  const activeModelInfo = getActiveModelInfo();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card grain-texture">
        <div className="relative max-w-3xl mx-auto px-6 sm:px-8 py-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3 animate-fade-in-up">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground shadow-sm">
                <User className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/60 tracking-[0.2em]">MODULE 08</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2 animate-fade-in-up stagger-1">用户中心</h1>
            <p className="text-sm text-muted-foreground animate-fade-in-up stagger-2">管理你的偏好和设置</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8 space-y-6">

        {/* ===== Profile Card ===== */}
        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up stagger-2">
          {authUser ? (
            <div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl ring-2 ring-primary/5 hover:ring-primary/20 transition-all cursor-pointer"
                  title="点击更换头像"
                >
                  {authUser.avatar}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">{authUser.nickname}</h2>
                    {/* Role badge */}
                    {authUser.role === 'developer' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Crown className="w-3 h-3" /> 开发者
                      </span>
                    ) : authUser.role === 'premium' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                        <Zap className="w-3 h-3" /> 充电用户
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                        普通用户
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {accessibleCount}/{totalModules} 模块可用 · 注册于 {new Date(authUser.created_at).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                  退出
                </button>
              </div>

              {/* Invite code section for normal users */}
              {!isPremium && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">邀请码充电</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    输入邀请码升级为充电用户，解锁全部 {totalModules} 个模块
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={inviteCode}
                      onChange={(e) => { setInviteCode(e.target.value); setInviteStatus('idle'); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleRedeemCode()}
                      placeholder="输入邀请码"
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={handleRedeemCode}
                      disabled={!inviteCode.trim() || inviteStatus === 'loading'}
                      className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-press disabled:opacity-50"
                    >
                      {inviteStatus === 'loading' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                      充电
                    </button>
                  </div>
                  {inviteStatus === 'success' && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3.5 w-3.5" /> {inviteMessage}
                    </div>
                  )}
                  {inviteStatus === 'error' && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                      <XCircle className="h-3.5 w-3.5" /> {inviteMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/5">
                <User className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-foreground">访客用户</h2>
                <p className="text-xs text-muted-foreground">注册后可保存偏好和升级权限</p>
              </div>
              <button
                onClick={() => { setShowLoginDialog(true); setLoginMode('register'); setLoginError(''); }}
                className="rounded-md bg-primary px-4 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-press"
              >
                注册 / 登录
              </button>
            </div>
          )}

          {/* Avatar picker */}
          {showAvatarPicker && authUser && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-muted-foreground mb-2">选择头像</p>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map(a => (
                  <button
                    key={a}
                    onClick={() => {
                      // Update avatar locally for now
                      setShowAvatarPicker(false);
                    }}
                    className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center text-xl transition-all',
                      authUser.avatar === a ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-muted/40 hover:bg-muted'
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== Login Dialog ===== */}
        {showLoginDialog && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowLoginDialog(false)} aria-hidden="true" />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-dialog-title"
              className="fixed z-50 inset-x-4 top-[20%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md animate-scale-in"
            >
              <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 id="login-dialog-title" className="text-base font-serif font-semibold text-foreground">
                      {loginMode === 'register' ? '创建账号' : '欢迎回来'}
                    </h3>
                    <button
                      onClick={() => setShowLoginDialog(false)}
                      aria-label="关闭对话框"
                      className="p-1.5 -m-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                    >
                      <XCircle className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {loginMode === 'register' ? '注册后偏好和数据将保存在本地' : '登录以恢复你的数据'}
                  </p>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label htmlFor="login-nickname" className="text-[10px] font-medium text-muted-foreground mb-1.5 block">昵称</label>
                    <input
                      id="login-nickname"
                      type="text"
                      value={loginNickname}
                      onChange={(e) => setLoginNickname(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (loginMode === 'register' ? handleRegister() : handleLogin())}
                      placeholder="输入你的昵称"
                      maxLength={20}
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="text-[10px] font-medium text-muted-foreground mb-1.5 block">密码</label>
                    <input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (loginMode === 'register' ? handleRegister() : handleLogin())}
                      placeholder={loginMode === 'register' ? '至少4位密码' : '输入密码'}
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  {loginError && (
                    <p role="alert" className="text-xs text-destructive">{loginError}</p>
                  )}

                  <button
                    onClick={loginMode === 'register' ? handleRegister : handleLogin}
                    disabled={loginPending}
                    aria-busy={loginPending}
                    className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-press disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loginPending && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                    {loginPending ? '处理中…' : loginMode === 'register' ? '注册' : '登录'}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => { setLoginMode(loginMode === 'register' ? 'login' : 'register'); setLoginError(''); }}
                      className="text-xs text-primary hover:underline"
                    >
                      {loginMode === 'register' ? '已有账号？去登录' : '没有账号？去注册'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===== Exploration Progress ===== */}
        <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">探索进度</h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{visitedCount}/{totalModules}</span>
          </div>

          <div className="mb-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/50 transition-all duration-700 progress-shimmer"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground">{progressPercent}% 完成</span>
              <span className="text-[10px] text-primary/60">
                {visitedCount >= totalModules ? '已探索全部模块' : `还有 ${totalModules - visitedCount} 个模块待探索`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {modules.map((mod) => {
              const isVisited = visitedPaths.includes(mod.path);
              const isLocked = authUser ? !canAccessModule(mod.path) : false;
              return (
                <Link
                  key={mod.path}
                  href={mod.path}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2.5 transition-all group/progress',
                    isLocked ? 'bg-muted/20 border border-border opacity-60' :
                    isVisited ? 'bg-primary/5 border border-primary/10 hover:bg-primary/10' : 'bg-muted/30 border border-border hover:bg-muted/50'
                  )}
                >
                  {isLocked ? (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                  ) : isVisited ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[9px] font-mono tabular-nums', isLocked ? 'text-muted-foreground/20' : isVisited ? 'text-primary/50' : 'text-muted-foreground/30')}>
                        {mod.icon}
                      </span>
                      <span className={cn('text-xs', isLocked ? 'text-muted-foreground/50' : isVisited ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                        {mod.name}
                      </span>
                    </div>
                  </div>
                  {!isLocked && (
                    <ArrowRight className="h-3 w-3 text-muted-foreground/0 group-hover/progress:text-muted-foreground/50 transition-colors shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
          {authUser && !isPremium && (
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>锁定的模块需充电解锁 · 当前可用 {accessibleCount}/{totalModules}</span>
            </div>
          )}
        </div>

        {/* ===== AI Source Management ===== */}
        <div className="rounded-lg border border-border bg-card animate-fade-in-up stagger-4">
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">AI 模型管理</h3>
            </div>
            <p className="text-xs text-muted-foreground">选择 AI 来源，配置密钥，用于各模块的深度分析功能</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[9px] text-muted-foreground">当前使用:</span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 rounded-sm px-2 py-0.5">
                <Zap className="h-2.5 w-2.5" />
                {activeModelInfo.source} / {activeModelInfo.name}
              </span>
              {customSources.length > 0 && (
                <span className="text-[9px] text-muted-foreground/60">
                  ({customSources.filter(s => s.enabled).length}/{customSources.length} 个自定义源已启用)
                </span>
              )}
            </div>
          </div>

          <div className="divide-y divide-border">
            {/* Built-in AI */}
            <div className="relative">
              <div className="flex items-center gap-4 px-6 py-4">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold shrink-0', activeAiSource === 'builtin' ? BUILTIN_PROVIDER.bg : 'bg-muted', activeAiSource === 'builtin' ? BUILTIN_PROVIDER.color : 'text-muted-foreground')}>
                  <Cpu className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{BUILTIN_PROVIDER.name}</p>
                    {activeAiSource === 'builtin' && (
                      <span className="flex items-center gap-1 text-[9px] text-primary bg-primary/10 rounded-sm px-1.5 py-0.5"><Zap className="h-2.5 w-2.5" />使用中</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{BUILTIN_PROVIDER.description}</p>
                </div>
                <button onClick={() => setActiveSource('builtin')} className={cn('rounded-md px-3 py-1.5 text-[10px] font-medium transition-all', activeAiSource === 'builtin' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted')}>
                  {activeAiSource === 'builtin' ? '使用中' : '切换'}
                </button>
              </div>
              {activeAiSource === 'builtin' && (
                <div className="px-6 pb-5 space-y-3 animate-fade-in-up">
                  <div className="rounded-md border border-border bg-muted/20 px-3 py-2.5">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      内置 AI 的模型由服务端 <span className="font-mono">.env</span> 的 <span className="font-mono">AI_MODEL</span> 决定，这里改不了。
                      想换模型或换厂商，用下面的「自定义接入」。
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={testBuiltin} disabled={keyStatuses['builtin']?.state === 'testing'} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all">
                      {keyStatuses['builtin']?.state === 'testing' ? (<><Loader2 className="h-3 w-3 animate-spin" />测试中...</>) : (<><Zap className="h-3 w-3" />测试连接</>)}
                    </button>
                  </div>
                  {keyStatuses['builtin']?.state === 'success' && (
                    <div className="rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-3 space-y-1">
                      <div className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0" /><span className="text-[11px] font-medium text-green-700 dark:text-green-300">{keyStatuses['builtin'].message}</span></div>
                      {keyStatuses['builtin'].responseSnippet && (<p className="text-[10px] text-green-600/70 dark:text-green-400/70 ml-5 truncate">AI 回复: &quot;{keyStatuses['builtin'].responseSnippet}&quot;</p>)}
                    </div>
                  )}
                  {keyStatuses['builtin']?.state === 'error' && (
                    <div className="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3">
                      <div className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-red-500 dark:text-red-400 shrink-0" /><span className="text-[11px] font-medium text-red-600 dark:text-red-300">{keyStatuses['builtin'].message}</span></div>
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* 自定义接入：任意接口地址（中转站 / 自建网关 / 本地模型） */}
            <div className="px-6 py-5">
              <AiSourceManager onActiveChanged={() => {
                // 自定义源被设为当前 / 增删后，刷新顶部"当前使用"显示
                const cur = localStorage.getItem(STORAGE_KEY_ACTIVE);
                if (cur) setActiveSource(cur);
                try {
                  setCustomSources(JSON.parse(localStorage.getItem('ai-sources') || '[]'));
                } catch { /* ignore */ }
              }} />
            </div>
          </div>
        </div>

        {/* ===== Settings ===== */}
        <div className="rounded-lg border border-border bg-card divide-y divide-border animate-fade-in-up stagger-5">
          {/* Theme */}
          <button onClick={toggleTheme} className="flex items-center gap-4 w-full px-6 py-4 text-left hover:bg-accent/30 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">外观模式</p>
              <p className="text-xs text-muted-foreground">{isDark ? '深色模式' : '浅色模式'}</p>
            </div>
            <div className={cn('relative h-6 w-11 rounded-full transition-colors duration-200', isDark ? 'bg-primary' : 'bg-muted')}>
              <div className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200', isDark ? 'translate-x-[22px]' : 'translate-x-0.5')} />
            </div>
          </button>

          {/* Default Age */}
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">默认年龄</p>
              <p className="text-xs text-muted-foreground">用于窗口和命运模块的年龄基准</p>
            </div>
            {showAgeInput ? (
              <div className="flex items-center gap-2">
                <input type="number" min={0} max={120} value={defaultAge} onChange={(e) => updateDefaultAge(Math.max(0, Math.min(120, parseInt(e.target.value) || 0)))} className="w-16 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground text-center focus:outline-none focus:ring-1 focus:ring-ring" autoFocus />
                <span className="text-[10px] text-muted-foreground">岁</span>
                <button onClick={() => setShowAgeInput(false)} className="text-[10px] text-primary hover:underline">确定</button>
              </div>
            ) : (
              <button onClick={() => setShowAgeInput(true)} className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs text-foreground hover:bg-accent/30 transition-colors">
                <span className="font-mono tabular-nums">{defaultAge}</span>
                <span className="text-muted-foreground">岁</span>
              </button>
            )}
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">数据安全</p>
              <p className="text-xs text-muted-foreground">账号数据云端加密存储，偏好设置本地保存</p>
            </div>
            <span className="text-[9px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-sm px-2 py-1">已保护</span>
          </div>

          {/* Advanced Settings */}
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-4 w-full px-6 py-4 text-left hover:bg-accent/30 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Settings className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">高级设置</p>
              <p className="text-xs text-muted-foreground">自定义人生阶段、偏好权重</p>
            </div>
            <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', showAdvanced && 'rotate-90')} />
          </button>
        </div>

        {/* ===== Advanced Settings Panel ===== */}
        {showAdvanced && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Life Stages */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Milestone className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">自定义人生阶段</h3>
                </div>
                <button onClick={resetAdvanced} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  <RotateCcw className="h-3 w-3" />
                  重置
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">调整各人生阶段的起止年龄，影响窗口和命运模块的阶段划分</p>
              <div className="space-y-3">
                {lifeStages.map((stage, idx) => (
                  <div key={stage.id} className="flex items-center gap-3">
                    <div className={cn(
                      'w-2 h-8 rounded-full shrink-0',
                      idx < 2 ? 'bg-emerald-400' : idx < 4 ? 'bg-amber-400' : idx < 6 ? 'bg-orange-400' : 'bg-slate-400'
                    )} />
                    <input
                      type="text"
                      value={stage.label}
                      onChange={(e) => updateStageLabel(stage.id, e.target.value)}
                      className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={stage.range[0]}
                        onChange={(e) => updateStageRange(stage.id, 'start', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 rounded-md border border-input bg-background px-1.5 py-1 text-xs text-foreground text-center focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={stage.range[1]}
                        onChange={(e) => updateStageRange(stage.id, 'end', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 rounded-md border border-input bg-background px-1.5 py-1 text-xs text-foreground text-center focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <span className="text-muted-foreground/60">岁</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preference Weights */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Weight className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">偏好权重</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">调整各维度在你人生中的重要性权重，影响命运分析和规律优先级</p>
              <div className="space-y-4">
                {weights.map((w) => (
                  <div key={w.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{w.icon}</span>
                        <span className="text-xs font-medium text-foreground">{w.label}</span>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-primary">{w.value}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={w.value}
                      onChange={(e) => updateWeight(w.id, parseInt(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== About ===== */}
        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up stagger-6">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">关于</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            人生重构计划是一个基于数据与概率的人生规划工具。我们不提供标准答案——
            每个人的人生都是独特的。我们只提供一个框架，帮助你更清晰地看到牌面、
            计算概率、识别窗口。
          </p>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[9px] text-muted-foreground/40 font-mono">v1.1.0</span>
            <span className="text-[9px] text-muted-foreground/40 font-serif italic">不是算命，是算概率</span>
          </div>
        </div>
      </div>
    </div>
  );
}
