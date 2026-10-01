/**
 * 全局默认年龄（localStorage 键 default-age）的唯一读写入口。
 *
 * 背景：/me、/user、/windows、首页图表各自手写读写，曾出现两种编码
 * （JSON.stringify 的 `"40"` 与裸字符串 `40`）和两套默认值（25/28）——
 * parseInt 读到带引号的值得 NaN，年龄跨页同步因此静默失效。
 *
 * 约定：写入一律裸数字字符串；读取兼容两种历史格式；默认值全站唯一。
 */

export const DEFAULT_AGE = 28;
export const DEFAULT_AGE_KEY = 'default-age';
/** /me 最早用的键，只作读取迁移，不再写入 */
const LEGACY_AGE_KEY = 'me-age';

/** 兼容历史 JSON 编码（"40"）与裸字符串（40） */
function parseAgeValue(raw: string): number | null {
  const s = raw.trim().replace(/^"(.*)"$/, '$1');
  const n = Number.parseInt(s, 10);
  if (Number.isNaN(n) || n < 0 || n > 100) return null;
  return n;
}

/** 读取全局默认年龄；发现旧键 me-age 时迁移到主键 */
export function readDefaultAge(): number {
  if (typeof window === 'undefined') return DEFAULT_AGE;
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
  return DEFAULT_AGE;
}

export function writeDefaultAge(age: number): void {
  try { localStorage.setItem(DEFAULT_AGE_KEY, String(age)); } catch { /* ignore */ }
}
