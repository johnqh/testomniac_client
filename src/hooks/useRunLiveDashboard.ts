import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken, RunLiveDashboard } from '../types.js';
import { queryKeys } from './query-keys.js';
import { STALE_TIMES } from './query-config.js';

export const useRunLiveDashboard = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<RunLiveDashboard>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<RunLiveDashboard>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunLiveDashboard(token, runId),
    [client, token, runId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runLiveDashboard(runId),
    queryFn,
    staleTime: STALE_TIMES.DASHBOARD,
    enabled: !!token && !!runId,
    ...options,
  });
};
