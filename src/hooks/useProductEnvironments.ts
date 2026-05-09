import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseProductEnvironmentsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  productId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useProductEnvironments(config: UseProductEnvironmentsConfig) {
  const { networkClient, baseUrl, productId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.productEnvironments(productId),
    queryFn: () => client.getProductEnvironments(productId, token),
    enabled: enabled && !!productId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    environments: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
