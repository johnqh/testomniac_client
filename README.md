# @sudobility/testomniac_client

API client SDK for the Testomniac testing platform with TanStack Query hooks.

## Installation

```bash
bun add @sudobility/testomniac_client
```

Peer dependencies:

```bash
bun add react @tanstack/react-query @sudobility/types
```

## Usage

```ts
import { TestomniacClient } from '@sudobility/testomniac_client';
import {
  useRun,
  useRunSummary,
  useRunFindings,
  useSubmitScan,
} from '@sudobility/testomniac_client/hooks';

// Create the HTTP client (dependency-injected NetworkClient)
const client = new TestomniacClient({
  baseUrl: 'https://api.example.com',
  networkClient,
});

// Fetch a test run directly
const run = await client.getTestRun(runId, token);

// In a React component -- query hook:
const { run, isLoading, error } = useRun({
  networkClient,
  baseUrl,
  runId,
  token,
});

// Mutation hook (public endpoint, no auth required):
const { submitScan, isSubmitting } = useSubmitScan({
  networkClient,
  baseUrl,
});
await submitScan({ url: 'https://example.com', email: 'user@example.com' });
```

## API

### TestomniacClient

HTTP client class constructed with `{ baseUrl, networkClient }`. Uses dependency injection via the `NetworkClient` interface from `@sudobility/types` -- no direct fetch calls. Provides 60+ async methods covering all API endpoints: users, entities, products, runners, test environments, test runs, findings, personas, test scenarios, test surfaces, test interactions, credentials, schedules, and more.

### Hooks (74)

All hooks follow consistent patterns:

**Query hooks** accept a config object with `{ baseUrl, networkClient, token, ...params, enabled? }` and return `{ data, isLoading, error, refetch }` with safe defaults (`?? []`, `?? null`).

**Mutation hooks** return `{ mutateAsync, isPending, error, reset }` with automatic cache invalidation.

#### Runs & Summaries

- `useRun(config)` -- Single run details
- `useRunSummary(config)` -- Run summary with finding counts and expertise breakdown
- `useRunLiveDashboard(config)` -- Live dashboard data for in-progress runs
- `useRunStructure(config)` -- Run structure (pages, interactions hierarchy)
- `useRunNavigationMap(config)` -- Site navigation map for graph visualization

#### Pages & Page States

- `useRunPages(config)` -- Pages discovered in a run
- `useRunPagesSummary(config)` -- Summary of all pages in a run
- `useRunPageSummary(config)` -- Detailed summary for a single page
- `usePageStates(config)` -- Page states for a given page
- `usePageStateItems(config)` -- Actionable items within a page state
- `usePageStateScaffolds(config)` -- Scaffolds detected in a page state
- `useHtmlElement(config)` -- HTML element details

#### Test Surfaces & Bundles

- `useRunnerTestSurfaces(config)` -- Test surfaces for a runner
- `useEnvironmentTestSurfaces(config)` -- Test surfaces for an environment
- `useTestSurfaceChildSurfaces(config)` -- Child surfaces of a test surface
- `useTestSurfaceTestInteractions(config)` -- Interactions for a test surface
- `useRunnerTestSurfaceBundles(config)` -- Test surface bundles
- `useBundleSurfaces(config)` -- Surfaces in a bundle
- `useBundleInteractions(config)` -- Interactions in a bundle
- `useBundleScenarios(config)` -- Scenarios in a bundle
- `useCreateTestSurfaceBundle(config)` -- Mutation: create bundle
- `useUpdateTestSurfaceBundle(config)` -- Mutation: update bundle
- `useDeleteTestSurfaceBundle(config)` -- Mutation: delete bundle

#### Test Interactions & Test Runs

- `useRunTestInteractions(config)` -- Test interactions for a run
- `useRunnerTestInteractions(config)` -- Test interactions for a runner
- `useEnvironmentTestInteractions(config)` -- Test interactions for an environment
- `useTestInteractionActions(config)` -- Actions within a test interaction
- `useTestInteractionRun(config)` -- Single test interaction run
- `useCreateTestInteractionRun(config)` -- Mutation: create interaction run
- `useRunTestRuns(config)` -- Test runs for a run
- `useRunnerTestRuns(config)` -- Test runs for a runner
- `useTestRunFindings(config)` -- Findings for a specific test run

#### Findings & Patterns

- `useRunFindings(config)` -- Findings for a run
- `useRunnerFindings(config)` -- Findings across a runner
- `useRunPatterns(config)` -- UI patterns detected in a run
- `useRunScaffolds(config)` -- Scaffolds detected in a run
- `useRunnerScaffolds(config)` -- Scaffolds across a runner

#### Personas

- `useRunPersonas(config)` -- Personas for a run
- `useRunnerPersonas(config)` -- Personas for a runner
- `useProductPersonas(config)` -- Personas for a product
- `usePersonaUseCases(config)` -- Use cases for a persona
- `useUseCaseInputValues(config)` -- Input values for a use case
- `useCreatePersona(config)` -- Mutation: create persona
- `useUpdatePersona(config)` -- Mutation: update persona
- `useDeletePersona(config)` -- Mutation: delete persona
- `useDetectPersonas(config)` -- Mutation: AI-detect personas

#### Test Scenarios & Sequences

- `useRunnerTestScenarios(config)` -- Test scenarios for a runner
- `useTestScenarioSequences(config)` -- Sequences in a test scenario
- `useTestScenarioSequenceTestInteractions(config)` -- Interactions in a sequence
- `useTestScenarioSequenceRuns(config)` -- Runs of a sequence
- `useCreateTestScenario(config)` -- Mutation: create scenario
- `useUpdateTestScenario(config)` -- Mutation: update scenario
- `useDeleteTestScenario(config)` -- Mutation: delete scenario
- `useDetectTestScenarios(config)` -- Mutation: AI-detect scenarios
- `useGenerateSequence(config)` -- Mutation: AI-generate sequence steps

#### Schedules & Credentials

- `useRunnerSchedules(config)` -- Schedules for a runner
- `useCreateTestSchedule(config)` -- Mutation: create schedule
- `useEntityCredentials(config)` -- Credentials for an entity
- `useCreateEntityCredential(config)` -- Mutation: create credential
- `useUpdateEntityCredential(config)` -- Mutation: update credential
- `useDeleteEntityCredential(config)` -- Mutation: delete credential

#### Entities, Products & Runners

- `useEntities(config)` -- User's entities
- `useEntityProducts(config)` -- Products for an entity
- `useProduct(config)` -- Single product details
- `useProductRuns(config)` -- Runs for a product
- `useProductRunners(config)` -- Runners for a product
- `useProductEnvironments(config)` -- Environments for a product
- `useRunner(config)` -- Single runner details
- `useRunnerScans(config)` -- Scans for a runner
- `useRunnerPages(config)` -- Pages across a runner
- `useRunnerPageStates(config)` -- Page states across a runner
- `useEnvironmentPages(config)` -- Pages for an environment

#### Scanning

- `useSubmitScan(config)` -- Mutation: submit a scan (public endpoint, no auth required)

### QUERY_KEYS

Type-safe cache key factory for TanStack Query with 50+ key methods. Keys are namespaced under `'testomniac'` and structured hierarchically (e.g., `QUERY_KEYS.run(runId)` produces `['testomniac', 'run', runId]`).

### Cache Settings

- `DEFAULT_STALE_TIME` -- 5 minutes
- `DEFAULT_GC_TIME` -- 30 minutes

### Utilities

- `createAuthHeaders(token)` -- Builds `Authorization: Bearer` header object
- `buildUrl(base, path)` -- URL construction helper
- `handleApiError(error)` -- Standardized API error handling

## Development

```bash
bun run build          # Build ESM (tsc -> dist/)
bun run build:watch    # Watch mode build
bun run clean          # Remove dist/
bun test               # Run Vitest tests
bun run typecheck      # TypeScript check
bun run lint           # ESLint
bun run verify         # typecheck + test + build (use before commit)
```

## Related Packages

- **testomniac_types** -- Shared type definitions (imported for all API request/response types)
- **testomniac_api** -- Backend server this client communicates with
- **testomniac_lib** -- Business logic library that wraps this client's hooks
- **testomniac_app** -- Web frontend (consumes transitively via testomniac_lib)
- **testomniac_app_rn** -- React Native app (consumes transitively via testomniac_lib)

## License

BUSL-1.1
