# 架构 ARCHITECTURE.md

> 描述 2026-09-25 时点的真实代码状态（已逐一核对源码，非设计稿）。

## 总体形态

单体 Next.js 16 App Router 全栈应用：

- **页面层**：`src/app/**/page.tsx`，全部 `'use client'`（无服务端组件取数，纯客户端渲染）
- **API 层**：`src/app/api/**/route.ts`，5 个路由，全部无状态、直连 Supabase
- **数据层**：静态数据 `src/data/`（约 2.1MB TypeScript 数组，构建时打包进 bundle）+ Supabase（仅用户体系）
- **状态层**：无全局状态库，靠 React Context（认证）+ localStorage（用户偏好/进度/Key）

```
浏览器
 ├── 页面（client components）
 │     ├── 静态数据直接 import（careers/windows/luck/laws 打进 bundle）
 │     └── ModuleGate / ModuleVisitTracker / AIAnalysisPanel
 ├── fetch /api/auth|invite|admin ──► Next API Route ──► Supabase (@supabase/supabase-js)
 └── fetch /api/ai/analyze (SSE) ──► Next API Route ──► 火山方舟 / OpenAI-compatible（服务端流式转发）
```

## 权限链路

```
注册/登录 (POST /api/auth)
   └─► app_users.role ∈ {normal, premium, developer}
   └─► 前端把 user JSON 存 localStorage("auth-user")   ← ⚠ 无服务端会话，见 KNOWN-ISSUES

normal（3 模块：/name /career /windows）
   └─ /user 页输入邀请码 → POST /api/invite
        └─ 校验 invite_codes（有效期/次数/激活）→ role=premium

premium（全模块）
   └─ /admin 输入 DEV_PASSWORD → POST /api/admin {action:"verify"}
        └─ role=developer，服务端返回 token=sha256("lrs-dev-session:"+DEV_PASSWORD)
           前端存 localStorage("dev-token")，后续请求带 x-dev-token
           （2026-09-26 起不再回传明文密码；旧浏览器存的明文 token 会失效，需重新验证一次）

ModuleGate 组件在 4 个 🔒 页面包裹内容：/destiny /laws /simulation /luck
   └─ 前端门控看 localStorage 里的 user.role（仅作界面展示，可被篡改）
      服务端侧的权限依据：登录/注册签发的 HMAC 会话令牌（src/lib/session.ts）
```

## 会话机制（2026-09-27 新增）

```
登录/注册 → /api/auth 签发 token = base64url(payload) + "." + HMAC-SHA256
            payload = { userId, nickname, role, exp }  有效期 7 天
            → 前端存 localStorage("auth-token")

受保护接口（目前 /api/invite）→ Authorization: Bearer <token>
            → 服务端 sessionFromRequest() 校验签名与过期，userId 以令牌为准
```

签名密钥取 `SESSION_SECRET`，未设则回退 `DEV_PASSWORD`，生产环境两者都缺则拒绝签发。
用户对象本身仍存 localStorage，但**只用于界面展示**——权限判定的唯一权威是服务端令牌。

> ⚠️ 待决策：未登录策略仍自相矛盾（`module-gate.tsx` 的 `!user ||` 放行 vs
> `auth-context.tsx` 的 `if (!user) return false`），见 KNOWN-ISSUES #4。

## AI 链路

1. 页面打开 `AIAnalysisPanel` → 自动 POST `/api/ai/analyze` `{module, item, question?, history?}`
2. 路由按 `module` 挑选内置分析框架 prompt（8 套，见 route.ts 的 `MODULE_PROMPTS`）
3. `src/lib/ai-stream.ts` 用 fetch 调 OpenAI-compatible `/chat/completions`（stream:true）
4. 服务端把 delta 转成 SSE `data: {content}` / `data: [DONE]`，前端逐块渲染
5. 追问时携带完整 history，走续聊分支

**AI 来源只有两种**（2026-09-28 简化，原写死的 8 家厂商预设已删除）：

| 来源 | provider | 配置位置 | 说明 |
|---|---|---|---|
| 内置 AI | `builtin` / 缺省 | 服务端 env（`AI_API_URL/AI_API_KEY/AI_MODEL`，三项缺一即报未配置） | 模型由 `AI_MODEL` 决定，前端改不了 |
| 自定义源 | `custom` | `/user` 页，localStorage `ai-sources` | 用户自己填 baseUrl + protocol + key + model |

**用户自带 key**（2026-09-26 已接通，见 KNOWN-ISSUES #3）：`AIAnalysisPanel` 每次请求携带当前选中的 AI 源
`ai: { provider, protocol, baseUrl, apiKey, model }`，`analyze` 路由用 `resolveAiSource()` 解析后
按 protocol 自动选协议（openai → `/chat/completions`；claude / gemini / minimax 走各自的 SSE 适配）。
配置无效返回 400，不静默回退到 env key。

`/api/ai/test-key` 是服务端代理：浏览器把 Key POST 给本路由，路由替用户请求目标地址，Key 不落盘但会经过服务器。

## 数据流（用户偏好）

`use-advanced-settings.ts` 管理 3 组 localStorage：

| key | 内容 | 消费方 |
|---|---|---|
| `default-age` | 默认年龄（数字） | destiny / simulation / windows |
| `life-stages` | 7 个人生阶段（可调起止年龄） | windows（按年龄过滤） |
| `preference-weights` | 6 维偏好权重（健康/财富/事业/关系/成长/自由） | destiny / simulation（weightMap） |

> 注：AGENTS.md 旧版写"高级设置数据未被其他模块消费"，**已过时**——destiny/windows/simulation 三个页面都在消费。

## 构建与运行

- dev/start 走 `next dev -p 5000` / `next start -p 5000`（package.json scripts）
- `src/server.ts` 自定义 HTTP server 入口（曾未被引用）——**2026-09-26 已删除**
- `scripts/*.sh` 供扣子 `.coze` 配置调用；本地直接用 pnpm scripts 即可
- 静态数据约 2.1MB 全部打进 client bundle（careers.ts 1.1MB），首屏性能受此影响

## 主题系统

- shadcn 语义变量（`globals.css`），亮/暗双模式（next-themes）
- 琥珀金 `#b8860b` 为 primary；禁止蓝紫渐变、AI 味荧光色（AGENTS.md 约定）
- 自定义动画类：`fade-in-up` / `scale-in` / `glow-pulse` / `card-hover` / `progress-shimmer` / `btn-press`
- JSX 中文引号规范：`&quot;` 或中文引号（避免 ESLint react/no-unescaped-entities）
