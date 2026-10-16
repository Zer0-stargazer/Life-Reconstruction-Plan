'use client';

import { MeterBar } from '@/components/shared/meter-bar';
import { AuthorNote } from '@/components/shared/author-note';
import { scrollToTop } from '@/lib/motion';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ModulePageHead } from '@/components/shared/module-page-head';
import { AiMarkdown } from '@/components/shared/ai-markdown';
import { AiCursor, AiPromptChips, AiCopyButton, AiStopButton, AiLoadingBubble, AiThinkingBlock, AiErrorNotice, AiStoppedNote } from '@/components/ai/ai-panel-actions';
import { useAiChat, toApiHistory } from '@/components/ai/use-ai-chat';
import { useLockedAction } from '@/hooks/use-locked-action';
import { getActiveAiConfig } from '@/lib/active-ai-client';
import { useAdvancedSettings } from '@/hooks/use-advanced-settings';
import { usePersistedState } from '@/hooks/use-persisted-state';
import { useEscapeKey } from '@/hooks/use-escape-key';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { ModuleGate } from '@/components/auth/module-gate';
import { Reveal } from '@/components/shared/reveal';
import {
  HEALTH_DOMAINS,
  HEALTH_QUESTIONS,
  HEALTH_TAG_CONFIG,
  HEALTH_TIER_CONFIG,
  scoreDomains,
  overallScore,
  weakestDomains,
  keySignals,
  type DomainScore,
  type HealthDomainId,
} from '@/data/health';
import {
  RotateCcw, Bot, X, Send, ClipboardCheck, ArrowRight, BarChart3,
  Sparkles, AlertTriangle, ChevronRight, Activity,
} from 'lucide-react';

// ============================================================
// 子域配色（雷达图与标签共用）
// ============================================================
const DOMAIN_COLORS: Record<HealthDomainId, string> = {
  checkup: '#ef4444',
  'sleep-cycle': '#6366f1',
  'sleep-quality': '#8b5cf6',
  diet: '#22c55e',
  exercise: '#10b981',
  energy: '#f59e0b',
  cognition: '#0ea5e9',
};

const DOMAIN_NUMERALS = ['壹', '贰', '叁', '肆', '伍', '陆', '柒'];

type Step = 'assessment' | 'result';

// Radar chart constants
const CHART_SIZE = 260;
const CHART_CENTER = CHART_SIZE / 2;
const CHART_RADIUS = 92;

function polarToCartesian(angle: number, radius: number): { x: number; y: number } {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: CHART_CENTER + radius * Math.cos(rad), y: CHART_CENTER + radius * Math.sin(rad) };
}

export default function HealthPage() {
  const { defaultAge, loaded } = useAdvancedSettings();
  const { guard } = useLockedAction();
  const [step, setStep] = useState<Step>('assessment');
  // answers: questionId → 选项分数（0-100）；刷新不丢
  const [answers, setAnswers] = usePersistedState<Record<string, number>>(STORAGE_KEYS.healthAnswers, {});
  const [aiOpen, setAiOpen] = useState(false);
  const {
    messages: aiMessages, setMessages: setAiMessages,
    content: aiContent, thinking: aiThinking, thinkingBeat: aiBeat,
    streaming: aiStreaming, error: aiError,
    abortRef, run: runAi, retry: retryAi,
  } = useAiChat();
  const [aiQuestion, setAiQuestion] = useState('');
  const aiEndRef = useRef<HTMLDivElement>(null);

  const closeAi = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setAiOpen(false);
  }, [abortRef]);
  useEscapeKey(closeAi, aiOpen);
  useScrollLock(aiOpen);

  // P0：组件卸载时兜底中止流式请求（与 laws/luck 一致），避免切页后孤儿连接继续消耗 AI 额度
  useEffect(() => () => abortRef.current?.abort(), []);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = HEALTH_QUESTIONS.length;
  const assessmentComplete = answeredCount === totalQuestions;

  const questionsByDomain = useMemo(() => {
    const groups: Record<string, typeof HEALTH_QUESTIONS> = {};
    for (const q of HEALTH_QUESTIONS) {
      if (!groups[q.domain]) groups[q.domain] = [];
      groups[q.domain].push(q);
    }
    return groups;
  }, []);

  const domainScores: DomainScore[] = useMemo(() => scoreDomains(answers), [answers]);
  const overall = overallScore(domainScores);
  const weakest = weakestDomains(domainScores, 3);

  const handleCompleteAssessment = useCallback(() => {
    guard(() => {
      setStep('result');
      if (typeof window !== 'undefined') scrollToTop();
    });
  }, [guard]);

  const handleReset = useCallback(() => {
    // P1：清空全部作答不可逆，先确认（防误触把几分钟的成果一键清零）
    if (!window.confirm('确定清空全部作答吗？此操作不可恢复。')) return;
    setAnswers({});
    setStep('assessment');
  }, [setAnswers]);

  const handleReassess = useCallback(() => setStep('assessment'), []);

  // ---- Radar ----
  const angles = domainScores.map((_, i) => (360 / domainScores.length) * i);
  const radarPoints = domainScores.map((d, i) => {
    const r = (d.score / 100) * CHART_RADIUS;
    const p = polarToCartesian(angles[i], r);
    return `${p.x},${p.y}`;
  });
  const radarPath = `M ${radarPoints.join(' L ')} Z`;
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const tier = (() => {
    if (overall >= 78) return { label: '良好', color: HEALTH_TIER_CONFIG.excellent.color, desc: '大部分维度在线，维持即可。' };
    if (overall >= 58) return { label: '一般', color: HEALTH_TIER_CONFIG.fair.color, desc: '没有大问题，但有明确的提升空间。' };
    if (overall >= 40) return { label: '需注意', color: HEALTH_TIER_CONFIG.attention.color, desc: '已经在拖累你，值得优先调整。' };
    return { label: '高风险', color: HEALTH_TIER_CONFIG.high.color, desc: '这是当前最该立即处理的短板。' };
  })();

  // ============================================================
  // AI 流式分析
  // ============================================================
  const startAIAnalysis = useCallback(async (question?: string) => {
    const summary = domainScores
      .map((d) => `${d.domain.name}：${d.score}/100（${HEALTH_TIER_CONFIG[d.tier].label}）`)
      .join('\n');
    const weakStr = weakest.map((d) => `${d.domain.name}(${d.score})`).join('、');
    const contextStr = `综合精力分：${overall}/100（${tier.label}）\n各子域：\n${summary}\n\n最弱的三个子域：${weakStr}\n针对每个最弱子域，给出该域最值得先看的信号与行动。`;

    const systemContext = `你是一位专注于成人健康与精力管理的健康顾问。用户刚完成了健康自评（覆盖体检、睡眠周期、睡眠质量、饮食、运动、精力、认知情绪七个子域），每个子域 0-100 分，分数越高越健康。
${defaultAge !== null && defaultAge > 0 ? `\n用户当前年龄：${defaultAge}岁` : ''}

${contextStr}

请从以下维度给出深度分析：
1. **短板诊断**：得分最低的子域说明什么，它在悄悄侵蚀什么
2. **优先级排序**：先改一件事的话，改哪个子域、为什么（按杠杆大小）
3. **具体行动**：针对最弱的 2-3 个子域，各给 2-3 条可落地的调整
4. **杠杆效应**：哪个子域改善后能连带带动其他子域
5. **风险提示**：哪些属于"该就医而非自诊"的信号，明确建议就医

要求：具体、可操作、不灌鸡汤；只写主流医学与运动科学共识范围内的常识性建议，不给出诊断结论，涉及症状一律引导就医。`;

    await runAi({
      module: 'health',
      item: systemContext,
      question: question || '请给出我当前健康与精力状态的深度分析和优先改善方案',
      history: toApiHistory(aiMessages),
      ai: getActiveAiConfig(),
    });
  }, [domainScores, overall, tier, weakest, aiMessages, defaultAge, runAi]);

  const handleAISend = () => {
    const trimmed = aiQuestion.trim();
    if (!trimmed || aiStreaming) return;
    setAiMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setAiQuestion('');
    startAIAnalysis(trimmed);
  };

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiContent, aiMessages]);

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <ModuleGate modulePath="/health">
    <div className="min-h-screen bg-background">
      <ModulePageHead
        href="/health"
        title="身体与精力自评"
        desc={
          <>
            {step === 'assessment'
              ? '14 道题，照出身体里正在悄悄磨损的零件。分数只用于定位短板，不替代体检与就医。'
              : '自评完成。看七个子域里哪块最该先补，或让 AI 给出优先改善方案。'}
            {loaded && defaultAge !== null && defaultAge > 0 && (
              <span className="ml-2 text-xs text-muted-foreground/70">(当前年龄 {defaultAge} 岁)</span>
            )}
          </>
        }
      >
        {/* 步骤指示器 */}
        <div className="mt-5 flex items-center gap-3 animate-fade-in-up stagger-3">
          {[
            { key: 'assessment', label: '健康自评', icon: ClipboardCheck },
            { key: 'result', label: '结果与建议', icon: BarChart3 },
          ].map((s, i) => {
            const isActive = s.key === step;
            const isDone = s.key === 'assessment' && step !== 'assessment';
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' :
                  isDone ? 'bg-primary/20 text-primary' :
                  'bg-muted/40 text-muted-foreground/70'
                )}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span className={cn(
                  'text-[11px] font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground/70'
                )}>{s.label}</span>
                {i < 1 && <div className="w-6 h-px bg-border" />}
              </div>
            );
          })}
        </div>
      </ModulePageHead>

      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-6 py-8 sm:px-8">
        {/* ==================== 步骤1：自评问卷 ==================== */}
        {step === 'assessment' && (
          <div className="space-y-8 animate-fade-in-up">
            {/* 说明：定位为筛查工具，不是诊断 */}
            <div className="rounded-lg border border-primary/20 bg-primary/[0.02] p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">这不是体检，也不是诊断。</span>
                它帮你在健康还没出问题时，先看清哪个零件最可能在拖后腿。涉及具体症状，请就医而非自诊。
              </p>
            </div>

            {/* 七子域概览 */}
            <div className="grid grid-cols-2 border-t border-b border-border sm:grid-cols-4 lg:grid-cols-7">
              {HEALTH_DOMAINS.map((d, i) => (
                <div key={d.id} className="flex flex-col gap-1.5 border-border px-4 py-5 first:pl-0 [&:not(:first-child)]:border-l">
                  <span className="font-serif text-xl text-primary">{DOMAIN_NUMERALS[i]}</span>
                  <span className="font-serif text-sm font-semibold text-foreground">{d.name}</span>
                  <span className="text-[11px] tabular-nums tracking-[0.15em] text-muted-foreground">
                    {(questionsByDomain[d.id] || []).length} 题
                  </span>
                </div>
              ))}
            </div>

            {/* 进度条 */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">自评进度</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{answeredCount}/{totalQuestions}</span>
              </div>
              <MeterBar className="h-2" value={answeredCount / totalQuestions} />
            </div>

            {/* 按子域分组 */}
            {HEALTH_DOMAINS.map((domain, di) => {
              const questions = questionsByDomain[domain.id] || [];
              return (
                <div key={domain.id} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base text-primary">{DOMAIN_NUMERALS[di]}</span>
                    <h2 className="text-sm font-semibold text-foreground">{domain.name}</h2>
                    <span className="text-[11px] text-muted-foreground/70">{domain.subtitle}</span>
                    <span className="text-[11px] text-muted-foreground/70">
                      <span className="font-mono tabular-nums">{questions.filter((q) => typeof answers[q.id] === 'number').length}/{questions.length}</span> 已答
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {questions.map((q) => {
                    const selected = answers[q.id];
                    return (
                      <div key={q.id} className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80">
                        <p className="mb-3 text-sm font-medium text-foreground">{q.text}</p>
                        <div className="space-y-2">
                          {q.options.map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-xs transition-colors',
                                selected === opt.score
                                  ? 'border-primary/40 bg-primary/[0.06] font-medium text-foreground'
                                  : 'border-border/50 bg-background text-muted-foreground hover:border-border hover:text-foreground'
                              )}
                            >
                              <span className={cn(
                                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                                selected === opt.score ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                              )}>
                                {selected === opt.score && <span className="text-[11px]">✓</span>}
                              </span>
                              <span className="flex-1">{opt.label}</span>
                              <span className={cn(
                                'font-mono text-[11px] tabular-nums',
                                opt.score >= 70 ? 'text-green-600 dark:text-green-400' :
                                opt.score >= 40 ? 'text-amber-600 dark:text-amber-400' :
                                'text-red-600 dark:text-red-400'
                              )}>
                                {opt.score}分
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* 提交 */}
            <div className="flex items-center gap-3 pb-8 pt-2">
              <button
                onClick={handleCompleteAssessment}
                disabled={!assessmentComplete}
                className="group btn-press inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary"
              >
                查看自评结果
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              {!assessmentComplete && (
                <span className="text-xs text-muted-foreground/75">还需回答 {totalQuestions - answeredCount} 题</span>
              )}
            </div>
          </div>
        )}

        {/* ==================== 步骤2：结果 ==================== */}
        {step === 'result' && (
          <div className="grid grid-cols-1 gap-8 animate-fade-in-up lg:grid-cols-5">
            {/* 左：七域明细 + 聚焦层 */}
            <div className="space-y-6 lg:col-span-3">
              {/* 聚焦层：先补这三个 */}
              <div className="rounded-lg border border-primary/20 bg-primary/[0.02] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">先补这三个</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  按得分从低到高排出的最弱三个子域。改善短板，比继续强化已经不错的地方回报更大。
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {weakest.map((d) => (
                    <span key={d.domain.id} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[d.domain.id] }} />
                      <span className="text-foreground">{d.domain.name}</span>
                      <span className={cn('font-mono tabular-nums', HEALTH_TIER_CONFIG[d.tier].color)}>{d.score}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 各域分数 + tier */}
              <div className="space-y-2.5">
                {domainScores.map((d, i) => (
                  <div key={d.domain.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base text-primary">{DOMAIN_NUMERALS[i]}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{d.domain.name}</span>
                          <span className={cn('text-[11px] font-medium', HEALTH_TIER_CONFIG[d.tier].color)}>{HEALTH_TIER_CONFIG[d.tier].label}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{d.domain.subtitle}</span>
                      </div>
                      <span className={cn('font-mono text-lg font-semibold tabular-nums', HEALTH_TIER_CONFIG[d.tier].color)}>{d.score}</span>
                    </div>
                    <MeterBar className="mt-2.5" value={d.score / 100} barColor={DOMAIN_COLORS[d.domain.id]} />
                  </div>
                ))}
              </div>

              {/* 最弱三域的关键信号 */}
              <div className="space-y-5">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[11px] tracking-[0.15em] text-primary/70">SIGNALS</span>
                  <span className="text-xs text-muted-foreground">最该先看的信号与行动</span>
                </div>
                {weakest.map((d) => (
                  <Reveal key={d.domain.id}>
                    <div className="rounded-lg border border-border bg-card p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-base">{d.domain.icon}</span>
                        <h3 className="text-sm font-semibold text-foreground">{d.domain.name}</h3>
                        <span className={cn('font-mono text-xs tabular-nums', HEALTH_TIER_CONFIG[d.tier].color)}>{d.score}</span>
                      </div>
                      <div className="space-y-3">
                        {keySignals(d.domain.id).map((sig) => (
                          <div key={sig.id} className="rounded-md border border-border/60 bg-background p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-foreground">{sig.name}</span>
                              <span className={cn('text-[11px] font-medium', HEALTH_TAG_CONFIG[sig.tag].color)}>{HEALTH_TAG_CONFIG[sig.tag].label}</span>
                              <span className="ml-auto font-mono text-[11px] text-muted-foreground/75">强度 {'●'.repeat(sig.intensity)}</span>
                            </div>
                            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{sig.description}</p>
                            <div className="mt-2 grid gap-1 text-[11px] sm:grid-cols-2">
                              <div className="text-muted-foreground"><span className="text-foreground/70">指标：</span>{sig.metric}</div>
                              <div className="text-muted-foreground"><span className="text-foreground/70">目标：</span>{sig.healthyRange}</div>
                            </div>
                            <div className="mt-2 flex items-start gap-1.5 text-[11px] text-foreground/70">
                              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                              <span>{sig.warning}</span>
                            </div>
                            <ul className="mt-2 space-y-1">
                              {sig.strategies.map((s, si) => (
                                <li key={si} className="flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                                  <span className="text-primary/60">·</span>
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* 右：雷达 + 分数 + AI */}
            <div className="space-y-5 lg:col-span-2">
              {/* 雷达图 */}
              <div className="flex flex-col items-center rounded-lg border border-border bg-card p-5">
                <svg width={CHART_SIZE} height={CHART_SIZE} className="mb-1">
                  {gridLevels.map((level) => {
                    const r = level * CHART_RADIUS;
                    const points = angles.map((a) => {
                      const p = polarToCartesian(a, r);
                      return `${p.x},${p.y}`;
                    });
                    return <polygon key={level} points={points.join(' ')} fill="none" stroke="currentColor" className="text-border" strokeWidth={1} />;
                  })}
                  {angles.map((a, i) => {
                    const end = polarToCartesian(a, CHART_RADIUS);
                    return <line key={i} x1={CHART_CENTER} y1={CHART_CENTER} x2={end.x} y2={end.y} stroke="currentColor" className="text-border/60" strokeWidth={0.5} />;
                  })}
                  <path d={radarPath} fill="currentColor" className="text-primary/10" stroke="currentColor" strokeWidth={2} style={{ stroke: 'var(--primary)' }} />
                  {domainScores.map((d, i) => {
                    const r = (d.score / 100) * CHART_RADIUS;
                    const p = polarToCartesian(angles[i], r);
                    return (
                      <g key={d.domain.id}>
                        <circle cx={p.x} cy={p.y} r={6} fill={DOMAIN_COLORS[d.domain.id]} opacity={0.15} />
                        <circle cx={p.x} cy={p.y} r={3.5} fill={DOMAIN_COLORS[d.domain.id]} />
                        <circle cx={p.x} cy={p.y} r={1.5} fill="white" opacity={0.5} />
                      </g>
                    );
                  })}
                  {domainScores.map((d, i) => {
                    const p = polarToCartesian(angles[i], CHART_RADIUS + 18);
                    return (
                      <text key={d.domain.id} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground text-[11px]">
                        {d.domain.name}
                      </text>
                    );
                  })}
                </svg>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
                  {domainScores.map((d) => (
                    <div key={d.domain.id} className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[d.domain.id] }} />
                      <span className="text-[11px] text-muted-foreground">{d.domain.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 综合分 */}
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="mb-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/75">综合精力分</div>
                <div className={cn('font-serif text-5xl font-bold', tier.color)}>{overall}</div>
                <div className={cn('mt-1 text-[11px] font-medium', tier.color)}>{tier.label}</div>
                <div className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">{tier.desc}</div>
                <p className="mt-3 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground/75">
                  分数只是相对定位，帮你决定先改什么；它不是体检结论，也不能替代就医。
                </p>
              </div>

              {/* 行动按钮 */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleReassess}
                  className="btn-press inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  重新自评
                </button>
                <button
                  onClick={handleReset}
                  className="btn-press inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  <RotateCcw className="h-4 w-4" />
                  清空重来
                </button>
              </div>

              {/* AI 分析入口 */}
              <button
                onClick={() => { guard(() => { setAiOpen(true); if (!aiMessages.some((m) => m.role === 'assistant')) startAIAnalysis(); }); }}
                className="group flex w-full items-center justify-between rounded-lg border border-primary/20 bg-primary/[0.03] p-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">AI 深度分析 + 优先方案</p>
                    <p className="text-[11px] text-muted-foreground">短板诊断、改善优先级、可落地的行动清单</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-primary/40 transition-colors group-hover:text-primary" />
              </button>

              {/* 提醒 */}
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/75">边界说明</span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  本模块只提供主流医学与运动科学共识范围内的常识性建议，不构成诊断。出现持续或加重的症状（如胸痛、明显消瘦、长期失眠、情绪持续低落），请及时就医，不要用自评结果替代专业判断。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== AI 面板 ==================== */}
      {aiOpen && (
        <>
          <div
            className="fixed inset-0 z-40 animate-fade-in bg-black/65 md:bg-black/55"
            onClick={closeAi}
          />
          <div className={cn(
            'fixed z-50 animate-scale-in',
            'inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:top-[5%] sm:h-[90vh] sm:w-full sm:max-w-2xl sm:-translate-x-1/2'
          )}>
            <div role="dialog" aria-modal="true" aria-label="健康自评深度分析" className="flex h-full flex-col overflow-hidden rounded-sm border border-primary/20 bg-background shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <h3 className="truncate text-sm font-semibold text-foreground">健康深度分析 + 优先方案</h3>
                </div>
                <div className="ml-2 flex shrink-0 items-center gap-1">
                  <AiCopyButton getText={() => {
                    if (aiStreaming) return aiContent;
                    for (let i = aiMessages.length - 1; i >= 0; i--) {
                      if (aiMessages[i].role === 'assistant') return aiMessages[i].content;
                    }
                    return '';
                  }} />
                  <button
                    onClick={closeAi}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="关闭分析面板"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-xs leading-relaxed text-foreground/80">
                    基于你的七个子域自评结果，AI 将从短板诊断、改善优先级、行动清单、杠杆效应、风险提示五个方面给出分析。你可以追问任何子域。
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {domainScores.map((d) => (
                      <span key={d.domain.id} className="inline-flex items-center gap-1 rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {d.domain.icon} {d.domain.name}:{d.score}
                      </span>
                    ))}
                  </div>
                </div>

                {aiMessages.map((msg, i) => (
                  <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[90%] rounded-lg px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user' ? 'bg-primary/10 text-foreground' : 'border border-border bg-card text-foreground'
                    )}>
                      {msg.role === 'assistant' ? (
                        <>
                          <AiMarkdown content={msg.content} />
                          {msg.stopped && <AiStoppedNote />}
                        </>
                      ) : <div className="whitespace-pre-wrap">{msg.content}</div>}
                    </div>
                  </div>
                ))}

                {aiThinking && <AiThinkingBlock content={aiThinking} active={aiStreaming && !aiContent} />}

                {aiStreaming && aiContent && (
                  <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-lg border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground">
                      <div className="flex items-end gap-1">
                        <AiMarkdown content={aiContent} />
                        <AiCursor />
                      </div>
                    </div>
                  </div>
                )}

                {aiStreaming && !aiContent && <AiLoadingBubble thinking={aiBeat && !aiThinking} />}

                {!aiStreaming && aiError && <AiErrorNotice error={aiError} onRetry={retryAi} />}

                <AiPromptChips module="health" visible={!aiStreaming && !aiError && !aiMessages.some(x => x.role === 'user')} onPick={(q) => { if (aiStreaming) return; setAiMessages(prev => [...prev, { role: 'user', content: q }]); startAIAnalysis(q); }} />
                <div ref={aiEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border bg-card px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    maxLength={500}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAISend(); } }}
                    placeholder="追问：我的睡眠怎么改善？/ 精力上不去怎么办？"
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring"
                    disabled={aiStreaming}
                  />
                  {aiStreaming && <AiStopButton onStop={() => abortRef.current?.abort()} />}
                  <button
                    onClick={handleAISend}
                    disabled={aiStreaming || !aiQuestion.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="发送追问"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <AuthorNote module="health" />
    </div>
    </ModuleGate>
  );
}
