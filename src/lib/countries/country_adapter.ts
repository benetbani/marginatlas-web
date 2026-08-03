/**
 * src/lib/countries/country_adapter.ts
 *
 * `CountryFile` to a page model, the same shape `city_adapter.ts` gives the city
 * page and `spine2_adapter.ts` gives the trade page. One model per chapter, a
 * SPINE constant, and numbering that is a property of the SPINE rather than of
 * the data.
 *
 * THAT LAST POINT IS THE WHOLE DESIGN. The trade adapter originally filtered its
 * spine to chapters that had data and renumbered what was left, so a place with
 * four unfilled sections rendered seventeen chapters numbered 01 to 17 and a
 * reader had no way to know four were missing. The founder overruled it on
 * 2026-07-27: a page is always complete and its shape never varies by place.
 *
 * So chapter 14 is chapter 14 in the United Kingdom and in the hundredth
 * country. What varies is whether a chapter renders its figures or renders a
 * stated gap, and that decision belongs to the page, not to this file.
 *
 * TITLES CARRY THE COUNTRY'S NAME, AND THAT IS NOT A VARIATION IN SHAPE. Two of
 * the twenty-one titles name the place: "The UK versus its neighbours" and "The
 * biggest myth about Britain". A generic rewrite would lose the mockup's voice,
 * and hard-coding the British ones would be worse. So the spine holds a template
 * and the file supplies the names. Twenty-one chapters, same order, same
 * numbers, everywhere.
 */
import type {
  CountryCostPart,
  CountryFile,
  CountryLicenceLevel,
  CountryLicenceRow,
  CountryReadingGroup,
  CountryScorecardRef,
  CountryScorecardRow,
  Figure,
  NullFigure,
  PointFigure,
  RangeFigure,
} from "./country_spine2_types";
import {
  COUNTRY_READING_GROUPS,
  isNullFigure,
  isRangeFigure,
  licenceCount,
} from "./country_spine2_types";
/* The pure place-page resolvers, so every surface on the site agrees about
   which pages exist. Deliberately NOT the copies in related_links.ts: that
   module imports a Supabase client, and pulling it in here dragged a database
   connection into a pure transformer and threw at module load. */
import { geoPageTarget, countryPageTarget } from "@/lib/geo/page_targets";

/* ------------------------------ the spine -------------------------------- */

export type CountryChapterId =
  | "hero"
  | "scorecard"
  | "shape"
  | "rules"
  | "opening"
  | "licences"
  | "marginStack"
  | "staffCost"
  | "staffSupply"
  | "households"
  | "reach"
  | "tradeTakeHome"
  | "neighbours"
  | "underServed"
  | "abroad"
  | "zones"
  | "stability"
  | "myth"
  | "verdict"
  | "methodology"
  | "next";

/**
 * The twenty-one chapters, in order, with the titles and icons the mockup uses.
 *
 * `{country}` in a title is replaced with `meta.country.shortName`, and
 * `{informal}` with `meta.country.informalName` where the file has one. Those
 * are the only two substitutions, and they exist because the mockup's own
 * chapter heads use them.
 */
export const COUNTRY_SPINE: Array<{ id: CountryChapterId; title: string; icon: string }> = [
  { id: "hero", title: "The answer", icon: "taxes" },
  { id: "scorecard", title: "The eight key numbers", icon: "scorecard" },
  { id: "shape", title: "What this country is like", icon: "district-mix" },
  { id: "rules", title: "What the rules are like here", icon: "spread" },
  { id: "opening", title: "How long it takes to open", icon: "register-cost" },
  { id: "licences", title: "Licences by trade", icon: "licence-specific" },
  { id: "marginStack", title: "Where margin goes", icon: "margin" },
  { id: "staffCost", title: "What staff cost", icon: "hiring" },
  { id: "staffSupply", title: "Can you find and keep staff", icon: "hiring" },
  { id: "households", title: "Who has money to spend", icon: "wealth-household" },
  { id: "reach", title: "How many people you can reach", icon: "catchment" },
  { id: "tradeTakeHome", title: "Owner take-home, by trade", icon: "owner-keeps" },
  { id: "neighbours", title: "{country} versus its neighbours", icon: "compare" },
  { id: "underServed", title: "Which trades are under-served", icon: "where-it-pays" },
  { id: "abroad", title: "The same business abroad", icon: "benchmark" },
  { id: "zones", title: "Zones and special structures", icon: "free-zone" },
  { id: "stability", title: "Stability and safety", icon: "safety" },
  { id: "myth", title: "The biggest myth about {informal}", icon: "myth-reality" },
  { id: "verdict", title: "The verdict", icon: "honest-take" },
  { id: "methodology", title: "How we work this out", icon: "methodology" },
  { id: "next", title: "Where to go next", icon: "global-spread" },
];

export type CountryChapter = {
  id: CountryChapterId;
  num: string;
  title: string;
  icon: string;
  anchor: string;
};

/**
 * Every chapter, always, numbered in order. Never filtered by data.
 *
 * `informalName` falls back to `shortName`, so a country with only two names
 * still gets a title that reads, rather than the literal token.
 */
export function numberCountryChapters(names: {
  shortName: string;
  informalName?: string;
}): CountryChapter[] {
  const informal = names.informalName ?? names.shortName;
  return COUNTRY_SPINE.map((s, i) => ({
    id: s.id,
    num: String(i + 1).padStart(2, "0"),
    /* SENTENCE-CASED AFTER SUBSTITUTION, not before. A short name is a name in
       a sentence, so it carries its own article: "the UK". Dropped straight
       into a title template that starts with it, that gives a chapter head
       reading "the UK versus its neighbours", which the prose read caught on
       the first pass. Capitalising the first letter afterwards is the only
       correct place to do it, because whether the title starts with the name at
       all depends on the template. */
    title: sentenceCase(
      s.title.replace("{country}", names.shortName).replace("{informal}", informal),
    ),
    icon: s.icon,
    anchor: `ch-${String(i + 1).padStart(2, "0")}`,
  }));
}

function sentenceCase(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

/* ------------------------------ formatting ------------------------------- */

/** Drop a trailing `.0`, so 1.0 prints as 1 and 2.5 survives. */
function trim(s: string): string {
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

/**
 * Money, in the page's own register: `$240`, `$5.9K`, `$34.5K`, `$180K`.
 *
 * ONE DIGIT MORE THAN THE CITY REGISTER, DELIBERATELY, AND ONLY WHERE IT
 * CHANGES THE ANSWER. The city adapter rounds anything over ten thousand to
 * whole thousands. That is right for city figures, which are almost all round,
 * and wrong for one figure this page turns on: a $30K hire really costs $34.5K
 * once the employer surcharge is added, and printing $35K beside a stated 15%
 * makes the arithmetic the chapter is demonstrating stop working when a reader
 * checks it. So the thousands branch keeps one decimal, and only when the
 * thousands are not whole and the figure is under a hundred thousand. Every
 * round figure prints exactly as the city page prints it, which is the property
 * that matters: the two page types must never disagree about the same number.
 */
function money(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000_000) return `$${trim((v / 1_000_000_000).toFixed(a >= 10_000_000_000 ? 0 : 1))}B`;
  if (a >= 1_000_000) return `$${trim((v / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1))}M`;
  if (a >= 10_000) {
    const k = v / 1_000;
    const fractional = Math.round(k) !== k && Math.abs(k) < 100;
    return `$${trim(k.toFixed(fractional ? 1 : 0))}K`;
  }
  if (a >= 1_000) return `$${trim((v / 1_000).toFixed(1))}K`;
  return `$${Math.round(v)}`;
}

/** A plain count: `68M`, `5.6M`, `610K`, `9,700`. */
function count(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) {
    const m = v / 1_000_000;
    return `${a >= 10_000_000 ? Math.round(m) : trim(m.toFixed(1))}M`;
  }
  if (a >= 10_000) return `${Math.round(v / 1_000)}K`;
  return v.toLocaleString("en-GB");
}

/** "1 day", "5 weeks", "2 hours". The singular is the reason this exists. */
function plural(v: number, word: string): string {
  return `${v} ${v === 1 ? word : `${word}s`}`;
}

/**
 * The name as it reads inside a sentence: "the United Kingdom", "Poland".
 *
 * The bare name is right for a label and wrong for prose, and the page uses it
 * in both. The first render of this page carried a title reading "Opening a
 * business in United Kingdom", which is not visible in the markup, in the model
 * or in the prose read, and is the first thing anyone sees on the page.
 */
function inSentence(names: { name: string; takesArticle?: boolean }): string {
  return names.takesArticle ? `the ${names.name}` : names.name;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * A review stamp as a reader reads it: "2026-07" becomes "July 2026".
 *
 * The contract allows month precision, because the trust band prints a month
 * rather than a day and a file that only knows the month is not lying by saying
 * so. What it must not do is print the storage format: "Reviewed 2026-07" is a
 * database field on a page whose entire argument is that its numbers were
 * looked at by somebody. Anything that does not parse is passed through
 * untouched rather than mangled.
 */
function monthLabel(stamp: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(stamp ?? "");
  if (!m) return stamp;
  const idx = Number(m[2]) - 1;
  return idx >= 0 && idx < 12 ? `${MONTHS[idx]} ${m[1]}` : stamp;
}

/**
 * One to twelve as words, anything else as digits.
 *
 * The captions on this page count their own accented rows ("the four in
 * terracotta"), and a caption that reads "the 4 in terracotta" beside prose is
 * a different register from the rest of the sentence. Twelve is the ceiling
 * because the longest counted set on the page is the twelve readings.
 */
const NUMBER_WORDS = [
  "no", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
];
function numberWord(n: number): string {
  return n >= 0 && n < NUMBER_WORDS.length ? NUMBER_WORDS[n] : String(n);
}

/**
 * Render a figure for display, or null when it is a hole.
 *
 * MATCHED AGAINST THE UNITS THE CONTRACT ACTUALLY USES, not against a guess.
 * The city adapter's own header records what happens otherwise: it tested
 * `unit === "x"` while the fixture said `"x the country"`, so two multiples
 * rendered as bare numbers and a visitor count rendered as eight raw digits.
 * None of that is visible in the markup. The unit strings here are prose by
 * design, so this matches on their SHAPE, and every branch below was checked
 * against a unit that appears in the country fixture.
 */
function display(f: Figure | undefined, unitOverride?: string): string | null {
  if (!f || isNullFigure(f as Figure)) return null;
  const unit = (unitOverride ?? (f as PointFigure).unit ?? "").trim();

  const v = isRangeFigure(f as Figure)
    ? ((f as RangeFigure).taken ?? ((f as RangeFigure).lo + (f as RangeFigure).hi) / 2)
    : (f as PointFigure).value;
  if (typeof v !== "number" || !Number.isFinite(v)) return null;

  if (/^USD/i.test(unit)) return money(v);
  if (/^%/.test(unit) || /^percent/i.test(unit)) return `${v}%`;
  if (/^x\b/i.test(unit)) return `${v}x`;
  if (/^score\b|^of \d/i.test(unit)) return String(v);
  if (/^days?\b/i.test(unit)) return plural(v, "day");
  if (/^weeks?\b/i.test(unit)) return plural(v, "week");
  if (/^months?\b/i.test(unit)) return plural(v, "month");
  if (/^hours?\b/i.test(unit)) return plural(v, "hour");
  if (Number.isInteger(v) && Math.abs(v) >= 10_000) return count(v);
  return String(v);
}

/** The bare number, no unit word. The eight-number ruler's value column is
 *  78px wide and its row label already says what the number counts. */
function bare(f: Figure | undefined): string | null {
  if (!f || isNullFigure(f as Figure)) return null;
  const v = (f as PointFigure).value;
  return typeof v === "number" && Number.isFinite(v) ? String(v) : null;
}

/* ------------------------------ 01 the hero ------------------------------ */

export type CountryHeroModel = {
  /** The bare name, for the crumb, which is a label rather than a sentence. */
  country: string;
  /** The name as it reads inside the title sentence. */
  countryInSentence: string;
  region: string;
  /** The share the page opens on, e.g. "36%". */
  headline: string;
  headlineLabel: string;
  /** The sentence above the answer, kept in two pieces so the count can be set
   *  in the figure face the way the design does. Null where the count is
   *  missing, because the line opens on it and would start mid-sentence. */
  texture: { figure: string; line: string } | null;
  /** The three-row glance panel. Each may be null; the row then states its
   *  gap, so the panel is three rows tall in every country. */
  glance: Array<{ label: string; value: string | null }>;
  /** The stacked bar under the glance. Empty where no breakdown exists. */
  parts: Array<{ label: string; sharePct: number }>;
  /** The bar's own heading, derived from the share it decomposes. */
  partsLabel: string;
  reviewedAt: string;
};

/**
 * Chapter 01.
 *
 * THE THREE GLANCE ROWS ARE READ FROM THEIR CANONICAL HOMES, never from the
 * hero. The profit tax is the first part of the state-take bar directly below
 * it, the registration day belongs to chapter 05 and the wage floor to chapter
 * 08. A hero with its own private copies of those is a hero that can be
 * corrected everywhere else on the page and stay wrong.
 */
function buildHero(file: CountryFile): CountryHeroModel | null {
  const h = file.hero;
  if (h == null || isNullFigure(h.stateTake as Figure)) return null;
  const take = h.stateTake as Exclude<CountryFile["hero"]["stateTake"], NullFigure>;

  const texture =
    h.texture != null && !isNullFigure(h.texture as Figure)
      ? (() => {
          const t = h.texture as { businesses: Figure; line: string };
          const n = display(t.businesses);
          return n == null ? null : { figure: n, line: t.line };
        })()
      : null;

  return {
    country: file.meta.country.name,
    countryInSentence: inSentence(file.meta.country),
    region: file.meta.region,
    headline: `${take.sharePct}%`,
    headlineLabel: h.headlineLabel,
    texture,
    glance: [
      {
        label: "Headline profit tax",
        value: take.parts.length > 0 ? `${take.parts[0].sharePct}%` : null,
      },
      { label: "To register a company", value: display(file.opening.daysToRegister) },
      { label: "Full-time wage floor", value: display(file.staffCost.wageFloor) },
    ],
    parts: take.parts.map((p) => ({ label: p.label, sharePct: p.sharePct })),
    partsLabel: `What the ${take.sharePct}% is made of`,
    reviewedAt: monthLabel(file.meta.reviewedAt),
  };
}

/* --------------------- 02 the country in eight numbers ------------------- */

export type CountryScorecardRowModel = {
  glyph: string;
  label: string;
  sub?: string;
  value: string | null;
  position: number;
};

export type CountryScorecardModel = {
  baselineLabel: string;
  rows: CountryScorecardRowModel[];
};

/**
 * The eight glyphs, which belong to the SPINE and not to the data.
 *
 * The eight readings are fixed and named, so their icons are a property of the
 * page type in the same way the chapter numbers are. Carrying them in the file
 * would let one country's scorecard grow a different icon set from another's,
 * for no reason a reader could see.
 */
const SCORECARD_GLYPH: Record<string, string> = {
  stateTake: "taxes",
  averageWage: "wages",
  netWealthPerAdult: "owner-keeps",
  daysToStart: "register-cost",
  easeOfBusiness: "ease-of-business",
  minimumWage: "min-wage",
  population: "market-size",
  costOfLiving: "currency-stability",
};

/**
 * Chapter 02.
 *
 * THREE OF THE EIGHT READ THEIR VALUE FROM SOMEWHERE ELSE. What the state takes
 * is the hero's share, days to start is chapter 05's registration day, and the
 * minimum wage is chapter 08's floor. The contract gives those three no figure
 * slot at all, so they cannot be authored twice and cannot drift.
 */
function buildScorecard(file: CountryFile): CountryScorecardModel | null {
  const s = file.scorecard;
  if (s == null) return null;

  const own = (key: string, r: CountryScorecardRow): CountryScorecardRowModel => ({
    glyph: SCORECARD_GLYPH[key] ?? "scorecard",
    label: r.label,
    sub: r.sub,
    value: display(r.figure),
    position: r.position,
  });

  const ref = (
    key: string,
    r: CountryScorecardRef,
    value: string | null,
  ): CountryScorecardRowModel => ({
    glyph: SCORECARD_GLYPH[key] ?? "scorecard",
    label: r.label,
    sub: r.sub,
    value,
    position: r.position,
  });

  const take = isNullFigure(file.hero.stateTake as Figure)
    ? null
    : `${(file.hero.stateTake as { sharePct: number }).sharePct}%`;

  const rows = [
    ref("stateTake", s.stateTake, take),
    own("averageWage", s.averageWage),
    own("netWealthPerAdult", s.netWealthPerAdult),
    ref("daysToStart", s.daysToStart, bare(file.opening.daysToRegister)),
    own("easeOfBusiness", s.easeOfBusiness),
    ref("minimumWage", s.minimumWage, display(file.staffCost.wageFloor)),
    own("population", s.population),
    own("costOfLiving", s.costOfLiving),
  ];

  return rows.some((r) => r.value != null)
    ? { baselineLabel: s.baselineLabel, rows }
    : null;
}

/* --------------------- 03 what this country is like ---------------------- */

export type CountryShapeModel = {
  /** Highest first, which is the order the mockup's key prints. */
  axes: Array<{ key: string; label: string; score: number; note: string }>;
};

/**
 * Chapter 03.
 *
 * `score` is the 0-to-1 value as a whole number out of 100, because that is
 * what the key prints. The ordering is DERIVED, best first, so the reader meets
 * the country's strengths before its costs and the list cannot be hand-ordered
 * into a flattering shape.
 */
function buildShape(file: CountryFile): CountryShapeModel | null {
  const q = file.shape?.qualities;
  if (q == null || isNullFigure(q as Figure)) return null;
  const axes = (q as { axes: Array<{ key: string; label: string; value: number; note: string }> }).axes;
  if (!axes.length) return null;
  return {
    axes: [...axes]
      .sort((a, b) => b.value - a.value)
      .map((a) => ({ key: a.key, label: a.label, score: Math.round(a.value * 100), note: a.note })),
  };
}

/* ------------------- 04 what the rules are like here --------------------- */

export type CountryRulesModel = {
  /** In group order, easiest first inside each group. */
  readings: Array<{
    icon: string | null;
    label: string;
    group: CountryReadingGroup;
    position: number;
    value: string;
  }>;
  /** How many groups actually carry a reading. The caption counts them. */
  groups: number;
};

/**
 * Chapter 04.
 *
 * THE ORDER IS DERIVED, NOT AUTHORED: groups in the fixed order a founder meets
 * them, and easiest first inside each. The caption promises exactly that, so
 * sorting here is what stops the caption from lying. A group with no readings
 * never prints, which is why the caption counts groups rather than assuming
 * four.
 */
function buildRules(file: CountryFile): CountryRulesModel | null {
  const r = file.rules?.readings;
  if (r == null || isNullFigure(r as Figure)) return null;
  const list = (r as { readings: CountryRulesModel["readings"] }).readings;
  if (!list.length) return null;

  const ordered: CountryRulesModel["readings"] = [];
  let groups = 0;
  for (const g of COUNTRY_READING_GROUPS) {
    const inGroup = list.filter((x) => x.group === g).sort((a, b) => a.position - b.position);
    if (!inGroup.length) continue;
    groups += 1;
    ordered.push(...inGroup.map((x) => ({ ...x, icon: x.icon ?? null })));
  }
  return ordered.length ? { readings: ordered, groups } : null;
}

/* ---------------------- 05 how long it takes to open --------------------- */

export type CountryOpeningModel = {
  daysToRegister: string | null;
  weeksToTakeMoney: string | null;
  cashToSetUp: string | null;
  steps: Array<{
    label: string;
    icon: string | null;
    cost: string | null;
    takes: string | null;
    bottleneck: boolean;
  }>;
  /** The step that sets the opening date, named. Derived from the flag. */
  bottleneck: string | null;
  note: string | null;
};

/**
 * Chapter 05.
 *
 * THE CASH TOTAL IS RE-DERIVED FROM THE STEPS wherever every step carries a
 * cost, per the standing rule that a filled file re-derives rather than
 * authoring a second opinion. The fixture's authored $240 and the sum of its
 * steps agree today, and where they ever stop agreeing the arithmetic wins over
 * the copied number. A single step with no published fee falls the whole total
 * back to the authored figure, because a partial sum printed as a total is
 * worse than either.
 */
function buildOpening(file: CountryFile): CountryOpeningModel | null {
  const o = file.opening;
  if (o == null) return null;

  type RawStep = {
    label: string;
    icon?: string;
    cost: Figure;
    takesWeeks: Figure;
    bottleneck?: boolean;
  };
  const stepsFig = o.steps;
  const rawSteps: RawStep[] =
    stepsFig != null && !isNullFigure(stepsFig as Figure)
      ? (stepsFig as unknown as { steps: RawStep[] }).steps
      : [];

  const steps = rawSteps.map((s) => ({
    label: s.label,
    icon: s.icon ?? null,
    /* A free step prints "free", not "not published". The contract stores zero
       for it precisely because free is a measurement and an absence is not. */
    cost: isNullFigure(s.cost as Figure)
      ? null
      : (s.cost as PointFigure).value === 0
        ? "free"
        : display(s.cost),
    takes: display(s.takesWeeks),
    bottleneck: s.bottleneck === true,
  }));

  const costs = rawSteps.map((s) => (isNullFigure(s.cost as Figure) ? null : (s.cost as PointFigure).value));
  const derivedCash =
    costs.length > 0 && costs.every((c) => c != null)
      ? money((costs as number[]).reduce((a, b) => a + b, 0))
      : null;

  const model: CountryOpeningModel = {
    daysToRegister: display(o.daysToRegister),
    weeksToTakeMoney: display(o.weeksToTakeMoney),
    cashToSetUp: derivedCash ?? display(o.cashToSetUp),
    steps,
    bottleneck: steps.find((s) => s.bottleneck)?.label ?? null,
    note: o.note ?? null,
  };

  const anything =
    model.daysToRegister != null ||
    model.weeksToTakeMoney != null ||
    model.cashToSetUp != null ||
    steps.length > 0;
  return anything ? model : null;
}

/* --------------------------- 06 licences by trade ------------------------ */

export type CountryLicencesModel = {
  kinds: string[];
  rows: Array<{
    tradeSlug: string;
    tradeName: string;
    levels: Array<{ kind: string; level: CountryLicenceLevel }>;
    /** DERIVED by counting everything that is not `none`. */
    total: number;
    /** The slow ones, named. Derived, so the row and its warning agree. */
    slow: string[];
  }>;
  note: string | null;
};

/** The five kinds in plain words. The keys are stable; these are what a reader
 *  reads, and they are the column headers in the mockup's own order. */
const LICENCE_LABEL: Record<string, string> = {
  premises: "Premises",
  food: "Food",
  alcohol: "Alcohol",
  "late-hours": "Late hours",
  special: "Special",
};

/** Chapter 06. */
function buildLicences(file: CountryFile): CountryLicencesModel | null {
  const m = file.licences?.matrix;
  if (m == null || isNullFigure(m as Figure)) return null;
  const rows = (m as unknown as { rows: CountryLicenceRow[] }).rows;
  if (!rows.length) return null;

  return {
    kinds: rows[0].licences.map((l) => LICENCE_LABEL[l.kind] ?? l.kind),
    rows: rows.map((r) => ({
      tradeSlug: r.tradeSlug,
      tradeName: r.tradeName,
      levels: r.licences.map((l) => ({ kind: LICENCE_LABEL[l.kind] ?? l.kind, level: l.level })),
      total: licenceCount(r),
      slow: r.licences.filter((l) => l.level === "slow").map((l) => LICENCE_LABEL[l.kind] ?? l.kind),
    })),
    note: file.licences.note ?? null,
  };
}

/* ---------------------------- 07 where margin goes ----------------------- */

export type CountryMarginStackModel = {
  subject: string;
  /** In drawing order. `tone` is the ramp step as the stylesheet names it. */
  parts: Array<{ label: string; sharePct: number; tone: string; kept: boolean }>;
  /** The lines the panel calls out. Authored on the parts; see the contract. */
  decidedBy: Array<{ label: string; sharePct: number }>;
  decidedByLabel: string;
  /** What those lines take between them. DERIVED, and the only thing the
   *  chapter says that is not already a segment on the column. */
  decidedByPct: number;
  /** What the owner is left with. Derived from the kept part. */
  keptPct: number | null;
};

/** The ramp step, 0 to 4, as the stylesheet's own variable names. */
const RAMP = ["n1", "n2", "n3", "n4", "n5"] as const;

/**
 * Chapter 07.
 *
 * `keptPct` is DERIVED from the part marked kept, never authored beside it, so
 * the sentence under the column and the accented segment in it are the same
 * number by construction.
 */
function buildMarginStack(file: CountryFile): CountryMarginStackModel | null {
  const s = file.marginStack?.stack;
  if (s == null || isNullFigure(s as Figure)) return null;
  const fig = s as { parts: CountryCostPart[]; subject: string };
  if (!fig.parts.length) return null;

  const kept = fig.parts.find((p) => p.kept);
  const decidedBy = fig.parts
    .filter((p) => p.decides)
    .map((p) => ({ label: p.label, sharePct: p.sharePct }));
  return {
    subject: fig.subject,
    parts: fig.parts.map((p) => ({
      label: p.label,
      sharePct: p.sharePct,
      tone: RAMP[p.tone] ?? "n3",
      kept: p.kept === true,
    })),
    decidedBy,
    decidedByLabel: file.marginStack.decidedByLabel,
    decidedByPct: decidedBy.reduce((a, p) => a + p.sharePct, 0),
    keptPct: kept ? kept.sharePct : null,
  };
}

/* ---------------------------- 08 what staff cost ------------------------- */

export type CountryStaffCostModel = {
  wageFloor: string | null;
  employerOnCost: string | null;
  /** The worked example, DERIVED. Null where either input is missing. */
  workedExample: { wage: string; reallyCosts: string } | null;
  overtime: string | null;
  /** `floor` marks the statutory floor row, which the design draws as a row
   *  whose three numbers are equal. Flagged rather than left to the renderer to
   *  spot, because "$24K, $24K to $24K" is a range that says nothing. */
  payScale: Array<{ label: string; typical: string; lo: string; hi: string; floor: boolean }>;
  note: string | null;
};

/**
 * Chapter 08.
 *
 * THE WORKED EXAMPLE IS DERIVED FROM THE TWO FIGURES ABOVE IT. The mockup
 * prints "a $30K hire really costs $34.5K" beside a stated 15% surcharge, and
 * those three numbers only hold together because 30,000 times 1.15 is 34,500.
 * Authoring the answer would let a file state a surcharge its own example
 * contradicts, which is the one thing a reader of this chapter is most likely
 * to check with a calculator.
 *
 * THE WAGE FLOOR IS APPENDED TO THE PAY SCALE FROM THE CANONICAL FIGURE. The
 * mockup draws it as a fifth row whose low, typical and high are all equal. It
 * is not stored as a row, so the scale and the sentence above it cannot print
 * two different floors.
 */
function buildStaffCost(file: CountryFile): CountryStaffCostModel | null {
  const s = file.staffCost;
  if (s == null) return null;

  const floorValue = isNullFigure(s.wageFloor as Figure) ? null : (s.wageFloor as PointFigure).value;
  const onCost = isNullFigure(s.employerOnCostPct as Figure)
    ? null
    : (s.employerOnCostPct as PointFigure).value;
  const exampleWage = isNullFigure(s.workedExampleWage as Figure)
    ? null
    : (s.workedExampleWage as PointFigure).value;

  const scale = isNullFigure(s.payScale as Figure)
    ? []
    : (s.payScale as { rows: Array<{ label: string; lo: number; typical: number; hi: number }> }).rows.map(
        (r) => ({
          label: r.label,
          typical: money(r.typical),
          lo: money(r.lo),
          hi: money(r.hi),
          floor: false,
        }),
      );
  if (floorValue != null && scale.length) {
    scale.push({
      label: "Wage floor",
      typical: money(floorValue),
      lo: money(floorValue),
      hi: money(floorValue),
      floor: true,
    });
  }

  const multiple = isNullFigure(s.overtimeMultiple as Figure)
    ? null
    : (s.overtimeMultiple as PointFigure).value;
  const afterHours = isNullFigure(s.overtimeAfterHours as Figure)
    ? null
    : (s.overtimeAfterHours as PointFigure).value;

  const model: CountryStaffCostModel = {
    wageFloor: display(s.wageFloor),
    employerOnCost: display(s.employerOnCostPct),
    workedExample:
      exampleWage != null && onCost != null
        ? {
            wage: money(exampleWage),
            reallyCosts: money(exampleWage * (1 + onCost / 100)),
          }
        : null,
    overtime:
      multiple != null && afterHours != null
        ? `${multiple}x above ${afterHours} hours a week`
        : multiple != null
          ? `${multiple}x`
          : null,
    payScale: scale,
    note: s.note ?? null,
  };

  const anything =
    model.wageFloor != null || model.employerOnCost != null || model.payScale.length > 0;
  return anything ? model : null;
}

/* --------------------- 09 can you find and keep staff -------------------- */

export type CountryStaffSupplyModel = {
  skilledInHundred: number | null;
  rows: Array<{ label: string; value: string }>;
  shortages: string[];
  note: string | null;
};

/** Chapter 09. */
function buildStaffSupply(file: CountryFile): CountryStaffSupplyModel | null {
  const s = file.staffSupply;
  if (s == null) return null;

  const skilled = isNullFigure(s.skilledInHundred as Figure)
    ? null
    : (s.skilledInHundred as PointFigure).value;

  const rows: Array<{ label: string; value: string }> = [];
  const push = (label: string, v: string | null) => {
    if (v != null) rows.push({ label, value: v });
  };
  push("To fill a skilled role", display(s.weeksToFillSkilledRole));
  if (!isNullFigure(s.churn as Figure)) {
    const c = s.churn as { subject: string; pct: PointFigure };
    const v = display(c.pct);
    if (v != null) rows.push({ label: `Staff leaving in a year, ${c.subject}`, value: v });
  }
  push("Notice period, typical", display(s.noticePeriodMonths));
  push("Speak a second language", display(s.secondLanguagePct));

  const shortages = isNullFigure(s.shortages as Figure)
    ? []
    : (s.shortages as { roles: string[] }).roles;

  if (skilled == null && rows.length === 0 && shortages.length === 0) return null;
  return { skilledInHundred: skilled, rows, shortages, note: s.note ?? null };
}

/* ----------------------- 10 who has money to spend ----------------------- */

export type CountryHouseholdsModel = {
  /** How a household spends a hundred, in the file's own order. */
  split: Array<{ label: string; amount: number; display: string }>;
  rows: Array<{ label: string; sub?: string; value: string }>;
};

/** Chapter 10. */
function buildHouseholds(file: CountryFile): CountryHouseholdsModel | null {
  const h = file.households;
  if (h == null) return null;

  const split = isNullFigure(h.split as Figure)
    ? []
    : (h.split as { parts: Array<{ label: string; amount: number }> }).parts.map((p) => ({
        label: p.label,
        amount: p.amount,
        display: money(p.amount),
      }));

  const rows: Array<{ label: string; sub?: string; value: string }> = [];
  const push = (label: string, v: string | null, sub?: string) => {
    if (v != null) rows.push({ label, value: v, sub });
  };
  push("Median household", display(h.medianAfterTax), "after tax");
  push("Discretionary left", display(h.discretionary));
  push("Millionaire households", display(h.millionaireHouseholds));
  push("Paid by card", display(h.paidByCardPct));

  if (!split.length && !rows.length) return null;
  return { split, rows };
}

/* ------------------- 11 how many people you can reach -------------------- */

export type CountryReachModel = {
  origin: string;
  rings: Array<{ label: string; people: string }>;
};

/** Chapter 11. */
function buildReach(file: CountryFile): CountryReachModel | null {
  const c = file.reach?.catchment;
  if (c == null || isNullFigure(c as Figure)) return null;
  const fig = c as { rings: Array<{ minutes: number; label: string; people: number }>; origin: string };
  if (!fig.rings.length) return null;
  return {
    origin: fig.origin,
    rings: [...fig.rings]
      .sort((a, b) => a.minutes - b.minutes)
      .map((r) => ({ label: r.label, people: count(r.people) })),
  };
}

/* --------------------- 12 owner take-home, by trade ---------------------- */

export type CountryTradeTakeHomeModel = {
  rows: Array<{
    tradeSlug: string;
    tradeName: string;
    icon: string | null;
    ownerKeeps: string;
    costToOpen: string;
    revenue: string;
    breakIn: string;
    /** DERIVED: the trade whose owner keeps most. */
    top: boolean;
  }>;
  note: string | null;
};

/** Break-in levels in the words the page prints. A closed set, so the same
 *  judgement reads the same way in every country. */
const BREAK_IN_LABEL: Record<string, string> = {
  easier: "Easier",
  demanding: "Demanding",
  hardest: "Hardest",
};

/**
 * Chapter 12.
 *
 * The highlighted row is DERIVED by taking the maximum of what the owner keeps,
 * never authored, so no boolean can mark the wrong trade.
 */
function buildTradeTakeHome(file: CountryFile): CountryTradeTakeHomeModel | null {
  const t = file.tradeTakeHome?.trades;
  if (t == null || isNullFigure(t as Figure)) return null;
  const trades = (t as { trades: Array<{
    tradeSlug: string;
    tradeName: string;
    icon?: string;
    ownerKeepsPct: number;
    costToOpen: number | null;
    revenue: number | null;
    breakIn: string;
  }> }).trades;
  if (!trades.length) return null;

  const best = trades.reduce((a, b) => (b.ownerKeepsPct > a.ownerKeepsPct ? b : a));

  return {
    rows: trades.map((r) => ({
      tradeSlug: r.tradeSlug,
      tradeName: r.tradeName,
      icon: r.icon ?? null,
      ownerKeeps: `${r.ownerKeepsPct}%`,
      costToOpen: r.costToOpen != null ? money(r.costToOpen) : "not published",
      revenue: r.revenue != null ? money(r.revenue) : "not published",
      breakIn: BREAK_IN_LABEL[r.breakIn] ?? r.breakIn,
      top: r.tradeSlug === best.tradeSlug,
    })),
    note: file.tradeTakeHome.note ?? null,
  };
}

/* ---------------------- 13 against neighbouring countries ---------------- */

export type CountryNeighboursModel = {
  axes: string[];
  rows: Array<{
    country: string;
    /** One score out of 100 per axis, in the axes' own order. */
    scores: number[];
    isThisCountry: boolean;
  }>;
  note: string | null;
};

/**
 * Chapter 13.
 *
 * This country's own line is found BY SLUG, never by an authored flag, which is
 * the same discipline the city page's peer strip uses: a boolean can mark the
 * wrong row and a slug match cannot.
 */
function buildNeighbours(file: CountryFile): CountryNeighboursModel | null {
  const c = file.neighbours?.comparison;
  if (c == null || isNullFigure(c as Figure)) return null;
  const fig = c as {
    axes: string[];
    rows: Array<{ country: string; countrySlug: string; values: number[] }>;
  };
  if (!fig.rows.length) return null;

  const here = file.meta.country.slug;
  return {
    axes: fig.axes,
    rows: fig.rows.map((r) => ({
      country: r.country,
      scores: r.values.map((v) => Math.round(v * 100)),
      isThisCountry: r.countrySlug === here,
    })),
    note: file.neighbours.note ?? null,
  };
}

/* -------------------- 14 which trades are under-served ------------------- */

export type CountryUnderServedModel = {
  /** The opportunity corner: thin on the ground, money around. DERIVED. */
  opportunity: Array<{ tradeName: string; icon: string | null }>;
  /** Everything else, so the chapter shows the field it judged against. */
  rest: Array<{ tradeName: string; icon: string | null }>;
  note: string | null;
};

/**
 * Chapter 14.
 *
 * WHICH TRADES SIT IN THE OPPORTUNITY CORNER IS DERIVED FROM THEIR OWN
 * COORDINATES. The mockup names two in the panel beside the chart and paints
 * three, and nothing connects the panel to the plot. Deriving the set means the
 * sentence cannot name a trade the chart puts somewhere else.
 */
function buildUnderServed(file: CountryFile): CountryUnderServedModel | null {
  const s = file.underServed?.scatter;
  if (s == null || isNullFigure(s as Figure)) return null;
  const rows = (s as { rows: Array<{ tradeName: string; icon?: string; density: number; money: number }> }).rows;
  if (!rows.length) return null;

  /* The middle of both scales. The chart draws its cross there and the corner
     is defined by it, so the threshold is the chart's own midpoint rather than
     a tuned number. */
  const MID = 50;
  const thin = (r: { density: number; money: number }) => r.density < MID && r.money > MID;

  return {
    opportunity: rows.filter(thin).map((r) => ({ tradeName: r.tradeName, icon: r.icon ?? null })),
    rest: rows.filter((r) => !thin(r)).map((r) => ({ tradeName: r.tradeName, icon: r.icon ?? null })),
    note: file.underServed.note ?? null,
  };
}

/* ----------------------- 15 the same business abroad --------------------- */

export type CountryAbroadModel = {
  tradeName: string;
  here: { country: string; parts: Array<{ label: string; sharePct: number; tone: string; kept: boolean }> };
  peer: { country: string; parts: Array<{ label: string; sharePct: number; tone: string; kept: boolean }> };
  /** What each side's owner keeps. DERIVED from the kept part of each column. */
  hereKeeps: number | null;
  peerKeeps: number | null;
  note: string | null;
};

/**
 * Chapter 15.
 *
 * THIS COUNTRY'S COLUMN IS CHAPTER 07'S STACK, READ FROM THERE. The contract
 * stores only the other country's side, precisely so the two chapters cannot
 * draw different columns for the same country. The city page had exactly this
 * shape of defect and it took an audit to find.
 */
function buildAbroad(file: CountryFile): CountryAbroadModel | null {
  const c = file.abroad?.comparison;
  const stack = file.marginStack?.stack;
  if (c == null || isNullFigure(c as Figure)) return null;
  if (stack == null || isNullFigure(stack as Figure)) return null;

  const fig = c as {
    tradeName: string;
    peer: { country: string; parts: CountryCostPart[] };
  };
  const hereParts = (stack as { parts: CountryCostPart[] }).parts;

  const shape = (parts: CountryCostPart[]) =>
    parts.map((p) => ({
      label: p.label,
      sharePct: p.sharePct,
      tone: RAMP[p.tone] ?? "n3",
      kept: p.kept === true,
    }));

  return {
    tradeName: fig.tradeName,
    here: { country: file.meta.country.name, parts: shape(hereParts) },
    peer: { country: fig.peer.country, parts: shape(fig.peer.parts) },
    hereKeeps: hereParts.find((p) => p.kept)?.sharePct ?? null,
    peerKeeps: fig.peer.parts.find((p) => p.kept)?.sharePct ?? null,
    note: file.abroad.note ?? null,
  };
}

/* --------------------- 16 zones and special structures ------------------- */

export type CountryZonesModel = {
  relevant: boolean;
  verdict: string;
  zones: Array<{ name: string; effect: string; trades: string[] }>;
};

/**
 * Chapter 16.
 *
 * THE VERDICT IS THE CHAPTER, and a country with no useful zone still has
 * something true to say. This is the one chapter whose commonest honest answer
 * is "none of this helps you", so an empty list is content rather than a gap.
 */
function buildZones(file: CountryFile): CountryZonesModel | null {
  const z = file.zones;
  if (z == null || !z.verdict) return null;
  return {
    relevant: z.relevant === true,
    verdict: z.verdict,
    zones: isNullFigure(z.zones as Figure)
      ? []
      : (z.zones as { list: Array<{ name: string; effect: string; trades: string[] }> }).list,
  };
}

/* -------------------------- 17 stability and safety ---------------------- */

export type CountryStabilityModel = {
  ground: Array<{ label: string; word: string; strength: number; costly: boolean }>;
  rows: Array<{ label: string; value: string }>;
  note: string | null;
};

/** Chapter 17. */
function buildStability(file: CountryFile): CountryStabilityModel | null {
  const s = file.stability;
  if (s == null) return null;

  const ground = isNullFigure(s.ground as Figure)
    ? []
    : (s.ground as { rows: Array<{ label: string; strength: number; word: string; costly?: boolean }> }).rows.map(
        (r) => ({ label: r.label, word: r.word, strength: r.strength, costly: r.costly === true }),
      );

  const rows: Array<{ label: string; value: string }> = [];
  const push = (label: string, v: string | null) => {
    if (v != null) rows.push({ label, value: v });
  };
  push("To borrow to expand", display(s.costToBorrowPct));
  push("Inflation, this year", display(s.inflationPct));
  push("Energy, per unit", display(s.energyPerKwh));

  if (!ground.length && !rows.length) return null;
  return { ground, rows, note: s.note ?? null };
}

/* ------------------------------ 18 the myth ------------------------------ */

export type CountryMythModel = {
  claim: string;
  reality: string;
  note: string | null;
  panelLabel: string | null;
  /** The four supporting rows, every one read from its canonical home. */
  rows: Array<{ label: string; value: string }>;
};

/**
 * Chapter 18.
 *
 * THE PANEL HAS NO FIGURES OF ITS OWN. Its rows are chapter 05's three opening
 * figures and chapter 04's property rates, read from where they live. A myth
 * that argued from private copies could be corrected on one page and stay wrong
 * on the other, which is the failure mode this whole contract is arranged
 * against.
 */
function buildMyth(file: CountryFile): CountryMythModel | null {
  const m = file.myth;
  if (m == null || isNullFigure(m.primary as Figure)) return null;
  const p = m.primary as { claim: string; reality: string };

  const rows: Array<{ label: string; value: string }> = [];
  const push = (label: string, v: string | null) => {
    if (v != null) rows.push({ label, value: v });
  };
  push("To have a company", display(file.opening.daysToRegister));
  push("To take money", display(file.opening.weeksToTakeMoney));
  push("Cash to set up", display(file.opening.cashToSetUp));
  push("Property rates, year one", display(m.propertyRatesYearOne));

  return {
    claim: p.claim,
    reality: p.reality,
    note: m.note ?? null,
    panelLabel: m.panelLabel ?? null,
    rows,
  };
}

/* ------------------------------ 19 the verdict --------------------------- */

export type CountryVerdictModel = {
  text: string;
  chips: Array<{ icon: string | null; text: string }>;
};

/** Chapter 19. */
function buildVerdict(file: CountryFile): CountryVerdictModel | null {
  const v = file.verdict;
  if (v == null || !v.text) return null;
  return {
    text: v.text,
    chips: (v.chips ?? []).map((c) => ({ icon: c.icon ?? null, text: c.text })),
  };
}

/* -------------------------- 20 how we work it out ------------------------ */

export type CountryMethodologyModel = {
  rows: Array<{ figure: string; tier: string; how: string }>;
  /** DERIVED counts for the trust band. */
  counts: { measured: number; built: number; thin: number };
};

/**
 * Chapter 20.
 *
 * The tier counts are COUNTED FROM THE ROWS, never authored. A page that claims
 * four measured figures while listing three is the exact claim a reader is most
 * entitled to check, and the cheapest one to get wrong by hand.
 */
function buildMethodology(file: CountryFile): CountryMethodologyModel | null {
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

export type CountryRememberModel = {
  text: string;
  figure: string | null;
  figureLabel: string;
};

/**
 * Resolve a dotted path to the figure it names, e.g. "hero.stateTake".
 *
 * Returns undefined rather than throwing on a path that does not resolve,
 * because a broken pointer must degrade to the authored value rather than take
 * the page down.
 */
function figureAt(file: CountryFile, path: string): Figure | undefined {
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
 * The closing band, between chapters 20 and 21.
 *
 * IT RESTATES A FIGURE PRINTED EARLIER AND MUST READ IT FROM THERE. Resolving
 * the pointer is strictly better than checking it, because then the band and
 * the hero cannot disagree in the first place. The state-take figure carries
 * its share on `sharePct` rather than on `value`, so it is unwrapped here; the
 * authored figure is the fallback for a file whose pointer does not resolve.
 */
function buildRemember(file: CountryFile): CountryRememberModel | null {
  const r = file.remember;
  if (r == null || !r.text) return null;
  const pointed = r.figureSource ? figureAt(file, r.figureSource) : undefined;
  const pointedShare =
    pointed != null && !isNullFigure(pointed) && typeof (pointed as { sharePct?: number }).sharePct === "number"
      ? `${(pointed as { sharePct: number }).sharePct}%`
      : null;
  return {
    text: r.text,
    figure: pointedShare ?? display(pointed) ?? display(r.figure),
    figureLabel: r.figureLabel,
  };
}

/* ------------------------- 21 where to go next --------------------------- */

export type CountryNextModel = {
  tiles: Array<{ label: string; gloss: string; icon: string | null; href: string | null }>;
};

/**
 * Chapter 21.
 *
 * `gloss` BELONGS TO THE LINKED PAGE, not to this country, which is why the
 * contract carries it as an already-formatted string. It is passed through
 * untouched rather than reformatted, because reformatting it here would be this
 * page asserting something about a figure it does not own.
 */
function buildNext(file: CountryFile): CountryNextModel | null {
  const n = file.next;
  if (n == null || !n.tiles?.length) return null;
  return {
    tiles: n.tiles.map((t) => ({
      label: t.label,
      gloss: t.gloss,
      icon: t.icon ?? null,
      /* An authored href wins, then we RESOLVE the ones we can.
         Every tile carries a kind and a slug, so a city tile whose page is
         published can be linked without the file having to know the URL. The
         first render printed "no page yet" on all six tiles including London
         and Manchester, whose city pages exist and were verified by the same
         resolver yesterday. A tile that could be a link and is not is a dead
         end the reader has to back out of.
         resolveCityPage returns null for a city we do not publish, so an
         unresolvable tile still renders flat rather than inventing a URL, which
         matters on a site that answers 200 for wrong paths. */
      href: t.href ?? resolveTileHref(t.kind, t.slug, file.meta.country.slug),
    })),
  };
}

/**
 * The URL for an onward tile, or null when we do not publish that page.
 *
 * Deliberately narrow. A country tile is a membership check against the list
 * the country route itself gates on, and a city tile against the published city
 * list. A TRADE tile returns null on a country page: a trade URL needs a place
 * segment, and picking one for the reader would be choosing which city they
 * meant. That is a real product question, not a resolution detail.
 */
function resolveTileHref(
  kind: string,
  slug: string,
  countrySlug: string,
): string | null {
  if (!slug) return null;
  if (kind === "country") {
    return countryPageTarget(slug)?.href ?? null;
  }
  if (kind === "city") {
    return geoPageTarget(countrySlug, slug)?.href ?? null;
  }
  return null;
}

/* ------------------------------ the trust band --------------------------- */

export type CountryTrustModel = {
  reviewedAt: string;
  /** "5.6M businesses", or null where no count is held. */
  businesses: string | null;
  /** How many trades this page actually covers. Null while chapter 12 is a
   *  gap, and the clause is then not printed rather than guessed. */
  tradesCovered: number | null;
  counts: { measured: number; built: number; thin: number } | null;
};

/**
 * The trust band, which has no fields of its own.
 *
 * All three readings are derived: the review month from the file's own meta,
 * the business count from the hero's texture, the trade count from the length
 * of chapter 12, and the tier tally from chapter 20's ledger. The mockup prints
 * "42 trades covered" beside a table of seven, which is what happens when a
 * trust band is typed by hand.
 */
function buildTrust(file: CountryFile, method: CountryMethodologyModel | null): CountryTrustModel {
  const texture = file.hero?.texture;
  const businesses =
    texture != null && !isNullFigure(texture as Figure)
      ? display((texture as { businesses: Figure }).businesses)
      : null;

  const trades = file.tradeTakeHome?.trades;
  const tradesCovered =
    trades != null && !isNullFigure(trades as Figure)
      ? (trades as { trades: unknown[] }).trades.length
      : null;

  return {
    reviewedAt: monthLabel(file.meta.reviewedAt),
    businesses,
    tradesCovered,
    counts: method?.counts ?? null,
  };
}

/* -------------------------------- the page ------------------------------- */

export type CountryPageModel = {
  meta: {
    country: string;
    /** The name as it reads inside a sentence, article and all. */
    countryInSentence: string;
    countrySlug: string;
    shortName: string;
    region: string;
    urlPath: string;
  };
  chapters: CountryChapter[];
  hero: CountryHeroModel | null;
  scorecard: CountryScorecardModel | null;
  shape: CountryShapeModel | null;
  rules: CountryRulesModel | null;
  opening: CountryOpeningModel | null;
  licences: CountryLicencesModel | null;
  marginStack: CountryMarginStackModel | null;
  staffCost: CountryStaffCostModel | null;
  staffSupply: CountryStaffSupplyModel | null;
  households: CountryHouseholdsModel | null;
  reach: CountryReachModel | null;
  tradeTakeHome: CountryTradeTakeHomeModel | null;
  neighbours: CountryNeighboursModel | null;
  underServed: CountryUnderServedModel | null;
  abroad: CountryAbroadModel | null;
  zones: CountryZonesModel | null;
  stability: CountryStabilityModel | null;
  myth: CountryMythModel | null;
  verdict: CountryVerdictModel | null;
  methodology: CountryMethodologyModel | null;
  next: CountryNextModel | null;
  /** The unnumbered closing band, between chapters 20 and 21. Not a chapter,
   *  so it has no entry in the spine and no number. */
  remember: CountryRememberModel | null;
  /** The foot of the page. Not a chapter either, and entirely derived. */
  trust: CountryTrustModel;
};

export function buildCountryPage(file: CountryFile): CountryPageModel {
  const m = file.meta;
  const methodology = buildMethodology(file);

  return {
    meta: {
      country: m.country.name,
      countryInSentence: inSentence(m.country),
      countrySlug: m.country.slug,
      shortName: m.country.shortName,
      region: m.region,
      urlPath: m.urlPath,
    },
    chapters: numberCountryChapters(m.country),
    hero: buildHero(file),
    scorecard: buildScorecard(file),
    shape: buildShape(file),
    rules: buildRules(file),
    opening: buildOpening(file),
    licences: buildLicences(file),
    marginStack: buildMarginStack(file),
    staffCost: buildStaffCost(file),
    staffSupply: buildStaffSupply(file),
    households: buildHouseholds(file),
    reach: buildReach(file),
    tradeTakeHome: buildTradeTakeHome(file),
    neighbours: buildNeighbours(file),
    underServed: buildUnderServed(file),
    abroad: buildAbroad(file),
    zones: buildZones(file),
    stability: buildStability(file),
    myth: buildMyth(file),
    verdict: buildVerdict(file),
    methodology,
    next: buildNext(file),
    remember: buildRemember(file),
    trust: buildTrust(file, methodology),
  };
}

export { numberWord, money, count };
export type { NullFigure };
