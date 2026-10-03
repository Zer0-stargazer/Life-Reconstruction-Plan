'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { unlockStore } from '@/lib/unlock-store';

/**
 * 锁定动作统一入口（访客预览模型的核心钩子）。
 *
 * isLocked：当前身份是否处于预览态（未持码）。
 * guard(action)：已解锁直接执行；预览态则弹出全局解锁引导。
 *
 * 用法：const { guard } = useLockedAction();
 *       <button onClick={() => guard(() => openDetail(item))}>
 */
export function useLockedAction() {
  const { isPremium } = useAuth();

  const guard = useCallback(
    (action: () => void) => {
      if (isPremium) action();
      else unlockStore.show();
    },
    [isPremium]
  );

  return useMemo(() => ({ isLocked: !isPremium, guard }), [guard, isPremium]);
}

/** 解锁弹窗开关（供 UnlockDialog 用） */
export function useUnlockOpen(): boolean {
  return useSyncExternalStore(unlockStore.subscribe, unlockStore.getOpen, () => false);
}
