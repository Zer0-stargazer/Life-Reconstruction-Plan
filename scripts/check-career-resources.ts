/**
 * 职业资源体检：覆盖率 + 孤儿键 + 链接协议。
 *
 * 由来：2026-10-10 补资源时用过一批 `scripts/_cov.ts` / `_orph.ts` 临时脚本，
 * 当时说"跑完即删"，但这两个检查其实每次改职业数据都要跑（新增职业忘配资源、
 * 资源键写了不存在的职业名，都是静默发生、页面上看不出来的）。现合并成一个正经脚本。
 *
 * 用法：pnpm check:resources
 * 只读，不写任何文件（旧脚本会往项目根丢 missing-resources.txt，已取消）。
 */
import { careers } from '../src/data/careers';
import { CAREER_RESOURCES } from '../src/data/career-resources';

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
for (const [key, groups] of Object.entries(CAREER_RESOURCES)) {
  const links = Object.values(groups ?? {}).flat() as { url?: string }[];
  for (const item of links) {
    const url = item?.url;
    if (!url) continue;
    if (!url.startsWith('https://')) badLinks.push(`${key}: ${url}`);
    else if (SEARCH_QUERY.test(url) || (url.includes('?') && SEARCH_PATH.test(url))) {
      badLinks.push(`${key}: 疑似搜索页 ${url}`);
    }
  }
}

console.log(`职业总数          ${careerNames.length}`);
console.log(`资源键总数        ${resourceKeys.length}`);
console.log(`已配资源          ${careerNames.length - missing.length}`);
console.log(`缺资源职业        ${missing.length}`);
if (missing.length) console.log('  ' + missing.join('\n  '));
console.log(`孤儿键（非职业名）${orphans.length}`);
if (orphans.length) console.log('  ' + orphans.join('\n  '));
console.log(`可疑链接          ${badLinks.length}`);
if (badLinks.length) console.log('  ' + badLinks.join('\n  '));

const ok = missing.length === 0 && orphans.length === 0 && badLinks.length === 0;
console.log(ok ? '\n✅ 全部通过' : '\n❌ 存在问题，见上方明细');
process.exit(ok ? 0 : 1);
