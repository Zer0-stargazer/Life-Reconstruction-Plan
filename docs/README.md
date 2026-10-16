# docs/

这是项目文档入口。根目录只保留运行说明和协作约定；项目全景、路线图、审计与工程细节都收在 `docs/`。

## 必读顺序

1. [`00-优先阅读-项目接手.md`](00-优先阅读-项目接手.md)  
   第一入口：项目是什么、怎么跑、现在处于什么阶段。

1.5. [`SESSION-2026-10-15-收尾交接.md`](SESSION-2026-10-15-收尾交接.md)  
   **要上线就读这份**：上线前最后一轮的全绿验证结果、数据量核对、遗留项清单、
   可直接粘贴的部署步骤与冒烟测试脚本、安全基线、工程红线（PowerShell BOM 坑等）。

2. [`DEVLOG.md`](DEVLOG.md)  
   开发日志：2026-04 起全时间线（每日批次、commit 哈希、决策记录）。查"什么时候改的什么"先看这里。

3. [`PROJECT-BRIEF.md`](PROJECT-BRIEF.md)  
   项目全景：产品结构、模块、目录地图、待决策事项。

4. [`../README.md`](../README.md)  
   对外说明：产品结构、技术栈、启动方式。

5. [`ROADMAP.md`](ROADMAP.md)  
   当前正在做什么、商业模式（开源免费 · 2026-10-14 起）、下一批工作。

6. [`KNOWN-ISSUES.md`](KNOWN-ISSUES.md)  
   历史排查记录、已修复问题、仍需注意的坑。

7. [`ARCHITECTURE.md`](ARCHITECTURE.md)  
   架构、权限、AI 链路、数据流。

8. [`HANDOVER.md`](HANDOVER.md)  
   工程规范、UI 规则、历史踩坑。

9. [`PRODUCT-AUDIT.md`](PRODUCT-AUDIT.md)  
   UI / UX / 产品结构审计与迭代记录。

10. [`DESIGN-VISITOR-PREVIEW-AND-CREDITS.md`](DESIGN-VISITOR-PREVIEW-AND-CREDITS.md)  
    **权限模型设计演进**：v1 访客预览 + 额度制 → v2 正式商业化 → v3 三层模型（2026-10-13）→
    **2026-10-14 起实际运行开源免费模式**（BUSINESS_MODE=open，登录即全功能，AI 唯一付费点）；
    v1/v2/v3 保留为决策脉络与 legacy 回退依据。

11. [`LAUNCH-CHECKLIST.md`](LAUNCH-CHECKLIST.md)  
    上线前检查清单：硬门槛（生产环境/AI 供应商/合规）+ 建议 + 手测清单。

12. [`API.md`](API.md) / [`DATABASE.md`](DATABASE.md)  
    接口和数据库契约。

13. `history/`  
    旧版参考快照：`DEVELOPER.md`、`HEALTH-REPORT.md`、`INTRODUCTION.md`。需要考古或对照历史结论时再读，不建议第一轮全读。

## 规则

- 改产品结构后，必须同步更新 `00-优先阅读-项目接手.md`、`PROJECT-BRIEF.md` 与 `ROADMAP.md`。
- 改权限模型后，必须同步更新 `ARCHITECTURE.md` 与 `KNOWN-ISSUES.md`。
- 修复一个 P0/P1 问题后，要在 `KNOWN-ISSUES.md` 标注日期和状态。
- **每个工作日的批次收尾时，在 `DEVLOG.md` 追加一节**（日期为标题、列要点与 commit 哈希）；
  其他文档只放"当前状态"，过程细节留给 DEVLOG。
- 不要把一次性排查过程写成新的独立文档；优先更新已有文档。
