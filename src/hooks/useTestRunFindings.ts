import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestRunFindingsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testRunId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestRunFindings(config: UseTestRunFindingsConfig) {
  const { networkClient, baseUrl, testRunId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.testRunFindings(testRunId),
    queryFn: () => client.getTestRunFindings(testRunId, token),
    enabled: enabled && !!testRunId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    findings: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
