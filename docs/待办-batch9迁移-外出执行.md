# 待办：batch9 迁移执行（外出用）

> 生成于 2026-10-13 · **✅ 已完成（2026-10-13 当天用户在 Supabase Dashboard 执行，E2E 12/12 全绿）**——
> 本备忘仅存档，当前迁移状态以 [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) 与 [DATABASE.md](DATABASE.md) 为准；
> 现存待执行的迁移是 batch10（RLS）与 batch12（反馈表），见 DATABASE.md 批次表。
> **只需要浏览器 + Supabase 账号**，不需要项目文件、不需要本机环境。
> 做完这份文档即可删除。

---

## 背景（30 秒了解）

人生沙盘权限 v3 要把授权码分三类：

| 类型 | 含义 | 兑换效果 |
|---|---|---|
| `access` | **使用权码** | 解锁全部功能（详情/AI/报告），不加 AI 额度 |
| `ai` | **纯 AI 额度码** | 只充值 AI 额度，不升级角色 |
| `bundle` | **套餐码**（默认） | 使用权 + 额度都含，新用户推荐；老码全部是这个语义 |

代码已全部写好；数据库 `invite_codes` 表还差一个 `kind` 列。执行下面 SQL 即完成。

---

## 执行步骤（约 2 分钟）

1. 浏览器打开 **https://supabase.com/dashboard** 并登录
2. 选择「人生沙盘」对应的项目
3. 左侧菜单 → **SQL Editor** → **New query**
4. 把下面整段 SQL 粘贴进去（一个字不用改），点 **Run**
5. 结果栏显示 **Success. No rows returned** 即成功
   （幂等脚本：重复执行也安全，不会动任何已有数据）

```sql
-- batch9：授权码拆分为「使用权 / AI 额度 / 套餐」三类（2026-10-13）

ALTER TABLE invite_codes
  ADD COLUMN IF NOT EXISTS kind varchar(16) NOT NULL DEFAULT 'bundle';

ALTER TABLE invite_codes
  DROP CONSTRAINT IF EXISTS invite_codes_kind_check;

ALTER TABLE invite_codes
  ADD CONSTRAINT invite_codes_kind_check
  CHECK (kind IN ('access', 'ai', 'bundle'));

COMMENT ON COLUMN invite_codes.kind IS
  '码类型：access=使用权（仅升级 premium）/ ai=AI额度（仅加额度）/ bundle=套餐（升级+加额度，默认）';
```

6. （可选验证）再开一条 query 跑：

```sql
SELECT code, kind FROM invite_codes LIMIT 5;
```

不报错、能看到 `kind` 列即成功。

---

## 做完之后

- **不用重启任何服务**：服务端读数据库是实时的，本机 / 线上都直接生效
- 后台 `/admin` 发码时会出现「套餐 / 使用权 / 纯 AI 额度」三选一；选「使用权」会自动隐藏额度输入
- 回到本机后（可选）：项目里跑 `.tmp/e2e-code-kind.mjs`（需 dev server 开着），
  会从「降级模式」自动切到「精确语义」全绿

## 不做会怎样

**不会挂**：服务端检测到 `kind` 列缺失时会自动按 `bundle`（套餐）旧语义降级，
发码、兑换、升级一切正常。只是「使用权码 / 纯额度码」两类区分不生效。

---

## 附：相关文件在项目里的位置

- SQL 源文件（与本文件内容一致）：`supabase/migrations/2026-10-13-batch9-code-kind.sql`
- 便捷副本：`.tmp/run-batch9.sql`
- 详细开发记录：`docs/DEVLOG.md` → 「2026-10-13 · 权限模型 v3」一节
