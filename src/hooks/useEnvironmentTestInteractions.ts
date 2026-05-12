import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseEnvironmentTestInteractionsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  envId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useEnvironmentTestInteractions(
  config: UseEnvironmentTestInteractionsConfig
) {
  const { networkClient, baseUrl, envId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.environmentTestInteractions(envId),
    queryFn: () => client.getEnvironmentTestInteractions(envId, token),
    enabled: enabled && !!envId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testInteractions: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
