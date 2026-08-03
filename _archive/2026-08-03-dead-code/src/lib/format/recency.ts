/**
 * Recency label helper.
 *
 * Public-facing pages must NEVER display raw year strings or year
 * ranges. We collapse all vintage information into a single calm
 * phrase. /admin/review bypasses this and shows real years.
 */

export type RecencyInput =
  | number
  | string
  | { from?: number | string | null; to?: number | string | null }
  | null
  | undefined;

/**
 * Always returns "Most recent data" for public render paths.
 * The argument is ignored on purpose — included so callers can pass
 * existing `year` props without rewriting calling code.
 */
export function formatRecency(_input?: RecencyInput): string {
  return "Most recent data";
}

/**
 * Escape hatch for /admin/review and other internal surfaces.
 */
export function formatRecencyDebug(input: RecencyInput): string {
  if (input == null) return "-";
  if (typeof input === "number") return String(input);
  if (typeof input === "string") return input;
  const { from, to } = input;
  if (from && to && from !== to) return `${from}–${to}`;
  return String(from ?? to ?? "-");
}
