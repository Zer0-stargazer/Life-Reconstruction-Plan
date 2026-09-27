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

### #2c 虚拟 store 链接残缺 + 残留目录污染 ✅ 已修（2026-09-27）
比 #2 更深一层：`.pnpm` 各包目录存在，但**包内部的依赖链接大面积缺失**，导致 dev server
能 Ready 却一编译就 500（`Cannot find module 'picocolors'`、`Can't resolve 'scheduler'`）。
根因是 `.npmrc` 的 `strictStorePkgContentCheck=false` + `verifyStoreIntegrity=false`
（扣子环境写入），pnpm 因此不校验也不修复残缺链接。

另外，项目根若残留 `node_modules.deleted_partial*` 之类的目录，Turbopack 编译 CSS 时会报
`Cannot depend on path ... outside of root directory` 并直接 500 —— 必须**移出项目根**而不只是放着。

→ 完整重建步骤见 `docs/DEVELOPER.md`「本地环境重建 (Windows / pnpm)」。
现状：首页与 9 个主要页面全部 200，dev 日志 0 错误。
**长期建议**：删掉 `.npmrc` 里那两行让 pnpm 恢复自愈能力。

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

### #5 认证 = localStorage 明文 JSON，无服务端会话 ✅ 大部分已修（2026-09-27）
原状：把整个 user（含 role）存 localStorage。浏览器控制台改一下就是 premium/developer，
服务端 API 不校验任何会话。另外登录态永不校验：改密码/禁用后旧 localStorage 依然"已登录"。

已修（补上服务端会话层 `src/lib/session.ts`）：
- 登录/注册成功后服务端签发 **HMAC-SHA256 签名令牌**（载荷 userId/nickname/role/exp，7 天有效），
  前端存 `auth-token`；受保护接口用 `Authorization: Bearer <token>` 校验身份；
- 令牌过期/被篡改一律判无效；role 变更（如兑换邀请码升级）时重新签发，前端同步更新；
- 启动时若发现"有 auth-user 但没有 auth-token"（旧版本残会话）→ 判为未登录，
  避免出现"看着登录了但一操作就失败"。

**尚未完成**：只有 `/api/invite` 接了会话校验。`/api/admin` 仍走独立的 `x-dev-token`
（开发口令机制，不算用户会话）。localStorage 里的 user 对象仍只用于界面展示，
权限判定的唯一依据是服务端令牌——若将来接口要严格鉴权，逐个补 `sessionFromRequest()` 即可。

### #7 `/api/invite` 无鉴权 + 竞态 ✅ 已修（2026-09-27）
- ~~userId 由客户端自报且无会话校验~~ → **已修**：userId 一律取会话令牌（见 #5），
  请求体里的 userId 不再被信任；额外校验 `is_active`，兑换成功重新签发令牌；
- ~~`used_count` 先读后写，并发可超发~~ → **已修**：乐观锁
  `.update({used_count: n+1}).eq("id", id).eq("used_count", n)`，写空说明名额被抢走 → 409；
  顺序改为"先占位再升级"，升级失败会把名额还回去；
- ~~无限制暴力猜码~~ → **已修**：按 IP 的失败计数限流（15 分钟窗口，失败 10 次后 429）。

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

### #12 生成脚本不可执行 ✅ 已修（2026-09-27）
原状：`scripts/archive/*.js` 写死云端路径 `/workspace/projects/...`（扣子编程 CLI 的环境），
另有部分脚本依赖"必须在项目根目录下运行"，本地都跑不了。

已修：11 个脚本统一注入基于 `__dirname` 的项目根解析 helper（`const ROOT = path.resolve(__dirname,'..','..')`
+ `P(p) => path.join(ROOT, p)`），所有读写路径改为 `P('src/data/...')`。
现在**从任意目录运行都可以**。校验：11 个脚本 `node --check` 全通过，15 处 `P()` 引用全部能解析到真实文件
（`luck-raw*.json` 已随脚本归档到 `scripts/archive/`，引用同步更新）。
→ 详见 `scripts/README.md`。注意这些脚本会直接改写 `src/data/`，跑之前先 commit。

### #13 包体积
careers.ts 1.1MB 等静态数据全部打进 client bundle，`/career` 首屏会拖慢。
可改服务端组件取数或动态 import 缓解（未做）。

## 修与不修的建议优先级（2026-09-27 更新）

1. ~~#3 自定义 Key 接入 analyze~~ ✅ 已修（claude/gemini/minimax 协议适配未经真实 Key 实测，用前先在 /user 页测一下）；
2. ~~#8 首页数字改真实值~~ ✅ 已修；
3. ~~#9 数据去重~~ ✅ 已修；#6 admin 三处 ✅ 已修；
4. ~~#7 邀请码无鉴权 + 竞态~~ ✅ 已修；~~#5 无服务端会话~~ ✅ 大部分已修（会话层已落地）；
5. ~~#12 生成脚本不可执行~~ ✅ 已修；
6. **#4 未登录策略——仍需产品决策**（当前"未登录全解锁、登录后反而受限"的矛盾还在，
   见下）；
7. #13 包体积：只影响 `/career` 首屏速度，自用可缓；
8. 剩余小项：`/api/admin` 改用统一会话（现用独立 dev-token）、invite 限流改为持久存储
   （现为进程内内存，重启即清零，多实例部署会失效）。

### #4 待拍板的两个方案（需要你决定，我不擅自改产品行为）

矛盾点：`module-gate.tsx` 第 12/63 行是 `if (!user || canAccessModule(path))`——未登录直接放行；
但 `auth-context.tsx` 的 `canAccessModule` 里是 `if (!user) return false`。两处口径打架，
实际效果是**未登录能看全部 7 个模块，登录成普通用户反而只剩 3 个**，锁形同虚设。

- **方案 A（推荐，与现有文案一致）**：未登录 = 全锁，必须登录。删掉 module-gate 里那个 `!user ||`，
  让门控只由 auth-context 一处决定；锁定卡片第三栏改成"未登录 / 需先登录"。
- **方案 B（利于拉新）**：未登录 = 同普通用户，可看 3 个基础模块（名字/职业/窗口），
  想看完整 7 个再引导注册。改动同样只落在 auth-context 一处，把 `if (!user) return false`
  改成按 `NORMAL_USER_MODULES` 判断。

无论选哪个，都建议顺手把 module-gate 里重复的 `!user ||` 去掉——门控逻辑应该只有一个权威来源。
