import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken, ScriptKind } from '../types.js';
import { queryKeys } from './query-keys.js';
import { STALE_TIMES } from './query-config.js';

/**
 * Fetches the complete Playwright script (imports + test wrapper + body) for a
 * domain object from the API's `/script` endpoints.
 */
export const useObjectScript = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  kind: ScriptKind,
  id: number | undefined,
  options?: Omit<UseQueryOptions<string>, 'queryKey' | 'queryFn'>
): UseQueryResult<string> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getObjectScript(token, kind, id as number),
    [client, token, kind, id]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.objectScript(kind, id ?? -1),
    queryFn,
    staleTime: STALE_TIMES.SCRIPT,
    enabled: !!token && !!id,
    ...options,
  });
};
