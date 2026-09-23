/**
 * src/lib/spine/city_crew_rows.ts
 *
 * WHAT THE CREW COSTS, ROLE BY ROLE, the city page's `20 crew` (2026-09-23,
 * brief NEW-SECTIONS-2026-09-23.md row Y3).
 *
 * THE PAIN. A person signing a lease has to know the wage bill before the
 * doors open, and every free page answers it with one average for the whole
 * city. An average is not a wage bill: a shop hires a manager, a supervisor
 * and three people on the counter, and those are three different numbers. This
 * card is the five roles with what each is paid a month, in this city.
 *
 * WHERE THE FIGURES COME FROM, with their coverage, measured 2026-09-23 by
 * `scripts/audit/unused_fields.mjs` and read by nothing under `src/` until this
 * builder: `labor.wages_by_role.*.role` and `.monthly_gross_usd` on the city
 * shard (`data/facts/city/<ISO2>-<slug>.json`). All 252 cities hold exactly
 * five roles under the same five keys (manager, supervisor, skilled_worker,
 * counter_staff, entry_level), gathered on 167 of them and modelled on 85.
 * London: 4,000, 3,500, 3,050, 2,900 and 2,825 dollars a month, all gathered.
 * The role's printed name is the file's own ("Skilled worker", "Counter
 * staff"), never a word invented here.
 *
 * THE FORM IS A LIST WITH FIGURES, NOT BARS, and the reason is the page and
 * not the data. Five named members with one money figure each is a ranking,
 * and briefs/VISUAL-CHOICE.md section 2 gives a ranking ranked bars; this page
 * already spends both of that kind's two seats (`18 market` and `03
 * districts`, clause 55), and section 1's third question is exactly this case:
 * "a form that is right in isolation can still be wrong here". So the ranking
 * keeps its order and its figures and loses its bars, which is the same answer
 * the trade page's density cell reached when the strip was spent.
 *
 * THE HEADLINE IS THE MIDDLE OF THE FIVE, the archetype's own law: a set's
 * middle, never a world middle claimed over five rows, and the label says so.
 *
 * WITHHOLDING: four roles with a figure is the floor (the archetype's), so a
 * shard holding fewer draws nothing rather than a short list.
 */
import { loadCityShard, cityEntityId, cityFigure } from "@/lib/facts/city_shard";
import { queryFacts } from "@/lib/facts/store";
import type { FactTag } from "@/lib/facts/types";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COPY } from "@/lib/spine/copy";

type CityRow = { slug: string; name: string; iso2: string };
const BY_SLUG = new Map((cityListJson as { cities: CityRow[] }).cities.map((c) => [c.slug, c]));

export const CREW_PREFIX = "labor.wages_by_role.*.";
/** The archetype's floor, repeated here so the builder and the card agree. */
export const CREW_FLOOR = 4;

export type CrewRow = { key: string; name: string; value: number };

export type CityCrewData = {
  slug: string;
  /** The five roles, dearest first. */
  rows: CrewRow[];
  /** The set's own middle, which is what the card prints at 30. */
  middle: { label: string; value: number };
  /** The week those wages buy, the wage bill's other half; absent where the shard has no hours. */
  week: { figure: string; words: string } | null;
  basis: string;
  tag: FactTag;
};

export function buildCityCrew(slug: string): CityCrewData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();
  if (!loadCityShard(iso2, slug)) return null;
  const id = cityEntityId(iso2, slug);
  const byKey = new Map<string, { key: string; role?: string; pay?: number; tag?: FactTag }>();
  for (const f of queryFacts({ entityId: id })) {
    if (!f.metric.startsWith(CREW_PREFIX)) continue;
    const field = f.metric.slice(CREW_PREFIX.length);
    const key = String(f.rowKey ?? "");
    const row = byKey.get(key) ?? { key };
    if (field === "role" && typeof f.value === "string" && f.value.trim()) row.role = f.value.trim();
    if (field === "monthly_gross_usd" && typeof f.value === "number" && Number.isFinite(f.value) && f.value > 0) row.pay = f.value;
    /* A PLACEHOLDER IS NOT A FIGURE (the bank's own word for a slot waiting on
       research): one placeholder among the five withholds the card, the way
       the city's spend card is withheld on London. */
    if (f.tag === "placeholder") return null;
    if (f.tag && f.tag !== "held") row.tag = "modeled";
    byKey.set(key, row);
  }
  const live = [...byKey.values()].filter((r) => r.role && typeof r.pay === "number");
  if (live.length < CREW_FLOOR) return null;
  const rows: CrewRow[] = live
    .map((r) => ({ key: r.key, name: r.role as string, value: r.pay as number }))
    .sort((a, b) => b.value - a.value);
  const ordered = [...rows].sort((a, b) => a.value - b.value);
  const middle = ordered[Math.floor(ordered.length / 2)];
  /* THE WEEK IS THE OTHER HALF OF A WAGE BILL, and the card owes it: a monthly
     wage says nothing about what it buys until the hours are beside it.
     `labor.typical_workweek_hours` on the same shard, 252 of 252, 35 to 48
     across the bank (145 cities at 40, 44 at 48), London 40. The other two
     fields of the brief's row Y4 are NOT here and the reasons are measured:
     `labor.min_wage_usd_mo` is the same figure as the entry-level row on 89
     cities including London, and `labor.employer_social_pct` disagrees with the
     country page's own on-cost on 164 of 252 (London 18 against 14), which
     would be a contradiction across two pages of one site. */
  const hours = cityFigure(iso2, slug, "labor.typical_workweek_hours");
  const week = hours && hours.value > 0
    ? { figure: `${Math.round(hours.value * 10) / 10}`, words: COPY.cityCrew.week }
    : null;
  return {
    slug,
    rows,
    week,
    middle: { label: COPY.cityCrew.middle.replace("{n}", String(rows.length)), value: middle.value },
    basis: COPY.cityCrew.basis,
    tag: live.some((r) => r.tag === "modeled") ? "modeled" : "held",
  };
}
