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
        └─ role=developer，服务端返回 token=DEV_PASSWORD，前端存 localStorage("dev-token")

ModuleGate 组件在 4 个 🔒 页面包裹内容：/destiny /laws /simulation /luck
   └─ 判断依据是客户端 localStorage 里的 user.role（可篡改，见 KNOWN-ISSUES）
```

注意一个**有意为之的设计**（`module-gate.tsx` 第 12 行）：
未登录用户 `!user` 直接放行内容——即"未登录 = 免费体验全部模块"，登录了反而受 normal 限制。
与产品文案"普通用户 3/7 模块"自相矛盾，见 KNOWN-ISSUES #4。

## AI 链路

1. 页面打开 `AIAnalysisPanel` → 自动 POST `/api/ai/analyze` `{module, item, question?, history?}`
2. 路由按 `module` 挑选内置分析框架 prompt（8 套，见 route.ts 的 `MODULE_PROMPTS`）
3. `src/lib/ai-stream.ts` 用 fetch 调 OpenAI-compatible `/chat/completions`（stream:true）
4. 服务端把 delta 转成 SSE `data: {content}` / `data: [DONE]`，前端逐块渲染
5. 追问时携带完整 history，走续聊分支

**服务端 key 来源**：只有 env（`AI_API_URL/AI_API_KEY/AI_MODEL`，默认火山方舟豆包）。
用户在 `/user` 页配置的 8 厂商 Key 只存 localStorage 并仅用于 `/api/ai/test-key` 连通性测试，
**不会**传给 analyze——"自定义 Key 参与 AI 分析"是断的，见 KNOWN-ISSUES #3。

`/api/ai/test-key` 是服务端代理：浏览器把 Key POST 给本路由，路由替用户请求厂商（Gemini / Claude / DeepSeek 等 8 家），Key 不落盘但会经过服务器。

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
