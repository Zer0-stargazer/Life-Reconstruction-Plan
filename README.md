# 人生重构计划 · LIFE REBOOT

> AI 驱动的人生规划与决策辅助工具。
> 设计理念："人生作战室"——沉稳、克制、有分量感。琥珀金（#b8860b）主调，深岩灰基底。

## 项目是什么

一个 Next.js 全栈 Web 应用，把人生决策拆成 8 个维度，每个维度是一个独立模块。
首页 FAQ 的自我定位：*"这不是算命，是基于概率和数据的决策框架。"*

| # | 模块 | 路由 | 内容 | 权限 |
|---|------|------|------|------|
| ★ | 时间轴 | `/me` | **个性化主线**：拖年龄滑块 → 473 个窗口按"正在开启/已错过/尚未到来"分档，含全人生密度图与 ±15 年轨道图 | 免费 |
| 01 | 名字 | `/name` | AI 起名（当前为本地随机生成） | 免费 |
| 02 | 职业 | `/career` | 1535 个职业 + 自学路线 + 课程/书籍资源 | 免费 |
| 03 | 命运 | `/destiny` | 命势运报告（规则计算，非 AI） | 🔒 |
| 04 | 规律 | `/laws` | 8 维度 × 36 条 = 288 条人生规律 | 🔒 |
| 05 | 努力 | `/simulation` | 命运模拟器（SVG 雷达图 + 6 维滑块 + AI 策略） | 🔒 |
| 06 | 窗口 | `/windows` | 473 个人生关键窗口卡片 | 免费 |
| 07 | 运气 | `/luck` | 250 个运气节点 | 🔒 |
| 08 | 用户 | `/user` | 角色 / 邀请码 / AI Key 配置 / 高级设置 | 登录 |
| — | 后台 | `/admin` | 用户管理 / 邀请码生成 / 访问日志 | 开发者 |

权限模型：`normal`（3 个免费模块）→ 邀请码升级 → `premium`（全开）→ 后台密码验证 → `developer`。

## 快速开始

```bash
pnpm install        # 必须用 pnpm（package.json 有 only-allow 拦截）
pnpm dev            # 开发服务器 http://localhost:5000
pnpm ts-check       # 类型检查
pnpm lint           # ESLint
pnpm build && pnpm start   # 生产
```

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
│   ├── page.tsx              # 落地页（首页）
│   ├── name|career|destiny|laws|simulation|windows|luck|user/
│   ├── me/                   # ★ 个性化时间轴（年龄 → 属于你的窗口）
│   ├── admin/page.tsx        # 开发者后台
│   └── api/
│       ├── auth/route.ts     # 注册/登录（bcrypt）
│       ├── invite/route.ts   # 邀请码兑换升级
│       ├── admin/route.ts    # 后台管理（x-dev-token）
│       └── ai/
│           ├── analyze/route.ts  # AI 分析（SSE 流式）
│           └── test-key/route.ts # AI 连通性测试（builtin / custom）
├── components/
│   ├── auth/module-gate.tsx  # 🔒 模块门控 + 角色徽章
│   ├── layout/app-sidebar.tsx# 侧边栏（桌面 w-56 / 移动端抽屉）
│   ├── ai/ai-analysis-panel.tsx # AI 分析侧滑面板（SSE 流式渲染）
│   └── ui/                   # shadcn/ui 组件库（只保留实际用到的 8 个）
├── contexts/auth-context.tsx # 全局认证（localStorage 持久化，见已知问题）
├── data/                     # 静态数据（约 2.1MB）
│   ├── careers.ts            # 1535 个职业
│   ├── windows.ts            # 473 个人生窗口（单行/多行两种格式批次）
│   ├── luck-nodes.ts         # 250 个运气节点
│   ├── luck-red.ts           # 50 个节点（预留数据，未接线）
│   └── laws-*.ts             # 8 维度规律，各 36 条
├── hooks/
│   ├── use-advanced-settings.ts # 7 个人生阶段 + 6 维偏好权重（localStorage）
│   └── use-module-visit.ts   # 模块访问记录（探索进度）
├── lib/ai-stream.ts          # AI 流式客户端（OpenAI 兼容 + Claude/Gemini/MiniMax 协议适配）
├── lib/ai-providers.ts       # AI 源解析：builtin（env）/ custom（用户地址）
├── lib/ai-sources.ts         # 自定义接入源的数据模型与导入导出
├── lib/active-ai-client.ts   # 前端读取用户当前 AI 源（localStorage）
└── storage/database/         # supabase-client.ts
supabase/schema.sql           # 建表 SQL（手工执行）
scripts/                      # .coze 运行入口 + archive/（历史生成脚本）
docs/                         # 架构 / API / 数据库 / 已知问题 / 交接
```

## 文档索引

| 文档 | 内容 |
|---|---|
| [docs/HANDOVER.md](docs/HANDOVER.md) | 交接文档：怎么跑起来、从哪继续、历史踩坑记录 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构与数据流、权限链路、AI 链路 |
| [docs/API.md](docs/API.md) | 5 个 API 路由的请求/响应契约 |
| [docs/DATABASE.md](docs/DATABASE.md) | 表结构、字段、建表与连接 |
| [docs/KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md) | **全部已知问题（接手前必读）** |
| [docs/DEVELOPER.md](docs/DEVELOPER.md) | 开发者参考（2026-07 旧版，含校注） |
| [docs/INTRODUCTION.md](docs/INTRODUCTION.md) | 对外介绍 |

## 状态

- 代码最后修改：2026-07-14（careers.ts）
- 2026-09-25 做过一次接手整理：修复 2 个文件的编码损坏、归档生成脚本、补齐文档、init git
- 项目由扣子编程 CLI 生成（`.coze` 仍在），但已可独立于扣子运行
