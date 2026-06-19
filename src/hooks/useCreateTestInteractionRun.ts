import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  CreateTestInteractionRunRequest,
  TestInteractionRunResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useCreateTestInteractionRun = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<TestInteractionRunResponse>,
  Error,
  { token: FirebaseIdToken; data: CreateTestInteractionRunRequest }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      data,
    }: {
      token: FirebaseIdToken;
      data: CreateTestInteractionRunRequest;
    }) => client.createTestInteractionRun(token, data),
  });
};
