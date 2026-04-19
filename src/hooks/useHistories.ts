import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  BaseResponse,
  History,
  HistoryCreateRequest,
  HistoryUpdateRequest,
  NetworkClient,
  Optional,
} from '@sudobility/testomniac_types';
import type { FirebaseIdToken } from '../types';
import { StarterClient } from '../network/StarterClient';
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME, QUERY_KEYS } from '../types';

const EMPTY_HISTORIES: History[] = [];

export interface UseHistoriesReturn {
  histories: History[];
  isLoading: boolean;
  error: Optional<string>;
  update: () => void;
  createHistory: (data: HistoryCreateRequest) => Promise<BaseResponse<History>>;
  updateHistory: (
    historyId: string,
    data: HistoryUpdateRequest
  ) => Promise<BaseResponse<History>>;
  deleteHistory: (historyId: string) => Promise<BaseResponse<null>>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  clearError: () => void;
}

export const useHistories = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  options?: { enabled?: boolean }
): UseHistoriesReturn => {
  const enabled = (options?.enabled ?? true) && !!entitySlug && !!token;

  const client = useMemo(
    () => new StarterClient({ baseUrl, networkClient }),
    [baseUrl, networkClient]
  );

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.histories(entitySlug ?? ''),
    queryFn: async () => {
      const response = await client.getHistories(entitySlug!, token!);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch histories');
      }
      return response.data;
    },
    enabled,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });

  const invalidate = useCallback(() => {
    if (entitySlug) {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.histories(entitySlug),
      });
    }
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.historiesTotal(),
    });
  }, [queryClient, entitySlug]);

  const createMutation = useMutation({
    mutationFn: async (data: HistoryCreateRequest) => {
      return client.createHistory(entitySlug!, data, token!);
    },
    onSuccess: response => {
      if (response.success) invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      historyId,
      data,
    }: {
      historyId: string;
      data: HistoryUpdateRequest;
    }) => {
      return client.updateHistory(entitySlug!, historyId, data, token!);
    },
    onSuccess: response => {
      if (response.success) invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (historyId: string) => {
      return client.deleteHistory(entitySlug!, historyId, token!);
    },
    onSuccess: response => {
      if (response.success) invalidate();
    },
  });

  const createHistory = useCallback(
    (data: HistoryCreateRequest) => createMutation.mutateAsync(data),
    [createMutation]
  );

  const updateHistory = useCallback(
    (historyId: string, data: HistoryUpdateRequest) =>
      updateMutation.mutateAsync({ historyId, data }),
    [updateMutation]
  );

  const deleteHistory = useCallback(
    (historyId: string) => deleteMutation.mutateAsync(historyId),
    [deleteMutation]
  );

  const mutationError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error;

  const queryErrorMessage =
    queryError instanceof Error ? queryError.message : null;
  const mutationErrorMessage =
    mutationError instanceof Error ? mutationError.message : null;
  const error = queryErrorMessage ?? mutationErrorMessage;

  const clearError = useCallback(() => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  }, [createMutation, updateMutation, deleteMutation]);

  return useMemo(
    () => ({
      histories: data ?? EMPTY_HISTORIES,
      isLoading,
      error,
      update: refetch,
      createHistory,
      updateHistory,
      deleteHistory,
      isCreating: createMutation.isPending,
      isUpdating: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
      clearError,
    }),
    [
      data,
      isLoading,
      error,
      refetch,
      createHistory,
      updateHistory,
      deleteHistory,
      createMutation.isPending,
      updateMutation.isPending,
      deleteMutation.isPending,
      clearError,
    ]
  );
};
