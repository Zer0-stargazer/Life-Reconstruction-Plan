-- 批次 5：开发者后台
-- 在 Supabase SQL Editor 中整段执行一次。幂等，可重复执行。
--   1. 新增 ai_usage_logs：每次内置 AI 调用一条，记录模块、成功与否、失败类别
--   2. 新增 app_settings：全局功能开关（内置 AI、兑换）

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id          bigserial PRIMARY KEY,
  user_id     integer NOT NULL REFERENCES app_users (id),
  module      varchar(40) NOT NULL,
  success     boolean NOT NULL,
  error_kind  varchar(40),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_usage_logs_created_idx ON ai_usage_logs (created_at);
CREATE INDEX IF NOT EXISTS ai_usage_logs_user_idx ON ai_usage_logs (user_id);
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS app_settings (
  key         varchar(60) PRIMARY KEY,
  value       boolean NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO app_settings (key, value) VALUES
  ('builtin_ai_enabled', true),
  ('redeem_enabled', true)
ON CONFLICT (key) DO NOTHING;

-- 后台手动加减额度：行锁 + 余额不能为负 + 写流水，全部在一个事务里完成
CREATE OR REPLACE FUNCTION admin_adjust_credits(p_user_id integer, p_delta integer, p_reason text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance integer;
BEGIN
  SELECT ai_credits INTO v_balance FROM app_users WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'user not found';
  END IF;
  IF v_balance + p_delta < 0 THEN
    RAISE EXCEPTION 'insufficient credits';
  END IF;
  v_balance := v_balance + p_delta;
  UPDATE app_users SET ai_credits = v_balance WHERE id = p_user_id;
  INSERT INTO ai_credit_logs (user_id, delta, reason, balance)
  VALUES (p_user_id, p_delta, left(p_reason, 100), v_balance);
  RETURN v_balance;
END;
$$;

REVOKE ALL ON FUNCTION admin_adjust_credits(integer, integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_adjust_credits(integer, integer, text) TO service_role;
