import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseRunTestRunsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useRunTestRuns(config: UseRunTestRunsConfig) {
  const { networkClient, baseUrl, runId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.runTestRuns(runId),
    queryFn: () => client.getTestRunChildRuns(runId, token),
    enabled: enabled && !!runId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testRuns: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
