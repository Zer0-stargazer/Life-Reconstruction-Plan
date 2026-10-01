# 人生重构计划 · LIFE REBOOT

> AI 驱动的人生规划与决策辅助工具。
> 设计理念："人生作战室"——沉稳、克制、有分量感。琥珀金（#b8860b）主调，深岩灰基底。

## 项目是什么

一个 Next.js 全栈 Web 应用，把人生决策拆成 **7 个模块 + 1 条个性化时间轴**，每个模块是一个独立入口。
首页 FAQ 的自我定位：*"这不是算命，是基于概率和数据的决策框架。"*

**阅读路径**（侧栏与页尾「上一步 / 下一步」都按这个顺序，07 之后循环回时间轴）：

```
时间轴 ★ → 01 名字 → 02 职业 → 03 规律 → 04 窗口 → 05 努力 → 06 运气 → 07 命运 → ↺
```

模块清单（编号、图标、配色、每块「能回答什么问题」的唯一真源在 `src/lib/module-identity.ts`）：

| # | 模块 | 路由 | 能回答什么问题 | 内容 | 权限 |
|---|------|------|------|------|------|
| ★ | 时间轴 | `/me` | 在我这个年纪，有哪些事正等着我？ | **个性化主线**：年龄滑块内嵌全人生分布曲线 → 473 个窗口按“正在开启 / 已错过 / 尚未到来”分档，含 ±15 年年度热度图和「现在最该看的三类」聚焦层 | 免费 |
| 01 | 名字 | `/name` | 这个名字，会在别人心里留下什么？ | 笔画 / 音律 / 意象分析（当前为本地随机生成，未接 AI） | 免费 |
| 02 | 职业 | `/career` | 757 条赛道里，哪条上限更高、更抗 AI？ | 757 个职业 + 自学路线 + 课程/书籍资源 | 免费 |
| 03 | 规律 | `/laws` | 哪些齿轮，在你没注意的地方一直转动？ | 8 个维度 × 36 条 = 288 条人生规律 | 🔒 |
| 04 | 窗口 | `/windows` | 哪些门还开着，哪些马上要关？ | 473 个人生关键窗口卡片 | 免费 |
| 05 | 努力 | `/simulation` | 付出同样的努力，差距到底从哪来？ | 命运模拟器（SVG 雷达图 + 6 维滑块 + AI 策略） | 🔒 |
| 06 | 运气 | `/luck` | 哪些是概率，哪些其实你能动手改？ | 250 个运气节点 | 🔒 |
| 07 | 命运 | `/destiny` | 把上面六项叠起来，我现在的牌面是什么？ | 命势运综合报告（规则计算，非 AI） | 🔒 |
| — | 用户 | `/user` | — | 角色 / 邀请码 / AI Key 配置 / 高级设置 | 登录 |
| — | 后台 | `/admin` | — | 用户管理 / 邀请码生成 / 访问日志 | 开发者 |

> **测试期注意**：2026-10-01 晚间起，前端门控临时全开放，方便测试。  
> 正式权限模型仍按 `normal`（3 个基础模块）→ 邀请码升级 → `premium` → `developer` 设计。
门控由 `ModuleGate` 包裹 `/destiny` `/laws` `/simulation` `/luck` 四个页面。

## 快速开始

```bash
pnpm install        # 必须用 pnpm（package.json 有 only-allow 拦截）
pnpm dev            # 开发服务器，默认 http://localhost:5000（读 $PORT，可覆盖）
pnpm ts-check       # 类型检查
pnpm lint           # ESLint
pnpm validate       # 类型检查 + lint（CI 用同一套）
pnpm build && pnpm start   # 生产
```

> Windows 下若 `pnpm install` 因 esbuild postinstall 失败，加 `--ignore-scripts`；
> 环境重建的完整步骤见 `docs/DEVELOPER.md`。

**首次运行必须配置环境变量**，否则登录/邀请码/AI 分析全部不可用（页面能看，接口会 500）：

```bash
cp .env.example .env.local    # 然后填入真实值
```

| 变量 | 用途 | 缺失后果 |
|---|---|---|
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | 数据库 | 注册/登录/邀请码/后台全 500 |
| `AI_API_URL` / `AI_API_KEY` / `AI_MODEL` | 内置 AI 分析（三项缺一即报"未配置"） | 内置 AI 不可用，可用自定义接入源代替 |
| `DEV_PASSWORD` | 开发者后台密码 | 无法进入 `/admin` |
| `SESSION_SECRET` | 登录态令牌的 HMAC 签名密钥 | 回退用 `DEV_PASSWORD`；生产环境两者都缺则拒绝签发登录态 |

数据库建表：执行 `supabase/schema.sql`（Supabase Dashboard → SQL Editor）。

## 技术栈

- **框架**：Next.js 16.1.1（App Router）+ React 19.2.3 + TypeScript 5
- **UI**：shadcn/ui（Radix UI）+ Tailwind CSS v4 + Lucide React
- **图表**：无第三方图表库，全部手写 SVG（雷达图 / 直方图 / 轨道图）。Recharts 已于 2026-09-28 移除（无引用）
- **数据库**：Supabase PostgreSQL（@supabase/supabase-js 直连；drizzle 已于 2026-09-26 移除）
- **AI**：多协议流式（`src/lib/ai-stream.ts`）。两种来源：内置 AI（服务端 env）+ 用户自定义接入源（任意 baseUrl，协议 openai/claude/gemini/minimax）。项目不内置任何厂商地址与模型 id
- **密码**：bcryptjs（服务端哈希，cost=10）
- **包管理**：pnpm 9（registry 走 npmmirror）

## 目录结构

```
src/
├── app/                      # App Router 页面 + API 路由
│   ├── page.tsx              # 落地页（模块导览 + 关键发现）
│   ├── me/                   # ★ 个性化时间轴（年龄 → 属于你的窗口）
│   ├── name|career|laws|windows|simulation|luck|destiny/
│   ├── admin/page.tsx        # 开发者后台
│   ├── icon.svg              # 站点图标（轨迹在关键窗口处分叉跃升）
│   ├── manifest.ts           # PWA manifest
│   ├── not-found.tsx / error.tsx / global-error.tsx / loading.tsx  # 兜底页
│   └── api/
│       ├── auth/route.ts     # 注册/登录（bcrypt + HMAC 会话签发）
│       ├── invite/route.ts   # 邀请码兑换升级
│       ├── admin/route.ts    # 后台管理（x-dev-token）
│       └── ai/
│           ├── analyze/route.ts  # AI 分析（SSE 流式，带限流）
│           └── test-key/route.ts # AI 连通性测试（builtin / custom）
├── components/
│   ├── auth/module-gate.tsx  # 🔒 模块门控 + 角色徽章
│   ├── layout/app-sidebar.tsx# 侧边栏（桌面 w-56 / 移动端抽屉）
│   ├── ai/ai-analysis-panel.tsx # AI 分析侧滑面板（SSE 流式渲染）
│   ├── shared/
│   │   ├── module-next-nav.tsx  # ★ 页尾「上一步/下一步」模块路径（挂 root layout，全站生效）
│   │   ├── module-page-head.tsx # ★ 七个模块页的统一页头（编号/图标/提问自动取）
│   │   ├── reveal.tsx           # ★ 滚动进场包裹件（IntersectionObserver）
│   │   └── fig-kit.tsx          # PanelHead / HudCorners 等图表装饰件
│   └── ui/                   # shadcn/ui 组件库（只保留实际用到的 8 个）
├── contexts/auth-context.tsx # 全局认证（localStorage 持久化，见已知问题）
├── data/                     # 静态数据
│   ├── careers.ts            # 757 个职业（192KB）
│   ├── windows.ts            # 473 个人生窗口
│   ├── window-density.ts     # 窗口密度预聚合（首页/时间轴用）
│   ├── luck-nodes.ts         # 250 个运气节点
│   └── laws-*.ts             # 8 个维度规律，各 36 条（共 288）
├── hooks/
│   ├── use-advanced-settings.ts # 7 个人生阶段 + 6 维偏好权重（localStorage）
│   └── use-module-visit.ts   # 模块访问记录（探索进度）
├── lib/
│   ├── module-identity.ts    # ★ 七个模块的编号/图标/配色/「能回答什么问题」唯一真源
│   ├── session.ts            # HMAC 会话签名与校验
│   ├── rate-limit.ts         # 内存滑动窗口限流
│   ├── ai-stream.ts          # AI 流式客户端（OpenAI 兼容 + Claude/Gemini/MiniMax 协议适配）
│   ├── ai-providers.ts       # AI 源解析：builtin（env）/ custom（用户地址）
│   ├── ai-sources.ts         # 自定义接入源的数据模型与导入导出
│   └── active-ai-client.ts   # 前端读取用户当前 AI 源（localStorage）
└── storage/database/         # supabase-client.ts
supabase/schema.sql           # 建表 SQL（手工执行）
scripts/                      # next-run.mjs（读 $PORT）+ archive/（历史生成脚本）
docs/                         # 架构 / API / 数据库 / 已知问题 / 体检 / 产品审计 / 交接
```

## 文档索引

| 文档 | 内容 |
|---|---|
| [PROJECT-BRIEF.md](PROJECT-BRIEF.md) | **项目全景（评审版）**：产品视角、目录地图、Roadmap、待决策事项 |
| [docs/HANDOVER.md](docs/HANDOVER.md) | 交接文档：怎么跑起来、从哪继续、历史踩坑记录 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构与数据流、权限链路、AI 链路、信息架构 |
| [docs/API.md](docs/API.md) | 5 个 API 路由的请求/响应契约 |
| [docs/DATABASE.md](docs/DATABASE.md) | 表结构、字段、建表与连接 |
| [docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md) | **全部已知问题（接手前必读）** |
| [docs/HEALTH-REPORT.md](docs/HEALTH-REPORT.md) | 全项目体检报告（工程/数据/文档/构建） |
| [docs/PRODUCT-AUDIT.md](docs/PRODUCT-AUDIT.md) | 产品打磨审计（视觉/交互/文案/移动端/无障碍 + 信息架构重做） |
| [docs/DEVELOPER.md](docs/DEVELOPER.md) | 开发者参考（2026-07 旧版，含校注） |
| [docs/INTRODUCTION.md](docs/INTRODUCTION.md) | 对外介绍 |

## 状态

- 2026-09-25 起人工接手整理：修编码损坏、归档生成脚本、补齐文档、init git
- 2026-09-26 ~ 09-28：数据去重与纠偏（careers 1539 → **757**）、安全层重建（HMAC 会话）、AI 全链路打通、自定义 AI 源
- 2026-09-29：全项目体检 + 产品审计；四个兜底页、AI 限流、CI、无障碍补全
- 2026-09-30：**信息架构重做**——模块身份唯一真源、首页模块导览、长列表聚焦与折叠、滚动进场、站点图标
- 数据总览：288 规律 + 473 窗口 + 250 运气 + 757 职业 = **1,768 条**
- 项目由扣子编程 CLI 生成（`.coze` 仍在），但已可独立于扣子运行
