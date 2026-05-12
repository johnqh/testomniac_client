import { describe, expect, it, vi } from 'vitest';
import { TestomniacClient } from './TestomniacClient';

function createNetworkClient() {
  return {
    get: vi.fn().mockResolvedValue({ data: { success: true, data: [] } }),
    post: vi.fn().mockResolvedValue({ data: { success: true, data: null } }),
    put: vi.fn().mockResolvedValue({ data: { success: true, data: null } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true, data: null } }),
  };
}

describe('TestomniacClient endpoint paths', () => {
  it('calls the mounted pages route for page state items', async () => {
    const networkClient = createNetworkClient();
    const client = new TestomniacClient({
      baseUrl: 'https://api.example.com',
      networkClient: networkClient as never,
    });

    await client.getPageStateItems(42, 'token');

    expect(networkClient.get).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/pages/states/42/items',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
        }),
      })
    );
  });

  it('calls the mounted personas route for use case input values', async () => {
    const networkClient = createNetworkClient();
    const client = new TestomniacClient({
      baseUrl: 'https://api.example.com',
      networkClient: networkClient as never,
    });

    await client.getUseCaseInputValues(17, 'token');

    expect(networkClient.get).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/personas/use-cases/17/input-values',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
        }),
      })
    );
  });
});
