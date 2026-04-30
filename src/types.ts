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
  entityProjects: (entitySlug: string) =>
    ['testomniac', 'projects', entitySlug] as const,
  project: (projectId: number) => ['testomniac', 'project', projectId] as const,
  projectRuns: (projectId: number) =>
    ['testomniac', 'project', projectId, 'runs'] as const,
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
  app: (appId: number) => ['testomniac', 'app', appId] as const,
  projectApps: (projectId: number) =>
    ['testomniac', 'project', projectId, 'apps'] as const,
  appPages: (appId: number) => ['testomniac', 'app', appId, 'pages'] as const,
  appPageStates: (appId: number) =>
    ['testomniac', 'app', appId, 'page-states'] as const,
  appScans: (appId: number) => ['testomniac', 'app', appId, 'scans'] as const,
  appTestCases: (appId: number) =>
    ['testomniac', 'app', appId, 'test-cases'] as const,
  appTestRuns: (appId: number) =>
    ['testomniac', 'app', appId, 'test-runs'] as const,
  appComponents: (appId: number) =>
    ['testomniac', 'app', appId, 'components'] as const,
  appPersonas: (appId: number) =>
    ['testomniac', 'app', appId, 'personas'] as const,
  pageStateReusableElements: (pageStateId: number) =>
    ['testomniac', 'page-state', pageStateId, 'reusable-elements'] as const,
  htmlElement: (id: number) => ['testomniac', 'html-element', id] as const,
  appTestSuites: (appId: number) =>
    ['testomniac', 'app', appId, 'test-suites'] as const,
  testSuiteChildSuites: (testSuiteId: number) =>
    ['testomniac', 'test-suite', testSuiteId, 'suites'] as const,
  testSuiteTestCases: (testSuiteId: number) =>
    ['testomniac', 'test-suite', testSuiteId, 'cases'] as const,
  testCaseActions: (testCaseId: number) =>
    ['testomniac', 'test-case', testCaseId, 'actions'] as const,
  testRunFindings: (testRunId: number) =>
    ['testomniac', 'test-run', testRunId, 'findings'] as const,
  appFindings: (appId: number) =>
    ['testomniac', 'app', appId, 'findings'] as const,
} as const;
