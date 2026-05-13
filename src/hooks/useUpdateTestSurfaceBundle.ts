import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { UpdateTestSurfaceBundleRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseUpdateTestSurfaceBundleConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
}

export function useUpdateTestSurfaceBundle(
  config: UseUpdateTestSurfaceBundleConfig
) {
  const { networkClient, baseUrl, runnerId, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (params: {
      bundleId: number;
      data: UpdateTestSurfaceBundleRequest;
    }) =>
      client.updateTestSurfaceBundle(
        runnerId,
        params.bundleId,
        params.data,
        token
      ),
  });

  return {
    updateBundle: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
