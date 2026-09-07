/**
 * src/lib/spine/city_verdict_facts.ts
 *
 * THE CITY'S VERDICT CARD FACTS (city:verdict, the build loop's run 23,
 * 2026-09-07), for the AnswerCard archetype at section level: the lightest
 * rent load among the city's ranked districts as the answer, the district as
 * its basis; the city average and the heaviest district as the two cells, the
 * two things the answer cannot say (the founder's 2026-08-25 "you are
 * repeating the front part" is why there is no third cell repeating it). A
 * rent load is the district's rent as a multiple of the city's average,
 * printed with two decimals always (the blueprint's one notation), so x3.00
 * and x2.96 sit in one column.
 *
 * MODELLED, AND SAID SO: the multiples are composed from a per-tag constant
 * table with damping (src/lib/economics/neighborhood_multipliers.ts), not read
 * from a rent roll; the old card printed no mark because the adapter wrote no
 * provenance on the block. A measured district rent is a data requirement.
 *
 * Draws only for a city with two or more ranked districts: with one, the
 * answer and the heaviest would be the same row. Synchronous over a seed, so
 * the stories and the view share it.
 */
import { COPY } from "@/lib/spine/copy";
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

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const mult = (v: number) => `x${v.toFixed(2)}`;

export function cityVerdictFacts(seed: any): CityVerdictFacts | null {
  const list: any[] = Array.isArray(seed?.where_to_trade?.list)
    ? seed.where_to_trade.list.filter((r: any) => r && typeof r.name === "string" && r.name && isNum(r.rent_mult))
    : [];
  if (list.length < 2) return null;
  const byRent = list.slice().sort((a, b) => a.rent_mult - b.rent_mult);
  const lightest = byRent[0];
  const heaviest = byRent[byRent.length - 1];
  return {
    kicker: COPY.cityVerdict.kicker,
    icon: "district-mix",
    answer: { label: COPY.cityVerdict.answerLabel, value: mult(lightest.rent_mult), basis: COPY.cityVerdict.basis.replace("{district}", String(lightest.name)), confidence: "modeled" },
    cells: [
      { key: "average", label: COPY.cityVerdict.cells.average, value: mult(1), note: COPY.cityVerdict.cells.averageNote },
      { key: "heaviest", label: COPY.cityVerdict.cells.heaviest, value: mult(heaviest.rent_mult), note: String(heaviest.name), confidence: "modeled" },
    ],
    districts: list.length,
  };
}
