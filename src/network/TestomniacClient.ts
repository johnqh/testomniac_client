import type { NetworkClient } from '@sudobility/types';
import type {
  ActionableItemResponse,
  ActionDefinitionResponse,
  ActionExecutionResponse,
  ActionResponse,
  AppResponse,
  BaseResponse,
  CreateScanRequest,
  CreateScanResponse,
  HtmlElementResponse,
  InputValueResponse,
  IssueResponse,
  PageResponse,
  PageStateResponse,
  PageStateReusableElementResponse,
  PersonaResponse,
  ProjectSummaryResponse,
  ReusableHtmlElementResponse,
  RunDetailResponse,
  ScanDetailResponse,
  TestCaseResponse,
  TestRunResponse,
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

  // --- Scan ---

  async submitScan(
    data: CreateScanRequest
  ): Promise<BaseResponse<CreateScanResponse>> {
    const url = buildUrl(this.baseUrl, '/api/v1/scan');
    const response = await this.networkClient.post(url, { body: data });
    return validateResponse<CreateScanResponse>(response.data, 'submitScan');
  }

  async submitScanAuthenticated(
    data: CreateScanRequest,
    token: FirebaseIdToken
  ): Promise<BaseResponse<CreateScanResponse>> {
    const url = buildUrl(this.baseUrl, '/api/v1/scan');
    const response = await this.networkClient.post(url, {
      headers: createAuthHeaders(token),
      body: data,
    });
    return validateResponse<CreateScanResponse>(
      response.data,
      'submitScanAuthenticated'
    );
  }

  // --- Projects ---

  async getEntityProjects(
    entitySlug: string,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ProjectSummaryResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/entities/${entitySlug}/projects`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ProjectSummaryResponse[]>(
      response.data,
      'getEntityProjects'
    );
  }

  async getProject(
    projectId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<AppResponse>> {
    const url = buildUrl(this.baseUrl, `/api/v1/projects/${projectId}`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<AppResponse>(response.data, 'getProject');
  }

  // --- Runs ---

  async getProjectRuns(
    projectId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunDetailResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/projects/${projectId}/runs`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunDetailResponse[]>(
      response.data,
      'getProjectRuns'
    );
  }

  async getRun(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<RunDetailResponse>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<RunDetailResponse>(response.data, 'getRun');
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

  async getRunActions(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ActionResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/actions`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ActionResponse[]>(response.data, 'getRunActions');
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

  async getRunTestRuns(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/test-runs`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunResponse[]>(response.data, 'getRunTestRuns');
  }

  async getRunIssues(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<IssueResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/issues`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<IssueResponse[]>(response.data, 'getRunIssues');
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

  async getRunComponents(
    runId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<unknown[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/runs/${runId}/components`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<unknown[]>(response.data, 'getRunComponents');
  }

  // --- Apps ---

  async getProjectApps(
    projectId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<AppResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/projects/${projectId}/apps`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<AppResponse[]>(response.data, 'getProjectApps');
  }

  async getApp(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<AppResponse>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<AppResponse>(response.data, 'getApp');
  }

  // --- App sub-resources ---

  async getAppPages(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/pages`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageResponse[]>(response.data, 'getAppPages');
  }

  async getAppPageStates(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageStateResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/page-states`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageStateResponse[]>(
      response.data,
      'getAppPageStates'
    );
  }

  async getAppActions(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ActionDefinitionResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/actions`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ActionDefinitionResponse[]>(
      response.data,
      'getAppActions'
    );
  }

  async getAppActionExecutions(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ActionExecutionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/apps/${appId}/action-executions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ActionExecutionResponse[]>(
      response.data,
      'getAppActionExecutions'
    );
  }

  async getAppScans(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ScanDetailResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/scans`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ScanDetailResponse[]>(response.data, 'getAppScans');
  }

  async getAppTestCases(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestCaseResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/test-cases`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestCaseResponse[]>(
      response.data,
      'getAppTestCases'
    );
  }

  async getAppTestRuns(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<TestRunResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/test-runs`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<TestRunResponse[]>(response.data, 'getAppTestRuns');
  }

  async getAppIssues(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<IssueResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/issues`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<IssueResponse[]>(response.data, 'getAppIssues');
  }

  async getAppComponents(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ReusableHtmlElementResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/components`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ReusableHtmlElementResponse[]>(
      response.data,
      'getAppComponents'
    );
  }

  async getAppPersonas(
    appId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PersonaResponse[]>> {
    const url = buildUrl(this.baseUrl, `/api/v1/apps/${appId}/personas`);
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PersonaResponse[]>(response.data, 'getAppPersonas');
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

  // --- Page detail sub-resources ---

  async getPageActions(
    pageId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<ActionDefinitionResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/page-details/${pageId}/actions`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<ActionDefinitionResponse[]>(
      response.data,
      'getPageActions'
    );
  }

  async getPageStateReusableElements(
    pageStateId: number,
    token: FirebaseIdToken
  ): Promise<BaseResponse<PageStateReusableElementResponse[]>> {
    const url = buildUrl(
      this.baseUrl,
      `/api/v1/page-details/page-states/${pageStateId}/reusable-elements`
    );
    const response = await this.networkClient.get(url, {
      headers: createAuthHeaders(token),
    });
    return validateResponse<PageStateReusableElementResponse[]>(
      response.data,
      'getPageStateReusableElements'
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
}
