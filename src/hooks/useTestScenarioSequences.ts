import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestScenarioSequenceResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useTestScenarioSequences = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  testScenarioId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestScenarioSequenceResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestScenarioSequenceResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getTestScenarioSequences(token, testScenarioId),
    [client, token, testScenarioId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.testScenarioSequences(testScenarioId),
    queryFn,
    staleTime: STALE_TIMES.SCENARIO,
    enabled: !!token && !!testScenarioId,
    ...options,
  });
};
