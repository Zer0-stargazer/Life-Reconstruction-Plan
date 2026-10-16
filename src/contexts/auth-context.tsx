"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { STORAGE_KEYS, SESSION_KEYS } from "@/lib/storage-keys";
import { SessionExpiredBanner } from "@/components/layout/session-expired-banner";
import { clearSyncedLocalData } from "@/lib/user-state-sync";
import { BUSINESS_MODE } from "@/lib/business-mode";

// ---- Types ----

export type UserRole = "normal" | "premium" | "developer";

export interface AuthUser {
  id: number;
  nickname: string;
  avatar: string;
  role: UserRole;
  created_at: string;
  /** 联系方式为收集值（未验证）；验证码链路启用后以 email_verified 为准 */
  email?: string | null;
  phone?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (nickname: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (nickname: string, password: string, contact?: { email?: string; phone?: string }) => Promise<{ success: boolean; error?: string; grantedCredits?: number }>;
  /** 把服务端签发的会话直接落进本地（邮箱验证码登录/注册等自定义流程用） */
  applySession: (token: string, user: AuthUser) => void;
  logout: () => void;
  /**
   * 服务端返回 401（令牌过期/失效）时统一调用：清登录态 + 显示「登录已过期」横幅。
   * 与 logout 不同：**不清本地同步数据**，同一用户重新登录可保住离线改动。内置去抖。
   */
  handleSessionExpired: () => void;
  /** 是否正显示登录过期提示（横幅用） */
  sessionExpired: boolean;
  redeemCode: (code: string) => Promise<{
    success: boolean;
    error?: string;
    /** 本次兑换是否获得了使用权（ai 类纯额度码为 false） */
    grantedAccess?: boolean;
    /** 本次到账的 AI 额度 */
    grantedCredits?: number;
  }>;
  refreshUser: () => Promise<void>;
  updateUserRole: (newRole: UserRole) => void;
  // Feature gating
  isPremium: boolean;
  isDeveloper: boolean;
  /** 是否可完整使用该模块功能（详情/AI/报告，需持码）；否则是预览态 */
  canAccessModule: (modulePath: string) => boolean;
  /** 是否可直接查看该模块页面：登录用户全部可看；访客只能看未设登录门的板块 */
  canViewModule: (modulePath: string) => boolean;
  /** 是否可预览该模块（列表与摘要人人可逛，锁定点在各页触发动作上） */
  canPreviewModule: (modulePath: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** 访客必须登录才能看的板块——2026-10-15 用户拍板：全部板块登录后才可见，访客只保留首页与关于页 */
export const LOGIN_REQUIRED_MODULES: readonly string[] = [
  "/me",
  "/windows",
  "/career",
  "/laws",
  "/luck",
  "/name",
  "/destiny",
  "/simulation",
  "/health",
  "/journey",
];

/** 用户信息（仅用于界面展示，权限判定的唯一依据是服务端会话令牌） */
const USER_STORAGE_KEY = STORAGE_KEYS.authUser;
/** 服务端签发的会话令牌，敏感接口（兑换邀请码等）必须携带 */
const TOKEN_STORAGE_KEY = STORAGE_KEYS.authToken;

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch { /* ignore */ }
}

const NORMAL_USER_MODULES = [
  "/name",    // 姓名
  "/career",  // 职业
  "/windows", // 窗口
];

const ALL_MODULES = [
  "/name",
  "/career",
  "/destiny",
  "/laws",
  "/simulation",
  "/windows",
  "/luck",
  "/health",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const expiredAtRef = useRef(0);

  // 过期提示跨刷新保留（登出态触发云同步守卫会刷新一次页面）
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEYS.sessionExpired) === "1" && !readToken()) {
        setSessionExpired(true);
      }
    } catch { /* ignore */ }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        // P1 修复（多标签页登出不同步）：读不到用户信息 = 已登出，必须置空，
        // 否则另一标签页登出后本页仍显示已登录
        if (!stored) {
          setUser(null);
          return;
        }

        // 会话完整性：有用户信息但没有服务端令牌，说明是旧版本留下的残会话，
        // 一调用受保护接口就会被拒。这里直接判为未登录，避免"看着登录了但操作必失败"。
        if (!readToken()) {
          localStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
          return;
        }

        const parsed = JSON.parse(stored);
        setUser((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(parsed)) return parsed;
          return prev;
        });
      } catch { /* ignore */ }
    };

    loadUser();
    setIsLoading(false);

    // Listen for cross-tab storage changes
    const handleStorage = (e: StorageEvent) => {
      // e.key === null：另一标签页执行了 localStorage.clear()
      if (e.key === null || e.key === USER_STORAGE_KEY || e.key === TOKEN_STORAGE_KEY) loadUser();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const persistUser = useCallback((u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) {
        setSessionExpired(false);
        try { sessionStorage.removeItem(SESSION_KEYS.sessionExpired); } catch { /* ignore */ }
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch { /* ignore */ }
  }, []);

  const applySession = useCallback((token: string, u: AuthUser) => {
    writeToken(token);
    persistUser(u);
  }, [persistUser]);

  const login = useCallback(async (nickname: string, password: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", nickname, password }),
      });
      const data = await res.json();
      if (data.success) {
        writeToken(data.token ?? null);
        persistUser(data.user);
        return { success: true, grantedCredits: typeof data.grantedCredits === "number" ? data.grantedCredits : undefined };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: "网络错误" };
    }
  }, [persistUser]);

  const register = useCallback(async (nickname: string, password: string, contact?: { email?: string; phone?: string }) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", nickname, password, email: contact?.email, phone: contact?.phone }),
      });
      const data = await res.json();
      if (data.success) {
        writeToken(data.token ?? null);
        persistUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: "网络错误" };
    }
  }, [persistUser]);

  const logout = useCallback(() => {
    persistUser(null);
    writeToken(null);
    // P0 修复（切换账号串号）：登出必须清掉全部同步键的本地值 + meta。
    // 此前只清 meta，A 的本地数据留着，B 登录时 meta 为空 → 被判"脏" → 推送覆盖 B 的云端。
    // 放在摘掉令牌之后：其他标签页即便被 storage 事件触发推送也会因无令牌而放弃
    clearSyncedLocalData();
  }, [persistUser]);

  const handleSessionExpired = useCallback(() => {
    // 本地本来就没有会话（访客/已处理过）：不是「过期」，不提示
    if (!readToken()) return;
    const now = Date.now();
    if (now - expiredAtRef.current < 5000) return; // 去抖：多个请求同时 401 只处理一次
    expiredAtRef.current = now;
    // 只摘会话，不 clearSyncedLocalData：同一用户重新登录要保住离线改动
    persistUser(null);
    writeToken(null);
    try { sessionStorage.setItem(SESSION_KEYS.sessionExpired, "1"); } catch { /* ignore */ }
    setSessionExpired(true);
  }, [persistUser]);

  const redeemCode = useCallback(async (code: string) => {
    if (!user) return { success: false, error: "请先登录" };

    const token = readToken();
    if (!token) {
      // 会话不完整（旧版本残留），提示重新登录而不是带着无效请求去撞 401
      return { success: false, error: "登录态已失效，请重新登录" };
    }

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // userId 不再由客户端自报：服务端从会话令牌里取
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.status === 401) {
        // 令牌过期/失效，清掉本地残会话
        persistUser(null);
        writeToken(null);
        return { success: false, error: data.error || "登录态已失效，请重新登录" };
      }

      if (data.success) {
        // role 变了，服务端会重新签发令牌，本地要跟着更新
        if (data.token) writeToken(data.token);
        persistUser({ ...user, role: data.role ?? "premium" });
        return {
          success: true,
          grantedAccess: data.grantedAccess ?? true,
          grantedCredits: typeof data.grantedCredits === "number" ? data.grantedCredits : undefined,
        };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: "网络错误" };
    }
  }, [user, persistUser]);

  // Re-read user from localStorage (e.g. after role change from another tab)
  const refreshUser = useCallback(async () => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  const updateUserRole = useCallback((newRole: UserRole) => {
    if (!user) return;
    persistUser({ ...user, role: newRole });
  }, [user, persistUser]);

  // 商业模式分离开（business-mode.ts）：
  // - open（当前生效）：登录即解锁全部功能，isPremium 语义退化为「已登录」
  // - legacy（旧买断制，保留未删）：premium/developer 使用权解锁
  const isPremium = BUSINESS_MODE === "legacy"
    ? user?.role === "premium" || user?.role === "developer"
    : !!user;
  const isDeveloper = user?.role === "developer";

  /**
 * 权限模型（按 BUSINESS_MODE 分离）：
 * - open：内容与功能登录即全解锁；AI 额度独立消耗，扣完可用自带 Key（BYOK）或充值续码
 * - legacy：使用权（premium/developer）解锁功能；AI 额度独立消耗品，与使用权分开售卖
 * 设计稿：docs/DESIGN-VISITOR-PREVIEW-AND-CREDITS.md
 */

  const canViewModule = useCallback((modulePath: string) => {
    if (user) return true; // 登录用户：全部板块可看
    return !LOGIN_REQUIRED_MODULES.includes(modulePath);
  }, [user]);

  /** 功能解锁（持使用权）；与「能否看」是两层 */
  const canAccessModule = useCallback((modulePath: string) => {
    void modulePath;
    return isPremium;
  }, [isPremium]);

  /** 预览模式：列表与摘要人人可看 */
  const canPreviewModule = useCallback((modulePath: string) => {
    void modulePath;
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      applySession,
      logout,
      handleSessionExpired,
      sessionExpired,
      redeemCode,
      refreshUser,
      updateUserRole,
      isPremium,
      isDeveloper,
      canAccessModule,
      canViewModule,
      canPreviewModule,
    }}>
      <SessionExpiredBanner />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ALL_MODULES, NORMAL_USER_MODULES };
