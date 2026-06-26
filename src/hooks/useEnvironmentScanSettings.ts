import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  ScanSettingsResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useEnvironmentScanSettings = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  productId: number,
  environmentId: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<ScanSettingsResponse>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<ScanSettingsResponse>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getEnvironmentScanSettings(token, productId, environmentId),
    [client, token, productId, environmentId]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.environmentScanSettings(
      productId,
      environmentId
    ),
    queryFn,
    staleTime: STALE_TIMES.RUN,
    enabled: !!token && !!productId && !!environmentId,
    ...options,
  });
};
