import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  PageStateResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const usePageStates = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  pageId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<PageStateResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<PageStateResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getPageStates(token, pageId),
    [client, token, pageId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.pageStates(pageId),
    queryFn,
    staleTime: STALE_TIMES.PAGE,
    enabled: !!token && !!pageId,
    ...options,
  });
};
