import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import type { BundleItemType } from './useAddToBundle';

interface UseRemoveFromBundleConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  bundleId: number;
  token: FirebaseIdToken;
  itemType: BundleItemType;
}

export function useRemoveFromBundle(config: UseRemoveFromBundleConfig) {
  const { networkClient, baseUrl, runnerId, bundleId, token, itemType } =
    config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (itemId: number) => {
      if (itemType === 'surface') {
        return client.removeSurfaceFromBundle(
          runnerId,
          bundleId,
          itemId,
          token
        );
      }
      if (itemType === 'interaction') {
        return client.removeInteractionFromBundle(
          runnerId,
          bundleId,
          itemId,
          token
        );
      }
      return client.removeScenarioFromBundle(runnerId, bundleId, itemId, token);
    },
  });

  return {
    removeFromBundle: mutation.mutateAsync,
    isRemoving: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
