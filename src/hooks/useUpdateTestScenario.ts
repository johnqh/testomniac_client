import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { UpdateTestScenarioRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseUpdateTestScenarioConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  runnerId: number;
  token: FirebaseIdToken;
}

export function useUpdateTestScenario(config: UseUpdateTestScenarioConfig) {
  const { networkClient, baseUrl, runnerId, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: { scenarioId: number } & UpdateTestScenarioRequest) => {
      const { scenarioId, ...updateData } = data;
      return client.updateTestScenario(runnerId, scenarioId, updateData, token);
    },
  });

  return {
    updateTestScenario: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
