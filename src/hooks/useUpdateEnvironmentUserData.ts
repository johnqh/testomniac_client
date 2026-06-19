import { useMemo } from 'react';
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { BaseResponse, UserData } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';

export const useUpdateEnvironmentUserData = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<{ data: UserData }>,
  Error,
  { token: FirebaseIdToken; environmentId: number; data: UserData }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      environmentId,
      data,
    }: {
      token: FirebaseIdToken;
      environmentId: number;
      data: UserData;
    }) => client.updateEnvironmentUserData(token, environmentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testomniac.environmentUserData(
          variables.environmentId
        ),
      });
    },
  });
};
