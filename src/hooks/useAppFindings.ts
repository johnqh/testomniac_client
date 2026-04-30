import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseAppFindingsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  appId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useAppFindings(config: UseAppFindingsConfig) {
  const { networkClient, baseUrl, appId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.appFindings(appId),
    queryFn: () => client.getAppFindings(appId, token),
    enabled: enabled && !!appId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    findings: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
