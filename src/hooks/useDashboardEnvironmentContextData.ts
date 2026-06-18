import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import { DEFAULT_STALE_TIME, type FirebaseIdToken, QUERY_KEYS } from '../types';
import { TestomniacClient } from '../network/TestomniacClient';
import { useEntityProducts } from './useEntityProducts';
import { useProductRuns } from './useProductRuns';
import { useProductRunners } from './useProductRunners';

interface UseDashboardEnvironmentContextDataConfig {
  networkClient: NetworkClient;
  baseUrl: string;
  entitySlug: string;
  envId: number;
  token: FirebaseIdToken;
  enabled?: boolean;
}

export function useDashboardEnvironmentContextData(
  config: UseDashboardEnvironmentContextDataConfig
) {
  const {
    networkClient,
    baseUrl,
    entitySlug,
    envId,
    token,
    enabled = true,
  } = config;
  const client = new TestomniacClient({ baseUrl, networkClient });

  const {
    products,
    isLoading: productsLoading,
    error: productsError,
  } = useEntityProducts({
    networkClient,
    baseUrl,
    entitySlug,
    token,
    enabled: enabled && !!entitySlug && !!token,
  });

  const environmentQueries = useQueries({
    queries: products.map(product => ({
      queryKey: QUERY_KEYS.productEnvironments(product.id),
      queryFn: async () => {
        const response = await client.getProductEnvironments(product.id, token);
        return response.data ?? [];
      },
      enabled: enabled && !!token,
      staleTime: DEFAULT_STALE_TIME,
    })),
  });

  const matchingProduct = useMemo(() => {
    for (let index = 0; index < products.length; index += 1) {
      const product = products[index];
      const environments = environmentQueries[index]?.data ?? [];
      if (environments.some(environment => environment.id === envId)) {
        return product;
      }
    }
    return null;
  }, [environmentQueries, envId, products]);

  const matchingEnvironment = useMemo(() => {
    for (const query of environmentQueries) {
      const environment = query.data?.find(item => item.id === envId);
      if (environment) return environment;
    }
    return null;
  }, [environmentQueries, envId]);

  const productId = matchingProduct?.id ?? matchingEnvironment?.productId ?? 0;

  const {
    runs,
    isLoading: runsLoading,
    error: runsError,
  } = useProductRuns({
    networkClient,
    baseUrl,
    productId,
    token,
    enabled: enabled && !!productId && !!token,
  });

  const {
    runners,
    isLoading: runnersLoading,
    error: runnersError,
  } = useProductRunners({
    networkClient,
    baseUrl,
    productId,
    token,
    enabled: enabled && !!productId && !!token,
  });

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
