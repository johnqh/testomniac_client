import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export type BundleItemType = 'surface' | 'interaction' | 'scenario';

export const useAddToBundle = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<unknown>,
  Error,
  {
    token: FirebaseIdToken;
    runnerId: number;
    bundleId: number;
    itemType: BundleItemType;
    itemId: number;
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
      itemType,
      itemId,
    }: {
      token: FirebaseIdToken;
      runnerId: number;
      bundleId: number;
      itemType: BundleItemType;
      itemId: number;
    }) => {
      if (itemType === 'surface') {
        return client.addSurfaceToBundle(token, runnerId, bundleId, itemId);
      }
      if (itemType === 'interaction') {
        return client.addInteractionToBundle(token, runnerId, bundleId, itemId);
      }
      return client.addScenarioToBundle(token, runnerId, bundleId, itemId);
    },
  });
};
