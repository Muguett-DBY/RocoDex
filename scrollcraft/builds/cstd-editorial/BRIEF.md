# cstd-editorial — 正式版个人主页（ScrollCraft 第二章）

本 brief 取代 `../cstd-flight/BRIEF.md`。上一版按访谈选择的 worldflight + 暗夜精密工程城
上线后，用户看过真实页面，给出新的、更高优先级的方向：

> 滚动起来一点都不丝滑啊，而且我的默认页面是要很正式的，你这弄的跟科幻电影一样了，
> 快改一下，我只是想让你用那个库弄好看的滚动效果。

## 八题（以本轮反馈为访谈记录）

1. **氛围（原话）**：正式。不是科幻电影。参照是用户自己已有的 atelier 正式版主页
   （纸白 #f8f5ef、墨 #242b27、青铜 #72582f、衬线大标题）。
2. **旅程**：沿用正式主页的信息顺序——扉页（我是谁）→ 方法（怎么做）→ 作品（代表作
   与数据深挖）→ 札记 → 实验室 → 版权页（联系）。
3. **能量曲线**：全程克制。唯一的高点是「贰 · 作品」章：147 万行真实数据的计数与
   图表揭示。其余章节安静、可读、快。
4. **感受与峰值**：读者应该感到「这是一个做事严谨的人」。记住的一个瞬间：
   1,470,000 这个真实数字落在纸面上。
5. **独有一手（签名动作）**：页边批注——正文旁的边栏短注（含真实交叉链接）随阅读
   到达而落位，细线连接。编辑部的批注，不是 HUD。
6. **审美区间**：Editorial（纸、folio、行宽、克制），不是 maximalist。
7. **一个连续世界还是分章？**：分章。Chaptered editorial grammar。上一版的世界飞行
   正是「最昂贵最脆弱」的做法，已被用户实测否决（不丝滑）。
8. **素材**：零视频、零生成。真实文案 + 既有图表 + 系统字体栈（生产环境用站点全局
   的 CSTD Press Serif）。

## 感受曲线

| 章 | 感受 | 画面成因 |
|---|---|---|
| 扉页 | 安静、可信 | 纸面上的名字与主张，衬线大字 |
| 壹 方法 | 清楚 | 三步编号行逐行落位，批注进边栏 |
| 贰 作品（峰） | 有分量 | 真实计数 1,470,000 落地 + 图表从左揭开 |
| 叁 札记 | 勤勉 | 三条最新札记，日期在前 |
| 肆 实验室 | 可验证 | 一段文字一个链接 |
| 版权页 | 收束 | 墨色版牌，链接排成一行 |

## 峰值

「1,470,000 行开放数据」的计数落地，在「贰 · 作品」章。该章拥有最大篇幅。

## 一句话

它是这样一个网站：像一份排好版的个人刊物，滚动的每一步都有东西安静地落位。

## authored silence

扉页即正文（无loading/HUD）；方法与札记章之间不加过渡动画——翻页就是翻页。

## 2026-10 · GSAP 迁移留档（引擎自本页退役）

生产页面的动效体系已由 ScrollCraft 引擎整体迁至 GSAP ScrollTrigger
（npm `gsap` 依赖，动态 import 进异步 chunk）。本目录自此为**历史档案，
不再部署**：

- **退役资产**（自 `public/cstd-scroll/` 删除）：`scrollcraft.js`（62,176B）、
  `scrollcraft.css`（19,949B）、`prototype.html`（12,160B）。目录静态资产
  116,224B → 31,212B，仅余页面样式 `cstd-editorial.css`（引用升 `?v=6`，
  immutable 缓存纪律见 docs/MAINTENANCE.md）。
- **新动效唯一住所**：`src/sites/personal-homepage/components/editorial/editorial-motion.ts`
  （`mountEditorialMotion(root, locale)`：gsap.context + matchMedia 全量编排，
  reduce 零注册、主题互斥挂起/恢复、destroy 干净回收）。
- **引擎遗留副本**：本目录 `index.html` 与 `cstd-editorial.js` 保持引擎时代
  冻结原样（历史构建，不部署）；`cstd-editorial.css` 按现行惯例与生产页面
  样式字节同步。
- **窗口参数表**：章 flow p 的数学（`clamp01((y+vh−top)/(height+vh))`）与
  ScrollTrigger `start:'top bottom'/end:'bottom top'` 的 progress 恒等，但引擎
  量算的章高**不含 GSAP pin spacer**（其 layout 先于 pin 创建）——spacer 计入
  后，章 p 后段的旧窗口会平移出 pin 行程（引擎时代 1,470,000 @0.88–0.985 /
  揭示 @0.87–0.97 是无 spacer 几何的标定，直接移植会导致计数在离屏时才走完、
  图版可见期间始终全闭，2026-10 视觉终审实测否决）。处置：数据章的大计数与
  图版揭示改挂 `.data-spread` 自己的 pin 行程（与 pin 同 trigger/start 的
  scrub 时间线，progress 即行程相对进度），计数窗 [0.1, 0.8]、揭示 [0.05, 0.7]
  ——pin 钉屏=结构保证可见；普查计数 7（@0.06–0.26 章头早期）与行线/落墨/
  漂移/金线窗口远离 pin 段，原样移植。pin 参数（method `top 14% +=105%`、
  data-spread `top 12% +=95%`，pinType:transform）逐字保留。含 pin 的章 flow
  时间线挂 `refreshPriority:-1`——全局 refresh 按 `_sortY` 排序且先 revert
  全部 pin，不压后会把章量短一个 pin 行程。
- **基准证据**：`lab/refactor/after/`（2026-10-15 重构后截图，含三张滚动
  中间态）。引擎时代的中间帧对位工具（diag-resize-snap）思路保留在 e2e
  注释中：scrub 数值采样一律 resize→refresh 快照对位。
