import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  DetectTestScenariosRequest,
  DetectTestScenariosResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useDetectTestScenarios = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<DetectTestScenariosResponse>,
  Error,
  { token: FirebaseIdToken; data: DetectTestScenariosRequest }
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
      data: DetectTestScenariosRequest;
    }) => client.detectTestScenarios(token, data),
  });
};
