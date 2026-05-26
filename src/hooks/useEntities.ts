import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseEntitiesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useEntities(config: UseEntitiesConfig) {
  const { networkClient, baseUrl, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.entities(),
    queryFn: () => client.getEntities(token),
    enabled: enabled && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    entities: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
