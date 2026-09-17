/**
 * ONE LINE PER QUERY OUTCOME (plan step 18, 2026-09-17).
 *
 * `withBudget` logged on TIMEOUT only and `dbFailed` on a rejected read, and
 * neither said anything when a query came back fine, so the two silences
 * (a fast failure that falls back to an empty array, and an honest empty
 * table) read the same in the logs. That is the CLAUDE.md lesson that hid a
 * three-month outage. Every outcome now passes through here: `ok` with its
 * milliseconds, `timeout`, `error` with the message.
 *
 * ok is debug-level and printed only when QUERY_OUTCOMES=1, so production
 * logs do not gain ten lines a render; timeout and error warn always, with
 * the same words they used before. Every outcome is also kept in an
 * in-process ledger so `npx tsx scripts/query_outcomes.ts` can print the
 * table after driving the site's own readers.
 */
export type QueryOutcome = "ok" | "timeout" | "error";
export type QueryRecord = { label: string; outcome: QueryOutcome; ms?: number; detail?: string };

export const queryLedger: QueryRecord[] = [];

export function logQueryOutcome(label: string, outcome: QueryOutcome, opts: { ms?: number; detail?: string } = {}): void {
  const rec: QueryRecord = { label, outcome, ...opts };
  queryLedger.push(rec);
  /* eslint-disable no-console */
  if (outcome === "ok") {
    if (process.env.QUERY_OUTCOMES === "1") console.debug(`[cells] ${label} ok${opts.ms != null ? ` in ${opts.ms}ms` : ""}`);
  } else if (outcome === "timeout") {
    console.warn(`[cells] ${label} exceeded ${opts.ms}ms budget, falling back`);
  } else {
    console.warn(`[cells] ${label} failed, falling back: ${opts.detail ?? "unknown error"}`);
  }
  /* eslint-enable no-console */
}
