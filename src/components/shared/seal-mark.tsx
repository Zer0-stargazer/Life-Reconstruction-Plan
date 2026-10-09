import { cn } from '@/lib/utils';

/**
 * 站点印章：朱砂方印、细内框、印文「重」留足四周白边。
 *
 * 入场只在整页首次加载时播放一次（CSS 关键帧 seal-stamp-in，500ms，power3.out）。
 * 不挂任何循环动画。
 */
export function SealMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'seal-stamp-in relative inline-flex shrink-0 items-center justify-center text-primary-foreground',
        className
      )}
    >
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" focusable="false">
        <defs>
          {/* 刀刻边缘：轻微位移，让方印不像矢量方块 */}
          <filter id="seal-carve" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="2" className="fill-primary" filter="url(#seal-carve)" />
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="0.8"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="0.6"
        />
        {/* 印泥磨损：几处暗斑 */}
        <circle cx="30" cy="10" r="0.9" fill="#f6efe2" fillOpacity="0.35" />
        <circle cx="9.5" cy="31" r="0.6" fill="#f6efe2" fillOpacity="0.3" />
        <circle cx="33" cy="27" r="0.5" fill="#f6efe2" fillOpacity="0.25" />
      </svg>
      <span className="relative font-serif text-[0.72em] font-semibold leading-none">重</span>
    </span>
  );
}
