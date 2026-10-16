/**
 * 全局默认年龄（localStorage 键 default-age）的唯一读写入口。
 *
 * 背景：/me、/user、/windows、首页图表各自手写读写，曾出现两种编码
 * （JSON.stringify 的 `"40"` 与裸字符串 `40`）和两套默认值（25/28）——
 * parseInt 读到带引号的值得 NaN，年龄跨页同步因此静默失效。
 *
 * 约定：写入一律裸数字字符串；读取兼容两种历史格式；
 * 没有默认年龄——未设置时返回 null，由调用方展示询问或空状态，绝不替用户假设年龄。
 */

import { STORAGE_KEYS } from './storage-keys';
import { notifyStateDirty } from './user-state-sync';

/** 兼容旧引用导出；新代码一律走 STORAGE_KEYS */
export const DEFAULT_AGE_KEY = STORAGE_KEYS.defaultAge;
/** /me 最早用的键，只作读取迁移，不再写入 */
const LEGACY_AGE_KEY = STORAGE_KEYS.defaultAgeLegacy;

/** 全局年龄合法区间（闭区间）；所有年龄输入统一用它，避免各页上限不一致 */
export const AGE_MIN = 0;
export const AGE_MAX = 100;

/**
 * 严格解析年龄文本：仅接受 0-100 的纯整数（可带历史 JSON 引号 "40"）；
 * 非法（空、小数、带字母、越界）返回 null。注意 0 是合法年龄，调用方必须用 `=== null` 判空。
 */
export function parseAgeInput(raw: string): number | null {
  const s = raw.trim().replace(/^"(.*)"$/, '$1').trim();
  if (!/^\d{1,3}$/.test(s)) return null;
  const n = Number.parseInt(s, 10);
  return n >= AGE_MIN && n <= AGE_MAX ? n : null;
}

/** 兼容历史 JSON 编码（"40"）与裸字符串（40） */
const parseAgeValue = parseAgeInput;

/** 读取全局年龄；未设置时返回 null；发现旧键 me-age 时迁移到主键 */
export function readDefaultAge(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const primary = localStorage.getItem(DEFAULT_AGE_KEY);
    if (primary !== null) {
      const v = parseAgeValue(primary);
      if (v !== null) return v;
    }
    const legacy = localStorage.getItem(LEGACY_AGE_KEY);
    if (legacy) {
      const v = parseAgeValue(legacy);
      if (v !== null) {
        localStorage.setItem(DEFAULT_AGE_KEY, String(v));
        return v;
      }
    }
  } catch { /* ignore */ }
  return null;
}

/** 清除全局年龄（用于「重新选年龄」：回到序章重新问一次） */
export function clearDefaultAge(): void {
  try {
    localStorage.removeItem(DEFAULT_AGE_KEY);
    localStorage.removeItem(LEGACY_AGE_KEY);
    notifyStateDirty(); // 删除也进云同步，避免下次登录又被旧值拉回来
  } catch { /* ignore */ }
}

export function writeDefaultAge(age: number): void {
  try {
    localStorage.setItem(DEFAULT_AGE_KEY, String(age));
    notifyStateDirty(); // P1 修复：此前漏广播，登录用户的年龄改动不进云同步
  } catch { /* ignore */ }
}
