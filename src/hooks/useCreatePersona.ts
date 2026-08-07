import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  CreatePersonaRequest,
  PersonaResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken } from '../types.js';

export const useCreatePersona = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<PersonaResponse>,
  Error,
  { token: FirebaseIdToken; data: CreatePersonaRequest }
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
      data: CreatePersonaRequest;
    }) => client.createPersona(token, data),
  });
};
