# RocoDex / 洛克图鉴

RocoDex 是一个非官方《洛克王国世界》中文精灵图鉴 MVP，用于学习、研究和个人资料整理。

当前版本包含首页、精灵列表、精灵详情、中文搜索、筛选、本地收藏、数据状态页、关于/免责声明页面，以及前 50 个图鉴编号的本地 TypeScript seed data。
同时包含 `/pvp-teams` 页面，用于整理当前版本公开攻略中的 PVP META 阵容。
`/guides` 页面用于汇总 PVE / PVP 强度榜和培养建议；缺少可靠资料的精灵显示为“未评级 / 待复核”。
`/collection` 页面提供当前浏览器内的本地收藏工作台，用户可从精灵卡片或详情页收藏候选，并将 2-4 只收藏精灵带入 `/compare` 对比。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui 风格的本地 UI 组件
- Vitest
- 本地 TypeScript seed data

## 安装依赖

```bash
npm install
```

## 运行开发服务器

```bash
npm run dev
```

默认访问：

```text
http://localhost:3000
```

## 构建

```bash
npm run build
```

## 运行检查

```bash
npm run lint
npm run test
```

## 账号与本地收藏

收藏功能只把精灵编号保存在当前浏览器的 `localStorage` 中，不需要登录，也不会上传账号或设备信息。

账号登录/注册依赖 NextAuth 认证密钥。未配置 `AUTH_SECRET` 或 `NEXTAUTH_SECRET` 时，页面会隐藏账号入口，并在 `/login`、`/register` 显示“账号功能暂未启用”的降级说明；配置密钥后保留原有账号表单能力。

## 数据在哪里修改

- 精灵数据：`src/data/creatures.ts`
- 数据类型：`src/types/creature.ts`
- 搜索和筛选逻辑：`src/lib/creature-query.ts`
- 图片占位图：`public/images/creatures/placeholder.svg`
- PVP 阵容数据：`src/data/pvp-teams.ts`
- PVP 来源说明：`docs/pvp_sources.md`
- PVP 更新规则：`docs/pvp_update_policy.md`
- 攻略页数据：`src/data/guide-builds.ts`
- 攻略页查询逻辑：`src/lib/guide-query.ts`
- 攻略页来源说明：`docs/guide_sources.md`
- 攻略页缺口记录：`docs/guide_gaps.md`
- 本地收藏存储逻辑：`src/lib/creature-collection.ts`
- 本地收藏浏览器 Hook：`src/hooks/use-creature-collection.ts`

## 数据说明

第一版按《洛克王国世界》图鉴体系收录 NO.001 至 NO.050。主来源为洛克王国:手游WIKI_BWIKI 精灵图鉴。MVP 不下载、不热链公开网页图片，统一使用本地占位图，并在数据里保留来源 URL 与说明。

无法可靠确认的字段统一写为“待确认”，并记录在 `docs/data_gaps.md`。

攻略页数据维护时，PVE/PVP Tier 只能使用 `S/A/B/C/D/未评级`。配招、性格、天分每项都要标记 `source-derived`、`analysis-derived` 或 `unknown`；其中 `analysis-derived` 会在页面显示“本站分析”，`unknown` 不允许填入推断内容。

## 免责声明

请阅读 `DISCLAIMER.md`。本项目不是官方网站，不隶属于任何官方运营方，仅用于学习、研究和资料整理。
