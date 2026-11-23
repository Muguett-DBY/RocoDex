# 个人主页运行说明

生产站点为 [custard.top](https://custard.top)，默认跳转到[英文主页](https://custard.top/en)，也可直接访问[中文主页](https://custard.top/zh)。

## 静态交付

页面、JSON、RSS、站点地图、机器人规则和分享图片均在构建时生成，由 Cloudflare Workers Static Assets 直接返回。

中文首页使用 `/zh`，英文首页使用 `/en`，访客可通过页面上的语言链接切换。根路径 `/` 固定跳转至 `/en`，同一个 URL 始终返回同一种语言。安全响应头与媒体缓存由构建生成的 `_headers` 提供。

## 性能与费用

- Cloudflare Static Assets 直接处理静态访问，没有自定义 Worker 代码执行与对应 CPU 消耗。控制台的历史 CPU 累计不会因迁移归零。
- 账户的 Workers 基础套餐仍供 MoovCare、Hireway 等动态服务共用；静态化不会取消其他项目需要的套餐。
- 首屏与懒加载 3D 包预算保留。默认图片展示，用户主动开启后才加载 GPU 运行时。
- 已移除自建访问指标 API、Redis 聚合和每周遥测工作流。需要流量观察时使用平台已有统计，不重新搭一套上报后台。
- CPU 用量是累计计算时间，不是实时 CPU 占用率，也不是网页停留时间。

## 发布验收

沿用 docs/MAINTENANCE.md 的验证和发布命令。生产检查包括中英文 HTML、公开 JSON、语言和安全响应头、站点地图、分享素材、深层导航、错误页面，以及不再请求 /api/auth/session 或 /api/cstd-vitals。

参考：[Static Assets 计费](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)、[Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)。
