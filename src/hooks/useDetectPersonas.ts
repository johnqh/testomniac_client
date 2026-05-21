import { useMutation } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { DetectPersonasRequest } from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

interface UseDetectPersonasConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  token: FirebaseIdToken;
}

export function useDetectPersonas(config: UseDetectPersonasConfig) {
  const { networkClient, baseUrl, token } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const mutation = useMutation({
    mutationFn: (data: DetectPersonasRequest) =>
      client.detectPersonas(data, token),
  });

  return {
    detectPersonas: mutation.mutateAsync,
    isDetecting: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}
