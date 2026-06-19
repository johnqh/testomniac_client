import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  CreateDiscoveryRunRequest,
  CreateDiscoveryRunResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';

export const useSubmitScan = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<CreateDiscoveryRunResponse>,
  Error,
  CreateDiscoveryRunRequest
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: (data: CreateDiscoveryRunRequest) =>
      client.submitDiscoveryRun(data),
  });
};
