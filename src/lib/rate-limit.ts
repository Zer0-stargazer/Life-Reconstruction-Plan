import type { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * 限流（固定窗口），计数存在 Supabase 的 rate_limits 表，
 * 由 Postgres 函数 hit_rate_limit() 原子更新，多实例 / Serverless 下共享。
 *
 * 数据库不可用时：开发环境放行并警告；生产环境拒绝（fail closed）。
 */

const IPV4_RE = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

/** 解析 IPv6 为 8 个 16 位组；非法返回 null。支持 :: 压缩与尾部内嵌 IPv4。 */
function parseIpv6(raw: string): number[] | null {
  let s = raw;
  const lastColon = s.lastIndexOf(':');
  if (s.includes('.')) {
    const v4 = s.slice(lastColon + 1);
    if (!IPV4_RE.test(v4)) return null;
    const p = v4.split('.').map(Number);
    s = `${s.slice(0, lastColon + 1)}${((p[0] << 8) | p[1]).toString(16)}:${((p[2] << 8) | p[3]).toString(16)}`;
  }
  const halves = s.split('::');
  if (halves.length > 2) return null;
  const parse = (part: string): number[] | null => {
    if (part === '') return [];
    const groups = part.split(':');
    const out: number[] = [];
    for (const g of groups) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
      out.push(parseInt(g, 16));
    }
    return out;
  };
  const head = parse(halves[0]);
  if (!head) return null;
  if (halves.length === 1) return head.length === 8 ? head : null;
  const tail = parse(halves[1]);
  if (!tail) return null;
  const missing = 8 - head.length - tail.length;
  if (missing < 1) return null;
  return [...head, ...new Array<number>(missing).fill(0), ...tail];
}

/**
 * 校验并归一化 IP 字符串（导出仅为便于测试）。
 * 非法返回 null；IPv4 原样返回；IPv6 取前 64 位，输出 `xxxx:xxxx:xxxx:xxxx::/64`。
 */
export function normalizeIpForLimit(raw: string): string | null {
  const v = raw.trim();
  if (!v || v.length > 64 || !/^[0-9a-fA-F:.]+$/.test(v)) return null;
  if (!v.includes(':')) return IPV4_RE.test(v) ? v : null;
  const groups = parseIpv6(v);
  if (!groups) return null;
  return `${groups.slice(0, 4).map((g) => g.toString(16)).join(':')}::/64`;
}

/**
 * 客户端标识（用于限流维度）。
 *
 * 生产跑在 Cloudflare Workers：边缘会无条件覆盖 `cf-connecting-ip`，
 * 客户端无法伪造，因此只信任这个头。X-Forwarded-For / X-Real-IP 等头可被客户端
 * 任意构造，一旦用于限流 key 攻击者换头即可绕过所有限流，故一律不读取。
 * 没有该头（本地 `pnpm dev` / 非 CF 环境）回退 'local'。
 *
 * 取到的值做字符集 / 长度 / 格式校验，非法回退 'local'；
 * IPv6 按 /64 前缀归一化（单个用户通常持有整个 /64，轮换末 64 位即可绕过逐地址限流）。
 * 注意：返回值同时会被写入审计字段 ip_address，IPv6 因而只保留 /64 前缀。
 */
export function getClientIp(request: NextRequest): string {
  const raw = request.headers.get('cf-connecting-ip');
  if (!raw) return 'local';
  return normalizeIpForLimit(raw) ?? 'local';
}

export interface RateLimitResult {
  ok: boolean;
  /** 建议的 Retry-After（秒），放行时为 0 */
  retryAfter: number;
}

/**
 * @param key      限流维度（建议 `${route}:${ip}`）
 * @param limit    窗口内最大请求数
 * @param windowMs 窗口长度（毫秒）
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    const { data, error } = await getSupabaseClient().rpc('hit_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) throw new Error(error.message);
    return data === true ? { ok: true, retryAfter: 0 } : { ok: false, retryAfter: windowSeconds };
  } catch (err) {
    console.error('限流检查失败:', err instanceof Error ? err.message : err);
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, retryAfter: 30 };
    }
    console.warn('开发环境：限流不可用，已放行');
    return { ok: true, retryAfter: 0 };
  }
}
