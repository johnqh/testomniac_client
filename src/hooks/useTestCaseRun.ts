import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestCaseRunConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testCaseRunId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestCaseRun(config: UseTestCaseRunConfig) {
  const {
    networkClient,
    baseUrl,
    testCaseRunId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: [...QUERY_KEYS.testRunFindings(testCaseRunId), 'detail'] as const,
    queryFn: () => client.getTestCaseRun(testCaseRunId, token),
    enabled: enabled && !!testCaseRunId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testCaseRun: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
