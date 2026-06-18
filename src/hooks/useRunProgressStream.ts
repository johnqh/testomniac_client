import { buildRunStreamUrl } from '../utils/testomniac-helpers';
import { useEventSource } from './useEventSource';
import type { TestRunStreamEvent } from '@sudobility/testomniac_types';

interface UseRunProgressStreamConfig {
  baseUrl: string;
  runId?: string | number | null;
  isComplete: boolean;
  onEvent: (event: TestRunStreamEvent) => void;
}

export function useRunProgressStream({
  baseUrl,
  runId,
  isComplete,
  onEvent,
}: UseRunProgressStreamConfig) {
  const url = runId && !isComplete ? buildRunStreamUrl(baseUrl, runId) : null;
  return useEventSource({ url, onEvent });
}
