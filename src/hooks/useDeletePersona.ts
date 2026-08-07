import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  PersonaResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken } from '../types.js';

export const useDeletePersona = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<PersonaResponse>,
  Error,
  { token: FirebaseIdToken; personaId: number }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      personaId,
    }: {
      token: FirebaseIdToken;
      personaId: number;
    }) => client.deletePersona(token, personaId),
  });
};
