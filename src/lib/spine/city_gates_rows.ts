/**
 * src/lib/spine/city_gates_rows.ts
 *
 * THE CITY'S OWN PERMITS, GATE BY GATE, the city page's `17 gates` (MODEL.md
 * 8.3 since the late evening of 2026-09-20; his word after the push of that
 * day: the main pages hold "more sections", from what the files hold, and a
 * figure carries its details, MODEL PART 9 clauses 60 and 63). The board's
 * "City permits 56 days" is one figure; this card is what stands behind it:
 * every local gate the city puts between a signed lease and an open door,
 * with the wait and the fee, on the tiers table's figures shape (the trade
 * page's team card, one form for a set of named rows with two figures).
 *
 * WHERE THE ROWS COME FROM, each figure with its file and field:
 * `reg.local_gates.*` on the city shard (data/facts/city/<ISO2>-<slug>.json
 * through city_shard.ts): the gate's name, `days`, `cost_usd` and
 * `required`; the totals `reg.total_local_days` (the slowest gate, the
 * gates running side by side) and `reg.total_local_cost_usd` (the fees
 * summed). London holds five gates, three required, every row tagged held.
 *
 * THE FORM: the required gates first, the slowest first among them, each a
 * name over the wait and the fee; a gate the city does not require is a row
 * too, its sub-line saying so and its figures a dash, because "what you do
 * not need here" is the reading a mover wants as much as the other. The
 * card's one figure at 30 is the fee total; the wait total is the board's.
 * Never a coined score: `reg.enforcement_strictness_0_100` is on the shard
 * and prints nowhere (PART 9 clause 17).
 *
 * Pure over the shard, synchronous; null where the shard holds no gate.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityEntityId, cityFigure, loadCityShard } from "@/lib/facts/city_shard";
import { queryFacts } from "@/lib/facts/store";
import type { FactTag } from "@/lib/facts/types";
import type { TiersFigureRow, TiersHeads } from "@/components/spine/archetypes/TiersTable";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

type CityRow = { slug: string; name: string; iso2: string };
const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type CityGate = { key: string; name: string; days: number; cost: number; required: boolean; tag: FactTag };

export type CityGatesData = {
  slug: string;
  iso2: string;
  name: string;
  gates: CityGate[];
  /** The slowest required gate's days, the shard's own total. */
  totalDays: number | null;
  /** The fees summed, the shard's own total, printed as the card's figure. */
  totalCost: number | null;
  heads: TiersHeads;
  rows: TiersFigureRow[];
  basis: string;
  foot: string | null;
  sample: boolean;
};

/** The shard's gate rows, read off the store's rows for the entity: one gate per rowKey. */
function readGates(iso2: string, slug: string): CityGate[] {
  if (!loadCityShard(iso2, slug)) return [];
  const id = cityEntityId(iso2, slug);
  const byKey = new Map<string, Partial<CityGate> & { tag?: FactTag }>();
  for (const f of queryFacts({ entityId: id })) {
    if (!f.metric.startsWith("reg.local_gates.*.")) continue;
    const field = f.metric.slice("reg.local_gates.*.".length);
    const key = String(f.rowKey ?? "");
    const g = byKey.get(key) ?? { key };
    if (field === "gate" && typeof f.value === "string") g.name = f.value.trim();
    if (field === "days" && isNum(f.value)) g.days = f.value;
    if (field === "cost_usd" && isNum(f.value)) g.cost = f.value;
    /* The shard's boolean arrives through the store as a string or a number ("true", "false", 1, 0). */
    if (field === "required") g.required = String(f.value).toLowerCase() === "true" || f.value === 1;
    /* The gate's tag is its weakest field's. */
    g.tag = g.tag && g.tag !== "held" ? g.tag : f.tag;
    byKey.set(key, g);
  }
  return [...byKey.values()]
    .filter((g): g is CityGate => typeof g.name === "string" && g.name.length > 0 && isNum(g.days) && isNum(g.cost) && typeof g.required === "boolean")
    .map((g) => ({ ...g, tag: g.tag ?? "held" }));
}

export function buildCityGates(slug: string): CityGatesData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  const gates = readGates(iso2, slug);
  if (gates.length === 0) return null;
  const C = COPY.cityGates;
  const required = gates.filter((g) => g.required).sort((a, b) => b.days - a.days || b.cost - a.cost || a.name.localeCompare(b.name));
  const optional = gates.filter((g) => !g.required).sort((a, b) => a.name.localeCompare(b.name));
  const ordered = [...required, ...optional];
  const daysText = (d: number) => `${Math.round(d)} ${Math.round(d) === 1 ? C.units.day : C.units.days}`;
  /* THE NAME UNDER THREE WORDS (PART 9 clause 13, the model laws' ROW
     SENTENCE): the shard names a gate with its kind at the end ("Signage &
     facade permit", "Fire & safety inspection"); the kicker and the column
     head say the kind once, so the row keeps the gate's own words and drops
     the kind. A name the rule cannot shorten stands as the shard wrote it.
     THE FEE IS A FIGURE, never a word ("no word where a number goes", his
     2026-09-11 ruling; the model laws' UNIT MIX): a gate with no fee prints $0. */
  const shortName = (name: string) => name.replace(/\s+(permit|licen[cs]e|inspection|certificate|registration)$/i, "");
  const rows: TiersFigureRow[] = ordered.map((g) => ({
    key: g.key,
    name: shortName(g.name),
    sub: g.required ? null : C.notRequired,
    a: g.required ? daysText(g.days) : null,
    b: g.required ? usd(g.cost) : null,
  }));
  const totalDaysFig = cityFigure(iso2, slug, "reg.total_local_days");
  const totalCostFig = cityFigure(iso2, slug, "reg.total_local_cost_usd");
  const sample = gates.some((g) => g.tag !== "held") || (totalCostFig ? totalCostFig.tag !== "held" : false);
  return {
    slug,
    iso2,
    name: city.name,
    gates: ordered,
    totalDays: totalDaysFig ? Math.round(totalDaysFig.value) : null,
    totalCost: totalCostFig ? Math.round(totalCostFig.value) : null,
    heads: { name: C.heads.gate, a: C.heads.wait, b: C.heads.fee },
    rows,
    basis: C.basis,
    foot: sample ? C.footModelled : null,
    sample,
  };
}
