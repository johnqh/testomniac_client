import { useCallback, useMemo } from 'react';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  HtmlElementResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';

export const useHtmlElement = (
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  id: number,
  options?: Omit<
    UseQueryOptions<BaseResponse<HtmlElementResponse>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<BaseResponse<HtmlElementResponse>> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const queryFn = useCallback(
    () => client.getHtmlElement(token, id),
    [client, token, id]
  );

  return useQuery({
    queryKey: queryKeys.testomniac.htmlElement(id),
    queryFn,
    staleTime: STALE_TIMES.PAGE,
    enabled: !!token && !!id,
    ...options,
  });
};
