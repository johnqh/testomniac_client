import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse, User } from '@sudobility/testomniac_types';
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
}
