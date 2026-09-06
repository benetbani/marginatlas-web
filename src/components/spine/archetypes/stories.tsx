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
import { buildPeerTable } from "@/lib/spine/peer_rows";
import { COPY } from "@/lib/spine/copy";
import { AnswerCard } from "./AnswerCard";
import { KvGrid } from "./KvGrid";
import { cityHeroFacts, type CityHeroInstance } from "@/lib/spine/city_hero_facts";
import { RankedBars } from "./RankedBars";
import { CompareTable } from "./CompareTable";
import { CardPager } from "./CardPager";
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
import { usd } from "@/components/spine/kit";

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

export function RankedBarsStories({ instances = pickRankedBarsInstances() }: { instances?: Instance[] }) {
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
    </div>
  );
}

export function CompareTableStories({ instances = pickCompareTableInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="compare-table">
      {instances.map((i) => {
        const t = buildPeerTable(i.iso2);
        const el = t ? <CompareTable id={`peers-${i.iso2.toLowerCase()}`} kicker={`${COPY.peers.kicker}, ${nameOf(i.iso2)}`} icon="benchmark" rows={t.rows} columns={t.columns} caveat={t.caveat} /> : null;
        return <Story kind="compare-table" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
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
            <PayBars rows={d.rows} worldMax={d.worldMax} withheld={d.withheld} fmt={usd} edgeLabel={(name, figure) => COPY.pay.edge.replace("{name}", name).replace("{figure}", figure)} />
          </div>
        ) : null;
        return <Story kind="pay-bars" key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}

/** The instance set for the key-value grid on its own: the exemplar's cells in a wide card ("GB:wide") and a narrow one ("GB"), plus the country with the fewest cells, so the grid's columns are measured by its own width. */
export function pickKvGridInstances(): Instance[] {
  const out: Instance[] = [];
  const seen = new Set<string>();
  const take = (key: string, why: string) => { if (!seen.has(key)) { seen.add(key); out.push({ iso2: key, why }); } };
  take("GB:wide", "the exemplar's cells in a wide card, the groups side by side");
  take("GB", "the same cells in a narrow card, the groups stacked");
  const facts = codes().map((c) => ({ c, f: buildHeroFacts(c) })).filter((x) => x.f.cells.length > 0);
  const fewest = [...facts].sort((a, b) => a.f.cells.length - b.f.cells.length)[0]; if (fewest) take(`${fewest.c}:wide`, `the fewest cells, ${fewest.f.cells.length}, in a wide card`);
  return out;
}

export function KvGridStories({ instances = pickKvGridInstances() }: { instances?: Instance[] }) {
  return (
    <div data-stories="kv-grid">
      {instances.map((i) => {
        const [iso2, form] = i.iso2.split(":");
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
    "ranked-bars": pickRankedBarsInstances(),
    "compare-table": pickCompareTableInstances(),
    "card-pager": pickCardPagerInstances(),
    "tiers-table": pickTiersTableInstances(),
    "range-strip": [...pickRangeStripInstances(), ...cityStrips.map((c) => ({ iso2: cityStripKey(c), why: c.why }))],
    "spectra-table": [...pickSpectraTableInstances(), ...cityReads.map((c) => ({ iso2: `${c.slug}:reads`, why: c.why }))],
    "note-list": pickNoteListInstances(),
    "terminus": [...pickTerminusInstances(), ...cityCloses.map((c) => ({ iso2: `${c.slug}:close`, why: c.why }))],
    "pay-bars": pickPayBarsInstances(),
    "kv-grid": pickKvGridInstances(),
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
