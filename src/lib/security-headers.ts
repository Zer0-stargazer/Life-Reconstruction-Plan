/**
 * 安全响应头唯一真源：next.config.ts（Node / next start）与 worker/index.ts（Cloudflare Workers）共用。
 * 纯函数、无副作用、不依赖 server-only，可被 next.config.ts 直接 import。
 *
 * - script-src 需要 'unsafe-inline'：Next/vinext 的 RSC 流式注入内联脚本，没有 nonce 方案前无法去掉
 * - 浏览器只请求同源 /api/*；用户自定义 AI 源（BYOK）由服务端 /api/ai/* 转发（src/lib/ai-stream.ts
 *   仅被 api/ai/analyze 引用），所以 connect-src 'self' 不会挡住它
 * - Turnstile 需要 challenges.cloudflare.com 的脚本与 iframe
 * - 开发环境额外放行 'unsafe-eval'（React 调试）与 ws:（HMR）
 */
export interface HeaderEntry {
  key: string;
  value: string;
}

export function buildSecurityHeaders({ isProd }: { isProd: boolean }): HeaderEntry[] {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isProd ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${isProd ? "" : " ws: wss:"}`,
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ...(isProd
      ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
      : []),
  ];
}
