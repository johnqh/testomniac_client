import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseRunnerPagesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useRunnerPages(config: UseRunnerPagesConfig) {
  const { networkClient, baseUrl, runnerId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.runnerPages(runnerId),
    queryFn: () => client.getRunnerPages(runnerId, token),
    enabled: enabled && !!runnerId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    pages: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
