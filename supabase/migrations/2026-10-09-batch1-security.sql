-- ============================================================
-- 批次 1：安全与计费迁移（2026-10-09）
-- ------------------------------------------------------------
-- 执行方式：Supabase Dashboard → SQL Editor → 粘贴整份脚本 → Run。
-- 可重复执行（幂等）。必须在部署对应代码之前执行，否则
-- 额度扣减与限流会因缺少函数而失败。
--
-- 内容：
--   1. 全部业务表开启 RLS（不建 policy，仅 service role 访问）
--   2. 新增 rate_limits 表 + hit_rate_limit()
--   3. 新增 consume_ai_credit() / refund_ai_credit()
--   4. 收回 anon / authenticated 对上述函数的执行权限
-- ============================================================

ALTER TABLE app_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_check   ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS rate_limits (
  key          text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count        integer NOT NULL DEFAULT 0
);
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

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
