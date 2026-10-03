'use client';

/**
 * 解锁引导弹窗的全局开关（模块级 store + useSyncExternalStore，
 * 同 use-window-marks 模式）——任何页面的锁定动作都能直接唤起，
 * 不需要逐层传 props；弹窗本体挂在 root layout，全站一个实例。
 */

let open = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const unlockStore = {
  show() {
    open = true;
    emit();
  },
  hide() {
    open = false;
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getOpen() {
    return open;
  },
};
