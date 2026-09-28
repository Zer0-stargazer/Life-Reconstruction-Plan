# scripts/

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
