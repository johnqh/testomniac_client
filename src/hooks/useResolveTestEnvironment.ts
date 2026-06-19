import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  ResolveEnvironmentRequest,
  ResolveEnvironmentResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useResolveTestEnvironment = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<ResolveEnvironmentResponse>,
  Error,
  { token: FirebaseIdToken; data: ResolveEnvironmentRequest }
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
      data: ResolveEnvironmentRequest;
    }) => client.resolveTestEnvironment(token, data),
  });
};
