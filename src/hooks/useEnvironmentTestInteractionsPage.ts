import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseEnvironmentTestInteractionsPageConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  envId: number;
  token: FirebaseIdToken;
  limit: number;
  offset: number;
  testType?: string;
  priority?: number;
  sizeClass?: string;
  search?: string;
  enabled?: boolean;
}

/**
 * Paginated + server-filtered test interactions for the list view. Unlike
 * `useEnvironmentTestInteractions` (which loads the full set for detail lookups
 * and dropdowns), this fetches a single page so the list stays fast for
 * environments with tens of thousands of interactions.
 */
export function useEnvironmentTestInteractionsPage(
  config: UseEnvironmentTestInteractionsPageConfig
) {
  const {
    networkClient,
    baseUrl,
    envId,
    token,
    limit,
    offset,
    testType,
    priority,
    sizeClass,
    search,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });
  const params = { limit, offset, testType, priority, sizeClass, search };

  const query = useQuery({
    queryKey: QUERY_KEYS.environmentTestInteractionsPage(envId, params),
    queryFn: () =>
      client.getEnvironmentTestInteractionsPage(envId, params, token),
    enabled: enabled && !!envId && !!token,
    staleTime: DEFAULT_STALE_TIME,
    // Keep the previous page visible while the next page loads (no flash of empty).
    placeholderData: keepPreviousData,
  });

  return {
    testInteractions: query.data?.data?.items ?? [],
    total: query.data?.data?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
