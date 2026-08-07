import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { EntityApiKeyResponse, FirebaseIdToken } from '../types.js';
import { queryKeys } from './query-keys.js';
import { STALE_TIMES } from './query-config.js';

export const useEntityApiKeys = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  entitySlug: string,
  options?: Omit<
    UseQueryOptions<BaseResponse<EntityApiKeyResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<EntityApiKeyResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getEntityApiKeys(token, entitySlug),
    [client, token, entitySlug]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.entityApiKeys(entitySlug),
    queryFn,
    staleTime: STALE_TIMES.CREDENTIAL,
    enabled: !!token && !!entitySlug,
    ...options,
  });
};
