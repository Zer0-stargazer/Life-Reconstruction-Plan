'use client';

import { STORAGE_KEYS } from './storage-keys';

/**
 * 读本地会话令牌，返回 fetch 用的 Authorization 头。
 * 未登录返回空对象（AI 分析走 BYOK 时不需要登录）。
 */
export function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}
