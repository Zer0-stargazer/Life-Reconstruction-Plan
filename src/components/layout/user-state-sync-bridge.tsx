'use client';

/**
 * UserStateSyncBridge —— 用户数据云同步的挂载点（batch8）。
 * hook 本体在 use-user-state-sync.ts；这里只是让 root layout 能挂一个客户端组件。
 */

import { useUserStateSync } from '@/hooks/use-user-state-sync';

export function UserStateSyncBridge() {
  useUserStateSync();
  return null;
}
