import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  GenerateSequenceRequest,
  GenerateSequenceResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useGenerateSequence = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<GenerateSequenceResponse>,
  Error,
  { token: FirebaseIdToken; scenarioId: number; data: GenerateSequenceRequest }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      scenarioId,
      data,
    }: {
      token: FirebaseIdToken;
      scenarioId: number;
      data: GenerateSequenceRequest;
    }) => client.generateSequence(token, scenarioId, data),
  });
};
