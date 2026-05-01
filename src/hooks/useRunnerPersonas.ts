import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseRunnerPersonasConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useRunnerPersonas(config: UseRunnerPersonasConfig) {
  const { networkClient, baseUrl, runnerId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.runnerPersonas(runnerId),
    queryFn: () => client.getRunnerPersonas(runnerId, token),
    enabled: enabled && !!runnerId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    personas: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
