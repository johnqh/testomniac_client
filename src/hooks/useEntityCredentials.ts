import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  EntityCredentialResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useEntityCredentials = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  entitySlug: string,
  options?: Omit<
    UseQueryOptions<BaseResponse<EntityCredentialResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<EntityCredentialResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getEntityCredentials(token, entitySlug),
    [client, token, entitySlug]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.entityCredentials(entitySlug),
    queryFn,
    staleTime: STALE_TIMES.CREDENTIAL,
    enabled: !!token && !!entitySlug,
    ...options,
  });
};
