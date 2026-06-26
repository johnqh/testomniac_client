import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockNetworkClient } from '@sudobility/di/mocks';
import { createTestomniacClient, TestomniacClient } from './TestomniacClient';

const TEST_TOKEN = 'test-token-123';
const BASE_URL = 'https://test-testomniac.example.com';

describe('TestomniacClient', () => {
  let client: TestomniacClient;
  let mockNetworkClient: MockNetworkClient;

  beforeEach(() => {
    mockNetworkClient = new MockNetworkClient();
    client = new TestomniacClient(mockNetworkClient, BASE_URL);
  });

  afterEach(() => {
    mockNetworkClient.reset();
  });

  describe('initialization', () => {
    it('creates an instance with positional args', () => {
      expect(client).toBeInstanceOf(TestomniacClient);
    });

    it('strips a trailing slash from the base URL', async () => {
      const trailing = new TestomniacClient(mockNetworkClient, `${BASE_URL}/`);
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/entities`,
        { data: { success: true, data: [] } },
        'GET'
      );
      await trailing.getEntities(TEST_TOKEN);
      expect(
        mockNetworkClient.wasUrlCalled(`${BASE_URL}/api/v1/entities`, 'GET')
      ).toBe(true);
    });
  });

  describe('GET requests', () => {
    it('sends a bearer token and returns response.data', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, slug: 'acme' }],
      };
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/entities`,
        { data: mockResponse },
        'GET'
      );

      const result = await client.getEntities(TEST_TOKEN);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      const last = mockNetworkClient.getLastRequest();
      expect(last?.options?.headers?.['Authorization']).toBe(
        `Bearer ${TEST_TOKEN}`
      );
    });

    it('builds nested resource paths with token first', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/pages/states/42/items`,
        { data: { success: true, data: [] } },
        'GET'
      );

      await client.getPageStateItems(TEST_TOKEN, 42);

      expect(
        mockNetworkClient.wasUrlCalled(
          `${BASE_URL}/api/v1/pages/states/42/items`,
          'GET'
        )
      ).toBe(true);
    });

    it('passes the productId query param for product personas', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/personas?productId=7`,
        { data: { success: true, data: [] } },
        'GET'
      );

      await client.getProductPersonas(TEST_TOKEN, 7);

      expect(
        mockNetworkClient.wasUrlCalled(
          `${BASE_URL}/api/v1/personas?productId=7`,
          'GET'
        )
      ).toBe(true);
    });

    it('loads run finding summaries from the grouped endpoint', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/runs/42/findings/summary`,
        { data: { success: true, data: [] } },
        'GET'
      );

      await client.getRunFindingSummary(TEST_TOKEN, 42);

      expect(
        mockNetworkClient.wasUrlCalled(
          `${BASE_URL}/api/v1/runs/42/findings/summary`,
          'GET'
        )
      ).toBe(true);
    });

    it('loads effective environment scan settings', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/products/7/environments/11/effective-scan-settings`,
        { data: { success: true, data: { expertiseSlugs: [] } } },
        'GET'
      );

      await client.getEffectiveEnvironmentScanSettings(TEST_TOKEN, 7, 11);

      expect(
        mockNetworkClient.wasUrlCalled(
          `${BASE_URL}/api/v1/products/7/environments/11/effective-scan-settings`,
          'GET'
        )
      ).toBe(true);
    });
  });

  describe('mutations', () => {
    it('POSTs a JSON body for createProduct', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/products`,
        { data: { success: true, data: { id: 99 } } },
        'POST'
      );

      const result = await client.createProduct(TEST_TOKEN, {
        title: 'My Product',
      } as never);

      expect(result.success).toBe(true);
      const last = mockNetworkClient.getLastRequest();
      expect(last?.method).toBe('POST');
      expect(last?.options?.body).toBe(JSON.stringify({ title: 'My Product' }));
    });

    it('wraps user-data under { data } on update (PUT)', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/test-environments/5/user-data`,
        { data: { success: true, data: { data: {} } } },
        'PUT'
      );

      await client.updateEnvironmentUserData(TEST_TOKEN, 5, {
        foo: 'bar',
      } as never);

      const last = mockNetworkClient.getLastRequest();
      expect(last?.method).toBe('PUT');
      expect(last?.options?.body).toBe(
        JSON.stringify({ data: { foo: 'bar' } })
      );
    });

    it('PUTs product scan settings as a plain JSON body', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/products/7/scan-settings`,
        { data: { success: true, data: { productId: 7 } } },
        'PUT'
      );

      await client.updateProductScanSettings(TEST_TOKEN, 7, {
        expertiseSlugs: ['tester', 'seo'],
      });

      const last = mockNetworkClient.getLastRequest();
      expect(last?.method).toBe('PUT');
      expect(last?.options?.body).toBe(
        JSON.stringify({ expertiseSlugs: ['tester', 'seo'] })
      );
    });

    it('sends a DELETE with no body', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/personas/3`,
        { data: { success: true, data: { id: 3 } } },
        'DELETE'
      );

      await client.deletePersona(TEST_TOKEN, 3);

      const last = mockNetworkClient.getLastRequest();
      expect(last?.method).toBe('DELETE');
      expect(last?.options?.body).toBeUndefined();
    });
  });

  describe('unauthenticated endpoint', () => {
    it('omits the Authorization header for submitDiscoveryRun', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/scan`,
        { data: { success: true, data: { status: 'pending', testRunId: 1 } } },
        'POST'
      );

      await client.submitDiscoveryRun({ url: 'https://x.test' } as never);

      const last = mockNetworkClient.getLastRequest();
      expect(last?.options?.headers?.['Authorization']).toBeUndefined();
    });
  });

  describe('object scripts', () => {
    it('returns the raw script string', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/test-interactions/12/script`,
        { data: { script: 'await page.click()' } },
        'GET'
      );

      const script = await client.getObjectScript(
        TEST_TOKEN,
        'interaction',
        12
      );

      expect(script).toBe('await page.click()');
    });
  });

  describe('no data handling', () => {
    it('throws when the server returns no data', async () => {
      mockNetworkClient.setMockResponse(
        `${BASE_URL}/api/v1/entities`,
        { data: undefined },
        'GET'
      );

      await expect(client.getEntities(TEST_TOKEN)).rejects.toThrow(
        'No data received from server'
      );
    });
  });
});

describe('createTestomniacClient', () => {
  it('creates a TestomniacClient instance', () => {
    const mockNetworkClient = new MockNetworkClient();
    const client = createTestomniacClient(mockNetworkClient, BASE_URL);
    expect(client).toBeInstanceOf(TestomniacClient);
  });
});
