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
  UpdateEntityCredentialRequest,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';

export const useUpdateEntityCredential = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<EntityCredentialResponse>,
  Error,
  {
    token: FirebaseIdToken;
    entitySlug: string;
    credentialId: number;
    data: UpdateEntityCredentialRequest;
  }
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
      data,
    }: {
      token: FirebaseIdToken;
      entitySlug: string;
      credentialId: number;
      data: UpdateEntityCredentialRequest;
    }) => client.updateEntityCredential(token, entitySlug, credentialId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testomniac.entityCredentials(variables.entitySlug),
      });
    },
  });
};
