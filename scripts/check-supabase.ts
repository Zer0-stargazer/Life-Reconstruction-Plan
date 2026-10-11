/**
 * Supabase 连通性与建表体检。
 *
 * 上线硬门槛第一条：登录/邀请码/后台/内置 AI 全依赖数据库，
 * 缺表、缺列或缺函数时表现是"接口 500"，从页面上根本看不出根因。
 * 这个脚本把要求的表、列、RPC 函数、开关种子数据逐个探一遍，缺什么报什么。
 *
 * 用法：pnpm check:db
 *
 * 安全说明：
 *   - 只读为主。取行数用 head + count（只拿元数据，不取任何行内容）。
 *   - 唯一会写的是命中限流函数的一次探测，用的是专属 key `__checkdb__`，
 *     探测完立刻删掉自己写入的那一行。
 *   - RPC 探测全部传"不存在的用户 id (-1)"，保证不会真的动到任何人的额度。
 *   - 用 service role key 是因为表开了 RLS 又没建 policy，anon key 一律查不到。
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ .env.local 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
console.log(`目标实例：${url.replace(/\/\/[^/]+\//, '//<project>/')}\n`);

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** 每个表：探测列名 = 该表必须有这个字段（命不中就是缺表或缺列） */
const REQUIRED: Array<{ table: string; probe: string; from: string }> = [
  { table: 'app_users', probe: 'id', from: 'schema.sql' },
  { table: 'app_users', probe: 'ai_credits', from: 'schema.sql（额度制列）' },
  { table: 'app_users', probe: 'ai_credits_total', from: 'schema.sql（额度制列）' },
  { table: 'invite_codes', probe: 'ai_credits', from: 'schema.sql（额度制列）' },
  { table: 'ai_credit_logs', probe: 'user_id', from: 'schema.sql' },
  { table: 'access_logs', probe: 'action', from: 'schema.sql' },
  { table: 'rate_limits', probe: 'key', from: 'schema.sql' },
  { table: 'ai_usage_logs', probe: 'error_kind', from: 'migrations/2026-10-10-batch5-admin.sql' },
  { table: 'app_settings', probe: 'key', from: 'migrations/2026-10-10-batch5-admin.sql' },
  { table: 'dev_sessions', probe: 'token_hash', from: 'migrations/2026-10-10-batch5-admin.sql' },
];

/** 代码实际调用的 RPC：src/app/api/{admin,ai/analyze}/route.ts、src/lib/rate-limit.ts */
const FUNCTIONS: Array<{ name: string; args: Record<string, unknown>; from: string }> = [
  { name: 'consume_ai_credit', args: { p_user_id: -1 }, from: 'schema.sql' },
  { name: 'refund_ai_credit', args: { p_user_id: -1, p_reason: 'check:db' }, from: 'schema.sql' },
  // 会往 rate_limits 写一行，探测完立刻自删
  { name: 'hit_rate_limit', args: { p_key: '__checkdb__', p_limit: 1, p_window_seconds: 60 }, from: 'schema.sql' },
  { name: 'admin_adjust_credits', args: { p_user_id: -1, p_delta: 0, p_reason: 'check:db' }, from: 'migrations/2026-10-10-batch5-admin.sql' },
];

/** 后台靠这两个开关控制"内置 AI / 兑换"，建表脚本会种进去，缺了功能会被判成关闭 */
const SETTING_KEYS = ['builtin_ai_enabled', 'redeem_enabled'];

let failed = 0;
const counts: Record<string, number | null> = {};

/** PostgREST 找不到函数时的错误码；其余错误（参数类型、业务异常）都说明函数存在 */
const FN_NOT_FOUND = 'PGRST202';

async function main() {
  console.log('—— 表与列 ——');
  for (const { table, probe, from } of REQUIRED) {
    // head + count：只要元数据，不取任何行内容
    const res = await supabase.from(table).select(probe, { count: 'exact', head: true });
    if (res.error) {
      console.log(`❌ ${table}.${probe} —— ${res.error.message}（应来自 ${from}）`);
      failed++;
      counts[table] ??= null;
    } else {
      console.log(`✅ ${table}.${probe}`);
      counts[table] = res.count ?? 0;
    }
  }

  console.log('\n—— RPC 函数 ——');
  for (const { name, args, from } of FUNCTIONS) {
    const res = await supabase.rpc(name, args);
    const code = (res.error as { code?: string } | null)?.code;
    if (res.error && code === FN_NOT_FOUND) {
      console.log(`❌ ${name}() —— 不存在（应来自 ${from}）`);
      failed++;
    } else {
      // 其余错误都算通过：传的是 id=-1，"user not found" 之类的业务异常恰好证明函数在
      console.log(`✅ ${name}()`);
    }
  }
  // hit_rate_limit 探测会留下 __checkdb__ 这一行，清掉
  await supabase.from('rate_limits').delete().eq('key', '__checkdb__');

  console.log('\n—— 全局开关种子数据 ——');
  const { data: settings, error: setErr } = await supabase
    .from('app_settings')
    .select('key, value')
    .in('key', SETTING_KEYS);
  if (setErr) {
    console.log(`❌ app_settings 读不到 —— ${setErr.message}`);
    failed++;
  } else {
    const found = new Set((settings ?? []).map((r) => r.key as string));
    for (const k of SETTING_KEYS) {
      if (found.has(k)) {
        const row = (settings ?? []).find((r) => r.key === k);
        console.log(`✅ ${k} = ${row?.value}`);
      } else {
        console.log(`❌ ${k} 缺失（应为 true）`);
        failed++;
      }
    }
  }

  console.log('\n—— 行数（仅计数，不读内容）——');
  for (const [table, n] of Object.entries(counts)) {
    console.log(`  ${table}: ${n === null ? '不可访问' : n}`);
  }

  if (failed === 0) {
    console.log('\n✅ 建表齐全，可以走登录 → 建码 → 兑换闭环手测');
  } else {
    console.log(`\n❌ 缺 ${failed} 项。在 Supabase Dashboard → SQL Editor 执行：`);
    console.log('   1) supabase/schema.sql（幂等，可重复执行）');
    console.log('   2) supabase/migrations/2026-10-10-batch5-admin.sql');
    console.log('   执行完再跑一次 pnpm check:db');
  }
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('\n❌ 连不上实例：', err instanceof Error ? err.message : err);
  console.error(
    [
      '',
      '这一步需要能访问 https://<project>.supabase.co 的网络。',
      '若所在网络访问不到，可改为在 Supabase Dashboard → SQL Editor 执行',
      'scripts/check-supabase.sql，把输出贴回来人工核对。',
    ].join('\n'),
  );
  process.exit(2);
});
