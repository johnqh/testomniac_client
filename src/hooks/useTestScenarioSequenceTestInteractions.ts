import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestScenarioSequenceTestInteractionsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testScenarioSequenceId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestScenarioSequenceTestInteractions(
  config: UseTestScenarioSequenceTestInteractionsConfig
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
    queryKey: QUERY_KEYS.testScenarioSequenceTestInteractions(
      testScenarioSequenceId
    ),
    queryFn: () =>
      client.getTestScenarioSequenceTestInteractions(
        testScenarioSequenceId,
        token
      ),
    enabled: enabled && !!testScenarioSequenceId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testInteractionLinks: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
