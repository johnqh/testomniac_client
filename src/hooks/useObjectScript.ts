import { useQuery } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient';
import { type FirebaseIdToken, QUERY_KEYS, type ScriptKind } from '../types';

interface UseObjectScriptConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  kind: ScriptKind;
  id: number | undefined;
  token: FirebaseIdToken;
  enabled?: boolean;
}

/**
 * Fetches the complete Playwright script (imports + test wrapper + body) for a
 * domain object from the API's `/script` endpoints.
 */
export function useObjectScript(config: UseObjectScriptConfig) {
  const { networkClient, baseUrl, kind, id, token, enabled = true } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const query = useQuery({
    queryKey: QUERY_KEYS.objectScript(kind, id ?? -1),
    enabled: enabled && !!id && !!token,
    queryFn: () => client.getObjectScript(kind, id as number, token),
  });

  return {
    script: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
