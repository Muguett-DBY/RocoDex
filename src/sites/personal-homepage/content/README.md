# CSTD content operating system

`documents/cases/*.mdx` and `documents/notes/*.mdx` are the canonical long-form sources. Each file contains both `zh` and `en` bodies plus structured frontmatter. Build-time generation validates the schema and writes `generated/content-registry.ts`; routes, metadata, RSS, sitemap, Ask CSTD, evidence graphs, and tests consume that lightweight index.

## Ownership

| Path | Owns |
| --- | --- |
| `documents/cases/*.mdx` | Shipped systems, decisions, metrics, proof links, and bilingual body |
| `documents/notes/*.mdx` | Bilingual technical publishing, revisions, corrections, and related cases |
| `content-schema.ts` | Runtime frontmatter validation and publication constraints |
| `generated/content-registry.ts` | Generated metadata index; never edit by hand |
| `labs.ts` | Versioned `LabDefinition` metadata and renderer keys |
| `systems.ts` | Five Atlas districts and their real evidence links |
| `timeline.ts` | Education, projects, diagnoses, and verified releases |
| `case-dossiers.ts` | Architecture, tradeoffs, failure containment, and evidence for flagship cases |
| `content-health.ts` | Computed bilingual, relation, orphan, and evidence-freshness health |
| `observatory.ts` | Versioned public engineering-observatory contract and slim homepage projection |
| `release-ledger.ts` | Verified release gates and replayable publication history |

## Add content

1. Add one `.mdx` file and its optimized asset. Copy a nearby case or note as the schema template.
2. Keep both `<LocaleBlock locale={"zh"}>` and `<LocaleBlock locale={"en"}>` complete.
3. Cases require at least three TOC sections, three proof statements, four technologies, and two dated artifact links.
4. Notes require a date, revision, reading time, tags, at least three TOC sections, and a related case.
5. Run `npm run content:generate`; no route or page component edits are required.

`npm run content:check` fails when the generated index is stale, a relation points to a missing entry, a slug is duplicated, or either language is absent. `npm run build` regenerates the index automatically.

## Release gates

- `npm run cstd:content-health` prints the computed health report and fails on broken relations, missing bilingual bodies, orphaned entries, or stale evidence.
- `npm run cstd:release-candidate` validates content health together with the release ledger before a production candidate is accepted.
- `npm run verify:cstd` runs content checks, proof verification, personal-site tests, lint, typecheck, build, and bundle budgets.
- `npm run verify:cstd:release` adds release-candidate and production-contract verification for deployment closure.

The public `observatory.json` and `content-health.json` routes are projections of these source modules. Never duplicate their metrics in route handlers or UI components.

## Writing rules

- Describe real constraints, decisions, failed paths, and verification evidence rather than generic capability claims.
- Do not publish private data, credentials, personal contact details, or unverifiable business numbers.
- Keep deterministic and AI-generated outputs clearly separated.
- Chinese and English are one content contract; neither may be a placeholder.
- Images stay under the existing `public/cstd-*` namespaces and should be WebP where practical.
