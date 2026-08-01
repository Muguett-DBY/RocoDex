# RocoDex

RocoDex 是仓库的稳定图鉴产品。页面位于 `src/app/(rocodex)`；现有 `src/components`、`src/data`、`src/hooks`、`src/lib` 和 `src/types` 均默认属于 RocoDex。

`(rocodex)` 是 Next.js 路由组，不会改变任何生产 URL。它的布局独占 AuthProvider、RocoDex 元数据和页面底色，因此个人主站不再初始化账号会话。

本目录只收纳需要明确站点边界的入口级代码，例如 metadata 和 sitemap。稳定的图鉴领域代码不会仅为了目录对称而整体搬迁。

## 验证

```bash
npm test
npm run test:e2e:rocodex
```
