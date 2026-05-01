import type { NetworkClient } from '@sudobility/types';
import type { FirebaseIdToken } from '../types';

interface UseTestSuiteChildSuitesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testSuiteId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

/** @deprecated Test suites no longer nest. This hook always returns an empty array. */
export function useTestSuiteChildSuites(
  _config: UseTestSuiteChildSuitesConfig
) {
  return {
    childSuites: [] as never[],
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
}
