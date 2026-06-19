import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestScenarioResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useRunnerTestScenarios = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runnerId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestScenarioResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestScenarioResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunnerTestScenarios(token, runnerId),
    [client, token, runnerId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runnerTestScenarios(runnerId),
    queryFn,
    staleTime: STALE_TIMES.SCENARIO,
    enabled: !!token && !!runnerId,
    ...options,
  });
};
