import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { UpdateEntityCredentialRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { QUERY_KEYS } from '../types';

interface UseUpdateEntityCredentialConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  entitySlug: string;
  token: FirebaseIdToken;
}

export function useUpdateEntityCredential(
  config: UseUpdateEntityCredentialConfig
) {
  const { networkClient, baseUrl, entitySlug, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: {
      credentialId: number;
      data: UpdateEntityCredentialRequest;
    }) =>
      client.updateEntityCredential(
        entitySlug,
        params.credentialId,
        params.data,
        token
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.entityCredentials(entitySlug),
      });
    },
  });

  return {
    updateCredential: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
