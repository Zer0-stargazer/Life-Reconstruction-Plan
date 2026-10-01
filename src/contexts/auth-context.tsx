"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// ---- Types ----

export type UserRole = "normal" | "premium" | "developer";

export interface AuthUser {
  id: number;
  nickname: string;
  avatar: string;
  role: UserRole;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (nickname: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (nickname: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  redeemCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  updateUserRole: (newRole: UserRole) => void;
  // Feature gating
  isPremium: boolean;
  isDeveloper: boolean;
  canAccessModule: (modulePath: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** 用户信息（仅用于界面展示，权限判定的唯一依据是服务端会话令牌） */
const USER_STORAGE_KEY = "auth-user";
/** 服务端签发的会话令牌，敏感接口（兑换邀请码等）必须携带 */
const TOKEN_STORAGE_KEY = "auth-token";

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
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (!stored) return;

        // 会话完整性：有用户信息但没有服务端令牌，说明是旧版本留下的残会话，
        // 一调用受保护接口就会被拒。这里直接判为未登录，避免"看着登录了但操作必失败"。
        if (!readToken()) {
          localStorage.removeItem(USER_STORAGE_KEY);
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
      if (e.key === USER_STORAGE_KEY || e.key === TOKEN_STORAGE_KEY) loadUser();
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
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch { /* ignore */ }
  }, []);

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
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: "网络错误" };
    }
  }, [persistUser]);

  const register = useCallback(async (nickname: string, password: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", nickname, password }),
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
        return { success: true };
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

  const isPremium = user?.role === "premium" || user?.role === "developer";
  const isDeveloper = user?.role === "developer";

  /**
   * 测试期临时放开全部模块。
   * 等邀请码/付费链路真的要收口时，这里要恢复成按角色判断。
   */
  const canAccessModule = useCallback((modulePath: string) => {
    void modulePath;
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      redeemCode,
      refreshUser,
      updateUserRole,
      isPremium,
      isDeveloper,
      canAccessModule,
    }}>
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
