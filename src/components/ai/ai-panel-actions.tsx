'use client';

import { useEffect, useState } from 'react';
import { Brain, Check, Copy, Loader2 } from 'lucide-react';

/**
 * AI 面板通用操作件：停止生成 / 复制最近回复。
 *
 * 之前 5 个页面内联面板 + 共享 AIAnalysisPanel 各自为零散实现
 * （多数压根没有停止/复制），这里收敛为两个小组件供各面板复用。
 */

/** 停止当前流式生成（调用方负责 abort 自己的 AbortController） */
export function AiStopButton({ onStop }: { onStop: () => void }) {
  return (
    <button
      onClick={onStop}
      className="h-9 px-3 flex items-center gap-1.5 rounded-lg border border-border bg-background text-xs text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors btn-press shrink-0"
      aria-label="停止生成"
    >
      <span className="h-2.5 w-2.5 rounded-[2px] bg-current" />
      停止
    </button>
  );
}

/** 复制最近一条 AI 回复；内容由调用方通过 getText 提供（流式时给当前累计正文） */
export function AiCopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = getText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* 剪贴板不可用（如非安全上下文），保持安静 */ }
  };

  return (
    <button
      onClick={handleCopy}
      className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label={copied ? '已复制' : '复制最近回复'}
      title={copied ? '已复制' : '复制最近回复'}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

/**
 * AI 加载气泡：转圈 + 已等待秒数。
 * 首字延迟可能十几秒，一个会跳动的计数器比静止的"正在分析..."更让人安心。
 */
export function AiLoadingBubble() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-lg px-4 py-3 bg-card border border-border">
        <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground">
          正在分析<span className="tabular-nums"> · {elapsed}s</span>
        </span>
      </div>
    </div>
  );
}

/**
 * 推理模型的思维链展示。
 *
 * GLM-5 系列每请求先"思考"十几秒且服务端 thinking:disabled 被中转站忽略
 * （实测首正文要等约 60% 的总时长），把思考过程实时显示出来，
 * 等待就变成了"看得见的推进"。active=true 时展示滚动尾部，
 * 正文开始后折叠成可展开的"查看思考过程"。
 */
export function AiThinkingBlock({ content, active }: { content: string; active: boolean }) {
  if (!content.trim()) return null;

  if (active) {
    return (
      <div className="rounded-lg border border-dashed border-primary/25 bg-primary/[0.03] px-4 py-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Brain className="h-3 w-3 text-primary/60 animate-pulse" />
          <span className="text-[11px] font-mono text-primary/50">THINKING · 思考中</span>
        </div>
        <p className="text-xs text-muted-foreground/70 leading-relaxed whitespace-pre-wrap line-clamp-6 select-none">
          {content.slice(-600)}
        </p>
      </div>
    );
  }

  return (
    <details className="group rounded-lg border border-dashed border-border bg-muted/20 px-4 py-2.5">
      <summary className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/75 cursor-pointer select-none hover:text-muted-foreground transition-colors">
        <Brain className="h-3 w-3" />
        查看思考过程
      </summary>
      <p className="mt-2 text-xs text-muted-foreground/70 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
        {content}
      </p>
    </details>
  );
}
