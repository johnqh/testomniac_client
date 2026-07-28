import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken, NavigationGraphResponse } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useNavigationGraph = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runnerId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<NavigationGraphResponse>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<NavigationGraphResponse>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getNavigationGraph(token, runnerId),
    [client, token, runnerId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runnerNavigationGraph(runnerId),
    queryFn,
    staleTime: STALE_TIMES.PAGE,
    enabled: !!token && !!runnerId,
    ...options,
  });
};
