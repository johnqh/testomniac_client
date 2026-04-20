import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UsePersonaUseCasesConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  personaId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function usePersonaUseCases(config: UsePersonaUseCasesConfig) {
  const { networkClient, baseUrl, personaId, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.personaUseCases(personaId),
    queryFn: () => client.getPersonaUseCases(personaId, token),
    enabled: enabled && !!personaId && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    useCases: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
