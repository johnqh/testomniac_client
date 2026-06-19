import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestInteractionResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useRunTestInteractions = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestInteractionResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestInteractionResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunTestInteractions(token, runId),
    [client, token, runId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runTestInteractions(runId),
    queryFn,
    staleTime: STALE_TIMES.INTERACTION,
    enabled: !!token && !!runId,
    ...options,
  });
};
