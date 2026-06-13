/**
 * country_view.ts - the country landing-page view model.
 *
 * Maps a resolved country (its economics snapshot, small-business tax regime,
 * sales tax, employer payroll rate, registration cost, plus a small set of
 * already-resolved neighbour facts) into the Atlas Page Kit's section props, in
 * the content-map reading order (page-content-map COUNTRY PAGE). Pure data, no
 * React, so the page stays a thin renderer.
 *
 * The contract the founder set for this round:
 *   - The United Kingdom is the ONE fully-filled exemplar. For GB this lib
 *     invents plausible, internally-consistent figures the dataset does not
 *     carry (a wage floor, a typical payroll line, the hiring read, the
 *     character beats). This is explicitly sanctioned for the UK only.
 *   - Everywhere else: real data where it exists, honest self-omit otherwise.
 *     The masthead, the decisive read, the hire read, and the neighbour table
 *     fill from real figures; the invented beats stay off. Never a fake number,
 *     never a wall of dashes.
 *
 * The neighbour comparison is the page's biggest gap and reason to exist. It is
 * always like-for-like FACTS only (tax / pay / setup), never a money rank across
 * borders, so the kit table is handed noLeaderMark. The lib carries only a
 * curated neighbour-grouping (country codes), never neighbour data: the page
 * resolves each neighbour's real facts and hands them in.
 *
 * Every field is nullable and self-omitting; the kit renders nothing for a null.
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import type { CountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import type { SmbRegime, VatRow } from "@/lib/tax/smb_effective_rates";
import type { NumberFormatSpec } from "@/components/kit/numberFormat";

/* ----------------------------- output shape ----------------------------- */

export type CountryViewMasthead = {
  eyebrow: string;
  title: string;
  answer: string | null;
  anchor: { label: string; value: number; format: NumberFormatSpec } | null;
  /** Self-omits in the kit when the core points are missing. */
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

/** A decisive-read step: a fact + its plain meaning. */
export type DecisiveStep = {
  label: string;
  value: string;
  hint?: string;
};

export type CountryView = {
  masthead: CountryViewMasthead;
  /** The consolidated decisive read: tax + register + payroll + time-to-start. */
  decisive: {
    heading: string;
    lede: string | null;
    steps: DecisiveStep[];
    salesTaxNote: string | null;
    /** Down-link to a specific business for the after-tax math. */
    downLink: { label: string; href: string } | null;
  } | null;
  honestTake: { verdict: string; points: string[]; body: string | null } | null;
  /** How hard to hire: staff cost + typical pay + wage floor. */
  hire: {
    heading: string;
    lede: string | null;
    points: string[];
    /** Pay tracks for the kit WageRangeTracks, when real figures exist. */
    payNote: string | null;
  } | null;
  /** The like-for-like neighbour FACTS table (kit LikeForLikeTable rows). */
  neighbours: {
    heading: string;
    lede: string;
    columns: Array<{ key: string; label: string; sub?: string }>;
    rows: Array<{
      label: string;
      hint?: string;
      cells: Record<string, string | null>;
    }>;
    footnote: string;
  } | null;
  /** The character beats, UK-only invented detail. */
  whatLocals: string[] | null;
  contrarian: { insight: string; body: string | null } | null;
  isExemplar: boolean;
};

/* ------------------------------- inputs --------------------------------- */

/** A neighbour country with its already-resolved, page-loaded facts. */
export type NeighbourFacts = {
  iso2: string;
  name: string;
  /** Effective small-business tax burden, decimal (0.2 = 20%), or null. */
  smbRate: number | null;
  /** Employer payroll / social-contribution rate, decimal, or null. */
  payrollRate: number | null;
  /** Typical one-time government cost to register (USD), or null. */
  registrationCostUsd: number | null;
  /** Typical days to register and start trading, or null. */
  daysToStart: number | null;
  /** Average gross monthly salary, USD, or null. */
  avgMonthlySalary: number | null;
};

export type CountryViewInput = {
  iso2: string;
  countryName: string;
  snapshot: CountryEconomicsSnapshot;
  regime: SmbRegime | null;
  vat: VatRow | null;
  /** Employer payroll / social-contribution rate, decimal, or null. */
  payrollRate: number | null;
  /** Typical one-time government cost to register (USD), or null. */
  registrationCostUsd: number | null;
  /** The densest local activity + its cell-page href, for the down-link. */
  topActivity: { name: string; href: string } | null;
  /** This country's own facts, packaged for the neighbour table's lead column. */
  selfFacts: NeighbourFacts;
  /** Neighbour countries with their resolved facts (the page resolves these). */
  neighbours: NeighbourFacts[];
};

/* ----------------------- curated neighbour groups ----------------------- */
// Country codes only (never data): a few genuinely comparable neighbours per
// country, so a side-by-side FACTS read is honest and like-for-like. Comparable
// means same broad region and economic weight, not merely bordering. The page
// resolves each neighbour's real figures; codes absent here get no table.

export const NEIGHBOUR_GROUPS: Record<string, string[]> = {
  GB: ["IE", "FR", "DE", "NL"],
  IE: ["GB", "FR", "NL", "DE"],
  FR: ["DE", "ES", "IT", "BE"],
  DE: ["FR", "NL", "AT", "PL"],
  NL: ["BE", "DE", "FR", "GB"],
  BE: ["NL", "FR", "DE", "LU"],
  ES: ["PT", "FR", "IT", "GR"],
  PT: ["ES", "FR", "IT", "IE"],
  IT: ["FR", "ES", "AT", "GR"],
  AT: ["DE", "CH", "IT", "CZ"],
  CH: ["DE", "AT", "FR", "IT"],
  PL: ["CZ", "DE", "SK", "HU"],
  CZ: ["PL", "SK", "AT", "DE"],
  SK: ["CZ", "HU", "PL", "AT"],
  HU: ["CZ", "SK", "PL", "RO"],
  RO: ["HU", "BG", "PL", "GR"],
  BG: ["RO", "GR", "RS", "HU"],
  GR: ["IT", "BG", "RO", "ES"],
  SE: ["NO", "DK", "FI", "NL"],
  NO: ["SE", "DK", "FI", "NL"],
  DK: ["SE", "NO", "DE", "NL"],
  FI: ["SE", "NO", "DK", "EE"],
  US: ["CA", "GB", "AU", "MX"],
  CA: ["US", "GB", "AU", "FR"],
  AU: ["NZ", "GB", "CA", "SG"],
  NZ: ["AU", "GB", "CA", "SG"],
  JP: ["KR", "SG", "TW", "HK"],
  KR: ["JP", "TW", "SG", "HK"],
  SG: ["HK", "MY", "TH", "JP"],
  HK: ["SG", "TW", "JP", "KR"],
  TW: ["KR", "JP", "HK", "SG"],
  MY: ["TH", "SG", "ID", "PH"],
  TH: ["MY", "VN", "ID", "PH"],
  VN: ["TH", "MY", "ID", "PH"],
  ID: ["MY", "TH", "PH", "VN"],
  PH: ["ID", "TH", "MY", "VN"],
  IN: ["ID", "VN", "TH", "MY"],
  MX: ["BR", "CO", "CL", "US"],
  BR: ["MX", "AR", "CO", "CL"],
  AR: ["BR", "CL", "UY", "MX"],
  CL: ["AR", "CO", "PE", "MX"],
  CO: ["MX", "CL", "PE", "BR"],
  PE: ["CL", "CO", "BR", "MX"],
  AE: ["SA", "QA", "SG", "IL"],
  SA: ["AE", "EG", "IL", "QA"],
  IL: ["AE", "SA", "EG", "GR"],
  ZA: ["KE", "NG", "EG", "MA"],
  NG: ["ZA", "KE", "EG", "MA"],
  KE: ["ZA", "NG", "EG", "MA"],
  EG: ["SA", "MA", "ZA", "IL"],
  MA: ["EG", "ZA", "ES", "TN"],
};

/* ------------------------------ helpers --------------------------------- */

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
function usdCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
function pctWord(decimal: number): string {
  const pct = decimal * 100;
  if (Math.abs(pct - Math.round(pct)) < 0.1) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1)}%`;
}
function daysWord(days: number): string {
  const n = Math.round(days);
  if (n <= 1) return "1 day";
  if (n <= 14) return `${n} days`;
  if (n <= 60) return `about ${Math.round(n / 7)} weeks`;
  return `about ${Math.round(n / 30)} months`;
}

/** Tier from the registry letter the page already knows. */
function tierForQuality(q: string | null): CountryViewMasthead["tier"] {
  switch (q) {
    case "A":
      return "deep";
    case "B":
      return "good";
    case "C":
      return "starter";
    default:
      return "modeled";
  }
}

/* ---------------------------- the builder ------------------------------- */

export function buildCountryView(
  input: CountryViewInput,
  quality: string | null,
): CountryView {
  const {
    iso2,
    countryName,
    snapshot,
    regime,
    vat,
    payrollRate,
    registrationCostUsd,
    selfFacts,
    neighbours,
  } = input;

  const isExemplar = iso2 === "GB";
  const tier = isExemplar ? "good" : tierForQuality(quality);

  /* -- masthead ------------------------------------------------------- */
  // The one anchor that matters for a country: the typical small-business tax
  // burden (the charge that actually lands on an owner), when known. It is a
  // real, like-for-like-safe number, unlike raw money which cannot be ranked.
  const anchor =
    regime != null
      ? {
          label: "Typical small-business tax",
          value: Math.round(regime.effective_rate * 100),
          format: "percent" as NumberFormatSpec,
        }
      : null;

  const eyebrow = `Small-business economics · ${countryName}`;
  const title = isExemplar
    ? "What it really takes to run a small business in the United Kingdom."
    : `What it takes to run a small business in ${countryName}.`;

  const answer = buildAnswer(input, isExemplar);

  const stats: CountryViewMasthead["stats"] = [
    // The "typical monthly pay" stat was removed from the masthead: the
    // economics-snapshot salary is a GDP-share heuristic that is unreliable at
    // both ends (it printed ~$16-22/month on thin-coverage countries and a
    // London-weighted ~$5K/month on the UK that contradicted the hire box). The
    // hiring read below carries pay where we can defend it.
    {
      label: "Time to register",
      value: isNum(snapshot.daysToStart) ? daysWord(snapshot.daysToStart) : null,
    },
    {
      label: "Self-employed share",
      value: isNum(snapshot.selfEmploymentPct)
        ? `${Math.round(snapshot.selfEmploymentPct)}%`
        : null,
    },
  ];

  const masthead: CountryViewMasthead = {
    eyebrow,
    title,
    answer,
    anchor,
    spread: null, // a country has no single revenue distribution to plot
    stats,
    breakIn: null,
    tier,
  };

  /* -- decisive read -------------------------------------------------- */
  const decisive = buildDecisive(input);

  /* -- honest take (unconditional) ------------------------------------ */
  const honestTake = buildHonestTake(input, isExemplar);

  /* -- how hard to hire ----------------------------------------------- */
  const hire = buildHire(input, isExemplar);

  /* -- compare to neighbours (like-for-like facts) -------------------- */
  const neighboursView = buildNeighbours(selfFacts, neighbours, countryName);

  /* -- character beats (exemplar-only invented detail) ---------------- */
  const whatLocals = isExemplar ? exemplarLocals() : null;
  const contrarian = isExemplar ? exemplarContrarian() : null;

  return {
    masthead,
    decisive,
    honestTake,
    hire,
    neighbours: neighboursView,
    whatLocals,
    contrarian,
    isExemplar,
  };
}

/** The sticky-nav sections that will actually render, in reading order. The
 * page passes this to StickySectionNav, which additionally drops any id whose
 * anchor is missing on mount, so the two never disagree. */
export function countryViewNav(
  view: CountryView,
  hasFormation: boolean,
  hasBreakIn: boolean,
  hasCities: boolean,
): Array<{ id: string; label: string }> {
  const nav: Array<{ id: string; label: string }> = [
    { id: "hero", label: "Overview" },
  ];
  if (view.decisive) nav.push({ id: "decisive", label: "The decisive read" });
  if (view.honestTake) nav.push({ id: "honest-take", label: "The honest take" });
  if (view.hire) nav.push({ id: "hire", label: "Hiring here" });
  if (hasFormation) nav.push({ id: "formation", label: "Cost to open" });
  if (view.neighbours) nav.push({ id: "neighbours", label: "Vs neighbours" });
  if (hasBreakIn) nav.push({ id: "break-in", label: "Easiest to start" });
  if (hasCities) nav.push({ id: "cities", label: "Cities" });
  if (view.whatLocals) nav.push({ id: "locals", label: "What locals know" });
  if (view.contrarian) nav.push({ id: "contrarian", label: "Against the grain" });
  nav.push({ id: "character", label: "Character" });
  nav.push({ id: "related", label: "Compare" });
  return nav;
}

/* --------------------------- derivations -------------------------------- */

function buildAnswer(input: CountryViewInput, isExemplar: boolean): string | null {
  const { snapshot, regime, vat } = input;
  if (isExemplar) {
    return "A stable place to set up and a fast one to register, but the wage floor and the payroll on-cost decide what an owner actually keeps, not the headline tax.";
  }
  const totalTax = (regime?.effective_rate ?? 0) + (vat?.standard ?? 0);
  const heavy = regime != null && vat != null && totalTax >= 0.4;
  const fast =
    isNum(snapshot.daysToStart) && snapshot.daysToStart <= 7;
  if (regime != null && fast && !heavy) {
    return "Quick to register and a manageable tax load, so the real question is whether the local customer can pay the price you need.";
  }
  if (heavy) {
    return "The tax load is real, so the numbers only work above a genuine revenue threshold, not at hobby scale.";
  }
  if (regime != null) {
    return "The country sets the conditions; the activity and the address decide whether a given business clears a wage.";
  }
  return null;
}

function buildDecisive(input: CountryViewInput): CountryView["decisive"] {
  const { countryName, regime, vat, payrollRate, registrationCostUsd, snapshot, topActivity } =
    input;
  const steps: DecisiveStep[] = [];

  if (regime != null) {
    steps.push({
      label: "Business tax",
      value: pctWord(regime.effective_rate),
      hint: `${regime.local_name}. ${regime.notes}`,
    });
  }

  const hasCost = isNum(registrationCostUsd) && registrationCostUsd >= 0;
  const hasDays = isNum(snapshot.daysToStart) && snapshot.daysToStart > 0;
  if (hasCost || hasDays) {
    const value = hasCost
      ? registrationCostUsd === 0
        ? "Free"
        : usdCompact(registrationCostUsd!)
      : daysWord(snapshot.daysToStart!);
    const hint =
      hasCost && hasDays
        ? `The government fee to register, and about ${daysWord(
            snapshot.daysToStart!,
          )} to be trading. Professional fees on top vary widely.`
        : hasCost
          ? "The government fee to register. Professional fees on top vary widely."
          : `About ${daysWord(snapshot.daysToStart!)} to register and start trading.`;
    steps.push({ label: "Cost to register", value, hint });
  }

  if (isNum(payrollRate) && payrollRate > 0) {
    steps.push({
      label: "Payroll on staff",
      value: pctWord(payrollRate),
      hint: "The employer social contribution on top of every gross wage. It sets the real cost of hiring beyond the salary.",
    });
  }

  if (hasDays) {
    steps.push({
      label: "Time to get going",
      value: daysWord(snapshot.daysToStart!),
      hint: "Registration to legally trading. The paperwork, not the fit-out or the first customer.",
    });
  }

  if (steps.length < 2) return null;

  const salesTaxNote =
    vat != null && vat.standard > 0
      ? `Sales tax (${vat.local_name}) adds ${pctWord(
          vat.standard,
        )} on top of the price, but the customer carries it, so it is not the owner's burden.`
      : null;

  return {
    heading: `Setting up and running a ${countryName} business`,
    lede: "The charges that actually land on an owner: the tax on what the business earns, the cost and time to register, and the payroll tax on every employee.",
    steps,
    salesTaxNote,
    downLink: topActivity
      ? {
          label: `See what ${topActivity.name.toLowerCase()} typically keep after tax`,
          href: topActivity.href,
        }
      : null,
  };
}

function buildHonestTake(
  input: CountryViewInput,
  isExemplar: boolean,
): CountryView["honestTake"] {
  const { countryName, regime, vat, snapshot } = input;

  if (isExemplar) {
    return {
      verdict:
        "The United Kingdom is an easy place to start and a hard place to keep staff cheaply.",
      points: [
        "Registering a sole trader is quick and nearly free; the real cost arrives with the first hire.",
        "The wage floor rises most years, so a low-pay model has a shrinking runway.",
        "Rent in the strong locations takes a bigger bite than the tax does.",
      ],
      body: "Most owners draw a wage closer to a senior employee than a business owner in year one, and the upside is in scale, a second site or a second van, not in the first.",
    };
  }

  // Everywhere else: an honest, derived line. The 185 thin-coverage countries get
  // a plain admission instead of the old shared anchor paragraph.
  const hasFacts =
    regime != null ||
    isNum(snapshot.daysToStart) ||
    isNum(snapshot.avgMonthlySalary);

  if (!hasFacts) {
    return {
      verdict: `Coverage for ${countryName} is still thin.`,
      points: [],
      body: "We hold the broad shape of the market here, not a measured local read yet. Treat what follows as a direction rather than a benchmark, and open a specific activity for the numbers that do exist.",
    };
  }

  const totalTax = (regime?.effective_rate ?? 0) + (vat?.standard ?? 0);
  const heavy = regime != null && vat != null && totalTax >= 0.4;
  const saturated =
    isNum(snapshot.selfEmploymentPct) && snapshot.selfEmploymentPct >= 45;

  let verdict: string;
  if (saturated) {
    verdict = `${countryName} is a crowded market, so the activity and the location matter more than the country.`;
  } else if (heavy) {
    verdict = `${countryName} carries a real tax load, so the numbers only work above a genuine revenue threshold.`;
  } else {
    verdict = `${countryName} sets the conditions, but the operator and the address decide whether a business clears a wage.`;
  }
  return { verdict, points: [], body: null };
}

function buildHire(
  input: CountryViewInput,
  isExemplar: boolean,
): CountryView["hire"] {
  const { countryName, snapshot, payrollRate } = input;

  if (isExemplar) {
    return {
      heading: "How hard it is to hire in the United Kingdom",
      lede: "Staff are the largest controllable cost in most small businesses here. The floor is set by law and rises most years; the real rate is set by what it takes to keep someone good.",
      points: [
        "The wage floor for an adult worker runs about $13 an hour, near $25,000 a year full-time.",
        "Typical pay for a skilled hand sits well above that, around $33,000 a year.",
        "On top of the gross wage the employer adds roughly 14% in payroll on-costs.",
        "Skilled staff are hard to keep, so the headline floor is rarely the rate you actually pay.",
      ],
      payNote: null,
    };
  }

  // Plausibility floor: the GDP-share salary heuristic produces visibly-wrong
  // sub-$250/month "typical pay" on thin-coverage economies (it printed ~$16/mo
  // for Uganda, ~$22/mo for Nepal). No formal-sector job pays that, so below the
  // floor we self-omit the pay line rather than print a fabricated-low wage; the
  // payroll on-cost line still renders where a real rate exists.
  const hasSalary =
    isNum(snapshot.avgMonthlySalary) && snapshot.avgMonthlySalary >= 250;
  const hasPayroll = isNum(payrollRate) && payrollRate > 0;
  if (!hasSalary && !hasPayroll) return null;

  const points: string[] = [];
  if (hasSalary) {
    const yearly = snapshot.avgMonthlySalary! * 12;
    points.push(
      `Typical pay runs about ${usdCompact(
        snapshot.avgMonthlySalary!,
      )} a month, near ${usdCompact(yearly)} a year, before on-costs.`,
    );
  }
  if (hasPayroll) {
    points.push(
      `On top of the gross wage the employer adds roughly ${pctWord(
        payrollRate!,
      )} in payroll on-costs.`,
    );
  }
  points.push(
    "The wage floor and how easily you can find skilled people decide the real cost of a hire here, not the headline rate.",
  );

  return {
    heading: `How hard it is to hire in ${countryName}`,
    lede: "Staff are the largest controllable cost in most small businesses. What you pay, plus what the employer adds on top, sets the real cost of a hire.",
    points,
    payNote: null,
  };
}

function buildNeighbours(
  self: NeighbourFacts,
  neighbours: NeighbourFacts[],
  countryName: string,
): CountryView["neighbours"] {
  const valid = neighbours.filter((n) => n && n.iso2 && n.name);
  if (valid.length < 1) return null;

  const all = [self, ...valid];
  const columns = all.map((n) => ({
    key: n.iso2.toLowerCase(),
    label: n.iso2 === self.iso2 ? countryName : n.name,
  }));

  // Each row is a FACT, formatted per column. Display strings only; the kit gets
  // noLeaderMark from the page so nothing is crowned across price regimes.
  const taxRow = {
    label: "Business tax",
    hint: "Typical small-business rate",
    cells: cellMap(all, (n) => (isNum(n.smbRate) ? pctWord(n.smbRate) : null)),
  };
  const payrollRow = {
    label: "Payroll on staff",
    hint: "Employer social on-cost",
    cells: cellMap(all, (n) =>
      isNum(n.payrollRate) ? pctWord(n.payrollRate) : null,
    ),
  };
  const registerRow = {
    label: "Cost to register",
    cells: cellMap(all, (n) =>
      isNum(n.registrationCostUsd)
        ? n.registrationCostUsd === 0
          ? "Free"
          : usdCompact(n.registrationCostUsd)
        : null,
    ),
  };
  const daysRow = {
    label: "Time to register",
    cells: cellMap(all, (n) =>
      isNum(n.daysToStart) ? daysWord(n.daysToStart) : null,
    ),
  };
  const payRow = {
    label: "Typical monthly pay",
    cells: cellMap(all, (n) =>
      isNum(n.avgMonthlySalary) ? usdCompact(n.avgMonthlySalary) : null,
    ),
  };

  const rows = [taxRow, payrollRow, registerRow, daysRow, payRow].filter((row) =>
    Object.values(row.cells).some((v) => v != null),
  );
  if (rows.length < 2) return null;

  return {
    heading: `How ${countryName} compares to its neighbours`,
    lede: "The same set-up facts, side by side. These are different price regimes, so a money figure here is a fact about each country, never a ranking across them.",
    columns,
    rows,
    footnote:
      "Tax and pay figures are not adjusted for local prices. Read each column on its own terms, not as a league table.",
  };
}

function cellMap(
  rows: NeighbourFacts[],
  pick: (n: NeighbourFacts) => string | null,
): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const n of rows) out[n.iso2.toLowerCase()] = pick(n);
  return out;
}

/* ----------------------- exemplar invented specifics -------------------- */
// Sanctioned for the United Kingdom only (founder): plausible, internally
// consistent editorial where the dataset does not carry it.

function exemplarLocals(): string[] {
  return [
    "A sole trader can register online in an afternoon; an employer scheme to run payroll is the step that actually takes time.",
    "The headline rent on a strong high street is rarely the real cost: rates and service charge can add a third again on top.",
    "Most counties hold a rate relief for small premises, so the same shop can cost very different amounts a few miles apart.",
    "Hiring a first employee triggers pension auto-enrolment, so budget for the on-cost from the first payslip, not later.",
  ];
}

function exemplarContrarian(): CountryView["contrarian"] {
  return {
    insight:
      "In the United Kingdom the cheapest place to start is rarely the cheapest place to run.",
    body: "A low-rent town saves you in year one and costs you in customers for years after. The strong locations charge for the footfall because the footfall is the input you cannot buy back later.",
  };
}
