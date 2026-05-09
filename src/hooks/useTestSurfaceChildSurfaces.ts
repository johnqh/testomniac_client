import type { NetworkClient } from '@sudobility/types';
import type { FirebaseIdToken } from '../types';

interface UseTestSurfaceChildSurfacesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testSurfaceId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

/** @deprecated Test surfaces no longer nest. This hook always returns an empty array. */
export function useTestSurfaceChildSurfaces(
  _config: UseTestSurfaceChildSurfacesConfig
) {
  return {
    childSurfaces: [] as never[],
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
}
