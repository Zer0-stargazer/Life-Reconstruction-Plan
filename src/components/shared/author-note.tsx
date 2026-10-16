import { AUTHOR_NOTES, type AuthorNoteKey } from '@/data/author-notes';
import { cn } from '@/lib/utils';

/**
 * 作者手记：页尾的一段「为什么写这一块」。
 * kicker + serif 正文 + 右下小方印落款，hairline 上分隔，max-w-2xl。
 * 落款方印为纯 CSS 小方块，不另占一枚 SealMark（一屏最多一枚实色朱砂块的约束由页面其它处自行把握，
 * 这里的印仅 16px，用描边而非实色）。
 */
export function AuthorNote({ module, className }: { module: AuthorNoteKey; className?: string }) {
  const text = AUTHOR_NOTES[module];
  return (
    <aside
      aria-label="作者手记"
      className={cn('mx-auto w-full max-w-2xl border-t border-border px-4 pb-16 pt-10 sm:px-6', className)}
    >
      <p className="font-serif text-[11px] uppercase tracking-[0.3em] text-muted-foreground/80">
        作者手记 <span className="ml-2 font-mono tracking-[0.2em]">NOTE</span>
      </p>
      <p className="mt-4 font-serif text-[16px] leading-[1.9] text-foreground/85">{text}</p>
      <div className="mt-6 flex justify-end">
        <span
          aria-hidden
          className="inline-flex h-5 w-5 items-center justify-center rounded-[2px] border border-primary/70 text-primary"
        >
          <span className="h-2 w-2 border border-primary/70" />
        </span>
      </div>
    </aside>
  );
}
