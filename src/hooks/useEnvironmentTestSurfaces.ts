import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestSurfaceResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useEnvironmentTestSurfaces = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  envId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestSurfaceResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestSurfaceResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getEnvironmentTestSurfaces(token, envId),
    [client, token, envId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.environmentTestSurfaces(envId),
    queryFn,
    staleTime: STALE_TIMES.SURFACE,
    enabled: !!token && !!envId,
    ...options,
  });
};
