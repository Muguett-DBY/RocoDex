# ATELIER 正式主题验收 · 2026-10-11

此次修改围绕默认正式主题：暖白底色、墨绿色文字、香槟金折带主视觉、衬线标题，以及以真实案例为主的图文排版。中英文文案直接说明做过什么、使用什么技术和如何验证结果；案例技术栈来自已有内容真源。

首页、作品总览、案例、关于页与札记共用同一套标识和排版。三份代表作使用真实截图、热力图和专门的封面构图；案例正文提前显示并新增章节导航，保留技术重放、架构档案和证据功能。新图标与分享封面也已接入生产资源路径。

## 两个项目的实际用法

- [Shaders](https://github.com/shader-effects-inc/shaders)：网站依赖固定为 `shaders@4.0.4`，使用 MIT 版 `Shader` / `Satin`，关闭库遥测。只在访客点击“让光影流动”后加载引擎；不使用 Pro 预设。
- [Impeccable](https://github.com/pbakaus/impeccable)：直接阅读其公开设计指南，应用排版层次、留白、作品优先和克制动效的原则。没有安装 Codex skill、插件或 hook。
- 折带 C 为本地 SVG；复用已有本地衬线字体、项目截图和分析图表。首页正文保持服务端渲染，禁用 JavaScript 仍可阅读和使用作品锚点。
- WebGPU 不可用、加载失败或初始化超时会保留静态主视觉。渲染器在离开视口、文档隐藏、切换主题和平静模式下卸载，避免后台持续绘制。

## 验证记录

环境：Windows，Node.js 24.19.0，生产构建，Chromium 桌面与 Pixel 5 浏览器配置；另外使用 Codex 内置浏览器检查真实 WebGPU 和响应式视觉效果。

| 检查 | 结果 |
| --- | --- |
| 内容索引、案例证据、ESLint、TypeScript | 通过 |
| Vitest | 87 个测试文件 / 314 项测试通过，包含 4 项 Cloudflare 缓存布局回归 |
| 最终 Next 生产构建与 OpenNext 打包 | 通过：839 个静态页面；原有性能预算通过 |
| 个人站完整浏览器回归 | 在 Wrangler 生产包上执行 74 项：66 通过、6 按原有条件跳过、2 项证据区文字对比度失败；修复后这 2 项桌面 / 手机定向复验通过。适用的 68 项均有通过记录，并非声称最后一次全量运行零失败 |
| 新增 ATELIER 回归 | 桌面与手机共 14 项通过：无 JS、无 WebGPU、光影开启与停止、主题切换锚点、320 像素英文布局、作品 / 关于 / 札记 / 文章无障碍与案例目录 |
| Axe 可访问性 | 四套主题的首页与案例深层页面，以及正式主题的作品、关于、札记和文章，桌面 / 手机 WCAG A / AA 检查通过 |
| 真实线上光影 | 点击后进入“暂停光影”状态；停止后恢复“让光影流动”；开启、停止和主题切换时控制台无警告或错误。离开视口卸载由浏览器回归验证 |
| 真实线上视觉检查 | 中文 / 英文桌面首页、390 × 844 手机首页与作品区、关于页、Alpha 中英文案例；图片正常加载，案例章节链接可以到达正文 |
| 依赖审计 | 0 个已知漏洞 |
| 线上契约 | `verify-cstd-production.mjs` 通过：8 个中英文 HTML 页面、10 个公开契约、语言清单 / Feed / Sitemap，以及内容健康度 100 |
| 线上资源与深层路由 | 14 条主站与 RocoDex 路径全部返回 200，包含新图标、折带 SVG、分享 PNG、动态案例分享图及中英文案例 |

6 项跳过沿用测试原有条件：本地不执行 CI 专项检查、桌面与手机各自的导航几何检查，以及触屏配置不启用 WebGL 的检查；没有把失败用例改为跳过。

RocoDex 的现有公共页测试中，有 3 项等待页面发出 `/api/auth/session`，在本次未配置构建时 Auth 的静态页面上超时；另外 2 项未找到页面检查通过，1 项按原条件跳过。发布前线上也不显示登录入口。本次没有改动 RocoDex 认证功能，也未执行注册或登录写操作；已在真实生产域名点击进入精灵列表并打开迪莫详情，页面正常且无控制台错误。此记录不把 RocoDex 的上述 3 项超时写成通过。

部署前发现 Next 16.3 使用带来源模块哈希的缓存键，而 OpenNext 仍输出按 URL 保存的缓存文件。`cf-cache-layout.mjs` 从构建元数据读取真实键，验证来源哈希，并复制不可变种子到对应路径。Wrangler 中的案例与专题 404 已修复；发布包包含 825 个带来源哈希的种子，共 1651 个缓存文件。没有在运行时去掉来源哈希。

## 加载成本

最终构建的个人站首页入口 JavaScript 为 134,026 字节，启动阶段 JavaScript 合计 686,972 字节，分别低于原有 200,000 / 800,000 字节预算。此次未提高性能预算。

可选 Shaders 引擎 chunk 为 2,564,396 字节（本地 gzip 测量 731,445 字节），全部延迟到主动开启光影之后。构建检查会拒绝把该 chunk 加入首页启动资源。静态页面仍是默认浏览体验。

## 生产发布

2026-10-11 已发布到 Cloudflare Worker `custard-web-platform`，版本 `3abfc861-0856-49d2-a7d9-b3facbdbeeaf`。生产站点为 [custard.top](https://custard.top/) 与 [英文入口](https://custard.top/en)。共享 Worker 的 RocoDex 域名也已检查。此次通过现有 Wrangler 流程直接发布，未执行 Git commit 或 push。

以下截图来自部署后的真实生产页面，保存在忽略的本地输出目录：

- `output/playwright/atelier-production-desktop-zh.png`
- `output/playwright/atelier-production-desktop-zh-full.png`
- `output/playwright/atelier-production-mobile-zh.png`
- `output/playwright/atelier-production-desktop-en.png`
- `output/playwright/atelier-production-mobile-en.png`
- `output/playwright/atelier-production-mobile-about.png`
- `output/playwright/atelier-production-case-en.png`
- `output/playwright/atelier-production-shader.png`

检查日志：`output/atelier-production-deploy.log`、`output/atelier-production-smoke.log`、`output/atelier-production-routes.log`、`output/atelier-personal-e2e-final.log`、`output/atelier-a11y-final.log`。
