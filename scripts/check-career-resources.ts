/**
 * 职业资源体检：覆盖率 + 份数 + 通用化程度 + 孤儿键 + 链接协议。
 *
 * 由来：2026-10-10 补资源时用过一批 `scripts/_cov.ts` / `_orph.ts` 临时脚本，
 * 当时说"跑完即删"，但这两个检查其实每次改职业数据都要跑（新增职业忘配资源、
 * 资源键写了不存在的职业名，都是静默发生、页面上看不出来的）。现合并成一个正经脚本。
 *
 * 用法：pnpm check:resources
 * 只读，不写任何文件（旧脚本会往项目根丢 missing-resources.txt，已取消）。
 *
 * 2026-10-12 补两项检查，因为原先的"覆盖率"有误导性：它只查这个职业**有没有 key**，
 * 配 1 条链接也算覆盖。实测 888 个职业人均只有 1.89 份、49.6% 的资源落在被多个职业
 * 共用的链接上（34 个职业共用同一个央行网址），而旧脚本一直报"888/888 全覆盖 ✅"。
 * 所以补：
 *   - 份数分布：MIN_ITEMS 以下算未配齐
 *   - 共用链接：被 SAME_URL_MAX 个以上职业共用 = 通用化，不专属
 */
import { careers } from '../src/data/careers';
import { CAREER_RESOURCES } from '../src/data/career-resources';

/** 每职业至少要配几条。主人 2026-10-12 定的目标是 5 份（专属、可直接自学） */
const MIN_ITEMS = 5;
/** 同一条链接最多允许多少个职业共用，超过就是"笼统给个大概" */
const SAME_URL_MAX = 3;

type ResourceItem = { url?: string; title?: string };
type ResourceGroups = Record<string, ResourceItem[]>;

const careerNames = careers.map((c) => c.name);
const careerNameSet = new Set(careerNames);
const resourceKeys = Object.keys(CAREER_RESOURCES);

const missing = careerNames.filter((n) => !(n in CAREER_RESOURCES));
const orphans = resourceKeys.filter((k) => !careerNameSet.has(k));

/** 链接必须是 https，且不能是搜索页/平台首页这类"看起来像链接但没内容"的地址 */
const badLinks: string[] = [];
// 只在"带查询串"或命中典型搜索路径时才判疑似搜索页——
// 否则 developers.google.com/search 这类正常文档地址会被误伤（实测踩过）
const SEARCH_QUERY = /[?&](q|query|keyword|kw|wd)=/i;
const SEARCH_PATH = /\/(search|find\.htm)(\?|\/|$)/i;

/** url → 共用它的职业数 */
const urlUsers = new Map<string, number>();
const dist = new Map<number, number>();
const thin: string[] = [];
let totalItems = 0;

for (const key of careerNames) {
  const groups = (CAREER_RESOURCES as unknown as Record<string, ResourceGroups | undefined>)[key];
  const items = Object.values(groups ?? {}).flat();
  const n = items.length;
  totalItems += n;
  dist.set(n, (dist.get(n) ?? 0) + 1);
  if (n < MIN_ITEMS) thin.push(`${key}（${n} 份）`);

  for (const item of items) {
    const url = item?.url;
    if (!url) continue;
    urlUsers.set(url, (urlUsers.get(url) ?? 0) + 1);
    if (!url.startsWith('https://')) badLinks.push(`${key}: ${url}`);
    else if (SEARCH_QUERY.test(url) || (url.includes('?') && SEARCH_PATH.test(url))) {
      badLinks.push(`${key}: 疑似搜索页 ${url}`);
    }
  }
}

const sharedUrls = [...urlUsers.entries()].filter(([, c]) => c > SAME_URL_MAX).sort((a, b) => b[1] - a[1]);
const sharedUrlSet = new Set(sharedUrls.map(([u]) => u));
let sharedItems = 0;
for (const key of careerNames) {
  const groups = (CAREER_RESOURCES as unknown as Record<string, ResourceGroups | undefined>)[key];
  for (const item of Object.values(groups ?? {}).flat()) {
    if (item?.url && sharedUrlSet.has(item.url)) sharedItems++;
  }
}

console.log(`职业总数            ${careerNames.length}`);
console.log(`资源键总数          ${resourceKeys.length}`);
console.log(`已配资源（有 key）  ${careerNames.length - missing.length}`);
console.log(`缺资源职业          ${missing.length}`);
if (missing.length) console.log('  ' + missing.join('\n  '));
console.log(`孤儿键（非职业名）  ${orphans.length}`);
if (orphans.length) console.log('  ' + orphans.join('\n  '));
console.log(`可疑链接            ${badLinks.length}`);
if (badLinks.length) console.log('  ' + badLinks.slice(0, 20).join('\n  '));

console.log('\n—— 份数（目标：每职业 ≥ ' + MIN_ITEMS + ' 份）——');
console.log(`  资源总份数        ${totalItems}`);
console.log(`  每职业平均        ${(totalItems / careerNames.length).toFixed(2)} 份`);
console.log(
  '  分布              ' +
    [...dist.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([n, c]) => `${n} 份: ${c} 个`)
      .join('　'),
);
console.log(`  未配齐（<${MIN_ITEMS} 份）  ${thin.length} 个职业`);

console.log(`\n—— 通用化（同一链接超过 ${SAME_URL_MAX} 个职业共用）——`);
console.log(`  超限链接          ${sharedUrls.length} 条`);
console.log(`  涉及资源份数      ${sharedItems} / ${totalItems}（${((sharedItems / totalItems) * 100).toFixed(1)}%）`);
if (sharedUrls.length) {
  console.log('  共用最多的前 8 条：');
  for (const [u, c] of sharedUrls.slice(0, 8)) console.log(`    ${c} 个职业共用  ${u}`);
}

const ok = missing.length === 0 && orphans.length === 0 && badLinks.length === 0;
console.log(
  ok
    ? `\n✅ 基础校验通过（覆盖率 / 孤儿键 / 链接）\n${thin.length ? `⚠️ 但 ${thin.length} 个职业不足 ${MIN_ITEMS} 份，${sharedUrls.length} 条链接被过度共用——"专属资源"尚未达标` : '✅ 份数与通用化也达标'}`
    : '\n❌ 基础校验存在问题，见上方明细',
);
process.exit(ok ? 0 : 1);
