# 详细双语能力时间线 · 2026-10-11

## 内容与来源

按本人要求，将关于页 `06 / CAPABILITY TIMELINE` 从 9 条简述扩展到 74 条经历，覆盖 2020—2026 的七个年份。每条含年月或学期范围、经历性质、技术与方法、学习内容、实际工作、作品与写作，中英文逐条对应。

依据本人指定的两组学习资料目录、个人资料工作区的既有课程审查，以及代表性的个人报告、Notebook、代码、团队分工与 Git 历史核对。目录中的依赖、老师材料、队友文件、重复版本及空目录不作为个人成果数量；没有把课程目录当成课程通过清单，也没有重新运行全部历史作业。

早期覆盖化学实验、工程设计、微积分与线性代数、R 报告、MATLAB 数值计算、Java、算法练习和科学计算；之后覆盖 SQL、区域数据分析、Shiny、pandas、多源清洗、研究方法、生物信息学、Spark ML、Kafka 流处理、团队项目、八篇公开技术札记和两份初步 AI 研究计划。团队经历注明参与和具体贡献；个人产品发布标明 AI 辅助开发。

每条日期显式标注 `day`、`month` 或 `half-year`。报告正文日期、作业窗口及项目记录能支持月份时写到月；仅有学期依据的使用 `YYYY-H1 / YYYY-H2`，不补造某月某日，也不使用文件最后修改时间认定完成时间。页面统一按月份或半年显示，JSON 保留日期精度。内容核对日期与经历日期分别记录，知识图谱不会把半年字符串作为 ISO 更新日期解析。

课程文章、报告、Notebook 和摘要分别作为课程作品介绍；公开札记链接到站内文章。研究计划明确为准备阶段，不声称已经完成实验、取得研究结果或发表论文。博 0 仍然表示正在为博士阶段做准备。

## 隐私与交互

此次授权范围包括公开学习与项目年月；学历字段继续使用专业阶段，不恢复学校、入学或毕业时间字段。时间线、JSON 履历和知识索引不包含学校名称、课程编号、真实姓名、学号、成绩、私人地址、申请收件人、联络及申请状态，也不发布个人材料原件或本地来源路径。私有调查记录仅留在忽略的输出目录。

默认正式主题采用年份侧栏、日期列、细分标题与技术标签；手机切换为单列。支持年份跳转、逐条原生展开、全部展开和收起。详细内容在服务端 HTML 内，无 JavaScript 仍可展开；只有批量操作需要脚本。现在页使用最近三条、履历页使用最近四条，JSON 包含完整内容。知识图谱和搜索同步链接到有效条目锚点。

## 本地验证

- ESLint、TypeScript、内容与证据校验通过。
- 90 个 Vitest 文件、332 项测试全部通过，包含日期精度、排序、双语完整性、文章发布日期、研究状态、隐私与有效内部锚点。
- Wrangler 生产包浏览器回归共 90 项，84 通过、6 按原有条件跳过、0 失败。新增时间线检查覆盖桌面、Pixel 5、中英文、年份跳转、原生展开、全部展开、无 JavaScript 与 WCAG A / AA。
- Next / OpenNext 构建通过，839 个静态页面；后处理验证 13 个媒体目录、1651 个缓存文件和 825 个按来源哈希分区的路由种子。
- 首页入口 JS 134,228 字节、启动 JS 687,174 字节，继续满足 200,000 / 800,000 字节预算；详细学习叙述独立于客户端搜索索引。
- 浏览器实看正式主题桌面展开条目和 390 × 844 英文手机细节，无水平溢出。

本地日志：`output/timeline-unit.log`、`output/timeline-lint.log`、`output/timeline-final-typecheck.log`、`output/timeline-cloudflare-build.log`、`output/timeline-postbuild.log`、`output/timeline-personal-e2e.log`。日志与截图不进入公开静态资产。

## 发布核验

已通过 Wrangler 发布到 Cloudflare Worker `custard-web-platform`，版本 `3456b2ba-5383-430b-a662-2057b6fff162`，主域名及 www、图鉴域名触发器发布成功。此轮未执行 Git commit 或 push。

真实线上检查通过：14 个中英文 HTML 页面、10 个公开 JSON 契约、6 组默认语言与手动偏好场景、两份完整的 74 条双语 JSON 履历，以及清单、Feed、Sitemap 和内容健康度 100。履历检查同时验证了日期精度、详细学习与实践、作品、初步研究状态和隐私。

内置浏览器实看了线上中英文关于页：每页有 74 条记录、七个年份；全部展开确实打开 74 条，收起恢复原状，语言切换保留时间线位置。390 × 844 的中英文手机页面均无水平溢出，展开研究准备条目可读，相关技术名词和研究阶段标注正确，控制台未见警告或错误。

线上入口：[中文时间线](https://custard.top/about#capability-timeline)、[英文时间线](https://custard.top/en/about#capability-timeline)。发布和核验日志为 `output/timeline-production-deploy.log`、`output/timeline-production-smoke.log`；真实生产截图保存在 `output/playwright/timeline-production-desktop-zh.png`、`timeline-production-desktop-en.png`、`timeline-production-mobile-zh.png` 与 `timeline-production-mobile-en.png`。
