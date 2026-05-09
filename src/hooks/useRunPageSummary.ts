import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseRunPageSummaryConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runId: number;
  pageId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useRunPageSummary(config: UseRunPageSummaryConfig) {
  const {
    networkClient,
    baseUrl,
    runId,
    pageId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.runPageSummary(runId, pageId),
    queryFn: () => client.getRunPageSummary(runId, pageId, token),
    enabled: enabled && !!runId && !!pageId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    summary: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
