import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { QUERY_KEYS } from '../types';

interface UseDeleteEntityCredentialConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  entitySlug: string;
  token: FirebaseIdToken;
}

export function useDeleteEntityCredential(
  config: UseDeleteEntityCredentialConfig
) {
  const { networkClient, baseUrl, entitySlug, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (credentialId: number) =>
      client.deleteEntityCredential(entitySlug, credentialId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.entityCredentials(entitySlug),
      });
    },
  });

  return {
    deleteCredential: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
