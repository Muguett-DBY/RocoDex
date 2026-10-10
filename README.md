<!-- Project artwork created for this repository. -->
<p align="center">
  <img src="./docs/assets/readme-banner.svg" width="100%" alt="RocoDex — Explore the data. Find a build. Keep a favourite." />
</p>

<h1 align="center">Custard Web Platform</h1>

<p align="center">
  <img src="./docs/assets/readme-badges.svg" alt="Maintenance · Next.js · React · TypeScript · Cloudflare Workers" />
</p>

**My personal website and engineering workspace, with the RocoDex game guide retained in the same deployment.**

<p align="center"><a href="#what-is-here">What is here</a> &nbsp; · &nbsp; <a href="#run-locally">Run locally</a> &nbsp; · &nbsp; <a href="#find-your-way-around">Find your way around</a></p>

[Personal website](https://custard.top) · [RocoDex](https://rocodex.custard.top) · [Architecture](docs/architecture.md) · [Data sources](docs/guide_sources.md)


<p align="center">
  <img src="./docs/assets/interface.png" width="100%" alt="Live RocoDex interface, captured on 2026-10-10. The app is primarily Chinese." />
</p>

<sub>Live RocoDex interface, captured on 2026-10-10. The app is primarily Chinese.</sub>


## What is here

- **Primary surface:** the personal website, with projects, engineering notes, and interactive experiments.
- **Retained surface:** RocoDex, with creature data, search, builds, teams, and saved favourites.
- The two sites share a deployment while their routes and product code stay separate.

The personal website is the main maintenance focus. RocoDex is retained for reliability and compatibility; it is not the primary product-development track.

The live sites share the `custard-web-platform` Cloudflare Worker, built with OpenNext. `rocodex.custard.top` serves RocoDex; `custard.top` and `www.custard.top` serve the personal site.

## Run locally

Use Node.js **24.x** and the npm version in `package.json`.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000` for RocoDex or `/cstd` for the separate personal site. Account features require `AUTH_SECRET` or `NEXTAUTH_SECRET`.

## Find your way around

| Area | Location |
| --- | --- |
| RocoDex pages | `src/app/(rocodex)/` |
| Creature, build, and team data | `src/data/` |
| Personal website | `src/sites/personal-homepage/` |
| Site boundaries and routing | [Architecture](docs/architecture.md) |
| Setup, checks, and deployment | [Maintenance reference](docs/MAINTENANCE.md) |

Use `npm run verify` for the main checks and `npm run test:e2e:rocodex` for the RocoDex browser tests.

This is an unofficial fan project. See the [disclaimer](DISCLAIMER.md), [data gaps](docs/data_gaps.md), and [PvP sources](docs/pvp_sources.md).

Original code is available for noncommercial use under [PolyForm Noncommercial 1.0.0](LICENSE). See [license scope and third-party assets](docs/LICENSE_SCOPE.md).
