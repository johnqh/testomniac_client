import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { CreateTestSurfaceBundleRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseCreateTestSurfaceBundleConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
}

export function useCreateTestSurfaceBundle(
  config: UseCreateTestSurfaceBundleConfig
) {
  const { networkClient, baseUrl, runnerId, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: CreateTestSurfaceBundleRequest) =>
      client.createTestSurfaceBundle(runnerId, data, token),
  });

  return {
    createBundle: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
