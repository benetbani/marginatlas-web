/**
 * src/lib/finance/fx.ts
 *
 * Single source of truth for foreign-exchange conversion rates used
 * by the cost engine and primary-data loaders.
 *
 * Why this module exists: prior to 2026-05-27, the AUD/USD rate was
 * hardcoded as `const AUD_PER_USD = 1.5384` in
 * `src/lib/economic_profile/au_primary_loader.ts`. The next currency
 * conversion would have been the second hardcoded value in a second
 * file. Centralising:
 *
 *   1. One place to inspect and update FX rates.
 *   2. Source metadata (rate provider, reviewed-at date).
 *   3. One place to state that these rates are pinned, not maintained.
 *
 * Convention:
 *   - All rates are expressed as <CCY>_PER_USD (units of CCY for 1 USD).
 *   - Rates are "locked at parse time" mid-rates from a single
 *     authoritative source (RBA / ECB / Bank of England, etc.).
 *   - The render layer reads these rates synchronously; we deliberately
 *     do NOT pull live rates from an API because (a) cost-engine
 *     outputs must be deterministic for the prebuild gates to pass, and
 *     (b) the rate drift across a quarter is smaller than the noise in
 *     the underlying benchmarks.
 *
 * DO NOT REFRESH THESE RATES. This file is the parse-time half of a
 * deliberate split, and the other half is src/lib/currency.ts:
 *
 *   src/lib/currency.ts   DISPLAY. Converts a stored USD figure into
 *                         whatever currency a reader just picked. The
 *                         current rate is the only correct one, so age
 *                         there is a defect: verify_fx_freshness warns
 *                         at 92 days and fails at 183. That gate is
 *                         built and running; it is no longer a TODO.
 *
 *   this file             PARSE-TIME. Pins AUD at the rate the
 *                         Australian source data was READ at, so a
 *                         published benchmark keeps the value it had
 *                         when it was captured.
 *
 * So the 2024-12-31 stamp below being long past is correct rather than
 * stale, and "updating" it would silently restate every Australian
 * figure on the site. verify_fx_freshness deliberately does not check
 * this file, and says so in its own header.
 *
 * This block used to say "review cadence: quarterly" and point at the
 * gate as a TODO. Both were wrong, and both contradicted the line three
 * above them saying the rates are locked at parse time. That
 * contradiction has now sent two separate readings of this file hunting
 * a nineteen-month staleness bug that does not exist, which is what it
 * cost and why it is rewritten rather than left as a wording nit.
 *
 * The change that IS right here: a new currency arrives when a new
 * country's primary data is parsed, stamped with the rate used at that
 * parse. Add entries, never revise them.
 */

export type FxRate = {
  /** ISO 4217 currency code. */
  ccy: string;
  /** Units of `ccy` per 1 USD. */
  per_usd: number;
  /** Authoritative source for this rate. */
  source: string;
  /**
   * ISO date this rate was captured, which for a parse-time pin is the date
   * the source data was read. Not a review that is due again: see the header.
   */
  last_reviewed_at: string;
  /** Optional context (e.g., "RBA Q4 2024 mid-rate"). */
  notes?: string;
};

const RATES: Record<string, FxRate> = {
  AUD: {
    ccy: "AUD",
    per_usd: 1.5384,
    source: "RBA mid-rate",
    last_reviewed_at: "2024-12-31",
    notes: "Locked at parse time for AU primary-data loader (Phase 1d).",
  },
  // Future entries land here.
};

/**
 * Get the FX rate (units of <ccy> per 1 USD) for a given currency.
 * Returns null if no rate is registered. Callers should treat null
 * as "feature unavailable" rather than substituting 1.0 silently.
 */
export function getRatePerUsd(ccy: string): number | null {
  const r = RATES[ccy.toUpperCase()];
  return r ? r.per_usd : null;
}

/** Full rate record, including source metadata. */
export function getFxRate(ccy: string): FxRate | null {
  return RATES[ccy.toUpperCase()] ?? null;
}

/**
 * Convert a USD value to the target currency. Returns null when the
 * rate is unknown (forces callers to handle the missing case
 * explicitly rather than silently producing 0).
 */
export function convertUsdTo(ccy: string, usd: number): number | null {
  const rate = getRatePerUsd(ccy);
  return rate == null ? null : usd * rate;
}

/**
 * Convert a value in <ccy> back to USD.
 */
export function convertToUsd(ccy: string, amount: number): number | null {
  const rate = getRatePerUsd(ccy);
  return rate == null ? null : amount / rate;
}

/** List all registered currencies (for audit + verify gate). */
export function listRegisteredCcys(): string[] {
  return Object.keys(RATES);
}
