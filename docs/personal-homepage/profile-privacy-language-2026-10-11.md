# 公开资料与默认语言调整 · 2026-10-11

## 公开文案

按本人当前要求，公开文案保留数据科学本硕背景、研究兴趣与产品方向，不展示博士阶段信息。

公开页面只保留昵称、专业、研究兴趣、工具与项目能力。首页、其他主题、关于、现在、技术履历、搜索摘要、Person 结构化数据和 JSON 履历已同步。移除学校、个人所在地、就读年份及可识别学校的课程编号；项目使用的城市开放数据名称保留。

个人材料仅作必要事实核对，未复制私人原件、申请记录、真实姓名、成绩、证件、联系人或私人联系方式。对外履历使用 schema 2：专业阶段由 `stage`、`field` 表达。

同日后续本人要求按年月详述学习、项目和写作，相关活动日期现纳入 74 条能力时间线；学历字段仍不恢复学校及入学／毕业时间。后续实现与验证见 [详细时间线记录](capability-timeline-2026-10-11.md)。

## 默认语言

首次访问 `/` 或 `/index.html` 时读取浏览器的 `Accept-Language`，按权重支持中英文及地区、脚本变体；没有可用语言时保持中文回退。网站通过浏览器语言偏好判断，不读取设备设置或所在地。显式语言链接保持其语言。

手动选择优先于自动判断，保存语言偏好后完整导航，避免预加载的首页沿用旧语言。HTTPS 页面使用 Secure 偏好 cookie，本地 HTTP 预览可正常记忆选择。协商入口响应使用 `Vary: Accept-Language, Cookie` 及 `Cache-Control: private, no-store`。

## 验证与发布

代码检查、类型检查、内容与证据检查通过；89 个 Vitest 测试文件、327 项测试通过。Next / OpenNext 生产构建通过，839 个静态页面；Cloudflare 后处理验证 13 个媒体目录和 1651 个缓存文件，其中 825 个为来源哈希对应的种子。

最终 Wrangler 生产包上的完整浏览器回归：82 项中 76 通过、6 按原有条件跳过、0 失败，覆盖桌面与 Pixel 5。新增 8 项公开资料和语言检查在这次全量运行内全部通过；四套主题的首页与深层页面，以及正式主题内页的 WCAG A / AA 检查通过。最终日志为 `output/profile-release-personal-e2e.log`。

较早一遍运行发现本地 HTTP 未记住 Secure cookie（74 通过、2 失败、6 跳过）；修复后桌面 / 手机定向复验及上述全量运行通过。中途被打断的另一次运行不计作完整验证。

首页入口 JavaScript 为 134,228 字节，启动总量为 687,174 字节，继续低于原有 200,000 / 800,000 字节预算。生成后的页面和缓存扫描没有学校、课程编号或个人所在地字段。

2026-10-11 已通过 Wrangler 发布到 Cloudflare Worker `custard-web-platform`，版本 `9347fde1-d722-413a-bf54-7bdcaef6c3c0`。生产入口为 [custard.top](https://custard.top/) 与 [英文入口](https://custard.top/en)。此次未执行 Git commit 或 push。

扩展的真实线上检查通过：14 个中英文 HTML 页面、10 个公开契约、6 组浏览器语言 / 手动偏好场景、2 份不含学校和所在地的履历 JSON，以及清单、Feed、Sitemap 和内容健康度 100。另检查中英文案例及共享部署的 RocoDex 详情，均返回 200。

内置浏览器已复核线上中英文首页、关于页与英文履历，测试语言切换及刷新后的偏好；390 × 844 手机尺寸下，中英文首页均没有水平溢出，关于页和履历正常，控制台无警告或错误。临时尺寸已恢复。

真实生产截图保存在 `output/playwright/`：

- `profile-production-desktop-zh.png` / `profile-production-desktop-en.png`
- `profile-production-mobile-home-zh.png` / `profile-production-mobile-home-en.png`
- `profile-production-mobile-about-zh.png` / `profile-production-mobile-about-en.png`
- `profile-production-mobile-resume-en.png`

发布与线上检查日志为 `output/profile-production-deploy.log` 和 `output/profile-production-smoke.log`。日志、截图保存在忽略的本地输出目录，不进入公开静态资源。
