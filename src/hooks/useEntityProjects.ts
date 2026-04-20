import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseEntityProjectsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  entitySlug: string;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useEntityProjects(config: UseEntityProjectsConfig) {
  const { networkClient, baseUrl, entitySlug, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.entityProjects(entitySlug),
    queryFn: () => client.getEntityProjects(entitySlug, token),
    enabled: enabled && !!entitySlug && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    projects: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
