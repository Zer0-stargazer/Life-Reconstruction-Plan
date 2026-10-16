'use client';

/**
 * FavStar —— 列表卡片右上角的收藏星标（batch 联动第三批）。
 *
 * laws / luck 等长列表的"个人收藏"入口：值统一存 'fav'，
 * storageKey 区分模块（laws-favorites.v1 / luck-favorites.v1），
 * 走 useModuleMarks 通用 store，写入后自动进云同步。
 * 卡片本身有 onClick，这里必须 stopPropagation。
 */

import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useModuleMarks } from '@/hooks/use-module-marks';

export function FavStar({ id, storageKey, className }: { id: number | string; storageKey: string; className?: string }) {
  const { marks, toggleMark } = useModuleMarks(storageKey);
  const active = marks[String(id)] === 'fav';

  return (
    <button
      type="button"
      aria-label={active ? '取消收藏' : '收藏'}
      aria-pressed={active}
      title={active ? '取消收藏' : '收藏'}
      onClick={(e) => {
        e.stopPropagation();
        toggleMark(id, 'fav');
      }}
      className={cn(
        'rounded p-1 transition-colors',
        active ? 'text-amber-500' : 'text-muted-foreground/30 hover:text-amber-500',
        className,
      )}
    >
      <Star className={cn('h-3.5 w-3.5', active && 'fill-amber-500')} />
    </button>
  );
}
