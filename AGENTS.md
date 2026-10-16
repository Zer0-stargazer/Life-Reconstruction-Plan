# AGENTS.md - 人生沙盘

## 项目概览

AI 驱动的人生规划与决策辅助工具。用户通过 **8 个模块 + 1 条个性化时间轴**
（时间轴 / 名字 / 职业 / 规律 / 窗口 / 努力 / 运气 / 命运 / 健康）+ 用户中心获得人生决策参考。

**编号与顺序的唯一真源是 `src/lib/module-identity.ts`**，不要在页面里手写编号：

```
时间轴 ★ → 01 名字 → 02 职业 → 03 规律 → 04 窗口 → 05 努力 → 06 运气 → 07 命运 → 08 健康 → ↺
```

> 内容合计 **2,019 条**：职业 888 / 窗口 488 / 运气 250 / 规律 267（8 维度）/ 健康 126。

**设计理念**: "人生作战室"——沉稳、克制、有分量感。朱砂红（--primary）为主调、青墨（--ink-accent）为辅，暖纸色为底，深岩灰为暗色基底。

**视觉特征**: 朱砂红 oklch(0.52 0.16 30) 主色、青墨 --ink-accent 辅色、局部纸张颗粒 .grain-texture（亮 0.015 / 暗 0.03）、滚动进场(Reveal)、
卡片悬停 .card-lift（仅边框色）、进度条 MeterBar(scaleX)、按钮按压 .btn-press（opacity .85）、统一焦点环 .focus-ring、骨架 .skeleton

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
pnpm test                      # vitest（13 文件 / 106 测试）
pnpm validate                  # ts-check + lint:build + test（CI 同一套）
```

数据/环境体检（只读）：

```bash
pnpm check:resources   # 职业资源：覆盖率 / 孤儿键 / 链接协议 / 份数 / 共用
pnpm check:data        # 内容数据：条数 / 重复 id / 枚举对齐 / 数值边界
pnpm check:db          # Supabase：表 / 列 / RPC / 种子数据
pnpm check:flow        # 商业化闭环（需先起 dev server，会写库）
```

**Cloudflare Workers 部署链**（vinext 适配器，免费 `workers.dev` 域名）：

```bash
pnpm dev:vinext        # vite dev --port 3001
pnpm build:vinext      # vite build（会覆盖 .next 类型，跑完要重跑 pnpm build 再做 ts-check）
pnpm deploy:vinext     # vinext-cloudflare deploy（部署前需 npx wrangler login）
```

> `next build` 会清空重建 `.next`。若在受限环境里批量删除被拦，先 `mv .next .next.old` 再 build
> （`.gitignore` 已忽略 `.next*/`）。
>
> ⚠️ **Windows PowerShell 5.1 下不要用 `Set-Content -Encoding utf8` 批量改源码**——会写入 BOM，
> 导致 `next build` 以 `3221225477`（`0xC0000005`）崩溃。用 Edit 工具，或
> `[System.IO.File]::WriteAllText($p, $t, (New-Object System.Text.UTF8Encoding($false)))`。

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
│   ├── career/page.tsx         # 模块02 职业（888职业遍历+搜索+筛选+快看组）
│   ├── laws/page.tsx           # 模块03 规律（8维度267条规律）🔒
│   ├── windows/page.tsx        # 模块04 窗口（488人生窗口卡片）
│   ├── simulation/page.tsx     # 模块05 努力（命运模拟器 SVG雷达图，6维）🔒
│   ├── luck/page.tsx           # 模块06 运气（250运气节点）🔒
│   ├── destiny/page.tsx        # 模块07 命运（命势运报告）🔒
│   ├── health/page.tsx         # 模块08 健康（126条信号 + 两步自评）🔒
│   ├── user/page.tsx           # 用户中心（角色/授权码/AI 额度余额/Key/设置）
│   ├── admin/page.tsx          # 开发者后台（用户/授权码批量生成，含 AI 次数）
│   └── api/
│       ├── ai/analyze/route.ts # AI分析 (SSE流式，内置 AI 走额度门)
│       ├── ai/credits/route.ts # AI 额度余额查询（需会话）
│       ├── ai/test-key/route.ts # AI 连通性测试（builtin / custom 两种源）
│       ├── auth/route.ts       # 注册/登录
│       ├── invite/route.ts     # 授权码兑换（额度一并到账）
│       └── admin/route.ts      # 开发者管理 (x-dev-token，按日轮换)
├── components/
│   ├── layout/app-sidebar.tsx          # 侧边栏（桌面 w-56 / 移动端抽屉）
│   ├── layout/module-visit-tracker.tsx # 模块访问追踪（visited-modules 唯一写入方）
│   ├── shared/module-next-nav.tsx      # ★ 页尾「上一步/下一步」模块路径（挂 root layout）
│   ├── shared/reveal.tsx               # ★ 滚动进场包裹件（IntersectionObserver）
│   ├── shared/module-page-head.tsx     # ★ 八个模块页的统一页头
│   ├── shared/fig-kit.tsx              # PanelHead / HudCorners 图表装饰件
│   ├── auth/module-gate.tsx            # 预览模式门控 + PreviewBanner
│   ├── auth/unlock-dialog.tsx          # 全局解锁弹窗（挂 root layout）
│   └── ui/                    # shadcn/ui 组件库
├── contexts/auth-context.tsx   # 全局认证（角色/权限/授权码）
├── data/                       # 静态数据（合计约 1.1MB）
│   ├── windows.ts              # 488个人生窗口（单行+多行两种格式批次）
│   ├── window-density.ts       # 窗口密度预聚合（首页/时间轴共用）
│   ├── luck-nodes.ts           # 250个运气节点
│   ├── careers.ts              # 888个职业（2026-09-26 去重 → 09-28 移除 778 条机器生成模板条目 → 757 → 10-10 新增 131 个现代职业）
│   ├── career-count.ts         # ★ 职业总数常量（避免为显示一个数字把整份职业库打进 bundle）
│   ├── career-resources.ts     # 职业级学习资源（888/888 有配置，人均 2.06 份，目标 5 份；分类文件在 data/resources/，键只能留一处——supplement 会覆盖同名分类文件）
│   ├── health.ts + health-*.ts # 第8模块：7 子域各 18 条 = 126 条健康信号
│   └── laws*.ts                # 8维度规律（共267条，各文件条数不等）
├── hooks/
│   ├── use-locked-action.ts    # ★ 预览态锁定动作统一入口（guard + useUnlockOpen）
│   ├── use-mobile.ts           # 移动端检测
│   └── use-module-visit.ts     # 模块访问追踪
└── lib/
    ├── utils.ts                # cn()
    ├── module-identity.ts      # ★ 模块编号/图标/配色/「能回答什么问题」唯一真源
    ├── storage-keys.ts         # ★ localStorage 键名唯一真源（新键必须 .v1 后缀）
    ├── default-age.ts          # 全局默认年龄统一读写（兼容历史编码）
    ├── session.ts              # HMAC 会话令牌（登录态）
    ├── client-auth.ts          # 前端取 Authorization 会话头
    ├── unlock-store.ts         # 解锁弹窗全局开关（unlockStore.show/hide）
    ├── sse-client.ts           # ★ SSE 统一解析（跨 chunk 行缓冲 + onReasoning）
    ├── rate-limit.ts           # 内存滑动窗口限流
    ├── ai-stream.ts            # 多协议流式服务端客户端（openai/claude/gemini/minimax + 思维链透传）
    ├── ai-providers.ts         # AI 源解析（builtin / custom + SSRF 高危地址拦截）
    ├── ai-sources.ts           # 自定义接入源的数据模型与导入导出
    └── active-ai-client.ts     # 客户端读取当前生效的 AI 源
```

## 数据库 (Supabase PostgreSQL)

| 表 | 关键字段 | 说明 |
|---|---|---|
| `app_users` | nickname(唯一), password_hash, role(normal\|premium\|developer), ai_credits, ai_credits_total | 角色 + AI 剩余额度；open 模式下 role 仅 normal/developer 生效（premium 历史兼容）；另有 email/phone/locked_until/token_version（batch6/10） |
| `invite_codes` | code(唯一), max_uses, used_count, is_active, ai_credits, kind(access\|ai\|bundle) | 授权码；batch9 已执行；open 模式下只有 ai 码有充值意义 |
| `ai_credit_logs` | user_id, delta, reason, balance | AI 额度流水（2026-10-03 新增，审计/对账） |
| `access_logs` | user_id, action, detail | 访问追踪 |

## 核心架构决策

1. **商业模式（2026-10-14 起开源免费，`lib/business-mode.ts` 唯一真源）**：`BUSINESS_MODE=open`（默认）
   ——"登录即全功能"：`isPremium()` = 已登录；访客只看首页与 /about，其余全部板块整页
   `LoginGate`（`LOGIN_REQUIRED_MODULES` 10 条，2026-10-15 patch10 扩全，含 `/journey`）；新用户登录后首次自动弹
   3 页翻页式介绍（onboarding-tour，真源 `PAGES`）。`NEXT_PUBLIC_BUSINESS_MODE=legacy` 可回退 v3 买断制（下条语义）。
   **禁止在页面里单独加 `!user` 放行或手写 403**——锁定点一律走 `useLockedAction().guard`。
2. **授权码制（batch9 三类码；open 模式下仅 ai 码有充值意义）**：`invite_codes.kind` 分三种——
   `access`=使用权 / `ai`=纯 AI 额度 / `bundle`=套餐（legacy 默认）。/admin 发码可指定类型。
   **AI 付费点唯一**（open 模式）：注册送 50 次 → 用完兑 ai 码（5 元/50 次）或自带 Key；
   analyze 门控 = 额度>0 扣平台额度 / 额度 0+有自带 Key 走用户 Key / 都没有→引导（无 normal 403）。
   额度消耗走乐观锁扣减（`app_users.ai_credits` + `ai_credit_logs` 流水）；
   **BYOK 自定义源永久免费免登录**；developer 不限次。额度门在 analyze 路由内，前端不要重复实现。
3. **角色升级（legacy 语义）**: normal → premium 通过授权码（access/bundle）；developer 通过 admin 页面密码验证（x-dev-token，按 UTC 日轮换）
4. **AI能力**: 两种来源——内置 AI（服务端 env）+ 自定义接入源（localStorage `ai-sources`，已接入 analyze）。
   2026-09-28 已删除原先写死的 8 家厂商预设
5. **职业数据**: 888个职业；学习资源**三级查找**：`data/career-resources.ts` 职业专属（888/888 有配置）
   → 分类级通用兜底（getBooks/getTutorials/getLearningChannels 已封装，页面无感知）；
   资源纪律：链接必须实测可达才入库，验证不过置空，**绝不编造**；
   目标每职业 5 份专属可自学资源，当前人均 2.06 份（传媒 45 个已达标），按 13 个类别分批推进
6. **规律引擎**: 8维度(laws-*.ts)聚合到laws.ts，4类标签(critical/danger/opportunity/neutral)
7. **命运模拟器**: SVG雷达图 + 6维滑块，推演后AI生成策略建议
8. **侧边栏**: 桌面 w-56 (224px) 固定 / 移动端顶部栏+左侧抽屉（main 用 `pt-12 md:pt-0 md:ml-56`，
   移动端顶栏 h-12 固定定位——2026-10-02 修复过全站遮挡，勿回退）
9. **探索进度**: useModuleVisit hook自动记录（写入唯一入口在根布局 tracker），用户中心展示
10. **高级设置**: 7个人生阶段(可调起止年龄) + 6维偏好权重，存localStorage；destiny/windows/simulation 三模块消费
11. **信息架构**（2026-09-30 收敛）: 模块身份/顺序看 `module-identity.ts`；
    页尾模块路径 `ModuleNextNav` 挂在 root layout（加模块自动生效）；
    长列表统一「每组默认 12 条 + 展开其余 N 个」，页面顶部可加只放 3 条的「聚焦区」
12. **跨模块联动 + 云同步（2026-10-13）**：
    - **云同步白名单 17 键**：客户端 `lib/user-state-sync.ts` 的 `SYNC_KEYS` 与服务端
      `api/user/state/route.ts` 的 Set **两处必须同步改**；写 localStorage 后调 `notifyStateDirty()` 广播
    - **聚合总线**：`lib/user-profile.ts`（纯读取摘要）+ `hooks/use-user-profile.ts`（响应式）；
      窗口标记/健康/模拟器/命运报告/职业标记都从这里读，别在页面里各存一套摘要
    - **新模块的个人表态一律用 `hooks/use-module-marks.ts`**（每 storageKey 独立 store），
      不要再抄 window-marks 的单例实现；收藏星用 `components/shared/fav-star.tsx`
    - 数据流：04 窗口标记 / 08 健康 / 模拟器六维 / 职业标记 → 07 命运报告「行动面」+ AI 上下文；/me 有快照卡
13. **SSE 解析唯一入口**（2026-10-02）: 客户端流式解析只走 `lib/sse-client.ts` 的
    `consumeAiSseStream`（跨 chunk 行缓冲 + 思维链 onReasoning 回调），
    **新页面禁止再手写 chunk.split 解析循环**；AI 面板交互件（停止/复制/计时/思维链）
    统一用 `components/ai/ai-panel-actions.tsx`
14. **localStorage 键名唯一真源**（2026-10-02）: 全部键在 `lib/storage-keys.ts` 登记并带用途注释；
    新键必须 `.v1` 版本后缀；全局年龄只走 `lib/default-age.ts` 读写；
    **禁止在业务代码里新写裸字符串键**
15. **CSS 覆盖全局规则要提特异性（2026-10-13 教训）**：globals.css 存在全局
    `input[type="range"]` 系列规则（元素+attribute = 特异性 0,1,1），单 class（0,1,0）
    覆盖不掉——覆盖时用双类 `.x.x`（0,2,0），改完**重启 dev server + curl 编译产物**验证
    （Turbopack watcher 对 CSS 改动可能不触发）

## 代码风格

- Shadcn/ui语义化变量，禁止硬编码颜色/Hero

> ⚠️ **语义色红线（2026-10-15 教训）**：红=危险/致命、绿=机会/健康、琥珀=警告、
> 按档位递进的难度色阶（emerald→lime→amber→orange→red）——这些**是信息不是装饰**，
> 批量"审美统一"时最容易把它们一起拍平成 `primary`/`ink-accent`/`foreground-70`。
> 该次打磨就让 9 个模块的语义色塌陷（laws 从 38 种掉到 10 种），逐条对照备份才还原。
> 改全局色前先备份到 `_backup/<日期>_before-<批次>/`，还原时**逐条对照备份原值，不要凭
> "语义应该是什么色"猜**。定位回归最快的办法是提取两边全部
> `(text|bg|border|from|to|via)-(emerald|lime|amber|orange|red|green|blue|sky|violet)-NNN`
> 色牌后取差集。有些"看起来像回归"的其实是原始设计（如 windows「精英」态 `dotColor`
> 本就是 `bg-primary`），核对后不要动。
- - 动效 token（globals.css :root 与 lib/motion.ts MOTION_CSS 同步）：微交互 150 / 250 / 400ms + --ease-out-expo（--duration-fast/normal/slow），例外：按压 80ms（仅 opacity）、进度条 700ms；位移 --rise 8px，卡片悬停不位移不加阴影。程序化滚动一律 `scrollToEl`/`scrollToTop`；弹层内滚动容器加 `data-lenis-prevent`；全屏遮罩移动端不加 backdrop-blur\n- **禁止主视觉用蓝紫色渐变和AI味荧光色**——但 `module-identity.ts` 里八个模块的
  图标色板（rose/sky/violet/amber/emerald/indigo/teal/…）是有意例外，用于区分模块。
  边界：主视觉守朱砂红，模块标识色允许各自不同
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
- 职业数据已达成 888 个目标（2026-10-11），专属资源 888/888 有配置；是否继续扩容待定。
  改职业数据后跑 `pnpm check:resources`（覆盖率 / 孤儿键 / 链接 / 份数 / 共用链接五项）
- 第 8 模块 `/health` 已于 2026-10-10 上线；**健康内容红线**：只写医学/运动科学共识范围内的
  常识性建议，不写诊断结论、不替代就医，涉及症状一律引导就医
- 统一卡片体系 / 容器宽度（5 种）/ H1（10 种）/ 513 处硬编码色板收敛（需视觉迭代，见 PRODUCT-AUDIT）
- 触控目标第二梯队（筛选 chips 已放大一档，仍低于 44px 建议值）
- `/api/admin` 改用统一会话（现用按日轮换的 dev-token）、invite 限流改持久存储
  （现为进程内内存，重启即清零，多实例部署会失效）、`streamChat` 首 fetch 补 try/catch
  （`src/lib/ai-stream.ts:53` 附近）、auth/AI 流程测试（仅 `career-resources` 有 vitest 覆盖）
- ~~自定义 API Key 未接入 analyze~~（2026-09-26 已接入；键名分叉已由 8945efe 修复；
  claude/gemini/minimax 协议适配未经真实 Key 实测）
- ~~首页统计数字与真实数据不符~~（已改为真实值 2,019，动态取值）
- ~~页面头部未统一~~（2026-10-01 已抽 `ModulePageHead`）
- ~~AI 面板 6 处重复实现~~（2026-10-02 解析收编 `lib/sse-client.ts`、交互件收编
  `ai-panel-actions.tsx`；完整 UI 收编为单一共享面板仍是远期方向）
- ~~测试期权限全开放~~（2026-10-03 收回，正式预览模型上线；2026-10-13 升级为三层模型 + 双类授权码）

> 全部已知问题（含安全项）见 docs/KNOWN-ISSUES.md（2026-09-25 全量排查）。
