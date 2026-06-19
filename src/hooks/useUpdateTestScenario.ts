import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  TestScenarioResponse,
  UpdateTestScenarioRequest,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useUpdateTestScenario = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<TestScenarioResponse>,
  Error,
  {
    token: FirebaseIdToken;
    runnerId: number;
    scenarioId: number;
    data: UpdateTestScenarioRequest;
  }
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
      data,
    }: {
      token: FirebaseIdToken;
      runnerId: number;
      scenarioId: number;
      data: UpdateTestScenarioRequest;
    }) => client.updateTestScenario(token, runnerId, scenarioId, data),
  });
};
