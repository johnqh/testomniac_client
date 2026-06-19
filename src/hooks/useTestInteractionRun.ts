import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestInteractionRunResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useTestInteractionRun = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  testInteractionRunId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestInteractionRunResponse | null>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestInteractionRunResponse | null>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getTestInteractionRun(token, testInteractionRunId),
    [client, token, testInteractionRunId]
  );

  return useQuery({
    queryKey: [
      ...queryKeys.testomniac.testRunFindings(testInteractionRunId),
      'detail',
    ] as const,
    queryFn,
    staleTime: STALE_TIMES.RUN,
    enabled: !!token && !!testInteractionRunId,
    ...options,
  });
};
