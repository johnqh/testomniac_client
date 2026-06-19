import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse, UserData } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useEnvironmentUserData = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  environmentId: number | null,
  options?: Omit<
    UseQueryOptions<BaseResponse<{ data: UserData }>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<{ data: UserData }>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getEnvironmentUserData(token, environmentId as number),
    [client, token, environmentId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.environmentUserData(environmentId ?? 0),
    queryFn,
    staleTime: STALE_TIMES.ENVIRONMENT,
    enabled: !!token && environmentId != null,
    ...options,
  });
};
