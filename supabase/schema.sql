-- ============================================================
-- 人生重构计划 · Supabase PostgreSQL 建表脚本
-- ------------------------------------------------------------
-- 项目代码通过 @supabase/supabase-js 直连数据库（见
-- src/storage/database/supabase-client.ts），仓库中没有
-- drizzle 迁移文件，因此新环境必须手工执行本脚本建表。
--
-- 用法：Supabase Dashboard → SQL Editor → 粘贴执行。
-- 本脚本可重复执行（IF NOT EXISTS）。
--
-- 对应的 Drizzle 类型定义：src/storage/database/shared/schema.ts
-- ============================================================

-- ---- 用户表：三级角色 normal | premium | developer ----
CREATE TABLE IF NOT EXISTS app_users (
  id               serial PRIMARY KEY,
  nickname         varchar(50) NOT NULL UNIQUE,
  password_hash    varchar(128) NOT NULL,          -- bcrypt, cost=10
  avatar           varchar(20) DEFAULT '🧑‍💻',
  role             varchar(20) NOT NULL DEFAULT 'normal',
  invite_code_used varchar(50),
  is_active        boolean NOT NULL DEFAULT true,
  -- AI 额度（2026-10-02 额度制）：剩余次数 + 累计已充（展示用）
  ai_credits       integer NOT NULL DEFAULT 0,
  ai_credits_total integer NOT NULL DEFAULT 0,
  last_login_at    timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);
-- 存量表已存在的环境补列（可重复执行）
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS ai_credits integer NOT NULL DEFAULT 0;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS ai_credits_total integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS app_users_nickname_idx ON app_users (nickname);
CREATE INDEX IF NOT EXISTS app_users_role_idx     ON app_users (role);
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;      -- 不建 policy：仅 service role 可访问

-- ---- 邀请码表：普通用户凭码升级为 premium；每个码自带 AI 额度 ----
CREATE TABLE IF NOT EXISTS invite_codes (
  id         serial PRIMARY KEY,
  code       varchar(50) NOT NULL UNIQUE,
  label      varchar(100),                          -- 后台备注
  max_uses   integer DEFAULT 1,                     -- NULL = 不限次
  used_count integer NOT NULL DEFAULT 0,
  -- 兑换此码到账的 AI 分析次数（额度制，2026-10-02）
  ai_credits integer NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true,
  created_by varchar(50),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS ai_credits integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS invite_codes_code_idx   ON invite_codes (code);
CREATE INDEX IF NOT EXISTS invite_codes_active_idx ON invite_codes (is_active);
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- ---- AI 额度流水：每一笔增减都留痕（审计/对账） ----
CREATE TABLE IF NOT EXISTS ai_credit_logs (
  id         serial PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES app_users (id),
  delta      integer NOT NULL,                      -- +N 到账 / -1 消耗
  reason     varchar(100) NOT NULL,                 -- redeem_code / analyze / admin_grant
  balance    integer NOT NULL,                      -- 变动后余额
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_credit_logs_user_idx ON ai_credit_logs (user_id);
ALTER TABLE ai_credit_logs ENABLE ROW LEVEL SECURITY;

-- ---- 访问日志表 ----
CREATE TABLE IF NOT EXISTS access_logs (
  id         serial PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES app_users (id),
  action     varchar(100) NOT NULL,                 -- login / register / redeem_code / visit_module / become_developer / exit_developer
  detail     text,
  ip_address varchar(45),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS access_logs_user_id_idx    ON access_logs (user_id);
CREATE INDEX IF NOT EXISTS access_logs_action_idx     ON access_logs (action);
CREATE INDEX IF NOT EXISTS access_logs_created_at_idx ON access_logs (created_at);
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- ---- 可选：健康检查表（schema.ts 中定义，代码未使用） ----
CREATE TABLE IF NOT EXISTS health_check (
  id         serial PRIMARY KEY,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

-- ---- 限流计数表：固定窗口，由 hit_rate_limit() 原子维护 ----
CREATE TABLE IF NOT EXISTS rate_limits (
  key          text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count        integer NOT NULL DEFAULT 0
);
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- ---- 原子函数（仅 service role 可调用，anon/authenticated 不可经 RPC 直调） ----
-- 扣 1 次额度：余额不足时不返回行
CREATE OR REPLACE FUNCTION consume_ai_credit(p_user_id integer)
RETURNS integer
LANGUAGE sql
AS $$
  UPDATE app_users
     SET ai_credits = ai_credits - 1
   WHERE id = p_user_id AND ai_credits > 0
  RETURNING ai_credits;
$$;

-- 退 1 次额度并记流水；用户不存在时返回 NULL
CREATE OR REPLACE FUNCTION refund_ai_credit(p_user_id integer, p_reason text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance integer;
BEGIN
  UPDATE app_users
     SET ai_credits = ai_credits + 1
   WHERE id = p_user_id
  RETURNING ai_credits INTO v_balance;

  IF v_balance IS NOT NULL THEN
    INSERT INTO ai_credit_logs (user_id, delta, reason, balance)
    VALUES (p_user_id, 1, left(p_reason, 100), v_balance);
  END IF;
  RETURN v_balance;
END;
$$;

-- 限流：返回 true=放行，false=超限；窗口过期则重置
CREATE OR REPLACE FUNCTION hit_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
BEGIN
  INSERT INTO rate_limits AS r (key, window_start, count)
  VALUES (p_key, now(), 1)
  ON CONFLICT (key) DO UPDATE SET
    window_start = CASE WHEN r.window_start + make_interval(secs => p_window_seconds) <= now()
                        THEN now() ELSE r.window_start END,
    count        = CASE WHEN r.window_start + make_interval(secs => p_window_seconds) <= now()
                        THEN 1 ELSE r.count + 1 END
  RETURNING r.count INTO v_count;

  RETURN v_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION consume_ai_credit(integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION refund_ai_credit(integer, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION hit_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION consume_ai_credit(integer) TO service_role;
GRANT EXECUTE ON FUNCTION refund_ai_credit(integer, text) TO service_role;
GRANT EXECUTE ON FUNCTION hit_rate_limit(text, integer, integer) TO service_role;
