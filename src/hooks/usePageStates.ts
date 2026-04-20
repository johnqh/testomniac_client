import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UsePageStatesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  pageId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function usePageStates(config: UsePageStatesConfig) {
  const { networkClient, baseUrl, pageId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.pageStates(pageId),
    queryFn: () => client.getPageStates(pageId, token),
    enabled: enabled && !!pageId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    pageStates: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
