'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TRACKABLE_PATHS = [
  '/name',
  '/career',
  '/destiny',
  '/laws',
  '/simulation',
  '/windows',
  '/luck',
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
      const stored = localStorage.getItem('visited-modules');
      const visited: string[] = stored ? JSON.parse(stored) : [];
      if (!visited.includes(pathname)) {
        visited.push(pathname);
        localStorage.setItem('visited-modules', JSON.stringify(visited));
      }
    } catch {
      // ignore storage errors
    }
  }, [pathname]);
}
