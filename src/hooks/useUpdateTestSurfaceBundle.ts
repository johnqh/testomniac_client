import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestSurfaceBundleResponse,
  UpdateTestSurfaceBundleRequest,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useUpdateTestSurfaceBundle = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<TestSurfaceBundleResponse>,
  Error,
  {
    token: FirebaseIdToken;
    runnerId: number;
    bundleId: number;
    data: UpdateTestSurfaceBundleRequest;
  }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      runnerId,
      bundleId,
      data,
    }: {
      token: FirebaseIdToken;
      runnerId: number;
      bundleId: number;
      data: UpdateTestSurfaceBundleRequest;
    }) => client.updateTestSurfaceBundle(token, runnerId, bundleId, data),
  });
};
