'use client';

/**
 * useUserStateSync —— 登录用户的 localStorage ↔ 云端双向同步（挂 root layout，全局一份）。
 *
 * 时序：
 * 1. 登录（user.id 变化）→ GET /api/user/state 拉云端 → 合并进本地（规则见
 *    lib/user-state-sync.ts 的 mergeCloudStates：归属校验 + 云端优先 + 访客数据仅迁移云端没有的键）
 *    有键被云端改写 / 本页换过账号 → 刷新一次页面（让已挂载模块读到新值；
 *    sessionStorage 守卫防止循环刷新，登出时清除守卫）；登出本身也刷新以丢弃内存旧值
 * 2. 运行期：任何写入点（use-persisted-state / window-marks）广播 dirty 事件
 *    → 防抖 3s 推送脏键；另有 30s 兜底对账 + beforeunload 尽力推送
 * 3. 冲突策略 last-write-wins：服务端只接受 updatedAt 更新的覆盖
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  collectDirty,
  mergeCloudStates,
  markPushed,
  authHeaders,
  USER_STATE_DIRTY_EVENT,
} from '@/lib/user-state-sync';
import { STORAGE_KEYS, SESSION_KEYS } from '@/lib/storage-keys';
import { useAuth } from '@/contexts/auth-context';

const PUSH_DEBOUNCE_MS = 3_000;
const SWEEP_INTERVAL_MS = 30_000;
const reloadGuardKey = (userId: number) => `${SESSION_KEYS.userStateReloadedPrefix}${userId}`;

export function useUserStateSync(): void {
  const { user, handleSessionExpired } = useAuth();
  const userId = user?.id ?? null;
  const pulledUserIdRef = useRef<number | null>(null);
  const userIdRef = useRef<number | null>(null);
  /** 本页生命周期内最近一次登录的用户 id（用于识别登出 / 直接换号） */
  const lastSeenUserIdRef = useRef<number | null>(null);
  const pushTimerRef = useRef<number | null>(null);
  const busyRef = useRef(false);

  // ---- 拉取 + 合并（每个用户一次；失败会复位，由 30s 对账重试） ----
  const pull = useCallback(async (uid: number, sessionSwitched: boolean) => {
    pulledUserIdRef.current = uid;
    try {
      const res = await fetch('/api/user/state', { headers: authHeaders() });
      if (res.status === 401) { pulledUserIdRef.current = null; handleSessionExpired(); return; }
      if (!res.ok) { pulledUserIdRef.current = null; return; }
      const data = await res.json();
      if (!data.success || !Array.isArray(data.states)) { pulledUserIdRef.current = null; return; }
      // 拉取期间用户已变（登出/换号）：本次结果作废，不得写进新会话
      if (userIdRef.current !== uid) return;

      // 合并规则（归属 / 云端优先 / 访客迁移）全部在 mergeCloudStates，见其注释
      const appliedAny = mergeCloudStates(
        uid,
        data.states as { key: string; value: unknown }[]
      );

      // 有键被云端改写，或本页内换过账号（内存里的 store 还是上一个账号的值，
      // 之后任何写入都会把旧值写回）→ 刷新一次让所有 store 重读
      if (appliedAny || sessionSwitched) {
        const guardKey = reloadGuardKey(uid);
        let alreadyReloaded = false;
        try { alreadyReloaded = sessionStorage.getItem(guardKey) === '1'; } catch { /* ignore */ }
        if (!alreadyReloaded) {
          try { sessionStorage.setItem(guardKey, '1'); } catch { /* ignore */ }
          window.location.reload();
        }
      }
    } catch {
      /* 网络失败：本次退化为纯本地（归属未对齐时不会推送），30s 对账重试 */
      pulledUserIdRef.current = null;
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    userIdRef.current = userId;
    const last = lastSeenUserIdRef.current;
    if (userId === null) {
      pulledUserIdRef.current = null;
      if (last !== null) {
        // P0 修复（reload 守卫每会话一次）：登出后清掉该用户的守卫，同标签页再次登录
        // 才能再触发刷新；并立即刷新，丢弃内存里上一个账号的 store 值（localStorage
        // 已在 logout 时清空），否则它们会在下一账号名下被写回
        lastSeenUserIdRef.current = null;
        try { sessionStorage.removeItem(reloadGuardKey(last)); } catch { /* ignore */ }
        window.location.reload();
      }
      return;
    }
    const switched = last !== null && last !== userId;
    if (switched) {
      try { sessionStorage.removeItem(reloadGuardKey(userId)); } catch { /* ignore */ }
    }
    lastSeenUserIdRef.current = userId;
    if (pulledUserIdRef.current === userId) return;
    void pull(userId, switched);
  }, [userId, pull]);

  // ---- 推送 ----
  const doPush = useCallback(async () => {
    if (busyRef.current) return;
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    if (!token) return; // 未登录不推
    const uid = userIdRef.current;
    if (uid === null) return;
    const dirty = collectDirty(uid); // 归属不是当前账号（未对齐）时为空
    if (dirty.length === 0) return;

    busyRef.current = true;
    try {
      // 单键解析容错（2026-10-13 修复）：localStorage 中被写成 "null" 或非法 JSON 的键
      // 标记为已处理后跳过，不上报也不拖垮整批（此前单键异常会让整批推送永远失败）
      const states: { key: string; value: unknown; updatedAt: string; deleted?: boolean }[] = [];
      for (const { key, raw } of dirty) {
        if (raw === null) {
          // 本地已删除（如重新选年龄）→ 推送删除，避免下次登录云端旧值复活
          states.push({ key, value: null, updatedAt: new Date().toISOString(), deleted: true });
          continue;
        }
        let parsed: unknown;
        try { parsed = JSON.parse(raw); } catch { markPushed(key, raw); continue; }
        if (parsed === null || parsed === undefined) { markPushed(key, raw); continue; }
        states.push({ key, value: parsed, updatedAt: new Date().toISOString() });
      }
      if (states.length === 0) return; // 本次无可推内容
      const res = await fetch('/api/user/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ states }),
        keepalive: true, // P2：beforeunload 触发时页面卸载后请求仍能发出
      });
      if (res.status === 401) {
        handleSessionExpired();
      } else if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // P1 修复（丢更新链）：服务端回传 accepted/rejected 明细。
          // rejected（云端较新/超限/非法）也记 meta——云端已明确拒收，反复重推只会
          // 重复被打回；用户下次本地改动会重新置脏正常推送。stale 说明云端有另一台
          // 设备更新的值，本地旧值保留到下次改动。
          const accepted = new Set<string>(
            Array.isArray(data.accepted) ? (data.accepted as string[]) : dirty.map(d => d.key)
          );
          for (const { key, raw } of dirty) {
            if (!accepted.has(key)) {
              console.warn(`[state-sync] 服务端拒收键 ${key}，本次标记已同步（待下次改动重推）`);
            }
            markPushed(key, raw);
          }
        }
      }
      // 失败静默：下次 dirty 事件/对账再试
    } catch { /* ignore */ } finally {
      busyRef.current = false;
    }
  }, [handleSessionExpired]);

  const schedulePush = useCallback(() => {
    if (pushTimerRef.current !== null) window.clearTimeout(pushTimerRef.current);
    pushTimerRef.current = window.setTimeout(() => {
      pushTimerRef.current = null;
      void doPush();
    }, PUSH_DEBOUNCE_MS);
  }, [doPush]);

  useEffect(() => {
    if (userId === null) return;
    const onDirty = () => schedulePush();
    const onSweep = () => {
      // 拉取失败过：重试（归属未对齐前不会推送，必须先拉取）
      if (pulledUserIdRef.current === null) void pull(userId, false);
      // 兜底对账：事件丢失（其他标签页改动等）也能追上
      if (collectDirty(userId).length > 0) schedulePush();
    };
    const onUnload = () => { void doPush(); };
    window.addEventListener(USER_STATE_DIRTY_EVENT, onDirty);
    window.addEventListener('storage', onSweep);
    const sweep = window.setInterval(onSweep, SWEEP_INTERVAL_MS);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener(USER_STATE_DIRTY_EVENT, onDirty);
      window.removeEventListener('storage', onSweep);
      window.clearInterval(sweep);
      window.removeEventListener('beforeunload', onUnload);
      if (pushTimerRef.current !== null) window.clearTimeout(pushTimerRef.current);
    };
  }, [userId, schedulePush, doPush, pull]);
}
