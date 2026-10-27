@AGENTS.md

# CLAUDE.md —— 人生沙盘（Next.js 16 + TS + pnpm）

上面通过 `@AGENTS.md` 引入了项目全景与命令，**那是唯一真源，不要重复维护**。
本文件只补充「AI 协作规则」。

## 命令（严格用这些，不要自创）

| 用途 | 命令 | 实测耗时 |
|---|---|---|
| 类型检查 | `pnpm ts-check` | ~53s |
| Lint（全量） | `pnpm exec eslint . --quiet` | ~101s |
| 测试 | `pnpm test` | ~13s |
| 一键校验 | `pnpm validate` | ~170s |

> 慢命令**只在 `/check` 时跑一次**，不要每改一个文件就跑。

## 自动校验机制（重要）

- 编辑 `.ts/.tsx/.mts` 后，PostToolUse hook 会读后台常驻的 `tsc --watch` 日志，
  只把**本次文件相关**的类型错误回灌给你。
- 收到「自动校验失败」→ 立刻修，不要继续往下写。
- 收到「同一错误已出现两次」→ **停止修复**，向用户说明情况。
- 首次启动守护进程需要 ~8 秒预热，那一次不会有反馈，属正常。

## 工具路由（严格遵守）

- 找符号 / 找调用链 → 用 serena 的 `find_symbol`、`find_referencing_symbols`
- 找文案、配置项、注释 → 才用 Grep
- 查第三方库最新 API → 用 context7，不要凭记忆写
- 批量结构化替换（>5 处）→ `npx -y @ast-grep/cli`，不要用正则或逐个 Edit

## 项目红线

- **编号与顺序的唯一真源是 `src/lib/module-identity.ts`**，禁止在页面里手写编号。
- 图表一律手写 SVG，**禁止引入 Recharts**。
- 颜色只用 CSS 变量（`--primary` 朱砂红 / `--ink-accent` 青墨），禁止硬编码色值。
- 内容数据改动前先跑 `pnpm check:data`，改完再跑一次确认条数与枚举对齐。
- `next build` 会重清 `.next`；vinext 构建会覆盖 `.next` 类型，跑完要重跑
  `pnpm build` 再 `pnpm ts-check`。
- `preinstall` 用 `only-allow pnpm`，**禁止用 npm / yarn 装包**。

## 纪律

- 一次只做一件事；改超过 3 个文件前先给方案等确认。
- 不顺手重构无关代码；发现问题只记录不擅自修。
- 提交前跑 `/check`；提交用 `/commit`（逐文件 add，禁 `git add -A`）。
- 同一类错误修两次还不过 → 停下来问用户。
- 新增依赖前必须问用户。