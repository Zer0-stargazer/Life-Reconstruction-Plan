'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useEscapeKey } from '@/hooks/use-escape-key';
import { X, Send, Sparkles } from 'lucide-react';
import { getActiveAiConfig } from '@/lib/active-ai-client';
import { getAuthHeader } from '@/lib/client-auth';
import { consumeAiSseStream } from '@/lib/sse-client';
import { AiMarkdown } from '@/components/shared/ai-markdown';
import { AiCopyButton, AiStopButton, AiLoadingBubble, AiThinkingBlock } from '@/components/ai/ai-panel-actions';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAnalysisPanelProps {
  open: boolean;
  onClose: () => void;
  module: string;
  moduleLabel: string;
  itemTitle: string;
  itemDescription: string;
}

export function AIAnalysisPanel({
  open,
  onClose,
  module,
  moduleLabel,
  itemTitle,
  itemDescription,
}: AIAnalysisPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [thinkingContent, setThinkingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const initialAnalysisSent = useRef(false);

  // 键盘用户按 Esc 也能关掉面板（原来只有点背景/点 × 才行）
  useEscapeKey(onClose, open);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Reset on item change
  useEffect(() => {
    setMessages([]);
    setStreamingContent('');
    setThinkingContent('');
    setIsStreaming(false);
    initialAnalysisSent.current = false;
  }, [itemTitle, module]);

  // Trigger initial analysis when panel opens
  useEffect(() => {
    if (open && !initialAnalysisSent.current) {
      initialAnalysisSent.current = true;
      // Small delay to let the panel render
      const timer = setTimeout(() => {
        startAnalysis();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startAnalysis = useCallback(async (question?: string) => {
    setIsStreaming(true);
    setStreamingContent('');
    setThinkingContent('');
    abortRef.current = new AbortController();

    const itemContext = `【${itemTitle}】\n${itemDescription}`;
    const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          module,
          item: itemContext,
          question,
          history: historyForApi,
          ai: getActiveAiConfig(),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        let detail = `请求失败: ${response.status}`;
        try {
          const j = await response.json();
          if (j?.error) detail = j.error;
        } catch { /* keep default */ }
        throw new Error(detail);
      }

      await consumeAiSseStream(response, {
        onReasoning: (accumulated) => setThinkingContent(accumulated),
        onContent: (accumulated) => setStreamingContent(accumulated),
        onError: (message) => {
          setMessages(prev => [...prev, { role: 'assistant', content: `分析失败：${message}` }]);
        },
        onDone: (fullText) => {
          if (fullText) {
            setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
          }
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled
      } else {
        const errorMsg = error instanceof Error ? error.message : '分析失败，请重试';
        setMessages(prev => [...prev, { role: 'assistant', content: `分析出错：${errorMsg}` }]);
      }
    } finally {
      setStreamingContent('');
      setIsStreaming(false);
    }
  }, [module, itemTitle, itemDescription, messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    startAnalysis(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Panel：居中模态（与 laws/luck 详情一致），不再是右侧抽屉 */}
      <div className={cn(
        'fixed z-50 animate-scale-in transition-all duration-300',
        'inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:top-[5%] sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:h-[90vh]'
      )}>
      <div role="dialog" aria-modal="true" aria-label="AI 分析面板" className="h-full rounded-2xl border border-primary/20 bg-background shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wider uppercase">{moduleLabel}</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground truncate">{itemTitle}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <AiCopyButton getText={() => {
              if (isStreaming) return streamingContent;
              for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].role === 'assistant') return messages[i].content;
              }
              return '';
            }} />
            <button
            onClick={handleClose}
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
           aria-label="关闭分析面板">
            <X className="h-4 w-4" />
          </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Initial context card */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">{itemDescription}</p>
          </div>

          {/* Chat messages */}
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[90%] rounded-lg px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary/10 text-foreground'
                    : 'bg-card border border-border text-foreground'
                )}
              >
                {msg.role === 'assistant' ? (
                  <AiMarkdown content={msg.content} />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}

          {/* Streaming content */}
          {isStreaming && streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-lg px-4 py-3 text-sm leading-relaxed bg-card border border-border text-foreground">
                <div className="flex items-end gap-1">
                  <AiMarkdown content={streamingContent} />
                  <span className="inline-block w-1.5 h-4 bg-primary/60 animate-blink -mb-0.5" />
                </div>
              </div>
            </div>
          )}

          {thinkingContent && (
            <AiThinkingBlock content={thinkingContent} active={isStreaming && !streamingContent} />
          )}

          {/* Loading indicator */}
          {isStreaming && !streamingContent && <AiLoadingBubble />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? '等待回复中...' : '追问或提问...'}
              disabled={isStreaming}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
            />
            {isStreaming && <AiStopButton onStop={() => abortRef.current?.abort()} />}
            <button
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="h-9 w-9 flex items-center justify-center rounded-md bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed btn-press"
             aria-label="发送消息">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
