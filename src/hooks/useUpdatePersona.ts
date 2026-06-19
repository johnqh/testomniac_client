import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  PersonaResponse,
  UpdatePersonaRequest,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useUpdatePersona = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<PersonaResponse>,
  Error,
  { token: FirebaseIdToken; personaId: number; data: UpdatePersonaRequest }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      personaId,
      data,
    }: {
      token: FirebaseIdToken;
      personaId: number;
      data: UpdatePersonaRequest;
    }) => client.updatePersona(token, personaId, data),
  });
};
