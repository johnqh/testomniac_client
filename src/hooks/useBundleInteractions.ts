import { useCallback, useMemo } from 'react';
import {
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

export const useBundleInteractions = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runnerId: number,
  bundleId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestInteractionResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestInteractionResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getBundleInteractions(token, runnerId, bundleId),
    [client, token, runnerId, bundleId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.bundleInteractions(bundleId),
    queryFn,
    staleTime: STALE_TIMES.INTERACTION,
    enabled: !!token && !!runnerId && !!bundleId,
    ...options,
  });
};
