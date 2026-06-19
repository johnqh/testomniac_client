import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  PageStatePatternResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useRunPatterns = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<PageStatePatternResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<PageStatePatternResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunPatterns(token, runId),
    [client, token, runId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runPatterns(runId),
    queryFn,
    staleTime: STALE_TIMES.PAGE,
    enabled: !!token && !!runId,
    ...options,
  });
};
