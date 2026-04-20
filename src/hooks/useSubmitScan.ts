import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { CreateScanRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';

interface UseSubmitScanConfig {
  networkClient: NetworkClient;
  baseUrl: string;
}

export function useSubmitScan(config: UseSubmitScanConfig) {
  const { networkClient, baseUrl } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: CreateScanRequest) => client.submitScan(data),
  });

  return {
    submitScan: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
