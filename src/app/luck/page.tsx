'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { luckNodes, LUCK_CATEGORY_CONFIG, type LuckCategory, type LuckNode } from '@/data/luck-nodes';
import { cn } from '@/lib/utils';
import { byLuckSeverity } from '@/lib/default-order';
import { TickRule } from '@/components/shared/fig-kit';
import { getActiveAiConfig } from '@/lib/active-ai-client';
import { ModuleGate } from '@/components/auth/module-gate';
import { Reveal } from '@/components/shared/reveal';
import { SectionJumper } from '@/components/shared/section-jumper';
import { ModulePageHead } from '@/components/shared/module-page-head';
import { AiMarkdown } from '@/components/shared/ai-markdown';
import {
  Droplet, TrendingUp, Skull, Sparkles, Search,
  AlertTriangle, Shield, Bot, Wand2,
  ChevronLeft, ChevronRight, X, Maximize2,
  ArrowUpRight, ArrowDownRight, Zap, Eye,
  Crosshair, BookOpen, Radar, Swords, CalendarCheck,
  Send, Loader2, MessageSquare,
} from 'lucide-react';

/* ============ AI Sub-topic definitions ============ */

const AI_SUBTOPICS = {
  breakthrough: {
    key: 'luck_breakthrough',
    label: '破除之道',
    icon: Wand2,
    prompt: '破除之道',
    description: '如何破解或利用当前运气节点的核心策略',
  },
  radar: {
    key: 'luck_radar',
    label: '征兆雷达',
    icon: Radar,
    prompt: '征兆雷达',
    description: '提前感知运气节点的信号',
  },
  defense: {
    key: 'luck_defense',
    label: '防线拆解',
    icon: Shield,
    prompt: '防线拆解',
    description: '建立防御体系应对风险或放大收益',
  },
  action: {
    key: 'luck_action',
    label: '本周动作',
    icon: CalendarCheck,
    prompt: '本周动作',
    description: '本周应该立即执行的具体行动',
  },
} as const;

type SubTopicKey = keyof typeof AI_SUBTOPICS;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* ============ Constants ============ */

const categoryOptions: { value: LuckCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: '全部节点', icon: <Zap className="h-3 w-3" /> },
  { value: 'red', label: '人际吸血', icon: <Droplet className="h-3 w-3" /> },
  { value: 'blue', label: '人际杠杆', icon: <TrendingUp className="h-3 w-3" /> },
  { value: 'purple', label: '人生天坑', icon: <Skull className="h-3 w-3" /> },
  { value: 'cyan', label: '命运暗门', icon: <Sparkles className="h-3 w-3" /> },
];

const CATEGORY_ICONS: Record<LuckCategory, React.ReactNode> = {
  red: <Droplet className="h-3.5 w-3.5" />,
  purple: <Skull className="h-3.5 w-3.5" />,
  blue: <TrendingUp className="h-3.5 w-3.5" />,
  cyan: <Sparkles className="h-3.5 w-3.5" />,
};

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: '简单', color: 'text-green-600 dark:text-green-400' },
  2: { label: '较易', color: 'text-emerald-600 dark:text-emerald-400' },
  3: { label: '中等', color: 'text-amber-600 dark:text-amber-400' },
  4: { label: '较难', color: 'text-orange-600 dark:text-orange-400' },
  5: { label: '极难', color: 'text-red-600 dark:text-red-400' },
};

/* ============ Helper functions ============ */

const CONTROLLABILITY_SCORE: Record<LuckNode['controllability'], number> = {
  none: 0, low: 25, medium: 50, high: 75,
};

// 期望影响指数（统一口径）：强度×概率归一到 0-100；消耗类节点为负、杠杆类为正
function getDrainValue(node: LuckNode): number {
  const expected = Math.round(node.impact * node.probability * 20);
  return node.category === 'red' || node.category === 'purple' ? -expected : expected;
}

// 可控度：数据字段的 controllability 映射为 0-75 指数
function getGainValue(node: LuckNode): number {
  return CONTROLLABILITY_SCORE[node.controllability] ?? 0;
}

/* ============ Inline AI Chat Panel ============ */

function InlineAIChat({
  node,
  subTopicKey,
  onBack,
}: {
  node: LuckNode;
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

  const config = LUCK_CATEGORY_CONFIG[node.category];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Reset on sub-topic change
  useEffect(() => {
    setMessages([]);
    setStreamingContent('');
    setIsStreaming(false);
    initialSent.current = false;
  }, [subTopicKey, node.id]);

  // Auto-trigger initial analysis
  useEffect(() => {
    if (!initialSent.current) {
      initialSent.current = true;
      const timer = setTimeout(() => {
        startChat();
      }, 150);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTopicKey, node.id]);

  const startChat = useCallback(async (question?: string) => {
    setIsStreaming(true);
    setStreamingContent('');
    abortRef.current = new AbortController();

    const itemContext = `【${node.name}】\n类别：${config.label}\n描述：${node.description}\n核心分析：${node.coreAnalysis}\n策略：${node.strategy}\n应对：${node.copingStrategy}\nAI分析：${node.aiMultiAnalysis}`;
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
          ai: getActiveAiConfig(),
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
            let parsed: { content?: string; error?: string } | null = null;
            try { parsed = JSON.parse(data); } catch { parsed = null; }
            if (parsed) {
              if (parsed.content) {
                accumulated += parsed.content;
                setStreamingContent(accumulated);
              }
              if (parsed.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: `分析失败：${parsed.error}` }]);
                setStreamingContent('');
                setIsStreaming(false);
                return;
              }
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
  }, [node, subTopic.key, config.label, messages]);

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
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
           aria-label="返回节点列表">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {/* Node context card */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-semibold">{node.name}</span>
            <span className="text-muted-foreground"> — {node.description}</span>
          </p>
        </div>

        {/* Chat messages */}
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
              {msg.role === 'assistant' ? (
                <AiMarkdown content={msg.content} />
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          </div>
        ))}

        {/* Streaming */}
        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-card border border-border text-foreground">
              <div className="flex items-end gap-1">
                <AiMarkdown content={streamingContent} />
                <span className="inline-block w-1.5 h-4 bg-primary/60 animate-blink -mb-0.5" />
              </div>
              <span className="inline-block w-1.5 h-4 bg-primary/60 animate-blink ml-0.5 -mb-0.5" />
            </div>
          </div>
        )}

        {/* Loading */}
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

      {/* Input */}
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
           aria-label="发送消息">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Luck Card (List View) ============ */

function LuckCard({ node, onClick }: { node: LuckNode; onClick: () => void }) {
  const config = LUCK_CATEGORY_CONFIG[node.category];
  const drainValue = getDrainValue(node);
  const gainValue = getGainValue(node);
  const diffConfig = DIFFICULTY_LABELS[node.difficulty];

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-200 cursor-pointer group/card',
        'hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]',
        config.borderColor
      )}
    >
      {/* Category pill */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium',
          config.bgColor, config.color
        )}>
          {CATEGORY_ICONS[node.category]}
          {config.label}
        </span>
        <Eye className="h-3.5 w-3.5 text-muted-foreground/30 group-hover/card:text-primary/50 transition-colors" />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground mb-3 leading-snug">{node.name}</h3>

      {/* Dual data cards */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={cn('rounded-md border border-border/40 p-2.5', node.category === 'red' || node.category === 'purple' ? 'bg-red-50/70 dark:bg-red-950/20' : 'bg-muted/40')}>
          <div className="flex items-center gap-1 mb-1">
            {drainValue < 0 ? (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            ) : (
              <ArrowUpRight className="h-3 w-3 text-blue-500" />
            )}
            <span className="text-[9px] text-muted-foreground">{config.drainLabel}</span>
          </div>
          <span className={cn(
            'text-lg font-bold font-mono tabular-nums',
            drainValue < 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
          )}>
            {drainValue < 0 ? drainValue : `+${drainValue}`}%
          </span>
        </div>
        <div className="rounded-md border border-border/40 p-2.5 bg-muted/40">
          <div className="flex items-center gap-1 mb-1">
            <ArrowUpRight className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[9px] text-muted-foreground">{config.gainLabel}</span>
          </div>
          <span className={cn(
            'text-lg font-bold font-mono tabular-nums',
            gainValue > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground/40'
          )}>
            {gainValue}%
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{node.description}</p>

      {/* Bottom attribute pills */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-muted/40 px-2 py-1 text-[10px]">
          <Crosshair className="h-3 w-3 text-muted-foreground/60" />
          <span className={diffConfig.color}>{diffConfig.label}</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-muted/40 px-2 py-1 text-[10px]">
          <AlertTriangle className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-muted-foreground truncate max-w-[100px]">{node.silentCost.length > 8 ? node.silentCost.slice(0, 8) + '...' : node.silentCost}</span>
        </span>
      </div>
    </div>
  );
}

/* ============ Detail Panel (Modal View) ============ */

function LuckDetailPanel({
  node,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: {
  node: LuckNode;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  const config = LUCK_CATEGORY_CONFIG[node.category];
  const drainValue = getDrainValue(node);
  const gainValue = getGainValue(node);
  const diffConfig = DIFFICULTY_LABELS[node.difficulty];
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [activeChat, setActiveChat] = useState<SubTopicKey | null>(null);

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
  }, [onClose, onPrev, onNext, activeChat]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset chat when node changes
  useEffect(() => {
    setActiveChat(null);
  }, [node.id]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        'fixed z-50 animate-scale-in transition-all duration-300',
        isFullWidth
          ? 'inset-4'
          : 'inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:top-[5%] sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:h-[90vh]'
      )}>
        <div className={cn(
          'h-full rounded-2xl border overflow-hidden flex flex-col shadow-2xl',
          config.borderColor
        )}>
          {/* Header */}
          <div className={cn('px-6 py-4 border-b shrink-0', config.bgColor)}>
            <div className="flex items-center justify-between">
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
                'bg-white/80 dark:bg-black/20', config.color
              )}>
                {CATEGORY_ICONS[node.category]}
                {config.label}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullWidth(!isFullWidth)}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/20 text-muted-foreground hover:text-foreground transition-colors"
                 aria-label="切换全宽显示">
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/20 text-muted-foreground hover:text-foreground transition-colors"
                 aria-label="关闭">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h2 className={cn('text-xl font-serif font-bold mt-3', config.color)}>
              {node.name}
            </h2>
          </div>

          {/* Content area — switches between detail and chat */}
          {activeChat ? (
            <InlineAIChat
              node={node}
              subTopicKey={activeChat}
              onBack={() => setActiveChat(null)}
            />
          ) : (
            <>
              {/* Scrollable detail content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-card">
                {/* Core data cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={cn('rounded-xl p-4', node.category === 'red' || node.category === 'purple' ? 'bg-red-50 dark:bg-red-950/20' : 'bg-blue-50 dark:bg-blue-950/20')}>
                    <div className="flex items-center gap-1.5 mb-2">
                      {drainValue < 0 ? (
                        <Droplet className="h-3.5 w-3.5 text-red-500" />
                      ) : (
                        <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                      )}
                      <span className="text-[10px] text-muted-foreground">{config.drainLabel}</span>
                    </div>
                    <span className={cn(
                      'text-3xl font-bold font-mono tabular-nums',
                      drainValue < 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                    )}>
                      {drainValue < 0 ? drainValue : `+${drainValue}`}%
                    </span>
                  </div>
                  <div className="rounded-xl p-4 bg-muted/40">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                      <span className="text-[10px] text-muted-foreground">{config.gainLabel}</span>
                    </div>
                    <span className={cn(
                      'text-3xl font-bold font-mono tabular-nums',
                      gainValue > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground/30'
                    )}>
                      {gainValue}%
                    </span>
                  </div>
                </div>

                {/* Attribute pills row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-muted/40 px-3 py-2 text-center">
                    <div className="text-[9px] text-muted-foreground mb-0.5">发生概率</div>
                    <div className="text-sm font-semibold font-mono tabular-nums text-foreground">{Math.round(node.probability * 100)}%</div>
                  </div>
                  <div className="rounded-lg bg-muted/40 px-3 py-2 text-center">
                    <div className="text-[9px] text-muted-foreground mb-0.5">应对难度</div>
                    <div className={cn('text-sm font-semibold', diffConfig.color)}>{diffConfig.label}</div>
                  </div>
                  <div className="rounded-lg bg-muted/40 px-3 py-2 text-center">
                    <div className="text-[9px] text-muted-foreground mb-0.5">沉没代价</div>
                    <div className="text-xs font-medium text-foreground truncate" title={node.silentCost}>{node.silentCost.length > 6 ? node.silentCost.slice(0, 6) + '...' : node.silentCost}</div>
                  </div>
                </div>

                {/* Core Analysis */}
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary/70" />
                    <h4 className="text-sm font-semibold text-foreground">核心定性分析</h4>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{node.coreAnalysis}</p>
                </div>

                {/* Real Cases */}
                <div className="rounded-xl border border-border p-4 border-l-4 border-l-red-400 dark:border-l-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-red-500/70" />
                    <h4 className="text-sm font-semibold text-foreground">真实沙盘推演案例</h4>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">{node.realCases}</p>
                </div>

                {/* Coping Strategy */}
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Swords className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">应对协议</h4>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300 mb-3">
                    【{node.copingStrategy}】
                  </div>
                  <ul className="space-y-2">
                    {node.strategy.split(/[。；;]/).filter(Boolean).map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-900/80 dark:text-amber-200/80">
                        <span className="shrink-0 h-5 w-5 rounded-full bg-amber-200 dark:bg-amber-800/50 flex items-center justify-center text-[10px] font-bold text-amber-800 dark:text-amber-200 mt-0.5">{i + 1}</span>
                        <span className="leading-relaxed">{s.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Multi Analysis — with clickable sub-topic buttons */}
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-primary/70" />
                    <h4 className="text-sm font-semibold text-foreground">AI 多维拆解</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">核心：{node.howToGrasp}</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{node.aiMultiAnalysis}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {(Object.keys(AI_SUBTOPICS) as SubTopicKey[]).map((key) => {
                      const sub = AI_SUBTOPICS[key];
                      const SubIcon = sub.icon;
                      const isPrimary = key === 'breakthrough';
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveChat(key)}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all group/sub',
                            isPrimary
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90 btn-press'
                              : 'border border-border text-foreground hover:bg-accent/60 hover:border-primary/30'
                          )}
                        >
                          <SubIcon className="h-3.5 w-3.5" />
                          {sub.label}
                          <MessageSquare className="h-3 w-3 opacity-0 -ml-1 group-hover/sub:opacity-60 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Extra: Amplify Signal + Cash Rhythm */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Radar className="h-3.5 w-3.5 text-primary/60" />
                      <span className="text-[10px] font-medium text-muted-foreground">放大信号</span>
                    </div>
                    <p className="text-xs text-foreground/70 leading-relaxed">{node.amplifySignal}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CalendarCheck className="h-3.5 w-3.5 text-primary/60" />
                      <span className="text-[10px] font-medium text-muted-foreground">兑现节奏</span>
                    </div>
                    <p className="text-xs text-foreground/70 leading-relaxed">{node.cashRhythm}</p>
                  </div>
                </div>
              </div>

              {/* Pagination footer */}
              <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
                <button
                  onClick={onPrev}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                 aria-label="上一个节点">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-mono text-muted-foreground tabular-nums">
                  {currentIndex + 1} / {totalCount}
                </span>
                <button
                  onClick={onNext}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                 aria-label="下一个节点">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ============ Main Page ============ */

export default function LuckPage() {
  const [filter, setFilter] = useState<LuckCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<LuckNode | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  /** 每组默认只露 12 条：4 个分类 250 条全铺出来等于没有重点 */
  const [catShowAll, setCatShowAll] = useState<Set<LuckCategory>>(new Set());
  const CAT_PREVIEW = 12;

  const toggleCatShowAll = (cat: LuckCategory) => {
    setCatShowAll(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Filter and search logic
  let filtered = filter === 'all'
    ? luckNodes.filter(Boolean)
    : luckNodes.filter(n => n && n.category === filter);

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(n =>
      n.name.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.silentCost.toLowerCase().includes(q) ||
      n.strategy.toLowerCase().includes(q) ||
      n.copingStrategy.toLowerCase().includes(q)
    );
  }

  // Category counts for tabs
  const counts = useMemo(() => {
    const c: Record<LuckCategory, number> = { red: 0, purple: 0, blue: 0, cyan: 0 };
    luckNodes.filter(Boolean).forEach(n => c[n.category]++);
    return c;
  }, []);

  // Group filtered items by category for display
  const groupedByCategory = useMemo(() => {
    const groups: { category: LuckCategory; items: LuckNode[] }[] = [];
    const order: LuckCategory[] = ['red', 'purple', 'blue', 'cyan'];
    for (const cat of order) {
      // 组内默认按"期望影响"排（强度×概率），别再吐数据录入顺序
      const items = filtered.filter(n => n.category === cat).sort(byLuckSeverity);
      if (items.length > 0) {
        groups.push({ category: cat, items });
      }
    }
    return groups;
  }, [filtered]);

  // Navigation for detail panel
  const handleOpenNode = useCallback((node: LuckNode) => {
    const idx = filtered.findIndex(n => n.id === node.id);
    setSelectedIndex(idx >= 0 ? idx : 0);
    setSelectedNode(node);
  }, [filtered]);

  const handlePrev = useCallback(() => {
    if (filtered.length === 0) return;
    const newIdx = selectedIndex > 0 ? selectedIndex - 1 : filtered.length - 1;
    setSelectedIndex(newIdx);
    setSelectedNode(filtered[newIdx]);
  }, [selectedIndex, filtered]);

  const handleNext = useCallback(() => {
    if (filtered.length === 0) return;
    const newIdx = selectedIndex < filtered.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIdx);
    setSelectedNode(filtered[newIdx]);
  }, [selectedIndex, filtered]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <ModuleGate modulePath="/luck">
    <div className="min-h-screen bg-background">
      {/* Header —— 编号/图标/提问统一从 module-identity 取 */}
      <ModulePageHead
        href="/luck"
        title="神卡与天坑"
        note="N=250"
        desc="随机给角色匹配两种卡改变命运走向。有些在暗中吸血，有些能撬动人生——认清它们，才能在对的位置出牌。"
        width="6xl"
        aside={
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索节点、危害或对冲协议..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground/40 border border-border rounded px-1.5 py-0.5 hidden sm:inline">⌘K</kbd>
          </div>
        }
      >
        {/* Category filter tabs */}
        <div className="flex items-center gap-1 mt-6 flex-wrap animate-fade-in-up stagger-3">
          {categoryOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all',
                filter === opt.value
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              )}
            >
              {opt.icon}
              {opt.label}
              {opt.value !== 'all' && (
                <span className="ml-0.5 text-[10px] font-mono tabular-nums opacity-60">{counts[opt.value as LuckCategory]}</span>
              )}
            </button>
          ))}
        </div>

      </ModulePageHead>

      {/*
        分段跳转：小屏专用。
        250 个节点在小屏是四段长长的单列，滚到中间就不知道自己在"人际吸血"还是"命运暗门"了。
        top-12 = 移动端 fixed 顶栏（h-12）下方，写 top-0 会被盖住。
      */}
      <div className="md:hidden sticky top-12 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
        <SectionJumper
          sections={groupedByCategory.map(({ category, items }) => ({
            id: `cat-${category}`,
            label: LUCK_CATEGORY_CONFIG[category].label,
            count: items.length,
          }))}
          offset={112}
        />
      </div>

      {/* Card Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">没有匹配的节点</p>
          </div>
        ) : (
          groupedByCategory.map(({ category, items }) => {
            const config = LUCK_CATEGORY_CONFIG[category];
            const showAll = catShowAll.has(category);
            const visibleItems = showAll ? items : items.slice(0, CAT_PREVIEW);
            return (
              <div key={category} id={`cat-${category}`} className="mb-10 scroll-mt-28 md:scroll-mt-4">
                {/* Category section header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium', config.bgColor, config.color)}>
                    {CATEGORY_ICONS[category]}
                    {config.label}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">{items.length}项</span>
                  <span className="text-[10px] text-muted-foreground/30 hidden sm:inline">· {config.subLabel}</span>
                  <TickRule className="flex-1" />
                </div>

                {/* Cards grid */}
                <Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {visibleItems.map(node => (
                    <LuckCard key={node.id} node={node} onClick={() => handleOpenNode(node)} />
                  ))}
                </div>
                </Reveal>

                {items.length > CAT_PREVIEW && (
                  <button
                    onClick={() => toggleCatShowAll(category)}
                    className="mt-4 w-full rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {showAll ? '收起' : `展开其余 ${items.length - CAT_PREVIEW} 个`}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom insight */}
      <div className="border-t border-border bg-muted/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-sm font-semibold text-foreground mb-4">关于运气的真相</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs leading-relaxed">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold text-foreground mb-1.5">不可控 ≠ 无能为力</p>
              <p className="text-muted-foreground">你无法控制出身，但可以控制对出身的解读和应对策略。反脆弱思维：利用波动而非逃避波动。</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold text-foreground mb-1.5">可控的才是杠杆</p>
              <p className="text-muted-foreground">把有限精力集中在可控的高杠杆行为上，才是真正的运气管理。认清边界，才能在边界内做最大努力。</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold text-foreground mb-1.5">高影响 + 可控 = 最优解</p>
              <p className="text-muted-foreground">同时满足高影响和可控性的因素，是你应该投入最多精力的地方。找到这些交集，就是在管理运气。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel Modal */}
      {selectedNode && (
        <LuckDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={selectedIndex}
          totalCount={filtered.length}
        />
      )}
    </div>
    </ModuleGate>
  );
}
