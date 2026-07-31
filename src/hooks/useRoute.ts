import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken, RouteResponse } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

/**
 * A route between two views of one environment.
 *
 * Targets are addressed by URL path rather than page id: the graph is keyed on
 * views, and several views can share a path. Omitting `from` lets the graph
 * plan from the app's registered entry view.
 */
export const useRoute = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  testEnvironmentId: number,
  to: { urlPath: string; signature?: string },
  from?: { urlPath: string; signature?: string },
  options?: Omit<UseQueryOptions<RouteResponse>, 'queryKey' | 'queryFn'>
): UseQueryResult<RouteResponse> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getRoute(token, testEnvironmentId, to, from),
    [client, token, testEnvironmentId, to, from]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.environmentRoute(
      testEnvironmentId,
      to.urlPath
    ),
    queryFn,
    staleTime: STALE_TIMES.PAGE,
    enabled: !!token && !!testEnvironmentId && !!to.urlPath,
    ...options,
  });
};
