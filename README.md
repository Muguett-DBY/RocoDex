# Custard Web Platform

这个仓库是两个独立网站共用的 Next.js / Vercel 部署容器。它们共享构建、域名分发和少量 SEO 基础设施，但不共享产品逻辑。

| 产品 | 生产域名 | Next 路由 | 主要代码 | 浏览器回归 |
| --- | --- | --- | --- | --- |
| 奶黄包个人主站 / CSTD | `https://custard.top` | 内部重写到 `/cstd` | `src/sites/personal-homepage` | `e2e/personal-homepage.spec.ts` |
| 洛克图鉴 / RocoDex | `https://rocodex.custard.top` | `/` 及图鉴路由 | `src/app/(rocodex)` 与现有 RocoDex 模块 | `e2e/rocodex.spec.ts` |

## 架构

```text
src/
├─ app/
│  ├─ (personal)/cstd/       # 个人主站的薄 Next 页面适配器，URL 仍为 /cstd
│  ├─ (rocodex)/             # RocoDex 页面和仅属于它的 AuthProvider
│  ├─ api/                   # RocoDex 账号 API
│  ├─ robots.txt/            # 按 Host 分发的共享 HTTP 适配器
│  ├─ sitemap.xml/           # 按 Host 分发的共享 HTTP 适配器
│  └─ layout.tsx             # 两站共用的最小 HTML 文档
├─ sites/
│  ├─ personal-homepage/     # 个人主站的组件、内容、元数据和 Host 路由
│  ├─ rocodex/               # RocoDex 元数据、sitemap 和产品边界说明
│  └─ shared/                # 只放真正跨站点的 SEO 基础设施
├─ components/               # RocoDex 组件；ui/ 是其本地 UI 基础层
├─ data/                     # RocoDex 图鉴、攻略和阵容数据
├─ hooks/                    # RocoDex 浏览器状态 Hook
├─ lib/                      # RocoDex 领域与服务逻辑
└─ types/                    # RocoDex 类型
```

`src/proxy.ts` 是生产 Host 边界：`custard.top/` 重写到 `/cstd`，`www.custard.top` 308 跳转到 apex，其余个人主站域名路径不会泄露 RocoDex 页面。公开资源 URL 继续使用 `public/cstd-*`、`public/cstd-world`、`public/cstd-archive` 和 `public/cstd-projects`，避免部署迁移和缓存失效。

架构约束由 `src/sites/site-boundaries.test.ts` 自动验证。个人主站不得导入 `src/components`、`src/data`、`src/hooks`、`src/lib` 或 `src/types` 中的 RocoDex 模块；外部适配器只能通过个人主站的 `index.ts`、`metadata.ts` 和 `server.ts` 访问它。

详细决策见 `docs/architecture.md`。站点维护入口见 `src/sites/personal-homepage/README.md` 与 `src/sites/rocodex/README.md`。

## 本地开发

工具链固定为 Node.js 24 LTS 与 npm 12.0.2。Vercel、GitHub Actions 和本地版本文件使用同一 Node 主版本，避免构建环境漂移。

```bash
npm ci
npm run dev
```

- RocoDex：`http://localhost:3000`
- 个人主站：`http://localhost:3000/cstd`

完成生产构建后可用 `npm run start:local` 在后台启动本地生产服务器。脚本会从 3200 起选择空闲端口，并把 URL、PID 与日志位置输出到终端；可用 `scripts/stop-local-next.ps1` 结束该仓库的本地 Next 进程。

## 验证命令

```bash
npm run test:architecture
npm run test:personal
npm run test:e2e:personal
npm run test:e2e:rocodex

npm run lint
npm run typecheck
npm test
npm run build
npm run verify:personal-bundle
npm run audit:dependencies
npm run test:e2e
```

前四条适合站点内快速迭代；其余命令构成推送前的完整仓库门禁。`npm run verify` 会串行执行静态检查、类型检查、单测、生产构建和个人主站包体边界。

## RocoDex 数据维护

- 精灵数据：`src/data/creatures.ts`
- 数据类型：`src/types/creature.ts`
- 搜索和筛选：`src/lib/creature-query.ts`
- PVP 阵容：`src/data/pvp-teams.ts`
- 攻略数据：`src/data/guide-builds.ts`
- 本地收藏：`src/lib/creature-collection.ts`
- 数据缺口：`docs/data_gaps.md`
- PVP 与攻略来源：`docs/pvp_sources.md`、`docs/guide_sources.md`

账号能力依赖 `AUTH_SECRET` 或 `NEXTAUTH_SECRET`。认证上下文只存在于 `(rocodex)` 路由组，访问个人主站不会初始化 NextAuth 会话。

## 部署

仓库继续由一个 Vercel 项目部署。路由组不改变 URL，目录迁移不需要修改 DNS、Vercel 域名或现有外链。`main` 推送后应同时检查 GitHub Actions、Vercel 状态、`custard.top` 和 `rocodex.custard.top`。

本项目不是《洛克王国世界》官方网站，也不隶属于其运营方。完整声明见 `DISCLAIMER.md`。
