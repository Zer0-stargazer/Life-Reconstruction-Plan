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
import { LAW_DIMENSIONS } from '@/data/laws';

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
    unit: '种组合',
    icon: PenTool,
    iconGradient: 'bg-foreground/5 text-foreground',
    ring: 'group-hover:border-foreground/30',
    tagColor: 'text-foreground/60',
  },
  {
    tag: '02',
    href: '/career',
    title: '职业',
    question: '757 条赛道里，哪条上限更高、更抗 AI？',
    desc: '看薪资、趋势、被机器替代的风险，也看自学能不能进去。',
    metric: '757',
    unit: '条赛道',
    icon: Briefcase,
    iconGradient: 'bg-foreground/5 text-foreground',
    ring: 'group-hover:border-foreground/30',
    tagColor: 'text-foreground/60',
  },
  {
    tag: '03',
    href: '/laws',
    title: '规律',
    question: '哪些齿轮，在你没注意的地方一直转动？',
    desc: '生物衰老、心智带宽、财富侵蚀……8 个维度里藏着人生的暗箱。',
    metric: String(LAW_DIMENSIONS.reduce((s, d) => s + d.items.length, 0)),
    unit: '条规律',
    icon: Scale,
    iconGradient: 'bg-foreground/5 text-foreground',
    ring: 'group-hover:border-foreground/30',
    tagColor: 'text-foreground/60',
  },
  {
    tag: '04',
    href: '/windows',
    title: '窗口',
    question: '哪些门还开着，哪些马上要关？',
    desc: '每扇门都有开合的时间。错过了，代价是多少。',
    metric: '473',
    unit: '扇窗口',
    icon: Clock,
    iconGradient: 'bg-foreground/5 text-foreground',
    ring: 'group-hover:border-foreground/30',
    tagColor: 'text-foreground/60',
  },
  {
    tag: '05',
    href: '/simulation',
    title: '努力',
    question: '付出同样的努力，差距到底从哪来？',
    desc: '出身、天赋、努力、选择、运气——拖动看结果怎么变。',
    metric: '5',
    unit: '个维度',
    icon: SlidersHorizontal,
    iconGradient: 'bg-foreground/5 text-foreground',
    ring: 'group-hover:border-foreground/30',
    tagColor: 'text-foreground/60',
  },
  {
    tag: '06',
    href: '/luck',
    title: '运气',
    question: '哪些是概率，哪些其实你能动手改？',
    desc: '250 个运气节点，逐个标注影响有多大、可控度有多高。',
    metric: '250',
    unit: '个节点',
    icon: Dice5,
    iconGradient: 'bg-foreground/5 text-foreground',
    ring: 'group-hover:border-foreground/30',
    tagColor: 'text-foreground/60',
  },
  {
    tag: '07',
    href: '/destiny',
    title: '命运',
    question: '把上面六项叠起来，我现在的牌面是什么？',
    desc: '综合报告：你手里有什么牌，哪些能打，哪些该换。',
    metric: '1',
    unit: '份综合报告',
    icon: Compass,
    iconGradient: 'bg-foreground/5 text-foreground',
    ring: 'group-hover:border-foreground/30',
    tagColor: 'text-foreground/60',
  },
];

/** 时间轴：个性化主线入口，不属于七大模块，编号为 ★ */
export const TIMELINE_IDENTITY = {
  href: '/me',
  /** 编号注记（不是 01–07，是 ★，所以单独放这里，避免页面里手写） */
  tag: '★',
  /** 页头右上注记 */
  note: '时间轴',
  title: '你的人生时间轴',
  question: '在我这个年纪，有哪些事正等着我？',
  icon: CalendarRange,
  iconGradient: 'bg-foreground/5 text-foreground',
};

/** 序章 + 五章 + 终章的目录结构，侧栏、首页目录、模块页头共用 */
export const CHAPTERS: { num: string; title: string; hrefs: string[] }[] = [
  { num: '序', title: '你现在几岁', hrefs: ['/me'] },
  { num: '壹', title: '你在哪', hrefs: ['/windows'] },
  { num: '贰', title: '你的底色', hrefs: ['/name', '/career'] },
  { num: '叁', title: '看不见的齿轮', hrefs: ['/laws', '/luck'] },
  { num: '肆', title: '你能改什么', hrefs: ['/simulation'] },
  { num: '终', title: '一页手记', hrefs: ['/destiny'] },
];

export function chapterOf(href: string) {
  return CHAPTERS.find((c) => c.hrefs.includes(href));
}
