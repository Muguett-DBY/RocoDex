# CSTD content registry

The personal site keeps durable content in typed TypeScript registries. Routes, list pages, metadata, structured data, RSS, sitemap entries, the local guide, and tests consume these registries rather than duplicating copy.

## Ownership

| File | Owns |
| --- | --- |
| `case-studies.ts` | Shipped systems, architecture decisions, metrics, and proof ledgers |
| `technical-notes.ts` | Long-form bilingual technical notes and related case links |
| `labs.ts` | Interactive Lab metadata; implementations live in `components/labs` |
| `profile.ts` | About, Now, Resume, education, and capability copy |
| `content-types.ts` | Shared localization and rich-section contracts |

## Add a case study

1. Add one bilingual entry to `cstdCaseStudies` with a unique slug and existing optimized image.
2. Keep metrics factual and traceable to the implementation or release evidence.
3. Add at least three sections and three proof-ledger entries.
4. Link any derived technical note through `relatedCaseSlugs`.
5. Run `npm run test:personal`, `npm run lint`, `npm run build`, and `npm run test:e2e:personal`.

The static route params, public URL, language alternates, sitemap, and collection page update automatically.

## Add a technical note

Add one entry to `cstdTechnicalNotes`. A note requires a publication date, reading time, series, tags, at least three sections, and at least one related case. RSS and both language archives update automatically.

## Writing rules

- Describe real constraints and decisions, not generic capability claims.
- Do not publish private data, credentials, personal contact details, or unverifiable business numbers.
- Keep deterministic and AI-generated outputs clearly separated.
- Chinese and English are one content contract; neither is a placeholder translation.
- Images belong under the existing `public/cstd-*` namespaces and should be WebP where practical.
