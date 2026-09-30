# 人生重构计划 - 项目交接手册

> **2026-10-01 修订**。原 2026-07 版的"踩坑记录"完整保留（仍是真金白银的经验），
> 过时信息已就地修正并标注。已知问题全集见 [KNOWN-ISSUES.md](KNOWN-ISSUES.md)，
> 产品侧结论见 [PRODUCT-AUDIT.md](PRODUCT-AUDIT.md)，工程体检见 [HEALTH-REPORT.md](HEALTH-REPORT.md)。

## 快速启动（本地）

```bash
pnpm install          # 安装依赖（必须 pnpm；Windows 下 esbuild postinstall 失败就加 --ignore-scripts）
pnpm dev              # 启动开发（读 $PORT，默认 5000）
pnpm ts-check         # 类型检查
pnpm lint             # ESLint
pnpm validate         # ts-check + lint（CI 同一套）
pnpm build            # 生产构建
```

**本地必须有 `.env.local`**（从 `.env.example` 复制）。原版文档说"无 .env、配置由沙箱注入"，
那是扣子云端环境的行为；2026-09-25 起项目已脱离扣子独立运行，缺 env 时
登录/邀请码/后台/AI 分析全部不可用（静态页面不受影响）。

数据库建表：执行 `supabase/schema.sql`（此前仓库没有任何建表脚本，已补）。

> 踩坑：`next build` 会清空并重建 `.next`。若在受限环境里批量删除被拦（本项目开发机就遇到过），
> 可先 `mv .next .next.old` 再 build；`.gitignore` 已忽略 `.next*/`，改名后的目录不会进版本库。

## 项目一句话

AI 驱动的人生规划工具，**7 个模块 + 1 条个性化时间轴**帮你做人生关键决策。
琥珀金 + 深岩灰视觉风格，三级用户权限，内置 AI 分析能力。

## 模块速查

> **编号与顺序的唯一真源是 `src/lib/module-identity.ts`**，改模块先看那里。
> 阅读路径：时间轴 ★ → 01 名字 → 02 职业 → 03 规律 → 04 窗口 → 05 努力 → 06 运气 → 07 命运 → ↺

| # | 模块 | 路由 | 权限 | 核心功能（2026-10-01 实测数据量） |
|---|---|---|---|---|
| ★ | 时间轴 | `/me` | 开放 | 拖年龄滑块 → 473 窗口三档分档 + 「现在最该看的三类」聚焦层 |
| 01 | 名字 | `/name` | 开放 | 起名器（当前本地随机，未接 AI） |
| 02 | 职业 | `/career` | 开放 | **757** 职业遍历筛选（含黄金/高危赛道快看组） |
| 03 | 规律 | `/laws` | 🔒 | 8 维 **288** 条规律（含「先盯住这三条」聚焦层） |
| 04 | 窗口 | `/windows` | 开放 | **473** 人生窗口卡片（按组默认 12 条折叠） |
| 05 | 努力 | `/simulation` | 🔒 | SVG 雷达图模拟器 |
| 06 | 运气 | `/luck` | 🔒 | **250** 运气节点（每类默认 12 条折叠） |
| 07 | 命运 | `/destiny` | 🔒 | 命势运报告（规则计算） |
| — | 用户 | `/user` | 登录 | 角色/Key/设置 |
| — | 后台 | `/admin` | developer | 用户/邀请码管理 |

> 全站数据合计 **1,768** 条（288 规律 + 473 窗口 + 250 运气 + 757 职业），
> 页面上的 `N=` 读数均为动态取值，不再硬编码。

## 改 UI 必读

### 主题变量 (globals.css)

所有颜色使用 CSS 变量, 禁止硬编码:
- `--primary`: 琥珀金 `#b8860b` 系列
- `--background`: 深岩灰基底
- `--card` / `--muted` / `--destructive`: 各语义色

**禁止**: `bg-blue-500`、`#ff0000`、**主视觉**的蓝紫渐变与 AI 味荧光色

> 边界说明（2026-09-30 起）：七个模块的**图标色板**（rose / sky / violet / amber / emerald /
> indigo / teal，定义在 `module-identity.ts`）是有意偏离这条禁令的，目的是让七个模块一眼可区分。
> **主视觉（Hero、页面底色、按钮）守琥珀金，模块标识色允许各自不同。**

### 字体规则

- 标题: `font-serif` (衬线, 庄重感)
- 编号/标签: `font-mono` (等宽)
- 正文: 默认 sans-serif

### 动效

两种，别用错：

1. **加载即播**：`globals.css` 内预定义 `animate-fade-in-up` / `animate-scale-in` / `animate-glow-pulse` /
   `card-hover` / `progress-shimmer` / `btn-press`，直接用 className，不要内联 keyframes。
   适合**首屏**元素（Hero 标题、页头）。
2. **滚动进场（推荐）**：`<Reveal>{...}</Reveal>`（`src/components/shared/reveal.tsx`）。
   元素进入视口才淡入上移。**`animate-fade-in-up` 是加载即播完的**——页面上滚到下面时动画早结束了，
   等于没有动画，所以列表/卡片/分组一律用 `Reveal`，可传 `delay` 做阶梯。

> ⚠️ 包 `Reveal` 会改变谁是 grid item。卡片原本直接是 grid item 时等高拉伸，
> 外面套一层 div 后内层不再拉伸 → 要么给卡片加 `h-full`，要么把 `Reveal` 包在整个 grid 外面。
> 两种用法在本项目都有：`/laws` `/career` 逐卡包（配 `h-full`），`/windows` `/luck` 整组包。

### 组件库

shadcn/ui 组件在 `src/components/ui/`, 不要从外部引入新 UI 库。如需新组件, 用 `pnpm dlx shadcn@latest add xxx` 添加。

### 加一个新模块要改哪里

信息架构已于 2026-09-30 收敛，正常情况下**只改三处**：

1. `src/lib/module-identity.ts` → 往 `MODULE_IDENTITIES` 加一项（tag / href / title / question /
   desc / metric / unit / icon / iconGradient / ring / tagColor）
2. `src/app/<新路由>/page.tsx` → 新建页面
3. `src/app/api/ai/analyze/route.ts` → 如果要接 AI，往 `MODULE_PROMPTS` 加一套框架 prompt

自动跟上的：首页 Hero 模块索引、首页导览卡、侧栏顺序、页尾「上一步/下一步」路径。
需要手动处理的：`components/auth/module-gate.tsx` / `auth-context.tsx` 的权限清单、`docs/` 里的数据量表格。

### 页面头部的现状（未统一）

7 个模块页的页头目前是各写各的（`MODULE · 03` 这类编号硬编码在页面里），
**还没抽成 `ModulePageHead`**。改的时候注意别把 `MODULE · 0X` 写错——以 `module-identity.ts` 为准。

## 数据修改指南

### 职业数据 (careers.ts, 192KB)

- **757** 个职业对象, 类型: `Career`
  （2026-09-26 去重 1539→1535；2026-09-28 移除 778 条机器生成模板条目 → **757**，历史数据在 git `f8edce0` / `8945efe`）
- 每个职业含 `salary` / `trend` / `aiRisk` / `selfStudyScore` / `keySkill`；
  学习资源按**分类**查找（`getTutorials` / `getBooks` / `getLearningChannels`），不是逐个职业写死
- **修改注意**: 幂等性靠 `id` 唯一；追加时取 `max(id)+1`（当前末位 id 是 1342，历史上删过中间项，不要用 `length+1`）

### 规律数据 (laws-*.ts)

- 8 个文件各 36 条, 共 288 条
- `laws.ts` 是聚合入口, 从各子文件 import
- 标签: `critical` / `danger` / `opportunity` / `neutral`
- 每条含 `intensity`(1-5) / `breakthrough`(挽回概率%) / `strategies[]`，`/laws` 的聚焦层按
  「`critical` 优先 → `breakthrough` 升序」挑 3 条

### 运气节点 (luck-nodes.ts, 424KB)

- **250** 个节点（原 `luck-red.ts` 50 条 `redNodes` 从未被 import，2026-09-28 已删）
- `controllability`: none/low/medium/high

### 人生窗口 (windows.ts, 240KB)

- **473** 个窗口（2026-09-26 已去重，原 7 组重名）, 按 `age` 字段分组；文件含两批格式：
  顶格单行批（原始 id 1-365）+ 缩进多行批（id 366-479，内容更详细），批量处理脚本需同时兼容两种格式
- `status`: current/past/future/elite
- `/me` 的「正在开启」聚焦层按 `lockForceScore` 降序取 3 条

## 踩坑记录（2026-07 原版，经验仍有效）

### 1. 大文件编辑陷阱 (careers.ts)

**问题**: 直接用 `edit_file` 工具编辑 careers.ts, 超时或正则匹配失败。
**原因**: 文件数千行, 单次替换开销巨大; 多行正则跨行匹配不稳定。
**教训**:
- 用 Python 脚本读写整个文件做批量替换, 不要依赖行级编辑工具
- 替换后用 `grep` 验证残留, 不要信任单次替换的输出
- ESLint 会输出 `deoptimised the styling` 警告, 这是正常的 (文件 > 500KB)

### 2. 搜索页/首页敷衍链接

**问题**: AI 生成教程链接时大量输出 `search?keyword=xxx` 或平台首页 URL, 看似有链接实则无内容。
**原因**: LLM 倾向于生成"看起来像链接"的 URL, 尤其是搜索页和平台首页。
**教训**:
- 任何 AI 生成的 URL 必须验证: 是否包含 `search?`、`keyword=`、是否只是域名
- 批量生成后必须跑质量统计脚本, 不要靠肉眼检查
- 敷衍链接的典型模式: `bilibili.com/search?query=xxx`、`zhihu.com/search?q=xxx`、`study.163.com/find.htm?keyword=xxx`

### 3. Web Search SDK 批量脚本超时

**问题**: 用 `SearchClient` 写循环搜索脚本, 跑到几十次后卡住不返回。
**原因**: SDK 内部连接池耗尽, 未做请求间隔和超时处理。
**教训**:
- 每次搜索后加 `await new Promise(r => setTimeout(r, 1000))` 间隔
- 设置合理的请求超时
- 批量搜索分批执行, 每批 20-30 个, 不要一次跑几百个

### 4. 类型定义与数据不同步

**问题**: 修改了 tutorials 类型 (移除 article/blogger), 但页面渲染代码仍引用旧类型, 导致编译通过但运行时样式丢失。
**原因**: 类型定义为 union type, 删除成员后 TS 不报错 (只是分支不可达), 但页面渲染代码的 if-else 分支还在。
**教训**:
- 修改 union type 时必须全局搜索旧值, 不能只改类型定义
- 用 `grep -r "article\|blogger" src/` 检查所有引用点
- 同步删除未使用的 import (如 `FileText`, `UserCircle`)

### 5. Python 处理 TypeScript 的正则陷阱

**问题**: Python 正则 `re.findall(r"type: '(\w+)'", content)` 匹配不到跨行的 tutorial 条目。
**原因**: tutorial 条目跨多行, 简单正则只匹配单行片段。
**教训**:
- 处理跨行结构化数据时, 先按 `{` `}` 配对解析, 不要用行级正则
- 用 `re.DOTALL` + 非贪婪匹配处理跨行块
- 更稳妥: 按 `id:` 拆分职业块, 再在块内解析

### 6. 替换后格式破坏 (双逗号/空 URL)

**问题**: 批量删除 tutorial 条目后, 出现 `}, {` → `}, , {` 的双逗号, 以及删除 URL 后留下 `url: ''` 空字段。
**原因**: 简单的字符串替换不处理上下文逗号和字段清理。
**教训**:
- 批量删除数组元素后必须检查并清理连续逗号
- 删除 URL 字段时要连同整个 `url: 'xxx'` 片段一起删, 不要留空值
- 替换完成后跑 `grep ",," file` 和 `grep "url: ''" file` 验证

### 7. B站频道 URL 格式

**问题**: B站用户空间 URL 格式多样: `space.bilibili.com/数字` / `space.bilibili.com/数字/` / 带中文字符。
**教训**: 统一使用 `https://space.bilibili.com/{uid}` 格式, 不要带尾部斜杠或中文名。

### 8. 编码损坏（2026-09-25 新增）

**问题**: layout.tsx 与 api/ai/analyze/route.ts 共 27 处汉字变成 U+FFFD（"人生规划"→"???生规划"）。
**原因**: 某次保存时编码被破坏（UTF-8 文件被按非 UTF-8 读写）。
**教训**: 已修复；后续编辑中文文件务必确认以 UTF-8 无 BOM 读写，改完全局搜 `\ufffd`。

## 开发者入口

1. 注册普通账号
2. 访问 `/admin`, 输入 `DEV_PASSWORD`
3. 后端通过 `x-dev-token` header 验证, 将当前用户升级为 developer 角色

⚠ 注意：`verify` action 曾在无鉴权状态下可被调用（KNOWN-ISSUES #6，2026-09-26 已部分加固）。
公网部署前请复核 `api/admin/route.ts` 的所有 action 分支。

## 常见操作

### 新增职业
在 `careers.ts` 的数组末尾追加, 格式:
```ts
{ id: 1343, name: '新职业', category: '技术', salary: '15-40W', trend: 'up', aiRisk: 'low',
  description: '...', keySkill: '...', selfStudyDifficulty: 'medium', selfStudyScore: 6 }
```
（`id` 取当前最大值 +1，**不要用数组长度**——历史删除过中间项）

### 新增规律维度
1. 创建 `laws-新维度.ts`, 导出 `LawItem[]` (36 条)
2. 在 `laws.ts` 中 import 并加入 `dimensions` 数组
3. `DIMENSION_ICONS`（`laws/page.tsx`）补一个图标

### 新增 AI 厂商 / 接入源
现状是**两种来源**（2026-09-28 简化，写死的 8 家厂商预设已删）：
1. 内置源：只配服务端 env（`AI_API_URL` / `AI_API_KEY` / `AI_MODEL`）
2. 自定义源：用户在 `/user` 页自己填 baseUrl + protocol + key + model，走 `lib/ai-sources.ts`
   要加一种**新协议**，改 `lib/ai-stream.ts` 的适配分支 + `ai-providers.ts` 的 `resolveAiSource()`

### 新增权限模块
1. 页面用 `<ModuleGate modulePath="/xxx">` 包裹
2. `auth-context.tsx` 的 `canAccessModule` 更新（**这是权限判定的唯一权威**，
   `module-gate.tsx` 里那份是历史重复，见 KNOWN-ISSUES #4）
3. 侧栏顺序不用手改——`app-sidebar.tsx` 已按 `module-identity.ts` 的实际顺序排

## 文档地图

| 文档 | 用途 |
|---|---|
| README.md | 快速开始 + 模块表 + 目录结构 |
| PROJECT-BRIEF.md | 项目全景（评审版）：产品视角 / Roadmap / 待决策 |
| INTRODUCTION.md | 对外介绍（数字已修订） |
| DEVELOPER.md | 开发者参考（部分过时内容已标注） |
| ARCHITECTURE.md | 架构与数据流 + **信息架构（模块身份/阅读路径/长列表范式）** |
| API.md | 5 个 API 路由契约 |
| DATABASE.md | 表结构 + 建表 |
| KNOWN-ISSUES.md | 全部已知问题（接手必读） |
| HEALTH-REPORT.md | 全项目体检报告（工程/数据/文档/构建） |
| PRODUCT-AUDIT.md | 产品打磨审计 + 第十节「信息架构重做」 |
| HANDOVER.md | 本文 |
