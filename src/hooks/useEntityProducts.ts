import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  ProductSummaryResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useEntityProducts = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  entitySlug: string,
  options?: Omit<
    UseQueryOptions<BaseResponse<ProductSummaryResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<ProductSummaryResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getEntityProducts(token, entitySlug),
    [client, token, entitySlug]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.entityProducts(entitySlug),
    queryFn,
    staleTime: STALE_TIMES.PRODUCT,
    enabled: !!token && !!entitySlug,
    ...options,
  });
};
