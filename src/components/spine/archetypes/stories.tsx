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
import { RankedBars } from "./RankedBars";
import { CompareTable } from "./CompareTable";
import { CardPager } from "./CardPager";
import { buildCityCards } from "@/lib/spine/city_cards";
import { TiersTable } from "./TiersTable";
import { buildSetupRows, howToOpenDoor } from "@/lib/spine/setup_rows";

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

function Story({ iso2, why, children }: { iso2: string; why: string; children: React.ReactNode }) {
  return (
    <section data-story={iso2} className="mb-12">
      <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{iso2}, {why}</div>
      {children ?? <div data-self-omit="1" className="text-[length:var(--t-body)] text-[var(--c-muted)]">self-omits</div>}
    </section>
  );
}

export function AnswerCardStory({ facts, why }: { facts: HeroFacts; why: string }) {
  return (
    <Story iso2={facts.iso2} why={why}>
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
        return <Story key={i.iso2} iso2={i.iso2} why={i.why}>{el ? <div style={{ maxWidth: 624 }}>{el}</div> : null}</Story>;
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
        return <Story key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
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
        return <Story key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
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
        return <Story key={i.iso2} iso2={i.iso2} why={i.why}>{el}</Story>;
      })}
    </div>
  );
}
