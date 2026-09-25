# AGENTS.md - 人生重构计划

## 项目概览

AI 驱动的人生规划与决策辅助工具。用户通过8个模块（名字/职业/命运/规律/努力/窗口/运气/用户中心）获得人生决策参考。

**设计理念**: "人生作战室"——沉稳、克制、有分量感。暖琥珀金为主调，深岩灰为基底。

**视觉特征**: 琥珀金(#b8860b)主色调、grain纹理背景、自定义动画系统(fade-in-up/scale-in/glow-pulse)、卡片悬浮效果(card-hover)、进度条微光(progress-shimmer)、按钮按压反馈(btn-press)

## 技术栈

- Next.js 16 (App Router) + React 19 + TypeScript 5
- shadcn/ui (Radix UI) + Tailwind CSS 4
- Recharts (图表) + Lucide React (图标)
- Supabase PostgreSQL (数据库)
- AI: 自研 OpenAI-compatible SSE 客户端 (src/lib/ai-stream.ts)，默认火山方舟豆包，Key 在 .env.local

## 构建命令

```bash
pnpm install && pnpm dev       # 开发 (端口5000)
pnpm build && pnpm start       # 生产
pnpm ts-check                  # 类型检查
pnpm lint                      # ESLint
```

## 目录结构

```
src/
├── app/                        # 页面路由 (App Router)
│   ├── layout.tsx              # 根布局（侧边栏 + AuthProvider）
│   ├── page.tsx                # 首页 Landing
│   ├── globals.css             # 全局样式 + 主题变量 + 微动效
│   ├── name/page.tsx           # 模块01 名字（AI起名器）
│   ├── career/page.tsx         # 模块02 职业（1538职业遍历+筛选）
│   ├── destiny/page.tsx        # 模块03 命运（命势运报告）🔒
│   ├── laws/page.tsx           # 模块04 规律（8维度288条规律）🔒
│   ├── simulation/page.tsx     # 模块05 努力（命运模拟器 SVG雷达图）🔒
│   ├── windows/page.tsx        # 模块06 窗口（524人生窗口卡片）
│   ├── luck/page.tsx           # 模块07 运气（365运气节点）🔒
│   ├── user/page.tsx           # 模块08 用户中心（角色/邀请码/AI Key/设置）
│   ├── admin/page.tsx          # 开发者后台（用户/邀请码管理）
│   └── api/
│       ├── ai/analyze/route.ts # AI分析 (SSE流式)
│       ├── ai/test-key/route.ts # API Key测试 (7厂商)
│       ├── auth/route.ts       # 注册/登录
│       ├── invite/route.ts     # 邀请码兑换
│       └── admin/route.ts      # 开发者管理 (x-dev-token)
├── components/
│   ├── layout/app-sidebar.tsx          # 侧边栏（56px宽/移动端抽屉）
│   ├── layout/module-visit-tracker.tsx # 模块访问追踪
│   ├── auth/module-gate.tsx            # 模块门控 + 角色徽章
│   └── ui/                    # shadcn/ui 组件库
├── contexts/auth-context.tsx   # 全局认证（角色/权限/邀请码）
├── data/                       # 静态数据
│   ├── windows.ts              # 524个人生窗口
│   ├── luck-nodes.ts           # 365个运气节点
│   ├── careers.ts              # 1538个职业（自学推荐+课程/视频资源）
│   └── laws*.ts                # 8维度规律（各36条，共288条）
├── hooks/
│   ├── use-mobile.ts           # 移动端检测
│   └── use-module-visit.ts     # 模块访问追踪
└── lib/utils.ts                # cn()
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
3. **AI能力**: 内置coze-coding-dev-sdk + 用户自定义API Key（8厂商，localStorage存储）
4. **职业数据**: 1538个职业，tutorials只含course/video两种类型，书籍链接为豆瓣真实链接
5. **规律引擎**: 8维度(laws-*.ts)聚合到laws.ts，4类标签(critical/danger/opportunity/neutral)
6. **命运模拟器**: SVG雷达图 + 6维滑块，推演后AI生成策略建议
7. **侧边栏**: 桌面 w-56 (224px) 固定 / 移动端顶部栏+左侧抽屉（main 用 md:ml-56 对齐）
8. **探索进度**: useModuleVisit hook自动记录，用户中心展示
9. **高级设置**: 7个人生阶段(可调起止年龄) + 6维偏好权重，存localStorage；destiny/windows/simulation 三模块消费（default-age / life-stages / preference-weights）

## 代码风格

- Shadcn/ui语义化变量，禁止硬编码颜色/Hero
- 禁止蓝紫色渐变和AI味荧光色
- `font-serif`标题 / `font-mono`编号标签
- 页面组件 `'use client'`
- JSX引号用 `&quot;` 或中文引号

## 待优化

- 名字模块当前本地随机生成，可接入AI流式
- 命运报告当前规则计算，可接入AI深度分析
- 命运模拟器可增加蒙特卡洛模拟
- 用户配置的自定义 API Key 尚未接入 /api/ai/analyze（当前只用于 test-key 连通性测试）
- 首页统计数字（524窗口/365运气/1538职业）与真实数据（479/250/1539）不符，建议改为真实值

> 全部已知问题（含安全项）见 docs/KNOWN-ISSUES.md（2026-09-25 全量排查）。
