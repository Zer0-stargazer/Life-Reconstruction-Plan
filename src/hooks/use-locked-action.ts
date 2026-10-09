'use client';

import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { unlockStore } from '@/lib/unlock-store';

/** 登录页：访客从这里登录后，待执行动作保留，回到原页面时再执行 */
const LOGIN_PATH = '/user';

/** 待执行动作的有效期：超过则丢弃，避免很久之后回到原页面时误触发 */
const PENDING_TTL_MS = 10 * 60 * 1000;

/**
 * 被拦截的待执行动作（模块级，全站一份）。
 * path 记录触发时的页面：动作闭包属于该页面，只能在该页面执行。
 * at 记录创建时间戳（Date.now()），用于判断是否过期。
 */
let pending: { action: () => void; path: string; at: number } | null = null;

/**
 * 锁定动作统一入口（访客预览模型的核心钩子）。
 *
 * isLocked：当前身份是否处于预览态（未持码）。
 * guard(action)：已解锁直接执行；预览态则记下待执行动作并弹出全局解锁引导。
 * 解锁成功后由 UnlockDialog 内的 useRunPendingLockedAction 自动执行一次。
 *
 * 用法：const { guard } = useLockedAction();
 *       <button onClick={() => guard(() => openDetail(item))}>
 */
export function useLockedAction() {
  const { isPremium } = useAuth();
  const pathname = usePathname();

  const guard = useCallback(
    (action: () => void) => {
      if (isPremium) {
        action();
        return;
      }
      pending = { action, path: pathname, at: Date.now() };
      unlockStore.show();
    },
    [isPremium, pathname]
  );

  return useMemo(() => ({ isLocked: !isPremium, guard }), [guard, isPremium]);
}

/** 解锁弹窗开关（供 UnlockDialog 用） */
export function useUnlockOpen(): boolean {
  return useSyncExternalStore(unlockStore.subscribe, unlockStore.getOpen, () => false);
}

/** 用户主动关闭解锁弹窗（Esc / 遮罩 / 关闭钮）：放弃待执行动作。 */
export function dismissUnlock() {
  pending = null;
  unlockStore.hide();
}

/**
 * 解锁后执行待执行动作（UnlockDialog 内调用，全站一个实例）。
 * 条件：已持码 + 弹窗已关闭 + 当前仍在触发页（登录页期间保留）+ 未超过有效期。
 * 执行前先清空 pending，保证只执行一次（StrictMode 双调用也安全）。
 */
export function useRunPendingLockedAction() {
  const { isPremium } = useAuth();
  const open = useUnlockOpen();
  const pathname = usePathname();

  useEffect(() => {
    if (!pending) return;
    // 离开了触发页且不是登录页：放弃，避免日后误触发
    if (pathname !== pending.path && pathname !== LOGIN_PATH) {
      pending = null;
      return;
    }
    // 超过有效期：放弃
    if (Date.now() - pending.at >= PENDING_TTL_MS) {
      pending = null;
      return;
    }
    if (!isPremium || open || pathname !== pending.path) return;
    const { action } = pending;
    pending = null;
    action();
  }, [isPremium, open, pathname]);
}
