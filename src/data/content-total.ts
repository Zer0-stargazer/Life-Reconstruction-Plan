import { CAREER_COUNT } from '@/data/career-count';
import { WINDOW_DENSITY_META } from '@/data/window-density';

/**
 * 站内内容条数的轻量计数（首页 / 关于页展示用）。
 *
 * 为什么不直接 import laws / luck-nodes / health：这些是整份数据（合计约 1MB），
 * 首页与 /about 访客可见，不该为显示一个数字打进公开 bundle。
 * 与真实数据的一致性由 content-total.test.ts 断言——改数据时跑 vitest 会提示这里要同步。
 */
export const CONTENT_COUNTS = {
  careers: CAREER_COUNT,
  windows: WINDOW_DENSITY_META.total,
  laws: 267,
  luck: 250,
  health: 126,
} as const;

/** 全站内容总条数（职业 + 窗口 + 规律 + 运气 + 健康信号），当前 2,019 */
export const CONTENT_TOTAL =
  CONTENT_COUNTS.careers +
  CONTENT_COUNTS.windows +
  CONTENT_COUNTS.laws +
  CONTENT_COUNTS.luck +
  CONTENT_COUNTS.health;

/** 模块数（01–08，时间轴不计） */
export const MODULE_COUNT = 8;
