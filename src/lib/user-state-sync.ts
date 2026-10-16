'use client';

/**
 * 用户数据云同步（batch8）—— 客户端侧键管理与脏检测。
 *
 * 原则：
 * - 同步白名单：只上这些键（会话凭证、dev-token、访客防滥用计数有意排除）
 * - 脏检测：localStorage 当前值 vs 上次推送值（meta），不同即脏
 * - 合并方向：登录拉取时「本地没动过 → 云端赢；本地动过 → 本地赢（随后推送覆盖云端）」
 * - 归属（P0 防串号）：meta.__owner 记录本地数据属于哪个账号；登出清空全部同步键，
 *   登录时归属不符则丢弃本地值；访客期数据只在云端没有该键时才保留并推送，详见 mergeCloudStates
 */

import { STORAGE_KEYS } from './storage-keys';

export const SYNC_KEYS = [
  STORAGE_KEYS.defaultAge,
  STORAGE_KEYS.lifeStages,
  STORAGE_KEYS.preferenceWeights,
  STORAGE_KEYS.visitedModules,
  STORAGE_KEYS.windowMarks,
  // P1-6 修复：AI Key / 激活源不再云同步（user_state.value 明文存储，
  // 同步等于把用户自配的 API Key 明文落库；改为纯本地保留）
  // 各模块填写内容——键名统一登记到 storage-keys.ts，此处只引用常量（P0：消除裸字符串）
  STORAGE_KEYS.destinyInput,
  STORAGE_KEYS.destinyReport,
  STORAGE_KEYS.healthAnswers,
  STORAGE_KEYS.simDimensions,
  STORAGE_KEYS.simAnswers,
  STORAGE_KEYS.nameStyle,
  STORAGE_KEYS.nameGender,
  STORAGE_KEYS.nameSurname,
  STORAGE_KEYS.careerMarks,
  STORAGE_KEYS.lawsFavorites,
  STORAGE_KEYS.luckFavorites,
] as const;

export const USER_STATE_DIRTY_EVENT = 'user-state:dirty';

const META_KEY = STORAGE_KEYS.userStateSyncMeta;
/** meta 里记录「本地同步数据归属哪个账号」的保留字段（P0 防串号） */
const OWNER_FIELD = '__owner';
/**
 * meta：key -> 上次推送/拉取对齐的原始 localStorage 值（用于脏检测与合并方向判断）；
 * 另含保留字段 __owner = 数据归属的用户 id（字符串）。
 */
type Meta = Record<string, string>;

function readMeta(): Meta {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as Meta) : {};
  } catch {
    return {};
  }
}

function writeMeta(meta: Meta): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch { /* ignore */ }
}

export function getLocalRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** 本地是否有未推送的改动（有值且与上次推送不同） */
export function isDirty(key: string): boolean {
  const raw = getLocalRaw(key);
  if (raw === null) return false;
  const meta = readMeta();
  return raw !== meta[key];
}

/** raw 为 null 表示该键的「删除」已推送：从 meta 移除 */
export function markPushed(key: string, raw: string | null): void {
  const meta = readMeta();
  if (raw === null) delete meta[key];
  else meta[key] = raw;
  writeMeta(meta);
}

/** 当前本地同步数据归属的用户 id；访客/未对齐过为 null */
export function getSyncOwner(): string | null {
  return readMeta()[OWNER_FIELD] ?? null;
}

/** 本地值与上次推送一致（未动过）——合并时云端可以安全覆盖 */
export function isUntouched(key: string): boolean {
  const raw = getLocalRaw(key);
  const meta = readMeta();
  return raw !== null && raw === meta[key];
}

export function clearSyncMeta(): void {
  try {
    localStorage.removeItem(META_KEY);
  } catch { /* ignore */ }
}

/** 清掉全部同步键的本地值与 meta（登出 / 发现数据属于别的账号时用） */
export function clearSyncedLocalData(): void {
  try {
    for (const key of SYNC_KEYS) localStorage.removeItem(key);
    // default-age 的历史旧键，读取时会被迁移回主键，必须一并清
    localStorage.removeItem(STORAGE_KEYS.defaultAgeLegacy);
  } catch { /* ignore */ }
  clearSyncMeta();
}

/**
 * 收集 ownerId 名下所有脏键（登录后推送、事件防抖推送共用）。
 * raw 为 null 表示「本地已删除、云端还有」——推送删除（如「重新选年龄」）。
 * P0 修复：meta 的归属不是 ownerId（未拉取对齐 / 属于别的账号）时一律不推，
 * 杜绝把别人或访客的本地数据推到当前账号的云端。
 */
export function collectDirty(ownerId: number): { key: string; raw: string | null }[] {
  const meta = readMeta();
  if (meta[OWNER_FIELD] !== String(ownerId)) return [];
  const out: { key: string; raw: string | null }[] = [];
  for (const key of SYNC_KEYS) {
    const raw = getLocalRaw(key);
    if (raw === null) {
      if (meta[key] !== undefined) out.push({ key, raw: null });
    } else if (raw !== meta[key]) {
      out.push({ key, raw });
    }
  }
  return out;
}

/**
 * 登录拉取后的合并（纯本地副作用，便于单测）。返回是否有键被云端改写。
 *
 * 归属判定（meta.__owner）：
 * - owner 是别的账号 → 本地同步数据属于上一个账号，全部丢弃后以云端为准（P0 防串号）
 * - owner 缺失且 meta 无任何键 → 访客期数据：云端有值的键以云端为准（P0：默认值/访客值
 *   绝不覆盖真实云端数据）；云端没有的键保留本地并随后推送（新注册空账号的迁移场景）
 * - owner 缺失但 meta 有键 → 旧版本升级遗留的进行中会话，视为当前账号
 * - owner 就是当前账号 → 本地没动过/为空 → 云端赢；本地动过 → 本地赢（随后推送）；
 *   本地已删除且 meta 仍有记录（待推送的删除）→ 不让云端旧值复活
 */
export function mergeCloudStates(
  userId: number,
  states: { key: string; value: unknown }[]
): boolean {
  const me = String(userId);
  let meta = readMeta();
  if (meta[OWNER_FIELD] !== undefined && meta[OWNER_FIELD] !== me) {
    clearSyncedLocalData();
    meta = {};
  }
  const isGuestData =
    meta[OWNER_FIELD] === undefined && Object.keys(meta).length === 0;

  let appliedAny = false;
  for (const s of states) {
    if (!(SYNC_KEYS as readonly string[]).includes(s.key)) continue;
    if (s.value === null || s.value === undefined) continue;
    const cloudRaw = JSON.stringify(s.value);
    const localRaw = getLocalRaw(s.key);
    let cloudWins: boolean;
    if (isGuestData) {
      cloudWins = true;
    } else if (localRaw === null) {
      cloudWins = meta[s.key] === undefined; // 有 meta 记录却为空 = 本地删除待推送
    } else {
      cloudWins = localRaw === meta[s.key];
    }
    if (!cloudWins) continue;
    if (localRaw !== cloudRaw) {
      try { localStorage.setItem(s.key, cloudRaw); } catch { /* ignore */ }
      appliedAny = true;
    }
    meta[s.key] = cloudRaw; // 值相同也要记 meta（首次对齐基准）
  }
  meta[OWNER_FIELD] = me;
  writeMeta(meta);
  return appliedAny;
}

/** 写入点统一广播：use-persisted-state 与 window-marks 写 localStorage 后各调一次 */
export function notifyStateDirty(): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(USER_STATE_DIRTY_EVENT));
  } catch { /* ignore */ }
}

/** 供 hook 组装 Authorization 头（未登录返回空对象） */
export function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}
