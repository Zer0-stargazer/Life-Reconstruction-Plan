'use client';

/**
 * 时间轴窗口的个人标记（useWindowMarks）
 *
 * 为什么另起一套，不复用 LifeWindow 的 planningStatus / completionStatus：
 * 那两个字段是**数据作者**写死的（已过的一律 unplanned/completed，
 * 当前的一律 planned/incomplete），跟"这个用户到底做过没有"没有任何关系，
 * 拿它当个人状态是假数据。
 *
 * 这里是用户自己的三态标记，存 localStorage('window-marks.v1')：
 *   doing = 已在做   done = 已完成   skip = 与我无关
 *
 * 用途：时间轴在某年龄下经常几十条堆在一起，"眼睛不知道看什么"。
 * 标记过的项从主清单里沉底并折叠，主清单只留"还没处理的"——
 * 数字会随着梳理一条条变小，这是这个页面唯一能让人有推进感的东西。
 *
 * 跨组件/跨标签页同步：模块级 store + useSyncExternalStore。
 */

import { useCallback, useSyncExternalStore } from 'react';

export type WindowMark = 'doing' | 'done' | 'skip';
export type WindowMarkMap = Record<number, WindowMark>;

export const WINDOW_MARK_META: Record<WindowMark, { label: string; short: string; desc: string }> = {
  doing: { label: '已在做', short: '在做', desc: '正在推进，不用再提醒我' },
  done: { label: '已完成', short: '完成', desc: '这件事已经过去了' },
  skip: { label: '与我无关', short: '无关', desc: '我的情况不适用，别再显示' },
};

/** 固定顺序：UI 上不要每次渲染换位置 */
export const WINDOW_MARK_ORDER: WindowMark[] = ['doing', 'done', 'skip'];

const STORAGE_KEY = 'window-marks.v1';

const EMPTY: WindowMarkMap = {};
let cache: WindowMarkMap | null = null;
const listeners = new Set<() => void>();

function read(): WindowMarkMap {
  if (cache) return cache;
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as WindowMarkMap) : null;
    cache = parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: WindowMarkMap) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* 隐私模式 / 配额满：内存里仍然生效，只是刷新后丢 */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// 多标签页同步：另一个标签页改了标记，这边跟着变
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    listeners.forEach((l) => l());
  });
}

export function useWindowMarks() {
  const marks = useSyncExternalStore(subscribe, read, () => EMPTY);

  /** mark 传 null = 清除这条的标记 */
  const setMark = useCallback((id: number, mark: WindowMark | null) => {
    const next = { ...read() };
    if (mark === null) delete next[id];
    else next[id] = mark;
    write(next);
  }, []);

  const clearAll = useCallback(() => write({}), []);

  const markedCount = Object.keys(marks).length;

  return { marks, setMark, clearAll, markedCount };
}
