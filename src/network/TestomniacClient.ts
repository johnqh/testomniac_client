import type { NetworkClient } from '@sudobility/types';
import type {
  ActionableItemResponse,
  BaseResponse,
  CreateDiscoveryRunRequest,
  CreateDiscoveryRunResponse,
  CreateProductRequest,
  CreateRunnerRequest,
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
  TestCaseResponse,
  TestRunFindingResponse,
  TestRunResponse,
  TestSuiteResponse,
  UseCaseResponse,
  User,
} from '@sudobility/testomniac_types';
import type { FirebaseIdToken } from '../types';
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
    const response = await this.networkClient.post(url, { body: data });
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
    const response = await this.networkClient.post(url, {
      headers: createAuthHeaders(token),
      body: data,
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
    const response = await this.networkClient.post(url, {
      headers: createAuthHeaders(token),
      body: data,
    });
    return validateResponse<ProductResponse>(response.data, 'createProduct');
  }

  async createRunner(
    productId: number,
    data: CreateRunnerRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunnerResponse>> {
    const url = buildUrl(this.baseUrl, `/api/v1/products/${productId}/runners`);
    const response = await this.networkClient.post(url, {
      headers: createAuthHeaders(token),
      body: data,
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

  async getRunTestCases(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestCaseResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/test-cases`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestCaseResponse[]>(
      response.data,
      'getRunTestCases'
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

  async getRunnerTestCases(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestCaseResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-cases`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestCaseResponse[]>(
      response.data,
      'getRunnerTestCases'
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
      `/api/v1/page-states/${pageStateId}/items`
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
      `/api/v1/use-cases/${useCaseId}/input-values`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<InputValueResponse[]>(
      response.data,
      'getUseCaseInputValues'
    );
  }

  // --- Test Suites ---

  async getRunnerTestSuites(
    runnerId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestSuiteResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/runners/${runnerId}/test-suites`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestSuiteResponse[]>(
      response.data,
      'getRunnerTestSuites'
    );
  }

  async getTestSuiteTestCases(
    testSuiteId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestCaseResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-suites/${testSuiteId}/cases`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestCaseResponse[]>(
      response.data,
      'getTestSuiteTestCases'
    );
  }

  // --- Test Case Actions ---

  async getTestCaseActions(
    testCaseId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestActionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-cases/${testCaseId}/actions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestActionResponse[]>(
      response.data,
      'getTestCaseActions'
    );
  }

  // --- Test Case Run Findings ---

  async getTestCaseRunFindings(
    testCaseRunId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunFindingResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/test-case-runs/${testCaseRunId}/findings`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunFindingResponse[]>(
      response.data,
      'getTestCaseRunFindings'
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
}
