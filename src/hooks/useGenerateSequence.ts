import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { GenerateSequenceRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseGenerateSequenceConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  token: FirebaseIdToken;
}

export function useGenerateSequence(config: UseGenerateSequenceConfig) {
  const { networkClient, baseUrl, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (params: { scenarioId: number } & GenerateSequenceRequest) =>
      client.generateSequence(
        params.scenarioId,
        { testEnvironmentId: params.testEnvironmentId },
        token
      ),
  });

  return {
    generateSequence: mutation.mutateAsync,
    isGenerating: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
