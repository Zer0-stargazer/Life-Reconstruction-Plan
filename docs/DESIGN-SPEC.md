# 人生沙盘 · 视觉规范 v1（2026-10-15）

> 以代码为准：主色朱砂 `--primary oklch(0.52 0.16 30)` / `#b2392b`，辅色青墨 `--ink-accent`，亮色米白底，暗色深岩灰。
> 任何新装饰件必须能归入下面三个母题之一，否则不加。

## 1. 视觉母题：一本可以推演的「决策图册」

纸、墨、朱砂印、刻度。不是仪表盘，也不是 SaaS 页面。

| 意象 | 现有出处 | 允许位置 | 频率 |
|---|---|---|---|
| **朱砂方印** SealMark | seal-mark.tsx / hero-atlas 中心 / 侧栏 | 侧栏 Logo、首页扉页与终章、/journey、/about 落款、OG、人生卡片 | 每页最多 1 枚，是页面上唯一的实色朱砂块 |
| **刻度轨道** HeroAtlas / TickRule | hero-atlas.tsx / fig-kit.tsx | 扉页主视觉、模块页头收束线、时间轴 0–100 轴、人生卡片 | 装饰透明度 ≤0.3，每页 ≤2 处 |
| **铜版细线 + 印刷注记** | 1px hairline、11px 大写英文（0.2–0.32em 字距）、`01 / 08`、FIG.01 | 所有分隔、卡片边界、数据注记 | 全站通用，是底色而不是点缀 |

站标只用方印；分叉轨迹 logo 不再使用。

## 2. Token

**字号**

| 角色 | 字号 | 字体 / 字重 | 行高 | 字距 |
|---|---|---|---|---|
| Display（扉页 H1） | clamp(56px, 7.5vw, 120px) | serif 700 | 1.0 | +0.02em |
| 章节大数字 | 144/176px | serif 700 tabular | 0.8 | 0 |
| 页头 H1 | 30/36px | serif 700 | 1.2 | -0.01em |
| H2 | 24/28px | serif 600 | 1.3 | 0 |
| H3 | 20px | serif 600 | 1.4 | 0 |
| 导语 / 引文 | 18px | serif 400 | 1.9 | 0.01em |
| 正文 | 15px | sans 400 | 1.8 | 0.01em |
| 辅文 | 13px | sans 400 | 1.7 | 0 |
| 注记 / 标签 | 11px | serif 拉丁大写或 mono | 1 | 0.2–0.32em |
| 编号 / ID | 11–12px | mono tabular | 1 | 0.15em |

**间距**：4 基数，只用 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96。

**圆角**：0 / 2px（印章、徽标）/ 4px（卡片、输入框）/ 6px（弹窗）。禁用 `rounded-xl` 及以上；`rounded-full` 只用于纯圆点。

**边框**：1px `border-border`；强调线 1px `bg-primary`；左侧状态线 2px。

**阴影**：卡片 0 阴影，只有 popover / dialog 用。不做 hover 阴影，不做 hover 抬升，按钮按压不缩放。

**动效**：沿用 `MOTION`（0.5 / 0.9 / 1.2s，power3.out / expo.out，stagger 0.09），Reveal 700ms；CSS 微交互 150 / 250 / 400ms `--ease-out-expo`。无限循环只保留两处例外：atlas 140s 自转、marquee 60s。

**纹理**：`.grain-texture` 亮色 0.015、暗色 0.03，只用在扉页、/journey、/about。

**颜色变量**
- `--ring` = primary。
- selection：亮色 `oklch(0.52 0.16 30 / 14%)`，暗色 `oklch(0.66 0.14 32 / 22%)`。
- chart 色阶：朱砂 → 朱砂 60% → 青墨 → 青墨 50% → 墨灰 25%。
- `--paper: #f6efe2`。

**语义色**：业务组件里只允许 primary（即将关闭 / 危险）、ink-accent（正在开启 / 机会）、foreground 透明度阶梯、destructive。模块标识色例外。

## 3. 字体

- **标题**：Noto Serif SC，自托管 woff2 子集（400 / 600 / 700）。子集 = 站内全部中文文案 + GB2312 一级字 + 拉丁基本区。
- **正文**：系统 sans。
- **等宽**：编号、日期、版本号用 mono，可自托管 IBM Plex Mono 拉丁子集。
- **拉丁注记**（PROLOGUE / CHAPTER）：用 serif 的拉丁字形。
- **字重**：serif 700 只给 Display、H1、大数字；serif 600 给 H2 / H3；serif 不用 500。
- **数字**：一律 `tabular-nums`，大于 999 的加千分位。

## 4. 关键页面

**首页**
- H1 字距 +0.02em。
- marquee 60s，分隔符用「·」。
- HERO_STATS 加一项「2,019 条内容」。
- 原则卡里的 amber 改为 foreground 阶梯，圆角改 `rounded-sm`。
- 页脚加版本行。

**模块页头**
- 收束线换成 TickRule，右端 `01 / 08 · N 条`。
- 标题旁放 IconPlate 印格：56px 虚线内框，左上角朱砂角。
- 搜索框用下划线式。

**/me**
- 状态色走语义色；徽标 `rounded-[2px]`；WindowCard 用 `border-l-2`，去掉 hover 阴影。
- 修把手光环：`hsl(var(--primary))` 在 oklch 下失效，改用 `color-mix`。
- 刻度数字用 mono tabular。

**LoginGate**
- 去掉居中卡片和 Lock 图标。
- 改成整页扉页：左栏放章节数字（serif 8xl primary）+ 该模块的问题；右栏放方印 48px、「登录后进入」、一行说明、方角按钮。
- 底部放 TickRule。

**/about**
- 版式按书的后记（Colophon）来：kicker `COLOPHON`，H1「一个人的沙盘」。
- 正文用「一 / 二 / 三 / 四」做序号，各段之间用 hairline 分隔，宽度 max-w-2xl。去掉 Heart、Coffee 图标。
- 赞赏按钮用方角朱砂，下方小字「不换任何功能」。
- 末尾放版权块（mono 11px）：版本、模块数、条数、起始日期、最后更新。之后是方印落款。

**/journey**
- kicker `EPILOGUE · 终`，H1 5xl。
- 复用 HeroAtlas 几何：已访问的节点画实心朱砂点，未访问的画空心点。
- 下方三格摘要。
- 两个动作：「生成人生卡片」「回到时间轴」。
- 不放彩带、评分、勋章。

**404**：用空态线稿；按钮方角；入口列表用带编号的 hairline 列表。

## 5. 资源

- **OG 图**：1200×630 SVG 源稿见 `assets/og.svg`，导出为 `public/og.png`。
- **空态线稿**：`src/components/shared/empty-art.tsx`，共三张：搜索无结果、暂无标记、404。
- **人生卡片**：1080×1350，内容层级依次为：页眉印章 → 年龄 220px → 0–100 时间轴 + 当前位置 → 开启 / 即将关闭两个计数 → 三项重点 → 右下 -6° 日期印 → 页脚水印。不出现姓名。

## 6. 用心的细节

1. 页脚版本行：`v{version} · 最后更新 {date} · 2,019 条`。
2. 编号统一用 mono tabular。
3. 数字统一 tabular，大于 999 加千分位。
4. 导语加 `hanging-punctuation` / `text-spacing-trim`（渐进增强）。
5. 引号统一用直角引号「」。
6. 亮色下方印加 `mix-blend-mode: multiply`，看起来像盖在纸上。
7. 焦点环和选中色都用朱砂。
8. Favicon、OG 与方印同源。
9. `@media print`：隐藏侧栏、导航、AI 面板。
10. 去掉 emoji 头像和权重里的 emoji。

## 7. 禁止

1. 蓝紫渐变、荧光、辉光、粒子、视差。
2. 业务组件里直接写 Tailwind 原色。
3. `rounded-xl` 及以上、`rounded-full` 徽标、玻璃拟态卡片。
4. 卡片阴影、hover 抬升或缩放、按压缩放。
5. 除上述两处例外之外的无限循环、回弹缓动、数字跳动。
6. 一屏出现两枚以上方印；用朱砂做大面积底色（marquee 除外）。
7. 拿通用 lucide 图标当视觉主角。
8. 鸡汤句、感叹号、加粗 sans 标题。
9. 第五种容器宽度、第十一种 H1。
10. 无法归入三个母题的装饰。
