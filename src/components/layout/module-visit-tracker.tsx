'use client';

import { useModuleVisit } from '@/hooks/use-module-visit';

export function ModuleVisitTracker() {
  useModuleVisit();
  return null;
}
