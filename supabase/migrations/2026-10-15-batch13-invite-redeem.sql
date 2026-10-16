-- ============================================================
-- batch13（2026-10-15）：邀请码原子兑换 + 防重复兑换 + 限流表清理
-- ------------------------------------------------------------
-- 用途：
--   1. invite_redemptions：记录「谁兑换了哪个码」，unique(user_id, code_id) 防同一用户重复兑换
--   2. redeem_invite_code(p_user_id, p_code)：单事务内行锁校验 + 增量加额度 + 写流水
--      （取代 /api/invite 里「读后覆盖写」的实现，避免并发扣减被抹掉 / 回滚抹掉并发计数）
--   3. purge_old_ai_content() 补 REVOKE/GRANT（batch7 遗漏，只授权 service_role）
--   4. purge_old_rate_limits()：删除 24 小时前的限流计数行。
--      本次不接 cron；可由 Cloudflare Cron Trigger 或 admin 接口通过 service role 调用
--      （supabase.rpc('purge_old_rate_limits')）。
--
-- 执行方式：Supabase Dashboard → SQL Editor → 粘贴整份脚本 → Run。
-- 可重复执行（幂等）。必须在部署对应代码之前执行。
-- 依赖：batch1（rate_limits / ai_credit_logs）、batch9（invite_codes.kind）、batch7（purge_old_ai_content）。
-- ============================================================

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

-- ---- 3. batch7 遗漏的权限收口 ----
REVOKE ALL ON FUNCTION purge_old_ai_content(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION purge_old_ai_content(integer) TO service_role;

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
