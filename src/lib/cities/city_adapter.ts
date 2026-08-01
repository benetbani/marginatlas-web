/**
 * src/lib/cities/city_adapter.ts
 *
 * `CityFile` to a page model, the same shape `spine2_adapter.ts` gives the trade
 * page. One model per chapter, a SPINE constant, and numbering that is a
 * property of the SPINE rather than of the data.
 *
 * THAT LAST POINT IS THE WHOLE DESIGN. The trade adapter originally filtered its
 * spine to chapters that had data and renumbered what was left, so a place with
 * four unfilled sections rendered seventeen chapters numbered 01 to 17 and a
 * reader had no way to know four were missing. The founder overruled it on
 * 2026-07-27: a page is always complete and its shape never varies by place.
 *
 * So chapter 13 is chapter 13 in London and in the two hundredth city. What
 * varies is whether a chapter renders its figures or renders a stated gap, and
 * that decision belongs to the page, not to this file.
 */
import type {
  CityArchetype,
  CityDistrictMixRow,
  CityRankFigure,
  CityFile,
  CityScorecardRow,
  CityTradeFitLevel,
  Figure,
  NullFigure,
  PointFigure,
} from "./city_spine2_types";
import { isNullFigure } from "./city_spine2_types";
/* Chapter 07 reads the reconciled cell files directly. The contract requires
   it: a trade row authored in the city file drifts from the trade page, and
   already had. Domain to domain, both under src/lib, so the layering holds. */
import { loadSpine2Cell } from "@/lib/cells/spine2_loader";
import { isNullFigure as isNullCellFigure } from "@/lib/cells/spine2_types";

/* ------------------- the trades a district favours ----------------------- */

/**
 * Which trades suit a district, DERIVED from who is there.
 *
 * Ratified 2026-07-31, decision 6: the page should not stop at "heavy on
 * students", it should say "which favours cafes, bars and gyms". The founder
 * wanted the conclusion drawn, because a first-time owner often cannot make
 * that leap from a population chart.
 *
 * IT IS DERIVED, NOT AUTHORED, and that is the load-bearing choice. Every
 * archetype already declares its `tradesThatIndexHigh` once, at city level.
 * Reading a district's favoured trades from its own top types means the two can
 * never disagree. Authoring them per district would create a second home for
 * the same claim, and a district could then recommend cafes while the
 * population strip beside it says nobody there buys coffee. The trade page
 * audit found several defects of exactly that shape.
 *
 * IT SCORES WHAT IS DISTINCTIVE, NOT WHAT IS COMMON, and this was learned by
 * looking at the output rather than reasoning about it. The obvious version
 * sums each type's raw share. Run against the London fixture it returned "gyms"
 * for five districts out of six, because young professionals and young renters
 * dominate most of London and both favour gyms. A mechanism that says the same
 * thing about every district cannot help anyone choose between them, which is
 * the entire job.
 *
 * So a type only contributes where the district is ABOVE the city on it, and it
 * contributes the DIFFERENCE. A district that is 30% students in a city that is
 * 8% students surfaces student trades hard; a district that is average on
 * everything surfaces little, which is itself the honest answer about a place
 * with no particular character.
 *
 * Still no formula in the sense the founder ruled out: it is one subtraction.
 *
 * Returns [] when the district has no mix or no type stands out, which the
 * renderer prints as a stated gap rather than inventing a recommendation.
 */
/**
 * How far above the city a district must sit, in accumulated points of share,
 * before we will name a trade for it. Below this the district is ordinary and
 * the honest output is nothing at all.
 *
 * A KNOWN LIMIT, recorded rather than tuned away. Each archetype declares only
 * about three favoured trades and the lists overlap heavily: the two commonest
 * London types both name gyms. So this discriminates well at the extremes,
 * where Mayfair returns boutiques and fine dining while Brixton returns barbers
 * and groceries, and poorly between four similar inner-city districts, which
 * all return some ordering of gyms, restaurants and salons. That is a thinness
 * in the archetype-to-trade vocabulary, not in the scoring, and no amount of
 * reweighting fixes it. Enriching those lists is the real work.
 */
const FAVOURED_TRADE_FLOOR = 5;

export function favouredTrades(
  row: CityDistrictMixRow,
  archetypes: CityArchetype[],
  limit = 3,
): string[] {
  const byKey = new Map(archetypes.map((a) => [a.key, a]));
  /** The city baseline this district is measured against. */
  const cityShare = new Map(archetypes.map((a) => [a.key, a.sharePct]));
  const score = new Map<string, number>();

  for (const t of row.top) {
    const arch = byKey.get(t.key);
    if (!arch) continue; // a type absent from the city strip contributes nothing
    const lift = t.sharePct - (cityShare.get(t.key) ?? 0);
    if (lift <= 0) continue; // at or below the city average says nothing about this place
    for (const trade of arch.tradesThatIndexHigh) {
      score.set(trade, (score.get(trade) ?? 0) + lift);
    }
  }

  return [...score.entries()]
    .filter(([, lift]) => lift >= FAVOURED_TRADE_FLOOR)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([trade]) => trade);
}

/* ------------------------------ the spine -------------------------------- */

export type CityChapterId =
  | "hero"
  | "scorecard"
  | "incomeAndWealth"
  | "visitors"
  | "people"
  | "spaceCosts"
  | "tradeEconomics"
  | "districtRent"
  | "tradeFit"
  | "districts"
  | "direction"
  | "myths"
  | "peers"
  | "watch"
  | "voices"
  | "verdict"
  | "methodology"
  | "next";

/**
 * The eighteen chapters, in order, with the titles and icons the mockup uses.
 * Chapters 08 and 10 both render the district list; the mockup does this
 * deliberately (rent by district, then the districts themselves) and the
 * contract holds ONE list so the two cannot disagree.
 */
export const CITY_SPINE: Array<{ id: CityChapterId; title: string; icon: string }> = [
  { id: "hero", title: "The answer", icon: "skyline" },
  { id: "scorecard", title: "The city in seven numbers", icon: "scorecard" },
  { id: "incomeAndWealth", title: "Household income and wealth", icon: "bank" },
  { id: "visitors", title: "Visitors through the year", icon: "tourist" },
  { id: "people", title: "Who lives here, and what they can spend", icon: "spending-power" },
  { id: "spaceCosts", title: "What space costs", icon: "commercial-rent" },
  { id: "tradeEconomics", title: "What owners keep", icon: "owner-keeps" },
  { id: "districtRent", title: "Rent by district", icon: "neighborhood" },
  { id: "tradeFit", title: "Best area for each trade", icon: "best-areas" },
  { id: "districts", title: "The districts", icon: "district-mix" },
  { id: "direction", title: "Where the city is heading", icon: "trend" },
  { id: "myths", title: "Common myths", icon: "myth-reality" },
  { id: "peers", title: "Against peer cities", icon: "benchmark" },
  { id: "watch", title: "What to watch", icon: "watch" },
  { id: "voices", title: "What operators say", icon: "operator-voices" },
  { id: "verdict", title: "The verdict", icon: "honest-take" },
  { id: "methodology", title: "How we work this out", icon: "methodology" },
  { id: "next", title: "Where to go next", icon: "where-it-pays" },
];

export type CityChapter = {
  id: CityChapterId;
  num: string;
  title: string;
  icon: string;
  anchor: string;
};

/** Every chapter, always, numbered in order. Never filtered by data. */
export function numberCityChapters(): CityChapter[] {
  return CITY_SPINE.map((s, i) => ({
    id: s.id,
    num: String(i + 1).padStart(2, "0"),
    title: s.title,
    icon: s.icon,
    anchor: `ch-${String(i + 1).padStart(2, "0")}`,
  }));
}

/* ------------------------------ formatting ------------------------------- */

/**
 * Money, in the page's own register: `$22K`, `$1.1M`, `$620`.
 * Lifted in spirit from the trade adapter so the two page types round and
 * abbreviate identically. A city page that says $22K beside a trade page that
 * says $22,000 for the same quantity reads as two products.
 */
/** Drop a trailing `.0`, so 1.0 prints as 1 and 2.5 survives. */
function trim(s: string): string {
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

function money(v: number): string {
  const a = Math.abs(v);
  /* BILLIONS. Without this branch, visitor spend of 53,000,000,000 printed as
     "$53000M", which is not a number anyone reads. City-scale totals reach this
     range and trade-scale ones never do, which is why it went unnoticed while
     only the trade page used this register. */
  if (a >= 1_000_000_000) return `$${trim((v / 1_000_000_000).toFixed(a >= 10_000_000_000 ? 0 : 1))}B`;
  if (a >= 1_000_000) return `$${trim((v / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1))}M`;
  if (a >= 10_000) return `$${Math.round(v / 1_000)}K`;
  /* ONE DECIMAL UNDER 10K, for the same reason the M branch has one. Rounding
     to whole thousands here costs up to 500 on a figure of 2,500, a fifth of it:
     spend per visitor printed as "$3K" when the number is 2,524. Verified before
     changing it that no figure rendered today falls in this window, so nothing
     already on the page moves. */
  if (a >= 1_000) return `$${trim((v / 1_000).toFixed(1))}K`;
  return `$${Math.round(v)}`;
}

/**
 * A plain count: `21M`, `640K`, `9,700`.
 * Visitor counts run to eight digits and an unformatted one is unreadable at a
 * glance, which is the whole job of this column.
 */
function count(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) {
    const m = v / 1_000_000;
    return `${a >= 10_000_000 ? Math.round(m) : m.toFixed(1)}M`;
  }
  if (a >= 10_000) return `${Math.round(v / 1_000)}K`;
  return v.toLocaleString("en-GB");
}

/**
 * Render a figure for display, or null when it is a hole.
 *
 * MATCHED AGAINST THE UNITS THE CONTRACT ACTUALLY USES, not against a guess.
 * The first version tested `unit === "x"` and the fixture says
 * `"x the country"`, so two multiples rendered as bare `2.1` and `1.3`, and a
 * visitor count rendered as `21000000`. None of that is visible in the markup;
 * it took looking at the page. The unit strings are prose by design (they are
 * shown to readers elsewhere), so this matches on their SHAPE.
 */
function display(f: Figure | undefined, unitOverride?: string): string | null {
  if (!f || isNullFigure(f)) return null;
  const p = f as PointFigure;
  if (typeof p.value !== "number") return null;
  const unit = (unitOverride ?? p.unit ?? "").trim();

  if (/^USD/i.test(unit)) return money(p.value);
  /* ANY unit that OPENS with a percent sign, not just the bare one. The fixture
     carries seven: "%", "% of payments", "% of all spend in the city",
     "% below the poverty line", "% of discretionary spend", "% change in rent",
     "% over ten years". The original test was `unit === "%"`, so six of the
     seven rendered as a bare number and the reader had no way to know 86 meant
     86 percent. Enumerated against the fixture rather than guessed, which is the
     same mistake this function's own header records. */
  if (/^%/.test(unit) || /^percent/i.test(unit)) return `${p.value}%`;
  /* Floor area is printed with its unit because the label beside it says what
     the room is for, not how it is measured. */
  if (unit === "sqm") return `${p.value} sqm`;
  // "x the country", "x the UK", "x" , a multiple of some baseline.
  if (/^x\b/i.test(unit)) return `${p.value}x`;
  // "score of 100", "of 100" , the denominator is the column header's job.
  if (/^score\b|^of \d/i.test(unit)) return String(p.value);
  // Anything counted: "visitors/yr", "residents", "households".
  if (Number.isInteger(p.value) && Math.abs(p.value) >= 10_000) return count(p.value);
  return String(p.value);
}

/* -------------------------------- models --------------------------------- */

export type CityHeroModel = {
  city: string;
  country: string;
  headline: string;
  headlineLabel: string;
  /** The four glance rows. Each may be null; the row then states its gap. */
  glance: Array<{ label: string; sub?: string; value: string | null }>;
};

export type CityScorecardRowModel = {
  label: string;
  sub?: string;
  value: string | null;
  position: number;
};

export type CityScorecardModel = {
  baselineLabel: string;
  rows: CityScorecardRowModel[];
};

/**
 * Chapter 10, the districts, assembled from three separate figures that the
 * contract keeps apart on purpose: the district list (rent, character), the
 * wealth reading and the population mix. They are joined here rather than in
 * the file because each carries its own tier: rent is often measured where
 * wealth is only estimated, and a reader is owed that difference.
 *
 * `favours` is DERIVED from the mix, never authored. See favouredTrades.
 */
export type CityDistrictRowModel = {
  slug: string;
  name: string;
  blurb: string;
  icon: string | null;
  /** Rent against the city rate, e.g. "1.4x". Null when unpriced. */
  rent: string | null;
  /** Five plain steps against this city's own average. Never an index number,
   * and never comparable with another city. */
  resident: string | null;
  daytime: string | null;
  /** Top five population types, largest first, display names. */
  mix: Array<{ name: string; sharePct: number }>;
  /** Types notably thin here. The absence is half the point. */
  scarce: string[];
  /** Trades this district's population tilts towards. Empty when nothing
   * stands out, which is the honest answer for an ordinary district. */
  favours: string[];
};

export type CityDistrictsModel = {
  rows: CityDistrictRowModel[];
  /** The one quiet line the founder asked for (decision 4), or null when every
   * reading behind the section is measured. */
  note: string | null;
};

/** The five bands, in plain words. Ratified 2026-07-31 decision 1: bands, never
 * an index, because ~84% of income variance sits inside a small area and a
 * number would claim a precision that does not exist. */
const WEALTH_LABEL: Record<string, string> = {
  "well-above": "Well above average",
  above: "Above average",
  around: "Around average",
  below: "Below average",
  "well-below": "Well below average",
};

/**
 * Chapter 07, what owners keep by trade.
 *
 * THE ROWS ARE READ FROM THE CELL FILES, NOT FROM THE CITY FILE, wherever a
 * reconciled cell exists. This contract said so from its first commit: "Each
 * row must be read from that trade's own cell file, never authored here, or the
 * two pages will drift apart."
 *
 * They had already drifted. The London city file authored a cost to open of
 * $197,000 for restaurants while the reconciled cell file computes $231,134 by
 * summing its own opening lines, a gap of 17%. Rendering the authored value
 * would have put two different answers to one question on two pages of the same
 * site, which is the founder's oldest complaint about this project and one of
 * the four contradictions he has been asked to settle.
 *
 * It does not need settling. The cell file wins by construction: it is the one
 * that shows its arithmetic and carries a tier per line, and it is what the
 * trade page prints. The city figure was lifted from a mockup. So this reads
 * the cell where there is one and falls back to the authored row only where
 * there is not, marking which is which so the page can be honest about it.
 */
function buildTradeEconomics(file: CityFile): CityTradeEconomicsModel | null {
  const te = file.tradeEconomics;
  if (te == null || isNullFigure(te.trades)) return null;

  const citySlug = file.meta.city.slug;
  const countrySlug = file.meta.country.slug;

  const rows = te.trades.trades.map((t) => {
    const cell = loadSpine2Cell(countrySlug, citySlug, t.tradeSlug);
    /* isNullCellFigure, not the city one: these are cell figures and the two
       unions are different types. Using the wrong guard compiles into a silent
       non-narrowing, which is how a null reaches a formatter. */
    const openingTotal =
      cell && !isNullCellFigure(cell.opening.total) ? cell.opening.total.value : null;
    const keeps =
      cell && !isNullCellFigure(cell.modelRoom.ownerKeeps)
        ? (cell.modelRoom.ownerKeeps.taken ?? null)
        : null;

    const keepsValue = keeps ?? t.ownerKeeps;
    const openValue = openingTotal ?? t.costToOpen;

    return {
      tradeSlug: t.tradeSlug,
      tradeName: t.tradeName,
      revenue: Number.isFinite(t.revenue) ? money(t.revenue) : "not published",
      ownerKeeps: Number.isFinite(keepsValue) ? money(keepsValue as number) : "not published",
      costToOpen: Number.isFinite(openValue) ? money(openValue as number) : "not published",
      /** True when this row came from a reconciled cell file rather than the
       * city file, which is the only row a reader can click through and check. */
      fromCell: cell != null,
    };
  });

  return { rows, reconciled: rows.filter((r) => r.fromCell).length };
}

/* --------------------- 03 household income and wealth -------------------- */

export type CityIncomeAndWealthModel = {
  /** The top tenth against the middle earner, e.g. "2.8x". */
  topTenthVsMiddle: string | null;
  /** The income spread, in the file's own order. */
  spread: Array<{ label: string; median: string; lo: string; hi: string }>;
  paidByCard: string | null;
};

/**
 * Chapter 03.
 *
 * `topTenthVsMiddle` is RENDERED AS AUTHORED, and that is a compromise worth
 * naming. The contract says it "restates the ratio of two rows of `spread`, and
 * a filled file should re-derive it rather than author a second opinion", which
 * is the right rule. It cannot be applied here: `CityIncomeBand` carries a free
 * `label` and no stable key, so there is no way to tell which row is the top
 * tenth and which is the middle earner except by matching prose or by trusting
 * row order, and both of those are how a page starts printing the wrong number
 * in the two hundredth city. The fixture's authored 2.8 does agree with its own
 * spread (130,000 over 47,000 is 2.77), so nothing disagrees today.
 *
 * Recorded as a contract gap rather than papered over: giving `CityIncomeBand` a
 * closed key would let this derive, which is the same fix the archetype
 * vocabulary already got.
 */
function buildIncomeAndWealth(file: CityFile): CityIncomeAndWealthModel | null {
  const iw = file.incomeAndWealth;
  if (iw == null) return null;

  const spread = isNullFigure(iw.spread)
    ? []
    : iw.spread.rows.map((r) => ({
        label: r.label,
        median: money(r.median),
        lo: money(r.lo),
        hi: money(r.hi),
      }));

  const topTenth = display(iw.topTenthVsMiddle);
  const card = display(iw.paidByCard);
  if (!spread.length && topTenth == null && card == null) return null;

  return { topTenthVsMiddle: topTenth, spread, paidByCard: card };
}

/* ---------------------- 04 visitors through the year --------------------- */

export type CityVisitorsModel = {
  count: string | null;
  spend: string | null;
  spendPerVisitor: string | null;
  shareOfCitySpend: string | null;
  /** Derived from the twelve-month index. Null when no series is published. */
  peak: { month: string; index: number } | null;
  trough: { month: string; index: number } | null;
  topDistrict: { name: string; share: string | null } | null;
};

/**
 * Chapter 04.
 *
 * TWO FIGURES ARE DERIVED HERE BECAUSE THE CONTRACT SAYS TO DERIVE THEM.
 *
 * The peak and trough months are read off `monthlyIndex` rather than authored,
 * which is what makes the chapter's sentence true in a city whose season runs
 * the other way round. Southern-hemisphere cities peak in December and January,
 * and an authored "busiest in August" would have been copied into two hundred
 * files before anyone noticed.
 *
 * `spendPerVisitor` is re-derived from spend over count wherever both exist, per
 * the contract: "a filled file should re-derive rather than author a second
 * opinion". The fixture authors 2,500 and the division gives 2,524; both print
 * as $2.5K, so the two agree today, and where they ever stop agreeing the
 * arithmetic wins over the copied number.
 */
function buildVisitors(file: CityFile): CityVisitorsModel | null {
  const v = file.visitors;
  if (v == null) return null;

  let peak: { month: string; index: number } | null = null;
  let trough: { month: string; index: number } | null = null;
  if (!isNullFigure(v.monthlyIndex) && v.monthlyIndex.series.length > 0) {
    const pts = v.monthlyIndex.series;
    const hi = pts.reduce((b, p) => (p.value > b.value ? p : b));
    const lo = pts.reduce((b, p) => (p.value < b.value ? p : b));
    peak = { month: String(hi.x), index: hi.value };
    trough = { month: String(lo.x), index: lo.value };
  }

  const countValue = isNullFigure(v.count) ? null : v.count.value;
  const spendValue = isNullFigure(v.spend) ? null : v.spend.value;
  const perVisitor =
    countValue != null && spendValue != null && countValue > 0
      ? money(spendValue / countValue)
      : display(v.spendPerVisitor);

  const td = v.topDistrict;
  const topDistrict = isNullFigure(td as Figure)
    ? null
    : {
        name: (td as { districtName: string }).districtName,
        share: display((td as { shareOfSpend: Figure }).shareOfSpend),
      };

  const anything =
    display(v.count) != null || display(v.spend) != null || peak != null || topDistrict != null;
  if (!anything) return null;

  return {
    count: display(v.count),
    spend: display(v.spend),
    spendPerVisitor: perVisitor,
    shareOfCitySpend: display(v.shareOfCitySpend),
    peak,
    trough,
    topDistrict,
  };
}

/* -------------------------- 06 what space costs -------------------------- */

export type CitySpaceCostsModel = {
  /** Of every 100 spent standing somewhere, where it goes. */
  costSplit: Array<{ label: string; value: number }>;
  sizes: Array<{
    label: string;
    description: string;
    area: string | null;
    annualCost: string | null;
  }>;
  anchorTrade: {
    tradeSlug: string;
    tradeName: string;
    area: string | null;
    demandPerDay: string | null;
    annualSpaceCost: string | null;
  } | null;
  note: string | null;
};

/**
 * Chapter 06.
 *
 * `anchorTrade` is a worked example belonging to ONE trade, and the contract is
 * blunt about it: "EVERY FIGURE HERE BELONGS TO THAT TRADE'S CELL FILE and must
 * be read from it at build time." It is not read from the cell file yet, and it
 * renders as authored, so this is the same drift chapter 07 already had and had
 * to have fixed. The fixture's own notes say all three figures agree with the
 * London restaurant file today, so nothing disagrees; what is missing is the
 * mechanism that keeps it that way. Recorded rather than shipped as if
 * reconciled.
 */
function buildSpaceCosts(file: CityFile): CitySpaceCostsModel | null {
  const s = file.spaceCosts;
  if (s == null) return null;

  const costSplit = isNullFigure(s.costSplit)
    ? []
    : s.costSplit.series.map((p) => ({ label: String(p.x), value: p.value }));

  const sizes = s.sizes
    ? [s.sizes.small, s.sizes.medium, s.sizes.large].filter(Boolean).map((u) => ({
        label: u.label,
        description: u.description,
        area: display(u.floorAreaSqm),
        annualCost: display(u.annualCost),
      }))
    : [];

  const at = s.anchorTrade;
  const anchorTrade =
    at == null || isNullFigure(at as Figure)
      ? null
      : {
          tradeSlug: (at as { tradeSlug: string }).tradeSlug,
          tradeName: (at as { tradeName: string }).tradeName,
          area: display((at as { floorAreaSqm: Figure }).floorAreaSqm),
          demandPerDay: (() => {
            const d = (at as { demandPerDay: Figure }).demandPerDay;
            if (isNullFigure(d)) return null;
            const p = d as PointFigure;
            /* "52 orders/day" reads as a file path. The unit strings are prose
               by design, so the slash goes back to being a word. */
            return `${p.value} ${String(p.unit ?? "").replace("/day", " a day")}`.trim();
          })(),
          annualSpaceCost: display((at as { annualSpaceCost: Figure }).annualSpaceCost),
        };

  if (!costSplit.length && !sizes.length && anchorTrade == null) return null;
  return { costSplit, sizes, anchorTrade, note: s.note ?? null };
}

/* --------------------------- 08 rent by district ------------------------- */

export type CityDistrictRentModel = {
  /** What the per-district cost figures price, in plain words. */
  unitPriced: string;
  rows: Array<{
    slug: string;
    name: string;
    /** Rent against the city rate, e.g. "1.4x". */
    rent: string | null;
    annualUnitCost: string | null;
  }>;
  /** How many districts carry a price for that unit. */
  priced: number;
};

/**
 * Chapter 08, THE SAME LIST chapter 10 renders.
 *
 * One field drives both, which is the point: the contract keeps a single
 * district list "precisely so they cannot print different multiples for the same
 * place". Chapter 08 reads it as a rent scale, chapter 10 as character cards.
 *
 * A district with no priced unit prints "not priced here" rather than dropping
 * out of the scale, so a reader can see that three of six are missing instead of
 * reading a shorter list as a complete one. The NullFigure's `reason` is NOT
 * rendered: those reasons are written for us and talk about our own mockups,
 * which is not a sentence a reader should ever meet.
 */
function buildDistrictRent(file: CityFile): CityDistrictRentModel | null {
  const d = file.districts;
  if (d == null || isNullFigure(d.list)) return null;

  const rows = d.list.districts.map((row) => ({
    slug: row.slug,
    name: row.name,
    rent: Number.isFinite(row.rentMultiple) ? `${row.rentMultiple.toFixed(1)}x` : null,
    annualUnitCost: display(row.annualUnitCost),
  }));

  return {
    unitPriced: d.unitPriced,
    rows,
    priced: rows.filter((r) => r.annualUnitCost != null).length,
  };
}

/* --------------------- 09 best area for each trade ----------------------- */

export type CityTradeFitModel = {
  /** Column headers, in the district list's own order. */
  districts: string[];
  rows: Array<{
    tradeSlug: string;
    tradeName: string;
    levels: Array<{ district: string; level: CityTradeFitLevel }>;
    /** DERIVED from the `best` cell. Null where no district is marked best. */
    best: string | null;
  }>;
};

/**
 * Chapter 09.
 *
 * The best district per trade is DERIVED from the `best` cell rather than
 * authored twice, which is the same discipline as the chapter-07 slope: an
 * authored "best" boolean beside a grid of levels is two homes for one claim,
 * and one of them eventually goes stale.
 *
 * District names are joined from the district list, because the grid carries
 * slugs. A fit naming a district that is not in the list is dropped rather than
 * printed as a raw slug: `covent-garden` in a column header is the same class of
 * defect as the truncated trade labels this page type already shipped once.
 */
function buildTradeFit(file: CityFile): CityTradeFitModel | null {
  const tf = file.tradeFit;
  if (tf == null || isNullFigure(tf.grid)) return null;

  const list = isNullFigure(file.districts.list) ? [] : file.districts.list.districts;
  const nameBy = new Map(list.map((d) => [d.slug, d.name]));
  if (list.length === 0) return null;

  const rows = tf.grid.rows.map((r) => {
    const levels = r.fits
      .filter((f) => nameBy.has(f.districtSlug))
      .map((f) => ({ district: nameBy.get(f.districtSlug) as string, level: f.level }));
    const best = r.fits.find((f) => f.level === "best");
    return {
      tradeSlug: r.tradeSlug,
      tradeName: r.tradeName,
      levels,
      best: best ? (nameBy.get(best.districtSlug) ?? null) : null,
    };
  });

  if (!rows.length) return null;
  return { districts: list.map((d) => d.name), rows };
}

/* ------------------------ 11 where the city heads ------------------------ */

export type CityDirectionModel = {
  tiles: Array<{
    label: string;
    /** The measured change, sign included. Null where none is published. */
    change: string | null;
    /** "up" or "down". Printed only when there is no measured change. */
    direction: "up" | "down";
    caption: string;
  }>;
};

/**
 * Chapter 11.
 *
 * `direction` is printed ONLY when `change` is a hole. The contract carries the
 * field precisely because "a tile whose change is a NullFigure still knows which
 * way the thing is moving", and where a number exists its own sign already says
 * so. Printing both gives "down -22%", which is either a double negative or a
 * typo depending on how carefully the reader is looking.
 */
function buildDirection(file: CityFile): CityDirectionModel | null {
  const d = file.direction;
  if (d == null) return null;
  const tiles = [d.rent, d.footfall, d.emptyUnits, d.population].filter(Boolean).map((t) => {
    const shown = display(t.changePct);
    /* A RISE IS SIGNED. "Footfall 6%" reads as a share of something; "+6%"
       reads as the change it is. A fall already carries its own minus, so
       signing it twice would print "+-22%". */
    const change =
      shown != null && t.direction === "up" && /^\d/.test(shown) ? `+${shown}` : shown;
    return { label: t.label, change, direction: t.direction, caption: t.caption };
  });
  return tiles.length ? { tiles } : null;
}

/* ------------------------------ 12 the myths ----------------------------- */

export type CityMythsModel = {
  claim: string | null;
  reality: string | null;
  note: string | null;
  comparison: {
    tradeName: string;
    hereCity: string;
    peerCity: string;
    hereRevenue: string;
    peerRevenue: string;
    hereKeeps: string;
    peerKeeps: string;
    /** DERIVED. How much more revenue crosses the till here, as a percentage. */
    revenueGapPct: number | null;
    /** DERIVED. How much more the owner actually keeps. */
    keepsGapPct: number | null;
  } | null;
};

/**
 * Chapter 12.
 *
 * THE TWO GAPS ARE DERIVED AND THAT IS THE ENTIRE POINT OF THE CHAPTER. The
 * contract says they "are derived from these four numbers and have no fields",
 * and the myth only lands because the two percentages are so far apart: 63% more
 * revenue, 5% more kept. Authoring them would let a file state a gap its own
 * four numbers contradict, which is the myth telling a lie about itself.
 */
function buildMyths(file: CityFile): CityMythsModel | null {
  const m = file.myths;
  if (m == null) return null;

  const primary = isNullFigure(m.primary) ? null : m.primary;
  const tp = isNullFigure(m.tradeAgainstPeer) ? null : m.tradeAgainstPeer;

  const pct = (here: number, peer: number): number | null =>
    Number.isFinite(here) && Number.isFinite(peer) && peer !== 0
      ? Math.round(((here - peer) / peer) * 100)
      : null;

  const comparison = tp
    ? {
        tradeName: tp.tradeName,
        hereCity: file.meta.city.name,
        peerCity: tp.peer.city,
        hereRevenue: money(tp.here.revenue),
        peerRevenue: money(tp.peer.revenue),
        hereKeeps: money(tp.here.ownerKeeps),
        peerKeeps: money(tp.peer.ownerKeeps),
        revenueGapPct: pct(tp.here.revenue, tp.peer.revenue),
        keepsGapPct: pct(tp.here.ownerKeeps, tp.peer.ownerKeeps),
      }
    : null;

  if (primary == null && comparison == null) return null;
  return {
    claim: primary?.claim ?? null,
    reality: primary?.reality ?? null,
    note: m.note ?? null,
    comparison,
  };
}

/* ------------------------- 13 versus peer cities ------------------------- */

export type CityPeersModel = {
  rows: Array<{ city: string; value: string; isThisCity: boolean }>;
};

/**
 * Chapter 13.
 *
 * This city's own row is found BY SLUG, never by an authored flag, and it prints
 * "level" rather than "0%", because a city is not zero percent of itself. The
 * contract makes the same point about `citySlug` being an identifier rather than
 * an accent flag: an authored boolean can mark the wrong row and a slug match
 * cannot.
 */
function buildPeers(file: CityFile): CityPeersModel | null {
  const p = file.peers;
  if (p == null || isNullFigure(p.rent)) return null;
  const here = file.meta.city.slug;

  const rows = p.rent.cities.map((c) => {
    const isThisCity = c.citySlug === here;
    return {
      city: c.city,
      value: isThisCity ? "level" : `${c.rentVsThisCityPct > 0 ? "+" : ""}${c.rentVsThisCityPct}%`,
      isThisCity,
    };
  });
  return rows.length ? { rows } : null;
}

/* ---------------------------- 14 what to watch --------------------------- */

export type CityWatchModel = {
  pressures: Array<{ label: string; value: string; severity: number }>;
  localKnowledge: string[];
};

/**
 * Chapter 14.
 *
 * A pressure whose magnitude nobody publishes prints its WORD. The contract
 * carries `wordValue` for exactly this: licensing hours are getting "tighter",
 * which is a real and actionable direction, and inventing a percentage for it
 * would be the cleanest possible way to publish a number that does not exist.
 */
function buildWatch(file: CityFile): CityWatchModel | null {
  const w = file.watch;
  if (w == null) return null;

  const pressures = isNullFigure(w.pressures)
    ? []
    : w.pressures.pressures.map((p) => ({
        label: p.label,
        value: display(p.change) ?? p.wordValue ?? "no size published",
        severity: p.severity,
      }));

  const localKnowledge = isNullFigure(w.localKnowledge) ? [] : w.localKnowledge.lines;
  if (!pressures.length && !localKnowledge.length) return null;
  return { pressures, localKnowledge };
}

/* ------------------------- 15 what operators say ------------------------- */

export type CityVoicesModel = {
  quotes: Array<{
    quote: string;
    trade: string;
    district: string;
    /** The number beside the quote, or null where it cannot be labelled. */
    pull: string | null;
    /** What that number measures, in the file's own words. */
    pullNote: string | null;
  }>;
};

/**
 * What a pull number MEASURES, read from its unit.
 *
 * A UNIT OF BARE "%" RETURNS NULL AND THE NUMBER IS THEN NOT PRINTED AT ALL.
 * That is not tidiness. The London file carries a pull of 55 whose unit is "%"
 * and whose own note says the design "never says what it is a share of, so only
 * the number and the percent sign can be lifted". A bare 55% beside a quote
 * about tourists is a number a reader will attach to whatever the quote was
 * about, and they will be guessing. It is one of the unclassifiable figures
 * already sitting on the founder's desk, and the honest render of an unlabelled
 * number is no number.
 */
function pullNote(unit: string): string | null {
  const u = (unit ?? "").trim();
  if (u === "%" || u === "") return null;
  if (/^%\s+/.test(u)) return u.replace(/^%\s+/, "");
  if (/^USD\/yr$/i.test(u)) return "a year";
  if (/^USD/i.test(u)) return null; // the quote itself carries the context
  return u;
}

/** Chapter 15. */
function buildVoices(file: CityFile): CityVoicesModel | null {
  const v = file.voices;
  if (v == null || isNullFigure(v.operators)) return null;

  const quotes = v.operators.quotes.map((q) => {
    const note = isNullFigure(q.pull) ? null : pullNote((q.pull as PointFigure).unit);
    const unlabelled = !isNullFigure(q.pull) && note == null && /^%?$/.test(((q.pull as PointFigure).unit ?? "").trim());
    return {
      quote: q.quote,
      trade: q.trade,
      district: q.district,
      pull: unlabelled ? null : display(q.pull),
      pullNote: note,
    };
  });
  return quotes.length ? { quotes } : null;
}

/* ------------------------------ 16 the verdict --------------------------- */

export type CityVerdictModel = { text: string; chips: string[] };

/** Chapter 16. */
function buildVerdict(file: CityFile): CityVerdictModel | null {
  const v = file.verdict;
  if (v == null || !v.text) return null;
  return { text: v.text, chips: v.chips ?? [] };
}

/* -------------------------- 17 how we work it out ------------------------ */

export type CityMethodologyModel = {
  rows: Array<{ figure: string; tier: string; how: string }>;
  /** DERIVED counts for the trust band. */
  counts: { measured: number; built: number; thin: number };
};

/**
 * Chapter 17.
 *
 * The tier counts are COUNTED FROM THE ROWS, never authored. The contract says
 * so: "the trust band's tier counts (3 measured, 3 built, 2 thin) are counted
 * from these rows and have no fields of their own". A page that claims three
 * measured figures while listing two is the exact claim a reader is most
 * entitled to check, and the cheapest one to get wrong by hand.
 */
function buildMethodology(file: CityFile): CityMethodologyModel | null {
  const m = file.methodology;
  if (m == null || !m.rows?.length) return null;
  const counts = { measured: 0, built: 0, thin: 0 };
  for (const r of m.rows) {
    if (r.tier === "measured") counts.measured += 1;
    else if (r.tier === "built") counts.built += 1;
    else if (r.tier === "thin") counts.thin += 1;
  }
  return { rows: m.rows.map((r) => ({ figure: r.figure, tier: r.tier, how: r.how })), counts };
}

/* ----------------------- the closing "remember" band --------------------- */

export type CityRememberModel = {
  text: string;
  figure: string | null;
  figureLabel: string;
};

/**
 * Resolve a dotted path to the figure it names, e.g. "scorecard.commercialRent".
 *
 * A scorecard row is not itself a figure, it WRAPS one, so a path landing on a
 * row descends into `.figure`. Returns undefined rather than throwing on a path
 * that does not resolve, because a broken pointer must degrade to the authored
 * value rather than take the page down.
 */
function figureAt(file: CityFile, path: string): Figure | undefined {
  let node: unknown = file;
  for (const key of path.split(".")) {
    if (node == null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[key];
  }
  if (node != null && typeof node === "object" && "figure" in (node as object)) {
    node = (node as { figure: unknown }).figure;
  }
  return node as Figure | undefined;
}

/**
 * The closing band, between chapters 17 and 18.
 *
 * IT RESTATES A FIGURE PRINTED EARLIER AND MUST READ IT FROM THERE. The contract
 * is explicit: "the value must be copied from that field, never re-derived
 * independently", and `figureSource` names the field so a checker can prove the
 * two agree. Resolving the pointer is strictly better than checking it, because
 * then they cannot disagree in the first place. The authored value is the
 * fallback for a file whose pointer does not resolve.
 */
function buildRemember(file: CityFile): CityRememberModel | null {
  const r = file.remember;
  if (r == null || !r.text) return null;
  const pointed = r.figureSource ? figureAt(file, r.figureSource) : undefined;
  return {
    text: r.text,
    figure: display(pointed) ?? display(r.figure),
    figureLabel: r.figureLabel,
  };
}

/* ------------------------- 18 where to go next --------------------------- */

export type CityNextModel = {
  tiles: Array<{
    label: string;
    gloss: string;
    icon: string | null;
    /** Absent where the target page does not exist yet. */
    href: string | null;
  }>;
};

/**
 * Chapter 18.
 *
 * `gloss` BELONGS TO THE LINKED PAGE, not to this city, which is why the
 * contract carries it as an already-formatted string: it is read from another
 * file and this one has no authority over its unit or its tier. It is passed
 * through untouched rather than reformatted, because reformatting it here would
 * be this page asserting something about a figure it does not own.
 *
 * A tile with no href renders flat, which is what the mockup does for pages not
 * yet built. Inventing the URL would manufacture a dead link on 615 pages.
 */
function buildNext(file: CityFile): CityNextModel | null {
  const n = file.next;
  if (n == null || !n.tiles?.length) return null;
  return {
    tiles: n.tiles.map((t) => ({
      label: t.label,
      gloss: t.gloss,
      icon: t.icon ?? null,
      href: t.href ?? null,
    })),
  };
}

/** Chapter 05. See CityPeopleModel for why one figure in the file is skipped. */
function buildPeople(file: CityFile): CityPeopleModel | null {
  const p = file.people;
  if (p == null) return null;

  const bands = isNullFigure(p.wealthBands)
    ? []
    : p.wealthBands.bands.map((b) => ({ label: b.label, sharePct: b.sharePct }));

  const types = isNullFigure(p.archetypes)
    ? []
    : [...p.archetypes.types]
        .sort((a, b) => b.sharePct - a.sharePct)
        .map((a) => ({
          key: a.key,
          name: a.name,
          icon: a.icon ?? null,
          sharePct: a.sharePct,
          spendingPower: a.spendingPowerLabel,
          income: Number.isFinite(a.incomeAfterTax) ? money(a.incomeAfterTax) : null,
          ageRange: a.ageRange,
          tenure: a.tenure,
          buys: a.buys,
          favours: a.tradesThatIndexHigh,
          accent: a.accent === true,
        }));

  if (!bands.length && !types.length && isNullFigure(p.residents)) return null;

  return { residents: display(p.residents), bands, types };
}

/**
 * Chapter 10. Joins the district list with the wealth reading, the population
 * mix and the derived favoured trades. Each of the three is optional and
 * independently tiered, so a city with rents but no wealth reading still
 * renders every district and simply says less about each.
 */
function buildDistricts(file: CityFile): CityDistrictsModel | null {
  const d = file.districts;
  if (d == null || isNullFigure(d.list)) return null;

  const wealthRows = isNullFigure(d.wealth) ? [] : d.wealth.rows;
  const mixRows = isNullFigure(d.mix) ? [] : d.mix.rows;
  const archetypes = isNullFigure(file.people.archetypes) ? [] : file.people.archetypes.types;
  const archName = new Map(archetypes.map((a) => [a.key, a.name]));

  const wealthBy = new Map(wealthRows.map((r) => [r.districtSlug, r]));
  const mixBy = new Map(mixRows.map((r) => [r.districtSlug, r]));

  const rows: CityDistrictRowModel[] = d.list.districts.map((row) => {
    const w = wealthBy.get(row.slug);
    const m = mixBy.get(row.slug);
    return {
      slug: row.slug,
      name: row.name,
      blurb: row.blurb,
      icon: row.icon ?? null,
      rent: Number.isFinite(row.rentMultiple) ? `${row.rentMultiple.toFixed(1)}x` : null,
      resident: w ? (WEALTH_LABEL[w.resident] ?? null) : null,
      daytime: w ? (WEALTH_LABEL[w.daytime] ?? null) : null,
      mix: m ? m.top.map((t) => ({ name: archName.get(t.key) ?? t.key, sharePct: t.sharePct })) : [],
      scarce: m ? m.scarce.map((k) => archName.get(k) ?? k) : [],
      favours: m && archetypes.length ? favouredTrades(m, archetypes) : [],
    };
  });

  /* Decision 4: one quiet line, once, where it matters. It appears only when
     something behind the section is not a measurement, so a city with real
     readings is not made to apologise for them. */
  const approximate =
    (!isNullFigure(d.wealth) && d.wealth.tier !== "measured") ||
    (!isNullFigure(d.mix) && d.mix.tier !== "measured");

  return {
    rows,
    note: approximate
      ? "Wealth and population readings here are approximate. They place a district against its own city, and cannot be compared with a district in another city."
      : null,
  };
}

/**
 * Chapter 05, the population types. This is POPs, ratified 2026-06-22 and named
 * by the founder as one of the most important upgrades the site has.
 *
 * It was already fully described in the contract and fully filled in the
 * fixture, and it still rendered as a stated gap, which is the worst of both:
 * the work was done and nobody could see it.
 *
 * `millionaireHouseholds` is deliberately NOT surfaced. The founder cut it by
 * name: it is evasive next to the other figures, and a count of millionaires
 * tells someone opening a cafe nothing they can act on. It stays in the file
 * because the file describes the city; the page decides what is worth printing.
 */
export type CityArchetypeModel = {
  key: string;
  name: string;
  icon: string | null;
  sharePct: number;
  spendingPower: string;
  /** After tax, per year. Null when unpriced. */
  income: string | null;
  ageRange: string;
  tenure: string;
  buys: string[];
  favours: string[];
  accent: boolean;
};

export type CityTradeEconomicsModel = {
  rows: Array<{
    tradeSlug: string;
    tradeName: string;
    revenue: string;
    ownerKeeps: string;
    costToOpen: string;
    fromCell: boolean;
  }>;
  /** How many rows came from a reconciled cell file. */
  reconciled: number;
};

export type CityPeopleModel = {
  residents: string | null;
  /** The wealth spread, in the file's own order, poorest first. */
  bands: Array<{ label: string; sharePct: number }>;
  /** Population types, largest share first. */
  types: CityArchetypeModel[];
};

export type CityPageModel = {
  meta: {
    city: string;
    citySlug: string;
    country: string;
    countrySlug: string;
    urlPath: string;
  };
  chapters: CityChapter[];
  hero: CityHeroModel | null;
  scorecard: CityScorecardModel | null;
  incomeAndWealth: CityIncomeAndWealthModel | null;
  visitors: CityVisitorsModel | null;
  people: CityPeopleModel | null;
  spaceCosts: CitySpaceCostsModel | null;
  tradeEconomics: CityTradeEconomicsModel | null;
  districtRent: CityDistrictRentModel | null;
  tradeFit: CityTradeFitModel | null;
  districts: CityDistrictsModel | null;
  direction: CityDirectionModel | null;
  myths: CityMythsModel | null;
  peers: CityPeersModel | null;
  watch: CityWatchModel | null;
  voices: CityVoicesModel | null;
  verdict: CityVerdictModel | null;
  methodology: CityMethodologyModel | null;
  next: CityNextModel | null;
  /** The unnumbered closing band, between chapters 17 and 18. Not a chapter, so
   *  it has no entry in the spine and no number. */
  remember: CityRememberModel | null;
};

/**
 * "8th of 40 cities" , the qualifier beside the business-climate reading.
 *
 * Typed against `CityRankFigure` rather than cast through unknown shapes: the
 * rank and its denominator are a pair, and a rank printed without the size of
 * the field it ranks in is close to meaningless. Returns undefined when the
 * city has no rank, and the row then prints without a qualifier rather than
 * with an empty one.
 */
function rankSub(f: CityRankFigure | NullFigure): string | undefined {
  if (isNullFigure(f as Figure)) return undefined;
  const r = f as CityRankFigure;
  if (typeof r.rank !== "number" || typeof r.of !== "number") return undefined;
  return `${ordinal(r.rank)} of ${r.of}`;
}

/** 1 -> 1st, 2 -> 2nd, 11 -> 11th. The teens are the reason this is a function. */
function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  const rem10 = n % 10;
  return `${n}${rem10 === 1 ? "st" : rem10 === 2 ? "nd" : rem10 === 3 ? "rd" : "th"}`;
}

const row = (r: CityScorecardRow): CityScorecardRowModel => ({
  label: r.label,
  sub: r.sub,
  value: display(r.figure),
  position: r.position,
});

export function buildCityPage(file: CityFile): CityPageModel {
  const m = file.meta;

  /* The hero's headline is the same quantity as the scorecard's spend row. The
     contract says so explicitly and says the hero slot exists only for cities
     whose answer is a different number, so we prefer the hero's own figure and
     fall back to the scorecard rather than printing two different values for
     one fact. */
  const headline =
    display(file.hero.headline) ?? display(file.scorecard.spendPerResident.figure);

  const hero: CityHeroModel | null = headline
    ? {
        city: m.city.name,
        country: m.country.name,
        headline,
        headlineLabel: file.hero.headlineLabel,
        glance: [
          {
            label: "Business climate",
            sub: rankSub(file.hero.businessClimateRank),
            value: display(file.scorecard.businessClimate.figure),
          },
          { label: "Commercial rent", value: display(file.scorecard.commercialRent.figure) },
          { label: "Median pay", value: display(file.scorecard.medianPay.figure) },
          { label: "Visitors", value: display(file.scorecard.visitors.figure) },
        ],
      }
    : null;

  const scorecard: CityScorecardModel = {
    baselineLabel: file.scorecard.baselineLabel,
    rows: [
      row(file.scorecard.spendPerResident),
      row(file.scorecard.medianPay),
      row(file.scorecard.costOfLiving),
      row(file.scorecard.commercialRent),
      row(file.scorecard.visitors),
      row(file.scorecard.unemployment),
      row(file.scorecard.businessClimate),
    ],
  };

  return {
    meta: {
      city: m.city.name,
      citySlug: m.city.slug,
      country: m.country.name,
      countrySlug: m.country.slug,
      urlPath: m.urlPath,
    },
    chapters: numberCityChapters(),
    hero,
    scorecard,
    incomeAndWealth: buildIncomeAndWealth(file),
    visitors: buildVisitors(file),
    people: buildPeople(file),
    spaceCosts: buildSpaceCosts(file),
    tradeEconomics: buildTradeEconomics(file),
    districtRent: buildDistrictRent(file),
    tradeFit: buildTradeFit(file),
    districts: buildDistricts(file),
    direction: buildDirection(file),
    myths: buildMyths(file),
    peers: buildPeers(file),
    watch: buildWatch(file),
    voices: buildVoices(file),
    verdict: buildVerdict(file),
    methodology: buildMethodology(file),
    next: buildNext(file),
    remember: buildRemember(file),
  };
}

export type { NullFigure };
