import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';

interface UseHtmlElementConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  id: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useHtmlElement(config: UseHtmlElementConfig) {
  const { networkClient, baseUrl, id, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.htmlElement(id),
    queryFn: () => client.getHtmlElement(id, token),
    enabled: enabled && !!id && !!token,
    staleTime: DEFAULT_STALE_TIME,
  });

  return {
    htmlElement: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? query.data?.error ?? null,
    refetch: query.refetch,
  };
}
