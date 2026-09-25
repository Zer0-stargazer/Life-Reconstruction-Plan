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
        const stored = localStorage.getItem("auth-user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(parsed)) return parsed;
            return prev;
          });
        }
      } catch { /* ignore */ }
    };

    loadUser();
    setIsLoading(false);

    // Listen for cross-tab storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "auth-user") loadUser();
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
        localStorage.setItem("auth-user", JSON.stringify(u));
      } else {
        localStorage.removeItem("auth-user");
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
  }, [persistUser]);

  const redeemCode = useCallback(async (code: string) => {
    if (!user) return { success: false, error: "请先登录" };
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, code }),
      });
      const data = await res.json();
      if (data.success) {
        persistUser({ ...user, role: "premium" });
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
      const stored = localStorage.getItem("auth-user");
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

  // Fixed: unauthenticated users get restricted access, not full access
  const canAccessModule = useCallback((modulePath: string) => {
    if (!user) return false;
    if (isPremium) return true;
    return NORMAL_USER_MODULES.includes(modulePath);
  }, [user, isPremium]);

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