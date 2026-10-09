import type { NextConfig } from "next";

// dev 端口跟随 $PORT（默认 5000），与 scripts/next-run.mjs 保持一致，
// 否则改了端口后跨源 dev 请求会被 Next 拦掉。
const devPort = process.env.PORT || "5000";

const nextConfig: NextConfig = {
  allowedDevOrigins: [`localhost:${devPort}`, `127.0.0.1:${devPort}`],
  // 开发环境左下角的 N 徽标会压住侧栏底部内容
  devIndicators: false,
};

export default nextConfig;