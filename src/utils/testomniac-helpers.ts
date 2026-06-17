import { buildUrl } from './starter-helpers';

/**
 * Builds the URL for a stored artifact (screenshot, raw HTML, etc.) served by
 * the Testomniac API's `/api/v1/artifacts/` endpoint.
 *
 * @param baseUrl - The API base URL (e.g., `"https://api.example.com"`)
 * @param artifactPath - The artifact's storage path as returned by the API
 *   (e.g., a `screenshotPath`, `latestScreenshotPath`, or `rawHtmlPath`)
 * @param options - Optional flags. Set `thumbnail` to request a downscaled
 *   thumbnail variant via the `?thumbnail=true` query parameter.
 * @returns The fully constructed artifact URL
 *
 * @example
 * ```typescript
 * buildArtifactUrl('https://api.example.com', 'runs/1/page.png');
 * // => 'https://api.example.com/api/v1/artifacts/runs/1/page.png'
 *
 * buildArtifactUrl('https://api.example.com', 'runs/1/page.png', { thumbnail: true });
 * // => 'https://api.example.com/api/v1/artifacts/runs/1/page.png?thumbnail=true'
 * ```
 */
export function buildArtifactUrl(
  baseUrl: string,
  artifactPath: string,
  options: { thumbnail?: boolean } = {}
): string {
  const url = buildUrl(baseUrl, `/api/v1/artifacts/${artifactPath}`);
  return options.thumbnail ? `${url}?thumbnail=true` : url;
}

/**
 * Builds the Server-Sent Events (SSE) stream URL for a discovery/test run.
 *
 * Consumers connect an `EventSource` to this URL to receive real-time
 * {@link TestRunStreamEvent}s for the given run.
 *
 * @param baseUrl - The API base URL (e.g., `"https://api.example.com"`)
 * @param runId - The run identifier to stream events for
 * @returns The fully constructed SSE stream URL
 *
 * @example
 * ```typescript
 * buildRunStreamUrl('https://api.example.com', 42);
 * // => 'https://api.example.com/api/v1/runs/42/stream'
 * ```
 */
export function buildRunStreamUrl(
  baseUrl: string,
  runId: string | number
): string {
  return buildUrl(baseUrl, `/api/v1/runs/${runId}/stream`);
}
