# 奶黄包的个人主页

作品、技术札记、个人履历和一些可以在浏览器里玩的实验。

- [个人主页](https://custard.top) · [English](https://custard.top/en)
- [RocoDex 静态存档](https://rocodex.custard.top)：停止功能维护，保留图鉴、攻略、搜索和本地收藏。

使用 Next.js、React 和 TypeScript。两个站点在构建时生成 HTML、导航数据和静态资源，由 Cloudflare Static Assets 直接提供；没有 Next.js 后台、登录、会话、数据库或自建访问指标接口。

使用 Node.js 24、npm 12：

```sh
npm ci
npm run dev             # 个人主页 localhost:3000
npm run dev:rocodex     # 存档 localhost:3001
npm run build           # 导出两个静态站
npm run cf:deploy       # 发布两个域名
```

检查与发布说明见 [维护文档](docs/MAINTENANCE.md)，目录边界见 [架构说明](docs/architecture.md)。

RocoDex 是非官方爱好者项目，参见 [免责声明](DISCLAIMER.md)、[数据来源](docs/guide_sources.md) 和 [许可范围](docs/LICENSE_SCOPE.md)。原创代码采用 [PolyForm Noncommercial 1.0.0](LICENSE)。
