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

When `CSTD_TELEMETRY_REDIS_URL`/`CSTD_TELEMETRY_REDIS_TOKEN` (or the shared `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`) are present, the vitals endpoint aggregates daily, per-device value-bucket hashes under `cstd:vitals:<yyyymmdd>:<METRIC>:<device>` with a 40-day TTL. The weekly `CSTD Field Vitals Audit` GitHub Actions workflow runs `node scripts/audit-cstd-vitals.mjs`, which replays the trailing 28 days against the `rumAudit` thresholds published in `performance-contract.json` (LCP 1800 ms desktop / 2500 ms mobile, INP 150 ms, CLS 0.03; at least 75% of samples within budget with at least 30 samples) and fails the run on a breach. Without credentials the audit exits 0 with a skip notice. `verify:cstd:performance-contract` keeps the thresholds, bucket edges, audit script, and workflow build-linked.

The homepage entry also negotiates the locale from `Accept-Language` when no `cstd-locale` cookie exists (explicit cookie always wins), and the proxy edge 404 and the React not-found page share one copy source in `infrastructure/not-found.ts`. All canonical `https://custard.top` URLs resolve through `infrastructure/origin.ts`, so preview builds can override them with `CSTD_ORIGIN`.

## Release checklist

1. Run `npm run lint`, `npm test`, `npm run build`, and `npm run verify:personal-bundle`.
2. Run `npm run test:e2e:personal` in desktop and mobile Chromium.
3. Check dependency audit at high severity.
4. Push only the intended CSTD changes; never stage `.reasonix/`, Playwright output, or unrelated RocoDex work.
5. Wait for GitHub Actions and Vercel READY.
6. Verify clean Chinese and English routes, RSS, sitemap, security headers, guide refusal, Lab controls, homepage WebGL, and both production domains.
7. After telemetry storage is configured, check the latest `CSTD Field Vitals Audit` run summary (`gh run view --workflow "CSTD Field Vitals Audit"`) or trigger it with `gh workflow run "CSTD Field Vitals Audit"`.
