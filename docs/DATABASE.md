# 数据库 DATABASE.md

## 现状

- 数据库：Supabase PostgreSQL，`@supabase/supabase-js` 直连（service_role 或 anon key）
- ~~代码里装了 `drizzle-orm / drizzle-kit / drizzle-zod`，但运行时从未使用~~
  → **2026-09-26 已移除**（依赖 + `schema.ts`/`relations.ts` 一并删除，表结构以本文件与 `supabase/schema.sql` 为准）
- **仓库没有迁移文件**，新环境必须手工执行 `supabase/schema.sql` 建表

## 表结构

### app_users

| 字段 | 类型 | 说明 |
|---|---|---|
| id | serial PK | |
| nickname | varchar(50) UNIQUE NOT NULL | 登录名 |
| password_hash | varchar(128) NOT NULL | bcrypt cost=10 |
| avatar | varchar(20) | 默认 🧑‍💻（注册接口写 👤） |
| role | varchar(20) NOT NULL | normal / premium / developer |
| invite_code_used | varchar(50) | 升级所用授权码；退出开发者模式时据此决定降回 premium 还是 normal |
| is_active | boolean | false = 禁止登录 |
| **ai_credits** | integer NOT NULL DEFAULT 0 | **AI 剩余额度（2026-10-03 额度制）**：内置 AI 每次分析乐观锁扣 1；BYOK 自定义源不扣 |
| **ai_credits_total** | integer NOT NULL DEFAULT 0 | 累计已到账（/user 展示用） |
| last_login_at | timestamptz | |
| created_at | timestamptz | |

索引：nickname、role。

### invite_codes

| 字段 | 类型 | 说明 |
|---|---|---|
| id | serial PK | |
| code | varchar(50) UNIQUE NOT NULL | 格式 `PREFIX-XXXXXX` |
| label | varchar(100) | 后台备注 |
| max_uses | integer | NULL = 不限次 |
| used_count | integer | 兑换时乐观锁占位 +1（`.eq("used_count", 读到的值)` 防并发超发） |
| **ai_credits** | integer NOT NULL DEFAULT 0 | **兑换此码到账的 AI 次数（2026-10-03）**；/admin 建码时填，默认 200 |
| is_active | boolean | |
| created_by | varchar(50) | 固定写 'developer' |
| expires_at | timestamptz | NULL = 永久 |
| created_at | timestamptz | |

### ai_credit_logs（2026-10-03 新增）

AI 额度流水：每一笔增减都留痕，供审计与对账。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | serial PK | |
| user_id | integer FK → app_users.id | |
| delta | integer NOT NULL | +N 到账（redeem_code）/ -1 消耗（analyze） |
| reason | varchar(100) NOT NULL | redeem_code / analyze / admin_grant |
| balance | integer NOT NULL | 变动后余额（对账用） |
| created_at | timestamptz | |

索引：user_id。

### access_logs

| 字段 | 类型 | 说明 |
|---|---|---|
| id | serial PK | |
| user_id | integer FK → app_users.id | |
| action | varchar(100) | register / login / redeem_code / become_developer / exit_developer |
| detail | text | |
| ip_address | varchar(45) | **代码从未写入**，恒为 NULL |
| created_at | timestamptz | |

索引：user_id、action、created_at。

> `visit_module` 动作在 schema 注释里出现过，但模块访问记录实际只存
> localStorage（`visited-modules`），**没有上报数据库**。

### health_check

原 drizzle schema 里有定义（drizzle 已于 2026-09-26 移除），代码未使用。建表脚本里保留了，可删。

## 连接配置

`src/storage/database/supabase-client.ts`：

- 读取 `.env.local` → `.env`（dotenv，代码里手动加载）
- 兼容旧前缀：`SUPABASE_URL` 或 `COZE_SUPABASE_URL` 等三对变量
- 无用户 token 时优先用 `SUPABASE_SERVICE_ROLE_KEY`（**绕过 RLS**），有 token 时用 anon key + Bearer 头
- 超时 60s，关闭自动刷新会话

⚠ 因此 RLS 不是安全边界：服务端一直用 service role。当前安全完全依赖"接口不暴露"，
而 `/api/invite`、`/api/admin(exit_developer)` 恰恰缺鉴权（见 KNOWN-ISSUES）。

## 建表步骤（新环境）

1. Supabase 创建项目
2. Dashboard → SQL Editor → 粘贴执行 `supabase/schema.sql`（可重复执行）
3. Project Settings → API 复制 URL / anon key / service_role key
4. 填入 `.env.local`（参考 `.env.example`）

> **2026-10-03 起已有环境必须重跑一次 schema.sql**：额度制新增了
> `app_users.ai_credits(_total)`、`invite_codes.ai_credits` 三列与
> `ai_credit_logs` 表；脚本含 `ADD COLUMN IF NOT EXISTS`，可安全重复执行、不动已有数据。
> 未执行前：后台建码/兑换/内置 AI 扣次会因缺列报错。

## 批次 5 迁移（2026-10-10）

文件：`supabase/migrations/2026-10-10-batch5-admin.sql`，SQL Editor 整段执行一次，幂等。

- **ai_usage_logs**：每次内置 AI 调用一条（user_id、module、success、error_kind、created_at），供后台调用量看板。
- **app_settings**：全局开关 `builtin_ai_enabled`、`redeem_enabled`，默认 true。
- **admin_adjust_credits(user_id, delta, reason)**：后台加减额度，行锁 + 余额不得为负 + 写 `ai_credit_logs`，仅 service_role 可执行。
- **dev_sessions**：开发者会话令牌库，仅存 sha256 哈希，12 小时过期。

> 未执行前：后台调用量看板、开关与开发者会话会报错。
