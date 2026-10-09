'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Shield, Users, Ticket, BarChart3, Plus, Trash2,
  Copy, RefreshCw,
  XCircle, Eye, EyeOff, LogOut, ChevronDown, ChevronRight,
  Zap, Crown, UserX, UserCheck, ArrowLeft, Coins, Activity, SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, type UserRole } from '@/contexts/auth-context';
import { STORAGE_KEYS } from '@/lib/storage-keys';

// ---- Types ----

interface AdminUser {
  id: number;
  nickname: string;
  avatar: string;
  role: string;
  is_active: boolean;
  invite_code_used: string | null;
  ai_credits: number;
  last_login_at: string | null;
  created_at: string;
}

interface AdminInvite {
  id: number;
  code: string;
  label: string | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  created_by: string | null;
  expires_at: string | null;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  totalInvites: number;
  premiumUsers: number;
  activeUsers: number;
}

interface CreditLog {
  id: number;
  delta: number;
  reason: string;
  balance: number;
  created_at: string;
}

interface UsageStat {
  total: number;
  ok: number;
}

interface UsageData {
  sampleSize: number;
  uniqueUsers: number;
  byModule: Record<string, UsageStat>;
  byDay: Record<string, UsageStat>;
}

const SWITCHES = [
  { key: 'builtin_ai_enabled', label: '内置 AI', desc: '关闭后，使用服务端 Key 的分析返回 503；用户自带 Key 不受影响' },
  { key: 'redeem_enabled', label: '邀请码兑换', desc: '关闭后兑换接口暂停服务，已兑换的额度不受影响' },
] as const;

type Tab = 'stats' | 'users' | 'invites' | 'usage' | 'settings';

// ---- Component ----

/** admin GET 请求失败（含状态码），用于区分 401（token 失效）和其他错误 */
class AdminApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export default function AdminPage() {
  const { user: authUser, updateUserRole } = useAuth();
  const [devToken, setDevToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [loading, setLoading] = useState(false);
  /** 数据加载失败时的可见错误（token 失效以外的场景） */
  const [dataError, setDataError] = useState<string | null>(null);

  // Data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  /** 用量与开关来自较新的迁移，失败时只影响对应标签页，不拖垮主数据 */
  const [extraError, setExtraError] = useState<string | null>(null);

  // Credit adjust panel (one user at a time)
  const [creditUserId, setCreditUserId] = useState<number | null>(null);
  const [creditDelta, setCreditDelta] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [creditLogs, setCreditLogs] = useState<CreditLog[]>([]);
  const [creditError, setCreditError] = useState('');
  const [creditBusy, setCreditBusy] = useState(false);

  // Create invite form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newMaxUses, setNewMaxUses] = useState('1');
  const [newCredits, setNewCredits] = useState('200');
  const [batchCount, setBatchCount] = useState('5');
  const [batchCredits, setBatchCredits] = useState('200');
  const [batchPrefix, setBatchPrefix] = useState('LR');

  // Load saved token
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.devToken);
      if (saved) setDevToken(saved);
    } catch { /* ignore */ }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (devToken && fetchAllData) fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devToken]);

  const api = useCallback(async (type: string, options?: RequestInit) => {
    const res = await fetch(`/api/admin?type=${type}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-dev-token': devToken || '',
        ...options?.headers,
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // 之前不检查 res.ok：token 过期时页面渲染成"0 用户"的假空表
      throw new AdminApiError(
        (data as { error?: string }).error || `请求失败: ${res.status}`,
        res.status
      );
    }
    return data;
  }, [devToken]);

  const fetchExtras = useCallback(async () => {
    try {
      const [usageRes, settingsRes] = await Promise.all([api('usage'), api('settings')]);
      if (usageRes.success) setUsage(usageRes.data);
      if (settingsRes.success) {
        const rows = (settingsRes.data || []) as { key: string; value: boolean }[];
        setSettings(Object.fromEntries(rows.map(r => [r.key, r.value])));
      }
      setExtraError(null);
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) return;
      setExtraError(err instanceof Error ? err.message : '扩展数据加载失败');
    }
  }, [api]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setDataError(null);
    try {
      const [statsRes, usersRes, invitesRes] = await Promise.all([
        api('stats'),
        api('users'),
        api('invites'),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data || []);
      if (invitesRes.success) setInvites(invitesRes.data || []);
      await fetchExtras();
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) {
        // token 失效：回验证界面并说明原因，而不是静默显示空数据
        setDevToken(null);
        try { localStorage.removeItem(STORAGE_KEYS.devToken); } catch { /* ignore */ }
        setLoginError('开发者身份已失效，请重新验证');
      } else {
        setDataError(err instanceof Error ? err.message : '数据加载失败');
      }
    }
    setLoading(false);
  }, [api, fetchExtras]);

  // ---- Dev Login ----

  const handleDevLogin = async () => {
    if (!password.trim()) {
      setLoginError('请输入开发者密码');
      return;
    }
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          password: password.trim(),
          userId: authUser?.id || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDevToken(data.token);
        try { localStorage.setItem(STORAGE_KEYS.devToken, data.token); } catch { /* ignore */ }
        setLoginError('');
        // If API returned updated user (auto-upgraded to developer), update AuthContext
        if (data.user && data.user.role === 'developer') {
          updateUserRole('developer');
        }
      } else {
        setLoginError(data.error || '密码错误');
      }
    } catch {
      setLoginError('网络错误');
    }
  };

  const handleDevLogout = async () => {
    // Exit developer mode - downgrade role
    if (authUser && authUser.role === 'developer') {
      try {
        const res = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
          body: JSON.stringify({ action: 'exit_developer', userId: authUser.id }),
        });
        const data = await res.json();
        if (data.success && data.newRole) {
          updateUserRole(data.newRole as UserRole);
        }
      } catch { /* ignore */ }
    }
    setDevToken(null);
    try { localStorage.removeItem(STORAGE_KEYS.devToken); } catch { /* ignore */ }
  };

  // ---- Invite Actions ----

  const handleCreateInvite = async () => {
    if (!newCode.trim()) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({
          action: 'create_invite',
          code: newCode.trim(),
          label: newLabel.trim() || undefined,
          maxUses: newMaxUses ? parseInt(newMaxUses) : undefined,
          aiCredits: newCredits ? parseInt(newCredits) || 0 : 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCode('');
        setNewLabel('');
        fetchAllData();
      } else {
        alert(data.error || '创建失败');
      }
    } catch {
      alert('网络错误');
    }
  };

  const handleBatchInvite = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({
          action: 'batch_invite',
          count: parseInt(batchCount) || 5,
          prefix: batchPrefix || 'LR',
          maxUses: 1,
          aiCredits: batchCredits ? parseInt(batchCredits) || 0 : 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
      } else {
        alert(data.error || '创建失败');
      }
    } catch {
      alert('网络错误');
    }
  };

  const handleDeleteInvite = async (id: number) => {
    if (!confirm('确定删除此邀请码？')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'delete_invite', inviteId: id }),
      });
      const data = await res.json();
      if (data.success) fetchAllData();
      else alert(data.error);
    } catch {
      alert('网络错误');
    }
  };

  const handleToggleInvite = async (id: number, isActive: boolean) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'toggle_invite', inviteId: id, isActive }),
      });
      const data = await res.json();
      if (data.success) fetchAllData();
      else alert(data.error);
    } catch {
      alert('网络错误');
    }
  };

  // ---- User Actions ----

  const handleUpdateUser = async (userId: number, updates: { role?: string; isActive?: boolean }) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'update_user', userId, ...updates }),
      });
      const data = await res.json();
      if (data.success) fetchAllData();
      else alert(data.error);
    } catch {
      alert('网络错误');
    }
  };

  const handleSetSetting = async (key: string, value: boolean) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'set_setting', key, value }),
      });
      const data = await res.json();
      if (data.success) fetchExtras();
      else alert(data.error || '更新失败');
    } catch {
      alert('网络错误');
    }
  };

  const loadCreditLogs = async (userId: number) => {
    try {
      const data = await api(`credit_logs&userId=${userId}`);
      if (data.success) setCreditLogs(data.data || []);
    } catch (err) {
      setCreditError(err instanceof Error ? err.message : '流水加载失败');
    }
  };

  const openCreditPanel = async (userId: number) => {
    if (creditUserId === userId) {
      setCreditUserId(null);
      return;
    }
    setCreditUserId(userId);
    setCreditDelta('');
    setCreditReason('');
    setCreditError('');
    setCreditLogs([]);
    await loadCreditLogs(userId);
  };

  const handleAdjustCredits = async () => {
    if (creditUserId === null) return;
    setCreditBusy(true);
    setCreditError('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({
          action: 'adjust_credits',
          userId: creditUserId,
          delta: Number(creditDelta),
          reason: creditReason,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setCreditError(data.error || '调整失败');
        return;
      }
      const userId = creditUserId;
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ai_credits: data.balance } : u)));
      setCreditDelta('');
      setCreditReason('');
      await loadCreditLogs(userId);
    } catch {
      setCreditError('网络错误');
    } finally {
      setCreditBusy(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  // ---- Login Screen ----

  if (!devToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm animate-[fade-in-up_0.5s_ease-out]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">开发者后台</h1>
            <p className="text-sm text-muted-foreground mt-2">输入开发者密码以进入管理后台</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleDevLogin()}
                placeholder="开发者密码"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> {loginError}
              </p>
            )}

            <button
              onClick={handleDevLogin}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              进入后台
            </button>

            <Link
              href="/"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- Admin Dashboard ----

  const usageView = usage && {
    okTotal: Object.values(usage.byModule).reduce((s, m) => s + m.ok, 0),
    days: Object.entries(usage.byDay).sort(([a], [b]) => a.localeCompare(b)).slice(-14),
    modules: Object.entries(usage.byModule).sort(([, a], [, b]) => b.total - a.total),
  };
  const maxDayTotal = Math.max(1, ...(usageView?.days.map(([, d]) => d.total) ?? [0]));

  const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'stats', label: '数据概览', icon: BarChart3 },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'invites', label: '邀请码', icon: Ticket },
    { id: 'usage', label: '调用看板', icon: Activity },
    { id: 'settings', label: '功能开关', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-serif font-bold text-foreground">开发者后台</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="刷新"
             aria-label="刷新数据">
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
            <button
              onClick={handleDevLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> 退出开发者模式
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {dataError && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>数据加载失败：{dataError}（可点右上角刷新重试）</span>
          </div>
        )}
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-muted/50 rounded-lg w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '总用户', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
                { label: '活跃用户', value: stats.activeUsers, icon: UserCheck, color: 'text-green-500' },
                { label: '充电用户', value: stats.premiumUsers, icon: Zap, color: 'text-amber-500' },
                { label: '邀请码', value: stats.totalInvites, icon: Ticket, color: 'text-purple-500' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={cn("w-4 h-4", item.color)} />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground font-mono">{item.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-medium text-foreground mb-3">角色分布</h3>
              <div className="space-y-2">
                {(['normal', 'premium', 'developer'] as const).map(role => {
                  const count = users.filter(u => u.role === role).length;
                  const total = users.length || 1;
                  const pct = Math.round(count / total * 100);
                  const label = role === 'normal' ? '普通用户' : role === 'premium' ? '充电用户' : '开发者';
                  const color = role === 'normal' ? 'bg-muted-foreground/20' : role === 'premium' ? 'bg-primary' : 'bg-amber-500';
                  return (
                    <div key={role} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-16">{label}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-16 text-right">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-[fade-in-up_0.3s_ease-out]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">共 {users.length} 位用户</span>
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">用户</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">角色</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">状态</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">邀请码</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">AI 余额</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">注册时间</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.flatMap(user => [
                      <tr key={user.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{user.avatar}</span>
                            <span className="font-medium text-foreground">{user.nickname}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                            className={cn(
                              "text-xs px-2 py-1 rounded border border-border bg-background",
                              user.role === 'developer' ? 'text-amber-600' : user.role === 'premium' ? 'text-primary' : 'text-muted-foreground'
                            )}
                          >
                            <option value="normal">普通用户</option>
                            <option value="premium">充电用户</option>
                            <option value="developer">开发者</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleUpdateUser(user.id, { isActive: !user.is_active })}
                            className={cn(
                              "flex items-center gap-1 text-xs px-2 py-1 rounded",
                              user.is_active ? "text-green-600 bg-green-500/10" : "text-red-600 bg-red-500/10"
                            )}
                          >
                            {user.is_active ? <><UserCheck className="w-3 h-3" /> 启用</> : <><UserX className="w-3 h-3" /> 禁用</>}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                          {user.invite_code_used || '-'}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono tabular-nums">
                          <span className={cn(user.ai_credits > 0 ? 'text-primary' : 'text-muted-foreground/40')}>
                            {user.ai_credits ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openCreditPanel(user.id)}
                              className={cn(
                                "p-1.5 rounded text-primary hover:bg-primary/10 transition-colors",
                                creditUserId === user.id && "bg-primary/10"
                              )}
                              title="调整 AI 额度"
                            >
                              <Coins className="w-3.5 h-3.5" />
                            </button>
                            {user.role !== 'premium' && (
                              <button
                                onClick={() => handleUpdateUser(user.id, { role: 'premium' })}
                                className="p-1.5 rounded text-amber-500 hover:bg-amber-500/10 transition-colors"
                                title="升级为充电用户"
                              >
                                <Zap className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {user.role !== 'developer' && (
                              <button
                                onClick={() => handleUpdateUser(user.id, { role: 'developer' })}
                                className="p-1.5 rounded text-amber-600 hover:bg-amber-500/10 transition-colors"
                                title="升级为开发者"
                              >
                                <Crown className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>,
                      creditUserId === user.id && (
                        <tr key={`${user.id}-credit`} className="border-b border-border/50 bg-muted/20">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="space-y-4">
                              <div className="flex flex-wrap items-end gap-3">
                                <label className="space-y-1">
                                  <span className="block text-xs text-muted-foreground">变动额度（±1–10000）</span>
                                  <input
                                    type="number"
                                    value={creditDelta}
                                    onChange={(e) => setCreditDelta(e.target.value)}
                                    placeholder="如 50 或 -20"
                                    className="w-36 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                                <label className="flex-1 min-w-48 space-y-1">
                                  <span className="block text-xs text-muted-foreground">调整原因（必填，2–100 字）</span>
                                  <input
                                    value={creditReason}
                                    onChange={(e) => setCreditReason(e.target.value)}
                                    placeholder="如 活动补偿 / 误扣退还"
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                                <button
                                  onClick={handleAdjustCredits}
                                  disabled={creditBusy || !creditDelta || creditReason.trim().length < 2}
                                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                  {creditBusy ? '提交中…' : '确认调整'}
                                </button>
                              </div>
                              {creditError && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> {creditError}
                                </p>
                              )}
                              <div className="max-h-56 overflow-y-auto rounded-lg border border-border bg-background">
                                {creditLogs.length === 0 ? (
                                  <p className="px-4 py-6 text-center text-xs text-muted-foreground">暂无额度流水</p>
                                ) : (
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left px-3 py-2 font-medium text-muted-foreground">时间</th>
                                        <th className="text-right px-3 py-2 font-medium text-muted-foreground">变动</th>
                                        <th className="text-right px-3 py-2 font-medium text-muted-foreground">余额</th>
                                        <th className="text-left px-3 py-2 font-medium text-muted-foreground">原因</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {creditLogs.map(log => (
                                        <tr key={log.id} className="border-b border-border/50">
                                          <td className="px-3 py-2 text-muted-foreground">{formatDate(log.created_at)}</td>
                                          <td className={cn("px-3 py-2 text-right font-mono", log.delta > 0 ? 'text-green-600' : 'text-red-600')}>
                                            {log.delta > 0 ? `+${log.delta}` : log.delta}
                                          </td>
                                          <td className="px-3 py-2 text-right font-mono text-foreground">{log.balance}</td>
                                          <td className="px-3 py-2 text-muted-foreground">{log.reason}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ),
                    ])}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Invites Tab */}
        {activeTab === 'invites' && (
          <div className="space-y-4 animate-[fade-in-up_0.3s_ease-out]">
            {/* Create form */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">创建邀请码</h3>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                >
                  {showCreateForm ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  {showCreateForm ? '收起' : '展开'}
                </button>
              </div>

              {showCreateForm && (
                <div className="space-y-4">
                  {/* Single code */}
                  <div className="space-y-3 p-3 rounded-lg bg-muted/30">
                    <span className="text-xs font-medium text-foreground">单个创建</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="邀请码 (如 VIP-2026)"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="备注 (可选)"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="number"
                        value={newMaxUses}
                        onChange={(e) => setNewMaxUses(e.target.value)}
                        placeholder="可用次数"
                        min="1"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="number"
                        value={newCredits}
                        onChange={(e) => setNewCredits(e.target.value)}
                        placeholder="含 AI 次数"
                        min="0"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        onClick={handleCreateInvite}
                        disabled={!newCode.trim()}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" /> 创建
                      </button>
                    </div>
                  </div>

                  {/* Batch create */}
                  <div className="space-y-3 p-3 rounded-lg bg-muted/30">
                    <span className="text-xs font-medium text-foreground">批量创建</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        value={batchPrefix}
                        onChange={(e) => setBatchPrefix(e.target.value)}
                        placeholder="前缀"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="number"
                        value={batchCount}
                        onChange={(e) => setBatchCount(e.target.value)}
                        placeholder="数量 (1-50)"
                        min="1"
                        max="50"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="number"
                        value={batchCredits}
                        onChange={(e) => setBatchCredits(e.target.value)}
                        placeholder="每码含 AI 次数"
                        min="0"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <div />
                      <button
                        onClick={handleBatchInvite}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> 批量创建
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Invite list */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">共 {invites.length} 个邀请码</span>
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">邀请码</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">备注</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">使用</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">状态</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">过期</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map(inv => (
                      <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-foreground bg-muted/50 px-2 py-0.5 rounded">{inv.code}</code>
                            <button
                              onClick={() => copyToClipboard(inv.code)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="复制"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{inv.label || '-'}</td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                          {inv.used_count}{inv.max_uses ? `/${inv.max_uses}` : '/∞'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleInvite(inv.id, !inv.is_active)}
                            className={cn(
                              "text-xs px-2 py-1 rounded",
                              inv.is_active ? "text-green-600 bg-green-500/10" : "text-red-600 bg-red-500/10"
                            )}
                          >
                            {inv.is_active ? '启用' : '停用'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {formatDate(inv.expires_at)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteInvite(inv.id)}
                            className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
            {extraError && (
              <p className="text-sm text-destructive">{extraError}（首次使用请先在 Supabase 执行 2026-10-10-batch5-admin.sql）</p>
            )}
            {usage && usageView && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '近 30 天内置 AI 调用', value: usage.sampleSize, hint: usage.sampleSize >= 5000 ? '已截断至最近 5000 条' : undefined },
                    { label: '成功率', value: `${usage.sampleSize ? Math.round(usageView.okTotal / usage.sampleSize * 100) : 0}%`, hint: undefined },
                    { label: '调用用户数', value: usage.uniqueUsers, hint: undefined },
                    { label: '失败次数', value: usage.sampleSize - usageView.okTotal, hint: undefined },
                  ].map(item => (
                    <div key={item.label} className="p-4 rounded-xl border border-border bg-card">
                      <div className="text-xs text-muted-foreground mb-2">{item.label}</div>
                      <div className="text-2xl font-bold text-foreground font-mono">{item.value}</div>
                      {item.hint && <div className="text-[11px] text-muted-foreground mt-1">{item.hint}</div>}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-medium text-foreground mb-4">近 14 天调用量</h3>
                  {usageView.days.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center">暂无调用记录</p>
                  ) : (
                    <div className="flex items-end gap-2 h-40">
                      {usageView.days.map(([day, d]) => (
                        <div
                          key={day}
                          className="flex-1 flex flex-col items-center justify-end h-full gap-1"
                          title={`${day}：${d.total} 次，成功 ${d.ok} 次`}
                        >
                          <span className="text-[10px] font-mono text-muted-foreground">{d.total}</span>
                          <div
                            className="w-full rounded-t bg-primary/70"
                            style={{ height: `${Math.max(3, Math.round(d.total / maxDayTotal * 96))}px` }}
                          />
                          <span className="text-[10px] text-muted-foreground">{day.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">模块</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">调用</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">成功</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">成功率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usageView.modules.length === 0 && (
                        <tr><td colSpan={4} className="px-4 py-6 text-center text-xs text-muted-foreground">暂无数据</td></tr>
                      )}
                      {usageView.modules.map(([m, s]) => (
                        <tr key={m} className="border-b border-border/50">
                          <td className="px-4 py-3 font-mono text-xs text-foreground">{m}</td>
                          <td className="px-4 py-3 text-right font-mono">{s.total}</td>
                          <td className="px-4 py-3 text-right font-mono">{s.ok}</td>
                          <td className="px-4 py-3 text-right font-mono">{s.total ? Math.round(s.ok / s.total * 100) : 0}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-[fade-in-up_0.3s_ease-out]">
            {extraError && (
              <p className="text-sm text-destructive">{extraError}（首次使用请先在 Supabase 执行 2026-10-10-batch5-admin.sql）</p>
            )}
            {SWITCHES.map(sw => {
              const on = settings[sw.key] !== false;
              return (
                <div key={sw.key} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
                  <div>
                    <div className="text-sm font-medium text-foreground">{sw.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{sw.desc}</div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={on}
                    aria-label={sw.label}
                    onClick={() => handleSetSetting(sw.key, !on)}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors shrink-0",
                      on ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform",
                        on && "translate-x-5"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
