-- ============================================================
-- 建表体检（SQL 版）
-- ------------------------------------------------------------
-- 用法：Supabase Dashboard → SQL Editor → 整段粘贴 → Run
-- 输出一张三列表：检查项 / 结果 / 说明，缺什么一目了然。
-- 把结果整块复制回来即可，不必一条条念。
--
-- 本脚本 100% 只读，不写不删，也不会读出任何用户数据
-- （只查 information_schema / pg_proc / 行数估算）。
--
-- 与它的 Node 版是一对：scripts/check-supabase.ts（pnpm check:db）。
-- 网络能连通时优先跑 Node 版；连不通时（例如公司网络拦了
-- *.supabase.co）就用本文件在 Dashboard 里查。
-- ============================================================

-- 1) 表与列：逐个比对，缺表或缺列都报"缺"
WITH req(table_name, column_name, src) AS (
  VALUES
    ('app_users'::text,       'id'::text,               'schema.sql'),
    ('app_users'::text,       'ai_credits'::text,       'schema.sql 额度制列'),
    ('app_users'::text,       'ai_credits_total'::text, 'schema.sql 额度制列'),
    ('invite_codes'::text,    'ai_credits'::text,       'schema.sql 额度制列'),
    ('ai_credit_logs'::text,  'user_id'::text,          'schema.sql'),
    ('access_logs'::text,     'action'::text,           'schema.sql'),
    ('rate_limits'::text,     'key'::text,              'schema.sql'),
    ('ai_usage_logs'::text,   'error_kind'::text,       'migrations/batch5'),
    ('app_settings'::text,    'key'::text,              'migrations/batch5'),
    ('dev_sessions'::text,    'token_hash'::text,       'migrations/batch5')
)
SELECT 1 AS sort, '表与列' AS 检查项,
       (CASE WHEN c.column_name IS NULL THEN '❌ 缺  ' ELSE '✅ ' END)
         || r.table_name || '.' || r.column_name AS 结果,
       r.src AS 说明
FROM req r
LEFT JOIN information_schema.columns c
       ON c.table_schema = 'public'
      AND c.table_name   = r.table_name
      AND c.column_name  = r.column_name

UNION ALL

-- 2) RPC 函数：代码实际调用的四个（analyze / admin / rate-limit）
SELECT 1, 'RPC 函数',
       (CASE WHEN p.oid IS NULL THEN '❌ 缺  ' ELSE '✅ ' END) || r.fn || '()',
       r.src
FROM (VALUES
        ('consume_ai_credit'::text,    1, 'schema.sql'),
        ('refund_ai_credit'::text,     2, 'schema.sql'),
        ('hit_rate_limit'::text,       3, 'schema.sql'),
        ('admin_adjust_credits'::text, 3, 'migrations/batch5')
     ) AS r(fn, nargs, src)
LEFT JOIN LATERAL (
  SELECT p.oid
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public' AND p.proname = r.fn AND p.pronargs = r.nargs
   LIMIT 1
) p ON true

UNION ALL

-- 3) 全局开关种子数据：缺了后台会被判成"功能关闭"
SELECT 1, '全局开关',
       (CASE WHEN s.key IS NULL THEN '❌ 缺  ' ELSE '✅ ' END) || k.key
         || CASE WHEN s.key IS NULL THEN '' ELSE ' = ' || s.value::text END,
       'migrations/batch5 播种'
FROM (VALUES ('builtin_ai_enabled'::text), ('redeem_enabled'::text)) AS k(key)
LEFT JOIN app_settings s ON s.key = k.key

UNION ALL

-- 4) 各表行数（估算值，只看规模不读内容）
SELECT 2, '表行数',
       relname || ': ' || n_live_tup::text,
       'public schema'
FROM pg_stat_user_tables
WHERE schemaname = 'public'

ORDER BY 1, 2, 3;
