import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { UpdatePersonaRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseUpdatePersonaConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  token: FirebaseIdToken;
}

export function useUpdatePersona(config: UseUpdatePersonaConfig) {
  const { networkClient, baseUrl, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: { personaId: number } & UpdatePersonaRequest) => {
      const { personaId, ...updateData } = data;
      return client.updatePersona(personaId, updateData, token);
    },
  });

  return {
    updatePersona: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
