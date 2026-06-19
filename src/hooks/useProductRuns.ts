import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestRunResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useProductRuns = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  productId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestRunResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestRunResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getProductRuns(token, productId),
    [client, token, productId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.productRuns(productId),
    queryFn,
    staleTime: STALE_TIMES.RUN,
    enabled: !!token && !!productId,
    ...options,
  });
};
