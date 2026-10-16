import { cn } from '@/lib/utils';

/**
 * 空态线稿（三张，160×96，currentColor，stroke 1.25）。
 *
 * - search：刻度尺上没有落点（虚线放大镜 + 远处一个朱砂点）
 * - marks：印未落（一张纸 + 三行线 + 虚线方印框）
 * - lost：路进了窗口，后面没画（实线 → 朱砂方框 → 虚线弯向空心圆）
 *
 * 入场：实线用 stroke-dashoffset 画出（600ms，一次）；虚线与点淡入。
 * prefers-reduced-motion 下直接显示最终态。样式内联在 SVG 里，避免依赖全局 CSS。
 */
export type EmptyArtKind = 'search' | 'marks' | 'lost';

const STYLE = `
.ea-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:ea-draw 600ms cubic-bezier(.16,1,.3,1) forwards}
.ea-fade{opacity:0;animation:ea-fade 400ms ease-out 350ms forwards}
@keyframes ea-draw{to{stroke-dashoffset:0}}
@keyframes ea-fade{to{opacity:1}}
@media (prefers-reduced-motion:reduce){.ea-draw{animation:none;stroke-dashoffset:0}.ea-fade{animation:none;opacity:1}}
`;

const P = 'var(--primary)';

export function EmptyArt({ kind, className }: { kind: EmptyArtKind; className?: string }) {
  return (
    <svg
      viewBox="0 0 160 96"
      role="img"
      aria-hidden
      focusable="false"
      className={cn('h-24 w-40 text-muted-foreground/70', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <style>{STYLE}</style>
      {kind === 'search' && (
        <>
          <path className="ea-draw" pathLength={1} d="M12 74H148" />
          <path className="ea-draw" pathLength={1} d="M28 74v-4M44 74v-4M60 74v-4M76 74v-4M92 74v-4M108 74v-4M124 74v-6" />
          <circle className="ea-fade" cx={56} cy={36} r={20} strokeDasharray="3 3" />
          <path className="ea-draw" pathLength={1} d="M70.5 50.5L84 64" />
          <circle className="ea-fade" cx={140} cy={74} r={3} fill={P} stroke="none" />
        </>
      )}
      {kind === 'marks' && (
        <>
          <path className="ea-draw" pathLength={1} d="M50 8H110V88H50Z" />
          <path className="ea-draw" pathLength={1} d="M62 24H98M62 36H98M62 48H84" />
          <rect className="ea-fade" x={80} y={58} width={20} height={20} strokeDasharray="3 3" stroke={P} />
        </>
      )}
      {kind === 'lost' && (
        <>
          <path className="ea-draw" pathLength={1} d="M10 60H52M46 55L52 60L46 65" />
          <rect className="ea-draw" pathLength={1} x={54} y={48} width={24} height={24} stroke={P} />
          <path className="ea-fade" d="M78 60C102 60 100 30 122 30" strokeDasharray="3 3" />
          <circle className="ea-fade" cx={132} cy={30} r={8} />
        </>
      )}
    </svg>
  );
}
