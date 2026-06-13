/**
 * cell_view.ts - the business/cell page view model.
 *
 * Maps a resolved cell (plus its curated London entry, break-even, margins, and
 * peers) into the Atlas Page Kit's section props, in the content-map reading
 * order. Pure data, no React, so the page stays a thin renderer.
 *
 * The contract the founder set for this round:
 *   - London is the ONE fully-filled exemplar. When a curated London entry is
 *     present (GB cells), every section fills, deriving rich editorial from the
 *     structured London fields and inventing the few specifics the dataset does
 *     not carry (role wages, the tangible units, the editorial beats). This is
 *     explicitly sanctioned for London only.
 *   - Everywhere else: real data where it exists, honest self-omit otherwise.
 *     The masthead, the honest take, the money split, break-even, and the
 *     like-for-like peers fill from real figures; the invented editorial beats
 *     stay off. Never a fake number, never a wall of dashes.
 *
 * Every field is nullable and self-omitting; the kit renders nothing for a null.
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import type { Cell } from "@/lib/cells";
import type { LondonEntry } from "@/lib/scores/cell_board";
import type { NumberFormatSpec } from "@/components/kit/numberFormat";

/* ----------------------------- output shape ----------------------------- */

export type CellViewMasthead = {
  title: string;
  answer: string | null;
  anchor: { label: string; value: number; format: NumberFormatSpec } | null;
  spread: {
    p10: number | null;
    p25: number | null;
    p50: number | null;
    p75: number | null;
    p90: number | null;
  } | null;
  stats: Array<{ label: string; value: string | null }>;
  breakIn: string | null;
  tier: "deep" | "good" | "starter" | "modeled";
};

export type CellView = {
  masthead: CellViewMasthead;
  honestTake: { verdict: string; points: string[]; body: string | null } | null;
  narrative: string | null;
  moneyGoes: Array<{ label: string; perHundred: number; kept?: boolean; hint?: string }> | null;
  plainTerms: Array<{ label: string; value: string; hint?: string }> | null;
  breakEven: { headline: string; detail: string | null } | null;
  wages: Array<{ role: string; low?: number; median?: number; high?: number }> | null;
  seasonality: { monthly: number[] | null; note: string | null } | null;
  firstYear: { headline: string | null; bullets: string[] } | null;
  nearby: Array<{ name: string; href: string; value: number | null; sub?: string | null }> | null;
  whatLocals: string[] | null;
  contrarian: { insight: string; body: string | null } | null;
  myths: Array<{ myth: string; reality: string }> | null;
  rightWrong: { rightFor: string[]; wrongFor: string[] } | null;
  gutCheck: string[] | null;
  isLondon: boolean;
};

/* ------------------------------- inputs --------------------------------- */

export type CellViewInput = {
  cell: Cell;
  londonEntry: LondonEntry | null;
  placeName: string;
  tradeName: string;
  /** Lowercased single-noun for the trade, e.g. "restaurant". */
  tradeNoun: string;
  /** The URL industry slug (for building peer hrefs). */
  industrySlug: string;
  typicalRevenue: number | null;
  netMarginPct: number | null; // 0..100
  ownerTakeHome: number | null;
  firms: number | null;
  breakInRating: number | null;
  isTrustedLocal: boolean;
  costStructure: { cogs: number; labor: number; rent: number; other: number } | null;
  breakevenOrdersDaily: number | null;
  typicalOrdersDaily: number | null;
  employees: number | null;
  wagePerEmployee: number | null;
  /** Like-for-like peers (same trade, comparable places, same country). */
  peers: Array<{ name: string; href: string; value: number | null }>;
  narrative: string | null;
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
function pctWord(s: string | null): string {
  return (s ?? "").toLowerCase();
}

/** The tangible unit a day for a trade (covers, cuts, jobs, ...). */
function dailyUnit(slug: string): string {
  if (/restaurant|cafe|coffee|bar|food|bakery|grocery/.test(slug)) return "covers";
  if (/hair|barber|nail|salon/.test(slug)) return "appointments";
  if (/auto|repair|clean|trade|dental|vet|childcare/.test(slug)) return "jobs";
  if (/hotel|lodging/.test(slug)) return "room nights";
  return "orders";
}

/* ---------------------------- the builder ------------------------------- */

export function buildCellView(input: CellViewInput): CellView {
  const {
    cell,
    londonEntry: L,
    placeName,
    tradeName,
    tradeNoun,
    typicalRevenue,
    netMarginPct,
    ownerTakeHome,
    firms,
    breakInRating,
    isTrustedLocal,
    costStructure,
    breakevenOrdersDaily,
    typicalOrdersDaily,
    employees,
    peers,
    narrative,
    industrySlug,
  } = input;

  const isLondon = !!L?.economics;
  const slug = cell.industry_id ? cell.industry_id.replace(/_/g, "-") : "";
  const hrefFor = (citySlug: string) =>
    industrySlug ? `/gb/${citySlug}/${industrySlug}` : "#";
  const moneyShown = isLondon || isTrustedLocal; // revenue/take-home are real

  /* -- masthead ------------------------------------------------------- */
  const tier: CellViewMasthead["tier"] = isLondon
    ? "good"
    : isTrustedLocal
      ? "good"
      : "modeled";

  const title =
    moneyShown && isNum(ownerTakeHome)
      ? `A ${placeName} ${tradeNoun} clears about ${usd(ownerTakeHome)} for its owner in a normal year.`
      : `What a ${tradeNoun} in ${placeName} really earns.`;

  // Spread: London derives its band from the modeled revenue the way the board
  // does; elsewhere use the cell's measured percentiles, only when money shows.
  let spread: CellViewMasthead["spread"] = null;
  if (isLondon && isNum(typicalRevenue)) {
    const r = typicalRevenue;
    spread = { p10: r * 0.5, p25: r * 0.72, p50: r, p75: r * 1.35, p90: r * 1.8 };
  } else if (moneyShown && isNum(cell.rev_p10) && isNum(cell.rev_p90)) {
    spread = {
      p10: cell.rev_p10 ?? null,
      p25: cell.rev_p25 ?? null,
      p50: cell.rev_p50 ?? typicalRevenue ?? null,
      p75: cell.rev_p75 ?? null,
      p90: cell.rev_p90 ?? null,
    };
  }

  const answer = buildAnswerLine(input, isLondon, moneyShown);

  const stats: CellViewMasthead["stats"] = [
    { label: "Net margin", value: isNum(netMarginPct) ? `${Math.round(netMarginPct)}%` : null },
    {
      label: "Owner take-home",
      value: moneyShown && isNum(ownerTakeHome) ? usd(ownerTakeHome) : null,
    },
    {
      label: `Firms in ${placeName}`,
      value: moneyShown && isNum(firms) ? Math.round(firms).toLocaleString("en-US") : null,
    },
  ];

  const breakIn = breakInPhrase(breakInRating);

  const masthead: CellViewMasthead = {
    title,
    answer,
    anchor:
      moneyShown && isNum(typicalRevenue)
        ? { label: "Typical revenue a year", value: typicalRevenue, format: "usd-full" }
        : null,
    spread,
    stats,
    breakIn,
    tier,
  };

  /* -- honest take ---------------------------------------------------- */
  const honestTake = buildHonestTake(input, isLondon, moneyShown);

  /* -- money goes (per $100) ----------------------------------------- */
  // London fills a plausible cost split when the cell carries none (sanctioned);
  // elsewhere the section only shows when a real cost structure exists.
  const csForMoney = costStructure ?? (isLondon ? londonCostStructure(slug) : null);
  const moneyGoes = buildMoneyGoes(csForMoney, netMarginPct);

  /* -- plain terms ---------------------------------------------------- */
  const plainTerms = buildPlainTerms(slug, typicalOrdersDaily, typicalRevenue, employees);

  /* -- break-even ----------------------------------------------------- */
  const breakEven =
    isNum(breakevenOrdersDaily) && breakevenOrdersDaily > 0
      ? {
          headline: `You cover your costs at about ${Math.round(
            breakevenOrdersDaily,
          )} ${dailyUnit(slug)} a day.`,
          detail:
            isNum(typicalOrdersDaily) && typicalOrdersDaily > breakevenOrdersDaily
              ? `A typical operator runs nearer ${Math.round(
                  typicalOrdersDaily,
                )} a day, so the gap above break-even is where the owner's pay comes from.`
              : "Below that line the rent and the salaried staff eat the month; above it, the marginal sale is mostly margin.",
        }
      : null;

  /* -- London-only filled sections ----------------------------------- */
  const wages = isLondon ? londonWages(slug) : null;
  const seasonality = isLondon && L ? londonSeasonality(L.seasonality) : null;
  const firstYear = buildFirstYear(L, isLondon);
  const whatLocals = isLondon && L ? londonLocals(slug, L) : null;
  const contrarian = isLondon ? londonContrarian(slug, tradeNoun) : null;
  const myths = isLondon ? londonMyths(slug) : null;
  const rightWrong = isLondon && L ? londonRightWrong(L) : null;

  /* -- gut check (generic, honest anywhere) -------------------------- */
  const gutCheck = buildGutCheck(input, slug);

  /* -- same business nearby (like-for-like peers) -------------------- */
  let nearby: CellView["nearby"] = null;
  if (moneyShown && peers.length > 0) {
    nearby = peers
      .filter((p) => p.name)
      .slice(0, 6)
      .map((p) => ({ name: p.name, href: p.href, value: p.value }));
  } else if (isLondon && isNum(typicalRevenue)) {
    // London exemplar: comparable UK cities (one country, comparable prices),
    // scaled from the London figure. Invented for the exemplar (sanctioned).
    const r = typicalRevenue;
    nearby = [
      { name: "Manchester", href: hrefFor("manchester"), value: Math.round(r * 0.7), sub: "lower rent, thinner spend" },
      { name: "Edinburgh", href: hrefFor("edinburgh"), value: Math.round(r * 0.82) },
      { name: "Birmingham", href: hrefFor("birmingham"), value: Math.round(r * 0.68) },
      { name: "Bristol", href: hrefFor("bristol"), value: Math.round(r * 0.78) },
    ];
  }

  return {
    masthead,
    honestTake,
    narrative: isLondon ? null : narrative, // London leads with its own honest take
    moneyGoes,
    plainTerms,
    breakEven,
    wages,
    seasonality,
    firstYear,
    nearby: nearby && nearby.length > 0 ? nearby : null,
    whatLocals,
    contrarian,
    myths,
    rightWrong,
    gutCheck,
    isLondon,
  };
}

/** The sticky-nav sections that will actually render, in reading order. The
 * page passes this to StickySectionNav, which additionally drops any id whose
 * anchor is missing on mount, so the two never disagree. */
export function cellViewNav(
  view: CellView,
  hasStartupCost: boolean,
): Array<{ id: string; label: string }> {
  const nav: Array<{ id: string; label: string }> = [{ id: "headline", label: "Overview" }];
  if (view.honestTake) nav.push({ id: "honest-take", label: "The honest take" });
  if (view.narrative) nav.push({ id: "narrative", label: "In context" });
  if (view.plainTerms) nav.push({ id: "plain-terms", label: "In plain terms" });
  if (view.moneyGoes) nav.push({ id: "money", label: "Where the money goes" });
  if (view.breakEven) nav.push({ id: "break-even", label: "Break-even" });
  if (view.wages) nav.push({ id: "wages", label: "Pay by role" });
  if (hasStartupCost) nav.push({ id: "startup-cost", label: "Cost to open" });
  if (view.seasonality) nav.push({ id: "seasonality", label: "Through the year" });
  if (view.firstYear) nav.push({ id: "first-year", label: "Your first year" });
  if (view.nearby) nav.push({ id: "nearby", label: "Nearby" });
  if (view.whatLocals) nav.push({ id: "locals", label: "What locals know" });
  if (view.contrarian) nav.push({ id: "contrarian", label: "Against the grain" });
  if (view.myths) nav.push({ id: "myths", label: "Myth vs reality" });
  if (view.rightWrong) nav.push({ id: "fit", label: "Who it suits" });
  if (view.gutCheck) nav.push({ id: "gut-check", label: "Gut check" });
  return nav;
}

/* --------------------------- derivations -------------------------------- */

function breakInPhrase(rating: number | null): string | null {
  if (!isNum(rating)) return null;
  if (rating >= 67) return "Easier to break into";
  if (rating >= 40) return "Doable to break into";
  return "Hard to break into";
}

function buildAnswerLine(
  input: CellViewInput,
  isLondon: boolean,
  moneyShown: boolean,
): string | null {
  const { netMarginPct, ownerTakeHome, londonEntry: L } = input;
  if (!moneyShown) {
    return "These figures are modeled from national patterns, not a local count, so read them as a starting point rather than a measured local number.";
  }
  const thin = isNum(netMarginPct) && netMarginPct <= 8;
  if (isLondon && L) {
    const rentHigh = /high/i.test(L.rent_pressure);
    const laborHigh = /high/i.test(L.labor_pressure);
    if (thin && (rentHigh || laborHigh)) {
      return "Strong revenue, thin take-home. The rent and the wages decide it, not the dining room.";
    }
  }
  if (thin) {
    return "Healthy revenue, slim margin. What the owner keeps depends on costs staying disciplined.";
  }
  if (isNum(ownerTakeHome)) {
    return "A real business with a real owner's wage in it, as long as the costs are kept in line.";
  }
  return null;
}

function buildHonestTake(
  input: CellViewInput,
  isLondon: boolean,
  moneyShown: boolean,
): CellView["honestTake"] {
  const { placeName, tradeNoun, netMarginPct, londonEntry: L } = input;
  if (isLondon && L) {
    const rentHigh = /high/i.test(L.rent_pressure);
    const laborHigh = /high/i.test(L.labor_pressure);
    const thin = isNum(netMarginPct) && netMarginPct <= 8;
    const verdict =
      thin && (rentHigh || laborHigh)
        ? `The headline revenue is real, but a ${placeName} ${tradeNoun} is a wages-and-rent business, not a high-margin one.`
        : `A ${placeName} ${tradeNoun} can pay its owner well, but only with the costs held tight.`;
    const points: string[] = [];
    if (rentHigh) points.push("Rent in London takes a bigger bite here than almost anywhere else in the country.");
    if (laborHigh) points.push("Skilled staff are hard to keep and the wage floor keeps rising.");
    if (/strong/i.test(L.pricing_power))
      points.push("Pricing power is real, customers will pay up for the right room, which is the lever that makes the model work.");
    if (L.demand_drivers?.length)
      points.push(`Demand leans on ${L.demand_drivers.slice(0, 3).join(", ").toLowerCase()}, so the site and the footfall matter as much as the food.`);
    return { verdict, points: points.slice(0, 4), body: null };
  }
  if (!moneyShown) {
    return {
      verdict: `We do not yet hold a local measurement for ${tradeNoun}s in ${placeName}.`,
      points: [],
      body: "What you see here is modeled from the national pattern for this trade. The shape (how the money splits, where it is fragile) holds; the exact local dollars do not, so treat them as directional until a local read lands.",
    };
  }
  // Trusted non-London: a derived, honest line from the margin shape.
  const thin = isNum(netMarginPct) && netMarginPct <= 8;
  return {
    verdict: thin
      ? `A ${tradeNoun} in ${placeName} runs on a thin margin, so cost discipline is the whole game.`
      : `A ${tradeNoun} in ${placeName} can pay its owner a real wage when it is run tightly.`,
    points: [],
    body: null,
  };
}

function buildMoneyGoes(
  cs: { cogs: number; labor: number; rent: number; other: number } | null,
  netMarginPct: number | null,
): CellView["moneyGoes"] {
  if (!cs || !isNum(netMarginPct)) return null;
  const net = Math.max(0, Math.min(60, netMarginPct));
  const costsTotal = 100 - net;
  const sum = cs.cogs + cs.labor + cs.rent + cs.other;
  if (!(sum > 0) || costsTotal <= 0) return null;
  const scale = costsTotal / sum;
  const items = [
    { label: "Cost of goods", perHundred: cs.cogs * scale },
    { label: "Payroll", perHundred: cs.labor * scale, hint: "wages and on-costs" },
    { label: "Rent and premises", perHundred: cs.rent * scale },
    { label: "Everything else", perHundred: cs.other * scale },
    { label: "What the owner keeps", perHundred: net, kept: true as const },
  ].filter((it) => it.perHundred >= 0.5);
  return items.length >= 2 ? items : null;
}

function buildPlainTerms(
  slug: string,
  ordersDaily: number | null,
  revenue: number | null,
  employees: number | null,
): CellView["plainTerms"] {
  const out: Array<{ label: string; value: string; hint?: string }> = [];
  if (isNum(ordersDaily) && ordersDaily > 0) {
    out.push({
      label: `${dailyUnit(slug).replace(/^\w/, (c) => c.toUpperCase())} a day`,
      value: `about ${Math.round(ordersDaily)}`,
    });
    if (isNum(revenue) && revenue > 0) {
      const perOrder = revenue / (ordersDaily * 312);
      if (perOrder >= 1 && perOrder < 100000)
        out.push({ label: "Average spend each", value: usd(perOrder) });
    }
  }
  if (isNum(employees) && employees >= 1)
    out.push({ label: "People on the payroll", value: `${Math.round(employees)}` });
  return out.length >= 2 ? out : null;
}

function buildFirstYear(L: LondonEntry | null, isLondon: boolean): CellView["firstYear"] {
  if (!isLondon || !L) return null;
  const yr1 = L.survival?.yr1;
  const bullets: string[] = [];
  bullets.push("Most of the build cost lands before a single customer is served.");
  if (isNum(yr1))
    bullets.push(`About ${Math.max(0, Math.round(100 - yr1))} in 100 close inside the first year, so the early months are the dangerous ones.`);
  bullets.push("A new room takes a season to fill, longer without a name people already know.");
  return {
    headline: "Plan to run at a loss for the first months, and fund it before you open.",
    bullets,
  };
}

function buildGutCheck(input: CellViewInput, slug: string): string[] | null {
  const { breakevenOrdersDaily } = input;
  const unit = dailyUnit(slug);
  const qs = [
    "Can you cover six months of rent and wages before the revenue arrives?",
  ];
  if (isNum(breakevenOrdersDaily) && breakevenOrdersDaily > 0)
    qs.push(`Are you confident of clearing ${Math.round(breakevenOrdersDaily)} ${unit} a day from the first season?`);
  qs.push("Would the numbers still work if takings came in a fifth under plan?");
  return qs.length >= 2 ? qs : null;
}

/* ----------------------- London invented specifics ---------------------- */
// Sanctioned for London only (founder): plausible, internally consistent
// numbers and editorial where the dataset does not carry them.

function londonCostStructure(
  slug: string,
): { cogs: number; labor: number; rent: number; other: number } {
  // Plausible cost splits by trade family (shares of total cost). buildMoneyGoes
  // scales these to (100 - net), so only the proportions matter.
  if (/restaurant|cafe|coffee|bar|food|bakery/.test(slug))
    return { cogs: 32, labor: 36, rent: 16, other: 16 };
  if (/grocery|specialty-retail|retail/.test(slug))
    return { cogs: 62, labor: 18, rent: 12, other: 8 };
  if (/hair|barber|nail|salon/.test(slug))
    return { cogs: 12, labor: 52, rent: 22, other: 14 };
  if (/auto|repair|trade|clean/.test(slug))
    return { cogs: 34, labor: 42, rent: 12, other: 12 };
  if (/dental|vet|childcare|accounting|marketing|design/.test(slug))
    return { cogs: 14, labor: 56, rent: 16, other: 14 };
  if (/hotel|lodging/.test(slug))
    return { cogs: 18, labor: 38, rent: 28, other: 16 };
  return { cogs: 28, labor: 40, rent: 18, other: 14 };
}

function londonWages(slug: string): CellView["wages"] {
  const food = /restaurant|cafe|coffee|bar|food|bakery/.test(slug);
  const salon = /hair|barber|nail|salon/.test(slug);
  const trade = /auto|repair|clean|trade|dental|vet/.test(slug);
  if (food)
    return [
      { role: "Head chef", low: 48000, median: 60000, high: 78000 },
      { role: "Server", low: 26000, median: 31000, high: 38000 },
      { role: "Kitchen porter", median: 24000 },
    ];
  if (salon)
    return [
      { role: "Senior stylist", low: 30000, median: 38000, high: 50000 },
      { role: "Stylist", low: 24000, median: 29000, high: 36000 },
      { role: "Junior", median: 22000 },
    ];
  if (trade)
    return [
      { role: "Lead technician", low: 38000, median: 46000, high: 58000 },
      { role: "Technician", low: 28000, median: 34000, high: 42000 },
      { role: "Apprentice", median: 22000 },
    ];
  return [
    { role: "Manager", low: 34000, median: 42000, high: 54000 },
    { role: "Skilled worker", low: 26000, median: 32000, high: 40000 },
    { role: "Junior", median: 22000 },
  ];
}

function londonSeasonality(note: string): CellView["seasonality"] {
  // Derive a 12-month shape from keywords in the curated note, so the bars and
  // the sentence agree.
  const n = note.toLowerCase();
  const base = [0.78, 0.74, 0.84, 0.88, 0.92, 0.96, 0.9, 0.88, 0.92, 0.94, 0.86, 1.0];
  if (/quiet january|slow january/.test(n)) base[0] = 0.62;
  if (/summer/.test(n)) {
    base[5] = 1.0;
    base[6] = 0.98;
    base[7] = 0.96;
  }
  if (/december/.test(n)) base[11] = 1.0;
  return { monthly: base, note };
}

function londonLocals(slug: string, L: LondonEntry): string[] {
  const out: string[] = [];
  if (/high/i.test(L.rent_pressure))
    out.push("The good sites change hands quietly, before they ever reach an agent's window.");
  out.push("Rent-free fit-out periods are negotiable; the headline rent rarely is.");
  if (L.chain_share_pct >= 25)
    out.push(`Chains hold about ${Math.round(L.chain_share_pct)} in 100 of the market, so an independent competes on the thing they cannot copy.`);
  if (/food|restaurant|cafe|coffee|bar/.test(slug))
    out.push("Footfall on a street can halve one block over; walk it at the hour you would trade before you sign.");
  return out.slice(0, 4);
}

function londonContrarian(slug: string, tradeNoun: string): CellView["contrarian"] {
  if (/restaurant|cafe|coffee|bar|food/.test(slug))
    return {
      insight: `The second site, not the first, is where a London ${tradeNoun} owner actually makes money.`,
      body: "The first pays for the learning. The brand, the suppliers, and the team only pay off when they are spread across more than one room.",
    };
  return {
    insight: `In London the location decision outweighs almost everything else about a ${tradeNoun}.`,
    body: "A weaker operator on the right street beats a stronger one on the wrong one, because footfall is the input you cannot buy back later.",
  };
}

function londonMyths(slug: string): CellView["myths"] {
  const food = /restaurant|cafe|coffee|bar|food/.test(slug);
  return [
    food
      ? { myth: "A great chef guarantees a great business.", reality: "A great landlord deal does more for the bottom line than a star review." }
      : { myth: "Being the best at the craft guarantees the business works.", reality: "The site and the rent deal decide more of the outcome than the skill does." },
    { myth: "Higher prices always mean higher profit.", reality: "Above the local ceiling, customers fall away faster than the margin rises." },
  ];
}

function londonRightWrong(L: LondonEntry): CellView["rightWrong"] {
  const rightFor: string[] = ["You can fund a slow first year without drawing a wage"];
  const wrongFor: string[] = ["You need a salary from month one"];
  if (/high/i.test(L.labor_pressure)) {
    rightFor.push("You can build and keep a skilled team");
    wrongFor.push("You expect to run it without reliable staff");
  }
  if (/strong/i.test(L.pricing_power)) rightFor.push("You can hold a premium position rather than chase volume");
  wrongFor.push("You are buying yourself a job, not a business");
  return { rightFor, wrongFor };
}
