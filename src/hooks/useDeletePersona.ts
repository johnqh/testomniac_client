import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseDeletePersonaConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  token: FirebaseIdToken;
}

export function useDeletePersona(config: UseDeletePersonaConfig) {
  const { networkClient, baseUrl, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (personaId: number) => client.deletePersona(personaId, token),
  });

  return {
    deletePersona: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
