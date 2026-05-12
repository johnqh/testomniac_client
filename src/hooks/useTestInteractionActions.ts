import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseTestInteractionActionsConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  testInteractionId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useTestInteractionActions(
  config: UseTestInteractionActionsConfig
) {
  const {
    networkClient,
    baseUrl,
    testInteractionId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.testInteractionActions(testInteractionId),
    queryFn: () => client.getTestInteractionActions(testInteractionId, token),
    enabled: enabled && !!testInteractionId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    actions: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
