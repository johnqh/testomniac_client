import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestScenarioSequencesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testScenarioId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestScenarioSequences(
  config: UseTestScenarioSequencesConfig
) {
  const {
    networkClient,
    baseUrl,
    testScenarioId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.testScenarioSequences(testScenarioId),
    queryFn: () => client.getTestScenarioSequences(testScenarioId, token),
    enabled: enabled && !!testScenarioId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    sequences: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
