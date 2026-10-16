-- 批次 7：AI 内容审核 + 用户通知
-- 在 Supabase SQL Editor 中整段执行一次。幂等，可重复执行。
--
--   1. ai_usage_logs 扩展：对话正文 + 风险判定结果 + 处理状态
--   2. 新增 user_notifications：给用户的站内通知 / 警告（高风险可要求强制确认）
--   3. 新增 moderation_rules：违规关键词表（后台可自行维护）
--   4. purge_old_ai_content()：正文保留 30 天后自动抹掉，只留元数据
--
-- 合规提醒：开启正文记录后，/privacy 必须写明"AI 对话内容会被记录用于内容安全审核"。
-- 管理员查看完整正文时，应用侧要写 access_logs 审计（谁看了谁的哪条）。

-- ---- 1. AI 使用日志扩展 ----
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS prompt_text     text;
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS response_text   text;
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS risk_level      varchar(10) NOT NULL DEFAULT 'none'; -- none/low/medium/high
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS risk_score      integer     NOT NULL DEFAULT 0;
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS risk_hits       jsonb       NOT NULL DEFAULT '[]'::jsonb; -- 命中的词 [{word,level,category}]
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS risk_reason    text;        -- AI 复核给出的理由
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS reviewed        boolean     NOT NULL DEFAULT false;
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS reviewed_at     timestamptz;
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS action_taken    varchar(20) NOT NULL DEFAULT 'none'; -- none/warned/disabled
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS ip_address      varchar(45);
ALTER TABLE ai_usage_logs ADD COLUMN IF NOT EXISTS content_purged  boolean     NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS ai_usage_logs_risk_idx     ON ai_usage_logs (risk_level, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_usage_logs_reviewed_idx ON ai_usage_logs (reviewed, created_at DESC);

-- ---- 2. 用户通知 ----
CREATE TABLE IF NOT EXISTS user_notifications (
  id             bigserial PRIMARY KEY,
  user_id        integer NOT NULL REFERENCES app_users (id),
  type           varchar(20) NOT NULL DEFAULT 'system',   -- system / warning / info
  severity       varchar(10) NOT NULL DEFAULT 'low',      -- low / medium / high
  title          varchar(120) NOT NULL,
  body           text NOT NULL,
  related_log_id bigint,                                  -- 关联的 ai_usage_logs.id
  require_ack    boolean NOT NULL DEFAULT false,          -- true = 必须点"我知道了"才能继续
  created_at     timestamptz NOT NULL DEFAULT now(),
  read_at        timestamptz,
  acked_at       timestamptz
);
CREATE INDEX IF NOT EXISTS user_notifications_user_idx
  ON user_notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS user_notifications_pending_idx
  ON user_notifications (user_id) WHERE read_at IS NULL;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- ---- 3. 违规关键词表 ----
-- level: warn = 中风险（发通知）/ high = 高风险（强制弹窗确认）
-- 这里只种两个"业务风险"示例（引流、诈骗），敏感词表由管理员在后台自行维护。
CREATE TABLE IF NOT EXISTS moderation_rules (
  id         serial PRIMARY KEY,
  word       varchar(60) NOT NULL UNIQUE,
  level      varchar(10) NOT NULL DEFAULT 'warn',
  category   varchar(30),
  enabled    boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS moderation_rules_enabled_idx ON moderation_rules (enabled);
ALTER TABLE moderation_rules ENABLE ROW LEVEL SECURITY;

INSERT INTO moderation_rules (word, level, category) VALUES
  ('加微信', 'warn', '引流'),
  ('刷单',   'warn', '诈骗'),
  ('代刷',   'warn', '诈骗')
ON CONFLICT (word) DO NOTHING;

-- 功能开关（后台「功能开关」页可切换）
INSERT INTO app_settings (key, value) VALUES
  ('ai_content_logging_enabled', true),   -- 是否记录 AI 对话正文（关掉则只记元数据）
  ('auto_moderation_enabled',    true)    -- 命中规则后是否自动通知/处置（关掉则纯人工审核）
ON CONFLICT (key) DO NOTHING;

-- ---- 4. 正文过期清理（保留 N 天，默认 30）----
-- 只抹正文，保留时间/用户/模块/风险等级等元数据，方便事后统计与追溯"某人是否惯犯"。
CREATE OR REPLACE FUNCTION purge_old_ai_content(days integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  affected integer;
BEGIN
  UPDATE ai_usage_logs
     SET prompt_text = NULL,
         response_text = NULL,
         content_purged = true
   WHERE created_at < now() - (days || ' days')::interval
     AND (prompt_text IS NOT NULL OR response_text IS NOT NULL);
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;
