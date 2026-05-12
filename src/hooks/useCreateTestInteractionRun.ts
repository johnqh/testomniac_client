import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { CreateTestInteractionRunRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseCreateTestInteractionRunConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  token: FirebaseIdToken;
}

export function useCreateTestInteractionRun(
  config: UseCreateTestInteractionRunConfig
) {
  const { networkClient, baseUrl, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: CreateTestInteractionRunRequest) =>
      client.createTestInteractionRun(data, token),
  });

  return {
    createRun: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
