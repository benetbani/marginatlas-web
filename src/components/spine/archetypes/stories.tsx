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
import { cityVerdictFacts } from "@/lib/spine/city_verdict_facts";
import { buildCityDistrictBars, rentMult } from "@/lib/spine/district_rows";
import { RankedBars } from "./RankedBars";
import { CompareTable } from "./CompareTable";
import { CardPager } from "./CardPager";
import { CityCards, type CityCardsLook } from "./CityCards";
import { buildCityCards } from "@/lib/spine/city_cards";
import { TiersTable } from "./TiersTable";
import { buildSetupRows, howToOpenDoor } from "@/lib/spine/setup_rows";
import { RangeStrip } from "./RangeStrip";
import { buildPremisesStrip, buildCustomersStrip, buildCityCustomersStrip, buildCityPremisesStrip } from "@/lib/spine/range_rows";
import { SpectraTable } from "./SpectraTable";
import { buildCharacterTables, buildCityCharacterTables, citiesWithSignature } from "@/lib/spine/character_rows";
import { buildCityQuickReads } from "@/lib/spine/reads_rows";
import { NoteList } from "./NoteList";
import { buildLocalsNotes, countriesWithNotes } from "@/lib/spine/locals_rows";
import { Terminus } from "./Terminus";
import { buildCloseDoors, buildCityCloseDoors } from "@/lib/spine/close_rows";
import { coveredCities } from "@/lib/cities/city_pages";
import { PayBars } from "./PayBars";
import { buildPayBars } from "@/lib/spine/pay_rows";
import { buildGlance } from "@/lib/spine/glance_rows";
import { buildWorldSeat } from "@/lib/spine/world_seat_rows";
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

export function AnswerCardStories({ instances = pickAnswerCardInstances() }: { instances?: Instance[] }) {
  return <div data-stories="answer-card">{instances.map((i) => <AnswerCardStory key={i.iso2} facts={buildHeroFacts(i.iso2)} why={i.why} />)}</div>;
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
export function RankedBarsStories({ instances = pickRankedBarsInstances(), city = [] }: { instances?: Instance[]; city?: CityHeroInstance[] }) {
  return (
    <div data-stories="ranked-bars">
      <p className="mb-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">Margins from the engine snapshot of {SNAPSHOT_TAKEN}.</p>
      {instances.map((i) => {
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
export function CompareTableStories({ instances = pickCompareTableInstances(), city = [] }: { instances?: Instance[]; city?: CityHeroInstance[] }) {
  return (
    <div data-stories="compare-table">
      {instances.map((i) => {
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

export function TiersTableStories({ instances = pickTiersTableInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="tiers-table">
      {instances.map((i) => {
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

/** The city instances for the strip, from the loaded city seeds: one drawing its own spread and one drawing the country's figure, each saying which (city:earnings, run 11). */
export type CityStripInstance = CityHeroInstance & { kind: "customers" | "premises" };
export const cityStripKey = (c: CityStripInstance) => `${c.slug}:${c.kind === "premises" ? "premises" : "city"}`;
export function pickCityStripInstances(cities: CityHeroInstance[]): CityStripInstance[] {
  const out: CityStripInstance[] = [];
  const own = cities.find((c) => buildCityCustomersStrip(c.seed)?.from === "city");
  if (own) out.push({ ...own, kind: "customers", why: "the city's own spread, modelled on its average pay" });
  const country = cities.find((c) => buildCityCustomersStrip(c.seed)?.from === "country");
  if (country) out.push({ ...country, kind: "customers", why: "no figure of its own, the country's typical pay, said so" });
  /* The premises strip (run 13): the country's three rents by city size with the city's own class in the accent; one city of each size class the loaded seeds hold. */
  const seenTier = new Set<number>();
  for (const c of cities) {
    const tier = Number(c.seed?.meta?.tier);
    if (!buildCityPremisesStrip(c.seed) || seenTier.has(tier)) continue;
    seenTier.add(tier);
    out.push({ ...c, kind: "premises", why: `the country's three rents by city size, a size-${tier} city's own class in the accent` });
  }
  return out;
}
export function RangeStripStories({ instances = pickRangeStripInstances(), city = [] }: { instances?: Instance[]; city?: CityStripInstance[] }) {
  return (
    <div data-stories="range-strip">
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
      {city.map((c) => {
        const premises = c.kind === "premises";
        const d = premises ? buildCityPremisesStrip(c.seed) : buildCityCustomersStrip(c.seed);
        const el = d ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: premises ? 416 : 536 }}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{premises ? COPY.premises.kicker : COPY.cityCustomers.kicker}, {String(c.seed?.meta?.city ?? c.slug)}</div>
            <RangeStrip marks={d.marks} scale={premises ? "log" : "linear"} fmt={usd} basis={d.basis} note={d.note} extra={d.extra} />
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
  /* The cities (run 14): keyed city:<slug>:<side>, from the city signature file; the exemplar, the city with most reads on each side, and one with none. */
  const cities = citiesWithSignature().map((slug) => ({ slug, t: buildCityCharacterTables(slug) }));
  const london = cities.find((x) => x.slug === "london"); if (london?.t?.people) take("city:london:people", "the exemplar city, its own reads"); if (london?.t?.state) take("city:london:state", "the exemplar city, its own reads");
  const mostState = [...cities].filter((x) => x.t?.state).sort((a, b) => b.t!.state!.rows.length - a.t!.state!.rows.length)[0]; if (mostState) take(`city:${mostState.slug}:state`, `the most state reads a city holds, ${mostState.t!.state!.rows.length}`);
  const mostPeople = [...cities].filter((x) => x.t?.people).sort((a, b) => b.t!.people!.rows.length - a.t!.people!.rows.length)[0]; if (mostPeople) take(`city:${mostPeople.slug}:people`, `the most people reads a city holds, ${mostPeople.t!.people!.rows.length}`);
  const noCity = cities.find((x) => !x.t); if (noCity) take(`city:${noCity.slug}:state`, "a city in the file with no reads, self-omits");
  return out;
}

/** The quick reads (run 16): every loaded city seed that holds them, keyed <slug>:reads, at body size. */
export function pickCityReadsInstances(cities: CityHeroInstance[]): CityHeroInstance[] {
  return cities.filter((c) => buildCityQuickReads(c.seed)).map((c) => ({ ...c, why: `the quick reads at body size, ${buildCityQuickReads(c.seed)!.rows.length} of six` }));
}
export function SpectraTableStories({ instances = pickSpectraTableInstances(), city = [] }: { instances?: Instance[]; city?: CityHeroInstance[] }) {
  return (
    <div data-stories="spectra-table">
      {instances.map((i) => {
        const parts = i.iso2.split(":");
        const isCity = parts[0] === "city";
        const [iso2, side] = isCity ? [parts[1], parts[2]] : parts;
        const cityT = isCity ? buildCityCharacterTables(iso2) : null;
        const t = isCity ? (cityT ?? { state: null, people: null }) : buildCharacterTables(iso2);
        const d = side === "people" ? t.people : t.state;
        const el = d ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 520 }}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{side === "people" ? COPY.character.people.kicker : COPY.character.state.kicker}, {isCity ? cityT?.name ?? iso2 : nameOf(iso2)}</div>
            <SpectraTable rows={d.rows} dot={d.dot} foot={d.foot} />
          </div>
        ) : null;
        return <Story kind="spectra-table" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
      {city.map((c) => {
        const r = buildCityQuickReads(c.seed);
        const el = r ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 347 }}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{COPY.cityReads.kicker}, {String(c.seed?.meta?.city ?? c.slug)}</div>
            <SpectraTable rows={r.rows} scale="body" foot={r.foot} />
          </div>
        ) : null;
        return <Story kind="spectra-table" key={`${c.slug}:reads`} iso2={`${c.slug}:reads`} why={c.why}>{el}</Story>;
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
  return out;
}

export function NoteListStories({ instances = pickNoteListInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="note-list">
      {instances.map((i) => {
        const [iso2, form] = i.iso2.split(":");
        const wide = form === "wide";
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
  return out;
}

/** The city termini (run 19): one city with ranked districts (the district named as the first door) and one without (every district), from the loaded seeds. */
export function pickCityCloseInstances(cities: CityHeroInstance[]): CityHeroInstance[] {
  const out: CityHeroInstance[] = [];
  const ranked = cities.find((c) => (c.seed?.where_to_trade?.list?.length ?? 0) > 0 && buildCityCloseDoors(c.seed).length > 0);
  if (ranked) out.push({ ...ranked, why: "the lightest-rent district named as the first door" });
  const plain = cities.find((c) => c !== ranked && buildCityCloseDoors(c.seed).length > 0);
  if (plain) out.push({ ...plain, why: "no districts ranked, the door to every district" });
  return out;
}
export function TerminusStories({ instances = pickTerminusInstances(), city = [] }: { instances?: Instance[]; city?: CityHeroInstance[] }) {
  return (
    <div data-stories="terminus">
      {instances.map((i) => {
        const doors = buildCloseDoors(i.iso2);
        const el = doors.length ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 1072 }}>
            <Terminus kicker={`${COPY.close.kicker}, ${nameOf(i.iso2)}`} doors={doors} />
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
        const el = d ? (
          <div className="rounded-[14px] border border-[var(--c-border)] p-5" style={{ maxWidth: 347 }}>
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
  return out;
}

/** The country seats as the page draws them (country-view.tsx `Glance`, `WorldSeat` and `RunningCosts` with a cell to draw): opener, grid, the withheld line, the basis, the foot. The same markup, so the story measures the card a reader meets. */
function KvSeatStory({ id, icon, kicker, sample, cells, withheld, basis, foot }: { id: string; icon: "scorecard" | "vs-world" | "cost-breakdown"; kicker: string; sample: boolean; cells: React.ComponentProps<typeof KvGrid>["cells"]; withheld: string | null; basis: string | null; foot: string | null }) {
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

export function KvGridStories({ instances = pickKvGridInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="kv-grid">
      {instances.map((i) => {
        const [iso2, form] = i.iso2.split(":");
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

export function IncomeBreakdownStories({ instances = pickIncomeBreakdownInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="income-breakdown">
      {instances.map((i) => {
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
  ];
}

export function BentoBandStories({ instances = pickBentoBandInstances(), city = [] }: { instances?: Instance[]; city?: CityHeroInstance[] }) {
  const london = city.find((c) => c.slug === "london") ?? city[0];
  const setup = buildSetupRows("GB");
  const lightest = [...setup].sort((a, b) => (a.complexity_1_5 ?? 9) - (b.complexity_1_5 ?? 9))[0];
  const heroCells = buildHeroFacts("GB").cells;
  const answer = buildHeroFacts("GB").answer;
  const salesTax = heroCells.find((c) => c.key === "sales-tax");
  const payroll = heroCells.find((c) => c.key === "payroll");
  const notes = buildLocalsNotes("GB");
  const premises = buildPremisesStrip("GB");
  const people = london ? buildCityCharacterTables(london.slug)?.people : null;
  const typical = london ? buildCityCustomersStrip(london.seed)?.marks.find((m) => m.key === "typical") : null;
  const tradesPart = london ? (london.seed?.trades_here?.list?.length ?? 0) : 0;

  const cluster = (key: string): { cols: 2 | 3; cells: BentoCell[] } | null => {
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
      {instances.map((i) => {
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
  return out;
}

export function BentoMetricStories({ instances = pickBentoMetricInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="bento-metric">
      {instances.map((i) => {
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

export function MarkListStories({ instances = pickMarkListInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="mark-list">
      {instances.map((i) => {
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

/* THE DRAWN BLOCKED SEATS (MODEL.md 8.2, `07 workforce` and `11 easiest`;
   plan step 31, 2026-09-17). Two stories, both on GB, keyed "GB:workforce" and
   "GB:easiest", because the seat's words are the same on every country (a seat
   holds no figure, so there is no data-poor case and no extreme name): what
   varies is only which block it holds. Drawn at the width its seat takes on
   the page (520 for 07's half of a 1-1, 347 for 11's third of a 2-1), so the
   line's wrap is the page's. */
const BLOCKED_SEAT_STORIES: Record<string, { icon: "staffing-rota" | "where-it-pays"; kicker: string; line: string; foot: string; maxWidth: number }> = {
  "GB:workforce": { icon: "staffing-rota", ...COPY.blocked.workforce, maxWidth: 520 },
  "GB:easiest": { icon: "where-it-pays", ...COPY.blocked.easiest, maxWidth: 347 },
};
export function pickBlockedSeatInstances(): Instance[] {
  return [
    { iso2: "GB:workforce", why: "block 07, the seat beside what staff cost; items 40 and 17 not gathered" },
    { iso2: "GB:easiest", why: "block 11, the seat beside the footing; item 8's addendum not gathered" },
  ];
}
export function BlockedSeatStories({ instances = pickBlockedSeatInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="blocked-seat">
      {instances.map((i) => {
        const cfg = BLOCKED_SEAT_STORIES[i.iso2];
        const el = cfg ? (
          <div style={{ maxWidth: cfg.maxWidth }}>
            <BlockedSeat id={`seat-${i.iso2.split(":")[1]}`} icon={cfg.icon} kicker={cfg.kicker} line={cfg.line} foot={cfg.foot} />
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
        const el = f ? <AnswerCard id={`city-${i.slug}`} name={f.name} iso2={f.iso2} image={f.image} subtitle={f.subtitle} answer={f.answer} cells={f.cells} tone="ink" foot={f.foot} /> : null;
        return <Story kind="city-hero" key={i.slug} iso2={i.slug} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The city verdict card's instances (city:verdict, run 23): the city with ranked districts, and one with none, which self-omits. */
export function pickCityVerdictInstances(cities: CityHeroInstance[]): CityHeroInstance[] {
  const out: CityHeroInstance[] = [];
  const ranked = cities.find((c) => cityVerdictFacts(c.seed));
  if (ranked) out.push({ ...ranked, why: `the lightest rent load among ${cityVerdictFacts(ranked.seed)!.districts} ranked districts` });
  const none = cities.find((c) => c !== ranked && !cityVerdictFacts(c.seed));
  if (none) out.push({ ...none, why: "self-omits: no ranked districts" });
  return out;
}
export function CityVerdictStories({ instances }: { instances: CityHeroInstance[] }) {
  return (
    <div data-stories="city-verdict">
      {instances.map((i) => {
        const f = cityVerdictFacts(i.seed);
        const el = f ? <AnswerCard id={`verdict-${i.slug}`} level="section" icon={f.icon} name={f.kicker} subtitle={null} answer={f.answer} cells={f.cells} tone="accent" /> : null;
        return <Story kind="city-verdict" key={i.slug} iso2={i.slug} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/* THE INDEX (sys:stories-index, the build loop's run 21, 2026-09-06): one
   picker for every archetype's instance set, shared by the harness sheet and
   the dev page so the two never differ, and a table at the top of both that
   lists every archetype, its instance keys and the reason each was picked,
   each key a link to its story's section by id. Outside any stories wrapper,
   so the checker does not read it as a story. */
export function pickAllInstances(cityHero: CityHeroInstance[]): Record<string, Instance[]> {
  const cityStrips = pickCityStripInstances(cityHero);
  const cityReads = pickCityReadsInstances(cityHero);
  const cityCloses = pickCityCloseInstances(cityHero);
  return {
    "answer-card": pickAnswerCardInstances(),
    "ranked-bars": [...pickRankedBarsInstances(), ...pickCityDistrictInstances(cityHero).map((c) => ({ iso2: `${c.slug}:districts`, why: c.why }))],
    "compare-table": [...pickCompareTableInstances(), ...pickCityPeerInstances(cityHero).map((c) => ({ iso2: `${c.slug}:peers`, why: c.why }))],
    "card-pager": pickCardPagerInstances(),
    "city-cards": pickCityCardsInstances(),
    "tiers-table": pickTiersTableInstances(),
    "range-strip": [...pickRangeStripInstances(), ...cityStrips.map((c) => ({ iso2: cityStripKey(c), why: c.why }))],
    "spectra-table": [...pickSpectraTableInstances(), ...cityReads.map((c) => ({ iso2: `${c.slug}:reads`, why: c.why }))],
    "note-list": pickNoteListInstances(),
    "terminus": [...pickTerminusInstances(), ...cityCloses.map((c) => ({ iso2: `${c.slug}:close`, why: c.why }))],
    "pay-bars": pickPayBarsInstances(),
    "kv-grid": pickKvGridInstances(),
    "detail-panel": pickDetailPanelInstances(),
    "income-breakdown": pickIncomeBreakdownInstances(),
    "bento-band": pickBentoBandInstances(),
    "bento-metric": pickBentoMetricInstances(),
    "mark-list": pickMarkListInstances(),
    "blocked-seat": pickBlockedSeatInstances(),
    "city-hero": cityHero.map((c) => ({ iso2: c.slug, why: c.why })),
    "city-verdict": pickCityVerdictInstances(cityHero).map((c) => ({ iso2: c.slug, why: c.why })),
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
