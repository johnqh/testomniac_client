import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  RunnerResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken } from '../types.js';
import { queryKeys } from './query-keys.js';
import { STALE_TIMES } from './query-config.js';

export const useProductRunners = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  productId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<RunnerResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<RunnerResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getProductRunners(token, productId),
    [client, token, productId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.productRunners(productId),
    queryFn,
    staleTime: STALE_TIMES.RUNNER,
    enabled: !!token && !!productId,
    ...options,
  });
};
