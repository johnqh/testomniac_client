import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestScenarioResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useBundleScenarios = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  runnerId: number,
  bundleId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<TestScenarioResponse[]>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<TestScenarioResponse[]>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getBundleScenarios(token, runnerId, bundleId),
    [client, token, runnerId, bundleId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.bundleScenarios(bundleId),
    queryFn,
    staleTime: STALE_TIMES.SCENARIO,
    enabled: !!token && !!runnerId && !!bundleId,
    ...options,
  });
};
