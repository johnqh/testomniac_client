import { useMemo } from 'react';
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  EntityCredentialResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken } from '../types.js';
import { queryKeys } from './query-keys.js';

export const useDeleteEntityCredential = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<EntityCredentialResponse>,
  Error,
  { token: FirebaseIdToken; entitySlug: string; credentialId: number }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      entitySlug,
      credentialId,
    }: {
      token: FirebaseIdToken;
      entitySlug: string;
      credentialId: number;
    }) => client.deleteEntityCredential(token, entitySlug, credentialId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testomniac.entityCredentials(variables.entitySlug),
      });
    },
  });
};
