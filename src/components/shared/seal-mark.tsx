import { cn } from '@/lib/utils';

/**
 * 站点标识：朱砂方印。内部一道未闭合的圆弧表示"重新开始"，
 * 圆弧包住两个叠起的空心方块（抽象的「重」），圆弧起点一枚墨点。
 *
 * 入场只在整页首次加载时播放一次（CSS 关键帧 seal-stamp-in，500ms，power3.out）。
 */
export function SealMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('seal-stamp-in relative inline-flex shrink-0 items-center justify-center', className)}
    >
      <svg viewBox="0 0 40 40" className="h-full w-full" focusable="false">
        <rect x="0" y="0" width="40" height="40" rx="3" className="fill-primary" />
        <path
          d="M28.4 10.0 A13 13 0 1 1 13.5 8.7"
          fill="none"
          stroke="#f6efe2"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="28.4" cy="10.0" r="1.6" fill="#f6efe2" />
        <rect x="15.2" y="14.2" width="9.6" height="5" fill="none" stroke="#f6efe2" strokeWidth="1.3" />
        <rect x="13.4" y="20.6" width="13.2" height="5.4" fill="none" stroke="#f6efe2" strokeWidth="1.3" />
      </svg>
    </span>
  );
}
