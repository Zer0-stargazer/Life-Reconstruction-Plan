'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAuthHeader } from '@/lib/client-auth';
import { useAuth } from '@/contexts/auth-context';

interface Notification {
  id: number;
  type: string;
  severity: string;
  title: string;
  body: string;
  require_ack: boolean;
  created_at: string;
  read_at: string | null;
  acked_at: string | null;
}

/**
 * 用户通知中心：右下角铃铛 + 未读列表 + 高风险强制确认弹窗。
 *
 * 强制确认（require_ack）用于内容安全警告：不点"我知道了"就一直挡在最上层，
 * 保证"警告发出去了但用户没看见"这种情况不会发生。
 */
export function NotificationCenter() {
  const { user, handleSessionExpired } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [mustAck, setMustAck] = useState<Notification[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/user/notifications', {
        headers: { ...getAuthHeader() },
      });
      if (res.status === 401) { handleSessionExpired(); return; }
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) return;
      setUnavailable(Boolean(data.unavailable));
      setItems((data.items ?? []) as Notification[]);
      setMustAck((data.mustAck ?? []) as Notification[]);
    } catch {
      /* 网络抖动就当没有新通知，不打扰用户 */
    }
  }, [user, handleSessionExpired]);

  useEffect(() => {
    void load();
    // 60 秒轮询一次：警告不需要毫秒级实时，但别让用户等太久才发现
    const timer = setInterval(() => void load(), 60_000);
    return () => clearInterval(timer);
  }, [load]);

  const markRead = async (id?: number) => {
    try {
      await fetch('/api/user/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(id ? { action: 'read', id } : { action: 'read', all: true }),
      });
      await load();
    } catch { /* ignore */ }
  };

  const ack = async (id?: number) => {
    setBusy(true);
    try {
      await fetch('/api/user/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(id ? { action: 'ack', id } : { action: 'ack', all: true }),
      });
      await load();
    } catch { /* ignore */ } finally {
      setBusy(false);
    }
  };

  if (!user || unavailable) return null;

  const unread = items.filter(i => !i.read_at);

  return (
    <>
      {/* 铃铛：固定在右下角，避开移动端顶部 12px 高的侧栏条 */}
      <button
        onClick={() => { setOpen(!open); if (unread.length) void markRead(); }}
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-colors hover:bg-muted"
        aria-label={`通知${unread.length ? `（${unread.length} 条未读）` : ''}`}
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unread.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-medium text-white">
            {unread.length > 99 ? '99+' : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 w-[min(22rem,calc(100vw-2.5rem))] rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-medium text-foreground">通知</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">暂无通知</p>
            ) : (
              items.map(n => (
                <div key={n.id} className="border-b border-border/50 px-4 py-3 last:border-0">
                  <div className="flex items-start gap-2">
                    {n.severity === 'high' && (
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={cn('text-sm font-medium', n.severity === 'high' ? 'text-destructive' : 'text-foreground')}>
                        {n.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/70">
                        {new Date(n.created_at).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        {n.read_at ? ' · 已读' : ' · 未读'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 强制确认：不点按钮不消失 */}
      {mustAck.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-destructive/40 bg-card p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="text-base font-semibold text-foreground">
                  {mustAck[0].title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{mustAck[0].body}</p>
                {mustAck.length > 1 && (
                  <p className="text-xs text-muted-foreground/80">
                    还有 {mustAck.length - 1} 条同类警告需要确认
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => void ack()}
              disabled={busy}
              className="mt-5 w-full rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              {busy ? '提交中…' : '我知道了，以后注意'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
