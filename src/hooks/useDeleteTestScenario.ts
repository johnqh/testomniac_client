import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestScenarioResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useDeleteTestScenario = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<TestScenarioResponse>,
  Error,
  { token: FirebaseIdToken; runnerId: number; scenarioId: number }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      runnerId,
      scenarioId,
    }: {
      token: FirebaseIdToken;
      runnerId: number;
      scenarioId: number;
    }) => client.deleteTestScenario(token, runnerId, scenarioId),
  });
};
