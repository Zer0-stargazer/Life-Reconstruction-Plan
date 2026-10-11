# scripts/

## check-career-resources.ts

职业资源体检（只读，不写文件）：覆盖率 / 份数 / 通用化程度 / 孤儿键 / 链接协议。

```bash
pnpm check:resources
```

- **覆盖率**：888 个职业是否都有资源键（新增职业忘配资源是静默发生的）
- **份数**：每职业配了几条，不足 `MIN_ITEMS`（5）的逐个列出
- **通用化**：同一条链接被超过 `SAME_URL_MAX`（3）个职业共用 → 说明是"笼统给个大概"
- **孤儿键**：`career-resources.ts` 里有没有写了不存在的职业名（拼错就永远命中不到）
- **链接**：必须 https；疑似搜索页/平台首页会被标出

退出码 0 = 基础校验通过，1 = 有问题（明细打印在上方）。

> ⚠️ **2026-10-12 重要修正**：这个脚本以前只查"有没有 key"，配 1 条链接也算覆盖，
> 于是一直报「888/888 全覆盖 ✅」——**这个结论是有误导性的**。实测真相是：
> 资源总份数 1,675、人均 **1.89 份**、**882/888 职业不足 5 份**、
> 61 条链接被 4 个以上职业共用（最多的一个央行网址被 34 个职业共用），
> 共 **25.3% 的资源落在过度共用的链接上**。所以补了份数与通用化两项检查。
> 现在它会明确告诉你"基础校验通过，但专属化尚未达标"。

## check-data.ts

内容数据体检（只读）：条数 / 重复 id / 枚举对齐 / 字段完整度 / 数值边界。

```bash
pnpm check:data
```

2,000 多条手写条目里出任何一条错，表现都是"某个分类点不动了"或"筛不出东西"，
从 UI 上看不出根因。**改完 `src/data/` 就跑一次。**

- **重复 id**：会让 React key 冲突、列表渲染错乱
- **枚举对齐**：数据里的 `category` / `status` / `tag` 是否都落在配置对象里——
  不在的就永远筛不到，这类缺陷最隐蔽
- **字段完整度**：以第一条的键为基准，找缺字段的条目
- **健康模块**：七子域各 18 条、问卷覆盖七个域
- **数值边界**：`breakthrough`(0-100) / `intensity`(1-5) / `selfStudyScore`(0-100)

与 `check:resources` 互补：那个查职业外链资源，这个查内容数据本体。
2026-10-12 全量审计时实测全绿（2,019 条）。

## check-flow.ts

商业化闭环端到端自检（**会写数据库**）。

```bash
pnpm dev            # 先起 dev server（必须 5000 端口）
pnpm check:flow     # 另开一个终端跑
```

9 步一次跑完并逐步报结果：注册 → 开发者口令校验 → 后台建码（带额度）→
第二个账号注册 → 兑换前余额 → 兑换 → 兑换后余额到账 → 重复兑换被拒 → 码用尽后被拒。
等价于 LAUNCH-CHECKLIST「关键路径手测清单」的自动化版（2026-10-12 实测 9/9 通过）。

⚠️ **只打 `localhost:5000`**，不会碰到生产环境；但会留下 3 个 `e2e_*` 测试账号和
1 个 `E2E-*` 邀请码，脚本末尾会打印清理 SQL，去 Dashboard 执行一次。

## check-supabase.ts / check-supabase.sql

数据库建表体检（只读）。上线硬门槛第一条：登录、邀请码、开发者后台、内置 AI
全依赖数据库，缺表缺列缺函数时前端只表现成"接口 500"，从页面上根本看不出根因。

**两个版本查的是同一份清单**，挑网络能通的那个用：

```bash
pnpm check:db          # Node 版：需要能访问 https://<project>.supabase.co
```

```sql
-- SQL 版：Supabase Dashboard → SQL Editor → 粘贴 scripts/check-supabase.sql → Run
```

检查五项：

1. **表与列** 10 项（含 `app_users.ai_credits` 等额度制列——老库容易漏）
2. **RPC 函数** `consume_ai_credit` / `refund_ai_credit` / `hit_rate_limit` /
   `admin_adjust_credits`，都是代码里 `.rpc()` 实际调用的
3. **全局开关** `app_settings` 里 `builtin_ai_enabled` / `redeem_enabled` 两行种子数据
4. **行数**（只看规模，不读内容）
5. 缺什么就提示去执行 `supabase/schema.sql` + `supabase/migrations/2026-10-10-batch5-admin.sql`
   —— 两个脚本都幂等，已建过的库再跑一遍不会有副作用

安全说明：Node 版取行数用 `head + count`（只拿元数据）；RPC 探测传 `p_user_id = -1`
（不存在的人，业务异常恰好证明函数存在）；唯一会写的是限流函数探测留下的
`__checkdb__` 行，探测完立刻自删。SQL 版 100% 只读。

> ⚠️ 两种都用 service role key / 你自己登录的 Dashboard，**别把 key 贴进聊天记录**。
> 若曾在对话里出现过，去 Dashboard → Settings → API 轮换一次。

## archive/

> 2026-09-28：原先的 `prepare.sh / dev.sh / build.sh / start.sh / validate.sh`
> （`.coze` 平台运行入口）已删除——`package.json` 不引用它们，本机一律走
> `pnpm install && pnpm dev && pnpm build`。这个目录现在只剩归档脚本。

一次性数据生成脚本（15 个文件）。**已归档**——它们会直接改写 `src/data/` 下的文件，
跑之前务必先 `git commit` 或备份，跑完用 `git diff` 复核。

- `gen-*.js` / `gen-careers.ts`：生成 `src/data/` 下的职业、窗口、运气数据
- `fix-red-blue.js` / `remap-luck.js` / `enrich-windows.js`：数据后处理（改分类、补字段）
- `luck-raw*.json`：生成过程的中间产物

### 路径问题 ✅ 已修（2026-09-27）

原先脚本里写死了扣子云端沙箱路径 `/workspace/projects/...`（本地没有该目录），
部分脚本又依赖"必须在项目根目录下运行"。现已统一改为：

```js
const fs = require('fs');
const path = require('path');
// 项目根路径：本脚本位于 <root>/scripts/archive/，不依赖运行时的 cwd。
const ROOT = path.resolve(__dirname, '..', '..');
const P = (p) => path.join(ROOT, p);

fs.readFileSync(P('src/data/windows.ts'), 'utf8');
```

即：现在**可以从任意目录运行**，例如：

```bash
node "C:/Users/Administrator/Desktop/Vibe coding/Personal Interest Development/人生重构计划/scripts/archive/gen-windows.js"
```

已校验：11 个脚本语法（node --check）全部通过，15 处 `P()` 路径引用全部能解析到真实文件。
（注：`luck-raw*.json` 随脚本一起归档在 `scripts/archive/` 下，引用已同步指向该目录。）

数据现状（2026-09-26 去重后，详见 docs/KNOWN-ISSUES.md）：

- `careers.ts`：1535 条（原 1539，已去重）
- `windows.ts`：473 条（原 479，已去重；文件含单行/多行两种格式批次）
- `luck-nodes.ts`：250 条（`luck-red.ts` 50 条预留数据已于 2026-09-28 删除，全项目无引用）

首页统计已于 2026-09-26 改为真实值（288 / 473 / 250 / 1535）。
