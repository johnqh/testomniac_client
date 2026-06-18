import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export type BundleItemType = 'surface' | 'interaction' | 'scenario';

interface UseAddToBundleConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
  itemType: BundleItemType;
  itemId: number;
}

export function useAddToBundle(config: UseAddToBundleConfig) {
  const { networkClient, baseUrl, runnerId, token, itemType, itemId } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (bundleId: number) => {
      if (itemType === 'surface') {
        return client.addSurfaceToBundle(runnerId, bundleId, itemId, token);
      }
      if (itemType === 'interaction') {
        return client.addInteractionToBundle(runnerId, bundleId, itemId, token);
      }
      return client.addScenarioToBundle(runnerId, bundleId, itemId, token);
    },
  });

  return {
    addToBundle: mutation.mutateAsync,
    isAdding: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
