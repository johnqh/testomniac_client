import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseAppTestSuitesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  appId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useAppTestSuites(config: UseAppTestSuitesConfig) {
  const { networkClient, baseUrl, appId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.appTestSuites(appId),
    queryFn: () => client.getAppTestSuites(appId, token),
    enabled: enabled && !!appId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    testSuites: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
