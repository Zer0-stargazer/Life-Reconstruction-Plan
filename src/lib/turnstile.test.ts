import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __resetTurnstileWarnForTest, verifyTurnstile } from './turnstile';

const SECRET = 'TURNSTILE_SECRET_KEY';
const SITE = 'NEXT_PUBLIC_TURNSTILE_SITE_KEY';

beforeEach(() => {
  delete process.env[SECRET];
  delete process.env[SITE];
  __resetTurnstileWarnForTest();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
  delete process.env[SECRET];
  delete process.env[SITE];
});

const configure = () => {
  process.env[SECRET] = 'secret';
  process.env[SITE] = 'site';
};

describe('verifyTurnstile', () => {
  it('两个都未配置：跳过且只警告一次', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await verifyTurnstile(undefined, 'local')).toEqual({ ok: true, skipped: true });
    expect(await verifyTurnstile('x', '1.2.3.4')).toEqual({ ok: true, skipped: true });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('只配一半：配置错误，不发请求', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    process.env[SECRET] = 'secret';
    expect(await verifyTurnstile('tok', '1.2.3.4')).toEqual({ ok: false, reason: 'misconfigured' });
    delete process.env[SECRET];
    process.env[SITE] = 'site';
    expect(await verifyTurnstile('tok', '1.2.3.4')).toEqual({ ok: false, reason: 'misconfigured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('缺 token：直接拒绝', async () => {
    configure();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await verifyTurnstile('', '1.2.3.4')).toEqual({ ok: false, reason: 'missing_token' });
    expect(await verifyTurnstile(undefined, '1.2.3.4')).toEqual({ ok: false, reason: 'missing_token' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('校验成功：POST form 带 secret/response/remoteip', async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);
    expect(await verifyTurnstile('tok', '203.0.113.7')).toEqual({ ok: true, skipped: false });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(init.method).toBe('POST');
    const body = new URLSearchParams(init.body as string);
    expect(body.get('secret')).toBe('secret');
    expect(body.get('response')).toBe('tok');
    expect(body.get('remoteip')).toBe('203.0.113.7');
  });

  it('ip 为 local 时不传 remoteip', async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);
    await verifyTurnstile('tok', 'local');
    expect(new URLSearchParams(fetchMock.mock.calls[0][1].body as string).has('remoteip')).toBe(false);
  });

  it('校验失败：rejected', async () => {
    configure();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
    }));
    expect(await verifyTurnstile('bad', '1.2.3.4')).toEqual({ ok: false, reason: 'rejected' });
  });

  it('HTTP 非 2xx / 网络异常：network_error（fail closed）', async () => {
    configure();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
    expect(await verifyTurnstile('tok', '1.2.3.4')).toEqual({ ok: false, reason: 'network_error' });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')));
    expect(await verifyTurnstile('tok', '1.2.3.4')).toEqual({ ok: false, reason: 'network_error' });
  });

  it('超过 8 秒：timeout', async () => {
    configure();
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url: string, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => {
          const e = new Error('aborted');
          e.name = 'AbortError';
          reject(e);
        });
      })
    ));
    const p = verifyTurnstile('tok', '1.2.3.4');
    await vi.advanceTimersByTimeAsync(8000);
    expect(await p).toEqual({ ok: false, reason: 'timeout' });
  });
});
