import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseDeleteEntityApiKeyConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  entitySlug: string;
  token: FirebaseIdToken;
}

export function useDeleteEntityApiKey(config: UseDeleteEntityApiKeyConfig) {
  const { networkClient, baseUrl, entitySlug, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (apiKeyId: number) =>
      client.deleteEntityApiKey(entitySlug, apiKeyId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.entityApiKeys(entitySlug),
      });
    },
  });

  return {
    deleteApiKey: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
