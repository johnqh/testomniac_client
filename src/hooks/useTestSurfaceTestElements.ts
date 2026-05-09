import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestSurfaceTestElementsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testSurfaceId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestSurfaceTestElements(
  config: UseTestSurfaceTestElementsConfig
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
    queryKey: QUERY_KEYS.testSurfaceTestElements(testSurfaceId),
    queryFn: () => client.getTestSurfaceTestElements(testSurfaceId, token),
    enabled: enabled && !!testSurfaceId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testElements: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
