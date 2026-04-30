import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestSuiteTestCasesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testSuiteId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestSuiteTestCases(config: UseTestSuiteTestCasesConfig) {
  const { networkClient, baseUrl, testSuiteId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.testSuiteTestCases(testSuiteId),
    queryFn: () => client.getTestSuiteTestCases(testSuiteId, token),
    enabled: enabled && !!testSuiteId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testCases: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
