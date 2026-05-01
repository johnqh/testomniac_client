import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { CreateDiscoveryRunRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';

interface UseSubmitDiscoveryRunConfig {
  networkClient: NetworkClient;
  baseUrl: string;
}

export function useSubmitScan(config: UseSubmitDiscoveryRunConfig) {
  const { networkClient, baseUrl } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: CreateDiscoveryRunRequest) =>
      client.submitDiscoveryRun(data),
  });

  return {
    submitScan: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
