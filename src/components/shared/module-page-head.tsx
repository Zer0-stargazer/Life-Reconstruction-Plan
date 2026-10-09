import { MODULE_IDENTITIES, chapterOf } from '@/lib/module-identity';
import { cn } from '@/lib/utils';

/**
 * 七个模块页的统一页头：章节号 + 大标题 + 一句问题 + 细线。
 *
 * 编号、问题、章节全部从 `module-identity.ts` 取，页面只提供自己特有的部分。
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
  const chapter = chapterOf(href);

  return (
    <div className={cn('border-b border-border bg-card', className)}>
      <div className={cn('mx-auto px-6 sm:px-8 pt-10 pb-8', WIDTHS[width])}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-0 animate-fade-in-up">
            <div className="flex items-baseline gap-3">
              {chapter && (
                <span className="font-serif text-3xl leading-none text-primary">{chapter.num}</span>
              )}
              {chapter && (
                <span className="font-serif text-sm text-muted-foreground">{chapter.title}</span>
              )}
            </div>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
              {title}
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{m.question}</p>
            {desc && (
              <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">{desc}</p>
            )}
          </div>

          {aside && (
            <div className="w-full shrink-0 sm:w-auto animate-fade-in-up">{aside}</div>
          )}
        </div>

        {/* 细线 + 起点朱砂小印：章节开篇的收束线 */}
        <div className="relative mt-8 h-px bg-border">
          <span
            aria-hidden
            className="absolute -left-px top-1/2 h-2 w-2 -translate-y-1/2 rounded-[1px] bg-primary"
          />
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
