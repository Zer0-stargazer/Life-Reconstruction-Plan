'use client';

/**
 * usePersistedState —— 行为与 useState 完全一致，但值会持久化到 localStorage。
 *
 * 解决什么问题：/simulation、/destiny、/name 的表单输入全部存在 useState 里，
 * 用户填了一半刷新页面就全没了——这是"状态丢失"最直接的来源。
 * 把 useState 换成这个 hook，刷新后自动恢复，不用改任何其他逻辑。
 *
 * 两个实现要点：
 * 1. 首帧渲染用 initialValue（SSR 与客户端首帧一致，避免水合不匹配），
 *    挂载后才从 localStorage 读回覆盖。
 * 2. 写入前先用 loadedRef 确认"已经从存储读过了"，否则会在读回之前
 *    把初始值先写回去、把真正存的值盖掉；且只在用户真正 setState 后才写（不回写默认值）。
 *
 * 用法：把 `useState<T>(x)` 换成 `usePersistedState<T>('some.key.v1', x)` 即可。
 * key 建议带 `.v1` 后缀，将来结构变了升版本号自然失效，不会出现脏数据。
 */

import { useState, useEffect, useRef, useCallback, type Dispatch, type SetStateAction } from 'react';
import { notifyStateDirty } from '@/lib/user-state-sync';

export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T),
  // P1 修复（脏数据白屏）：可选形状校验器——localStorage 里的旧数据结构损坏时
  // 回退到 initialValue，而不是把坏结构喂给渲染层（如 sim.dimensions 期望数组却读到对象）
  validate?: (value: unknown) => boolean
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setRawState] = useState<T>(initialValue);
  const loadedRef = useRef(false);
  // P0 修复（默认值覆盖云端）：只有用户真正调用 setState 后才允许写 localStorage。
  // 此前挂载后无条件把 initialValue 写回——访客只看到 LoginGate 时 hook 也在跑，
  // 默认值落盘后登录被判"本地动过"，反向推送覆盖云端真实数据
  const userChangedRef = useRef(false);
  const setState = useCallback<Dispatch<SetStateAction<T>>>((v) => {
    userChangedRef.current = true;
    setRawState(v);
  }, []);

  // 挂载后从 localStorage 读回（放在 effect 里，首帧仍是 initialValue）
  useEffect(() => {
    userChangedRef.current = false;
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (!validate || validate(parsed)) setRawState(parsed as T);
      }
    } catch {
      // 解析失败（脏数据/隐私模式）：忽略，保持 initialValue
    }
    loadedRef.current = true;
  }, [key, validate]);

  // 变更时写回；读回完成前不写，避免用初始值覆盖已存的值
  useEffect(() => {
    if (!loadedRef.current || !userChangedRef.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
      notifyStateDirty(); // 登录用户的数据云同步（batch8）：写入点统一广播
    } catch {
      // 隐私模式 / 配额满：内存里仍然生效，只是刷新后丢
    }
  }, [key, state]);

  return [state, setState];
}
