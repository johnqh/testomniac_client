import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestElementRunConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testElementRunId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestElementRun(config: UseTestElementRunConfig) {
  const {
    networkClient,
    baseUrl,
    testElementRunId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: [...QUERY_KEYS.testRunFindings(testElementRunId), 'detail'] as const,
    queryFn: () => client.getTestElementRun(testElementRunId, token),
    enabled: enabled && !!testElementRunId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testElementRun: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
