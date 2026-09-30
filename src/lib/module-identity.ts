import {
  PenTool,
  Briefcase,
  Scale,
  Clock,
  SlidersHorizontal,
  Dice5,
  Compass,
  CalendarRange,
  type LucideIcon,
} from 'lucide-react';

/**
 * 七个模块的「视觉身份」——全站唯一真源。
 *
 * 以前模块名/编号/图标/配色散落在首页、侧栏、各页面头部，
 * 加一个模块要改四五处，改着改着就不一致了。
 * 新增模块只改这里。
 */
export interface ModuleIdentity {
  /** 编号，01–07 */
  tag: string;
  href: string;
  title: string;
  /** 这个模块能回答的问题——用户看的不是"有多少条数据"，是"能帮我什么" */
  question: string;
  desc: string;
  metric: string;
  unit: string;
  icon: LucideIcon;
  /** 图标块渐变 */
  iconGradient: string;
  /** 卡片 hover 时描边色 */
  ring: string;
  /** 编号注记色 */
  tagColor: string;
}

export const MODULE_IDENTITIES: ModuleIdentity[] = [
  {
    tag: '01',
    href: '/name',
    title: '名字',
    question: '这个名字，会在别人心里留下什么？',
    desc: '笔画、音律、意象——名字是你还没开口就已经发出的信号。',
    metric: '∞',
    unit: 'COMBOS',
    icon: PenTool,
    iconGradient: 'from-rose-500 to-orange-400',
    ring: 'group-hover:border-rose-400/50',
    tagColor: 'text-rose-500/70',
  },
  {
    tag: '02',
    href: '/career',
    title: '职业',
    question: '757 条赛道里，哪条上限更高、更抗 AI？',
    desc: '看薪资、趋势、被机器替代的风险，也看自学能不能进去。',
    metric: '757',
    unit: 'JOBS',
    icon: Briefcase,
    iconGradient: 'from-sky-500 to-cyan-400',
    ring: 'group-hover:border-sky-400/50',
    tagColor: 'text-sky-500/70',
  },
  {
    tag: '03',
    href: '/laws',
    title: '规律',
    question: '哪些齿轮，在你没注意的地方一直转动？',
    desc: '生物衰老、心智带宽、财富侵蚀……8 个维度里藏着人生的暗箱。',
    metric: '288',
    unit: 'LAWS',
    icon: Scale,
    iconGradient: 'from-violet-500 to-purple-400',
    ring: 'group-hover:border-violet-400/50',
    tagColor: 'text-violet-500/70',
  },
  {
    tag: '04',
    href: '/windows',
    title: '窗口',
    question: '哪些门还开着，哪些马上要关？',
    desc: '每扇门都有开合的时间。错过了，代价是多少。',
    metric: '473',
    unit: 'WINDOWS',
    icon: Clock,
    iconGradient: 'from-amber-500 to-yellow-400',
    ring: 'group-hover:border-amber-400/50',
    tagColor: 'text-amber-500/70',
  },
  {
    tag: '05',
    href: '/simulation',
    title: '努力',
    question: '付出同样的努力，差距到底从哪来？',
    desc: '出身、天赋、努力、选择、运气——拖动看结果怎么变。',
    metric: '5',
    unit: 'DIMS',
    icon: SlidersHorizontal,
    iconGradient: 'from-emerald-500 to-green-400',
    ring: 'group-hover:border-emerald-400/50',
    tagColor: 'text-emerald-500/70',
  },
  {
    tag: '06',
    href: '/luck',
    title: '运气',
    question: '哪些是概率，哪些其实你能动手改？',
    desc: '250 个运气节点，逐个标注影响有多大、可控度有多高。',
    metric: '250',
    unit: 'FACTORS',
    icon: Dice5,
    iconGradient: 'from-indigo-500 to-blue-400',
    ring: 'group-hover:border-indigo-400/50',
    tagColor: 'text-indigo-500/70',
  },
  {
    tag: '07',
    href: '/destiny',
    title: '命运',
    question: '把上面六项叠起来，我现在的牌面是什么？',
    desc: '综合报告：你手里有什么牌，哪些能打，哪些该换。',
    metric: 'AI',
    unit: 'REPORT',
    icon: Compass,
    iconGradient: 'from-teal-500 to-emerald-400',
    ring: 'group-hover:border-teal-400/50',
    tagColor: 'text-teal-500/70',
  },
];

/** 时间轴：个性化主线入口，不属于七大模块，编号为 ★ */
export const TIMELINE_IDENTITY = {
  href: '/me',
  title: '你的人生时间轴',
  question: '在我这个年纪，有哪些事正等着我？',
  icon: CalendarRange,
  iconGradient: 'from-primary to-primary/70',
};
