'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAdvancedSettings } from '@/hooks/use-advanced-settings';
import { ModuleGate } from '@/components/auth/module-gate';
import {
  SlidersHorizontal, RotateCcw, Play, Sparkles, TrendingUp,
  AlertTriangle, Lightbulb, ChevronRight,
  Bot, X, Send, Loader2, ClipboardCheck, ArrowRight, BarChart3,
} from 'lucide-react';

// ============================================================
// 量化问卷体系
// ============================================================

interface QuestionOption {
  label: string;
  score: number; // 0-100
}

interface AssessmentQuestion {
  id: string;
  dimension: string; // 对应 dimension key
  text: string;
  options: QuestionOption[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  // === 出身 ===
  {
    id: 'family_1', dimension: 'family',
    text: '你父母的最高学历是？',
    options: [
      { label: '初中及以下', score: 10 },
      { label: '高中/中专', score: 25 },
      { label: '大专', score: 45 },
      { label: '本科', score: 65 },
      { label: '硕士及以上', score: 85 },
    ],
  },
  {
    id: 'family_2', dimension: 'family',
    text: '你成长阶段家庭的经济状况如何？',
    options: [
      { label: '经常为基本生活发愁', score: 10 },
      { label: '勉强够用，没有余裕', score: 30 },
      { label: '小康水平，偶尔有余', score: 55 },
      { label: '较为宽裕，有一定积蓄', score: 75 },
      { label: '优渥，投资和选择自由', score: 90 },
    ],
  },
  {
    id: 'family_3', dimension: 'family',
    text: '你18岁前获得的教育资源（课外辅导、特长培养、优质学校）如何？',
    options: [
      { label: '几乎没有，全靠自学', score: 10 },
      { label: '很少，只上过基本公立学校', score: 30 },
      { label: '有一些，上过部分辅导班', score: 55 },
      { label: '较多，有特长培养和择校', score: 75 },
      { label: '非常丰富，一对一/国际路线', score: 90 },
    ],
  },
  {
    id: 'family_4', dimension: 'family',
    text: '你的家庭能提供的社会人脉和职业引路人如何？',
    options: [
      { label: '完全没有，一切从零开始', score: 10 },
      { label: '只有很基础的亲戚关系', score: 30 },
      { label: '有一些行业内的参考意见', score: 55 },
      { label: '有明确引路人，能内推或介绍', score: 75 },
      { label: '人脉网络强大，多个方向都有资源', score: 90 },
    ],
  },

  // === 天赋 ===
  {
    id: 'talent_1', dimension: 'talent',
    text: '你在学生时代的整体学业排名通常是？',
    options: [
      { label: '后30%，明显吃力', score: 15 },
      { label: '中游50%-70%', score: 35 },
      { label: '前30%-50%', score: 55 },
      { label: '前10%-30%', score: 75 },
      { label: '前5%，轻松领跑', score: 90 },
    ],
  },
  {
    id: 'talent_2', dimension: 'talent',
    text: '学习新技能时，你通常多快能上手？',
    options: [
      { label: '很慢，需要反复练习很久', score: 15 },
      { label: '偏慢，但坚持能跟上', score: 35 },
      { label: '一般速度，正常水平', score: 55 },
      { label: '较快，往往领先同期', score: 75 },
      { label: '极快，别人还在入门我已经精通', score: 90 },
    ],
  },
  {
    id: 'talent_3', dimension: 'talent',
    text: '你的身体素质（体力、运动能力、健康）在同辈中如何？',
    options: [
      { label: '偏弱，容易疲劳或生病', score: 15 },
      { label: '一般，偶尔运动', score: 40 },
      { label: '中等，能保持基本健康', score: 55 },
      { label: '较好，有运动习惯', score: 75 },
      { label: '优秀，长期锻炼/运动员体质', score: 90 },
    ],
  },
  {
    id: 'talent_4', dimension: 'talent',
    text: '你的外貌/形象在社交中的加成如何？',
    options: [
      { label: '几乎没有加成，甚至有减分', score: 15 },
      { label: '普通，不增不减', score: 40 },
      { label: '中等偏上，偶尔被夸', score: 60 },
      { label: '明显有加成，社交容易', score: 80 },
      { label: '非常突出，自带关注', score: 92 },
    ],
  },

  // === 努力 ===
  {
    id: 'effort_1', dimension: 'effort',
    text: '你过去一年中，有多少天在持续做一件有价值的事（学习/健身/副业）？',
    options: [
      { label: '基本没有，三天打鱼两天晒网', score: 10 },
      { label: '偶尔做做，一个月坚持不了几天', score: 25 },
      { label: '断断续续，大约一半时间在坚持', score: 50 },
      { label: '大部分时间在坚持，偶尔中断', score: 72 },
      { label: '几乎每天坚持，极少中断', score: 90 },
    ],
  },
  {
    id: 'effort_2', dimension: 'effort',
    text: '面对困难和挫折时，你的典型反应是？',
    options: [
      { label: '很快放弃，觉得不适合自己', score: 10 },
      { label: '挣扎一阵后放弃', score: 30 },
      { label: '咬牙坚持，但效率下降', score: 50 },
      { label: '调整策略继续推进', score: 72 },
      { label: '越挫越勇，把困难当燃料', score: 90 },
    ],
  },
  {
    id: 'effort_3', dimension: 'effort',
    text: '你每天的有效工作时间（专注、高产出）大约几小时？',
    options: [
      { label: '不到2小时，大量时间被浪费', score: 10 },
      { label: '2-4小时，效率一般', score: 30 },
      { label: '4-6小时，正常水平', score: 55 },
      { label: '6-8小时，非常投入', score: 75 },
      { label: '8小时+，极度自律', score: 92 },
    ],
  },
  {
    id: 'effort_4', dimension: 'effort',
    text: '你有没有一个坚持超过1年的习惯（阅读/运动/写作等）？',
    options: [
      { label: '没有，什么都坚持不了1年', score: 10 },
      { label: '有一个，但经常中断', score: 35 },
      { label: '有一个，坚持还不错', score: 55 },
      { label: '有1-2个稳定的长期习惯', score: 75 },
      { label: '有3个以上深度长期习惯', score: 90 },
    ],
  },

  // === 选择 ===
  {
    id: 'choice_1', dimension: 'choice',
    text: '你人生中最重要的几次选择（专业/工作/城市/伴侣），结果如何？',
    options: [
      { label: '几乎都踩了坑，后悔居多', score: 10 },
      { label: '大部分不太理想', score: 30 },
      { label: '好坏参半，有对有错', score: 55 },
      { label: '大部分选对了方向', score: 75 },
      { label: '几乎都选对了，关键岔路很少失误', score: 90 },
    ],
  },
  {
    id: 'choice_2', dimension: 'choice',
    text: '做重大决策时，你的信息收集和分析习惯如何？',
    options: [
      { label: '凭直觉或随大流', score: 10 },
      { label: '简单了解一下就决定', score: 30 },
      { label: '会查资料、问人，但不系统', score: 55 },
      { label: '系统调研，列利弊清单', score: 75 },
      { label: '深度研究+多角度验证+压力测试', score: 90 },
    ],
  },
  {
    id: 'choice_3', dimension: 'choice',
    text: '你目前所在的城市/行业/赛道，与你个人优势的匹配度如何？',
    options: [
      { label: '很不匹配，感觉在逆风走', score: 10 },
      { label: '匹配度一般，没什么特别优势', score: 30 },
      { label: '还行，能发挥一部分优势', score: 55 },
      { label: '比较匹配，大部分优势能用上', score: 75 },
      { label: '高度匹配，找到了自己的主场', score: 90 },
    ],
  },

  // === 运气 ===
  {
    id: 'luck_1', dimension: 'luck',
    text: '你是否遇到过改变命运的机会（贵人、风口、偶然发现）？',
    options: [
      { label: '从来没有', score: 10 },
      { label: '好像有过，但没抓住', score: 30 },
      { label: '有1-2次，抓住了部分', score: 55 },
      { label: '有几次关键的好运气', score: 75 },
      { label: '运气经常眷顾我', score: 90 },
    ],
  },
  {
    id: 'luck_2', dimension: 'luck',
    text: '你出生和成长的年代/地区，对个人发展是红利还是阻碍？',
    options: [
      { label: '严重阻碍，生错时代和地方', score: 10 },
      { label: '偏阻碍，机会少', score: 30 },
      { label: '不好不坏，正常水平', score: 55 },
      { label: '偏红利，赶上好时候', score: 75 },
      { label: '大红利，站在时代浪潮上', score: 90 },
    ],
  },
  {
    id: 'luck_3', dimension: 'luck',
    text: '你遇到重大危机（失业/疾病/意外）时，结果如何？',
    options: [
      { label: '每次都损失惨重，很难恢复', score: 10 },
      { label: '大多损失较大', score: 30 },
      { label: '有惊无险，能撑过去', score: 55 },
      { label: '总能化险为夷', score: 75 },
      { label: '危机反而变成转机', score: 90 },
    ],
  },
];

// ============================================================
// 维度定义与计算
// ============================================================

interface SimDimension {
  key: string;
  label: string;
  description: string;
  value: number;
  weight: number;
  color: string;
  icon: string;
}

const dimensionDefaults: Omit<SimDimension, 'value'>[] = [
  { key: 'family', label: '出身', description: '家庭经济与文化资本', weight: 0.25, color: '#ef4444', icon: '🏠' },
  { key: 'talent', label: '天赋', description: '智商、体能、外貌等先天禀赋', weight: 0.20, color: '#a855f7', icon: '🧬' },
  { key: 'effort', label: '努力', description: '时间投入、自律、坚持', weight: 0.20, color: '#22c55e', icon: '💪' },
  { key: 'choice', label: '选择', description: '赛道、城市、伴侣等关键决策', weight: 0.20, color: '#3b82f6', icon: '🧭' },
  { key: 'luck', label: '运气', description: '时代红利、偶遇、随机事件', weight: 0.15, color: '#f59e0b', icon: '🍀' },
];

function createDefaultDimensions(): SimDimension[] {
  return dimensionDefaults.map(d => ({ ...d, value: 50 }));
}

function calculateScore(dims: SimDimension[], weightMap?: Record<string, number>): number {
  if (weightMap) {
    // Apply custom weights from advanced settings, normalized to sum=1
    const customWeights: Record<string, number> = {};
    let totalW = 0;
    for (const d of dims) {
      const w = weightMap[d.key] ?? d.weight;
      customWeights[d.key] = w;
      totalW += w;
    }
    return Math.round(dims.reduce((s, d) => s + d.value * (customWeights[d.key] / totalW), 0));
  }
  return Math.round(dims.reduce((s, d) => s + d.value * d.weight, 0));
}

function getScoreLabel(score: number): { label: string; tier: string; color: string; desc: string } {
  if (score >= 80) return { label: 'S', tier: '顶级', color: 'text-primary', desc: '天时地利人和——大部分人在这个区间需要至少两个维度极高' };
  if (score >= 65) return { label: 'A', tier: '优秀', color: 'text-green-600 dark:text-green-400', desc: '大部分维度在线，少数短板不影响大局' };
  if (score >= 50) return { label: 'B', tier: '中等', color: 'text-blue-600 dark:text-blue-400', desc: '有亮点有短板，关键看选择是否踩对了点' };
  if (score >= 35) return { label: 'C', tier: '偏弱', color: 'text-amber-600 dark:text-amber-400', desc: '需要更多努力弥补，但仍有翻盘可能' };
  return { label: 'D', tier: '困难', color: 'text-red-600 dark:text-red-400', desc: '人生难度模式——但历史上逆风翻盘的故事比比皆是' };
}

function getScenarioText(dims: SimDimension[]): string {
  const d = Object.fromEntries(dims.map(dim => [dim.key, dim.value])) as Record<string, number>;
  const parts: string[] = [];

  if (d.family >= 70) parts.push('你出生在优越的家庭，有充足的资源支持');
  else if (d.family >= 40) parts.push('你出身普通，没有特别的资源优势');
  else parts.push('你出生在经济困难的家庭，一切要靠自己');

  if (d.talent >= 70) parts.push('。你天赋出众，学什么都比人快');
  else if (d.talent >= 40) parts.push('。你资质平平，但也不算差');
  else parts.push('。你天资有限，需要比别人付出更多');

  if (d.effort >= 70) parts.push('。你极其自律，是那种别人眼中的狠人');
  else if (d.effort >= 40) parts.push('。你有时努力有时摆烂，普通人水平');
  else parts.push('。你缺乏自律，经常在关键时刻掉链子');

  if (d.choice >= 70) parts.push('。关键岔路口你都选对了方向');
  else if (d.choice >= 40) parts.push('。你有些选择做对了，有些后悔莫及');
  else parts.push('。你的关键决策几乎都踩了坑');

  if (d.luck >= 70) parts.push('。运气总站在你这边，贵人不断');
  else if (d.luck >= 40) parts.push('。运气不好不坏，该有的机会也有');
  else parts.push('。运气似乎总和你作对，生不逢时');

  return parts.join('');
}

function getStrategyAdvice(dims: SimDimension[]): { strategy: string; leverage: string; weakFix: string } {
  const sorted = dims.slice().sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const strategy = `你最强的维度是「${strongest.label}」(${strongest.value})，最弱的是「${weakest.label}」(${weakest.value})。${weakest.value < 40 ? '短板明显，但短板恰恰是最大的增长空间。' : '维度比较均衡，寻找杠杆点来突破。'}`;

  const leverageMap: Record<string, string> = {
    family: '利用家庭资源作为安全网，大胆尝试高风险高回报的选择——你的兜底能力比别人强。',
    talent: '把天赋转化为不可替代的技能——天赋不兑现就是浪费，兑现了就是护城河。',
    effort: '用努力建立复利——坚持做一件事10000小时，你的对手就不是普通人了。',
    choice: '继续做对选择——你已经有好判断力，关键是找到更大的决策杠杆（更大的城市、更好的赛道）。',
    luck: '运气好的时候要加仓——贵人、时机、红利，来的时候要敢于All in。',
  };

  const weakFixMap: Record<string, string> = {
    family: '出身无法改变，但人脉可以重建。主动寻找导师、加入高质量社群，用"后天人脉"弥补"先天人脉"。',
    talent: '天赋不够，策略来凑。找到你的细分优势（不需要全面碾压，在一个点上做深就够了），用差异化竞争代替正面硬刚。',
    effort: '努力是最可控的维度。从最小的习惯开始——每天30分钟专注做一件事，坚持100天后你就超越了80%的人。不需要意志力，需要系统。',
    choice: '提升决策质量的方法是增加信息量。每周花2小时研究一个新领域，3年后你的视野和判断力会质变。关键是"多看"才能"选对"。',
    luck: '运气无法控制，但可以增加运气的表面积。多尝试、多社交、多暴露在新环境中——运气是概率游戏，增加尝试次数就是增加好运的期望值。',
  };

  return {
    strategy,
    leverage: leverageMap[strongest.key] || '',
    weakFix: weakFixMap[weakest.key] || '',
  };
}

// Radar chart constants
const CHART_SIZE = 220;
const CHART_CENTER = CHART_SIZE / 2;
const CHART_RADIUS = 85;

function polarToCartesian(angle: number, radius: number): { x: number; y: number } {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: CHART_CENTER + radius * Math.cos(rad), y: CHART_CENTER + radius * Math.sin(rad) };
}

// ============================================================
// 步骤枚举
// ============================================================

type Step = 'assessment' | 'result' | 'simulate';

// ============================================================
// 主组件
// ============================================================

export default function SimulationPage() {
  const { defaultAge, weightMap: advWeightMap } = useAdvancedSettings();
  const [step, setStep] = useState<Step>('assessment');
  const [dimensions, setDimensions] = useState<SimDimension[]>(createDefaultDimensions());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [simulated, setSimulated] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // AI 面板
  const [aiOpen, setAiOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiStreaming, setAiStreaming] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const aiEndRef = useRef<HTMLDivElement>(null);

  // Build weight map from advanced settings (map settings keys to sim dimension keys)
  const simWeightMap = useMemo(() => {
    return {
      family: advWeightMap.family_background,
      talent: advWeightMap.talent,
      effort: advWeightMap.effort,
      choice: advWeightMap.choice,
      luck: advWeightMap.luck,
    };
  }, [advWeightMap]);

  const score = calculateScore(dimensions, simWeightMap);
  const scoreInfo = getScoreLabel(score);
  const scenarioText = simulated ? getScenarioText(dimensions) : '';
  const advice = simulated ? getStrategyAdvice(dimensions) : null;

  // 问卷完成度
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = assessmentQuestions.length;
  const assessmentComplete = answeredCount === totalQuestions;

  // 按维度分组题目
  const questionsByDimension = useMemo(() => {
    const groups: Record<string, AssessmentQuestion[]> = {};
    for (const q of assessmentQuestions) {
      if (!groups[q.dimension]) groups[q.dimension] = [];
      groups[q.dimension].push(q);
    }
    return groups;
  }, []);

  const dimensionOrder = ['family', 'talent', 'effort', 'choice', 'luck'];
  const dimensionLabels: Record<string, string> = {
    family: '出身', talent: '天赋', effort: '努力', choice: '选择', luck: '运气',
  };
  const dimensionIcons: Record<string, string> = {
    family: '🏠', talent: '🧬', effort: '💪', choice: '🧭', luck: '🍀',
  };
  const dimensionColors: Record<string, string> = {
    family: '#ef4444', talent: '#a855f7', effort: '#22c55e', choice: '#3b82f6', luck: '#f59e0b',
  };

  // 从问卷答案计算维度分数
  const calculateFromAnswers = useCallback(() => {
    const dimScores: Record<string, number[]> = {};
    for (const q of assessmentQuestions) {
      if (!dimScores[q.dimension]) dimScores[q.dimension] = [];
      const answer = answers[q.id];
      if (answer) {
        const opt = q.options.find(o => o.label === answer);
        if (opt) dimScores[q.dimension].push(opt.score);
      }
    }
    return dimensionDefaults.map(d => {
      const scores = dimScores[d.key] || [];
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 50;
      return { ...d, value: avg };
    });
  }, [answers]);

  // 完成问卷
  const handleCompleteAssessment = useCallback(() => {
    const dims = calculateFromAnswers();
    setDimensions(dims);
    setStep('result');
  }, [calculateFromAnswers]);

  // 手动微调滑块
  const handleSliderChange = useCallback((key: string, value: number) => {
    setDimensions(prev => prev.map(d => d.key === key ? { ...d, value } : d));
  }, []);

  // 重置
  const handleReset = useCallback(() => {
    setDimensions(createDefaultDimensions());
    setSimulated(false);
  }, []);

  // 重新评估
  const handleReassess = useCallback(() => {
    setStep('assessment');
    setSimulated(false);
  }, []);

  // 推演
  const handleSimulate = useCallback(() => {
    setSimulated(true);
  }, []);

  useEffect(() => {
    setAnimatedScore(score);
  }, [score]);

  // Radar chart
  const angles = dimensions.map((_, i) => (360 / dimensions.length) * i);
  const radarPoints = dimensions.map((d, i) => {
    const r = (d.value / 100) * CHART_RADIUS;
    const point = polarToCartesian(angles[i], r);
    return `${point.x},${point.y}`;
  });
  const radarPath = `M ${radarPoints.join(' L ')} Z`;
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // ============================================================
  // AI 流式分析
  // ============================================================
  const startAIAnalysis = useCallback(async (question?: string) => {
    setAiStreaming(true);
    setAiContent('');
    abortRef.current = new AbortController();

    const dimSummary = dimensions.map(d => {
      const totalW = Object.values(simWeightMap).reduce((a: number, b: number) => a + b, 0);
      const customW = simWeightMap[d.key as keyof typeof simWeightMap] ?? d.weight;
      const wPct = Math.round((customW / totalW) * 100);
      return `${d.label}：${d.value}/100（权重${wPct}%）`;
    }).join('\n');
    const contextStr = `综合评分：${score}分（${scoreInfo.tier}）\n${dimSummary}\n\n${scenarioText}\n${advice ? `\n策略：${advice.strategy}\n杠杆：${advice.leverage}\n短板修复：${advice.weakFix}` : ''}`;

    const systemContext = `你是一位人生战略顾问，专注于命运维度的深度分析与破局方案。用户刚完成了命运模拟器的量化评估。
${defaultAge > 0 ? `\n用户当前年龄：${defaultAge}岁` : ''}

${contextStr}

请从以下维度给出深度分析：
1. **维度画像**：当前五个维度的组合，构成什么样的人生画像
2. **关键瓶颈**：哪个维度是当前最大的限制因素，为什么
3. **破局路径**：针对最弱维度，给出3条具体可执行的提升方案（不是鸡汤，要可操作）
4. **杠杆策略**：如何用最强维度撬动最弱维度的改善
5. **执行时间表**：30天/90天/1年的具体行动里程碑

要求：直接、有力度、不说废话。用数据和逻辑说话，不要鸡汤。`;

    const historyForApi = aiMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'simulation',
          item: systemContext,
          question: question || '请给出我当前人生维度的深度分析和破局方案',
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
  }, [dimensions, score, scoreInfo, scenarioText, advice, aiMessages, defaultAge, simWeightMap]);

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
    <ModuleGate modulePath="/simulation">
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card grain-texture">
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3 animate-fade-in-up">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400 shadow-sm">
                <SlidersHorizontal className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/60 tracking-[0.2em]">MODULE 05</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2 animate-fade-in-up stagger-1">命运模拟器</h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed animate-fade-in-up stagger-2">
              {step === 'assessment'
                ? '先回答量化问卷，客观评估你的五个维度。无法评判自己？选项替你量化。'
                : step === 'result'
                  ? '问卷结果已出。你可以微调滑块，然后推演你的人生画像和破局策略。'
                  : '推演完成。查看你的人生画像、策略建议，或让AI给出深度分析与行动方案。'
              }
              {defaultAge > 0 && (
                <span className="ml-2 text-xs text-muted-foreground/50 font-mono">
                  (当前年龄 {defaultAge} 岁)
                </span>
              )}
            </p>

            {/* 步骤指示器 */}
            <div className="flex items-center gap-3 mt-5 animate-fade-in-up stagger-3">
              {[
                { key: 'assessment', label: '量化评估', icon: ClipboardCheck },
                { key: 'result', label: '结果微调', icon: BarChart3 },
                { key: 'simulate', label: '推演分析', icon: Play },
              ].map((s, i) => {
                const isActive = s.key === step;
                const isDone = (s.key === 'assessment' && step !== 'assessment') ||
                  (s.key === 'result' && step === 'simulate');
                return (
                  <div key={s.key} className="flex items-center gap-2">
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold transition-all',
                      isActive ? 'bg-primary text-primary-foreground' :
                      isDone ? 'bg-primary/20 text-primary' :
                      'bg-muted/40 text-muted-foreground/50'
                    )}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span className={cn(
                      'text-[10px] font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground/50'
                    )}>{s.label}</span>
                    {i < 2 && <div className="w-6 h-px bg-border" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        {/* ==================== 步骤1: 量化问卷 ==================== */}
        {step === 'assessment' && (
          <div className="space-y-8 animate-fade-in-up">
            {/* 进度条 */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">评估进度</span>
                <span className="text-xs font-mono text-muted-foreground tabular-nums">{answeredCount}/{totalQuestions}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 progress-shimmer"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* 按维度分组 */}
            {dimensionOrder.map(dimKey => {
              const questions = questionsByDimension[dimKey] || [];
              return (
                <div key={dimKey} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{dimensionIcons[dimKey]}</span>
                    <h2 className="text-sm font-semibold text-foreground">{dimensionLabels[dimKey]}</h2>
                    <span className="text-[10px] text-muted-foreground/50 font-mono">
                      {questions.filter(q => answers[q.id]).length}/{questions.length} 已答
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {questions.map(q => {
                    const selected = answers[q.id];
                    return (
                      <div key={q.id} className="rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors">
                        <p className="text-sm text-foreground mb-3 font-medium">{q.text}</p>
                        <div className="space-y-2">
                          {q.options.map(opt => (
                            <button
                              key={opt.label}
                              onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.label }))}
                              className={cn(
                                'w-full flex items-center gap-3 rounded-md border px-3 py-2 text-left transition-all text-xs',
                                selected === opt.label
                                  ? 'border-primary/40 bg-primary/[0.06] text-foreground font-medium'
                                  : 'border-border/50 bg-background text-muted-foreground hover:border-border hover:text-foreground'
                              )}
                            >
                              <span className={cn(
                                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all',
                                selected === opt.label
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border'
                              )}>
                                {selected === opt.label && <span className="text-[8px]">✓</span>}
                              </span>
                              <span className="flex-1">{opt.label}</span>
                              <span className={cn(
                                'text-[9px] font-mono tabular-nums',
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

            {/* 提交按钮 */}
            <div className="flex items-center gap-3 pt-2 pb-8">
              <button
                onClick={handleCompleteAssessment}
                disabled={!assessmentComplete}
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] btn-press disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:shadow-none"
              >
                查看评估结果
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              {!assessmentComplete && (
                <span className="text-xs text-muted-foreground/60">
                  还需回答 {totalQuestions - answeredCount} 题
                </span>
              )}
            </div>
          </div>
        )}

        {/* ==================== 步骤2: 结果微调 ==================== */}
        {step === 'result' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in-up">
            {/* Left: Sliders */}
            <div className="lg:col-span-3 space-y-5">
              <div className="rounded-lg border border-primary/20 bg-primary/[0.02] p-4 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">问卷评估结果</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  以下分数基于你的问卷回答自动计算。你可以拖动滑块微调——比如你认为某个维度被低估了。
                </p>
              </div>

              {dimensions.map((dim) => (
                <div key={dim.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{dim.icon}</span>
                      <span className="text-sm font-semibold text-foreground">{dim.label}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">{dim.description}</span>
                    </div>
                    <span className={cn(
                      'text-sm font-mono font-semibold w-8 text-right tabular-nums',
                      dim.value >= 70 ? 'text-green-600 dark:text-green-400' :
                      dim.value >= 40 ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-600 dark:text-red-400'
                    )}>
                      {dim.value}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={dim.value}
                      onChange={(e) => handleSliderChange(dim.key, parseInt(e.target.value))}
                      className="w-full"
                      style={{
                        background: `linear-gradient(to right, ${dim.color} 0%, ${dim.color} ${dim.value}%, var(--muted) ${dim.value}%, var(--muted) 100%)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground/40">
                    <span>极低</span>
                    <span>中等</span>
                    <span>极高</span>
                  </div>
                </div>
              ))}

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSimulate}
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] btn-press"
                >
                  <Play className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  推演命运
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:shadow-sm active:scale-[0.98] btn-press"
                >
                  <RotateCcw className="h-4 w-4" />
                  重置
                </button>
                <button
                  onClick={handleReassess}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:shadow-sm active:scale-[0.98] btn-press"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  重新评估
                </button>
              </div>

              {/* Scenario text */}
              {simulated && (
                <div className="space-y-4 mt-4">
                  <div className="rounded-lg border border-primary/20 bg-primary/[0.02] p-5 animate-scale-in">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">你的人生推演</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{scenarioText}</p>
                  </div>

                  {/* Strategy advice */}
                  {advice && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in-up stagger-2">
                      <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          <h4 className="text-xs font-semibold text-foreground">现状分析</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{advice.strategy}</p>
                      </div>
                      <div className="rounded-lg border border-primary/10 bg-primary/[0.01] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-3.5 w-3.5 text-primary" />
                          <h4 className="text-xs font-semibold text-foreground">杠杆策略</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{advice.leverage}</p>
                      </div>
                      <div className="rounded-lg border border-green-200/40 dark:border-green-800/30 bg-green-50/30 dark:bg-green-950/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          <h4 className="text-xs font-semibold text-foreground">短板修复</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{advice.weakFix}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Radar Chart + Score */}
            <div className="lg:col-span-2 space-y-5">
              {/* Radar Chart */}
              <div className="rounded-lg border border-border bg-card p-5 flex flex-col items-center">
                <svg width={CHART_SIZE} height={CHART_SIZE} className="mb-1">
                  {gridLevels.map(level => {
                    const r = level * CHART_RADIUS;
                    const points = angles.map(a => {
                      const p = polarToCartesian(a, r);
                      return `${p.x},${p.y}`;
                    });
                    return (
                      <polygon key={level} points={points.join(' ')} fill="none" stroke="currentColor" className="text-border" strokeWidth={1} />
                    );
                  })}
                  {angles.map((a, i) => {
                    const end = polarToCartesian(a, CHART_RADIUS);
                    return <line key={i} x1={CHART_CENTER} y1={CHART_CENTER} x2={end.x} y2={end.y} stroke="currentColor" className="text-border/60" strokeWidth={0.5} />;
                  })}
                  <path d={radarPath} fill="currentColor" className="text-primary/10" stroke="currentColor" strokeWidth={2} style={{ stroke: 'var(--primary)' }} />
                  {dimensions.map((d, i) => {
                    const r = (d.value / 100) * CHART_RADIUS;
                    const p = polarToCartesian(angles[i], r);
                    return (
                      <g key={d.key}>
                        <circle cx={p.x} cy={p.y} r={6} fill={d.color} opacity={0.15} />
                        <circle cx={p.x} cy={p.y} r={3.5} fill={d.color} />
                        <circle cx={p.x} cy={p.y} r={1.5} fill="white" opacity={0.5} />
                      </g>
                    );
                  })}
                  {dimensions.map((d, i) => {
                    const labelR = CHART_RADIUS + 20;
                    const p = polarToCartesian(angles[i], labelR);
                    return (
                      <text key={d.key} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground text-[11px]">
                        {d.label}
                      </text>
                    );
                  })}
                </svg>
                <div className="flex items-center gap-3 mt-1 flex-wrap justify-center">
                  {dimensions.map(d => (
                    <div key={d.key} className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[9px] text-muted-foreground">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">综合评分</div>
                <div className={cn('text-5xl font-serif font-bold mb-1 transition-colors duration-300', scoreInfo.color)}>
                  {scoreInfo.label}
                </div>
                <div className="text-3xl font-mono font-light text-foreground mb-2 tabular-nums">{animatedScore}</div>
                <div className="text-[10px] text-muted-foreground font-medium">{scoreInfo.tier}</div>
                <div className="mt-3 text-[10px] text-muted-foreground/60 leading-relaxed">{scoreInfo.desc}</div>
              </div>

              {/* Dimension weights */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.15em] mb-3">维度权重</h3>
                {dimensions.map(d => (
                  <div key={d.key} className="flex items-center gap-2 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-muted-foreground flex-1">{d.label}</span>
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden mr-1">
                      <div className="h-full rounded-full transition-all" style={{ width: `${d.weight * 100}%`, backgroundColor: d.color, opacity: 0.5 }} />
                    </div>
                    <span className="text-[10px] font-mono text-foreground tabular-nums w-6 text-right">{Math.round(d.weight * 100)}%</span>
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div className="rounded-lg border border-border bg-muted/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">破局思路</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  大多数人把所有精力花在「努力」这一个维度上，但提升一个弱维度20分，比提升一个强维度20分的收益更大。找到你的最弱维度，它就是你最大的增长空间。
                </p>
              </div>

              {/* AI Analysis Button */}
              {simulated && (
                <button
                  onClick={() => { setAiOpen(true); if (aiMessages.length === 0) startAIAnalysis(); }}
                  className="w-full group rounded-lg border border-primary/20 bg-primary/[0.03] p-4 flex items-center justify-between transition-all hover:bg-primary/[0.06] hover:border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-foreground">AI 深度分析 + 解惑</p>
                      <p className="text-[11px] text-muted-foreground">多维度人生战略、破局路径、行动时间表</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==================== 步骤3: 推演结果（同result布局，simulated=true） ==================== */}
        {step === 'simulate' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in-up">
            {/* Left: Dimensions + Scenario */}
            <div className="lg:col-span-3 space-y-5">
              {/* 维度得分卡 */}
              <div className="grid grid-cols-5 gap-2">
                {dimensions.map(d => (
                  <div key={d.key} className="rounded-lg border border-border bg-card p-3 text-center">
                    <span className="text-lg">{d.icon}</span>
                    <div className={cn(
                      'text-lg font-mono font-bold mt-1',
                      d.value >= 70 ? 'text-green-600 dark:text-green-400' :
                      d.value >= 40 ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-600 dark:text-red-400'
                    )}>{d.value}</div>
                    <div className="text-[10px] text-muted-foreground">{d.label}</div>
                  </div>
                ))}
              </div>

              {/* Scenario text */}
              {scenarioText && (
                <div className="rounded-lg border border-primary/20 bg-primary/[0.02] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">你的人生推演</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{scenarioText}</p>
                </div>
              )}

              {/* Strategy advice */}
              {advice && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <h4 className="text-xs font-semibold text-foreground">现状分析</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{advice.strategy}</p>
                  </div>
                  <div className="rounded-lg border border-primary/10 bg-primary/[0.01] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-3.5 w-3.5 text-primary" />
                      <h4 className="text-xs font-semibold text-foreground">杠杆策略</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{advice.leverage}</p>
                  </div>
                  <div className="rounded-lg border border-green-200/40 dark:border-green-800/30 bg-green-50/30 dark:bg-green-950/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <h4 className="text-xs font-semibold text-foreground">短板修复</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{advice.weakFix}</p>
                  </div>
                </div>
              )}

              {/* 可微调滑块 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-foreground">微调维度</h3>
                  <button onClick={() => { setStep('result'); setSimulated(false); }} className="text-[10px] text-primary hover:text-primary/80 transition-colors">
                    返回完整微调
                  </button>
                </div>
                {dimensions.map(d => (
                  <div key={d.key} className="flex items-center gap-3 py-1.5">
                    <span className="text-xs">{d.icon}</span>
                    <span className="text-xs text-muted-foreground w-8">{d.label}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={d.value}
                      onChange={(e) => handleSliderChange(d.key, parseInt(e.target.value))}
                      className="flex-1"
                      style={{
                        background: `linear-gradient(to right, ${d.color} 0%, ${d.color} ${d.value}%, var(--muted) ${d.value}%, var(--muted) 100%)`,
                      }}
                    />
                    <span className="text-[10px] font-mono text-foreground tabular-nums w-6 text-right">{d.value}</span>
                  </div>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReassess}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-accent active:scale-[0.98] btn-press"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  重新评估
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-accent active:scale-[0.98] btn-press"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  重置
                </button>
              </div>
            </div>

            {/* Right: Score + Radar + AI */}
            <div className="lg:col-span-2 space-y-5">
              {/* Score */}
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">综合评分</div>
                <div className={cn('text-5xl font-serif font-bold mb-1 transition-colors duration-300', scoreInfo.color)}>
                  {scoreInfo.label}
                </div>
                <div className="text-3xl font-mono font-light text-foreground mb-2 tabular-nums">{animatedScore}</div>
                <div className="text-[10px] text-muted-foreground font-medium">{scoreInfo.tier}</div>
                <div className="mt-3 text-[10px] text-muted-foreground/60 leading-relaxed">{scoreInfo.desc}</div>
              </div>

              {/* Radar Chart */}
              <div className="rounded-lg border border-border bg-card p-5 flex flex-col items-center">
                <svg width={CHART_SIZE} height={CHART_SIZE} className="mb-1">
                  {gridLevels.map(level => {
                    const r = level * CHART_RADIUS;
                    const pts = angles.map(a => {
                      const p = polarToCartesian(a, r);
                      return `${p.x},${p.y}`;
                    });
                    return <polygon key={level} points={pts.join(' ')} fill="none" stroke="currentColor" className="text-border" strokeWidth={1} />;
                  })}
                  {angles.map((a, i) => {
                    const end = polarToCartesian(a, CHART_RADIUS);
                    return <line key={i} x1={CHART_CENTER} y1={CHART_CENTER} x2={end.x} y2={end.y} stroke="currentColor" className="text-border/60" strokeWidth={0.5} />;
                  })}
                  <path d={radarPath} fill="currentColor" className="text-primary/10" stroke="currentColor" strokeWidth={2} style={{ stroke: 'var(--primary)' }} />
                  {dimensions.map((d, i) => {
                    const r = (d.value / 100) * CHART_RADIUS;
                    const p = polarToCartesian(angles[i], r);
                    return (
                      <g key={d.key}>
                        <circle cx={p.x} cy={p.y} r={6} fill={d.color} opacity={0.15} />
                        <circle cx={p.x} cy={p.y} r={3.5} fill={d.color} />
                        <circle cx={p.x} cy={p.y} r={1.5} fill="white" opacity={0.5} />
                      </g>
                    );
                  })}
                  {dimensions.map((d, i) => {
                    const labelR = CHART_RADIUS + 20;
                    const p = polarToCartesian(angles[i], labelR);
                    return (
                      <text key={d.key} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground text-[11px]">
                        {d.label}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* AI 深度分析 + 解惑 */}
              <button
                onClick={() => { setAiOpen(true); if (aiMessages.length === 0) startAIAnalysis(); }}
                className="w-full group rounded-lg border border-primary/20 bg-primary/[0.03] p-4 flex items-center justify-between transition-all hover:bg-primary/[0.06] hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">AI 深度分析 + 解惑</p>
                    <p className="text-[11px] text-muted-foreground">维度画像、破局路径、行动时间表</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
              </button>
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
                  <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wider uppercase">AI STRATEGIST</span>
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
                  基于你的量化评估结果，AI将从5个维度深度分析：维度画像、关键瓶颈、破局路径、杠杆策略、执行时间表。你可以追问任何维度或策略。
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {dimensions.map(d => (
                    <span key={d.key} className="inline-flex items-center gap-1 rounded-sm bg-muted/50 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
                      {d.icon} {d.label}:{d.value}
                    </span>
                  ))}
                </div>
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
                  placeholder="追问：我的努力维度怎么提升？/ 短板如何弥补？"
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
