---
description: 规范提交（逐文件 add，conventional commits）
allowed-tools: Bash, Read
---
1. `git status --short` 和 `git diff` 看清全部改动
2. 按逻辑分组，**逐文件** `git add <path>`，禁止 `git add -A` / `git add .`
3. commit message 用 conventional commits：`type(scope): 中文描述`
   type 只能是 feat / fix / refactor / test / docs / chore / perf / style
4. **不要 push**

如果发现暂存区里混进了与本任务无关的文件，先停下来问用户，不要一起提交。
如果工作区有未跟踪的大目录（node_modules / dist / .next 等），确认它们在 .gitignore 里。