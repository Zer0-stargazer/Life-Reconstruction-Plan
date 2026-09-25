# 人生重构计划 - 项目交接手册

> 2026-09-25 修订版。原 2026-07 版的"踩坑记录"完整保留（仍是真金白银的经验），
> 过时信息已就地修正并标注。已知问题全集见 [KNOWN-ISSUES.md](KNOWN-ISSUES.md)。

## 快速启动（本地）

```bash
pnpm install          # 安装依赖（必须 pnpm）
pnpm dev              # 启动开发 (端口 5000)
pnpm ts-check         # 类型检查
pnpm lint             # ESLint
pnpm build            # 生产构建
```

**本地必须有 `.env.local`**（从 `.env.example` 复制）。原版文档说"无 .env、配置由沙箱注入"，
那是扣子云端环境的行为；2026-09-25 起项目已脱离扣子独立运行，缺 env 时
登录/邀请码/后台/AI 分析全部不可用（静态页面不受影响）。

数据库建表：执行 `supabase/schema.sql`（此前仓库没有任何建表脚本，已补）。

## 项目一句话

AI 驱动的人生规划工具，8 个模块帮你做人生关键决策。琥珀金 + 深岩灰视觉风格，
三级用户权限，内置 AI 分析能力。

## 模块速查

| 模块 | 路由 | 权限 | 核心功能（真实数据量，2026-09-25 实测） |
|---|---|---|---|
| 名字 | `/name` | 开放 | 起名器（当前本地随机，未接 AI） |
| 职业 | `/career` | 开放 | **1539** 职业遍历筛选（4 个重名） |
| 命运 | `/destiny` | 🔒 | 命势运报告（规则计算） |
| 规律 | `/laws` | 🔒 | 8 维 **288** 条规律（唯一对得上宣传数的） |
| 努力 | `/simulation` | 🔒 | SVG 雷达图模拟器 |
| 窗口 | `/windows` | 开放 | **479** 人生窗口卡片（宣传 524，差 45） |
| 运气 | `/luck` | 🔒 | **250** 运气节点（宣传 365；luck-red.ts 另有 50 条未被引用） |
| 用户 | `/user` | 登录 | 角色/Key/设置 |
| 后台 | `/admin` | developer | 用户/邀请码管理 |

> 首页统计动画里的 524/365/1538 与上表不符（KNOWN-ISSUES #8），建议改为真实值。

## 改 UI 必读

### 主题变量 (globals.css)

所有颜色使用 CSS 变量, 禁止硬编码:
- `--primary`: 琥珀金 `#b8860b` 系列
- `--background`: 深岩灰基底
- `--card` / `--muted` / `--destructive`: 各语义色

**禁止**: `bg-blue-500`、`#ff0000`、蓝紫渐变、AI 味荧光色

### 字体规则

- 标题: `font-serif` (衬线, 庄重感)
- 编号/标签: `font-mono` (等宽)
- 正文: 默认 sans-serif

### 动效

`globals.css` 内预定义了 `animate-fade-in-up` / `animate-scale-in` / `animate-glow-pulse` / `card-hover` 等, 直接用 className, 不要内联 keyframes。

### 组件库

shadcn/ui 组件在 `src/components/ui/`, 不要从外部引入新 UI 库。如需新组件, 用 `pnpm dlx shadcn@latest add xxx` 添加。

## 数据修改指南

### 职业数据 (careers.ts, 约 1.1MB)

- **1539** 个职业对象, 类型: `Career`（4 个重名：AI研究员/UI-UX设计师/心理咨询师/法务总监）
- `tutorials` 字段仅含 `course` 和 `video` 两种类型 (article/blogger 已移除)
- `books` 字段为豆瓣真实链接
- **修改注意**: 文件数千行, 编辑器可能卡顿; 建议用脚本批量处理而非手动编辑

### 规律数据 (laws-*.ts)

- 8 个文件各 36 条, 共 288 条
- `laws.ts` 是聚合入口, 从各子文件 import
- 标签: `critical` / `danger` / `opportunity` / `neutral`

### 运气节点 (luck-nodes.ts, 约 433KB)

- **250** 个节点（另 `luck-red.ts` 有 50 条 `redNodes`，**未被任何页面引用**）
- `controllability`: none/low/medium/high

### 人生窗口 (windows.ts, 约 247KB)

- **479** 个窗口（7 个重名标题）, 按 `age` 字段分组
- `status`: current/past/future/elite

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

⚠ 注意：`exit_developer` 与 `verify` 两个 action 无需鉴权（KNOWN-ISSUES #6），公网部署前必须修。

## 常见操作

### 新增职业
在 `careers.ts` 的数组末尾追加, 格式:
```ts
{ id: 1540, name: '新职业', category: '技术', ..., tutorials: [{ type: 'course', ... }, { type: 'video', ... }], books: [...] }
```

### 新增规律维度
1. 创建 `laws-新维度.ts`, 导出 `LawItem[]` (36 条)
2. 在 `laws.ts` 中 import 并加入 `dimensions` 数组

### 新增 AI 厂商
1. `user/page.tsx` 的 `PROVIDERS` 数组添加条目
2. `api/ai/test-key/route.ts` 添加测试逻辑
3. `api/ai/analyze/route.ts` 添加调用逻辑
（⚠ 现状：analyze 不读用户 Key，见 KNOWN-ISSUES #3）

### 新增权限模块
1. 页面用 `<ModuleGate>` 包裹
2. `app-sidebar.tsx` 添加导航项 (加锁图标)
3. `auth-context.tsx` 的 `canAccessModule` 逻辑更新

## 文档地图

| 文档 | 用途 |
|---|---|
| README.md | 快速开始 + 模块表 |
| INTRODUCTION.md | 对外介绍（数字已修订） |
| DEVELOPER.md | 开发者参考（部分过时内容已标注） |
| ARCHITECTURE.md | 架构与数据流（2026-09-25 新写，以源码为准） |
| API.md | 5 个 API 路由契约（2026-09-25 新写） |
| DATABASE.md | 表结构 + 建表（2026-09-25 新写） |
| KNOWN-ISSUES.md | 全部已知问题（接手必读） |
| HANDOVER.md | 本文 |
