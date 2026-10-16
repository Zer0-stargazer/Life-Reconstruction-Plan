-- batch9：授权码拆分为「使用权 / AI 额度 / 套餐」三类（2026-10-13）
--
-- 商业模型调整：
--   access  = 使用权码：解锁全站功能（详情弹层 / AI 入口 / 报告生成），不加 AI 额度
--   ai      = AI 额度码：只充值 AI 额度，不改变角色（没有使用权的用户额度到账但暂不能用 AI）
--   bundle  = 套餐码：使用权 + AI 额度（推荐，新用户必买），等价于旧版行为
--
-- 旧码兼容：kind 默认 'bundle'，历史码语义不变（升级 premium + 加额度）。

ALTER TABLE invite_codes
  ADD COLUMN IF NOT EXISTS kind varchar(16) NOT NULL DEFAULT 'bundle';

ALTER TABLE invite_codes
  DROP CONSTRAINT IF EXISTS invite_codes_kind_check;

ALTER TABLE invite_codes
  ADD CONSTRAINT invite_codes_kind_check
  CHECK (kind IN ('access', 'ai', 'bundle'));

COMMENT ON COLUMN invite_codes.kind IS
  '码类型：access=使用权（仅升级 premium）/ ai=AI额度（仅加额度）/ bundle=套餐（升级+加额度，默认）';
