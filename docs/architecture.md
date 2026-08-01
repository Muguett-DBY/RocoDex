# 双站点架构

## 决策

个人主站与 RocoDex 是两个产品，但当前由同一个 Next.js 应用和 Vercel 项目交付。仓库采用模块化单体，而不是两个互相复制工具链的独立应用。

这条边界把部署复用和业务复用分开：

- 共用：Node/Next 工具链、Vercel 构建、根 HTML、Host 代理、robots 与 sitemap 序列化。
- 个人主站独占：视觉组件、作品内容、技术路径、Three.js 场景、元数据和 apex Host 策略。
- RocoDex 独占：页面、认证、账号 API、图鉴数据、搜索、收藏、攻略、阵容与领域类型。

## 请求流

```text
custard.top/
  -> src/proxy.ts
  -> rewrite /cstd
  -> app/(personal)/cstd/page.tsx
  -> sites/personal-homepage

rocodex.custard.top/*
  -> src/proxy.ts (pass through)
  -> app/(rocodex)/*
  -> RocoDex components/data/hooks/lib/types
```

`robots.txt` 与 `sitemap.xml` 是少数 Host 感知的共享入口。HTTP 路由只负责读取 Host 和组装响应；两站各自维护内容来源。

## 依赖规则

1. `app` 路由只做框架适配，不承载大段产品逻辑。
2. `sites/personal-homepage` 可以依赖第三方前端包和 `sites/shared`，不得依赖 RocoDex 目录。
3. 个人主站外部调用方只能使用 `index.ts`、`metadata.ts` 或 `server.ts`。
4. RocoDex 继续拥有 `components`、`data`、`hooks`、`lib` 和 `types`，避免为目录整齐制造大范围稳定代码迁移。
5. `app/layout.tsx` 保持中立；认证和 RocoDex 视觉底色只放在 `(rocodex)/layout.tsx`。
6. `public/cstd-*` 是个人主站公开 URL 契约。若要重命名，必须先提供兼容重写并验证缓存与社交预览。

## 工具链与重型运行时

- Vercel 与 GitHub Actions 固定使用 Node.js 24 LTS；npm 版本由 `packageManager` 声明。
- Three.js、React Three Fiber 和 Postprocessing 只能由个人主站的异步 `immersive-scene.tsx` 导入，架构测试会阻止它们进入共享层或 RocoDex。
- 个人主站先交付可读 HTML 和静态主视觉，再异步加载 Motion 特性与 WebGL。档案纹理位于独立 Suspense 边界，不阻塞场景核心背景首次成帧。
- 个人主站的 Research 章节必须保留原生纵向文档流；禁止用超宽 sticky 合成层接管滚轮。进入不透明的 Work、Research 或页脚后，WebGL 停止连续帧循环，但保持 Canvas DPR 与后处理缓冲区稳定，避免滚动途中销毁并重建 GPU 资源。
- `scripts/verify-personal-bundle.mjs` 在生产构建后检查首屏与 WebGL 异步包预算，并确认 Three.js 标记没有进入首屏入口。
- Dependabot 只自动提出兼容的常规升级；Three.js 与其类型包的 `0.x` 次版本升级必须人工阅读迁移指南并完成视觉回归。
- Three.js 当前固定在 r182。r183 起 `Clock` 被废弃，而 React Three Fiber 9.7.0 仍在内部使用它；升级到更高版本会污染浏览器控制台，需等待 Fiber 提供兼容版本后再重新验证。

## 何时拆成两个部署

只有当两站需要不同发布节奏、不同 Next 版本、独立权限/团队，或个人主站资源明显拖累 RocoDex 构建时，才值得迁移为 workspace 或两个仓库。当前方案已经隔离业务边界，同时保留一次构建和现有域名配置。

## 变更验收

- 架构：`npm run test:architecture`
- 个人主站单元与 SEO：`npm run test:personal`
- 个人主站浏览器：`npm run test:e2e:personal`
- RocoDex 浏览器：`npm run test:e2e:rocodex`
- 全仓静态门禁：`npm run verify && npm run audit:dependencies`
- 全仓浏览器：`npm run test:e2e`
