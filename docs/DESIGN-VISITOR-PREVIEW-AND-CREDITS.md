# 设计稿：访客预览态 + AI 额度制

> 2026-10-02 起草，**待确认后实施**。两项共用一套权限/计费地基，一起评审。

## 一、访客预览模型（替代"整页锁死"）

### 现状问题
`canAccessModule()` 测试期恒返回 true（见 ROADMAP 回滚清单）；原权限模型是"normal 只能看 3 个模块，其余整页锁死"。产品决定：**访客也应该能逛**，锁定点收窄到真正的价值动作上。

### 三档身份

| 身份 | 能看 | 不能 |
|---|---|---|
| 访客（未登录） | 全部 8 个入口的**列表与摘要**：卡片、分类、计数、快看组、筛选搜索全部可逛 | ① 每条目的**详情弹层** ② **AI 分析/对话**按钮 ③ simulation 问卷结果与 destiny 报告生成 |
| 持码用户（兑换授权码 → premium） | 一切 | —（AI 按额度计次，见下） |
| 开发者 | 一切 + 后台 | — |

设计原则一句话：**列表是"逛"的体验，决定第一印象，全放开；详情 + AI 是付费点，锁这里。**

### 实现路径（预计 1 个工作日）
1. `canAccessModule()` 恢复按角色判断（按 ROADMAP 回滚清单），新增 `canPreviewModule()`（恒 true，表达"可逛"）。
2. `ModuleGate` 加 `mode="preview"`：未解锁时不再渲染整页 403，而是**正常渲染列表 + 底部/顶部解锁引导条**（"输入授权码解锁全部内容"）。
3. 抽 `useLockedAction()` hook：详情弹层、AI 按钮、报告生成统一走它——未解锁时弹统一的解锁引导（登录 → 兑换码），已解锁直接放行。7 个模块各接一次，改的都是触发点，不动内容本身。
4. `/admin` 批量建码已有（batch_invite），补一个"发码指引"文案（加好友/邮件领取）。

## 二、AI 额度制（授权码 = 含 AI 次数）

### 结论先行
起步期**不做支付、不做充值**：授权码自带 AI 额度（如每个码 200 次），兑换即到账，用完找管理员续码。用户自带 Key（自定义接入源）**永久不扣额度**——BYOK 免费保留，本身就是传播点。

### 表结构（Supabase，增量迁移）

```sql
-- 用户表：剩余额度 + 累计已充（展示用）
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS ai_credits INTEGER NOT NULL DEFAULT 0;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS ai_credits_total INTEGER NOT NULL DEFAULT 0;

-- 额度流水：审计与对账，每一笔增减都留痕
CREATE TABLE IF NOT EXISTS ai_credit_logs (
  id         serial PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES app_users(id),
  delta      INTEGER NOT NULL,              -- +N 到账 / -1 消耗
  reason     VARCHAR(100) NOT NULL,         -- redeem_code / analyze / admin_grant
  balance    INTEGER NOT NULL,              -- 变动后余额（对账用）
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_credit_logs_user_idx ON ai_credit_logs (user_id);

-- 邀请码表：每个码自带多少 AI 次数
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS ai_credits INTEGER NOT NULL DEFAULT 0;
```

### 关键机制
- **扣减防并发透支**：与邀请码同款乐观锁——`UPDATE app_users SET ai_credits = n-1 WHERE id = ? AND ai_credits = n`，写不进去说明并发扣过了，返回 409。
- **扣减时机**：`/api/ai/analyze` 开工前先扣（失败不退，与行业惯例一致）；同时该接口**补上会话校验**（上线前收口项顺带完成），未登录调不通。
- **额度不足的返回**：SSE 内返回明确错误文案"AI 额度已用完，请续码"，前端透出——不是 500。
- **/user 页**：显示"剩余 N 次"；/admin 用户表加余额列。
- **成本模型示例**：授权码 ¥99 含 200 次 → 单次 ¥0.5；用户自购 API Key 的注册/充值门槛远高于此，这就是"码"的附加价值。

### 实现路径（预计 1 个工作日）
1. schema.sql 追加上述迁移 + docs/DATABASE.md 同步。
2. /admin 建码表单加"AI 次数"字段（默认 200）。
3. /api/invite 兑换事务内到账额度 + 流水。
4. /api/ai/analyze 接会话 + 乐观锁扣减；6 个前端面板透出"额度用完"错误。
5. /user 页余额展示。

### 明确不做（起步期）
- 在线支付/充值（等有真实付费用户再说）
- 按 token 计费（按"次"计，用户心智简单，成本可控——单次分析 max_tokens 上限 4096）
- 免费模型兜底（中转站不稳定 + 推理模型体验差，见 2026-10-02 实测记录）
