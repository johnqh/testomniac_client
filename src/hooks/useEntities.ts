import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  EntityWithRole,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useEntities = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  options?: Omit<
    UseQueryOptions<BaseResponse<EntityWithRole[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<EntityWithRole[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(() => client.getEntities(token), [client, token]);

  return useQuery({
    queryKey: queryKeys.testomniac.entities(),
    queryFn,
    staleTime: STALE_TIMES.ENTITY,
    enabled: !!token,
    ...options,
  });
};
