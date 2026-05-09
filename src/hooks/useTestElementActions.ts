import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestElementActionsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testElementId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestElementActions(config: UseTestElementActionsConfig) {
  const {
    networkClient,
    baseUrl,
    testElementId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.testElementActions(testElementId),
    queryFn: () => client.getTestElementActions(testElementId, token),
    enabled: enabled && !!testElementId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    actions: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
