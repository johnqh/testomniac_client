import type { NetworkClient, Optional } from '@sudobility/types';
import type {
  ActionableItemResponse,
  BaseResponse,
  CreateDiscoveryRunRequest,
  CreateDiscoveryRunResponse,
  CreateEntityCredentialRequest,
  CreatePersonaRequest,
  CreateProductRequest,
  CreateRunnerRequest,
  CreateTestInteractionRunRequest,
  CreateTestScenarioRequest,
  CreateTestScheduleRequest,
  CreateTestSurfaceBundleRequest,
  DetectPersonasRequest,
  DetectPersonasResponse,
  DetectTestScenariosRequest,
  DetectTestScenariosResponse,
  EntityCredentialResponse,
  EntityWithRole,
  GenerateSequenceRequest,
  GenerateSequenceResponse,
  HtmlElementResponse,
  InputValueResponse,
  PageResponse,
  PageStatePatternResponse,
  PageStateResponse,
  PageStateScaffoldResponse,
  PersonaResponse,
  ProductResponse,
  ProductSummaryResponse,
  ResolveEnvironmentRequest,
  ResolveEnvironmentResponse,
  RunnerResponse,
  ScaffoldResponse,
  ScanEndRequest,
  ScanEndResponse,
  TestActionResponse,
  TestEnvironmentResponse,
  TestInteractionResponse,
  TestInteractionRunResponse,
  TestRunFindingResponse,
  TestRunResponse,
  TestScenarioResponse,
  TestScenarioSequenceResponse,
  TestScenarioSequenceRunResponse,
  TestScenarioSequenceTestInteractionLinkResponse,
  TestScheduleResponse,
  TestSurfaceBundleResponse,
  TestSurfaceResponse,
  UpdateEntityCredentialRequest,
  UpdatePersonaRequest,
  UpdateTestScenarioRequest,
  UpdateTestSurfaceBundleRequest,
  UseCaseResponse,
  User,
  UserData,
} from '@sudobility/testomniac_types';
import type {
  CreateEntityApiKeyRequest,
  EntityApiKeyResponse,
  FirebaseIdToken,
  RunLiveDashboard,
  RunNavigationMap,
  RunPageDetailSummary,
  RunPageSummary,
  RunStructure,
  RunSummary,
  ScriptKind,
} from '../types';

/**
 * Maps each {@link ScriptKind} to its API path for the generated Playwright
 * `/script` endpoint.
 *
 * @internal
 */
const SCRIPT_PATHS: Record<ScriptKind, (id: number) => string> = {
  interaction: id => `/api/v1/test-interactions/${id}/script`,
  surface: id => `/api/v1/test-surfaces/${id}/script`,
  sequence: id => `/api/v1/test-scenarios/sequences/${id}/script`,
  finding: id => `/api/v1/test-run-findings/${id}/script`,
};

/**
 * Default headers applied to every request.
 *
 * @internal
 */
const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/**
 * HTTP client for the Testomniac API.
 *
 * Communicates with the Testomniac backend using a dependency-injected
 * {@link NetworkClient}. All HTTP calls go through the injected `networkClient`
 * -- this class never uses `fetch` directly.
 *
 * @example
 * ```typescript
 * import { TestomniacClient } from '@sudobility/testomniac_client';
 *
 * const client = new TestomniacClient(myNetworkClient, 'https://api.example.com');
 *
 * // Fetch user profile
 * const user = await client.getUser(idToken, userId);
 * ```
 */
export class TestomniacClient {
  private readonly baseUrl: string;
  private readonly networkClient: NetworkClient;

  /**
   * Creates a new TestomniacClient instance.
   *
   * @param networkClient - A {@link NetworkClient} implementation for making HTTP requests
   * @param baseUrl - The base URL of the Testomniac API (e.g., `"https://api.example.com"`)
   */
  constructor(networkClient: NetworkClient, baseUrl: string) {
    this.networkClient = networkClient;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // ===========================================================================
  // Private Request Method
  // ===========================================================================

  private async request<T>(
    endpoint: string,
    options: {
      method?: Optional<'GET' | 'POST' | 'PUT' | 'DELETE'>;
      body?: Optional<unknown>;
      headers?: Optional<Record<string, string>>;
      token?: Optional<string>;
      timeout?: Optional<number>;
    } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };

    if (options.token) {
      requestHeaders['Authorization'] = `Bearer ${options.token}`;
    }

    const requestOptions: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers: Record<string, string>;
      body?: string;
      timeout?: number;
    } = {
      method: options.method || 'GET',
      headers: requestHeaders,
    };

    if (
      options.body !== undefined &&
      options.method &&
      options.method !== 'GET'
    ) {
      requestOptions.body = JSON.stringify(options.body);
    }

    if (options.timeout) {
      requestOptions.timeout = options.timeout;
    }

    const response = await this.networkClient.request<T>(url, requestOptions);

    if (response.data === undefined) {
      throw new Error('No data received from server');
    }

    return response.data as T;
  }

  // --- User ---

  async getUser(
    token: FirebaseIdToken,
    userId: string
  ): Promise<BaseResponse<User>> {
    return this.request<BaseResponse<User>>(`/api/v1/users/${userId}`, {
      token,
    });
  }

  // --- Entities ---

  async getEntities(
    token: FirebaseIdToken
  ): Promise<BaseResponse<EntityWithRole[]>> {
    return this.request<BaseResponse<EntityWithRole[]>>('/api/v1/entities', {
      token,
    });
  }

  // --- Discovery Run ---

  async submitDiscoveryRun(
    data: CreateDiscoveryRunRequest
  ): Promise<BaseResponse<CreateDiscoveryRunResponse>> {
    return this.request<BaseResponse<CreateDiscoveryRunResponse>>(
      '/api/v1/scan',
      { method: 'POST', body: data }
    );
  }

  async submitDiscoveryRunAuthenticated(
    token: FirebaseIdToken,
    data: CreateDiscoveryRunRequest
  ): Promise<BaseResponse<CreateDiscoveryRunResponse>> {
    return this.request<BaseResponse<CreateDiscoveryRunResponse>>(
      '/api/v1/scan',
      { method: 'POST', body: data, token }
    );
  }

  // --- Products ---

  async getEntityProducts(
    token: FirebaseIdToken,
    entitySlug: string
  ): Promise<BaseResponse<ProductSummaryResponse[]>> {
    return this.request<BaseResponse<ProductSummaryResponse[]>>(
      `/api/v1/entities/${entitySlug}/products`,
      { token }
    );
  }

  async createProduct(
    token: FirebaseIdToken,
    data: CreateProductRequest
  ): Promise<BaseResponse<ProductResponse>> {
    return this.request<BaseResponse<ProductResponse>>('/api/v1/products', {
      method: 'POST',
      body: data,
      token,
    });
  }

  /**
   * Resolve (and create if needed) the test environment for a URL.
   * Backs `POST /api/v1/test-environments/resolve`.
   */
  async resolveTestEnvironment(
    token: FirebaseIdToken,
    data: ResolveEnvironmentRequest
  ): Promise<BaseResponse<ResolveEnvironmentResponse>> {
    return this.request<BaseResponse<ResolveEnvironmentResponse>>(
      '/api/v1/test-environments/resolve',
      { method: 'POST', body: data, token }
    );
  }

  /**
   * Read the stored user-data (credentials + arbitrary fields) for an
   * environment. Backs `GET /api/v1/test-environments/:id/user-data`.
   */
  async getEnvironmentUserData(
    token: FirebaseIdToken,
    environmentId: number
  ): Promise<BaseResponse<{ data: UserData }>> {
    return this.request<BaseResponse<{ data: UserData }>>(
      `/api/v1/test-environments/${environmentId}/user-data`,
      { token }
    );
  }

  /**
   * Replace the stored user-data for an environment.
   * Backs `PUT /api/v1/test-environments/:id/user-data`.
   */
  async updateEnvironmentUserData(
    token: FirebaseIdToken,
    environmentId: number,
    data: UserData
  ): Promise<BaseResponse<{ data: UserData }>> {
    return this.request<BaseResponse<{ data: UserData }>>(
      `/api/v1/test-environments/${environmentId}/user-data`,
      { method: 'PUT', body: { data }, token }
    );
  }

  /**
   * End a scan and detect personas + scenarios for a product.
   * Backs `POST /api/v1/scan/end`.
   */
  async endScan(
    token: FirebaseIdToken,
    data: ScanEndRequest
  ): Promise<BaseResponse<ScanEndResponse>> {
    return this.request<BaseResponse<ScanEndResponse>>('/api/v1/scan/end', {
      method: 'POST',
      body: data,
      token,
    });
  }

  async createRunner(
    token: FirebaseIdToken,
    productId: number,
    data: CreateRunnerRequest
  ): Promise<BaseResponse<RunnerResponse>> {
    return this.request<BaseResponse<RunnerResponse>>(
      `/api/v1/products/${productId}/runners`,
      { method: 'POST', body: data, token }
    );
  }

  async getProduct(
    token: FirebaseIdToken,
    productId: number
  ): Promise<BaseResponse<RunnerResponse>> {
    return this.request<BaseResponse<RunnerResponse>>(
      `/api/v1/products/${productId}`,
      { token }
    );
  }

  // --- Test Runs ---

  async getProductRuns(
    token: FirebaseIdToken,
    productId: number
  ): Promise<BaseResponse<TestRunResponse[]>> {
    return this.request<BaseResponse<TestRunResponse[]>>(
      `/api/v1/products/${productId}/runs`,
      { token }
    );
  }

  async getTestRun(
    token: FirebaseIdToken,
    testRunId: number
  ): Promise<BaseResponse<TestRunResponse>> {
    return this.request<BaseResponse<TestRunResponse>>(
      `/api/v1/runs/${testRunId}`,
      { token }
    );
  }

  async getRunSummary(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<RunSummary>> {
    return this.request<BaseResponse<RunSummary>>(
      `/api/v1/runs/${runId}/summary`,
      { token }
    );
  }

  async getRunNavigationMap(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<RunNavigationMap>> {
    return this.request<BaseResponse<RunNavigationMap>>(
      `/api/v1/runs/${runId}/navigation-map`,
      { token }
    );
  }

  async getRunStructure(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<RunStructure>> {
    return this.request<BaseResponse<RunStructure>>(
      `/api/v1/runs/${runId}/structure`,
      { token }
    );
  }

  async getRunLiveDashboard(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<RunLiveDashboard>> {
    return this.request<BaseResponse<RunLiveDashboard>>(
      `/api/v1/runs/${runId}/live-dashboard`,
      { token }
    );
  }

  // --- Run sub-resources ---

  async getRunPages(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<PageResponse[]>> {
    return this.request<BaseResponse<PageResponse[]>>(
      `/api/v1/runs/${runId}/pages`,
      { token }
    );
  }

  async getRunPagesSummary(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<RunPageSummary[]>> {
    return this.request<BaseResponse<RunPageSummary[]>>(
      `/api/v1/runs/${runId}/pages-summary`,
      { token }
    );
  }

  async getRunPageSummary(
    token: FirebaseIdToken,
    runId: number,
    pageId: number
  ): Promise<BaseResponse<RunPageDetailSummary>> {
    return this.request<BaseResponse<RunPageDetailSummary>>(
      `/api/v1/runs/${runId}/pages/${pageId}/summary`,
      { token }
    );
  }

  async getRunFindings(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<TestRunFindingResponse[]>> {
    return this.request<BaseResponse<TestRunFindingResponse[]>>(
      `/api/v1/runs/${runId}/findings`,
      { token }
    );
  }

  async getRunTestInteractions(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    return this.request<BaseResponse<TestInteractionResponse[]>>(
      `/api/v1/runs/${runId}/test-interactions`,
      { token }
    );
  }

  async getTestRunChildRuns(
    token: FirebaseIdToken,
    testRunId: number
  ): Promise<BaseResponse<TestRunResponse[]>> {
    return this.request<BaseResponse<TestRunResponse[]>>(
      `/api/v1/runs/${testRunId}/child-runs`,
      { token }
    );
  }

  async getRunPersonas(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<PersonaResponse[]>> {
    return this.request<BaseResponse<PersonaResponse[]>>(
      `/api/v1/runs/${runId}/personas`,
      { token }
    );
  }

  async getRunScaffolds(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<ScaffoldResponse[]>> {
    return this.request<BaseResponse<ScaffoldResponse[]>>(
      `/api/v1/runs/${runId}/scaffolds`,
      { token }
    );
  }

  async getRunPatterns(
    token: FirebaseIdToken,
    runId: number
  ): Promise<BaseResponse<PageStatePatternResponse[]>> {
    return this.request<BaseResponse<PageStatePatternResponse[]>>(
      `/api/v1/runs/${runId}/patterns`,
      { token }
    );
  }

  // --- Runners ---

  async getProductRunners(
    token: FirebaseIdToken,
    productId: number
  ): Promise<BaseResponse<RunnerResponse[]>> {
    return this.request<BaseResponse<RunnerResponse[]>>(
      `/api/v1/products/${productId}/runners`,
      { token }
    );
  }

  async getRunner(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<RunnerResponse>> {
    return this.request<BaseResponse<RunnerResponse>>(
      `/api/v1/runners/${runnerId}`,
      { token }
    );
  }

  // --- Runner sub-resources ---

  async getRunnerPages(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<PageResponse[]>> {
    return this.request<BaseResponse<PageResponse[]>>(
      `/api/v1/runners/${runnerId}/pages`,
      { token }
    );
  }

  async getRunnerPageStates(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<PageStateResponse[]>> {
    return this.request<BaseResponse<PageStateResponse[]>>(
      `/api/v1/runners/${runnerId}/page-states`,
      { token }
    );
  }

  async getRunnerTestInteractions(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    return this.request<BaseResponse<TestInteractionResponse[]>>(
      `/api/v1/runners/${runnerId}/test-interactions`,
      { token }
    );
  }

  async getRunnerTestRuns(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<TestRunResponse[]>> {
    return this.request<BaseResponse<TestRunResponse[]>>(
      `/api/v1/runners/${runnerId}/test-runs`,
      { token }
    );
  }

  async getRunnerScaffolds(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<ScaffoldResponse[]>> {
    return this.request<BaseResponse<ScaffoldResponse[]>>(
      `/api/v1/runners/${runnerId}/scaffolds`,
      { token }
    );
  }

  async getRunnerPersonas(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<PersonaResponse[]>> {
    return this.request<BaseResponse<PersonaResponse[]>>(
      `/api/v1/runners/${runnerId}/personas`,
      { token }
    );
  }

  async getRunnerTestSurfaceBundles(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<TestSurfaceBundleResponse[]>> {
    return this.request<BaseResponse<TestSurfaceBundleResponse[]>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles`,
      { token }
    );
  }

  async getBundleSurfaces(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number
  ): Promise<BaseResponse<TestSurfaceResponse[]>> {
    return this.request<BaseResponse<TestSurfaceResponse[]>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/surfaces`,
      { token }
    );
  }

  async getBundleInteractions(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    return this.request<BaseResponse<TestInteractionResponse[]>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/interactions`,
      { token }
    );
  }

  async getBundleScenarios(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number
  ): Promise<BaseResponse<TestScenarioResponse[]>> {
    return this.request<BaseResponse<TestScenarioResponse[]>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/scenarios`,
      { token }
    );
  }

  async createTestSurfaceBundle(
    token: FirebaseIdToken,
    runnerId: number,
    data: CreateTestSurfaceBundleRequest
  ): Promise<BaseResponse<TestSurfaceBundleResponse>> {
    return this.request<BaseResponse<TestSurfaceBundleResponse>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles`,
      { method: 'POST', body: data, token }
    );
  }

  async updateTestSurfaceBundle(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number,
    data: UpdateTestSurfaceBundleRequest
  ): Promise<BaseResponse<TestSurfaceBundleResponse>> {
    return this.request<BaseResponse<TestSurfaceBundleResponse>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}`,
      { method: 'PUT', body: data, token }
    );
  }

  async deleteTestSurfaceBundle(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number
  ): Promise<BaseResponse<TestSurfaceBundleResponse>> {
    return this.request<BaseResponse<TestSurfaceBundleResponse>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}`,
      { method: 'DELETE', token }
    );
  }

  async addSurfaceToBundle(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number,
    testSurfaceId: number
  ): Promise<BaseResponse<unknown>> {
    return this.request<BaseResponse<unknown>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/surfaces`,
      { method: 'POST', body: { testSurfaceId }, token }
    );
  }

  async addInteractionToBundle(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number,
    testInteractionId: number
  ): Promise<BaseResponse<unknown>> {
    return this.request<BaseResponse<unknown>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/interactions`,
      { method: 'POST', body: { testInteractionId }, token }
    );
  }

  async addScenarioToBundle(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number,
    testScenarioId: number
  ): Promise<BaseResponse<unknown>> {
    return this.request<BaseResponse<unknown>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/scenarios`,
      { method: 'POST', body: { testScenarioId }, token }
    );
  }

  async removeSurfaceFromBundle(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number,
    surfaceId: number
  ): Promise<BaseResponse<unknown>> {
    return this.request<BaseResponse<unknown>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/surfaces/${surfaceId}`,
      { method: 'DELETE', token }
    );
  }

  async removeInteractionFromBundle(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number,
    interactionId: number
  ): Promise<BaseResponse<unknown>> {
    return this.request<BaseResponse<unknown>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/interactions/${interactionId}`,
      { method: 'DELETE', token }
    );
  }

  async removeScenarioFromBundle(
    token: FirebaseIdToken,
    runnerId: number,
    bundleId: number,
    scenarioId: number
  ): Promise<BaseResponse<unknown>> {
    return this.request<BaseResponse<unknown>>(
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/scenarios/${scenarioId}`,
      { method: 'DELETE', token }
    );
  }

  async getRunnerSchedules(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<TestScheduleResponse[]>> {
    return this.request<BaseResponse<TestScheduleResponse[]>>(
      `/api/v1/runners/${runnerId}/test-schedules`,
      { token }
    );
  }

  async createTestSchedule(
    token: FirebaseIdToken,
    runnerId: number,
    data: CreateTestScheduleRequest
  ): Promise<BaseResponse<TestScheduleResponse>> {
    return this.request<BaseResponse<TestScheduleResponse>>(
      `/api/v1/runners/${runnerId}/test-schedules`,
      { method: 'POST', body: data, token }
    );
  }

  // --- Page sub-resources ---

  async getPageStates(
    token: FirebaseIdToken,
    pageId: number
  ): Promise<BaseResponse<PageStateResponse[]>> {
    return this.request<BaseResponse<PageStateResponse[]>>(
      `/api/v1/pages/${pageId}/states`,
      { token }
    );
  }

  async getPageStateItems(
    token: FirebaseIdToken,
    pageStateId: number
  ): Promise<BaseResponse<ActionableItemResponse[]>> {
    return this.request<BaseResponse<ActionableItemResponse[]>>(
      `/api/v1/pages/states/${pageStateId}/items`,
      { token }
    );
  }

  async getPageStateScaffolds(
    token: FirebaseIdToken,
    pageStateId: number
  ): Promise<BaseResponse<PageStateScaffoldResponse[]>> {
    return this.request<BaseResponse<PageStateScaffoldResponse[]>>(
      `/api/v1/page-details/page-states/${pageStateId}/scaffolds`,
      { token }
    );
  }

  async getHtmlElement(
    token: FirebaseIdToken,
    id: number
  ): Promise<BaseResponse<HtmlElementResponse>> {
    return this.request<BaseResponse<HtmlElementResponse>>(
      `/api/v1/page-details/html-elements/${id}`,
      { token }
    );
  }

  // --- Personas sub-resources ---

  async getPersonaUseCases(
    token: FirebaseIdToken,
    personaId: number
  ): Promise<BaseResponse<UseCaseResponse[]>> {
    return this.request<BaseResponse<UseCaseResponse[]>>(
      `/api/v1/personas/${personaId}/use-cases`,
      { token }
    );
  }

  async getUseCaseInputValues(
    token: FirebaseIdToken,
    useCaseId: number
  ): Promise<BaseResponse<InputValueResponse[]>> {
    return this.request<BaseResponse<InputValueResponse[]>>(
      `/api/v1/personas/use-cases/${useCaseId}/input-values`,
      { token }
    );
  }

  // --- Test Surfaces ---

  async getRunnerTestSurfaces(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<TestSurfaceResponse[]>> {
    return this.request<BaseResponse<TestSurfaceResponse[]>>(
      `/api/v1/runners/${runnerId}/test-surfaces`,
      { token }
    );
  }

  async getTestSurfaceTestInteractions(
    token: FirebaseIdToken,
    testSurfaceId: number
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    return this.request<BaseResponse<TestInteractionResponse[]>>(
      `/api/v1/test-surfaces/${testSurfaceId}/interactions`,
      { token }
    );
  }

  // --- Test Interaction Actions ---

  async getTestInteractionActions(
    token: FirebaseIdToken,
    testInteractionId: number
  ): Promise<BaseResponse<TestActionResponse[]>> {
    return this.request<BaseResponse<TestActionResponse[]>>(
      `/api/v1/test-interactions/${testInteractionId}/actions`,
      { token }
    );
  }

  // --- Test Interaction Run Findings ---

  async getTestInteractionRunFindings(
    token: FirebaseIdToken,
    testInteractionRunId: number
  ): Promise<BaseResponse<TestRunFindingResponse[]>> {
    return this.request<BaseResponse<TestRunFindingResponse[]>>(
      `/api/v1/test-interaction-runs/${testInteractionRunId}/findings`,
      { token }
    );
  }

  async getTestInteractionRun(
    token: FirebaseIdToken,
    testInteractionRunId: number
  ): Promise<BaseResponse<TestInteractionRunResponse | null>> {
    return this.request<BaseResponse<TestInteractionRunResponse | null>>(
      `/api/v1/test-interaction-runs/${testInteractionRunId}`,
      { token }
    );
  }

  async getRunnerFindings(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<TestRunFindingResponse[]>> {
    return this.request<BaseResponse<TestRunFindingResponse[]>>(
      `/api/v1/runners/${runnerId}/findings`,
      { token }
    );
  }

  // --- Test Scenarios ---

  async getRunnerTestScenarios(
    token: FirebaseIdToken,
    runnerId: number
  ): Promise<BaseResponse<TestScenarioResponse[]>> {
    return this.request<BaseResponse<TestScenarioResponse[]>>(
      `/api/v1/runners/${runnerId}/test-scenarios`,
      { token }
    );
  }

  async createTestScenario(
    token: FirebaseIdToken,
    runnerId: number,
    data: CreateTestScenarioRequest
  ): Promise<BaseResponse<TestScenarioResponse>> {
    return this.request<BaseResponse<TestScenarioResponse>>(
      `/api/v1/runners/${runnerId}/test-scenarios`,
      { method: 'POST', body: data, token }
    );
  }

  async updateTestScenario(
    token: FirebaseIdToken,
    runnerId: number,
    scenarioId: number,
    data: UpdateTestScenarioRequest
  ): Promise<BaseResponse<TestScenarioResponse>> {
    return this.request<BaseResponse<TestScenarioResponse>>(
      `/api/v1/runners/${runnerId}/test-scenarios/${scenarioId}`,
      { method: 'PUT', body: data, token }
    );
  }

  async deleteTestScenario(
    token: FirebaseIdToken,
    runnerId: number,
    scenarioId: number
  ): Promise<BaseResponse<TestScenarioResponse>> {
    return this.request<BaseResponse<TestScenarioResponse>>(
      `/api/v1/runners/${runnerId}/test-scenarios/${scenarioId}`,
      { method: 'DELETE', token }
    );
  }

  // --- Test Scenario Sequences ---

  async getTestScenarioSequences(
    token: FirebaseIdToken,
    scenarioId: number
  ): Promise<BaseResponse<TestScenarioSequenceResponse[]>> {
    return this.request<BaseResponse<TestScenarioSequenceResponse[]>>(
      `/api/v1/test-scenarios/${scenarioId}/sequences`,
      { token }
    );
  }

  async getTestScenarioSequenceTestInteractions(
    token: FirebaseIdToken,
    sequenceId: number
  ): Promise<BaseResponse<TestScenarioSequenceTestInteractionLinkResponse[]>> {
    return this.request<
      BaseResponse<TestScenarioSequenceTestInteractionLinkResponse[]>
    >(`/api/v1/test-scenarios/sequences/${sequenceId}/test-interactions`, {
      token,
    });
  }

  // --- Test Scenario Sequence Runs ---

  async getTestScenarioSequenceRuns(
    token: FirebaseIdToken,
    sequenceId: number
  ): Promise<BaseResponse<TestScenarioSequenceRunResponse[]>> {
    return this.request<BaseResponse<TestScenarioSequenceRunResponse[]>>(
      `/api/v1/test-scenarios/sequences/${sequenceId}/runs`,
      { token }
    );
  }

  // --- Test Environments ---

  async getProductEnvironments(
    token: FirebaseIdToken,
    productId: number
  ): Promise<BaseResponse<TestEnvironmentResponse[]>> {
    return this.request<BaseResponse<TestEnvironmentResponse[]>>(
      `/api/v1/products/${productId}/environments`,
      { token }
    );
  }

  async getEnvironmentPages(
    token: FirebaseIdToken,
    envId: number
  ): Promise<BaseResponse<PageResponse[]>> {
    return this.request<BaseResponse<PageResponse[]>>(
      `/api/v1/test-environments/${envId}/pages`,
      { token }
    );
  }

  async getEnvironmentTestInteractions(
    token: FirebaseIdToken,
    envId: number
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    return this.request<BaseResponse<TestInteractionResponse[]>>(
      `/api/v1/test-environments/${envId}/test-interactions`,
      { token }
    );
  }

  /**
   * Paginated + server-filtered test interactions for the list view. Avoids
   * shipping the full (potentially huge) interaction set; returns one page plus
   * the total count for the active filters.
   */
  async getEnvironmentTestInteractionsPage(
    token: FirebaseIdToken,
    envId: number,
    params: {
      limit: number;
      offset: number;
      testType?: string;
      priority?: number;
      sizeClass?: string;
      search?: string;
    }
  ): Promise<
    BaseResponse<{
      items: TestInteractionResponse[];
      total: number;
      limit: number;
      offset: number;
    }>
  > {
    const qs = new URLSearchParams();
    qs.set('limit', String(params.limit));
    qs.set('offset', String(params.offset));
    if (params.testType) qs.set('testType', params.testType);
    if (params.priority !== undefined)
      qs.set('priority', String(params.priority));
    if (params.sizeClass) qs.set('sizeClass', params.sizeClass);
    if (params.search) qs.set('search', params.search);
    return this.request<
      BaseResponse<{
        items: TestInteractionResponse[];
        total: number;
        limit: number;
        offset: number;
      }>
    >(
      `/api/v1/test-environments/${envId}/test-interactions/page?${qs.toString()}`,
      { token }
    );
  }

  async getEnvironmentTestSurfaces(
    token: FirebaseIdToken,
    envId: number
  ): Promise<BaseResponse<TestSurfaceResponse[]>> {
    return this.request<BaseResponse<TestSurfaceResponse[]>>(
      `/api/v1/test-environments/${envId}/test-surfaces`,
      { token }
    );
  }

  // --- Test Interaction Runs ---

  async createTestInteractionRun(
    token: FirebaseIdToken,
    data: CreateTestInteractionRunRequest
  ): Promise<BaseResponse<TestInteractionRunResponse>> {
    return this.request<BaseResponse<TestInteractionRunResponse>>(
      '/api/v1/test-interaction-runs',
      { method: 'POST', body: data, token }
    );
  }

  async clearSupersededFindings(
    token: FirebaseIdToken,
    testInteractionRunId: number
  ): Promise<BaseResponse<null>> {
    return this.request<BaseResponse<null>>(
      `/api/v1/test-interaction-runs/${testInteractionRunId}/superseded-findings`,
      { method: 'DELETE', token }
    );
  }

  // --- Entity Credentials ---

  async getEntityCredentials(
    token: FirebaseIdToken,
    entitySlug: string
  ): Promise<BaseResponse<EntityCredentialResponse[]>> {
    return this.request<BaseResponse<EntityCredentialResponse[]>>(
      `/api/v1/entities/${entitySlug}/credentials`,
      { token }
    );
  }

  async createEntityCredential(
    token: FirebaseIdToken,
    entitySlug: string,
    data: CreateEntityCredentialRequest
  ): Promise<BaseResponse<EntityCredentialResponse>> {
    return this.request<BaseResponse<EntityCredentialResponse>>(
      `/api/v1/entities/${entitySlug}/credentials`,
      { method: 'POST', body: data, token }
    );
  }

  async updateEntityCredential(
    token: FirebaseIdToken,
    entitySlug: string,
    credentialId: number,
    data: UpdateEntityCredentialRequest
  ): Promise<BaseResponse<EntityCredentialResponse>> {
    return this.request<BaseResponse<EntityCredentialResponse>>(
      `/api/v1/entities/${entitySlug}/credentials/${credentialId}`,
      { method: 'PUT', body: data, token }
    );
  }

  async deleteEntityCredential(
    token: FirebaseIdToken,
    entitySlug: string,
    credentialId: number
  ): Promise<BaseResponse<EntityCredentialResponse>> {
    return this.request<BaseResponse<EntityCredentialResponse>>(
      `/api/v1/entities/${entitySlug}/credentials/${credentialId}`,
      { method: 'DELETE', token }
    );
  }

  // --- Entity API Keys ---

  async getEntityApiKeys(
    token: FirebaseIdToken,
    entitySlug: string
  ): Promise<BaseResponse<EntityApiKeyResponse[]>> {
    return this.request<BaseResponse<EntityApiKeyResponse[]>>(
      `/api/v1/entities/${entitySlug}/api-keys`,
      { token }
    );
  }

  async createEntityApiKey(
    token: FirebaseIdToken,
    entitySlug: string,
    data: CreateEntityApiKeyRequest
  ): Promise<BaseResponse<EntityApiKeyResponse>> {
    return this.request<BaseResponse<EntityApiKeyResponse>>(
      `/api/v1/entities/${entitySlug}/api-keys`,
      { method: 'POST', body: data, token }
    );
  }

  async deleteEntityApiKey(
    token: FirebaseIdToken,
    entitySlug: string,
    apiKeyId: number
  ): Promise<BaseResponse<null>> {
    return this.request<BaseResponse<null>>(
      `/api/v1/entities/${entitySlug}/api-keys/${apiKeyId}`,
      { method: 'DELETE', token }
    );
  }

  // --- Object Scripts ---

  /**
   * Fetches the complete generated Playwright script (imports + test wrapper +
   * body) for a domain object from the API's `/script` endpoints.
   *
   * @returns The raw script source as a string
   * @throws {Error} If the request fails or returns no script
   */
  async getObjectScript(
    token: FirebaseIdToken,
    kind: ScriptKind,
    id: number
  ): Promise<string> {
    const response = await this.request<{ script: string }>(
      SCRIPT_PATHS[kind](id),
      { token }
    );
    return response.script;
  }

  // --- Personas CRUD ---

  async getProductPersonas(
    token: FirebaseIdToken,
    productId: number
  ): Promise<BaseResponse<PersonaResponse[]>> {
    return this.request<BaseResponse<PersonaResponse[]>>(
      `/api/v1/personas?productId=${productId}`,
      { token }
    );
  }

  async createPersona(
    token: FirebaseIdToken,
    data: CreatePersonaRequest
  ): Promise<BaseResponse<PersonaResponse>> {
    return this.request<BaseResponse<PersonaResponse>>('/api/v1/personas', {
      method: 'POST',
      body: data,
      token,
    });
  }

  async updatePersona(
    token: FirebaseIdToken,
    personaId: number,
    data: UpdatePersonaRequest
  ): Promise<BaseResponse<PersonaResponse>> {
    return this.request<BaseResponse<PersonaResponse>>(
      `/api/v1/personas/${personaId}`,
      { method: 'PUT', body: data, token }
    );
  }

  async deletePersona(
    token: FirebaseIdToken,
    personaId: number
  ): Promise<BaseResponse<PersonaResponse>> {
    return this.request<BaseResponse<PersonaResponse>>(
      `/api/v1/personas/${personaId}`,
      { method: 'DELETE', token }
    );
  }

  async detectPersonas(
    token: FirebaseIdToken,
    data: DetectPersonasRequest
  ): Promise<BaseResponse<DetectPersonasResponse>> {
    return this.request<BaseResponse<DetectPersonasResponse>>(
      '/api/v1/personas/detect',
      { method: 'POST', body: data, token }
    );
  }

  async detectTestScenarios(
    token: FirebaseIdToken,
    data: DetectTestScenariosRequest
  ): Promise<BaseResponse<DetectTestScenariosResponse>> {
    return this.request<BaseResponse<DetectTestScenariosResponse>>(
      '/api/v1/test-scenarios/detect',
      { method: 'POST', body: data, token }
    );
  }

  async generateSequence(
    token: FirebaseIdToken,
    scenarioId: number,
    data: GenerateSequenceRequest
  ): Promise<BaseResponse<GenerateSequenceResponse>> {
    return this.request<BaseResponse<GenerateSequenceResponse>>(
      `/api/v1/test-scenarios/${scenarioId}/generate-sequence`,
      { method: 'POST', body: data, token }
    );
  }
}

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Factory function to create a new TestomniacClient instance.
 *
 * Equivalent to `new TestomniacClient(networkClient, baseUrl)` but useful for
 * dependency injection and functional composition patterns.
 *
 * @param networkClient - Network client for making HTTP requests
 * @param baseUrl - Base URL for the Testomniac API
 * @returns A new TestomniacClient instance
 */
export const createTestomniacClient = (
  networkClient: NetworkClient,
  baseUrl: string
): TestomniacClient => new TestomniacClient(networkClient, baseUrl);
