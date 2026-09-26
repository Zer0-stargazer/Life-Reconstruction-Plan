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

### #2b careers.ts 类型注解损坏 ✅ 已修
`careers.ts` 第 45 行 `export const careers: Career[{` 缺了 `] =`（应为 `Career[] = [`）。
一个字符级损坏造成 **66136 个连锁语法错误**，整个项目无法编译——
推断 2026-07-14 最后一次修改 careers.ts 后项目就处于不可构建状态。
依赖链接修好后跑 `pnpm ts-check` 才暴露。已修复，ts-check 0 错误。

### 编码损坏 ✅ 已修
`src/app/layout.tsx`（1 处）与 `src/app/api/ai/analyze/route.ts`（7 处）共 27 个字节损坏
（U+FFFD，每个坏一个汉字），已按上下文还原：
"人生规划 / 建议 / 运气节点 / 这是关于…×4 / 运气雷达 / 缺少必要参数"。

## P1 · 功能缺陷（产品可感知）

### #3 自定义 AI Key 是死功能 ✅ 已修（2026-09-26）⚠ 核心断层
原状：`/user` 页支持配置 8 家厂商的 Key（localStorage：`api-keys` / `api-active-source` 等），
`/api/ai/test-key` 也能测通。**但 `/api/ai/analyze` 只用服务端 env 的 Key，
完全不接收用户 Key**——用户配了 Key 也不会被 AI 分析使用。
这大概率是"效果不满意"的直接原因之一：没有 env Key 时 AI 功能形同虚设。

已修：
- 新增 `src/lib/ai-providers.ts`（厂商白名单 + baseUrl 映射）与 `src/lib/active-ai-client.ts`（前端读取当前 AI 源）；
- `ai-stream.ts` 增加 `streamChatAuto` 多协议适配：doubao/glm/qwen/deepseek/mimo 走 OpenAI 兼容流，
  claude/gemini 走各自私有 SSE 协议，minimax 沿 OpenAI delta 格式（**后三家未经真实 Key 实测**）；
- `analyze` 路由接收可选 `ai: { provider, apiKey, model }`，无效配置返回 400（不静默回退）；
- `AIAnalysisPanel` 每次请求自动携带用户当前选中的 AI 源，并把服务端错误消息透出。

### #4 门控逻辑自相矛盾：未登录 = 全解锁
`module-gate.tsx` 第 12 行 `if (!user || canAccessModule(...)) return children`——
未登录直接放行内容；登录成 normal 反而只剩 3 个模块。锁定卡片里"未登录：免费体验"
说明这是有意写的，但与"普通用户 3/7 模块"的产品文案冲突，锁等形同虚设。
→ 需要产品决策：未登录到底是"全体验"还是"仅浏览"。

### #5 认证 = localStorage 明文 JSON，无服务端会话
`auth-context.tsx` 把整个 user（含 role）存 localStorage。浏览器控制台改一下就是
premium/developer，服务端 API 不校验任何会话。个人自用可接受，一旦部署公网即失守。
另外登录态永不校验：改密码/禁用后旧 localStorage 依然"已登录"。

### #6 `/api/admin` 两个越权口 ✅ 部分已修（2026-09-26）
- ~~`exit_developer` 无需任何鉴权~~ → **已修**：现在要求 `x-dev-token`；`/admin` 页 `handleDevLogout` 已补带 token；
- ~~`verify` 成功后把 `DEV_PASSWORD` 明文回传~~ → **已修**：verify 现在只回传 `sha256("lrs-dev-session:" + DEV_PASSWORD)`，
  服务端 `verifyDevAuth` 改为比对同一哈希。**注意：旧浏览器里存的 `dev-token`（明文密码）会失效，需重新验证一次**；
- ~~`update_user` 的 role 不做白名单校验~~ → **已修**：仅接受 normal/premium/developer。

### #7 `/api/invite` 无鉴权 + 竞态
- userId 由客户端自报且无会话校验：拿到有效码可给任意账号升级；
- `used_count` 是先读后写（`used_count + 1`），并发兑换可超发；
- 无验证码/限流，可暴力猜码。

## P2 · 数据失真（影响产品可信度）

### #8 宣传数字与真实数据不符 ✅ 已修（2026-09-26）
原状：首页统计条动画宣传 `288 条规律 / 524 个人生窗口 / 365 个运气因子 / 1538 种职业`，
实测（2026-09-25 逐条核对 + 2026-09-26 双批次精扫）：

| 宣传 | 原始真实 | 差距原因 |
|---|---|---|
| 288 | 288 | ✓ 唯一对得上 |
| 524 | 479 | windows 有两批数据：顶格单行批 365 条 + 缩进多行批 114 条 |
| 365 | 250 | `luck-red.ts` 的 50 条 `redNodes` 从未被 import；生成脚本按 365 设计，落地时丢了 |
| 1538 | 1539 | id=1 的 AI研究员 藏在 `export const` 行，易漏计 |

已修（两步）：
1. **数据去重**（见 #9）：careers 1539→**1535**，windows 479→**473**；
2. **首页统计改为真实值**：288 条规律 / 473 个人生窗口 / 250 个运气因子 / 1535 种职业。

### #9 数据重名 ✅ 已修（2026-09-26）
原状：careers 4 组重名（AI研究员/UI-UX设计师/心理咨询师/法务总监），
windows 7 组重名标题。列表会展示两个一模一样的卡片。

处理结果（删除 9 条、改名 1 条，全部保留在 git 历史 f8edce0 中可找回）：

- careers 删除：id66（UI/UX设计师·科技批，保留 id219 设计批）、id377（心理咨询师·服务批，
  保留 id149 医疗批）、id335（法务总监·管理批，保留 id257 法律批）、id1（AI研究员·科技批，
  保留 id423 科研批）→ **1535 条，名称全唯一**；
- windows 删除：id222 个人品牌建设、id185 投资认知变现、id258 智慧传承、id356 社会贡献窗口
  （均保留同批先出现者）；跨批重名删除精简版 id17 婚恋决策窗口、id110 第一桶金积累
  （保留多行批的详细版 id396/id384）→ **473 条，标题全唯一**；
- windows 改名：id255 `慢性病管理`(62-70 与慢性病共处的策略) → **`慢性病共处`**，
  与 id49(50-55 病症显现) 语义不同，属两个阶段故保留并区分。

## P3 · 代码卫生

### #10 死代码与死依赖 ✅ 已清理（2026-09-26）
- ~~`src/server.ts`~~：**已删除**（自定义 HTTP server，无任何 script 引用）；
- ~~`drizzle-orm / drizzle-kit / drizzle-zod`~~：**已从 package.json 移除**；
  连带删除仅用其类型语法的 `src/storage/database/shared/schema.ts` 与 `relations.ts`
  （表结构以 `supabase/schema.sql` 为准）；
- `luck-red.ts`：50 条"红运"节点数据，从未被页面 import。**保留**（属当年规划的功能资产，
  53KB、未被引用时零打包成本）；若确定不做该功能可删，历史版本在 git；
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

## 修与不修的建议优先级（2026-09-26 更新）

1. ~~#3 自定义 Key 接入 analyze~~ ✅ 已修（claude/gemini/minimax 协议适配未经真实 Key 实测，用前先在 /user 页测一下）；
2. ~~#8 首页数字改真实值~~ ✅ 已修；
3. ~~#9 数据去重~~ ✅ 已修；#6 admin 三处 ✅ 已修；
4. #4 未登录策略——仍需产品决策（当前"未登录全解锁、登录后反而受限"的矛盾还在）；
5. #5/#7 若只自用、不部署公网，可暂缓；要部署则必须全修（加服务端会话 + 邀请码原子自增）。
