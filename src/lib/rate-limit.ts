import type { NextRequest } from 'next/server';

/**
 * 轻量内存限流（滑动窗口）。
 *
 * 说明：进程内实现，多实例 / Serverless 冷启动下不共享计数，
 * 属于「防止单个 IP 把额度打爆」的兜底，不是精确配额。
 * 若将来部署到多实例，把 store 换成 Redis / Upstash 即可，调用方不用改。
 */

type Bucket = { hits: number[] };

const store = new Map<string, Bucket>();

/** 兜底清理，避免长驻进程下 Map 无限增长 */
let lastSweep = 0;
function sweep(now: number, windowMs: number) {
  if (now - lastSweep < windowMs) return;
  lastSweep = now;
  for (const [key, bucket] of store) {
    bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
    if (bucket.hits.length === 0) store.delete(key);
  }
}

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
  /** 窗口内剩余可用次数 */
  remaining: number;
  /** 建议的 Retry-After（秒） */
  retryAfter: number;
}

/**
 * @param key      限流维度（建议 `${route}:${ip}`）
 * @param limit    窗口内最大请求数
 * @param windowMs 窗口长度（毫秒）
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now, windowMs);

  const bucket = store.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    store.set(key, bucket);
    return { ok: false, remaining: 0, retryAfter };
  }

  bucket.hits.push(now);
  store.set(key, bucket);
  return { ok: true, remaining: limit - bucket.hits.length, retryAfter: 0 };
}
