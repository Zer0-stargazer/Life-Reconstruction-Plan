'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { LAW_DIMENSIONS, type LawDimension, type LawItem, type LawTag } from '@/data/laws';
import { cn } from '@/lib/utils';
import { ModuleGate } from '@/components/auth/module-gate';
import {
  TrendingUp, AlertTriangle, Shield, Bot,
  ChevronLeft, ChevronRight, X, Maximize2,
  Eye, Crosshair, BookOpen,
  Send, Loader2, Sparkles, Flame, Zap,
  Activity, Users, Brain, Dna, DollarSign, Lock,
} from 'lucide-react';

/* ============ Tag Configuration ============ */

const TAG_CONFIG: Record<LawTag, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }> = {
  danger: {
    label: '危险规律',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-200 dark:border-amber-800/40',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  critical: {
    label: '致命规律',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800/40',
    icon: <Flame className="h-3.5 w-3.5" />,
  },
  opportunity: {
    label: '复利机会',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40',
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  neutral: {
    label: '中性规律',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-950/20',
    borderColor: 'border-slate-200 dark:border-slate-800/40',
    icon: <Eye className="h-3.5 w-3.5" />,
  },
};

const DIMENSION_ICONS: Record<string, React.ReactNode> = {
  'macro-cycle': <Activity className="h-3.5 w-3.5" />,
  'bio-decay': <Dna className="h-3.5 w-3.5" />,
  'mental-bandwidth': <Brain className="h-3.5 w-3.5" />,
  'social-vampire': <Users className="h-3.5 w-3.5" />,
  'habit-compound': <TrendingUp className="h-3.5 w-3.5" />,
  'black-swan': <Zap className="h-3.5 w-3.5" />,
  'wealth-erosion': <DollarSign className="h-3.5 w-3.5" />,
  'cognitive-prison': <Lock className="h-3.5 w-3.5" />,
};

const INTENSITY_LABELS: Record<number, { label: string; color: string; dots: number }> = {
  1: { label: '微弱', color: 'text-slate-500', dots: 1 },
  2: { label: '轻度', color: 'text-blue-500', dots: 2 },
  3: { label: '中等', color: 'text-amber-500', dots: 3 },
  4: { label: '强烈', color: 'text-orange-500', dots: 4 },
  5: { label: '极端', color: 'text-red-500', dots: 5 },
};

const RECOVERY_LABELS: Record<string, { label: string; color: string }> = {
  '极易': { label: '极易', color: 'text-emerald-600 dark:text-emerald-400' },
  '容易': { label: '容易', color: 'text-green-600 dark:text-green-400' },
  '中等': { label: '中等', color: 'text-amber-600 dark:text-amber-400' },
  '较难': { label: '较难', color: 'text-orange-600 dark:text-orange-400' },
  '极难': { label: '极难', color: 'text-red-600 dark:text-red-400' },
};

/* ============ AI Sub-topic definitions ============ */

const AI_SUBTOPICS = {
  breakthrough: {
    key: 'laws_breakthrough',
    label: '破除之道',
    icon: Shield,
    prompt: '破除之道',
    description: '如何破解或逆转当前规律的核心策略',
  },
  radar: {
    key: 'laws_radar',
    label: '征兆识别',
    icon: Eye,
    prompt: '征兆识别',
    description: '识别规律正在起效的早期信号',
  },
  action: {
    key: 'laws_action',
    label: '行动计划',
    icon: BookOpen,
    prompt: '行动计划',
    description: '针对当前规律的具体行动方案',
  },
} as const;

type SubTopicKey = keyof typeof AI_SUBTOPICS;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* ============ 维度 × 危险度分布（页头 FIG） ============ */

const TAG_BAR: Record<LawTag, string> = {
  critical: 'bg-red-500/70',
  danger: 'bg-amber-500/60',
  opportunity: 'bg-emerald-500/60',
  neutral: 'bg-muted-foreground/25',
};

const TAG_LEGEND: { tag: LawTag; label: string }[] = [
  { tag: 'critical', label: '致命' },
  { tag: 'danger', label: '危险' },
  { tag: 'opportunity', label: '机会' },
  { tag: 'neutral', label: '中性' },
];

function LawsDistribution({ dims }: { dims: LawDimension[] }) {
  const total = dims.reduce((s, d) => s + d.items.length, 0);
  return (
    <div className="relative mt-6 rounded-xl border border-border bg-card/70 backdrop-blur-sm p-5 animate-fade-in-up stagger-3">
      <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3 mb-4">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.15em] text-primary/70 shrink-0">FIG. 04</span>
          <h2 className="text-sm font-semibold text-foreground truncate">维度 × 危险度分布</h2>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">N={total} · {dims.length} 维</span>
      </div>
      <div className="space-y-2">
        {dims.map((d) => {
          const n = d.items.length || 1;
          return (
            <div key={d.id} className="flex items-center gap-3">
              <span className="w-16 sm:w-20 shrink-0 truncate font-mono text-[10px] text-muted-foreground/80">{d.name}</span>
              <div className="flex h-3 flex-1 overflow-hidden rounded-sm bg-muted/40">
                {TAG_LEGEND.map(({ tag }) => {
                  const c = d.items.filter((i) => i.tag === tag).length;
                  if (!c) return null;
                  return (
                    <div
                      key={tag}
                      className={cn('h-full', TAG_BAR[tag])}
                      style={{ width: `${(c / n) * 100}%` }}
                      title={`${d.name} · ${c} 条${TAG_LEGEND.find((l) => l.tag === tag)?.label}`}
                    />
                  );
                })}
              </div>
              <span className="w-7 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground/60">{d.items.length}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {TAG_LEGEND.map(({ tag, label }) => (
          <div key={tag} className="flex items-center gap-1.5">
            <span className={cn('h-2 w-2 rounded-[1px] inline-block', TAG_BAR[tag])} />
            <span className="font-mono text-[10px] text-muted-foreground/70">{label}</span>
          </div>
        ))}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">SRC laws-*.ts</span>
      </div>
    </div>
  );
}

/* ============ Inline AI Chat Panel ============ */

function InlineAIChat({
  item,
  dimension,
  subTopicKey,
  onBack,
}: {
  item: LawItem;
  dimension: LawDimension;
  subTopicKey: SubTopicKey;
  onBack: () => void;
}) {
  const subTopic = AI_SUBTOPICS[subTopicKey];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const initialSent = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    setMessages([]);
    setStreamingContent('');
    setIsStreaming(false);
    initialSent.current = false;
  }, [subTopicKey, item.id]);

  useEffect(() => {
    if (!initialSent.current) {
      initialSent.current = true;
      const timer = setTimeout(() => {
        startChat();
      }, 150);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTopicKey, item.id]);

  const startChat = useCallback(async (question?: string) => {
    setIsStreaming(true);
    setStreamingContent('');
    abortRef.current = new AbortController();

    const itemContext = `【${item.name}】\n维度：${dimension.name}\n描述：${item.description}\n指标：${item.metric} ${item.metricValue}\n举例：${item.example}\n挽回概率：${item.breakthrough}%\n恢复难度：${item.recovery}\n代价：${item.cost}\n策略：${item.strategies.join('；')}`;
    const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: subTopic.key,
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
              // Ignore parse errors
            }
          }
        }
      }

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
  }, [item, dimension, subTopic.key, messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    startChat(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const SubIcon = subTopic.icon;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <SubIcon className="h-4 w-4 text-primary" />
          <div>
            <h4 className="text-sm font-semibold text-foreground leading-none">{subTopic.label}</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">{subTopic.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5 text-primary/50" />
          <span className="text-[9px] text-muted-foreground">AI 对话</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-semibold">{item.name}</span>
            <span className="text-muted-foreground"> — {item.description}</span>
          </p>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-primary/10 text-foreground'
                  : 'bg-card border border-border text-foreground'
              )}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-card border border-border text-foreground">
              <div className="whitespace-pre-wrap">{streamingContent}</div>
              <span className="inline-block w-1.5 h-4 bg-primary/60 animate-blink ml-0.5 -mb-0.5" />
            </div>
          </div>
        )}

        {isStreaming && !streamingContent && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 bg-card border border-border">
              <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
              <span className="text-xs text-muted-foreground">正在分析...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border bg-card px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? '等待回复中...' : '追问或提问...'}
            disabled={isStreaming}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed btn-press"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Law Card (List View) ============ */

function LawCard({ item, onClick }: { item: LawItem; dimension: LawDimension; onClick: () => void }) {
  const tagConf = TAG_CONFIG[item.tag];
  const intensityConf = INTENSITY_LABELS[item.intensity];
  const recoveryConf = RECOVERY_LABELS[item.recovery] || { label: item.recovery, color: 'text-muted-foreground' };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border bg-card p-4 transition-all duration-200 cursor-pointer group/card',
        'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]',
        tagConf.borderColor
      )}
    >
      {/* Tag pill + intensity */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium',
          tagConf.bgColor, tagConf.color
        )}>
          {tagConf.icon}
          {tagConf.label}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                i < intensityConf.dots
                  ? item.tag === 'opportunity'
                    ? 'bg-emerald-500'
                    : item.tag === 'critical'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  : 'bg-muted-foreground/15'
              )}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-snug">{item.name}</h3>
      <p className="text-[11px] text-muted-foreground/60 mb-3 font-mono">{item.nameEn}</p>

      {/* Metric card */}
      <div className={cn('rounded-lg p-2.5 mb-3', tagConf.bgColor)}>
        <div className="flex items-center gap-1 mb-1">
          <Crosshair className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-[9px] text-muted-foreground">{item.metric}</span>
        </div>
        <span className={cn(
          'text-lg font-bold font-mono tabular-nums',
          item.tag === 'opportunity' ? 'text-emerald-600 dark:text-emerald-400' :
          item.tag === 'critical' ? 'text-red-600 dark:text-red-400' :
          item.metricValue.startsWith('-') ? 'text-red-600 dark:text-red-400' :
          item.metricValue.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' :
          'text-foreground'
        )}>
          {item.metricValue}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{item.description}</p>

      {/* Bottom attribute pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[10px]">
          <TrendingUp className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-primary">{item.breakthrough}%</span>
          <span className="text-muted-foreground">挽回</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[10px]">
          <Shield className="h-3 w-3 text-muted-foreground/60" />
          <span className={recoveryConf.color}>{recoveryConf.label}</span>
        </span>
      </div>
    </div>
  );
}

/* ============ Detail Panel ============ */

function LawDetailPanel({
  item,
  dimension,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: {
  item: LawItem;
  dimension: LawDimension;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  const tagConf = TAG_CONFIG[item.tag];
  const intensityConf = INTENSITY_LABELS[item.intensity];
  const recoveryConf = RECOVERY_LABELS[item.recovery] || { label: item.recovery, color: 'text-muted-foreground' };
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [activeChat, setActiveChat] = useState<SubTopicKey | null>(null);
  const [strategiesExpanded, setStrategiesExpanded] = useState(true);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (activeChat) {
        setActiveChat(null);
      } else {
        onClose();
      }
    }
    if (!activeChat) {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
  }, [onClose, onPrev, onNext, activeChat, setActiveChat]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setActiveChat(null);
  }, [item.id]);

  // If activeChat is set, render the chat panel
  if (activeChat) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
        <div className={cn(
          'fixed z-50 animate-scale-in transition-all duration-300',
          isFullWidth
            ? 'inset-4'
            : 'inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:top-[5%] sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:h-[90vh]'
        )}>
          <div className={cn('h-full rounded-2xl border overflow-hidden flex flex-col shadow-2xl', tagConf.borderColor)}>
            <InlineAIChat
              item={item}
              dimension={dimension}
              subTopicKey={activeChat}
              onBack={() => setActiveChat(null)}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className={cn(
        'fixed z-50 animate-scale-in transition-all duration-300',
        isFullWidth
          ? 'inset-4'
          : 'inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:top-[5%] sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:h-[90vh]'
      )}>
        <div className={cn('h-full rounded-2xl border overflow-hidden flex flex-col shadow-2xl', tagConf.borderColor)}>
          {/* Header */}
          <div className={cn('px-6 py-4 border-b shrink-0', tagConf.bgColor)}>
            <div className="flex items-center justify-between">
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
                'bg-white/80 dark:bg-black/20', tagConf.color
              )}>
                {DIMENSION_ICONS[dimension.id]}
                {dimension.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">{currentIndex + 1}/{totalCount}</span>
                <button
                  onClick={() => setIsFullWidth(!isFullWidth)}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h2 className={cn('text-xl font-serif font-bold mt-3', tagConf.color)}>
              {item.name}
            </h2>
            <p className="text-[11px] text-muted-foreground font-mono mt-1">{item.nameEn}</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">核心描述</h3>
              <p className="text-sm text-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Metric */}
            <div className={cn('rounded-xl border p-4', tagConf.bgColor, tagConf.borderColor)}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{item.metric}</span>
                <span className={cn('text-2xl font-bold font-mono tabular-nums', tagConf.color)}>
                  {item.metricValue}
                </span>
              </div>
              {/* Breakthrough progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">挽回概率</span>
                  <span className="text-xs font-mono font-semibold text-primary">{item.breakthrough}%</span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full progress-shimmer transition-all duration-700',
                      item.breakthrough >= 60 ? 'bg-emerald-500' :
                      item.breakthrough >= 30 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${item.breakthrough}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Intensity + Recovery */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="text-[10px] text-muted-foreground mb-2">强度等级</div>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-3 h-3 rounded-sm transition-colors',
                        i < intensityConf.dots
                          ? item.tag === 'opportunity'
                            ? 'bg-emerald-500'
                            : item.tag === 'critical'
                              ? 'bg-red-500'
                              : 'bg-amber-500'
                          : 'bg-muted-foreground/15'
                      )}
                    />
                  ))}
                  <span className={cn('text-xs font-medium ml-1', intensityConf.color)}>{intensityConf.label}</span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="text-[10px] text-muted-foreground mb-2">恢复难度</div>
                <span className={cn('text-sm font-medium', recoveryConf.color)}>{recoveryConf.label}</span>
                <div className="text-[10px] text-muted-foreground mt-1">代价：{item.cost}</div>
              </div>
            </div>

            {/* Example */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">真实案例</h3>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <p className="text-sm text-foreground/90 leading-relaxed">{item.example}</p>
              </div>
            </div>

            {/* Strategies */}
            <div>
              <button
                onClick={() => setStrategiesExpanded(!strategiesExpanded)}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 hover:text-foreground transition-colors"
              >
                <ChevronRight className={cn('h-3 w-3 transition-transform', strategiesExpanded && 'rotate-90')} />
                应对策略 ({item.strategies.length})
              </button>
              {strategiesExpanded && (
                <div className="space-y-2">
                  {item.strategies.map((strategy, i) => (
                    <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-mono font-bold text-primary">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground/90 leading-relaxed">{strategy}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Analysis Buttons */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI 深度分析</h3>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(AI_SUBTOPICS) as [SubTopicKey, typeof AI_SUBTOPICS[SubTopicKey]][]).map(([key, sub]) => {
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveChat(key)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-xl border border-border p-3',
                        'bg-card hover:bg-accent/40 transition-all hover:shadow-md active:scale-[0.97] btn-press'
                      )}
                    >
                      <SubIcon className="h-4 w-4 text-primary" />
                      <span className="text-[11px] font-medium text-foreground">{sub.label}</span>
                      <span className="text-[9px] text-muted-foreground">{sub.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age badge for bio items */}
            {item.age && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-4 py-2">
                <Dna className="h-3.5 w-3.5 text-primary/60" />
                <span className="text-xs text-muted-foreground">关键年龄节点：<span className="font-mono font-semibold text-foreground">{item.age}岁</span></span>
              </div>
            )}
          </div>

          {/* Footer navigation */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20 shrink-0">
            <button
              onClick={onPrev}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              上一条
            </button>
            <div className="flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-primary/40" />
              <span className="text-[10px] text-muted-foreground">点击上方按钮开始 AI 分析</span>
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              下一条
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Main Page ============ */

export default function LawsPage() {
  const [activeDimensionId, setActiveDimensionId] = useState<string>(LAW_DIMENSIONS[0].id);
  const [tagFilter, setTagFilter] = useState<LawTag | 'all'>('all');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeDimension = useMemo(
    () => LAW_DIMENSIONS.find(d => d.id === activeDimensionId) || LAW_DIMENSIONS[0],
    [activeDimensionId]
  );

  const filteredItems = useMemo(() => {
    let items = activeDimension.items;
    if (tagFilter !== 'all') {
      items = items.filter(item => item.tag === tagFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeDimension, tagFilter, searchQuery]);

  const selectedItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  // Compute stats for the active dimension
  const dimensionStats = useMemo(() => {
    const items = activeDimension.items;
    const critical = items.filter(i => i.tag === 'critical').length;
    const danger = items.filter(i => i.tag === 'danger').length;
    const opportunity = items.filter(i => i.tag === 'opportunity').length;
    const neutral = items.filter(i => i.tag === 'neutral').length;
    const avgBreakthrough = Math.round(items.reduce((sum, i) => sum + i.breakthrough, 0) / items.length);
    return { total: items.length, critical, danger, opportunity, neutral, avgBreakthrough };
  }, [activeDimension]);

  const handleDimensionChange = (dimId: string) => {
    setActiveDimensionId(dimId);
    setTagFilter('all');
    setSearchQuery('');
    setSelectedItemIndex(null);
  };

  return (
    <ModuleGate modulePath="/laws">
    <div className="min-h-screen bg-background">
      {/* Top Banner */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background grain-texture" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative px-6 py-8 md:px-10 md:py-10">
          <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
            <span className="font-mono text-[10px] tracking-[0.2em] text-primary/70 shrink-0">MODULE · 03</span>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">LAW ENGINE · N=288</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight animate-fade-in-up stagger-1">
            人生规律引擎
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed animate-fade-in-up stagger-2">
            混沌系统中的确定性规律——8个维度揭示人生暗箱里的齿轮如何转动。
            看清规律，才能在不确定性中找到行动的锚点。
          </p>

          {/* Global stats */}
          <div className="flex items-center gap-4 mt-4 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold font-mono text-foreground tabular-nums">{LAW_DIMENSIONS.reduce((s, d) => s + d.items.length, 0)}</span>
              <span className="text-xs text-muted-foreground">条规律</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold font-mono text-foreground tabular-nums">{LAW_DIMENSIONS.length}</span>
              <span className="text-xs text-muted-foreground">大维度</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold font-mono text-red-500 tabular-nums">{LAW_DIMENSIONS.reduce((s, d) => s + d.items.filter(i => i.tag === 'critical').length, 0)}</span>
              <span className="text-xs text-muted-foreground">致命条目</span>
            </div>
          </div>

          <LawsDistribution dims={LAW_DIMENSIONS} />
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* Dimension tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {LAW_DIMENSIONS.map(dim => {
            const isActive = dim.id === activeDimensionId;
            const icon = DIMENSION_ICONS[dim.id];
            return (
              <button
                key={dim.id}
                onClick={() => handleDimensionChange(dim.id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all shrink-0',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'bg-muted/40 text-muted-foreground border border-transparent hover:bg-accent/60 hover:text-foreground'
                )}
              >
                {icon}
                <span>{dim.name}</span>
                <span className={cn(
                  'text-[10px] font-mono',
                  isActive ? 'text-primary/50' : 'text-muted-foreground/40'
                )}>
                  {dim.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dimension subtitle bar */}
        <div className="flex items-center gap-3 px-1">
          <span className="text-lg">{activeDimension.icon}</span>
          <div>
            <h2 className="text-base font-semibold text-foreground font-serif">{activeDimension.name}</h2>
            <p className="text-xs text-muted-foreground">{activeDimension.subtitle} · {activeDimension.nameEn}</p>
          </div>
        </div>

        {/* Dimension stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-lg font-bold font-mono text-foreground tabular-nums">{dimensionStats.total}</div>
            <div className="text-[10px] text-muted-foreground">总条目</div>
          </div>
          <div className="rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/20 p-3 text-center">
            <div className="text-lg font-bold font-mono text-red-600 dark:text-red-400 tabular-nums">{dimensionStats.critical}</div>
            <div className="text-[10px] text-red-600/70 dark:text-red-400/70">致命</div>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 p-3 text-center">
            <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">{dimensionStats.danger}</div>
            <div className="text-[10px] text-amber-600/70 dark:text-amber-400/70">危险</div>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center">
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{dimensionStats.opportunity}</div>
            <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">机会</div>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
            <div className="text-lg font-bold font-mono text-primary tabular-nums">{dimensionStats.avgBreakthrough}%</div>
            <div className="text-[10px] text-muted-foreground">平均挽回</div>
          </div>
        </div>

        {/* Filter + Search bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tag filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground mr-1">筛选</span>
            {([
              { value: 'all' as const, label: '全部' },
              { value: 'critical' as const, label: '致命' },
              { value: 'danger' as const, label: '危险' },
              { value: 'opportunity' as const, label: '机会' },
              { value: 'neutral' as const, label: '中性' },
            ]).map(opt => (
              <button
                key={opt.value}
                onClick={() => setTagFilter(opt.value)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[11px] font-medium transition-all',
                  tagFilter === opt.value
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-muted/40 text-muted-foreground border border-transparent hover:bg-accent/60'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索规律名称、描述或案例..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 pl-8 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <Eye className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
          </div>
        </div>

        {/* Items grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) => (
              <LawCard
                key={item.id}
                item={item}
                dimension={activeDimension}
                onClick={() => setSelectedItemIndex(index)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Eye className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">没有匹配的规律条目</p>
            <button
              onClick={() => { setTagFilter('all'); setSearchQuery(''); }}
              className="text-xs text-primary hover:underline mt-2"
            >
              清除筛选
            </button>
          </div>
        )}
      </div>

      {/* Detail panel modal */}
      {selectedItem && (
        <LawDetailPanel
          item={selectedItem}
          dimension={activeDimension}
          onClose={() => setSelectedItemIndex(null)}
          onPrev={() => setSelectedItemIndex(Math.max(0, (selectedItemIndex ?? 0) - 1))}
          onNext={() => setSelectedItemIndex(Math.min(filteredItems.length - 1, (selectedItemIndex ?? 0) + 1))}
          currentIndex={selectedItemIndex ?? 0}
          totalCount={filteredItems.length}
        />
      )}
    </div>
    </ModuleGate>
  );
}
