# Testomniac Client

API client SDK for Testomniac with TanStack Query hooks.

**npm**: `@sudobility/entitytestomniac_client` (public, BUSL-1.1)

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Runtime**: Bun
- **Package Manager**: Bun (do not use npm/yarn/pnpm for installing dependencies)
- **Build**: TypeScript compiler (ESM)
- **Test**: Vitest
- **Data Fetching**: TanStack Query 5

## Project Structure

```
src/
├── index.ts                          # Main exports
├── types.ts                          # QUERY_KEYS factory, config types
├── network/
│   ├── TestomniacClient.ts           # HTTP client class (DI-based)
│   └── index.ts                      # Network exports
├── hooks/
│   ├── index.ts                      # Hook exports
│   ├── useEntityProjects.ts          # Query projects by entity slug
│   ├── useProject.ts                 # Query single project
│   ├── useProjectRuns.ts             # Query runs for a project
│   ├── useRun.ts                     # Query single run
│   ├── useRunPages.ts                # Query pages for a run
│   ├── useRunActions.ts              # Query actions for a run
│   ├── useRunTestCases.ts            # Query test cases for a run
│   ├── useRunTestRuns.ts             # Query test runs for a run
│   ├── useRunIssues.ts               # Query issues for a run
│   ├── useRunPersonas.ts             # Query personas for a run
│   ├── useRunScaffolds.ts             # Query scaffolds for a run
│   ├── usePageStates.ts              # Query states for a page
│   ├── usePageStateItems.ts          # Query actionable items for a state
│   ├── usePersonaUseCases.ts         # Query use cases for a persona
│   ├── useUseCaseInputValues.ts      # Query input values for a use case
│   └── useSubmitScan.ts              # Mutation: submit a new scan
└── utils/
    ├── index.ts                      # Utility exports
    └── starter-helpers.ts            # createAuthHeaders, buildUrl, handleApiError
```

## Commands

```bash
bun run build          # Build ESM
bun run clean          # Remove dist/
bun test               # Run Vitest tests (colocated *.test.ts files)
bun run typecheck      # TypeScript check
bun run lint           # Run ESLint
bun run verify         # All checks + build (use before commit)
bun run prepublishOnly # Clean + build (runs on publish)
```

## Key Concepts

### TestomniacClient

HTTP client class constructed with `{ baseUrl, networkClient }`. Uses dependency injection via the `NetworkClient` interface from `@sudobility/types` — no direct fetch calls.

### Hooks (16 query + 1 mutation)

**Query hooks:**
- `useEntityProjects(config)` — projects for an entity/workspace
- `useProject(config)` — single project details
- `useProjectRuns(config)` — runs for a project
- `useRun(config)` — single run details
- `useRunPages(config)` — pages discovered in a run
- `useRunActions(config)` — actions performed in a run
- `useRunTestCases(config)` — generated test cases for a run
- `useRunTestRuns(config)` — test execution results for a run
- `useRunIssues(config)` — issues detected in a run
- `useRunPersonas(config)` — AI-generated personas for a run
- `useRunScaffolds(config)` — scaffolds found in a run
- `usePageStates(config)` — states captured for a page
- `usePageStateItems(config)` — actionable items in a page state
- `usePersonaUseCases(config)` — use cases for a persona
- `useUseCaseInputValues(config)` — input values for a use case

**Mutation hook:**
- `useSubmitScan(config)` — submit a new scan (public endpoint)

### QUERY_KEYS

Type-safe cache key factory for TanStack Query. Used internally by hooks and available for manual invalidation. Keys are namespaced under `'testomniac'` and structured hierarchically (e.g., `['testomniac', 'run', runId, 'pages']`).

### Cache Settings

- `staleTime`: 5 minutes
- `gcTime`: 30 minutes

## Peer Dependencies

- `react` (>=18)
- `@tanstack/react-query` (>=5)
- `@sudobility/types` — NetworkClient interface, BaseResponse

## Related Projects

- **entitytestomniac_types** — Shared type definitions; this project imports all API types (`History`, request/response types, `BaseResponse`)
- **entitytestomniac_api** — Backend server that this client SDK communicates with over HTTP
- **entitytestomniac_lib** — Business logic library that consumes this client's hooks and `TestomniacClient` class
- **entitytestomniac_app** — Web frontend that uses this client transitively via entitytestomniac_lib
- **entityentitytestomniac_app_rn** — React Native app that uses this client via file: links

Dependency injection is central: `NetworkClient` interface is provided by the consumer, allowing different fetch implementations per platform (web vs React Native).

## Coding Patterns

- `QUERY_KEYS` factory in `src/types.ts` provides type-safe cache keys for TanStack Query -- always use it for query keys
- `TestomniacClient` class accepts `{ baseUrl, networkClient }` via constructor -- never use `fetch` directly inside this package
- Query hooks wrap TanStack Query's `useQuery` and use `TestomniacClient` internally
- `useSubmitScan` is the only mutation hook — it submits scans to the public endpoint
- Default `staleTime` is 5 minutes and `gcTime` is 30 minutes -- respect these defaults unless there is a specific reason to override
- Utility functions in `src/utils/starter-helpers.ts` handle auth headers (`createAuthHeaders`), URL construction (`buildUrl`), and API error handling (`handleApiError`)
- `FirebaseIdToken` must be passed to all protected endpoint calls for authentication

## Gotchas

- `NetworkClient` is dependency-injected -- never import or use `fetch` directly; all HTTP calls go through the injected `networkClient`
- `FirebaseIdToken` is required for all authenticated endpoints; omitting it will result in 401/403 errors from the API
- The `QUERY_KEYS` factory must be kept in sync with API route changes -- if a route path changes, update the corresponding key
- `useSubmitScan` hits a public endpoint (no auth) -- all other hooks require Firebase auth
- This is a published npm package (`@sudobility/entitytestomniac_client`) -- breaking changes require version bumps and coordination with consumers
