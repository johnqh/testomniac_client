import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UsePageStateItemsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  pageStateId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function usePageStateItems(config: UsePageStateItemsConfig) {
  const { networkClient, baseUrl, pageStateId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.pageStateItems(pageStateId),
    queryFn: () => client.getPageStateItems(pageStateId, token),
    enabled: enabled && !!pageStateId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    items: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
