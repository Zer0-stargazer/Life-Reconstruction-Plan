import { MetadataRoute } from 'next';

// 与 auth-context.tsx 的 LOGIN_REQUIRED_MODULES 保持一致。
// 不直接 import：auth-context 是 'use client' 模块，服务端文件拿到的是客户端引用代理而非真实数组。
const LOGIN_REQUIRED_PATHS = ['/me', '/windows', '/career', '/laws', '/luck', '/name', '/destiny', '/simulation', '/health', '/journey'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 需登录板块（访客只看到登录门，无可索引内容）与 LOGIN_REQUIRED_MODULES 保持一致
      disallow: ['/admin', '/api', '/_next/', '/static/', ...LOGIN_REQUIRED_PATHS],
    },
  };
}
