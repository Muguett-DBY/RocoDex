# RocoDex 静态存档

RocoDex 已停止功能维护，继续在 https://rocodex.custard.top 提供图鉴、攻略、搜索、对比和浏览器本地收藏。

页面源码在 archive/rocodex/app，静态导出在 archive/rocodex/out。原有 src/components、data、hooks、lib、types 仍归图鉴使用；本目录只保存元数据、站点地图和静态安全响应头。

登录、注册、账号存储、会话与相关接口已删除。收藏仍使用原域名的 localStorage。查询参数在浏览器读取，不再运行后台渲染。

npm run dev:rocodex 启动存档开发服务器；npm run build 导出两个站点；npm run test:e2e:rocodex 验证存档页面。
