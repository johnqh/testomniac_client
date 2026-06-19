import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  UseCaseResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const usePersonaUseCases = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  personaId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<UseCaseResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<UseCaseResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getPersonaUseCases(token, personaId),
    [client, token, personaId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.personaUseCases(personaId),
    queryFn,
    staleTime: STALE_TIMES.PERSONA,
    enabled: !!token && !!personaId,
    ...options,
  });
};
