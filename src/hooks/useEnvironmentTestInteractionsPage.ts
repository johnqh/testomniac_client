import { useCallback, useMemo } from 'react';
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestInteractionResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

interface EnvironmentTestInteractionsPageData {
  items: TestInteractionResponse[];
  total: number;
  limit: number;
  offset: number;
}

interface EnvironmentTestInteractionsPageParams {
  limit: number;
  offset: number;
  testType?: string;
  priority?: number;
  sizeClass?: string;
  search?: string;
}

/**
 * Paginated + server-filtered test interactions for the list view. Unlike
 * `useEnvironmentTestInteractions` (which loads the full set for detail lookups
 * and dropdowns), this fetches a single page so the list stays fast for
 * environments with tens of thousands of interactions.
 */
export const useEnvironmentTestInteractionsPage = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  envId: number,
  params: EnvironmentTestInteractionsPageParams,
  options?: Omit<
    UseQueryOptions<BaseResponse<EnvironmentTestInteractionsPageData>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<EnvironmentTestInteractionsPageData>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getEnvironmentTestInteractionsPage(token, envId, params),
    [
      client,
      token,
      envId,
      params.limit,
      params.offset,
      params.testType,
      params.priority,
      params.sizeClass,
      params.search,
    ]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.environmentTestInteractionsPage(
      envId,
      params
    ),
    queryFn,
    staleTime: STALE_TIMES.INTERACTION,
    enabled: !!token && !!envId,
    placeholderData: keepPreviousData,
    ...options,
  });
};
