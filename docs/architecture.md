# 静态站架构

本仓库维护个人主页 custard.top。Next.js 从 `src/app` 和 `src/sites/personal-homepage` 导出页面和资源至 `out/`，由 Cloudflare 项目 `custard-web-platform` 托管。原 RocoDex 图鉴站已退役。

Next.js 只在开发和构建时运行。Cloudflare Workers Static Assets 直接返回 HTML、导航数据或媒体，找不到的路径返回生成的静态 404 页面。站点地图、RSS、机器人规则、公开 JSON 和分享图片均在构建时生成。

根路径 `/` 默认跳转到英文首页 `/en`，中文首页位于 `/zh`。英文栏目使用 `/en/work`、`/en/notes` 等路径，中文栏目使用 `/work`、`/notes` 等路径。页面链接切换语言，同一 URL 始终对应同一语言。旧 `/cstd` 路径继续由静态重定向兼容。

## 代码边界

- `src/app` 管理框架路由，站点模块维护内容、组件和交互。
- 重型 3D 代码保持懒加载。首次访问先展示完整内容，GPU 效果由用户主动开启。
- `public/cstd-*` 的 URL 保持稳定。没有哈希、缓存一年的资源更新时，必须同步更新引用的版本参数。
- `scripts/prepare-static-sites.mts` 在导出目录写入安全响应头、语言、缓存和重定向规则。

Windows 上 Next.js 的静态导出存在分段导航文件名问题（vercel/next.js#85374）。构建后整理导出文件名，与 Linux 输出保持一致。
