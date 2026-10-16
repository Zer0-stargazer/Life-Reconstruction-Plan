'use client';

import { useEffect } from 'react';

/**
 * 根级错误边界：连 RootLayout 都渲染失败时兜底。
 * 必须自带 <html>/<body>，且不能依赖任何 Provider / 全局样式类。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    console.error('[global error]', error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fafafa',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        <div style={{ maxWidth: 480, padding: '0 24px' }}>
          <p
            style={{
              margin: '0 0 16px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: 11,
              letterSpacing: '0.2em',
              color: 'rgba(250,250,250,0.35)',
            }}
          >
            ERR · FATAL
          </p>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>这一页没能加载</h1>
          <p style={{ margin: '16px 0 0', fontSize: 14, lineHeight: 1.7, color: 'rgba(250,250,250,0.6)' }}>
            重试一次，你本地的数据都在。
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 28,
              height: 44,
              padding: '0 20px',
              borderRadius: 8,
              border: '1px solid rgba(250,250,250,0.2)',
              background: 'transparent',
              color: '#fafafa',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            重试
          </button>
          {/* 根布局已崩溃，需整页刷新回首页，故意不用 next/link */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              marginTop: 28,
              marginLeft: 12,
              height: 44,
              padding: '0 20px',
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: 8,
              border: '1px solid rgba(250,250,250,0.2)',
              color: '#fafafa',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            回到首页
          </a>
          {isDev && error.message ? (
            <pre style={{ marginTop: 20, fontSize: 11, opacity: 0.5, whiteSpace: 'pre-wrap' }}>{error.message}</pre>
          ) : null}
          {!isDev && error.digest ? (
            <p style={{ marginTop: 20, fontSize: 11, color: 'rgba(250,250,250,0.35)' }}>
              错误编号：<span style={{ userSelect: 'all', fontFamily: 'ui-monospace, Consolas, monospace' }}>{error.digest}</span>
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
