'use client';

import { useCallback } from 'react';
import { useLockedAction } from '@/hooks/use-locked-action';
import { STORAGE_KEYS } from '@/lib/storage-keys';

/** 访客每个模块可免费展开的详情条数 */
export const FREE_DETAIL_PER_MODULE = 1;

type FreeCounts = Record<string, number>;

function readCounts(): FreeCounts {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.freePreview);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as FreeCounts) : {};
  } catch {
    return {};
  }
}

/**
 * 消耗一次模块的免费详情名额。名额未用完返回 true 并计数；
 * 存储不可用时返回 false（退回解锁引导，不做无记录的放行）。
 */
function consumeFreeDetail(moduleId: string): boolean {
  if (typeof window === 'undefined') return false;
  const counts = readCounts();
  const used = counts[moduleId] ?? 0;
  if (used >= FREE_DETAIL_PER_MODULE) return false;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.freePreview,
      JSON.stringify({ ...counts, [moduleId]: used + 1 })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * 详情类动作的守卫：已解锁直接执行；访客在该模块的首次详情免费放行，
 * 之后走 useLockedAction().guard 弹出解锁引导。
 *
 * 用法：const guardDetail = useFreeDetailGuard('laws');
 *       <button onClick={() => guardDetail(() => setSelectedItemId(id))}>
 */
export function useFreeDetailGuard(moduleId: string) {
  const { isLocked, guard } = useLockedAction();

  return useCallback(
    (action: () => void) => {
      if (!isLocked) {
        action();
        return;
      }
      if (consumeFreeDetail(moduleId)) {
        action();
        return;
      }
      guard(action);
    },
    [isLocked, guard, moduleId]
  );
}
