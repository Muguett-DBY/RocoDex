# Dependency security maintenance

Run `npm run audit:dependencies` to audit the lockfile. CI keeps this as a separate, failing check for high or critical findings, so lint, tests, and build can still provide their own results. No advisories are allowlisted.

## 2026-10-10 update

- Refresh compatible transitive dependencies, including `proxy-addr` and `source-map-js`.
- Pin `sharp` to `0.35.5`, including its approved installation script.
- Replace `fast-glob` only inside `@next/eslint-plugin-next` with a small local adapter around `tinyglobby@0.2.17`. This removes the `micromatch` / `braces` dependency chain affected by [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), which had no published braces fix at review time.

The pinned Next plugin uses `globSync(pattern, { onlyDirectories: true })` solely for root-directory discovery. `tooling/next-eslint-glob` preserves that call and disables tinyglobby's automatic directory expansion to retain fast-glob semantics. It is not a general fast-glob replacement. `src/lib/next-eslint-glob.test.ts` exercises the actual plugin with default roots, directory globs, brace alternatives, platform path separators, multiple roots, and missing paths. Keep this override scoped to the plugin, and recheck its API when upgrading Next.

The remaining moderate advisory is [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) in `sprintf-js`, reached through `gray-matter` / `js-yaml` / `argparse`. npm reports four affected packages for this one dependency chain. It is not suppressed. The application uses gray-matter to parse repository-owned content, but the dependency should still be replaced or updated when a compatible fix is available. Do not use `npm audit fix --force` to downgrade the content parser or Next tooling blindly.
