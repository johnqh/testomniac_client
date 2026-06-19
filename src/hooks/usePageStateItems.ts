import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  ActionableItemResponse,
  BaseResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const usePageStateItems = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  pageStateId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<ActionableItemResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<ActionableItemResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getPageStateItems(token, pageStateId),
    [client, token, pageStateId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.pageStateItems(pageStateId),
    queryFn,
    staleTime: STALE_TIMES.PAGE,
    enabled: !!token && !!pageStateId,
    ...options,
  });
};
