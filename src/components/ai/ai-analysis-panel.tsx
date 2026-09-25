'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const initialAnalysisSent = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Reset on item change
  useEffect(() => {
    setMessages([]);
    setStreamingContent('');
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
    abortRef.current = new AbortController();

    const itemContext = `【${itemTitle}】\n${itemDescription}`;
    const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module,
          item: itemContext,
          question,
          history: historyForApi,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Stream complete
              setMessages(prev => [...prev, { role: 'assistant', content: accumulated }]);
              setStreamingContent('');
              setIsStreaming(false);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                setStreamingContent(accumulated);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }

      // If we exit the loop without [DONE]
      if (accumulated) {
        setMessages(prev => [...prev, { role: 'assistant', content: accumulated }]);
      }
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

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-background border-l border-border shadow-2xl animate-slide-in-right flex flex-col">
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
          <button
            onClick={handleClose}
            className="shrink-0 ml-2 h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
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
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {/* Streaming content */}
          {isStreaming && streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-lg px-4 py-3 text-sm leading-relaxed bg-card border border-border text-foreground">
                <div className="whitespace-pre-wrap">{streamingContent}</div>
                <span className="inline-block w-1.5 h-4 bg-primary/60 animate-blink ml-0.5 -mb-0.5" />
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isStreaming && !streamingContent && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg px-4 py-3 bg-card border border-border">
                <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground">正在分析...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? '等待回复中...' : '追问或提问...'}
              disabled={isStreaming}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="h-9 w-9 flex items-center justify-center rounded-md bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed btn-press"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
