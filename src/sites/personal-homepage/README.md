# Personal Homepage

`custard.top` 的全部产品代码归这个模块所有。CSTD 是页面品牌，`personal-homepage` 是仓库中的产品边界。

## 目录

- `components/`：个人主站页面与 Three.js 沉浸场景。
- `content/`：作品、系统能力和学习路径等可编辑内容。
- `domain/`：与框架无关的小型展示规则。
- `infrastructure/`：apex Host 路由和个人 sitemap。
- `index.ts`：React 公开入口。
- `metadata.ts`：Next Metadata 公开入口。
- `server.ts`：proxy、robots 与 sitemap 可用的服务端入口。

外部代码不要直接导入内部子目录。新增个人主站功能时优先在本模块内完成；只有两个站点都需要且语义一致的无产品逻辑代码，才进入 `src/sites/shared`。

## 静态资源

个人主站资源保留在以下公开路径：

- `public/cstd-world/`
- `public/cstd-archive/`
- `public/cstd-projects/`
- `public/cstd-*.png`
- `public/cstd-*.svg`

这些名称是线上 URL，不是代码归属目录。设计验收记录在 `docs/personal-homepage/design-qa.md`。

## 验证

```bash
npm run test:architecture
npm run test:personal
npm run test:e2e:personal
```
