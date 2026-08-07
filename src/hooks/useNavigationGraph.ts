import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken, NavigationGraphResponse } from '../types.js';
import { queryKeys } from './query-keys.js';
import { STALE_TIMES } from './query-config.js';

/**
 * The navigation graph for one environment.
 *
 * Scoped to an environment rather than a runner, and unwrapped: these endpoints
 * pass through to the graph service, so the response is its shape directly
 * rather than a `BaseResponse` envelope.
 */
export const useNavigationGraph = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  testEnvironmentId: number,
  options?: Omit<
    UseQueryOptions<NavigationGraphResponse>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<NavigationGraphResponse> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getNavigationGraph(token, testEnvironmentId),
    [client, token, testEnvironmentId]
  );

  return useQuery({
    queryKey:
      queryKeys.testomniac.environmentNavigationGraph(testEnvironmentId),
    queryFn,
    staleTime: STALE_TIMES.PAGE,
    enabled: !!token && !!testEnvironmentId,
    ...options,
  });
};
