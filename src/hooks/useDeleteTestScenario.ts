import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseDeleteTestScenarioConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
}

export function useDeleteTestScenario(config: UseDeleteTestScenarioConfig) {
  const { networkClient, baseUrl, runnerId, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (scenarioId: number) =>
      client.deleteTestScenario(runnerId, scenarioId, token),
  });

  return {
    deleteTestScenario: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
