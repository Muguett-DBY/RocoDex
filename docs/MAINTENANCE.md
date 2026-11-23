# 维护与发布

本仓库维护个人主页 custard.top。生产使用 Cloudflare Workers Static Assets 的纯静态托管，页面请求直接从静态资源返回。原 RocoDex 图鉴站已退役。

## 本地

使用 Node.js 24 与 package.json 声明的 npm 版本。

```sh
npm ci
npm run dev
```

开发预览位于 localhost:3000。构建静态站无需账号、Redis 或 AUTH_SECRET 等运行配置。

Windows 上可在构建后运行 npm run start:local，在后台以 Wrangler 预览静态输出。脚本输出实际端口和日志位置，默认从 3200 起。npm run stop:local 只停止当前工作副本的 Wrangler 预览和 Next 开发进程。依赖重装前可运行 npm run ci:local。

## 验证

```sh
npm run content:check
npm run cstd:verify-proof
npm run lint
npm run typecheck
npm test
npm run build
npm run audit:dependencies
npm run test:e2e:personal
```

构建将个人主页导出到 `out/`，检查资源预算，再写入静态托管规则。浏览器测试通过静态托管覆盖直接访问、深层导航、语言切换和个人主页交互。

## 发布

GitHub Actions 运行验证。验证通过后执行 `npm run cf:deploy`，构建并发布个人主页。已完成构建时可执行 `npx wrangler deploy`，直接上传 `out/`。

发布后执行 `npm run verify:live:cstd`。脚本检查站点页面、元数据、静态资源与深层路由。

custard.top 根路径默认跳转至 /en，中文主页位于 /zh。语言切换使用明确的页面地址。

www.custard.top 的规范域名跳转使用 Cloudflare 域名重定向规则。/cstd 旧路径由静态 `_redirects` 兼容。

默认主页的正式滚动版式使用 `public/cstd-scroll/cstd-editorial.css`，动效使用懒加载的 GSAP。没有哈希而缓存一年的样式修改后，要递增组件引用中的 `?v=` 版本参数。

内容维护见 `src/sites/personal-homepage/content/README.md`，视觉约束见 `docs/cstd-visual-system.md`。历史工程札记记录了此前的部署，当前配置以本文与 `wrangler.jsonc` 为准。
