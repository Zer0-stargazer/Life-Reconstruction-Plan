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
  last_login_at    timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS app_users_nickname_idx ON app_users (nickname);
CREATE INDEX IF NOT EXISTS app_users_role_idx     ON app_users (role);

-- ---- 邀请码表：普通用户凭码升级为 premium ----
CREATE TABLE IF NOT EXISTS invite_codes (
  id         serial PRIMARY KEY,
  code       varchar(50) NOT NULL UNIQUE,
  label      varchar(100),                          -- 后台备注
  max_uses   integer DEFAULT 1,                     -- NULL = 不限次
  used_count integer NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true,
  created_by varchar(50),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS invite_codes_code_idx   ON invite_codes (code);
CREATE INDEX IF NOT EXISTS invite_codes_active_idx ON invite_codes (is_active);

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

-- ---- 可选：健康检查表（schema.ts 中定义，代码未使用） ----
CREATE TABLE IF NOT EXISTS health_check (
  id         serial PRIMARY KEY,
  updated_at timestamptz DEFAULT now()
);
