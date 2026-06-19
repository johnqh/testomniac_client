import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  DetectPersonasRequest,
  DetectPersonasResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useDetectPersonas = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<DetectPersonasResponse>,
  Error,
  { token: FirebaseIdToken; data: DetectPersonasRequest }
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
      data: DetectPersonasRequest;
    }) => client.detectPersonas(token, data),
  });
};
