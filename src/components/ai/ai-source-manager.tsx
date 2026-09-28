'use client';

/**
 * AI 接入管理 —— 让用户像在软件里接入自定义模型一样管理自己的 AI 源：
 * 任意接口地址 + Key + 模型，支持添加 / 编辑 / 启用停用 / 测试 / 删除 / 导入 / 导出。
 *
 * 背景：项目内置 8 家厂商写死了官方域名，但现实里很多人用的是
 * 第三方中转站 / 自建网关的 Key，官方域名 + 中转站 Key 必然鉴权失败。
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Plus, Trash2, Pencil, Check, X, Loader2, Download, Upload,
  Server, Zap, CircleDot, AlertCircle, Star, StarOff, Eye, EyeOff,
} from 'lucide-react';
import {
  type AiSource, type AiProtocol,
  STORAGE_KEY_SOURCES, STORAGE_KEY_ACTIVE,
  PROTOCOL_OPTIONS, validateSource, makeId, normalizeBaseUrl,
  serializeSources, parseSources,
} from '@/lib/ai-sources';

const EMPTY_FORM = {
  name: '',
  protocol: 'openai' as AiProtocol,
  baseUrl: '',
  apiKey: '',
  model: '',
};

export function AiSourceManager({ onActiveChanged }: { onActiveChanged?: () => void }) {
  const [sources, setSources] = useState<AiSource[]>([]);
  const [activeId, setActiveId] = useState<string>('builtin');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState<string | null>(null);
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [ioOpen, setIoOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [ioMessage, setIoMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 载入
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY_SOURCES) || '[]') as AiSource[];
      setSources(Array.isArray(list) ? list : []);
      setActiveId(localStorage.getItem(STORAGE_KEY_ACTIVE) || 'builtin');
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((next: AiSource[]) => {
    setSources(next);
    try { localStorage.setItem(STORAGE_KEY_SOURCES, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const setActive = useCallback((id: string) => {
    setActiveId(id);
    try { localStorage.setItem(STORAGE_KEY_ACTIVE, id); } catch { /* ignore */ }
    onActiveChanged?.();
  }, [onActiveChanged]);

  /* ---------- 测试连通性 ---------- */
  const testSource = useCallback(async (source: AiSource) => {
    setTesting((p) => ({ ...p, [source.id]: true }));
    try {
      const res = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'custom',
          protocol: source.protocol,
          baseUrl: source.baseUrl,
          apiKey: source.apiKey,
          model: source.model,
        }),
      });
      const data = await res.json();
      const ok = Boolean(data.success);
      const message = ok ? (data.responseSnippet || data.message || '连接成功') : (data.error || '连接失败');
      persist(sources.map((s) => (s.id === source.id ? { ...s, lastTest: { ok, at: Date.now(), message } } : s)));
    } catch (e) {
      persist(sources.map((s) => (s.id === source.id
        ? { ...s, lastTest: { ok: false, at: Date.now(), message: e instanceof Error ? e.message : '网络错误' } }
        : s)));
    } finally {
      setTesting((p) => ({ ...p, [source.id]: false }));
    }
  }, [sources, persist]);

  /* ---------- 表单 ---------- */
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (s: AiSource) => {
    setEditingId(s.id);
    setForm({ name: s.name, protocol: s.protocol, baseUrl: s.baseUrl, apiKey: s.apiKey, model: s.model });
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async () => {
    const candidate: Partial<AiSource> = {
      name: form.name, protocol: form.protocol,
      baseUrl: form.baseUrl, apiKey: form.apiKey, model: form.model,
    };
    const err = validateSource(candidate);
    if (err) { setFormError(err); return; }

    const normalized: AiSource = {
      id: editingId || makeId(),
      name: form.name.trim(),
      protocol: form.protocol,
      baseUrl: normalizeBaseUrl(form.baseUrl),
      apiKey: form.apiKey.trim(),
      model: form.model.trim(),
      enabled: true,
      createdAt: editingId ? (sources.find((s) => s.id === editingId)?.createdAt ?? Date.now()) : Date.now(),
    };

    if (editingId) {
      persist(sources.map((s) => (s.id === editingId ? { ...normalized, enabled: s.enabled } : s)));
    } else {
      persist([...sources, normalized]);
    }
    setFormOpen(false);
    setForm({ ...EMPTY_FORM });
    setEditingId(null);

    // 新增后顺手测一下，让用户立刻知道能不能用
    if (!editingId) void testSource(normalized);
  };

  const removeSource = (id: string) => {
    const target = sources.find((s) => s.id === id);
    if (!target) return;
    if (!window.confirm(`确定移除「${target.name}」？此操作不可撤销。`)) return;
    persist(sources.filter((s) => s.id !== id));
    if (activeId === id) setActive('builtin');
  };

  const toggleEnabled = (s: AiSource) => {
    const nextEnabled = !s.enabled;
    persist(sources.map((x) => (x.id === s.id ? { ...x, enabled: nextEnabled } : x)));
    if (!nextEnabled && activeId === s.id) setActive('builtin');
  };

  /* ---------- 导入 / 导出 ---------- */
  const exportSources = () => {
    if (!sources.length) { setIoMessage({ ok: false, text: '还没有可导出的源' }); return; }
    const blob = new Blob([serializeSources(sources)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-sources-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIoMessage({ ok: true, text: `已导出 ${sources.length} 个源` });
  };

  const doImport = (text: string) => {
    const result = parseSources(text);
    if (result.error) { setIoMessage({ ok: false, text: result.error }); return; }

    // 合并：同 id 覆盖，其余追加
    const map = new Map(sources.map((s) => [s.id, s]));
    let added = 0;
    for (const s of result.sources) {
      if (!map.has(s.id)) added += 1;
      map.set(s.id, s);
    }
    persist([...map.values()]);
    setImportText('');
    const skipNote = result.skipped ? `，跳过 ${result.skipped} 条无效数据` : '';
    setIoMessage({ ok: true, text: `导入完成：新增 ${added} 个、更新 ${result.sources.length - added} 个${skipNote}` });
  };

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => doImport(String(reader.result || ''));
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* 头部 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Server className="h-3.5 w-3.5" />
          自定义接入（中转站 / 自建网关 / 本地模型都走这里）
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setIoOpen(!ioOpen); setIoMessage(null); }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <Upload className="h-3 w-3" /> 导入/导出
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3 w-3" /> 添加源
          </button>
        </div>
      </div>

      {/* 导入导出面板 */}
      {ioOpen && (
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2 animate-fade-in">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportSources}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:border-primary/30 transition-colors"
            >
              <Download className="h-3 w-3" /> 导出为 JSON
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:border-primary/30 transition-colors"
            >
              <Upload className="h-3 w-3" /> 从文件导入
            </button>
            <input ref={fileRef} type="file" accept=".json,application/json" onChange={pickFile} className="hidden" />
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="或直接粘贴 JSON（支持本工具导出的文件，也支持 [{name,protocol,baseUrl,apiKey,model}] 数组）"
            rows={3}
            className="w-full rounded-md border border-border bg-card px-2.5 py-2 text-[11px] font-mono resize-y focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => doImport(importText)}
              disabled={!importText.trim()}
              className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
            >
              解析并导入
            </button>
            {ioMessage && (
              <span className={cn('text-[11px]', ioMessage.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                {ioMessage.text}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground/70">
            导出文件含明文密钥，请妥善保管。
          </p>
        </div>
      )}

      {/* 添加 / 编辑表单 */}
      {formOpen && (
        <div className="rounded-lg border border-primary/25 bg-primary/[0.02] p-4 space-y-3 animate-fade-in">
          <div className="text-xs font-semibold text-foreground">
            {editingId ? '编辑接入源' : '新增接入源'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] text-muted-foreground">名称</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例如：我的中转站 · GLM"
                className="mt-1 w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </label>
            <label className="block">
              <span className="text-[10px] text-muted-foreground">协议</span>
              <select
                value={form.protocol}
                onChange={(e) => setForm({ ...form, protocol: e.target.value as AiProtocol })}
                className="mt-1 w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                {PROTOCOL_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] text-muted-foreground">接口地址（Base URL）</span>
            <input
              value={form.baseUrl}
              onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
              placeholder="https://api.apikey.fan/v1"
              className="mt-1 w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <span className="text-[10px] text-muted-foreground/70">{PROTOCOL_OPTIONS.find(p => p.id === form.protocol)?.hint}</span>
          </label>

          <label className="block">
            <span className="text-[10px] text-muted-foreground">API Key</span>
            <input
              type="text"
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              placeholder="sk-..."
              className="mt-1 w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </label>

          <label className="block">
            <span className="text-[10px] text-muted-foreground">模型名</span>
            <input
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="glm-5.3-flash"
              className="mt-1 w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <span className="text-[10px] text-muted-foreground/70">必须填服务端真实支持的模型 id，不确定就先用测试按钮验证</span>
          </label>

          {formError && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400">
              <AlertCircle className="h-3 w-3" /> {formError}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={submitForm}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Check className="h-3 w-3" /> {editingId ? '保存' : '添加并测试'}
            </button>
            <button
              onClick={() => { setFormOpen(false); setFormError(null); setEditingId(null); }}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" /> 取消
            </button>
          </div>
        </div>
      )}

      {/* 源列表 */}
      {sources.length === 0 && !formOpen && (
        <div className="rounded-lg border border-dashed border-border p-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            还没有自定义源。有第三方中转站或自建网关？点「添加源」接进来。
          </p>
        </div>
      )}

      {sources.map((s) => {
        const isActive = activeId === s.id;
        return (
          <div
            key={s.id}
            className={cn(
              'rounded-lg border bg-card p-3 transition-colors',
              isActive ? 'border-primary/40 bg-primary/[0.03]' : 'border-border',
              !s.enabled && 'opacity-60'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-foreground truncate">{s.name}</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {PROTOCOL_OPTIONS.find((p) => p.id === s.protocol)?.label ?? s.protocol}
                  </span>
                  {isActive && (
                    <span className="rounded-full bg-primary/10 border border-primary/25 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      使用中
                    </span>
                  )}
                  {s.lastTest && (
                    <span className={cn(
                      'inline-flex items-center gap-1 text-[10px]',
                      s.lastTest.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      <CircleDot className="h-2.5 w-2.5" />
                      {s.lastTest.ok ? '连通' : '失败'}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[10px] font-mono text-muted-foreground/80 truncate">{s.baseUrl}</div>
                <div className="text-[10px] font-mono text-muted-foreground/80">
                  模型 {s.model} · Key {visible[s.id] ? s.apiKey : '•'.repeat(12)}
                </div>
                {s.lastTest?.message && (
                  <div className={cn(
                    'mt-1 text-[10px] leading-relaxed',
                    s.lastTest.ok ? 'text-muted-foreground' : 'text-red-600 dark:text-red-400'
                  )}>
                    {s.lastTest.message}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setActive(isActive ? 'builtin' : s.id)}
                  title={isActive ? '取消使用' : '设为当前使用的源'}
                  className={cn(
                    'rounded-md border p-1.5 transition-colors',
                    isActive
                      ? 'border-primary/40 text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                  )}
                >
                  {isActive ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => toggleEnabled(s)}
                  title={s.enabled ? '停用' : '启用'}
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <Zap className={cn('h-3 w-3', s.enabled && 'text-emerald-500')} />
                </button>
                <button
                  onClick={() => setVisible((p) => ({ ...p, [s.id]: !p[s.id] }))}
                  title={visible[s.id] ? '隐藏 Key' : '显示 Key'}
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {visible[s.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => void testSource(s)}
                  disabled={testing[s.id]}
                  title="测试连通性"
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50"
                >
                  {testing[s.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => openEdit(s)}
                  title="编辑"
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => removeSource(s.id)}
                  title="移除"
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-red-600 hover:border-red-500/30 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
