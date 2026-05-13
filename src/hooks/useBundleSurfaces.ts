import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseBundleSurfacesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  bundleId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useBundleSurfaces(config: UseBundleSurfacesConfig) {
  const {
    networkClient,
    baseUrl,
    runnerId,
    bundleId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.bundleSurfaces(bundleId),
    queryFn: () => client.getBundleSurfaces(runnerId, bundleId, token),
    enabled: enabled && !!runnerId && !!bundleId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    surfaces: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
