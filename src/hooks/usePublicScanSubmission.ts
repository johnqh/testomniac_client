import { useState } from 'react';
import type { NetworkClient } from '@sudobility/types';
import { useSubmitScan } from './useSubmitScan';

interface UsePublicScanSubmissionConfig {
  networkClient: NetworkClient;
  baseUrl: string;
}

interface SubmitPublicScanInput {
  url: string;
  email?: string;
}

export function usePublicScanSubmission(config: UsePublicScanSubmissionConfig) {
  const { submitScan, isSubmitting } = useSubmitScan(config);
  const [error, setError] = useState<string | null>(null);

  async function submitPublicScan(input: SubmitPublicScanInput) {
    setError(null);
    try {
      const response = await submitScan({
        url: input.url,
        ...(input.email ? { reportEmail: input.email } : {}),
      });

      if (response.success && response.data) {
        const result = response.data;
        if (result.status === 'pending' && result.testRunId) {
          return result.testRunId;
        }
        if (result.status === 'duplicate_owned') {
          setError(
            result.message ||
              'This URL already belongs to an organization. Contact the owner to get access.'
          );
          return null;
        }
        if (result.status === 'duplicate_unclaimed') {
          setError(
            result.message ||
              'This URL has already been scanned. Create an account to claim it.'
          );
          return null;
        }
        if (result.status === 'validation_error') {
          setError(
            result.message || 'Validation failed. Please check your input.'
          );
          return null;
        }
      }

      setError(response.error || 'Failed to start discovery run');
      return null;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to server'
      );
      return null;
    }
  }

  return {
    submitPublicScan,
    isSubmitting,
    error,
    resetError: () => setError(null),
  };
}
