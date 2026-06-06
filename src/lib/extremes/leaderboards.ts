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
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { clampMargin } from "@/lib/finance/margin_floor";
import {
  summarizeActivityPlaces,
  type ActivityPlaceInput,
} from "@/lib/scores/activity_board";
import { buildAcrossCities, type CityColumn } from "@/lib/markets/across_cities";

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

  // Only states that genuinely carry this activity, via the shared trust gate
  // (src/lib/cells/trust.ts): right activity, not synthetic, not the
  // extrapolated tier, not a country aggregate. US-state cells are trusted
  // same-currency measurements, so in practice only the rare misroute drops.
  const inputs: ActivityPlaceInput[] = slate
    .filter((c) => isTrustedLocalCell(c, spec.expectIndustryId))
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

// --- competition-density leaderboards ---------------------------------------
//
// The "room to enter" read, ranked across places: where a business is thickest
// on the ground (the most crowded corners) and where it is thinnest (where
// there is still room). These rank a REAL, local competition density, firms per
// 10k residents, never an absolute revenue figure, so they are the density
// sibling of the take-home boards above.
//
// Source of truth: the curated trusted-city slate that the across-cities
// comparison already resolves (buildAcrossCities). That builder resolves each
// (city, activity) pair through the SAME four-way trust gate this file uses
// (right activity, not synthetic, not the extrapolated tier, not a country
// aggregate), pairs each clean cell with a curated metro population, and
// sanity-caps the firms-per-10k so a wrong-scale artifact drops. So a density
// row here is only ever a genuinely local reading, apples to apples across the
// trusted set. A board self-omits below MIN_ROWS clean readings, exactly like
// the take-home boards, so a thin activity drops rather than showing a stub.

/** One ranked row on a competition-density leaderboard. */
export interface DensityRow {
  /** Place name, e.g. "Paris". */
  name: string;
  /** Cell-page href for the full read. */
  href: string;
  /** ISO2 country slug (lowercased), for a small flag. */
  country: string;
  /** Competition density, firms per 10k residents (the ranked figure). */
  densityPer10k: number;
}

/** One resolved density leaderboard: editorial framing plus the ranked rows. */
export interface DensityLeaderboard {
  /** Stable key for React + section anchors. */
  key: string;
  /** Small uppercase eyebrow above the title. */
  eyebrow: string;
  /** Warm leaderboard title. */
  title: string;
  /** One-line editorial intro that names the read. */
  intro: string;
  /** The label for the right-hand value column. */
  valueCaption: string;
  /** Ranked rows, best-for-the-framing first. */
  rows: DensityRow[];
}

/**
 * A density-board request: one activity, resolved across the trusted city
 * slate, ranked one way by competition density.
 */
interface DensitySpec {
  key: string;
  eyebrow: string;
  title: string;
  intro: string;
  valueCaption: string;
  /** Industry id whose across-cities density we rank, e.g. "restaurants". */
  industryId: string;
  /**
   * Ranking direction by density. "high" puts the most crowded place first (the
   * most-crowded-corners board); "low" puts the least crowded first (the
   * still-room board).
   */
  direction: "high" | "low";
}

/**
 * The density-board slate. Two opposite reads of the SAME signal so the pair is
 * the crowding gauge made browsable: where a common, well-covered activity is
 * thickest on the ground, and where it is thinnest. Restaurants are the densest
 * and most widely covered activity, so the trusted set is richest there, which
 * keeps both boards above the row floor.
 */
const DENSITY_SPECS: DensitySpec[] = [
  {
    key: "crowded-corners",
    eyebrow: "The room to enter",
    title: "The most crowded corners",
    intro:
      "Some places already have a restaurant on every corner. These are the cities where the trade is thickest on the ground, the most competitors per resident we see, the hardest rooms to walk into as the newcomer.",
    valueCaption: "per 10k residents",
    industryId: "restaurants",
    direction: "high",
  },
  {
    key: "still-room",
    eyebrow: "The room to enter",
    title: "Where there is still room",
    intro:
      "The flip side of the same map: cities where restaurants are thinnest on the ground, the fewest competitors per resident. Thin can mean genuinely open, or it can mean quiet demand, so read it as where there is room to try, not a promise it pays.",
    valueCaption: "per 10k residents",
    industryId: "restaurants",
    direction: "low",
  },
];

/** A finite, positive density we can rank and show. */
function rankableDensity(c: CityColumn): number | null {
  return isPos(c.densityPer10k) ? c.densityPer10k : null;
}

/**
 * Build both density leaderboards from a pre-resolved across-cities cache. Each
 * spec ranks the shared city columns by their local density (descending for the
 * crowded board, ascending for the still-room board); a board self-omits below
 * MIN_ROWS clean readings. Because buildAcrossCities already trust-gates,
 * population-pairs, and sanity-caps the density, a row here can never be a
 * country aggregate, a synthetic stand-in, or an out-of-scale figure.
 */
function buildDensityBoards(
  acrossById: Map<string, Awaited<ReturnType<typeof buildAcrossCities>>>,
): DensityLeaderboard[] {
  const boards: DensityLeaderboard[] = [];
  for (const spec of DENSITY_SPECS) {
    const across = acrossById.get(spec.industryId);
    if (!across) continue;
    const withDensity = across.cities
      .map((c) => ({ c, d: rankableDensity(c) }))
      .filter((r): r is { c: CityColumn; d: number } => r.d !== null);
    if (withDensity.length < MIN_ROWS) continue;
    // Ties keep the across-cities order (richest revenue first).
    withDensity.sort((a, b) =>
      spec.direction === "high" ? b.d - a.d : a.d - b.d,
    );
    boards.push({
      key: spec.key,
      eyebrow: spec.eyebrow,
      title: spec.title,
      intro: spec.intro,
      valueCaption: spec.valueCaption,
      rows: withDensity.slice(0, MAX_ROWS).map(({ c, d }) => ({
        name: c.name,
        href: c.href,
        country: c.country,
        densityPer10k: d,
      })),
    });
  }
  return boards;
}

/**
 * Resolve the across-cities data for every distinct activity the density boards
 * need, ONCE each (both directions of a business share one slate), then build
 * the boards from that shared cache. Each across read is the builder's own
 * budgeted, trust-gated resolve, so a slow or thin activity simply yields no
 * board rather than hanging the hub.
 */
async function loadDensityBoards(): Promise<DensityLeaderboard[]> {
  const uniqueIds = Array.from(new Set(DENSITY_SPECS.map((s) => s.industryId)));
  const acrossById = new Map<
    string,
    Awaited<ReturnType<typeof buildAcrossCities>>
  >();
  await Promise.all(
    uniqueIds.map(async (id) => {
      acrossById.set(id, await buildAcrossCities(id));
    }),
  );
  return buildDensityBoards(acrossById);
}

// --- startup-capital leaderboards -------------------------------------------
//
// The "what it costs to open" read, ranked across the trusted slate: the
// cheapest businesses to start anywhere we cover, and the highest barriers to
// entry. These rank the MODELED, place-adjusted cost-to-open the cell board now
// shows (the per-industry archetype scaled by the city's cost-of-living index,
// capped), the entry-figure sibling of the density and take-home boards above.
//
// Source of truth: the SAME trusted-city slate buildAcrossCities resolves for
// the density boards, so a row here is only ever a genuinely local cell (right
// activity, not synthetic, not the extrapolated tier, not a country aggregate).
// To make "cheapest businesses" honest, we span a SET of activities, from the
// laptop trades to the premises-heavy builds, and rank every (activity, city)
// pair the slate resolves, so the cheap end is a light trade in a low-cost
// metro and the barrier end is a heavy build in a costly one. The figure is the
// pure model, so it never dashes; a board self-omits below MIN_ROWS clean rows,
// exactly like the density boards.

/** One ranked row on a startup-capital leaderboard. */
export interface StartupRow {
  /** Row label, the activity and place, e.g. "Restaurants in Paris". */
  name: string;
  /** Cell-page href for the full read. */
  href: string;
  /** ISO2 country slug (lowercased), for a small flag. */
  country: string;
  /** Modeled, place-adjusted one-time cost to open, USD (the ranked figure). */
  startupCostUsd: number;
}

/** One resolved startup-capital leaderboard: framing plus the ranked rows. */
export interface StartupLeaderboard {
  /** Stable key for React + section anchors. */
  key: string;
  /** Small uppercase eyebrow above the title. */
  eyebrow: string;
  /** Warm leaderboard title. */
  title: string;
  /** One-line editorial intro that names the read. */
  intro: string;
  /** The label for the right-hand value column. */
  valueCaption: string;
  /** Ranked rows, best-for-the-framing first. */
  rows: StartupRow[];
}

/**
 * The activity set the startup boards rank across. A deliberate spread from the
 * lightest opens (a consultant or a cleaner starts from a laptop and a van) to
 * the premises-heavy builds (a full venue, a clinic, a hotel), so the two
 * boards capture a real range rather than one trade. All are widely covered
 * activities, so the trusted slate resolves several cities for each, keeping the
 * flattened pool well above the row floor.
 */
const STARTUP_ACTIVITY_IDS: string[] = [
  "cleaning_services",
  "management_consulting",
  "marketing_design",
  "software_development",
  "barbershops",
  "hair_salons_full",
  "real_estate_agencies",
  "restaurants",
  "cafes_coffee",
  "sports_fitness",
  "grocery_stores",
  "auto_repair_shops",
  "dental_practices",
  "veterinary_pet_care",
  "hotels_lodging",
];

/**
 * A startup-board request: every (activity, city) pair across the trusted slate,
 * ranked one way by the modeled cost to open.
 */
interface StartupSpec {
  key: string;
  eyebrow: string;
  title: string;
  intro: string;
  valueCaption: string;
  /**
   * Ranking direction by cost to open. "low" puts the cheapest open first (the
   * lowest barrier to entry); "high" puts the priciest first (the highest
   * barrier).
   */
  direction: "high" | "low";
}

/**
 * The startup-board slate. Two opposite reads of the SAME entry figure: the
 * cheapest businesses to start, and the steepest barriers to entry. The pair is
 * the cost-to-open row made browsable, the same way the density pair is the
 * crowding gauge made browsable.
 */
const STARTUP_SPECS: StartupSpec[] = [
  {
    key: "cheapest-to-start",
    eyebrow: "The low bar",
    title: "The cheapest businesses to start",
    intro:
      "Not every business needs a fit-out and a lease. These are the openings that ask the least up front across everywhere we cover, the trades you can start from a laptop, a van, or a single chair. Low to enter is not the same as easy to win, but the bill to begin is small.",
    valueCaption: "to open",
    direction: "low",
  },
  {
    key: "highest-barriers",
    eyebrow: "The high bar",
    title: "The highest barriers to entry",
    intro:
      "The other end of the same scale: the openings that ask the most before the first customer. A full venue, a fitted clinic, a hotel, in the costliest places to build one. The figure is the price of the front door, and it is what keeps these trades from filling up overnight.",
    valueCaption: "to open",
    direction: "high",
  },
];

/** A finite, positive cost we can rank and show. */
function rankableStartupCost(c: CityColumn): number | null {
  return isPos(c.startupCostUsd) ? c.startupCostUsd : null;
}

/**
 * Build both startup-capital boards from the pre-resolved across-cities cache.
 * Flattens every resolved (activity, city) column across the activity set into
 * one pool, then each spec ranks that shared pool by the modeled cost to open
 * (ascending for the cheapest board, descending for the barriers board). A
 * board self-omits below MIN_ROWS clean rows. Because the columns come straight
 * from buildAcrossCities, every row is a trust-gated local cell; the figure
 * itself is the bounded model, so it never dashes or shows a wrong-scale value.
 */
function buildStartupBoards(
  acrossById: Map<string, Awaited<ReturnType<typeof buildAcrossCities>>>,
): StartupLeaderboard[] {
  // One flat pool of (activity, city) rows: the activity name for the label,
  // the city column for the place + figure. Across reads that did not resolve
  // (null) simply contribute nothing.
  type Pooled = { activityName: string; col: CityColumn; cost: number };
  const pool: Pooled[] = [];
  for (const id of STARTUP_ACTIVITY_IDS) {
    const across = acrossById.get(id);
    if (!across) continue;
    for (const col of across.cities) {
      const cost = rankableStartupCost(col);
      if (cost === null) continue;
      pool.push({ activityName: across.activityName, col, cost });
    }
  }

  const boards: StartupLeaderboard[] = [];
  for (const spec of STARTUP_SPECS) {
    if (pool.length < MIN_ROWS) continue;
    const ordered = [...pool].sort((a, b) =>
      spec.direction === "high" ? b.cost - a.cost : a.cost - b.cost,
    );
    boards.push({
      key: spec.key,
      eyebrow: spec.eyebrow,
      title: spec.title,
      intro: spec.intro,
      valueCaption: spec.valueCaption,
      rows: ordered.slice(0, MAX_ROWS).map(({ activityName, col, cost }) => ({
        name: `${activityName} in ${col.name}`,
        href: col.href,
        country: col.country,
        startupCostUsd: cost,
      })),
    });
  }
  return boards;
}

/**
 * Resolve the across-cities data for every activity the startup boards span,
 * ONCE each, then build the boards from that shared cache. Each across read is
 * the builder's own budgeted, trust-gated resolve, so a slow or thin activity
 * simply contributes no rows rather than hanging the hub.
 */
async function loadStartupBoards(): Promise<StartupLeaderboard[]> {
  const uniqueIds = Array.from(new Set(STARTUP_ACTIVITY_IDS));
  const acrossById = new Map<
    string,
    Awaited<ReturnType<typeof buildAcrossCities>>
  >();
  await Promise.all(
    uniqueIds.map(async (id) => {
      acrossById.set(id, await buildAcrossCities(id));
    }),
  );
  return buildStartupBoards(acrossById);
}

/** The full hub payload: the leaderboards that resolved cleanly, in spec order. */
export interface ExtremesPayload {
  leaderboards: ExtremeLeaderboard[];
  /** Competition-density leaderboards (crowded / still-room), or empty. */
  densityBoards: DensityLeaderboard[];
  /** Startup-capital leaderboards (cheapest / highest barrier), or empty. */
  startupBoards: StartupLeaderboard[];
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
  // The take-home boards (US-state reads), the density boards, and the startup
  // boards (both across-cities reads) hit different surfaces and self-omit on a
  // thin or failed read, so run them in parallel without affecting each other.
  // The density and startup boards each resolve their own across-cities slate;
  // restaurants overlap between them, but each builder budgets its own reads, so
  // the small duplication is cheaper than threading one shared cache through two
  // differently-shaped board sets.
  const [results, densityBoards, startupBoards] = await Promise.all([
    resolveWithPool(LEADERBOARD_SPECS),
    loadDensityBoards(),
    loadStartupBoards(),
  ]);
  const leaderboards = results.filter(
    (b): b is ExtremeLeaderboard => b !== null,
  );
  return { leaderboards, densityBoards, startupBoards };
}
