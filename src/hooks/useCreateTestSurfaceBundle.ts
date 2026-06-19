import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  CreateTestSurfaceBundleRequest,
  TestSurfaceBundleResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useCreateTestSurfaceBundle = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<TestSurfaceBundleResponse>,
  Error,
  {
    token: FirebaseIdToken;
    runnerId: number;
    data: CreateTestSurfaceBundleRequest;
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
      data,
    }: {
      token: FirebaseIdToken;
      runnerId: number;
      data: CreateTestSurfaceBundleRequest;
    }) => client.createTestSurfaceBundle(token, runnerId, data),
  });
};
