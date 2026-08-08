import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  NavigationPlanRequest,
  NavigationPlanResponse,
  NavigationReplanRequest,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient.js';
import type { FirebaseIdToken } from '../types.js';

/**
 * Plan how to accomplish a goal in an environment's app.
 *
 * A mutation rather than a query: planning is a request the caller makes at a
 * moment, not state to be cached and refetched. The same goal can legitimately
 * return a different plan as the graph learns, and a stale cached plan is worse
 * than no plan — it names controls that may no longer be there.
 *
 * Goes through testomniac_api's proxy, never the graph service directly: the
 * graph API key lives on the server and must not reach a browser.
 */
export const usePlanNavigation = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  NavigationPlanResponse,
  Error,
  {
    token: FirebaseIdToken;
    environmentId: number;
    data: NavigationPlanRequest;
  }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      environmentId,
      data,
    }: {
      token: FirebaseIdToken;
      environmentId: number;
      data: NavigationPlanRequest;
    }) => client.planNavigation(token, environmentId, data),
  });
};

/**
 * Re-plan after an action failed.
 *
 * The reported failure demotes that edge rather than deleting it — a link that
 * fails for one caller may work for another whose session differs — so calling
 * this is what makes the graph improve rather than merely retry.
 */
export const useReplanNavigation = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  NavigationPlanResponse,
  Error,
  {
    token: FirebaseIdToken;
    environmentId: number;
    data: NavigationReplanRequest;
  }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      environmentId,
      data,
    }: {
      token: FirebaseIdToken;
      environmentId: number;
      data: NavigationReplanRequest;
    }) => client.replanNavigation(token, environmentId, data),
  });
};
