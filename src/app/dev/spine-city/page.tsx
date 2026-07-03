/**
 * City page , SPINE rebuild, publish-ready. Leg 1, brought to the masterplan's
 * publish bar and aligned to the just-finished cell flagship: answer-first hero +
 * a CITY-own verdict masthead (the district re-rank thesis carried by the London
 * owner-keep baseline figure; the trade x district pick lives in ch05 + the close),
 * the money story elevated, an honest kept-vs-spent split (no fabricated cost blocks),
 * the district
 * list + real map merged into one hover-linked "Where to trade" section, progressive
 * disclosure creating the free/Pro seam, honest baselines, rationed terracotta,
 * count-up + hover motion. Reads a London seed (page-data/cities/GB-london.json).
 *
 * As-built chart dictionary (perceptual idiom census, cap 2 each):
 *   dot-on-a-track, per-row markers on independent tracks: EaseScale (CityLenses
 *     word-anchored verdict) x1, EaseScale (CityRisks severity) x1 = 2 (at the cap).
 *   shared-axis position strip (all markers on ONE axis, a distinct sub-idiom):
 *     CommercialSpace peer rent strip x1.
 *   horizontal length, split by sub-idiom (<=2 per chapter): ranked leaderboard
 *     (TopTrades) x1; single 100%-split bar (MarginKept kept-vs-spent) x1; DIVERGENT-
 *     from-baseline keep bars (WhereToTrade, its own chapter) x1. MarginRail + the
 *     EasiestTrades list are figures-only (no bars), so they do not add a length idiom.
 *   floored-monthly-bars (time-on-axis, ZERO baseline): DemandCalendar x1.
 *   distribution-curve (density + ticks): IncomeCurve x1 (appears nowhere else).
 *   position-strip (categorical peers on one axis): CommercialSpace peer strip x1.
 *   timeline (position-in-time): FirstYear x1.
 *   comparison-table: CityPeers x1.
 *   map (geographic position): WhereToTrade x1.
 * REMOVED forms: the 5-lens grey bar list (-> EaseScale word-anchored scorecard),
 *   the 3-bar income ladder (-> distribution curve), the peer Spark (-> position
 *   strip), the fabricated waterfall cost split (-> honest kept-vs-spent), the
 *   Gauge in EasiestTrades (-> plain figure + list), the VisitorSplit standalone
 *   card (-> folded into DemandSize), the standalone Neighborhoods conveyor +
 *   the intervening Movement + separate map (-> merged WhereToTrade).
 * Width tiers per WI-4; the money + where-to-trade chapters carry the weight.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { Fig, Ico, Stat, Spark, Meter, Movement, Box, Head, Rail, EaseScale, Full, WideRail, Even, TERRA, TRACK } from "@/components/spine/kit";
import { CompareTable, type CompareEntity, type CompareRow, LockVeil } from "@/components/spine/kit-index";
import { AtlasIcon } from "@/components/brand/icons";
import { CityHero } from "./masthead";
import { CityStyles } from "./motion";
import { IncomeCurve, OwnerRunway, MarginKept } from "./chapters";
import { WhereToTrade } from "./where-to-trade";
import { FirstYearTimeline } from "./first-year";

export const dynamic = "force-static";
const C: any = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/cities/GB-london.json"), "utf8"));

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const k = (v: number) => "$" + Math.round((v || 0) / 1000) + "K";

/* ================= CH1 , THE VERDICT ================= */
/* CityVerdict masthead , WI-3 brief:
 * decision: is LONDON worth it, and what decides your keep. This is the CITY's own
 * verdict, not the trade layer's , the thesis is the district re-rank ("where you
 * trade decides what you keep"), carried by the city owner-keep BASELINE figure.
 * The specific trade x district pick (hair & beauty in Brixton) lives in ch05 + the
 * close, so the hero states a city truth, not an industry answer.
 * Number: the London owner-keep baseline % (LARGEST on the page). focal: that figure.
 * width: Full. terracotta: the keep figure + kicker + catch icon only.
 * Prose from seed.verdict: the H2 carries the thesis, the body renders verdict.why
 * (NOT where_to_trade.read, which belongs to ch02 alone , no verbatim repeats). */
function CityVerdict({ d }: { d: any }) {
  const v = d.verdict ?? {};
  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--terra-border)] bg-[var(--c-card)]">
      <div className="p-5 md:p-6">
        <div className="mb-1.5 flex items-center gap-2"><Ico id="verdict" tone="terra" /><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--terra-text)]">{v.kicker}</span></div>
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2rem]">Where you trade decides what you keep</h2>
            <p className="mt-2 max-w-prose text-[13.5px] leading-snug text-[var(--c-ink2)]">{v.why}</p>
            {v.catch ? (
              <p className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2 text-[12.5px] leading-snug text-[var(--c-ink2)]">
                <span className="mt-0.5 shrink-0 text-[var(--terra-text)]"><AtlasIcon id="honest-take" size={14} /></span>
                <span><span className="font-semibold text-[var(--c-ink)]">The catch. </span>{v.catch}</span>
              </p>
            ) : null}
          </div>
          <div>
            <Stat size="focal" accent value={`${v.keep_pct}%`} label="best trade keeps" sub="of sales, the London baseline" />
          </div>
        </div>
      </div>
      {/* grey strip: the districts that keep the most vs least of a pound (the re-rank,
          in miniature). City-level, not trade-level , the trade pick moves to ch05 + close. */}
      <div className="grid grid-cols-3 gap-px border-t border-[var(--terra-border)]" style={{ background: "var(--terra)" }}>
        {stripReads(d).map((s) => (
          <div key={s.label} className="bg-[var(--c-card)] px-3 py-2.5"><Fig className="text-[15px] text-[var(--c-ink)]">{s.value}</Fig><div className="text-[9px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{s.label}</div></div>
        ))}
      </div>
    </div>
  );
}

/* the hero's grey strip reads: the district keep spread (best keeper, city baseline,
 * loudest-revenue name), so the strip reinforces the re-rank thesis at city level. */
function stripReads(d: any): Array<{ value: string; label: string }> {
  const list: any[] = d.where_to_trade?.list ?? [];
  const withKeep = list.map((x) => ({ ...x, keep: Math.round(((1 + x.rev_vs_city_pct / 100) / x.rent_mult) * 100) }));
  const best = withKeep.slice().sort((a, b) => b.keep - a.keep)[0];
  const revLeader = list.reduce((a, b) => (b.rev_vs_city_pct > a.rev_vs_city_pct ? b : a), list[0]);
  return [
    { value: best ? `${best.name} ${best.keep}` : "", label: "keeps the most, index" },
    { value: "100", label: "city average" },
    { value: revLeader ? revLeader.name : "", label: "takes the most revenue" },
  ];
}

/* CityLenses , WI-3 brief:
 * decision: is this city worth it. Number: five word-anchored reads on one scale + a headline verdict.
 * focal: the verdict sentence + the EaseScale markers. width: WideRail. terracotta: the scale markers only.
 * No shared-magnitude bars (the five lenses are not one axis). Prose from seed.lenses. */
function CityLenses({ d }: { d: any }) {
  const o = d.lenses ?? {};
  const rows: Array<[string, number, string, string?]> = (o.scales ?? []).map((s: any) => [s.label, s.pos, s.word, s.sub]);
  return (
    <WideRail>
      <Box className="citytop">
        <Head icon="gut-check">The city, in five reads</Head>
        <EaseScale rows={rows} />
      </Box>
      <Box className="citytop">
        <Rail icon="verdict" kicker="The one-line read" verdict={o.headline} />
        <p className="text-[12.5px] leading-snug text-[var(--c-ink2)]">{o.read}</p>
      </Box>
    </WideRail>
  );
}

/* ================= CH2 , WHAT IT COSTS HERE ================= */
/* CommercialSpace , WI-3 brief:
 * decision: how heavy the space cost is, against peers. Number: the rent-pressure read + London's rank.
 * focal: the rent-pressure meter. width: WideRail. terracotta: the meter fill + London's strip marker.
 * Peers shown as a POSITION strip (one axis), not a sparkline (they are unordered). Prose from seed.space. */
function CommercialSpace({ d }: { d: any }) {
  const s = d.space ?? {};
  const peers = (d.peers?.list ?? []).slice();
  const idxVals = peers.map((p: any) => p.rent_index || 0);
  const lo = Math.min(...idxVals), hi = Math.max(...idxVals), span = Math.max(1, hi - lo);
  const terms: Array<[string, string]> = [[`${s.deposit_months} mo`, "deposit up front"], [`${s.lease_years_typical}`, "typical lease, years"], [`${s.rent_free_months} mo`, "rent-free fit-out"]];
  return (
    <WideRail>
      <Box className="citytop">
        <Rail icon="commercial-rent" kicker="What commercial space costs" verdict={s.read} />
        <div className="mb-1.5 flex items-baseline gap-2"><span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Rent pressure</span><Fig className="text-[20px] text-[var(--terra-text)]">{s.rent_pressure_0_100}<span className="text-[12px] text-[var(--c-muted)]">/100</span></Fig></div>
        <Meter value={s.rent_pressure_0_100} left="Cheap" right="Expensive" />
        {/* peers as a position strip: one axis, London marked */}
        <div className="mt-4 border-t border-[var(--c-border)] pt-3">
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Rent index vs peer cities</div>
          <div className="relative h-8" role="img" aria-label="London's rent index against peer cities on one axis">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--c-line-strong)]" />
            {peers.map((p: any) => {
              const x = ((p.rent_index - lo) / span) * 100;
              const home = p.home;
              return (
                <span key={p.name} className="absolute -translate-x-1/2" style={{ left: `${x}%`, top: "50%" }}>
                  <span className="block h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: home ? TERRA : "#c8c8c6", boxShadow: "0 0 0 1px #e3e3e3" }} title={`${p.name} ${p.rent_index}`} />
                  <span className={`absolute left-1/2 mt-1 -translate-x-1/2 whitespace-nowrap text-[9.5px] ${home ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{p.name}</span>
                </span>
              );
            })}
          </div>
          <div className="mt-6 text-[11px] text-[var(--c-muted)]">{s.peer_read}</div>
        </div>
      </Box>
      <Box className="citytop">
        <Rail kicker="The lease terms" verdict="Landlords want a long commitment and money down; a short rent-free window softens the fit-out." />
        <div className="divide-y divide-[var(--c-border)]">{terms.map(([v, l]) => (
          <div key={l} className="flex items-baseline justify-between gap-3 py-2"><span className="text-[12px] text-[var(--c-ink2)]">{l}</span><Fig className="text-[15px] text-[var(--c-ink)]">{v}</Fig></div>
        ))}</div>
        <div className="mt-2 text-[11px] text-[var(--c-muted)]">{s.terms_note}</div>
      </Box>
    </WideRail>
  );
}

/* ================= CH3 , YOUR CUSTOMERS ================= */
/* DemandSize , WI-3 brief:
 * decision: is the market big enough (it is). Number: consumer spend + the resident/visitor split, inline.
 * focal: the spend figure. width: WideRail. terracotta: the spend figure only. VisitorSplit folded in here.
 * Prose from seed.demand. */
function DemandSize({ d }: { d: any }) {
  const o = d.demand ?? {};
  const segs: Array<[string, number, string]> = [["Residents", o.resident_pct, "#c8c8c6"], ["Visitors", o.visitor_pct, "#8f8f8f"]];
  return (
    <WideRail>
      <Box className="citytop">
        <Rail icon="market-size" kicker="How big the spending pool is" verdict={o.read} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Fig className="text-3xl text-[var(--terra-text)]">${o.consumer_spend_usd_bn}B</Fig>
            <span className="text-[13px] text-[var(--c-ink2)]">a year, about <Fig className="text-[var(--c-ink)]">${Math.round((o.spend_per_capita_usd || 0) / 1000)}K</Fig> per resident, up <Fig className="text-[var(--c-ink)]">{o.growth_pct_yoy}%</Fig> on the year.</span>
          </div>
          {/* the multi-year trajectory: a genuine second datapoint (trend, not the seasonal swing below) */}
          {(o.trend_index?.length ?? 0) >= 2 ? (
            <div className="flex items-center gap-2">
              <Spark values={o.trend_index} />
              <span className="text-[10.5px] leading-tight text-[var(--c-muted)]">spend<br />trend</span>
            </div>
          ) : null}
        </div>
        {/* resident/visitor split, folded in as an inline share bar (was a standalone card) */}
        <div className="mt-4 border-t border-[var(--c-border)] pt-3">
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Who spends it</div>
          <div className="flex h-6 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Residents ${o.resident_pct}%, visitors ${o.visitor_pct}%`}>{segs.map(([n, pct, bg]) => <div key={n} className="flex h-full items-center justify-center" style={{ width: `${pct}%`, background: bg }} title={`${n} ${pct}%`}><span className="fig text-[11px] font-semibold text-white">{n} {pct}%</span></div>)}</div>
          <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">Resident money is the steady base; visitor money is seasonal and patchy by area.</div>
        </div>
      </Box>
      <Box className="citytop">
        <Rail icon="seasonality" kicker="Busy months and quiet months" verdict={d.demand_calendar?.read} />
        <DemandCalendar d={d} />
      </Box>
    </WideRail>
  );
}

/* DemandCalendar , WI-4 brief:
 * decision: how much the year swings. Number: the peak month. focal: 12 month bars, ZERO baseline.
 * terracotta: the peak-month bar only. Honest baseline from 0 (no artificial floor). */
function DemandCalendar({ d }: { d: any }) {
  const m: number[] = d.demand_calendar?.months ?? []; const max = Math.max(1, ...m); const peak = m.indexOf(max);
  return (
    <>
      <div className="flex items-end justify-between gap-1.5" style={{ height: 92 }} role="img" aria-label="Monthly demand across the year, baselined from zero">
        {m.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1" style={{ height: "100%" }}>
            <div className="w-full rounded-t" style={{ height: `${(v / max) * 100}%`, background: i === peak ? TERRA : "#dcd6d1" }} title={`${v}`} />
            <span className={`text-[9px] ${i === peak ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>{MONTHS[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">Indexed demand, baselined from zero: the swing is real but gentle.</div>
    </>
  );
}

/* ================= CH4 , TRADES AND RIVALS ================= */
/* TopTrades , WI-3 brief:
 * decision: what trades keep the most. Number: the ranked take-home leaderboard.
 * focal: the leaderboard, only #1 terracotta. width: Full. terracotta: the top take-home bar only.
 * Prose from seed.trades. */
function TopTrades({ d }: { d: any }) {
  const arr = (d.trades?.list ?? []).slice().sort((a: any, b: any) => b.take_home_usd - a.take_home_usd);
  const max = Math.max(1, ...arr.map((t: any) => t.take_home_usd));
  const word = (s: number) => (s > 70 ? "Crowded" : s > 50 ? "Busy" : "Room");
  return (
    <Box className="citytop">
      <Rail icon="owner-keeps" kicker="What trades keep the most here" verdict={d.trades?.read} />
      <div className="space-y-2.5">{arr.map((t: any, i: number) => {
        const lead = i === 0;
        return (
          <a key={t.slug} href="/dev/spine-cell" className="hov -mx-2 grid grid-cols-[150px_1fr_84px_64px] items-center gap-3 rounded-md px-2 py-1.5">
            <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink)]">{t.name}{t.local === false ? <span className="ml-1.5 text-[9px] uppercase tracking-wide text-[var(--c-muted)]">online</span> : null}</span>
            <div className="h-2.5 min-w-0 overflow-hidden rounded-full" style={{ background: TRACK }}><div className="h-full rounded-full" style={{ width: `${(t.take_home_usd / max) * 100}%`, background: lead ? TERRA : "#c8c8c6" }} /></div>
            <Fig className={`text-right text-[14px] ${lead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{k(t.take_home_usd)}</Fig>
            <span className="text-right text-[11px] text-[var(--c-ink2)]">{word(t.saturation_0_100)}</span>
          </a>
        );
      })}</div>
      <div className="mt-2 text-[11px] text-[var(--c-muted)]">Owner take-home a year, with how crowded the trade is. Tap a trade for the full city economics.</div>
    </Box>
  );
}

/* MarginRail , the per-trade net-margin list that sits beside MarginKept (WideRail right).
 * Support only: no terracotta except the local leader (which IS the MarginKept subject). */
function MarginRail({ d }: { d: any }) {
  const arr = (d.trades?.list ?? []).slice();
  const local = arr.filter((x: any) => x.local !== false);
  const lead = local.slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0))[0] ?? {};
  const byMargin = arr.slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0));
  const maxMargin = Math.max(1, ...byMargin.map((t: any) => t.net_margin_pct ?? 0));
  return (
    <Box className="citytop md:flex-[2]">
      <Rail kicker="Net margin by trade" verdict="A service trade with no stock keeps the most; the food trades keep the least." />
      {/* inline length column (was a bare number list): neutral bars, terra only on the local leader */}
      <div className="divide-y divide-[var(--c-border)]">{byMargin.map((t: any) => {
        const isLead = t.slug === lead.slug;
        const pct = Math.max(0, Number(t.net_margin_pct ?? 0));
        return (
          <div key={t.slug} className="hov -mx-2 grid grid-cols-[1fr_64px_38px] items-center gap-3 rounded-md px-2 py-1.5">
            <span className={`min-w-0 truncate text-[12px] ${isLead ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{t.name}</span>
            <div className="h-2 overflow-hidden rounded-full" style={{ background: TRACK }}><div className="h-full rounded-full" style={{ width: `${(pct / maxMargin) * 100}%`, background: isLead ? TERRA : "#c8c8c6" }} role="img" aria-label={`${t.name}: ${pct} percent net margin`} /></div>
            <Fig className={`text-right text-[13px] ${isLead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{pct}%</Fig>
          </div>
        );
      })}</div>
    </Box>
  );
}

/* EasiestTrades , WI-3 brief:
 * decision: the lowest bar to entry, and its cost. Number: the easiest trade + cost to open.
 * focal: the easiest trade's cost figure. width: WideRail. terracotta: the lead cost figure only.
 * No Gauge (a scalar does not want a dial). Prose from seed.trades.easiest_read. */
function EasiestTrades({ d }: { d: any }) {
  const arr = (d.trades?.list ?? []).slice().filter((x: any) => x.local !== false).sort((a: any, b: any) => b.break_in_0_100 - a.break_in_0_100);
  const lead = arr[0]; const rest = arr.slice(1, 6);
  return (
    <WideRail>
      <Box className="citytop">
        <Rail icon="startup-cost" tone="terra" kicker="Lowest bar to entry" verdict={d.trades?.easiest_read} />
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="text-[15px] font-semibold text-[var(--c-ink)]">{lead?.name}</span>
          <Fig className="text-[26px] text-[var(--terra-text)]">{k(lead?.cost_to_open_usd ?? 0)}</Fig>
          <span className="text-[12px] text-[var(--c-ink2)]">to open, the gentlest way in.</span>
        </div>
      </Box>
      <Box className="citytop">
        <Head>Next-easiest, and the cost to open</Head>
        {/* figures only (no bars) so the money chapter keeps the leaderboard as its one ranked bar-list */}
        <div className="divide-y divide-[var(--c-border)]">{rest.map((t: any) => (
          <div key={t.slug} className="hov -mx-2 grid grid-cols-[1fr_auto_auto] items-baseline gap-4 rounded-md px-2 py-2">
            <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink)]">{t.name}</span>
            <Fig className="text-right text-[12px] text-[var(--c-ink2)]">{t.break_in_0_100}<span className="text-[9px] text-[var(--c-muted)]">/100 ease</span></Fig>
            <Fig className="text-right text-[13px] text-[var(--c-ink)]">{k(t.cost_to_open_usd)}</Fig>
          </div>
        ))}</div>
        <div className="mt-2 text-[11px] text-[var(--c-muted)]">Ease of entry out of 100, and the typical cost to open.</div>
      </Box>
    </WideRail>
  );
}

/* ================= CH5 , RUNNING IT ================= */
/* FirstYear , WI-5 brief:
 * decision: when the year stops bleeding. Number: the break-even week. focal: the timeline.
 * width: Full. terracotta: the break-even node + the profit lane only.
 * Uses the page-local FirstYearTimeline (not the kit Timeline): node labels above
 * the axis, phases in translucent lanes below , concurrent Fit-out + Licensing get
 * separate lanes, and no node text can touch a phase caption. Prose from seed. */
function FirstYear({ d }: { d: any }) {
  const f = d.first_year ?? {};
  if (!f.nodes?.length) return null;
  const nodes = f.nodes.map((n: any) => ({ at: n.at, label: n.label, sub: n.sub, kind: n.kind === "breakeven" ? "breakeven" : "normal" }));
  const phases = (f.phases ?? []).map((p: any) => [p[0], p[1], p[2]] as [string, number, number]);
  return (
    <>
      <Rail icon="first-year" kicker="Your first year" verdict={f.read} />
      <FirstYearTimeline span={f.span} unit={f.unit} phases={phases} nodes={nodes} startLabel={f.start_label} />
    </>
  );
}

/* CityRisks , WI-3 brief:
 * decision: what to plan around. Number: the four risk severities on one scale.
 * focal: the leading risk. width: WideRail. terracotta: the severity markers (EaseScale) only.
 * Counterweights behind a disclosure. Prose from seed.risks. */
function CityRisks({ d }: { d: any }) {
  const r = d.risks ?? {};
  const rows: Array<[string, number, string, string?]> = (r.list ?? []).map((x: any) => [x.label, Number(x.severity_0_100 ?? 0), x.word, x.who]);
  const top = (r.list ?? []).slice().sort((a: any, b: any) => (b.severity_0_100 ?? 0) - (a.severity_0_100 ?? 0))[0] ?? {};
  return (
    <WideRail>
      <Box className="citytop">
        <Head icon="watch">What to watch here</Head>
        <EaseScale rows={rows} />
        <div className="mt-3 text-[11px] text-[var(--c-muted)]">Each marker is the severity of that risk in this market, left calm, right severe.</div>
      </Box>
      <Box className="citytop">
        <Rail icon="honest-take" tone="terra" kicker="The honest read" verdict={<><span className="text-[var(--terra-text)]">{top.label}</span> is the one to plan around; the rest are manageable with the right lease and reliefs.</>} />
        <p className="mb-2 text-[12px] leading-snug text-[var(--c-ink2)]">{r.read}</p>
        <details name="risks" className="group">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[12px] font-medium text-[var(--terra-text)]"><span className="text-base text-[var(--c-muted)] transition group-open:rotate-45 group-open:text-[var(--terra-text)]">+</span> See the counterweight for each</summary>
          <div className="mt-2 space-y-2.5 border-t border-[var(--c-border)] pt-2.5">{(r.list ?? []).map((x: any) => (
            <div key={x.label} className="flex gap-2.5">
              <span className="mt-0.5 text-[var(--terra-text)]">&#9656;</span>
              <span className="text-[12px] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{x.label}.</b> {x.counterweight}</span>
            </div>
          ))}</div>
        </details>
      </Box>
    </WideRail>
  );
}

/* CityCharacter , WI-3 brief:
 * decision: how the trading culture behaves, and what to do about it. Number: four leanings, each with an operator takeaway.
 * focal: the takeaways. width: Even half. terracotta: none (texture read; accent stays off).
 * FORM: a labelled leaning + takeaway LIST (not a dot-on-a-track), so it does not add a
 * third position-marker idiom (EaseScale already used x2 for lenses + risks). Prose from seed. */
function CityCharacter({ d }: { d: any }) {
  const c = d.character ?? {};
  const rows: any[] = c.texture ?? [];
  const leaning = (p: number, l: string, r: string) => (p >= 0.5 ? r : l);
  return (
    <Box className="citytop">
      <Rail icon="honest-take" kicker="The texture of doing business here" verdict={c.read} />
      <div className="divide-y divide-[var(--c-border)]">{rows.map((r: any, i: number) => (
        <div key={i} className="py-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{r.left_label} / {r.right_label}</span>
            <span className="text-[12.5px] font-semibold text-[var(--c-ink)]">{leaning(r.position_0_1 || 0, r.left_label, r.right_label)}</span>
          </div>
          <div className="mt-0.5 text-[11.5px] leading-tight text-[var(--c-ink2)]">{r.takeaway}</div>
        </div>
      ))}</div>
    </Box>
  );
}

function Locals({ d }: { d: any }) {
  const items = d.locals_intel ?? [];
  return (
    <Box className="citytop">
      <Head icon="locals-know">What locals know</Head>
      <div className="space-y-3">{items.map((it: any, i: number) => (
        <div key={i} className="flex gap-2.5"><span className="mt-0.5 text-[var(--terra-text)]">&#9656;</span><span className="text-[12.5px] leading-snug text-[var(--c-ink2)]"><b className="text-[var(--c-ink)]">{it.title}</b> {it.detail}</span></div>))}
      </div>
    </Box>
  );
}

/* ================= CH6 , THE CLOSE ================= */
/* CityPeers , WI-3 brief:
 * decision: how London stacks against its peers. Number: rent / income / spend / visitors, best in bold.
 * focal: the comparison table. width: Full. terracotta: best-in-row only. Shares/indices, no cross-geo USD.
 * Uses the canonical CompareTable. Prose from seed.peers.read. */
function CityPeers({ d }: { d: any }) {
  const rows: any[] = d.peers?.list ?? [];
  const entities: CompareEntity[] = rows.map((r) => ({ id: r.name, name: r.name, home: !!r.home }));
  const income = Object.fromEntries(rows.map((r) => [r.name, Math.round(r.median_income_usd / 1000)]));
  const compareRows: CompareRow[] = [
    { key: "rent", label: "Rent index", unit: "idx", higherIsBetter: false, values: Object.fromEntries(rows.map((r) => [r.name, r.rent_index])) },
    { key: "spend", label: "Consumer spend", unit: "idx", higherIsBetter: true, values: Object.fromEntries(rows.map((r) => [r.name, r.spend_index])) },
    { key: "income", label: "Median income", unit: "$K", higherIsBetter: true, values: income, display: Object.fromEntries(rows.map((r) => [r.name, `$${income[r.name]}K`])) },
    { key: "vis", label: "Visitors", unit: "M/yr", higherIsBetter: true, values: Object.fromEntries(rows.map((r) => [r.name, r.visitors_m])) },
  ];
  return (
    <Box className="citytop">
      <Rail icon="compare" kicker="How it compares, city by city" verdict={d.peers?.read} />
      <CompareTable entities={entities} rows={compareRows} caption="Best in each metric is bold. Shares and indices, compared like for like. The home city is tinted, never ranked." />
    </Box>
  );
}

/* Close , WI-3 brief:
 * decision: the single next move. Number: the best trade x best district recommendation.
 * focal: the recommendation tile + the Compare CTA. width: Full (a real hand-off, not a centered stub).
 * terracotta: the recommendation figures + the CTA. Pro teaser gated. */
function Close({ d }: { d: any }) {
  const v = d.verdict ?? {};
  // best district by keep index (mirrors WhereToTrade)
  const list: any[] = d.where_to_trade?.list ?? [];
  const bestDistrict = list.map((x) => ({ ...x, keep: Math.round(((1 + x.rev_vs_city_pct / 100) / x.rent_mult) * 100) })).sort((a, b) => b.keep - a.keep)[0];
  return (
    <Box className="citytop">
      <Head icon="bookmark">The pick, and where to take it</Head>
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-stretch">
        {/* the decision the whole page built toward */}
        <div className="rounded-[12px] border border-[var(--terra-border)] p-4" style={{ background: "linear-gradient(180deg,#ffffff,#fffaf8)" }}>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">The London pick</div>
          <div className="mt-1 text-[16px] font-semibold text-[var(--c-ink)]">{v.winner_trade?.replace(" keeps the most", "")}, in {bestDistrict?.name}</div>
          <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--c-ink2)]">The margin leader in the district that keeps the most of every pound. Start there, then check the trade's live economics.</p>
          <div className="mt-3 flex flex-wrap gap-4 border-t border-[var(--c-border)] pt-3">
            <div><Fig className="text-[18px] text-[var(--terra-text)]">{v.keep_pct}%</Fig><div className="text-[10px] uppercase tracking-wide text-[var(--c-muted)]">owner keeps</div></div>
            <div><Fig className="text-[18px] text-[var(--c-ink)]">{bestDistrict?.keep}</Fig><div className="text-[10px] uppercase tracking-wide text-[var(--c-muted)]">keep index</div></div>
          </div>
          <a href="/dev/spine-cell" className="mt-3 inline-flex text-[13px] font-semibold text-[var(--terra-text)] hover:underline">See the trade's live economics &#8594;</a>
        </div>
        {/* the Pro / compare hand-off */}
        <div className="flex flex-col justify-between gap-3">
          <div>
            <div className="text-[13.5px] text-[var(--c-ink)]">Set {d.meta?.city} beside up to three cities, side by side.</div>
            <a className="mt-2 inline-flex cursor-pointer rounded-full bg-[var(--c-ink)] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--terra-text)]">Open Compare</a>
          </div>
          {/* the veil sizes to its blurred children, and its centered overlay card
              (icon + headline + note + CTA) runs ~190px tall , so the teaser wrapper
              carries a min-height that fully contains the overlay. Without it the
              overflow-hidden veil clips the CTA (the page's final monetization moment). */}
          <LockVeil headline="The full London workbook" note="Every district by every trade, the real cost stack, and the owner-runway calculator." cta="Unlock with Pro">
            <div className="flex min-h-[220px] flex-col justify-evenly py-2">
              {(d.where_to_trade?.pro_teaser ?? []).map((t: string) => (
                <div key={t} className="text-[12px] text-[var(--c-ink2)]">{t}</div>
              ))}
            </div>
          </LockVeil>
        </div>
      </div>
    </Box>
  );
}

export default function SpineCityPage() {
  const d = C;
  const trades = d.trades?.list ?? [];
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <CityStyles />
      <CityHero d={d} />

      {/* The verdict , the CITY's own re-rank masthead leads (owner-keep baseline dominant), then the five-read scorecard. */}
      <CityVerdict d={d} />
      <Movement index="01" eyebrow="The verdict" heading="The read on London" icon="gut-check" />
      <CityLenses d={d} />

      {/* Where to trade , promoted high: the signature map + keep-ranked list, one section. */}
      <Movement index="02" eyebrow="Where to trade" heading="Where you keep the most" icon="best-areas" />
      <WhereToTrade d={d} trades={trades} />

      {/* What it costs , commercial space + the founder runway. */}
      <Movement index="03" eyebrow="What it costs here" heading="What space and life cost" icon="commercial-rent" />
      <div className="space-y-4">
        <CommercialSpace d={d} />
        <Even><OwnerRunway d={d} /><IncomeCurve d={d} /></Even>
      </div>

      {/* Your customers , demand size (with the resident/visitor split folded in) + seasonality. */}
      <Movement index="04" eyebrow="Your customers" heading="Who buys, and when" icon="spending-power" />
      <DemandSize d={d} />

      {/* Trades and rivals , the money chapter, weighted heaviest. */}
      <Movement index="05" eyebrow="Trades and rivals" heading="What to open, and what you keep" icon="owner-keeps" />
      <div className="space-y-4">
        <Full><TopTrades d={d} /></Full>
        <WideRail><MarginKept d={d} /><MarginRail d={d} /></WideRail>
        <EasiestTrades d={d} />
      </div>

      {/* Running it , the first-year timeline, risks, character and locals. */}
      <Movement index="06" eyebrow="Running it" heading="Through the first year, and what to watch" icon="first-year" />
      <div className="space-y-4">
        <Full><FirstYear d={d} /></Full>
        <CityRisks d={d} />
        <Even><CityCharacter d={d} /><Locals d={d} /></Even>
      </div>

      {/* The close , the peer comparison then the real hand-off. */}
      <Movement index="07" eyebrow="The close" heading="The next move" icon="bookmark" />
      <div className="space-y-4">
        <CityPeers d={d} />
        <Close d={d} />
      </div>
    </main>
  );
}
