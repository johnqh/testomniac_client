import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { CreateEntityCredentialRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { QUERY_KEYS } from '../types';

interface UseCreateEntityCredentialConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  entitySlug: string;
  token: FirebaseIdToken;
}

export function useCreateEntityCredential(
  config: UseCreateEntityCredentialConfig
) {
  const { networkClient, baseUrl, entitySlug, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateEntityCredentialRequest) =>
      client.createEntityCredential(entitySlug, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.entityCredentials(entitySlug),
      });
    },
  });

  return {
    createCredential: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
