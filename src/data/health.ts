/**
 * 健康 / 精力数据层（第 8 模块 /health）
 *
 * 结构与 laws 平行：类型 + 分组配置 + 各维度条目数组。
 * 每条是一条「隐性代价」信号——身体或精力里正在悄悄转动、你不一定察觉的齿轮。
 * 7 个子域各 ~18 条，供自评结果按域匹配展示。
 *
 * 纪律：只写主流医学/运动科学共识范围内的常识性建议，
 * 不写诊断结论、不替代就医；涉及症状一律引导「就医」而非自诊。
 */

export type HealthDomainId =
  | 'checkup'
  | 'sleep-cycle'
  | 'sleep-quality'
  | 'diet'
  | 'exercise'
  | 'energy'
  | 'cognition';

export type HealthTag = 'risk' | 'watch' | 'good' | 'neutral';

export interface HealthSignal {
  id: string;
  domain: HealthDomainId;
  name: string;
  description: string;
  /** 指标名，如「深度睡眠占比」 */
  metric: string;
  /** 健康范围 / 目标值 */
  healthyRange: string;
  /** 预警信号（出现这些就该重视或就医） */
  warning: string;
  strategies: string[];
  tag: HealthTag;
  /** 对健康的杠杆强度 1-5，越大越值得优先处理 */
  intensity: 1 | 2 | 3 | 4 | 5;
}

export interface HealthDomain {
  id: HealthDomainId;
  name: string;
  subtitle: string;
  icon: string;
}

import { HEALTH_CHECKUP_ITEMS } from './health-checkup';
import { HEALTH_SLEEP_CYCLE_ITEMS } from './health-sleep-cycle';
import { HEALTH_SLEEP_QUALITY_ITEMS } from './health-sleep-quality';
import { HEALTH_DIET_ITEMS } from './health-diet';
import { HEALTH_EXERCISE_ITEMS } from './health-exercise';
import { HEALTH_ENERGY_ITEMS } from './health-energy';
import { HEALTH_COGNITION_ITEMS } from './health-cognition';

export const HEALTH_DOMAINS: HealthDomain[] = [
  { id: 'checkup', name: '体检指标', subtitle: '血液里的沉默信号', icon: '🩺' },
  { id: 'sleep-cycle', name: '睡眠周期', subtitle: '作息的内存回收', icon: '🌙' },
  { id: 'sleep-quality', name: '睡眠质量', subtitle: '睡着了不等于睡好了', icon: '🛏️' },
  { id: 'diet', name: '饮食营养', subtitle: '你每天在建造的肉身', icon: '🥗' },
  { id: 'exercise', name: '运动体能', subtitle: '四十岁后的体能储蓄', icon: '🏃' },
  { id: 'energy', name: '精力曲线', subtitle: '一天里你能用的电量', icon: '⚡' },
  { id: 'cognition', name: '认知情绪', subtitle: '情绪成本与大脑保养', icon: '🧠' },
];

export const HEALTH_ITEMS_BY_DOMAIN: Record<HealthDomainId, HealthSignal[]> = {
  checkup: HEALTH_CHECKUP_ITEMS,
  'sleep-cycle': HEALTH_SLEEP_CYCLE_ITEMS,
  'sleep-quality': HEALTH_SLEEP_QUALITY_ITEMS,
  diet: HEALTH_DIET_ITEMS,
  exercise: HEALTH_EXERCISE_ITEMS,
  energy: HEALTH_ENERGY_ITEMS,
  cognition: HEALTH_COGNITION_ITEMS,
};

export const HEALTH_ALL_ITEMS: HealthSignal[] = HEALTH_DOMAINS.flatMap((d) => HEALTH_ITEMS_BY_DOMAIN[d.id]);

export const HEALTH_TAG_CONFIG: Record<HealthTag, { label: string; color: string }> = {
  risk: { label: '风险', color: 'text-red-600 dark:text-red-400' },
  watch: { label: '留意', color: 'text-amber-600 dark:text-amber-400' },
  good: { label: '良好', color: 'text-green-600 dark:text-green-400' },
  neutral: { label: '常识', color: 'text-muted-foreground' },
};

/* ============================================================
 * 自评问卷：每个子域 2 题，选项分数越高越健康（0-100）
 * ============================================================ */

export interface HealthQuestionOption {
  label: string;
  score: number;
}

export interface HealthQuestion {
  id: string;
  domain: HealthDomainId;
  text: string;
  options: HealthQuestionOption[];
}

export const HEALTH_QUESTIONS: HealthQuestion[] = [
  // ===== 体检指标 =====
  {
    id: 'checkup_1', domain: 'checkup',
    text: '你最近一次全面体检（含血常规、血脂血糖、肝肾功能）是多久前？',
    options: [
      { label: '3 年以上没做过', score: 10 },
      { label: '1-3 年内做过一次', score: 40 },
      { label: '1 年内做过', score: 70 },
      { label: '每年规律体检，指标都在正常范围', score: 92 },
    ],
  },
  {
    id: 'checkup_2', domain: 'checkup',
    text: '你已知的代谢指标（血压/血脂/血糖/尿酸/体重）情况如何？',
    options: [
      { label: '已有异常，且没在控制', score: 10 },
      { label: '有指标在临界或偶尔异常', score: 35 },
      { label: '基本正常，没特别关注', score: 60 },
      { label: '全部正常且长期稳定', score: 90 },
    ],
  },
  // ===== 睡眠周期 =====
  {
    id: 'sleepcycle_1', domain: 'sleep-cycle',
    text: '你每天的入睡和起床时间规律吗？',
    options: [
      { label: '很不规律，周末和工作日差 3 小时以上', score: 15 },
      { label: '比较乱，经常熬夜补觉', score: 35 },
      { label: '大致规律，偶有波动', score: 65 },
      { label: '长期固定，误差不超过 1 小时', score: 90 },
    ],
  },
  {
    id: 'sleepcycle_2', domain: 'sleep-cycle',
    text: '你平均每晚的睡眠时长大约是多少？',
    options: [
      { label: '不足 6 小时', score: 10 },
      { label: '6 小时左右', score: 35 },
      { label: '7 小时左右', score: 70 },
      { label: '7-8 小时且睡醒不困', score: 92 },
    ],
  },
  // ===== 睡眠质量 =====
  {
    id: 'sleepquality_1', domain: 'sleep-quality',
    text: '你躺下后能否较快入睡（30 分钟内）？',
    options: [
      { label: '经常翻来覆去 1 小时以上', score: 12 },
      { label: '要拖挺久才睡着', score: 38 },
      { label: '大多能半小时内入睡', score: 70 },
      { label: '基本沾枕就着', score: 92 },
    ],
  },
  {
    id: 'sleepquality_2', domain: 'sleep-quality',
    text: '你夜间是否会频繁醒来，或睡醒后仍觉疲惫？',
    options: [
      { label: '经常夜醒多次，白天靠咖啡撑', score: 12 },
      { label: '偶尔夜醒，醒来偏累', score: 40 },
      { label: '很少夜醒，睡眠较实', score: 70 },
      { label: '一夜到天亮，醒来有精神', score: 92 },
    ],
  },
  // ===== 饮食营养 =====
  {
    id: 'diet_1', domain: 'diet',
    text: '你的三餐是否规律，日常新鲜蔬果摄入如何？',
    options: [
      { label: '常不吃早饭，蔬菜水果很少', score: 12 },
      { label: '三餐乱，外卖为主', score: 38 },
      { label: '三餐大致规律，蔬果一般', score: 65 },
      { label: '三餐规律，每天有足量蔬果', score: 90 },
    ],
  },
  {
    id: 'diet_2', domain: 'diet',
    text: '你对糖、油、盐和酒精的摄入控制得怎么样？',
    options: [
      { label: '重口味+含糖饮料+经常饮酒', score: 12 },
      { label: '偏重口，偶尔饮酒', score: 38 },
      { label: '大致注意，偶尔放纵', score: 68 },
      { label: '清淡为主，很少糖油酒', score: 90 },
    ],
  },
  // ===== 运动体能 =====
  {
    id: 'exercise_1', domain: 'exercise',
    text: '你每周的中等强度有氧运动（快走/慢跑/骑行）大约几次？',
    options: [
      { label: '几乎不运动', score: 10 },
      { label: '一周 1 次左右', score: 35 },
      { label: '一周 2-3 次', score: 70 },
      { label: '一周 4 次以上', score: 92 },
    ],
  },
  {
    id: 'exercise_2', domain: 'exercise',
    text: '你是否有做力量训练（增肌、护关节、护骨密度）的习惯？',
    options: [
      { label: '完全没有', score: 15 },
      { label: '偶尔做做', score: 40 },
      { label: '每周 1 次力量训练', score: 65 },
      { label: '每周 2-3 次规律力量训练', score: 92 },
    ],
  },
  // ===== 精力曲线 =====
  {
    id: 'energy_1', domain: 'energy',
    text: '你白天的精力状态如何？',
    options: [
      { label: '全天都困，只能靠咖啡因硬撑', score: 12 },
      { label: '下午常严重犯困，效率崩盘', score: 38 },
      { label: '总体够用，午后有轻微低谷', score: 68 },
      { label: '精力稳定，全天较清醒', score: 90 },
    ],
  },
  {
    id: 'energy_2', domain: 'energy',
    text: '你工作时专注的连续性如何？',
    options: [
      { label: '十几分钟就分心刷手机', score: 12 },
      { label: '专注一会儿就被打断', score: 38 },
      { label: '能专注工作 30-45 分钟', score: 68 },
      { label: '能连续深度工作 1 小时以上', score: 92 },
    ],
  },
  // ===== 认知情绪 =====
  {
    id: 'cognition_1', domain: 'cognition',
    text: '你近期的情绪状态总体如何？',
    options: [
      { label: '长期焦虑/低落，已影响生活', score: 10 },
      { label: '压力大，情绪起伏明显', score: 35 },
      { label: '大致平稳，偶有波动', score: 68 },
      { label: '情绪稳定，能自我调节', score: 90 },
    ],
  },
  {
    id: 'cognition_2', domain: 'cognition',
    text: '你的注意力与记忆力近期感觉如何？',
    options: [
      { label: '明显下降，经常丢三落四', score: 12 },
      { label: '偏健忘，注意力涣散', score: 38 },
      { label: '基本正常，偶尔走神', score: 68 },
      { label: '清晰敏锐，记得住事', score: 90 },
    ],
  },
];

/* ============================================================
 * 自评计算（纯函数，可测）
 * ============================================================ */

export type HealthRiskTier = 'excellent' | 'fair' | 'attention' | 'high';

export interface DomainScore {
  domain: HealthDomain;
  score: number; // 0-100
  tier: HealthRiskTier;
}

export const HEALTH_TIER_CONFIG: Record<HealthRiskTier, { label: string; color: string; desc: string }> = {
  excellent: { label: '良好', color: 'text-green-600 dark:text-green-400', desc: '这个维度暂时不用花力气，维持即可。' },
  fair: { label: '一般', color: 'text-blue-600 dark:text-blue-400', desc: '没有大问题，但有明确的提升空间。' },
  attention: { label: '需注意', color: 'text-amber-600 dark:text-amber-400', desc: '已经在拖累你，值得优先调整。' },
  high: { label: '高风险', color: 'text-red-600 dark:text-red-400', desc: '这是当前最该立即处理的短板。' },
};

export function tierOf(score: number): HealthRiskTier {
  if (score >= 78) return 'excellent';
  if (score >= 58) return 'fair';
  if (score >= 40) return 'attention';
  return 'high';
}

/** 每个子域 2 题，取均值；缺答按 50 计（中性） */
export function scoreDomains(answers: Record<string, number>): DomainScore[] {
  return HEALTH_DOMAINS.map((domain) => {
    const qs = HEALTH_QUESTIONS.filter((q) => q.domain === domain.id);
    const vals = qs.map((q) => (typeof answers[q.id] === 'number' ? answers[q.id] : 50));
    const score = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    return { domain, score, tier: tierOf(score) };
  });
}

/** 综合精力分：各域等权平均 */
export function overallScore(domainScores: DomainScore[]): number {
  if (domainScores.length === 0) return 0;
  return Math.round(domainScores.reduce((s, d) => s + d.score, 0) / domainScores.length);
}

/** 取最弱的 n 个域，作为「先处理这些」 */
export function weakestDomains(domainScores: DomainScore[], n = 3): DomainScore[] {
  return [...domainScores].sort((a, b) => a.score - b.score).slice(0, n);
}

/** 某域下最该看的条目：risk 优先 + 强度高优先，取前 k 条 */
export function keySignals(domainId: HealthDomainId, k = 3): HealthSignal[] {
  const items = HEALTH_ITEMS_BY_DOMAIN[domainId] ?? [];
  const rank: Record<HealthTag, number> = { risk: 0, watch: 1, good: 2, neutral: 3 };
  return [...items].sort((a, b) => rank[a.tag] - rank[b.tag] || b.intensity - a.intensity).slice(0, k);
}
