import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/storage/database/supabase-client', () => ({ getSupabaseClient: vi.fn() }));

import { getSessionSecret, signSession, verifySession } from './session';

const GOOD = 'a'.repeat(48);
const DEV_KEY = Symbol.for('lrs.dev-session-secret');
const payload = { userId: 1, nickname: 'n', role: 'normal', ver: 0 };

function resetDevSecret() {
  delete (globalThis as unknown as Record<symbol, unknown>)[DEV_KEY];
}

describe('会话密钥策略', () => {
  beforeEach(() => {
    vi.stubEnv('SESSION_SECRET', '');
    resetDevSecret();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    resetDevSecret();
  });

  it('生产环境：缺失 / 过短直接抛错，不签发', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => getSessionSecret()).toThrow();
    vi.stubEnv('SESSION_SECRET', 'x'.repeat(31));
    expect(() => getSessionSecret()).toThrow();
    expect(() => signSession(payload)).toThrow();
  });

  it('生产环境：缺失时校验返回 null 而不是放行', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(verifySession('abc.def')).toBeNull();
  });

  it('生产环境：>=32 字符可正常签发与校验', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('SESSION_SECRET', GOOD);
    expect(getSessionSecret()).toBe(GOOD);
    const token = signSession(payload);
    expect(verifySession(token)?.userId).toBe(1);
  });

  it('开发环境：缺失时告警并用随机临时密钥，进程内稳定、非硬编码', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const a = getSessionSecret();
    const b = getSessionSecret();
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(32);
    expect(a).not.toBe('lrs-dev-insecure-session-secret');
    expect(console.warn).toHaveBeenCalledTimes(1);

    // 模拟「重启进程」：临时密钥重新生成
    resetDevSecret();
    expect(getSessionSecret()).not.toBe(a);
  });

  it('开发环境：过短（<32）同样视为未配置', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('SESSION_SECRET', 'short');
    expect(getSessionSecret()).not.toBe('short');
  });

  it('开发环境：配置了 >=32 字符则使用配置值且不告警', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('SESSION_SECRET', GOOD);
    expect(getSessionSecret()).toBe(GOOD);
    expect(console.warn).not.toHaveBeenCalled();
  });
});
