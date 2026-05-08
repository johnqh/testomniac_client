import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestScenarioSequenceTestCasesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testScenarioSequenceId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestScenarioSequenceTestCases(
  config: UseTestScenarioSequenceTestCasesConfig
) {
  const {
    networkClient,
    baseUrl,
    testScenarioSequenceId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.testScenarioSequenceTestCases(testScenarioSequenceId),
    queryFn: () =>
      client.getTestScenarioSequenceTestCases(testScenarioSequenceId, token),
    enabled: enabled && !!testScenarioSequenceId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testCaseLinks: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
