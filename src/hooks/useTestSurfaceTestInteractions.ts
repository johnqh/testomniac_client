import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestSurfaceTestInteractionsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testSurfaceId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestSurfaceTestInteractions(
  config: UseTestSurfaceTestInteractionsConfig
) {
  const {
    networkClient,
    baseUrl,
    testSurfaceId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.testSurfaceTestInteractions(testSurfaceId),
    queryFn: () => client.getTestSurfaceTestInteractions(testSurfaceId, token),
    enabled: enabled && !!testSurfaceId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testInteractions: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
