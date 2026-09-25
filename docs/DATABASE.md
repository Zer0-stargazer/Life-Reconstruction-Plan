# 数据库 DATABASE.md

## 现状

- 数据库：Supabase PostgreSQL，`@supabase/supabase-js` 直连（service_role 或 anon key）
- 代码里装了 `drizzle-orm / drizzle-kit / drizzle-zod`，但**运行时从未使用**，仅 `schema.ts` 用 drizzle 语法定义类型（见 KNOWN-ISSUES #16）
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
| invite_code_used | varchar(50) | 升级所用邀请码；退出开发者模式时据此决定降回 premium 还是 normal |
| is_active | boolean | false = 禁止登录 |
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
| used_count | integer | 兑换时 +1（读后写，见 KNOWN-ISSUES #7） |
| is_active | boolean | |
| created_by | varchar(50) | 固定写 'developer' |
| expires_at | timestamptz | NULL = 永久 |
| created_at | timestamptz | |

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

drizzle schema 里有定义，代码未使用。建表脚本里保留了，可删。

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
