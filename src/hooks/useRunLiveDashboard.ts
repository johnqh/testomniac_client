import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseRunLiveDashboardConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useRunLiveDashboard(config: UseRunLiveDashboardConfig) {
  const {
    networkClient,
    baseUrl,
    runId,
    token,
    enabled = true,
    refetchInterval = false,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.runLiveDashboard(runId),
    queryFn: () => client.getRunLiveDashboard(runId, token),
    enabled: enabled && !!runId && !!token,
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval,
  });

  return {
    dashboard: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
