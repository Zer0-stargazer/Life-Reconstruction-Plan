'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * 进度条：外层固定宽度，内层只用 transform: scaleX 生长，不触发重排。
 *
 * - 首次进入视口时从 0 生长到 value（时长 --dur-meter，曲线 --ease-out-expo），只播一次；
 * - 之后 value 变化（如答题进度）直接按同一过渡平移到新值；
 * - prefers-reduced-motion：直接显示终值。
 *
 * @param value 0–1（会被夹紧）
 * @param trackClassName 轨道样式（高度、圆角、底色），默认 h-1.5 rounded-full bg-muted
 * @param barClassName 条体样式（颜色类）
 * @param barColor 条体颜色（动态色用，写入 backgroundColor）
 */
export function MeterBar({
  value,
  className,
  barClassName,
  barColor,
  barOpacity,
  ...rest
}: {
  value: number;
  className?: string;
  barClassName?: string;
  barColor?: string;
  barOpacity?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const v = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setArmed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)} {...rest}>
      <div
        className={cn('meter-fill h-full w-full origin-left rounded-[inherit] bg-primary', barClassName)}
        style={{
          transform: `scaleX(${armed ? v : 0})`,
          ...(barColor ? { backgroundColor: barColor } : null),
          ...(barOpacity !== undefined ? { opacity: barOpacity } : null),
        }}
      />
    </div>
  );
}
