import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestSurfaceBundleResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useDeleteTestSurfaceBundle = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<TestSurfaceBundleResponse>,
  Error,
  { token: FirebaseIdToken; runnerId: number; bundleId: number }
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
    }: {
      token: FirebaseIdToken;
      runnerId: number;
      bundleId: number;
    }) => client.deleteTestSurfaceBundle(token, runnerId, bundleId),
  });
};
