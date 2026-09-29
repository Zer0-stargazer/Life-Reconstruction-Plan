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
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>应用没能启动</h1>
          <p style={{ margin: '16px 0 0', fontSize: 14, lineHeight: 1.7, color: 'rgba(250,250,250,0.6)' }}>
            发生了一个影响整个应用的问题。先尝试重新加载；如果仍然不行，请稍后再来。你在浏览器里保存的数据不受影响。
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
            重新加载
          </button>
        </div>
      </body>
    </html>
  );
}
