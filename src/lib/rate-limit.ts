import type { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * 限流（固定窗口），计数存在 Supabase 的 rate_limits 表，
 * 由 Postgres 函数 hit_rate_limit() 原子更新，多实例 / Serverless 下共享。
 *
 * 数据库不可用时：开发环境放行并警告；生产环境拒绝（fail closed）。
 */

/** 从常见代理头里取客户端 IP */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
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
