# Personal Homepage

`custard.top` 的全部产品代码归这个模块所有。CSTD 是页面品牌，`personal-homepage` 是仓库中的产品边界。

## 目录

- `components/`：个人主站页面、场景外壳与按能力延迟加载的 GPU 渲染器。
- `content/documents/`：案例与文章的单文件双语 MDX 真源。
- `content/`：schema、生成索引、能力证据图谱、主题路径、Lab 协议、发布账本、时间线与个人资料。
- `experience/`：Scene OS、动效偏好、滚动时钟、设备能力和帧预算。
- `domain/`：与框架无关的小型展示规则。
- `infrastructure/`：apex Host 路由和个人 sitemap。
- `index.ts`：React 公开入口。
- `metadata.ts`：Next Metadata 公开入口。
- `server.ts`：proxy、robots 与 sitemap 可用的服务端入口。

外部代码不要直接导入内部子目录。新增个人主站功能时优先在本模块内完成；只有两个站点都需要且语义一致的无产品逻辑代码，才进入 `src/sites/shared`。

Three.js、React Three Fiber 与 Postprocessing 只能从异步全量渲染器加载；Lite WebGL 和原生 WebGPU 信号层保持独立 chunk。页面先渲染版本化静态主视觉，再在浏览器空闲阶段按 `full / lite / image` 能力挂载 GPU 增强；文档隐藏时必须停止连续帧循环。不要把 GPU 包静态导入页面、深度页面或共享布局。

## 静态资源

个人主站资源保留在以下公开路径：

- `public/cstd-world/`
- `public/cstd-universe/`
- `public/cstd-districts/`
- `public/cstd-broadcasts/`
- `public/cstd-archive/`
- `public/cstd-projects/`
- `public/cstd-*.png`
- `public/cstd-*.svg`

这些名称是线上 URL，不是代码归属目录。`studio.json`、`proof.json`、`graph.json`、`releases.json` 与 `topics.json` 是公开机器契约；状态必须来自构建时证据，不能伪装成实时外部数据。设计验收记录在 `docs/personal-homepage/design-qa.md`。

## 验证

```bash
npm run content:check
npm run test:architecture
npm run test:host
npm run test:personal
npm run test:e2e:personal
npm run build
npm run verify:personal-bundle
```

CI 将 Host/模块边界、静态质量与构建、CSTD E2E、RocoDex E2E 分成独立状态。`resume.json` 与 `en/resume.json` 是机器可读履历入口；`/api/cstd-vitals`、Vercel Web Analytics 和 Speed Insights 组成匿名生产观测层。
