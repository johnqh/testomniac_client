import { useMemo } from 'react';
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';

export const useDeleteEntityApiKey = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<null>,
  Error,
  { token: FirebaseIdToken; entitySlug: string; apiKeyId: number }
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
      apiKeyId,
    }: {
      token: FirebaseIdToken;
      entitySlug: string;
      apiKeyId: number;
    }) => client.deleteEntityApiKey(token, entitySlug, apiKeyId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testomniac.entityApiKeys(variables.entitySlug),
      });
    },
  });
};
