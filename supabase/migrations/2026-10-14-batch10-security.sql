-- batch10-security：安全加固迁移（2026-10-14）
-- 在 Supabase Dashboard → SQL Editor 执行一次即可

-- 1) user_state 启用 RLS（P1-1 修复：全库最后一张未开 RLS 的表）。
--    该表只有服务端（service_role，绕过 RLS）读写，前端不直连，
--    因此启用后策略留空 = 拒绝所有 anon/authenticated 直连访问。
alter table public.user_state enable row level security;
