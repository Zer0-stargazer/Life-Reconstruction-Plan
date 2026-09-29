/**
 * 路由级加载骨架。
 * 沿用仪表盘语言：HUD 行 + 面板占位，避免白屏跳变。
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 sm:px-8" role="status" aria-label="页面加载中">
      <span className="sr-only">加载中…</span>

      {/* HUD 行骨架 */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-2.5 w-16 animate-pulse rounded-sm bg-muted" />
        <span className="h-px flex-1 bg-border" />
        <div className="h-2.5 w-24 animate-pulse rounded-sm bg-muted" />
      </div>

      {/* 标题骨架 */}
      <div className="h-8 w-2/3 animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded-md bg-muted" />

      {/* 面板骨架 */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border p-5"
            style={{ opacity: 1 - i * 0.08 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="h-2.5 w-12 animate-pulse rounded-sm bg-muted" />
              <div className="h-2.5 w-8 animate-pulse rounded-sm bg-muted" />
            </div>
            <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="mt-3 h-3 w-full animate-pulse rounded-md bg-muted" />
            <div className="mt-2 h-3 w-5/6 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
