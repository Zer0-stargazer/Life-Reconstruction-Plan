'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * 路由级错误边界。
 * 捕获渲染期异常，给出可读原因、重试入口与回退路径。
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // 生产环境可在接入监控后上报此处
    console.error('[route error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] text-destructive/80">ERR · 500</span>
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[11px] text-muted-foreground/70">RUNTIME FAULT</span>
        </div>

        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-destructive" aria-hidden="true" />
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            这一页没能加载
          </h1>
        </div>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          重试一次，你本地的数据都在。
        </p>

        {isDev && error.message && (
          <pre className="mt-5 max-h-32 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {error.message}
            {error.digest ? `\nDIGEST: ${error.digest}` : ''}
          </pre>
        )}
        {/* 生产环境不暴露 error.message，只给可复制的 digest 供反馈定位 */}
        {!isDev && error.digest && (
          <p className="mt-5 text-[11px] text-muted-foreground/70">
            错误编号：<span className="select-all font-mono">{error.digest}</span>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            重试
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            回到首页
          </Link>
        </div>
      </div>
    </div>
  );
}
