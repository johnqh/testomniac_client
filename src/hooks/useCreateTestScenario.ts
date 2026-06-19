import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  CreateTestScenarioRequest,
  TestScenarioResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useCreateTestScenario = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<TestScenarioResponse>,
  Error,
  { token: FirebaseIdToken; runnerId: number; data: CreateTestScenarioRequest }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      runnerId,
      data,
    }: {
      token: FirebaseIdToken;
      runnerId: number;
      data: CreateTestScenarioRequest;
    }) => client.createTestScenario(token, runnerId, data),
  });
};
