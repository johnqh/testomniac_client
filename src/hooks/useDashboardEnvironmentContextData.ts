import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type { FirebaseIdToken } from '../types';
import { TestomniacClient } from '../network/TestomniacClient';
import { queryKeys } from './query-keys';
import { STALE_TIMES } from './query-config';
import { useEntityProducts } from './useEntityProducts';
import { useProductRuns } from './useProductRuns';
import { useProductRunners } from './useProductRunners';

/**
 * Aggregate hook that resolves the product / runner / latest-run context for a
 * given environment. Returns a custom shaped object (it is a composite, not a
 * single query) and intentionally does not follow the raw-UseQueryResult
 * convention.
 */
export function useDashboardEnvironmentContextData(
  networkClient: NetworkClient,
  baseUrl: string,
  token: FirebaseIdToken,
  entitySlug: string,
  envId: number,
  enabled = true
) {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  const productsQuery = useEntityProducts(
    networkClient,
    baseUrl,
    token,
    entitySlug,
    {
      enabled: enabled && !!entitySlug && !!token,
    }
  );
  const products = productsQuery.data?.data ?? [];
  const productsLoading = productsQuery.isLoading;
  const productsError = productsQuery.error?.message ?? null;

  const environmentQueries = useQueries({
    queries: products.map(product => ({
      queryKey: queryKeys.testomniac.productEnvironments(product.id),
      // Must return the full BaseResponse to match useProductEnvironments,
      // which shares this query key. Returning a different shape (e.g. just
      // `response.data`) corrupts the shared cache entry depending on which
      // hook fetches first.
      queryFn: () => client.getProductEnvironments(token, product.id),
      enabled: enabled && !!token,
      staleTime: STALE_TIMES.ENVIRONMENT,
    })),
  });

  const matchingProduct = useMemo(() => {
    for (let index = 0; index < products.length; index += 1) {
      const product = products[index];
      const environments = environmentQueries[index]?.data?.data ?? [];
      if (environments.some(environment => environment.id === envId)) {
        return product;
      }
    }
    return null;
  }, [environmentQueries, envId, products]);

  const matchingEnvironment = useMemo(() => {
    for (const query of environmentQueries) {
      const environment = query.data?.data?.find(item => item.id === envId);
      if (environment) return environment;
    }
    return null;
  }, [environmentQueries, envId]);

  const productId = matchingProduct?.id ?? matchingEnvironment?.productId ?? 0;

  const runsQuery = useProductRuns(networkClient, baseUrl, token, productId, {
    enabled: enabled && !!productId && !!token,
  });
  const runs = runsQuery.data?.data ?? [];
  const runsLoading = runsQuery.isLoading;
  const runsError = runsQuery.error?.message ?? null;

  const runnersQuery = useProductRunners(
    networkClient,
    baseUrl,
    token,
    productId,
    {
      enabled: enabled && !!productId && !!token,
    }
  );
  const runners = runnersQuery.data?.data ?? [];
  const runnersLoading = runnersQuery.isLoading;
  const runnersError = runnersQuery.error?.message ?? null;

  const environmentRuns = useMemo(
    () =>
      runs
        .filter(run => run.testEnvironmentId === envId)
        .sort((left, right) => right.id - left.id),
    [envId, runs]
  );

  const latestRun = environmentRuns[0] ?? null;

  const primaryRunner = useMemo(() => {
    if (latestRun) {
      return runners.find(runner => runner.id === latestRun.runnerId) ?? null;
    }
    return runners[0] ?? null;
  }, [latestRun, runners]);

  const environmentsLoading =
    productsLoading || environmentQueries.some(query => query.isLoading);
  const environmentsError =
    productsError ||
    environmentQueries.find(query => query.error)?.error?.message ||
    null;

  return {
    environment: matchingEnvironment,
    product: matchingProduct,
    productId,
    latestRun,
    environmentRuns,
    primaryRunner,
    isLoading: environmentsLoading || runsLoading || runnersLoading,
    error: environmentsError || runsError || runnersError || null,
  };
}
