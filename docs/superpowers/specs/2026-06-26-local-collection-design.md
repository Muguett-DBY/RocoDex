# Local Collection Workspace Design

## Context

RocoDex already provides 347 creature records, search, matchup lookup, guides, and comparison. Recent work concentrated on runtime migration. The next product step should create a persistent player workflow without depending on deployment secrets or a new backend.

## Decision

Add a versioned, browser-local collection that stores only creature IDs. Users can save or remove creatures from list cards and detail pages, open a dedicated collection workspace, remove stale entries safely, and launch comparison with selected collection members.

This approach is preferred over cloud-synced favorites because it is immediately useful, works without authentication, avoids production-data risk, and can later become the offline layer for account sync.

## User Experience

- Every creature card and creature detail page exposes a clear save/remove control.
- The main navigation includes “我的收藏”.
- `/collection` explains that data is stored in the current browser.
- Empty, loading, populated, and stale-ID states are explicit.
- Users can select two to four saved creatures and open the existing comparison tool with those IDs preloaded.
- Collection changes synchronize across open tabs through the `storage` event.

## Architecture

- `src/lib/creature-collection.ts` owns schema versioning, parsing, normalization, toggling, and comparison URL construction.
- `src/hooks/use-creature-collection.ts` owns browser storage and cross-tab synchronization.
- Small client components expose collection controls without converting whole server pages to client components.
- The collection workspace dynamically imports the existing local creature dataset, matching current explorer patterns.
- The comparison page accepts validated IDs from the query string and falls back to existing defaults.

## Runtime Stability

- Theme rendering uses a deterministic server/client initial state, then applies the stored/system preference after mount.
- Authentication UI and `SessionProvider` are disabled when no server secret is configured. Login/register pages show a useful unavailable state instead of triggering repeated 500 responses.
- No secret or generated credential is committed.

## Error Handling

- Invalid JSON, wrong schema versions, duplicate IDs, malformed IDs, and missing creatures degrade to a safe normalized collection.
- Storage write failures keep the current UI usable and do not crash navigation.
- Compare links require two to four valid saved IDs.

## Verification

- Unit tests cover storage parsing, normalization, toggling, compare URL generation, theme preference resolution, auth availability, and compare query parsing.
- Run lint, all tests, production build, and browser checks for desktop/mobile collection flows.
- Browser console must have no hydration or auth configuration errors when auth is not configured.
