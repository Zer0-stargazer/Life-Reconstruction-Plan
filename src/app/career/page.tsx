'use client';

import { useState, useMemo, useEffect } from 'react';
import { careers, CAREER_CATEGORIES, type Career, getTutorials, getBooks, getLearningChannels, getAiAdvice } from '@/data/careers';
import { cn } from '@/lib/utils';
import {
  Briefcase, TrendingUp, TrendingDown, Minus, Bot, Filter, X, BarChart3,
  ArrowUpRight, ArrowDownRight, MinusCircle, Sparkles,
  GraduationCap, BookOpen, Video,
  ChevronDown, ChevronUp, MessageSquare, Star, AlertTriangle,
} from 'lucide-react';
import { AIAnalysisPanel } from '@/components/ai/ai-analysis-panel';
import { Reveal } from '@/components/shared/reveal';
import { ModulePageHead } from '@/components/shared/module-page-head';

// ============================================================
// 常量
// ============================================================

const trendIcon = { up: TrendingUp, stable: Minus, down: TrendingDown };
const trendColor = {
  up: 'text-green-600 dark:text-green-400',
  stable: 'text-amber-600 dark:text-amber-400',
  down: 'text-red-600 dark:text-red-400',
};
const trendBg = {
  up: 'bg-green-50 dark:bg-green-950/30',
  stable: 'bg-amber-50 dark:bg-amber-950/30',
  down: 'bg-red-50 dark:bg-red-950/30',
};
const trendLabel = { up: '上升', stable: '平稳', down: '下降' };
const trendArrow = { up: ArrowUpRight, stable: MinusCircle, down: ArrowDownRight };

const aiRiskColor = {
  high: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
  medium: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  low: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400',
};
const aiRiskLabel = { high: '高风险', medium: '中风险', low: '低风险' };
const aiRiskBar = { high: 85, medium: 50, low: 15 };

const selfStudyColor = (score: number) => {
  if (score >= 8) return 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400';
  if (score >= 5) return 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400';
  return 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400';
};

const selfStudyLabel = (score: number) => {
  if (score >= 8) return '自学友好';
  if (score >= 5) return '自学中等';
  return '自学较难';
};

const tutorialTypeIcon = {
  video: Video,
  course: GraduationCap,
};

const tutorialTypeLabel = {
  video: '视频',
  course: '课程',
};

// ============================================================
// 排序类型
// ============================================================

type SortKey = 'salary' | 'aiRisk' | 'trend' | 'selfStudy';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'salary', label: '年收入' },
  { value: 'selfStudy', label: '自学指数' },
  { value: 'aiRisk', label: 'AI风险' },
  { value: 'trend', label: '趋势' },
];

/** 解析薪资字符串中的下限（万为单位） */
function parseSalaryLower(salary: string): number {
  const match = salary.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/** 排序比较函数 */
function getSortValue(career: Career, key: SortKey): number {
  switch (key) {
    case 'salary': return parseSalaryLower(career.salary);
    case 'selfStudy': return career.selfStudyScore;
    case 'aiRisk': return career.aiRisk === 'high' ? 0 : career.aiRisk === 'medium' ? 1 : 2;
    case 'trend': return career.trend === 'up' ? 0 : career.trend === 'stable' ? 1 : 2;
  }
}

/** 快看组：一眼能看到的两极——最好的和最危险的 */
function QuickLookGroup({
  tone,
  title,
  hint,
  icon: Icon,
  items,
  onPick,
}: {
  tone: 'good' | 'bad';
  title: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Career[];
  onPick: (c: Career) => void;
}) {
  const shell = tone === 'good'
    ? 'border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/10'
    : 'border-red-200/60 dark:border-red-800/40 bg-red-50/40 dark:bg-red-950/10';
  const iconColor = tone === 'good' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className={cn('rounded-xl border p-4', shell)}>
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className={cn('h-3.5 w-3.5', iconColor)} />
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="truncate text-[10px] text-muted-foreground/70">{hint}</span>
      </div>
      <div className="space-y-1.5">
        {items.map(c => (
          <button
            key={c.id}
            onClick={() => onPick(c)}
            className="flex w-full items-center gap-2 rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-left transition-all hover:border-primary/30 hover:bg-card active:scale-[0.99]"
          >
            <span className="truncate text-sm font-medium text-foreground">{c.name}</span>
            <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">{c.salary}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 主组件
// ============================================================

export default function CareerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSorts, setActiveSorts] = useState<SortKey[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const [showResources, setShowResources] = useState<number | null>(null);
  const [aiPanel, setAiPanel] = useState<{ open: boolean; career: Career | null }>({ open: false, career: null });

  // 排序切换
  const toggleSort = (key: SortKey) => {
    setActiveSorts(prev => {
      if (prev.includes(key)) return prev.filter(k => k !== key);
      return [...prev, key];
    });
  };

  // 过滤 + 排序
  const filtered = useMemo(() => {
    let result = selectedCategory === 'all'
      ? careers
      : careers.filter(c => c.category === selectedCategory);

    if (activeSorts.length > 0) {
      result = [...result].sort((a, b) => {
        for (const sortKey of activeSorts) {
          const va = getSortValue(a, sortKey);
          const vb = getSortValue(b, sortKey);
          if (va !== vb) {
            // salary 和 selfStudy 降序（高→低），aiRisk 和 trend 升序（好→坏）
            if (sortKey === 'salary' || sortKey === 'selfStudy') return vb - va;
            return va - vb;
          }
        }
        return 0;
      });
    } else {
      // 默认口径（全站统一：前面几条必须是最要紧的）：
      // 趋势上升 → AI 风险低 → 年薪高。选了排序 chip 就以用户选择为准。
      result = [...result].sort((a, b) =>
        getSortValue(a, 'trend') - getSortValue(b, 'trend') ||
        getSortValue(b, 'aiRisk') - getSortValue(a, 'aiRisk') ||
        parseSalaryLower(b.salary) - parseSalaryLower(a.salary)
      );
    }

    return result;
  }, [selectedCategory, activeSorts]);

  /** 快看组：黄金赛道（趋势上升 + AI 低风险）与高危赛道（趋势下降 + AI 高风险） */
  const goldenCareers = useMemo(
    () => filtered
      .filter(c => c.trend === 'up' && c.aiRisk === 'low')
      .sort((a, b) => parseSalaryLower(b.salary) - parseSalaryLower(a.salary))
      .slice(0, 3),
    [filtered]
  );
  const riskyCareers = useMemo(
    () => filtered
      .filter(c => c.trend === 'down' && c.aiRisk === 'high')
      .sort((a, b) => parseSalaryLower(b.salary) - parseSalaryLower(a.salary))
      .slice(0, 3),
    [filtered]
  );

  // 全量渲染会卡：先渲染一小页，点击"加载更多"再追加
  const PAGE_SIZE = 24;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [selectedCategory, activeSorts]);
  const visibleCareers = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hiddenCount = filtered.length - visibleCareers.length;

  const aiHighRisk = careers.filter(c => c.aiRisk === 'high').length;
  const trendingUp = careers.filter(c => c.trend === 'up').length;
  const aiLowRisk = careers.filter(c => c.aiRisk === 'low').length;

  const selected = selectedCareer !== null ? careers.find(c => c.id === selectedCareer) : null;

  // Salary distribution
  const salaryBuckets = useMemo(() => {
    const buckets = { '0-15W': 0, '15-30W': 0, '30-50W': 0, '50W+': 0 };
    careers.forEach(c => {
      const low = parseSalaryLower(c.salary);
      if (low < 15) buckets['0-15W']++;
      else if (low < 30) buckets['15-30W']++;
      else if (low < 50) buckets['30-50W']++;
      else buckets['50W+']++;
    });
    return buckets;
  }, []);
  const maxBucket = Math.max(...Object.values(salaryBuckets));

  return (
    <div className="min-h-screen bg-background">
      {/* Header —— 编号/图标/提问统一从 module-identity 取 */}
      <ModulePageHead
        href="/career"
        title="职业遍历"
        note={`N=${careers.length}`}
        desc="选对赛道比努力更重要。浏览各行各业的薪资、趋势和AI替代风险，找到你的最优职业策略。"
      >
        {/* Stats */}
        <div className="flex items-center gap-6 mt-6 flex-wrap animate-fade-in-up stagger-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-red-500" />
            <span className="text-lg font-semibold font-mono tabular-nums">{aiHighRisk}</span>
            <span className="text-xs text-muted-foreground">个AI高风险</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-lg font-semibold font-mono tabular-nums">{trendingUp}</span>
            <span className="text-xs text-muted-foreground">个趋势上升</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-green-500" />
            <span className="text-lg font-semibold font-mono tabular-nums">{aiLowRisk}</span>
            <span className="text-xs text-muted-foreground">个AI低风险</span>
          </div>
        </div>
      </ModulePageHead>

      {/* Salary Distribution */}
      <div className="border-b border-border bg-muted/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">薪资分布</span>
          </div>
          <div className="flex items-end gap-3">
            {Object.entries(salaryBuckets).map(([range, count]) => (
              <div key={range} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[9px] font-mono text-muted-foreground tabular-nums">{count}</span>
                <div className="w-full bg-muted rounded-sm overflow-hidden" style={{ height: '40px' }}>
                  <div
                    className="w-full bg-primary/30 rounded-sm transition-all duration-500"
                    style={{ height: `${(count / maxBucket) * 100}%`, marginTop: `${100 - (count / maxBucket) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters
          top-12：移动端有一条 fixed 的 h-12 顶栏，写 top-0 会被它盖住（见 app-sidebar） */}
      <div className="sticky top-12 md:top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3">
          {/* 分类多，小屏一行放不下：横向滚动而不是挤成一团 */}
          <div className="flex items-center gap-2 mb-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-visible">
            <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1 shrink-0" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'shrink-0 rounded-md px-3 py-2 sm:py-1.5 text-xs font-medium transition-all',
                selectedCategory === 'all' ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-accent/60'
              )}
            >
              全部
            </button>
            {CAREER_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'shrink-0 rounded-md px-3 py-2 sm:py-1.5 text-xs font-medium transition-all',
                  selectedCategory === cat ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-accent/60'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* 排序 chip：手机上 py-0.5 的点击区按不住，加大到 32px 高 */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide sm:overflow-visible">
            <span className="shrink-0 text-[9px] text-muted-foreground/50">
              {activeSorts.length === 0 ? '默认：趋势上升 → AI 低风险 → 年薪高' : '排序（可多选）'}
            </span>
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggleSort(opt.value)}
                className={cn(
                  'shrink-0 rounded-sm px-2.5 py-1.5 sm:py-0.5 text-[10px] font-medium transition-all flex items-center gap-1',
                  activeSorts.includes(opt.value) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
                )}
              >
                {opt.label}
                {activeSorts.includes(opt.value) && (
                  <span className="text-[8px] text-primary/60">
                    {activeSorts.indexOf(opt.value) + 1}
                  </span>
                )}
              </button>
            ))}
            {activeSorts.length > 0 && (
              <button
                onClick={() => setActiveSorts([])}
                className="rounded-sm px-1.5 py-0.5 text-[9px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                清除
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        {/* 快看：757 条里先看两极 */}
        {(goldenCareers.length > 0 || riskyCareers.length > 0) && (
          <Reveal className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goldenCareers.length > 0 && (
                <QuickLookGroup
                  tone="good"
                  title="黄金赛道"
                  hint="趋势上升 · AI 低风险 · 薪资最高"
                  icon={Sparkles}
                  items={goldenCareers}
                  onPick={(c) => setSelectedCareer(c.id)}
                />
              )}
              {riskyCareers.length > 0 && (
                <QuickLookGroup
                  tone="bad"
                  title="高危赛道"
                  hint="趋势下降 · AI 高风险"
                  icon={AlertTriangle}
                  items={riskyCareers}
                  onPick={(c) => setSelectedCareer(c.id)}
                />
              )}
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Career Grid */}
          <div className={cn('lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start')}>
            {/* 显示进度读数 */}
            <div className="col-span-full flex items-center justify-between font-mono text-[10px] text-muted-foreground/60 mb-1">
              <span>SHOWING {visibleCareers.length} / {filtered.length}</span>
              {filtered.length !== careers.length && <span>FILTER: {selectedCategory === 'all' ? 'ALL' : selectedCategory.toUpperCase()}</span>}
            </div>
            {visibleCareers.map((career, ci) => {
              const TrendIcon = trendIcon[career.trend];
              const isExpanded = showResources === career.id;
              return (
                <Reveal key={career.id} delay={Math.min(ci, 11) * 35}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedCareer(selectedCareer === career.id ? null : career.id);
                      setShowResources(null);
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCareer(selectedCareer === career.id ? null : career.id); setShowResources(null); } }}
                    className={cn(
                      'w-full text-left rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md active:scale-[0.99] card-hover cursor-pointer',
                      selectedCareer === career.id ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-foreground">{career.name}</h3>
                      <TrendIcon className={cn('h-4 w-4 shrink-0', trendColor[career.trend])} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{career.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-sm bg-muted px-2 py-0.5 text-[11px] font-mono text-foreground tabular-nums">
                        {career.salary}
                      </span>
                      <span className={cn('rounded-sm px-2 py-0.5 text-[10px] font-medium', aiRiskColor[career.aiRisk])}>
                        AI{aiRiskLabel[career.aiRisk]}
                      </span>
                      <span className={cn('rounded-sm px-1.5 py-0.5 text-[9px] font-medium flex items-center gap-0.5', selfStudyColor(career.selfStudyScore))}>
                        <Star className="h-2.5 w-2.5" />
                        自学{career.selfStudyScore}
                      </span>
                      <span className="rounded-sm bg-muted/50 px-2 py-0.5 text-[9px] text-muted-foreground">
                        {career.category}
                      </span>
                      <span
                        onClick={(e) => { e.stopPropagation(); setAiPanel({ open: true, career }); }}
                        className="ml-auto rounded-sm bg-primary/5 px-2 py-0.5 text-[9px] text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        分析
                      </span>
                    </div>
                    {/* 资源入口 */}
                    <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowResources(isExpanded ? null : career.id); }}
                        className="flex items-center gap-1 text-[10px] text-primary/60 hover:text-primary transition-colors"
                      >
                        <GraduationCap className="h-3 w-3" />
                        <span>学习资源 · {getTutorials(career).length} 项</span>
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                      <span className="text-[9px] text-muted-foreground/40">{selfStudyLabel(career.selfStudyScore)}</span>
                    </div>
                  </div>

                  {/* 展开的资源面板 */}
                  {isExpanded && (
                    <div className="rounded-b-lg border border-t-0 border-border bg-card/50 px-4 pb-4 pt-2 animate-fade-in-up">
                      <div className="space-y-2.5">
                        {getTutorials(career).map((t, i) => {
                          const TypeIcon = tutorialTypeIcon[t.type];
                          return (
                            <div key={i} className="group flex items-start gap-2.5">
                              <div className={cn(
                                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-[10px]',
                                t.type === 'course' ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' :
                                'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                              )}>
                                <TypeIcon className="h-3 w-3" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] text-muted-foreground/50 uppercase">{tutorialTypeLabel[t.type]}</span>
                                  <span className="text-[9px] text-muted-foreground/30">·</span>
                                  <span className="text-[9px] text-muted-foreground/50">{t.platform}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-medium text-foreground">{t.title}</span>
                                </div>
                                {t.note && (
                                  <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-relaxed">{t.note}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* 书籍 */}
                      {getBooks(career).length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-border/30">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <BookOpen className="h-3 w-3 text-muted-foreground/40" />
                            <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">推荐书籍</span>
                          </div>
                          <div className="space-y-1">
                            {getBooks(career).map((b, i) => (
                              <p key={i} className="text-[10px] text-muted-foreground">
                                <span className="font-medium text-foreground/70">{b.title}</span>
                                <span className="text-muted-foreground/40"> — {b.author}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Reveal>
              );
            })}
            {/* 加载更多 */}
            {hiddenCount > 0 && (
              <button
                onClick={() => setVisibleCount(v => v + PAGE_SIZE * 2)}
                className="col-span-full rounded-lg border border-dashed border-border py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                加载更多 · 还有 <span className="font-mono tabular-nums">{hiddenCount}</span> 个
              </button>
            )}
            {hiddenCount === 0 && filtered.length > PAGE_SIZE && (
              <div className="col-span-full py-2 text-center font-mono text-[10px] text-muted-foreground/40">
                END · 已显示全部 {filtered.length} 个职业
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="rounded-lg border border-primary/20 bg-card p-5 sticky top-20 animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif font-semibold text-foreground">{selected.name}</h3>
                  <button onClick={() => setSelectedCareer(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{selected.description}</p>

                <div className="space-y-3">
                  {/* Salary */}
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">薪资范围</span>
                    <span className="text-sm font-mono font-semibold text-foreground tabular-nums">{selected.salary}</span>
                  </div>

                  {/* Self Study Score */}
                  <div className="py-2 border-b border-border/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">自学推荐指数</span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn('rounded-sm px-2 py-0.5 text-[10px] font-medium', selfStudyColor(selected.selfStudyScore))}>
                          {selected.selfStudyScore}/10
                        </span>
                        <span className="text-[10px] text-muted-foreground">{selfStudyLabel(selected.selfStudyScore)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          selected.selfStudyScore >= 8 ? 'bg-green-500/60' : selected.selfStudyScore >= 5 ? 'bg-amber-500/60' : 'bg-red-500/60'
                        )}
                        style={{ width: `${selected.selfStudyScore * 10}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground/50 mt-1">
                      {selected.selfStudyDifficulty === 'easy' ? '自学门槛低，适合自学入门' :
                       selected.selfStudyDifficulty === 'medium' ? '需要一定基础，自学可行' : '自学门槛高，建议系统学习'}
                    </p>
                  </div>

                  {/* Trend with visual */}
                  <div className="py-2 border-b border-border/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">趋势</span>
                      <span className={cn('text-sm font-medium flex items-center gap-1', trendColor[selected.trend])}>
                        {trendLabel[selected.trend]}
                        {(() => { const ArrowIcon = trendArrow[selected.trend]; return <ArrowIcon className="h-3.5 w-3.5" />; })()}
                      </span>
                    </div>
                    <div className={cn('h-1.5 rounded-full overflow-hidden', trendBg[selected.trend])}>
                      <div
                        className={cn(
                          'h-full rounded-full',
                          selected.trend === 'up' ? 'bg-green-500/50' : selected.trend === 'down' ? 'bg-red-500/50' : 'bg-amber-500/50'
                        )}
                        style={{ width: selected.trend === 'up' ? '80%' : selected.trend === 'stable' ? '50%' : '20%' }}
                      />
                    </div>
                  </div>

                  {/* AI Risk with visual bar */}
                  <div className="py-2 border-b border-border/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">AI替代风险</span>
                      <span className={cn('rounded-sm px-2 py-0.5 text-[10px] font-medium', aiRiskColor[selected.aiRisk])}>
                        {aiRiskLabel[selected.aiRisk]}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          selected.aiRisk === 'high' ? 'bg-red-500/50' : selected.aiRisk === 'medium' ? 'bg-amber-500/50' : 'bg-green-500/50'
                        )}
                        style={{ width: `${aiRiskBar[selected.aiRisk]}%` }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">行业</span>
                    <span className="text-sm text-foreground">{selected.category}</span>
                  </div>

                  {/* Key Skill */}
                  <div className="py-2">
                    <span className="text-xs text-muted-foreground block mb-1.5">核心技能</span>
                    <span className="rounded-sm bg-primary/5 border border-primary/10 px-2.5 py-1.5 text-xs text-foreground">
                      {selected.keySkill}
                    </span>
                  </div>
                </div>

                {/* Learning Resources in Detail Panel */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-primary/60" />
                    <h4 className="text-xs font-semibold text-foreground">推荐学习资源</h4>
                    <span className="text-[9px] text-muted-foreground/40">{getTutorials(selected).length} 项</span>
                  </div>

                  <div className="space-y-2">
                    {getTutorials(selected).map((t, i) => {
                      const TypeIcon = tutorialTypeIcon[t.type];
                      return (
                        <div key={i} className="group rounded-md border border-border/50 bg-background/50 p-2.5 hover:border-primary/20 transition-colors">
                          <div className="flex items-start gap-2">
                            <div className={cn(
                              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm',
                              t.type === 'course' ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' :
                              'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                            )}>
                              <TypeIcon className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[8px] text-muted-foreground/40 uppercase font-medium">{tutorialTypeLabel[t.type]}</span>
                                <span className="text-[8px] text-muted-foreground/30">·</span>
                                <span className="text-[8px] text-muted-foreground/40">{t.platform}</span>
                              </div>
                              <span className="text-xs font-medium text-foreground">{t.title}</span>
                              {t.note && (
                                <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-relaxed">{t.note}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Books */}
                  {getBooks(selected).length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-3.5 w-3.5 text-primary/60" />
                        <h4 className="text-xs font-semibold text-foreground">推荐书籍</h4>
                      </div>
                      <div className="space-y-1.5">
                        {getBooks(selected).map((b, i) => (
                          <div key={i} className="rounded-md border border-border/50 bg-background/50 px-2.5 py-2 hover:border-primary/20 transition-colors">
                            <p className="text-xs font-medium text-foreground">{b.title}</p>
                            <p className="text-[10px] text-muted-foreground/50">{b.author}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Channels */}
                  {getLearningChannels(selected).length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-3 w-3 text-primary/60" />
                        <h4 className="text-[10px] font-semibold text-foreground">学习渠道</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {getLearningChannels(selected).map((ch, i) => (
                          <span key={i} className="rounded-sm bg-muted/50 px-2 py-0.5 text-[9px] text-muted-foreground">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Strategic insight */}
                <div className="mt-4 p-3 rounded-md bg-muted/30 border border-border/50">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {selected.aiRisk === 'high'
                      ? '⚠ 这个职业面临较高的AI替代风险。建议提前布局转型或建立AI无法替代的差异化优势。'
                      : selected.aiRisk === 'low'
                      ? '✓ AI替代风险较低，职业稳定性较好。但也需要关注行业结构性变化。'
                      : '◐ AI替代风险中等。部分工作内容可能被AI辅助，但核心价值仍然依赖人类判断。'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center sticky top-20">
                <Briefcase className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-xs text-muted-foreground">点击任意职业查看详情</p>
                <p className="text-[10px] text-muted-foreground/50 mt-1">包括薪资、趋势、AI风险分析</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom context */}
      <div className="border-t border-border bg-muted/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Reveal delay={0}>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground mb-1.5">赛道 &gt; 努力</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">在上升赛道里，普通人也能借势起飞。在下降赛道里，天才也会被趋势拖垮。选赛道是第一个关键决策。</p>
            </div>
            </Reveal>
            <Reveal delay={80}>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground mb-1.5">AI是你的对手还是队友？</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">AI不是来抢你工作的——它是来改变工作方式的。了解风险，提前布局，让AI成为你的加速器而非替代者。</p>
            </div>
            </Reveal>
            <Reveal delay={160}>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground mb-1.5">自学是最大的杠杆</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">自学推荐指数高的职业，意味着你不需要昂贵的学位就能入门。善用免费资源，把时间变成技能。</p>
            </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* AI Analysis Panel */}
      {aiPanel.career && (
        <AIAnalysisPanel
          open={aiPanel.open}
          onClose={() => setAiPanel({ open: false, career: null })}
          module="career"
          moduleLabel="职业分析"
          itemTitle={aiPanel.career.name}
          itemDescription={`行业：${aiPanel.career.category} | 薪资：${aiPanel.career.salary} | 趋势：${trendLabel[aiPanel.career.trend]} | AI替代风险：${aiRiskLabel[aiPanel.career.aiRisk]}\n自学推荐指数：${aiPanel.career.selfStudyScore}/10 | 自学难度：${aiPanel.career.selfStudyDifficulty}\n核心技能：${aiPanel.career.keySkill}\n\n${aiPanel.career.description}\n\n${getAiAdvice(aiPanel.career)}`}
        />
      )}
    </div>
  );
}
