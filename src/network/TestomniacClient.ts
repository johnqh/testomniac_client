import type { NetworkClient } from '@sudobility/types';
import type {
  ActionableItemResponse,
  BaseResponse,
  CreateDiscoveryRunRequest,
  CreateDiscoveryRunResponse,
  CreateProductRequest,
  CreateRunnerRequest,
  CreateTestInteractionRunRequest,
  CreateTestScenarioRequest,
  CreateTestScheduleRequest,
  CreateTestSurfaceBundleRequest,
  HtmlElementResponse,
  InputValueResponse,
  PageResponse,
  PageStateResponse,
  PageStateScaffoldResponse,
  PersonaResponse,
  ProductResponse,
  ProductSummaryResponse,
  RunnerResponse,
  ScaffoldResponse,
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
  UpdateTestScenarioRequest,
  UpdateTestSurfaceBundleRequest,
  UseCaseResponse,
  User,
} from '@sudobility/testomniac_types';
import type {
  FirebaseIdToken,
  RunNavigationMap,
  RunPageDetailSummary,
  RunPageSummary,
  RunStructure,
  RunSummary,
} from '../types';
import { buildUrl, createAuthHeaders } from '../utils/starter-helpers';

/**
 * Validates that a response from the API conforms to the expected {@link BaseResponse} shape.
 *
 * Performs a defensive check that the response has a `success` boolean field,
 * guarding against unexpected response shapes from the network layer.
 *
 * @param data - The raw response data from the network client
 * @param operation - Description of the operation, used in the error message if validation fails
 * @returns The validated response cast to `BaseResponse<T>`
 * @throws {Error} If the response does not have a `success` boolean field
 *
 * @internal
 */
function validateResponse<T>(
  data: unknown,
  operation: string
): BaseResponse<T> {
  if (
    data != null &&
    typeof data === 'object' &&
    'success' in data &&
    typeof (data as Record<string, unknown>).success === 'boolean'
  ) {
    return data as BaseResponse<T>;
  }
  throw new Error(
    `Invalid API response for ${operation}: response does not match expected BaseResponse shape`
  );
}

/**
 * HTTP client for the Testomniac API.
 *
 * Communicates with the Testomniac backend using dependency-injected {@link NetworkClient}.
 * All HTTP calls go through the injected `networkClient` -- this class never uses `fetch` directly.
 *
 * @example
 * ```typescript
 * import { TestomniacClient } from '@sudobility/testomniac_client';
 *
 * const client = new TestomniacClient({
 *   baseUrl: 'https://api.example.com',
 *   networkClient: myNetworkClient,
 * });
 *
 * // Fetch user profile
 * const user = await client.getUser(userId, idToken);
 * ```
 */
export class TestomniacClient {
  private readonly baseUrl: string;
  private readonly networkClient: NetworkClient;

  /**
   * Creates a new TestomniacClient instance.
   *
   * @param config - Client configuration
   * @param config.baseUrl - The base URL of the Testomniac API (e.g., `"https://api.example.com"`)
   * @param config.networkClient - A {@link NetworkClient} implementation for making HTTP requests
   */
  constructor(config: { baseUrl: string; networkClient: NetworkClient }) {
    this.baseUrl = config.baseUrl;
    this.networkClient = config.networkClient;
  }

  // --- User ---

  /**
   * Fetches a user profile by ID.
   *
   * @param userId - The Firebase UID of the user to fetch
   * @param token - A valid Firebase ID token for authentication
   * @returns The user profile wrapped in a {@link BaseResponse}
   * @throws {Error} If the response does not match the expected shape
   *
   * @example
   * ```typescript
   * const response = await client.getUser('user-123', idToken);
   * if (response.success && response.data) {
   *   console.log(response.data.email);
   * }
   * ```
   */
  async getUser(
    userId: string,
    token: FirebaseIdToken
  ): Promise<BaseResponse<User>> {
    const url = buildUrl(this.baseUrl, `/api/v1/users/${userId}`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<User>(response.data, 'getUser');
  }

  // --- Discovery Run ---

  async submitDiscoveryRun(
    data: CreateDiscoveryRunRequest
  ): Promise<BaseResponse<CreateDiscoveryRunResponse>> {
    const url = buildUrl(this.baseUrl, '/api/v1/scan');
    const response = await this.networkClient.post(url, data);
    return validateResponse<CreateDiscoveryRunResponse>(
      response.data,
      'submitDiscoveryRun'
    );
  }

  async submitDiscoveryRunAuthenticated(
    data: CreateDiscoveryRunRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<CreateDiscoveryRunResponse>> {
    const url = buildUrl(this.baseUrl, '/api/v1/scan');
    const response = await this.networkClient.post(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<CreateDiscoveryRunResponse>(
      response.data,
      'submitDiscoveryRunAuthenticated'
    );
  }

  // --- Products ---

  async getEntityProducts(
    entitySlug: string,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ProductSummaryResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/entities/${entitySlug}/products`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ProductSummaryResponse[]>(
      response.data,
      'getEntityProducts'
    );
  }

  async createProduct(
    data: CreateProductRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ProductResponse>> {
    const url = buildUrl(this.baseUrl, '/api/v1/products');
    const response = await this.networkClient.post(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ProductResponse>(response.data, 'createProduct');
  }

  async createRunner(
    productId: number,
    data: CreateRunnerRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunnerResponse>> {
    const url = buildUrl(this.baseUrl, `/api/v1/products/${productId}/runners`);
    const response = await this.networkClient.post(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunnerResponse>(response.data, 'createRunner');
  }

  async getProduct(
    productId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunnerResponse>> {
    const url = buildUrl(this.baseUrl, `/api/v1/products/${productId}`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunnerResponse>(response.data, 'getProduct');
  }

  // --- Test Runs ---

  async getProductRuns(
    productId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/products/${productId}/runs`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunResponse[]>(response.data, 'getProductRuns');
  }

  async getTestRun(
    testRunId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunResponse>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${testRunId}`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunResponse>(response.data, 'getTestRun');
  }

  async getRunSummary(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunSummary>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/summary`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunSummary>(response.data, 'getRunSummary');
  }

  async getRunNavigationMap(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunNavigationMap>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/navigation-map`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunNavigationMap>(
      response.data,
      'getRunNavigationMap'
    );
  }

  async getRunStructure(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunStructure>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/structure`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunStructure>(response.data, 'getRunStructure');
  }

  // --- Run sub-resources ---

  async getRunPages(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/pages`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageResponse[]>(response.data, 'getRunPages');
  }

  async getRunPagesSummary(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunPageSummary[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/pages-summary`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunPageSummary[]>(
      response.data,
      'getRunPagesSummary'
    );
  }

  async getRunPageSummary(
    runId: number,
    pageId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunPageDetailSummary>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runs/${runId}/pages/${pageId}/summary`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunPageDetailSummary>(
      response.data,
      'getRunPageSummary'
    );
  }

  async getRunFindings(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunFindingResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/findings`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunFindingResponse[]>(
      response.data,
      'getRunFindings'
    );
  }

  async getRunTestInteractions(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runs/${runId}/test-interactions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestInteractionResponse[]>(
      response.data,
      'getRunTestInteractions'
    );
  }

  async getTestRunChildRuns(
    testRunId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${testRunId}/child-runs`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunResponse[]>(
      response.data,
      'getTestRunChildRuns'
    );
  }

  async getRunPersonas(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PersonaResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/personas`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PersonaResponse[]>(response.data, 'getRunPersonas');
  }

  async getRunScaffolds(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ScaffoldResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/scaffolds`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ScaffoldResponse[]>(
      response.data,
      'getRunScaffolds'
    );
  }

  // --- Runners ---

  async getProductRunners(
    productId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunnerResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/products/${productId}/runners`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunnerResponse[]>(
      response.data,
      'getProductRunners'
    );
  }

  async getRunner(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunnerResponse>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runners/${runnerId}`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunnerResponse>(response.data, 'getRunner');
  }

  // --- Runner sub-resources ---

  async getRunnerPages(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runners/${runnerId}/pages`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageResponse[]>(response.data, 'getRunnerPages');
  }

  async getRunnerPageStates(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageStateResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/page-states`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageStateResponse[]>(
      response.data,
      'getRunnerPageStates'
    );
  }

  async getRunnerTestInteractions(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-interactions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestInteractionResponse[]>(
      response.data,
      'getRunnerTestInteractions'
    );
  }

  async getRunnerTestRuns(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runners/${runnerId}/test-runs`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunResponse[]>(
      response.data,
      'getRunnerTestRuns'
    );
  }

  async getRunnerScaffolds(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ScaffoldResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runners/${runnerId}/scaffolds`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ScaffoldResponse[]>(
      response.data,
      'getRunnerScaffolds'
    );
  }

  async getRunnerPersonas(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PersonaResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runners/${runnerId}/personas`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PersonaResponse[]>(
      response.data,
      'getRunnerPersonas'
    );
  }

  async getRunnerTestSurfaceBundles(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestSurfaceBundleResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestSurfaceBundleResponse[]>(
      response.data,
      'getRunnerTestSurfaceBundles'
    );
  }

  async getBundleSurfaces(
    runnerId: number,
    bundleId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestSurfaceResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/surfaces`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestSurfaceResponse[]>(
      response.data,
      'getBundleSurfaces'
    );
  }

  async getBundleInteractions(
    runnerId: number,
    bundleId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/interactions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestInteractionResponse[]>(
      response.data,
      'getBundleInteractions'
    );
  }

  async getBundleScenarios(
    runnerId: number,
    bundleId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScenarioResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/scenarios`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScenarioResponse[]>(
      response.data,
      'getBundleScenarios'
    );
  }

  async createTestSurfaceBundle(
    runnerId: number,
    data: CreateTestSurfaceBundleRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestSurfaceBundleResponse>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles`
    );
    const response = await this.networkClient.post(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestSurfaceBundleResponse>(
      response.data,
      'createTestSurfaceBundle'
    );
  }

  async updateTestSurfaceBundle(
    runnerId: number,
    bundleId: number,
    data: UpdateTestSurfaceBundleRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestSurfaceBundleResponse>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}`
    );
    const response = await this.networkClient.put(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestSurfaceBundleResponse>(
      response.data,
      'updateTestSurfaceBundle'
    );
  }

  async deleteTestSurfaceBundle(
    runnerId: number,
    bundleId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestSurfaceBundleResponse>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}`
    );
    const response = await this.networkClient.delete(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestSurfaceBundleResponse>(
      response.data,
      'deleteTestSurfaceBundle'
    );
  }

  async addSurfaceToBundle(
    runnerId: number,
    bundleId: number,
    testSurfaceId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<unknown>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/surfaces`
    );
    const response = await this.networkClient.post(
      url,
      { testSurfaceId },
      {
        headers: createAuthHeaders(token),
      }
    );
    return validateResponse<unknown>(response.data, 'addSurfaceToBundle');
  }

  async addInteractionToBundle(
    runnerId: number,
    bundleId: number,
    testInteractionId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<unknown>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/interactions`
    );
    const response = await this.networkClient.post(
      url,
      { testInteractionId },
      {
        headers: createAuthHeaders(token),
      }
    );
    return validateResponse<unknown>(response.data, 'addInteractionToBundle');
  }

  async addScenarioToBundle(
    runnerId: number,
    bundleId: number,
    testScenarioId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<unknown>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/scenarios`
    );
    const response = await this.networkClient.post(
      url,
      { testScenarioId },
      {
        headers: createAuthHeaders(token),
      }
    );
    return validateResponse<unknown>(response.data, 'addScenarioToBundle');
  }

  async removeSurfaceFromBundle(
    runnerId: number,
    bundleId: number,
    surfaceId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<unknown>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/surfaces/${surfaceId}`
    );
    const response = await this.networkClient.delete(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<unknown>(response.data, 'removeSurfaceFromBundle');
  }

  async removeInteractionFromBundle(
    runnerId: number,
    bundleId: number,
    interactionId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<unknown>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/interactions/${interactionId}`
    );
    const response = await this.networkClient.delete(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<unknown>(
      response.data,
      'removeInteractionFromBundle'
    );
  }

  async removeScenarioFromBundle(
    runnerId: number,
    bundleId: number,
    scenarioId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<unknown>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surface-bundles/${bundleId}/scenarios/${scenarioId}`
    );
    const response = await this.networkClient.delete(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<unknown>(response.data, 'removeScenarioFromBundle');
  }

  async getRunnerSchedules(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScheduleResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-schedules`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScheduleResponse[]>(
      response.data,
      'getRunnerSchedules'
    );
  }

  async createTestSchedule(
    runnerId: number,
    data: CreateTestScheduleRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScheduleResponse>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-schedules`
    );
    const response = await this.networkClient.post(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScheduleResponse>(
      response.data,
      'createTestSchedule'
    );
  }

  // --- Page sub-resources ---

  async getPageStates(
    pageId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageStateResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/pages/${pageId}/states`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageStateResponse[]>(
      response.data,
      'getPageStates'
    );
  }

  async getPageStateItems(
    pageStateId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ActionableItemResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/pages/states/${pageStateId}/items`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ActionableItemResponse[]>(
      response.data,
      'getPageStateItems'
    );
  }

  async getPageStateScaffolds(
    pageStateId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageStateScaffoldResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/page-details/page-states/${pageStateId}/scaffolds`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageStateScaffoldResponse[]>(
      response.data,
      'getPageStateScaffolds'
    );
  }

  async getHtmlElement(
    id: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<HtmlElementResponse>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/page-details/html-elements/${id}`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<HtmlElementResponse>(
      response.data,
      'getHtmlElement'
    );
  }

  // --- Personas sub-resources ---

  async getPersonaUseCases(
    personaId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<UseCaseResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/personas/${personaId}/use-cases`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<UseCaseResponse[]>(
      response.data,
      'getPersonaUseCases'
    );
  }

  async getUseCaseInputValues(
    useCaseId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<InputValueResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/personas/use-cases/${useCaseId}/input-values`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<InputValueResponse[]>(
      response.data,
      'getUseCaseInputValues'
    );
  }

  // --- Test Surfaces ---

  async getRunnerTestSurfaces(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestSurfaceResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-surfaces`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestSurfaceResponse[]>(
      response.data,
      'getRunnerTestSurfaces'
    );
  }

  async getTestSurfaceTestInteractions(
    testSurfaceId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-surfaces/${testSurfaceId}/interactions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestInteractionResponse[]>(
      response.data,
      'getTestSurfaceTestInteractions'
    );
  }

  // --- Test Interaction Actions ---

  async getTestInteractionActions(
    testInteractionId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestActionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-interactions/${testInteractionId}/actions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestActionResponse[]>(
      response.data,
      'getTestInteractionActions'
    );
  }

  // --- Test Interaction Run Findings ---

  async getTestInteractionRunFindings(
    testInteractionRunId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunFindingResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-interaction-runs/${testInteractionRunId}/findings`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunFindingResponse[]>(
      response.data,
      'getTestInteractionRunFindings'
    );
  }

  async getTestInteractionRun(
    testInteractionRunId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestInteractionRunResponse | null>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-interaction-runs/${testInteractionRunId}`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestInteractionRunResponse | null>(
      response.data,
      'getTestInteractionRun'
    );
  }

  async getRunnerFindings(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunFindingResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runners/${runnerId}/findings`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunFindingResponse[]>(
      response.data,
      'getRunnerFindings'
    );
  }

  // --- Test Scenarios ---

  async getRunnerTestScenarios(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScenarioResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-scenarios`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScenarioResponse[]>(
      response.data,
      'getRunnerTestScenarios'
    );
  }

  async createTestScenario(
    runnerId: number,
    data: CreateTestScenarioRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScenarioResponse>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-scenarios`
    );
    const response = await this.networkClient.post(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScenarioResponse>(
      response.data,
      'createTestScenario'
    );
  }

  async updateTestScenario(
    runnerId: number,
    scenarioId: number,
    data: UpdateTestScenarioRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScenarioResponse>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-scenarios/${scenarioId}`
    );
    const response = await this.networkClient.put(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScenarioResponse>(
      response.data,
      'updateTestScenario'
    );
  }

  async deleteTestScenario(
    runnerId: number,
    scenarioId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScenarioResponse>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-scenarios/${scenarioId}`
    );
    const response = await this.networkClient.delete(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScenarioResponse>(
      response.data,
      'deleteTestScenario'
    );
  }

  // --- Test Scenario Sequences ---

  async getTestScenarioSequences(
    scenarioId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScenarioSequenceResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-scenarios/${scenarioId}/sequences`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScenarioSequenceResponse[]>(
      response.data,
      'getTestScenarioSequences'
    );
  }

  async getTestScenarioSequenceTestInteractions(
    sequenceId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScenarioSequenceTestInteractionLinkResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-scenarios/sequences/${sequenceId}/test-interactions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScenarioSequenceTestInteractionLinkResponse[]>(
      response.data,
      'getTestScenarioSequenceTestInteractions'
    );
  }

  // --- Test Scenario Sequence Runs ---

  async getTestScenarioSequenceRuns(
    sequenceId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestScenarioSequenceRunResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-scenarios/sequences/${sequenceId}/runs`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestScenarioSequenceRunResponse[]>(
      response.data,
      'getTestScenarioSequenceRuns'
    );
  }

  // --- Test Environments ---

  async getProductEnvironments(
    productId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestEnvironmentResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/products/${productId}/environments`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestEnvironmentResponse[]>(
      response.data,
      'getProductEnvironments'
    );
  }

  async getEnvironmentPages(
    envId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-environments/${envId}/pages`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageResponse[]>(
      response.data,
      'getEnvironmentPages'
    );
  }

  async getEnvironmentTestInteractions(
    envId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestInteractionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-environments/${envId}/test-interactions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestInteractionResponse[]>(
      response.data,
      'getEnvironmentTestInteractions'
    );
  }

  async getEnvironmentTestSurfaces(
    envId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestSurfaceResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-environments/${envId}/test-surfaces`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestSurfaceResponse[]>(
      response.data,
      'getEnvironmentTestSurfaces'
    );
  }

  // --- Test Interaction Runs ---

  async createTestInteractionRun(
    data: CreateTestInteractionRunRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestInteractionRunResponse>> {
    const url = buildUrl(this.baseUrl, '/api/v1/test-interaction-runs');
    const response = await this.networkClient.post(url, data, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestInteractionRunResponse>(
      response.data,
      'createTestInteractionRun'
    );
  }

  async clearSupersededFindings(
    testInteractionRunId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<null>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-interaction-runs/${testInteractionRunId}/superseded-findings`
    );
    const response = await this.networkClient.delete(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<null>(response.data, 'clearSupersededFindings');
  }
}
