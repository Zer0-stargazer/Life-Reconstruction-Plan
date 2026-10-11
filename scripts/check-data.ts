/**
 * 内容数据体检（只读，不写文件）。
 *
 * 用法：pnpm check:data
 *
 * 为什么要有它：数据是这个产品的全部内容，2,000 多条手写条目里
 * 出任何一条错，表现都是"页面上一个分类点不动了"或者"筛不出东西"，
 * 从 UI 上根本看不出根因。改完 `src/data/` 就跑一次。
 *
 * 查五项：
 *   1. 条数 + 重复 id（重复 id 会让 React key 冲突、列表渲染错乱）
 *   2. 枚举对齐：数据里的 category / status / tag 是否都落在配置对象里
 *      ——不在的会永远筛不到，是最隐蔽的一类缺陷
 *   3. 字段完整度：以第一条的键为基准，找缺字段的条目
 *   4. 健康模块：七子域各 18 条、问卷覆盖七个域
 *   5. 数值边界：breakthrough / intensity / selfStudyScore 是否越界
 *
 * 与 `pnpm check:resources`（职业资源覆盖率）互补：那个查外链资源，
 * 这个查内容数据本体。
 */
import { careers, CAREER_CATEGORIES, CAREER_CATEGORY_CONFIG } from '../src/data/careers';
import {
  lifeWindows,
  WINDOW_STATUS_CONFIG,
  REMEDY_LEVEL_CONFIG,
  MISS_TYPE_CONFIG,
} from '../src/data/windows';
import { luckNodes, LUCK_CATEGORY_CONFIG } from '../src/data/luck-nodes';
import { LAW_DIMENSIONS } from '../src/data/laws';
import { HEALTH_ALL_ITEMS, HEALTH_DOMAINS, HEALTH_TAG_CONFIG, HEALTH_QUESTIONS } from '../src/data/health';

const lawItems = (LAW_DIMENSIONS as unknown as Array<{ items?: unknown[] }>).flatMap(
  (d) => (d.items ?? []) as Array<Record<string, unknown>>,
);

const orphans = (arr: Array<Record<string, unknown>>, field: string, allowed: readonly string[]) =>
  [
    ...new Set(
      arr
        .map((x) => String(x[field]))
        .filter((v) => !allowed.includes(v)),
    ),
  ].join(', ');

let failed = 0;
const fail = (msg: string) => {
  console.log(`❌ ${msg}`);
  failed++;
};

function countAndDup(name: string, arr: Array<Record<string, unknown>>) {
  const ids = arr.map((x) => String(x.id));
  const dup = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  if (dup.length) fail(`${name} 有 ${dup.length} 个重复 id: ${dup.slice(0, 5).join(', ')}`);
  return arr.length;
}

function checkFields(name: string, arr: Array<Record<string, unknown>>) {
  if (!arr.length) return;
  const base = Object.keys(arr[0]);
  const bad = arr.filter((x) => base.some((k) => x[k] === undefined || x[k] === null || x[k] === ''));
  if (bad.length) fail(`${name} 有 ${bad.length} 条缺字段: ${bad.slice(0, 3).map((b) => b.id).join(', ')}`);
}

console.log('—— 条数 / 重复 id ——');
const sets: Array<[string, Array<Record<string, unknown>>]> = [
  ['careers', careers as unknown as Array<Record<string, unknown>>],
  ['windows', lifeWindows as unknown as Array<Record<string, unknown>>],
  ['luck', luckNodes as unknown as Array<Record<string, unknown>>],
  ['laws', lawItems],
  ['health', HEALTH_ALL_ITEMS as unknown as Array<Record<string, unknown>>],
];
let total = 0;
for (const [name, arr] of sets) {
  const n = countAndDup(name, arr);
  total += n;
  if (n === 0) fail(`${name} 一条都没有`);
}
console.log(`  合计 ${total} 条`);

console.log('\n—— 枚举对齐 ——');
const enumChecks: Array<[string, string]> = [
  ['careers.category → CAREER_CATEGORIES', orphans(careers as unknown as Array<Record<string, unknown>>, 'category', CAREER_CATEGORIES)],
  ['careers.category → CATEGORY_CONFIG', orphans(careers as unknown as Array<Record<string, unknown>>, 'category', Object.keys(CAREER_CATEGORY_CONFIG))],
  ['windows.status → STATUS_CONFIG', orphans(lifeWindows as unknown as Array<Record<string, unknown>>, 'status', Object.keys(WINDOW_STATUS_CONFIG))],
  ['windows.remedyLevel', orphans(lifeWindows as unknown as Array<Record<string, unknown>>, 'remedyLevel', Object.keys(REMEDY_LEVEL_CONFIG))],
  ['windows.missType', orphans(lifeWindows as unknown as Array<Record<string, unknown>>, 'missType', Object.keys(MISS_TYPE_CONFIG))],
  ['luck.category → LUCK_CATEGORY_CONFIG', orphans(luckNodes as unknown as Array<Record<string, unknown>>, 'category', Object.keys(LUCK_CATEGORY_CONFIG))],
  ['laws.tag → LawTag', orphans(lawItems, 'tag', ['danger', 'opportunity', 'neutral', 'critical'])],
  ['health.tag → HEALTH_TAG_CONFIG', orphans(HEALTH_ALL_ITEMS as unknown as Array<Record<string, unknown>>, 'tag', Object.keys(HEALTH_TAG_CONFIG))],
  ['health.domain → HEALTH_DOMAINS', orphans(HEALTH_ALL_ITEMS as unknown as Array<Record<string, unknown>>, 'domain', HEALTH_DOMAINS.map((d) => d.id))],
];
for (const [label, bad] of enumChecks) {
  if (bad) fail(`${label} 有孤儿值: ${bad}`);
}

console.log('—— 字段完整度 ——');
for (const [name, arr] of sets) checkFields(name, arr);

console.log('—— 健康模块 ——');
for (const d of HEALTH_DOMAINS) {
  const n = (HEALTH_ALL_ITEMS as unknown as Array<Record<string, unknown>>).filter((x) => x.domain === d.id).length;
  if (n !== 18) console.log(`  ⚠️ ${d.id}: ${n} 条（预期 18）`);
}
const qDomains = new Set(HEALTH_QUESTIONS.map((q) => (q as { domain?: string }).domain ?? ''));
const missingDomain = HEALTH_DOMAINS.filter((d) => !qDomains.has(d.id));
if (missingDomain.length) fail(`问卷缺子域: ${missingDomain.map((d) => d.id).join(', ')}`);

console.log('—— 数值边界 ——');
const outOfRange = (arr: Array<Record<string, unknown>>, field: string, min: number, max: number) =>
  arr.filter((x) => typeof x[field] !== 'number' || (x[field] as number) < min || (x[field] as number) > max);
const badLaws = outOfRange(lawItems, 'breakthrough', 0, 100);
const badHealth = outOfRange(HEALTH_ALL_ITEMS as unknown as Array<Record<string, unknown>>, 'intensity', 1, 5);
const badCareer = outOfRange(careers as unknown as Array<Record<string, unknown>>, 'selfStudyScore', 0, 100);
if (badLaws.length) fail(`laws.breakthrough 越界: ${badLaws.slice(0, 3).map((b) => b.id).join(', ')}`);
if (badHealth.length) fail(`health.intensity 越界: ${badHealth.slice(0, 3).map((b) => b.id).join(', ')}`);
if (badCareer.length) fail(`careers.selfStudyScore 越界: ${badCareer.slice(0, 3).map((b) => b.id).join(', ')}`);

if (failed === 0) {
  console.log(`\n✅ 数据体检全部通过（${total} 条）`);
} else {
  console.log(`\n❌ ${failed} 项不通过`);
}
process.exit(failed === 0 ? 0 : 1);
