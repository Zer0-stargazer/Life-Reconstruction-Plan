# 项目全面体检报告

> 体检时间：2026-09-29 ｜ 范围：src 全量代码、docs 全量文档、配置与工程化、构建产物、数据文件
> 方法：静态审计 + 实际运行验证（`tsc` / `eslint` / `next build` / 构建产物体积统计 / 数据文件全量结构化统计）
> 结论速览：**功能完整度 B+，数据内容质量 B-，工程化基座 D，部署就绪度 C-**
> 本次实测：`pnpm ts-check` 0 错误、`pnpm lint` 0 错误 0 告警、`pnpm build` **首次跑通**（20 个静态页）
>
> 后续：2026-09-30 复跑 `next build` 通过（**21 个静态页**，新增 `/icon.svg`、`/manifest.webmanifest`）；
> `src/data` 体积由 1.35MB 降至约 1.1MB（careers 清理）

---

## 修复进展（2026-10-01 更新）

本报告是**快照**，部分条目已修复。当前状态：

| 提交 | 内容 | 对应本报告条目 |
|---|---|---|
| `117bf74` | 全站模块审计：laws 提示词缺失、simulation 权重映射失效、name 假功能、destiny 假输入、luck 口径、career 假资源 | P1/P2 多条 |
| `8945efe` | AI 源键名统一（推翻 P1#1 原「已修」结论）、AI 错误链路可见、careers 移除 778 条生成填充、luck 占位策略 | P1#1、P1#3、P2 |
| `7dd9869` | 补 `not-found`/`error`/`global-error`/`loading`；AI 路由限流 + `maxDuration`；端口读 `$PORT`；`validate` 修复；删 `tsup`；修 `.coze`；加 CI | P0#3、P0#4、工程底座 |
| `e13a417` | 无障碍系统性补全、宣传数字纠偏、模块口径统一 | 产品侧，详见 PRODUCT-AUDIT |
| `875d87b` | 文档：新增 `PRODUCT-AUDIT.md`，本报告加修复进展表 | — |
| `50507bb` `fa39faf` `6d40100` `5935ddb` | **信息架构重做**：模块身份唯一真源、首页七大模块导览、长列表聚焦与折叠、滚动进场、站点图标 | 视觉一致性 / 交互完整度（详见 PRODUCT-AUDIT 第十节） |

### 逐条状态

| 报告条目 | 状态 |
|---|---|
| P1#3 careers 197 条截断 `keySkill`、P1#4 51% 模板 description | ✅ **已解决**（`8945efe` 移除 778 条机器填充，careers 1535 → 757） |
| P2 体积描述全面过期（careers「1.1MB / 1538条」） | ✅ 已更新：**careers 192KB / 757 条**，`src/data` 合计约 1.1MB |
| 页面声称数字准确（careers 1535） | ✅ 已纠偏为 **757**，全站合计 **1,768** |
| P1#1 AI 源键名分叉 | ✅ 已修（`8945efe`），但**自定义源仍未经真实 Key 全协议实测** |
| P0#1/#2 Supabase 三件套与 `SESSION_SECRET` | ⏳ 仍待部署配置（非代码问题） |
| P1#2 `streamChat` 首 fetch 缺 try/catch | ⏳ **仍未修**（`src/lib/ai-stream.ts:53` 裸 fetch） |
| 零测试、`ui/` 8 个组件零引用 | ⏳ 未处理 |
| P2 laws 同维度重名、P3 careers `selfStudyScore` 三档伪装十分制 | ⏳ 未处理 |

> 产品体验侧的完整审计（视觉 / 交互 / 文案 / 移动端 / 无障碍）见 [`PRODUCT-AUDIT.md`](./PRODUCT-AUDIT.md)；
> 其中**第十节「第二轮：信息架构重做」**是 2026-09-30 的主要工作。

---

## 一、结论与优先级总览

| 级别 | 数量 | 含义 |
|---|---|---|
| 🔴 P0 | 4 | 部署即不可用 / 用户体系失效 |
| 🟠 P1 | 6 | 明确的功能错误，用户可感知 |
| 🟡 P2 | 19 | 正确性风险、性能、文档与配置漂移 |
| 🔵 P3 | 15+ | 清理项与优化建议 |

**最该先做的三件事**：
1. 修 `api-active-source` / `ai-active-source` 键名分叉（P1，导致"自定义 AI 源"功能完全失效）
2. 补 Supabase 三件套 + `SESSION_SECRET`（P0，当前登录/注册/邀请码/后台全 500）
3. 清理 careers.ts 的机器生成垃圾数据（P1，197 条 `keySkill` 是 `'企业服'` 这类截断词，直接渲染给用户看）

---

## 二、🔴 P0：部署阻塞级（4 项）

| # | 问题 | 位置 | 现状 |
|---|---|---|---|
| 1 | **Supabase 三件套缺失** → 注册/登录/邀请码/后台全部 500 | `.env.local:14-17`（注释掉的 `SUPABASE_*`）；`src/storage/database/supabase-client.ts:26-35` 缺 env 直接 `throw` | 已确认为当前 500 的直接来源。错误信息还会被 `auth/route.ts:127` 原样回显给前端，泄露 `SUPABASE_URL is not set` 这类内部信息 |
| 2 | **生产缺 `SESSION_SECRET` → 拒绝签发登录态** | `src/lib/session.ts:31-42` | 设计正确（生产环境无密钥时主动抛错，不静默用弱默认值），但没有任何启动期校验，问题会延迟到用户第一次登录才爆发 |
| 3 | **`/api/ai/analyze` 未声明 `maxDuration`** | `src/app/api/ai/analyze/route.ts` | 实测端到端 71 秒出全文，而 Serverless 平台（Vercel Hobby 等）默认函数时长 10s 级 → SSE 必被掐断。自建长驻 Node 无此问题 |
| 4 | **端口硬编码 5000，忽略平台注入的 `$PORT`** | `package.json:6,8` | 多数 PaaS/容器通过 `$PORT` 注入端口，硬编码会导致健康检查失败。`.env.example:30` 又列了 `PORT=5000`，自相矛盾 |

---

## 三、🟠 P1：功能级错误（6 项）

### 1. AI 源键名分叉 → 自定义 AI 源完全失效 ⭐最优先
```
src/lib/ai-sources.ts:32        STORAGE_KEY_ACTIVE = "ai-active-source"   ← 组件写入
src/components/ai/ai-source-manager.tsx:51,62  读写 "ai-active-source"
src/lib/active-ai-client.ts:30      读 "api-active-source"                ← 真正的消费方
src/app/user/page.tsx:122,239,692   读写 "api-active-source"
```
**后果**：用户在「自定义接入」里点"设为当前" → 写入 `ai-active-source`；而真正决定请求走哪个源的 `getActiveAiConfig()` 读 `api-active-source` → **用户选的自定义源永远不生效，AI 分析静默走内置源**。顶部"当前使用"显示也不同步。
**验证**：`setActiveSource`（写 `api-active-source` 的唯一入口）全站只有 1 个调用点，且只传 `'builtin'`。
**注**：这直接推翻了 `docs/KNOWN-ISSUES.md` 中 #3「已修」的结论。

### 2. `streamChat` 首次 fetch 无 try/catch
`src/lib/ai-stream.ts:53` —— 网络失败/域名不可达时异常直接抛出 async generator，**既不 yield error chunk 也不返回**，与同文件 `invokeChat`/`streamChatClaude`/`streamChatGemini` 的处理方式不一致。前端表现为流无声中断。

### 3. careers.ts 197 条 `keySkill` 是截断垃圾值
实测取值分布：`'企业服'`×8、`'互联网'`×8、`'短视频'`×6、`'音频新'`×4、`'知识产'`×4、`'政府实'`×4、`'医疗科'`×4、`'高级数'`/`'高级护'`/`'高级半'`…
根因是生成器按职业名前 2 字切词。该字段在 `career/page.tsx` 直接渲染，且传入 AI 上下文。

### 4. careers.ts 51% 条目的 description 是模板句
id 579–1539（778 条）description 为 `"{name}，{category}领域的专业人才。"` 这类零信息量模板。id 1161–1259 整块（约 50 条）salary 全 `50-100W`、keySkill 全 `X+高级`、描述全 `"X的高级级别，5-10年经验"`。

### 5. `WINDOW_GROUP_LABELS` 映射整表失效
`src/data/windows.ts:60` 的 key 是 `婴儿期/童年期/青春期/壮年期…`，而运行时的分组标签来自 `use-advanced-settings.ts` 的 stage.label（`童年/青少年/青年起步/壮年奋斗/中年深耕/成熟收获/晚年`）+ `精英/其他`。
**结果**：9 个分组里 **7 个标题降级为 "N项"**，映射表本身成为死配置。

### 6. luck-nodes.ts 两条 strategy 是占位符
`src/data/luck-nodes.ts:2195`（id 155）、`:3049`（id 216）值为 `'不是一个完整句子不需要解释'`，页面直接 `split` 渲染。

---

## 四、数据质量问题（src/data，1.35 MB / 7971 行）

**先说好的**：所有必填字段 0 缺失 / 0 空串；id 无重复；`category/status/remedyLevel/missType/trend/aiRisk/controllability/tag` 全部枚举值在配置映射表里都有对应项，**不存在渲染出 `undefined` 的引用断裂**；页面声称的数字全部准确（careers 1535 / windows 473 / luck 250 / laws 288）。

| 级别 | 问题 |
|---|---|
| P1 | careers：197 条 keySkill 截断、778 条模板描述（见上） |
| P1 | luck：2 条占位 strategy（见上） |
| P1 | windows：分组标签映射失效（见上） |
| P2 | careers 名称重复双字 16 条：`保险保险精算师`(id641)、`高等教育教育科技产品经理`(718)、`游戏游戏原画师`(796)、`光伏光伏系统工程师`(1115)、`高级高级云架构师`(1348)… |
| P2 | careers salary 格式混乱：`'-100W~∞'`(id313) 破坏格式；66 条带 `+`（`35-100W+`）与不带 `+` 混用 |
| P2 | careers id 不连续：缺 1、66、335、377 |
| P2 | luck 模板句高度复用：`silentCost` 12 条同前缀、`realCases` 5 条同句、`howToGrasp` 7 条同句；25 条 realCases 用「某机构」泛指 |
| P2 | laws 同维度内重名：`laws-mental.ts:6 & :32` 都叫「决策疲劳累积」；`laws-swan.ts:19 & :32` 都叫「核心技术栈淘汰」 |
| P3 | careers `selfStudyScore` 只有 {3,6,9} 三档，页面却按 `/10` 展示（三档量表伪装成十分制） |
| P3 | windows 文件内两套写法并存：359 条单行对象 + 114 条多行对象，正则/脚本易漏计 |
| P3 | windows 逻辑一致性存疑：`status='future'` 但 `lockForceScore=5` 有 7 条；`remedyLevel='irreversible'` 但 `status≠'past'` 有 45 条 |
| P3 | 跨文件数字 id 空间重叠（careers/luck/windows 都用 1..N），未来合并数据需加命名空间 |
| P3 | window-density 注释口径歧义：`before45=358` 按桶中点统计，注释写"不含 45"；按起始年龄算是 374 |

**总评**：结构层健康，**内容层注水严重**。careers 约一半条目是机器批量生成痕迹，且这些字段全部直接呈现给用户。

---

## 五、安全与隐私

| 级别 | 问题 |
|---|---|
| 🟠 P1 | **`/api/ai/analyze` 与 `/api/ai/test-key` 是开放代理**：接受用户任意 `baseUrl` 并由服务端代为 POST（仅校验 `http(s)://`），构成 SSRF 探测面 + 带宽/成本白嫖，且无 IP 限流。公网部署前必须加限流或鉴权 |
| 🟡 P2 | `.env.local:5` 有真实 AI Key 明文（`sk-dd9fc3...`）。已确认**未入 git**（`.gitignore` 覆盖，历史中也搜不到），但已在本机/审计场景暴露，建议轮换 |
| 🟡 P2 | 错误信息回显：`auth/route.ts:127`、`invite/route.ts:166` 把内部错误 message 原样返回前端 |
| 🟡 P2 | `supabase-client.ts` 用 service_role key，但文件**没有 `import 'server-only'` 守卫**；一旦被客户端组件误引，key 有打进浏览器 bundle 的风险。`session.ts`、`ai-stream.ts` 同理 |
| 🟡 P2 | `next.config.ts:9` `images.remotePatterns` 用 `hostname: "*"`（当前是死配置，全站没用 `next/image`）；一旦启用即等于开放图片代理 |
| 🔵 P3 | `next.config.ts` 未设 `poweredByHeader: false` |
| ✅ 良好 | 密码 bcrypt 加盐；会话用 HMAC 签名令牌而非明文；邀请码有乐观锁 + 失败限流（`invite/route.ts:118-131`）；admin 用 `x-dev-token` 校验；`session.ts` 生产环境拒绝弱默认密钥 |

---

## 六、性能与体积

**构建产物实测**：`.next/static` 总计 2.32 MB，最大的 5 个 chunk 分别 416.6 / 392.4 / 243.0 / 219.5 / 213.1 KB —— 对应 5 个数据重型页面。

| 级别 | 问题 |
|---|---|
| 🟡 P2 | 5 个页面把 100–400KB 数据**全量打进客户端 bundle**：`/luck`(422KB 数据)、`/career`(400KB)、`/windows`(236KB×2 页面)、`/laws`(224KB)、`/me`(含 windows)。建议照抄首页范式：服务端组件预取 / 动态 `import()` / 预聚合 |
| ✅ 良好 | 首页已用预聚合 `window-density.ts`（2.4KB）替代 232KB 的 windows.ts，是正确范式，值得推广到其它模块 |
| 🔵 P3 | 无 `output: 'standalone'`，自建部署需整包 node_modules |
| 🔵 P3 | `assets/` 目录 80MB 开发期截图仍留在工作区（已 gitignore，不影响仓库，但占磁盘） |

---

## 七、工程质量基座（最大短板）

| 项 | 现状 | 影响 |
|---|---|---|
| CI（GitHub Actions 等） | ❌ 无 | 无自动 typecheck/lint/build 门禁，只能靠人工发现事故 |
| 测试框架与用例 | ❌ 无（无 vitest/jest/playwright，无 `*.test.*`） | `session.ts` 签名/过期/篡改、`invite` 乐观锁与限流、`resolveAiSource` 校验全部零覆盖 |
| `test` 脚本 | ❌ 无 | 即使加测试也无入口 |
| Prettier | ❌ 无 | 格式不统一（例：`layout.tsx:4` `from"@/..."` 缺空格） |
| husky / pre-commit | ❌ 无 | 提交前无校验，脏提交易入库 |
| Docker / 部署配置 | ❌ 无 Dockerfile、无 vercel.json | 自建部署无标准镜像 |
| 错误监控 | ❌ 无 Sentry 等 | 生产 500 与 AI 流中断不可观测 |
| **`validate` 脚本不可用** | 🟠 `package.json:12` `pnpm run --parallel '/^(ts-check\|lint:build)$/'` —— 实测报 `ERR_PNPM_NO_SCRIPT`，pnpm 把正则当字面脚本名，且本仓库无 `pnpm-workspace.yaml` | 拿它当 CI 入口必然红灯 |
| `engines.node` | ❌ 无（只有 `engines.pnpm`） | 与 `.coze` 要求 `nodejs-24` 冲突，本机实为 22.22.2 |
| ESLint 严格度 | 🟡 `eslint.config.mjs:18` 关掉了 `react-hooks/set-state-in-effect` | 掩盖 effect 内 setState 类问题 |
| `build` 是否跑 lint | ❌ 不跑 | 有 lint 错误也能 build 通过 |
| ✅ 良好 | `ts-check`/`lint` 当前全绿；`build` 本次实测通过；依赖已瘦身（deps 16 / devDeps 13） | — |

---

## 八、文档漂移（7 份 md 中 5 份有错）

| 级别 | 问题 |
|---|---|
| 🟠 P1 | `docs/API.md:94` 写 module 白名单 9 个 → 实际 12 个（漏了 3 个 `laws_*`）；`:116` 写「不在白名单回落到 window 框架」→ 实际已改为返回 **400** |
| 🟠 P1 | `docs/history/DEVELOPER.md:60-64` API 表整体过期：`/api/invite` body 写 `{code,nickname}`（实际只 `{code}`，userId 取自会话）；`/api/ai/analyze` 写 `{prompt,type,model?,apiKey?}`（实际 `{module,item,question?,history?,ai?}`）；admin 写支持 GET/POST/PUT/DELETE（实际只有 GET/POST） |
| 🟠 P1 | `docs/history/DEVELOPER.md:181-184` 的"新增 AI 厂商"指引让改 `PROVIDERS` 数组 —— 这套 8 厂商机制**已于 09-28 删除**，指引整体失效 |
| 🟡 P2 | `docs/KNOWN-ISSUES.md` 中 `#7` 出现两次（103-109 已修版 + 117-120 旧版残留）；`:161-163` 与 `DEVELOPER.md:140` 仍留"高级设置未被消费"旧句，而 `#11` 已声明该说法过时 |
| 🟡 P2 | 体积描述全面过期：文档写 careers「1.1MB / 1538条」→ 实际 **404KB / 1535**；luck「548KB / 365」→ 实际 **424KB / 250**；windows「232KB / 524」→ 实际 **240KB / 473** |
| 🟡 P2 | `docs/DATABASE.md:71-72`、`HANDOVER.md:167`、`HANDOVER.md:185` 称 invite/admin 缺鉴权、analyze 不读用户 Key —— **均已被后续提交修复**，文档未同步 |
| 🟡 P2 | `docs/ARCHITECTURE.md` 未收录 `/me`（11 个页面中唯一缺的）；`:65` 写「8 套 prompt」实际 12 套 |
| 🟡 P2 | `docs/history/INTRODUCTION.md` 整篇未更新：仍写「50 条 redNodes 预留数据」（已删）、「自带 Key 支持 8 个主流厂商」（已删）、技术栈含 `coze-coding-dev-sdk`（包不存在） |
| 🟡 P2 | `README.md:114-115` 「代码最后修改 2026-07-14」→ 实际 09-29；目录树漏 `components/home/`、`components/shared/`；`:8` 称「8 个模块」实为 10 项 |
| 🟡 P2 | `supabase/schema.sql:11` 注释指向已删除的 `src/storage/database/shared/schema.ts` |
| 🔵 P3 | `docs/PROJECT-BRIEF.md` 曾写 `scripts/*.sh`、`public/` 目录（均已不存在；路径已迁入 docs） |

---

## 九、配置与部署风险（生产必然踩坑清单）

| 级别 | 问题 |
|---|---|
| 🔴 P0 | 端口硬编码 5000（见第二章） |
| 🔴 P0 | Supabase / SESSION_SECRET 缺失（见第二章） |
| 🟠 P1 | **`.coze` 平台配置已损坏**：`:8-15` 仍声明 `dev/build/run/validate = bash ./scripts/prepare.sh\|dev.sh\|build.sh\|start.sh\|validate.sh`，但这 5 个 sh **已全部删除**（`scripts/` 顶层只剩 `README.md` + `gen-window-density.ts`）→ 扣子平台按此构建/运行**必然失败** |
| 🟠 P1 | `package.json:44` `tsup` 是**死依赖**（`server.ts` 已删、全仓无引用），与 KNOWN-ISSUES #10「死依赖已清理」不符 |
| 🟡 P2 | `package.json:42` `"shadcn": "latest"` 未锁版本，安装不可复现 |
| 🟡 P2 | `package.json:2` `"name": "projects"` 是占位名 |
| 🟡 P2 | `package.json:13` `preinstall: npx only-allow pnpm` 在离线/受限 CI 会拉网失败 |
| 🟡 P2 | 时区/hydration：`me/page.tsx:25` 的 `new Date().getFullYear()` 在**模块顶层**求值，SSR 与浏览器时区不同时跨年瞬间会 hydration 不一致；`destiny/page.tsx:124,283,308` 同类 |
| 🟡 P2 | `next.config.ts` 缺 `metadataBase`（Next 16 下 OG/分享绝对 URL 缺失并有警告） |
| ✅ 良好 | `.env.local` 与 `assets/` 均已被 `.gitignore` 覆盖，密钥未入库（已用 `git log -S` 验证历史干净） |

---

## 十、可访问性与体验

| 级别 | 问题 |
|---|---|
| 🟡 P2 | **表单可访问性近乎零**：全站 111 个 `<button>` 仅 3 个 `aria-label`；16 个 `<label>` **全部没有 `htmlFor`**（点击标签无法聚焦对应输入框）；图标按钮（关闭/删除/翻页等）大多无可读名称，屏幕阅读器只会念"按钮" |
| 🟡 P2 | 缺全部**错误边界与兜底页**：无 `src/app/error.tsx`、`global-error.tsx`、`not-found.tsx`、`loading.tsx` → 任何渲染异常/404 只能看到 Next 默认页面，无品牌化兜底，也无加载骨架屏 |
| 🟡 P2 | `AuthContext.Provider` 的 `value` 是内联对象字面量（`auth-context.tsx:231`），未 `useMemo` → 每次重渲染都让所有 `useAuth()` 消费者重渲染 |
| 🟡 P2 | `use-advanced-settings.ts:63-65` 的 `weightMap` 每次渲染用 `Object.fromEntries` 重建 → 引用恒变 |
| 🔵 P3 | 多处 fetch 无超时/AbortController（`auth-context.tsx` 3 处、`ai-stream.ts` 4 处）→ 后端挂起时请求永久 pending |
| 🔵 P3 | 多页数字硬编码不派生（首页 473/358/115/82、laws 页同时存在硬编码 `N=288` 与动态 `N={total}`） |
| ✅ 良好 | 移动端有完整方案（`app-sidebar.tsx:217-254` 抽屉式侧栏 + 顶栏）；无 h1/h2 层级混乱；深色模式完整支持 |

---

## 十一、清理项清单（P3）

**死代码/死导出**（grep 验证零引用）：
- `lib/ai-sources.ts`：`toAiSourceConfig`、`isValidBaseUrl`、`SourcesFile`、`ParseResult`
- `lib/ai-stream.ts`：`AiSourceConfig` 转出口；`streamChat`/`streamChatClaude`/`streamChatGemini` 对外导出了但仅内部使用
- `lib/ai-providers.ts`：`CUSTOM_PROTOCOLS`、`CustomProtocol`
- `storage/database/supabase-client.ts`：`getSupabaseCredentials`、`getSupabaseServiceRoleKey`
- `lib/session.ts`：`SessionPayload`；`contexts/auth-context.tsx`：`AuthUser`
- `hooks/use-advanced-settings.ts`：返回的 `getStageLabel`/`weights`/`loaded` 无任何消费者

**其它**：
- `hooks/use-mobile.ts:1` 缺 `'use client'`（同目录另两个 hook 都有），当前仅因被客户端组件引用才没炸
- `components/layout/theme-provider` 等 import 语句缺空格：`from"@/..."`，共 1+ 处
- `contexts/auth-context.tsx:224` `canAccessModule` 的 `isPremium` 依赖是多余的（完全由 `user` 派生）
- `components/ai/ai-source-manager.tsx:92` `testSource` 依赖 `sources` 存在 stale 覆盖风险（测试期间增删源会用旧数组覆盖）
- `scripts/archive/` 下 14 个一次性脚本直接改写 `src/data/`，无 dry-run、无备份，误跑风险高；`gen-careers.ts` 是 CommonJS 写法的 `.ts`，属纯历史残留
- 全部 localStorage 键无版本号/迁移机制（仅 `me-age`→`default-age` 有一次性迁移）；`default-age` 存在 `JSON.stringify` 与 `String()` 两种写入风格；`visited-modules` 在 hook 与页面里有重复写入逻辑

---

## 十二、已知但需拍板的策略问题

| 问题 | 现状 | 需要决策 |
|---|---|---|
| ~~未登录用户可访问全部模块~~ | ✅ 2026-10-01 已按方案 A 修复：`ModuleGate` 移除 `!user ||` 放行，未登录访问受锁模块显示登录引导 | 已关闭；后续维持 `auth-context` 单一判定来源 |
| 自定义 AI 源的隐私边界 | 用户填自己的 baseUrl + key 存 localStorage，服务端代为转发 | 是否需要在文档里明确"key 会经过本服务端"？ |

---

## 十三、建议修复路线图

**第 1 批（半天，立竿见影）**
1. 修 `ai-active-source` / `api-active-source` 键名分叉 —— 统一为 `STORAGE_KEY_ACTIVE` 常量
2. 修 `WINDOW_GROUP_LABELS` 映射 key（改成与 stage.label 一致）
3. 替换 luck 2 条占位 strategy、修 careers 197 条截断 keySkill

**第 2 批（1 天，工程质量）**
4. 补 `error.tsx` / `not-found.tsx` / `loading.tsx`
5. 修 `validate` 脚本（改成 `pnpm run ts-check && pnpm run lint:build`）、删 `tsup` 死依赖、补 `engines.node`
6. 加最小 CI（typecheck + lint + build）与 2 个核心单测（session 签名、invite 乐观锁）
7. 给 `/api/ai/*` 加 IP 限流（可直接复用 `invite/route.ts` 的限流实现）

**第 3 批（1-2 天，数据与体验）**
8. careers 数据清洗（去双字名、统一 salary、补真实描述）
9. 大数据页面改服务端预取 / 动态 import（照抄首页 `window-density.ts` 范式）
10. 表单可访问性（label 补 `htmlFor`、图标按钮补 `aria-label`）

**第 4 批（部署前必做）**
11. 补 Supabase 三件套 + `SESSION_SECRET`，`.env.local:5` 的 AI Key 轮换
12. `analyze` 加 `maxDuration`、端口改读 `$PORT`
13. 修 `.coze` 或明确弃用扣子平台
14. 同步 5 份漂移文档（重点 KNOWN-ISSUES / DEVELOPER / INTRODUCTION）
