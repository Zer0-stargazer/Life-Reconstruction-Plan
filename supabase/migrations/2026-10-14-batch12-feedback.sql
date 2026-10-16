-- ============================================================
-- batch12（2026-10-14）：反馈系统（开源免费模式）
-- 用户在「支持作者」页（/about）提交反馈；
-- 管理员（developer）通过 GET /api/feedback 查看。
-- 与项目其他表一致：启用 RLS 且不建 policy，仅服务端（service role）可访问。
-- 用法：Supabase Dashboard → SQL Editor → 粘贴执行（可重复执行）。
-- ============================================================

-- ---- 反馈表：登录可选，服务端写入 ----
CREATE TABLE IF NOT EXISTS feedback (
  id         serial PRIMARY KEY,
  user_id    integer REFERENCES app_users (id) ON DELETE SET NULL,
  nickname   varchar(50),                          -- 提交时的昵称快照（未登录为 NULL）
  contact    varchar(100),                         -- 用户自愿留下的联系方式
  module     varchar(20) NOT NULL DEFAULT '通用',   -- 反馈相关的模块
  content    text NOT NULL,                        -- 反馈正文（服务端已截断至 1000 字）
  status     varchar(20) NOT NULL DEFAULT 'open',  -- open | processing | resolved
  reply      text,                                 -- 站长回复（预留）
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS feedback_created_idx ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_status_idx  ON feedback (status);
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;   -- 不建 policy：仅 service role 可访问
