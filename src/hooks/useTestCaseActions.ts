import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestCaseActionsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testCaseId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestCaseActions(config: UseTestCaseActionsConfig) {
  const { networkClient, baseUrl, testCaseId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.testCaseActions(testCaseId),
    queryFn: () => client.getTestCaseActions(testCaseId, token),
    enabled: enabled && !!testCaseId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    actions: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
