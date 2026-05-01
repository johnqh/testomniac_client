/**
 * Branded type alias for Firebase ID tokens used to authenticate API requests.
 *
 * All protected endpoints require a valid Firebase ID token passed in the
 * `Authorization: Bearer <token>` header. Obtain this token from
 * `firebase.auth().currentUser.getIdToken()`.
 */
export type FirebaseIdToken = string;

/**
 * Default stale time for TanStack Query hooks (5 minutes).
 *
 * Cached data is considered fresh for this duration. Queries will not
 * refetch in the background while data is still fresh.
 */
export const DEFAULT_STALE_TIME = 5 * 60 * 1000;

/**
 * Default garbage collection time for TanStack Query hooks (30 minutes).
 *
 * Inactive cached data is kept in memory for this duration before being
 * garbage collected. This allows instant restoration when a component
 * remounts within the window.
 */
export const DEFAULT_GC_TIME = 30 * 60 * 1000;

/**
 * Type-safe cache key factory for TanStack Query.
 *
 * Provides structured, deterministic query keys used internally by all hooks
 * and available for consumers who need manual cache invalidation or prefetching.
 *
 * @example
 * ```typescript
 * import { QUERY_KEYS } from '@sudobility/testomniac_client';
 *
 * // Manual invalidation
 * queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(userId) });
 * ```
 */
export const QUERY_KEYS = {
  user: (userId: string) => ['testomniac', 'user', userId] as const,
  entityProducts: (entitySlug: string) =>
    ['testomniac', 'products', entitySlug] as const,
  product: (productId: number) => ['testomniac', 'product', productId] as const,
  productRuns: (productId: number) =>
    ['testomniac', 'product', productId, 'runs'] as const,
  run: (runId: number) => ['testomniac', 'run', runId] as const,
  runPages: (runId: number) => ['testomniac', 'run', runId, 'pages'] as const,
  runTestCases: (runId: number) =>
    ['testomniac', 'run', runId, 'test-cases'] as const,
  runTestRuns: (runId: number) =>
    ['testomniac', 'run', runId, 'test-runs'] as const,
  runPersonas: (runId: number) =>
    ['testomniac', 'run', runId, 'personas'] as const,
  runComponents: (runId: number) =>
    ['testomniac', 'run', runId, 'components'] as const,
  pageStates: (pageId: number) =>
    ['testomniac', 'page', pageId, 'states'] as const,
  pageStateItems: (pageStateId: number) =>
    ['testomniac', 'page-state', pageStateId, 'items'] as const,
  personaUseCases: (personaId: number) =>
    ['testomniac', 'persona', personaId, 'use-cases'] as const,
  useCaseInputValues: (useCaseId: number) =>
    ['testomniac', 'use-case', useCaseId, 'input-values'] as const,
  runner: (runnerId: number) => ['testomniac', 'runner', runnerId] as const,
  productRunners: (productId: number) =>
    ['testomniac', 'product', productId, 'runners'] as const,
  runnerPages: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'pages'] as const,
  runnerPageStates: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'page-states'] as const,
  runnerScans: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'scans'] as const,
  runnerTestCases: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-cases'] as const,
  runnerTestRuns: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-runs'] as const,
  runnerComponents: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'components'] as const,
  runnerPersonas: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'personas'] as const,
  pageStateReusableElements: (pageStateId: number) =>
    ['testomniac', 'page-state', pageStateId, 'reusable-elements'] as const,
  htmlElement: (id: number) => ['testomniac', 'html-element', id] as const,
  runnerTestSuites: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-suites'] as const,
  testSuiteChildSuites: (testSuiteId: number) =>
    ['testomniac', 'test-suite', testSuiteId, 'suites'] as const,
  testSuiteTestCases: (testSuiteId: number) =>
    ['testomniac', 'test-suite', testSuiteId, 'cases'] as const,
  testCaseActions: (testCaseId: number) =>
    ['testomniac', 'test-case', testCaseId, 'actions'] as const,
  testRunFindings: (testRunId: number) =>
    ['testomniac', 'test-run', testRunId, 'findings'] as const,
  runnerFindings: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'findings'] as const,
} as const;
