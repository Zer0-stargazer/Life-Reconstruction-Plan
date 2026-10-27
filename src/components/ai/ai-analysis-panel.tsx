'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useEscapeKey } from '@/hooks/use-escape-key';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { X, Send, Sparkles } from 'lucide-react';
import { getActiveAiConfig } from '@/lib/active-ai-client';
import { AiMarkdown } from '@/components/shared/ai-markdown';
import { AiCursor, AiPromptChips, AiCopyButton, AiStopButton, AiLoadingBubble, AiThinkingBlock, AiErrorNotice, AiStoppedNote } from '@/components/ai/ai-panel-actions';
import { useAiChat, toApiHistory, type AiChatMessage } from '@/components/ai/use-ai-chat';

/** 按「模块::对象」缓存已完成的会话：关闭再打开同一对象直接显示，不重复请求（不重复扣次） */
const sessionCache = new Map<string, AiChatMessage[]>();

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
  const {
    messages, setMessages,
    content: streamingContent,
    thinking: thinkingContent,
    thinkingBeat,
    streaming: isStreaming,
    error: aiError,
    abortRef, run, retry, reset,
  } = useAiChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialAnalysisSent = useRef(false);
  const messagesRef = useRef<AiChatMessage[]>([]);
  useEffect(() => { messagesRef.current = messages; });

  // 键盘用户按 Esc 也能关掉面板（原来只有点背景/点 × 才行）
  useEscapeKey(onClose, open);
  useScrollLock(open);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // 切换分析对象时重置；若该对象有缓存会话（关闭再打开）则直接恢复、不自动重发请求。
  // cleanup 在对象切换/卸载时把当前会话存回缓存。
  useEffect(() => {
    const cacheKey = `${module}::${itemTitle}`;
    reset();
    const cached = sessionCache.get(cacheKey);
    if (cached && cached.length > 0) {
      setMessages(cached);
      initialAnalysisSent.current = true;
    } else {
      initialAnalysisSent.current = false;
    }
    return () => {
      if (messagesRef.current.length > 0) sessionCache.set(cacheKey, messagesRef.current);
    };
  }, [itemTitle, module, reset, setMessages]);

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

  const startAnalysis = useCallback(async (question?: string, fresh = false) => {
    const itemContext = `【${itemTitle}】\n${itemDescription}`;
    const historyForApi = fresh ? [] : toApiHistory(messages);
    await run({
      module,
      item: itemContext,
      question,
      history: historyForApi,
      ai: getActiveAiConfig(),
    });
  }, [module, itemTitle, itemDescription, messages, run]);

  /** 「重新分析」：清空当前会话并重新请求（会再次消耗次数） */
  const handleReanalyze = () => {
    if (isStreaming) return;
    reset();
    void startAnalysis(undefined, true);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    startAnalysis(trimmed);
  };

  const handlePreset = (q: string) => {
    if (isStreaming) return;
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    startAnalysis(q);
  };

  const handleKeyDown =(e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 卸载兜底：父级条件渲染卸载面板时中止残留流式请求（与页面级 AI 面板一致）
  useEffect(() => () => abortRef.current?.abort(), []);

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
        className="fixed inset-0 z-40 bg-black/65 md:bg-black/55 animate-fade-in"
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
                <span className="text-[11px] font-mono text-muted-foreground/75 tracking-wider uppercase">{moduleLabel}</span>
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
        <p className="border-b border-border/60 bg-muted/20 px-5 py-1.5 text-[11px] text-muted-foreground">
          内容由 AI 生成，仅供参考，不构成人生、职业或投资建议
        </p>

        {/* Messages */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
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
                  <>
                    <AiMarkdown content={msg.content} />
                    {msg.stopped && <AiStoppedNote />}
                  </>
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
                  <AiCursor />
                </div>
              </div>
            </div>
          )}

          {thinkingContent && (
            <AiThinkingBlock content={thinkingContent} active={isStreaming && !streamingContent} />
          )}

          {/* Loading indicator */}
          {isStreaming && !streamingContent && <AiLoadingBubble thinking={thinkingBeat && !thinkingContent} />}

          {!isStreaming && aiError && <AiErrorNotice error={aiError} onRetry={retry} />}

          {!isStreaming && !aiError && messages.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleReanalyze}
                className="text-[11px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                重新分析
              </button>
            </div>
          )}

          <AiPromptChips
            module={module}
            visible={!isStreaming && !aiError && !messages.some(m => m.role === 'user')}
            onPick={handlePreset}
          />

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
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-base md:text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring disabled:opacity-50"
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
