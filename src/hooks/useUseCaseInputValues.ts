import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  InputValueResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useUseCaseInputValues = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  useCaseId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<InputValueResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<InputValueResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getUseCaseInputValues(token, useCaseId),
    [client, token, useCaseId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.useCaseInputValues(useCaseId),
    queryFn,
    staleTime: STALE_TIMES.PERSONA,
    enabled: !!token && !!useCaseId,
    ...options,
  });
};
