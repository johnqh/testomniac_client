import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestScenarioSequenceRunResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useTestScenarioSequenceRuns = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  testScenarioSequenceId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestScenarioSequenceRunResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestScenarioSequenceRunResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getTestScenarioSequenceRuns(token, testScenarioSequenceId),
    [client, token, testScenarioSequenceId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.testScenarioSequenceRuns(
      testScenarioSequenceId
    ),
    queryFn,
    staleTime: STALE_TIMES.SCENARIO,
    enabled: !!token && !!testScenarioSequenceId,
    ...options,
  });
};
