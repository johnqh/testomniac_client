import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseDeleteTestSurfaceBundleConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
}

export function useDeleteTestSurfaceBundle(
  config: UseDeleteTestSurfaceBundleConfig
) {
  const { networkClient, baseUrl, runnerId, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (bundleId: number) =>
      client.deleteTestSurfaceBundle(runnerId, bundleId, token),
  });

  return {
    deleteBundle: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
