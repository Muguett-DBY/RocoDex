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
- rejects payloads over 2 KiB;
- validates a closed metric-name set and bounded fields;
- writes one structured Vercel log line and returns `204`;
- never persists a user profile.

Operational targets at the 75th percentile are LCP at or below 1.8 seconds, INP at or below 150 ms, and CLS at or below 0.03. The existing personal bundle gate remains the hard build guard; browser acceptance additionally checks nonblank Canvas output and horizontal overflow.

## Release checklist

1. Run `npm run lint`, `npm test`, `npm run build`, and `npm run verify:personal-bundle`.
2. Run `npm run test:e2e:personal` in desktop and mobile Chromium.
3. Check dependency audit at high severity.
4. Push only the intended CSTD changes; never stage `.reasonix/`, Playwright output, or unrelated RocoDex work.
5. Wait for GitHub Actions and Vercel READY.
6. Verify clean Chinese and English routes, RSS, sitemap, security headers, guide refusal, Lab controls, homepage WebGL, and both production domains.
