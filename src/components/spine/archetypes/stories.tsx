/**
 * STORIES for the archetypes: each component drawn across an instance set
 * chosen FROM THE DATA, never typed, so the harness and the founder see the
 * exemplar, the data-poor cases, the extreme names and the self-omit state on
 * one page. Widths are the harness's business.
 */
import * as React from "react";
import { COUNTRIES } from "@/lib/taxonomy";
import { getCountryProfile } from "@/lib/economic_profile";
import { buildHeroFacts, type HeroFacts } from "@/lib/spine/hero_facts";
import { marginCardFromSnapshot, snapshotCountries, SNAPSHOT_TAKEN } from "@/lib/spine/margin_rows";
import { buildPeerTable, buildCityPeerTable } from "@/lib/spine/peer_rows";
import { COPY } from "@/lib/spine/copy";
import { AnswerCard } from "./AnswerCard";
import { KvGrid } from "./KvGrid";
import { cityHeroFacts, type CityHeroInstance } from "@/lib/spine/city_hero_facts";
import { buildCityDistrictBars, rentMult } from "@/lib/spine/district_rows";
import { RankedBars } from "./RankedBars";
import { CompareTable } from "./CompareTable";
import { CardPager } from "./CardPager";
import { CityCards, type CityCardsLook } from "./CityCards";
import { buildCityCards } from "@/lib/spine/city_cards";
import { TiersTable } from "./TiersTable";
import { buildSetupRows, howToOpenDoor } from "@/lib/spine/setup_rows";
import { RangeStrip } from "./RangeStrip";
import { buildPremisesStrip, buildCustomersStrip, buildCityEarningsStrip } from "@/lib/spine/range_rows";
import { cityTypicalIncome } from "@/lib/spine/city_income";
import { buildPremisesBento, listedCitySlugs } from "@/lib/spine/premises_bento_rows";
import { premisesCells } from "@/components/spine/city/premises";
import { SpectraTable } from "./SpectraTable";
import { buildCharacterTables, buildCityCharacterTables, buildCityPeopleTable, listedCitySlugsForCharacter } from "@/lib/spine/character_rows";
import { NoteList } from "./NoteList";
import { buildLocalsNotes, countriesWithNotes } from "@/lib/spine/locals_rows";
import { buildChecks } from "@/lib/spine/checks_rows";
import { Terminus } from "./Terminus";
import { buildCloseDoors, buildCityCloseDoors, buildCompareDoor, buildTradeCloseDoors } from "@/lib/spine/close_rows";
import { coveredCities } from "@/lib/cities/city_pages";
import { PayBars } from "./PayBars";
import { buildPayBars } from "@/lib/spine/pay_rows";
import { buildGlance } from "@/lib/spine/glance_rows";
import { buildWorldSeat } from "@/lib/spine/world_seat_rows";
import { buildCityGlance } from "@/lib/spine/city_glance_rows";
import { buildCitySeat } from "@/lib/spine/city_seat_rows";
import { buildCityLiving, buildCityRunway, buildCityDemand, buildCitySeason } from "@/lib/spine/fact_rows";
import { buildCityNeighbourhoods, citiesWithScheme } from "@/lib/spine/hood_rows";
import { buildEntryBill } from "@/lib/spine/entry_bill_rows";
import { buildRunningCosts } from "@/lib/spine/running_costs_rows";
import { usd, Box, Rail, CARD_SURFACE } from "@/components/spine/kit";
import { DetailPanel, type DetailRow } from "./DetailPanel";
import { IncomeBreakdown } from "./IncomeBreakdown";
import { buildIncomeBreakdown } from "@/lib/spine/income_rows";
import { BentoBand, BentoMetric, BentoCount, type BentoCell } from "./BentoBand";
import { MarkList } from "./MarkList";
import { buildMarkList } from "@/lib/spine/mark_list_rows";
import { BlockedSeat } from "./BlockedSeat";
import { CountryFlag } from "@/components/CountryFlag";
import { EVERYDAY_TRADES } from "@/lib/spine/adapt_city";
import { tradeHeroFacts, cellServes, type CellHeroInstance } from "@/lib/spine/trade_hero_facts";
import { buildPermits } from "@/lib/spine/permits_rows";
import { buildOpen } from "@/lib/spine/open_rows";
import { PermitsCard, OpenCard, SplitCard, TeamCard, PeersCard } from "@/components/spine/cell/turn-one";
import { ClearsCard, LastsCard, WatchSeat, MixCard } from "@/components/spine/cell/turn-two";
import { RivalsCard, WorthCard, CloseCard } from "@/components/spine/cell/exit";
import { buildRivals } from "@/lib/spine/rivals_rows";
import { buildWorth } from "@/lib/spine/worth_rows";
import { marketCells } from "@/components/spine/cell/market";
import { buildMix } from "@/lib/spine/mix_rows";
import { buildMarket } from "@/lib/spine/market_rows";
import { buildTradeSpread } from "@/lib/spine/trade_spread_rows";
import { buildSuits } from "@/lib/spine/suits_rows";
import { buildSplit } from "@/lib/spine/split_rows";
import { buildTeam, tallestTeamTrade } from "@/lib/spine/team_rows";
import { buildTradePeers } from "@/lib/spine/trade_peer_rows";
import { buildClears } from "@/lib/spine/clears_rows";
import { buildLasts } from "@/lib/spine/lasts_rows";
import { ALL_INDUSTRIES } from "@/lib/taxonomy";

export type Instance = { iso2: string; why: string };

const codes = () => (COUNTRIES as any[]).map((c) => String(c.code ?? c.iso2 ?? "").toUpperCase()).filter((c) => c.length === 2);
const nameOf = (iso2: string) => String((COUNTRIES as any[]).find((c) => c.code === iso2)?.name ?? iso2);

/** The instance set for the answer card, derived from the data. */
export function pickAnswerCardInstances(): Instance[] {
  const facts = codes().map((c) => ({ c, f: buildHeroFacts(c) })).filter((x) => x.f.answer || x.f.cells.length > 0);
  const out: Instance[] = [{ iso2: "GB", why: "the exemplar" }];
  const seen = new Set(["GB"]);
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  [...facts].sort((a, b) => (a.f.cells.length + (a.f.answer ? 1 : 0)) - (b.f.cells.length + (b.f.answer ? 1 : 0))).slice(0, 3).forEach((x) => take(x.c, `data-poor: ${x.f.cells.length} cells${x.f.answer ? "" : ", no answer"}`));
  [...facts].sort((a, b) => (b.f.name.length + (b.f.answer?.regime?.length ?? 0)) - (a.f.name.length + (a.f.answer?.regime?.length ?? 0))).slice(0, 3).forEach((x) => take(x.c, "extreme name"));
  for (const tier of ["A", "B", "C"] as const) {
    const hit = facts.find((x) => { const p = getCountryProfile(x.c); return p.iso2.toUpperCase() === x.c && p.tier === tier && !seen.has(x.c); });
    if (hit) take(hit.c, `profile tier ${tier}`);
  }
  return out;
}

/** The instance set for the ranked bars, from the margin snapshot. */
export function pickRankedBarsInstances(): Instance[] {
  const all = snapshotCountries().map((c) => ({ c, card: marginCardFromSnapshot(c)! })).filter((x) => x.card);
  const out: Instance[] = [{ iso2: "GB", why: "the exemplar" }];
  const seen = new Set(["GB"]);
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  const byCount = [...all].sort((a, b) => b.card.rows.length - a.card.rows.length);
  if (byCount[0]) take(byCount[0].c, `most credible rows: ${byCount[0].card.rows.length}`);
  const exactlyTwo = all.find((x) => x.card.rows.length === 2 && x.c !== "GB"); if (exactlyTwo) take(exactlyTwo.c, "two credible rows");
  const drawable = all.filter((x) => x.card.rows.length >= 2);
  const leaderIso = [...drawable].sort((a, b) => Math.max(...b.card.rows.map((r) => r.margin)) - Math.max(...a.card.rows.map((r) => r.margin)))[0]; if (leaderIso) take(leaderIso.c, "the highest credible margin among drawable cards");
  const none = all.find((x) => x.card.rows.length < 2 && x.card.withheld >= 4); if (none) take(none.c, "self-omits: fewer than two credible");
  const longName = [...all].filter((x) => x.card.rows.length >= 2).sort((a, b) => nameOf(b.c).length - nameOf(a.c).length)[0]; if (longName) take(longName.c, "extreme name");
  return out;
}

/** The instance set for the comparison table. */
export function pickCompareTableInstances(): Instance[] {
  const all = codes().map((c) => ({ c, t: buildPeerTable(c) }));
  const out: Instance[] = [{ iso2: "GB", why: "the exemplar" }];
  const seen = new Set(["GB"]);
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  const gaps = all.filter((x) => x.t).map((x) => ({ ...x, missing: x.t!.rows.reduce((n, r) => n + Object.values(r.values).filter((v) => v == null).length, 0) })).sort((a, b) => b.missing - a.missing)[0];
  if (gaps && gaps.missing > 0) take(gaps.c, `most values not held: ${gaps.missing}`);
  const longest = all.filter((x) => x.t).sort((a, b) => Math.max(...b.t!.rows.map((r) => r.name.length)) - Math.max(...a.t!.rows.map((r) => r.name.length)))[0]; if (longest) take(longest.c, "extreme name in a row");
  const none = all.find((x) => !x.t); if (none) take(none.c, "self-omits: no peer group");
  const free = all.filter((x) => x.t).find((x) => x.t!.rows.some((r) => r.values.llc_cost_usd === 0)); if (free) take(free.c, "a zero fee prints as the word");
  return out;
}

/** The instance set for the card pager. */
export function pickCardPagerInstances(): Instance[] {
  const all = codes().map((c) => ({ c, cards: buildCityCards(c) }));
  const out: Instance[] = [{ iso2: "GB", why: "the exemplar" }];
  const seen = new Set(["GB"]);
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  const most = [...all].filter((x) => x.cards).sort((a, b) => b.cards!.cards.length - a.cards!.cards.length)[0]; if (most && most.cards!.cards.length > 5) take(most.c, `most cities: ${most.cards!.cards.length}, so the arrows render`);
  const one = all.find((x) => x.cards && x.cards.cards.length === 1); if (one) take(one.c, "one city");
  const longest = [...all].filter((x) => x.cards).sort((a, b) => Math.max(...b.cards!.cards.map((k) => k.name.length)) - Math.max(...a.cards!.cards.map((k) => k.name.length)))[0]; if (longest) take(longest.c, "extreme name");
  const none = all.find((x) => !x.cards); if (none) take(none.c, "self-omits: no covered city");
  /* THE CITY'S NEIGHBOURHOODS (MODEL.md 8.3 `14 neighbourhoods`; plan step
     32's sixth dispatch, 2026-09-18), keyed city:<slug>:hoods, off
     `buildCityNeighbourhoods`, no image on any card (`images="none"`): the
     exemplar (seven real districts, so the arrows render and the second page
     holds three), the city with the most districts, the curated city with
     the longest district name (it wraps to a second line and the row grows
     with it), and the curated city with the fewest. The 209 placeholder
     cities draw the blocked seat, which is a blocked-seat story. */
  const hoods = citiesWithScheme().map((slug) => ({ slug, h: buildCityNeighbourhoods(slug) })).filter((x) => x.h?.cards);
  take("city:london:hoods", "the exemplar city's seven districts: four a row, the arrows, three on the second page, no image");
  const mostHoods = [...hoods].sort((a, b) => b.h!.cards!.length - a.h!.cards!.length || a.slug.localeCompare(b.slug))[0]; if (mostHoods) take(`city:${mostHoods.slug}:hoods`, `the most districts a city holds, ${mostHoods.h!.cards!.length}`);
  const longHood = [...hoods].sort((a, b) => Math.max(...b.h!.cards!.map((k) => k.name.length)) - Math.max(...a.h!.cards!.map((k) => k.name.length)) || a.slug.localeCompare(b.slug))[0]; if (longHood) take(`city:${longHood.slug}:hoods`, "the longest district name, wrapping to a second line");
  const fewHoods = [...hoods].sort((a, b) => a.h!.cards!.length - b.h!.cards!.length || a.slug.localeCompare(b.slug))[0]; if (fewHoods) take(`city:${fewHoods.slug}:hoods`, `the fewest districts on a curated scheme, ${fewHoods.h!.cards!.length}`);
  return out;
}

/* THE CITY CARDS, B11, 2026-09-10. Three looks of one card, built as
   ALTERNATIVES for the founder to choose between, so the instance key is
   "<iso2>:<look>" and the same countries are drawn in each look: the exemplar,
   the longest city name in the whole set, and a country holding exactly one
   covered city (where neither the tint nor the mark has a set to scale within,
   so both must draw nothing rather than an empty track). */
export const CITY_CARD_LOOKS: CityCardsLook[] = ["field", "plate", "column"];
export function pickCityCardsInstances(): Instance[] {
  const all = codes().map((c) => ({ c, cards: buildCityCards(c) })).filter((x) => x.cards);
  const seeds: Instance[] = [{ iso2: "GB", why: "the exemplar" }];
  const seen = new Set(["GB"]);
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); seeds.push({ iso2, why }); } };
  const longest = [...all].sort((a, b) => Math.max(...b.cards!.cards.map((k) => k.name.length)) - Math.max(...a.cards!.cards.map((k) => k.name.length)))[0];
  if (longest) take(longest.c, `extreme name: ${longest.cards!.cards.reduce((m, k) => (k.name.length > m.length ? k.name : m), "")}`);
  const one = all.find((x) => x.cards!.cards.length === 1);
  if (one) take(one.c, "one city, so nothing is drawn against a set");
  return CITY_CARD_LOOKS.flatMap((look) => seeds.map((s) => ({ iso2: `${s.iso2}:${look}`, why: `${look}, ${s.why}` })));
}

export function CityCardsStories({ instances = pickCityCardsInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="city-cards">
      {instances.map((i) => {
        const [iso2, look] = i.iso2.split(":") as [string, CityCardsLook];
        const c = buildCityCards(iso2);
        const el = c ? (
          <div className="rounded-[14px] border border-[var(--c-line-strong)] p-5" style={{ maxWidth: 693, ...CARD_SURFACE }}>
            <Rail icon="best-areas" kicker={COPY.cities.kicker} />
            <CityCards cards={c.cards} allHref={c.allHref} allLabel={COPY.cities.allLabel} basis={COPY.cityCards.plain.basis} basisDrawn={COPY.cityCards[look].basis} look={look} prevLabel={COPY.cities.prev} nextLabel={COPY.cities.next} />
          </div>
        ) : null;
        return <Story kind="city-cards" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** THE TRADE'S TEAM, `06 team` (MODEL.md 8.6; plan step 33's third dispatch, 2026-09-18), keyed cell:<handle>:team off the seeds the sheet loads and drawn by the page's own card (cell/turn-one.tsx TeamCard) at the 416 the narrow seat of the 3-2 takes at 1280: the exemplar's five roles with a year's pay off the United Kingdom's median, London shoe repair's two roles (the table's floor), Cairo restaurants with no median (the pay column in dashes, the line said once). THE SEVEN-ROW TABLE is the planted key cell:most-roles:team, built off the one seven-row shard by id with the United Kingdom's median and no seed: the shard belongs to a retired trade (commercial construction, merged into residential construction) that no live route reaches, and the tallest table the data holds has to be on the sheet for the band to be measured against it. */
export const cellTeamKey = (c: CellHeroInstance) => `cell:${c.key}:team`;
export const MOST_ROLES_KEY = "cell:most-roles:team";
const teamWhy = (t: NonNullable<ReturnType<typeof buildTeam>>) => `trade block 06: ${t.rows.length} roles with a headcount and a year's pay${t.median == null ? ", no median for the country so the pay column prints dashes and the card says so once" : ""}, no winner mark`;
export function pickCellTeamInstances(cell: CellHeroInstance[]): Instance[] {
  const out = cell.filter((c) => cellServes(c.key, "team")).map((c) => ({ c, t: buildTeam(c.seed?.meta?.industry_id, c.seed?.meta?.iso2) })).filter((x) => x.t).map(({ c, t }) => ({ iso2: cellTeamKey(c), why: teamWhy(t!) }));
  const tallest = tallestTeamTrade(ALL_INDUSTRIES.map((i) => i.id));
  if (tallest) out.push({ iso2: MOST_ROLES_KEY, why: `trade block 06 at its tallest: the ${tallest.rows}-row shard (${tallest.id}, a retired trade no route reaches), drawn by id with the United Kingdom's median` });
  return out;
}
/** The team's inputs for the planted key: the tallest shard by id and the exemplar's country. */
export function mostRolesTeam(): ReturnType<typeof buildTeam> {
  const tallest = tallestTeamTrade(ALL_INDUSTRIES.map((i) => i.id));
  return tallest ? buildTeam(tallest.id, "GB") : null;
}

/** The instance set for the tiers table. */
export function pickTiersTableInstances(): Instance[] {
  const all = codes().map((c) => ({ c, rows: buildSetupRows(c) }));
  const out: Instance[] = [{ iso2: "GB", why: "the exemplar" }];
  const seen = new Set(["GB"]);
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  const most = [...all].sort((a, b) => b.rows.length - a.rows.length)[0]; if (most) take(most.c, `most tiers: ${most.rows.length}`);
  const longest = [...all].filter((x) => x.rows.length).sort((a, b) => Math.max(...b.rows.map((r) => (r.local_term ?? "").length)) - Math.max(...a.rows.map((r) => (r.local_term ?? "").length)))[0]; if (longest) take(longest.c, "longest local term");
  const gap = all.find((x) => x.rows.length && x.rows.some((r) => r.cost_usd == null || r.days == null)); if (gap) take(gap.c, "a value not held");
  const dup = all.find((x) => x.rows.length && new Set(x.rows.map((r) => r.tier)).size < x.rows.length); if (dup) take(dup.c, "one legal family, two forms");
  const none = all.find((x) => x.rows.length === 0); if (none) take(none.c, "self-omits: no formation rows");
  return out;
}

/** The instance set for the range strips: premises then customers, keyed "XX:premises" / "XX:customers". */
export function pickRangeStripInstances(): Instance[] {
  const out: Instance[] = [];
  const seen = new Set<string>();
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  const prem = codes().map((c) => ({ c, d: buildPremisesStrip(c) })).filter((x) => x.d);
  take("GB:premises", "the exemplar");
  const ratio = (x: any) => { const v = x.d.marks.map((m: any) => m.value); return v.length >= 2 ? Math.max(...v) / Math.min(...v) : 0; };
  const widest = [...prem].sort((a, b) => ratio(b) - ratio(a))[0]; if (widest) take(`${widest.c}:premises`, `widest spread, ${ratio(widest).toFixed(1)} times`);
  const tightest = [...prem].filter((x) => x.d!.marks.length >= 2).sort((a, b) => ratio(a) - ratio(b))[0]; if (tightest) take(`${tightest.c}:premises`, `tightest spread, ${ratio(tightest).toFixed(2)} times, so the labels step`);
  const one = prem.find((x) => x.d!.marks.length === 1); if (one) take(`${one.c}:premises`, "one mark, the figure form");
  const cust = codes().map((c) => ({ c, d: buildCustomersStrip(c) })).filter((x) => x.d);
  take("GB:customers", "the exemplar");
  const withSpread = cust.find((x) => x.d!.marks.length === 3); if (withSpread) take(`${withSpread.c}:customers`, "deciles researched, the spread drawn");
  const noSpread = cust.find((x) => x.d!.marks.length === 1 && x.c !== "GB"); if (noSpread) take(`${noSpread.c}:customers`, "the typical alone, deciles not researched");
  return out;
}

/** A story's id on the page, from its kind and its key, so the index can link to it (sys:stories-index, run 21). */
export const storyId = (kind: string, key: string) => `story-${kind}-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
function Story({ kind, iso2, why, children }: { kind: string; iso2: string; why: string; children: React.ReactNode }) {
  return (
    <section id={storyId(kind, iso2)} data-story={iso2} className="mb-12">
      <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{iso2}, {why}</div>
      {children ?? <div data-self-omit="1" className="text-[length:var(--t-body)] text-[var(--c-muted)]">self-omits</div>}
    </section>
  );
}

export function AnswerCardStory({ facts, why }: { facts: HeroFacts; why: string }) {
  return (
    <Story kind="answer-card" iso2={facts.iso2} why={why}>
      <AnswerCard id={`take-${facts.iso2.toLowerCase()}`} name={facts.name} iso2={facts.iso2} subtitle={facts.subtitle} answer={facts.answer} cells={facts.cells} />
    </Story>
  );
}

/** THE TRADE'S TAKE, `00 take` (MODEL.md 8.6; plan step 33's first dispatch, 2026-09-18), keyed cell:<handle>:take off the seeds the sheet loads (trade_hero_facts.ts CELL_INSTANCES): the exemplar with money shown, and the untrusted cell with the state word. Drawn exactly as cell/masthead.tsx draws it, the crumb under the h1, the one net builder's figure in the first companion. */
export const cellTakeKey = (c: CellHeroInstance) => `cell:${c.key}:take`;
export function pickCellTakeInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "take") && tradeHeroFacts(c.seed)).map((c) => ({ iso2: cellTakeKey(c), why: c.why }));
}
export function AnswerCardStories({ instances = pickAnswerCardInstances(), cell = [] }: { instances?: Instance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="answer-card">
      {/* The country half draws the two-letter keys alone: the kind's list also carries the cell keys (pickAllInstances), and the country builder handed "cell:london:take" returns a bogus code with no answer, which drew a second, false card for each cell on the first full run. */}
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => <AnswerCardStory key={i.iso2} facts={buildHeroFacts(i.iso2)} why={i.why} />)}
      {cell.filter((c) => cellServes(c.key, "take")).map((c) => {
        const f = tradeHeroFacts(c.seed);
        const el = f ? <AnswerCard id={`take-cell-${c.key}`} name={f.name} iso2={f.iso2} crumb={f.crumb} subtitle={null} answer={f.answer} absent={f.absent} cells={f.cells} tone="accent" foot={f.foot} /> : null;
        return <Story kind="answer-card" key={cellTakeKey(c)} iso2={cellTakeKey(c)} why={c.why}>{el}</Story>;
      })}
    </div>
  );
}

/** THE TRADE'S PERMITS AND ITS COST TO OPEN (MODEL.md 8.6 `03 permits | 04 open`; plan step 33's second dispatch, 2026-09-18), keyed cell:<handle>:permits and cell:<handle>:open off the seeds the sheet loads, drawn by the page's own cards (cell/turn-one.tsx) at the widths their seats take at 1280: the permits at the narrow 416 of the 2-3, the cost to open at its wide 624. The permits on three shards: the exemplar's four licences, a three-licence shard and a five-licence one. The cost to open in its three states across two kinds: held on ranked-bars (London, nine lines), baseline and withheld on bento-metric (California restaurants keyed, London shoe repair on the default). */
export const cellPermitsKey = (c: CellHeroInstance) => `cell:${c.key}:permits`;
const permitsWhy = (p: NonNullable<ReturnType<typeof buildPermits>>) => `trade block 03: ${p.cells.length} licences over their typical days${p.withheld ? ", one withheld" : ""}, the longest wait first at the head rung (the focal cell is a candidate awaiting his click)`;
export function pickCellPermitsInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "permits")).map((c) => ({ c, p: buildPermits(c.seed?.meta?.industry_id) })).filter((x) => x.p).map(({ c, p }) => ({ iso2: cellPermitsKey(c), why: permitsWhy(p!) }));
}
export const cellOpenKey = (c: CellHeroInstance) => `cell:${c.key}:open`;
const openWhy = (o: NonNullable<ReturnType<typeof buildOpen>>) =>
  o.state === "held" ? `trade block 04 held: ${o.rows.length} setup lines as one set, the total at 30 in terracotta over them, the biggest line lit, the two companions in the foot`
    : o.state === "baseline" ? "trade block 04 baseline: no setup lines, the trade's typical cost to open at 30 in terracotta, modelled, the two companions in the foot"
    : "trade block 04 withheld: the trade on the archetype's default, the stated line at 16 where the total would stand, unaccented, the two companions in the foot";
export function pickCellOpenInstances(cell: CellHeroInstance[], kind: "ranked-bars" | "bento-metric"): Instance[] {
  return cell.filter((c) => cellServes(c.key, "open")).map((c) => ({ c, o: buildOpen(c.seed) })).filter((x) => x.o && (kind === "ranked-bars" ? x.o.state === "held" : x.o.state !== "held")).map(({ c, o }) => ({ iso2: cellOpenKey(c), why: openWhy(o!) }));
}
/** The city district rankings (city:districts, run 25): the city with ranked districts, and one with none, which self-omits. */
export function pickCityDistrictInstances(cities: CityHeroInstance[]): CityHeroInstance[] {
  const out: CityHeroInstance[] = [];
  const ranked = cities.find((c) => buildCityDistrictBars(c.seed));
  if (ranked) out.push({ ...ranked, why: `${buildCityDistrictBars(ranked.seed)!.districts} districts ranked by rent, the cheapest leading and none featured` });
  const none = cities.find((c) => c !== ranked && !buildCityDistrictBars(c.seed));
  if (none) out.push({ ...none, why: "self-omits: no ranked districts" });
  return out;
}
export function RankedBarsStories({ instances = pickRankedBarsInstances(), city = [], cell = [] }: { instances?: Instance[]; city?: CityHeroInstance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="ranked-bars">
      {cell.filter((c) => cellServes(c.key, "open")).map((c) => {
        const o = buildOpen(c.seed);
        if (!o || o.state !== "held") return null;
        return <Story kind="ranked-bars" key={cellOpenKey(c)} iso2={cellOpenKey(c)} why={openWhy(o)}><div style={{ maxWidth: 693 }}><OpenCard id={`open-cell-${c.key}`} open={o} /></div></Story>;
      })}
      <p className="mb-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">Margins from the engine snapshot of {SNAPSHOT_TAKEN}.</p>
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => {
        const card = marginCardFromSnapshot(i.iso2);
        const el = card && card.rows.length >= 2 ? (
          <RankedBars id={`money-${i.iso2.toLowerCase()}`} kicker={`${COPY.margin.kicker}, ${nameOf(i.iso2)}`} icon="owner-keeps" tagged basis={COPY.margin.basis} withheldLine={card.withheldLine} rows={card.rows.map((r) => ({ key: r.key, name: r.name, value: r.margin, flagged: r.flagged }))} worldMax={card.worldMax} fmt={(v) => `${Math.round(v * 100)}%`} phoneHead={{ name: COPY.margin.phoneHead.trade, value: COPY.margin.phoneHead.value }} />
        ) : null;
        return <Story kind="ranked-bars" key={i.iso2} iso2={i.iso2} why={i.why}>{el ? <div style={{ maxWidth: 624 }}>{el}</div> : null}</Story>;
      })}
      {city.map((c) => {
        const b = buildCityDistrictBars(c.seed);
        const el = b ? <RankedBars id={`districts-${c.slug}`} kicker={COPY.cityDistricts.kicker} icon="best-areas" tagged={b.tagged} basis={b.basis} rows={b.rows} worldMax={b.worldMax} ceiling="set" feature="none" best="min" topLabel={COPY.cityDistricts.dearest} fmt={rentMult} phoneHead={b.phoneHead} /> : null;
        return <Story kind="ranked-bars" key={`${c.slug}:districts`} iso2={`${c.slug}:districts`} why={c.why}>{el ? <div style={{ maxWidth: 693 }}>{el}</div> : null}</Story>;
      })}
    </div>
  );
}

/** The city peers tables (run 22): every loaded city seed that holds one, keyed <slug>:peers, with its column count. */
export function pickCityPeerInstances(cities: CityHeroInstance[]): CityHeroInstance[] {
  return cities.filter((c) => buildCityPeerTable(c.seed)).map((c) => ({ ...c, why: `the city and its peers, ${buildCityPeerTable(c.seed)!.columns.length} of 3 columns held` }));
}
/** THE TRADE'S PEERS, `07 peers` (MODEL.md 8.6; plan step 33's fourth dispatch, 2026-09-18), keyed cell:<handle>:peers off the seeds the sheet loads and drawn by the page's own card (cell/turn-one.tsx PeersCard) at the full width the table takes on the page: California restaurants with the United States' per-state slate (the home row and five peers, one figure column, no flags); London with no peer resolving (the home row alone under the stated line, the seated table); Mumbai cafes off `moneyShown` (no peer, the home row's takings a dash with the card saying so once). */
export const cellPeersKey = (c: CellHeroInstance) => `cell:${c.key}:peers`;
const peersWhy = (p: NonNullable<ReturnType<typeof buildTradePeers>>) =>
  p.peers > 0 ? `trade block 07: the home row and ${p.peers} peer${p.peers === 1 ? "" : "s"} off the per-state slate, one figure column, no flags${p.homeWithheld ? ", the home row's takings a dash with the line said once" : ""}`
    : `trade block 07 seated: no peer resolves off the United States, the home row ${p.homeFigure != null ? "printing its own figure" : "with its takings a dash, the dash said once"} under the stated line`;
export function pickCellPeersInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "peers")).map((c) => ({ c, p: buildTradePeers(c.seed) })).filter((x) => x.p).map(({ c, p }) => ({ iso2: cellPeersKey(c), why: peersWhy(p!) }));
}
export function CompareTableStories({ instances = pickCompareTableInstances(), city = [], cell = [] }: { instances?: Instance[]; city?: CityHeroInstance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="compare-table">
      {cell.filter((c) => cellServes(c.key, "peers")).map((c) => {
        const p = buildTradePeers(c.seed);
        if (!p) return null;
        return <Story kind="compare-table" key={cellPeersKey(c)} iso2={cellPeersKey(c)} why={peersWhy(p)}><PeersCard id={`peers-cell-${c.key}`} peers={p} /></Story>;
      })}
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => {
        const t = buildPeerTable(i.iso2);
        const el = t ? <CompareTable id={`peers-${i.iso2.toLowerCase()}`} kicker={`${COPY.peers.kicker}, ${nameOf(i.iso2)}`} icon="benchmark" rows={t.rows} columns={t.columns} caveat={t.caveat} /> : null;
        return <Story kind="compare-table" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
      {city.map((c) => {
        const t = buildCityPeerTable(c.seed);
        const el = t ? <CompareTable id={`peers-${c.slug}`} kicker={`${COPY.cityPeers.kicker}, ${String(c.seed?.meta?.city ?? c.slug)}`} icon="benchmark" entityHead={t.entityHead} rows={t.rows} columns={t.columns} caveat={t.caveat} /> : null;
        return <Story kind="compare-table" key={`${c.slug}:peers`} iso2={`${c.slug}:peers`} why={c.why}>{el}</Story>;
      })}
    </div>
  );
}

export function CardPagerStories({ instances = pickCardPagerInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="card-pager">
      {instances.map((i) => {
        const parts = i.iso2.split(":");
        if (parts[0] === "city") {
          /* The neighbourhoods pager as city-view.tsx draws it, at the wide side of its 2-1 band (693 at 1280): the kicker, the pager with no image, the coverage foot. */
          const h = buildCityNeighbourhoods(parts[1]);
          const el = h?.cards ? (
            <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 693 }}>
              <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{COPY.cityNeighbourhoods.kicker}, {h.name}</div>
              <CardPager cards={h.cards} allHref={h.allHref} allLabel={COPY.cityNeighbourhoods.allLabel} prevLabel={COPY.cityNeighbourhoods.prev} nextLabel={COPY.cityNeighbourhoods.next} images="none" />
              {h.foot ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{h.foot}</p> : null}
            </div>
          ) : null;
          return <Story kind="card-pager" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const c = buildCityCards(i.iso2);
        const el = c ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 693 }}>
            <CardPager cards={c.cards} allHref={c.allHref} allLabel={COPY.cities.allLabel} prevLabel={COPY.cities.prev} nextLabel={COPY.cities.next} />
          </div>
        ) : null;
        return <Story kind="card-pager" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

export function TiersTableStories({ instances = pickTiersTableInstances(), cell = [] }: { instances?: Instance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="tiers-table">
      {cell.filter((c) => cellServes(c.key, "team")).map((c) => {
        const t = buildTeam(c.seed?.meta?.industry_id, c.seed?.meta?.iso2);
        if (!t) return null;
        return <Story kind="tiers-table" key={cellTeamKey(c)} iso2={cellTeamKey(c)} why={teamWhy(t)}><div style={{ maxWidth: 416 }}><TeamCard id={`team-cell-${c.key}`} team={t} /></div></Story>;
      })}
      {/* The seven-row table off the shard alone, the planted key; drawn whenever its key is in the list (the whole sheet, or the targeted form naming it). */}
      {instances.some((i) => i.iso2 === MOST_ROLES_KEY) ? (() => { const t = mostRolesTeam(); return <Story kind="tiers-table" key={MOST_ROLES_KEY} iso2={MOST_ROLES_KEY} why={instances.find((i) => i.iso2 === MOST_ROLES_KEY)!.why}>{t ? <div style={{ maxWidth: 416 }}><TeamCard id="team-cell-most-roles" team={t} /></div> : null}</Story>; })() : null}
      {/* The cell keys are drawn above off their seeds; the kind's list carries them too (pickAllInstances), so they are skipped here as the answer card skips its own. */}
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => {
        const rows = buildSetupRows(i.iso2);
        const el = rows.length ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 624 }}>
            <TiersTable rows={rows} howTo={howToOpenDoor(i.iso2)} />
          </div>
        ) : null;
        return <Story kind="tiers-table" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** THE CITY'S EARNINGS STRIP STORIES, `07 earnings` (MODEL.md 8.3; plan step
 *  32's fourth dispatch, 2026-09-18), keyed "city:<slug>:earnings" and built
 *  by the slug off `buildCityEarningsStrip` (the one income builder between
 *  the country's deciles), never off a seed: the exemplar (the three marks,
 *  London's typical inside the United Kingdom's deciles, held); the first
 *  city by slug whose typical is modelled (the note says so); a city whose
 *  country holds no deciles (Abidjan: the typical alone, the note saying the
 *  tenths are not researched); and the first city by slug whose typical sits
 *  outside its country's deciles (the typical alone, the note saying the
 *  spread is not drawn). Each is read off the builder, never typed. The old
 *  "own spread" and "country's typical" pair keyed "<slug>:city" went with
 *  the seed's `income` block: no city draws a spread of its own now, and no
 *  city falls back to the country's strip today (252 of 252 hold a typical). */
export type CityStripInstance = { slug: string; why: string };
export const cityStripKey = (c: CityStripInstance) => `city:${c.slug}:earnings`;
export function pickCityStripInstances(): CityStripInstance[] {
  const out: CityStripInstance[] = [];
  const seen = new Set<string>();
  const take = (slug: string | undefined, why: string) => { if (slug && !seen.has(slug)) { seen.add(slug); out.push({ slug, why }); } };
  const slugs = listedCitySlugs();
  const built = slugs.map((slug) => ({ slug, d: buildCityEarningsStrip(slug) })).filter((x) => x.d);
  take("london", "city block 07 on the exemplar: the typical at 30 between the country's bottom and top tenth, all held");
  take(built.find((x) => x.d!.from === "city" && x.d!.sample)?.slug, "city block 07 modelled: the typical alone or in its spread, the note saying modelled");
  take("abidjan", "city block 07 with no deciles: the typical alone, the note saying the country's tenths are not researched");
  take(built.find((x) => x.d!.figures.outside)?.slug, "city block 07 outside the spread: the typical sits under the country's bottom tenth, so the tenths are not drawn and the note says so");
  take(built.find((x) => x.d!.from === "country")?.slug, "city block 07 on the country's figures: no typical of the city's own, the basis naming the country");
  return out;
}
/** THE TRADE'S SPREAD, `01 spread` (MODEL.md 8.6; plan step 33's first dispatch, 2026-09-18), keyed cell:<handle>:spread off the seeds the sheet loads: London (the three fixed multipliers, modelled, 8.6's basis), California (the cell's own bottom and top tenth, measured) and Mumbai cafes (money not shown: the withheld line where the figure would stand). Drawn as cell-view.tsx's `Spread` draws it, at the 520 the card takes in its 1-1 band at 1280. */
export const cellSpreadKey = (c: CellHeroInstance) => `cell:${c.key}:spread`;
export function pickCellSpreadInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "spread") && buildTradeSpread(c.seed)).map((c) => {
    const d = buildTradeSpread(c.seed)!;
    const why = d.marks.length === 0 ? "trade block 01 withheld: money not shown, the line where the figure would stand" : d.modelled ? "trade block 01 on the exemplar: three fixed multipliers of the typical, modelled, the typical at 30" : "trade block 01 measured: the cell's own bottom and top tenth, the typical at 30";
    return { iso2: cellSpreadKey(c), why };
  });
}
/** WHAT ONE SELLS FOR, `14 worth` (MODEL.md 8.6; plan step 33's sixth dispatch, 2026-09-18), keyed cell:<handle>:worth off the seeds the sheet loads and drawn by the page's own card (cell/exit.tsx WorthCard) at the 347 the narrow seat of its 2-1 band takes at 1280: London (two marks, the shard's sale figures times the take-home `00` prints, the basis and its note at the foot, no 30 by the row's law), London dental practices (a shard whose sale figures rest on operating earnings, one of 38: the stated line where the strip would stand, item 52) and Mumbai cafes (money not shown: the withheld line). The strip is the page's second and the bookend to `01`. */
export const cellWorthKey = (c: CellHeroInstance) => `cell:${c.key}:worth`;
function worthWhy(d: NonNullable<ReturnType<typeof buildWorth>>): string {
  return d.state === "strip" ? "trade block 14 on the exemplar: two marks, the low and the high of what one sells for in currency, the basis and its note at the foot, no 30" : d.state === "otherBasis" ? "trade block 14 on a shard whose sale figures rest on operating earnings: the line where the strip would stand, no figure (item 52)" : "trade block 14 withheld: money not shown, no take-home to work from, the line where the strip would stand";
}
export function pickCellWorthInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "worth")).map((c) => ({ c, d: buildWorth(c.seed) })).filter((x) => x.d).map(({ c, d }) => ({ iso2: cellWorthKey(c), why: worthWhy(d!) }));
}
export function RangeStripStories({ instances = pickRangeStripInstances(), city = pickCityStripInstances(), cell = [] }: { instances?: Instance[]; city?: CityStripInstance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="range-strip">
      {cell.filter((c) => cellServes(c.key, "worth")).map((c) => {
        const d = buildWorth(c.seed);
        if (!d) return null;
        return <Story kind="range-strip" key={cellWorthKey(c)} iso2={cellWorthKey(c)} why={worthWhy(d)}><div style={{ maxWidth: 347 }}><WorthCard id={`worth-cell-${c.key}`} worth={d} /></div></Story>;
      })}
      {cell.filter((c) => cellServes(c.key, "spread")).map((c) => {
        const d = buildTradeSpread(c.seed);
        const el = d ? (
          <div style={{ maxWidth: 520 }}>
            <Box id={`spread-cell-${c.key}`}>
              <Rail icon="spread" kicker={COPY.tradeSpread.kicker} sample={d.sample} />
              {d.marks.length > 0 ? (
                <RangeStrip marks={d.marks} scale="linear" fmt={usd} basis={d.basis ?? ""} />
              ) : (
                <p data-withheld-line="spread" className="mt-2 text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">{d.withheld}</p>
              )}
            </Box>
          </div>
        ) : null;
        return <Story kind="range-strip" key={cellSpreadKey(c)} iso2={cellSpreadKey(c)} why={pickCellSpreadInstances([c])[0]?.why ?? c.why}>{el}</Story>;
      })}
      {instances.map((i) => {
        const [iso2, kind] = i.iso2.split(":");
        const d = kind === "premises" ? buildPremisesStrip(iso2) : buildCustomersStrip(iso2);
        const el = d ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: kind === "premises" ? 347 : 536 }}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{kind === "premises" ? COPY.premises.kicker : COPY.customers.kicker}, {nameOf(iso2)}</div>
            <RangeStrip marks={d.marks} scale={kind === "premises" ? "log" : "linear"} fmt={usd} basis={kind === "premises" ? COPY.premises.basis : COPY.customers.basis} note={d.note} extra={d.extra} />
          </div>
        ) : null;
        return <Story kind="range-strip" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
      {/* THE CITY'S STRIP AS THE PAGE DRAWS IT (city-view.tsx `Earnings`): the kit's Box and Rail, the strip, at the 520 the card takes in its 1-1 band at 1280. */}
      {city.map((c) => {
        const d = buildCityEarningsStrip(c.slug);
        const el = d ? (
          <div style={{ maxWidth: 520 }}>
            <Box id={`earnings-${c.slug}`}>
              <Rail icon="spread" kicker={`${COPY.cityCustomers.kicker}, ${d.name}`} sample={d.sample} />
              <RangeStrip marks={d.marks} scale="linear" fmt={usd} basis={d.basis} note={d.note} extra={d.extra} />
            </Box>
          </div>
        ) : null;
        return <Story kind="range-strip" key={cityStripKey(c)} iso2={cityStripKey(c)} why={c.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The instance set for the spectra tables, keyed "XX:state" / "XX:people": the exemplar, the highest and lowest reads (a dot at either end of the track), and a country with no reads on file. */
export function pickSpectraTableInstances(): Instance[] {
  const out: Instance[] = [];
  const seen = new Set<string>();
  const take = (key: string, why: string) => { if (!seen.has(key)) { seen.add(key); out.push({ iso2: key, why }); } };
  const all = codes().map((c) => ({ c, t: buildCharacterTables(c) }));
  const held = all.filter((x) => x.t.state && x.t.people);
  take("GB:state", "the exemplar");
  take("GB:people", "the exemplar");
  const mean = (d: { rows: Array<{ position: number }> } | null) => (d ? d.rows.reduce((a, r) => a + r.position, 0) / d.rows.length : 0);
  const hiState = [...held].sort((a, b) => mean(b.t.state) - mean(a.t.state))[0]; if (hiState) take(`${hiState.c}:state`, "the highest reads, a dot at the track's end");
  const loPeople = [...held].sort((a, b) => mean(a.t.people) - mean(b.t.people))[0]; if (loPeople) take(`${loPeople.c}:people`, "the lowest reads, a dot at the track's start");
  const loState = [...held].sort((a, b) => mean(a.t.state) - mean(b.t.state))[0]; if (loState) take(`${loState.c}:state`, "the lowest state reads");
  const none = all.find((x) => !x.t.state && !x.t.people); if (none) take(`${none.c}:state`, "no reads on file, self-omits");
  /* THE CITY'S PEOPLE TABLE AT FULL FORM (MODEL.md 8.3 `12 character-people`;
     plan step 32's sixth dispatch, 2026-09-18), keyed city:<slug>:people and
     read off `buildCityPeopleTable`: the exemplar (three own reads, three the
     country's, the basis naming which), the one city whose six are all its
     own, the first city by slug holding exactly one own read (the basis in
     the singular), and the first by slug holding none (the country's six
     under the city's name, the basis saying so, no foot). The city's STATE
     stories left with the state table: 8.3 names one character table on the
     city page, and the state reads are the country's `14`. */
  const cities = listedCitySlugsForCharacter().map((slug) => ({ slug, t: buildCityPeopleTable(slug) })).filter((x) => x.t);
  take("city:london:people", "the exemplar city: three reads its own, three the country's, the basis naming which");
  const allOwn = cities.find((x) => x.t!.own === x.t!.rows.length); if (allOwn) take(`city:${allOwn.slug}:people`, "every read the city's own");
  const oneOwn = cities.find((x) => x.t!.own === 1); if (oneOwn) take(`city:${oneOwn.slug}:people`, "one read the city's own, the basis in the singular");
  const noneOwn = cities.find((x) => x.t!.own === 0); if (noneOwn) take(`city:${noneOwn.slug}:people`, "no read of its own: the country's six under the city's name, the basis saying so, no foot");
  return out;
}

/* The quick reads' stories (run 16, keyed <slug>:reads) left with the lens grid
   on plan step 32 (2026-09-18): MODEL.md 8.3 has no such block, a percentile
   has no poles (R8), and the city's `01 glance` is a KvGrid story above. */
export function SpectraTableStories({ instances = pickSpectraTableInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="spectra-table">
      {instances.map((i) => {
        const parts = i.iso2.split(":");
        const isCity = parts[0] === "city";
        if (isCity) {
          /* The city's people table as city-view.tsx draws it: the rows, the basis under them, the foot. */
          const c = buildCityPeopleTable(parts[1]);
          const el = c ? (
            <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 520 }}>
              <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{COPY.character.people.kicker}, {c.name}</div>
              <SpectraTable rows={c.rows} dot={c.dot} foot={c.foot} basis={c.basis} />
            </div>
          ) : null;
          return <Story kind="spectra-table" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const [iso2, side] = parts;
        const t = buildCharacterTables(iso2);
        const d = side === "people" ? t.people : t.state;
        const el = d ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 520 }}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{side === "people" ? COPY.character.people.kicker : COPY.character.state.kicker}, {nameOf(iso2)}</div>
            <SpectraTable rows={d.rows} dot={d.dot} foot={d.foot} />
          </div>
        ) : null;
        return <Story kind="spectra-table" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The instance set for the note list: every country holding authored notes, then one without, which self-omits. */
export function pickNoteListInstances(): Instance[] {
  const out: Instance[] = [];
  const seen = new Set<string>();
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  for (const c of countriesWithNotes()) { take(c, c === "GB" ? "the exemplar, the narrow card" : "authored notes"); take(`${c}:wide`, "the wide card, two columns from lg"); }
  const none = codes().find((c) => !buildLocalsNotes(c)); if (none) take(none, "no notes on file, self-omits");
  /* THE QUESTION LIST, `18 checks` (MODEL.md 8.2; plan step 31, fifth
     dispatch, 2026-09-18), on the same law without the editorial exemption,
     keyed "XX:checks": the exemplar (regime held, one day, three rows); the
     worst case under the 220 ceiling (regime held and the wait over 21 days,
     176 characters, the composition's own arithmetic); and the omission (no
     regime, no LLC row on file, two rows and the "Two questions" basis), so
     every string of the bank is on the sheet. */
  take("GB:checks", "the question list, three rows, the exemplar");
  const worst = codes().find((c) => { const d = buildChecks(c); return d.regimeHeld && d.days != null && d.days > 21; }); if (worst) take(`${worst}:checks`, "the question list at its longest: the regime held, the wait over 21 days");
  const omit = codes().find((c) => { const d = buildChecks(c); return !d.regimeHeld && d.days == null; }); if (omit) take(`${omit}:checks`, "the question list with no regime and no registration time: two rows, the third omitted");
  /* WHO THIS SUITS, the trade's `02 suits` (MODEL.md 8.6; plan step 33's
     first dispatch, 2026-09-18), keyed cell:<handle>:suits and built off
     suits_rows.ts by the trade's taxonomy id and the cell's country, pure
     over the files, no seed: the exemplar (restaurants in the United
     Kingdom: the hand-written edge and watch-out, the regime held so the
     margin check asks about the margin left), and the planted case no live
     trade is in (an id no shard or lookup holds: the one not-gathered row
     over the two checks), so the branch is looked at rather than asserted. */
  take("cell:london:suits", "trade block 02 on the exemplar: who does well, think twice, the two checks, four notes, the one prose section");
  take("cell:none:suits", "trade block 02 with no character on file (planted, no live trade): the not-gathered row and the two checks");
  return out;
}

/** The suits card's inputs by its story key: the exemplar's trade and country, or the planted id no lookup holds. */
export function suitsInputsFor(key: string): { industryId: string; iso2: string } | null {
  const [, handle] = key.split(":");
  if (handle === "london") return { industryId: "restaurants", iso2: "GB" };
  if (handle === "none") return { industryId: "no_such_trade", iso2: "GB" }; // allow-industry-ref: the planted id no lookup holds, the not-gathered story's whole point (the industry-refs gate reads a literal industryId as a trade reference)
  return null;
}

export function NoteListStories({ instances = pickNoteListInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="note-list">
      {instances.map((i) => {
        const [iso2, form] = i.iso2.split(":");
        const wide = form === "wide";
        if (iso2 === "cell") {
          /* The suits card as cell-view.tsx draws it: the opener, the rows on NoteList's law with the exemption on, the basis, at the 520 the card takes in its 1-1 band at 1280. */
          const inputs = suitsInputsFor(i.iso2);
          const d = inputs ? buildSuits(inputs.industryId, inputs.iso2) : null;
          const el = d ? (
            <div style={{ maxWidth: 520 }}>
              <Box id={`suits-cell-${i.iso2.split(":")[1]}`}>
                <Rail icon="who-for" kicker={COPY.tradeSuits.kicker} sample />
                <NoteList notes={d.rows} />
                <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{d.basis}</p>
              </Box>
            </div>
          ) : null;
          return <Story kind="note-list" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        if (form === "checks") {
          /* The checks card at the 1-1 card's width (520 at 1280): the opener's
             kicker, the rows on NoteList's law with no exemption, the basis. */
          const c = buildChecks(iso2);
          const el = (
            <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 520 }}>
              <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{COPY.checks.kicker}, {nameOf(iso2)}</div>
              <NoteList notes={c.rows} editorial={false} />
              <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{c.basis}</p>
            </div>
          );
          return <Story kind="note-list" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const d = buildLocalsNotes(iso2);
        const el = d ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: wide ? 693 : 305 }}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{COPY.locals.kicker}, {nameOf(iso2)}</div>
            <NoteList notes={d.notes} columns={wide ? 2 : 1} />
          </div>
        ) : null;
        return <Story kind="note-list" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The instance set for the terminus: the exemplar, the country with the most covered cities, one with a single city, one with none, and the longest city name. */
export function pickTerminusInstances(): Instance[] {
  const out: Instance[] = [];
  const seen = new Set<string>();
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  const all = codes().map((c) => ({ c, n: coveredCities(c).length, longest: Math.max(0, ...coveredCities(c).map((x) => x.name.length)) }));
  take("GB", "the exemplar");
  const most = [...all].sort((a, b) => b.n - a.n)[0]; if (most) take(most.c, `the most covered cities, ${most.n}`);
  const one = all.find((x) => x.n === 1); if (one) take(one.c, "one covered city, the door without a count");
  const none = all.find((x) => x.n === 0); if (none) take(none.c, "no covered city, two doors");
  const long = [...all].filter((x) => x.n > 0).sort((a, b) => b.longest - a.longest)[0]; if (long) take(long.c, "the longest city name");
  /* THE COMPARE DOOR, `19 compare` (MODEL.md 8.2; plan step 31, fifth
     dispatch, 2026-09-18), keyed "XX:compare": one pill on Terminus with no
     kicker of its own, at the 1-1 card's width (520 at 1280), the name
     through inSentence(), so the exemplar takes "the". MEASURED, every one of
     the 195 door strings in the pill's rendered font (Geist 600 14px) against
     the pill's room, the card's inner width less the pill's own padding: the
     exemplar is 350px; at 1280 (440px of room) one name wraps, Saint Vincent
     and the Grenadines at 441; at 1024 (392) two, with the Central African
     Republic; at 768's equal halves (264) 148 of 195, which is why the band
     declares stack="lg", and stacked at 768 (640) none; at 375 (263) 151 take
     two lines and none three, within the phone's cap. The longest name is not
     a story because it reds the sheet by one pixel at 1280 on purpose, and a
     permanently red story blocks the chain; the clash between the
     composition's string and the 1-1 width on those two names is recorded
     for the controller, not hidden by a shorter string typed here. */
  take("GB:compare", "the compare door, one pill, the name with its article");
  return out;
}

/** The city termini (run 19; MODEL.md 8.3 `16 close`, checked on plan step 32's
 *  sixth dispatch, 2026-09-18): the exemplar and one more city from the loaded
 *  seeds, the same three doors on both (every district, the country up one
 *  altitude, the compare pill), the names differing. The door that named the
 *  lightest-rent district on London is gone (close_rows.ts says why). */
export function pickCityCloseInstances(cities: CityHeroInstance[]): CityHeroInstance[] {
  const out: CityHeroInstance[] = [];
  const first = cities.find((c) => c.slug === "london" && buildCityCloseDoors(c.seed).length > 0) ?? cities.find((c) => buildCityCloseDoors(c.seed).length > 0);
  if (first) out.push({ ...first, why: "the exemplar: every district, the country up one altitude, the compare pill" });
  const plain = cities.find((c) => c !== first && buildCityCloseDoors(c.seed).length > 0);
  if (plain) out.push({ ...plain, why: "a second city, the same three doors on its own names" });
  return out;
}
/** THE TRADE'S DOORS, `15 close` (MODEL.md 8.6; plan step 33's sixth dispatch, 2026-09-18), keyed cell:<handle>:close off the seeds the sheet loads and drawn by the page's own card (cell/exit.tsx CloseCard) at the full width the terminus takes: the exemplar's three doors, the industry page, the city page up one altitude and the compare pill last (M21); no pricing door, no sibling door. */
export const cellCloseKey = (c: CellHeroInstance) => `cell:${c.key}:close`;
export function pickCellCloseInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "close") && buildTradeCloseDoors(c.seed).length > 0).map((c) => ({ iso2: cellCloseKey(c), why: "trade block 15 on the exemplar: the industry page, the city page up one altitude, the compare pill last; no pricing door, no sibling door" }));
}
export function TerminusStories({ instances = pickTerminusInstances(), city = [], cell = [] }: { instances?: Instance[]; city?: CityHeroInstance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="terminus">
      {cell.filter((c) => cellServes(c.key, "close")).map((c) => {
        const doors = buildTradeCloseDoors(c.seed);
        if (doors.length === 0) return null;
        return <Story kind="terminus" key={cellCloseKey(c)} iso2={cellCloseKey(c)} why={pickCellCloseInstances([c])[0]?.why ?? c.why}><div style={{ maxWidth: 1072 }}><CloseCard id={`close-cell-${c.key}`} doors={doors} /></div></Story>;
      })}
      {instances.map((i) => {
        const [iso2, form] = i.iso2.split(":");
        if (form === "compare") {
          const doors = buildCompareDoor(nameOf(iso2));
          const el = doors.length ? (
            <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 520 }}>
              <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{COPY.compare.kicker}, {nameOf(iso2)}</div>
              <Terminus doors={doors} />
            </div>
          ) : null;
          return <Story kind="terminus" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const doors = buildCloseDoors(iso2);
        const el = doors.length ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 1072 }}>
            <Terminus kicker={`${COPY.close.kicker}, ${nameOf(iso2)}`} doors={doors} />
          </div>
        ) : null;
        return <Story kind="terminus" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
      {city.map((c) => {
        const doors = buildCityCloseDoors(c.seed);
        const el = doors.length ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 1072 }}>
            <Terminus kicker={`${COPY.close.kicker}, ${String(c.seed?.meta?.city ?? c.slug)}`} doors={doors} />
          </div>
        ) : null;
        return <Story kind="terminus" key={`${c.slug}:close`} iso2={`${c.slug}:close`} why={c.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The instance set for the pay bars: the exemplar, the country at the world's edge, the lowest average, and every withheld pair. */
export function pickPayBarsInstances(): Instance[] {
  const out: Instance[] = [];
  const seen = new Set<string>();
  const take = (iso2: string, why: string) => { if (!seen.has(iso2)) { seen.add(iso2); out.push({ iso2, why }); } };
  const all = codes().map((c) => ({ c, d: buildPayBars(c) })).filter((x) => x.d);
  take("GB", "the exemplar");
  const edge = all.find((x) => x.d!.worldMax && x.c === x.d!.worldMax.iso2); if (edge) take(edge.c, "the world's highest average, the bar touches the edge");
  const avg = (x: any) => x.d.rows.find((r: any) => r.key === "average")?.value ?? Infinity;
  const lowest = [...all].filter((x) => !x.d!.withheld).sort((a, b) => avg(a) - avg(b))[0]; if (lowest) take(lowest.c, "the lowest average, a sliver against the edge");
  for (const x of all.filter((x) => x.d!.withheld)) take(x.c, "a pair under ten percent apart, withheld");
  const one = all.find((x) => x.d!.rows.length === 1); if (one) take(one.c, "one figure, the figure form");
  return out;
}

export function PayBarsStories({ instances = pickPayBarsInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="pay-bars">
      {instances.map((i) => {
        const d = buildPayBars(i.iso2);
        /* DRAWN AT 520, the half of the 1-1 band the card shares with the
           workforce seat (MODEL.md 8.2, `07 workforce | 08 hiring`; plan step
           31's sixth dispatch, 2026-09-18), the same width the KvGrid seats
           are drawn at. It stood at 347, the lean third the card kept while it
           stood alone; the placement lines and PART 5's row geometry are what
           fill the wider card, so the story is drawn where they are judged. */
        const el = d ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 520 }}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{COPY.pay.kicker}, {nameOf(i.iso2)}</div>
            <PayBars rows={d.rows} worldMax={d.worldMax} withheld={d.withheld} fmt={usd} />
          </div>
        ) : null;
        return <Story kind="pay-bars" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The instance set for the key-value grid on its own: the exemplar's cells in a wide card ("GB:wide") and a narrow one ("GB"), plus the country with the fewest cells, so the grid's columns are measured by its own width.
 *  THE TWO COUNTRY SEATS KvGrid HOLDS SINCE PLAN STEP 31's SECOND DISPATCH
 *  (2026-09-17), `01 glance` and `02 world-seat`, keyed "XX:glance" and
 *  "XX:world-seat": the exemplar, and for each the thinnest country read off
 *  the builders (the glance whose GDP falls to the profile and holds the
 *  fewest cells, so the modelled foot and the withheld line both draw; the
 *  seat whose payroll is not held, so it draws one cell and two withheld
 *  sentences). Drawn at 520, the half of the 1-1 band they share. */
export function pickKvGridInstances(): Instance[] {
  const out: Instance[] = [];
  const seen = new Set<string>();
  const take = (key: string, why: string) => { if (!seen.has(key)) { seen.add(key); out.push({ iso2: key, why }); } };
  take("GB:wide", "the exemplar's cells in a wide card, the groups side by side");
  take("GB", "the same cells in a narrow card, the groups stacked");
  const facts = codes().map((c) => ({ c, f: buildHeroFacts(c) })).filter((x) => x.f.cells.length > 0);
  const fewest = [...facts].sort((a, b) => a.f.cells.length - b.f.cells.length)[0]; if (fewest) take(`${fewest.c}:wide`, `the fewest cells, ${fewest.f.cells.length}, in a wide card`);
  take("GB:glance", "block 01 on the exemplar: five cells, the published year in the foot");
  const glances = codes().map((c) => ({ c, g: buildGlance(c) })).filter((x) => x.g);
  const thinGlance = [...glances].filter((x) => x.g!.gdpYear == null).sort((a, b) => a.g!.cells.length - b.g!.cells.length || a.c.localeCompare(b.c))[0];
  if (thinGlance) take(`${thinGlance.c}:glance`, `block 01 thin: ${thinGlance.g!.cells.length} cells, the GDP from the profile, the modelled foot and the withheld line`);
  take("GB:world-seat", "block 02 on the exemplar: rent and payroll, the lending rate withheld");
  const seats = codes().map((c) => ({ c, s: buildWorldSeat(c) })).filter((x) => x.s);
  const thinSeat = [...seats].filter((x) => x.s!.figures.payroll == null).sort((a, b) => a.c.localeCompare(b.c))[0];
  if (thinSeat) take(`${thinSeat.c}:world-seat`, "block 02 thin: the rent alone, payroll and the lending rate withheld");
  /* THE THIRD SEAT, `06 running-costs` (plan step 31's fourth dispatch,
     2026-09-18), keyed "XX:running-costs": the exemplar, both cells with the
     two-place rate; and the first country by code whose electricity rate is
     withheld for the fill while its cost of living prints, so the withheld
     line is drawn beside a real cell. Both read off the builder. */
  take("GB:running-costs", "block 06 on the exemplar: the rate at two places and the cost of living, the cities in the foot");
  const costs = codes().map((c) => ({ c, r: buildRunningCosts(c) })).filter((x) => x.r);
  const fillCase = [...costs].filter((x) => x.r!.figures.electricity == null && x.r!.figures.living != null).sort((a, b) => a.c.localeCompare(b.c))[0];
  if (fillCase) take(`${fillCase.c}:running-costs`, "block 06 on the fill: the electricity rate withheld with its line, the cost of living alone");
  /* THE CITY'S TWO SEATS (MODEL.md 8.3 `01 glance` and `02 among-cities`;
     plan step 32's first dispatch, 2026-09-18), keyed "city:<slug>:glance"
     and "city:<slug>:among", the country's form one altitude down (R8): the
     exemplar's glance (three cells, the human development line withheld,
     one modelled cell in the foot), a thin city's glance (Abidjan: two
     cells, the visitor count not on file, nothing modelled, so no foot),
     and the exemplar's placement seat (two cells, both modelled, the
     placement not drawn). All read off the builders, which read the city
     list and the city shard and nothing else. */
  take("city:london:glance", "city block 01 on the exemplar: three cells, the human development index withheld, the business count modelled in the foot");
  take("city:abidjan:glance", "city block 01 thin: two cells, the visitor count not on file, every cell held so no foot");
  take("city:london:among", "city block 02 on the exemplar: the metro GDP and the living index, both modelled, the placement not drawn");
  /* THE CITY'S LIVING AND RUNWAY SEATS (MODEL.md 8.3 `05 living` and `06
     runway`; plan step 32's third dispatch, 2026-09-18), keyed
     "city:<slug>:living" and "city:<slug>:runway", the seats of candidates 1
     and 3 held by KvGrid: the exemplar's living card (four cells, every
     figure held since 2026-09-17, no foot), Abidjan's (four held cells, the
     cheapest coffee among the three named cities), the first city by slug
     whose living figures are modelled (the foot naming all four, read off
     the builder, never typed), the exemplar's share beside its income, and
     the city whose share is withheld at the largest ratio (the income alone
     under the withheld line, picked off the builder). */
  take("city:london:living", "city block 05 on the exemplar: four cells, every figure held, no foot");
  take("city:abidjan:living", "city block 05 on a thin city: four cells held, the coffee at its cents");
  const citySlugs = listedCitySlugs();
  const modelledLiving = citySlugs.find((s) => buildCityLiving(s)?.confidence === "modeled");
  if (modelledLiving) take(`city:${modelledLiving}:living`, "city block 05 modelled: every cell modelled, the foot naming all four");
  take("city:london:runway", "city block 06 on the exemplar: the share and the typical income, both held");
  const overs = citySlugs.map((s) => ({ s, r: buildCityRunway(s) })).filter((x) => x.r?.figures.overPct != null).sort((a, b) => b.r!.figures.overPct! - a.r!.figures.overPct! || a.s.localeCompare(b.s));
  if (overs[0]) take(`city:${overs[0].s}:runway`, `city block 06 withheld: the share over 100 (${overs[0].r!.figures.overPct} percent) withheld with its line, the typical income alone`);
  /* THE SEASON PAIR (MODEL.md 8.3 `15 season`; plan step 32's sixth dispatch,
     2026-09-18), keyed "city:<slug>:season", at the narrow side of its 2-1
     band (347 at 1280): the exemplar (the slope over arrivals, London's shard
     holding no footfall row, the foot saying so), the first city by slug
     whose two shares are held in the shard (no foot), the first whose shares
     are modelled in the shard (the foot saying so), and the first withheld,
     if any: none today, and a story is never typed, so the withheld lines
     are proven by the copy gates alone until a city reaches them. */
  take("city:london:season", "city block 15 on the exemplar: the two shares from the slope over arrivals, modelled, the foot saying so");
  const seasons = citySlugs.map((s) => ({ s, d: buildCitySeason(s) })).filter((x) => x.d);
  const heldSeason = seasons.find((x) => x.d!.from === "shard" && x.d!.confidence === "measured"); if (heldSeason) take(`city:${heldSeason.s}:season`, "city block 15 held: both shares from the shard, no foot");
  const modelledSeason = seasons.find((x) => x.d!.from === "shard" && x.d!.confidence === "modeled"); if (modelledSeason) take(`city:${modelledSeason.s}:season`, "city block 15 modelled: both shares from the shard, the foot saying modelled");
  const withheldSeason = seasons.find((x) => x.d!.withheld); if (withheldSeason) take(`city:${withheldSeason.s}:season`, "city block 15 withheld: the line where the shares would stand");
  return out;
}

/** The country seats as the page draws them (country-view.tsx `Glance`, `WorldSeat` and `RunningCosts` with a cell to draw): opener, grid, the withheld line, the basis, the foot. The same markup, so the story measures the card a reader meets. */
function KvSeatStory({ id, icon, kicker, sample, cells, withheld, basis, foot }: { id: string; icon: "scorecard" | "vs-world" | "cost-breakdown" | "commercial-rent"; kicker: string; sample: boolean; cells: React.ComponentProps<typeof KvGrid>["cells"]; withheld: string | null; basis: string | null; foot: string | null }) {
  return (
    <div style={{ maxWidth: 520 }}>
      <Box id={id}>
        <Rail icon={icon} kicker={kicker} sample={sample} />
        <KvGrid cells={cells} />
        {withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{withheld}</p> : null}
        {basis ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{basis}</p> : null}
        {foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot}</p> : null}
      </Box>
    </div>
  );
}

/** THE TRADE'S SURVIVAL, `09 lasts` (MODEL.md 8.6; plan step 33's fourth dispatch, 2026-09-18), keyed cell:<handle>:lasts off the seeds the sheet loads and drawn by the page's own card (cell/turn-two.tsx LastsCard) at the 520 the card takes in its 1-1 band at 1280: the exemplar's shard (restaurants, 80 / 60 / 50, held) and London shoe repair's (a modelled triple), year five first at the head rung (the focal cell is candidate 1 awaiting his click). */
export const cellLastsKey = (c: CellHeroInstance) => `cell:${c.key}:lasts`;
const lastsWhy = (l: NonNullable<ReturnType<typeof buildLasts>>) => `trade block 09: still trading after five, one and three years (${l.values.yr5} / ${l.values.yr1} / ${l.values.yr3}) off the shard, year five first at the head rung (the focal cell is a candidate awaiting his click), no slope, no myth sentence`;
export function pickCellLastsInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "lasts")).map((c) => ({ c, l: buildLasts(c.seed?.meta?.industry_id) })).filter((x) => x.l).map(({ c, l }) => ({ iso2: cellLastsKey(c), why: lastsWhy(l!) }));
}
/** WHERE SALES COME FROM, `11 mix` (MODEL.md 8.6; plan step 33's fifth dispatch, 2026-09-18), keyed cell:<handle>:mix off the seeds the sheet loads and drawn by the page's own card (cell/turn-two.tsx MixCard) at the 520 the card takes in its 1-1 band at 1280: the exemplar's three parts (restaurants, dine-in leading at 60), London nail salons' five (the most a shard holds, three rows on COMPLETE ROWS) and London barbershops' two (the one two-part shard, one row), the leader first at the head rung; the donut is candidate 5 awaiting his click and its mockup is owed to the review sheet. */
export const cellMixKey = (c: CellHeroInstance) => `cell:${c.key}:mix`;
const mixWhy = (m: NonNullable<ReturnType<typeof buildMix>>) => `trade block 11: ${m.parts.length} named parts of the trade's sales with their shares${m.leader ? ` (${m.leader.name} leading at ${Math.round(m.leader.share)})` : ", withheld"}, the leader first at the head rung (the donut is candidate 5 awaiting his click), summing to ${Math.round(m.sum)}`;
export function pickCellMixInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "mix")).map((c) => ({ c, m: buildMix(c.seed?.meta?.industry_id) })).filter((x) => x.m).map(({ c, m }) => ({ iso2: cellMixKey(c), why: mixWhy(m!) }));
}
export function KvGridStories({ instances = pickKvGridInstances(), cell = [] }: { instances?: Instance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="kv-grid">
      {cell.filter((c) => cellServes(c.key, "permits")).map((c) => {
        const p = buildPermits(c.seed?.meta?.industry_id);
        if (!p) return null;
        return <Story kind="kv-grid" key={cellPermitsKey(c)} iso2={cellPermitsKey(c)} why={permitsWhy(p)}><div style={{ maxWidth: 347 }}><PermitsCard id={`permits-cell-${c.key}`} permits={p} /></div></Story>;
      })}
      {cell.filter((c) => cellServes(c.key, "lasts")).map((c) => {
        const l = buildLasts(c.seed?.meta?.industry_id);
        if (!l) return null;
        return <Story kind="kv-grid" key={cellLastsKey(c)} iso2={cellLastsKey(c)} why={lastsWhy(l)}><div style={{ maxWidth: 520 }}><LastsCard id={`lasts-cell-${c.key}`} lasts={l} /></div></Story>;
      })}
      {cell.filter((c) => cellServes(c.key, "mix")).map((c) => {
        const m = buildMix(c.seed?.meta?.industry_id);
        if (!m) return null;
        return <Story kind="kv-grid" key={cellMixKey(c)} iso2={cellMixKey(c)} why={mixWhy(m)}><div style={{ maxWidth: 520 }}><MixCard id={`mix-cell-${c.key}`} mix={m} /></div></Story>;
      })}
      {/* The cell keys are drawn above off their seeds; the kind's list carries them too (pickAllInstances), so they are skipped here as the answer card skips its own. */}
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => {
        const parts = i.iso2.split(":");
        if (parts[0] === "city") {
          /* The city's seats, drawn as city-view.tsx draws them (Glance, AmongCities): the country's KvSeatStory markup, the kicker naming the city. */
          const [, slug, cityForm] = parts;
          if (cityForm === "glance") {
            const g = buildCityGlance(slug);
            const el = g ? <KvSeatStory id={`city-glance-${slug}`} icon="scorecard" kicker={`${COPY.glance.kicker}, ${g.name}`} sample={g.confidence !== "measured"} cells={g.cells} withheld={g.withheld} basis={g.basis} foot={g.foot} /> : null;
            return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
          }
          /* The living and runway seats, drawn as city-view.tsx draws them (Living, Runway): the same markup, the kicker naming the city. */
          if (cityForm === "living") {
            const l = buildCityLiving(slug);
            const el = l ? <KvSeatStory id={`city-living-${slug}`} icon="cost-breakdown" kicker={`${COPY.cityLiving.kicker}, ${l.name}`} sample={l.confidence !== "measured"} cells={l.cells} withheld={l.withheld} basis={l.basis} foot={l.foot} /> : null;
            return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
          }
          if (cityForm === "runway") {
            const r = buildCityRunway(slug);
            const el = r ? <KvSeatStory id={`city-runway-${slug}`} icon="commercial-rent" kicker={`${COPY.cityRunway.kicker}, ${r.name}`} sample={r.confidence !== "measured"} cells={r.cells} withheld={r.withheld} basis={r.basis} foot={r.foot} /> : null;
            return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
          }
          if (cityForm === "season") {
            /* The season pair as city-view.tsx draws it (Season): the same markup, at the narrow third of its band. */
            const d = buildCitySeason(slug);
            const el = d ? (
              <div style={{ maxWidth: 347 }}>
                <Box id={`city-season-${slug}`}>
                  <Rail icon="seasonality" kicker={`${COPY.citySeason.kicker}, ${d.name}`} sample={d.confidence !== "measured"} />
                  <KvGrid cells={d.cells} />
                  {d.withheld ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{d.withheld}</p> : null}
                  {d.basis ? <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{d.basis}</p> : null}
                  {d.foot ? <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{d.foot}</p> : null}
                </Box>
              </div>
            ) : null;
            return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
          }
          const s = buildCitySeat(slug);
          const el = s ? <KvSeatStory id={`city-among-${slug}`} icon="vs-world" kicker={`${COPY.citySeat.kicker}, ${s.name}`} sample={s.confidence !== "measured"} cells={s.cells} withheld={null} basis={s.basis} foot={s.foot} /> : null;
          return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const [iso2, form] = parts;
        if (form === "glance") {
          const g = buildGlance(iso2);
          const el = g ? <KvSeatStory id={`glance-${iso2.toLowerCase()}`} icon="scorecard" kicker={`${COPY.glance.kicker}, ${nameOf(iso2)}`} sample={g.confidence !== "measured"} cells={g.cells} withheld={g.withheld} basis={g.basis} foot={g.foot} /> : null;
          return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        if (form === "world-seat") {
          const s = buildWorldSeat(iso2);
          const el = s ? <KvSeatStory id={`world-seat-${iso2.toLowerCase()}`} icon="vs-world" kicker={`${COPY.worldSeat.kicker}, ${nameOf(iso2)}`} sample={s.confidence !== "measured"} cells={s.cells} withheld={s.withheld} basis={s.basis} foot={s.foot} /> : null;
          return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        if (form === "running-costs") {
          const r = buildRunningCosts(iso2);
          const el = r && r.cells.length > 0 ? <KvSeatStory id={`running-costs-${iso2.toLowerCase()}`} icon="cost-breakdown" kicker={`${COPY.runningCosts.kicker}, ${nameOf(iso2)}`} sample={r.confidence !== "measured"} cells={r.cells} withheld={r.withheld.length ? r.withheld.join(" ") : null} basis={r.basis} foot={r.foot} /> : null;
          return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const f = buildHeroFacts(iso2);
        const el = f.cells.length ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: form === "wide" ? 1072 : 520 }}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{COPY.howto.cells}, {nameOf(iso2)}</div>
            <KvGrid cells={f.cells} />
          </div>
        ) : null;
        return <Story kind="kv-grid" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** THE FOUNDER'S PLUS (2026-09-08), restored as an archetype: `DetailPanel`
 * takes rows, never children, so a drawing cannot be smuggled behind it (the
 * type is the only enforcement on this path, review finding 8: the kit's
 * assertNoGraphics walks direct children only and never sees past the `dl`
 * wrapper this component hands it, so it does not reach here). Its stories
 * are read off the same files every other archetype reads, never typed:
 *  - GB:setup, the exemplar, and the panel's WITHHELD case. GB's own LLC row
 *    of `data/legal/business_formation_costs_v1.json` holds a real fee and a
 *    real wait, so two rows draw. Founder ruling 8 of 2026-09-04 also named
 *    "time until opening", and nothing on file measures it. For two days that
 *    row was drawn anyway, carrying the words "not measured yet" where its
 *    figure goes; that is a label standing where a number goes (PART 5), it
 *    is what `find_useless_tiles.ts` reds as a tile whose value is internal
 *    vocabulary rather than a figure, and it is the shape he struck out on
 *    2026-09-10: "the label replaces the number, which is totally an idiotic
 *    thing out there." The row is WITHHELD now and the panel says which row
 *    is missing and why, the way the country money card withholds its four
 *    trades.
 *  - DE:pay, the two-row minimum. `buildPayBars` never returns fewer than two
 *    rows once it returns any (every held country carries both salary
 *    figures), so this is the floor the panel draws at, not a chosen gap.
 *  - AF:customers, the self-omit. `buildCustomersStrip` holds one mark for
 *    Afghanistan (its deciles are not researched), so the panel gets one row
 *    and draws nothing, exactly the law's floor.
 *  - GB:customers, THREE ROWS, and it is here because withholding the setup
 *    row took the last panel above two away: setup now draws two, pay never
 *    returns more than two, and AF draws none, so without this instance no
 *    story would exercise a panel deeper than its own floor and the harness's
 *    ROWS CUT check would have nothing to count. `buildCustomersStrip` holds
 *    three marks for 47 countries and one for the other 148; GB is one of the
 *    47, and it is the same exemplar every other archetype here is read on.
 *  - GB:nested, the proof (review finding 2): the panel exactly as it is
 *    designed to be used, nested at the FOOT of a real AnswerCard rather than
 *    standing alone, so the harness's own "card" for this story is
 *    `data-archetype="answer-card"`, not "detail-panel". Built from GB's own
 *    real answer-card facts (the exemplar `AnswerCardStories` already draws
 *    cleanly) plus GB's own real setup rows, through the new optional
 *    `detail` slot on `AnswerCard`; no production page passes that slot yet.
 */
export function pickDetailPanelInstances(): Instance[] {
  return [
    { iso2: "GB:setup", why: "the exemplar, and the row it withholds" },
    { iso2: "DE:pay", why: "the two-row minimum" },
    { iso2: "AF:customers", why: "self-omits: one row" },
    { iso2: "GB:customers", why: "three rows, the deepest panel the data holds" },
    { iso2: "GB:nested", why: "nested at the foot of an answer card, the way a page will actually use it" },
  ];
}

function detailPanelRows(key: string): { summary: string; rows: DetailRow[]; withheldLine?: string } | null {
  const [iso2, kind] = key.split(":");
  if (kind === "setup") {
    const rows = buildSetupRows(iso2);
    const row = rows.find((r) => r.tier === "LLC") ?? rows[0];
    if (!row) return null;
    const out: DetailRow[] = [];
    if (row.cost_usd != null) out.push({ label: "Registration fee", value: usd(row.cost_usd) });
    if (row.days != null) out.push({ label: "Time until registered", value: `${row.days} day${row.days === 1 ? "" : "s"}` });
    /* THE THIRD ROW IS WITHHELD, NOT WRITTEN (2026-09-10). "Time until the
       doors open" is wanted (founder ruling 8, 2026-09-04) and unmeasured, so
       it does not appear as a row reading "not measured yet": every row
       carries its own figure, and a cell that cannot hold an honest one is
       withheld with a line saying which row is missing and why. Both rows
       above already push only when their data resolves, which is the same
       rule; this row was the one exception and it is gone. */
    return { summary: COPY.detail.setup, rows: out, withheldLine: COPY.detail.setupWithheld };
  }
  if (kind === "pay") {
    const d = buildPayBars(iso2);
    /* THE WITHHELD GUARD (review finding 5): `d.withheld` is the same ruling
       the sibling PayBars story already honours, an average under 110 percent
       of the minimum is not a credible pair and is not drawn. Without this,
       picking a withheld country here would print the exact pair the site
       refuses to draw as a bar, in plain text, behind the plus. */
    if (!d || d.withheld) return null;
    const out: DetailRow[] = d.rows.map((r) => ({
      label: r.label,
      value: usd(r.value),
      note: r.key === "average" && d.worldMax ? `world's highest average: ${d.worldMax.name}, ${usd(d.worldMax.value)}` : undefined,
    }));
    return { summary: COPY.detail.pay, rows: out };
  }
  if (kind === "customers") {
    const d = buildCustomersStrip(iso2);
    if (!d) return null;
    /* ONE NOTE PER PANEL (review finding 7): `d.note` describes the strip as a
       whole (the deciles not researched), not each individual mark, so it is
       attached to the first row only, the way a caption sits under a figure
       once and not under each of its numbers. */
    const out: DetailRow[] = d.marks.map((m, idx) => ({ label: m.label, value: usd(m.value), note: idx === 0 ? d.note ?? undefined : undefined }));
    return { summary: COPY.detail.customers, rows: out };
  }
  return null;
}

export function DetailPanelStories({ instances = pickDetailPanelInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="detail-panel">
      {instances.map((i) => {
        const [iso2, kind] = i.iso2.split(":");
        if (kind === "nested") {
          const facts = buildHeroFacts(iso2);
          const d = detailPanelRows(`${iso2}:setup`);
          const el = facts && d && d.rows.length >= 2 ? (
            /* THE PROOF IS THE NESTING, NOT THE MASTHEAD'S OWN COMPOSITION:
               this story exists to show the harness's detail-panel rules keep
               firing once the outer card is an answer-card, not to also
               exercise the KvGrid's side-by-side law at a width nothing else
               tests it at. So the companion cells stay off (a bare
               "answer stands alone" card, AnswerCard's own documented shape
               for zero cells) and the card sits at the same width a
               SECTION-level card actually gets paired in a page (Band's
               1-1/2-1 split), not the hero's full-width exception (D1). */
            <div style={{ maxWidth: 480 }}>
              <AnswerCard
                id={`detail-nested-${iso2.toLowerCase()}`}
                level="section"
                icon="register-cost"
                name={facts.name}
                iso2={facts.iso2}
                subtitle={null}
                answer={facts.answer}
                cells={[]}
                detail={<DetailPanel name={`detail-${iso2.toLowerCase()}-nested`} summary={d.summary} rows={d.rows} withheldLine={d.withheldLine} />}
              />
            </div>
          ) : null;
          return <Story kind="detail-panel" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const d = detailPanelRows(i.iso2);
        const el = d && d.rows.length >= 2 ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 416 }}>
            <DetailPanel name={`detail-${i.iso2.replace(":", "-")}`} summary={d.summary} rows={d.rows} withheldLine={d.withheldLine} />
          </div>
        ) : null;
        return <Story kind="detail-panel" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The instance set for the income breakdown, picked from the sectors
 *  data/finance/industry_cost_profile_v1.json actually holds: the exemplar
 *  (a full four-line split), the extreme (the largest single cost line in
 *  the file, and its thinnest net margin), the thin case (the naming floor
 *  cuts a sector to three lines instead of four), and a key the file does
 *  not hold at all, which is what an honest self-omit looks like here (no
 *  sector has too few segments to draw one; every one of the 25 clears the
 *  floor, checked). */
export function pickIncomeBreakdownInstances(): Instance[] {
  return [
    { iso2: "hospitality", why: "the exemplar, a full four-line split" },
    { iso2: "heavy_industry", why: "the extreme: cost of goods over half the bar, the thinnest net margin on file" },
    { iso2: "food_drink", why: "the thin case: the fourth line just misses the naming floor" },
    { iso2: "unlisted_sector", why: "self-omits: not a sector this file holds" },
  ];
}

/** THE TRADE'S SPLIT, `05 split` (MODEL.md 8.6; plan step 33's third dispatch, 2026-09-18), keyed cell:<handle>:split off the seeds the sheet loads and drawn by the page's own card (cell/turn-one.tsx SplitCard) at the 624 the wide seat of the 3-2 takes at 1280: the exemplar off the shard's held drivers with the engine's net pinned last and the residual named (86 in lines, 5 net, 9 unallocated); London shoe repair off the sector profile (the repair sector's shares, the shard's drivers tagged modelled); London chiropractic withheld (the sector's lines and the engine's net come to 108: the net still at 30, the stated line where the bar would stand, the plus still at the foot). */
export const cellSplitKey = (c: CellHeroInstance) => `cell:${c.key}:split`;
const splitWhy = (s: NonNullable<ReturnType<typeof buildSplit>>) =>
  s.state === "withheld" ? `trade block 05 withheld: the ${s.feed === "shard" ? "shard's" : "sector's"} lines (${Math.round(s.linesPct)}) and the net (${s.netText}) come to more than a hundred; the net at 30, the stated line where the bar would stand, the plus at the foot`
    : `trade block 05 ${s.feed === "shard" ? "off the shard's held drivers" : "off the sector profile"}: ${s.segments.length} segments, the net pinned last at 30 in ink (${s.netText}, the opening card's own figure)${s.residual != null ? `, the residual named (${Math.round(s.residual)})` : ""}, the plus at the foot`;
export function pickCellSplitInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "split")).map((c) => ({ c, s: buildSplit(c.seed) })).filter((x) => x.s).map(({ c, s }) => ({ iso2: cellSplitKey(c), why: splitWhy(s!) }));
}

export function IncomeBreakdownStories({ instances = pickIncomeBreakdownInstances(), cell = [] }: { instances?: Instance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="income-breakdown">
      {cell.filter((c) => cellServes(c.key, "split")).map((c) => {
        const sp = buildSplit(c.seed);
        if (!sp) return null;
        return <Story kind="income-breakdown" key={cellSplitKey(c)} iso2={cellSplitKey(c)} why={splitWhy(sp)}><div style={{ maxWidth: 624 }}><SplitCard id={`split-cell-${c.key}`} split={sp} /></div></Story>;
      })}
      {/* The cell keys are drawn above off their seeds; the kind's list carries them too (pickAllInstances), so they are skipped here as the answer card skips its own. */}
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => {
        const d = buildIncomeBreakdown(i.iso2);
        const el = d ? (
          <div style={{ maxWidth: 416 }}>
            <IncomeBreakdown id={`income-${i.iso2.replace(/_/g, "-")}`} kicker={COPY.incomeBreakdown.kicker} netPct={d.netPct} segments={d.segments} basis={COPY.incomeBreakdown.basis} />
          </div>
        ) : null;
        return <Story kind="income-breakdown" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/* =============================== THE BENTO BAND ===============================
 * A2 and B4 of design/references/founder-2026-09-10.md: a band may hold three
 * or four cells of differing footprint instead of two equal cards. Three
 * clusters, each a different shape, so the packer, the collapse and both named
 * cell types are drawn rather than described:
 *
 *   exemplar       2 columns, 2 rows, 3 cells. The classic bento and his own
 *                  B4 shape: one tall cell beside two small ones stacked, and a
 *                  city dashboard, which is what his own reference is. The
 *                  small pair are the two cell types he named.
 *   four-cells     2 columns, 3 rows, 4 cells, the upper cap. A tall cell, two
 *                  small ones beside it, and a wide cell running under both.
 *   three-columns  3 columns, 2 rows, 3 cells. This one exists to be COLLAPSED:
 *                  at 768 its two-column-wide cell caps at two, the cluster
 *                  repacks onto a 2 by 3 grid, and the harness measures whether
 *                  it still tiles there. A three-column bento that nobody ever
 *                  narrowed is the fault this instance is for.
 *
 * EVERY FIGURE IS REAL AND COMES THROUGH A BUILDER. London's pay is the
 * customers strip's own middle mark (`buildCityCustomersStrip`); the trade
 * count is the everyday set (`EVERYDAY_TRADES`, the fixed eight) read against
 * the trades this city holds a local measurement for; the registering figures
 * are the formation file's (`buildSetupRows`, `buildHeroFacts`); the rent strip
 * is the country's three rents by city size. Nothing here is typed.
 *
 * AND NO CELL REPEATS ITS NEIGHBOUR. The first version put the paperwork count
 * and the registration fee beside the registering table, and the table already
 * drew both: the same 1-to-5 score as dots in its own column, the same fee in
 * its LLC row, and the same sentence under it. A bento's cells are three
 * readings of a subject, never three views of one reading; that is what makes
 * the differing footprints mean anything.
 *
 * WHAT IS NOT DRAWN, AND WHY IT IS NOT INVENTED: his B4 names the count cell's
 * subject as WEEKS OF PAID LEAVE PER YEAR, and this repo holds no leave data
 * for any country. The cell is drawn against counts the data does have; the
 * leave figure is a data requirement (DATA-REQUIREMENTS.md 16), not a number to
 * make up.
 *
 * NO MALFORMED STORY. A cluster that does not tile THROWS by design, so it
 * cannot be a story: it would take the whole sheet down rather than draw a
 * marked instance. That half of the law is proved by the harness, which
 * measures the drawn boxes and was watched going red with a fault planted in
 * this file. */
export function pickBentoBandInstances(): Instance[] {
  return [
    { iso2: "exemplar", why: "three cells, two columns: one tall beside two small, his B4 shape" },
    { iso2: "four-cells", why: "four cells, the cap: a tall one, two small ones, and a wide one under both" },
    { iso2: "three-columns", why: "three columns at 1280, which must repack onto two at 768 and still tile" },
    ...pickPremisesBentoInstances(),
  ];
}

/* THE PREMISES BENTO ON A PAGE (MODEL.md 8.3 `04 premises`; plan step 32,
   second dispatch, 2026-09-18), the first real cluster on a page, drawn here
   exactly as the city view draws it: the same four cells in the same
   declared order and spans (rent 2 by 1, empty shops 1 by 2, fit-out 1 by 1,
   deposit 1 by 1, three columns), off premises_bento_rows.ts and the city
   shards, no seed needed. Three instances at most, each picked off the
   builder, never typed:
     london:premises   the exemplar, every figure held, the rent lit
     <slug>:premises   the first city by slug whose figures are modelled, so
                       "modelled for this city" is looked at on all four lines
     <slug>:premises   the first city by slug with a withheld cell, the stated
                       line standing where a figure would. NO CITY TAKES IT
                       TODAY: 252 of 252 hold all four fields (counted
                       2026-09-18), so the picker finds none; the story appears
                       the day a null lands, with no edit here.
   The walk loads every shard into the store once; the archetype copy gate
   already walks the same 252 for the glance and the seat. Cached, because
   pickAllInstances asks more than once per render. */
let premisesPicks: Instance[] | null = null;
export function pickPremisesBentoInstances(): Instance[] {
  if (premisesPicks) return premisesPicks;
  const out: Instance[] = [];
  const seen = new Set<string>();
  const take = (slug: string | undefined, why: string) => { if (slug && !seen.has(slug)) { seen.add(slug); out.push({ iso2: `${slug}:premises`, why }); } };
  take("london", "the city page's 04 premises on the exemplar: four cells tiling 3 by 2, the prime rent lit, every figure held");
  const all = listedCitySlugs().map((slug) => ({ slug, d: buildPremisesBento(slug) })).filter((x) => x.d);
  take(all.find((x) => x.d!.withheld === 0 && x.d!.sample)?.slug, "every figure modelled, the four basis lines saying so, the rent still lit");
  take(all.find((x) => x.d!.withheld > 0)?.slug, "a cell withheld: the stated line where its figure would stand");
  premisesPicks = out;
  return out;
}

/** THE MARKET FOR IT, `12 market` (MODEL.md 8.6; plan step 33's fifth dispatch, 2026-09-18), keyed cell:<handle>:market off the seeds the sheet loads and drawn exactly as the trade view draws it (cell/market.tsx marketCells: the same four cells in the same declared order and spans, firms 2 by 1, chains 1 by 1, close 1 by 1, the swing 2 by 1, three columns), the page's only bento at the band's 1072, zero accent: the exemplar (restaurants, 16 firms per 10,000, chains 30, close 20, a 20 percent swing, the swing held and the rest modelled) and London shoe repair, the thin shard (every field modelled, 0.1 firms per 10,000 printed as read, chains 5 and close 8 as sparse grids). */
export const cellMarketKey = (c: CellHeroInstance) => `cell:${c.key}:market`;
const marketWhy = (m: NonNullable<ReturnType<typeof buildMarket>>) => `trade block 12, the page's only bento: four cells tiling 2+1 over 1+2 on three columns, each its own 30 in ink, zero accent (${"figure" in m.firms ? `${m.firms.figure} firms per 10,000` : "firms withheld"}, ${"part" in m.chains ? `${m.chains.part} of 100 held by chains` : "chains withheld"}, ${"part" in m.close ? `${m.close.part} of 100 close in a year` : "close withheld"}, ${"figure" in m.swing ? `a ${m.swing.figure} swing` : "the swing withheld"}), every figure modelled${m.withheld ? `, ${m.withheld} withheld with its line` : ""}`;
export function pickCellMarketInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "market")).map((c) => ({ c, m: buildMarket(c.seed?.meta?.industry_id) })).filter((x) => x.m).map(({ c, m }) => ({ iso2: cellMarketKey(c), why: marketWhy(m!) }));
}
export function BentoBandStories({ instances = pickBentoBandInstances(), city = [], cell = [] }: { instances?: Instance[]; city?: CityHeroInstance[]; cell?: CellHeroInstance[] }) {
  const london = city.find((c) => c.slug === "london") ?? city[0];
  const setup = buildSetupRows("GB");
  const lightest = [...setup].sort((a, b) => (a.complexity_1_5 ?? 9) - (b.complexity_1_5 ?? 9))[0];
  const heroCells = buildHeroFacts("GB").cells;
  const answer = buildHeroFacts("GB").answer;
  const salesTax = heroCells.find((c) => c.key === "sales-tax");
  const payroll = heroCells.find((c) => c.key === "payroll");
  const notes = buildLocalsNotes("GB");
  const premises = buildPremisesStrip("GB");
  /* THE EXEMPLAR'S OWN THREE READS, NOT THE PAGE'S SIX-ROW TABLE (plan step 32's
     sixth dispatch, 2026-09-18): this cluster demonstrates the bento's tiling,
     and the city page's full-form table (six rows, 572 tall) stretched the
     two-row cell past the pair beside it, a 380 by 192 hole the harness
     reported (LONE STAT) the day the page's card went to full form. The
     page's card is its own story (spectra-table, city:london:people). */
  const people = london ? buildCityCharacterTables(london.slug)?.people : null;
  const typical = london ? cityTypicalIncome(london.slug) : null;
  const tradesPart = london ? (london.seed?.trades_here?.list?.length ?? 0) : 0;

  const cluster = (key: string): { cols: 2 | 3; cells: BentoCell[] } | null => {
    /* THE PAGE'S OWN CLUSTER, `<slug>:premises`: the city view's cells from the
       one function both read (city/premises.tsx), so the story is the card and
       not a copy of it. */
    if (key.endsWith(":premises")) {
      const d = buildPremisesBento(key.slice(0, -":premises".length));
      return d ? { cols: 3, cells: premisesCells(d) } : null;
    }
    /* THE EXEMPLAR IS A CITY DASHBOARD, which is what his reference is: the
       fitness bento sets a ring, a count and a chart side by side because they
       are three different readings of one subject, not three views of one
       reading. Every cell here says something the other two do not. */
    if (key === "exemplar") {
      if (!london || !people || !typical || tradesPart < 1) return null;
      return {
        cols: 2,
        cells: [
          {
            key: "reads",
            cols: 1,
            rows: 2,
            node: (
              <Box className="h-full">
                <Rail icon="who-for" kicker={COPY.character.people.kicker} sample />
                <SpectraTable rows={people.rows} dot={people.dot} foot={people.foot} />
              </Box>
            ),
          },
          {
            key: "pay",
            cols: 1,
            rows: 1,
            node: <BentoMetric icon="spending-power" kicker={COPY.bento.cityPay.kicker} figure={usd(typical.value)} basis={COPY.bento.cityPay.basis} sample />,
          },
          {
            key: "trades",
            cols: 1,
            rows: 1,
            /* THE CLUSTER'S ONE LOUD CELL, and the only one: PART 6 allows one
               loud card per band and this cluster is the band. */
            node: <BentoCount icon="honest-take" kicker={COPY.bento.everydayTrades.kicker} part={tradesPart} whole={EVERYDAY_TRADES.size} basis={COPY.bento.everydayTrades.basis} />,
          },
        ],
      };
    }
    if (key === "four-cells") {
      if (!notes || !answer || !premises || lightest?.complexity_1_5 == null) return null;
      return {
        cols: 2,
        cells: [
          {
            key: "notes",
            cols: 1,
            rows: 2,
            node: (
              <Box className="h-full">
                <Rail icon="locals-know" kicker={`${COPY.locals.kicker}, ${nameOf("GB")}`} sample />
                <NoteList notes={notes.notes} columns={1} />
              </Box>
            ),
          },
          {
            key: "burden",
            cols: 1,
            rows: 1,
            node: <BentoMetric icon="taxes" kicker={COPY.bento.burden.kicker} figure={answer.value} basis={COPY.bento.burden.basis} sample />,
          },
          {
            key: "paperwork",
            cols: 1,
            rows: 1,
            /* THE PAPERWORK COUNT LIVES HERE AND NOT BESIDE THE REGISTERING
               TABLE, which is where it was first put and where it was wrong:
               that table already draws the same 1-to-5 score as dots in its own
               column and prints the same sentence under it, so the band said
               one thing twice. A bento cell has to earn its footprint with a
               reading its neighbours do not already carry. */
            node: <BentoCount icon="calculator" kicker={COPY.bento.paperwork.kicker} part={lightest.complexity_1_5} whole={5} basis={COPY.bento.paperwork.basis} accent={false} />,
          },
          {
            key: "premises",
            cols: 2,
            rows: 1,
            node: (
              <Box className="h-full">
                <Rail icon="commercial-rent" kicker={COPY.premises.kicker} sample={premises.confidence !== "measured"} />
                <RangeStrip marks={premises.marks} scale="log" fmt={usd} basis={COPY.premises.basis} note={premises.note} extra={premises.extra} />
              </Box>
            ),
          },
        ],
      };
    }
    if (key === "three-columns") {
      if (!setup.length || !salesTax || !payroll) return null;
      return {
        cols: 3,
        cells: [
          {
            key: "forms",
            cols: 2,
            rows: 2,
            node: (
              <Box className="h-full">
                <Rail icon="red-tape" kicker={`${COPY.tiers.kicker}, ${nameOf("GB")}`} />
                <TiersTable rows={setup} howTo={howToOpenDoor("GB")} />
              </Box>
            ),
          },
          {
            key: "sales-tax",
            cols: 1,
            rows: 1,
            node: <BentoMetric icon="taxes" kicker={COPY.cells.salesTax.label} figure={salesTax.value} basis={COPY.bento.salesTax.basis} />,
          },
          {
            key: "payroll",
            cols: 1,
            rows: 1,
            node: <BentoMetric icon="wages" kicker={COPY.bento.payroll.kicker} figure={payroll.value} basis={COPY.bento.payroll.basis} />,
          },
        ],
      };
    }
    return null;
  };

  return (
    <div data-stories="bento-band">
      {/* The trade's market cluster, drawn from the view's own cell function off the cell seeds the sheet loads; the kind's list carries the keys too (pickAllInstances), so they are skipped below as the answer card skips its own. */}
      {cell.filter((c) => cellServes(c.key, "market")).map((c) => {
        const m = buildMarket(c.seed?.meta?.industry_id);
        if (!m) return null;
        return (
          <Story kind="bento-band" key={cellMarketKey(c)} iso2={cellMarketKey(c)} why={marketWhy(m)}>
            <div style={{ maxWidth: 1072 }}>
              <BentoBand cols={3} cells={marketCells(m)} />
            </div>
          </Story>
        );
      })}
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => {
        const c = cluster(i.iso2);
        const el = c ? (
          <div style={{ maxWidth: 1072 }}>
            <BentoBand cols={c.cols} cells={c.cells} />
          </div>
        ) : null;
        return <Story kind="bento-band" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/* THE STANDALONE METRIC CELL, `04 entry-bill` on the country page (MODEL.md
   8.2; plan step 31, third dispatch, 2026-09-17): BentoMetric standing as its
   own card with the two laws added for it, the second figure under a hairline
   and the withheld line. Five stories, one per shape the guard can leave the
   card in, each the FIRST country by code in that state read off the builder
   (never typed), so a reader sees every line the card can print:
     GB          both figures, the exemplar ($148, 21 days, the fourteen-word basis, the foot)
     AZ          the bill withheld for disagreeing with its table, the days printed
     AE          the days withheld, the bill printed (and the largest bill on file, $5,446, held)
     AO          neither: two withheld lines, no basis, no foot, ugly on purpose
     GE          no bill on file (one of the brief's four), the days printed
   Drawn at 416, the narrow side of the 3-2 the card takes beside the
   registering table at 1280. */
export function pickBentoMetricInstances(): Instance[] {
  const W = COPY.entryBill.withheld;
  const all = codes().sort().map((c) => ({ c, d: buildEntryBill(c) })).filter((x) => x.d);
  const out: Instance[] = [{ iso2: "GB:entry-bill", why: "block 04 on the exemplar: the bill at 30, the days at 16 under the hairline, the basis and the foot" }];
  const seen = new Set(["GB"]);
  const take = (iso2: string | undefined, why: string) => { if (iso2 && !seen.has(iso2)) { seen.add(iso2); out.push({ iso2: `${iso2}:entry-bill`, why }); } };
  take(all.find((x) => x.d!.withheld === W.bill && "figure" in x.d!.second)?.c, "the bill withheld by the guard, the days printed");
  take(all.find((x) => x.d!.figure != null && "withheld" in x.d!.second)?.c, "the days withheld by the guard, the bill printed");
  take(all.find((x) => x.d!.withheld === W.bill && "withheld" in x.d!.second)?.c, "neither prints: two withheld lines and nothing else");
  take(all.find((x) => x.d!.withheld === W.billNotOnFile && "figure" in x.d!.second)?.c, "no bill on file, the days printed");
  /* THE CITY'S SPEND CARD, `08 demand` (MODEL.md 8.3; plan step 32's fourth
     dispatch, 2026-09-18), keyed "city:<slug>:demand", the plain figure
     standing as its own card, three shapes read off the builder: the
     exemplar, whose spend is the set's one placeholder and is WITHHELD with
     its line (the 30 absent on purpose, item 23); the first city by slug
     whose spend is held (the figure at 30, no foot); and Frankfurt, modelled,
     the foot saying so, the state 248 of 252 share. */
  const citySlugs = listedCitySlugs();
  const takeCity = (slug: string | undefined, why: string) => { if (slug && !seen.has(`city:${slug}`)) { seen.add(`city:${slug}`); out.push({ iso2: `city:${slug}:demand`, why }); } };
  takeCity("london", "city block 08 on the exemplar: the placeholder withheld with its line, no figure, no basis");
  takeCity(citySlugs.find((slug) => buildCityDemand(slug)?.tag === "held"), "city block 08 held: the spend at 30 in ink, the basis, no foot");
  takeCity("frankfurt", "city block 08 modelled: the spend at 30, the foot saying modelled, the state 248 of 252 share");
  return out;
}

/** THE TRADE'S SHARE OF A DAY, `08 clears` (MODEL.md 8.6; plan step 33's fourth dispatch, 2026-09-18), keyed cell:<handle>:clears off the seeds the sheet loads and drawn by the page's own card (cell/turn-two.tsx ClearsCard) at the 520 the card takes in its 1-1 band at 1280: London off the engine (money shown; the engine's ratio is the trade's fixed-cost share over its gross margin, clears_rows.ts says why) and Mumbai cafes off the shard (money not shown), the share at 30 in terracotta on the plain figure, the page's third accent; the ring is candidate 4 awaiting his click and its mockup is owed to the review sheet. */
export const cellClearsKey = (c: CellHeroInstance) => `cell:${c.key}:clears`;
const clearsWhy = (cl: NonNullable<ReturnType<typeof buildClears>>) => `trade block 08 off the ${cl.branch === "engine" ? "engine (money shown)" : "shard (money not shown)"}: the needed share of a typical day, ${cl.figure}, at 30 in terracotta on the plain figure (the ring is candidate 4 awaiting his click), modelled`;
export function pickCellClearsInstances(cell: CellHeroInstance[]): Instance[] {
  return cell.filter((c) => cellServes(c.key, "clears")).map((c) => ({ c, cl: buildClears(c.seed) })).filter((x) => x.cl).map(({ c, cl }) => ({ iso2: cellClearsKey(c), why: clearsWhy(cl!) }));
}
export function BentoMetricStories({ instances = pickBentoMetricInstances(), cell = [] }: { instances?: Instance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="bento-metric">
      {cell.filter((c) => cellServes(c.key, "open")).map((c) => {
        const o = buildOpen(c.seed);
        if (!o || o.state === "held") return null;
        return <Story kind="bento-metric" key={cellOpenKey(c)} iso2={cellOpenKey(c)} why={openWhy(o)}><div style={{ maxWidth: 693 }}><OpenCard id={`open-cell-${c.key}`} open={o} /></div></Story>;
      })}
      {cell.filter((c) => cellServes(c.key, "clears")).map((c) => {
        const cl = buildClears(c.seed);
        if (!cl) return null;
        return <Story kind="bento-metric" key={cellClearsKey(c)} iso2={cellClearsKey(c)} why={clearsWhy(cl)}><div style={{ maxWidth: 520 }}><ClearsCard id={`clears-cell-${c.key}`} clears={cl} /></div></Story>;
      })}
      {cell.filter((c) => cellServes(c.key, "rivals")).map((c) => {
        const r = buildRivals(c.seed);
        if (!r || r.state === "list") return null;
        return <Story kind="bento-metric" key={cellRivalsKey(c)} iso2={cellRivalsKey(c)} why={rivalsWhy(r)}><div style={{ maxWidth: 693 }}><RivalsCard id={`rivals-cell-${c.key}`} rivals={r} /></div></Story>;
      })}
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => {
        if (i.iso2.startsWith("city:")) {
          const slug = i.iso2.split(":")[1];
          const d = buildCityDemand(slug);
          /* At the 520 the card takes in its 1-1 band at 1280 (city-view.tsx `Demand`, the same props). */
          const el = d ? (
            <div style={{ maxWidth: 520 }}>
              <BentoMetric id={`demand-${slug}`} icon="market-size" kicker={`${COPY.cityDemand.kicker}, ${d.name}`} sample={d.sample} figure={d.figure ?? undefined} withheld={d.withheld ?? undefined} basis={d.basis ?? undefined} foot={d.foot ?? undefined} />
            </div>
          ) : null;
          return <Story kind="bento-metric" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const iso2 = i.iso2.split(":")[0];
        const d = buildEntryBill(iso2);
        const el = d ? (
          <div style={{ maxWidth: 416 }}>
            <BentoMetric id={`entry-bill-${iso2.toLowerCase()}`} icon="startup-cost" kicker={`${COPY.entryBill.kicker}, ${nameOf(iso2)}`} sample={d.sample} figure={d.figure ?? undefined} withheld={d.withheld ?? undefined} second={d.second} basis={d.basis ?? undefined} foot={d.foot ?? undefined} lean />
          </div>
        ) : null;
        return <Story kind="bento-metric" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/* ============================ THE MARK LIST ============================
 * B3 of design/references/founder-2026-09-10.md, and the reason it is built
 * before the three that follow it: "the one with flags is pretty universal but
 * the use can be beyond the use of flags itself, universal format."
 *
 * FIVE INSTANCES, EACH PICKED FROM A FILE THAT WAS READ FIRST, never typed.
 *
 *   exemplar    the ten highest-paying of the 252 covered cities, each with
 *               its country's flag as the mark. Picked because
 *               `avg_gross_salary_usd_year` is the one field in
 *               `data/cities/city_list_v1.json` held for all 252, and because
 *               it is the figure the city pages themselves open with, so the
 *               list promises what the pages behind it deliver. It is also
 *               the sharpest test of clause 1: the rows are CITIES and the
 *               flag says which country each is in, so the mark carries
 *               something real and is plainly not the row's identity.
 *   no-marks    the same card on the same data with the marks dropped. Not a
 *               different subject, on purpose: the point is to see the same
 *               ten rows hold their shape when the leading slot is gone.
 *   thin        one trade across every country the margin snapshot measures.
 *               `auto_repair_shops` was picked by counting: of the six trades
 *               in `data/archetypes/net_margin_snapshot.json` it is the one
 *               whose credible countries come to exactly FOUR (against 32, 20,
 *               18, 13 and 5 for the others), which is the model's own floor
 *               for a ranked comparison. The thin case is therefore the data's
 *               choice and not a set trimmed to make a point. Its rows are
 *               COUNTRIES, so here the flag is the row's own identity, which
 *               is the reference's original use.
 *   withheld    the ten most visited of the same 252 cities.
 *               `tourist_arrivals_m` is the city field with real gaps, six of
 *               them (Abidjan, Algiers, Kaohsiung, Kuwait City, Taipei,
 *               Tunis), so the withheld line here is a line a reader actually
 *               meets rather than a branch nothing reaches.
 *   self-omit   the covered cities of New Zealand. Three of them, one under
 *               the floor of four, so the card draws nothing at all: the
 *               honest minimum proved from the low side by a real country
 *               rather than by an unheld key.
 *
 * WHY THE TRADE CARD IS HERE AT ALL, said plainly: the engine behind it is a
 * known data problem (`data:margin-engine` on the queue, and the country money
 * card draws the same snapshot with the same withholding). This instance
 * proves the SHAPE at the floor; it is not a claim that four countries are
 * where an auto repair shop should open.
 */
const MARK_LIST_STORIES: Record<string, { key: string; marks: boolean }> = {
  exemplar: { key: "cities:pay", marks: true },
  "no-marks": { key: "cities:pay", marks: false },
  thin: { key: "trade:auto_repair_shops", marks: true },
  withheld: { key: "cities:visitors", marks: true },
  "self-omit": { key: "cities:pay:NZ", marks: true },
};
export function pickMarkListInstances(): Instance[] {
  return [
    { iso2: "exemplar", why: "the ten highest-paying of the 252 covered cities, the mark a country flag" },
    { iso2: "no-marks", why: "the same card and the same data with no marks at all" },
    { iso2: "withheld", why: "the ten most visited of the same cities; six hold no visitor figure and are withheld" },
    { iso2: "thin", why: "one trade across every country measured: four clear the floor, which is the honest minimum" },
    { iso2: "self-omit", why: "self-omits: three covered cities, one under the floor of four" },
  ];
}

/** OTHER TRADES TO OPEN, `13 rivals` (MODEL.md 8.6; plan step 33's sixth dispatch, 2026-09-18), keyed cell:<handle>:rivals off the seeds the sheet loads and drawn by the page's own card (cell/exit.tsx RivalsCard) at the 693 the wide seat of its 2-1 band takes at 1280 (the list in two columns of rows there, PART 5; one column under 600px of container). Two kinds, as the cost to open has: the LIST on mark-list, no marks, every row a door (the exemplar: six siblings, four keyed, two withheld with the count; Berlin restaurants: six siblings, all six keyed, the longest list), the headline the middle of the keyed set at 30 in ink; the WITHHELD state on bento-metric (Mumbai cafes: no sibling resolves at the place, the line where the list would stand), never a short list. */
export const cellRivalsKey = (c: CellHeroInstance) => `cell:${c.key}:rivals`;
function rivalsWhy(r: NonNullable<ReturnType<typeof buildRivals>>): string {
  if (r.state === "withheld") return r.siblings === 0 ? "trade block 13 withheld: no sibling trade resolves at the place, the line where the list would stand, on the seat form" : `trade block 13 withheld: ${r.keyed} of the ${r.siblings} siblings hold a figure, under the floor of four; the line counting them, never a short list`;
  return r.withheld > 0 ? `trade block 13 on the exemplar: ${r.rows.length} siblings with a figure as doors, ${r.withheld} on the default withheld with the count, the middle at 30 in ink, no marks` : `trade block 13 at its longest: ${r.rows.length} siblings, every one keyed, every row a door, nothing withheld`;
}
export function pickCellRivalsInstances(cell: CellHeroInstance[], kind: "mark-list" | "bento-metric"): Instance[] {
  return cell.filter((c) => cellServes(c.key, "rivals")).map((c) => ({ c, r: buildRivals(c.seed) })).filter((x) => x.r && (kind === "mark-list" ? x.r.state === "list" : x.r.state !== "list")).map(({ c, r }) => ({ iso2: cellRivalsKey(c), why: rivalsWhy(r!) }));
}
export function MarkListStories({ instances = pickMarkListInstances(), cell = [] }: { instances?: Instance[]; cell?: CellHeroInstance[] }) {
  return (
    <div data-stories="mark-list">
      {cell.filter((c) => cellServes(c.key, "rivals")).map((c) => {
        const r = buildRivals(c.seed);
        if (!r || r.state !== "list") return null;
        return <Story kind="mark-list" key={cellRivalsKey(c)} iso2={cellRivalsKey(c)} why={rivalsWhy(r)}><div style={{ maxWidth: 693 }}><RivalsCard id={`rivals-cell-${c.key}`} rivals={r} /></div></Story>;
      })}
      {instances.filter((i) => !i.iso2.startsWith("cell:")).map((i) => {
        const cfg = MARK_LIST_STORIES[i.iso2];
        const d = cfg ? buildMarkList(cfg.key) : null;
        /* THE FLAG COMES FROM `CountryFlag` AND NOWHERE ELSE (its own law:
           height from a token, width auto, no radius, a hairline outline).
           The builder hands over an iso2, which is data; turning that into a
           drawing is the caller's job, which is exactly what makes the mark
           slot universal. */
        const el = d ? (
          <div style={{ maxWidth: 416 }}>
            <MarkList
              id={`marks-${i.iso2}`}
              kicker={d.kicker}
              icon={d.icon}
              tagged={d.tagged}
              headline={{ label: d.middleLabel, value: d.middle }}
              basis={d.basis}
              head={d.head}
              rows={d.rows.map((r) => ({
                key: r.key,
                name: r.name,
                value: r.value,
                mark: cfg && cfg.marks && r.iso2 ? <CountryFlag iso2={r.iso2} /> : undefined,
              }))}
              fmt={d.fmt}
              withheld={d.withheld}
              withheldLine={d.withheldLine}
            />
          </div>
        ) : null;
        return <Story kind="mark-list" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/* THE DRAWN BLOCKED SEATS (MODEL.md 8.2; plan step 31, 2026-09-17 and
   2026-09-18). A seat's words are the same on every country (it holds no
   figure, so there is no data-poor case and no extreme name): what varies is
   which block it holds and which country's data leaves the block seated.
   Two seats stand on every country, `07 workforce` and `11 easiest`, so their
   stories are keyed on the exemplar, "GB:workforce" and "GB:easiest". Four
   stand only where the drawn card's own floor is not met (8.2's "THE THIN
   COUNTRY, SEATED"), so their keys come OFF THE BUILDERS: the thin country
   is AF wherever the builder says AF needs the seat, and otherwise the first
   country in the taxonomy that does, and the `why` states the builder's own
   verdict, so a story can never draw a seat on a country whose card would
   draw. Each is drawn at the width its seat takes on the page at 1280 (the
   column is 1072 inside the main's padding, minus the band's 32 gap: 520 for
   07's half of a 1-1, 347 for 11's third of a 2-1, 624 for 03's wide side of
   the 3-2 and 16's wide side of the 2-3, 416 for 12's narrow side of the
   2-3, 1072 for 09's full width), so the line's wrap is the page's. */
type SeatBlock = "setup" | "peers" | "money" | "locals";
const SEAT_FORM: Record<SeatBlock | "workforce" | "easiest", { icon: "staffing-rota" | "where-it-pays" | "register-cost" | "benchmark" | "owner-keeps" | "locals-know"; maxWidth: number }> = {
  workforce: { icon: "staffing-rota", maxWidth: 520 },
  easiest: { icon: "where-it-pays", maxWidth: 347 },
  setup: { icon: "register-cost", maxWidth: 624 },
  peers: { icon: "benchmark", maxWidth: 1072 },
  money: { icon: "owner-keeps", maxWidth: 416 },
  locals: { icon: "locals-know", maxWidth: 624 },
};
/** Whether a country's data leaves the block seated, by the builder the drawn card reads (the view's own floors). */
const SEATED: Record<SeatBlock, (iso2: string) => string | null> = {
  setup: (c) => (buildSetupRows(c).length === 0 ? "no legal form on file" : null),
  peers: (c) => (buildPeerTable(c) == null ? "no peer table resolves" : null),
  money: (c) => { const m = marginCardFromSnapshot(c); return !m || m.rows.length < 2 ? `${m ? m.rows.length : 0} credible margin(s), under the card's two` : null; },
  locals: (c) => (buildLocalsNotes(c) == null ? "no authored notes" : null),
};
const SEAT_WHY: Record<SeatBlock, string> = {
  setup: "block 03, the seat beside the bill to register; item 10 not gathered",
  peers: "block 09, the seat at the table's full width; item 57 not gathered",
  money: "block 12, the seat beside what locals know; item 8 not gathered",
  locals: "block 16, the seat beside the net profit margin; item 6 not gathered",
};
/* THE CITY'S TWO SEATS (MODEL.md 8.3; plan step 32's sixth dispatch,
   2026-09-18), keyed "city:<slug>:<block>": `13 locals` on the exemplar, the
   same three strings as the country's seat (M19), at the 1-1 card's 520; and
   `14 neighbourhoods` on the first placeholder city by slug (209 of 252 hold
   the compass scheme), its line naming the city, at the wide side of its 2-1
   band, 693. The kicker of the neighbourhoods seat is the pager's own
   (`COPY.cityNeighbourhoods.kicker`), referenced by the copy table. */
const CITY_SEAT_FORM: Record<"locals" | "neighbourhoods", { icon: "locals-know" | "neighborhood"; maxWidth: number }> = {
  locals: { icon: "locals-know", maxWidth: 520 },
  neighbourhoods: { icon: "neighborhood", maxWidth: 693 },
};
export function pickBlockedSeatInstances(): Instance[] {
  const out: Instance[] = [
    { iso2: "GB:workforce", why: "block 07, the seat beside what staff cost; items 40 and 17 not gathered" },
    { iso2: "GB:easiest", why: "block 11, the seat beside the footing; item 8's addendum not gathered" },
  ];
  for (const block of ["setup", "peers", "money", "locals"] as SeatBlock[]) {
    const c = ["AF", ...codes()].find((x) => SEATED[block](x) != null);
    if (c) out.push({ iso2: `${c}:${block}`, why: `${SEAT_WHY[block]} (${SEATED[block](c)})` });
  }
  out.push({ iso2: "city:london:locals", why: "city block 13 on the exemplar: the seat beside the people table; item 6 not gathered for any city" });
  const placeholder = citiesWithScheme().sort().find((slug) => buildCityNeighbourhoods(slug)?.cards == null);
  if (placeholder) out.push({ iso2: `city:${placeholder}:neighbourhoods`, why: "city block 14 on a placeholder scheme: the seat at the band's wide side, its line naming the city; item 30 not gathered" });
  /* THE TRADE'S ONE SEAT (MODEL.md 8.6 `10 watch`; plan step 33's fifth
     dispatch, 2026-09-18), keyed on the exemplar: the same three strings on
     every trade (his B1 bars wait on item 53 for 0 of 243), drawn by the
     page's own card (cell/turn-two.tsx WatchSeat) at the 520 of its 1-1
     band at 1280, beside where sales come from. It needs no seed. */
  out.push({ iso2: "cell:london:watch", why: "trade block 10 on the exemplar: the seat beside where sales come from; item 53 (causes of closure with shares) not gathered for any trade" });
  return out;
}
export function BlockedSeatStories({ instances = pickBlockedSeatInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="blocked-seat">
      {instances.map((i) => {
        const parts = i.iso2.split(":");
        if (parts[0] === "cell") {
          const el = parts[2] === "watch" ? (
            <div style={{ maxWidth: 520 }}>
              <WatchSeat id={`seat-cell-${parts[1]}-watch`} />
            </div>
          ) : null;
          return <Story kind="blocked-seat" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        if (parts[0] === "city") {
          const slug = parts[1];
          const block = parts[2] as keyof typeof CITY_SEAT_FORM;
          const form = CITY_SEAT_FORM[block];
          let el: React.ReactNode = null;
          if (form && block === "locals") {
            el = (
              <div style={{ maxWidth: form.maxWidth }}>
                <BlockedSeat id={`seat-city-${slug}-locals`} icon={form.icon} kicker={COPY.blocked.locals.kicker} line={COPY.blocked.locals.line} foot={COPY.blocked.locals.foot} />
              </div>
            );
          } else if (form && block === "neighbourhoods") {
            const h = buildCityNeighbourhoods(slug);
            el = h?.seatLine ? (
              <div style={{ maxWidth: form.maxWidth }}>
                <BlockedSeat id={`seat-city-${slug}-neighbourhoods`} icon={form.icon} kicker={COPY.blocked.cityNeighbourhoods.kicker} line={h.seatLine} foot={COPY.blocked.cityNeighbourhoods.foot} />
              </div>
            ) : null;
          }
          return <Story kind="blocked-seat" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
        }
        const block = parts[1] as keyof typeof SEAT_FORM;
        const form = SEAT_FORM[block];
        const copy = (COPY.blocked as Record<string, { kicker: string; line: string; foot: string }>)[block];
        const el = form && copy ? (
          <div style={{ maxWidth: form.maxWidth }}>
            <BlockedSeat id={`seat-${block}`} icon={form.icon} kicker={copy.kicker} line={copy.line} foot={copy.foot} />
          </div>
        ) : null;
        return <Story kind="blocked-seat" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The city masthead stories take their seeds from `loadCityHeroInstances()` (async, the renderer and the stories page await it). */
export function CityHeroStories({ instances }: { instances: CityHeroInstance[] }) {
  return (
    <div data-stories="city-hero">
      {instances.map((i) => {
        const f = cityHeroFacts(i.seed);
        /* tone="accent" since plan step 32 (2026-09-18), as masthead.tsx draws it: the answer is the page's loud 1 (MODEL.md 8.3, `00 masthead`). */
        const el = f ? <AnswerCard id={`city-${i.slug}`} name={f.name} iso2={f.iso2} image={f.image} subtitle={f.subtitle} answer={f.answer} cells={f.cells} tone="accent" foot={f.foot} /> : null;
        return <Story kind="city-hero" key={i.slug} iso2={i.slug} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/* The city verdict card's stories (city:verdict, run 23) left with the card on
   plan step 32 (2026-09-18): MODEL.md 8.3 dissolves the rent verdict into the
   masthead's answer ("dissolved, not cut"), so no page draws a second answer
   card and no story does either. */

/* THE INDEX (sys:stories-index, the build loop's run 21, 2026-09-06): one
   picker for every archetype's instance set, shared by the harness sheet and
   the dev page so the two never differ, and a table at the top of both that
   lists every archetype, its instance keys and the reason each was picked,
   each key a link to its story's section by id. Outside any stories wrapper,
   so the checker does not read it as a story. */
export function pickAllInstances(cityHero: CityHeroInstance[], cellHero: CellHeroInstance[] = []): Record<string, Instance[]> {
  const cityStrips = pickCityStripInstances();
  const cityCloses = pickCityCloseInstances(cityHero);
  return {
    "answer-card": [...pickAnswerCardInstances(), ...pickCellTakeInstances(cellHero)],
    "ranked-bars": [...pickRankedBarsInstances(), ...pickCityDistrictInstances(cityHero).map((c) => ({ iso2: `${c.slug}:districts`, why: c.why })), ...pickCellOpenInstances(cellHero, "ranked-bars")],
    "compare-table": [...pickCompareTableInstances(), ...pickCityPeerInstances(cityHero).map((c) => ({ iso2: `${c.slug}:peers`, why: c.why })), ...pickCellPeersInstances(cellHero)],
    "card-pager": pickCardPagerInstances(),
    "city-cards": pickCityCardsInstances(),
    "tiers-table": [...pickTiersTableInstances(), ...pickCellTeamInstances(cellHero)],
    "range-strip": [...pickRangeStripInstances(), ...cityStrips.map((c) => ({ iso2: cityStripKey(c), why: c.why })), ...pickCellSpreadInstances(cellHero), ...pickCellWorthInstances(cellHero)],
    "spectra-table": pickSpectraTableInstances(),
    "note-list": pickNoteListInstances(),
    "terminus": [...pickTerminusInstances(), ...cityCloses.map((c) => ({ iso2: `${c.slug}:close`, why: c.why })), ...pickCellCloseInstances(cellHero)],
    "pay-bars": pickPayBarsInstances(),
    "kv-grid": [...pickKvGridInstances(), ...pickCellPermitsInstances(cellHero), ...pickCellLastsInstances(cellHero), ...pickCellMixInstances(cellHero)],
    "detail-panel": pickDetailPanelInstances(),
    "income-breakdown": [...pickIncomeBreakdownInstances(), ...pickCellSplitInstances(cellHero)],
    "bento-band": [...pickBentoBandInstances(), ...pickCellMarketInstances(cellHero)],
    "bento-metric": [...pickBentoMetricInstances(), ...pickCellOpenInstances(cellHero, "bento-metric"), ...pickCellClearsInstances(cellHero), ...pickCellRivalsInstances(cellHero, "bento-metric")],
    "mark-list": [...pickMarkListInstances(), ...pickCellRivalsInstances(cellHero, "mark-list")],
    "blocked-seat": pickBlockedSeatInstances(),
    "city-hero": cityHero.map((c) => ({ iso2: c.slug, why: c.why })),
  };
}

export function StoriesIndex({ instances }: { instances: Record<string, Instance[]> }) {
  const kinds = Object.keys(instances);
  const total = kinds.reduce((n, k) => n + instances[k].length, 0);
  return (
    <nav id="stories-index" data-stories-index aria-label="Every archetype and its instances" className="mb-12 rounded-[14px] border border-[var(--c-border)] p-5">
      <div className="mb-3 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{kinds.length} archetypes, {total} instances, each picked from the data for a reason</div>
      <div className="overflow-x-auto">
        <table className="w-full text-[length:var(--t-micro)] leading-snug">
          <tbody>
            {kinds.map((k) => instances[k].map((i, n) => (
              <tr key={`${k}:${i.iso2}`} data-index-row className="border-t border-[var(--c-border)] align-top">
                <td className="whitespace-nowrap py-1.5 pr-4 font-semibold text-[var(--c-ink)]">{n === 0 ? `${k} (${instances[k].length})` : ""}</td>
                <td className="whitespace-nowrap py-1.5 pr-4"><a href={`#${storyId(k, i.iso2)}`} className="text-[var(--c-ink2)] underline decoration-[var(--c-border)] underline-offset-2 hover:text-[var(--c-ink)]">{i.iso2}</a></td>
                <td className="py-1.5 text-[var(--c-muted)]">{i.why}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </nav>
  );
}
