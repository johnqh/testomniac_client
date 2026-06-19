/**
 * Testomniac TanStack Query Configuration
 *
 * Provides stale time constants for Testomniac queries. Stale time determines
 * how long cached data is considered fresh before TanStack Query refetches it in
 * the background on the next access.
 *
 * ## Design Rationale
 *
 * Stale times are chosen by how frequently each resource type changes:
 * - **Structural/reference data** (entities, products, environments, runners,
 *   personas, scenarios): 10 minutes. Rarely change during a session.
 * - **Discovery artifacts** (surfaces, interactions, pages, scaffolds,
 *   page-states, html-elements): 5 minutes. Stable once discovered.
 * - **Run / finding data** (runs, run summaries, findings): 2 minutes. May be
 *   actively appended to during a scan.
 * - **Live dashboard / volatile data**: 1 minute. Polled while a run is active.
 *
 * Hooks may override these defaults via the `options` argument (e.g. a live
 * dashboard hook can drop to `staleTime: 0` plus a `refetchInterval`).
 */

/**
 * Default stale times (in milliseconds) for different types of Testomniac
 * queries. Used as the `staleTime` option in TanStack Query hooks.
 */
export const STALE_TIMES = {
  /** Entity list - structural data that rarely changes (10 min). */
  ENTITY: 10 * 60 * 1000,

  /** Product data - structural data that rarely changes (10 min). */
  PRODUCT: 10 * 60 * 1000,

  /** Environment data - structural data that rarely changes (10 min). */
  ENVIRONMENT: 10 * 60 * 1000,

  /** Runner data - structural data that rarely changes (10 min). */
  RUNNER: 10 * 60 * 1000,

  /** Persona data - structural data that rarely changes (10 min). */
  PERSONA: 10 * 60 * 1000,

  /** Scenario / sequence data - structural data that rarely changes (10 min). */
  SCENARIO: 10 * 60 * 1000,

  /** Schedule data - structural data that rarely changes (10 min). */
  SCHEDULE: 10 * 60 * 1000,

  /** Credential / API key data - rarely changes (10 min). */
  CREDENTIAL: 10 * 60 * 1000,

  /** Surface data - discovery artifacts, stable once discovered (5 min). */
  SURFACE: 5 * 60 * 1000,

  /** Interaction data - discovery artifacts, stable once discovered (5 min). */
  INTERACTION: 5 * 60 * 1000,

  /** Bundle data - discovery artifacts, stable once discovered (5 min). */
  BUNDLE: 5 * 60 * 1000,

  /** Page / page-state / scaffold / html-element data (5 min). */
  PAGE: 5 * 60 * 1000,

  /** Generated object scripts - stable once generated (5 min). */
  SCRIPT: 5 * 60 * 1000,

  /** Run data - may be appended to during a scan (2 min). */
  RUN: 2 * 60 * 1000,

  /** Finding data - may be appended to during a scan (2 min). */
  FINDING: 2 * 60 * 1000,

  /** Live dashboard - polled while a run is active (1 min). */
  DASHBOARD: 1 * 60 * 1000,
} as const;
