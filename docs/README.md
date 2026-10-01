# docs/

这是项目文档入口。根目录只保留运行说明和协作约定；项目全景、路线图、审计与工程细节都收在 `docs/`。

## 必读顺序

1. [`00-优先阅读-项目接手.md`](00-优先阅读-项目接手.md)  
   第一入口：项目是什么、怎么跑、现在处于什么阶段。

2. [`PROJECT-BRIEF.md`](PROJECT-BRIEF.md)  
   项目全景：产品结构、模块、目录地图、待决策事项。

3. [`../README.md`](../README.md)  
   对外说明：产品结构、技术栈、启动方式。

4. [`ROADMAP.md`](ROADMAP.md)  
   当前正在做什么、哪些临时策略必须回滚。

5. [`KNOWN-ISSUES.md`](KNOWN-ISSUES.md)  
   历史排查记录、已修复问题、仍需注意的坑。

6. [`ARCHITECTURE.md`](ARCHITECTURE.md)  
   架构、权限、AI 链路、数据流。

7. [`HANDOVER.md`](HANDOVER.md)  
   工程规范、UI 规则、历史踩坑。

8. [`PRODUCT-AUDIT.md`](PRODUCT-AUDIT.md)  
   UI / UX / 产品结构审计与迭代记录。

9. [`API.md`](API.md) / [`DATABASE.md`](DATABASE.md)  
   接口和数据库契约。

10. `history/`  
    旧版参考快照：`DEVELOPER.md`、`HEALTH-REPORT.md`、`INTRODUCTION.md`。需要考古或对照历史结论时再读，不建议第一轮全读。

## 规则

- 改产品结构后，必须同步更新 `00-优先阅读-项目接手.md`、`PROJECT-BRIEF.md` 与 `ROADMAP.md`。
- 改权限模型后，必须同步更新 `ARCHITECTURE.md` 与 `KNOWN-ISSUES.md`。
- 修复一个 P0/P1 问题后，要在 `KNOWN-ISSUES.md` 标注日期和状态。
- 不要把一次性排查过程写成新的独立文档；优先更新已有文档。
