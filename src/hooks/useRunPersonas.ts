import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  PersonaResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useRunPersonas = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<PersonaResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<PersonaResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRunPersonas(token, runId),
    [client, token, runId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.runPersonas(runId),
    queryFn,
    staleTime: STALE_TIMES.PERSONA,
    enabled: !!token && !!runId,
    ...options,
  });
};
