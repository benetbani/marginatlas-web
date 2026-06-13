/**
 * city_view.ts - the city page view model.
 *
 * Maps the figures the city page already holds (the city record, the country
 * economics snapshot for the country it sits in, and the city's single 0-100
 * Business Climate Score) into the Atlas Page Kit's section props, in the
 * content-map reading order for a CITY page:
 *
 *   1. Masthead + the city score
 *   2. The honest take (the through-line)
 *   3. Who the local customer is: spending power
 *   4. What shop and office space costs: commercial-rent character
 *   5. Tourist money vs local money: the visitor-vs-resident split (ALWAYS)
 *   6. What an owner keeps across the everyday trades (the page owns the table)
 *   7. The best areas to set up (the page owns the neighbourhood grid)
 *   8. Neighbourhoods (the page owns the grid)
 *   9. How the city is changing: a real trend or honest self-omit
 *   10. Rival + peer cities (the page owns CityPeers)
 *
 * Pure data, no React, so the page stays a thin renderer. Heavy wiring (the
 * ranked activities, the peer cities, the neighbourhood grid, the signature
 * panel) is left in the page; this lib shapes only the kit-rendered bands.
 *
 * The contract the founder set for this round:
 *   - London is the ONE fully-filled exemplar. The curated London market
 *     dataset is rich (per-trade rent pressure, survival, demand drivers, chain
 *     share), so the London city fills every band, inventing the few specifics
 *     the dataset does not carry (the spending-power spread, the rent-character
 *     reads, the changing-city trend). This is explicitly sanctioned for London
 *     only.
 *   - Everywhere else: real data where it exists, honest self-omit otherwise.
 *     The masthead, the spending-power band, the rent character (from the
 *     cost-of-living index), and the tourist-vs-local split fill from real
 *     figures; the invented London editorial stays off. Never a fake number,
 *     never a wall of dashes.
 *   - Cities are the ONE scored entity. The /100 climate score leads the
 *     masthead, but when the board is thin (a lighter-coverage city) the view
 *     softens it: the score is demoted to a quiet stat rather than the anchor.
 *
 * Every field is nullable and self-omitting; the kit renders nothing for a null.
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import type { NumberFormatSpec } from "@/components/kit/numberFormat";
import type { BreakInBand } from "@/lib/scores/break_in_rating";

/* ----------------------------- output shape ----------------------------- */

export type CityViewMasthead = {
  /** Coordinate eyebrow: the country name (no category at this altitude). */
  eyebrow: string;
  title: string;
  answer: string | null;
  /** The anchor: the Business Climate Score, shown as the lead number when the
   * board is rich enough to carry it; null on a thin city (the score then sits
   * in the quiet stat row instead, softened). */
  anchor: { label: string; value: number; format: NumberFormatSpec } | null;
  /** The quiet supporting stat row (population, salary, climate when softened). */
  stats: Array<{ label: string; value: string | null }>;
  /** Confidence tier chip. */
  tier: "deep" | "good" | "starter" | "modeled";
  /** The climate band word, demoted to the break-in chip slot. */
  climateChip: string | null;
};

/** One spending-power figure, value pre-formatted to a display string. */
export type CityStat = { label: string; value: string; hint?: string };

export type CityView = {
  masthead: CityViewMasthead;
  honestTake: { verdict: string; points: string[]; body: string | null } | null;
  /** Who the local customer is: the spending-power facts, in plain terms. */
  customer: {
    stats: CityStat[];
    /** A real income distribution across the metro, when one exists (London). */
    incomeSpread: {
      p10: number;
      p25: number | null;
      p50: number;
      p75: number | null;
      p90: number;
    } | null;
    note: string | null;
  } | null;
  /** What space costs: the commercial-rent character read. */
  space: { verdict: string; body: string | null; stats: CityStat[] } | null;
  /** Tourist money vs local money: the visitor-vs-resident split. ALWAYS set. */
  visitorSplit: {
    /** Share of street demand from visitors, 0..100, when estimable. */
    visitorPct: number | null;
    headline: string;
    body: string | null;
    /** The two-row "where the spending comes from" read, per 100 of footfall. */
    items: Array<{ label: string; perHundred: number; kept?: boolean; hint?: string }> | null;
  };
  /** How the city is changing: a real direction, or null (honest self-omit). */
  changing: { verdict: string; body: string | null; points: string[] } | null;
  isLondon: boolean;
};

/* ------------------------------- inputs --------------------------------- */

export type CityViewInput = {
  citySlug: string;
  cityName: string;
  countryName: string;
  /** Tier-1 flagship cities carry the most real figures; lighter elsewhere. */
  tier: number;
  /** Metro resident population, in millions. */
  popM: number | null;
  /** Metro average gross salary, USD per year. */
  avgGrossSalaryUsdYear: number | null;
  /** Cost-of-living index (a leading metro indexes to 100). */
  costOfLivingIndex: number | null;
  /** Annual tourist arrivals, in millions (a footfall proxy). */
  touristArrivalsM: number | null;
  /** Country self-employment share, percent (0..100). */
  selfEmploymentPct: number | null;
  /** Country average gross monthly salary, USD (income fallback). */
  avgMonthlySalary: number | null;
  /** National median net wealth per adult, USD (shown as a city estimate). */
  netWealthPerAdult: number | null;
  /** The city's single 0-100 Business Climate Score, or null when unscorable. */
  cityScore: { score: number; band: BreakInBand } | null;
  /** Whether the curated London market dataset backs this city (London only). */
  hasLondonMarket: boolean;
};

/* ------------------------------ helpers --------------------------------- */

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
function usd(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
function usdFull(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
function climateWordLocal(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "an excellent place to start";
    case "manageable":
      return "a good place to start";
    case "demanding":
      return "a fair place to start";
    case "brutal":
      return "a hard place to start";
  }
}

/* ---------------------------- the builder ------------------------------- */

export function buildCityView(input: CityViewInput): CityView {
  const {
    cityName,
    countryName,
    tier,
    popM,
    avgGrossSalaryUsdYear,
    costOfLivingIndex,
    touristArrivalsM,
    avgMonthlySalary,
    netWealthPerAdult,
    cityScore,
  } = input;

  const isLondon = input.hasLondonMarket && input.citySlug === "london";

  // A "rich board" carries enough real demand figures to lead the masthead with
  // the score as the anchor. A thin city softens: the score drops to a quiet
  // stat and the masthead leads on the place, not a confident /100.
  const richBoard = tier === 1 && cityScore != null && isNum(popM);

  // Income: the city's own annual gross salary, falling back to the country's
  // annualised monthly figure (the same precedence the board and score use).
  const cityYearly = isNum(avgGrossSalaryUsdYear) ? avgGrossSalaryUsdYear : null;
  const countryYearly = isNum(avgMonthlySalary) ? avgMonthlySalary * 12 : null;
  const incomeYearly = cityYearly ?? countryYearly;
  const incomeMonthly = isNum(incomeYearly) ? incomeYearly / 12 : null;

  // Net wealth per citizen, scaled by the city's income premium over its country
  // (the same estimate the board prints), so the two never disagree. Clamped.
  const wealthFactor =
    isNum(cityYearly) && isNum(countryYearly) && countryYearly > 0
      ? Math.max(0.5, Math.min(2.5, cityYearly / countryYearly))
      : 1;
  const cityNetWealth = isNum(netWealthPerAdult)
    ? Math.round((netWealthPerAdult * wealthFactor) / 1000) * 1000
    : null;

  /* -- masthead ------------------------------------------------------- */
  const tierWord: CityViewMasthead["tier"] = tier === 1 ? "good" : "modeled";

  const title = cityScore
    ? `${cityName} is ${climateWordLocal(cityScore.band)} a small business.`
    : `What it is like to run a small business in ${cityName}.`;

  const answer = buildAnswer(input, isLondon, richBoard);

  const climateChip =
    cityScore && !richBoard ? `Business Climate Score ${cityScore.score}/100` : null;

  const stats: CityViewMasthead["stats"] = [
    {
      label: "Metro population",
      value: isNum(popM)
        ? popM >= 1
          ? `${popM.toFixed(1)}M`
          : `${Math.round(popM * 1_000_000).toLocaleString("en-US")}`
        : null,
    },
    {
      label: "Average salary",
      value: isNum(incomeMonthly) ? `${usd(incomeMonthly)}/mo` : null,
    },
    {
      label: "Annual visitors",
      value: isNum(touristArrivalsM) ? `${touristArrivalsM.toFixed(0)}M` : null,
    },
  ];
  // On a thin city the score is softened into the quiet row rather than the
  // anchor, so it is still present but no longer shouts a confident /100.
  if (cityScore && !richBoard) {
    stats.unshift({ label: "Climate score", value: `${cityScore.score}/100` });
  }

  const masthead: CityViewMasthead = {
    eyebrow: countryName,
    title,
    answer,
    anchor:
      richBoard && cityScore
        ? { label: "Business Climate Score, out of 100", value: cityScore.score, format: "int" }
        : null,
    stats,
    tier: tierWord,
    climateChip,
  };

  /* -- honest take ---------------------------------------------------- */
  const honestTake = buildHonestTake(input, isLondon);

  /* -- who the local customer is -------------------------------------- */
  const customer = buildCustomer(input, isLondon, {
    incomeMonthly,
    incomeYearly,
    cityNetWealth,
  });

  /* -- what space costs ----------------------------------------------- */
  const space = buildSpace(input, isLondon);

  /* -- tourist vs local (ALWAYS) -------------------------------------- */
  const visitorSplit = buildVisitorSplit(input, isLondon);

  /* -- how the city is changing (London only; honest self-omit else) -- */
  const changing = isLondon ? londonChanging() : null;

  return {
    masthead,
    honestTake,
    customer,
    space,
    visitorSplit,
    changing,
    isLondon,
  };
}

/** The sticky-nav sections that will actually render, in reading order. The
 * page adds the data-owned sections (owners-keep, best-areas, neighbourhoods,
 * peers) it renders itself, and StickySectionNav drops any dead anchor on
 * mount, so the two never disagree. */
export function cityViewNav(view: CityView): Array<{ id: string; label: string }> {
  const nav: Array<{ id: string; label: string }> = [{ id: "headline", label: "Overview" }];
  if (view.honestTake) nav.push({ id: "honest-take", label: "The honest take" });
  if (view.customer) nav.push({ id: "customer", label: "The local customer" });
  if (view.space) nav.push({ id: "space", label: "What space costs" });
  nav.push({ id: "visitors", label: "Tourist vs local" });
  return nav;
}

/* --------------------------- derivations -------------------------------- */

function buildAnswer(
  input: CityViewInput,
  isLondon: boolean,
  richBoard: boolean,
): string | null {
  const { cityName, costOfLivingIndex, cityScore } = input;
  if (isLondon) {
    return "A deep, wealthy, well-visited market, but a costly one. The demand is real and the spend is high; the rent and the wages are what decide whether you keep any of it.";
  }
  if (!richBoard) {
    return `We hold a lighter set of figures for ${cityName}, so read this as a starting picture of the market rather than a measured local count.`;
  }
  const dear = isNum(costOfLivingIndex) && costOfLivingIndex >= 75;
  const cheap = isNum(costOfLivingIndex) && costOfLivingIndex <= 45;
  if (cityScore && dear) {
    return "A deep market, but a dear one. The customers are here; holding the space is what costs you.";
  }
  if (cityScore && cheap) {
    return "A forgiving cost base for a new operator, so the question is whether the local market is deep enough to fill the room.";
  }
  if (cityScore) {
    return "A workable market for a small business, as long as the costs are kept in line with what local customers will spend.";
  }
  return null;
}

function buildHonestTake(
  input: CityViewInput,
  isLondon: boolean,
): CityView["honestTake"] {
  const { cityName, costOfLivingIndex, selfEmploymentPct, cityScore } = input;
  if (isLondon) {
    return {
      verdict:
        "London rewards the operator who treats rent as the first line of the plan, not an afterthought.",
      points: [
        "Spending power is high and broad, so a strong offer finds its customers.",
        "Holding space is the single heaviest cost, and the best sites rarely reach the open market.",
        "Visitors thicken the trade in the centre, but the steady money is the residents and the office workers.",
      ],
      body: "The headline is a deep, wealthy market. The catch is that the same depth that fills your room also bids up the rent on it, so the businesses that last here are the ones priced and sited for that from day one.",
    };
  }
  if (!cityScore) {
    return {
      verdict: `We do not yet hold enough local figures to read ${cityName} confidently.`,
      points: [],
      body: "What you see here is the broad shape of the market from the figures we do hold. Treat it as directional until a fuller local read lands, rather than a measured local count.",
    };
  }
  const dear = isNum(costOfLivingIndex) && costOfLivingIndex >= 70;
  const crowded = isNum(selfEmploymentPct) && selfEmploymentPct >= 30;
  const verdict = dear
    ? `In ${cityName} the cost of holding space decides more than the idea does.`
    : crowded
      ? `In ${cityName} the market is busy with small operators, so a clear, structured offer stands out.`
      : `In ${cityName} a disciplined small business has a real, workable market to sell into.`;
  return { verdict, points: [], body: null };
}

function buildCustomer(
  input: CityViewInput,
  isLondon: boolean,
  derived: {
    incomeMonthly: number | null;
    incomeYearly: number | null;
    cityNetWealth: number | null;
  },
): CityView["customer"] {
  const { incomeMonthly, incomeYearly, cityNetWealth } = derived;
  const stats: CityStat[] = [];
  if (isNum(incomeMonthly))
    stats.push({
      label: "Average pay each month",
      value: usd(incomeMonthly),
      hint: "Gross, before tax. The everyday spending base.",
    });
  if (isNum(cityNetWealth))
    stats.push({
      label: "Net wealth per adult",
      value: usd(cityNetWealth),
      hint: "What a typical adult is worth, estimated for this city.",
    });
  if (stats.length === 0) return null;

  // A real income distribution across the metro. We only hold a defensible
  // spread for the London exemplar (sanctioned invented-but-plausible); every
  // other city shows the figures it has without a fabricated band.
  let incomeSpread: NonNullable<CityView["customer"]>["incomeSpread"] = null;
  if (isLondon && isNum(incomeYearly)) {
    const m = incomeYearly;
    incomeSpread = {
      p10: Math.round(m * 0.42),
      p25: Math.round(m * 0.64),
      p50: Math.round(m * 0.88),
      p75: Math.round(m * 1.35),
      p90: Math.round(m * 2.2),
    };
  }

  const note = isLondon
    ? "Pay is high, but it spreads wide: a large lower-paid service workforce sits under a thick band of high earners in finance, tech, and the professions. A neighbourhood can swing the spending base more than the city average suggests."
    : "These are the broad spending figures we hold for the metro. A neighbourhood can sit well above or below them.";

  return { stats, incomeSpread, note };
}

function buildSpace(
  input: CityViewInput,
  isLondon: boolean,
): CityView["space"] {
  const { cityName, costOfLivingIndex } = input;
  if (isLondon) {
    return {
      verdict: "Space is the expensive part, and the gap between a prime pitch and a side street is enormous.",
      body: "A high-street unit in the centre commands some of the steepest rents anywhere, and the best sites change hands quietly before they reach an agent. A street over, or a floor up, the numbers change completely. Negotiate the rent-free fit-out period; the headline rent rarely moves.",
      stats: [
        { label: "Cost of living index", value: "75", hint: "Where a leading global metro sits at 100. London runs hot." },
        { label: "Prime vs fringe rent", value: "3 to 5x", hint: "A central pitch over a quiet side street, same floor area." },
      ],
    };
  }
  if (!isNum(costOfLivingIndex)) return null;
  const dear = costOfLivingIndex >= 75;
  const moderate = costOfLivingIndex >= 50;
  const verdict = dear
    ? `Holding commercial space in ${cityName} is expensive, so the rent line drives the plan.`
    : moderate
      ? `Commercial space in ${cityName} sits at a middling cost, neither cheap nor punishing.`
      : `Commercial space in ${cityName} is relatively affordable, which is forgiving for a new operator.`;
  const body =
    "We read the cost of holding space off the cost-of-living index, where a leading global metro sits at 100. We do not yet hold street-level commercial rents for this city, so treat this as the broad cost character rather than a quoted rent.";
  return {
    verdict,
    body,
    stats: [
      {
        label: "Cost of living index",
        value: `${Math.round(costOfLivingIndex)}`,
        hint: "Where a leading global metro sits at 100.",
      },
    ],
  };
}

function buildVisitorSplit(
  input: CityViewInput,
  isLondon: boolean,
): CityView["visitorSplit"] {
  const { cityName, touristArrivalsM, popM } = input;

  if (isLondon) {
    return {
      visitorPct: 28,
      headline: "Visitors thicken the centre, but residents and office workers are the steady money.",
      body: "Sixteen million arrivals a year fill the central pitches and lift the summer and December trade. Step out of the tourist core and the customer is local: people who live and work here, who come back through the slow months a visitor never sees. Build for the residents; let the visitors be the upside.",
      items: [
        { label: "Residents and office workers", perHundred: 72, kept: true, hint: "the year-round base" },
        { label: "Visitors", perHundred: 28, hint: "concentrated in the centre and the peak months" },
      ],
    };
  }

  // A rough visitor share from arrivals against population (a footfall proxy,
  // not a spend figure), banded so a thin estimate never prints a false split.
  let visitorPct: number | null = null;
  if (isNum(touristArrivalsM) && isNum(popM) && popM > 0) {
    const ratio = touristArrivalsM / popM;
    visitorPct = Math.round(Math.max(8, Math.min(45, ratio * 14)));
  }

  const heavy = visitorPct != null && visitorPct >= 30;
  const headline =
    visitorPct == null
      ? `In ${cityName} the customer is mostly local, with visitors a smaller share of the trade.`
      : heavy
        ? `${cityName} draws heavily on visitors, so the central pitches live and die on footfall.`
        : `In ${cityName} the steady money is local; visitors lift the centre but are not the base.`;
  const body =
    "We read the visitor share off annual arrivals against the resident population, a footfall proxy rather than a spend figure. The split tells you how much of your trade depends on people passing through versus people who live here and come back.";
  const items =
    visitorPct != null
      ? [
          {
            label: "Residents and workers",
            perHundred: 100 - visitorPct,
            kept: true,
            hint: "the year-round base",
          },
          { label: "Visitors", perHundred: visitorPct, hint: "a footfall proxy from annual arrivals" },
        ]
      : null;

  return { visitorPct, headline, body, items };
}

/* ----------------------- London invented specifics ---------------------- */
// Sanctioned for London only (founder): plausible, internally consistent
// editorial where the dataset does not carry a measured figure.

function londonChanging(): NonNullable<CityView["changing"]> {
  return {
    verdict: "The centre of gravity keeps drifting east, and the high street keeps reinventing what it sells.",
    body: "Two real directions shape where a new operator should look. The eastern districts that were warehouses a generation ago now carry the city's fastest-growing food, design, and tech trade, which is where rents have climbed hardest and footfall has followed. At the same time the traditional retail high street has thinned, and the units that survive lean on experience, food, and services that a screen cannot replace.",
    points: [
      "The eastern districts carry the fastest-growing independent trade, and the steepest rent rises with it.",
      "Pure retail keeps giving ground to food, services, and experience on the high street.",
      "Hybrid working has shifted weekday footfall out of the financial core and toward the residential neighbourhoods.",
    ],
  };
}

/* ------------------------- shared formatters ---------------------------- */
// Exported so the page renders the spread and the money split with the same
// formatting the view assumes, without re-deriving it.

export const cityFmtUsd = usd;
export const cityFmtUsdFull = usdFull;
