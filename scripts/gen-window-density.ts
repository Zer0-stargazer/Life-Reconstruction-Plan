/**
 * 生成 src/data/window-density.ts —— 首页主视觉用的预聚合数据
 *
 * 为什么预聚合：src/data/windows.ts 有 232KB，首页只需要「按年龄分桶的窗口数量」。
 * 直接 import 会把整份数据打进首屏 bundle；这里提前算好 20 个桶的四个状态计数，
 * 产物只有几 KB。
 *
 * 用法（windows.ts 改过之后务必重跑）：
 *   pnpm tsx scripts/gen-window-density.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lifeWindows } from '../src/data/windows';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const BUCKET = 5;
const BUCKET_COUNT = Math.ceil(100 / BUCKET);

/** "18-20" → 19；"80+" → 82；"25" → 25 */
function midAge(age: string): number | null {
  const s = (age || '').trim();
  if (!s) return null;
  if (s.endsWith('+')) {
    const n = parseFloat(s);
    return isNaN(n) ? null : n + 2;
  }
  const parts = s.split('-');
  if (parts.length === 2) {
    const a = parseFloat(parts[0]);
    const b = parseFloat(parts[1]);
    if (!isNaN(a) && !isNaN(b)) return (a + b) / 2;
  }
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

const buckets = Array.from({ length: BUCKET_COUNT }, (_, i) => ({
  from: i * BUCKET,
  to: i * BUCKET + BUCKET - 1,
  current: 0,
  past: 0,
  future: 0,
  elite: 0,
  total: 0,
}));

let parsed = 0;
let skipped = 0;

for (const w of lifeWindows) {
  if (!w) continue;
  const m = midAge(w.age);
  if (m === null) { skipped += 1; continue; }
  const idx = Math.min(BUCKET_COUNT - 1, Math.max(0, Math.floor(m / BUCKET)));
  const b = buckets[idx];
  b[w.status] += 1;
  b.total += 1;
  parsed += 1;
}

const total = buckets.reduce((s, b) => s + b.total, 0);
const peak = buckets.reduce((best, b) => (b.total > best.total ? b : best), buckets[0]);

/** 45 岁前后各有多少窗口（桶索引 9 = 45-49） */
const before45 = buckets.slice(0, 9).reduce((s, b) => s + b.total, 0);
const after45 = buckets.slice(9).reduce((s, b) => s + b.total, 0);

/** 累计到某个年龄的窗口数，用于画累计曲线 */
const cumulative = buckets.map((_, i) => buckets.slice(0, i + 1).reduce((s, b) => s + b.total, 0));

const out = `// 自动生成，请勿手改 —— 源文件 src/data/windows.ts
// 重跑：pnpm tsx scripts/gen-window-density.ts
// 生成时间：${new Date().toISOString()}
// 输入：${parsed} 条窗口（无法解析 ${skipped} 条），按 ${BUCKET} 岁一桶聚合

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

export const DENSITY_BUCKET_SIZE = ${BUCKET};

export const WINDOW_DENSITY: DensityBucket[] = ${JSON.stringify(buckets)};

/** 累计到每个桶为止的窗口总数 */
export const WINDOW_CUMULATIVE: number[] = ${JSON.stringify(cumulative)};

export const WINDOW_DENSITY_META = {
  /** 窗口总数 */
  total: ${total},
  /** 峰值桶 */
  peak: { from: ${peak.from}, to: ${peak.to}, count: ${peak.total} },
  /** 45 岁前（不含 45）的窗口数 */
  before45: ${before45},
  /** 45 岁及以后的窗口数 */
  after45: ${after45},
  /** 已解析条数 */
  parsed: ${parsed},
} as const;
`;

const target = path.join(ROOT, 'src/data/window-density.ts');
fs.writeFileSync(target, out, 'utf8');

console.log('已写入', target);
console.log('总窗口:', total, '| 峰值:', `${peak.from}-${peak.to} = ${peak.total}`, '| 45岁前:', before45, '| 45岁后:', after45);
console.log('分桶:', buckets.map((b) => b.total).join(' '));
