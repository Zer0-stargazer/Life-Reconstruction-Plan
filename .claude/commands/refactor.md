---
description: AST 结构化批量改造（ast-grep）
argument-hint: <旧模式> => <新模式>
allowed-tools: Bash, Read, Edit
---
对 `$ARGUMENTS` 做结构化改造，严格按下面顺序：

1. 确认 `git status` 干净；不干净就先提示用户
2. 用 `npx -y @ast-grep/cli --pattern "<旧>" --lang ts` **只列不改**，把命中清单给用户看
3. 用户确认后再 `--rewrite "<新>"` 批量替换
4. 跑 `/check` 验证
5. `git diff --stat` 汇报改了多少处

禁止用正则表达式或 Edit 工具逐个人工替换超过 5 处。