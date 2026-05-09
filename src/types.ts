/**
 * Branded type alias for Firebase ID tokens used to authenticate API requests.
 *
 * All protected endpoints require a valid Firebase ID token passed in the
 * `Authorization: Bearer <token>` header. Obtain this token from
 * `firebase.auth().currentUser.getIdToken()`.
 */
export type FirebaseIdToken = string;

export interface RunSummary {
  runId: number;
  rootRunId: number;
  runnerId: number;
  testEnvironmentId: number | null;
  status: string;
  aiSummary: string | null;
  pagesFound: number | null;
  pageStatesFound: number | null;
  testRunsCompleted: number | null;
  totalFindings: number;
  expertiseSummary: Record<
    string,
    {
      warnings: number;
      errors: number;
      findings: number;
    }
  >;
  recentFindings: Array<{
    id: number;
    type: string;
    title: string;
    description: string;
    expertise: string | null;
    createdAt: string | null;
  }>;
  completedAt: string | null;
  createdAt: string | null;
}

export interface RunPageSummary {
  pageId: number;
  relativePath: string;
  routeKey: string | null;
  requiresLogin: boolean | null;
  latestPageStateId: number | null;
  latestScreenshotPath: string | null;
  pageStatesCount: number;
  testElementsCount: number;
  testElementRunsCount: number;
  findings: number;
  errors: number;
  warnings: number;
  expertiseSummary: Record<
    string,
    {
      findings: number;
      errors: number;
      warnings: number;
    }
  >;
}

export interface RunPageDetailSummary extends RunPageSummary {
  recentFindings: Array<{
    id: number;
    type: string;
    title: string;
    description: string;
    expertise: string | null;
    createdAt: string | null;
    testElementRunId: number;
  }>;
  runtimeSignals: Array<{
    testElementRunId: number;
    testElementId: number;
    testElementTitle: string | null;
    status: string;
    consoleLog: string | null;
    networkLog: string | null;
    completedAt: string | null;
  }>;
}

export interface RunNavigationMap {
  runId: number;
  rootRunId: number;
  testEnvironmentId: number | null;
  discoveredPages: Array<{
    id: number;
    testEnvironmentId: number;
    relativePath: string;
    sourcePagePath: string | null;
    sourceLabel: string | null;
    isPublic: boolean;
    createdAt: string | null;
    updatedAt: string | null;
  }>;
  pageVisits: Array<{
    id: number;
    testRunId: number;
    testEnvironmentId: number;
    relativePath: string;
    status: string;
    redirectPath: string | null;
    requiresLogin: boolean | null;
    errorMessage: string | null;
    createdAt: string | null;
  }>;
}

export interface RunStructure {
  runId: number;
  rootRunId: number;
  bundle: {
    id: number;
    runnerId: number;
    title: string;
    uid: string | null;
    createdAt: string | null;
  };
  bundleRun: {
    id: number;
    testSurfaceBundleId: number;
    status: string;
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string | null;
  };
  surfaces: Array<{
    id: number;
    title: string;
    priority: number;
    surfaceTags: string[];
    surfaceRuns: Array<{
      id: number;
      status: string;
      startedAt: string | null;
      completedAt: string | null;
    }>;
    testElements: Array<{
      id: number;
      title: string;
      testType: string;
      priority: number;
      dependencyTestElementId: number | null;
      startingPath: string | null;
      startingPageStateId: number | null;
      elementRuns: Array<{
        id: number;
        status: string;
        durationMs: number | null;
        findings: Array<{
          id: number;
          type: string;
          title: string;
          description: string;
          createdAt: string | null;
        }>;
      }>;
    }>;
  }>;
}

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
  runSummary: (runId: number) =>
    ['testomniac', 'run', runId, 'summary'] as const,
  runNavigationMap: (runId: number) =>
    ['testomniac', 'run', runId, 'navigation-map'] as const,
  runStructure: (runId: number) =>
    ['testomniac', 'run', runId, 'structure'] as const,
  runPages: (runId: number) => ['testomniac', 'run', runId, 'pages'] as const,
  runPagesSummary: (runId: number) =>
    ['testomniac', 'run', runId, 'pages-summary'] as const,
  runPageSummary: (runId: number, pageId: number) =>
    ['testomniac', 'run', runId, 'page', pageId, 'summary'] as const,
  runFindings: (runId: number) =>
    ['testomniac', 'run', runId, 'findings'] as const,
  runTestElements: (runId: number) =>
    ['testomniac', 'run', runId, 'test-elements'] as const,
  runTestRuns: (runId: number) =>
    ['testomniac', 'run', runId, 'test-runs'] as const,
  runPersonas: (runId: number) =>
    ['testomniac', 'run', runId, 'personas'] as const,
  runScaffolds: (runId: number) =>
    ['testomniac', 'run', runId, 'scaffolds'] as const,
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
  runnerDiscoveryRuns: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-runs'] as const,
  /** @deprecated Use `runnerDiscoveryRuns` or `runnerTestRuns`. */
  runnerScans: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-runs'] as const,
  runnerTestElements: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-elements'] as const,
  runnerTestRuns: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-runs'] as const,
  runnerScaffolds: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'scaffolds'] as const,
  runnerPersonas: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'personas'] as const,
  pageStateScaffolds: (pageStateId: number) =>
    ['testomniac', 'page-state', pageStateId, 'scaffolds'] as const,
  htmlElement: (id: number) => ['testomniac', 'html-element', id] as const,
  runnerTestSurfaces: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-surfaces'] as const,
  runnerTestSurfaceBundles: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-surface-bundles'] as const,
  runnerSchedules: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-schedules'] as const,
  testSurfaceChildSurfaces: (testSurfaceId: number) =>
    ['testomniac', 'test-surface', testSurfaceId, 'surfaces'] as const,
  testSurfaceTestElements: (testSurfaceId: number) =>
    ['testomniac', 'test-surface', testSurfaceId, 'elements'] as const,
  testElementActions: (testElementId: number) =>
    ['testomniac', 'test-element', testElementId, 'actions'] as const,
  testRunFindings: (testRunId: number) =>
    ['testomniac', 'test-run', testRunId, 'findings'] as const,
  runnerFindings: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'findings'] as const,
  runnerTestScenarios: (runnerId: number) =>
    ['testomniac', 'runner', runnerId, 'test-scenarios'] as const,
  testScenarioSequences: (scenarioId: number) =>
    ['testomniac', 'test-scenario', scenarioId, 'sequences'] as const,
  testScenarioSequenceTestElements: (sequenceId: number) =>
    [
      'testomniac',
      'test-scenario-sequence',
      sequenceId,
      'test-elements',
    ] as const,
  testScenarioSequenceRuns: (sequenceId: number) =>
    ['testomniac', 'test-scenario-sequence', sequenceId, 'runs'] as const,
} as const;
