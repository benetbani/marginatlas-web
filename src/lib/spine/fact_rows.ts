/**
 * src/lib/spine/fact_rows.ts
 *
 * THE THREE CARDS THE CITY FACT BANK FEEDS (2026-09-17, CITY-PROGRAMME step
 * 1a, research item 21): one person's living costs (city:living), a year of
 * one-bed rent over a year of pay (city:runway), and what a resident spends
 * in a year (city:demand). The bank, data/facts/city/<ISO2>-<slug>.json, held
 * these figures for 252 cities for thirty-three days while the three cards
 * that wanted them self-omitted on every city as "unsourced"; three research
 * briefs re-diagnosed the same wall from zero. This file is the standing
 * answer. Server only: it reads the bank through src/lib/facts/city_shard.ts,
 * which reads the file system, so it runs in the adapter and its outputs ride
 * the seed to the client chapters.
 *
 * EVERY OUTPUT CARRIES THE BANK'S TAG (held / modeled / extrapolated /
 * placeholder) and a basis line that says the word where the tag is not
 * held, because the sample mark is switched off site-wide and the basis is
 * the only place left that can say it. A figure composed from two figures
 * carries the weaker tag of the two, and the basis names which side is weak.
 *
 * NULL UNDER AN HONEST MINIMUM, NEVER INVENTED. The living card needs all
 * three monthly figures, since a "month" summed over two of them is a figure
 * claiming to be something it is not; the coffee is optional. The ratio
 * needs a rent and a denominator, and is withheld above one hundred percent
 * (the reason sits on the builder). The spend needs the one figure. A
 * negative reads as not held; zero is a figure for the transport pass alone
 * (city_shard.ts says why).
 *
 * LONDON IS ON THE WRONG SCHEMA AND SHIPS FILLED AND MARKED (research item
 * 22): its bank file carries owner_runway.* tagged placeholder ("illustrative
 * founder cost-of-living; to be researched") and no owner_col.* at all. The
 * living builder reads the owner_runway keys where the owner_col keys are
 * absent, keeps the placeholder tag, and the basis says so. The exemplar is
 * the first city anyone judges and a placeholder city that omits is a blank;
 * a placeholder city that says "placeholder" is honest. Researching the four
 * figures is what remains, and is the research item, not this wiring.
 */
import { cityFigure, weakerTag, type BankFigure } from "@/lib/facts/city_shard";
import type { FactTag } from "@/lib/facts/types";
import { COPY } from "@/lib/spine/copy";

/** The mark's own question, asked once: is this figure something a reader should doubt. */
const notHeld = (tag: FactTag) => tag !== "held";

/** The weakest tag across a set of figures. */
function weakest(tags: FactTag[]): FactTag {
  return tags.reduce((w, t) => weakerTag(w, t), "held" as FactTag);
}

/* ------------------------------------------------------------------------- */
/* Living costs: a one-bed flat, groceries, a transport pass, a coffee.       */
/* ------------------------------------------------------------------------- */

export type CityLiving = {
  /** One-bed rent, a month. */
  rent: BankFigure;
  /** Groceries, a month. */
  groceries: BankFigure;
  /** A monthly transport pass. */
  transit: BankFigure;
  /** One coffee; null where the bank holds none. */
  coffee: BankFigure | null;
  /** rent + groceries + transit, a month: the focal figure. */
  monthly: number;
  /** The weakest tag among the figures drawn: what the card's _meta says. */
  tag: FactTag;
  sample: boolean;
  basis: string;
  /** Which key family the figures came off: 251 cities on owner_col, London on owner_runway. */
  from: "owner_col" | "owner_runway";
};

/** The first metric the bank holds for this city among the candidates, in
 *  order. `zeroOk` is per metric: a rent, a bill, a pay or a spend of zero is
 *  not a figure and is skipped; a transport pass of zero is a fare-free city
 *  and is kept (city_shard.ts names the two that hold it). */
function firstOf(iso2: string, slug: string, metrics: string[], zeroOk = false): { fig: BankFigure; metric: string } | null {
  for (const metric of metrics) {
    const fig = cityFigure(iso2, slug, metric);
    if (fig && (zeroOk || fig.value > 0)) return { fig, metric };
  }
  return null;
}

/** Null unless the bank holds all three monthly figures. */
export function buildCityLiving(iso2: string, slug: string, cityName?: string): CityLiving | null {
  const rent = firstOf(iso2, slug, ["owner_col.rent_1bed_usd_mo", "owner_runway.rent_1bed_usd_mo"]);
  const groceries = firstOf(iso2, slug, ["owner_col.groceries_usd_mo", "owner_runway.groceries_usd_mo"]);
  const transit = firstOf(iso2, slug, ["owner_col.transit_pass_usd_mo", "owner_runway.transport_usd_mo"], true);
  if (!rent || !groceries || !transit) return null;
  const coffee = firstOf(iso2, slug, ["owner_col.coffee_usd", "owner_runway.coffee_usd"]);
  const from: CityLiving["from"] = rent.metric.startsWith("owner_col.") ? "owner_col" : "owner_runway";
  const tags = [rent.fig.tag, groceries.fig.tag, transit.fig.tag, ...(coffee ? [coffee.fig.tag] : [])];
  const tag = weakest(tags);
  const basis = [COPY.cityLiving.basis, weakClause(tag, COPY.cityLiving.modelled, COPY.cityLiving.placeholder, cityName ?? slug)]
    .filter(Boolean)
    .join(" ");
  return {
    rent: rent.fig,
    groceries: groceries.fig,
    transit: transit.fig,
    coffee: coffee ? coffee.fig : null,
    monthly: Math.round(rent.fig.value + groceries.fig.value + transit.fig.value),
    tag,
    sample: notHeld(tag),
    basis,
    from,
  };
}

/** The clause a basis gains when a tag is not held; empty when it is. Extrapolated reads as modelled here: neither is a measurement, and no living or spend fact carries it today. */
function weakClause(tag: FactTag, modelled: string, placeholder: string, cityName: string): string {
  if (tag === "held") return "";
  if (tag === "placeholder") return placeholder.replace("{city}", cityName);
  return modelled;
}

/* ------------------------------------------------------------------------- */
/* Rent against pay: a year of one-bed rent over a year of typical pay.       */
/* ------------------------------------------------------------------------- */

export type CityRunway = {
  /** A year of one-bed rent as a whole percent of a year of pay. */
  pct: number;
  /** The numerator, a month. */
  rent: BankFigure;
  /** The denominator, a year. */
  pay: BankFigure;
  /** Which denominator the ratio stands on; see THE DENOMINATOR below. */
  against: "salary" | "income";
  /** The weaker of the two sides. */
  tag: FactTag;
  sample: boolean;
  basis: string;
  /** Both candidates, a year each, so a reader of the seed can see what the choice was made between. */
  candidates: { salary_yr: BankFigure | null; income_yr: BankFigure | null };
};

/**
 * THE DENOMINATOR, CHOSEN ONCE (research item 24; the critic's finding 1c.3
 * of 2026-09-12). The bank offers two typical incomes for a city:
 *
 *   owner_col.median_salary_usd_mo x 12   held c 0.9 for 246 of 252, modelled
 *                                         for 5, absent for 1 (London)
 *   income.median_income_usd              held for 50, modelled for 202
 *
 * The ratio stands on the monthly salary times twelve, for three reasons in
 * order of weight. It is the HELD figure: 246 cities against 50. It comes off
 * the same key family and the same research pass as the rent it is divided
 * into, so both sides of the ratio share one basis and one tag, and the
 * ratio's trust is the trust of two held figures rather than a held rent over
 * a modelled income. And a year of rent over a year of pay is the question
 * the card asks in a worker's own terms; the annual income figure is the
 * distribution's midpoint modelled from other things. The annual income
 * stands in only where the salary is absent, which is London alone today; it
 * keeps its own tag and the output says which side the ratio stands on. Both
 * candidates ride the output so the choice is inspectable, not just asserted.
 *
 * WHAT THIS DOES NOT DO: reconcile London's incomes. The bank's 47,000, the
 * seed spread's 57,000 and the city list's 64,800 still disagree; this card
 * prints the bank's, marked modelled, and item 24 remains the research item.
 */
export function buildCityRunway(iso2: string, slug: string, cityName?: string): CityRunway | null {
  const rent = firstOf(iso2, slug, ["owner_col.rent_1bed_usd_mo", "owner_runway.rent_1bed_usd_mo"]);
  if (!rent) return null;
  const salaryMo = firstOf(iso2, slug, ["owner_col.median_salary_usd_mo"])?.fig ?? null;
  const income = firstOf(iso2, slug, ["income.median_income_usd"])?.fig ?? null;
  const salary_yr: BankFigure | null = salaryMo ? { value: Math.round(salaryMo.value * 12), tag: salaryMo.tag } : null;
  const income_yr: BankFigure | null = income ? { value: Math.round(income.value), tag: income.tag } : null;
  const pay = salary_yr ?? income_yr;
  if (!pay) return null;
  const pct = Math.round(((rent.fig.value * 12) / pay.value) * 100);
  /* WITHHELD ABOVE ONE HUNDRED PERCENT, and the line is the card's own
     sentence, not a taste. The card says "{pct}% of a typical income goes to
     a year of one-bed rent", which is a claim about a budget, and no earner's
     budget gives more than all of itself to rent. Counted on 2026-09-17 over
     all 252 cities: 30 ratios sit above 100%, Dakar at 425% (a one-bed at
     $726 a month, a typical pay of $171), Lagos at 392%, Addis Ababa at 332%,
     Abidjan at 315%, down to Surabaya at 101%. Both figures in each are
     tagged held and are not being doubted here; what they show is that the
     one-bed the bank priced and the worker the bank paid are in two different
     markets, a flat let on the formal market and a wage across the whole
     workforce, so the ratio between them is not the share of anyone's pay.
     Printing it would be a visibly wrong number wearing two honest ones. The
     rent still prints on the living card and the pay on the customers strip;
     only the composed figure is withheld, and the brief's own law for this
     card (06-runway, law 5) is that the whole card omits rather than a word
     standing where the percentage goes. A like-for-like pair for these thirty
     is the data requirement, recorded there with the names. */
  if (pct > 100) return null;
  const against: CityRunway["against"] = salary_yr ? "salary" : "income";
  const tag = weakerTag(rent.fig.tag, pay.tag);
  const city = cityName ?? slug;
  const clauses = [
    weakSide(rent.fig.tag, COPY.cityRunway.whatRent, city),
    weakSide(pay.tag, COPY.cityRunway.whatPay, city),
  ].filter(Boolean);
  return {
    pct,
    rent: rent.fig,
    pay,
    against,
    tag,
    sample: notHeld(tag),
    basis: [COPY.cityRunway.basis, ...clauses].join(" "),
    candidates: { salary_yr, income_yr },
  };
}

/** One side's weak clause, naming the side; empty when the side is held. */
function weakSide(tag: FactTag, what: string, cityName: string): string {
  if (tag === "held") return "";
  const t = COPY.cityRunway.weak[tag];
  return t.replace("{what}", what).replace("{city}", cityName);
}

/* ------------------------------------------------------------------------- */
/* The spending pool: what one resident spends in a year.                     */
/* ------------------------------------------------------------------------- */

export type CityDemand = {
  /** Spend per resident, a year. */
  spend: BankFigure;
  tag: FactTag;
  sample: boolean;
  basis: string;
};

/** Null unless the bank holds the one figure, above zero. */
export function buildCityDemand(iso2: string, slug: string, cityName?: string): CityDemand | null {
  const spend = firstOf(iso2, slug, ["demand.spend_per_capita_usd"])?.fig ?? null;
  if (!spend) return null;
  const basis = [COPY.cityDemand.basis, weakClause(spend.tag, COPY.cityDemand.modelled, COPY.cityDemand.placeholder, cityName ?? slug)]
    .filter(Boolean)
    .join(" ");
  return { spend, tag: spend.tag, sample: notHeld(spend.tag), basis };
}
