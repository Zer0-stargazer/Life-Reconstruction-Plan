# 已知问题 KNOWN-ISSUES.md

> 2026-09-25 全量排查（通读 src/ 全部业务代码）后整理，按严重程度排序。
> 编号供交接讨论引用。
>
> **状态快照（2026-10-01）**：本文档记录的是**排查时的原状与当时的修复**，
> 后续又发生两轮变化，读的时候请注意：
> - **careers 从 1535 进一步降到 757**（`8945efe` 移除 778 条机器生成的模板条目），
>   全站数据合计 **1,768** 条。本文中所有 `1535 / 1538 / 1539` 均为当时的历史数字。
> - 2026-09-29 全项目体检发现「#3 自定义 AI Key 已修」的结论**不成立**
>   （存在 `ai-active-source` / `api-active-source` 键名分叉），已于 `8945efe` 修复。
>   详见 `HEALTH-REPORT.md` P1#1。
>
> 当前仍未解决的条目，见文末「修与不修的建议优先级」。

## P0 · 阻塞运行（2026-09-25 已处理 / 需用户配合）

### #1 缺 `.env` / `.env.local` 🟡 部分解决（2026-09-28 更新）
已提供并验证 **AI 三件套**（api.apikey.fan 中转站 / 智谱 GLM-5.3-flash）：
`AI_API_URL` `AI_API_KEY` `AI_MODEL=glm-5.3-flash`，`DEV_PASSWORD` 与 `SESSION_SECRET` 也已配本地值。
→ **AI 分析链路已端到端跑通**（详见下方"AI 实测记录"）。

**仍缺 Supabase 三件套**：`SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`。
缺它们时：注册登录、邀请码兑换、admin 后台仍然 500；静态页面与 AI 分析（走 env Key）不受影响。

#### AI 实测记录（2026-09-28）
- 中转站 `https://api.apikey.fan/v1` 可用，模型列表：glm-5.3-flash / glm-5.3-flashx / glm-5.3 / glm-5.2 / glm-5.1
- 该 Key 标注"智谱"，但**属于中转站而非官方**，在 `/user` 页手填并选"智谱"会失败
  （项目内置 glm 的 baseUrl 是官方 `open.bigmodel.cn`，实测报"令牌已过期或验证不正确"）
  → **已解决（2026-09-28）**：新增自定义 AI 接入源，地址/协议/Key/模型都由用户填，
    实测同一 Key 通过自定义端点：测连通 3.4 秒 ✅、analyze 出 1703 字 ✅。详见 API.md。
- **后续清理（2026-09-28）**：既然自定义源能覆盖同样场景，已把写死的 8 家厂商预设整体删除——
  官方地址 + 中转站 Key 对不上，硬编码的模型 id 也已过期，留着只会误导。
  现在 AI 来源只有两种：内置 AI（服务端 env）与自定义源（用户填地址）。
- GLM-5 是推理模型：SSE 的 delta 里先出 `reasoning_content` 再出 `content`；
  本项目只取 `delta.content`，思维链不会外泄到界面，但会拖慢首字
- **性能**：同一请求 开启 thinking 112 秒 / 关闭 6 秒 → 已在 `ai-stream.ts` 默认关闭，
  可用 `AI_THINKING=1` 打开
- **端到端（/api/ai/analyze）**：71 秒出全文，1756 字，结构完整
  （窗口本质 / 时间判断 / 行动清单 / 错过后果 / 补救路径），含具体数字与反常识洞察

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
- 新增 `src/lib/ai-providers.ts`（AI 源解析）与 `src/lib/active-ai-client.ts`（前端读取当前 AI 源）；
- `ai-stream.ts` 增加 `streamChatAuto` 多协议适配（openai / claude / gemini / minimax，
  **后三家未经真实 Key 实测**）；
- `analyze` 路由接收可选 `ai: { provider, protocol?, baseUrl?, apiKey, model }`，无效配置返回 400（不静默回退）；
- `AIAnalysisPanel` 每次请求自动携带用户当前选中的 AI 源，并把服务端错误消息透出。

> **2026-09-28 二次改动**：原"8 家厂商白名单"整体删除（`PROVIDER_CONFIGS` / `PROVIDERS` /
> `BUILTIN_PROVIDER.models` / `api-keys` / `api-enabled-providers` / `api-selected-models` 等），
> 改为 `builtin` + `custom` 两种来源。理由见 #1 的"后续清理"。
> 同时 `ai-stream.ts` 不再内置火山方舟地址与 doubao 模型兜底：
> env 三件套缺任一项，内置 AI 直接报"未配置"而不是打一个必然失败的请求。

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

已修（三步）：
1. **数据去重**（见 #9）：careers 1539→**1535**，windows 479→**473**；
2. **首页统计改为真实值**：288 条规律 / 473 个人生窗口 / 250 个运气因子 / ~~1535~~ 757 种职业；
3. **二次清理（2026-09-28，`8945efe`）**：careers 再移除 778 条机器生成的模板条目
   → **757 条**；首页/侧栏/各页 `N=` 读数全部改为动态取值，避免以后再漂移。
   全站合计 **1,768**（288 + 473 + 250 + 757）。

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
- `luck-red.ts`：50 条"红运"节点数据，从未被页面 import。**2026-09-28 已删除**
  （与"确定不做就删"的处理一致；历史版本在 git 里随时可找回）；
- `AGENTS.md` 自述的"命运报告可接 AI""名字模块接 AI"仍未实现（这是 TODO 不是 bug）。

#### 2026-09-28 第二轮清理（删自带但已失效/未使用的部分）
- AI：8 家写死厂商预设全部删除（`PROVIDER_CONFIGS` / `PROVIDERS` / 失效的豆包模型列表 /
  `api-keys` 等遗留存储键），只留 builtin（env）+ custom（用户填地址）两种来源；
  `ai-stream.ts` 不再内置火山方舟地址与 doubao 模型兜底，env 缺项直接报"未配置"；
- 组件：45 个从未被引用的 shadcn/ui 组件删除，只留实际用到的 8 个；
- 依赖：随之失效的 33 个包移除（radix 22 个 + cmdk/vaul/embla/react-hook-form/zod/date-fns/
  sonner/recharts/pg/@aws-sdk 等），`pnpm install` 已重跑；
- 其它：`scripts/*.sh`（扣子入口）、`public/` 下 5 个未引用的 Next.js 模板 svg；
- 顺手修：`invokeChat` 未发 thinking 开关导致推理模型返回空正文（测试连接显示"成功但没内容"）。

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

### #13 包体积 🟡 已大幅缓解（2026-10-01 更新）
原状：careers.ts 1.1MB 等静态数据全部打进 client bundle，`/career` 首屏会拖慢。

现状：`8945efe` 清理 778 条机器生成条目后，**careers.ts 降到 192KB / 757 条**，
`src/data/` 合计约 1.1MB（windows 240KB / luck-nodes 424KB / laws-*.ts 232KB）。
首屏压力已明显下降；如仍需优化，可改服务端组件取数或动态 import（未做）。

## 修与不修的建议优先级（2026-10-01 更新）

1. ~~#3 自定义 Key 接入 analyze~~ ✅ 已修（⚠️ 2026-09-29 体检发现键名分叉使其实际失效，
   已由 `8945efe` 真正修复；claude/gemini/minimax 协议适配**仍未经真实 Key 实测**，用前先在 /user 页测一下）；
2. ~~#8 首页数字改真实值~~ ✅ 已修（并二次纠偏为 1,768）；~~#9 数据去重~~ ✅ 已修；#6 admin 三处 ✅ 已修；
3. ~~#7 邀请码无鉴权 + 竞态~~ ✅ 已修；~~#5 无服务端会话~~ ✅ 大部分已修（会话层已落地）；
4. ~~#12 生成脚本不可执行~~ ✅ 已修；
5. ~~#13 包体积~~ ✅ 已大幅缓解（careers 1.1MB → 192KB）；
6. **#4 未登录策略——仍需产品决策**（当前"未登录全解锁、登录后反而受限"的矛盾还在，
   见下）；
7. **#1 Supabase 三件套仍缺** → 登录/邀请码/后台 500（属部署配置，非代码问题）；
8. 剩余小项：`/api/admin` 改用统一会话（现用独立 dev-token）、invite 限流改为持久存储
   （现为进程内内存，重启即清零，多实例部署会失效）、`streamChat` 首 fetch 补 try/catch
   （`src/lib/ai-stream.ts:53`）、零测试。

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
