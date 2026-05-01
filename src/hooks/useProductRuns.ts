import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseProductRunsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  productId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useProductRuns(config: UseProductRunsConfig) {
  const { networkClient, baseUrl, productId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.productRuns(productId),
    queryFn: () => client.getProductRuns(productId, token),
    enabled: enabled && !!productId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    runs: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
