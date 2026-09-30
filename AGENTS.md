# AGENTS.md - 人生重构计划

## 项目概览

AI 驱动的人生规划与决策辅助工具。用户通过 **7 个模块 + 1 条个性化时间轴**
（时间轴 / 名字 / 职业 / 规律 / 窗口 / 努力 / 运气 / 命运）+ 用户中心获得人生决策参考。

**编号与顺序的唯一真源是 `src/lib/module-identity.ts`**，不要在页面里手写编号：

```
时间轴 ★ → 01 名字 → 02 职业 → 03 规律 → 04 窗口 → 05 努力 → 06 运气 → 07 命运 → ↺
```

**设计理念**: "人生作战室"——沉稳、克制、有分量感。暖琥珀金为主调，深岩灰为基底。

**视觉特征**: 琥珀金(#b8860b)主色调、grain纹理背景、滚动进场(Reveal)、
卡片悬浮效果(card-hover)、进度条微光(progress-shimmer)、按钮按压反馈(btn-press)

## 技术栈

- Next.js 16 (App Router) + React 19 + TypeScript 5
- shadcn/ui (Radix UI) + Tailwind CSS 4
- Lucide React (图标)；图表全部手写 SVG（Recharts 已于 2026-09-28 移除）
- Supabase PostgreSQL (数据库)
- AI: 自研 OpenAI-compatible SSE 客户端 (src/lib/ai-stream.ts) + 自定义接入源 (src/lib/ai-sources.ts)。
  项目**不内置任何厂商地址与模型 id**：内置 AI 读服务端 env（AI_API_URL/AI_API_KEY/AI_MODEL）；
  用户也可在 /user 页添加自己的接入源（任意 baseUrl + 协议 openai/claude/gemini/minimax）

## 构建命令

```bash
pnpm install && pnpm dev       # 开发（读 $PORT，默认 5000）
pnpm build && pnpm start       # 生产
pnpm ts-check                  # 类型检查
pnpm lint                      # ESLint
pnpm validate                  # ts-check + lint（CI 同一套）
```

> `next build` 会清空重建 `.next`。若在受限环境里批量删除被拦，先 `mv .next .next.old` 再 build
> （`.gitignore` 已忽略 `.next*/`）。

## 目录结构

```
src/
├── app/                        # 页面路由 (App Router)
│   ├── layout.tsx              # 根布局（侧边栏 + AuthProvider + 页尾 ModuleNextNav）
│   ├── page.tsx                # 首页 Landing（Hero 模块索引 + 导览卡 + 关键发现）
│   ├── globals.css             # 全局样式 + 主题变量 + 微动效
│   ├── icon.svg / manifest.ts  # 站点图标 + PWA manifest
│   ├── not-found|error|global-error|loading.tsx  # 兜底页
│   ├── me/page.tsx             # ★ 时间轴（年龄 → 属于你的窗口，含聚焦层）
│   ├── name/page.tsx           # 模块01 名字（起名器）
│   ├── career/page.tsx         # 模块02 职业（757职业遍历+筛选+快看组）
│   ├── laws/page.tsx           # 模块03 规律（8维度288条规律）🔒
│   ├── windows/page.tsx        # 模块04 窗口（473人生窗口卡片）
│   ├── simulation/page.tsx     # 模块05 努力（命运模拟器 SVG雷达图）🔒
│   ├── luck/page.tsx           # 模块06 运气（250运气节点）🔒
│   ├── destiny/page.tsx        # 模块07 命运（命势运报告）🔒
│   ├── user/page.tsx           # 用户中心（角色/邀请码/AI Key/设置）
│   ├── admin/page.tsx          # 开发者后台（用户/邀请码管理）
│   └── api/
│       ├── ai/analyze/route.ts # AI分析 (SSE流式，带内存限流)
│       ├── ai/test-key/route.ts # AI 连通性测试（builtin / custom 两种源）
│       ├── auth/route.ts       # 注册/登录
│       ├── invite/route.ts     # 邀请码兑换
│       └── admin/route.ts      # 开发者管理 (x-dev-token)
├── components/
│   ├── layout/app-sidebar.tsx          # 侧边栏（56px宽/移动端抽屉）
│   ├── layout/module-visit-tracker.tsx # 模块访问追踪
│   ├── shared/module-next-nav.tsx      # ★ 页尾「上一步/下一步」模块路径（挂 root layout）
│   ├── shared/reveal.tsx               # ★ 滚动进场包裹件（IntersectionObserver）
│   ├── shared/module-page-head.tsx     # ★ 七个模块页的统一页头
│   ├── shared/fig-kit.tsx              # PanelHead / HudCorners 图表装饰件
│   ├── auth/module-gate.tsx            # 模块门控 + 角色徽章
│   └── ui/                    # shadcn/ui 组件库
├── contexts/auth-context.tsx   # 全局认证（角色/权限/邀请码）
├── data/                       # 静态数据（合计约 1.1MB）
│   ├── windows.ts              # 473个人生窗口（单行+多行两种格式批次）
│   ├── window-density.ts       # 窗口密度预聚合（首页/时间轴共用）
│   ├── luck-nodes.ts           # 250个运气节点（luck-red.ts 50条预留未接线，2026-09-28 已删）
│   ├── careers.ts              # 757个职业（2026-09-28 移除 778 条机器生成模板条目）
│   └── laws*.ts                # 8维度规律（各36条，共288条）
├── hooks/
│   ├── use-mobile.ts           # 移动端检测
│   └── use-module-visit.ts     # 模块访问追踪
└── lib/
    ├── utils.ts                # cn()
    ├── module-identity.ts      # ★ 模块编号/图标/配色/「能回答什么问题」唯一真源
    ├── session.ts              # HMAC 会话令牌（登录态）
    ├── rate-limit.ts           # 内存滑动窗口限流
    ├── ai-stream.ts            # 多协议流式客户端（openai/claude/gemini/minimax）
    ├── ai-providers.ts         # AI 源解析（builtin / custom）
    ├── ai-sources.ts           # 自定义接入源的数据模型与导入导出
    └── active-ai-client.ts     # 客户端读取当前生效的 AI 源
```

## 数据库 (Supabase PostgreSQL)

| 表 | 关键字段 | 说明 |
|---|---|---|
| `app_users` | nickname(唯一), password_hash, role(normal\|premium\|developer) | 三级角色权限 |
| `invite_codes` | code(唯一), max_uses, used_count, is_active | 邀请码升级 |
| `access_logs` | user_id, action, detail | 访问追踪 |

## 核心架构决策

1. **权限门控**: ModuleGate组件包裹🔒模块，normal只能访问3个，premium全开，developer全权限+后台
2. **角色升级**: normal → premium 通过邀请码；developer 通过admin页面密码验证(x-dev-token)
3. **AI能力**: 两种来源——内置 AI（服务端 env）+ 自定义接入源（localStorage `ai-sources`，已接入 analyze）。
   2026-09-28 已删除原先写死的 8 家厂商预设（官方地址 + 过期模型列表，与第三方中转站 Key 对不上）
4. **职业数据**: 757个职业（2026-09-26 去重 → 09-28 移除 778 条机器生成模板条目）；
   学习资源按**分类**查找（`getTutorials`/`getBooks`/`getLearningChannels`），不是逐职业写死
5. **规律引擎**: 8维度(laws-*.ts)聚合到laws.ts，4类标签(critical/danger/opportunity/neutral)
6. **命运模拟器**: SVG雷达图 + 6维滑块，推演后AI生成策略建议
7. **侧边栏**: 桌面 w-56 (224px) 固定 / 移动端顶部栏+左侧抽屉（main 用 md:ml-56 对齐）
8. **探索进度**: useModuleVisit hook自动记录，用户中心展示
9. **高级设置**: 7个人生阶段(可调起止年龄) + 6维偏好权重，存localStorage；destiny/windows/simulation 三模块消费（default-age / life-stages / preference-weights）
10. **信息架构**（2026-09-30 收敛）: 模块身份/顺序看 `module-identity.ts`；
    页尾模块路径 `ModuleNextNav` 挂在 root layout（加模块自动生效）；
    长列表统一「每组默认 12 条 + 展开其余 N 个」，页面顶部可加只放 3 条的「聚焦区」

## 代码风格

- Shadcn/ui语义化变量，禁止硬编码颜色/Hero
- **禁止主视觉用蓝紫色渐变和AI味荧光色**——但 `module-identity.ts` 里七个模块的
  图标色板（rose/sky/violet/amber/emerald/indigo/teal）是有意例外，用于区分模块。
  边界：主视觉守琥珀金，模块标识色允许各自不同
- `font-serif`标题 / `font-mono`编号标签
- 页面组件 `'use client'`
- JSX引号用 `&quot;` 或中文引号
- **滚动进动用 `<Reveal>`，不要用 `animate-fade-in-up`**（后者是加载即播完，
  页面下方的元素滚到时动画早结束了）。注意包 `Reveal` 会改变谁是 grid item：
  卡片原先是 grid item 时等高拉伸，套一层 div 后内层不再拉伸 → 给卡片加 `h-full`，
  或把 `Reveal` 包在整个 grid 外面

## 待优化

- 名字模块当前本地随机生成，可接入AI流式
- 命运报告当前规则计算，可接入AI深度分析
- 命运模拟器可增加蒙特卡洛模拟
- 时间轴「与我无关 / 已在做」标记能力（`LifeWindow` 已有 `planningStatus`/`completionStatus` 字段，数据未填）
- 各页默认排序口径不统一
- ~~自定义 API Key 未接入 analyze~~（2026-09-26 已接入；2026-09-29 发现键名分叉导致实际失效，
  已于 8945efe 真正修复；claude/gemini/minimax 协议适配未经真实 Key 实测）
- ~~首页统计数字与真实数据不符~~（已改为真实值 288/473/250/757 = 1,768，且 `N=` 改为动态取值）
- ~~页面头部未统一~~（2026-10-01 已抽 `ModulePageHead`，编号/图标/question 全部从
  module-identity 取，页面里不再手写 `MODULE · 0X`）

> 全部已知问题（含安全项）见 docs/KNOWN-ISSUES.md（2026-09-25 全量排查）。
