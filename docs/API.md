# API 契约 API.md

> 全部 5 个路由。除 `/api/ai/*` 外均依赖 Supabase（缺 env 时 500）。
> 统一错误格式：`{ "error": "..." }`，成功：`{ "success": true, ... }`。

## POST /api/auth

注册或登录。服务端 bcrypt(cost=10) 校验，写 `access_logs`。

```jsonc
// 请求
{ "action": "register" | "login", "nickname": "string(≤50)", "password": "string(≥4)" }
```

| 场景 | 响应 |
|---|---|
| 成功 | `{ success: true, user: { id, nickname, avatar, role, created_at }, token: "<会话令牌>" }`（**不含 password_hash**） |
| 昵称已注册 | 409 |
| 昵称未注册 | 404 |
| 密码错误 | 401 |
| 账号被禁用（is_active=false） | 403 |

注意：注册无验证码/频率限制；登录成功会更新 `last_login_at`。

### 会话令牌 `token`
由 `src/lib/session.ts` 签发，格式 `<base64url(payload)>.<base64url(hmac-sha256)>`，
载荷 `{ userId, nickname, role, exp }`，有效期 **7 天**。

- **是签名不是加密**：payload 可被 base64 解开，别往里放敏感信息。
- 受保护接口用 `Authorization: Bearer <token>`（也接受 `x-session-token` 头）。
- 令牌无效/过期/被篡改 → 401。role 变更后需重新签发（兑换邀请码时服务端会自动发新的）。
- 签名密钥取 `SESSION_SECRET`，未设则回退 `DEV_PASSWORD`；
  **生产环境两者都没配会拒绝签发**（避免静默使用不安全默认值）。

## POST /api/invite

邀请码兑换，`normal → premium`。

**需要会话**（2026-09-27 修复，原为完全无鉴权，见 KNOWN-ISSUES #7）。

```jsonc
// 请求头
Authorization: Bearer <token>       // 或 x-session-token: <token>
// 请求体
{ "code": "LR-XXXXXX" }             // userId 不再由客户端自报，取会话令牌里的
// 成功
{ "success": true, "role": "premium", "token": "<新令牌>" }  // role 变了，令牌重新签发
```

| 状态码 | 含义 |
|---|---|
| 400 | 缺 code / 码已过期 / 码已用完 / 已是 premium 或 developer |
| 401 | 会话令牌缺失、无效或已过期 |
| 403 | 账号被禁用（is_active=false） |
| 404 | 邀请码无效 / 用户不存在 |
| 409 | 并发下名额刚被抢走（乐观锁未抢到），可重试 |
| 429 | 同 IP 15 分钟内失败 ≥10 次，触发限流 |

校验顺序：会话 → 码存在且激活 → 未过期 → 未用完 → 用户存在、激活且还是 normal
→ **乐观锁占位** `used_count`（`.eq("used_count", 读到的值)`，防并发超发）→ 升级用户
→ 写 access_logs → 重新签发令牌。升级失败会把名额还回去。

## GET /api/admin

需请求头 `x-dev-token: <会话令牌>`（= `sha256("lrs-dev-session:" + DEV_PASSWORD)`，2026-09-26 起不再使用明文密码）。`?type=`：

| type | 返回 |
|---|---|
| `users`（默认） | app_users 全字段（除 password_hash），按创建时间倒序，上限 500 |
| `invites` | invite_codes 全部，上限 500 |
| `logs` | access_logs 联表 nickname，上限 200 |
| `stats` | `{ totalUsers, totalInvites, premiumUsers, activeUsers }` |

## POST /api/admin

| action | 鉴权 | 说明 |
|---|---|---|
| `verify` | ❌ 无（凭 body.password） | 密码正确 → `{ success, token: <哈希会话令牌>, user? }`；若带 userId 且非 developer 则**直接升为 developer**。2026-09-26 起不再回传明文密码；旧浏览器存的明文 dev-token 会失效，需重新验证 |
| `exit_developer` | ✅（2026-09-26 收紧） | 需 x-dev-token；降级为 premium（有邀请码）或 normal |
| `create_invite` | ✅ | `{ code, label?, maxUses?, expiresInDays? }` |
| `batch_invite` | ✅ | `{ count≤50, prefix?, maxUses?, expiresInDays? }` → 生成 `PREFIX-XXXXXX` |
| `update_user` | ✅ | `{ userId, role?, isActive? }`（role 白名单：normal/premium/developer，2026-09-26 起校验） |
| `delete_invite` | ✅ | `{ inviteId }` |
| `toggle_invite` | ✅ | `{ inviteId, isActive }` |

## POST /api/ai/analyze

SSE 流式。默认用服务端 env 的 AI Key（火山方舟豆包）；**2026-09-26 起接收客户端自带 AI 源**
`ai` 字段（前端 AIAnalysisPanel 从 localStorage 自动携带，见 `src/lib/active-ai-client.ts`）：

```jsonc
// 请求
{
  "module": "window|luck|luck_breakthrough|luck_radar|luck_defense|luck_action|career|destiny|simulation",
  "item": "当前选中条目的标题+描述文本",
  "question": "可选；追问文本",
  "history": [{ "role": "user|assistant", "content": "..." }],   // 可选，续聊
  "ai": {                                                         // 可选，用户自带 AI 源
    "provider": "doubao|glm|qwen|deepseek|mimo|claude|gemini|minimax",
    "apiKey": "用户自己的 Key",
    "model": "模型 id（可选）"
  }
}
// 响应流（text/event-stream）
data: {"content": "..."}     // 若干条
data: [DONE]
data: {"error": "..."}       // 失败时
```

- `ai` 缺省或 `provider: "builtin"` → 走服务端 env；provider 不在白名单或缺 Key → **400 报错**（不静默回退）。
- 协议适配（`src/lib/ai-providers.ts` + `ai-stream.ts`）：doubao/glm/qwen/deepseek/mimo 走 OpenAI 兼容流；
  claude/gemini 走各自私有 SSE；minimax 沿 OpenAI delta 格式——**后三家未经真实 Key 实测**。
- module 不在白名单时回落到 window 框架。首次分析会把内置分析框架 + 条目上下文拼成 user 消息；有 history 时直接把 question 作为 user 消息。
- **自定义接入源**（2026-09-28）：`ai` 支持 `provider: "custom"`，此时必须带
  `baseUrl`（http/https）+ `protocol`（openai|claude|gemini|minimax）+ `apiKey` + `model`，
  服务端按 protocol 选协议、用你给的 baseUrl 发请求。详见下方「自定义 AI 接入源」。

## POST /api/ai/test-key

服务端代理测试用户 API Key。支持 provider：`gemini / claude / deepseek / openai / moonshot / zhipu / qwen / doubao`（8 家，具体见 route.ts `PROVIDER_CONFIGS`）。

```jsonc
// 请求
{ "provider": "deepseek", "apiKey": "sk-...", "model": "deepseek-chat" }
// 成功
{ "success": true, "snippet": "模型回复的前 60 字" }
```

Key 只在内存中转发给厂商，不落库不落盘，但**会经过服务器进程**。
~~该接口与 `/api/ai/analyze` 相互独立~~ → **2026-09-26 起 analyze 已接入同一套 Key**（KNOWN-ISSUES #3 已修）。

## 自定义 AI 接入源（2026-09-28 新增）

内置 8 家厂商写死了官方域名，但现实里很多人用的是**第三方中转站 / 自建网关 / 本地模型**的 Key，
官方域名 + 中转站 Key 必然鉴权失败（实测报"令牌已过期或验证不正确"）。
因此补了一层用户自定义源：**地址、密钥、模型全由用户填**。

### 数据存在浏览器（localStorage）

```jsonc
// key: ai-sources（数组）
{
  "id": "src_m3x9k2_a1b2c3",
  "name": "我的中转站 · GLM",
  "protocol": "openai",          // openai | claude | gemini | minimax
  "baseUrl": "https://api.apikey.fan/v1",
  "apiKey": "sk-...",
  "model": "glm-5.3-flash",
  "enabled": true,
  "createdAt": 1790563055000,
  "lastTest": { "ok": true, "at": 1790563100000, "message": "..." }
}
```

- `api-active-source` 存当前使用的源 id（`'builtin'` / 厂商 id / `src_xxx`）
- `/user` 页「AI 模型管理」底部提供：添加 / 编辑 / 启用停用 / 测试 / 删除 / 导入 / 导出

### 测连通性

```jsonc
POST /api/ai/test-key
{ "provider": "custom", "protocol": "openai",
  "baseUrl": "https://api.apikey.fan/v1", "apiKey": "sk-...", "model": "glm-5.3-flash" }
// 成功
{ "success": true, "message": "连接成功 · glm-5.3-flash", "responseSnippet": "..." }
```

按 `protocol` 自动拼路径：openai → `/chat/completions`、claude → `/messages`、
gemini → `/models/{model}:generateContent?key=...`、minimax → `/chatcompletion_v2`。

### 实际分析

```jsonc
POST /api/ai/analyze
{ "module": "window", "item": "25-28岁 人脉质变期",
  "ai": { "provider": "custom", "protocol": "openai",
          "baseUrl": "https://api.apikey.fan/v1", "apiKey": "sk-...", "model": "glm-5.3-flash" } }
```

服务端校验：`baseUrl` 必须以 `http://` 或 `https://` 开头（挡 `javascript:` 等）、长度 ≤500；
`apiKey` 非空且 ≤1000；`protocol` 不在四种之内时按 openai 处理。不合规返回 400。

**实测**：中转站 + glm-5.3-flash，测连通 3.4 秒，analyze 出 1703 字正文，全部正常。
