import { MODULE_IDENTITIES } from '@/lib/module-identity';
import { ArcGlyph } from '@/components/shared/fig-kit';
import { cn } from '@/lib/utils';

/**
 * 七个模块页的统一页头。
 *
 * 以前每个页面自己写 `MODULE · 03` 这一行——编号写错了没人发现
 * （README/AGENTS 里曾把 03 写成命运、04 写成规律，与代码正好相反），
 * 加一个模块要改七八处。现在编号、图标、渐变配色、「能回答什么问题」
 * 全部从 `module-identity.ts` 取，页面只提供自己特有的部分。
 *
 * 页面仍可自定义大标题与描述——「人生规律引擎」这类产品文案不该被「规律」两个字替换掉。
 */

const WIDTHS = {
  '3xl': 'max-w-3xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
} as const;

export function ModulePageHead({
  href,
  title,
  desc,
  note,
  aside,
  width = '5xl',
  className,
  children,
}: {
  /** 模块路由，用来查 module-identity */
  href: string;
  /** 页面大标题（H1）。传各页自己的产品文案，不是 module.title */
  title: React.ReactNode;
  /** 页面描述。可传 JSX（例如随步骤变化的文案） */
  desc?: React.ReactNode;
  /** 右上注记，缺省用 `metric unit` */
  note?: React.ReactNode;
  /** 右侧插槽：搜索框、按钮等。小屏会整行换行到下方 */
  aside?: React.ReactNode;
  /** 内容宽度 */
  width?: keyof typeof WIDTHS;
  className?: string;
  /** 页头下方内容：统计条、分布图、步骤指示器等 */
  children?: React.ReactNode;
}) {
  const m = MODULE_IDENTITIES.find((x) => x.href === href);
  if (!m) return null;
  const Icon = m.icon;

  return (
    <div className={cn('relative overflow-hidden border-b border-border bg-card grain-texture', className)}>
      {/* 渐变 + 细网格底纹 */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* 右上角同心弧装饰：纯视觉，不承载信息 */}
      <ArcGlyph className="absolute -right-4 -top-4 h-40 w-40 text-primary sm:h-56 sm:w-56" />
      {/* 左下角斜向光晕，和右上弧形成对角平衡 */}
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/[0.05] blur-3xl" />

      <div className={cn('relative mx-auto px-6 sm:px-8 py-8', WIDTHS[width])}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-[280px]">
            {/* 编号条 —— 编号来自 module-identity，不再手写 */}
            <div className="mb-6 flex items-center gap-3 animate-fade-in-up">
              <span className="font-mono text-[10px] tracking-[0.2em] text-primary/70 shrink-0">
                MODULE · {m.tag}
              </span>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">
                {note ?? `${m.metric} ${m.unit}`}
              </span>
            </div>

            {/* 图标 + 大标题 */}
            <div className="mb-3 flex items-center gap-3.5 animate-fade-in-up stagger-1">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm',
                  m.iconGradient
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight">
                {title}
              </h1>
            </div>

            {/* 这个模块能回答什么问题——视觉主角，跟首页导览卡口径一致 */}
            <p className="mb-2 text-sm font-medium text-foreground/80 animate-fade-in-up stagger-2">
              {m.question}
            </p>
            {desc && (
              <p className="max-w-xl text-sm text-muted-foreground leading-relaxed animate-fade-in-up stagger-2">
                {desc}
              </p>
            )}
          </div>

          {aside && (
            <div className="w-full shrink-0 sm:w-auto animate-fade-in-up stagger-2">{aside}</div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
