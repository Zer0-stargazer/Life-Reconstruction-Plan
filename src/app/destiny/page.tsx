'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAdvancedSettings } from '@/hooks/use-advanced-settings';
import { ModuleGate } from '@/components/auth/module-gate';
import { ChevronRight, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Target, Zap, Clock,
  ArrowRight, Sparkles, User, PenLine, Heart, Briefcase, MessageSquare,
  Bot, X, Send, Loader2,
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
  fate: number;
  fortune: number;
  effort: number;
  totalScore: number;
  tier: string;
  analysis: string;
  suggestions: string[];
  warnings: string[];
  phase: string;
  phaseDesc: string;
  nextWindow: string;
  nextWindowDesc: string;
  age: number;
  destinySplit: { label: string; ratio: number; color: string }[];
  customInsights: string[];
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
  '探索期': '20-25岁，试错成本最低的阶段。大胆尝试不同方向，积累经验和认知。错误是这个阶段最好的投资。',
  '积累期': '25-35岁，能力与资源快速增长的关键十年。选择比努力更重要，方向决定上限。',
  '收获期': '35-45岁，前期积累开始变现的阶段。经验和判断力达到峰值，是影响力最大的时期。',
  '传承期': '45岁以后，从追求个人成就转向传承与回馈。人生的意义在这个阶段重新定义。',
};

const nextWindowDescriptions: Record<string, string> = {
  '专业选择与第一份实习': '这是方向性窗口——选对赛道，10年后差距会以10倍放大。',
  '职业分水岭与婚恋决策': '双重压力窗口——职业上升期与社会期望正面碰撞，需要同时兼顾策略与情感。',
  '管理转型与副业窗口': '能力跃迁窗口——从"做事"到"带人"是最难的一跳，副业是安全网也是增长极。',
  '财富积累与经验变现': '复利窗口——前期做对了，这是复利开始显现的时期；做错了，这是最后的补救机会。',
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

function generateReport(input: DestinyInput, weightMap?: Record<string, number>): DestinyReport {
  const birthYear = parseInt(input.birthYear) || 1995;
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

  // 根据自定义内容调整努力分数
  let effort = 55;
  const customText = [input.personality, input.hobbies, input.keyExperiences, input.currentChallenge, input.otherInfo].join(' ');
  if (customText.length > 10) {
    // 有自定义内容说明用户在认真思考，略微提升努力分
    effort = Math.min(effort + 5, 70);
  }
  // 性格关键词微调
  if (/自律|坚持|拼命|狠人|刻苦/.test(customText)) effort = Math.min(effort + 10, 80);
  if (/摆烂|拖延|懒|躺平|三天打鱼/.test(customText)) effort = Math.max(effort - 10, 30);

  // 偏好权重影响：用户重视的维度放大，不重视的缩小
  const wm = weightMap || { career: 0.5, wealth: 0.5, freedom: 0.5, relationship: 0.5, growth: 0.5, health: 0.5 };
  const wFate = (wm.career + wm.wealth) / 2;
  const wFortune = (wm.freedom + wm.relationship) / 2;
  const wEffort = (wm.growth + wm.health) / 2;
  const wSum = wFate + wFortune + wEffort || 1;
  const totalScore = Math.round(fate * (wFate / wSum) + fortune * (wFortune / wSum) + effort * (wEffort / wSum));
  const tier = totalScore >= 80 ? 'S' : totalScore >= 65 ? 'A' : totalScore >= 50 ? 'B' : totalScore >= 35 ? 'C' : 'D';

  const familyLabel = familyLabelMap[input.familyBackground];
  const eduLabel = educationLabelMap[input.educationLevel];
  const locLabel = locationLabelMap[input.location];

  let analysis = `你今年约${age}岁，出身${familyLabel}家庭，学历${eduLabel}，身处${locLabel}。你的命（先天条件）评分${fate}分，运（时机与环境）评分${fortune}分。${fate >= 60 ? '先天条件尚可，这是优势。' : '先天条件偏弱，但这不是终局。'}${fortune >= 60 ? '当前运势不错，要抓住机会。' : '运势偏弱，需要更多耐心和策略。'}`;

  // 结合自定义内容补充分析
  if (input.personality) {
    analysis += `\n\n性格方面：${input.personality}。`;
    if (/内向|敏感|焦虑/.test(input.personality)) {
      analysis += '内向敏感不是弱点——深度思考和共情能力是稀缺资源，关键是找到适合你的表达方式。';
    } else if (/外向|开朗|社交/.test(input.personality)) {
      analysis += '外向是社交杠杆——善用人际网络，但注意不要在无效社交上消耗太多精力。';
    } else {
      analysis += '了解自己是最重要的第一步——性格没有好坏，只有是否用对了场景。';
    }
  }
  if (input.keyExperiences) {
    analysis += `\n\n关键经历：${input.keyExperiences}。`;
    analysis += '每一次经历都在塑造你——尤其是那些让你痛苦的经历，往往蕴含着最大的成长。';
  }

  const suggestions = [
    fate < 50 ? '先天牌面不够好，但牌技可以弥补——专注提升不可替代的技能' : '先天条件不错，不要浪费——选择比努力更重要',
    fortune < 50 ? '运势偏弱时适合蓄力：学习、存钱、建立人脉' : '运势较好时适合出击：跳槽、创业、投资',
    input.educationLevel === 'low' ? '学历是短板，但终身学习可以弥补——考证、自学、项目经验' : '学历是优势，但不要躺在文凭上——经验和技能才是护城河',
    input.location === 'rural' || input.location === 'tier3' ? '地理位置限制了机会密度——考虑迁移到更大城市，或利用远程工作突破地理限制' : '城市给了你机会密度，但竞争也更激烈——找到差异化优势',
  ];

  // 根据自定义内容追加个性化建议
  const customInsights: string[] = [];
  if (input.hobbies) {
    const hobbyStr = input.hobbies;
    if (/编程|代码|技术|开发/.test(hobbyStr)) {
      suggestions.push('技术是当下的硬通货——关键是从"会写代码"升级到"能解决商业问题"');
      customInsights.push('你的技术兴趣是时代红利，但要注意AI对编程的冲击——向架构思维和产品思维升级');
    } else if (/写作|内容|自媒体/.test(hobbyStr)) {
      suggestions.push('内容能力可以叠加任何行业——找到你的垂直领域，做"行业+内容"的组合拳');
      customInsights.push('写作是杠杆率极高的能力——一个人一支笔就能影响成千上万人');
    } else if (/投资|理财|金融/.test(hobbyStr)) {
      suggestions.push('投资能力需要本金和时间——先积累第一桶金，再放大复利');
      customInsights.push('对投资感兴趣是好事，但年轻人最大的投资标的是自己');
    } else {
      customInsights.push(`你的兴趣"${hobbyStr}"可能蕴含着独特的职业方向——把爱好变成能力，把能力变成收入`);
    }
  }
  if (input.currentChallenge) {
    customInsights.push(`当前困惑"${input.currentChallenge}"——这说明你在思考，思考本身就是破局的起点`);
    if (/换行|转行|方向/.test(input.currentChallenge)) {
      suggestions.push('转行的最佳策略不是"跳"，而是"滑"——在现有工作中积累新方向的技能和人脉，平滑过渡');
    } else if (/感情|恋爱|婚/.test(input.currentChallenge)) {
      suggestions.push('感情困惑往往源于"想要什么"不清晰——先想清楚你的核心需求，再判断当前关系是否匹配');
    } else if (/钱|存不下|收入|薪资/.test(input.currentChallenge)) {
      suggestions.push('财务问题的根源通常是"收入结构"而非"收入金额"——建立多元收入来源比涨薪更可靠');
    }
  }

  const warnings = [
    age >= 30 && age <= 35 ? '你正处于职业分水岭，未来3年的选择决定下一个10年' : '',
    input.familyBackground === 'poor' ? '经济基础薄弱意味着抗风险能力差——先建立安全垫再冒险' : '',
    age >= 25 && age <= 30 ? '25-30岁是试错成本最低的窗口，大胆尝试' : '',
  ].filter(Boolean) as string[];

  const phase = age < 25 ? '探索期' : age < 35 ? '积累期' : age < 45 ? '收获期' : '传承期';
  const nextWindow = age < 25 ? '专业选择与第一份实习' : age < 30 ? '职业分水岭与婚恋决策' : age < 35 ? '管理转型与副业窗口' : '财富积累与经验变现';

  // 三大成分对总分（totalScore）的真实贡献占比，随用户偏好权重动态变化
  const contribFate = fate * (wFate / wSum);
  const contribFortune = fortune * (wFortune / wSum);
  const contribEffort = effort * (wEffort / wSum);
  const contribSum = contribFate + contribFortune + contribEffort || 1;
  const destinySplit = [
    { label: '命', ratio: Math.round((contribFate / contribSum) * 100), color: '#ef4444' },
    { label: '运', ratio: Math.round((contribFortune / contribSum) * 100), color: '#3b82f6' },
    { label: '努力', ratio: Math.round((contribEffort / contribSum) * 100), color: '#22c55e' },
  ];

  return {
    fate, fortune, effort, totalScore, tier, analysis, suggestions, warnings,
    phase, phaseDesc: phaseDescriptions[phase] || '',
    nextWindow, nextWindowDesc: nextWindowDescriptions[nextWindow] || '',
    age, destinySplit, customInsights,
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
        <span className="text-sm font-mono font-semibold tabular-nums" style={{ color }}>{width}</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out progress-shimmer"
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
  const { defaultAge, weightMap } = useAdvancedSettings();
  const [input, setInput] = useState<DestinyInput>({
    birthYear: String(new Date().getFullYear() - defaultAge),
    familyBackground: 'middle',
    educationLevel: 'good',
    location: 'tier2',
    personality: '',
    hobbies: '',
    keyExperiences: '',
    currentChallenge: '',
    otherInfo: '',
  });
  const [report, setReport] = useState<DestinyReport | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // AI 面板
  const [aiOpen, setAiOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiStreaming, setAiStreaming] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const aiEndRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    // 出生年份钳制到合理区间（1950 ~ 去年），避免生成负年龄报告
    const currentYear = new Date().getFullYear();
    const year = parseInt(input.birthYear) || 1995;
    const safeYear = Math.min(Math.max(year, 1950), currentYear - 5);
    const safeInput = { ...input, birthYear: String(safeYear) };
    const result = generateReport(safeInput, weightMap);
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
    abortRef.current = new AbortController();

    // 构建包含自定义内容的上下文
    const customContext = customFillCount > 0
      ? `\n\n【用户自定义信息】\n${input.personality ? `性格：${input.personality}` : ''}\n${input.hobbies ? `兴趣：${input.hobbies}` : ''}\n${input.keyExperiences ? `经历：${input.keyExperiences}` : ''}\n${input.currentChallenge ? `当前困惑：${input.currentChallenge}` : ''}\n${input.otherInfo ? `补充：${input.otherInfo}` : ''}`
      : '';

    const systemContext = `你是一位命运分析顾问，专注于基于个人特质的深度分析与破局策略。

【命运报告】
命（先天条件）：${report.fate}分 | 运（时机环境）：${report.fortune}分 | 努力（可控）：${report.effort}分
综合评分：${report.totalScore}分（${report.tier}级）
当前阶段：${report.phase}（约${report.age}岁）
下一个窗口：${report.nextWindow}
${customContext}

【已有分析】
${report.analysis}

破局建议：${report.suggestions.join('；')}
${report.customInsights.length > 0 ? `\n个性化洞察：${report.customInsights.join('；')}` : ''}

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'destiny',
          item: systemContext,
          question: question || '请综合我的信息和命运报告，给出个性化深度分析与行动方案',
          history: historyForApi,
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
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                setAiContent(accumulated);
              }
              if (parsed.error) throw new Error(parsed.error);
            } catch { /* ignore */ }
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
      {/* Header */}
      <div className="border-b border-border bg-card grain-texture">
        <div className="relative max-w-3xl mx-auto px-6 sm:px-8 py-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
              <span className="font-mono text-[10px] tracking-[0.2em] text-primary/70 shrink-0">MODULE · 07</span>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">REPORT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight mb-3 animate-fade-in-up stagger-1">命运：命势运报告</h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed animate-fade-in-up stagger-2">
              命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式。输入基本信息和你自己的故事，看看你的命运基本面。
            </p>
          </div>
        </div>
      </div>

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
            <label className="text-sm font-semibold text-foreground mb-2 block">出生年份</label>
            <input
              type="number"
              min={1950}
              max={2010}
              value={input.birthYear}
              onChange={(e) => setInput(prev => ({ ...prev, birthYear: e.target.value }))}
              className="w-32 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Family, Education, Location - grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up stagger-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">家庭背景</label>
              <div className="space-y-1.5">
                {(Object.keys(familyLabelMap) as Array<keyof typeof familyLabelMap>).map(key => (
                  <button
                    key={key}
                    onClick={() => setInput(prev => ({ ...prev, familyBackground: key }))}
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
              <label className="text-xs font-semibold text-foreground mb-2 block">学历</label>
              <div className="space-y-1.5">
                {(Object.keys(educationLabelMap) as Array<keyof typeof educationLabelMap>).map(key => (
                  <button
                    key={key}
                    onClick={() => setInput(prev => ({ ...prev, educationLevel: key }))}
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
              <label className="text-xs font-semibold text-foreground mb-2 block">所在地</label>
              <div className="space-y-1.5">
                {(Object.keys(locationLabelMap) as Array<keyof typeof locationLabelMap>).map(key => (
                  <button
                    key={key}
                    onClick={() => setInput(prev => ({ ...prev, location: key }))}
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
            <div className="space-y-4 animate-fade-in-up">
              {customFields.map(field => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <label className="text-xs font-semibold text-foreground">{field.label}</label>
                      {input[field.key] && (
                        <span className="text-[9px] text-primary font-medium">已填写</span>
                      )}
                    </div>
                    <textarea
                      value={input[field.key]}
                      onChange={(e) => setInput(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={field.lines}
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
            {/* Score Section */}
            <div className="rounded-lg border border-border bg-card p-6 animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">命运等级</div>
                <div className={cn(
                  'text-6xl font-serif font-bold mb-1',
                  report.tier === 'S' ? 'text-primary' :
                  report.tier === 'A' ? 'text-green-600 dark:text-green-400' :
                  report.tier === 'B' ? 'text-blue-600 dark:text-blue-400' :
                  report.tier === 'C' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {report.tier}
                </div>
                <div className="text-2xl font-mono font-light text-foreground tabular-nums">{report.totalScore}</div>
              </div>

              {/* Score bars with animation */}
              <div className="space-y-4">
                <AnimatedScoreBar label="命（先天条件）" score={report.fate} color="#ef4444" icon={<Target className="h-3.5 w-3.5 text-red-500" />} delay={200} />
                <AnimatedScoreBar label="运（时机环境）" score={report.fortune} color="#3b82f6" icon={<TrendingUp className="h-3.5 w-3.5 text-blue-500" />} delay={400} />
                <AnimatedScoreBar label="努力（你可控的）" score={report.effort} color="#22c55e" icon={<Zap className="h-3.5 w-3.5 text-green-500" />} delay={600} />
              </div>

              {/* Destiny split visualization */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">命运权重分配</div>
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                  {report.destinySplit.map((seg, i) => (
                    <div
                      key={i}
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${seg.ratio}%`,
                        backgroundColor: seg.color,
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  {report.destinySplit.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: seg.color }} />
                      <span className="text-[10px] text-muted-foreground">{seg.label} {seg.ratio}%</span>
                    </div>
                  ))}
                </div>
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

            {/* Analysis */}
            <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up stagger-3">
              <h3 className="text-sm font-semibold text-foreground mb-3">命运分析</h3>
              {report.analysis.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">{paragraph}</p>
              ))}
            </div>

            {/* Custom Insights - only show when user has filled in custom content */}
            {report.customInsights.length > 0 && (
              <div className="rounded-lg border border-primary/15 bg-primary/[0.02] p-5 animate-fade-in-up stagger-3">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">个性化洞察</h3>
                  <span className="text-[9px] text-primary/60 bg-primary/10 rounded-sm px-1.5 py-0.5">基于你的信息</span>
                </div>
                <ul className="space-y-2.5">
                  {report.customInsights.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-primary/80 dark:text-primary/70">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up stagger-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">破局建议</h3>
              <ul className="space-y-2.5">
                {report.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings */}
            {report.warnings.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800/50 dark:bg-amber-950/20 animate-fade-in-up stagger-5">
                <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  关键提醒
                </h3>
                <ul className="space-y-2">
                  {report.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-700/80 dark:text-amber-400/80">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Deep Analysis Button */}
            <button
              onClick={() => { setAiOpen(true); if (aiMessages.length === 0) startAIAnalysis(); }}
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
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-background border-l border-border shadow-2xl animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wider uppercase">DESTINY ANALYST</span>
                  <h3 className="text-sm font-semibold text-foreground truncate">深度分析 + 解惑</h3>
                </div>
              </div>
              <button
                onClick={() => { if (abortRef.current) abortRef.current.abort(); setAiOpen(false); }}
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
                  {customFillCount > 0
                    ? `基于你的命运报告 + 个人信息（${customFillCount}项自定义内容），AI将从5个维度深度分析。`
                    : '基于你的命运报告，AI将从5个维度深度分析。填写个人信息可以获得更精准的分析。'
                  }
                </p>
                {report && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-sm bg-muted/50 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
                      命:{report.fate}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-sm bg-muted/50 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
                      运:{report.fortune}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-sm bg-muted/50 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
                      努力:{report.effort}
                    </span>
                  </div>
                )}
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
                    <span className="text-xs text-muted-foreground">正在深度分析...</span>
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
                  placeholder="追问：我的性格适合什么方向？/ 如何解决当前困惑？"
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  disabled={aiStreaming}
                />
                <button
                  onClick={handleAISend}
                  disabled={aiStreaming || !aiQuestion.trim()}
                  className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </ModuleGate>
  );
}
