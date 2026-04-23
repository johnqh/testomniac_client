import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseProjectAppsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  projectId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useProjectApps(config: UseProjectAppsConfig) {
  const { networkClient, baseUrl, projectId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.projectApps(projectId),
    queryFn: () => client.getProjectApps(projectId, token),
    enabled: enabled && !!projectId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    apps: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
