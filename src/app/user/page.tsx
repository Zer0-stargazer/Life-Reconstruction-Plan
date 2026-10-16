'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  User, Settings, Shield, Moon, Sun, Palette, Clock, BarChart3,
  CheckCircle2, Circle, Loader2, CheckCircle,
  XCircle, Zap, ChevronRight, Cpu, ArrowRight,
  LogOut, RotateCcw, Weight, Milestone, Lock, Crown, Ticket, Gift,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { useTheme } from 'next-themes';
import { useAuth, ALL_MODULES, NORMAL_USER_MODULES } from '@/contexts/auth-context';
import { AiSourceManager } from '@/components/ai/ai-source-manager';
import { STORAGE_KEY_ACTIVE, type AiSource } from '@/lib/ai-sources';
import { readDefaultAge, writeDefaultAge, AGE_MAX } from '@/lib/default-age';
import { sanitizeLifeStages, sanitizeWeights } from '@/hooks/settings-shape';
import { notifyStateDirty } from '@/lib/user-state-sync';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { getAuthHeader } from '@/lib/client-auth';
import { BUSINESS_MODE } from '@/lib/business-mode';
import { TurnstileWidget, TURNSTILE_ENABLED } from '@/components/auth/turnstile-widget';

const modules = [
  { name: '名字', path: '/name', icon: '01' },
  { name: '职业', path: '/career', icon: '02' },
  { name: '规律', path: '/laws', icon: '03' },
  { name: '窗口', path: '/windows', icon: '04' },
  { name: '努力', path: '/simulation', icon: '05' },
  { name: '运气', path: '/luck', icon: '06' },
  { name: '命运', path: '/destiny', icon: '07' },
  { name: '健康', path: '/health', icon: '08' },
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

// 汉字首字印格（单字，serif，方形 2px 圆角描边）。历史上存过 emoji 头像：旧值仍当普通文本显示，不迁移。
const AVATAR_OPTIONS = ['沙', '途', '舟', '灯', '山', '川', '松', '鹤', '墨', '印', '岭', '渡'];

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
  // icon 字段保留为空串（WeightItem 结构要求 string；已存的旧 emoji 值不再渲染）
  { id: 'health', label: '健康', value: 50, icon: '' },
  { id: 'wealth', label: '财富', value: 50, icon: '' },
  { id: 'career', label: '事业', value: 50, icon: '' },
  { id: 'relationship', label: '关系', value: 50, icon: '' },
  { id: 'growth', label: '成长', value: 50, icon: '' },
  { id: 'freedom', label: '自由', value: 50, icon: '' },
];

// ---- Simple hash for local auth (kept for legacy compatibility) ----

// ---- Main Component ----

const REGISTRATION_OPEN = process.env.NEXT_PUBLIC_REGISTRATION_OPEN !== "false";

// open 模式：登录即全功能，AI 额度区对所有登录用户显示；legacy 保持旧买断制口径
const IS_OPEN_MODE = BUSINESS_MODE === 'open';

export default function UserPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, login: authLogin, applySession, logout: authLogout, redeemCode, isPremium, canAccessModule } = useAuth();
  const [visitedPaths, setVisitedPaths] = useState<string[]>([]);
  const [activeAiSource, setActiveAiSource] = useState<AiSourceId>('builtin');
  // 用户自定义接入源（独立存储 ai-sources，供顶部"当前使用"显示）
  const [customSources, setCustomSources] = useState<AiSource[]>([]);
  const [keyStatuses, setKeyStatuses] = useState<Record<string, KeyStatus>>({});
  /** 未设置为 null，界面显示"未设置"，不预填假年龄 */
  const [defaultAge, setDefaultAge] = useState<number | null>(null);
  const [showAgeInput, setShowAgeInput] = useState(false);

  // User profile state no longer needed - authUser from AuthContext is used instead
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [welcomeBonus, setWelcomeBonus] = useState(0);
  const [loginMode, setLoginMode] = useState<'login' | 'register' | 'email' | 'forgot'>('login');
  // 邮箱验证码 / 找回密码（账号体系 v2）
  const [emailAddr, setEmailAddr] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailPurpose, setEmailPurpose] = useState<'login' | 'register'>('login');
  const [codeSending, setCodeSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [debugCode, setDebugCode] = useState('');
  // 注册收集联系方式（至少一项，不验证）+ 信息匹配找回
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  // 注册人机验证（Cloudflare Turnstile；未配置 site key 时组件不渲染、服务端跳过）
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [forgotNickname, setForgotNickname] = useState('');
  const [forgotContact, setForgotContact] = useState('');
  // 找回密码两步流程（P0-1 修复）：match（昵称+联系方式校验，服务端发码）→ reset（输验证码+新密码）
  const [forgotStep, setForgotStep] = useState<'match' | 'reset'>('match');
  const [forgotMasked, setForgotMasked] = useState('');
  // 资料联系方式编辑（需当前密码确认，防止会话被盗后联系方式被偷改）
  const [showContactEdit, setShowContactEdit] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactPwd, setContactPwd] = useState('');
  const [contactMsg, setContactMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [contactPending, setContactPending] = useState(false);
  const [loginNickname, setLoginNickname] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Invite code
  const [inviteCode, setInviteCode] = useState('');
  const [aiCredits, setAiCredits] = useState<number | null>(null);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [inviteMessage, setInviteMessage] = useState('');

  // Advanced settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lifeStages, setLifeStages] = useState(DEFAULT_LIFE_STAGES);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  // ---- Load persisted state ----

  // 模块访问记录：写入统一由根布局的 ModuleVisitTracker 负责（含路径白名单），
  // 本页只读展示。此前这里有两份手写读写，其中一份会把 /user 自身写进记录。
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.visitedModules);
      setVisitedPaths(stored ? JSON.parse(stored) : []);
    } catch {
      setVisitedPaths([]);
    }

    try {
      const storedActive = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (storedActive) setActiveAiSource(storedActive as AiSourceId);
    } catch { /* ignore */ }
    try {
      const storedCustom = localStorage.getItem(STORAGE_KEYS.aiSources);
      if (storedCustom) setCustomSources(JSON.parse(storedCustom));
    } catch { /* ignore */ }
    try {
      setDefaultAge(readDefaultAge());
    } catch { /* ignore */ }

    // Load advanced settings
    try {
      const storedStages = localStorage.getItem(STORAGE_KEYS.lifeStages);
      if (storedStages) setLifeStages(sanitizeLifeStages(JSON.parse(storedStages), DEFAULT_LIFE_STAGES));
    } catch { /* ignore */ }
    try {
      const storedWeights = localStorage.getItem(STORAGE_KEYS.preferenceWeights);
      // P1：形状校验——历史数据损坏（对象/非数组）时保持默认权重，防渲染异常
      const parsedWeights = storedWeights ? JSON.parse(storedWeights) : null;
      if (parsedWeights) setWeights(sanitizeWeights(parsedWeights, DEFAULT_WEIGHTS));
    } catch { /* ignore */ }
  }, [pathname]);

  useScrollLock(showLoginDialog);

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
    try {
      localStorage.setItem(key, JSON.stringify(value));
      notifyStateDirty(); // P1 修复：写入后广播，否则登录用户的偏好改动不进云同步
    } catch { /* ignore */ }
  }, []);

  // ---- Auth logic (delegated to AuthContext) ----

  // 登录/注册成功后回跳 LoginGate 带来的原页面：仅接受站内路径（以 / 开头且不以 // 或 /\ 开头），防开放重定向
  const goNextIfAny = () => {
    try {
      const next = new URLSearchParams(window.location.search).get('next');
      if (next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')) {
        router.replace(next);
      }
    } catch { /* ignore */ }
  };

  const handleRegister = async () => {
    if (!loginNickname.trim() || !loginPassword.trim()) {
      setLoginError('请输入昵称和密码');
      return;
    }
    if (loginNickname.trim().length > 20) {
      setLoginError('昵称最多20个字符');
      return;
    }
    if (loginPassword.length < 8) {
      setLoginError('密码至少8位');
      return;
    }
    if (!regEmail.trim() && !regPhone.trim()) {
      setLoginError('请至少填写邮箱或手机号其一，用于日后找回密码');
      return;
    }
    if (regEmail.trim() && !/^\S+@\S+\.\S+$/.test(regEmail.trim())) {
      setLoginError('邮箱格式不正确，例如 you@example.com');
      return;
    }
    if (regPhone.trim() && !/^\d{7,15}$/.test(regPhone.replace(/[\s-]/g, ''))) {
      setLoginError('手机号格式不正确，请填 7-15 位数字');
      return;
    }
    if (TURNSTILE_ENABLED && !turnstileToken) {
      setLoginError('请先完成人机验证');
      return;
    }
    setLoginPending(true);
    // 直接请求 /api/auth（需携带 Turnstile token），成功后用 applySession 落地会话
    let result: { success: boolean; error?: string; grantedCredits?: number };
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          nickname: loginNickname.trim(),
          password: loginPassword,
          email: regEmail.trim() || undefined,
          phone: regPhone.trim() || undefined,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.token && data.user) {
        applySession(data.token, data.user);
        result = { success: true, grantedCredits: data.grantedCredits };
      } else {
        result = { success: false, error: data.error };
      }
    } catch {
      result = { success: false, error: '网络错误' };
    }
    setLoginPending(false);
    if (!result.success) {
      // Turnstile token 一次性，失败后必须重新验证
      setTurnstileToken(null);
      setTurnstileReset(n => n + 1);
    }
    if (result.success) {
      setShowLoginDialog(false);
      setLoginError('');
      setLoginNickname('');
      setLoginPassword('');
      setRegEmail('');
      setRegPhone('');
      if (result.grantedCredits && result.grantedCredits > 0) {
        setWelcomeBonus(result.grantedCredits);
      }
      goNextIfAny();
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
      goNextIfAny();
    } else {
      setLoginError(result.error || '登录失败');
    }
  };

  // 验证码 60 秒倒计时
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const resetEmailState = () => {
    setEmailAddr(''); setEmailCode(''); setNewPassword(''); setDebugCode(''); setCountdown(0);
    setForgotNickname(''); setForgotContact(''); setForgotStep('match'); setForgotMasked('');
    setRegEmail(''); setRegPhone('');
    setTurnstileToken(null); // 切换模式会卸载/重建 Turnstile，旧 token 作废
    setLoginError('');
  };

  const handleSwitchMode = (mode: 'login' | 'register' | 'email' | 'forgot') => {
    setLoginMode(mode);
    resetEmailState();
  };

  const handleSendCode = async (purpose: 'login' | 'register' | 'reset') => {
    if (!emailAddr.trim()) { setLoginError('请先输入邮箱'); return; }
    setCodeSending(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_email_code', email: emailAddr.trim(), purpose }),
      });
      const data = await res.json();
      if (data.success) {
        setCountdown(60);
        // 本地 console 模式会回传调试验证码；真实邮件通道下为空
        setDebugCode(data.debugCode ? String(data.debugCode) : '');
      } else {
        setLoginError(data.error || '发送失败');
      }
    } catch {
      setLoginError('网络错误');
    } finally {
      setCodeSending(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!emailAddr.trim() || !emailCode.trim()) { setLoginError('请输入邮箱和验证码'); return; }
    setLoginPending(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login_email', email: emailAddr.trim(), code: emailCode.trim(), purpose: emailPurpose }),
      });
      const data = await res.json();
      if (data.success && data.token && data.user) {
        applySession(data.token, data.user);
        setShowLoginDialog(false);
        resetEmailState();
        setLoginError('');
        goNextIfAny();
      } else {
        setLoginError(data.error || '验证失败');
      }
    } catch {
      setLoginError('网络错误');
    } finally {
      setLoginPending(false);
    }
  };

  // 找回密码第一步：昵称 + 注册联系方式校验（P0-1 修复后不再直接改密）。
  // 邮箱账号由服务端直接向注册邮箱发验证码（明文邮箱不经过前端）；
  // 仅手机号账号引导联系管理员。
  const handleForgotMatch = async () => {
    if (!forgotNickname.trim() || !forgotContact.trim()) { setLoginError('请输入昵称和注册时填写的邮箱或手机号'); return; }
    setLoginPending(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password_info', nickname: forgotNickname.trim(), contact: forgotContact.trim() }),
      });
      const data = await res.json();
      if (data.success && data.step === 'code_sent') {
        setForgotMasked(String(data.masked ?? ''));
        setForgotStep('reset');
        setCountdown(60);
        setDebugCode(data.debugCode ? String(data.debugCode) : '');
        setLoginError('');
      } else if (data.success && data.step === 'contact_admin') {
        setLoginError(`该账号仅绑定了手机号（${data.masked ?? ''}），暂不支持自助找回，请联系管理员重置密码`);
      } else {
        setLoginError(data.error || '校验失败');
      }
    } catch {
      setLoginError('网络错误');
    } finally {
      setLoginPending(false);
    }
  };

  // 找回密码第二步：验证码 + 新密码（服务端按昵称定位注册邮箱校验验证码）
  const handleForgotReset = async () => {
    if (!emailCode.trim()) { setLoginError('请输入邮箱验证码'); return; }
    if (newPassword.length < 8) { setLoginError('新密码至少 8 位'); return; }
    setLoginPending(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password_email', nickname: forgotNickname.trim(), code: emailCode.trim(), newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        alert('密码已重置，请用新密码登录');
        handleSwitchMode('login');
      } else {
        setLoginError(data.error || '重置失败');
      }
    } catch {
      setLoginError('网络错误');
    } finally {
      setLoginPending(false);
    }
  };

  const handleLogout = () => {
    authLogout();
  };

  // 修改联系方式（update_contact：需当前密码，邮箱/手机至少填一项，变更后标记未验证）
  const handleUpdateContact = async () => {
    if (!contactEmail.trim() && !contactPhone.trim()) {
      setContactMsg({ ok: false, text: '请填写要更新的邮箱或手机号' });
      return;
    }
    if (!contactPwd) {
      setContactMsg({ ok: false, text: '请输入当前密码确认' });
      return;
    }
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    if (!token) {
      setContactMsg({ ok: false, text: '登录态已失效，请重新登录' });
      return;
    }
    setContactPending(true);
    setContactMsg(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-token': token },
        body: JSON.stringify({
          action: 'update_contact',
          currentPassword: contactPwd,
          email: contactEmail.trim() || undefined,
          phone: contactPhone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContactMsg({ ok: true, text: '联系方式已更新' });
        setContactPwd('');
        setShowContactEdit(false);
        // 同步刷新本地用户（applySession 会重写 localStorage 里的用户与令牌）
        const token = localStorage.getItem(STORAGE_KEYS.authToken);
        if (token && authUser) {
          applySession(token, { ...authUser, email: data.email ?? null, phone: data.phone ?? null });
        }
      } else {
        setContactMsg({ ok: false, text: data.error || '更新失败' });
      }
    } catch {
      setContactMsg({ ok: false, text: '网络错误' });
    } finally {
      setContactPending(false);
    }
  };

  const handleRedeemCode = async () => {
    if (!inviteCode.trim()) return;
    setInviteStatus('loading');
    setInviteMessage('');
    const result = await redeemCode(inviteCode.trim());
    if (result.success) {
      setInviteStatus('success');
      // 按码类型给准确的到账说明（batch9：使用权 / AI 额度 / 套餐）
      const parts: string[] = [];
      if (result.grantedAccess && !IS_OPEN_MODE) parts.push('使用权已解锁全部功能');
      if (result.grantedCredits && result.grantedCredits > 0) parts.push(`AI 额度 +${result.grantedCredits}`);
      setInviteMessage(parts.length > 0 ? `兑换成功！${parts.join('，')}` : '兑换成功！');
      setInviteCode('');
      fetchCredits();
    } else {
      setInviteStatus('error');
      setInviteMessage(result.error || '兑换失败');
    }
  };

  // ---- AI 额度（额度制：授权码到账，AI 分析按次扣减） ----
  const fetchCredits = useCallback(async () => {
    if (!authUser) { setAiCredits(null); return; }
    try {
      const res = await fetch('/api/ai/credits', { headers: getAuthHeader() });
      const data = await res.json();
      if (data.success) setAiCredits(data.credits as number);
    } catch { /* 静默：额度展示失败不影响主流程 */ }
  }, [authUser]);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  // P1 修复（头像假交互）：选择头像后调服务端持久化，并同步本地用户信息
  const handleSelectAvatar = async (avatar: string) => {
    if (!authUser) return;
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ action: 'update_avatar', avatar }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const token = localStorage.getItem(STORAGE_KEYS.authToken);
        if (token) applySession(token, { ...authUser, avatar });
      }
    } catch { /* ignore */ }
    setShowAvatarPicker(false);
  };

  // ---- Theme / Age / API helpers ----

  // 主题唯一真源是 next-themes（与侧栏切换共用）；
  // 之前这里直接改 documentElement.classList，刷新即丢且会被 next-themes 覆盖回去
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');


  // 参数放宽为 string：自定义源 id 是运行时生成的（src_xxx），不在 AiSourceId 字面量里
  const setActiveSource = useCallback((sourceId: AiSourceId | string) => {
    setActiveAiSource(sourceId as AiSourceId);
    persist(STORAGE_KEY_ACTIVE, sourceId);
  }, [persist]);



  const updateDefaultAge = useCallback((age: number) => {
    setDefaultAge(age);
    writeDefaultAge(age);
  }, []);

  // ---- Advanced settings handlers ----

  const updateStageRange = (id: string, field: 'start' | 'end', value: number) => {
    setLifeStages(prev => {
      const next = prev.map(s => {
        if (s.id !== id) return s;
        const range = field === 'start' ? [value, s.range[1]] : [s.range[0], value];
        return { ...s, range };
      });
      persist(STORAGE_KEYS.lifeStages, next);
      return next;
    });
  };

  const updateStageLabel = (id: string, label: string) => {
    setLifeStages(prev => {
      const next = prev.map(s => s.id === id ? { ...s, label } : s);
      persist(STORAGE_KEYS.lifeStages, next);
      return next;
    });
  };

  const updateWeight = (id: string, value: number) => {
    setWeights(prev => {
      const next = prev.map(w => w.id === id ? { ...w, value: Math.max(0, Math.min(100, value)) } : w);
      persist(STORAGE_KEYS.preferenceWeights, next);
      return next;
    });
  };

  const resetAdvanced = () => {
    // P1：恢复默认会覆盖自定义的阶段与权重，先确认
    if (!window.confirm('确定恢复全部高级设置为默认值吗？')) return;
    setLifeStages(DEFAULT_LIFE_STAGES);
    setWeights(DEFAULT_WEIGHTS);
    persist(STORAGE_KEYS.lifeStages, DEFAULT_LIFE_STAGES);
    persist(STORAGE_KEYS.preferenceWeights, DEFAULT_WEIGHTS);
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
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2 animate-fade-in-up stagger-1">用户中心</h1>
            <p className="text-sm text-muted-foreground animate-fade-in-up stagger-2">管理你的偏好和设置</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8 space-y-6">

        {/* ===== Welcome Bonus Banner ===== */}
        {welcomeBonus > 0 && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 animate-fade-in-up flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Gift className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {IS_OPEN_MODE ? `${welcomeBonus} 次 AI 分析额度已到账。` : `注册赠送 ${welcomeBonus} 次 AI 分析额度`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {IS_OPEN_MODE ? '各模块里的 AI 分析会按次扣减；用完可输入续码，或填自己的 Key。' : '已自动到账，可前往各模块使用 AI 深度分析'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setWelcomeBonus(0)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none shrink-0"
              aria-label="关闭"
            >
              ×
            </button>
          </div>
        )}

        {/* ===== Profile Card ===== */}
        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up stagger-2">
          {authUser ? (
            <div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="flex h-14 w-14 items-center justify-center rounded-[2px] border border-primary/40 bg-primary/5 font-serif text-2xl font-semibold text-primary transition-colors hover:border-primary cursor-pointer"
                  title="点击更换头像"
                >
                  {authUser.avatar}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">{authUser.nickname}</h2>
                    {/* Role badge */}
                    {authUser.role === 'developer' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Crown className="w-3 h-3" /> 开发者
                      </span>
                    ) : !IS_OPEN_MODE && authUser.role === 'premium' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
                        <Zap className="w-3 h-3" /> 充电用户
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                        {IS_OPEN_MODE ? '成员' : '普通用户'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {accessibleCount}/{totalModules} 模块可用 · 注册于 {new Date(authUser.created_at).toLocaleDateString('zh-CN')}{(IS_OPEN_MODE || authUser.role === 'premium') && aiCredits !== null ? ` · AI 余额 ${aiCredits} 次` : ''}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                  退出
                </button>
              </div>

              {/* 续码兑换区：open 模式所有登录用户可见（AI 付费点唯一）；legacy 仅未持使用权者可见 */}
              {(IS_OPEN_MODE || !isPremium) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{IS_OPEN_MODE ? 'AI 额度' : '邀请码充电'}</span>
                    {aiCredits !== null && (
                      <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">
                        AI 余额 <span className="text-primary font-semibold">{aiCredits}</span> 次
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {IS_OPEN_MODE ? '输入续码补充 AI 次数。使用自己的 Key 不扣次数。' : '输入授权码升级为充电用户并到账 AI 额度；AI 分析按次扣减，自带 Key 不扣'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={inviteCode}
                      onChange={(e) => { setInviteCode(e.target.value); setInviteStatus('idle'); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleRedeemCode()}
                      placeholder={IS_OPEN_MODE ? '输入续码' : '输入邀请码'}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={handleRedeemCode}
                      disabled={!inviteCode.trim() || inviteStatus === 'loading'}
                      className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-press disabled:opacity-50"
                    >
                      {inviteStatus === 'loading' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                      {IS_OPEN_MODE ? '兑换' : '充电'}
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
                <p className="text-xs text-muted-foreground">
                  {IS_OPEN_MODE ? '注册后，偏好和标记会同步到云端。' : '注册后可保存偏好和升级权限'}
                </p>
              </div>
              <button
                onClick={() => { setShowLoginDialog(true); setLoginMode(REGISTRATION_OPEN ? 'register' : 'login'); setLoginError(''); }}
                className="rounded-md bg-primary px-4 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-press"
              >
                {REGISTRATION_OPEN ? '注册 / 登录' : '登录'}
              </button>
            </div>
          )}

          {/* Avatar picker */}
          {showAvatarPicker && authUser && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[11px] text-muted-foreground mb-2">选择头像</p>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map(a => (
                  <button
                    key={a}
                    onClick={() => handleSelectAvatar(a)}
                    className={cn(
                      'h-10 w-10 rounded-[2px] border flex items-center justify-center font-serif text-xl transition-colors',
                      authUser.avatar === a ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground/80 hover:border-primary/50'
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 联系方式（收集未验证；修改需当前密码确认） */}
          {authUser && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground">
                  邮箱：{authUser.email || '未填写'}<span className="mx-1.5">·</span>手机：{authUser.phone || '未填写'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowContactEdit(!showContactEdit);
                    setContactMsg(null);
                    setContactPwd('');
                    setContactEmail(typeof authUser.email === 'string' ? authUser.email : '');
                    setContactPhone(typeof authUser.phone === 'string' ? authUser.phone : '');
                  }}
                  className="text-xs text-primary hover:underline shrink-0"
                >
                  {showContactEdit ? '收起' : '修改'}
                </button>
              </div>
              {showContactEdit && (
                <div className="mt-3 space-y-2.5">
                  <input
                    type="email"
                    inputMode="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="新邮箱（不变请留空原值即不会改动）"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value.replace(/[^\d\s-]/g, ''))}
                    placeholder="新手机号（不变请留原值）"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <input
                    type="password"
                    value={contactPwd}
                    onChange={(e) => setContactPwd(e.target.value)}
                    placeholder="当前密码（确认身份）"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {contactMsg && (
                    <p role="alert" className={cn('text-xs', contactMsg.ok ? 'text-emerald-600' : 'text-destructive')}>{contactMsg.text}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleUpdateContact}
                    disabled={contactPending}
                    className="w-full rounded-md border border-primary/40 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-60"
                  >
                    {contactPending ? '提交中…' : '确认修改'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== Login Dialog ===== */}
        {showLoginDialog && (
          <>
            <div className="fixed inset-0 z-40 bg-black/65 md:bg-black/55 animate-fade-in" onClick={() => setShowLoginDialog(false)} aria-hidden="true" />
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
                      {loginMode === 'register' ? '创建账号' : loginMode === 'email' ? '验证码登录' : loginMode === 'forgot' ? '重置密码' : '欢迎回来'}
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
                    {loginMode === 'register' ? '需要昵称、8 位以上密码，以及邮箱或手机号（至少一项，用于找回）。注册送 50 次 AI 分析，偏好和标记同步到云端。'
                      : loginMode === 'email' ? '输入邮箱获取验证码，无需密码'
                      : loginMode === 'forgot' ? '用注册时填写的邮箱或手机号验证身份'
                      : '登录后记住你的年龄与标记，换设备也在。'}
                  </p>
                </div>
                <div className="px-6 py-5 space-y-4">
                  {(loginMode === 'login' || loginMode === 'register') && (
                    <>
                      <div>
                        <label htmlFor="login-nickname" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">{loginMode === 'login' ? '昵称或邮箱' : '昵称'}</label>
                        <input
                          id="login-nickname"
                          type="text"
                          value={loginNickname}
                          onChange={(e) => setLoginNickname(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (loginMode === 'register' ? handleRegister() : handleLogin())}
                          placeholder={loginMode === 'login' ? '昵称或注册邮箱均可' : '输入你的昵称'}
                          maxLength={50}
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label htmlFor="login-password" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">密码</label>
                        <input
                          id="login-password"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (loginMode === 'register' ? handleRegister() : handleLogin())}
                          placeholder={loginMode === 'register' ? '至少8位密码' : '输入密码'}
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      {loginMode === 'register' && (
                        <>
                          <div>
                            <label htmlFor="reg-email" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">邮箱（与手机至少填一项）</label>
                            <input
                              id="reg-email"
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                          </div>
                          <div>
                            <label htmlFor="reg-phone" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">手机号</label>
                            <input
                              id="reg-phone"
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel"
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value.replace(/[^\d\s-]/g, ''))}
                              placeholder="用于日后找回密码"
                              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                          </div>
                          <TurnstileWidget onToken={setTurnstileToken} resetSignal={turnstileReset} />
                        </>
                      )}
                    </>
                  )}

                  {loginMode === 'email' && (
                    <>
                      <div>
                        <label htmlFor="login-email" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">邮箱</label>
                        <input
                          id="login-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={emailAddr}
                          onChange={(e) => setEmailAddr(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
                        {(['login', 'register'] as const).map(k => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => { setEmailPurpose(k); setLoginError(''); }}
                            className={cn(
                              'flex-1 rounded-md py-1.5 text-xs transition-colors',
                              emailPurpose === k ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {k === 'login' ? '已有账号，验证码登录' : '新用户，验证码注册'}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label htmlFor="login-code" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">验证码</label>
                        <div className="flex gap-2">
                          <input
                            id="login-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                            onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                            placeholder="6 位数字"
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-sm font-mono tracking-[0.3em] text-foreground placeholder:tracking-normal placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendCode(emailPurpose)}
                            disabled={codeSending || countdown > 0 || !emailAddr.trim()}
                            className="shrink-0 rounded-md border border-primary/40 px-3 text-xs font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {codeSending ? '发送中…' : countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                          </button>
                        </div>
                        {debugCode && (
                          <p className="mt-1.5 text-[11px] text-amber-600">本地调试验证码：{debugCode}</p>
                        )}
                      </div>
                    </>
                  )}

                  {loginMode === 'forgot' && forgotStep === 'match' && (
                    <>
                      <div>
                        <label htmlFor="forgot-nickname" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">昵称</label>
                        <input
                          id="forgot-nickname"
                          type="text"
                          value={forgotNickname}
                          onChange={(e) => setForgotNickname(e.target.value)}
                          placeholder="你的账号昵称"
                          maxLength={50}
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label htmlFor="forgot-contact" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">注册时填写的邮箱或手机号</label>
                        <input
                          id="forgot-contact"
                          type="text"
                          value={forgotContact}
                          onChange={(e) => setForgotContact(e.target.value)}
                          placeholder="与注册信息一致即可"
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        校验通过后，验证码将发送至注册邮箱；仅绑定手机号的账号请联系管理员重置。
                      </p>
                    </>
                  )}

                  {loginMode === 'forgot' && forgotStep === 'reset' && (
                    <>
                      <p className="text-xs text-muted-foreground">
                        验证码已发送至 <span className="font-medium text-foreground">{forgotMasked}</span>
                        {countdown > 0 ? `（${countdown}s 后可重发）` : ''}
                      </p>
                      <div>
                        <label htmlFor="forgot-code" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">邮箱验证码</label>
                        <input
                          id="forgot-code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={emailCode}
                          onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="6 位数字"
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm font-mono tracking-[0.3em] text-foreground placeholder:tracking-normal placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                          autoFocus
                        />
                        {debugCode && (
                          <p className="mt-1.5 text-[11px] text-amber-600">本地调试验证码：{debugCode}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="new-password" className="text-[11px] font-medium text-muted-foreground mb-1.5 block">新密码</label>
                        <input
                          id="new-password"
                          type="password"
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleForgotReset()}
                          placeholder="至少 8 位"
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => { setForgotStep('match'); setEmailCode(''); setNewPassword(''); setDebugCode(''); setLoginError(''); }}
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                      >
                        ← 信息填错了？返回上一步重新发送
                      </button>
                    </>
                  )}

                  {loginError && (
                    <p role="alert" className="text-xs text-destructive">{loginError}</p>
                  )}

                  <button
                    onClick={
                      loginMode === 'register' ? handleRegister
                      : loginMode === 'email' ? handleEmailSubmit
                      : loginMode === 'forgot' ? (forgotStep === 'match' ? handleForgotMatch : handleForgotReset)
                      : handleLogin
                    }
                    disabled={loginPending}
                    aria-busy={loginPending}
                    className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all btn-press disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loginPending && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                    {loginPending ? '处理中…'
                      : loginMode === 'register' ? '注册'
                      : loginMode === 'email' ? (emailPurpose === 'register' ? '注册并登录' : '登录')
                      : loginMode === 'forgot' ? (forgotStep === 'match' ? '下一步：发送验证码' : '重置密码')
                      : '登录'}
                  </button>

                  <div className="text-center space-y-1.5">
                    {(loginMode === 'login' || loginMode === 'register') && (
                      <>
                        <div className="flex items-center justify-center gap-3">
                          {loginMode === 'login' && (
                            <button type="button" onClick={() => handleSwitchMode('forgot')} className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                              忘记密码？
                            </button>
                          )}
                          {(loginMode === 'login' || REGISTRATION_OPEN) && (
                            <button
                              type="button"
                              onClick={() => { setLoginMode(loginMode === 'register' ? 'login' : 'register'); setLoginError(''); }}
                              className="text-xs text-primary hover:underline"
                            >
                              {loginMode === 'register' ? '已有账号？去登录' : '没有账号？去注册'}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                    {(loginMode === 'email' || loginMode === 'forgot') && (
                      <button type="button" onClick={() => handleSwitchMode('login')} className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                        ← 返回密码登录
                      </button>
                    )}
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
            <span className="text-[11px] font-mono text-muted-foreground tabular-nums">{visitedCount}/{totalModules}</span>
          </div>

          <div className="mb-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/50 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px] text-muted-foreground">{progressPercent}% 完成</span>
              <span className="text-[11px] text-primary/60">
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
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                  ) : isVisited ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-[11px] font-mono tabular-nums', isLocked ? 'text-muted-foreground/20' : isVisited ? 'text-primary/50' : 'text-muted-foreground/30')}>
                        {mod.icon}
                      </span>
                      <span className={cn('text-xs', isLocked ? 'text-muted-foreground/70' : isVisited ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                        {mod.name}
                      </span>
                    </div>
                  </div>
                  {!isLocked && (
                    <ArrowRight className="h-3 w-3 text-muted-foreground/0 group-hover/progress:text-muted-foreground/70 transition-colors shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
          {authUser && !IS_OPEN_MODE && !isPremium && (
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
              <span className="text-[11px] text-muted-foreground">当前使用:</span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 rounded-sm px-2 py-0.5">
                <Zap className="h-2.5 w-2.5" />
                {activeModelInfo.source} / {activeModelInfo.name}
              </span>
              {customSources.length > 0 && (
                <span className="text-[11px] text-muted-foreground/75">
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
                      <span className="flex items-center gap-1 text-[11px] text-primary bg-primary/10 rounded-sm px-1.5 py-0.5"><Zap className="h-2.5 w-2.5" />使用中</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{BUILTIN_PROVIDER.description}</p>
                </div>
                <button onClick={() => setActiveSource('builtin')} className={cn('rounded-md px-3 py-1.5 text-[11px] font-medium transition-all', activeAiSource === 'builtin' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted')}>
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
                  setCustomSources(JSON.parse(localStorage.getItem(STORAGE_KEYS.aiSources) || '[]'));
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
                <input type="number" min={0} max={AGE_MAX} value={defaultAge ?? ''} onChange={(e) => updateDefaultAge(Math.max(0, Math.min(AGE_MAX, parseInt(e.target.value) || 0)))} className="w-16 rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground text-center focus:outline-none focus:ring-1 focus:ring-ring" autoFocus />
                <span className="text-[11px] text-muted-foreground">岁</span>
                <button onClick={() => setShowAgeInput(false)} className="text-[11px] text-primary hover:underline">确定</button>
              </div>
            ) : (
              <button onClick={() => setShowAgeInput(true)} className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs text-foreground hover:bg-accent/30 transition-colors">
                {defaultAge === null ? (
                  <span className="text-muted-foreground">未设置</span>
                ) : (
                  <>
                    <span className="font-mono tabular-nums">{defaultAge}</span>
                    <span className="text-muted-foreground">岁</span>
                  </>
                )}
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
            <span className="text-[11px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-sm px-2 py-1">已保护</span>
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
                <button onClick={resetAdvanced} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
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
                      <span className="text-muted-foreground/75">岁</span>
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
            人生沙盘是一个基于数据与概率的人生规划工具。我们不提供标准答案——
            每个人的人生都是独特的。我们只提供一个框架，帮助你更清晰地看到牌面、
            计算概率、识别窗口。
          </p>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground/70 font-serif italic">不是算命，是算概率</span>
          </div>
        </div>

        <ResetExperienceCard />
      </div>
    </div>
  );
}

/** 开发者专用：清空本地存储回到访客视角（不动云端数据） */
function ResetExperienceCard() {
  const { user } = useAuth();
  if (!user || user.role !== 'developer') return null;
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/40 p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground">开发者 · 重置体验</h3>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        清空本浏览器的本地数据（登录态、介绍文档标记、浏览记录、本地 AI Key），
        回到访客视角从头体验。云端数据不受影响。
      </p>
      <button
        type="button"
        onClick={() => {
          if (!window.confirm('清空本地数据并回到访客状态？本地的 AI Key 也会被清掉，需要的话先记下来。')) return;
          try { localStorage.clear(); sessionStorage.clear(); } catch { /* ignore */ }
          window.location.href = '/';
        }}
        className="mt-3 rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        重置本地数据
      </button>
    </div>
  );
}
