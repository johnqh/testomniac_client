import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken, RunNavigationMap } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useRunNavigationMap = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<RunNavigationMap>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<RunNavigationMap>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunNavigationMap(token, runId),
    [client, token, runId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runNavigationMap(runId),
    queryFn,
    staleTime: STALE_TIMES.RUN,
    enabled: !!token && !!runId,
    ...options,
  });
};
