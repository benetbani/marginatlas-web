/**
 * src/lib/spine/premises_bento_rows.ts
 *
 * WHAT SHOP SPACE COSTS HERE, the city page's `04 premises` (MODEL.md 8.3;
 * plan step 32, second dispatch, 2026-09-18): four readings of the city's
 * own shop space, his A2 bento in his B4 cells, turn one's first band and
 * the page's LOUD 2 (M9). Pure over the files, synchronous, no database, in
 * fact_rows.ts's idiom: the city list is a JSON import and the shard is read
 * through city_shard.ts (the file system, so server only), so the archetype
 * harness, the story sheet and the prebuild gates can build every city.
 *
 * FOUR CELLS, IN DECLARED ORDER, each with its file and field, all four in
 * data/facts/city/<ISO2>-<slug>.json through cityFigure():
 *
 *  - PRIME SHOP RENT, `realestate.rent_prime_usd_sqm_yr`: a square metre of
 *    prime shop space, a year. The focal, 2 by 1, and the one lit cell: its
 *    figure in `--terra-text` in the held and the modelled states, by the
 *    role it plays (the shop's biggest cost, the turn's first figure), unlit
 *    only where withheld (8.3's loud-moment table, seat 2, LIT).
 *  - SHOPS STANDING EMPTY, `realestate.vacancy_rate_pct`: the rate drawn as
 *    a count in 100, the whole visible as units, the part inked. 1 by 2, the
 *    one tall cell (a grid of 100 is the one drawing). `accent={false}`, ink
 *    on neutral, so the cluster keeps one loud cell. The figure is the rate
 *    rounded to a whole shop; the basis prints the rate as read and says it
 *    rounded, so no reader takes "2 of 100" for 2.0.
 *  - FIT-OUT COST, `realestate.fit_out_cost_usd_sqm`: to fit out a square
 *    metre of shop space. 1 by 1, ink.
 *  - DEPOSIT UP FRONT, `realestate.deposit_months`: months of rent held as
 *    the deposit. 1 by 1, ink. Printed as "6 months", a figure with its
 *    unit word, the way the glance prints "56 days".
 *
 * COUNTED ON 2026-09-18 over all 252 shard files, every one of the four
 * fields: 252 numeric, 133 tagged held (c 0.9), 119 tagged modelled (c
 * 0.55), 0 null, 0 zero, 0 negative, and the four fields share one tag on
 * every city. London is held. No value on any field is a fill: the deposit's
 * commonest value, 3 months on 115 cities, is the mode of a quantity that is
 * whole months by nature, and the rent's commonest value repeats 6 times in
 * 119. `space.prime_rent_usd_sqm_yr` (retired, FH5) is never read here and
 * never printed beside these.
 *
 * A NULL IS WITHHELD WITH ITS LINE (PART 5: "a cell that cannot hold an
 * honest figure is WITHHELD with a stated line ... never filled with a word,
 * never left deliberately empty"), one line per cell in the entry bill's
 * idiom, standing where the figure would (BentoMetric's own law 2). No city
 * takes that path today; the shape is the builder's, so the day a field is
 * missing the cluster still draws its four cells and one says why. The
 * cluster itself is null only where the city is not in the list or its
 * shard holds no facts at all: then the subject does not exist for this
 * entity and the band self-omits (PART 7's one case).
 *
 * EVERY PRINTED FIGURE CARRIES THE SHARD'S TAG, and the basis says
 * "modelled for this city" where the tag is not held, because the sample
 * mark is switched off site-wide and the basis is the only line that can.
 * The cluster's `sample` is true when any printed figure is not held.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityFigure, loadCityShard, type BankFigure } from "@/lib/facts/city_shard";
import type { FactTag } from "@/lib/facts/types";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

type CityRow = { slug: string; name: string; iso2: string };
const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

/** A metric cell: the figure as printed with its basis and tag, or the stated line where the figure would stand. */
export type PremisesMetric = { figure: string; basis: string; tag: FactTag; sample: boolean; value: number } | { withheld: string };
/** The count cell: the part in 100 with the rate it was rounded from, or the stated line. */
export type PremisesCount = { part: number; whole: 100; rate: number; basis: string; tag: FactTag; sample: boolean } | { withheld: string };

export type PremisesBento = {
  slug: string;
  iso2: string;
  name: string;
  rent: PremisesMetric;
  empty: PremisesCount;
  fitOut: PremisesMetric;
  deposit: PremisesMetric;
  /** How many of the four cells stand on a withheld line. */
  withheld: number;
  /** True when a printed figure's tag is not held. */
  sample: boolean;
  /** The weakest tag among the printed figures; "held" when nothing prints. */
  tag: FactTag;
};

/** The cell's key names, in declared order, the same order the cluster tiles. */
export const PREMISES_CELLS = ["rent", "empty", "fitOut", "deposit"] as const;

/** Every listed city's slug, sorted, for a picker or a gate that walks the whole set. */
export const listedCitySlugs = (): string[] => CITIES.map((c) => c.slug).sort();

const notHeld = (tag: FactTag) => tag !== "held";
const TRUST: readonly FactTag[] = ["held", "modeled", "extrapolated", "placeholder"];
const weaker = (a: FactTag, b: FactTag): FactTag => (TRUST.indexOf(a) >= TRUST.indexOf(b) ? a : b);

/** A basis line: the unit clause, then "; modelled for this city" where the tag is not held, then the full stop. */
function basisOf(clause: string, tag: FactTag): string {
  return notHeld(tag) ? `${clause}; ${COPY.premisesBento.modelled}.` : `${clause}.`;
}

/** The shard's rate as a person reads it: whole where whole, one decimal otherwise (no rate on file carries more). */
const rateText = (rate: number) => (Number.isInteger(rate) ? String(rate) : rate.toFixed(1));

function metric(fig: BankFigure | null, clause: string, print: (v: number) => string, withheld: string): PremisesMetric {
  if (!fig || fig.value <= 0) return { withheld };
  return { figure: print(fig.value), basis: basisOf(clause, fig.tag), tag: fig.tag, sample: notHeld(fig.tag), value: fig.value };
}

/** Null unless the city is listed and its shard holds facts; then four cells, each a figure or its line. */
export function buildPremisesBento(slug: string): PremisesBento | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  if (!loadCityShard(iso2, slug)) return null;
  const W = COPY.premisesBento.withheld;
  const B = COPY.premisesBento.basis;

  const rent = metric(cityFigure(iso2, slug, "realestate.rent_prime_usd_sqm_yr"), B.rent, usd, W.rent);
  const fitOut = metric(cityFigure(iso2, slug, "realestate.fit_out_cost_usd_sqm"), B.fitOut, usd, W.fitOut);
  const deposit = metric(
    cityFigure(iso2, slug, "realestate.deposit_months"),
    B.deposit,
    (v) => `${Math.round(v)} ${Math.round(v) === 1 ? COPY.premisesBento.months.one : COPY.premisesBento.months.many}`,
    W.deposit,
  );

  /* The count: a rate in 100 is a count only between 0 and 100; a rate over
     100 is not a share of the shops and is withheld with its own line rather
     than drawn as a wrong whole (BentoCount would refuse to draw it, and a
     cell that draws nothing is the hole the cluster exists to stop). Zero is
     a figure here: a city with no shop standing empty prints 0 of 100. */
  const vacancy = cityFigure(iso2, slug, "realestate.vacancy_rate_pct");
  let empty: PremisesCount;
  if (!vacancy) empty = { withheld: W.empty };
  else if (vacancy.value > 100) empty = { withheld: W.emptyNotAShare };
  else {
    const part = Math.round(vacancy.value);
    const clause = (part === vacancy.value ? B.empty : B.emptyRounded).replace("{rate}", rateText(vacancy.value));
    empty = { part, whole: 100, rate: vacancy.value, basis: basisOf(clause, vacancy.tag), tag: vacancy.tag, sample: notHeld(vacancy.tag) };
  }

  const printed: FactTag[] = [];
  for (const c of [rent, fitOut, deposit]) if ("figure" in c) printed.push(c.tag);
  if ("part" in empty) printed.push(empty.tag);
  const withheld = 4 - printed.length;
  const tag = printed.reduce<FactTag>((w, t) => weaker(w, t), "held");
  return { slug, iso2, name: city.name, rent, empty, fitOut, deposit, withheld, sample: notHeld(tag), tag };
}
