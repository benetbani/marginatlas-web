/**
 * src/lib/extremes/leaderboards.ts
 *
 * Server-side data builder for the /extremes hub: a browsable set of ranked
 * leaderboards of the surprising highs and lows in the small-business data.
 * Each leaderboard is a real "extreme" the reader can browse, and every row
 * carries a real number and links to a live cell.
 *
 * This is the leaderboard sibling of src/lib/home/beats.ts and reuses its exact
 * discipline so the hub can never print a garbage tail, a synthetic stand-in, or
 * a misrouted activity:
 *
 *   - ONE bounded across-places read per leaderboard (getSameIndustryAcrossStates
 *     for a specific business), never a whole-DB scan.
 *   - The SAME median-relative outlier fence the activity page uses
 *     (summarizeActivityPlaces) clips garbage tails before ranking.
 *   - The SAME guards beats.ts added: a row is kept only when its cell genuinely
 *     carries the expected activity id (the friendly-slug to NAICS mapping can
 *     misroute) AND is not synthetic.
 *   - Owner take-home is the modeled after-tax net profit from the same
 *     tax-aware estimator the cell page and the activity table use, with the
 *     shared net-margin floor applied, so the hub, the cell page, and the
 *     activity page all agree on the method. Nothing is invented.
 *   - A leaderboard self-omits when fewer than MIN_ROWS clean rows resolve, so a
 *     thin or failed read drops the whole board rather than show a short one.
 *
 * Why US states only (not cross-country): the same-currency, same-wage-scale
 * US-state table is the trustworthy cross-place surface. The cross-country
 * extrapolation carries inflated tails and World-Bank aggregate rows (region
 * groupings that are not real places), which the median-relative fence cannot
 * fully clean because the whole cohort is shifted; ranking those would put
 * visibly-wrong numbers on the page. So every leaderboard here ranks real
 * US-state cells, apples-to-apples.
 *
 * Build-safe by construction: every read is wrapped in withBudget(), so a slow
 * or failed query degrades that one leaderboard to null (the hub renders the
 * rest) rather than hanging or crashing the route. Supabase queries live in
 * src/lib (never in components), matching the project's data-access rule.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import {
  getSameIndustryAcrossStates,
  cellUrl,
  withBudget,
  type Cell,
} from "@/lib/cells";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { clampMargin } from "@/lib/finance/margin_floor";
import {
  summarizeActivityPlaces,
  type ActivityPlaceInput,
} from "@/lib/scores/activity_board";

/** A finite, positive real. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/** Smallest clean row count a leaderboard will render; below it, the board omits. */
const MIN_ROWS = 5;

/** How many rows a leaderboard shows at most (a scannable top strip). */
const MAX_ROWS = 9;

/** One ranked row on an extremes leaderboard. */
export interface ExtremeRow {
  /** Place name, e.g. "Massachusetts". */
  name: string;
  /** Cell-page href for the full read, e.g. "/us/massachusetts/restaurants". */
  href: string;
  /** After-tax owner take-home, USD (the ranked figure). */
  takeHome: number;
  /** Net margin, percent (0..100), shown as the row texture, or null. */
  netMarginPct: number | null;
}

/** One resolved leaderboard: its editorial framing plus the ranked rows. */
export interface ExtremeLeaderboard {
  /** Stable key for React + section anchors. */
  key: string;
  /** Small uppercase eyebrow above the title. */
  eyebrow: string;
  /** Warm leaderboard title. */
  title: string;
  /** One-line editorial intro that names the catch. */
  intro: string;
  /** The label for the right-hand value column, e.g. "owner keeps". */
  valueCaption: string;
  /** Ranked rows, best-for-the-framing first. */
  rows: ExtremeRow[];
}

/** A leaderboard request: one bounded business read, ranked one way. */
interface LeaderboardSpec {
  key: string;
  eyebrow: string;
  title: string;
  intro: string;
  valueCaption: string;
  /** Business URL slug for the across-states read, e.g. "restaurants". */
  slug: string;
  /**
   * The activity id the resolved cell MUST carry. Guards the friendly-slug to
   * NAICS misroute exactly as beats.ts does: a state whose row resolved to a
   * different (parent) activity is dropped, never ranked under the wrong name.
   */
  expectIndustryId: string;
  /**
   * Ranking direction by owner take-home. "high" puts the biggest take-home at
   * the top (where it pays); "low" puts the smallest at the top (the catch,
   * where the same business barely clears).
   */
  direction: "high" | "low";
}

/** Turn one across-state Cell into the activity-board place input shape. */
function placeInputFromCell(cell: Cell): ActivityPlaceInput | null {
  const revenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  if (!isPos(revenue)) return null;
  const net = estimateNetProfit({
    iso2: cell.country.toUpperCase(),
    geoId: cell.geo_id || null,
    industryId: cell.industry_id || null,
    sectorId: cell.sector_id || null,
    grossRevenue: revenue,
    payroll: null,
  });
  const takeHome = isPos(net.net_profit) ? net.net_profit : null;
  const netMarginPct =
    net.net_margin != null
      ? clampMargin(net.net_margin, "net", cell.industry_id || null) * 100
      : null;
  const name = cell.geo_name || cell.country.toUpperCase();
  return {
    name,
    href: cellUrl(cell),
    typicalRevenue: revenue,
    takeHome,
    netMarginPct,
  };
}

/**
 * Resolve one leaderboard spec to a real ExtremeLeaderboard, or null when fewer
 * than MIN_ROWS states resolve cleanly with a take-home.
 *
 * The pipeline is identical to beats.ts resolveGymLeaderboard: pull the bounded
 * US-state slate, keep only states that genuinely carry the expected activity
 * and are not synthetic, run them through the shared outlier fence, then rank by
 * owner take-home (descending for "high", ascending for "low"). The fence runs
 * once and produces the cleaned, take-home-bearing rows; this only re-orders and
 * trims them.
 */
async function resolveLeaderboard(
  spec: LeaderboardSpec,
): Promise<ExtremeLeaderboard | null> {
  const slate = await withBudget(
    getSameIndustryAcrossStates(spec.slug, "US-00", 40),
    [],
    4_000,
    `extremes:${spec.slug}`,
  );

  // Only states that genuinely carry this activity (guard the misroute) and are
  // a real measurement (not synthesized).
  const inputs: ActivityPlaceInput[] = slate
    .filter((c) => c.industry_id === spec.expectIndustryId && !c.is_synthetic)
    .map(placeInputFromCell)
    .filter((p): p is ActivityPlaceInput => p !== null);

  // The shared fence clips garbage tails relative to the cohort median, then
  // hands back rows ranked by take-home (best first). Keep only rows that carry
  // a real take-home (the ranked figure).
  const summary = summarizeActivityPlaces(inputs);
  const clean = summary.rows.filter(
    (r): r is typeof r & { takeHome: number } => isPos(r.takeHome),
  );
  if (clean.length < MIN_ROWS) return null;

  // summarizeActivityPlaces already sorts by take-home descending. For "high"
  // that is the order we want; for "low" reverse it so the smallest take-home
  // (the catch) leads.
  const ordered = spec.direction === "low" ? [...clean].reverse() : clean;

  const rows: ExtremeRow[] = ordered.slice(0, MAX_ROWS).map((r) => ({
    name: r.name,
    href: r.href,
    takeHome: r.takeHome,
    netMarginPct: r.netMarginPct,
  }));

  return {
    key: spec.key,
    eyebrow: spec.eyebrow,
    title: spec.title,
    intro: spec.intro,
    valueCaption: spec.valueCaption,
    rows,
  };
}

/**
 * The leaderboard slate. Each is ONE bounded US-state read of a specific
 * business, ranked one way, with its own editorial framing. The set is chosen
 * for variety: distinct businesses, and a deliberate mix of highs (where a
 * business pays the most) and lows (where the same business barely clears, the
 * catch named in the intro). The homepage already ranks gyms by the HIGH end,
 * so this hub takes the gym's COLD end instead, never duplicating it.
 *
 * Every framing names a real catch and never implies an upside without it:
 * a high take-home board still carries the net-margin texture on each row, and
 * the low boards are the catch made explicit.
 */
const LEADERBOARD_SPECS: LeaderboardSpec[] = [
  {
    key: "agents-clear-most",
    eyebrow: "The quiet high earner",
    title: "Where a property agency clears the most",
    intro:
      "A small real-estate office runs lean: a few desks, no inventory, almost everything is commission. In the strongest states the owner keeps a remarkable share. The catch is the cycle, when listings dry up the same lean shop has nothing to fall back on.",
    valueCaption: "owner keeps",
    slug: "real-estate-agencies",
    expectIndustryId: "real_estate_agencies",
    direction: "high",
  },
  {
    key: "code-that-pays",
    eyebrow: "The modern surprise",
    title: "Where a software shop pays its founder most",
    intro:
      "A two-person development studio has no storefront and no stock, so what it bills drops most of the way to the owner. It rewards the best states handsomely. The quiet cost is that you are selling your own hours, and a slow quarter shows up directly in the take-home.",
    valueCaption: "owner keeps",
    slug: "software-development",
    expectIndustryId: "software_development",
    direction: "high",
  },
  {
    key: "chair-beats-cubicle",
    eyebrow: "The humble one that surprises",
    title: "Where the salon chair beats expectations",
    intro:
      "Hair and beauty is the business people underestimate. It will never gross like a clinic, yet in the right state a single-chair owner keeps more than the spreadsheet suggests, on volume and repeat custom. The ceiling is real though: there are only so many chairs and only so many hours.",
    valueCaption: "owner keeps",
    slug: "hairdressers-beauty",
    expectIndustryId: "hairdressers_beauty",
    direction: "high",
  },
  {
    key: "insurance-keeps-most",
    eyebrow: "The one nobody pictures",
    title: "Where a small insurance office keeps the most",
    intro:
      "Nobody daydreams about owning an insurance brokerage, and yet in the strongest states the owner keeps a sum that would surprise you, built on renewals that quietly arrive year after year. The catch is the same renewals running in reverse: lose a book of clients and the income walks out with them.",
    valueCaption: "owner keeps",
    slug: "insurance",
    expectIndustryId: "insurance",
    direction: "high",
  },
  {
    key: "tight-kitchens",
    eyebrow: "The thinnest end",
    title: "Where a restaurant barely clears",
    intro:
      "Everyone knows a restaurant can fill its tables and still keep almost nothing. These are the states where that is most true: rent, wages, and tax take nearly all of it, and the typical owner is left with the slimmest sliver of the year's takings.",
    valueCaption: "owner keeps",
    slug: "restaurants",
    expectIndustryId: "restaurants",
    direction: "low",
  },
  {
    key: "gym-cold-end",
    eyebrow: "The cold end",
    title: "The toughest states for a gym",
    intro:
      "A gym lives on members who pay every month and stop showing up by spring. In these states the math is least forgiving: after the lease and the staff, the typical owner keeps the least of anywhere we cover. Empty treadmills in February are exactly how these stay thin.",
    valueCaption: "owner keeps",
    slug: "sports-fitness",
    expectIndustryId: "sports_fitness",
    direction: "low",
  },
  {
    key: "workshop-cold-end",
    eyebrow: "The lean margin",
    title: "Where an auto shop keeps the least",
    intro:
      "An auto-repair bay can look busy all week and still run on a thin margin once parts, lifts, and labor are paid. These are the states where the typical shop owner keeps the smallest amount, proof that a full diary and a full till are not the same thing.",
    valueCaption: "owner keeps",
    slug: "auto-repair-shops",
    expectIndustryId: "auto_repair_shops",
    direction: "low",
  },
];

/** The full hub payload: the leaderboards that resolved cleanly, in spec order. */
export interface ExtremesPayload {
  leaderboards: ExtremeLeaderboard[];
}

/**
 * How many leaderboard reads run at once. Each leaderboard is its own bounded
 * Supabase query; firing all of them with a single Promise.all made several
 * trip the per-read budget during the connection-warmup window on a cold render
 * (they contend for the same cold pool), so the hub would intermittently drop
 * to a handful of boards. A small pool keeps a few queries in flight at a time
 * so each gets the full budget, while the whole set still resolves in well under
 * a second once warm. This mirrors the project's "parallel concurrency <= 4"
 * discipline for the build gates.
 */
const READ_CONCURRENCY = 2;

/**
 * Resolve the specs with bounded concurrency: walk the slate in fixed order,
 * keeping at most READ_CONCURRENCY reads in flight. Order is preserved so the
 * hub always reads in the same editorial sequence. Each read still self-omits
 * on a miss; this only changes how many run at once.
 */
async function resolveWithPool(
  specs: LeaderboardSpec[],
): Promise<Array<ExtremeLeaderboard | null>> {
  const out: Array<ExtremeLeaderboard | null> = new Array(specs.length).fill(
    null,
  );
  let next = 0;
  async function worker(): Promise<void> {
    while (true) {
      const i = next;
      next += 1;
      if (i >= specs.length) return;
      out[i] = await resolveLeaderboard(specs[i]);
    }
  }
  const workers = Array.from(
    { length: Math.min(READ_CONCURRENCY, specs.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return out;
}

/**
 * Build the full /extremes payload. Resolves every leaderboard with bounded
 * concurrency (see resolveWithPool); each self-omits on a miss (a thin or failed
 * read), so the hub renders only the boards that came back clean, in spec order.
 * The page decides whether it has enough to render at all.
 */
export async function loadExtremes(): Promise<ExtremesPayload> {
  const results = await resolveWithPool(LEADERBOARD_SPECS);
  const leaderboards = results.filter(
    (b): b is ExtremeLeaderboard => b !== null,
  );
  return { leaderboards };
}
