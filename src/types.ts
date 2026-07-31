import type {
  ApiKeyResponse,
  ProductResponse,
  TestEnvironmentResponse,
} from '@sudobility/testomniac_types';

/**
 * Result of resolving a product + test environment by URL via
 * `GET /api/v1/products/resolve-by-url`. The endpoint returns `null` (not this
 * shape) when no environment in the entity matches the URL.
 */
export interface ProductUrlResolution {
  product: ProductResponse;
  testEnvironment: TestEnvironmentResponse;
}

/**
 * Branded type alias for Firebase ID tokens used to authenticate API requests.
 *
 * All protected endpoints require a valid Firebase ID token passed in the
 * `Authorization: Bearer <token>` header. Obtain this token from
 * `firebase.auth().currentUser.getIdToken()`.
 */
export type FirebaseIdToken = string;

/**
 * The kinds of domain objects that expose a generated Playwright `/script`
 * endpoint on the Testomniac API.
 */
export type ScriptKind = 'interaction' | 'sequence' | 'surface' | 'finding';

/**
 * An entity-scoped API key as returned by
 * `/api/v1/entities/:entitySlug/api-keys`.
 */
export interface EntityApiKeyResponse extends ApiKeyResponse {
  entitySlug: string;
  associatedPersonalEntityId: string | null;
}

/** Request payload for creating an entity-scoped API key. */
export interface CreateEntityApiKeyRequest {
  title: string;
  associatedPersonalEntityId?: string | null;
}

export interface RunSummary {
  runId: number;
  rootRunId: number;
  runnerId: number;
  testEnvironmentId: number | null;
  status: string;
  status_update?: string | null;
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
  testInteractionsCount: number;
  testInteractionRunsCount: number;
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
    testInteractionRunId: number;
  }>;
  runtimeSignals: Array<{
    testInteractionRunId: number;
    testInteractionId: number;
    testInteractionTitle: string | null;
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
    testInteractions: Array<{
      id: number;
      title: string;
      testType: string;
      priority: number;
      dependencyTestInteractionId: number | null;
      startingPath: string | null;
      startingPageStateId: number | null;
      interactionRuns: Array<{
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

export interface RunLiveDashboard {
  summary: RunSummary;
  pagesSummary: RunPageSummary[];
  navigationMap: RunNavigationMap;
  structure: RunStructure | null;
}

/**
 * Default garbage collection time for TanStack Query hooks (30 minutes).
 *
 * Inactive cached data is kept in memory for this duration before being
 * garbage collected. This allows instant restoration when a component
 * remounts within the window.
 */
export const DEFAULT_GC_TIME = 30 * 60 * 1000;

/**
 * One view of an app: a URL path plus the control-shape signature that
 * distinguishes states sharing that path.
 *
 * Two views with the same `urlPath` are genuinely different screens — a cart
 * with items versus an empty one, a modal open versus closed. Collapsing them
 * by path would undo the entire reason the graph moved to webgraph.
 */
export interface GraphView {
  id: number;
  urlPath: string;
  signature: string;
  title: string | null;
  observationCount: number;
}

/** A transition between two views. */
export interface GraphTransition {
  id: number;
  fromViewId: number;
  toViewId: number | null;
  toUrlPath: string;
  kind: 'declared' | 'observed';
  triggerKind: string;
  triggerLabel: string | null;
  successCount: number;
  failureCount: number;
  removedAt: string | null;
}

export interface NavigationGraphResponse {
  views: GraphView[];
  transitions: GraphTransition[];
}

/** `route: null` means no known path within the depth cap. */
export interface RouteResponse {
  route: GraphTransition[] | null;
  cost: number | null;
  reason?: string;
}

export interface NextStepResponse {
  transition: GraphTransition | null;
  reason: string | null;
}

/**
 * One step of a plan. A `click` may end a plan without navigating — that is
 * the expected shape for goals like "add an item to the cart".
 */
export type PlanAction =
  | {
      kind: 'goto';
      toUrlPath: string;
      toViewId: number | null;
      label: string | null;
    }
  | {
      kind: 'click';
      controlName: string;
      onViewId: number;
      toViewId: number | null;
      label: string | null;
    };

/**
 * `source: 'graph-fallback'` means the plan came from a plain graph route
 * rather than the planner — because it was unconfigured, failed, or proposed an
 * action the graph could not verify. A weaker plan, not an error.
 */
export interface PlanResponse {
  startView: { id: number; urlPath: string; signature: string } | null;
  actions: PlanAction[];
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  source: 'llm' | 'graph-fallback';
}
