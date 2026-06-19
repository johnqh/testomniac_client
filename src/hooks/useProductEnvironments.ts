import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestEnvironmentResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useProductEnvironments = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  productId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestEnvironmentResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestEnvironmentResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getProductEnvironments(token, productId),
    [client, token, productId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.productEnvironments(productId),
    queryFn,
    staleTime: STALE_TIMES.ENVIRONMENT,
    enabled: !!token && !!productId,
    ...options,
  });
};
