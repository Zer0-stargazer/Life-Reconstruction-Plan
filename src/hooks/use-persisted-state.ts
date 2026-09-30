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
 *    把初始值先写回去、把真正存的值盖掉。
 *
 * 用法：把 `useState<T>(x)` 换成 `usePersistedState<T>('some.key.v1', x)` 即可。
 * key 建议带 `.v1` 后缀，将来结构变了升版本号自然失效，不会出现脏数据。
 */

import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';

export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  const loadedRef = useRef(false);

  // 挂载后从 localStorage 读回（放在 effect 里，首帧仍是 initialValue）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setState(JSON.parse(raw) as T);
    } catch {
      // 解析失败（脏数据/隐私模式）：忽略，保持 initialValue
    }
    loadedRef.current = true;
  }, [key]);

  // 变更时写回；读回完成前不写，避免用初始值覆盖已存的值
  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // 隐私模式 / 配额满：内存里仍然生效，只是刷新后丢
    }
  }, [key, state]);

  return [state, setState];
}
