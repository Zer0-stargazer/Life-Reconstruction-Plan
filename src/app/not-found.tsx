'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EmptyArt } from '@/components/shared/empty-art';

/** 404：空态线稿 + 方角按钮 + 编号 hairline 入口列表。 */
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
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center gap-3 animate-fade-in">
          <span className="font-mono text-[11px] tracking-[0.2em] text-primary">404</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <EmptyArt kind="lost" />

        <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight text-foreground animate-fade-in-up sm:text-5xl">
          这一页不存在。
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
          回到总览，或从下面进入。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up stagger-3">
          <Link
            href="/"
            className="btn-press inline-flex h-11 items-center bg-primary px-6 font-serif text-sm tracking-[0.12em] text-primary-foreground hover:bg-primary/90"
          >
            回到总览
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-press inline-flex h-11 items-center border border-border px-6 font-serif text-sm tracking-[0.12em] text-foreground hover:border-primary/60"
          >
            返回上一页
          </button>
        </div>

        <nav aria-label="模块快捷入口" className="mt-10 animate-fade-in-up stagger-4">
          <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground/70">从这里进入</p>
          <ul className="border-t border-border">
            {routes.map((r, i) => (
              <li key={r.href} className="border-b border-border">
                <Link href={r.href} className="group flex items-baseline gap-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <span className="font-mono text-[11px] tabular-nums tracking-[0.15em] text-primary">{String(i + 1).padStart(2, '0')}</span>
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