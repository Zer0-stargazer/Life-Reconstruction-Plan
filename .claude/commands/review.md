---
description: 用 reviewer 子代理审查当前未提交改动
allowed-tools: Task, Bash, Read
---
先跑 `git diff` 拿到改动内容，然后交给 reviewer 子代理审查。

汇总时按严重程度分组：
- 🔴 阻塞（必须改）
- 🟡 建议（可选）
- 🟢 可以考虑更简单的写法

每条都要有「文件:行号 + 问题 + 为什么 + 怎么改」。
没有实质问题的维度直接略过，不要凑字数。