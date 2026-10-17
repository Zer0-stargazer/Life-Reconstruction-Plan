# 上线前检查清单 LAUNCH-CHECKLIST.md

> 创建：2026-10-06。用途：从"能跑的代码"到"敢开放给陌生人的产品"的收口清单。
> 按"不做就不能上线 → 上线后慢慢补"分三档；完成一项就勾一项并注明日期。
> 结论：骨架已完整（功能/权限/商业化/文档），差的是**生产环境、AI 供应商稳定性、合规、监控**四层。

---

## 上线必做（2026-10-15 审查）

- [x] 执行 batch13 迁移 —— ✅ 已完成
- [ ] **轮换曾泄露的 AI Key**（含 AI_API_KEY / AI_FALLBACK_KEY；旧 Key 在服务商侧作废）
- [ ] **生产变量清单**（Cloudflare Workers → Settings → Variables / `wrangler secret`）：
  - [ ] `SESSION_SECRET` ≥32 位：`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
        （缺失/过短时生产环境登录、验证码一律 500，不会回退默认值）
  - [ ] `DEV_PASSWORD` ≥24 位随机串（<16 位生产环境直接拒绝后台口令登录）
  - [ ] `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY`（两个必须一起配；NEXT_PUBLIC_ 需构建时存在）
  - [ ] AI 主源 `AI_API_URL / AI_API_KEY / AI_MODEL` + 备用源 `AI_FALLBACK_URL / AI_FALLBACK_KEY / AI_FALLBACK_MODEL`
  - [ ] `NEXT_PUBLIC_DONATE_URL` / `NEXT_PUBLIC_CONTACT` / `NEXT_PUBLIC_REPO_URL` / `NEXT_PUBLIC_SITE_URL`
  - [ ] 邮件：`MAIL_PROVIDER=resend` + `RESEND_API_KEY` + `MAIL_FROM`（生产环境 console 模式视为未配置，注册/找回发不出码）
- [ ] **Cloudflare Access 保护 `/admin` 与 `/api/admin`**（可选但推荐：在口令之外再加一层身份门）
- [ ] **确认 Worker 只能经 Cloudflare 访问**：限流依赖 `cf-connecting-ip`，若源站可被绕过直连，
      攻击者可伪造该头绕过全部限流（workers.dev / 自定义域都走 CF 边缘则天然满足）
- [ ] **接 Cron 定时调用** `purge_old_rate_limits` 与 `purge_old_ai_content`（Supabase pg_cron 或 Cloudflare Cron Trigger），
      否则 rate_limits 表无限增长、AI 对话正文超期不清除
- [ ] **Supabase RLS 核对**，SQL Editor 执行并确认业务表 `rowsecurity = true`：
      `select tablename, rowsecurity from pg_tables where schemaname='public';`
- [x] 安全响应头（CSP / HSTS / X-Frame-Options 等）已在 `next.config.ts` 配置，Node 与 vinext 两种运行方式均生效；
      改 CSP 后注意 Turnstile 域名白名单

---

## 一、上线硬门槛（不做就不是正式产品）

### 1. 生产环境从零到一 ⬜

- [x] Supabase 建项目（Dashboard）—— **✅ 2026-10-11 已完成**
- [x] 复制 URL / anon key / service_role key → `.env.local` —— **✅ 已填齐**（URL 为纯 base URL）
- [x] **验证建表齐全** —— ✅ 2026-10-12：Dashboard → SQL Editor 跑 `scripts/check-supabase.sql`，
      **16 项全 ✅**（10 项表/列 + 4 个 RPC + 2 个开关种子）。库是空库
      （app_users 0 / invite_codes 0），没有存量数据要迁移，直接可用
- [x] **迁移到最新批次**：batch6（账号）✅ / batch7（审核）✅ / batch8（云同步）✅ /
      batch9（授权码 kind 列）✅（2026-10-13 执行，E2E 12/12）；
      **batch10（user_state RLS，`2026-10-14-batch10-security.sql`）⬜ 待执行** ——
      未执行期间 user_state 无行级隔离（服务端接口有会话校验兜底，但不等于 RLS）；
      **batch12（反馈表，`2026-10-14-batch12-feedback.sql`）⬜ 待执行** ——
      未执行期间站内反馈表单提交会失败（其余功能不受影响）
- [x] **闭环实测** ✅ 2026-10-12：`pnpm check:flow` **9/9 通过**（注册 → 开发者口令校验 →
      建码带 5 次额度 → 第二账号注册 → 兑换前 0 → 兑换 → 兑换后 5 → 重复兑换被拒 →
      码用尽后被拒）。脚本只打 `localhost:5000`；会留 3 个 `e2e_*` 测试账号和 1 个
      `E2E-*` 码，脚本末尾打印清理 SQL
  - ✅ 2026-10-13 更新：当前网络可**直连** `*.supabase.co`，旧网络限制已不存在；
    若仍遇 `fetch failed` 先查本机代理/网络。另注意：限流依赖 Supabase RPC，数据库不可达时
    生产环境 fail-closed 返回「请 30 秒后再试」（开发环境放行并警告）——
    看到 30 秒限流提示先想网络，别只想触发频率（见 DEVLOG 2026-10-15）
- 说明：未配置时登录/兑换/后台/内置 AI 均不可用（BYOK 不受影响）
- [x] **生产构建验证** ✅ 2026-10-12
  - [x] 停 dev server → `pnpm build` → `pnpm start` 全路由走查：**24 个页面全部产出，
        15 个路由生产模式实测全部 200**，启动日志 0 报错
  - [x] 顺手修掉 build 唯一告警：`metadataBase` 未设置 → `layout.tsx` 改为读
        `NEXT_PUBLIC_SITE_URL`（部署时配真实域名）
  - 坑记录：`rm -rf .next.old` 撞沙箱批量删除阈值（1,713 文件），**先 `mv .next .next.old`
    再 build**，旧目录留着不管（已 gitignore）
- [ ] **部署**（1 天）
  - [x] 选定部署方式：**Cloudflare（vinext 路线）**——用户侧待办：`wrangler login` → `pnpm deploy:vinext`
  - [x] **域名 + HTTPS** —— ✅ **2026-10-17 已完成**：`https://lifesandbox.me`
        （阿里云 ¥1 首年购入 → NS 改 `aitana`/`carl.ns.cloudflare.com` → zone 自动激活 →
        API 绑 Custom Domain 到 worker `lifesandbox`，证书自动签发）。
        备用：`lifesandbox.eu.org` 申请中（请求号 20261017033633-arf-8647）。
        踩坑全集见 DEVLOG 2026-10-17 / SESSION-2026-10-17。
  - [x] 生产环境变量重配一遍 —— ✅ 2026-10-17：部署工具直接读取 `.env.local` 全量带入；
        **`NEXT_PUBLIC_SITE_URL=https://lifesandbox.me`** 已配置（OG/分享卡/canonical）。
        ⚠️ 仍需人工确认：`SESSION_SECRET` 是否已是强随机值（生产禁止用 DEV_PASSWORD 回退）
  - [x] 生产环境验证：全路由 —— ✅ 2026-10-17：首页 + 8 模块页 + /journey 国内直连全部 200；
        注册/登录 API 可达（限流/验证码工作正常）。**AI 全流程与兑换流程仍待用户实测一轮**

#### 部署位置的三层约束（2026-10-12 补，定方案前必读）

问"国内用户能不能正常用"，实际是三层问题叠在一起，只回答一层会选错方案：

| 层 | 放 Cloudflare / Vercel（境外） | 放国内服务器 |
|---|---|---|
| **① 用户访问前端** | 无中国大陆节点；`pages.dev`/`workers.dev` 常被 DNS 污染阻断（移动宽带最明显），绑**自定义域名**可改善但仍不稳、晚高峰波动 | 快且稳，但需 ICP 备案（1-3 周，域名先实名） |
| **② 服务端连 Supabase** | ✅ 境外互通，正常 | ❌ **不通**——本机实测 `*.supabase.co` 直连 `ECONNRESET`。国内服务器遇到的是同一个问题 |
| **③ 服务端调 AI 供应商** | ✅ 境外互通，正常 | ❌ **不通**——内置 AI **和 BYOK** 都走 `/api/ai/analyze` 由服务端转发（`ai-analysis-panel.tsx` 及各页面均 fetch 该路由），服务器出不去则全部失效 |

**结论**：国内服务器方案需要同时解决 ②③（换国内数据库 + AI 供应商换成国内可达的），
改造量远大于"买台服务器 + 备案"。**面向国内用户的低成本路径是境外托管 + 自定义域名 +
接受访问波动**，或把访客态静态化后放国内 CDN（动态功能仍走境外）。

技术可行性已确认（2026-10-12）：Next.js 16 走官方 `@opennextjs/cloudflare`（支持全部
Next 16 minor，用 Node 运行时 + `nodejs_compat`）；浏览器不直连 Supabase
（只有 `NEXT_PUBLIC_CONTACT` / `NEXT_PUBLIC_REGISTRATION_OPEN` 两个开关）；
密码用 `bcryptjs`（纯 JS，非 native），`node:crypto` 的 `createHmac`/`timingSafeEqual`
在 `nodejs_compat` 下可用 → 无阻断性不兼容。

### 2. AI 供应商稳定性 ⬜ —— 当前最大体验风险

- [x] AI 分析 50 秒总超时 + 断线中止上游（8cff398，2026-10-09）
- [ ] **更换或增备稳定供应商**（0.5-1 天）
  - [ ] 实测记录在案：<AI 中转站> 502 率约 50%，忽略 `thinking:disabled`，单次 13s 起步——面向真实用户等于"一半概率坏"
  - [ ] 方案 A：换稳定供应商，改 `.env.local` 三行即可（代码已兼容）
  - [x] 方案 B：代码加**多源容错**——内置 AI 主源"未产出内容即失败"自动切备用源（2026-10-10，`lib/ai-stream.ts` `streamChatWithFallback` + `lib/ai-providers.ts` `resolveFallbackSource`）；**还需在 `.env.local`/生产填 `AI_FALLBACK_URL/KEY/MODEL` 才真正生效**（三件套齐全才启用）
  - [ ] 想体验好：换一个非推理快模型（思维链占总时长 60% 的根因）
- [ ] **额度定价核算**：按真实单价算清"每码 200 次"的成本（当前默认值 200 未经核算）
- [ ] claude / gemini / minimax 三个协议适配仍未经真实 Key 实测（上线前在 /user 页各测一次）

### 3. 合规与信任 ⬜

- [ ] **用户协议 + 隐私政策**（0.5 天，文案起草后交项目主人过目）
  - [x] 两个页面草案（`/terms` `/privacy`），侧栏底部已链接（2026-10-10）
  - [ ] 项目主人审定正式文案后，注册处勾选
- [x] **AI 生成内容标注**（建议不做也在合规上做）
  - [x] AI 面板加一行"内容由 AI 生成，仅供参考，不构成人生/投资建议"（2026-10-10）
  - 说明：同时是产品定位（"不是算命是概率"）的自我保护
- [x] 注册开关：`NEXT_PUBLIC_REGISTRATION_OPEN=false` 关闭注册入口与接口（2026-10-10）
- [ ] **ICP 备案**：仅部署国内服务器时需要；走 Vercel 海外则不需要（权衡访问速度）

---

## 二、强烈建议（上线一周内补齐）

- [ ] **监控与备份**
  - [ ] Sentry 免费版（前端 + API 错误上报）
  - [ ] Supabase 自动备份开启
  - [ ] dev-server.log 换正式日志方案
- [ ] **安全收尾**
  - [ ] admin `verify` 的 userId 改从会话取（当前客户端自报，知密码者可升级任意账号且无操作者留痕）
  - [ ] 知晓限流为进程内存：重启清零、多实例不共享（单实例部署可接受）
- [ ] **真机移动端走查**（1 小时，性价比最高）
  - 本轮 UI 改动（顶栏偏移、居中面板、滚动定位、触控目标）只在代码层验证，从未真实浏览器确认
  - [ ] 手机点完 8 个页面 + 768px 以下浏览器宽度走查
- [ ] **内容审校**
  - [ ] 抽查 laws/windows/luck 文案质量（AI 味/错别字/口径矛盾）
  - [ ] 名字模块标注"演示模式"或接 AI（本地随机生成，访客会以为是坏的）

---

## 三、可以带病上线、之后补的

- [x] ~~职业数据 888 目标~~ ✅ 2026-10-11：职业 888、专属资源 888/888 全覆盖（`pnpm check:resources` 校验）
- [ ] 统一卡片体系 / 容器宽度 / 513 处色板收敛（视觉债，见 PRODUCT-AUDIT）
- [x] 测试接入：vitest（`pnpm test`），目前只覆盖职业资源数据完整性（2026-10-10）；auth/AI 流程测试待补
- [ ] Roadmap 爆点互动（今日一签、命运体检、反常识卡）——增长期的事

---

## 关键路径手测清单（每次发版前跑一遍）

1. 访客浏览：首页 → /career 列表可看 → 点卡片弹**解锁弹窗**（不登录）
2. 注册登录：/user 注册 → 登录成功有令牌
3. 授权码闭环：/admin 验证密码 → 建 1 个含 200 次的码 → 新账号在解锁弹窗兑换 → /user 显示"AI 余额 200 次"
4. AI 扣次：持码账号发起 AI 分析 → 流式出正文（思维链可见）→ /user 余额 -1
5. BYOK：/user 添加自定义源 → 测连通 → 用自带 Key 分析 → 余额**不**扣
6. 额度兜底：余额改 0（后台）→ 分析返回"额度已用完"文案
7. 预览锁定：登出状态点 /laws /luck 卡片、/simulation 完成、/destiny 生成 → 均弹解锁
8. 移动端：375px 宽度走查顶栏 / 列表 / AI 面板
9. 兜底：访问 /nonexistent 见 404 页

---

## 最小上线顺序

| 步骤 | 耗时 | 谁 |
|---|---|---|
| 1. Supabase 建库 + 重跑 schema + 闭环验证 | 0.5 天 | 主人操作，开发陪跑排错 |
| 2. 换/加稳 AI 供应商 + 多源容错 | 0.5-1 天 | 开发 |
| 3. 协议/隐私/AI 标注 | 0.5 天 | 开发起草，主人过目 |
| 4. build + 部署 + 强密钥 + Sentry | 1 天 | 主人定部署位置 |
| 5. 真机走查 + 手测清单 | 0.5 天 | 双方 |
| 6. 首批授权码发放上线 | — | 主人 |

合计约 3-4 个工作日。
