# CSTD operations

## Public and internal routes

Production exposes clean URLs on `custard.top`:

- `/work` and `/work/[slug]`
- `/notes` and `/notes/[slug]`
- `/lab` and `/lab/[slug]`
- `/about`, `/now`, and `/resume`
- `/en` and corresponding `/en/*` routes
- `/rss.xml`, `/robots.txt`, and `/sitemap.xml`

`src/proxy.ts` rewrites those paths to internal `/cstd/*` route adapters. Preview and local environments may use the internal paths directly. Unknown paths on the apex host stay behind the CSTD-specific 404 and cannot leak RocoDex pages.

## Runtime signals

`CstdTelemetry` collects only LCP, INP, CLS, visual-budget changes, and guide answer/refusal counts. Payloads contain a bounded metric name, numeric value, route label, and path. They contain no question text, user identifier, IP-derived identifier, cookie, or account data.

The browser posts to `/api/cstd-vitals` only in production. The endpoint:

- accepts only the personal-site host;
- rate limits each identity to 30 requests per minute through Upstash Redis when telemetry credentials are configured (per-instance in-memory fallback otherwise);
- rejects payloads over 2 KiB;
- validates a closed metric-name set and bounded fields;
- writes one structured Vercel log line, aggregates LCP/INP/CLS value buckets into Redis, and returns `204`;
- never persists a user profile.

### Field vitals audit (closes the performance contract)

When `CSTD_TELEMETRY_REDIS_URL`/`CSTD_TELEMETRY_REDIS_TOKEN` are present they win; otherwise the sink reuses the first complete pair among the Vercel Marketplace `KV_REST_API_URL`/`KV_REST_API_TOKEN` credentials (the same pair RocoDex account storage prefers, and the only pair the Vercel CLI can pull), then the `UPSTASH_REDIS_REST_*` and `UPSTASH_REDIS_*` variables. With a pair present, the vitals endpoint aggregates daily, per-device value-bucket hashes under `cstd:vitals:<yyyymmdd>:<METRIC>:<device>` with a 40-day TTL. The weekly `CSTD Field Vitals Audit` GitHub Actions workflow runs `node scripts/audit-cstd-vitals.mjs`, which replays the trailing 28 days against the `rumAudit` thresholds published in `performance-contract.json` (LCP 1800 ms desktop / 2500 ms mobile, INP 150 ms, CLS 0.03; at least 75% of samples within budget with at least 30 samples) and fails the run on a breach. The workflow reads the `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` repository secrets; without them the audit exits 0 with a skip notice. `verify:cstd:performance-contract` keeps the thresholds, bucket edges, audit script, and workflow build-linked.

The homepage entry also negotiates the locale from `Accept-Language` when no `cstd-locale` cookie exists (explicit cookie always wins), and the proxy edge 404 and the React not-found page share one copy source in `infrastructure/not-found.ts`. All canonical `https://custard.top` URLs resolve through `infrastructure/origin.ts`, so preview builds can override them with `CSTD_ORIGIN`.

## Release checklist

1. Run `npm run lint`, `npm test`, `npm run build`, and `npm run verify:personal-bundle`.
2. Run `npm run test:e2e:personal` in desktop and mobile Chromium.
3. Check dependency audit at high severity.
4. Push only the intended CSTD changes; never stage `.reasonix/`, Playwright output, or unrelated RocoDex work.
5. Wait for GitHub Actions, then publish the verified OpenNext bundle with the existing Cloudflare deployment command. Vercel is not the production host.
6. Verify clean Chinese and English routes, RSS, sitemap, security headers, guide refusal, Lab controls, homepage WebGL, and both production domains.
7. After telemetry storage is configured, check the latest `CSTD Field Vitals Audit` run summary (`gh run view --workflow "CSTD Field Vitals Audit"`) or trigger it with `gh workflow run "CSTD Field Vitals Audit"`.

## Cloudflare CPU（2026-10-20）

`custard-web-platform` 同时承载个人主站和 RocoDex，不是 MoovCare 的子服务。2026-10-01 至 10-19 17:02 UTC 的 45,114 次调用累计使用约 2,305 秒 CPU，平均每次约 51 ms；这是账号套餐包含 CPU 的约 7.68%，不是服务器持续占用 7.68% CPU。没有 Cron、容器、队列或 Durable Object 绑定。

七天调用日志采用平台抽样（`abr_level: 100`），样本包含公开页面、动态站点地图及扫描器的不存在路径；不能据此声称某一路径占完整月份 CPU 的精确百分比。生产调用栈采样接口在预热后仍返回 `No recent executions`，没有获得生产火焰图。

公开页面原本已预生成，但只有 Next 内部缓存命中，仍需进入 NextServer。现启用 OpenNext 原生 `enableCacheInterception`，缓存命中直接返回 HTML/RSC。适配器升级并锁定至 1.20.12，配套 Next/ESLint 插件 16.4.2；新版包含 Next 16 分段预取循环的官方修复，不自行修补请求协议。`@node-minify/core` 的 `glob` 限定为已修复的 10.5.0，避免构建工具带入已知命令注入漏洞。

图标、分享预览图和浏览器案例 Worker 文件走 Workers Static Assets，不再进入 Next 路由；`public/_headers` 为静态响应保留 `nosniff`。登录、注册、会话和账户写入仍动态处理，不参与页面直返；首页语言选择保留 `private` 缓存和 `Vary: Accept-Language, Cookie`，不进入共享缓存。

真实本地 Worker 验证了两站页面、双语和 Host 隔离、HTML/RSC 类型、`/_tree` 分段预取、登录/注册/会话不命中缓存、390 像素布局以及闲置八秒没有新的 RSC 请求。相同新版本构建、预热两次后六次请求的中位总耗时，札记页约 14.59 → 11.89 ms，项目详情约 19.60 → 15.28 ms；首页约 18.54 → 18.37 ms。数字包含本机模拟器和传输，不是生产 CPU 或全球延迟保证。已发生的套餐累计用量不会因发布而退回。
