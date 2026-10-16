-- 批次 6：账号体系 v2（邮箱验证码 + 手机号绑定 + 个人资料 + 注销）
-- 在 Supabase SQL Editor 中整段执行一次。幂等，可重复执行。
--
--   1. app_users 扩展：邮箱 / 手机号 / 头像 / 资料字段 / 会话版本 / 登录锁定 / 软删除
--   2. 新增 verification_codes：验证码（只存哈希，绝不存明文），phone 通道预留
--   3. 唯一索引：邮箱（大小写归一化）、手机号（含已注销账号，防注销后立刻重注册刷额度）
--
-- 说明：手机号当前只做「绑定」（存号、后台可见），不发短信码——
--       国内短信需企业主体 + ICP 备案 + 签名报备，通道未接。
--       表结构已预留 channel='phone'，接上 provider 即可启用，不用改表。

-- ---- 1. app_users 扩展列 ----
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS email                varchar(120);
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS email_verified       boolean NOT NULL DEFAULT false;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS phone                varchar(20);
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS phone_verified       boolean NOT NULL DEFAULT false;

-- 头像：原 avatar 列只有 varchar(20)（放 emoji），自定义头像走 avatar_url（Storage 公网地址）
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar_url           text;

-- 个人资料
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS gender               varchar(10);
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS birthday             date;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS city                 varchar(50);
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS bio                  varchar(200);

-- 安全：重置密码 / 踢下线时 +1，旧令牌全部失效
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS token_version        integer NOT NULL DEFAULT 0;
-- 安全：登录失败计数与锁定时长（失败 5 次锁 15 分钟）
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS login_failed_count   integer NOT NULL DEFAULT 0;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS locked_until         timestamptz;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS last_login_ip        varchar(45);

-- 昵称限改（30 天一次，防滥用）
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS nickname_changed_at  timestamptz;
-- 注销账号：软删除 + 30 天冷静期（个人信息保护法要求提供注销入口）
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS deleted_at           timestamptz;

-- ---- 2. 验证码表 ----
CREATE TABLE IF NOT EXISTS verification_codes (
  id          bigserial PRIMARY KEY,
  channel     varchar(10)  NOT NULL,              -- email / phone（phone 预留，暂不发码）
  target      varchar(160) NOT NULL,              -- 归一化后的目标：邮箱 lower()、手机号 E.164
  purpose     varchar(20)  NOT NULL,              -- register / login / reset / bind / rebind
  code_hash   varchar(64)  NOT NULL,              -- HMAC-SHA256(验证码)，服务端密钥做盐
  expires_at  timestamptz  NOT NULL,              -- 5 分钟有效
  attempts    integer      NOT NULL DEFAULT 0,    -- 连错 5 次作废
  consumed_at timestamptz,                        -- 已使用（防重放）
  ip_address  varchar(45),
  user_id     integer REFERENCES app_users (id),
  created_at  timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS verification_codes_lookup_idx
  ON verification_codes (channel, target, purpose, created_at DESC);
CREATE INDEX IF NOT EXISTS verification_codes_expires_idx
  ON verification_codes (expires_at);
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;   -- 不建 policy：仅 service role 可访问

-- ---- 3. 唯一性 ----
-- 邮箱：大小写不敏感（lower 归一化后写入，这里再兜一层）
CREATE UNIQUE INDEX IF NOT EXISTS app_users_email_uniq
  ON app_users (lower(email)) WHERE email IS NOT NULL;
-- 手机号：唯一（含已注销账号，避免注销后立刻重注册）
CREATE UNIQUE INDEX IF NOT EXISTS app_users_phone_uniq
  ON app_users (phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS app_users_deleted_idx ON app_users (deleted_at);
