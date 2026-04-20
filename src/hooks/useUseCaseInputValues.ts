import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseUseCaseInputValuesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  useCaseId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useUseCaseInputValues(config: UseUseCaseInputValuesConfig) {
  const { networkClient, baseUrl, useCaseId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.useCaseInputValues(useCaseId),
    queryFn: () => client.getUseCaseInputValues(useCaseId, token),
    enabled: enabled && !!useCaseId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    inputValues: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
