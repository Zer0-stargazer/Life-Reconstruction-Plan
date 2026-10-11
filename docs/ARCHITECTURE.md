# 架构 ARCHITECTURE.md

> 描述 **2026-10-03** 时点的真实代码状态（已逐一核对源码，非设计稿）。
> 最近一次实质变更：2026-10-02/03「商业化落地」——访客预览模型、AI 额度制、SSE 共享解析、思维链透传。

## 总体形态

单体 Next.js 16 App Router 全栈应用：

- **页面层**：`src/app/**/page.tsx`，全部 `'use client'`（无服务端组件取数，纯客户端渲染）
- **API 层**：`src/app/api/**/route.ts`，6 个路由，全部无状态、直连 Supabase
- **数据层**：静态数据 `src/data/`（TypeScript 数组，构建时打包进 bundle）+ Supabase（用户体系与额度）
- **状态层**：无全局状态库，靠 React Context（认证）+ localStorage（用户偏好/进度/Key）

```
浏览器
 ├── 页面（client components）
 │     ├── 静态数据直接 import（careers/windows/luck/laws 打进 bundle）
 │     ├── useLockedAction().guard(action)  ──┐ 预览态拦截：详情/AI/报告生成
 │     └── ModuleGate / PreviewBanner / UnlockDialog
 ├── fetch /api/auth|invite|admin|ai/credits ──► Next API Route ──► Supabase (@supabase/supabase-js)
 └── fetch /api/ai/analyze (SSE，带会话头) ──► Next API Route ──► 额度门 ──► 中转站 / OpenAI-compatible（流式转发）
```

## 信息架构（2026-09-30 重做）

以前模块的编号/图标/配色散落在首页、侧栏、各页头部，加一个模块要改四五处；且每个模块页
是"信息孤岛"，看完一个不知道下一个该看什么。现在收敛为三个件：

```
src/lib/module-identity.ts          ← 唯一真源
  MODULE_IDENTITIES[7]  { tag, href, title, question, desc, metric, unit,
                          icon, iconGradient, ring, tagColor }
  TIMELINE_IDENTITY     { href:'/me', tag:'★', note:'TIMELINE', title, question, ... }
        │
        ├─► 首页 Hero 的「MAP · 01–08」索引 + 8 张导览卡
        ├─► app-sidebar.tsx 侧栏顺序
        ├─► components/shared/module-next-nav.tsx 页尾「上一步 / 下一步」
        └─► components/shared/module-page-head.tsx 八个模块页的页头
              （编号/图标/配色/question 自动取；页面仍自定义 H1、描述、
               右侧 aside 插槽、下方 children）

src/components/shared/reveal.tsx     ← 滚动进场包裹件（IntersectionObserver）
        └─► 首页 / /me / /laws / /career / /windows / /luck

src/components/shared/ai-markdown.tsx ← AI 输出的 Markdown 轻量渲染器
        └─► /destiny /laws /luck /simulation /windows
```

**页面里没有任何一处硬编码 `MODULE · 0X`**（`grep -rn "MODULE · 0" src/` 为空）。
曾发现 `/me` 页头写的是 `MODULE · 08`——全站只有 01–07，时间轴是 ★，
这就是编号散落各处必然腐烂的实证。

**关键设计**：`question` 字段（「能回答什么问题」）而不是数据量作为视觉主角——
用户不关心"你有 288 条规律"，只关心"哪些齿轮在我没注意的地方一直转动"。

**阅读路径**（唯一顺序，三处一致）：

```
时间轴 ★ → 01 名字 → 02 职业 → 03 规律 → 04 窗口 → 05 努力 → 06 运气 → 07 命运 → ↺ 循环
```

`ModuleNextNav` **挂在 root layout 里而不是各页面内**——一处改动全站生效，
将来新增模块只要改 `module-identity.ts`，路径自动跟进。

**长列表治理范式**：每组默认 12 条 + 底部「展开其余 N 个」；
页面顶部可选加一层「聚焦区」，只放 3 条最该先看的（排序口径按模块语义定，写在页面内）。

| 页面 | 聚焦口径 |
|---|---|
| `/laws` | 致命优先，同级按 `breakthrough` 升序（挽回概率越低越紧迫） |
| `/me` | 正在开启按 `lockForceScore` 降序（错过代价最大的在前） |
| `/career` | 黄金赛道（趋势上升+AI低风险）/ 高危赛道（趋势下降+AI高风险），按薪资降序取 3 |
| `/windows` `/luck` | 无聚焦区，仅按组折叠 |

> 注意：**包 `Reveal` 会改变谁是 grid item**。卡片原本直接是 grid item 时等高拉伸，
> 外面套一层 div 后内层不再拉伸。要么给卡片加 `h-full`，要么把 `Reveal` 包在整个 grid 外面。

## 权限链路（2026-10-03 起为正式模型）

```
访客（未登录）/ 普通用户
   └─ 预览态：全部模块的列表与摘要可逛（canPreviewModule 恒 true）
      锁定点 = useLockedAction().guard(action) 拦截三类动作：
        ① 条目详情弹层（career/windows 卡片、laws/luck 详情）
        ② AI 分析 / 对话按钮
        ③ simulation 问卷出分与推演、destiny 报告生成
      guard 未通过 → unlockStore.show() 唤起全局 UnlockDialog（挂 root layout）：
        访客 → 引导去 /user 登录/注册；已登录 → 就地输授权码兑换
   └─ ModuleGate 不再整页 403：正常渲染内容，未持码时挂 PreviewBanner 引导条

注册/登录 (POST /api/auth)
   └─► app_users.role ∈ {normal, premium, developer}
   └─► 前端存 localStorage("auth-user")（仅展示）+ localStorage("auth-token")（权限依据）

兑换授权码（POST /api/invite，需会话）
   └─ role=premium + ai_credits 到账（码自带次数）→ 全站即时解锁

premium（全模块 + AI 额度计次）
   └─ /admin 输入 DEV_PASSWORD → POST /api/admin {action:"verify"}
        └─ role=developer，token=sha256("lrs-dev-session:"+DEV_PASSWORD+":"+UTC日期)
           按日轮换（接受今天+昨天两桶，等效 24-48h），存 localStorage("dev-token")
```

侧栏锁标 `ModuleLockIcon` 跟随 `canAccessModule` 自动显隐；
各页接入 guard 的位置清单见 `docs/DESIGN-VISITOR-PREVIEW-AND-CREDITS.md`。

## 会话机制（2026-09-27 新增）

```
登录/注册 → /api/auth 签发 token = base64url(payload) + "." + HMAC-SHA256
            payload = { userId, nickname, role, exp }  有效期 7 天
            → 前端存 localStorage("auth-token")

受保护接口（/api/invite、/api/ai/credits、/api/ai/analyze 内置分支）→ Authorization: Bearer <token>
            → 服务端 sessionFromRequest() 校验签名与过期，userId 以令牌为准
```

签名密钥取 `SESSION_SECRET`，未设则回退 `DEV_PASSWORD`，生产环境两者都缺则拒绝签发。
用户对象本身仍存 localStorage，但**只用于界面展示**——权限判定的唯一权威是服务端令牌。
前端各 AI 面板统一用 `lib/client-auth.ts` 的 `getAuthHeader()` 带上令牌。

> **2026-10-03 起正式权限模型生效**（测试期全开放已收回）：`canAccessModule()` 按角色判定，
> 预览态由 `canPreviewModule()` + `useLockedAction()` 承载。决策记录见
> `docs/DESIGN-VISITOR-PREVIEW-AND-CREDITS.md`。

## AI 链路（2026-10-03 时点）

1. 页面打开 AI 面板 → POST `/api/ai/analyze` `{module, item, question?, history?, ai?, Authorization}`
2. 路由依次：IP 限流 → 入参截断（item≤6000 / question≤2000 / history 12 条×4000 字、role 白名单）→
   AI 源解析 → **额度门**（内置 AI 需会话并乐观锁扣 1 次；BYOK 免登录免扣；developer 不限）
3. `src/lib/ai-stream.ts` 按协议调用上游（stream:true），delta 的 `content` 与
   `reasoning_content` 分别透传
4. 服务端把 delta 转成 SSE `data: {content}` / `data: {reasoning}` / `data: [DONE]`
5. 前端 **`lib/sse-client.ts` 统一解析**（跨 chunk 行缓冲，全站唯一实现，2026-10-02 收编 6 处手写解析），
   `AiThinkingBlock` 实时显示思维链、正文开始后折叠；加载期 `AiLoadingBubble` 显示已等待秒数
6. 正文用 `components/shared/ai-markdown.tsx` 渲染；追问携带完整 history 走续聊分支
7. 交互三件套（`components/ai/ai-panel-actions.tsx`，6 个面板复用）：停止生成（abort）/ 复制回复 /
   计时加载气泡；面板本体为居中模态（role=dialog），laws/luck 关闭时中止流式

**AI 来源只有两种**（2026-09-28 简化，原写死的 8 家厂商预设已删除）：

| 来源 | provider | 配置位置 | 说明 |
|---|---|---|---|
| 内置 AI | `builtin` / 缺省 | 服务端 env（`AI_API_URL/AI_API_KEY/AI_MODEL`，三项缺一即报未配置） | 模型由 `AI_MODEL` 决定，前端改不了；**需登录持码，按次扣额度** |
| 自定义源 | `custom` | `/user` 页，localStorage `ai-sources` | 用户自己填 baseUrl + protocol + key + model；**免登录、不扣额度（BYOK 免费）** |

**用户自带 key**（2026-09-26 已接通，见 KNOWN-ISSUES #3）：`AIAnalysisPanel` 每次请求携带当前选中的 AI 源
`ai: { provider, protocol, baseUrl, apiKey, model }`，`analyze` 路由用 `resolveAiSource()` 解析后
按 protocol 自动选协议（openai → `/chat/completions`；claude / gemini / minimax 走各自的 SSE 适配）。
配置无效返回 400，不静默回退到 env key。

`/api/ai/test-key` 是服务端代理：浏览器把 Key POST 给本路由，路由替用户请求目标地址，Key 不落盘但会经过服务器。

## 数据流（用户偏好）

**localStorage 键名唯一真源：`lib/storage-keys.ts`**（2026-10-02 收敛，业务代码禁止新写裸字符串键）。
全局年龄的读写只走 `lib/default-age.ts` 的 `readDefaultAge()/writeDefaultAge()`（兼容历史 JSON 编码与 me-age 旧键）。

| key（storage-keys.ts 常量） | 内容 | 消费方 |
|---|---|---|
| `default-age` | 默认年龄（统一写裸数字，读兼容 `"40"` 历史格式） | me / windows / user / 首页密度图 |
| `life-stages` | 7 个人生阶段（可调起止年龄） | windows（按年龄过滤） |
| `preference-weights` | 6 维偏好权重（健康/财富/事业/关系/成长/自由） | destiny / simulation（weightMap） |
| `window-marks.v1` | 窗口三态个人标记（doing/done/skip） | /me |
| `visited-modules` | 模块访问记录（写入只在根布局 ModuleVisitTracker） | /user |
| `auth-user` / `auth-token` | 登录展示信息 / 会话令牌 | 全站 |
| `dev-token` | 后台会话（按 UTC 日轮换） | /admin |
| `ai-sources` / `api-active-source` | 自定义 AI 源列表 / 当前源 id | /user、6 个 AI 面板 |

## 构建与运行

- `pnpm dev` / `pnpm start` → `node scripts/next-run.mjs {dev|start}`，
  该脚本读 `$PORT` 并透传给 Next（默认 5000）。2026-09-29 起不再硬编码端口
- `pnpm validate` = `tsc` + `eslint --quiet`，CI（`.github/workflows/ci.yml`）跑同一套
- `src/server.ts` 自定义 HTTP server 入口（曾未被引用）——**2026-09-26 已删除**
- 扣子 `.coze` 配置已随 2026-10-02 工程清理删除，项目完全独立运行
- 静态数据 `src/data/` 合计约 **1.1MB** 全部打进 client bundle
  （careers 192KB / windows 240KB / luck-nodes 424KB / laws-*.ts 232KB），首屏性能受此影响

## 主题系统

- shadcn 语义变量（`globals.css`），亮/暗双模式（next-themes）
- 琥珀金 `#b8860b` 为 primary；深岩灰基底
- **配色约定（需注意）**：`AGENTS.md` 里写着「禁止蓝紫渐变、AI 味荧光色」，
  这是针对**大块背景与主视觉**的约定。2026-09-30 新增的七个模块**图标色板**
  （rose / sky / violet / amber / emerald / indigo / teal）是有意偏离——
  目的是让七个模块一眼可区分。二者边界：**主视觉守琥珀金，模块标识色允许各自不同**
- 自定义动画类：`fade-in-up` / `scale-in` / `glow-pulse` / `card-hover` / `progress-shimmer` / `btn-press`
  - ⚠️ `animate-fade-in-up` 是**加载即播完**，滚到页面下方时动画早已结束（等于没有动画）。
    新页面请用 `<Reveal>`（`components/shared/reveal.tsx`）做滚动进场
- 尊重 `prefers-reduced-motion`：全局降级 + `Reveal` 直接显示
- JSX 中文引号规范：`&quot;` 或中文引号（避免 ESLint react/no-unescaped-entities）
