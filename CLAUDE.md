# Testomniac Client

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

API client SDK for Testomniac with TanStack Query hooks.

**npm**: `@sudobility/testomniac_client` (public, BUSL-1.1)

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
├── index.ts                          # Main exports (re-exports from submodules)
├── types.ts                          # QUERY_KEYS factory, FirebaseIdToken, cache constants
├── network/
│   ├── TestomniacClient.ts           # HTTP client class (60+ methods, ~1400 lines)
│   ├── TestomniacClient.test.ts      # Client tests
│   └── index.ts                      # Network exports
├── hooks/                            # 70+ React hooks
│   ├── index.ts                      # Barrel export
│   ├── useRun.ts                     # Query: single run details
│   ├── useSubmitScan.ts              # Mutation: submit scan (public endpoint)
│   ├── useCreatePersona.ts           # Mutation: create persona
│   ├── useUpdatePersona.ts           # Mutation: update persona
│   ├── useDeletePersona.ts           # Mutation: delete persona
│   └── ... (65+ more hooks)
└── utils/
    ├── starter-helpers.ts            # createAuthHeaders, buildUrl, handleApiError
    ├── starter-helpers.test.ts       # Utility tests
    └── index.ts                      # Utility exports
```

## Commands

```bash
bun run build          # Build ESM (tsc → dist/)
bun run build:watch    # Watch mode build
bun run clean          # Remove dist/
bun test               # Run Vitest tests
bun run typecheck      # TypeScript check
bun run lint           # Run ESLint
bun run verify         # All checks + build (use before commit)
bun run prepublishOnly # Clean + build (runs on publish)
```

## Key Concepts

### TestomniacClient

HTTP client class constructed with `{ baseUrl, networkClient }`. Uses dependency injection via the `NetworkClient` interface from `@sudobility/types` — no direct fetch calls. Provides 60+ async methods covering all API endpoints: users, entities, products, runners, test environments, test runs, findings, personas, test scenarios, test surfaces, test interactions, credentials, and more.

### Hooks (70+)

Hooks follow consistent patterns:

**Query hooks** (e.g., `useRun`, `useEntityProducts`, `useRunPages`, `useRunFindings`, `useTestSurfaces`, `useTestInteractions`, `useTestScenarios`, `usePageStates`):
- Accept config with `{ baseUrl, networkClient, token, ...params, enabled? }`
- Return `{ data, isLoading, error, refetch }`
- Safe defaults (`?? []`, `?? null`) in return values

**Mutation hooks** (e.g., `useSubmitScan`, `useCreatePersona`, `useUpdatePersona`, `useDeletePersona`, `useCreateScenario`, `useDeleteScenario`):
- Return `{ mutateAsync, isPending, error, reset }`
- `useSubmitScan` is the only public (no-auth) mutation

### QUERY_KEYS

Type-safe cache key factory for TanStack Query with 50+ key methods. Keys are namespaced under `'testomniac'` and structured hierarchically (e.g., `['testomniac', 'run', runId, 'pages']`).

### Cache Settings

- `staleTime`: 5 minutes (`DEFAULT_STALE_TIME`)
- `gcTime`: 30 minutes (`DEFAULT_GC_TIME`)

## Peer Dependencies

- `react` (>=18)
- `@tanstack/react-query` (>=5)
- `@sudobility/types` — NetworkClient interface, BaseResponse

## Related Projects

- **testomniac_types** — Shared type definitions; this project imports all API request/response types
- **testomniac_api** — Backend server that this client SDK communicates with over HTTP
- **testomniac_lib** — Business logic library that consumes this client's hooks and `TestomniacClient` class
- **testomniac_app** — Web frontend that uses this client transitively via testomniac_lib

Dependency injection is central: `NetworkClient` interface is provided by the consumer, allowing different fetch implementations per platform (web vs React Native vs Chrome extension).

## Coding Patterns

- `QUERY_KEYS` factory in `src/types.ts` provides type-safe cache keys for TanStack Query — always use it for query keys
- `TestomniacClient` class accepts `{ baseUrl, networkClient }` via constructor — never use `fetch` directly inside this package
- `validateResponse<T>()` guards against unexpected API response shapes at runtime
- `FirebaseIdToken` branded type for auth tokens
- Query hooks support `enabled?: boolean` to conditionally disable fetching
- Utility functions in `src/utils/starter-helpers.ts` handle auth headers, URL construction, and API error handling

## Gotchas

- `NetworkClient` is dependency-injected — never import or use `fetch` directly; all HTTP calls go through the injected `networkClient`
- `FirebaseIdToken` is required for all authenticated endpoints; omitting it will result in 401/403 errors
- The `QUERY_KEYS` factory must be kept in sync with API route changes
- `useSubmitScan` hits a public endpoint (no auth) — all other hooks require Firebase auth
- This is a published npm package — breaking changes require version bumps and coordination with consumers

## Git Workflow

- Do not use feature branches for code changes. Always stay on the current branch.
