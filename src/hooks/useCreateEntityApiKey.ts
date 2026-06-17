import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import {
  type CreateEntityApiKeyRequest,
  type FirebaseIdToken,
  QUERY_KEYS,
} from '../types';

interface UseCreateEntityApiKeyConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  entitySlug: string;
  token: FirebaseIdToken;
}

export function useCreateEntityApiKey(config: UseCreateEntityApiKeyConfig) {
  const { networkClient, baseUrl, entitySlug, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateEntityApiKeyRequest) =>
      client.createEntityApiKey(entitySlug, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.entityApiKeys(entitySlug),
      });
    },
  });

  return {
    createApiKey: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
