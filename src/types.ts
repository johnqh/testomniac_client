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

/** A page in the navigation graph. `hasInboundEdge: false` means nothing links to it. */
export interface NavigationGraphNode {
  pageId: number;
  relativePath: string;
  requiresLogin: boolean;
  hasInboundEdge: boolean;
}

/** A navigation edge. `removedAt` non-null means a re-decompose proved it gone. */
export interface NavigationGraphEdge {
  fromPageId: number;
  toPageId: number;
  toRelativePath: string;
  kind: 'declared' | 'observed';
  actionKind: string;
  selector: string;
  label: string | null;
  viaTestInteractionId: number | null;
  traversalCount: number;
  isStale: boolean;
  removedAt: string | null;
}

export interface NavigationGraphResponse {
  runnerId: number;
  nodes: NavigationGraphNode[];
  edges: NavigationGraphEdge[];
}

/** `route: null` means no known path within the depth cap. */
export interface RouteResponse {
  runnerId: number;
  originPageId: number;
  toPageId: number;
  route: NavigationGraphEdge[] | null;
}
