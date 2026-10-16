import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/lib/security-headers";

// dev 端口跟随 $PORT（默认 5000），与 scripts/next-run.mjs 保持一致，
// 否则改了端口后跨源 dev 请求会被 Next 拦掉。
const devPort = process.env.PORT || "5000";

const securityHeaders = buildSecurityHeaders({ isProd: process.env.NODE_ENV === "production" });

const nextConfig: NextConfig = {
  allowedDevOrigins: [`localhost:${devPort}`, `127.0.0.1:${devPort}`],
  // 开发环境左下角的 N 徽标会压住侧栏底部内容
  devIndicators: false,
  poweredByHeader: false,
  // Node 运行方式（next start）的安全头；Workers 运行方式由 worker/index.ts 兜底，二者同源
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
