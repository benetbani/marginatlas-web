/**
 * src/lib/spine/city_hero_board.ts
 *
 * THE CITY'S HERO BOARD, his design for the country's masthead at the city
 * altitude (rules/FOUNDER-VERDICTS.md 2026-09-20, the hero; his word after
 * the push of the same day: the main pages should be "cohesive, fitting to
 * each other", and the London masthead as served stood with its right half
 * blank). The same archetype the country page draws (HeroBoard.tsx): the
 * country's flag with nothing to its left and the city's name beside it, the
 * main figure on the left, the picture in the centre (the one placeholder
 * the repository holds, item 82's class), a column of placed figures on the
 * right with a level chip each, and the basis under the column saying the
 * chips are among the covered cities.
 *
 * THE ANSWER is the masthead's own since 2026-09-18: the typical customer pay
 * off the one income builder (city_income.ts `cityTypicalIncome`, R7's
 * discipline), a year, "modelled" said in the basis where the tag is not
 * held, the country's figure named as the country's where the city holds
 * none.
 *
 * THE ROWS, each the city's OWN figure with its file and field, at most six
 * (his cap), in this order:
 *  - visitors a year: `tourist_arrivals_m` off data/cities/city_list_v1.json
 *    where the row's note says the count is the city's own (the glance's
 *    rule, `isVisitorsRead`); a country-extrapolated count is not a row;
 *  - city permits, days: `reg.total_local_days` off the city shard;
 *  - businesses per 10,000 residents: `comp.density_per_10k` off the shard;
 *  - metro GDP: `gdp_b` off the city list, approximate on every row (item
 *    31), so the row is modelled;
 *  - cost of living: `cost_of_living_index` on the city scale, 1 at the
 *    cheapest covered city and 100 at the dearest, neither named (his
 *    ruling of 2026-09-20).
 * The country's self-employment share, which the old masthead printed under
 * the city's name, is not a row: it is the country's figure (M5).
 *
 * THE LEVEL CHIP places the figure among the covered cities holding that
 * figure (hero_board.ts `levelOf`: the placement builder's rank read as
 * thirds, no chip under twenty members). It says where the city sits, never
 * whether that is good: many permit days read "high".
 *
 * `01 glance` and `02 among-cities` dissolve into this board, the country's
 * own precedent on his word ("at a glance is irrelevant; among the countries
 * bundled by category"): the glance's three cells and the seat's two figures
 * are the board's rows. Pure over the city list and the shards, synchronous.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityFigure, loadCityShard } from "@/lib/facts/city_shard";
import { cityTypicalIncome } from "@/lib/spine/city_income";
import { isVisitorsRead } from "@/lib/spine/city_glance_rows";
import { costOfLivingOnCityScale } from "@/lib/economics/country_metrics";
import { levelOf, heroImageFor, type HeroBoardData, type HeroBoardRow } from "@/lib/spine/hero_board";
import { inSentence } from "@/lib/spine/place_names";
import { COUNTRIES } from "@/lib/taxonomy";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

type CityRow = {
  slug: string;
  name: string;
  iso2: string;
  gdp_b?: number;
  cost_of_living_index?: number;
  tourist_arrivals_m?: number;
  sources?: Record<string, string>;
};

const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isPos = (v: unknown): v is number => isNum(v) && v > 0;

/** "16.0M" for millions of visitors, the glance's own print. */
const visitorsM = (m: number) => `${m.toFixed(1)}M`;

/* THE SWEEPS, once per process: every covered city's value for each row, so a
   level is a place among the cities that hold the figure. The two shard
   figures are read city by city through the store; the three list figures
   off the list. */
let sweep: { visitors: number[]; days: number[]; density: number[]; gdp: number[]; living: number[] } | null = null;
function sweeps() {
  if (sweep) return sweep;
  const visitors: number[] = [], days: number[] = [], density: number[] = [], gdp: number[] = [], living: number[] = [];
  for (const c of CITIES) {
    const iso2 = String(c.iso2).toUpperCase();
    if (isPos(c.tourist_arrivals_m) && isVisitorsRead(c.sources?.tourist_arrivals_m)) visitors.push(c.tourist_arrivals_m);
    if (isPos(c.gdp_b)) gdp.push(c.gdp_b);
    if (isPos(c.cost_of_living_index)) living.push(c.cost_of_living_index);
    if (loadCityShard(iso2, c.slug)) {
      const d = cityFigure(iso2, c.slug, "reg.total_local_days");
      if (d) days.push(d.value);
      const n = cityFigure(iso2, c.slug, "comp.density_per_10k");
      if (n && n.value > 0) density.push(n.value);
    }
  }
  sweep = { visitors, days, density, gdp, living };
  return sweep;
}

export function buildCityHeroBoard(slug: string): HeroBoardData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  const s = sweeps();
  const C = COPY.cityHeroBoard;
  const rows: HeroBoardRow[] = [];

  if (isPos(city.tourist_arrivals_m) && isVisitorsRead(city.sources?.tourist_arrivals_m)) {
    rows.push({ key: "visitors", icon: "tourist", label: C.rows.visitors, value: visitorsM(city.tourist_arrivals_m), unit: C.units.aYear, level: levelOf(city.tourist_arrivals_m, s.visitors), confidence: "measured" });
  }
  const days = cityFigure(iso2, slug, "reg.total_local_days");
  if (days) {
    const v = Math.round(days.value);
    rows.push({ key: "permits", icon: "red-tape", label: C.rows.permits, value: String(v), unit: v === 1 ? COPY.heroBoard.units.day : COPY.heroBoard.units.days, level: levelOf(days.value, s.days), confidence: days.tag === "held" ? "measured" : "modeled" });
  }
  const density = cityFigure(iso2, slug, "comp.density_per_10k");
  if (density && density.value > 0) {
    rows.push({ key: "density", icon: "competition", label: C.rows.density, value: Math.round(density.value).toLocaleString("en-US"), unit: C.units.per10k, level: levelOf(density.value, s.density), confidence: density.tag === "held" ? "measured" : "modeled" });
  }
  if (isPos(city.gdp_b)) {
    rows.push({ key: "gdp", icon: "market-size", label: C.rows.gdp, value: usd(city.gdp_b * 1e9), unit: C.units.aYear, level: levelOf(city.gdp_b, s.gdp), confidence: "modeled" });
  }
  if (isPos(city.cost_of_living_index)) {
    const onScale = costOfLivingOnCityScale(city.cost_of_living_index);
    /* No unit after the figure: "of 100" stands on the premises bento's empty-shops cell in the same first screen (the art-direction gate's H4), and the basis under the column says the scale's ends. THE CHIP READS THE SCALE, not the rank: the figure IS a place between the cheapest and the dearest covered city, so its thirds are the chip (48 is "medium"); the rank's thirds said "high" for 48 because most covered cities sit low, and the two beside each other read as a contradiction (the first photograph). */
    const scaleLevel = onScale == null ? null : onScale >= 67 ? "high" : onScale >= 34 ? "medium" : "low";
    if (onScale != null) rows.push({ key: "living", icon: "cost-breakdown", label: C.rows.living, value: String(onScale), unit: "", level: scaleLevel, confidence: /city-level/i.test(city.sources?.cost_of_living_index ?? "") && !/hand-anchor/i.test(city.sources?.cost_of_living_index ?? "") ? "measured" : "modeled" });
  }

  const typical = cityTypicalIncome(slug);
  const countryName = String(COUNTRIES.find((c) => c.code === iso2)?.name ?? iso2);
  const answer: HeroBoardData["answer"] = typical
    ? { label: COPY.cityHero.answerLabel, value: usd(typical.value), regime: null, confidence: typical.sample ? "modeled" : "measured" }
    : null;
  const answerBasis = typical
    ? typical.from === "country"
      ? COPY.cityCustomers.countryBasis.replace("{country}", inSentence(typical.countryName)).replace("{city}", city.name)
      : typical.sample
        ? COPY.cityHero.answerBasisModelled
        : COPY.cityHero.answerBasis
    : null;

  return {
    iso2,
    name: city.name,
    answer,
    answerBasis,
    subtitle: COPY.cityHero.subtitle.replace("{country}", inSentence(countryName)),
    levelBasis: C.levelBasis,
    rows,
    image: heroImageFor(iso2),
  };
}
