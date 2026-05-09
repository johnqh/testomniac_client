import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { CreateTestScheduleRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseCreateTestScheduleConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
}

export function useCreateTestSchedule(config: UseCreateTestScheduleConfig) {
  const { networkClient, baseUrl, runnerId, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: CreateTestScheduleRequest) =>
      client.createTestSchedule(runnerId, data, token),
  });

  return {
    createTestSchedule: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
