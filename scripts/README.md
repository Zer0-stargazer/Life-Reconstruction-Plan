# scripts/

运行入口脚本（由 `.coze` 配置引用）：

| 脚本 | 用途 |
|---|---|
| `prepare.sh` | dev 前准备 |
| `dev.sh` | 启动开发服务器（端口 5000） |
| `build.sh` | 生产构建 |
| `start.sh` | 启动生产服务器 |
| `validate.sh` | 类型检查 + lint |

> 本地开发可以不用这些脚本，直接 `pnpm install && pnpm dev` 即可。

## archive/

一次性数据生成脚本（15 个文件），**已归档，不可再运行**：

- `gen-*.js` / `gen-careers.ts`：生成 `src/data/` 下的职业、窗口、运气数据
- `fix-red-blue.js` / `remap-luck.js` / `enrich-windows.js`：数据后处理（改分类、补字段）
- `luck-raw*.json`：生成过程的中间产物

不可运行的原因：脚本内写死了云端沙箱路径 `/workspace/projects/...`（扣子编程 CLI 的环境），本地没有该目录。若要复用其中的生成逻辑，需先批量替换路径。

数据现状（2026-09-26 去重后，详见 docs/KNOWN-ISSUES.md）：

- `careers.ts`：1535 条（原 1539，已去重）
- `windows.ts`：473 条（原 479，已去重；文件含单行/多行两种格式批次）
- `luck-nodes.ts`：250 条 + `luck-red.ts` 50 条（预留数据，未接线）

首页统计已于 2026-09-26 改为真实值（288 / 473 / 250 / 1535）。
