# 已知问题 KNOWN-ISSUES.md

> 2026-09-25 全量排查（通读 src/ 全部业务代码）后整理，按严重程度排序。
> 编号供交接讨论引用。

## P0 · 阻塞运行（2026-09-25 已处理 / 需用户配合）

### #1 缺 `.env` / `.env.local`
只有 `.env.example`。缺 Supabase、AI、DEV_PASSWORD 三组变量时：
登录/邀请码/后台直接 500，AI 分析面板报错。页面本身（静态模块）可以看。
→ **需要用户提供 Supabase 项目与 AI Key 才能恢复**（旧 Supabase 项目是否还活着未知）。

### #2 node_modules 顶层软链断裂 ✅ 已修
`.pnpm` 里 901 个包完好，但 `node_modules/next`、`node_modules/typescript` 等顶层链接失效
（推测项目从别的盘/目录搬过家，junction 失效）。表现：`pnpm ts-check` 报
`Cannot find module .../typescript/bin/tsc`。→ `pnpm install` 重链解决。

### 编码损坏 ✅ 已修
`src/app/layout.tsx`（1 处）与 `src/app/api/ai/analyze/route.ts`（7 处）共 27 个字节损坏
（U+FFFD，每个坏一个汉字），已按上下文还原：
"人生规划 / 建议 / 运气节点 / 这是关于…×4 / 运气雷达 / 缺少必要参数"。

## P1 · 功能缺陷（产品可感知）

### #3 自定义 AI Key 是死功能 ⚠ 核心断层
`/user` 页支持配置 8 家厂商的 Key（localStorage：`api-keys` / `api-active-source` 等），
`/api/ai/test-key` 也能测通。**但 `/api/ai/analyze` 只用服务端 env 的 Key，
完全不接收用户 Key**——用户配了 Key 也不会被 AI 分析使用。
这大概率是"效果不满意"的直接原因之一：没有 env Key 时 AI 功能形同虚设。
→ 修法：analyze 路由增加可选 apiKey/model 参数（服务端代理转发），前端从 localStorage 带上。

### #4 门控逻辑自相矛盾：未登录 = 全解锁
`module-gate.tsx` 第 12 行 `if (!user || canAccessModule(...)) return children`——
未登录直接放行内容；登录成 normal 反而只剩 3 个模块。锁定卡片里"未登录：免费体验"
说明这是有意写的，但与"普通用户 3/7 模块"的产品文案冲突，锁等形同虚设。
→ 需要产品决策：未登录到底是"全体验"还是"仅浏览"。

### #5 认证 = localStorage 明文 JSON，无服务端会话
`auth-context.tsx` 把整个 user（含 role）存 localStorage。浏览器控制台改一下就是
premium/developer，服务端 API 不校验任何会话。个人自用可接受，一旦部署公网即失守。
另外登录态永不校验：改密码/禁用后旧 localStorage 依然"已登录"。

### #6 `/api/admin` 两个越权口
- `exit_developer` **无需任何鉴权**，传任意 userId 即可把任意用户降级；
- `verify` 成功后把 `DEV_PASSWORD` 明文回传，前端存 localStorage（`dev-token`），
  等于把后台密码的持有面从"知道密码的人"扩大到"该浏览器上的任何脚本"。
- `update_user` 的 role 不做白名单校验（传啥存啥）。

### #7 `/api/invite` 无鉴权 + 竞态
- userId 由客户端自报且无会话校验：拿到有效码可给任意账号升级；
- `used_count` 是先读后写（`used_count + 1`），并发兑换可超发；
- 无验证码/限流，可暴力猜码。

## P2 · 数据失真（影响产品可信度）

### #8 宣传数字与真实数据不符 ⚠
首页统计条动画宣传 `288 条规律 / 524 个人生窗口 / 365 个运气因子 / 1538 种职业`，
实际（2026-09-25 逐条核对）：

| 宣传 | 真实 | 差距 |
|---|---|---|
| 288 | 288 | ✓ 唯一对得上 |
| 524 | **479**（7 个标题重复） | -45 |
| 365 | **250** | -115 |
| 1538 | 1539（4 个名称重复） | +1，但唯一名只有 1535 |

luck 的差距可以解释：`luck-red.ts` 的 50 条 `redNodes` **从未被任何页面 import**（死数据），
但即便算上也只有 300，仍差 65。生成脚本（`scripts/archive/gen-luck-v3.js`）按 365 设计，
最终落地时丢了。
→ 修法二选一：把首页数字改成真实值；或补齐数据。（改数字更诚实，工作量也小。）

### #9 数据重名
careers 4 个重名（AI研究员 / UI-UX设计师 / 心理咨询师 / 法务总监），
windows 7 个重名标题（个人品牌建设 / 婚恋决策窗口 等）。列表会展示两个一模一样的卡片。

## P3 · 代码卫生

### #10 死代码与死依赖
- `src/server.ts`：自定义 HTTP server，无任何 script 引用（package.json 走 next dev/start）；
- `drizzle-orm / drizzle-kit / drizzle-zod`：运行时从未使用，仅 schema.ts 用其类型语法；
- `luck-red.ts`：50 条数据无人引用（见 #8）；
- `AGENTS.md` 自述的"命运报告可接 AI""名字模块接 AI"仍未实现（这是 TODO 不是 bug）。

### #11 AGENTS.md 与实现的偏差（2026-09-25 已在本文档纠正）
- "侧边栏 56px 宽" → 实际 `w-56` = **224px**（`main` 的 `md:ml-56` 与之一致，布局无 bug，纯文档错）；
- "coze-coding-dev-sdk (AI/Web搜索)" → package.json 与代码中**均不存在**，AI 走的是自己的 ai-stream.ts；
- "高级设置数据未被其他模块消费" → **过时**，destiny / windows / simulation 三个页面都在消费
  （default-age / life-stages / preference-weights）。

### #12 生成脚本不可执行
`scripts/archive/*.js`（已归档）内写死云端路径 `/workspace/projects/...`，本地跑不了。
只作历史参考；复用需批量替换路径。

### #13 包体积
careers.ts 1.1MB 等静态数据全部打进 client bundle，`/career` 首屏会拖慢。
可改服务端组件取数或动态 import 缓解（未做）。

## 修与不修的建议优先级

1. **#3 自定义 Key 接入 analyze**——产品核心价值，改动集中在 analyze 路由 + AIAnalysisPanel；
2. **#8 首页数字改真实值**——10 分钟的事，诚信问题；
3. **#4 未登录策略**——一行代码的产品决策；
4. #5/#6/#7 若只自用、不部署公网，可暂缓；要部署则必须全修（加服务端会话 + action 鉴权 + 原子自增）。
