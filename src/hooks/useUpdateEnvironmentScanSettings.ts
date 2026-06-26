import { useMemo } from 'react';
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  ScanSettingsResponse,
  UpdateScanSettingsRequest,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';

export const useUpdateEnvironmentScanSettings = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<ScanSettingsResponse>,
  Error,
  {
    token: FirebaseIdToken;
    productId: number;
    environmentId: number;
    data: UpdateScanSettingsRequest;
  }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, productId, environmentId, data }) =>
      client.updateEnvironmentScanSettings(
        token,
        productId,
        environmentId,
        data
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testomniac.environmentScanSettings(
          variables.productId,
          variables.environmentId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.testomniac.effectiveEnvironmentScanSettings(
          variables.productId,
          variables.environmentId
        ),
      });
    },
  });
};
