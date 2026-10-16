# API 契约 API.md

> 全部 6 个路由。除 `/api/ai/*` 外均依赖 Supabase（缺 env 时 500）。
> 统一错误格式：`{ "error": "..." }`，成功：`{ "success": true, ... }`。
> 最近实质变更：2026-10-15 注册限流重构——**格式类校验提前到限流之前**（无效输入不消耗限流额度）、
> 429 文案分钟化、弹窗口径修正；2026-10-14 batch10 安全加固（两步验证码找回、登录锁定 10 次锁 30 分钟、
> token_version 踢旧会话、密码 ≥8）；2026-10-14 新增 update_avatar / update_contact / 反馈路由。

## POST /api/auth

注册、登录与账号维护，单入口多 action。服务端 bcrypt(cost=10，SALT 12、存量透明重哈希) 校验，写 `access_logs`。

`NEXT_PUBLIC_REGISTRATION_OPEN=false` 时 `action: register` 返回 403，登录不受影响。

```jsonc
// 请求（按 action 分发）
{ "action": "register", "nickname": "string(≤50)", "password": "string(≥8)",
  "email"?: "string", "phone"?: "string" }        // 联系方式至少一项，用于日后找回密码
{ "action": "login",    "nickname": "...", "password": "..." }
{ "action": "update_password",   /* 需会话 */ "old_password": "...", "new_password": "..." }
{ "action": "reset_password_info", "nickname": "...", "email"?: "...", "phone"?: "..." }
     // 第一步：匹配注册信息 → 服务端直发验证码（明文邮箱不出服务端），2026-10-14 前「匹配即重置」已废除（接管漏洞）
{ "action": "reset_password_email", "nickname": "...", "code": "6位", "new_password": "..." }
     // 第二步：输码改密；仅手机号账号返回 contact_admin（短信链路未接）
{ "action": "update_contact",    /* 需会话 */ "email"?: "...", "phone"?: "..." }
{ "action": "update_avatar",     /* 需会话 */ "avatar": "emoji" }        // 2026-10-14 batch11 新增
// 以下 action 代码保留、UI 封存休眠（无域名无法真发信，等接入 Resend 后解封）：
// send_email_code / verify_email_code / reset_email_password
```

**限流（2026-10-15 重构）**：按 IP 每分钟桶，登录+注册共用 10 次 / 5 分钟（本地部署 getClientIp 固定 'local'，代理头不可信）。
**顺序：结构/格式校验（昵称密码、注册联系方式存在性+格式）→ 限流 → 数据库校验**——
无效格式请求不查库、不消耗限流额度；429 文案超过 60 秒显示「约 X 分钟」。
数据库不可达时：生产 fail-closed（30 秒重试提示）、开发 fail-open（放行+警告）。

| 场景 | 响应 |
|---|---|
| 成功 | `{ success: true, user: { id, nickname, avatar, role, created_at }, token: "<会话令牌>" }`（**不含 password_hash**） |
| 注册：联系方式缺失/格式错误 | 400（**不扣限流额度**，2026-10-15 起） |
| 注册：邮箱或手机号已被其他账号使用 | 409 |
| 昵称已注册 | 409 |
| 昵称未注册 | 404 |
| 密码错误 | 401 |
| **连续失败 ≥10 次** | **423**，锁定 30 分钟（`locked_until`，成功登录清零；batch10 新增） |
| 账号被禁用（is_active=false） | 403 |
| 触发限流 | 429 |

登录成功会更新 `last_login_at` 并清零失败计数。改密成功后旧会话全部失效（token_version 机制，见下）。

### 会话令牌 `token`
由 `src/lib/session.ts` 签发，格式 `<base64url(payload)>.<base64url(hmac-sha256)>`，
载荷 `{ userId, nickname, role, exp, ver }`，有效期 **7 天**。

- **是签名不是加密**：payload 可被 base64 解开，别往里放敏感信息。
- 受保护接口用 `Authorization: Bearer <token>`（也接受 `x-session-token` 头）。
- 令牌无效/过期/被篡改 → 401。role 变更后需重新签发（兑换邀请码时服务端会自动发新的）。
- **ver（token_version，batch10 新增）**：改密/禁用会使旧令牌全部失效——
  服务端逐请求比对库内 token_version（异常 fail-open）。旧令牌无 ver 字段按 0 兼容存量登录。
- 签名密钥取 `SESSION_SECRET`，未设则回退 `DEV_PASSWORD`；
  **生产环境两者都没配会拒绝签发**（避免静默使用不安全默认值）。

## POST /api/invite

授权码兑换，**按码类型分发**（2026-10-13 batch9 三类码）：`access`=使用权（normal→premium，不加额度）/
`ai`=纯 AI 额度（只加额度，角色不变）/ `bundle`=套餐（升级 + 到账 `ai_credits` 额度，兼容全部历史码）。
**2026-10-14 起（open 模式）仅 `ai` 码有充值意义**（注册即送 50 次，登录即全功能）；
access/bundle 语义仅在 legacy 模式（`NEXT_PUBLIC_BUSINESS_MODE=legacy`）下生效。

**需要会话**（2026-09-27 修复，原为完全无鉴权，见 KNOWN-ISSUES #7）。

```jsonc
// 请求头
Authorization: Bearer <token>       // 或 x-session-token: <token>
// 请求体
{ "code": "LR-XXXXXX" }             // userId 不再由客户端自报，取会话令牌里的
// 成功（2026-10-13 起新增 kind/grantedAccess/grantedCredits，前端按类型给到账提示）
{ "success": true, "role": "premium", "credits": 200, "kind": "bundle",
  "grantedAccess": true, "grantedCredits": 200, "token": "<新令牌>" }
```

| 状态码 | 含义 |
|---|---|
| 400 | 缺 code / 码已过期 / 码已用完 |
| 401 | 会话令牌缺失、无效或已过期 |
| 403 | 账号被禁用（is_active=false） |
| 404 | 授权码无效 / 用户不存在 |
| 409 | 并发下名额刚被抢走（乐观锁未抢到），可重试 |
| 429 | 同 IP 15 分钟内失败 ≥10 次，触发限流 |

校验顺序：会话 → 码存在且激活 → 未过期 → 未用完 → 用户存在且激活
→ **乐观锁占位** `used_count`（`.eq("used_count", 读到的值)`，防并发超发）→ 按 kind 升级/到账
→ 写 access_logs + ai_credit_logs（仅额度到账时）→ 重新签发令牌。升级失败会把名额还回去。
**kind 列缺失（batch9 迁移未执行）时自动降级为 bundle 语义**，兑换链路不挂。

## GET /api/admin

需请求头 `x-dev-token: <会话令牌>`（= `sha256("lrs-dev-session:" + DEV_PASSWORD + ":" + UTC日期)`，
**2026-10-02 起按 UTC 日期桶轮换，等效 24-48h 有效期**；服务端校验接受今天与昨天两个桶，
过期后 GET 返回 401，由 /admin 页回退到重新验证界面）。`?type=`：

| type | 返回 |
|---|---|
| `users`（默认） | app_users 全字段（除 password_hash），**含 ai_credits**，按创建时间倒序，上限 500 |
| `invites` | invite_codes 全部，上限 500 |
| `logs` | access_logs 联表 nickname，上限 200 |
| `stats` | `{ totalUsers, totalInvites, premiumUsers, activeUsers }` |

## POST /api/admin

| action | 鉴权 | 说明 |
|---|---|---|
| `verify` | ❌ 无（凭 body.password） | 密码正确 → `{ success, token: <日期桶哈希会话令牌>, user? }`；若带 userId 且非 developer 则**直接升为 developer**。2026-09-26 起不再回传明文密码；2026-10-02 起令牌按日轮换 |
| `exit_developer` | ✅（2026-09-26 收紧） | 需 x-dev-token；降级为 premium（有邀请码）或 normal |
| `create_invite` | ✅ | `{ code, label?, maxUses?, expiresInDays?, aiCredits?, kind? }`（`kind`: access/ai/bundle 默认 bundle；aiCredits = 该码含 AI 次数 0-10 万；**access 带额度 400 拒发、ai 额度必须 ≥1**；后台 UI 默认套餐+200） |
| `batch_invite` | ✅ | `{ count≤50, prefix?, maxUses?, expiresInDays?, aiCredits?, kind? }` → 生成 `PREFIX-XXXXXX`（kind 约束同上） |
| `update_user` | ✅ | `{ userId, role?, isActive? }`（role 白名单：normal/premium/developer，2026-09-26 起校验） |
| `delete_invite` | ✅ | `{ inviteId }` |
| `toggle_invite` | ✅ | `{ inviteId, isActive }` |

## POST /api/ai/analyze

SSE 流式。默认用服务端 env 的内置 AI；**2026-09-26 起接收客户端自带 AI 源**
`ai` 字段（前端 AIAnalysisPanel 从 localStorage 自动携带，见 `src/lib/active-ai-client.ts`）：

```jsonc
// 请求（2026-10-03 起 6 个前端面板均自动携带 Authorization: Bearer <会话令牌>）
{
  "module": "window|luck|luck_breakthrough|luck_radar|luck_defense|luck_action|career|destiny|simulation",
  "item": "当前选中条目的标题+描述文本（服务端截断 ≤6000 字）",
  "question": "可选；追问文本（服务端截断 ≤2000 字）",
  "history": [{ "role": "user|assistant", "content": "..." }],   // 可选；只留最近 12 条、单条 ≤4000 字，role 白名单
  "ai": {                                                         // 可选，用户自带 AI 源
    "provider": "builtin|custom",
    "protocol": "openai|claude|gemini|minimax",                   // custom 时必填
    "baseUrl": "https://...",                                     // custom 时必填
    "apiKey": "用户自己的 Key",                                    // custom 时必填
    "model": "模型 id"                                            // custom 时必填
  }
}
// 响应流（text/event-stream）
data: {"reasoning": "..."}   // 推理模型思维链增量（2026-10-02 起，可能大量出现）
data: {"content": "..."}     // 若干条
data: [DONE]
data: {"error": "..."}       // 失败时
```

- **额度门（2026-10-03，2026-10-13 加使用权前置）**：`ai` 缺省或 `provider: "builtin"`（内置 AI = 服务端付费 Key）→
  **要求会话**：无令牌 401；**role=normal 返回 403**（AI 使用前提 = 使用权 + 额度，文案引导去「我的」兑使用权/套餐码）；
  `ai_credits < 1` 返回 **402**（文案引导续码或改用自带 Key）；
  扣次用乐观锁，并发冲突 409；`developer` 角色不限次不扣减。
  **自定义源（BYOK）不要求登录、不扣额度**——永久免费通道。
- `ai` 的 provider 既不是 builtin 也不是 custom、或缺 Key / 地址非法 → **400 报错**（不静默回退）。
- 自定义源地址做 **SSRF 基本防护**（2026-10-02）：拦截 169.254/16（云元数据）、0.0.0.0/8、
  fe80::/10 与 `*.internal`；loopback/私有网段有意放行（支持本地模型）。残余风险：DNS rebinding。
- 协议适配（`src/lib/ai-providers.ts` + `ai-stream.ts`）：custom 源按 `protocol` 分流——
  openai → `/chat/completions`、claude → 官方 Messages SSE、gemini → `streamGenerateContent`、minimax → `/chatcompletion_v2`。
  claude / gemini / minimax 三家未经真实 Key 实测（只实测过 openai 协议的中转站）。
- 思维链透传（2026-10-02）：`ai-stream.ts` 把 `delta.reasoning_content` 转成 `{"reasoning"}` 帧，
  前端 `AiThinkingBlock` 实时显示、正文开始后折叠（<AI 中转站> 实测会忽略 `thinking:disabled`）。

## GET /api/ai/credits

查询当前登录用户的 AI 额度（2026-10-03 新增）。**需要会话**。

```jsonc
// 成功
{ "success": true, "credits": 199, "total": 200, "role": "premium" }
// 401 = 无效/过期令牌；404 = 用户不存在
```

`/user` 页邀请码卡片据此展示"AI 余额"；兑换成功后前端自动重查。

## POST /api/ai/test-key

服务端代理测试连通性。只支持两种 `provider`：`builtin`（测服务端 env 是否配好）与 `custom`（测用户填的地址 + Key）。
（2026-09-28 已删除原先写死的 8 家厂商 `PROVIDER_CONFIGS`。）

```jsonc
// 请求
{ "provider": "custom", "protocol": "openai",
  "baseUrl": "https://<AI 中转站>/v1", "apiKey": "sk-...", "model": "<内置模型>" }
// 成功
{ "success": true, "message": "连接成功 · <内置模型>", "responseSnippet": "模型回复前 60 字" }
```

Key 只在内存中转发给目标地址，不落库不落盘，但**会经过服务器进程**。
按 `protocol` 自动拼路径：openai → `/chat/completions`、claude → `/messages`、
gemini → `/models/{model}:generateContent`（2026-10-02 起 Key 走 `x-goog-api-key` 请求头而非 URL 查询串）、
minimax → `/chatcompletion_v2`；超时 30 秒。
地址校验与 analyze 同一套（http/https + SSRF 高危内网拦截）。

## 自定义 AI 接入源（2026-09-28 新增）

（2026-09-28）项目原本写死了 8 家厂商的官方域名 + 模型列表，已全部删除：
一是官方域名 + 第三方中转站 Key 必然鉴权失败（实测报"令牌已过期或验证不正确"），
二是硬编码的模型 id 早已过期。现在统一改成用户自定义源：**地址、密钥、模型全由用户填**。

### 数据存在浏览器（localStorage）

```jsonc
// key: ai-sources（数组）
{
  "id": "src_m3x9k2_a1b2c3",
  "name": "我的中转站 · <上游厂商>",
  "protocol": "openai",          // openai | claude | gemini | minimax
  "baseUrl": "https://<AI 中转站>/v1",
  "apiKey": "sk-...",
  "model": "<内置模型>",
  "enabled": true,
  "createdAt": 1790563055000,
  "lastTest": { "ok": true, "at": 1790563100000, "message": "..." }
}
```

- `api-active-source` 存当前使用的源 id（`'builtin'` / `src_xxx`）
- `/user` 页「AI 模型管理」底部提供：添加 / 编辑 / 启用停用 / 测试 / 删除 / 导入 / 导出

### 实际分析

```jsonc
POST /api/ai/analyze
{ "module": "window", "item": "25-28岁 人脉质变期",
  "ai": { "provider": "custom", "protocol": "openai",
          "baseUrl": "https://<AI 中转站>/v1", "apiKey": "sk-...", "model": "<内置模型>" } }
```

服务端校验：`baseUrl` 必须以 `http://` 或 `https://` 开头（挡 `javascript:` 等）、长度 ≤500；
`apiKey` 非空且 ≤1000；`protocol` 不在四种之内时按 openai 处理。不合规返回 400。

**实测**：中转站 + <内置模型>，测连通 3.4 秒，analyze 出 1703 字正文，全部正常。
