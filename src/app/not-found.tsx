'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Compass } from 'lucide-react';

/**
 * 404 页面。
 * 视觉沿用全站「数据仪表盘」语言：等宽注记 + 衬线大标题。
 */
export default function NotFound() {
  const router = useRouter();

  const routes = [
    { href: '/', label: '总览' },
    { href: '/me', label: '我的时间轴' },
    { href: '/windows', label: '人生窗口' },
    { href: '/career', label: '职业' },
    { href: '/luck', label: '运气节点' },
  ];

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        {/* HUD 行 */}
        <div className="mb-8 flex items-center gap-3 animate-fade-in">
          <span className="font-mono text-[10px] tracking-[0.2em] text-primary/70">ERR · 404</span>
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] text-muted-foreground/50">ROUTE NOT FOUND</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground animate-fade-in-up">
          这条路不在计划里
        </h1>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
          你访问的页面不存在，或者已经被移动到了别处。检查一下地址，或者从下面的入口重新出发。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up stagger-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            回到总览
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回上一页
          </button>
        </div>

        <nav aria-label="模块快捷入口" className="mt-10 animate-fade-in-up stagger-4">
          <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-muted-foreground/50">QUICK JUMP</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {routes.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
