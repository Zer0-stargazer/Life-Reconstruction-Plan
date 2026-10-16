# 人生沙盘 · LIFE SANDBOX

> AI 驱动的人生规划与决策辅助工具。**开源免费**——内容登录即看，AI 是唯一的可选付费点。
> 设计理念："人生作战室"——沉稳、克制、有分量感。琥珀金（#b8860b）主调，深岩灰基底。

## 项目是什么

一个 Next.js 全栈 Web 应用，把人生决策拆成 **8 个模块 + 1 条个性化时间轴**，每个模块是一个独立入口。
首页 FAQ 的自我定位：*"这不是算命，是基于概率和数据的决策框架。"*

**阅读路径**（侧栏与页尾「上一步 / 下一步」都按这个顺序，07 之后循环回时间轴）：

```
时间轴 ★ → 01 名字 → 02 职业 → 03 规律 → 04 窗口 → 05 努力 → 06 运气 → 07 命运 → 08 健康 → ↺
```

模块清单（编号、图标、配色、每块「能回答什么问题」的唯一真源在 `src/lib/module-identity.ts`）：

| # | 模块 | 路由 | 能回答什么问题 | 内容 |
|---|------|------|------|------|
| ★ | 时间轴 | `/me` | 在我这个年纪，有哪些事正等着我？ | **个性化主线**：年龄滑块内嵌全人生分布曲线 → 488 个窗口按“正在开启 / 已错过 / 尚未到来”分档，含 ±15 年年度热度图和「现在最该看的三类」聚焦层 |
| 01 | 名字 | `/name` | 这个名字，会在别人心里留下什么？ | 笔画 / 音律 / 意象分析（当前为本地随机生成，未接 AI） |
| 02 | 职业 | `/career` | 888 条赛道里，哪条上限更高、更抗 AI？ | 888 个职业 + 搜索 + 职业级学习资源 + 黄金/高危赛道快看组 |
| 03 | 规律 | `/laws` | 哪些齿轮，在你没注意的地方一直转动？ | 8 个维度、共 **267** 条人生规律 |
| 04 | 窗口 | `/windows` | 哪些门还开着，哪些马上要关？ | 488 个人生窗口卡片库 |
| 05 | 努力 | `/simulation` | 付出同样的努力，差距到底从哪来？ | 命运模拟器（SVG 雷达图 + 6 维滑块 + AI 策略） |
| 06 | 运气 | `/luck` | 哪些是概率，哪些其实你能动手改？ | 250 个运气节点 |
| 07 | 命运 | `/destiny` | 把上面几项叠起来，我现在的牌面是什么？ | 命势运综合报告（规则计算，非 AI；联动窗口标记/健康/模拟器/职业标记） |
| 08 | 健康 | `/health` | 身体这台机器，哪个零件正在悄悄磨损？ | 7 子域 **126** 条健康信号 + 14 题自评 → 七域雷达图 + 「先补这三个」短板聚焦层 |
| — | 用户 | `/user` | — | 账号 / AI 额度余额 / 授权码兑换 / AI Key 配置（BYOK）/ 高级设置 |
| — | 支持作者 | `/about` | — | 开发初心 / 作者的话 / 赞赏 / 联系我 / 反馈表单 |
| — | 后台 | `/admin` | — | 用户管理 / 授权码生成 / 内容审核 / 访问日志 / 反馈查看 |

## 访问与商业模式（新旧方案分离开）

代码同时保留两套方案，一个环境变量整体切换，**互不删除**：

| 模式 | 内容与功能 | AI | 生效方式 |
|---|---|---|---|
| `open`（默认，当前生效） | **登录即解锁**全部内容与功能 | 内置 AI 按次扣额度（**新用户注册送 50 次**）；额度用完可在「我的」页兑换续码，或改用**自带 Key（BYOK，永久免费不扣额度）** | 默认，无需配置 |
| `legacy`（旧买断制，保留未删） | 需使用权码（premium）解锁功能 | 需先持使用权，再扣额度 | 设 `NEXT_PUBLIC_BUSINESS_MODE=legacy` 后重新构建 |

- 模式判定唯一真源：`src/lib/business-mode.ts`
- 门控唯一权威不变：`auth-context.canViewModule()`（能否看）+ `canAccessModule()`（能否用）+ `useLockedAction().guard`（动作拦截）
- AI 调用优先级：用户自定义源（BYOK）→ 内置 AI（额度门 + 按次扣费 + 乐观锁防透支，`ai_credit_logs` 流水）
- 商业化的最低成本玩法：兑换码模式零开发——在后台生成「AI 额度码」上架任意创作平台即可，详见 `docs/DESIGN-VISITOR-PREVIEW-AND-CREDITS.md`

## 快速开始

```bash
pnpm install        # 必须用 pnpm（package.json 有 only-allow 拦截）
pnpm dev            # 开发服务器，默认 http://localhost:5000（读 $PORT，可覆盖）
pnpm ts-check       # 类型检查
pnpm lint           # ESLint
pnpm validate       # 类型检查 + lint + test（CI 用同一套）
pnpm build && pnpm start   # 生产
```

> Windows 下若 `pnpm install` 因 esbuild postinstall 失败，加 `--ignore-scripts`；
> 环境重建的完整步骤见 `docs/history/DEVELOPER.md`。

**首次运行必须配置环境变量**，否则登录/邀请码/AI 分析全部不可用（页面能看，接口会 500）：

```bash
cp .env.example .env.local    # 然后填入真实值
```

| 变量 | 用途 | 缺失后果 |
|---|---|---|
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | 数据库 | 注册/登录/邀请码/后台全 500 |
| `AI_API_URL` / `AI_API_KEY` / `AI_MODEL` | 内置 AI 分析（三项缺一即报"未配置"） | 内置 AI 不可用，用户可自带 Key 代替 |
| `AI_FALLBACK_URL` / `AI_FALLBACK_KEY` / `AI_FALLBACK_MODEL` | 内置 AI 备用源（可选） | 无容错切换 |
| `DEV_PASSWORD` | 开发者后台密码 | 无法进入 `/admin` |
| `SESSION_SECRET` | 登录态令牌的 HMAC 签名密钥（生产需 ≥32 字符） | 生产环境缺失则拒绝签发登录态 |
| `MAIL_PROVIDER` / `RESEND_API_KEY` / `MAIL_FROM` | 邮件验证码（可选，`resend`） | 邮件链路不可用 |
| `NEXT_PUBLIC_CONTACT` | 「支持作者」页联系邮箱（构建时内联） | 显示占位文案 |
| `NEXT_PUBLIC_DONATE_URL` | 赞赏链接（爱发电/面包多等） | 显示"赞赏渠道整理中" |
| `NEXT_PUBLIC_REPO_URL` | 开源仓库地址 | 不显示仓库入口 |
| `NEXT_PUBLIC_BUSINESS_MODE` | 商业模式开关（`open` 默认 / `legacy` 旧买断制） | open |
| `NEXT_PUBLIC_SITE_URL` | 站点对外地址（邮件链接等） | — |

## 自部署指南

1. **数据库**：建一个 Supabase 项目 → SQL Editor 执行 `supabase/schema.sql`（可重复执行）。
   存量环境按需补跑 `supabase/migrations/` 下的增量脚本。
2. **环境变量**：`cp .env.example .env.local` 填入真实值（见上表）。
3. **启动**：`pnpm install && pnpm build && pnpm start`。
4. **Cloudflare Workers（可选）**：项目已内置 [vinext](https://github.com/cloudflare/vinext) 适配
   （`vite.config.ts` + `cloudflare.config.ts`，worker 名可在后者改）：

   ```bash
   npx wrangler login     # 一次性授权
   pnpm build:vinext      # 产出 Workers 构建
   pnpm deploy:vinext     # 部署
   ```

   生产环境变量在 Cloudflare Dashboard → Workers → Settings → Variables 里配置，
   敏感值（`SESSION_SECRET` / `SUPABASE_SERVICE_ROLE_KEY` / `AI_API_KEY`）务必加密。
5. **开发者账号**：注册普通账号后，在数据库手动把该用户 `role` 改为 `developer`，
   之后即可在 `/admin` 管理授权码、审核与反馈。

## 技术栈

- **框架**：Next.js 16.1.1（App Router）+ React 19.2.3 + TypeScript 5
- **UI**：shadcn/ui（Radix UI）+ Tailwind CSS v4 + Lucide React
- **图表**：无第三方图表库，全部手写 SVG（雷达图 / 直方图 / 轨道图）
- **数据库**：Supabase PostgreSQL（@supabase/supabase-js 直连；表启 RLS 不建 policy，服务端走 service role）
- **AI**：多协议流式（`src/lib/ai-stream.ts` + `src/lib/sse-client.ts` 统一客户端解析，思维链透传实时显示）。
  两种来源：内置 AI（服务端 env，登录 + 额度门）+ 用户自定义接入源（BYOK，任意 baseUrl，
  协议 openai/claude/gemini/minimax，免登录不扣额度）。项目不内置任何厂商地址与模型 id
- **内容安全**：输入/输出双向敏感词护栏（滑动窗口扫描）+ 风险分级 + 自动处置 + 全量审计日志
- **密码**：bcryptjs（服务端哈希，cost=10）；会话为 HMAC 签名令牌
- **部署**：Node.js（`next build`）或 Cloudflare Workers（`build:vinext`，vinext 适配层）

## 目录结构

```
src/
├── app/                      # App Router 页面 + API 路由
│   ├── page.tsx              # 落地页（模块导览 + 关键发现）
│   ├── about/page.tsx        # 支持作者（初心 / 赞赏 / 联系 / 反馈表单）
│   ├── me/                   # ★ 个性化时间轴（年龄 → 属于你的窗口）
│   ├── name|career|laws|windows|simulation|luck|destiny|health/
│   ├── admin/page.tsx        # 开发者后台
│   ├── icon.svg / manifest.ts / not-found|error|global-error|loading
│   └── api/
│       ├── auth/route.ts     # 注册/登录（bcrypt + HMAC 会话 + 注册赠送额度）
│       ├── invite/route.ts   # 授权码兑换升级（含 AI 额度到账 + 流水）
│       ├── feedback/route.ts # 反馈提交（登录可选）+ developer 查看列表
│       ├── admin/route.ts    # 后台管理（x-dev-token 日期桶哈希）
│       └── ai/
│           ├── analyze/route.ts  # AI 分析（SSE 流式，额度/BYOK 双通道，按模式门控）
│           ├── credits/route.ts  # 额度余额查询
│           └── test-key/route.ts # AI 连通性测试（builtin / custom）
├── components/
│   ├── auth/module-gate.tsx      # 预览模式门控 + PreviewBanner 解锁引导条
│   ├── auth/unlock-dialog.tsx    # 全局解锁弹窗（挂 root layout）
│   ├── layout/app-sidebar.tsx    # 侧边栏（桌面 w-56 / 移动端抽屉，含「支持作者」入口）
│   ├── ai/…                      # AI 面板三件套（流式/源管理/动作条）
│   └── shared/…                  # 模块导航 / 页头 / 进场动效 / 图表装饰件
│   └── ui/                   # shadcn/ui 组件库（只保留实际用到的）
├── contexts/auth-context.tsx # 全局认证（角色/权限/模式开关；canAccessModule / canPreviewModule）
├── data/                     # 静态数据（职业 888 / 窗口 488 / 运气 250 / 健康 126 / 规律 267）
├── hooks/                    # use-locked-action / use-advanced-settings / use-module-visit
├── lib/
│   ├── module-identity.ts    # ★ 模块身份唯一真源
│   ├── business-mode.ts      # ★ 商业模式开关唯一真源（open / legacy）
│   ├── session.ts            # HMAC 会话签名与校验
│   ├── rate-limit.ts         # 内存滑动窗口限流
│   ├── ai-stream.ts          # AI 流式服务端客户端（多协议 + 思维链透传）
│   ├── ai-providers.ts       # AI 源解析：builtin（env）/ custom（用户地址，含 SSRF 防护）
│   └── …
└── storage/database/         # supabase-client.ts（无参 = service role）
supabase/schema.sql           # 建表 SQL（手工执行，可重复）
supabase/migrations/          # 增量迁移（安全加固 / 用户状态 / 反馈表等）
scripts/                      # next-run.mjs（读 $PORT）+ archive/（历史生成脚本）
docs/                         # 接手入口 / 开发日志 / 全景 / 架构 / API / 数据库 / 已知问题 / 设计稿
```

## 文档索引

| 文档 | 内容 |
|---|---|
| [docs/00-优先阅读-项目接手.md](docs/00-优先阅读-项目接手.md) | **接手第一入口**：当前状态、启动方式、优先阅读顺序 |
| [docs/DEVLOG.md](docs/DEVLOG.md) | **开发日志**：2026-04 至今全时间线（每日批次 + commit 哈希） |
| [docs/PROJECT-BRIEF.md](docs/PROJECT-BRIEF.md) | **项目全景（评审版）**：产品视角、目录地图、Roadmap、待决策事项 |
| [docs/DESIGN-VISITOR-PREVIEW-AND-CREDITS.md](docs/DESIGN-VISITOR-PREVIEW-AND-CREDITS.md) | 商业化设计稿：访客预览模型 + AI 额度制 |
| [docs/HANDOVER.md](docs/HANDOVER.md) | 交接文档：怎么跑起来、从哪继续、历史踩坑记录 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构与数据流、权限链路、AI 链路、信息架构 |
| [docs/API.md](docs/API.md) | API 路由的请求/响应契约 |
| [docs/DATABASE.md](docs/DATABASE.md) | 表结构、字段、建表与连接 |
| [docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md) | **全部已知问题（接手前必读）** |
| [docs/history/](docs/history/) | 旧版参考归档 |

## 支持与反馈

- **反馈**：站内「支持作者」页（`/about`）的表单，登录可选，开发者可在后台看到全部反馈
- **赞赏**：完全自愿，不换任何功能——内容本来就是你免费可得的
- **问题排查**：先看 `docs/KNOWN-ISSUES.md`，再看 `docs/DEVLOG.md` 对应批次

## 状态

- 2026-09-25 起人工接手整理：修编码损坏、归档生成脚本、补齐文档、init git
- 2026-09-26 ~ 09-28：数据去重与纠偏（careers 1539 → **757**）、安全层重建（HMAC 会话）、AI 全链路打通、自定义 AI 源
- 2026-09-29：全项目体检 + 产品审计；四个兜底页、AI 限流、CI、无障碍补全
- 2026-09-30：**信息架构重做**——模块身份唯一真源、首页模块导览、长列表聚焦与折叠、滚动进场、站点图标
- 2026-10-01：时间轴与 AI 回复打磨；文档收进 `docs/`，旧版参考归档到 `docs/history/`
- 2026-10-02：**P0 止血 + 体验 + 加固三大批次**（年龄同步/SSE 解析/移动端顶栏/后台假空/键盘可达/双光标/AI 面板三件套/SSRF/额度地基）；AI 思维链透明化；职业搜索与快看组升级
- 2026-10-03：**商业化上线**——访客预览模型 + AI 额度制（授权码自带次数）；首批职业专属资源；工程清理
- 2026-10-13：**更名「人生沙盘 · LIFE SANDBOX」**；账号 v2 过渡登录；用户数据云同步（17 键）；**权限模型 v3**；跨模块联动三批落地
- 2026-10-14：**开源免费模式**——`BUSINESS_MODE` 开关分离开新旧方案（登录即解锁全部内容，旧买断制保留未删可随时切回）；注册赠送 50 次 AI 额度；**「支持作者」页**（开发初心 / 赞赏 / 联系我 / 反馈表单）；**反馈系统**（feedback 表 + API + 后台可查）；安全修复 batch10/batch11 + 死代码清理；README/License 开源化；Cloudflare Workers 部署链路（vinext）打通
- 数据总览：267 规律 + 488 窗口 + 250 运气 + 888 职业 + 126 健康信号 = **2,019 条**

## License

[MIT](LICENSE) —— 拿去用，改了记得开源精神传下去。
