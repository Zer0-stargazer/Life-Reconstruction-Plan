import type { MetadataRoute } from 'next';

/**
 * PWA manifest。
 * 配色随「人生手记」视觉（纸墨朱砂）:底 #faf6ee / 主题 #b2392b，与 globals.css 令牌一致。
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '人生沙盘 · LIFE SANDBOX',
    short_name: '人生沙盘',
    description:
      '八个模块拆解人生：名字、职业、规律、窗口、努力、运气、命运、健康。不是算命，是算概率。',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6ee',
    theme_color: '#b2392b',
    lang: 'zh-CN',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
