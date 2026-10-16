'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { notifyStateDirty } from '@/lib/user-state-sync';

const TRACKABLE_PATHS = [
  '/name',
  '/career',
  '/destiny',
  '/laws',
  '/simulation',
  '/windows',
  '/luck',
  '/health',
];

/**
 * Tracks module page visits and persists them to localStorage.
 * Use this hook in each module page or in the root layout.
 */
export function useModuleVisit() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !TRACKABLE_PATHS.includes(pathname)) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.visitedModules);
      const visited: string[] = stored ? JSON.parse(stored) : [];
      if (!visited.includes(pathname)) {
        visited.push(pathname);
        localStorage.setItem(STORAGE_KEYS.visitedModules, JSON.stringify(visited));
        notifyStateDirty(); // P1 修复：写入后广播，否则登录用户的访问记录不进云同步
      }
    } catch {
      // ignore storage errors
    }
  }, [pathname]);
}
