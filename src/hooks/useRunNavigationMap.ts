import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseRunNavigationMapConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useRunNavigationMap(config: UseRunNavigationMapConfig) {
  const { networkClient, baseUrl, runId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.runNavigationMap(runId),
    queryFn: () => client.getRunNavigationMap(runId, token),
    enabled: enabled && !!runId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    navigationMap: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
