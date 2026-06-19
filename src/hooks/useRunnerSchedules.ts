import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestScheduleResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useRunnerSchedules = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runnerId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestScheduleResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestScheduleResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunnerSchedules(token, runnerId),
    [client, token, runnerId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runnerSchedules(runnerId),
    queryFn,
    staleTime: STALE_TIMES.SCHEDULE,
    enabled: !!token && !!runnerId,
    ...options,
  });
};
