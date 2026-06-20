import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken, ProductUrlResolution } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

/**
 * Resolve a product + test environment within an entity by matching a URL
 * against the environments' base URLs. Backs
 * `GET /api/v1/products/resolve-by-url`. The response data is `null` when no
 * environment in the entity matches the URL.
 */
export const useResolveProductByUrl = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  entityId: string,
  url: string,
  options?: Omit<
    UseQueryOptions<BaseResponse<ProductUrlResolution | null>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<ProductUrlResolution | null>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.resolveProductByUrl(token, entityId, url),
    [client, token, entityId, url]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.resolveProductByUrl(entityId, url),
    queryFn,
    staleTime: STALE_TIMES.PRODUCT,
    enabled: !!token && !!entityId && !!url,
    ...options,
  });
};
