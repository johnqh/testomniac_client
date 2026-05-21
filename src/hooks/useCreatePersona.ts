import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { CreatePersonaRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseCreatePersonaConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  token: FirebaseIdToken;
}

export function useCreatePersona(config: UseCreatePersonaConfig) {
  const { networkClient, baseUrl, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: CreatePersonaRequest) =>
      client.createPersona(data, token),
  });

  return {
    createPersona: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
