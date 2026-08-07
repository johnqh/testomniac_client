import { useMemo } from 'react';
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type {
  CreateEntityApiKeyRequest,
  EntityApiKeyResponse,
  FirebaseIdToken,
} from '../types.js';
import { queryKeys } from './query-keys.js';

export const useCreateEntityApiKey = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<EntityApiKeyResponse>,
  Error,
  {
    token: FirebaseIdToken;
    entitySlug: string;
    data: CreateEntityApiKeyRequest;
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
      data,
    }: {
      token: FirebaseIdToken;
      entitySlug: string;
      data: CreateEntityApiKeyRequest;
    }) => client.createEntityApiKey(token, entitySlug, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testomniac.entityApiKeys(variables.entitySlug),
      });
    },
  });
};
