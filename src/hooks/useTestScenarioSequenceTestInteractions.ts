import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestScenarioSequenceTestInteractionLinkResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useTestScenarioSequenceTestInteractions = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  testScenarioSequenceId: number,
  options?: Omit<
    UseQueryOptions<
      BaseResponse<TestScenarioSequenceTestInteractionLinkResponse[]>
    >,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<
  BaseResponse<TestScenarioSequenceTestInteractionLinkResponse[]>
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () =>
      client.getTestScenarioSequenceTestInteractions(
        token,
        testScenarioSequenceId
      ),
    [client, token, testScenarioSequenceId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.testScenarioSequenceTestInteractions(
      testScenarioSequenceId
    ),
    queryFn,
    staleTime: STALE_TIMES.SCENARIO,
    enabled: !!token && !!testScenarioSequenceId,
    ...options,
  });
};
