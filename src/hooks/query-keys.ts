/**
 * Query Key Factory for Testomniac TanStack Query
 *
 * Provides type-safe, consistent query keys for all Testomniac API endpoints.
 * Follows TanStack Query best practices for hierarchical key structure.
 *
 * ## Key Hierarchy
 *
 * All keys start with `["testomniac"]` as the root, then branch by resource.
 * The previously exported `QUERY_KEYS` object is superseded by this
 * `queryKeys.testomniac.*` factory; the produced key tuples are identical in
 * shape so cache entries remain stable.
 *
 * ## Invalidation Patterns
 *
 * Use the hierarchical structure for targeted invalidation:
 * - `queryKeys.testomniac.all()` invalidates ALL testomniac queries
 * - `queryKeys.testomniac.entities()` invalidates the entities list
 */

const testomniacBase = () => ['testomniac'] as const;

export const queryKeys = {
  testomniac: {
    /** Root key for all testomniac queries. Use for bulk invalidation. */
    all: testomniacBase,

    user: (userId: string) => [...testomniacBase(), 'user', userId] as const,
    entities: () => [...testomniacBase(), 'entities'] as const,
    entityProducts: (entitySlug: string) =>
      [...testomniacBase(), 'products', entitySlug] as const,
    product: (productId: number) =>
      [...testomniacBase(), 'product', productId] as const,
    productRuns: (productId: number) =>
      [...testomniacBase(), 'product', productId, 'runs'] as const,
    run: (runId: number) => [...testomniacBase(), 'run', runId] as const,
    runSummary: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'summary'] as const,
    runNavigationMap: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'navigation-map'] as const,
    runStructure: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'structure'] as const,
    runLiveDashboard: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'live-dashboard'] as const,
    runPages: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'pages'] as const,
    runPagesSummary: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'pages-summary'] as const,
    runPageSummary: (runId: number, pageId: number) =>
      [...testomniacBase(), 'run', runId, 'page', pageId, 'summary'] as const,
    runFindings: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'findings'] as const,
    runTestInteractions: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'test-interactions'] as const,
    runTestRuns: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'test-runs'] as const,
    runPersonas: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'personas'] as const,
    runScaffolds: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'scaffolds'] as const,
    pageStates: (pageId: number) =>
      [...testomniacBase(), 'page', pageId, 'states'] as const,
    pageStateItems: (pageStateId: number) =>
      [...testomniacBase(), 'page-state', pageStateId, 'items'] as const,
    personaUseCases: (personaId: number) =>
      [...testomniacBase(), 'persona', personaId, 'use-cases'] as const,
    useCaseInputValues: (useCaseId: number) =>
      [...testomniacBase(), 'use-case', useCaseId, 'input-values'] as const,
    runner: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId] as const,
    productRunners: (productId: number) =>
      [...testomniacBase(), 'product', productId, 'runners'] as const,
    runnerPages: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'pages'] as const,
    runnerPageStates: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'page-states'] as const,
    runnerDiscoveryRuns: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'test-runs'] as const,
    /** @deprecated Use `runnerDiscoveryRuns` or `runnerTestRuns`. */
    runnerScans: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'test-runs'] as const,
    runnerTestInteractions: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'test-interactions'] as const,
    runnerTestRuns: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'test-runs'] as const,
    runnerScaffolds: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'scaffolds'] as const,
    runnerPersonas: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'personas'] as const,
    productPersonas: (productId: number) =>
      [...testomniacBase(), 'product', productId, 'personas'] as const,
    pageStateScaffolds: (pageStateId: number) =>
      [...testomniacBase(), 'page-state', pageStateId, 'scaffolds'] as const,
    htmlElement: (id: number) =>
      [...testomniacBase(), 'html-element', id] as const,
    runnerTestSurfaces: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'test-surfaces'] as const,
    runnerTestSurfaceBundles: (runnerId: number) =>
      [
        ...testomniacBase(),
        'runner',
        runnerId,
        'test-surface-bundles',
      ] as const,
    bundleSurfaces: (bundleId: number) =>
      [...testomniacBase(), 'bundle', bundleId, 'surfaces'] as const,
    bundleInteractions: (bundleId: number) =>
      [...testomniacBase(), 'bundle', bundleId, 'interactions'] as const,
    bundleScenarios: (bundleId: number) =>
      [...testomniacBase(), 'bundle', bundleId, 'scenarios'] as const,
    runnerSchedules: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'test-schedules'] as const,
    testSurfaceChildSurfaces: (testSurfaceId: number) =>
      [...testomniacBase(), 'test-surface', testSurfaceId, 'surfaces'] as const,
    testSurfaceTestInteractions: (testSurfaceId: number) =>
      [...testomniacBase(), 'test-surface', testSurfaceId, 'elements'] as const,
    testInteractionActions: (testInteractionId: number) =>
      [
        ...testomniacBase(),
        'test-interaction',
        testInteractionId,
        'actions',
      ] as const,
    testRunFindings: (testRunId: number) =>
      [...testomniacBase(), 'test-run', testRunId, 'findings'] as const,
    runnerFindings: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'findings'] as const,
    runnerTestScenarios: (runnerId: number) =>
      [...testomniacBase(), 'runner', runnerId, 'test-scenarios'] as const,
    testScenarioSequences: (scenarioId: number) =>
      [...testomniacBase(), 'test-scenario', scenarioId, 'sequences'] as const,
    testScenarioSequenceTestInteractions: (sequenceId: number) =>
      [
        ...testomniacBase(),
        'test-scenario-sequence',
        sequenceId,
        'test-interactions',
      ] as const,
    testScenarioSequenceRuns: (sequenceId: number) =>
      [
        ...testomniacBase(),
        'test-scenario-sequence',
        sequenceId,
        'runs',
      ] as const,
    productEnvironments: (productId: number) =>
      [...testomniacBase(), 'product', productId, 'environments'] as const,
    environmentUserData: (envId: number) =>
      [...testomniacBase(), 'environment', envId, 'user-data'] as const,
    environmentPages: (envId: number) =>
      [...testomniacBase(), 'environment', envId, 'pages'] as const,
    environmentTestInteractions: (envId: number) =>
      [...testomniacBase(), 'environment', envId, 'test-interactions'] as const,
    environmentTestInteractionsPage: (
      envId: number,
      params: {
        limit: number;
        offset: number;
        testType?: string;
        priority?: number;
        sizeClass?: string;
        search?: string;
      }
    ) =>
      [
        ...testomniacBase(),
        'environment',
        envId,
        'test-interactions',
        'page',
        params,
      ] as const,
    environmentTestSurfaces: (envId: number) =>
      [...testomniacBase(), 'environment', envId, 'test-surfaces'] as const,
    entityCredentials: (entitySlug: string) =>
      [...testomniacBase(), 'entity', entitySlug, 'credentials'] as const,
    entityApiKeys: (entitySlug: string) =>
      [...testomniacBase(), 'entity', entitySlug, 'api-keys'] as const,
    objectScript: (kind: string, id: number) =>
      [...testomniacBase(), 'object-script', kind, id] as const,
    runPatterns: (runId: number) =>
      [...testomniacBase(), 'run', runId, 'patterns'] as const,
  },
} as const;

/**
 * Utility type to extract a query key from the factory.
 * All query keys are readonly arrays of unknown values.
 */
export type QueryKey = readonly unknown[];

/**
 * Helper function to create a query key for custom or ad-hoc endpoints that are
 * not covered by the standard `queryKeys` factory.
 *
 * @param service - The service name (e.g., "testomniac")
 * @param parts - Additional key segments (strings, numbers, or filter objects)
 * @returns A readonly query key tuple
 */
export const createQueryKey = (
  service: string,
  ...parts: (string | number | object)[]
): readonly unknown[] => {
  return [service, ...parts] as const;
};

/**
 * Helper to get the root key for all testomniac service queries.
 * Useful for bulk invalidation of the entire testomniac cache.
 *
 * @returns The root query key `["testomniac"]`
 */
export const getServiceKeys = () => {
  return queryKeys.testomniac.all();
};
