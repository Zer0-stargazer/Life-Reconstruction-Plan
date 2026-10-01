'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { lifeWindows, WINDOW_STATUS_CONFIG, WINDOW_GROUP_LABELS, REMEDY_LEVEL_CONFIG, MISS_TYPE_CONFIG, LOCK_FORCE_LABELS, type LifeWindow, type WindowStatus } from '@/data/windows';
import { cn } from '@/lib/utils';
import { byWindowSeverity } from '@/lib/default-order';
import { TickRule } from '@/components/shared/fig-kit';
import { getActiveAiConfig } from '@/lib/active-ai-client';
import { useAdvancedSettings } from '@/hooks/use-advanced-settings';
import { Reveal } from '@/components/shared/reveal';
import { SectionJumper } from '@/components/shared/section-jumper';
import { useEscapeKey } from '@/hooks/use-escape-key';
import { ModulePageHead } from '@/components/shared/module-page-head';
import { Filter, AlertTriangle, ChevronDown, ChevronUp, Sparkles, User, Lock, ShieldAlert, Target, Layers, XCircle, Bot, X, Send, Loader2 } from 'lucide-react';

const statusOptions: { value: WindowStatus | 'all'; label: string; dotColor: string }[] = [
  { value: 'all', label: '全部', dotColor: '' },
  { value: 'current', label: '当前', dotColor: 'bg-green-500' },
  { value: 'past', label: '已过', dotColor: 'bg-muted-foreground/40' },
  { value: 'future', label: '未至', dotColor: 'bg-amber-500' },
  { value: 'elite', label: '精英', dotColor: 'bg-primary' },
];

function getGroup(age: string, stages: { label: string; range: [number, number] }[]): string {
  const parsed = parseFloat(age);
  if (isNaN(parsed)) return '其他';
  for (const s of stages) {
    if (parsed >= s.range[0] && parsed <= s.range[1]) return s.label;
  }
  return '其他';
}

function getGroupFromWindow(w: { age: string; status: WindowStatus }, stages: { label: string; range: [number, number] }[]): string {
  if (w.status === 'elite') return '精英';
  return getGroup(w.age, stages);
}



// 检查窗口是否与用户年龄相关
// 匹配规则：用户年龄在窗口范围内 / 窗口刚结束3年内(回头看) / 窗口即将在5年内开启(向前看)
function isAgeRelevant(w: LifeWindow, userAge: number): boolean {
  const ageStr = w.age.trim();
  // 处理 "80+" 格式
  if (ageStr.endsWith('+')) {
    const start = parseFloat(ageStr);
    if (!isNaN(start)) return userAge >= start - 3;
    return false;
  }
  const parts = ageStr.split('-');
  if (parts.length !== 2) return false;
  const start = parseFloat(parts[0]);
  const end = parseFloat(parts[1]);
  if (isNaN(start) || isNaN(end)) return false;
  // 条件1: 用户年龄在窗口范围内
  const inRange = userAge >= start && userAge <= end;
  // 条件2: 窗口刚结束3年内（回头看）
  const justClosed = end < userAge && end >= userAge - 3;
  // 条件3: 窗口即将在5年内开启（向前看）
  const upcoming = start > userAge && start <= userAge + 5;
  return inRange || justClosed || upcoming;
}

// 锁死力可视化条
function LockForceBar({ score }: { score: number }) {
  const config = LOCK_FORCE_LABELS[score] || LOCK_FORCE_LABELS[3];
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={cn(
              'h-1.5 w-3 rounded-sm transition-all',
              i <= score
                ? score >= 4 ? 'bg-red-500/80' : score >= 3 ? 'bg-amber-500/80' : 'bg-blue-500/60'
                : 'bg-muted/30'
            )}
          />
        ))}
      </div>
      <span className={cn('text-[9px] font-medium', config.color)}>{config.label}</span>
    </div>
  );
}

export default function WindowsPage() {
  const { defaultAge, saveDefaultAge, stages } = useAdvancedSettings();
  const [filter, setFilter] = useState<WindowStatus | 'all'>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['青年起步', '壮年奋斗', '中年深耕']));
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  /** 组内"展开全部"：默认每组只露 12 条，避免一展开就是几十张卡 */
  const [groupShowAll, setGroupShowAll] = useState<Set<string>>(new Set());

  /** 每组默认预览条数 */
  const GROUP_PREVIEW = 12;
  const [userAge, setUserAge] = useState<string>(String(defaultAge));
  const [ageTouched, setAgeTouched] = useState(false);
  const [showAgeInput, setShowAgeInput] = useState(false);
  const [aiPlanning, setAiPlanning] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiStreaming, setAiStreaming] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const aiEndRef = useRef<HTMLDivElement>(null);

  // 按 Esc 关 AI 规划面板（先中止流式请求再关），键盘用户不用去找那个 ×
  const closeAiPlanning = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setAiPlanning(false);
  }, []);
  useEscapeKey(closeAiPlanning, aiPlanning);

  const parsedAge = useMemo(() => {
    const n = parseInt(userAge);
    return isNaN(n) || n < 0 || n > 120 ? null : n;
  }, [userAge]);

  // 全局年龄加载完成后同步到本地输入框（用户未手动改过时）
  useEffect(() => {
    if (!ageTouched) setUserAge(String(defaultAge));
  }, [defaultAge, ageTouched]);

  // 手动修改年龄 → 写回全局 default-age（/me、首页图表、/user 偏好共用）
  useEffect(() => {
    if (ageTouched && parsedAge !== null) saveDefaultAge(parsedAge);
  }, [ageTouched, parsedAge, saveDefaultAge]);

  const filtered = useMemo(() => {
    const base = filter === 'all'
      ? lifeWindows.filter(Boolean)
      : lifeWindows.filter(w => w && w.status === filter);
    return base;
  }, [filter]);

  // 分组顺序从可配置的人生阶段派生（/user 改了阶段这里自动跟着变），末尾补非阶段分组
  const groupOrder = useMemo(
    () => [...stages.map(s => s.label), '精英', '其他'],
    [stages]
  );

  const groups: Record<string, typeof lifeWindows> = {};
  for (const w of filtered) {
    if (!w) continue;
    const group = getGroupFromWindow(w, stages);
    if (!groups[group]) groups[group] = [];
    groups[group].push(w);
  }
  // 组内默认按"错过代价"排（锁死力 → 补救代价），别再吐数据录入顺序
  for (const key of Object.keys(groups)) groups[key].sort(byWindowSeverity);

  const stats = useMemo(() => ({
    current: lifeWindows.filter(w => w?.status === 'current').length,
    past: lifeWindows.filter(w => w?.status === 'past').length,
    future: lifeWindows.filter(w => w?.status === 'future').length,
    elite: lifeWindows.filter(w => w?.status === 'elite').length,
  }), []);

  // 用户年龄相关的窗口统计
  const relevantWindows = useMemo(() => {
    if (!parsedAge) return [];
    return lifeWindows.filter(w => w && isAgeRelevant(w, parsedAge));
  }, [parsedAge]);

  // 输入年龄后自动展开包含相关窗口的分组，并滚动到第一个相关分组
  const relevantGroupRef = useRef<string | null>(null);
  useEffect(() => {
    if (!parsedAge || relevantWindows.length === 0) return;
    // 找出包含相关窗口的分组
    const groupsToExpand = new Set<string>();
    let firstGroup: string | null = null;
    for (const w of relevantWindows) {
      const g = getGroupFromWindow(w, stages);
      groupsToExpand.add(g);
      if (!firstGroup) firstGroup = g;
    }
    setExpandedGroups(prev => {
      const next = new Set(prev);
      for (const g of groupsToExpand) next.add(g);
      return next;
    });
    // 延迟滚动，等分组展开渲染完成
    if (firstGroup) {
      relevantGroupRef.current = firstGroup;
      setTimeout(() => {
        const el = document.getElementById(`group-${firstGroup}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [parsedAge, relevantWindows, stages]);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const toggleGroupShowAll = (group: string) => {
    setGroupShowAll(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const toggleCard = (id: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // AI深度规划 - 流式生成
  const startAIPlanning = useCallback(async (question?: string) => {
    setAiStreaming(true);
    setAiContent('');
    abortRef.current = new AbortController();

    const relevantContext = relevantWindows.length > 0
      ? `\n\n用户当前年龄相关窗口：${relevantWindows.map(w => `${w.title}(${w.age}岁,${WINDOW_STATUS_CONFIG[w.status].label})`).join('、')}`
      : '';

    const currentWindows = lifeWindows.filter(w => w?.status === 'current').map(w => `${w.title}(${w.age}岁)`).join('、');

    const systemContext = `你是一位人生战略顾问，专注于长期主义深度规划。用户正在查看"人生关键窗口"面板。
当前活跃窗口：${currentWindows}${relevantContext}

请从以下维度给出深度分析：
1. **时间线梳理**：用户当前最该抓住的窗口和即将关闭的窗口
2. **锁死力评估**：哪些窗口一旦错过将不可逆，哪些还有补救空间
3. **执行优先级**：按紧迫度排序的行动清单
4. **避坑指南**：常见的人生窗口误判和踩坑模式
5. **长期主义策略**：5年/10年/20年的时间线规划和资源分配

要求：直接、有力度、不说废话。用数据和逻辑说话，不要鸡汤。`;

    const historyForApi = aiMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'window',
          item: systemContext,
          question: question || '请给出我当前阶段的长期主义深度规划和避坑指南',
          history: historyForApi,
          ai: getActiveAiConfig(),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error(`请求失败: ${response.status}`);

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
              setAiMessages(prev => [...prev, { role: 'assistant', content: accumulated }]);
              setAiContent('');
              setAiStreaming(false);
              return;
            }
            let parsed: { content?: string; error?: string } | null = null;
            try { parsed = JSON.parse(data); } catch { parsed = null; }
            if (parsed) {
              if (parsed.content) {
                accumulated += parsed.content;
                setAiContent(accumulated);
              }
              if (parsed.error) {
                setAiMessages(prev => [...prev, { role: 'assistant', content: `分析失败：${parsed.error}` }]);
                setAiContent('');
                setAiStreaming(false);
                return;
              }
            }
          }
        }
      }

      if (accumulated) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: accumulated }]);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // cancelled
      } else {
        const errorMsg = error instanceof Error ? error.message : '分析失败';
        setAiMessages(prev => [...prev, { role: 'assistant', content: `分析出错：${errorMsg}` }]);
      }
    } finally {
      setAiContent('');
      setAiStreaming(false);
    }
  }, [relevantWindows, aiMessages]);

  const handleAISend = () => {
    const trimmed = aiQuestion.trim();
    if (!trimmed || aiStreaming) return;
    setAiMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setAiQuestion('');
    startAIPlanning(trimmed);
  };

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiContent, aiMessages]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header —— 编号/图标/提问统一从 module-identity 取 */}
      <ModulePageHead
        href="/windows"
        title="人生关键窗口"
        note="WINDOWS · N=473"
        desc="每个人生阶段都有打开又关闭的窗口。有些错过了就永远关上了，有些只有精英才能看见。看清窗口，才知道什么时候该全力以赴。"
        aside={
          <button
            onClick={() => { setAiPlanning(true); if (aiMessages.length === 0) startAIPlanning(); }}
            className="shrink-0 flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2.5 text-xs font-medium text-primary hover:bg-primary/15 transition-all active:scale-[0.97]"
          >
            <Bot className="h-4 w-4" />
            长期主义深度规划
          </button>
        }
      >

        {/* Stats + Age Input */}
        <div className="flex items-center gap-6 mt-6 animate-fade-in-up stagger-3 flex-wrap">
          {(Object.entries(stats) as [WindowStatus, number][]).map(([key, count]) => {
            const config = WINDOW_STATUS_CONFIG[key];
            return (
              <div key={key} className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', key === 'current' ? 'bg-green-500' : key === 'past' ? 'bg-muted-foreground/30' : key === 'future' ? 'bg-amber-500' : 'bg-primary')} />
                <span className={cn('text-lg font-semibold font-mono tabular-nums', config.color)}>{count}</span>
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
            );
          })}

          <div className="h-4 w-px bg-border" />

          {/* 自定义年龄 */}
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            {showAgeInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={userAge}
                  onChange={e => { setUserAge(e.target.value); setAgeTouched(true); }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && parsedAge !== null && relevantWindows.length > 0) {
                      const firstW = relevantWindows[0];
                      if (firstW) {
                        const g = getGroupFromWindow(firstW, stages);
                        const el = document.getElementById(`group-${g}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }}
                  placeholder="输入年龄"
                  className="w-20 rounded-md border border-border bg-background px-2 py-1 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  autoFocus
                />
                <span className="text-xs text-muted-foreground">岁</span>
                {parsedAge !== null && (
                  <>
                    <button
                      onClick={() => {
                        if (relevantWindows.length > 0) {
                          const firstW = relevantWindows[0];
                          if (firstW) {
                            const g = getGroupFromWindow(firstW, stages);
                            const el = document.getElementById(`group-${g}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }}
                      className="flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/15 transition-colors"
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      {relevantWindows.length}个相关窗口
                    </button>
                  </>
                )}
                <button onClick={() => { setShowAgeInput(false); setAgeTouched(false); setUserAge(String(defaultAge)); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAgeInput(true)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                年龄已设为 <span className="font-mono text-foreground/70">{defaultAge}</span> 岁 · 点击修改
              </button>
            )}
          </div>
        </div>

        {/* Alert for current windows */}
        {stats.current > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800/30 px-3 py-2 animate-fade-in-up stagger-4">
            <AlertTriangle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0" />
            <span className="text-xs text-green-700 dark:text-green-400">
              你当前有 <span className="font-semibold">{stats.current}</span> 个人生窗口正在开启，请重点关注
            </span>
          </div>
        )}

      </ModulePageHead>

      {/*
        筛选 + 分组跳转。
        top-12：移动端有一条 fixed 的 h-12 顶栏（见 app-sidebar），
        原来写 top-0 会被它整个盖住——手机上等于没有吸顶筛选。
        小屏横向滚动，别把按钮挤出屏幕外。
      */}
      <div className="sticky top-12 md:top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-2.5 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1 shrink-0" />
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'shrink-0 inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all',
                filter === opt.value
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              )}
            >
              {opt.dotColor && <span className={cn('h-1.5 w-1.5 rounded-full', opt.dotColor)} />}
              {opt.label}
            </button>
          ))}
        </div>

        {/* 分段跳转：小屏才知道自己在哪一段 */}
        <div className="max-w-5xl mx-auto">
          <SectionJumper
            sections={groupOrder
              .filter(g => groups[g] && groups[g].length > 0)
              .map(g => ({ id: `group-${g}`, label: g, count: groups[g].length }))}
            offset={140}
          />
        </div>
      </div>

      {/* Window Cards by Group */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        {groupOrder.map(groupName => {
          const items = groups[groupName];
          if (!items || items.length === 0) return null;
          const isExpanded = expandedGroups.has(groupName);
          const showAll = groupShowAll.has(groupName);
          const visibleItems = showAll ? items : items.slice(0, GROUP_PREVIEW);

          return (
            <div key={groupName} id={`group-${groupName}`} className="mb-6 scroll-mt-36 md:scroll-mt-20">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(groupName)}
                className="w-full flex items-center gap-3 mb-3 group"
              >
                <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{groupName}</h2>
                <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">
                  {WINDOW_GROUP_LABELS[groupName] || `${items.length}项`}
                </span>
                {parsedAge !== null && items.some(w => isAgeRelevant(w, parsedAge)) && (
                  <span className="flex items-center gap-0.5 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                    <Sparkles className="h-2.5 w-2.5" />
                    {items.filter(w => isAgeRelevant(w, parsedAge!)).length}个与你相关
                  </span>
                )}
                <TickRule className="flex-1" />
                <div className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </div>
              </button>

              {/* Cards */}
              {isExpanded && (
                <>
                <Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visibleItems.map((w, idx) => {
                    const config = WINDOW_STATUS_CONFIG[w.status];
                    const isCardExpanded = expandedCards.has(w.id);
                    const isRelevant = parsedAge !== null && isAgeRelevant(w, parsedAge);
                    const remedyConfig = REMEDY_LEVEL_CONFIG[w.remedyLevel];
                    const missConfig = MISS_TYPE_CONFIG[w.missType];

                    return (
                      <div
                        key={w.id}
                        onClick={() => toggleCard(w.id)}
                        className={cn(
                          'rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] cursor-pointer group/card',
                          config.bgColor,
                          isRelevant
                            ? 'ring-2 ring-primary/70 ring-offset-2 ring-offset-background shadow-[0_0_12px_rgba(184,134,11,0.15)]'
                            : '',
                          isCardExpanded && 'col-span-1 sm:col-span-2 lg:col-span-1',
                          'animate-fade-in-up',
                          idx < 8 ? `stagger-${idx + 1}` : ''
                        )}
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={cn('text-[10px] font-mono font-medium tabular-nums', config.color)}>
                            {w.age}岁
                          </span>
                          <div className="flex items-center gap-1.5">
                            {/* 补救代价标签 */}
                            <span className={cn(
                              'rounded-md px-1.5 py-0.5 text-[9px] font-medium',
                              w.remedyLevel === 'irreversible' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                              w.remedyLevel === 'extreme' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                              'bg-muted/60 text-muted-foreground'
                            )}>
                              {remedyConfig.label}
                            </span>
                            {/* 状态标签 */}
                            <span className={cn(
                              'rounded-md px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide',
                              w.status === 'current' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                              w.status === 'elite' ? 'bg-primary/10 text-primary' :
                              'bg-muted/60 text-muted-foreground'
                            )}>
                              {config.label}
                            </span>
                            {isRelevant && (
                              <span className="flex items-center gap-0.5 rounded-md bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold text-primary animate-glow-pulse">
                                <Sparkles className="h-2.5 w-2.5" />
                                与你相关
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-sm font-semibold text-foreground mb-1.5">{w.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{w.description}</p>

                        {/* 锁死力 + 标签行 */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lock className="h-3 w-3 text-muted-foreground/50" />
                            <LockForceBar score={w.lockForceScore} />
                          </div>
                          {w.tag && (
                            <span className="rounded-md bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              {w.tag}
                            </span>
                          )}
                        </div>

                        {/* 展开详情 */}
                        {isCardExpanded && (
                          <div className="mt-3 pt-3 border-t border-border/50 space-y-2.5 animate-fade-in-up">
                            {/* 最佳执行期 */}
                            <div className="flex items-start gap-2">
                              <Target className="h-3 w-3 text-primary/60 mt-0.5 shrink-0" />
                              <div>
                                <span className="text-[10px] font-medium text-muted-foreground/60">最佳执行期</span>
                                <p className="text-xs text-foreground font-medium">{w.bestExecuteAge}</p>
                              </div>
                            </div>

                            {/* 执行阶段 */}
                            <div className="flex items-start gap-2">
                              <Layers className="h-3 w-3 text-primary/60 mt-0.5 shrink-0" />
                              <div>
                                <span className="text-[10px] font-medium text-muted-foreground/60">执行阶段</span>
                                <p className="text-xs text-foreground font-medium">{w.executePhase}</p>
                              </div>
                            </div>

                            {/* 错过类型 */}
                            <div className="flex items-start gap-2">
                              <XCircle className={cn('h-3 w-3 mt-0.5 shrink-0', missConfig.color)} />
                              <div>
                                <span className="text-[10px] font-medium text-muted-foreground/60">错过类型</span>
                                <p className={cn('text-xs font-medium', missConfig.color)}>
                                  {missConfig.label}
                                  <span className="text-muted-foreground font-normal ml-1.5">{missConfig.description}</span>
                                </p>
                              </div>
                            </div>

                            {/* 强制锁死力说明 */}
                            <div className="flex items-start gap-2">
                              <Lock className="h-3 w-3 text-muted-foreground/50 mt-0.5 shrink-0" />
                              <div>
                                <span className="text-[10px] font-medium text-muted-foreground/60">锁死机制</span>
                                <p className="text-xs text-foreground">{w.lockedForce}</p>
                              </div>
                            </div>

                            {/* 补救代价说明 */}
                            <div className="flex items-start gap-2">
                              <ShieldAlert className={cn('h-3 w-3 mt-0.5 shrink-0', remedyConfig.color)} />
                              <div>
                                <span className="text-[10px] font-medium text-muted-foreground/60">事后补救代价</span>
                                <p className={cn('text-xs font-medium', remedyConfig.color)}>
                                  {remedyConfig.label}
                                  <span className="text-muted-foreground font-normal ml-1.5">{w.remedyCost}</span>
                                </p>
                              </div>
                            </div>

                            {/* AI 分析此窗口 */}
                            <div className="mt-3 pt-2.5 border-t border-border/30">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAiPlanning(true);
                                  if (aiMessages.length === 0 || aiMessages[aiMessages.length - 1]?.role !== 'assistant' || !aiMessages[aiMessages.length - 1]?.content.includes(w.title)) {
                                    startAIPlanning(`请深入分析人生窗口"${w.title}"（${w.age}岁）：\n1. 这个窗口的核心机遇和风险\n2. 锁死力${w.lockForceScore}/5意味着什么\n3. 错过类型"${missConfig.label}"的具体后果\n4. 最佳执行策略和行动清单\n5. 如果已错过，还有什么补救路径`);
                                  }
                                }}
                                className="w-full flex items-center justify-center gap-1.5 rounded-md bg-primary/8 border border-primary/15 px-3 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/15 transition-all active:scale-[0.98]"
                              >
                                <Bot className="h-3 w-3" />
                                AI 深度分析此窗口
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 展开/收起提示 */}
                        {!isCardExpanded && (
                          <div className="mt-2 text-[9px] text-muted-foreground/30 text-center">
                            点击展开详情
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                </Reveal>

                {items.length > GROUP_PREVIEW && (
                  <button
                    onClick={() => toggleGroupShowAll(groupName)}
                    className="mt-3 w-full rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {showAll ? '收起' : `展开其余 ${items.length - GROUP_PREVIEW} 个`}
                  </button>
                )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom context */}
      <div className="border-t border-border bg-muted/10">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-primary/60" /> 锁死力等级
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                锁死力衡量窗口的强制程度。5级=不可逆（如身高发育期），3级=中等约束（如习惯形成），1级=几乎自由选择。
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <ShieldAlert className="h-3 w-3 text-primary/60" /> 补救代价
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                窗口关闭后的弥补难度。不可逆=永远无法弥补，代价极高=需要数倍努力，可弥补=尚有空间但需行动。
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Target className="h-3 w-3 text-primary/60" /> 如何使用
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                设置你的年龄查看相关窗口，点击卡片展开详情。重点关注&quot;当前&quot;窗口和锁死力5级的窗口——错过了就永远关上了。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI 深度规划面板 */}
      {aiPlanning && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => { if (abortRef.current) abortRef.current.abort(); setAiPlanning(false); }}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-background border-l border-border shadow-2xl animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wider uppercase">AI STRATEGIST</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground truncate">长期主义深度规划</h3>
                </div>
              </div>
              <button
                onClick={() => { if (abortRef.current) abortRef.current.abort(); setAiPlanning(false); }}
                className="shrink-0 ml-2 h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Context card */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs text-foreground/80 leading-relaxed">
                  基于你的人生窗口数据，AI将给出多维度战略分析：时间线梳理、锁死力评估、执行优先级、避坑指南和长期主义策略。
                  {parsedAge !== null && <span className="text-primary font-medium"> 当前年龄：{parsedAge}岁</span>}
                </p>
              </div>

              {/* Chat messages */}
              {aiMessages.map((msg, i) => (
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
              {aiStreaming && aiContent && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-lg px-4 py-3 text-sm leading-relaxed bg-card border border-border text-foreground">
                    <div className="whitespace-pre-wrap">{aiContent}</div>
                    <span className="inline-block w-1.5 h-4 bg-primary/60 animate-blink ml-0.5 -mb-0.5" />
                  </div>
                </div>
              )}

              {/* Loading */}
              {aiStreaming && !aiContent && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-lg px-4 py-3 bg-card border border-border">
                    <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground">正在分析...</span>
                  </div>
                </div>
              )}

              <div ref={aiEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={e => setAiQuestion(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAISend(); } }}
                  placeholder="追问具体窗口或策略..."
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  disabled={aiStreaming}
                />
                <button
                  onClick={handleAISend}
                  disabled={aiStreaming || !aiQuestion.trim()}
                  className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                 aria-label="发送追问">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
