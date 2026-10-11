/**
 * 商业化闭环端到端自检。
 *
 * 用法：先 `pnpm dev`（必须是 5000 端口），再另开一个终端跑 `pnpm check:flow`
 *
 * 覆盖 9 步：注册 → 开发者口令校验 → 后台建码（带额度）→ 第二个账号注册 →
 * 兑换前余额 → 兑换 → 兑换后余额到账 → 重复兑换被拒 → 码用尽后被拒。
 *
 * 为什么要有它：登录/兑换/额度这一串依赖数据库，页面上手点一遍要几分钟，
 * 而且失败了只看得到"接口 500"。这个脚本把整条链路一次跑完并逐步报告，
 * 等价于 LAUNCH-CHECKLIST 里「关键路径手测清单」的自动化版。
 *
 * ⚠️ 两点注意：
 *   1. **只打 localhost:5000**，不会碰到生产环境
 *   2. **会往数据库写数据**：留下 3 个 `e2e_*` 测试账号和 1 个 `E2E-*` 邀请码，
 *      跑完脚本末尾会打印清理用的 SQL，去 Dashboard 执行一次即可
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const BASE = 'http://localhost:5000';
const TS = Date.now().toString().slice(-6);
const DEV_NAME = `e2e_dev_${TS}`;
const USER_NAME = `e2e_user_${TS}`;
const CODE = `E2E-${TS}`;
const PW = 'e2e-test-pw-2026';

let failed = 0;
const results: Array<[string, boolean, string]> = [];

async function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}
async function get(path: string, headers: Record<string, string> = {}) {
  const res = await fetch(`${BASE}${path}`, { headers });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

function check(step: string, ok: boolean, detail: string) {
  results.push([step, ok, detail]);
  if (!ok) failed++;
}

async function main() {
  console.log(`目标: ${BASE}　测试账号: ${DEV_NAME} / ${USER_NAME}　邀请码: ${CODE}\n`);

  // 1. 注册开发者账号
  const r1 = await post('/api/auth', { action: 'register', nickname: DEV_NAME, password: PW });
  const devToken: string = r1.json?.token ?? '';
  check('1 注册账号', r1.status === 200 && !!devToken, `HTTP ${r1.status} ${r1.json?.error ?? ''}`);

  // 2. 开发者口令校验 → 拿 dev token（顺便把该账号升级为 developer）
  const r2 = await post('/api/admin', { action: 'verify', password: process.env.DEV_PASSWORD }, {
    'x-session-token': devToken,
  });
  const devAdminToken: string = r2.json?.token ?? '';
  check('2 开发者口令校验', r2.status === 200 && !!devAdminToken, `HTTP ${r2.status} ${r2.json?.error ?? ''}`);

  // 3. 建码（带 5 次 AI 额度）
  const r3 = await post('/api/admin', { action: 'create_invite', code: CODE, label: 'e2e 自检', maxUses: 1, aiCredits: 5 }, {
    'x-dev-token': devAdminToken,
  });
  check('3 后台建码(含5次额度)', r3.status === 200 && r3.json?.success === true, `HTTP ${r3.status} ${r3.json?.error ?? ''}`);

  // 4. 注册第二个用户
  const r4 = await post('/api/auth', { action: 'register', nickname: USER_NAME, password: PW });
  const userToken: string = r4.json?.token ?? '';
  check('4 注册第二个账号', r4.status === 200 && !!userToken, `HTTP ${r4.status} ${r4.json?.error ?? ''}`);

  // 5. 兑换前查余额（应为 0）
  const before = await get('/api/ai/credits', { authorization: `Bearer ${userToken}` });
  const beforeCredits = before.json?.credits ?? before.json?.ai_credits ?? null;
  check('5 兑换前余额=0', before.status === 200 && beforeCredits === 0, `HTTP ${before.status} credits=${beforeCredits}`);

  // 6. 兑换邀请码
  const r6 = await post('/api/invite', { code: CODE }, { authorization: `Bearer ${userToken}` });
  check('6 兑换邀请码', r6.status === 200 && r6.json?.success === true, `HTTP ${r6.status} ${r6.json?.error ?? ''}`);

  // 7. 兑换后查余额（应为 5）
  const after = await get('/api/ai/credits', { authorization: `Bearer ${userToken}` });
  const afterCredits = after.json?.credits ?? after.json?.ai_credits ?? null;
  check('7 兑换后余额=5', after.status === 200 && afterCredits === 5, `HTTP ${after.status} credits=${afterCredits}`);

  // 8. 重复兑换同一码应被拒（maxUses=1）
  const r8 = await post('/api/invite', { code: CODE }, { authorization: `Bearer ${userToken}` });
  check('8 重复兑换被拒', r8.status !== 200 || r8.json?.success === false, `HTTP ${r8.status} ${r8.json?.error ?? ''}`);

  // 9. 码用尽后第三人兑换应失败
  const r9 = await post('/api/auth', { action: 'register', nickname: `${USER_NAME}_c`, password: PW });
  const cToken: string = r9.json?.token ?? '';
  const r10 = await post('/api/invite', { code: CODE }, { authorization: `Bearer ${cToken}` });
  check('9 码用尽后再兑被拒', r10.status !== 200 || r10.json?.success === false, `HTTP ${r10.status} ${r10.json?.error ?? ''}`);

  for (const [step, ok, detail] of results) {
    console.log(`${ok ? '✅' : '❌'} ${step} —— ${detail}`);
  }
  console.log(failed === 0 ? '\n✅ 商业化闭环 9 步全通过' : `\n❌ ${failed} 步失败`);
  console.log(`\n注意：库里留下了 ${DEV_NAME} / ${USER_NAME} / ${USER_NAME}_c 三个测试账号与邀请码 ${CODE}。`);
  console.log('清理 SQL：DELETE FROM app_users WHERE nickname LIKE \'e2e_%\'; DELETE FROM invite_codes WHERE code LIKE \'E2E-%\';');
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('连不上 dev server 或异常：', e instanceof Error ? e.message : e);
  console.error('确认 pnpm dev 已在 5000 端口跑起来');
  process.exit(2);
});
