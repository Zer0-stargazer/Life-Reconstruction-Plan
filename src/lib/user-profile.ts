/**
 * 用户画像聚合（跨模块联动总线，batch 联动第二批）。
 *
 * 解决什么问题：命运报告原来只看用户在命运页填的几项，
 * 看不到他在别的模块留下的真实数据——时间轴上标了哪些窗口在做、
 * 健康问卷答成什么样、模拟器六维怎么自评。这份聚合把这些
 * 散落的 localStorage 键读成一份摘要，供命运报告 / AI 上下文 / /me 快照卡共用。
 *
 * 原则：
 * - 纯读取，绝不写任何键（写回各自模块的页面负责）
 * - 所有读取带 window 守卫（SSR 安全），脏数据一律静默回 null/默认
 * - 复用各模块已有的计算函数（scoreDomains / overallScore），不另起一套算法
 */

import { STORAGE_KEYS } from '@/lib/storage-keys';
import { lifeWindows } from '@/data/windows';
import { careers } from '@/data/careers';
import { HEALTH_QUESTIONS, scoreDomains, overallScore, weakestDomains } from '@/data/health';
import type { WindowMarkMap } from '@/hooks/use-window-marks';

// ============================================================
// 类型
// ============================================================

/** 时间轴窗口三态标记的摘要 */
export interface WindowActionSummary {
  doing: number;
  done: number;
  skip: number;
  /** 正在做的窗口标题（按 lifeWindows 的 id 映射，最多保留 5 个） */
  doingTitles: string[];
}

/** 健康问卷摘要（null = 一题没答） */
export interface HealthSummary {
  answered: number;
  total: number;
  /** 是否答完全部题目（未答完时分数按缺省 50 补，只作参考） */
  complete: boolean;
  /** 综合分 0-100 */
  overall: number;
  /** 最弱的子域（最多 3 个） */
  weakest: { name: string; score: number }[];
}

/** 模拟器六维摘要（键存在即非 null，哪怕全是默认值） */
export interface SimSummary {
  dims: { key: string; label: string; value: number; weight: number }[];
  answers: Record<string, string>;
}

/** 命运报告快照（只取 /me 快照卡要展示的字段） */
export interface DestinyReportSnapshot {
  phase: string;
  nextWindow: string;
  age: number;
}

/** 职业三态标记摘要（null = 一个都没标） */
export interface CareerMarkSummary {
  want: string[];
  doing: string[];
  done: string[];
}

export interface UserProfile {
  windowMarks: WindowMarkMap;
  windowAction: WindowActionSummary;
  health: HealthSummary | null;
  sim: SimSummary | null;
  destinyReport: DestinyReportSnapshot | null;
  careerMarks: CareerMarkSummary | null;
}

// ============================================================
// 读取工具
// ============================================================

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ============================================================
// 摘要计算
// ============================================================

export function summarizeWindowMarks(marks: WindowMarkMap): WindowActionSummary {
  const summary: WindowActionSummary = { doing: 0, done: 0, skip: 0, doingTitles: [] };
  const titleById = new Map(lifeWindows.map(w => [w.id, w.title]));
  for (const idStr of Object.keys(marks)) {
    const id = Number(idStr);
    const mark = marks[id];
    if (mark !== 'doing' && mark !== 'done' && mark !== 'skip') continue;
    summary[mark] += 1;
    if (mark === 'doing' && summary.doingTitles.length < 5) {
      const title = titleById.get(id);
      if (title) summary.doingTitles.push(title);
    }
  }
  return summary;
}

export function readHealthSummary(): HealthSummary | null {
  const answers = readJson<Record<string, number>>(STORAGE_KEYS.healthAnswers);
  if (!answers || typeof answers !== 'object') return null;
  const answered = Object.keys(answers).filter(k => typeof answers[k] === 'number').length;
  if (answered === 0) return null;
  const domainScores = scoreDomains(answers);
  const weakest = weakestDomains(domainScores, 3).map(d => ({
    name: d.domain.name,
    score: d.score,
  }));
  return {
    answered,
    total: HEALTH_QUESTIONS.length,
    complete: answered >= HEALTH_QUESTIONS.length,
    overall: overallScore(domainScores),
    weakest,
  };
}

export function readSimSummary(): SimSummary | null {
  const dims = readJson<{ key: string; label: string; value: number; weight: number }[]>(STORAGE_KEYS.simDimensions);
  if (!Array.isArray(dims) || dims.length === 0) return null;
  const cleanDims = dims
    .filter(d => d && typeof d.key === 'string' && typeof d.value === 'number')
    .map(d => ({ key: d.key, label: String(d.label ?? d.key), value: d.value, weight: typeof d.weight === 'number' ? d.weight : 0 }));
  if (cleanDims.length === 0) return null;
  const answers = readJson<Record<string, string>>(STORAGE_KEYS.simAnswers);
  return { dims: cleanDims, answers: answers && typeof answers === 'object' ? answers : {} };
}

export function readDestinyReportSnapshot(): DestinyReportSnapshot | null {
  const report = readJson<{ phase?: unknown; nextWindow?: unknown; age?: unknown }>(STORAGE_KEYS.destinyReport);
  if (!report || typeof report.phase !== 'string' || typeof report.nextWindow !== 'string') return null;
  return {
    phase: report.phase,
    nextWindow: report.nextWindow,
    age: typeof report.age === 'number' ? report.age : 0,
  };
}

export function readCareerMarkSummary(): CareerMarkSummary | null {
  const marks = readJson<Record<string, string>>(STORAGE_KEYS.careerMarks);
  if (!marks || typeof marks !== 'object') return null;
  const nameById = new Map(careers.map(c => [c.id, c.name]));
  const summary: CareerMarkSummary = { want: [], doing: [], done: [] };
  let total = 0;
  for (const [idStr, mark] of Object.entries(marks)) {
    if (mark !== 'want' && mark !== 'doing' && mark !== 'done') continue;
    const name = nameById.get(Number(idStr));
    if (!name) continue;
    total += 1;
    summary[mark].push(name);
  }
  return total > 0 ? summary : null;
}

/** 一次性读出全部画像（marks 由调用方传入以复用响应式 store，不传则现读 localStorage） */
export function readUserProfile(marks?: WindowMarkMap): UserProfile {
  const markMap = marks ?? readJson<WindowMarkMap>(STORAGE_KEYS.windowMarks) ?? {};
  return {
    windowMarks: markMap,
    windowAction: summarizeWindowMarks(markMap),
    health: readHealthSummary(),
    sim: readSimSummary(),
    destinyReport: readDestinyReportSnapshot(),
    careerMarks: readCareerMarkSummary(),
  };
}
