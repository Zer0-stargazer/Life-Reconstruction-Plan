'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Shield, Users, Ticket, BarChart3, Plus, Trash2,
  Copy, RefreshCw,
  XCircle, X, Eye, EyeOff, LogOut, ChevronDown, ChevronRight,
  Zap, Crown, UserX, UserCheck, ArrowLeft, Coins, Activity, SlidersHorizontal,
  Pencil, KeyRound, Search, RotateCcw, Flame, ShieldAlert, MessageSquareWarning,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, type UserRole } from '@/contexts/auth-context';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { getAuthHeader } from '@/lib/client-auth';

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
  // 账号体系 v2 字段（batch6 迁移后才有；没跑迁移时这些是 undefined，UI 会自己隐藏）
  avatar_url?: string | null;
  email?: string | null;
  email_verified?: boolean;
  phone?: string | null;
  phone_verified?: boolean;
  city?: string | null;
  gender?: string | null;
  birthday?: string | null;
  bio?: string | null;
  deleted_at?: string | null;
  ai_credits_total?: number;
  last_login_ip?: string | null;
}

interface AiLog {
  id: number;
  user_id: number;
  nickname: string | null;
  module: string;
  success: boolean;
  error_kind: string | null;
  risk_level: string;
  risk_score: number;
  risk_hits: Array<{ word: string; level: string; category: string | null }> | null;
  risk_reason: string | null;
  reviewed: boolean;
  action_taken: string;
  content_purged: boolean;
  created_at: string;
}

interface AiLogDetail {
  id: number;
  user_id: number;
  module: string;
  created_at: string;
  prompt_text: string | null;
  response_text: string | null;
  risk_level: string;
  risk_score: number;
  risk_hits: Array<{ word: string; level: string; category: string | null }> | null;
  risk_reason: string | null;
  content_purged: boolean;
}

interface ModRule {
  id: number;
  word: string;
  level: string;
  category: string | null;
  enabled: boolean;
  created_at: string;
}

/** 高危操作：删除 / 永久清除 / 恢复 / 重置密码，都要再输一次管理员密码 */
type DangerMode = 'delete' | 'purge' | 'restore' | 'reset';

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

type Tab = 'stats' | 'users' | 'invites' | 'usage' | 'settings' | 'moderation';

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

  // 用户搜索 / 资料编辑 / 高危操作
  const [userQuery, setUserQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    nickname: string; email: string; phone: string; city: string;
    gender: string; birthday: string; bio: string;
  }>({ nickname: '', email: '', phone: '', city: '', gender: '', birthday: '', bio: '' });
  const [editBusy, setEditBusy] = useState(false);
  const [danger, setDanger] = useState<{ mode: DangerMode; user: AdminUser } | null>(null);
  const [dangerPassword, setDangerPassword] = useState('');
  const [dangerConfirm, setDangerConfirm] = useState('');
  const [dangerBusy, setDangerBusy] = useState(false);
  const [dangerError, setDangerError] = useState('');
  /** 重置密码成功后一次性展示的临时密码 */
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  // 内容审核（batch7）
  const [aiLogs, setAiLogs] = useState<AiLog[]>([]);
  const [modRules, setModRules] = useState<ModRule[]>([]);
  const [riskFilter, setRiskFilter] = useState<'all' | 'risk' | 'high' | 'medium' | 'low'>('risk');
  const [logDetail, setLogDetail] = useState<AiLogDetail | null>(null);
  const [warnTarget, setWarnTarget] = useState<{ userId: number; nickname: string } | null>(null);
  const [warnTitle, setWarnTitle] = useState('内容违规提醒');
  const [warnBody, setWarnBody] = useState('');
  const [warnRequireAck, setWarnRequireAck] = useState(true);
  const [warnBusy, setWarnBusy] = useState(false);
  const [newRuleWord, setNewRuleWord] = useState('');
  const [newRuleLevel, setNewRuleLevel] = useState<'warn' | 'high'>('warn');
  const [modError, setModError] = useState<string | null>(null);

  // Create invite form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newMaxUses, setNewMaxUses] = useState('1');
  const [newCredits, setNewCredits] = useState('200');
  // 码类型（batch9）：bundle=套餐（使用权+额度，推荐）/ access=使用权 / ai=纯 AI 额度
  const [newKind, setNewKind] = useState<'bundle' | 'access' | 'ai'>('bundle');
  const [batchCount, setBatchCount] = useState('5');
  const [batchCredits, setBatchCredits] = useState('200');
  const [batchPrefix, setBatchPrefix] = useState('LR');
  const [batchKind, setBatchKind] = useState<'bundle' | 'access' | 'ai'>('bundle');

  // Load saved token
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.devToken);
      if (saved) setDevToken(saved);
    } catch { /* ignore */ }
  }, []);

  // 永久开发者（数据库 role=developer，如站长账号）免密自动进入：
  // 凭登录态向服务端换 dev token（服务端查库确认角色，不信任本地缓存的角色值）
  useEffect(() => {
    if (devToken || !authUser) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify({ action: 'verify' }),
        });
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data.success && data.token) {
          setDevToken(data.token);
          try { localStorage.setItem(STORAGE_KEYS.devToken, data.token); } catch { /* ignore */ }
          if (data.user?.role === 'developer') updateUserRole('developer');
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devToken, authUser?.id]);

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
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          action: 'verify',
          password: password.trim(),
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
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'revoke_dev_token' }),
      });
    } catch { /* ignore */ }
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
          aiCredits: newKind === 'access' ? 0 : (newCredits ? parseInt(newCredits) || 0 : 0),
          kind: newKind,
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
          aiCredits: batchKind === 'access' ? 0 : (batchCredits ? parseInt(batchCredits) || 0 : 0),
          kind: batchKind,
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

  const handleUpdateUser = async (
    userId: number,
    updates: { role?: string; isActive?: boolean; nickname?: string; email?: string; phone?: string; city?: string; gender?: string; birthday?: string; bio?: string }
  ) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'update_user', userId, ...updates }),
      });
      const data = await res.json();
      if (data.success) fetchAllData();
      else alert(data.error || '更新失败');
    } catch {
      alert('网络错误');
    }
  };

  // ---- 用户资料编辑 ----

  const openEditPanel = (user: AdminUser) => {
    setEditingId(user.id);
    setCreditUserId(null);
    setEditForm({
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      city: user.city ?? '',
      gender: user.gender ?? '',
      birthday: user.birthday ?? '',
      bio: user.bio ?? '',
    });
  };

  const handleSaveProfile = async () => {
    if (editingId === null) return;
    if (!editForm.nickname.trim()) {
      alert('昵称不能为空');
      return;
    }
    setEditBusy(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({
          action: 'update_user',
          userId: editingId,
          nickname: editForm.nickname.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim(),
          city: editForm.city.trim(),
          gender: editForm.gender.trim(),
          birthday: editForm.birthday.trim(),
          bio: editForm.bio.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        await fetchAllData();
      } else {
        alert(data.error || '保存失败');
      }
    } catch {
      alert('网络错误');
    } finally {
      setEditBusy(false);
    }
  };

  // ---- 高危操作：删除 / 永久清除 / 恢复 / 重置密码 ----

  const openDanger = (mode: DangerMode, user: AdminUser) => {
    setDanger({ mode, user });
    setDangerPassword('');
    setDangerConfirm('');
    setDangerError('');
  };

  const closeDanger = () => {
    setDanger(null);
    setDangerPassword('');
    setDangerConfirm('');
    setDangerError('');
  };

  const DANGER_LABEL: Record<DangerMode, string> = {
    delete: '删除用户（软删除，可恢复）',
    purge: '永久清除用户（不可恢复）',
    restore: '恢复用户',
    reset: '重置密码并强制下线',
  };

  const handleDangerSubmit = async () => {
    if (!danger) return;
    const { mode, user } = danger;
    if (!dangerPassword.trim()) {
      setDangerError('请输入管理员密码');
      return;
    }
    // 删除类操作必须手打昵称：防看错行点错按钮
    if ((mode === 'delete' || mode === 'purge') && dangerConfirm.trim() !== user.nickname) {
      setDangerError(`确认信息不匹配，请输入昵称「${user.nickname}」`);
      return;
    }
    setDangerBusy(true);
    setDangerError('');
    try {
      const payload: Record<string, unknown> = {
        action: mode === 'delete' ? 'delete_user' : mode === 'purge' ? 'purge_user' : mode === 'restore' ? 'restore_user' : 'reset_password',
        userId: user.id,
        password: dangerPassword,
      };
      if (mode === 'delete' || mode === 'purge') payload.confirm = dangerConfirm.trim();
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        if (mode === 'reset') setTempPassword(String(data.tempPassword ?? ''));
        else { setTempPassword(null); closeDanger(); }
        await fetchAllData();
      } else {
        setDangerError(data.error || '操作失败');
      }
    } catch {
      setDangerError('网络错误');
    } finally {
      setDangerBusy(false);
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

  // ---- 内容审核（batch7）----

  const fetchModeration = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (riskFilter === 'risk') params.set('riskOnly', '1');
      else if (riskFilter !== 'all') params.set('risk', riskFilter);
      const [logsRes, rulesRes] = await Promise.all([
        api(`ai_logs&${params.toString()}`),
        api('rules'),
      ]);
      setAiLogs((logsRes.data ?? []) as AiLog[]);
      setModRules((rulesRes.data ?? []) as ModRule[]);
      setModError(null);
    } catch (err) {
      setModError(err instanceof Error ? err.message : '加载失败');
    }
  }, [api, riskFilter]);

  useEffect(() => {
    if (devToken && activeTab === 'moderation') void fetchModeration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devToken, activeTab, riskFilter]);

  const openLogDetail = async (logId: number) => {
    try {
      // 看正文会写审计日志，所以走 POST 而不是 GET
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'get_ai_log_detail', logId }),
      });
      const data = await res.json();
      if (data.success) setLogDetail(data.data as AiLogDetail);
      else alert(data.error || '加载失败');
    } catch {
      alert('网络错误');
    }
  };

  const reviewLog = async (logId: number, reviewed: boolean) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'review_ai_log', logId, reviewed }),
      });
      const data = await res.json();
      if (data.success) void fetchModeration();
      else alert(data.error || '操作失败');
    } catch {
      alert('网络错误');
    }
  };

  const deleteLog = async (logId: number) => {
    if (!confirm('删除这条审核记录？（销毁证据类操作，建议先标记为已处理）')) return;
    const password = prompt('请输入管理员密码确认：');
    if (!password) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'delete_ai_log', logId, password }),
      });
      const data = await res.json();
      if (data.success) { setLogDetail(null); void fetchModeration(); }
      else alert(data.error || '删除失败');
    } catch {
      alert('网络错误');
    }
  };

  const openWarn = (userId: number, nickname: string) => {
    setWarnTarget({ userId, nickname });
    setWarnTitle('内容违规提醒');
    setWarnBody('');
    setWarnRequireAck(true);
  };

  const sendWarn = async () => {
    if (!warnTarget) return;
    if (warnBody.trim().length < 5) {
      alert('请填写通知内容（至少 5 个字），说明用户哪里违规了');
      return;
    }
    setWarnBusy(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({
          action: 'warn_user',
          userId: warnTarget.userId,
          title: warnTitle.trim(),
          message: warnBody.trim(),
          requireAck: warnRequireAck,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWarnTarget(null);
        alert('通知已发送' + (warnRequireAck ? '（用户需点"我知道了"才能继续）' : ''));
      } else {
        alert(data.error || '发送失败');
      }
    } catch {
      alert('网络错误');
    } finally {
      setWarnBusy(false);
    }
  };

  const addRule = async () => {
    if (!newRuleWord.trim()) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'add_rule', word: newRuleWord.trim(), level: newRuleLevel }),
      });
      const data = await res.json();
      if (data.success) { setNewRuleWord(''); void fetchModeration(); }
      else alert(data.error || '添加失败');
    } catch {
      alert('网络错误');
    }
  };

  const deleteRule = async (ruleId: number) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'delete_rule', ruleId }),
      });
      const data = await res.json();
      if (data.success) void fetchModeration();
      else alert(data.error || '删除失败');
    } catch {
      alert('网络错误');
    }
  };

  const toggleRule = async (ruleId: number, enabled: boolean) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'toggle_rule', ruleId, enabled }),
      });
      const data = await res.json();
      if (data.success) void fetchModeration();
      else alert(data.error || '操作失败');
    } catch {
      alert('网络错误');
    }
  };

  const purgeOldLogs = async () => {
    const days = prompt('抹掉多少天前的对话正文？（默认 30，只删正文、保留元数据）', '30');
    if (!days) return;
    const password = prompt('请输入管理员密码确认：');
    if (!password) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-dev-token': devToken || '' },
        body: JSON.stringify({ action: 'purge_old_ai_logs', days: parseInt(days) || 30, password }),
      });
      const data = await res.json();
      if (data.success) { alert(`已抹掉 ${data.affected ?? 0} 条过期正文`); void fetchModeration(); }
      else alert(data.error || '清理失败');
    } catch {
      alert('网络错误');
    }
  };

  const RISK_STYLE: Record<string, string> = {
    none: 'text-muted-foreground bg-muted',
    low: 'text-sky-600 bg-sky-500/10',
    medium: 'text-amber-600 bg-amber-500/10',
    high: 'text-destructive bg-destructive/10',
  };
  const RISK_TEXT: Record<string, string> = {
    none: '正常', low: '留痕', medium: '中风险', high: '高风险',
  };
  const ACTION_TEXT: Record<string, string> = {
    none: '未处置', warned: '已通知', ack_required: '已强制警告', disabled: '已停用',
  };

  // 用户搜索：昵称 / 邮箱 / 手机号 三个字段都能搜
  // 必须放在登录态早退之前：Hook 不能条件调用
  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      u.nickname.toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.phone ?? '').includes(q)
    );
  }, [users, userQuery]);

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
                className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
    { id: 'moderation', label: '内容审核', icon: ShieldAlert },
    { id: 'invites', label: '邀请码', icon: Ticket },
    { id: 'usage', label: '调用看板', icon: Activity },
    { id: 'settings', label: '功能开关', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
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

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 py-6">
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  共 {users.length} 位用户
                  {users.some(u => u.deleted_at) && (
                    <span className="text-destructive">（含 {users.filter(u => u.deleted_at).length} 位已注销）</span>
                  )}
                </span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="搜昵称 / 邮箱 / 手机号"
                    className="w-56 rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              {userQuery && (
                <span className="text-xs text-muted-foreground">匹配 {filteredUsers.length} 位</span>
              )}
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
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">联系方式</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">AI 余额</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">注册时间</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">最后登录</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.flatMap(user => {
                      const deleted = Boolean(user.deleted_at);
                      return [
                      <tr key={user.id} className={cn("border-b border-border/50 hover:bg-muted/20 transition-colors", deleted && "opacity-55")}>
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
                        <td className="px-4 py-3 text-xs">
                          {/* 后台给管理员看完整联系方式；没跑 batch6 迁移时不显示这两行 */}
                          {user.email || user.phone ? (
                            <div className="space-y-0.5">
                              {user.email && (
                                <div className="flex items-center gap-1">
                                  <span className="font-mono text-foreground/80">{user.email}</span>
                                  {user.email_verified && <span className="text-[10px] text-green-600">已验证</span>}
                                </div>
                              )}
                              {user.phone && (
                                <div className="flex items-center gap-1">
                                  <span className="font-mono text-foreground/80">{user.phone}</span>
                                  {user.phone_verified && <span className="text-[10px] text-green-600">已验证</span>}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/70">未绑定</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono tabular-nums">
                          <span className={cn(user.ai_credits > 0 ? 'text-primary' : 'text-muted-foreground/70')}>
                            {user.ai_credits ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {user.last_login_at ? formatDate(user.last_login_at) : '未登录'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditPanel(user)}
                              className={cn(
                                "p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                                editingId === user.id && "bg-muted text-foreground"
                              )}
                              title="编辑资料"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
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
                            <button
                              onClick={() => openDanger('reset', user)}
                              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="重置密码（需管理员密码）"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            {deleted ? (
                              <>
                                <button
                                  onClick={() => openDanger('restore', user)}
                                  className="p-1.5 rounded text-green-600 hover:bg-green-500/10 transition-colors"
                                  title="恢复该用户"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => openDanger('purge', user)}
                                  className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                                  title="永久清除（不可恢复）"
                                >
                                  <Flame className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => openDanger('delete', user)}
                                className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                                title="删除用户（需管理员密码）"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>,
                      creditUserId === user.id && (
                        <tr key={`${user.id}-credit`} className="border-b border-border/50 bg-muted/20">
                          <td colSpan={9} className="px-4 py-4">
                            <div className="space-y-4">
                              <div className="flex flex-wrap items-end gap-3">
                                <label className="space-y-1">
                                  <span className="block text-xs text-muted-foreground">变动额度（±1–10000）</span>
                                  <input
                                    type="number"
                                    value={creditDelta}
                                    onChange={(e) => setCreditDelta(e.target.value)}
                                    placeholder="如 50 或 -20"
                                    className="w-36 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                                <label className="flex-1 min-w-48 space-y-1">
                                  <span className="block text-xs text-muted-foreground">调整原因（必填，2–100 字）</span>
                                  <input
                                    value={creditReason}
                                    onChange={(e) => setCreditReason(e.target.value)}
                                    placeholder="如 活动补偿 / 误扣退还"
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      editingId === user.id && (
                        <tr key={`${user.id}-edit`} className="border-b border-border/50 bg-muted/20">
                          <td colSpan={9} className="px-4 py-4">
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <label className="space-y-1">
                                  <span className="block text-xs text-muted-foreground">昵称（改后 30 天内不能再改）</span>
                                  <input
                                    value={editForm.nickname}
                                    onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                                <label className="space-y-1">
                                  <span className="block text-xs text-muted-foreground">邮箱</span>
                                  <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    placeholder="留空为解绑"
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                                <label className="space-y-1">
                                  <span className="block text-xs text-muted-foreground">手机号</span>
                                  <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    placeholder="留空为解绑"
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                                <label className="space-y-1">
                                  <span className="block text-xs text-muted-foreground">城市</span>
                                  <input
                                    value={editForm.city}
                                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                                <label className="space-y-1">
                                  <span className="block text-xs text-muted-foreground">性别</span>
                                  <select
                                    value={editForm.gender}
                                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  >
                                    <option value="">未填写</option>
                                    <option value="male">男</option>
                                    <option value="female">女</option>
                                    <option value="other">其他</option>
                                  </select>
                                </label>
                                <label className="space-y-1">
                                  <span className="block text-xs text-muted-foreground">生日</span>
                                  <input
                                    type="date"
                                    value={editForm.birthday}
                                    onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                                <label className="md:col-span-2 space-y-1">
                                  <span className="block text-xs text-muted-foreground">简介（≤200 字）</span>
                                  <input
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={handleSaveProfile}
                                  disabled={editBusy}
                                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                  {editBusy ? '保存中…' : '保存资料'}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  取消
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ),
                    ]; })}
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
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="备注 (可选)"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="number"
                        value={newMaxUses}
                        onChange={(e) => setNewMaxUses(e.target.value)}
                        placeholder="可用次数"
                        min="1"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <select
                        value={newKind}
                        onChange={(e) => setNewKind(e.target.value as 'bundle' | 'access' | 'ai')}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="bundle">套餐（使用权+额度）</option>
                        <option value="access">使用权（不加额度）</option>
                        <option value="ai">纯 AI 额度</option>
                      </select>
                      {newKind !== 'access' && (
                        <input
                          type="number"
                          value={newCredits}
                          onChange={(e) => setNewCredits(e.target.value)}
                          placeholder="含 AI 次数"
                          min="1"
                          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      )}
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
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="number"
                        value={batchCount}
                        onChange={(e) => setBatchCount(e.target.value)}
                        placeholder="数量 (1-50)"
                        min="1"
                        max="50"
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <select
                        value={batchKind}
                        onChange={(e) => setBatchKind(e.target.value as 'bundle' | 'access' | 'ai')}
                        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="bundle">套餐（使用权+额度）</option>
                        <option value="access">使用权（不加额度）</option>
                        <option value="ai">纯 AI 额度</option>
                      </select>
                      {batchKind !== 'access' && (
                        <input
                          type="number"
                          value={batchCredits}
                          onChange={(e) => setBatchCredits(e.target.value)}
                          placeholder="每码含 AI 次数"
                          min="1"
                          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      )}
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
                          <span className="text-[11px] font-mono text-muted-foreground">{d.total}</span>
                          <div
                            className="w-full rounded-t bg-primary/70"
                            style={{ height: `${Math.max(3, Math.round(d.total / maxDayTotal * 96))}px` }}
                          />
                          <span className="text-[11px] text-muted-foreground">{day.slice(5)}</span>
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

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-4 animate-[fade-in-up_0.3s_ease-out]">
            {/* 筛选条 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                {([
                  ['risk', '有风险'],
                  ['high', '高风险'],
                  ['medium', '中风险'],
                  ['all', '全部'],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setRiskFilter(key)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs transition-colors",
                      riskFilter === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={purgeOldLogs}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-3.5 h-3.5" /> 清理过期正文
              </button>
            </div>

            {modError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> {modError}（若提示表不存在，请先执行 batch7 迁移）
              </p>
            )}

            {/* 审核列表 */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">时间</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">用户</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">模块</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">风险</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">命中</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">处置</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-xs text-muted-foreground">
                          暂无记录
                        </td>
                      </tr>
                    ) : (
                      aiLogs.map(log => (
                        <tr key={log.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(log.created_at)}
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-foreground">
                            {log.nickname ?? `#${log.user_id}`}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{log.module}</td>
                          <td className="px-4 py-3">
                            <span className={cn("text-xs px-2 py-1 rounded", RISK_STYLE[log.risk_level] ?? RISK_STYLE.none)}>
                              {RISK_TEXT[log.risk_level] ?? log.risk_level}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {log.risk_hits && log.risk_hits.length > 0
                              ? log.risk_hits.map(h => h.word).join('、')
                              : log.risk_reason ? 'AI 复核判定' : '-'}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span className={cn(log.reviewed ? 'text-muted-foreground' : 'text-amber-600')}>
                              {ACTION_TEXT[log.action_taken] ?? log.action_taken}
                              {log.reviewed ? ' · 已处理' : ' · 待处理'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openLogDetail(log.id)}
                                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                title="查看完整对话（会留审计）"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => reviewLog(log.id, !log.reviewed)}
                                className="p-1.5 rounded text-green-600 hover:bg-green-500/10 transition-colors"
                                title={log.reviewed ? '标记为待处理' : '标记为已处理'}
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openWarn(log.user_id, log.nickname ?? `#${log.user_id}`)}
                                className="p-1.5 rounded text-amber-600 hover:bg-amber-500/10 transition-colors"
                                title="发通知警告该用户"
                              >
                                <MessageSquareWarning className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteLog(log.id)}
                                className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                                title="删除记录（需管理员密码）"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 违规词表 */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">违规关键词</h3>
                <span className="text-xs text-muted-foreground">命中后先过词表，再送 AI 复核</span>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <input
                  value={newRuleWord}
                  onChange={(e) => setNewRuleWord(e.target.value)}
                  placeholder="关键词"
                  className="w-40 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <select
                  value={newRuleLevel}
                  onChange={(e) => setNewRuleLevel(e.target.value as 'warn' | 'high')}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="warn">中风险（发通知）</option>
                  <option value="high">高风险（强制确认）</option>
                </select>
                <button
                  onClick={addRule}
                  className="flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> 添加
                </button>
              </div>
              <div className="max-h-56 overflow-y-auto rounded-lg border border-border">
                {modRules.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-muted-foreground">暂无关键词</p>
                ) : (
                  <table className="w-full text-xs">
                    <tbody>
                      {modRules.map(rule => (
                        <tr key={rule.id} className="border-b border-border/50 last:border-0">
                          <td className="px-3 py-2 font-mono text-foreground">{rule.word}</td>
                          <td className="px-3 py-2">
                            <span className={cn("px-1.5 py-0.5 rounded", rule.level === 'high' ? 'text-destructive bg-destructive/10' : 'text-amber-600 bg-amber-500/10')}>
                              {rule.level === 'high' ? '高风险' : '中风险'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{rule.category ?? '-'}</td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => toggleRule(rule.id, !rule.enabled)}
                                className="px-2 py-1 rounded text-muted-foreground hover:text-foreground"
                              >
                                {rule.enabled ? '停用' : '启用'}
                              </button>
                              <button
                                onClick={() => deleteRule(rule.id)}
                                className="p-1 rounded text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 对话正文详情 */}
        {logDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setLogDetail(null)}>
            <div
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-card p-5 space-y-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">对话正文 · 日志 #{logDetail.id}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(logDetail.created_at)} · 模块 {logDetail.module} · 用户 #{logDetail.user_id}
                    {' · '}
                    <span className={cn("px-1.5 py-0.5 rounded", RISK_STYLE[logDetail.risk_level] ?? RISK_STYLE.none)}>
                      {RISK_TEXT[logDetail.risk_level] ?? logDetail.risk_level}
                    </span>
                  </p>
                </div>
                <button onClick={() => setLogDetail(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {logDetail.risk_reason && (
                <p className="text-xs text-muted-foreground">AI 复核：{logDetail.risk_reason}</p>
              )}

              {logDetail.content_purged ? (
                <p className="rounded-lg border border-border bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
                  正文已按保留期自动清理，仅保留元数据
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="block text-xs font-medium text-muted-foreground">用户提问</span>
                    <pre className="whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-foreground">
{logDetail.prompt_text || '（空）'}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs font-medium text-muted-foreground">AI 回复</span>
                    <pre className="whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-foreground">
{logDetail.response_text || '（空）'}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => reviewLog(logDetail.id, true)}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  标记已处理
                </button>
                <button
                  onClick={() => openWarn(logDetail.user_id, `#${logDetail.user_id}`)}
                  className="px-4 py-2 rounded-md border border-amber-500/40 text-sm text-amber-600 hover:bg-amber-500/10 transition-colors"
                >
                  警告该用户
                </button>
                <button
                  onClick={() => deleteLog(logDetail.id)}
                  className="px-4 py-2 rounded-md border border-destructive/40 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  删除记录
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 发通知给用户的弹层 */}
        {warnTarget && (
          <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 p-4" onClick={() => setWarnTarget(null)}>
            <div
              className="w-full max-w-md rounded-xl border border-border bg-card p-5 space-y-3 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-foreground">
                发通知给 {warnTarget.nickname}
              </h3>
              <label className="block space-y-1">
                <span className="block text-xs text-muted-foreground">标题</span>
                <input
                  value={warnTitle}
                  onChange={(e) => setWarnTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="block space-y-1">
                <span className="block text-xs text-muted-foreground">内容（说明哪里违规、下次会怎样）</span>
                <textarea
                  value={warnBody}
                  onChange={(e) => setWarnBody(e.target.value)}
                  rows={4}
                  placeholder="例：你在职业模块的分析中包含引流信息，已触发内容安全规则。再次触发将暂停账号。"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={warnRequireAck}
                  onChange={(e) => setWarnRequireAck(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-xs text-muted-foreground">强制确认（用户必须点「我知道了」才能继续使用）</span>
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={sendWarn}
                  disabled={warnBusy}
                  className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {warnBusy ? '发送中…' : '发送通知'}
                </button>
                <button
                  onClick={() => setWarnTarget(null)}
                  className="px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

      {/* 高危操作确认弹层：删除 / 永久清除 / 恢复 / 重置密码，都要再输一次管理员密码 */}
      {danger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeDanger}>
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-5 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className={cn(
                "text-base font-semibold",
                (danger.mode === 'purge' || danger.mode === 'delete') ? 'text-destructive' : 'text-foreground'
              )}>
                {DANGER_LABEL[danger.mode]}
              </h3>
              <p className="text-xs text-muted-foreground">
                目标用户：<span className="font-medium text-foreground">{danger.user.nickname}</span>
                <span className="text-muted-foreground/70">（ID {danger.user.id} · 角色 {danger.user.role}）</span>
              </p>
              {danger.mode === 'purge' && (
                <p className="text-xs text-destructive">
                  永久清除会连同该用户的登录日志、额度流水、AI 调用记录一并抹掉，无法恢复。
                </p>
              )}
              {danger.mode === 'reset' && (
                <p className="text-xs text-muted-foreground">
                  重置后会生成一个一次性临时密码，并把该用户所有设备强制下线。
                </p>
              )}
            </div>

            {tempPassword ? (
              <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">临时密码（只显示这一次，请复制后发给用户）：</p>
                <code className="block text-center text-lg font-mono tracking-wider text-foreground select-all">
                  {tempPassword}
                </code>
                <button
                  onClick={() => { setTempPassword(null); closeDanger(); }}
                  className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  我已保存，关闭
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {(danger.mode === 'delete' || danger.mode === 'purge') && (
                  <label className="block space-y-1">
                    <span className="block text-xs text-muted-foreground">
                      请输入昵称「{danger.user.nickname}」以确认
                    </span>
                    <input
                      value={dangerConfirm}
                      onChange={(e) => setDangerConfirm(e.target.value)}
                      placeholder="完整昵称"
                      autoComplete="off"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                )}
                <label className="block space-y-1">
                  <span className="block text-xs text-muted-foreground">管理员密码</span>
                  <input
                    type="password"
                    value={dangerPassword}
                    onChange={(e) => setDangerPassword(e.target.value)}
                    placeholder="开发者后台密码"
                    autoComplete="current-password"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                {dangerError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> {dangerError}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleDangerSubmit}
                    disabled={dangerBusy || !dangerPassword}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-50",
                      (danger.mode === 'purge' || danger.mode === 'delete')
                        ? 'bg-destructive hover:bg-destructive/90'
                        : 'bg-primary hover:bg-primary/90'
                    )}
                  >
                    {dangerBusy ? '处理中…' : '确认执行'}
                  </button>
                  <button
                    onClick={closeDanger}
                    className="px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
