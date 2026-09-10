/**
 * src/lib/spine/city_verdict_facts.ts
 *
 * THE CITY'S VERDICT CARD FACTS (city:verdict, the build loop's run 23,
 * rebased task 13, 2026-09-10), for the AnswerCard archetype at section
 * level.
 *
 * IT READS THE DISTRICT BUILDER, IT DOES NOT RECOMPUTE. This card and the
 * ranking two sections below it print the same district rents, and when they
 * each did their own arithmetic off the seed they could disagree about the
 * basis, the rounding or the wording without anything failing: the founder's
 * own name for that is the page contradicting itself two inches apart. There
 * is one builder now (district_rows.ts) and this file selects from it.
 *
 * WHAT THE CARD SAYS, and why it is not the front part repeated. The answer
 * is the SPREAD, the dearest district's rent against the cheapest, which is
 * the one reading neither end can give on its own; the basis names both ends,
 * so the reference is said as well as drawn. The two cells are what the
 * answer cannot say: where the middle of the ranking sits (a spread of two
 * and a half tells you nothing about whether the middle is near the floor or
 * near the ceiling), and how many districts stand behind the claim. His
 * 2026-08-25 "you are repeating the front part" is why there is no third cell
 * and why neither end is printed twice , and it is why the middle cell drops
 * below three districts (MIDDLE_MIN_DISTRICTS), where the middle of the
 * ranking is one of the two ends the basis line has already named.
 *
 * WHAT WENT, 2026-09-10: the answer "the lightest rent load, x1.20", which
 * under a basis where the lightest district IS the reference would read as a
 * multiple of one and say nothing; and the "City average / 1 / the baseline"
 * cell, which is the cell he named ("then you say the city average times one
 * which is the baseline. You don't seem to have an idea on how the
 * information should be actually given") and whose value was 1 for every city
 * on earth, by definition, not a measured fact.
 *
 * MODELLED, AND SAID SO: the multiples are composed from a per-tag constant
 * table with damping (src/lib/economics/neighborhood_multipliers.ts), not read
 * from a rent roll. A measured district rent is a data requirement.
 *
 * Draws only for a city with two or more ranked districts: with one, the two
 * ends of the ranking would be the same row. Synchronous over a seed, so the
 * stories and the view share it.
 */
import { COPY } from "@/lib/spine/copy";
import { buildCityDistrictBars, rentMult } from "@/lib/spine/district_rows";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import type { AtlasIconId } from "@/components/brand/icons";

type Conf = "measured" | "modeled" | "placeholder";
export type CityVerdictFacts = {
  kicker: string;
  icon: AtlasIconId;
  answer: { label: string; value: string; basis: string; confidence: Conf };
  cells: KvCell[];
  /** The districts ranked, for the stories' reason line. */
  districts: number;
};

export function cityVerdictFacts(seed: any): CityVerdictFacts | null {
  const b = buildCityDistrictBars(seed);
  if (!b) return null;
  return {
    kicker: COPY.cityVerdict.kicker,
    icon: "district-mix",
    answer: {
      label: COPY.cityVerdict.answerLabel,
      value: rentMult(b.dearest.value),
      basis: COPY.cityVerdict.basis.replace("{dearest}", b.dearest.name).replace("{cheapest}", b.cheapest),
      confidence: "modeled",
    },
    cells: [
      /* THE MIDDLE CELL NEEDS A MIDDLE TO NAME (task 13 fix wave, 2026-09-10).
         With two ranked districts the middle of the ranking IS the cheapest,
         so this cell printed the reference district a second time, under a
         label calling it the middle, with a bare word where its figure
         belongs. It drops instead, and the grid gives its one remaining cell
         the width (KvGrid's own lone-cell rule). Only London holds districts
         today, so nothing renders this yet; the gate proves it on a
         two-district fixture rather than waiting for the second city. */
      ...(b.middle ? [{ key: "middle", label: COPY.cityVerdict.cells.middle, value: rentMult(b.middle.value), note: b.middle.name, confidence: "modeled" as const }] : []),
      { key: "ranked", label: COPY.cityVerdict.cells.ranked, value: String(b.districts) },
    ],
    districts: b.districts,
  };
}
