# 人生重构计划 - 开发者文档

> ⚠ **2026-09-25 校注（09-26 更新）**：本文写于扣子云端环境（2026-07），以下条目已过时，
> 以 [ARCHITECTURE.md](ARCHITECTURE.md) / [API.md](API.md) / [KNOWN-ISSUES.md](KNOWN-ISSUES.md) 为准：
> 1. `coze-coding-dev-sdk` 不在依赖中，AI 走自写的 `src/lib/ai-stream.ts`（OpenAI-compatible SSE）
> 2. "运行时注入、无需 .env" 是扣子云端行为；本地必须 `.env.local`（含 `SUPABASE_*`、`AI_*`、`DEV_PASSWORD`）
> 3. 数据条目（2026-09-26 去重后）：careers **1535**、windows **473**、luck **250**（luck-red.ts 50 条为预留数据）
> 4. `/api/invite` **无鉴权**（userId 客户端自报，暂未修）；analyze 已接收用户自带 Key（`ai` 字段）
> 5. `server.ts` 已删除、drizzle 三件套已移除；"高级设置未被消费"已过时——destiny/windows/simulation 在消费
> 6. 本地无 Node 24 硬约束，Node 22 可跑

## 技术架构

### 运行时环境

- Node.js 24, pnpm 包管理
- 端口: 5000 (通过 `DEPLOY_RUN_PORT` 环境变量读取, 禁止硬编码)
- 构建系统: Next.js 16 App Router + tsup (自定义 server.ts)

### 核心依赖

| 包 | 版本 | 用途 |
|---|---|---|
| next | 16.1.1 | 全栈框架 (App Router) |
| react / react-dom | 19.2.3 | UI |
| @supabase/supabase-js | 2.95.3 | 数据库客户端 |
| coze-coding-dev-sdk | ^0.7.19 | AI 分析 + Web 搜索 |
| recharts | 2.15.4 | 图表 (命运模拟器雷达图) |
| lucide-react | ^0.468.0 | 图标 |
| drizzle-orm / drizzle-kit | ^0.45.1 / ^0.31.8 | ~~数据库 ORM~~ **2026-09-26 已移除** |

### 环境变量 (运行时注入, 无需 .env)

| 变量 | 说明 |
|---|---|
| `COZE_SUPABASE_URL` | Supabase 项目 URL |
| `COZE_SUPABASE_ANON_KEY` | Supabase 匿名 Key |
| `DEPLOY_RUN_PORT` | 服务监听端口 (默认 5000) |
| `COZE_WORKSPACE_PATH` | 工作目录 |
| `COZE_PROJECT_DOMAIN_DEFAULT` | 对外访问域名 |

### 数据库 (Supabase PostgreSQL)

```sql
-- 三张表, RLS 场景 A (公共读写), 权限由 API 路由控制
app_users (nickname 唯一, password_hash, role: normal|premium|developer, ...)
invite_codes (code 唯一, max_uses, used_count, is_active, ...)
access_logs (user_id, action, detail, ...)
```

### API 路由

| 路由 | 方法 | 认证 | 说明 |
|---|---|---|---|
| `/api/auth` | POST | 无 | 注册/登录 (body: `{action,nickname,password}`) |
| `/api/invite` | POST | 需登录 | 兑换邀请码 (body: `{code,nickname}`) |
| `/api/ai/analyze` | POST | 无 | AI 分析 SSE 流式 (body: `{prompt,type,model?,apiKey?}`) |
| `/api/ai/test-key` | POST | 无 | 测试用户 API Key (body: `{provider,apiKey}`) |
| `/api/admin` | GET/POST/PUT/DELETE | x-dev-token | 开发者后台 (用户/邀请码 CRUD) |

### 认证流程

1. 注册: POST `/api/auth` → Supabase 插入 `app_users` → 返回 user 对象
2. 登录: POST `/api/auth` → 查询 `app_users` → bcrypt 比对 → 返回 user 存入 localStorage
3. 前端: `AuthContext` 从 localStorage 读取用户状态, `ModuleGate` 按角色控制页面访问
4. 开发者: `/admin` 页面输入密码 → 后端验证 `x-dev-token` → 升级当前用户角色为 developer

### 权限模型

```
normal    → 3/7 模块 (名字/职业/窗口)
premium   → 全部模块 + AI 分析
developer → 全部模块 + AI 分析 + /admin 后台
```

升级路径: normal → premium (邀请码) → developer (admin 密码验证)

### 数据文件

| 文件 | 大小 | 条目 | 说明 |
|---|---|---|---|
| `careers.ts` | 1.6MB | 1538 职业 | 12 行业分类, tutorials: course/video, books: 豆瓣链接 |
| `luck-nodes.ts` | 548KB | 365 节点 | 4 类 (红利/黑天鹅/风险/暗门), 影响等级 1-5 |
| `windows.ts` | 232KB | 524 窗口 | 按年龄分组, status: current/past/future/elite |
| `laws-*.ts` | ~40行/文件 | 288 规律 | 8 维度 × 36 条, 4 标签: critical/danger/opportunity/neutral |

### 全局状态

- `AuthContext` (React Context): 用户角色/权限/邀请码兑换
- `localStorage`: 用户信息、API Keys (8 厂商)、高级设置 (人生阶段/偏好权重)、模块访问记录
- 无全局状态管理库 (无 Redux/Zustand)

### 动效系统 (globals.css)

| 类名 | 用途 |
|---|---|
| `animate-fade-in-up` | 页面元素入场 |
| `animate-scale-in` | 卡片弹入 |
| `animate-glow-pulse` | 当前窗口脉冲 |
| `animate-shimmer` | 进度条微光 |
| `card-hover` | 卡片悬浮阴影 |
| `btn-press` | 按钮按压反馈 |
| `grain-texture` | 背景纹理 |

## 关键实现细节

### AI 分析 (SSE 流式)

`/api/ai/analyze` 使用 `coze-coding-dev-sdk` 的 LLM 能力, Response Header:
```
Content-Type: text/event-stream
Transfer-Encoding: chunked
```
前端通过 `fetch` + `body.getReader()` 逐帧读取, 打字机式渲染。

### API Key 管理

8 个厂商密钥存储在 `localStorage`, 测试接口 `/api/ai/test-key` 逐厂商调用 API 验证:
Gemini / Claude / GLM / Qwen / DeepSeek / 豆包 / MiniMax / MiMo

### 命运模拟器

SVG 手绘雷达图 (6 维度) + 滑块交互, 推演后调用 AI 生成策略建议。非 Canvas, 纯 SVG + CSS 动画。

## 已知限制

- 无服务端 Session, 认证完全依赖 localStorage → 刷新不丢失但换设备需重新登录
- RLS 未启用行级安全, 权限由 API 路由层控制
- careers.ts 1.6MB 会导致 ESLint deoptimise (仅影响 lint 速度, 不影响功能)
- 高级设置数据存 localStorage, 未被其他模块消费
- 名字模块本地随机生成, 未接入 AI 流式

## 本地环境重建 (Windows / pnpm)

本项目 `node_modules` 曾出现过 **pnpm 虚拟 store 链接残缺** 导致 `next dev` 起得来但页面 500。若遇到
`Cannot find module 'picocolors'`、`Can't resolve 'scheduler'` 一类报错, 按下面顺序一次性修复:

```bash
# 1) 把坏掉的 node_modules 移开 (不要 rm —— Windows Defender 下删除极慢)
mv node_modules node_modules.deleted_partial

# 2) 用系统 warm store 重装 (esbuild postinstall 在 Windows 会失败, 加 --ignore-scripts)
CI=1 pnpm install --ignore-scripts --prefer-offline \
  --store-dir=C:/Users/Administrator/AppData/Local/pnpm/store/v3

# 3) 把残留目录移出项目根 (留在项目里会被 Turbopack 扫到, 报 "outside of root directory")
mv node_modules.deleted_partial /c/Users/Administrator/.workbuddy/tmp-stale-nm/

# 4) 清缓存后启动
rm -rf .next && pnpm dev
```

要点说明:

- 根因是 `.npmrc` 中 `strictStorePkgContentCheck=false` + `verifyStoreIntegrity=false` (扣子环境写入),
  pnpm 因此不校验也不修复残缺的虚拟 store 链接。**长期建议把这两行删掉**, 让 pnpm 能自愈。
- 残留的 `node_modules.deleted_partial*` 必须**移出项目根**, 否则 Turbopack 编译 CSS 时会因路径
  超出项目 root 直接 500 —— 这一步最容易被忽略。
- `--ignore-scripts` 只跳过 esbuild 的 postinstall (Next 用 SWC 编译, 不依赖 esbuild), 对开发/构建无影响。
- 验证链接是否真的建好, 用 `ls -d node_modules/.pnpm/<pkg>@*` 看真实目录名, 不要凭记忆猜版本号。

启动后自检: `curl -o /dev/null -w "%{http_code}" http://localhost:5000/`, 预期 200。
主要页面: `/laws` `/windows` `/luck` `/career` `/name` `/destiny` `/simulation` `/user` `/admin`。
