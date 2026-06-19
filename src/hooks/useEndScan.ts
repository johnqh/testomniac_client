import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { NetworkClient } from '@sudobility/types';
import type {
  BaseResponse,
  ScanEndRequest,
  ScanEndResponse,
} from '@sudobility/testomniac_types';
import { TestomniacClient } from '../network/TestomniacClient';
import type { FirebaseIdToken } from '../types';

/**
 * Ends a scan and detects personas + scenarios for a product
 * (`POST /api/v1/scan/end`).
 */
export const useEndScan = (
  networkClient: NetworkClient,
  baseUrl: string
): UseMutationResult<
  BaseResponse<ScanEndResponse>,
  Error,
  { token: FirebaseIdToken; data: ScanEndRequest }
> => {
  const client = useMemo(
    () => new TestomniacClient(networkClient, baseUrl),
    [networkClient, baseUrl]
  );

  return useMutation({
    mutationFn: ({
      token,
      data,
    }: {
      token: FirebaseIdToken;
      data: ScanEndRequest;
    }) => client.endScan(token, data),
  });
};
