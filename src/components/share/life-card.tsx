'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useEscapeKey } from '@/hooks/use-escape-key';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { readDefaultAge } from '@/lib/default-age';

/**
 * 人生卡片入口：方角描边按钮 + 预览弹层。
 * 纯函数（编号 / 计数 / 重点 / SVG）在 src/lib/life-card.ts，点击时才动态加载，
 * 避免把 488 条窗口数据带进只放了按钮的页面首包。
 */

type CardState =
  | { status: 'idle' }
  | { status: 'no-age' }
  | { status: 'loading' }
  | { status: 'ready'; svg: string; blob: Blob; fileName: string }
  | { status: 'error' };

// 入场：逐层淡入（80ms 间隔），最后日期印「盖下」（220ms）；reduced-motion 直接显示
const PREVIEW_CSS = `
.lc-preview svg{display:block;width:100%;height:auto}
.lc-preview #lc-header,.lc-preview #lc-age,.lc-preview #lc-timeline,.lc-preview #lc-counts,.lc-preview #lc-focus,.lc-preview #lc-footer{opacity:0;animation:lc-in 360ms cubic-bezier(.16,1,.3,1) forwards}
.lc-preview #lc-header{animation-delay:0ms}
.lc-preview #lc-age{animation-delay:80ms}
.lc-preview #lc-timeline{animation-delay:160ms}
.lc-preview #lc-counts{animation-delay:240ms}
.lc-preview #lc-focus{animation-delay:320ms}
.lc-preview #lc-footer{animation-delay:400ms}
.lc-preview #lc-stamp{opacity:0;animation:lc-stamp 220ms cubic-bezier(.16,1,.3,1) 560ms forwards}
@keyframes lc-in{from{opacity:0}to{opacity:1}}
@keyframes lc-stamp{
  from{opacity:0;transform:translate(868px,1146px) rotate(-6deg) scale(1.15)}
  to{opacity:1;transform:translate(868px,1146px) rotate(-6deg) scale(1)}
}
@media (prefers-reduced-motion:reduce){
  .lc-preview #lc-header,.lc-preview #lc-age,.lc-preview #lc-timeline,.lc-preview #lc-counts,.lc-preview #lc-focus,.lc-preview #lc-footer,.lc-preview #lc-stamp{animation:none;opacity:1}
}
`;

function svgToPngBlob(svg: string, w: number, h: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('canvas');
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png');
      } catch (e) {
        reject(e);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image'));
    };
    img.src = url;
  });
}

export function LifeCardButton() {
  const profile = useUserProfile();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CardState>({ status: 'idle' });
  const [canShare, setCanShare] = useState(false);
  const seq = useRef(0);

  const close = useCallback(() => setOpen(false), []);
  useEscapeKey(close, open);
  useScrollLock(open);

  const build = useCallback(async () => {
    const id = ++seq.current;
    const age = readDefaultAge();
    if (age === null) {
      setState({ status: 'no-age' });
      return;
    }
    setState({ status: 'loading' });
    try {
      const lc = await import('@/lib/life-card');
      await document.fonts.ready;
      const root = getComputedStyle(document.documentElement);
      const serifFamily = root.getPropertyValue('--font-serif').trim();
      const monoFamily = root.getPropertyValue('--font-mono').trim();
      const counts = lc.countWindows(age);
      const date = new Date();
      const svg = lc.buildLifeCardSvg({
        age,
        open: counts.open,
        urgent: counts.urgent,
        highlights: lc.pickHighlights({
          age,
          doingTitles: profile.windowAction.doingTitles,
          destinyNextWindow: profile.destinyReport?.nextWindow,
        }),
        date,
        host: window.location.host,
        serifFamily,
        monoFamily,
      });
      const blob = await svgToPngBlob(svg, lc.CARD_W, lc.CARD_H);
      if (id !== seq.current) return;
      setState({ status: 'ready', svg, blob, fileName: `人生卡片-${lc.formatYmd(date)}.png` });
    } catch {
      if (id === seq.current) setState({ status: 'error' });
    }
  }, [profile.windowAction.doingTitles, profile.destinyReport]);

  useEffect(() => {
    if (open) void build();
    else seq.current++;
  }, [open, build]);

  useEffect(() => {
    if (state.status !== 'ready') return;
    try {
      const file = new File([state.blob], state.fileName, { type: 'image/png' });
      setCanShare(typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] }));
    } catch {
      setCanShare(false);
    }
  }, [state]);

  const save = () => {
    if (state.status !== 'ready') return;
    const url = URL.createObjectURL(state.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = state.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const share = async () => {
    if (state.status !== 'ready') return;
    try {
      const file = new File([state.blob], state.fileName, { type: 'image/png' });
      await navigator.share({ files: [file], title: '人生卡片' });
    } catch { /* 用户取消 */ }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center rounded-[2px] border border-border bg-transparent px-5 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary btn-press focus-ring"
      >
        生成人生卡片
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/65 md:bg-black/55 animate-fade-in" onClick={close} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="人生卡片"
              className="relative mx-auto flex h-full w-full max-w-md flex-col py-4 md:py-8"
            >
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">LIFE CARD · 人生卡片</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="关闭"
                  className="flex h-8 w-8 items-center justify-center rounded-[2px] text-white/80 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div data-lenis-prevent className="flex-1 overflow-y-auto px-4">
                {state.status === 'ready' && (
                  <>
                    <style>{PREVIEW_CSS}</style>
                    <div
                      className="lc-preview border border-black/10 bg-[#f7f3ea]"
                      dangerouslySetInnerHTML={{ __html: state.svg }}
                    />
                  </>
                )}
                {(state.status === 'loading' || state.status === 'idle') && (
                  <div className="aspect-[1080/1350] w-full skeleton" />
                )}
                {state.status === 'no-age' && (
                  <div className="rounded-[4px] border border-border bg-background px-6 py-10 text-center">
                    <p className="font-serif text-lg text-foreground">先在时间轴设定年龄</p>
                    <p className="mt-2 text-[13px] text-muted-foreground">卡片上的窗口计数由年龄决定。</p>
                    <Link
                      href="/me"
                      onClick={close}
                      className="mt-5 inline-flex h-9 items-center rounded-[2px] bg-primary px-5 text-sm text-primary-foreground btn-press"
                    >
                      去时间轴
                    </Link>
                  </div>
                )}
                {state.status === 'error' && (
                  <div className="rounded-[4px] border border-border bg-background px-6 py-10 text-center">
                    <p className="text-sm text-foreground">卡片生成失败</p>
                    <button
                      type="button"
                      onClick={() => void build()}
                      className="mt-4 inline-flex h-9 items-center rounded-[2px] border border-border px-5 text-sm btn-press"
                    >
                      重试
                    </button>
                  </div>
                )}
              </div>

              {state.status === 'ready' && (
                <div className="flex gap-3 px-4 pt-3">
                  <button
                    type="button"
                    onClick={save}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-[2px] bg-primary text-sm text-primary-foreground btn-press focus-ring"
                  >
                    保存图片
                  </button>
                  {canShare && (
                    <button
                      type="button"
                      onClick={() => void share()}
                      className="inline-flex h-10 flex-1 items-center justify-center rounded-[2px] border border-border bg-background text-sm text-foreground btn-press focus-ring"
                    >
                      分享
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
