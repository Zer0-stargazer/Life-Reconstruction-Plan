-- ============================================================
-- batch8 · 用户数据云同步
-- 日期：2026-10-13
--
-- 背景：此前用户的模块内数据（确定的名字、窗口三态标记、人生阶段、
-- 六维权重、模块访问记录、AI 接入源等）全部存浏览器 localStorage，
-- 换设备/清缓存即丢。本表让登录用户的数据跟账号走。
--
-- 同步范围（key 白名单在服务端与客户端各有一份，见 lib/user-state-sync.ts）：
--   default-age / life-stages / preference-weights / visited-modules /
--   window-marks.v1 / ai-sources / api-active-source
--
-- 不入云（有意排除）：auth-token / auth-user / dev-token（会话凭证）、
--   free-preview（访客防滥用计数，属设备行为）。
-- ============================================================

create table if not exists user_state (
  id          bigint generated always as identity primary key,
  user_id     integer      not null references app_users (id),
  key         varchar(100) not null,
  value       jsonb        not null,
  updated_at  timestamptz  not null default now(),
  unique (user_id, key)
);

create index if not exists idx_user_state_user on user_state (user_id);
