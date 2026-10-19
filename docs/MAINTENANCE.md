# 维护与发布

本仓库主要维护 custard.top。RocoDex 以静态存档保留。生产使用 Cloudflare Workers Static Assets 的纯静态托管，没有自定义 Worker 脚本；控制台仍会显示项目名称，但页面请求不运行 Next.js 后台。

## 本地

使用 Node.js 24 与 package.json 声明的 npm 版本。

```sh
npm ci
npm run dev
npm run dev:rocodex
```

个人主页 localhost:3000，存档 localhost:3001。没有账号、Redis、AUTH_SECRET 等运行配置。

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
npm run test:e2e:rocodex
```

build 分别导出两个站点，检查个人主页资源预算，再写入静态托管规则。浏览器测试针对真实静态托管，覆盖直接访问、深层导航、语言切换与图鉴功能。两个测试配置使用不同端口与报告目录，避免互相覆盖。

## 发布

GitHub Actions 运行验证；推送本身不会自动发布。验证通过后执行 npm run cf:deploy，发布个人主页与静态存档。已完成构建时可分别执行 npx wrangler deploy 和 npx wrangler deploy --config archive/rocodex/wrangler.jsonc，避免重复构建。

发布后运行 npm run verify:live:cstd，并检查 rocodex.custard.top 的图鉴详情、查询参数与静态 404。确认两个项目均没有后台脚本、数据库绑定和定时任务。

www.custard.top 的规范域名跳转使用 Cloudflare 域名重定向规则；不为跳转运行 Next.js。/cstd 旧路径兼容在静态 _redirects 中。

默认主页的正式滚动版式使用 public/cstd-scroll/cstd-editorial.css，动效使用懒加载的 GSAP。没有哈希而缓存一年的样式修改后，要递增组件引用中的 ?v= 版本参数。

内容维护见 src/sites/personal-homepage/content/README.md，视觉约束见 docs/cstd-visual-system.md。历史工程札记可能描述此前的双站共用后台，当前部署以本文与 wrangler 配置为准。
