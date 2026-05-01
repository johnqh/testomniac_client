import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseRunnerTestCasesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useRunnerTestCases(config: UseRunnerTestCasesConfig) {
  const { networkClient, baseUrl, runnerId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.runnerTestCases(runnerId),
    queryFn: () => client.getRunnerTestCases(runnerId, token),
    enabled: enabled && !!runnerId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testCases: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
