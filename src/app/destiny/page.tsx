'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ModulePageHead } from '@/components/shared/module-page-head';
import { AiMarkdown } from '@/components/shared/ai-markdown';
import { AiCopyButton, AiStopButton, AiLoadingBubble, AiThinkingBlock } from '@/components/ai/ai-panel-actions';
import { useLockedAction } from '@/hooks/use-locked-action';
import { getActiveAiConfig } from '@/lib/active-ai-client';
import { consumeAiSseStream } from '@/lib/sse-client';
import { getAuthHeader } from '@/lib/client-auth';
import { useAdvancedSettings } from '@/hooks/use-advanced-settings';
import { usePersistedState } from '@/hooks/use-persisted-state';
import { useEscapeKey } from '@/hooks/use-escape-key';
import { ModuleGate } from '@/components/auth/module-gate';
import { ChevronRight, ChevronDown, ChevronUp, TrendingUp, Target, Clock,
  ArrowRight, User, PenLine, Heart, Briefcase, MessageSquare,
  Bot, X, Send,
} from 'lucide-react';

// ============================================================
// 类型定义
// ============================================================

interface DestinyInput {
  birthYear: string;
  familyBackground: 'wealthy' | 'middle' | 'poor';
  educationLevel: 'top' | 'good' | 'average' | 'low';
  location: 'tier1' | 'tier2' | 'tier3' | 'rural';
  // 自定义内容
  personality: string;
  hobbies: string;
  keyExperiences: string;
  currentChallenge: string;
  otherInfo: string;
}

interface DestinyReport {
  // 三个维度的强度，仅用于条形图展示：不排序、不评级、不显示数值
  fate: number;
  fortune: number;
  phase: string;
  phaseDesc: string;
  nextWindow: string;
  nextWindowDesc: string;
  age: number;
  // 描述性画像
  base: string[];       // 你的底色
  resilience: string[]; // 你的弹性
  next: string[];       // 你的下一步
}

// ============================================================
// 常量映射
// ============================================================

const familyScoreMap = { wealthy: 85, middle: 55, poor: 25 };
const educationScoreMap = { top: 90, good: 65, average: 45, low: 25 };
const locationScoreMap = { tier1: 80, tier2: 60, tier3: 45, rural: 30 };

const familyLabelMap = { wealthy: '优越', middle: '普通', poor: '困难' };
const educationLabelMap = { top: '985/211', good: '一本', average: '二本/专科', low: '高中及以下' };
const locationLabelMap = { tier1: '一线城市', tier2: '二线城市', tier3: '三线及以下', rural: '农村/乡镇' };

const phaseDescriptions: Record<string, string> = {
  '探索期': '约20-25岁，尝试的成本相对较低，适合接触不同方向，积累经验与认知。',
  '积累期': '约25-35岁，能力与资源常在这一阶段累积，方向的选择会带来一定影响。',
  '收获期': '约35-45岁，前期的积累开始显现成果，经验与判断力通常较为成熟。',
  '传承期': '约45岁以后，不少人会更多关注传承与回馈，人生的意义可以重新思考。',
};

const nextWindowDescriptions: Record<string, string> = {
  '专业选择与第一份实习': '这一阶段常见的是方向的初步选择，可以通过实习了解不同行业的实际情况。',
  '职业分水岭与婚恋决策': '职业发展与个人生活的安排可能需要同时考虑，兼顾策略与感受。',
  '管理转型与副业窗口': '从执行者转向管理者，以及尝试副业，是这一阶段常见的话题。',
  '财富积累与经验变现': '前期积累的经验与资源，可以逐步转化为收入或影响力。',
};

// 自定义输入字段配置
const customFields: {
  key: keyof Pick<DestinyInput, 'personality' | 'hobbies' | 'keyExperiences' | 'currentChallenge' | 'otherInfo'>;
  label: string;
  placeholder: string;
  icon: typeof User;
  lines: number;
}[] = [
  {
    key: 'personality',
    label: '你的性格特点',
    placeholder: '比如：内向/外向、理性/感性、行动派/思考派、抗压能力强/容易焦虑...',
    icon: User,
    lines: 2,
  },
  {
    key: 'hobbies',
    label: '你的兴趣和爱好',
    placeholder: '比如：编程、写作、运动、投资、音乐、手工、旅行...',
    icon: Heart,
    lines: 2,
  },
  {
    key: 'keyExperiences',
    label: '关键人生经历',
    placeholder: '比如：高考失利后复读、大学创业、被裁员后转行、一段重要的恋爱...',
    icon: Briefcase,
    lines: 3,
  },
  {
    key: 'currentChallenge',
    label: '当前最大的困惑或挑战',
    placeholder: '比如：不知道该不该换行、感情中犹豫不决、存不下钱、感觉在混日子...',
    icon: MessageSquare,
    lines: 2,
  },
  {
    key: 'otherInfo',
    label: '其他想说的话',
    placeholder: '任何你觉得影响你命运的因素，不限格式...',
    icon: PenLine,
    lines: 2,
  },
];

// ============================================================
// 报告生成
// ============================================================

function generateReport(input: DestinyInput): DestinyReport {
  const birthYear = parseInt(input.birthYear);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  const fate = Math.round(
    familyScoreMap[input.familyBackground] * 0.4 +
    locationScoreMap[input.location] * 0.3 +
    (age >= 25 && age <= 35 ? 70 : age >= 18 ? 60 : 50) * 0.3
  );

  const eraBonus = birthYear >= 1990 && birthYear <= 2000 ? 15 : birthYear >= 1980 ? 10 : 5;
  const fortune = Math.round(
    educationScoreMap[input.educationLevel] * 0.5 +
    (locationScoreMap[input.location] + eraBonus) * 0.3 +
    50 * 0.2
  );

  const familyLabel = familyLabelMap[input.familyBackground];
  const eduLabel = educationLabelMap[input.educationLevel];
  const locLabel = locationLabelMap[input.location];

  // ---- 你的底色：起点条件、性格、兴趣、经历（描述，不下结论）----
  const base: string[] = [
    `你今年约${age}岁，出身${familyLabel}家庭，学历${eduLabel}，身处${locLabel}。这些是起点条件，描述的是出发位置，并不决定终点。`,
  ];
  if (input.personality) {
    let line = `性格方面：${input.personality}。`;
    if (/内向|敏感|焦虑/.test(input.personality)) {
      line += '这类特质常见的优势是深度思考与共情，同时也需要留意精力的消耗。';
    } else if (/外向|开朗|社交/.test(input.personality)) {
      line += '这类特质便于建立人际网络，也需要留意社交投入与产出之间的平衡。';
    } else {
      line += '了解自己的性格，有助于判断自己适合在哪类场景中发挥。';
    }
    base.push(line);
  }
  if (input.keyExperiences) {
    base.push(`关键经历：${input.keyExperiences}。`);
  }
  if (input.hobbies) {
    if (/编程|代码|技术|开发/.test(input.hobbies)) {
      base.push('你的技术兴趣与当下的行业趋势相关，同时需要留意AI对编程工作的影响，可以关注架构与产品方面的能力。');
    } else if (/写作|内容|自媒体/.test(input.hobbies)) {
      base.push('写作是一项可以跨行业使用的能力，能够影响较多的人。');
    } else if (/投资|理财|金融/.test(input.hobbies)) {
      base.push('对投资感兴趣，同时也可以把个人能力看作需要长期投入的资产。');
    } else {
      base.push(`你的兴趣"${input.hobbies}"，可能与某些职业方向相关，可以尝试把它和实际能力联系起来。`);
    }
  }

  // ---- 你的弹性：面对变化时的资源与约束 ----
  const resilience: string[] = [];
  if (input.keyExperiences) {
    resilience.push('过往经历中的应对方式，可以作为面对变化时的参考。');
  }
  if (input.currentChallenge) {
    resilience.push(`你提到的困惑"${input.currentChallenge}"，说明你正在思考这件事，这是梳理问题的起点之一。`);
  }
  if (age >= 30 && age <= 35) {
    resilience.push('你可能正处于职业发展的一个常见转折阶段，未来几年的选择可能对后续路径有较长影响。');
  }
  if (input.familyBackground === 'poor') {
    resilience.push('经济基础较薄，抗风险的余量相对小，可以先建立一定的安全垫，再尝试较大的变动。');
  }
  if (age >= 25 && age <= 30) {
    resilience.push('25-30岁通常是尝试成本相对较低的阶段，可以根据兴趣做一些探索。');
  }

  // ---- 你的下一步：可执行的方向，不做绝对判断 ----
  const next: string[] = [
    fate < 50 ? '先天条件相对有限，可以把精力放在培养难以被替代的技能上' : '先天条件相对充足，可以把注意力放在方向的选择上',
    fortune < 50 ? '当前的外部机会相对有限，可以优先积累学习、储蓄与人脉' : '当前的外部机会相对充足，可以考虑尝试跳槽、创业或投资等方向',
    input.educationLevel === 'low' ? '学历可以通过自学、考证和项目经验来补充' : '学历可以作为起点，经验与技能同样需要持续积累',
    input.location === 'rural' || input.location === 'tier3'
      ? '所在地的机会密度相对有限，可以尝试远程工作等方式拓展可接触的机会'
      : '所在地的机会密度较高，竞争也更激烈，可以寻找自己的差异化方向',
  ];
  if (input.hobbies) {
    if (/编程|代码|技术|开发/.test(input.hobbies)) {
      next.push('技术能力可以作为基础，进一步可以尝试从"会写代码"走向"解决具体的业务问题"');
    } else if (/写作|内容|自媒体/.test(input.hobbies)) {
      next.push('内容能力可以与不同行业结合，可以尝试找一个垂直领域深耕');
    } else if (/投资|理财|金融/.test(input.hobbies)) {
      next.push('投资需要本金与时间的积累，可以先从稳定的储蓄开始');
    }
  }
  if (input.currentChallenge) {
    if (/换行|转行|方向/.test(input.currentChallenge)) {
      next.push('转行可以循序渐进：在现有工作中积累新方向的技能与人脉');
    } else if (/感情|恋爱|婚/.test(input.currentChallenge)) {
      next.push('可以先梳理自己的核心需求，再判断当前关系是否匹配');
    } else if (/钱|存不下|收入|薪资/.test(input.currentChallenge)) {
      next.push('财务问题往往与收入结构有关，可以尝试建立多元的收入来源');
    }
  }

  const phase = age < 25 ? '探索期' : age < 35 ? '积累期' : age < 45 ? '收获期' : '传承期';
  const nextWindow = age < 25 ? '专业选择与第一份实习' : age < 30 ? '职业分水岭与婚恋决策' : age < 35 ? '管理转型与副业窗口' : '财富积累与经验变现';

  return {
    fate, fortune,
    phase, phaseDesc: phaseDescriptions[phase] || '',
    nextWindow, nextWindowDesc: nextWindowDescriptions[nextWindow] || '',
    age, base, resilience, next,
  };
}

// ============================================================
// 动画分数条
// ============================================================

function AnimatedScoreBar({ label, score, color, icon, delay }: { label: string; score: number; color: string; icon: React.ReactNode; delay: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ============================================================
// 主组件
// ============================================================

export default function DestinyPage() {
  const { defaultAge } = useAdvancedSettings();
  const { guard } = useLockedAction();
  // 表单输入持久化：刷新后不再重填（原来是纯 useState，刷新即丢）
  const [input, setInput] = usePersistedState<DestinyInput>('destiny.input.v1', () => ({
    birthYear: '',
    familyBackground: 'middle',
    educationLevel: 'good',
    location: 'tier2',
    personality: '',
    hobbies: '',
    keyExperiences: '',
    currentChallenge: '',
    otherInfo: '',
  }));
  const [birthYearError, setBirthYearError] = useState('');
  const [report, setReport] = useState<DestinyReport | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // AI 面板
  const [aiOpen, setAiOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiThinking, setAiThinking] = useState('');
  const [aiStreaming, setAiStreaming] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const aiEndRef = useRef<HTMLDivElement>(null);

  // 按 Esc 关 AI 面板（先中止流式请求再关），键盘用户不用去找那个 ×
  const closeAi = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setAiOpen(false);
  }, []);
  useEscapeKey(closeAi, aiOpen);

  // 已在 /me 设置过年龄且出生年份还空着时，自动换算填入
  useEffect(() => {
    if (defaultAge === null) return;
    setInput(prev => prev.birthYear ? prev : { ...prev, birthYear: String(new Date().getFullYear() - defaultAge) });
  }, [defaultAge, setInput]);

  const handleGenerate = () => {
    const year = parseInt(input.birthYear);
    if (!Number.isInteger(year)) {
      setBirthYearError('请先填写出生年份，或在「我的」页设置年龄');
      return;
    }
    setBirthYearError('');
    // 出生年份钳制到合理区间（1950 ~ 去年），避免生成负年龄报告
    const currentYear = new Date().getFullYear();
    const safeYear = Math.min(Math.max(year, 1950), currentYear - 5);
    const safeInput = { ...input, birthYear: String(safeYear) };
    const result = generateReport(safeInput);
    setReport(result);
    setShowReport(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowReport(true);
      });
    });
  };

  // 自定义内容填充率
  const customFillCount = [input.personality, input.hobbies, input.keyExperiences, input.currentChallenge, input.otherInfo].filter(Boolean).length;

  // ============================================================
  // AI 流式分析
  // ============================================================
  const startAIAnalysis = useCallback(async (question?: string) => {
    if (!report) return;
    setAiStreaming(true);
    setAiContent('');
    setAiThinking('');
    abortRef.current = new AbortController();

    // 构建包含自定义内容的上下文
    const customContext = customFillCount > 0
      ? `\n\n【用户自定义信息】\n${input.personality ? `性格：${input.personality}` : ''}\n${input.hobbies ? `兴趣：${input.hobbies}` : ''}\n${input.keyExperiences ? `经历：${input.keyExperiences}` : ''}\n${input.currentChallenge ? `当前困惑：${input.currentChallenge}` : ''}\n${input.otherInfo ? `补充：${input.otherInfo}` : ''}`
      : '';

    const systemContext = `你是一位命运分析顾问，专注于基于个人特质的深度分析与破局策略。

【命运画像】
当前阶段：${report.phase}（约${report.age}岁）
下一个窗口：${report.nextWindow}
${customContext}

【已有分析】
你的底色：${report.base.join('；')}
你的弹性：${report.resilience.join('；')}
你的下一步：${report.next.join('；')}

请从以下维度给出深度分析：
1. **个人画像**：结合用户的基本信息、性格、经历，给出精准的个人画像（不是泛泛而谈）
2. **命运杠杆**：基于用户的性格和经历，哪些地方是最大的杠杆点
3. **困境拆解**：如果用户提到了当前困惑，给出具体的拆解和解决路径
4. **兴趣变现**：用户的兴趣和爱好如何转化为职业优势或收入来源
5. **行动方案**：3个月内可执行的具体行动计划

要求：直接、有力度、不说废话。基于用户写的具体内容来分析，不要给空泛建议。`;

    const historyForApi = aiMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          module: 'destiny',
          item: systemContext,
          question: question || '请综合我的信息和命运报告，给出个性化深度分析与行动方案',
          history: historyForApi,
          ai: getActiveAiConfig(),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        let detail = `请求失败: ${response.status}`;
        try { const j = await response.json(); if (j?.error) detail = j.error; } catch { /* 保留默认 */ }
        throw new Error(detail);
      }

      await consumeAiSseStream(response, {
        onReasoning: (accumulated) => setAiThinking(accumulated),
        onContent: (accumulated) => setAiContent(accumulated),
        onError: (message) => {
          setAiMessages(prev => [...prev, { role: 'assistant', content: `分析失败：${message}` }]);
        },
        onDone: (fullText) => {
          if (fullText) {
            setAiMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
          }
        },
      });
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
  }, [report, input, customFillCount, aiMessages]);

  const handleAISend = () => {
    const trimmed = aiQuestion.trim();
    if (!trimmed || aiStreaming) return;
    setAiMessages(prev => [...prev, { role: 'user', content: trimmed }]);
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
    <ModuleGate modulePath="/destiny">
    <div className="min-h-screen bg-background">
      {/* Header —— 编号/图标/提问统一从 module-identity 取 */}
      <ModulePageHead
        href="/destiny"
        title="命运：命势运报告"
        desc="命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式。输入基本信息和你自己的故事，看看你的命运基本面。"
        width="3xl"
      />

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
        {/* Input Form */}
        <div className="space-y-6">
          {/* === 基础信息区 === */}
          <div className="animate-fade-in-up stagger-1">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-3.5 w-3.5 text-primary/60" />
              <h2 className="text-sm font-semibold text-foreground">基础信息</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
          </div>

          {/* Birth Year */}
          <div className="animate-fade-in-up stagger-2">
            <label htmlFor="destiny-birth-year" className="text-sm font-semibold text-foreground mb-2 block">出生年份</label>
            <input
              id="destiny-birth-year"
              type="number"
              min={1950}
              max={2010}
              value={input.birthYear}
              onChange={(e) => { setInput(prev => ({ ...prev, birthYear: e.target.value })); setBirthYearError(''); }}
              className="w-32 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {birthYearError && <p role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{birthYearError}</p>}
          </div>

          {/* Family, Education, Location - grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up stagger-3">
            <div>
              <span id="destiny-family-label" className="text-xs font-semibold text-foreground mb-2 block">家庭背景</span>
              <div role="group" aria-labelledby="destiny-family-label" className="space-y-1.5">
                {(Object.keys(familyLabelMap) as Array<keyof typeof familyLabelMap>).map(key => (
                  <button
                    key={key}
                    onClick={() => setInput(prev => ({ ...prev, familyBackground: key }))}
                    aria-pressed={input.familyBackground === key}
                    className={cn(
                      'w-full rounded-md border px-3 py-1.5 text-xs font-medium text-left transition-all',
                      input.familyBackground === key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {familyLabelMap[key]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span id="destiny-education-label" className="text-xs font-semibold text-foreground mb-2 block">学历</span>
              <div role="group" aria-labelledby="destiny-education-label" className="space-y-1.5">
                {(Object.keys(educationLabelMap) as Array<keyof typeof educationLabelMap>).map(key => (
                  <button
                    key={key}
                    onClick={() => setInput(prev => ({ ...prev, educationLevel: key }))}
                    aria-pressed={input.educationLevel === key}
                    className={cn(
                      'w-full rounded-md border px-3 py-1.5 text-xs font-medium text-left transition-all',
                      input.educationLevel === key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {educationLabelMap[key]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span id="destiny-location-label" className="text-xs font-semibold text-foreground mb-2 block">所在地</span>
              <div role="group" aria-labelledby="destiny-location-label" className="space-y-1.5">
                {(Object.keys(locationLabelMap) as Array<keyof typeof locationLabelMap>).map(key => (
                  <button
                    key={key}
                    onClick={() => setInput(prev => ({ ...prev, location: key }))}
                    aria-pressed={input.location === key}
                    className={cn(
                      'w-full rounded-md border px-3 py-1.5 text-xs font-medium text-left transition-all',
                      input.location === key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:bg-accent'
                    )}
                  >
                    {locationLabelMap[key]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* === 自定义内容区 === */}
          <div className="animate-fade-in-up stagger-4">
            <button
              onClick={() => setShowCustom(!showCustom)}
              aria-expanded={showCustom}
              aria-controls="destiny-custom-fields"
              className="w-full flex items-center gap-2 mb-4 group"
            >
              <PenLine className="h-3.5 w-3.5 text-primary/60" />
              <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">关于你自己（选填）</h2>
              {customFillCount > 0 && (
                <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                  {customFillCount}/5 已填写
                </span>
              )}
              <div className="flex-1 h-px bg-border" />
              {showCustom ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>

            <p className={cn('text-xs text-muted-foreground mb-4 leading-relaxed transition-all', showCustom ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden')}>
              写下你的性格、爱好、经历和困惑。这些信息会让命运报告和AI分析更个性化——空泛建议对你没用，具体信息才能给出具体策略。
            </p>
          </div>

          {showCustom && (
            <div id="destiny-custom-fields" className="space-y-4 animate-fade-in-up">
              {customFields.map(field => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
                      <label htmlFor={`destiny-custom-${field.key}`} className="text-xs font-semibold text-foreground">{field.label}</label>
                      {input[field.key] && (
                        <span className="text-[9px] text-primary font-medium">已填写</span>
                      )}
                    </div>
                    <textarea
                      id={`destiny-custom-${field.key}`}
                      value={input[field.key]}
                      onChange={(e) => setInput(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={field.lines}
                      maxLength={500}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="animate-fade-in-up stagger-5">
            <button
              onClick={handleGenerate}
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] btn-press"
            >
              生成命运报告
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            {customFillCount === 0 && (
              <span className="ml-3 text-xs text-muted-foreground/60">
                填写关于你自己的信息，可以获得更个性化的分析
              </span>
            )}
          </div>
        </div>

        {/* Report */}
        {report && showReport && (
          <div className="mt-10 space-y-5">
            {/* Three-dimension visualization (not ranked, not graded) */}
            <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up">
              <div className="space-y-4">
                <AnimatedScoreBar label="命（先天条件）" score={report.fate} color="#ef4444" icon={<Target className="h-3.5 w-3.5 text-red-500" />} delay={200} />
                <AnimatedScoreBar label="运（时机环境）" score={report.fortune} color="#3b82f6" icon={<TrendingUp className="h-3.5 w-3.5 text-blue-500" />} delay={400} />
              </div>
            </div>

            {/* Phase + Next Window Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up stagger-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3.5 w-3.5 text-foreground/40" />
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">当前阶段</span>
                </div>
                <p className="text-lg font-serif font-semibold text-foreground mb-2">{report.phase}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{report.phaseDesc}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">约{report.age}岁</span>
                  <span className="text-[10px] text-muted-foreground/40">·</span>
                  <span className="text-[10px] text-muted-foreground">人生进度约{Math.min(Math.round((report.age / 80) * 100), 100)}%</span>
                </div>
              </div>
              <div className="rounded-lg border border-primary/15 bg-primary/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-[10px] text-primary/60 uppercase tracking-wider">下一个关键窗口</span>
                </div>
                <p className="text-lg font-serif font-semibold text-primary mb-2">{report.nextWindow}</p>
                <p className="text-xs text-primary/60 leading-relaxed">{report.nextWindowDesc}</p>
              </div>
            </div>

            {/* 你的底色 */}
            <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up stagger-3">
              <h3 className="text-sm font-semibold text-foreground mb-3">你的底色</h3>
              {report.base.map((paragraph, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">{paragraph}</p>
              ))}
            </div>

            {/* 你的弹性 */}
            <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up stagger-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">你的弹性</h3>
              <ul className="space-y-2.5">
                {report.resilience.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* 你的下一步 */}
            <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up stagger-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">你的下一步</h3>
              <ul className="space-y-2.5">
                {report.next.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>


            {/* AI Deep Analysis Button */}
            <button
              onClick={() => guard(() => { setAiOpen(true); if (aiMessages.length === 0) startAIAnalysis(); })}
              className="w-full group rounded-lg border border-primary/20 bg-primary/[0.03] p-4 flex items-center justify-between transition-all hover:bg-primary/[0.06] hover:border-primary/30 animate-fade-in-up stagger-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">AI 深度分析 + 解惑</p>
                  <p className="text-[11px] text-muted-foreground">
                    {customFillCount > 0
                      ? '结合你的性格、经历和困惑，给出个性化策略'
                      : '让AI综合你的命运报告，给出深度分析与策略建议'
                    }
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
            </button>

            {/* Bottom insight */}
            <div className="rounded-lg border border-border bg-muted/10 p-5 animate-fade-in-up stagger-6">
              <p className="text-xs text-muted-foreground leading-relaxed font-serif italic">
                &ldquo;命运报告基于统计模型和概率分析，不构成人生建议。每个人的人生都是独特的——
                这个工具的目的是帮你更清晰地看到牌面，而不是替你出牌。&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================== AI 深度分析面板 ==================== */}
      {aiOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => { if (abortRef.current) abortRef.current.abort(); setAiOpen(false); }}
          />
          {/* 居中模态（与 laws/luck 详情一致），不再是右侧抽屉 */}
          <div className={cn(
            'fixed z-50 animate-scale-in transition-all duration-300',
            'inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:top-[5%] sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:h-[90vh]'
          )}>
          <div role="dialog" aria-modal="true" aria-label="命运深度分析" className="h-full rounded-2xl border border-primary/20 bg-background shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">深度分析 + 解惑</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <AiCopyButton getText={() => {
                  if (aiStreaming) return aiContent;
                  for (let i = aiMessages.length - 1; i >= 0; i--) {
                    if (aiMessages[i].role === 'assistant') return aiMessages[i].content;
                  }
                  return '';
                }} />
                <button
                  onClick={() => { if (abortRef.current) abortRef.current.abort(); setAiOpen(false); }}
                  className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="关闭分析面板"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Context card */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {customFillCount > 0
                    ? `基于你的命运报告 + 个人信息（${customFillCount}项自定义内容），AI将从5个维度深度分析。`
                    : '基于你的命运报告，AI将从5个维度深度分析。填写个人信息可以获得更精准的分析。'
                  }
                </p>
                {customFillCount > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    {input.personality && <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">性格</span>}
                    {input.hobbies && <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">兴趣</span>}
                    {input.keyExperiences && <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">经历</span>}
                    {input.currentChallenge && <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">困惑</span>}
                    {input.otherInfo && <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">补充</span>}
                  </div>
                )}
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
                    {msg.role === 'assistant' ? (
                      <AiMarkdown content={msg.content} />
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}

              {aiThinking && (
                <AiThinkingBlock content={aiThinking} active={aiStreaming && !aiContent} />
              )}

              {/* Streaming content */}
              {aiStreaming && aiContent && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-lg px-4 py-3 text-sm leading-relaxed bg-card border border-border text-foreground">
                    <div className="flex items-end gap-1">
                      <AiMarkdown content={aiContent} />
                      <span className="inline-block w-1.5 h-4 bg-primary/60 animate-blink -mb-0.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Loading */}
              {aiStreaming && !aiContent && <AiLoadingBubble />}

              <div ref={aiEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  maxLength={500}
                  onChange={e => setAiQuestion(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAISend(); } }}
                  placeholder="追问：我的性格适合什么方向？/ 如何解决当前困惑？"
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  disabled={aiStreaming}
                />
                {aiStreaming && <AiStopButton onStop={() => abortRef.current?.abort()} />}
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
          </div>
        </>
      )}
    </div>
    </ModuleGate>
  );
}
