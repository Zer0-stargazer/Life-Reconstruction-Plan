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


-- ---- 反馈表（batch12，开源免费模式）：登录可选，服务端写入 ----
CREATE TABLE IF NOT EXISTS feedback (
  id         serial PRIMARY KEY,
  user_id    integer REFERENCES app_users (id) ON DELETE SET NULL,
  nickname   varchar(50),
  contact    varchar(100),
  module     varchar(20) NOT NULL DEFAULT '通用',
  content    text NOT NULL,
  status     varchar(20) NOT NULL DEFAULT 'open',
  reply      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS feedback_created_idx ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_status_idx  ON feedback (status);
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;      -- 不建 policy：仅 service role 可访问

-- ---- batch13（2026-10-15）：邀请码原子兑换 + 限流清理（详见 migrations/2026-10-15-batch13-invite-redeem.sql）----
-- 依赖 batch9 的 invite_codes.kind 与 batch6 的 app_users.token_version（此处补列，幂等）
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS kind varchar(16) NOT NULL DEFAULT 'bundle';
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS token_version integer NOT NULL DEFAULT 0;

-- ---- 1. 兑换记录表（id 类型与 app_users.id / invite_codes.id 一致：integer）----
CREATE TABLE IF NOT EXISTS invite_redemptions (
  id              bigserial PRIMARY KEY,
  user_id         integer NOT NULL REFERENCES app_users (id) ON DELETE CASCADE,
  code_id         integer NOT NULL REFERENCES invite_codes (id) ON DELETE CASCADE,
  credits_granted integer NOT NULL DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  CONSTRAINT invite_redemptions_user_code_uniq UNIQUE (user_id, code_id)
);
CREATE INDEX IF NOT EXISTS invite_redemptions_code_idx ON invite_redemptions (code_id);
ALTER TABLE invite_redemptions ENABLE ROW LEVEL SECURITY;   -- 不建 policy：仅 service role 可访问

-- ---- 2. 原子兑换 ----
-- 返回 jsonb：
--   status          ok / not_found / inactive / expired / exhausted / already_redeemed / user_not_found / user_disabled
--   以下字段仅 status = 'ok' 时有值：
--   kind            access / ai / bundle
--   credits_granted 本次到账额度（access 码为 0）
--   new_balance     兑换后额度余额
--   role            兑换后角色（access/bundle 且原为 normal → premium；ai 码不改角色）
--   nickname, token_version  供路由重新签发会话令牌
-- 锁顺序：先 app_users 行，再 invite_codes 行（同一用户的并发兑换在第一把锁上串行化）。
-- 不使用 SECURITY DEFINER，与现有 RPC 一致，仅 service_role 可执行。
CREATE OR REPLACE FUNCTION redeem_invite_code(p_user_id integer, p_code text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_user     app_users%ROWTYPE;
  v_invite   invite_codes%ROWTYPE;
  v_kind     text;
  v_grant    integer;
  v_role     text;
  v_balance  integer;
  v_redeem_id bigint;
BEGIN
  -- 锁用户行
  SELECT * INTO v_user FROM app_users WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'user_not_found');
  END IF;
  IF NOT v_user.is_active THEN
    RETURN jsonb_build_object('status', 'user_disabled');
  END IF;

  -- 锁码行
  SELECT * INTO v_invite FROM invite_codes WHERE code = p_code FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;
  IF NOT v_invite.is_active THEN
    RETURN jsonb_build_object('status', 'inactive');
  END IF;
  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < now() THEN
    RETURN jsonb_build_object('status', 'expired');
  END IF;

  -- 已兑换过（先于 exhausted 判断，避免用掉最后一次的人看到「已用完」）
  IF EXISTS (SELECT 1 FROM invite_redemptions WHERE user_id = p_user_id AND code_id = v_invite.id) THEN
    RETURN jsonb_build_object('status', 'already_redeemed');
  END IF;

  -- NULL = 不限次
  IF v_invite.max_uses IS NOT NULL AND v_invite.used_count >= v_invite.max_uses THEN
    RETURN jsonb_build_object('status', 'exhausted');
  END IF;

  -- 按码类型分发（与旧路由语义一致）：
  --   access = 只升级 premium，不加额度；ai = 只加额度，角色不变；bundle（默认）= 升级 + 加额度
  v_kind := CASE WHEN v_invite.kind IN ('access', 'ai', 'bundle') THEN v_invite.kind ELSE 'bundle' END;
  v_grant := CASE WHEN v_kind = 'access' THEN 0 ELSE GREATEST(COALESCE(v_invite.ai_credits, 0), 0) END;
  v_role := CASE WHEN v_kind = 'ai' OR v_user.role <> 'normal' THEN v_user.role ELSE 'premium' END;

  -- 记录兑换（唯一冲突兜底：理论上已被用户行锁串行化，这里是双保险）
  INSERT INTO invite_redemptions (user_id, code_id, credits_granted)
  VALUES (p_user_id, v_invite.id, v_grant)
  ON CONFLICT (user_id, code_id) DO NOTHING
  RETURNING id INTO v_redeem_id;
  IF v_redeem_id IS NULL THEN
    RETURN jsonb_build_object('status', 'already_redeemed');
  END IF;

  -- 增量更新，不覆盖
  UPDATE invite_codes SET used_count = used_count + 1 WHERE id = v_invite.id;

  UPDATE app_users
     SET role = v_role,
         invite_code_used = v_invite.code,
         ai_credits = ai_credits + v_grant,
         ai_credits_total = ai_credits_total + v_grant
   WHERE id = p_user_id
  RETURNING ai_credits INTO v_balance;

  IF v_grant > 0 THEN
    INSERT INTO ai_credit_logs (user_id, delta, reason, balance)
    VALUES (p_user_id, v_grant, 'redeem_code', v_balance);
  END IF;

  RETURN jsonb_build_object(
    'status', 'ok',
    'kind', v_kind,
    'credits_granted', v_grant,
    'new_balance', v_balance,
    'role', v_role,
    'nickname', v_user.nickname,
    'token_version', COALESCE(v_user.token_version, 0)
  );
END;
$$;

REVOKE ALL ON FUNCTION redeem_invite_code(integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION redeem_invite_code(integer, text) TO service_role;

-- ---- 4. 限流表清理 ----
-- 删除窗口起点早于 24 小时的行（最长业务窗口为 24h 的注册 IP 计数，过期行已无意义）。
-- 返回删除行数。本次不接 cron：可由 Cloudflare Cron Trigger 或 admin 接口调用。
CREATE OR REPLACE FUNCTION purge_old_rate_limits()
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  affected integer;
BEGIN
  DELETE FROM rate_limits WHERE window_start < now() - interval '24 hours';
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

REVOKE ALL ON FUNCTION purge_old_rate_limits() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION purge_old_rate_limits() TO service_role;
