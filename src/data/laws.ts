export type LawTag = 'danger' | 'opportunity' | 'neutral' | 'critical';

export interface LawItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  metric: string;
  metricValue: string;
  example: string;
  breakthrough: number;
  recovery: string;
  cost: string;
  strategies: string[];
  tag: LawTag;
  intensity: 1 | 2 | 3 | 4 | 5;
  age?: number;
}

export interface LawDimension {
  id: string;
  name: string;
  nameEn: string;
  subtitle: string;
  icon: string;
  gradient: string;
  items: LawItem[];
}

import { MACRO_CYCLE_ITEMS } from './laws-macro';
import { BIO_DECAY_ITEMS } from './laws-bio';
import { MENTAL_BANDWIDTH_ITEMS } from './laws-mental';
import { SOCIAL_VAMPIRE_ITEMS } from './laws-social';
import { HABIT_COMPOUND_ITEMS } from './laws-habit';
import { BLACK_SWAN_ITEMS } from './laws-swan';
import { WEALTH_EROSION_ITEMS } from './laws-wealth';
import { COGNITIVE_CAGE_ITEMS } from './laws-cognition';

export const LAW_DIMENSIONS: LawDimension[] = [
  {
    id: 'macro-cycle', name: '宏观周期', nameEn: 'Macro Cycles',
    subtitle: '康波法则: 宏观周期律', icon: '📈',
    gradient: 'from-red-900/40 via-amber-900/20 to-background',
    items: MACRO_CYCLE_ITEMS,
  },
  {
    id: 'bio-decay', name: '生物衰老', nameEn: 'Biological Aging',
    subtitle: '肉体折旧: 生物学断崖', icon: '🧬',
    gradient: 'from-emerald-900/40 via-teal-900/20 to-background',
    items: BIO_DECAY_ITEMS,
  },
  {
    id: 'mental-bandwidth', name: '心智带宽', nameEn: 'Mental Bandwidth',
    subtitle: '心智税率: 认知带宽损耗池', icon: '🧠',
    gradient: 'from-purple-900/40 via-indigo-900/20 to-background',
    items: MENTAL_BANDWIDTH_ITEMS,
  },
  {
    id: 'social-vampire', name: '社交吸血网络', nameEn: 'Social Vampire Networks',
    subtitle: '社交网络: 关系杠杆与毒性节点', icon: '👥',
    gradient: 'from-rose-900/40 via-red-900/20 to-background',
    items: SOCIAL_VAMPIRE_ITEMS,
  },
  {
    id: 'habit-compound', name: '习惯复利', nameEn: 'Habit Compound Interest',
    subtitle: '量变跃迁: 习惯复利规律', icon: '↗️',
    gradient: 'from-amber-900/40 via-yellow-900/20 to-background',
    items: HABIT_COMPOUND_ITEMS,
  },
  {
    id: 'black-swan', name: '黑天鹅极值', nameEn: 'Black Swan Extremes',
    subtitle: '终极降维: 黑天鹅极值事件', icon: '💀',
    gradient: 'from-slate-900/40 via-zinc-900/20 to-background',
    items: BLACK_SWAN_ITEMS,
  },
  {
    id: 'wealth-erosion', name: '财富侵蚀', nameEn: 'Wealth Erosion',
    subtitle: '隐性通胀: 财富的静默蒸发', icon: '💸',
    gradient: 'from-orange-900/40 via-amber-900/20 to-background',
    items: WEALTH_EROSION_ITEMS,
  },
  {
    id: 'cognitive-prison', name: '认知牢笼', nameEn: 'Cognitive Prisons',
    subtitle: '思维囚笼: 你不知道的不知道', icon: '🔓',
    gradient: 'from-cyan-900/40 via-sky-900/20 to-background',
    items: COGNITIVE_CAGE_ITEMS,
  },
];
