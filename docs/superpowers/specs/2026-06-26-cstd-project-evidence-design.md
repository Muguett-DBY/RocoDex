# CSTD Project Evidence Design

## Goal

Turn the homepage project directory from a link collection into a credible portfolio by showing what each live project solves, what role CSTD plays, and what outcome is already available.

## Experience

- Each live project shows four concise evidence fields: role, problem, outcome, and current state.
- Evidence stays inside the existing project card so users can compare projects without opening a modal.
- The incubating card keeps an honest exploratory framing instead of claiming shipped outcomes.
- Existing filters, metrics, tags, and project links continue to work.

## Architecture

Project metadata moves from the large client component into `src/lib/cstd-projects.ts`. The module uses serializable icon keys instead of React components; the landing component maps those keys to Lucide icons at render time. This keeps project content testable and reduces the responsibility of `cstd-landing.tsx`.

## Boundaries

- No fabricated traffic, revenue, customer, or performance claims.
- Outcomes describe shipped capabilities and verified scope only.
- No network request or new dependency is introduced.

## Verification

- Unit tests require every live project to have complete evidence fields.
- Existing filter and layout tests remain green.
- Browser checks verify evidence is readable on desktop and mobile without overflow.
