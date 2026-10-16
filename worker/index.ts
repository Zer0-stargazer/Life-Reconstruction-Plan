/**
 * Cloudflare Worker 入口包装：给 vinext 产出的**所有**响应补上安全响应头。
 *
 * 为什么需要：next.config.ts 的 headers() vinext 虽然支持，但实测首页 `/`（预渲染/缓存命中路径）
 * 的响应没有带上这些头；在入口统一兜底最稳。头的内容与 next.config.ts 保持一致
 * （单一来源：src/lib/security-headers.ts）。已有同名头时不覆盖。
 */
import handler from "vinext/server/fetch-handler";
import { buildSecurityHeaders } from "../src/lib/security-headers";

export * from "vinext/server/fetch-handler";

const SECURITY_HEADERS = buildSecurityHeaders({ isProd: true });

type FetchHandler = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

function withSecurityHeaders(response: Response): Response {
  // WebSocket 升级等特殊响应的 headers 不可改，原样返回
  if (response.status === 101) return response;
  let res = response;
  try {
    for (const { key, value } of SECURITY_HEADERS) {
      if (!res.headers.has(key)) res.headers.set(key, value);
    }
    return res;
  } catch {
    // headers 不可变（如 fetch 回来的 Response）：复制一份再设置
    res = new Response(response.body, response);
    for (const { key, value } of SECURITY_HEADERS) {
      if (!res.headers.has(key)) res.headers.set(key, value);
    }
    return res;
  }
}

const inner = handler as unknown as FetchHandler;

export default {
  ...(inner as object),
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    return withSecurityHeaders(await inner.fetch(request, env, ctx));
  },
};
