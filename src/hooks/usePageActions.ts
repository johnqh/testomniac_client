import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UsePageActionsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  pageId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function usePageActions(config: UsePageActionsConfig) {
  const { networkClient, baseUrl, pageId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.pageActions(pageId),
    queryFn: () => client.getPageActions(pageId, token),
    enabled: enabled && !!pageId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    actions: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
