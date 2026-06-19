import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken, RunPageDetailSummary } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useRunPageSummary = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runId: number,
  pageId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<RunPageDetailSummary>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<RunPageDetailSummary>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunPageSummary(token, runId, pageId),
    [client, token, runId, pageId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runPageSummary(runId, pageId),
    queryFn,
    staleTime: STALE_TIMES.RUN,
    enabled: !!token && !!runId && !!pageId,
    ...options,
  });
};
