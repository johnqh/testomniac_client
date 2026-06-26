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

export const useUpdateProductScanSettings = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<ScanSettingsResponse>,
  Error,
  {
    token: FirebaseIdToken;
    productId: number;
    data: UpdateScanSettingsRequest;
  }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, productId, data }) =>
      client.updateProductScanSettings(token, productId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testomniac.productScanSettings(variables.productId),
      });
    },
  });
};
