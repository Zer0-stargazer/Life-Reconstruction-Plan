import { describe, expect, it, vi } from 'vitest';

vi.mock('@/storage/database/supabase-client', () => ({ getSupabaseClient: vi.fn() }));

import type { NextRequest } from 'next/server';
import { getClientIp } from './rate-limit';

const req = (headers: Record<string, string>) =>
  ({ headers: { get: (k: string) => headers[k.toLowerCase()] ?? null } }) as unknown as NextRequest;

describe('getClientIp', () => {
  it('无 cf-connecting-ip 回退 local，且不信任 XFF / x-real-ip', () => {
    expect(getClientIp(req({}))).toBe('local');
    expect(getClientIp(req({ 'x-forwarded-for': '1.2.3.4', 'x-real-ip': '5.6.7.8' }))).toBe('local');
  });

  it('IPv4 原样返回', () => {
    expect(getClientIp(req({ 'cf-connecting-ip': '203.0.113.7' }))).toBe('203.0.113.7');
  });

  it('非法值回退 local', () => {
    for (const bad of ['999.1.1.1', 'abc', '1.2.3', '1.2.3.4; drop', 'x'.repeat(65), '1:2:3:4:5:6:7:8:9', '1::2::3', 'g::1']) {
      expect(getClientIp(req({ 'cf-connecting-ip': bad }))).toBe('local');
    }
  });

  it('IPv6 按 /64 归一化', () => {
    const a = getClientIp(req({ 'cf-connecting-ip': '2001:db8:1:2:aaaa:bbbb:cccc:dddd' }));
    const b = getClientIp(req({ 'cf-connecting-ip': '2001:0DB8:1:2::1' }));
    expect(a).toBe('2001:db8:1:2::/64');
    expect(b).toBe(a);
    expect(getClientIp(req({ 'cf-connecting-ip': '2001:db8:1:3::1' }))).not.toBe(a);
    expect(getClientIp(req({ 'cf-connecting-ip': '::1' }))).toBe('0:0:0:0::/64');
    expect(getClientIp(req({ 'cf-connecting-ip': '::ffff:1.2.3.4' }))).toBe('0:0:0:0::/64');
  });
});
