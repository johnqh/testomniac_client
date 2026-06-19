import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestRunFindingResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useRunnerFindings = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runnerId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestRunFindingResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestRunFindingResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunnerFindings(token, runnerId),
    [client, token, runnerId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runnerFindings(runnerId),
    queryFn,
    staleTime: STALE_TIMES.FINDING,
    enabled: !!token && !!runnerId,
    ...options,
  });
};
