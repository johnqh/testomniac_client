import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseProjectConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  projectId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useProject(config: UseProjectConfig) {
  const { networkClient, baseUrl, projectId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.project(projectId),
    queryFn: () => client.getProject(projectId, token),
    enabled: enabled && !!projectId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    project: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
