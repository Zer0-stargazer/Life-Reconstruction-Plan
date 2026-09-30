import type { MetadataRoute } from 'next';

/**
 * PWA manifest。
 * 以前站点没有任何图标资源，加到主屏幕/分享时是一块白板。
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '人生重构计划 · LIFE REBOOT PLAN',
    short_name: '人生重构',
    description:
      '七个模块拆解人生：名字、职业、规律、窗口、努力、运气、命运。不是算命，是算概率。',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e0e11',
    theme_color: '#d97706',
    lang: 'zh-CN',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
