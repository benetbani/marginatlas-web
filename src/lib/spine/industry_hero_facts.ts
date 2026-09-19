/**
 * src/lib/spine/industry_hero_facts.ts
 *
 * THE INDUSTRY MASTHEAD'S FACTS, `00 take` (MODEL.md 8.7; plan step 34's
 * first dispatch, 2026-09-18), for the AnswerCard archetype and its stories,
 * the way trade_hero_facts.ts maps the trade's. Pure over the taxonomy, the
 * shard and the archetype table, synchronous, no database: the industry page
 * answers for the trade anywhere, so nothing here needs a place. The view
 * hands it the taxonomy id the adapter carries (`meta.id`); the stories and
 * the copy gates hand it an id straight.
 *
 * THE IDENTITY: the h1 is the trade's name; the flag's seat holds the trade's
 * 28px icon tile (trade_icon.ts, the identity variant of AnswerCard); the
 * crumb under the h1 is the sector, the altitude above the trade, named once.
 *
 * THE ANSWER, THE PAGE'S ONLY 40: the trade's net of every $100, from THE ONE
 * BUILDER (trade_net.ts, R7, clause 42), with no engine and no `moneyShown`,
 * because the industry page is the same shard's world figure: `resolveTradeNet`
 * with the engine absent lands 205 of 243 on the shard's ladder and 38 on
 * the sector profile's residual (the shards whose ladder is the 42 / 10 / 5
 * fill, withheld under clause 46), 0 unresolved (counted 2026-09-18 by
 * `countTradeNets`). The printed form is the builder's own whole percent, so
 * this 40 and `03 split`'s focal can never disagree. The basis says which
 * branch printed it: the trade's own, modelled, or the sector's typical. The
 * state word stands where the answer would only if neither holds a figure
 * (no trade today; the shape exists so the card can say it).
 *
 * THE COMPANIONS, 8.7's three, each with its file and field:
 *  - COST TO OPEN: `startupCapitalArchetypeKeyed(industryToSlug(id))`, the
 *    trade's typical cost to open in a typical economy, a TRADE figure marked
 *    modelled (R3, clause 38), 153 of 243 keyed; the 90 on the table's 80,000
 *    default are WITHHELD (clause 46, R11) and the foot says so in the
 *    not-gathered idiom (M19).
 *  - SPEND PER VISIT: `demand.spend_per_head_usd`, 243 of 243 (28 held);
 *    seven business-to-business shards hold it as zero (grain farming,
 *    forestry, civil engineering, three wholesale trades, pipeline transport,
 *    counted 2026-09-18), and a zero is not a spend: withheld with the line,
 *    the door's own note says the builder decides.
 *  - VISITS A YEAR: `demand.purchases_per_year`, 243 of 243 (28 held); four
 *    of the same seven hold zero, withheld the same way.
 * Every companion prints as modelled (R12, item 61), and its note says so in
 * words because the sample mark is behind his switch.
 *
 * THE FOOT: the not-gathered line for whichever companions are withheld,
 * then the coverage sentence over the ones that print.
 */
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import type { AtlasIconId } from "@/components/brand/icons";
import type { CityColumn } from "@/lib/markets/across_cities";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import { resolveTradeNet, type TradeNet } from "@/lib/spine/trade_net";
import { tradeIconFor } from "@/lib/spine/trade_icon";
import { industryFigure } from "@/lib/facts/industry_shard";
import { startupCapitalArchetypeKeyed } from "@/lib/markets/startup_capital_archetypes";
import { INDUSTRY_BY_ID, SECTOR_BY_ID, industryToSlug } from "@/lib/taxonomy";

type Conf = "measured" | "modeled" | "placeholder";
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export const INDUSTRY_HERO_METRICS = { spend: "demand.spend_per_head_usd", visits: "demand.purchases_per_year" } as const;

/** The companions in the order they stand, 8.7's. */
export const INDUSTRY_HERO_CELLS = ["cost", "spend", "visits"] as const;
export type IndustryHeroCellKey = (typeof INDUSTRY_HERO_CELLS)[number];

export type IndustryHeroFacts = {
  industryId: string;
  /** The trade's name, the h1. */
  name: string;
  /** The trade's icon tile, in the flag's seat. */
  tile: AtlasIconId;
  /** The identity crumb under the h1: the sector, once. */
  crumb: string[];
  /** The net of every $100, or null where neither the ladder nor the profile holds one. */
  answer: { label: string; value: string; basis: string; confidence: Conf } | null;
  /** The state word's strings, drawn where `answer` is null. */
  absent: { label: string; word: string; note: string };
  cells: KvCell[];
  /** The companions withheld, in the cells' order. */
  withheld: IndustryHeroCellKey[];
  foot: { text: string; modeled: boolean } | null;
  /** The one builder's net, for the gates. */
  net: TradeNet | null;
};

/** The sector's name as a person says it: the ampersand read as "and", a parenthetical dropped, lowercase. */
export function sectorPhrase(sectorId: string): string {
  const name = SECTOR_BY_ID[sectorId]?.name ?? sectorId.replace(/_/g, " ");
  return name.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s*&\s*/g, " and ").replace(/\s+/g, " ").trim().toLowerCase();
}

/** "a, b and c" over the parts given, in order. */
const joinParts = (parts: string[]) => (parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`);

export function industryHeroFacts(industryId: string | null | undefined): IndustryHeroFacts | null {
  if (!industryId) return null;
  const ind = INDUSTRY_BY_ID[industryId];
  if (!ind) return null;
  const net = resolveTradeNet(industryId, { moneyShown: false, netMarginPct: null });
  const answer = net
    ? { label: COPY.industryHero.answerLabel, value: net.text, basis: net.branch === "profile" ? COPY.industryHero.answerBasisProfile : COPY.industryHero.answerBasisShard, confidence: "modeled" as Conf }
    : null;
  const cost = startupCapitalArchetypeKeyed(industryToSlug(industryId));
  const spend = industryFigure(industryId, INDUSTRY_HERO_METRICS.spend)?.value;
  const visits = industryFigure(industryId, INDUSTRY_HERO_METRICS.visits)?.value;
  const cells: KvCell[] = [];
  const withheld: IndustryHeroCellKey[] = [];
  const C = COPY.industryHero.cells;
  if (isNum(cost) && cost > 0) cells.push({ key: "cost", label: C.cost.label, value: usd(cost), note: C.cost.note, confidence: "modeled" }); else withheld.push("cost");
  if (isNum(spend) && spend > 0) cells.push({ key: "spend", label: C.spend.label, value: usd(spend), note: C.spend.note, confidence: "modeled" }); else withheld.push("spend");
  if (isNum(visits) && visits > 0) cells.push({ key: "visits", label: C.visits.label, value: String(Math.round(visits)), note: C.visits.note, confidence: "modeled" }); else withheld.push("visits");
  const notGathered = withheld.length ? COPY.industryHero.notGathered.replace("{parts}", joinParts(withheld.map((k) => COPY.industryHero.parts[k]))) : null;
  const printed = INDUSTRY_HERO_CELLS.filter((k) => !withheld.includes(k)).map((k) => COPY.industryHero.names[k]);
  const coverage = printed.length === 0 ? null : (printed.length === 1 ? COPY.industryHero.footOne : COPY.industryHero.footAll).replace("{names}", joinParts(printed));
  const footText = [notGathered, coverage].filter((t): t is string => !!t).join(" ");
  const sector = SECTOR_BY_ID[ind.sector_id]?.name;
  return {
    industryId,
    name: ind.name,
    tile: tradeIconFor(industryId),
    crumb: sector ? [sector] : [],
    answer,
    absent: { label: COPY.industryHero.answerLabel, word: COPY.industryHero.absent, note: COPY.industryHero.absentNote },
    cells,
    withheld,
    foot: footText ? { text: footText, modeled: true } : null,
    net,
  };
}

/**
 * THE TRADES THE SHEET DRAWS, by handle, chosen from the data on 2026-09-18
 * by counting the builders over the 243 ids (`countIndustryHeroStates`,
 * `countBenchmarkStates`): the exemplar (restaurants: the ladder's net, the
 * cost keyed, spend and visits held, the sector's five bars ranked with two
 * members withheld); the one in-scope trade on both the ladder fill and the
 * archetype's default (alarm systems: the answer is the sector profile's
 * residual and its basis says so, the cost withheld with the not-gathered
 * foot); the one two-member sector on the sheet (telecommunications: both
 * members on the fill, so the benchmark holds no row and stands withheld;
 * the trade is retired and no route reaches it, drawn by id as the seven-row
 * team is); and a three-member sector in scope (game development studios:
 * the short table under the floor line). A handle is a name for an id, so a
 * story key stays short ("industry:restaurants:take"). No seed and no
 * database: every industry builder is pure over the shard.
 */
export const INDUSTRY_INSTANCES: Record<string, { id: string; why: string; blocks?: readonly string[] }> = {
  restaurants: { id: "restaurants", why: "the exemplar: the ladder's net at 40, the three companions, the sector's five bars with two members withheld" },
  "alarm-systems": { id: "alarm_systems_install", why: "the ladder is the file's fill and the cost is the table's default: the sector profile's residual as the answer with its own basis, the cost withheld in the foot", blocks: ["take"] },
  telecom: { id: "telecom", why: "a two-member sector with both members on the fill: the benchmark withheld, the not-gathered line where the rows would stand (a retired trade, drawn by id)", blocks: ["benchmark"] },
  "game-dev": { id: "game_dev_studios", why: "a three-member sector, every member holding a figure: the short table under the floor line", blocks: ["benchmark"] },
  /* Plan step 34's second dispatch (2026-09-18): turn one's thin shards. */
  chiropractic: { id: "chiropractic", why: "the split withheld: the sector profile's lines and the ladder's net come to more than a hundred, the net still at 30, the stated line where the bar would stand", blocks: ["split"] },
  plumbers: { id: "plumbers", why: "a five-licence shard: the plus at its fullest, five rows by name with their days", blocks: ["open"] },
  "watch-repair": { id: "watch_jewelry_repair", why: "the thin shard: two licences (the plus at its floor), a crew of three, two years to pay back, the profile's lines", blocks: ["open", "pays"] },
  /* Plan step 34's third dispatch (2026-09-19): turn two's shards, counted
     against the database (scratchpad/step34c/places-count3.json) and the
     shards. THE PLACES TABLE HAS NO DATA INSTANCE: under the own-row law
     (industry_places_rows.ts) no trade holds four cities of their own, so
     the block is seated on 243 of 243 and the sheet draws the seat in its
     three lines: restaurants (two own figures of eight resolved, New York
     read and London curated), grocery stores (one own of twelve resolved,
     the most withheld) and pet training (nothing resolves, the none line).
     Cabinet making is one of the 38 fill shards whose route resolves to
     itself, with four formats and a four-part mix, so it serves the formats
     on the profile's residual and the mix at four parts. NO EXTREME-NAME
     STORY FOR THE FORMATS, and the reason is measured: a format name that
     wraps to a second line spills MarkList's declared row by 3px (the
     archetype's UNEQUAL, watched red on tiling's 65-character name at every
     width), which is the copy fault PART 5 names ("a label over three words
     is a copy fault reported by the harness, not a taller row"), the data
     track's to shorten (QUEUE industry:format-names-over-three, item 71's
     class); a red story on the sheet would stop the chain for a fault no
     card can fix, so the count stands in the copy gate's line and the
     report instead: 55 of 243 shards (70 rows) spill at the 693 seat and 81
     (101 rows) at 375, the shortest spilling name 35 characters
     (scratchpad/step34c/formats-spill.json, 2026-09-19). */
  cabinets: { id: "cabinet_making", why: "a fill shard on the sector profile's residual: the formats on residual plus delta under the profile basis, and a four-part mix", blocks: ["formats", "channels"] },
  grocery: { id: "grocery_stores", why: "twelve cities of the slate resolve and one is its own (London's curated entry): the seat naming one of fifteen, the most cities withheld", blocks: ["places"] },
  "pet-training": { id: "pet_training", why: "no city of the slate resolves: the seat's none line", blocks: ["places"] },
};

/** Whether a handle serves a block's story: every block unless the handle names its own. */
export function industryServes(handle: string, block: string): boolean {
  const inst = INDUSTRY_INSTANCES[handle];
  return !!inst && (!inst.blocks || inst.blocks.includes(block));
}

/** A places story's instance: the handle, its id and the slate resolved for it (the columns, or null for a trade the taxonomy does not hold). */
export type IndustryPlacesInstance = { key: string; id: string; why: string; across: CityColumn[] | null };

/**
 * THE SLATE RESOLVED FOR THE PLACES STORIES (MODEL.md 8.7 `06 places`; plan
 * step 34's third dispatch, 2026-09-19): the one industry block whose feed is
 * the database, so its stories load the way the trade page's cell seeds do
 * (trade_hero_facts.ts `loadCellHeroInstances`): async, the resolver imported
 * on demand so this module's static graph stays free of the database client,
 * one handle or every handle serving `places`. A handle the resolver cannot
 * answer self-omits from the sheet.
 */
export async function loadIndustryPlacesInstances(handles: string[] = Object.keys(INDUSTRY_INSTANCES).filter((h) => industryServes(h, "places"))): Promise<IndustryPlacesInstance[]> {
  const { resolveAcrossColumns } = await import("@/lib/markets/across_cities");
  const out: IndustryPlacesInstance[] = [];
  for (const key of handles) {
    const inst = INDUSTRY_INSTANCES[key];
    if (!inst || !industryServes(key, "places")) continue;
    try {
      out.push({ key, id: inst.id, why: inst.why, across: await resolveAcrossColumns(inst.id) });
    } catch { /* a trade the resolver cannot answer self-omits from the stories */ }
  }
  return out;
}

/** How the 243 fall, counted rather than remembered, for the gates and the record. */
export function countIndustryHeroStates(ids: string[]): { total: number; answered: number; absent: number; ladder: number; profile: number; costWithheld: number; spendWithheld: number; visitsWithheld: number; allThree: number } {
  const out = { total: ids.length, answered: 0, absent: 0, ladder: 0, profile: 0, costWithheld: 0, spendWithheld: 0, visitsWithheld: 0, allThree: 0 };
  for (const id of ids) {
    const f = industryHeroFacts(id);
    if (!f) continue;
    if (f.answer) out.answered++; else out.absent++;
    if (f.net?.branch === "shard") out.ladder++; else if (f.net?.branch === "profile") out.profile++;
    if (f.withheld.includes("cost")) out.costWithheld++;
    if (f.withheld.includes("spend")) out.spendWithheld++;
    if (f.withheld.includes("visits")) out.visitsWithheld++;
    if (f.withheld.length === 0) out.allThree++;
  }
  return out;
}
