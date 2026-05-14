import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseEntityCredentialsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  entitySlug: string;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useEntityCredentials(config: UseEntityCredentialsConfig) {
  const { networkClient, baseUrl, entitySlug, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.entityCredentials(entitySlug),
    queryFn: () => client.getEntityCredentials(entitySlug, token),
    enabled: enabled && !!entitySlug && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    credentials: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
