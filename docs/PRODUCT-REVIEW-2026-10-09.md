# 产品评审与决策记录（2026-10-09）

本文档记录 2026-10-09 与产品负责人的讨论结论，是 Haiku 执行代码的唯一依据。密钥、Token 等敏感信息不写入本文档。

## 一、评审结论概要

第二轮深度检查（Opus，含截图、代码与数据抽查）结论：底子不差，但视觉、文案、数据在讲三个互相矛盾的故事——内容讲“名字、命运、人的一生”，外观是“科技作战室”，数据又夹杂伪造权威与宿命论。

- 视觉：153 处英文等宽 HUD 标签、7 套彩虹渐变 App 图标、网格/光晕/ping 动画、“策略游戏/作战室”隐喻；移动端首屏横向溢出。
- 内容：`luck-nodes.ts` 的 `realCases` 为套模板的伪造权威（“某平台统计…”出现 10 次，挂哈佛/斯坦福等名头无出处）；严肃词条（精神健康、职场性骚扰、重大疾病）套用不当模板；命运评级按出身/地域/学历打 D；`/name` 评分与解读均为随机；“百分比”笔误、重复条目、内部矛盾、事实错误；医疗/投资条目无免责。
- 工程：无 RLS、会话密钥回退到后台密码、AI 失败不退额度、客户端可指定模型、限流在 Vercel 无效、付费用户无法续充、`test-key` 未鉴权且 SSRF 可绕过、兑换码可预测。

## 二、已确认的决策

| 事项 | 决定 |
|---|---|
| 命运基础报告（本地计算） | 免费，仅 AI 深度解读收费 |
| 访客试用 | 每个模块可免费展开 1 条详情，之后需输入邀请码 |
| 命运评级 | 删除 S/A/B/C/D 与总分，改为描述性画像 |
| 部署 | 先部署到 Vercel，验证后再考虑国内备案 |
| 数据来源 | `windows`、`luck-nodes` 注明“参考 npcnpc.com”，无法确认授权则逐条改写为原创表述 |
| 问题数据 | `realCases` 模板文本直接删除；有可核实出处的才保留并附链接 |
| 收费模式 | 免费体验 + 永久解锁内容 + 按量 AI 额度包；BYOK 永久免费；不做永久无限 AI |
| 收费节奏 | 第一阶段免费体验 + BYOK，不接收款；第二阶段视数据用全球 Merchant of Record 小范围试收海外款。大陆用户暂不收费 |
| 不办理 | 不办理个体工商户 |
| 授权码 | 现为手动邀请码；远期支付后自动生成一次性兑换码，绑定订单号 |
| 视觉方向 | “一本人生手记”：墨 + 宣纸米白 + 朱砂点缀，宋体为主角，大留白，克制动效；去掉科技 HUD 与彩虹渐变 |
| 信息架构 | 7 模块收敛为 5 章（路由不变，只改导航与叙事分组，见第四节） |

## 三、开发者后台（已定）

1. **调用量看板维度**：用户、日期（按日聚合，近 30 天）、模块、成功/失败。token 与估算成本：若上游返回 usage 则记录，成本按环境变量单价估算；拿不到则显示“—”，不做假数。
2. **额度增减与退款**：
   - AI 调用失败自动退回 1 点，写入 `ai_credit_logs`（原因 `refund_on_error`）。
   - 后台可手动加减额度，必须填写原因，同样写入流水。
   - 不做支付退款（第一阶段无收款）。
3. **权限**：不做按用户的细粒度功能权限。保留角色 + 启用状态 + 额度，另加**全局功能开关**作为应急闸：内置 AI 开/关、新用户注册开/关、邀请码兑换开/关。

## 四、Haiku 任务清单

### 执行规则（每批都适用）

- 每批开始前新建 git 分支 `batch-N-xxx`，结束时 `pnpm run validate` 必须通过，再提交。
- 不读取、不输出、不提交 `.env.local` 和 `~/.claude/settings.json` 中的任何密钥。
- 不新增依赖，除非本清单明确写出。
- 每批完成后交给 Opus 审 diff，审过再进下一批。
- 改数据文件时只改条目内容，不改字段结构，避免牵连页面。

### 批次 1：安全与计费（上线硬门槛）

1. `supabase/schema.sql`：为全部业务表 `ENABLE ROW LEVEL SECURITY`（不建 policy，仅 service role 访问）；新增迁移文件说明执行方式。
2. `src/storage/database/supabase-client.ts:52`：缺少 service-role key 时直接抛错，不回退 anon key；加 `import "server-only"`。`session.ts`、`ai-stream.ts` 同样加。
3. `src/lib/session.ts:33`：只用 `SESSION_SECRET`，生产环境要求 ≥32 字符，否则抛错；删除对 `DEV_PASSWORD` 的回退。
4. 额度原子扣减：新增 Postgres 函数 `consume_ai_credit(user_id)`（`UPDATE … SET ai_credits = ai_credits - 1 WHERE id = $1 AND ai_credits > 0 RETURNING ai_credits`）和 `refund_ai_credit(user_id, reason)`；`api/ai/analyze/route.ts:207-229` 改用它们，所有错误分支（上游非 2xx、流中断、配置缺失）调用退款。
5. `src/lib/ai-providers.ts:88`：内置源（env）忽略客户端传来的 `model`，只用服务端配置。
6. `api/ai/analyze` 与 `api/ai/credits`：从数据库读取角色与 `is_active`，不信任 token 内的 role。
7. `api/invite/route.ts:114`：premium 用户允许兑换（只加额度，不改角色）；`:142` 的 `ai_credits_total` 改为“原累计 + 本次”。
8. `api/ai/test-key`：要求登录；删除 `builtin` 分支；fetch 加 `redirect: "error"`；错误信息不回显上游原文。`ai-providers.ts:49` 的内网判断修正 IPv6 方括号、`::ffff:` 映射地址和 `100.100.100.200`。
9. 限流：新增 Supabase 表 `rate_limits(key, window_start, count)` 与原子函数 `hit_rate_limit(key, limit, window_seconds)`；替换 `src/lib/rate-limit.ts` 和 `api/invite/route.ts:18` 的内存 Map。覆盖登录、后台密码、兑换码、analyze、test-key。
10. `api/admin/route.ts:241`：兑换码改为 `crypto.randomBytes` 生成 10 位（去掉易混字符 0/O/1/I），冲突重试；密码与 token 比较改用 `timingSafeEqual`；所有入参校验类型和范围。
11. `next.config.ts:9-15` 删除 `hostname: "*"` 的 remotePatterns；`robots.ts` 禁止 `/admin`；登录错误统一为“昵称或密码错误”；500 不回传 Supabase 原始错误。

### 批次 2：内容可信度

1. `src/data/luck-nodes.ts`：删除全部模板化 `realCases` 与 `silentCost` 中的“你用全部身家在赌…”类模板句；第 67 项（重大疾病）、第 88 项（职场性骚扰）、第 142 项（精神健康问题）人工重写为平实、尊重的表述，不能写好则下线该条。
2. `src/app/destiny/page.tsx:60-62, 150-195`：删除总分与 S/A/B/C/D 等级、关键词加减分；改为描述性画像（“你的底色 / 你的弹性 / 你的下一步”），三项雷达保留但不排序不评级；删除“考虑迁移到更大城市”“痛苦的经历往往蕴含最大的成长”这类话。
3. `src/app/name/page.tsx`：删除随机评分与随机解读，改为“起名灵感”：每个名字只展示音（声调起伏）、形（结构）、义（字义）三行，字义来自人工精选字池（删去“了、已、也、上、下、左、右、二、三、未”等）；删除 409-410 行无来源的“研究显示”。
4. `laws-cognition.ts:25-39`、`laws-wealth.ts:24-39`：“X到Y百分比”改为“X–Y%”，并补回被剥掉的标点。
5. 合并重复条目（保留信息更完整的一条，删除另一条）：认知 `cc-13/cg-22`、`cc-20/cg-26`、`cc-16/cg-32`、`cc-21/cg-33`、`cc-10/cg-35`；财富 `we-14/wf-21`、`we-19/wf-24`、`we-17/wf-25/wf-33`、`we-08/wf-27`、`we-06/wf-36`、`we-18/wf-28`、`we-05/wf-29`、`we-04/wf-31`；生物 `bd-11/26`、`08/24`、`09/23`、`10/25`、`13/34/22`、`14/35`、`15/36`、`12/30`。合并后同步更新首页与侧栏的总数（改为从数据长度计算，不再手写 288/1,768）。
6. 修正事实错误与矛盾：`bd-01`（菲尔普斯 23 岁、扎克伯格 19 岁）、`bs-06`、`bs-07`（银保监会、3% 与 <5%）、`bs-11`、`cc-03`、`bd-12` 与 `bd-06`、`bd-14` 与 `bd-35`；无出处的具体数字改为定性表述（`wf-34`、`cg-36`、`mc-12` 等）。
7. 宿命论文案：`windows.ts` 的 past 窗口模板“窗口已过，补救代价极高”改为“这条路变窄了，仍有其他路径”；`/me` 的“永久关闭”“关上就是关上了”改为“已走过”；“已错过”页签改名“回望”。
8. 免责声明：全站页脚与 AI 面板固定一句“内容为公开资料整理与推演，仅供参考，不构成医疗、投资或法律建议。”；`bd-09`、`bd-28`、`bd-12`、`wf-25`、`mc-06` 去掉具体剂量与配置比例。
9. 首页 FAQ（`page.tsx:59-61`）与 `/me:638-639` 的来源表述改为“依据公开资料与作者经验整理，为决策参考，非科学结论”；新增 `/about` “来源与方法”页，说明数据如何整理、哪些是示意案例。
10. 所有叙事性人物案例（“30岁的小杨”等）加“示意案例”标签；删除法律、医学类条目中的 emoji。
11. `windows.ts`、`luck-nodes.ts` 第 2 行的 npcnpc 来源：逐条改写为原创表述后删除该注释（此项工作量大，可拆为批次 2b 单独执行）。

### 批次 3：首次体验

1. `/me` 首次进入先询问年龄（一句话说明为什么问），存本地；删除默认 28 岁（`src/lib/default-age.ts`）。
2. 解锁弹窗 `src/components/auth/unlock-dialog.tsx`：Esc 关闭、焦点陷阱（用已有的 `@radix-ui/react-dialog`）、显示获取邀请码的联系方式（读取环境变量 `NEXT_PUBLIC_CONTACT`，未配置时隐藏该行）、登录/兑换成功后自动执行原动作（`use-locked-action.ts`）。
3. 访客每个模块可免费展开 1 条详情，第 2 条起弹出解锁。
4. 命运基础报告对所有人免费；只有“AI 深度解读”按钮走额度。
5. 统一首页与 FAQ 的起点建议：都指向序章（问年龄）。

### 批次 4：视觉重塑“人生手记”

设计令牌（`src/app/globals.css`，只改 `:root` 与 `.dark` 的值，不改变量名）：
- 纸：`--background: oklch(0.975 0.012 85)`，`--card: oklch(0.985 0.008 85)`
- 墨：`--foreground: oklch(0.22 0.012 60)`，`--muted-foreground: oklch(0.50 0.015 60)`
- 朱砂：`--primary: oklch(0.52 0.16 30)`（仅用于印章、当前项、主按钮）
- 线：`--border: oklch(0.88 0.012 75)`；`--radius: 0.25rem`
- 暗色：底 `oklch(0.17 0.008 60)`，字 `oklch(0.92 0.01 85)`，朱砂 `oklch(0.66 0.14 32)`
- 字体：用 `next/font/google` 引入 `Noto_Serif_SC`（400/600/700，`preload: false`），作为标题与引文字体；正文保持无衬线，行高 1.8。

任务：
1. `src/lib/module-identity.ts`：删除 `iconGradient`、`ring`、`tagColor` 的彩色值，统一墨色；`metric/unit` 的英文（COMBOS、JOBS、∞、AI REPORT）改为中文或删除。
2. 章节化导航（路由不变）：`app-sidebar.tsx` 与首页按五章分组——序章“你现在几岁”（/me）；第一章“你在哪”（/me 时间轴、/windows）；第二章“你的底色”（/name、/career）；第三章“看不见的齿轮”（/laws、/luck）；第四章“你能改什么”（/simulation）；终章“一页手记”（/destiny）。章节序号用中文（序、壹、贰、叁、肆、终）。
3. 首页 `src/app/page.tsx`：删除 HUD 状态栏、网格背景、光晕、ping 点、`AnimatedNumber`、`HeroOrbit`；首屏改为大号宋体标题 + 一句引文（“命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式。”）+ 一个主按钮“从序章开始”；模块卡改为目录式列表（章节号 + 标题 + 一句问题），无彩色图标块。删除“策略游戏、攻略、硬闯、作战室、作战地图”等用语。
4. 全站删除前台可见的英文等宽标签（`LIFE REBOOT`、`DATA POINTS`、`BUILD v1.0`、`FIG.`、`MODULES ·`、`N=473 / SRC windows.ts / CTRL · 01 / SYNC` 等），能删则删，必要的改中文。`font-mono` 只保留给数字。
5. 删除 `.card-hover` 上浮、`.tag-hover` 放大、`.theme-toggle` 旋转、`glow-pulse`、`progress-shimmer` 的使用；动效只保留淡入（≤400ms）。
6. Logo：火焰图标改为朱砂方形印章，内写“重”字（SVG），同步 `src/app/icon.svg`。
7. `module-page-head.tsx`：页头改为“章节号 · 标题 + 一句问题 + 细线”，去掉彩色图标块与右上英文注记。
8. 移动端：修复首页首屏横向溢出（390px 宽下无横向滚动）；排查开发模式左下角的 Next “1 Issue” 报错并修复。
9. 完成后用无头 Chrome 截图（1440 宽与 390 宽）首页、/me、/destiny、/laws，交 Opus 审。

### 批次 5：开发者后台

1. 调用量看板：读取 `ai_credit_logs`，按日期、用户、模块、成功/失败聚合；有 usage 时显示 token 与估算成本（单价来自环境变量 `AI_PRICE_INPUT_PER_M`、`AI_PRICE_OUTPUT_PER_M`）。
2. 额度管理：后台对单个用户加减额度，原因必填，写入流水；用户详情页显示流水。
3. 全局功能开关：新表 `app_settings(key, value)`，后台可切换内置 AI、注册、兑换三项；对应 API 读取开关，关闭时返回友好提示。
4. 后台会话：dev token 可撤销（存数据库并设 12 小时过期），`verify` 不再接受客户端传入的 `userId` 升级账号。

### 批次 6：测试与上线

1. 引入 `vitest`（允许新增此依赖），覆盖纯函数：额度计算、限流、SSRF 判断、兑换码生成、命运画像映射、年龄窗口筛选。
2. `pnpm run validate` 与 `pnpm build` 通过。
3. 新增用户协议、隐私政策、AI 免责声明页面。
4. AI 备用源与超时：上游 fetch 加超时，并在客户端断开时中止；`maxDuration` 按 Vercel 套餐上限设置。
5. 部署 Vercel：配置环境变量（由负责人在 Vercel 控制台填写，不写入仓库），执行 Supabase 迁移，按 `docs/LAUNCH-CHECKLIST.md` 手测。

## 五、待负责人提供

- 解锁弹窗显示的联系方式（微信号/邮箱），配置到 `NEXT_PUBLIC_CONTACT`。
- 是否能取得 npcnpc.com 的授权（默认按无法取得处理，逐条改写）。

## 六、已解决

- `claude-opus-5-5` 调用 400 问题：负责人已确认可正常调用。
- 提醒：`settings.json` 中以明文保存 API Token，不要提交到任何仓库，建议轮换。
