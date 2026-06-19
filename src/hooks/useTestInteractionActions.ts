import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestActionResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useTestInteractionActions = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  testInteractionId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestActionResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestActionResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getTestInteractionActions(token, testInteractionId),
    [client, token, testInteractionId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.testInteractionActions(testInteractionId),
    queryFn,
    staleTime: STALE_TIMES.INTERACTION,
    enabled: !!token && !!testInteractionId,
    ...options,
  });
};
