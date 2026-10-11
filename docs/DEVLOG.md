# 开发日志 DEVLOG.md

> **用途**：按时间线记录"哪天改了什么、为什么改"。查历史先来这里；
> 各文档只维护"当前状态"，过程与决策细节沉淀在本文件。
> **记录规则**：每个工作日收尾追加一节（git 日期为准），列要点 + commit 哈希；
> 重大决策附一段"为什么"。

---

## 项目前史（2026-04 ~ 2026-09-24）

- **2026-04**：项目由扣子编程 CLI 生成（Next.js 模板 + 生成脚本批量产数据）。
  生成脚本写死云端路径 `/workspace/...`，只在扣子环境可跑。
- **2026-07-14**：最后一次修改 `careers.ts`，随后项目实际处于不可编译状态
  （一个字符级损坏 `Career[{` 缺 `] =` 造成 66,136 个连锁语法错误，当时无人发现）。
- **2026-07 ~ 09**：搁置约 2.5 个月。

---

## 2026-09-25 ~ 09-27 ｜ 接手整理与安全层重建

**主题**：从"能运行的生成项目"整理到"可维护的产品原型"。

- 修复编码损坏（layout/analyze 共 27 字节 U+FFFD）、careers.ts 字符级损坏（66,136 个连锁错误）。
- node_modules 三层损坏修复（顶层软链断裂 / 虚拟 store 残缺），沉淀重建文档。
- 数据去重纠偏：careers 1539 → 1535，windows 479 → 473；首页宣传数字改真实值。
- **安全层重建**：新增 HMAC 服务端会话（`lib/session.ts`）；邀请码接口补鉴权 +
  乐观锁防并发超发 + IP 限流；admin 三处越权口加固；删除 drizzle 三件套死依赖。
- 相关 commit：`f8edce0` `095e601` `8abbd5c` `fe86663` `925b4fa` `ec88ca8` `a852d40`

---

## 2026-09-28 ｜ AI 全链路打通 + 数据清洗

**主题**：让 AI 真正可用，把假数据清干净。

- **自定义 AI 接入源**：任意 baseUrl + 协议（openai/claude/gemini/minimax）+ Key + 模型，
  增删改查/启停/测试/导入导出；实测中转站 + GLM-5.3-flash 端到端出 1,703 字。
- **careers 移除 778 条机器生成的模板条目**（1539 → 757），确立"资源必须可追溯"纪律。
- 推理模型默认关闭思维链（实测 112s → 6s）；删除 8 家写死厂商预设、45 个未引用组件、33 个死依赖。
- 视觉重做启动（一~三）：首页仪表盘化、/me 时间轴仪表盘化。
- 相关 commit：`dfda954` `032ba48` `b93643d` `511e7db` `61bbd87` `9b2e271` `75c70c7` `63b4337`

---

## 2026-09-29 ｜ 全站审计 + 工程化

- 全站模块审计（16 处 P1/P2）：laws 提示词缺失、simulation 权重映射失效、career 假资源等。
- AI 源键名分叉修复（`ai-active-source`/`api-active-source`，推翻"自定义 Key 已修"旧结论）。
- 工程化：四个兜底页、AI 限流、`maxDuration`、端口读 `$PORT`、CI、删 `tsup`。
- 无障碍系统性补全；宣传数字二次纠偏（1,768 数据点）。
- 新增 `docs/PRODUCT-AUDIT.md`（视觉一致性 513 处硬编码色、AI 面板 6 处重复等老账在案）。
- 相关 commit：`da12878` `fb646c3` `3b05968` `117bf74` `8945efe` `7dd9869` `e13a417` `875d87b`

---

## 2026-09-30 ｜ 信息架构重做

**主题**：把七个信息孤岛串成一条能走完的路。

- 模块身份唯一真源 `lib/module-identity.ts`（编号/图标/配色/「能回答什么问题」）。
- 首页重做（七大模块导览卡）、页尾 `ModuleNextNav`（挂 root layout）、统一页头 `ModulePageHead`。
- 长列表治理：每组默认 12 条 + 聚焦层；`Reveal` 滚动进场铺开；站点图标 + PWA manifest。
- 生产构建首次验证通过（21 个静态页）。
- 相关 commit：`50507bb` `fa39faf` `6d40100` `5935ddb`

---

## 2026-10-01 ｜ 时间轴打磨 + 文档收纳

- /me 重构：年龄分布并入滑块、±15 年年度热度图、清单顺序、窗口三态个人标记（localStorage）。
- AI 回复 Markdown 渲染 + 提示词收敛（/windows 收敛为一页式结论）。
- 未登录策略"方案 A"落地（后被 10-03 预览模型取代）。
- 文档收进 `docs/`，旧版参考归档 `docs/history/`。
- 相关 commit：`c953917` `e135995` `ac5263d` `cd3f021` `ad3b1dd` `40ba1f6` `c524ede` `e99995b` `5593d31` `5a2f22f` `279b70f`

---

## 2026-10-02 ｜ 大修日：体检 → 止血 → 体验 → 加固 → 产品

**上午 · 全面深度体检**（三路并行代码审计 + 后端安全链路 + 12 路由回归），
产出 P0×6 / P1×20+ / P2×30+ 报告，随后按批次修复。

### 第一批 · P0 止血（6 commits）
| Commit | 内容 |
|---|---|
| `764aea5` | 年龄跨页同步修复：`default-age` 收敛为 `lib/default-age.ts` 统一读写（原 JSON 写入 vs parseInt 读取互不兼容，个性化主线被架空） |
| `0e532e3` | AI 流式输出静默丢失修复：SSE 解析收编为 `lib/sse-client.ts`（6 处手写解析无跨 chunk 缓冲；净减 115 行） |
| `6a4b68f` | 移动端固定顶栏遮挡全站修复（main 加 `pt-12 md:pt-0`；删无效 spacer） |
| `154fba5` | 后台 token 失效静默假空修复：admin GET 检查 res.ok，401 回验证界面、错误横幅可见 |
| `8a0883d` | career 移动端选卡无反馈修复：选中后滚动定位到详情面板 |
| `f305522` | windows 473 张卡片键盘不可达修复（role/tabIndex/aria-expanded） |

### 第二批 · 体验层（5 commits）
- `4188d6e` 双光标修复（5 处复制残留）；`9b65845` **AI 面板交互增强**：新建
  `ai-panel-actions.tsx`（停止生成/复制回复），6 面板补 dialog 语义，laws/luck 关闭中止流式，
  共享面板补 Markdown 渲染；`0ac1cf4` 主题切换改走 next-themes（修复不持久）；
  `b940715` 小修群（假禁用/假图例/独立展开态/⌘K 平台/年龄闪现/AI 重开重试）；
  `77f33ca` 移动侧边栏关闭态 `inert` + 汉堡 aria。

### 第三批 · 加固（5 commits）
- `6d26059` **SSRF 加固**：自定义 AI 源拦截云元数据/链路本地地址（有意保留 loopback/私有网段支持本地模型）；
  Gemini 测 Key 从 URL 挪到请求头。
- `4287719` admin dev-token 按 UTC 日期桶轮换（等效 24-48h 有效期）。
- `3dee160` AI 输入加固：服务端入参截断（item≤6000/question≤2000/history 12×4000 + role 白名单），
  前端 maxLength。
- `7f33d01` **localStorage 键名收敛**：新建 `lib/storage-keys.ts` 唯一真源（11 键登记）；
  /user 页 visited-modules 三处实现去重（修掉把 /user 写进访问记录的 bug）。
- `ddca6d3` 触控目标放大（/me 标记条 / laws 筛选 / me tabs）。

### 第四批 · 晚间体验（6 commits，用户反馈驱动）
- `102ca1b` 首页轨道中心重设计：文字方块 → 雷达式生命核心（用户反馈"你字方块尴尬"）。
- `c1596b4` /career 新增搜索（名称/技能/描述/分类）。
- `24e4165` 4 个 AI 面板从右侧抽屉改**居中模态**（用户要求）。
- `63db277` 加载气泡显示**已等待秒数**。
- `5300325` 运气「影响指数/可控度」白话解释（用户反馈看不懂）。
- `3794798` **AI 思考过程透明化**：实测 api.apikey.fan 忽略 `thinking:disabled`
  （思维链占时长约 60%，首正文要等 280+ 帧），`reasoning_content` 全链路透传，
  6 面板 `AiThinkingBlock` 实时显示、正文开始后折叠。

### 第五批 · 职业数据批次（4 commits，用户需求：888 职业专属资源）
- `543844d` 快看组升级：**高危口径修正**（原"down且high"全库仅 1 条 → 放宽"down或high"13 个）、
  6+6 条带数据推导理由、新建 `data/career-resources.ts` 三级资源查找（职业专属 → 分类兜底）。
- `2d03689` 商业化设计稿（访客预览 + AI 额度制，供拍板）。
- `4871925` + `d0b58ea` **首批 27 个职业专属资源落地**（黄金科技 13 + 高危传媒/商业 14）。
  调研纪律：书籍必须真实可买；URL 实测可达才入库，验证不过置空（中转站 502 频发期间
  由主会话 WebFetch 逐个直测）。

---

## 2026-10-03 ｜ 商业化上线：访客预览 + AI 额度制

**主题**：测试期全开放正式收回，产品可以卖了。设计依据：`docs/DESIGN-VISITOR-PREVIEW-AND-CREDITS.md`。

| Commit | 内容 |
|---|---|
| `1d2a935` | **访客预览模型**：`canAccessModule` 恢复按角色判定；预览态 = 列表可逛，锁定点（详情/AI/报告生成）统一 `useLockedAction().guard` 拦截；全局 `UnlockDialog`（访客引导登录、已登录就地输码）+ `PreviewBanner` |
| `cd50806` | **额度制数据层**：schema 加 `app_users.ai_credits(_total)`、`invite_codes.ai_credits`、新表 `ai_credit_logs`；兑换到账 + 流水；/admin 建码带次数（默认 200）；GET `/api/ai/credits`；/user 余额展示 |
| `f965c06` | **额度门**：analyze 路由内置 AI 需会话并乐观锁扣 1（developer 不限）；**BYOK 免登录不扣**；额度不足 402 白话文案；6 面板带会话头 + 错误消息透出 |
| `9dca9dd` | 文档同步（ROADMAP 回滚清单完成、接手说明） |
| `2107615` | 修复自查发现的 500：UnlockDialog 曾挂在 AuthProvider 外 |

**踩坑记录**：`pnpm validate` 曾被 `.next/dev/types` 生成物瞬态报错干扰（dev server 热更新窗口期），
与代码无关；dev server 期间两次被外部原因停掉，重启即恢复。

---

## 2026-10-06 ｜ 工程清理 + 文档大同步

- **清理**：删除 `assets/`（57 个 2026-04 扣子时期开发截图，86MB，零引用）、
  `.coze` 遗留配置；`.npmrc` 移除两行禁自愈参数（KNOWN-ISSUES #2c 长期建议关闭）；
  **pnpm-lock.yaml 重新同步**（此前与 package.json 漂移：残留 tsup、typescript 口径不一致），
  frozen-lockfile 校验通过。
- **文档全量同步**：README / AGENTS / PROJECT-BRIEF / ARCHITECTURE / API / DATABASE /
  KNOWN-ISSUES / ROADMAP / 00-优先阅读 / docs 索引 全部对齐到当前代码；
  本文件（DEVLOG）建立。
- Commit：`84001c1` + 本次文档提交。

---

## 2026-10-09 ｜ 批次 4 视觉重塑「人生手记」

- **主题**：纸墨朱砂配色、宋体标题、英文小标点缀，动效收敛为淡入与墨线描绘。
- **站点标识**：朱砂方印改为「圆弧围两个空心方块」，favicon 同步。`7917783`
- **首页**：八维罗盘主视觉（GSAP 逐条描线，印章落下）+ 朱砂字带；全站背景淡印罗盘。`b7ac234`
- **/me 序章**：年龄门控改为「序」字 + 墨线年龄刻度的两栏版面。`90a6239`
- **/windows、/simulation**：窗口页加入密度分布图；模拟页五维概览，emoji 维度标题改中文序号。`b3eb6f0`
- **修复**：罗盘浮点坐标在 SSR 与客户端不一致，导致开发角标 "1 Issue"（水合报错）；页头无 aside 时跳过 GSAP 动画，消除 "target not found" 警告。`ded5fef`
- **为什么用罗盘而非插画**：首页与模块页的空白来自信息密度不足；罗盘用同一套墨线与朱砂语汇，不引入新的图片资源。
- **未完成**：/luck、/career 未动；移动端 /windows 的筛选为横向滚动，属设计内行为。批次 1–3 的记录待核实后补写。

---

## 2026-10-10 ｜ 批次 5–6 收口

- **职业专属资源**：三类（视频 / 文档与论坛 / 书籍）拆分入库，链接逐条 curl 实测（200/403 保留，404/410 与持续 000 剔除）。`07151d7` `301a87b` `55da49a` 首批三提交；`b95d152` `0592e2f` `07fc756` `7d62332` 继续补齐，并把合并入口接好。748 / 757 个职业已有资源（余 9 个见下），其余无专属资源的职业如实提示，不回落到通用分类内容。
- **职业页**：卡片展开与详情页统一使用资源面板，外链新窗口打开；状态按钮（在做 / 完成 / 无关）。
- **审计结论**：/me "大片空白" 是 `min-h-screen` 在 6000px 截图视口下的假象，1440×900 下序章版面正常；职业页下半区淡出是 Reveal 在无滚动环境下未触发，非真实缺陷。
- **注册开关**：`NEXT_PUBLIC_REGISTRATION_OPEN=false` 时注册接口返回 403，前端隐藏注册入口，已有账号登录不受影响；默认开放。`bd6bde0` `3650483`。
- **合规草案**：`/terms`（用户协议）与 `/privacy`（隐私政策）为草案，侧栏底部已链接，需项目主人审定后再正式发布。AI 面板加"内容由 AI 生成，仅供参考"标注。`bd6bde0` `3650483`。
- **AI 50 秒超时**（`8cff398`，10-09 补记）：分析接口增加 50 秒总超时，超时主动中止上游并返回明确提示，额度退还；客户端断开时同步中止上游请求。此前上游 fetch 无超时，会挂到平台 60 秒被硬切，用户只看到回答突然停住。
- **资源补齐**：`gap-*` 占位文件名统一改为 `supplement-01…09`（按批次编号）；`supplement-09` 新增 7 个职业（高级护士、高级全科医师、智能座舱体验设计师、设计运营专家、本地生活运营、社群团购运营、戏剧教育教师），全部 curl 实测 200。`7d62332`。
- **空白与配色**：/destiny 表单下方补"命 / 运 / 努力"三维引导卡；/name 底部"隐性力量"改为三色卡片网格（`fa9f822`）；首页 hero 收紧、马跑灯回到首屏、新增 `--ink-accent` 点缀色（`be25cd8`）。
- **未完成**：9 个职业无可实测的专属资源（医美咨询师、驾校教练、纹身师、宠物美容师、体检中心运营经理、高级康复治疗师、体外循环灌注师、高压氧治疗师、上门美甲师）；全站动效统一与色板扩展只做了局部，未形成完整设计系统；真机移动端走查未做。
- **测试**：vitest 接入（`pnpm test`），`src/data/career-resources.test.ts` 4 条：资源 key 都是真实职业名、链接 https 且非搜索页、无资源职业返回空、不串职业。`b95d152`。auth/AI 流程测试未做。
- **文档同步**：DEVLOG / 接手文档 / HANDOVER / ROADMAP / README / AGENTS / API / DATABASE（补批次 5 迁移说明）/ LAUNCH-CHECKLIST 同步到当前状态。`76f9ec8` `6962f86` 及本节后续提交。
- **上线前提醒**：在 Supabase 执行 `supabase/migrations/2026-10-10-batch5-admin.sql`（ai_usage_logs / app_settings / dev_sessions / admin_adjust_credits）；确认 `.env.local` 中 `DEV_PASSWORD` 为强口令；对话中泄露的 API Key 需轮换。

---

## 2026-10-10（续）｜ 批次 A：规模补齐 + 内容审查

**主题**：把目录数据补到位，并做一轮结构化实用性/时代性审查。

- **A1 人生窗口 473→488**：补 15 个现代窗口。
- **A3 职业 757→888（+131）**：新增 AI/科技、新能源、低空经济、出海、跨境电商等现代职业；`career-count.ts` 同步 888。
- **A4 职业专属资源 888/888**：结构 = `career-resources.ts` 基座 102 键 + `resources/supplement-01…11.ts` 786 键。审计脚本核验：888 职业全覆盖、无重复键、base 与补充无覆盖冲突、链接全 https。新增职业资源一律进 `supplement-NN.ts`。
- **A2 内容审查（结构化核查 windows/careers/luck/laws 四库）**：
  - **去重（P0）**：laws 两组同名重复条目删除——`mt-29`「决策疲劳累积」保留 `mb-03`、`bs-29`「核心技术栈淘汰」保留 `bs-16`；规律总数 269→**267**。
  - **初级/高级 100 条重做（P1）**：原 `to-1160…1259` 为批量填充（50 个初级 salary 全 `25-35W`/score 全 9、50 个高级全 `50-100W`，含 26 条难度反转、26 条 aiRisk 误降）。改为**由母职业派生**：category/keySkill/aiRisk/difficulty/score 与母一致，salary 按母区间取初级下段 / 高级上段。salary 去重数 2→60，与母零冲突。
  - **删除死字段 `realCases`（P1）**：`luckNodes` 250/250 全空、UI 有渲染块但守卫，整块废弃；连同 `luck/page.tsx` 渲染块与 `BookOpen` 引用一并移除。
  - **补 `silentCost`（P2）**：luck id 77/78/87/145/150/175/184 共 7 条空值补齐。
  - **复核后不改**：`selfStudyScore` 81 条非默认值是「自学推荐指数」的合理人工评定（easy 6-9 / medium 5-7 / hard 2-5），保留；windows id 382/421 的「标题年龄 vs 最佳执行期」偏差为设计（标题是截止点、最佳期在前），非缺陷。
- **文档同步**：`00-优先阅读-项目接手.md` / `HANDOVER.md` / `PROJECT-BRIEF.md` 数据总数更新为 267 规律 + 488 窗口 + 250 运气 + 888 职业 = **1,893**（KNOWN-ISSUES #8 为历史事件记录，不改）。
- **验证**：`tsc --noEmit` 干净；`vitest run` 6/6 通过；`eslint` 改动文件无告警；审计脚本跑完即删。
- **未完成**：A5 `/health` 第 8 模块、A6 模拟器健康/精力维度。

---

## 2026-10-10（续·二）｜ 批次 A5：`/health` 第 8 模块

**主题**：新增第 8 个模块「健康」，交互式自评，全新数据。

- **数据层**（A5-1/A5-2）：新建 `src/data/health.ts` + 7 个子域文件（`health-checkup` / `health-sleep-cycle` / `health-sleep-quality` / `health-diet` / `health-exercise` / `health-energy` / `health-cognition`），各 18 条 = **126 条健康信号**。字段：name / description / metric / healthyRange / warning / strategies / tag(`risk|watch|good|neutral`) / intensity(1-5)。附 14 题自评（每子域 2 题，选项 0-100，越高越健康）与纯函数 `tierOf` / `scoreDomains` / `overallScore` / `weakestDomains` / `keySignals`。
- **纪律**：只写主流医学/运动科学共识范围内的常识性建议，**不写诊断结论、不替代就医**；涉及症状一律引导就医。页面与 AI 提示词均带边界说明。
- **页面**（A5-3）：`src/app/health/page.tsx`，两步流（自评 → 结果），结构对齐 `/simulation`：七子域分组问卷 + 进度条 → 结果页七域雷达图 + 综合精力分 + 「先补这三个」短板聚焦层 + 最弱三域的关键信号卡 + AI 深度分析（`module: 'health'`，SSE 流式，`AiThinkingBlock` 思维链）。用 `ModuleGate` / `useLockedAction` 接入锁定模型。
- **全站接入**（A5-4）：`module-identity.ts` 加第 8 项（tag 08「健康」）+ `CHAPTERS` 加「伍 · 你的硬件」；`module-icons.tsx` 新增 `HealthIcon`；`chapter-meta.ts` 补 伍/CHAPTER V；`module-page-head.tsx` 分母 07→08；`app-sidebar.tsx` 加 /health；`module-next-nav.tsx` 文案「七个」→「八个」；`layout.tsx` / `page.tsx` / `manifest.ts` 元数据与 hero 文案 七大→八大、维度统计改 `MODULE_IDENTITIES.length`；`auth-context.tsx` `ALL_MODULES` 加 `/health`；`hooks/use-module-visit.ts` `TRACKABLE_PATHS` 加 `/health`；`user/page.tsx` 模块探索清单加「健康 08」；`api/ai/analyze/route.ts` 加 `health` 提示词框架。
- **文档**：数据总数 1,893 → **2,019**（+126 健康信号），模块数 7→8，阅读路径补 08。
- **验证**：`tsc --noEmit` 干净；`vitest run` 6/6；`eslint` 改动文件无告警；数据自检脚本核验 126 条 id 唯一、字段完整、7×18 齐整、评分函数边界正确，跑完即删；dev server 实测 `/health` HTTP 200 且 SSR 输出与 `/simulation` 同级（鉴权骨架一致，路由编译通过），首页/侧栏渲染出第 8 模块、章节「伍 · 你的硬件」、`href="/health"` ×3。
- **`pnpm build` 已跑通**（此前从未验证过）：`next build` 编译成功、24/24 静态页生成，`/health` 出现在路由表且为静态预渲染；TS 阶段通过。唯一告警是既有的 `metadataBase` 未设置（`layout.tsx`，非本次引入）。

---

## 2026-10-10（续·三）｜ 批次 A6：模拟器加「健康」维度（5→6）

**主题**：把 `/health` 的健康/精力视角接入命运模拟器，让"身体"成为可推演的第六维。

- **新增维度**：`simulation/page.tsx` `dimensionDefaults` 加 `health`「健康」（体能、精力与身心状态，色 `#10b981`，图标 🫀），权重 `0.12`；其余五维等比下调（family 0.25→0.22、talent/effort 各 0.20→0.18、choice 0.20→0.17、luck 0.15→0.13），**权重和仍为 1.00**（`calculateScore` 直接乘内置权重，无需归一化）。
- **配套**：新增 4 道健康问卷题（指标/睡眠/运动/精力情绪）；补 `getScenarioText` 健康分支、`getStrategyAdvice` 的 `leverageMap`/`weakFixMap` 健康条目；`dimensionOrder`/`dimensionLabels`/`dimensionNumerals` 加 `health`（壹…陆）；步骤一「五维概览」→「六维概览」、`grid-cols-5`→`lg:grid-cols-6`；页头/AI 面板文案「五个/5 个维度」→「六个/6 个」。
- **持久化迁移**：`sim.dimensions.v1`/`sim.answers.v1` → `**.v2`（旧 5 维数组会让雷达图画错形状；`use-persisted-state` 的版本号约定即为此）。
- **module-identity**：`/simulation` 条目 `metric` `5`→`6`、desc 补"健康"。
- **验证**：`tsc --noEmit` 干净；`eslint` 改动文件无告警；dev server 实测 `/simulation` HTTP 200。

---

## 2026-10-10（续·四）｜ 上线硬门槛之三：AI 双源容错

**主题**：内置 AI 供应商 `api.apikey.fan` 实测 502 率约 50%，面向真实用户等于"一半概率坏"。加备用源自动切换，从代码层兜住。

- **备用源配置**（`lib/ai-providers.ts`）：新增 `resolveFallbackSource()`，读 env `AI_FALLBACK_URL / KEY / MODEL`；**三件套齐全才生效**，否则返回 `null`（不改变现有行为）。地址复用 `isSafeBaseUrl` 做 SSRF 校验，返回与自定义源同构的 `openai` kind，直接复用 `streamChatAuto` 的 openai 分支——不新增协议分支。
- **容错生成器**（`lib/ai-stream.ts`）：新增 `streamChatWithFallback(messages, primary, fallback, options)`。语义：**只有主源"在产出任何内容之前"就失败**（HTTP 错误 / 连接失败 / 空响应）才切备用源。一旦主源已吐出正文或思维链，就不再切换（否则两段不同来源正文会被拼接；此时透传错误）。主源抛异常（超时 abort / 客户端断开 / 网络错误）原样上抛，交给 analyze 路由既有错误路径（超时文案、退还额度）——天然不触发切换，不重复计费。`fallback` 为 `null` 时行为与 `streamChatAuto` 完全一致。
- **接线**（`api/ai/analyze/route.ts`）：`streamChatAuto` → `streamChatWithFallback`；**容错只作用于内置 AI**，BYOK 是用户自选的源，不替他切到别人的备用源。
- **配置**（`.env.example`）：补 `AI_FALLBACK_URL / KEY / MODEL` 三行并注明"可选但强烈建议"。
- **为什么不做"备用源也失败"的详细分类**：现有 `error_kind` 只有 timeout/upstream/empty/stream/server，备用源失败仍归 `upstream`，语义已够（后台看得到失败）；不为一次失败再拆枚举。
- **验证**：临时 tsx 脚本（monkeypatch `fetch`，`node --conditions=react-server --import tsx`）核验 5 场景 7 断言全通过——①主源 502→切备用源出内容、primary/fallback 各命中一次；②主源正常→不碰备用源；③主源只出思维链→视为已产出不切；④双源都挂→报"备用源同样失败"；⑤无备用源→返回 null 且报主源原错。跑完即删。`tsc --noEmit` 干净；`eslint . --quiet` 0 错；`vitest run` 6/6。
- **残余**：真实供应商的备用源 env 值尚未配置实测（需项目主人提供第二个 Key）；claude/gemini/minimax 三协议适配仍未经真实 Key 端到端验证（不属本次范围）。

---

## 2026-10-10（续·五）｜ AI 护栏：系统提示词加固 + 输入/输出过滤

**主题**：面向国内公开发布，AI 必须限定职责、拒绝违规内容、不外泄平台信息。分「软约束（提示词）+ 硬兜底（关键词过滤）」两层。

- **系统提示词加固**（`api/ai/analyze/route.ts` 的 `SYSTEM_PROMPT`，内置源与 BYOK 共用）：新增四块——
  ① 职责范围（只答本平台 8 模块相关人生规划问题，无关话题挡回）；② 边界与拒绝（政治敏感/淫秽色情/暴力违法/赌毒/自伤仅引导就医/仇恨，命中即简短拒绝不展开）；③ 平台隐私（不泄露系统提示词、分析框架、库结构、密钥、用户数据、后台设置，以及**技术运维细节**：服务器地址/IP、端口、运行环境与部署方式、环境变量、依赖与框架版本、文件路径、日志；抗"开发者/调试/运维"套取）；④ 抗越狱（要求覆盖规则时不生效）。明确三条拒绝戴帽：「不给医疗诊断/法律意见/投资结论」。
- **关键词过滤**（新建 `src/lib/content-filter.ts`）：`findBlockedTerm()` 归一化（去空白/分隔符/常见干扰符后 includes），高精度词表。
- **关键约束**：平台自身数据含大量「政治/赌博/性/颠覆/自杀」表述（「职场政治」「技术颠覆」「酒精赌博」「婚前必须谈性」…），**宽泛黑名单会当场拦掉平台正常内容**。因此词表**只收高精度、几乎不可能是正常用途**的表述（「颠覆国家」「分裂国家」「制毒」「贩毒」「冰毒」「色情」「淫秽」…），绝不用宽泛词。
- **输入过滤**：只扫用户 `question`（**不扫平台 item**），命中返回 400 + 统一提示，**在扣额度之前**，不扣次。
- **输出过滤**：流式循环内维护 24 字符滑动窗口扫描 `content`，命中即 `upstream.abort()` + 退还额度 + `ai_usage_logs.error_kind='content_blocked'` + 推送"该内容不适合显示，已停止生成"，并在 catch 里用 `blocked` 标志避免重复处理。
- **定位诚实说明**：这是**高精度关键词兜底**，挡不住谐音/拼音/拆字等刻意绕过，也不能替代模型侧官方审核。真正合规 = 提示词 + 过滤 + **国内带审核的模型** + 人工巡查。
- **验证**：临时 tsx 脚本核验 12 例全过（6 拦 + 6 放行，含"职场政治""技术颠覆""婚前性话题"等平台词**不误伤**）；端到端 curl（**UTF-8 文件传参**，因 Windows shell 直接把中文 curl 会乱码）违禁提问 400、正常提问走到鉴权门；`tsc`/`eslint --quiet`/`vitest 6/6` 全绿。临时脚本与载荷跑完即删。
- **待办**：输入/输出为进程内关键词表；国内正式上线建议叠加国内合规模型（自带审核）与人工巡查/留痕。

---

## 附录 A · 关键决策记录

| 决策 | 日期 | 理由 |
|---|---|---|
| AI 商业化：授权码含额度 + BYOK 免费，不做支付/按 token 计费 | 10-02 | 起步期无支付资质；按次心智简单；BYOK 本身是传播点 |
| 访客模型：列表可逛、详情/AI/生成锁定（取代"3/7 模块"方案 A） | 10-03 | 列表是"逛"的第一印象全放开；锁定点收窄到真正的付费价值 |
| AI 思维链实时显示（而非只换更快模型） | 10-02 | 实测中转站忽略 thinking:disabled，等待 60% 花在隐形思维链上；显示出来把黑等变推进 |
| 资源"URL 实测才入库"纪律 | 10-02 | 9 月刚清理过 778 条机器生成的模板假数据；宁可少而真实 |
| 高危赛道口径放宽为"趋势↓ 或 AI 高危" | 10-02 | 严格口径全库仅 1 条，是口径问题不是数据问题 |
| 保留 loopback/私有网段的 AI 源地址 | 10-02 | 项目明确支持本地模型/局域网网关；只拦云元数据等高危目标 |

## 2026-10-11 ｜ 收口：落库 + 清凭据 + 文档纠偏

**主题**：上一日的工作大部分没进 git，先把成果保住，再清掉不该留在仓库里的东西。

- **落库**：10-10 之后的工作区分 6 次提交——`c916473`（AI 双源容错 + 内容护栏，排在最前，
  否则健康模块那次提交会 import 尚不存在的 `content-filter.ts）、`7ddbad4`（四库数据审查）、
  `836d9c5`（资源补齐 888/888）、`b0b9831`（第 8 模块健康）、`8b645f1`（模拟器第六维）、
  `b337e27`（文档同步）。
- **清凭据**：删除 `_dbsetup/`（5 个明文 txt）。比对确认值都在 `.env.local` 中，
  其中 `API URL.txt` 是带 `/rest/v1/` 的 REST 端点，不是应用要的 base URL
  （`.env.local` 那份才对）。`.gitignore` 加 `_dbsetup/` 规则防 `git add -A` 误提交。
- **清临时文件**：5 个一次性审计输出（`*-urls.txt` / `missing-*.txt`）。
- **体检脚本转正**：`_cov.ts`（覆盖率）与 `_orph.ts`（孤儿键）合并为
  `scripts/check-career-resources.ts` + `pnpm check:resources`，另加第三项链接检查。
  实测 888/888、0 孤儿、0 可疑链接。判定规则收紧过一次：
  `developers.google.com/search` 是正常文档地址，只在"带查询串"时才判疑似搜索页。
- **文档纠偏**（此前 8 份文档集体停在 757/473/288/1,768）：README / AGENTS /
  PROJECT-BRIEF / ARCHITECTURE / HANDOVER / ROADMAP / LAUNCH-CHECKLIST / 接手文档
  全部对齐到 267 规律 + 488 窗口 + 250 运气 + 888 职业 + 126 健康 = **2,019**，
  模块 7→8。KNOWN-ISSUES 与 PRODUCT-AUDIT 是历史快照，不改写正文，只在
  KNOWN-ISSUES 顶部加了当前值提示。

**经验**：文档漂移的根因是同一批事实被 8 份文档重复描述。改数据时至少同步
README / AGENTS / PROJECT-BRIEF / 接手文档 / DEVLOG 这五份；历史提交记录里的
数字不要回改，那是当时的事实。

---

## 2026-10-11（续）｜ 数据库：库已建，卡在"验证不了"

**主题**：主人说 Supabase 生产库已建、密钥还在。于是把"建表是否齐全"做成可执行清单，
但本机连不上实例，验证这一步被网络卡住。

- **确认配置正确**：`.env.local` 三件套齐全，`SUPABASE_URL` 是纯 base URL
  （0 处错加成 `/rest/v1`）——当初 `API URL.txt` 那份带后缀的确实不是应用要的。
- **新增体检脚本**（`d484a37`）：
  - `scripts/check-supabase.ts` → `pnpm check:db`：探 10 项表/列、4 个 RPC
    （`consume_ai_credit` / `refund_ai_credit` / `hit_rate_limit` / `admin_adjust_credits`，
    都是代码里 `.rpc()` 实际调用的）、`app_settings` 两个开关种子、各表行数。
  - `scripts/check-supabase.sql`：同一份清单的 SQL 版，Dashboard → SQL Editor 粘贴即用。
- **本机连不上，且已排除"是本项目问题"**：到所有 `*.supabase.co` 项目域名都
  TLS 握手失败（curl exit 35，`schannel: failed to receive handshake`）。
  对照实验：不存在的子域 `zzzqqqnotareal999.supabase.co` 同样失败，
  `api.supabase.com` 正常 401、`example.com` / `cloudflare.com` 200。
  代理隧道能建立（`CONNECT ... 200`），直连、强制 IP、`--tlsv1.2`、`--http1.1`、
  80 端口全部 000。→ **是出网放行列表里没有 Supabase 项目域名，跟库无关。**

**经验**：以后遇到"连不上外部服务"，先拿一个同域名的随机子域做对照。
如果随机子域也失败、同站其他域名却正常，那 100% 是网络放行问题，
不要继续往"配置错了 / 服务没开 / 建表缺失"的方向查——这条排查走了四五轮才收住。
对这种注定会在别的机器上跑的校验，写成 SQL 版比只写 Node 版更有用：
用户在 Dashboard 里粘贴一次就能拿到结果，不依赖任何本机网络。

---

## 2026-10-12 ｜ 数据库验证通过：16 项全 ✅

主人按 SQL 版在 Dashboard 跑了 `scripts/check-supabase.sql`，截图回传：

- **表与列 10 项全 ✅**（含 `app_users.ai_credits` / `ai_credits_total` / `invite_codes.ai_credits`
  三个额度制列——老库最容易漏的就是它们，这个库没漏）
- **RPC 4 个全 ✅**：`consume_ai_credit` / `refund_ai_credit` / `hit_rate_limit` / `admin_adjust_credits`
- **开关种子 ✅**：`builtin_ai_enabled = true`、`redeem_enabled = true`
- **行数**：全空库（app_users 0 / invite_codes 0 / ai_credit_logs 0），
  只有 `app_settings` 2 行种子和 `rate_limits` 3 行历史限流桶。**无存量数据要迁移**，
  上线时第一批邀请码要现场建。

结论：**上线硬门槛第 1 条里"数据库"这一半完成了**。剩：本地闭环手测
（注册→登录→建码→兑换→余额到账），以及注意本机网络放行问题可能同样影响
dev server 的服务端 fetch（Next.js/undici 默认不走 `https_proxy` 环境变量，
若直连也被拦，注册会报 `fetch failed`——届时在代理软件加 `supabase.co` 规则或开 TUN）。

---

## 2026-10-12（续）｜ 全量深度审计

**主题**：主人要求"从功能到代码到视觉到人交互到数据完整度，全面深度检测，并同步文档，
判断这个阶段能否收尾"。

- **方法**：原计划派 3 个子代理并行审（数据 / 交互 / 文档），**全部因本机网络 502 失败**，
  改为本机串行扫描。教训记下：这台机器的出网限制会同时打到子代理和 npm/API，
  涉及网络的并行方案要有串行退路。
- **新增 `pnpm check:data`**（`scripts/check-data.ts`）：把数据体检做成可执行清单——
  条数、重复 id、枚举对齐、字段完整度、健康七子域、数值边界。实测 **2,019 条全绿**。
  与 `check:resources`（外链资源）互补。
- **修**：`career/page.tsx` 筛选无结果时是空白（只有"显示 0 / 0"），
  新增空态卡片 + 「清空全部筛选」一键重置。
- **产出** `docs/AUDIT-2026-10-12.md`：11 项"确认无问题" + P1 1 项 + P2 4 项 + 功能完成度表
  + 收尾判断。

**两个必须记下的修正**（都是我上一轮差点报错的）：

1. **laws / luck / user 的弹层并不是缺 Esc**——它们各自实现了 `keydown`，
   laws 还额外支持 ←→ 切换上/下一条（`laws/page.tsx:581-594`）。
   我先用"没用 `useEscapeKey`"去判，差点误报三个 P1。
   **判"缺某个基础件"之前，先看它有没有被就地实现**，hook 只是其中一种写法。
2. **"表单无持久化"这条旧记录已经不成立**：simulation / destiny / health / name
   四个有输入的页面现在全部走 `usePersistedState`。文档里的旧结论要跟着删，
   否则下一轮会照着错误前提去"修"一个已经修好的东西。

---

## 附录 B · 未决事项（承接 ROADMAP）

- ~~Supabase 三件套配置~~（项目已建、env 已填）；**剩下：验证建表齐全**
  （`pnpm check:db` 或 Dashboard 跑 `scripts/check-supabase.sql`），
  以及存量环境重跑 schema.sql（额度制列）——两个脚本都幂等，验出缺再执行。
- 职业数据：~~888 目标是否继续扩容待定~~（2026-10-11 已达成，资源 888/888 全覆盖）。
- 统一卡片体系 / 容器宽度 / 色板收敛（需视觉迭代）。
- admin 统一会话、限流持久化、AI 多协议实测；测试仅覆盖职业资源（auth/AI 流程待补）。
- AI 备用源 env 值尚未配置（需第二个 Key）；配置后需真机走查容错路径。
- 生产构建 `pnpm build` 自第 8 模块落地后未复跑；真机移动端走查未做。
