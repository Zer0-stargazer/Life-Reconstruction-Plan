import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearSyncedLocalData,
  collectDirty,
  markPushed,
  mergeCloudStates,
  getSyncOwner,
} from './user-state-sync';
import { STORAGE_KEYS } from './storage-keys';

// 简易 localStorage mock（测试环境为 node）
class MemStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}

const AGE = STORAGE_KEYS.defaultAge;
const MARKS = STORAGE_KEYS.careerMarks;
const ls = () => globalThis.localStorage;

beforeEach(() => {
  (globalThis as unknown as { localStorage: MemStorage }).localStorage = new MemStorage();
});

const cloud = (obj: Record<string, unknown>) =>
  Object.entries(obj).map(([key, value]) => ({ key, value }));

describe('云同步合并：账号归属与云端优先', () => {
  it('① A 登出 B 登录：A 的本地数据不会串到 B，也不会被推送', () => {
    // A 登录并产生数据，已对齐云端
    mergeCloudStates(1, cloud({ [AGE]: '30' }));
    ls().setItem(MARKS, '{"a":1}'); // A 本会话的新改动
    expect(collectDirty(1).map(d => d.key)).toEqual([MARKS]);

    // 登出：清空全部同步键与 meta
    clearSyncedLocalData();
    expect(ls().getItem(AGE)).toBeNull();
    expect(ls().getItem(MARKS)).toBeNull();
    expect(getSyncOwner()).toBeNull();

    // B 登录，云端有自己的数据
    const applied = mergeCloudStates(2, cloud({ [AGE]: '50' }));
    expect(applied).toBe(true);
    expect(ls().getItem(AGE)).toBe('"50"');
    expect(ls().getItem(MARKS)).toBeNull();
    expect(collectDirty(2)).toEqual([]);
  });

  it('① 兜底：登出清理失败（owner 仍是 A）时 B 登录丢弃 A 的本地值', () => {
    mergeCloudStates(1, cloud({}));
    ls().setItem(MARKS, '{"a":1}'); // A 的脏数据残留
    const applied = mergeCloudStates(2, cloud({ [AGE]: 50 }));
    expect(applied).toBe(true);
    expect(ls().getItem(MARKS)).toBeNull();
    expect(collectDirty(2)).toEqual([]);
    expect(getSyncOwner()).toBe('2');
  });

  it('归属未对齐（拉取未完成/属于别人）时不推送任何东西', () => {
    ls().setItem(MARKS, '{"x":1}');
    expect(collectDirty(2)).toEqual([]);
    mergeCloudStates(1, cloud({}));
    expect(collectDirty(2)).toEqual([]);
  });

  it('② 新设备登录：本地为空，云端赢且不产生脏键', () => {
    const applied = mergeCloudStates(7, cloud({ [AGE]: 33, [MARKS]: { k: 1 } }));
    expect(applied).toBe(true);
    expect(ls().getItem(AGE)).toBe('33');
    expect(ls().getItem(MARKS)).toBe('{"k":1}');
    expect(collectDirty(7)).toEqual([]);
  });

  it('② 访客期落盘的默认值不会覆盖已有云端数据（P0-B）', () => {
    ls().setItem(AGE, '"25"'); // 访客默认值
    ls().setItem(MARKS, '{}'); // 访客默认值
    mergeCloudStates(7, cloud({ [AGE]: 33, [MARKS]: { k: 1 } }));
    expect(ls().getItem(AGE)).toBe('33');
    expect(ls().getItem(MARKS)).toBe('{"k":1}');
    expect(collectDirty(7)).toEqual([]);
  });

  it('同账号本会话真实改动（脏）：本地赢并进入推送队列', () => {
    mergeCloudStates(7, cloud({ [MARKS]: { k: 1 } }));
    ls().setItem(MARKS, '{"k":2}');
    // 再次拉取（如重试）不应覆盖本地改动
    const applied = mergeCloudStates(7, cloud({ [MARKS]: { k: 1 } }));
    expect(applied).toBe(false);
    expect(ls().getItem(MARKS)).toBe('{"k":2}');
    expect(collectDirty(7)).toEqual([{ key: MARKS, raw: '{"k":2}' }]);
  });

  it('③ 访客数据登录新注册的空账号：保留并推送', () => {
    ls().setItem(AGE, '28');
    ls().setItem(MARKS, '{"g":1}');
    const applied = mergeCloudStates(9, cloud({}));
    expect(applied).toBe(false);
    expect(ls().getItem(AGE)).toBe('28');
    expect(collectDirty(9).map(d => d.key).sort()).toEqual([AGE, MARKS].sort());
  });

  it('③ 访客数据 + 云端只有部分键：有的以云端为准，没有的保留推送', () => {
    ls().setItem(AGE, '28');
    ls().setItem(MARKS, '{"g":1}');
    mergeCloudStates(9, cloud({ [AGE]: 40 }));
    expect(ls().getItem(AGE)).toBe('40');
    expect(ls().getItem(MARKS)).toBe('{"g":1}');
    expect(collectDirty(9)).toEqual([{ key: MARKS, raw: '{"g":1}' }]);
  });

  it('④ 删除键能推送：本地删除后 collectDirty 返回 raw=null，推送成功后清掉 meta', () => {
    mergeCloudStates(5, cloud({ [AGE]: 30 }));
    expect(collectDirty(5)).toEqual([]);
    ls().removeItem(AGE); // 重新选年龄
    expect(collectDirty(5)).toEqual([{ key: AGE, raw: null }]);
    markPushed(AGE, null); // 服务端确认删除
    expect(collectDirty(5)).toEqual([]);
  });

  it('④ 本地待推送的删除不会被云端旧值复活', () => {
    mergeCloudStates(5, cloud({ [AGE]: 30 }));
    ls().removeItem(AGE);
    const applied = mergeCloudStates(5, cloud({ [AGE]: 30 }));
    expect(applied).toBe(false);
    expect(ls().getItem(AGE)).toBeNull();
    expect(collectDirty(5)).toEqual([{ key: AGE, raw: null }]);
  });

  it('访客从未同步过的键本地缺失，不会被误判为删除', () => {
    mergeCloudStates(5, cloud({}));
    expect(collectDirty(5)).toEqual([]);
  });
});
