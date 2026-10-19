# 静态站架构

个人主页是本仓库的主要维护对象。RocoDex 已停止功能维护，作为独立静态存档保留原域名。

| 站点 | 页面源码 | 导出目录 | Cloudflare 项目 |
| --- | --- | --- | --- |
| custard.top | src/app、src/sites/personal-homepage | out | custard-web-platform |
| rocodex.custard.top | archive/rocodex/app | archive/rocodex/out | custard-rocodex |

Next.js 只在开发和构建时运行。生产请求由 Cloudflare 根据域名选择静态站，直接返回 HTML、导航数据或媒体；文件不存在就返回本站的静态 404。没有运行时 Host 代理、SSR、OpenNext、登录会话、账号存储或自建遥测接口。

两个站共用根目录的 npm 依赖和锁文件；存档的独立 Next 配置只声明静态导出和共享源码根目录。浏览器资源与页面分别构建，互相不加载。RocoDex 只复制所需的图鉴图片，不携带个人主页的 3D 素材。

个人主页公开路径就是源码路径：中文 /、/work、/notes 等，英文 /en、/en/work 等。语言通过页面链接切换，不按 Cookie 或浏览器语言在后台判断。旧 /cstd 路径由静态重定向保留。

RocoDex 的搜索、筛选、对比、收藏和分享参数在浏览器处理。收藏继续保存在原域名的 localStorage 中，不需要账号。机器人规则、站点地图、RSS、公开 JSON 和分享图片均在构建时生成。

## 代码边界

- 路由负责框架适配，业务内容与交互留在站点模块。
- 个人主页只通过公开入口暴露组件、页面和内容，不依赖图鉴领域代码。
- src/components、data、hooks、lib、types 中原有图鉴模块继续由静态存档使用。
- 重型 3D 代码保持懒加载；普通访问先展示完整内容，GPU 效果由用户主动开启。
- public/cstd-* 的 URL 保持稳定；没有哈希、缓存一年的资源更新时，必须同步更新引用的版本参数。
- 安全响应头、语言与缓存规则由 scripts/prepare-static-sites.mts 写入各站的 _headers。

Windows 上 Next.js 的静态导出存在分段导航文件名问题（vercel/next.js#85374）。构建后仅整理导出文件名，与 Linux 输出保持一致；生产环境不增加兼容服务或自定义缓存协议。
