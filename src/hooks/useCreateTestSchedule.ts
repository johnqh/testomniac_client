import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  CreateTestScheduleRequest,
  TestScheduleResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

export const useCreateTestSchedule = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<TestScheduleResponse>,
  Error,
  { token: FirebaseIdToken; runnerId: number; data: CreateTestScheduleRequest }
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
      data: CreateTestScheduleRequest;
    }) => client.createTestSchedule(token, runnerId, data),
  });
};
