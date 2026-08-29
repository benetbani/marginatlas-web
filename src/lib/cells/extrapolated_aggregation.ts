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

/**
 * The band vocabularies that actually appear in extrapolated_cells, mapped onto
 * the canonical axis. The table layers several ingestions of the same
 * (country, industry): the research drop writes canonical employee bands
 * (1-4 ... 100+), while an older wave writes coarser employee bands ("0-9",
 * "2-9", "10-49", "50-249", "250+", "GE250"), a direct all-sizes row
 * ("total"/"TOTAL"), and turnover classes ("small"/"medium"/"large").
 *
 * THE 2026-08-29 TAKE-HOME DEFECT LIVED EXACTLY HERE. For a pair holding only
 * the coarser vocabulary, nothing matched SIZE_BAND_ORDER, the firm-share
 * weighting never engaged, and the fold fell back to an equal-weight mean
 * across every label present, junk included: GB sports_fitness averaged a
 * $416K micro band with a $5.1M mid band and a capped $8M corporate band into
 * a $2.5M "typical", which the finance engine faithfully turned into an owner
 * keeping $513K a year, 13.4x the UK median wage, on a page about one gym.
 *
 * Each alternate employee label is mapped to the canonical bands it covers so
 * the same firm-share weights apply whichever vocabulary a pair holds. The
 * "250+" / "GE250" class deliberately covers nothing: the canonical axis tops
 * out inside the SMB universe ("50-249" already claims 50-99 and 100+), and a
 * 250-plus-staff operation is a corporation whose per-firm revenue must never
 * weight a typical-single-shop figure.
 */
const BAND_COVERS: Record<string, readonly string[]> = {
  "1-4": ["1-4"],
  "5-9": ["5-9"],
  "10-19": ["10-19"],
  "20-49": ["20-49"],
  "50-99": ["50-99"],
  "100+": ["100+"],
  "0-9": ["1-4", "5-9"],
  "1-9": ["1-4", "5-9"],
  "2-9": ["1-4", "5-9"],
  "10-49": ["10-19", "20-49"],
  "50-249": ["50-99", "100+"],
  "250+": [],
  "GE250": [],
};

/**
 * The fallback firm-share shape for a pair with no research-drop distribution.
 * Business demography is micro-dominated in every economy the atlas covers
 * (registries put the overwhelming majority of enterprises under 10 staff), so
 * when no per-pair shares exist the fold weights with this documented generic
 * shape instead of treating a micro shop and a 50-staff operation as equals.
 * These are BLEND WEIGHTS, never a rendered figure: the revenue values they
 * weight are all real rows, and the cell they produce stays tier X / modeled.
 */
const DEFAULT_FIRM_DISTRIBUTION: Record<string, number> = {
  "1-4": 70,
  "5-9": 15,
  "10-19": 8,
  "20-49": 4,
  "50-99": 2,
  "100+": 1,
};

/**
 * Turnover classes are not an employee axis, so they cannot ride the covers
 * map; when a pair holds ONLY these (an older ingestion's leftover layer), the
 * fold weights them small-dominant for the same modal-firm reason as above.
 */
const TURNOVER_CLASS_WEIGHTS: Record<string, number> = {
  SMALL: 80,
  MEDIUM: 15,
  LARGE: 5,
};

export type BlendOptions = {
  /**
   * Firm-share weights keyed by canonical band (e.g. {"1-4": 80, ...}) — the
   * share_of_firms distribution. Bands without a positive weight are excluded
   * from the weighted mean.
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
 * Firm-share-weighted mean over the employee-axis bands, with each canonical
 * band's share allocated to exactly ONE present row: the row whose label
 * covers it most specifically (an exact canonical label beats a wider alias,
 * ties break on label order). The layered ingestions mean "1-4" and "0-9" can
 * both be present for one pair; without single ownership the same micro firms
 * would weight the mean twice. Returns null when no present band receives a
 * positive share (e.g. only the corporate 250+ class is present).
 */
function employeeAxisWeightedMean(
  bands: Array<readonly [string, number]>,
  dist: Record<string, number>,
): number | null {
  const weight = new Map<string, number>();
  for (const canonical of SIZE_BAND_ORDER) {
    const share = dist[canonical];
    if (typeof share !== "number" || !isFinite(share) || share <= 0) continue;
    let owner: string | null = null;
    let ownerCoverSize = Infinity;
    for (const [label] of bands) {
      const covers = BAND_COVERS[label];
      if (!covers || !covers.includes(canonical)) continue;
      if (
        covers.length < ownerCoverSize ||
        (covers.length === ownerCoverSize && (owner == null || label < owner))
      ) {
        owner = label;
        ownerCoverSize = covers.length;
      }
    }
    if (owner != null) weight.set(owner, (weight.get(owner) ?? 0) + share);
  }
  let acc = 0;
  let wSum = 0;
  for (const [label, rev] of bands) {
    const w = weight.get(label) ?? 0;
    if (w > 0) {
      acc += w * rev;
      wSum += w;
    }
  }
  return wSum > 0 ? acc / wSum : null;
}

/**
 * Fold per-band rows into one all-sizes revenue-per-firm.
 *
 * Precedence, most honest source first:
 *   1. Employee-axis bands weighted by the RESEARCHED per-pair firm shares
 *      (canonical bands and mapped aliases alike), when any band receives a
 *      positive share.
 *   2. An explicit "total" row: the loader's own direct all-sizes per-firm
 *      estimate, returned as-is. A synthetic weighting cannot beat the direct
 *      answer, and before 2026-08-29 this row was being AVERAGED IN as if it
 *      were one more band.
 *   3. Employee-axis bands weighted by the documented default micro-dominant
 *      shape (no researched shares held for the pair).
 *   4. Turnover classes weighted small-dominant (nothing else present).
 *   5. Equal-weight mean of whatever valid bands remain, the last resort for
 *      an unrecognised vocabulary; the render-side credibility screens are the
 *      backstop there.
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
  // order the database happened to return the rows in. Labels are normalised
  // (trimmed, uppercased) so "total" and "TOTAL" are one band.
  const valid = rows
    .map((r) => ({ band: (r.size_band ?? "").trim().toUpperCase(), rev: r.predicted_rev_per_firm }))
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

  // One value per band (first wins, which after the sort is the larger value).
  const byBand = new Map<string, number>();
  for (const { band, rev } of valid) {
    if (!byBand.has(band)) byBand.set(band, rev);
  }

  const bands = [...byBand.entries()];
  if (bands.length === 1) return bands[0][1];

  const employeeBands = bands.filter(([label]) => BAND_COVERS[label] != null);
  const totalRow = bands.find(([label]) => label === "TOTAL");
  const turnoverBands = bands.filter(([label]) => TURNOVER_CLASS_WEIGHTS[label] != null);

  // 1. The researched per-pair shares.
  if (employeeBands.length > 0 && firmDistribution) {
    const weighted = employeeAxisWeightedMean(employeeBands, firmDistribution);
    if (weighted != null) return weighted;
  }

  // 2. The loader's own direct all-sizes estimate.
  if (totalRow) return totalRow[1];

  // 3. The documented default micro-dominant shape.
  if (employeeBands.length > 0) {
    const weighted = employeeAxisWeightedMean(employeeBands, DEFAULT_FIRM_DISTRIBUTION);
    if (weighted != null) return weighted;
  }

  // 4. Turnover classes, small-dominant.
  if (turnoverBands.length > 0) {
    let acc = 0;
    let wSum = 0;
    for (const [label, rev] of turnoverBands) {
      const w = TURNOVER_CLASS_WEIGHTS[label];
      acc += w * rev;
      wSum += w;
    }
    if (wSum > 0) return acc / wSum;
  }

  // 5. Last resort: equal-weight mean across whatever is present.
  const sum = bands.reduce((s, [, rev]) => s + rev, 0);
  return sum / bands.length;
}
