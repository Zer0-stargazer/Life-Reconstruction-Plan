// 自动生成，请勿手改 —— 源文件 src/data/windows.ts
// 重跑：pnpm tsx scripts/gen-window-density.ts
// 生成时间：2026-09-28T10:32:45.511Z
// 输入：473 条窗口（无法解析 0 条），按 5 岁一桶聚合

export interface DensityBucket {
  /** 桶起始年龄（含） */
  from: number;
  /** 桶结束年龄（含） */
  to: number;
  current: number;
  past: number;
  future: number;
  elite: number;
  total: number;
}

export const DENSITY_BUCKET_SIZE = 5;

export const WINDOW_DENSITY: DensityBucket[] = [{"from":0,"to":4,"current":0,"past":1,"future":0,"elite":0,"total":1},{"from":5,"to":9,"current":0,"past":8,"future":0,"elite":1,"total":9},{"from":10,"to":14,"current":0,"past":8,"future":0,"elite":9,"total":17},{"from":15,"to":19,"current":0,"past":12,"future":0,"elite":9,"total":21},{"from":20,"to":24,"current":32,"past":8,"future":0,"elite":9,"total":49},{"from":25,"to":29,"current":51,"past":0,"future":2,"elite":9,"total":62},{"from":30,"to":34,"current":46,"past":0,"future":23,"elite":6,"total":75},{"from":35,"to":39,"current":42,"past":0,"future":35,"elite":5,"total":82},{"from":40,"to":44,"current":8,"past":0,"future":29,"elite":5,"total":42},{"from":45,"to":49,"current":0,"past":0,"future":22,"elite":2,"total":24},{"from":50,"to":54,"current":0,"past":0,"future":17,"elite":2,"total":19},{"from":55,"to":59,"current":0,"past":0,"future":20,"elite":1,"total":21},{"from":60,"to":64,"current":0,"past":0,"future":15,"elite":0,"total":15},{"from":65,"to":69,"current":0,"past":0,"future":11,"elite":0,"total":11},{"from":70,"to":74,"current":0,"past":0,"future":8,"elite":0,"total":8},{"from":75,"to":79,"current":0,"past":0,"future":7,"elite":0,"total":7},{"from":80,"to":84,"current":0,"past":0,"future":7,"elite":0,"total":7},{"from":85,"to":89,"current":0,"past":0,"future":2,"elite":0,"total":2},{"from":90,"to":94,"current":0,"past":0,"future":1,"elite":0,"total":1},{"from":95,"to":99,"current":0,"past":0,"future":0,"elite":0,"total":0}];

/** 累计到每个桶为止的窗口总数 */
export const WINDOW_CUMULATIVE: number[] = [1,10,27,48,97,159,234,316,358,382,401,422,437,448,456,463,470,472,473,473];

export const WINDOW_DENSITY_META = {
  /** 窗口总数 */
  total: 473,
  /** 峰值桶 */
  peak: { from: 35, to: 39, count: 82 },
  /** 45 岁前（不含 45）的窗口数 */
  before45: 358,
  /** 45 岁及以后的窗口数 */
  after45: 115,
  /** 已解析条数 */
  parsed: 473,
} as const;
