# 奶黄包的个人主页

作品、技术札记、个人履历和一些可以在浏览器里玩的实验。

[个人主页（默认英文）](https://custard.top) · [中文](https://custard.top/zh)

使用 Next.js、React 和 TypeScript。页面和资源在构建时导出，由 Cloudflare Workers Static Assets 提供。原 RocoDex 图鉴站已退役。

本地开发使用 Node.js 24 和 npm 12。

```sh
npm ci
npm run dev         # 开发预览，localhost:3000
npm run build       # 将个人主页导出到 out/
npm run cf:deploy   # 发布个人主页
```

检查与发布说明见 [维护文档](docs/MAINTENANCE.md)，目录边界见 [架构说明](docs/architecture.md)。

原创软件采用 [PolyForm Noncommercial 1.0.0](LICENSE)。照片、品牌素材与第三方内容的授权见 [许可范围](docs/LICENSE_SCOPE.md)。
