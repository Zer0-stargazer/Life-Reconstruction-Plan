'use client';

/**
 * useModuleMarks —— 通用「个人标记」store（window-marks 模式的泛型化）。
 *
 * 给 career-marks.v1（职业三态）、laws/luck-favorites.v1（收藏）这类
 * "用户对某条数据的个人表态"共用。window-marks.v1 因为有自己的语义
 * 与组件（WindowMarkBar），保持独立实现不动；新模块一律走这里。
 *
 * 为什么值是 string 而不是联合类型：不同模块的标记语义不同
 * （职业 want/doing/done，收藏 fav），store 层不做语义判断，
 * 由各页面自己收敛合法值。
 *
 * 跨组件/跨标签页同步：每个 storageKey 一套独立 cache + listeners，
 * storage 事件按 key 分发；写入后 notifyStateDirty() 接入云同步。
 */

import { useCallback, useSyncExternalStore } from 'react';
import { notifyStateDirty } from '@/lib/user-state-sync';

export type ModuleMarkMap = Record<string, string>;

interface MarkStore {
  cache: ModuleMarkMap | null;
  listeners: Set<() => void>;
}

const stores = new Map<string, MarkStore>();
const EMPTY: ModuleMarkMap = {};

function getStore(key: string): MarkStore {
  let store = stores.get(key);
  if (!store) {
    store = { cache: null, listeners: new Set() };
    stores.set(key, store);
  }
  return store;
}

function read(store: MarkStore, key: string): ModuleMarkMap {
  if (store.cache) return store.cache;
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as ModuleMarkMap) : null;
    store.cache = parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    store.cache = {};
  }
  return store.cache;
}

function write(store: MarkStore, key: string, next: ModuleMarkMap) {
  store.cache = next;
  try {
    localStorage.setItem(key, JSON.stringify(next));
    notifyStateDirty(); // 登录用户的数据云同步（batch8）：写入点统一广播
  } catch {
    /* 隐私模式 / 配额满：内存里仍然生效，只是刷新后丢 */
  }
  store.listeners.forEach((l) => l());
}

// 多标签页同步：另一个标签页改了标记，这边跟着变（按 key 分发）
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (!e.key) return;
    const store = stores.get(e.key);
    if (!store) return;
    store.cache = null;
    store.listeners.forEach((l) => l());
  });
}

export function useModuleMarks(storageKey: string) {
  const store = getStore(storageKey);

  const marks = useSyncExternalStore(
    (listener) => {
      store.listeners.add(listener);
      return () => store.listeners.delete(listener);
    },
    () => read(store, storageKey),
    () => EMPTY,
  );

  /** mark 传 null = 清除这条的标记 */
  const setMark = useCallback((id: number | string, mark: string | null) => {
    const current = read(store, storageKey);
    const k = String(id);
    if (current[k] === (mark ?? undefined)) return; // 无变化不写
    const next = { ...current };
    if (mark === null) delete next[k];
    else next[k] = mark;
    write(store, storageKey, next);
  }, [storageKey, store]);

  /** 切换：同值再点 = 取消（收藏场景最常用） */
  const toggleMark = useCallback((id: number | string, mark: string) => {
    const current = read(store, storageKey);
    const k = String(id);
    setMark(k, current[k] === mark ? null : mark);
  }, [storageKey, store, setMark]);

  const clearAll = useCallback(() => write(store, storageKey, {}), [storageKey, store]);

  const markedCount = Object.keys(marks).length;

  return { marks, setMark, toggleMark, clearAll, markedCount };
}
