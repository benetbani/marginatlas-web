/**
 * extrapolated_aggregation.ts
 *
 * Pure helper that collapses the per-size-band extrapolated_cells rows for one
 * (country, industry) into a single STABLE "all sizes" revenue-per-firm.
 *
 * Why this exists: extrapolated_cells stores one row per employee-size band
 * (1-4, 5-9, ...), each with a very different predicted_rev_per_firm. For a
 * Kenyan restaurant the 1-4 micro band is ~$10K while a 20-49-staff place is
 * ~$500K. The all-sizes read used to pick a single band by whatever physical
 * order the database returned the (same-year, same-industry) tied rows in, so
 * the same cell could return ~$10K on one request and a large-band value on the
 * next. That non-determinism is the root of the "all-sizes numbers are botched"
 * complaint.
 *
 * This folds the bands together with a firm-share weight (share_of_firms), so
 * the micro-dominated reality pulls the typical down toward the floor while the
 * larger bands still lift it above the bare 1-4 value. The weighted mean is
 * summed in a fixed band order, so two identical reads always return the same
 * number regardless of DB row order.
 *
 * Split out of cells.ts (mirrors top_industries_aggregation.ts) so the unit test
 * can exercise it without booting Supabase.
 */

/**
 * Canonical employee-size-band order, smallest first. Used to fold bands in a
 * fixed order so the weighted mean is reproducible across requests no matter
 * what order the database returned the rows in. Matches the canonical bands the
 * research-drop loader normalizes to.
 */
export const SIZE_BAND_ORDER = ["1-4", "5-9", "10-19", "20-49", "50-99", "100+"] as const;

/** Rank of a band in SIZE_BAND_ORDER; unknown/empty bands sort last. */
export function sizeBandRank(band: string | null | undefined): number {
  if (!band) return SIZE_BAND_ORDER.length;
  const i = (SIZE_BAND_ORDER as readonly string[]).indexOf(band);
  return i === -1 ? SIZE_BAND_ORDER.length : i;
}

export type ExtrapolatedBandRow = {
  size_band: string | null;
  predicted_rev_per_firm: number | null;
};

export type BlendOptions = {
  /**
   * Firm-share weights keyed by canonical band (e.g. {"1-4": 80, ...}) — the
   * share_of_firms distribution. Bands without a positive weight are excluded
   * from the weighted mean. When no band has a positive weight, the blend falls
   * back to an equal-weight mean across the present bands.
   */
  firmDistribution?: Record<string, number> | null;
  /**
   * Drop any band whose per-firm value exceeds this ceiling before blending
   * (a guard against a single wrong-aggregation band contaminating the mean).
   * Omit for no upper filter.
   */
  ceiling?: number | null;
};

/**
 * Fold per-band rows into one all-sizes revenue-per-firm.
 *
 * Weighting: firm-share-weighted mean when a firm_distribution is supplied (the
 * typical firm is the modal micro one, so the result sits near the floor but is
 * lifted by the larger bands). Falls back to an equal-weight mean across the
 * present bands when no usable weights exist, and to the lone value when a
 * single band is present.
 *
 * Deterministic: invalid / over-ceiling rows are dropped, rows are de-duplicated
 * by band (keeping the larger value on a tie) and folded in SIZE_BAND_ORDER, so
 * the result does not depend on input row order.
 *
 * Returns null when no band has a positive, in-range value.
 */
export function blendBandsToAllSizesRevenue(
  rows: ExtrapolatedBandRow[],
  opts: BlendOptions = {},
): number | null {
  const { firmDistribution, ceiling } = opts;

  // Keep only valid, in-range values, then sort into a canonical, fully
  // deterministic order (band order, then larger value first as a tie-break)
  // so neither de-duplication nor floating-point summation depends on the
  // order the database happened to return the rows in.
  const valid = rows
    .map((r) => ({ band: r.size_band ?? "", rev: r.predicted_rev_per_firm }))
    .filter(
      (r): r is { band: string; rev: number } =>
        typeof r.rev === "number" &&
        isFinite(r.rev) &&
        r.rev > 0 &&
        (ceiling == null || r.rev <= ceiling),
    )
    .sort((a, b) => {
      const r = sizeBandRank(a.band) - sizeBandRank(b.band);
      if (r !== 0) return r;
      if (a.band !== b.band) return a.band.localeCompare(b.band);
      return b.rev - a.rev;
    });

  if (valid.length === 0) return null;

  // Aggregate over the canonical employee-size axis (1-4 ... 100+). The table
  // also carries legacy / alternate band labels from older ingestions ("TOTAL"
  // and turnover classes like "small"/"large", or "0-9"/"50-249"/"GE250" employee
  // bandings) that are NOT part of the size axis this fold is defined over and
  // would distort an unweighted mean. Prefer canonical bands; fall back to
  // whatever bands exist only when none are canonical, so we never return null
  // while data is present.
  const canonical = valid.filter((r) => (SIZE_BAND_ORDER as readonly string[]).includes(r.band));
  const pool = canonical.length > 0 ? canonical : valid;

  // One value per band (first wins, which after the sort is the larger value).
  const byBand = new Map<string, number>();
  for (const { band, rev } of pool) {
    if (!byBand.has(band)) byBand.set(band, rev);
  }
  if (byBand.size === 0) return null;

  const bands = [...byBand.entries()]; // already in canonical order
  if (bands.length === 1) return bands[0][1];

  // Firm-share-weighted mean over the bands that have a positive share.
  let wSum = 0;
  let acc = 0;
  for (const [band, rev] of bands) {
    const share = firmDistribution?.[band];
    const w = typeof share === "number" && isFinite(share) && share > 0 ? share : 0;
    if (w > 0) {
      acc += w * rev;
      wSum += w;
    }
  }
  if (wSum > 0) return acc / wSum;

  // No usable firm-share weights: equal-weight mean across the present bands.
  const sum = bands.reduce((s, [, rev]) => s + rev, 0);
  return sum / bands.length;
}
