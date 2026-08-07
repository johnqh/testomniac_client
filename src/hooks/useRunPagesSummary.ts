import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken, RunPageSummary } from '../types.js';
import { queryKeys } from './query-keys.js';
import { STALE_TIMES } from './query-config.js';

export const useRunPagesSummary = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<RunPageSummary[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<RunPageSummary[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunPagesSummary(token, runId),
    [client, token, runId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runPagesSummary(runId),
    queryFn,
    staleTime: STALE_TIMES.RUN,
    enabled: !!token && !!runId,
    ...options,
  });
};
