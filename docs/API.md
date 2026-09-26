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
| 成功 | `{ success: true, user: { id, nickname, avatar, role, created_at } }`（**不含 password_hash**） |
| 昵称已注册 | 409 |
| 昵称未注册 | 404 |
| 密码错误 | 401 |
| 账号被禁用（is_active=false） | 403 |

注意：注册无验证码/频率限制；登录成功会更新 `last_login_at`。

## POST /api/invite

邀请码兑换，`normal → premium`。**无任何鉴权，userId 由客户端自报**（见 KNOWN-ISSUES #7）。

```jsonc
// 请求
{ "userId": 123, "code": "LR-XXXXXX" }
// 成功
{ "success": true, "role": "premium" }
```

校验顺序：码存在且激活 → 未过期 → 未用完（max_uses/used_count）→ 用户存在且还是 normal。
成功后：user.role=premium、user.invite_code_used=code、invite.used_count+1（读后写，非原子，并发可超发）。

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
