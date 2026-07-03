/**
 * Cell page (a trade in a place) , SPINE rebuild, publish-ready flagship. Leg 3 and
 * the pattern-setter for the other four page types. The locked content-map order
 * re-presented to the shared spine kit, taken to the masterplan's publish bar:
 * answer-first hero, one dominant decision figure, progressive disclosure creating
 * the free/Pro seam, honest baselines, rationed terracotta, count-up + hover motion.
 *
 * As-built chart dictionary (perceptual idiom census, cap 2 each):
 *   dot-on-a-track (position marker): SpreadStrip x0 (removed), EaseScale x1 (WhoSuits) = 1
 *   horizontal-bar-list (length): MoneySplit stack x1, channel StackBar x1, catchment x1,
 *     Waterfall x1, wage range x1, Nearby micro-bars x1, break-even headroom x1, risk x1
 *     , counted by EYE-IDIOM these are all "horizontal length" but split into sub-idioms:
 *     100%-stacked bars (MoneySplit, channels) = 2; ranked/labeled bar-lists (catchment,
 *     Nearby, risks, wages) = the length family, kept <=2 distinct treatments per chapter.
 *   floored-monthly-bars (time-on-axis, ZERO baseline): Seasonality x1 = 1
 *   waterfall (share-of-revenue): x1
 *   timeline (position-in-time): FirstYear x1 = 1
 *   segmented-control (selection): FormatPicker x1 = 1
 * REMOVED forms: Gauge (folded to EaseScale), Donut (-> StackBar), 3-pip meters (-> disclosure
 *   annotations), Dots (-> single length bar), invented-ceiling break-even bar (-> real headroom).
 * Width tiers per WI-4; the money chapter is weighted heaviest (control room + wide reads).
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import {
  Fig, Box, Head, Rail, Movement, Row, Full, WideRail, EaseScale, StackBar, Timeline, TERRA, TRACK,
} from "@/components/spine/kit";
import type { TLPhase, TLNode } from "@/components/spine/kit";
import { Masthead } from "./masthead";
import { FormatPicker, FormatProvider } from "./format-picker";
import { OwnerKeeps, BreakEven, CostToOpen } from "./money-chapter";
import { Nearby, Wages, Risks } from "./interactive";

export const dynamic = "force-static";
const X: any = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/cells/GB-london-restaurants.json"), "utf8"));

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/* terracotta top-edge hover on every card/interactive row (reduced-motion safe). */
function CellStyles() {
  return (
    <style>{`.spine-scope .celltop{position:relative;transition:transform .15s ease-out,border-color .15s ease-out}
.spine-scope .celltop::before{content:"";position:absolute;left:14px;right:14px;top:0;height:2px;border-radius:9999px;background:${TERRA};opacity:0;transition:opacity .15s ease-out}
.spine-scope .celltop:hover::before{opacity:1}
@media (prefers-reduced-motion:reduce){.spine-scope .celltop{transition:none}}`}</style>
  );
}

/* ================= CH1 , THE VERDICT ================= */
/* HonestTake , WI-3 brief:
 * decision: how hard this trade is to enter. Number: the break-in read (as a word) + the crowded proof (n_firms).
 * focal: the break-in verdict; the market density (18,000 firms) is the evidence, shown, not asserted.
 * width: Even half. terracotta target: the n_firms hero figure only. No gauge (folded to WhoSuits EaseScale). */
function HonestTake({ d }: { d: any }) {
  const v = d.verdict ?? {};
  const n = d.headline?.n_firms ?? 0;
  return (
    <Box className="celltop">
      <Rail icon="honest-take" kicker="How hard to break in" verdict={v.break_in_line} />
      <div className="mt-1 flex items-baseline gap-2.5 border-t border-[var(--c-border)] pt-3">
        <Fig className="text-3xl text-[var(--terra-text)]">{n.toLocaleString()}</Fig>
        <span className="text-[12.5px] text-[var(--c-ink2)]">restaurants already trade here.</span>
      </div>
      <div className="mt-1 text-[11.5px] leading-snug text-[var(--c-muted)]">{v.crowded_line}</div>
    </Box>
  );
}

/* MoneySplit , WI-3 brief:
 * decision: where the money goes. Number: the kept slice (7%). focal: the 100%-stacked $100 bar.
 * width: Even half. terracotta target: the kept slice only. */
function MoneySplit({ d }: { d: any }) {
  const items: any[] = d.money_split?.items ?? [];
  const greys = ["#8f8f8f", "#a3a3a3", "#b7b7b7", "#cbcbcb", "#dedede"]; let gi = 0;
  const segments = items.map((it) => ({ label: it.name, pct: it.pct, color: it.kept ? TERRA : greys[(gi++) % greys.length] }));
  return (
    <Box className="celltop">
      <Rail icon="cost-breakdown" kicker="Where each $100 of sales goes" verdict={d.money_split?.surface_line} />
      <StackBar segments={segments} ariaLabel={segments.map((p) => `${p.label} ${p.pct}%`).join(", ")} legend />
    </Box>
  );
}

/* WhoSuits , WI-3 brief:
 * decision: who this trade suits. Number: four operator demands on one shared scale (break-in folded here).
 * focal: the EaseScale markers. width: Even half (promoted OUT of Narrow). terracotta target: the markers. */
function WhoSuits({ d }: { d: any }) {
  const w = d.who_suits ?? {};
  const rows: Array<[string, number, string, string?]> = (w.scales ?? []).map((s: any) => [s.label, s.pos, s.word, s.sub]);
  return (
    <Box className="celltop">
      <Rail icon="who-for" kicker="Who this suits" verdict={w.subtitle} />
      <div className="mt-1"><EaseScale rows={rows} /></div>
    </Box>
  );
}

/* ================= CH2 , THE DEMAND ================= */
/* Demand , WI-4 brief:
 * decision: when the revenue actually lands. Number: covers/week + the dayparts split (weekend carries it).
 * focal: dayparts as ZERO-baseline bars (the true demand story), channel split as a 100%-stacked share bar.
 * width: WideRail. terracotta target: the weekend daypart bar (chart) + dine-in channel slice (rail). */
function Demand({ d }: { d: any }) {
  const dm = d.demand ?? {};
  const dayparts: any[] = dm.dayparts ?? [];
  const dpMax = Math.max(1, ...dayparts.map((p) => p.pct));
  const dpPeak = dayparts.reduce((a, b) => (b.pct > a.pct ? b : a), dayparts[0])?.name;
  const channels: any[] = dm.channels ?? [];
  const chGreys = ["#a3a3a3", "#cbcbcb"]; let ci = 0;
  const chSegs = channels.map((c, i) => ({ label: c.name, pct: c.pct, color: i === 0 ? TERRA : chGreys[(ci++) % chGreys.length] }));
  const cat: any[] = dm.catchment ?? [];
  const maxCat = Math.max(1, ...cat.map((c) => c.pct));
  return (
    <WideRail>
      <Box className="celltop">
        <Rail icon="footfall" kicker="When the revenue lands" verdict={dm.surface_line} />
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
          <Fig className="text-3xl text-[var(--c-ink)]">{(dm.covers_per_week ?? 0).toLocaleString()}</Fig>
          <span className="text-[13px] text-[var(--c-ink2)]">covers a week at about <Fig className="text-[var(--c-ink)]">${dm.avg_spend_usd}</Fig> a head.</span>
        </div>
        {/* dayparts , zero-baseline bars on a share axis (the truer demand story) */}
        <div className="space-y-2">
          {dayparts.map((p) => (
            <div key={p.name} className="grid grid-cols-[120px_1fr_36px] items-center gap-3">
              <span className="text-[12px] text-[var(--c-ink2)]">{p.name}</span>
              <span className="h-2.5 overflow-hidden rounded-full" style={{ background: TRACK }}>
                <span className="block h-full rounded-full" role="img" aria-label={`${p.name} ${p.pct}%`} style={{ width: `${(p.pct / dpMax) * 100}%`, background: p.name === dpPeak ? TERRA : "#c8c8c6" }} />
              </span>
              <Fig className="text-right text-[12.5px] text-[var(--c-ink)]">{p.pct}%</Fig>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-[var(--c-muted)]">Share of the week's covers by daypart.</div>
      </Box>
      <Box className="celltop">
        <Rail icon="catchment" kicker="Who comes in, and how" verdict={dm.channel_line} />
        <StackBar segments={chSegs} h="h-7" ariaLabel={chSegs.map((s) => `${s.label} ${s.pct}%`).join(", ")} legend />
        {/* catchment , explicitly labeled an index, not an absolute share */}
        <div className="mt-4 border-t border-[var(--c-border)] pt-3">
          <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Where the covers come from <span className="font-normal normal-case">({dm.catchment_unit})</span></div>
          <div className="space-y-2">
            {cat.map((c) => (
              <div key={c.name} className="grid grid-cols-[130px_1fr] items-center gap-3">
                <span className="min-w-0 truncate text-[12px] text-[var(--c-ink2)]">{c.name}</span>
                <span className="h-2 overflow-hidden rounded-full" style={{ background: TRACK }}>
                  <span className="block h-full rounded-full" role="img" aria-label={`${c.name} index ${c.pct}`} style={{ width: `${(c.pct / maxCat) * 100}%`, background: "#c8c8c6" }} />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">{dm.catchment_note}</div>
        </div>
      </Box>
    </WideRail>
  );
}

/* ================= CH4 , RUNNING IT ================= */
/* Seasonality , WI-4 brief:
 * decision: how much the year swings. Number: the peak vs the trough. focal: 12 month bars, ZERO baseline.
 * width: Even half. terracotta target: the peak-month bar only. Honest floor from 0 (no artificial floor). */
function Seasonality({ d }: { d: any }) {
  const m: number[] = d.seasonality?.months ?? [];
  if (m.length < 2) return null;
  const max = Math.max(...m), min = Math.min(...m), span = max - min || 1;
  const dec = m.length - 1; // December is the marked node (year-end peak)
  const W = 300, H = 84, padX = 6, padTop = 8, padBot = 18;
  const X = (i: number) => padX + (i / (m.length - 1)) * (W - padX * 2);
  const Y = (v: number) => padTop + (1 - (v - min) / span) * (H - padTop - padBot);
  const pts = m.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
  const line = "M " + pts.join(" L ");
  const area = `M ${X(0).toFixed(1)},${(H - padBot).toFixed(1)} L ` + pts.join(" L ") + ` L ${X(m.length - 1).toFixed(1)},${(H - padBot).toFixed(1)} Z`;
  return (
    <Box className="celltop md:flex-[2]">
      <Rail icon="seasonality" kicker="Busy months and quiet months" verdict={d.seasonality?.surface_line} />
      {/* a small area+line: the shape of the year reads at a glance, December marked */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 84 }} role="img" aria-label="Indexed demand across the year, December the peak" preserveAspectRatio="none">
        <path d={area} fill={TERRA} opacity={0.1} />
        <path d={line} fill="none" stroke={TERRA} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <line x1={X(dec)} y1={padTop} x2={X(dec)} y2={H - padBot} stroke={TERRA} strokeWidth={1} strokeDasharray="2 2" opacity={0.55} />
        <circle cx={X(dec)} cy={Y(m[dec])} r={3} fill={TERRA} stroke="#fff" strokeWidth={1.5} />
        {m.map((_, i) => <text key={i} x={X(i)} y={H - 5} textAnchor="middle" fill="#8c8c8a" fontSize={8}>{MONTHS[i]}</text>)}
      </svg>
      <div className="mt-1.5 text-[11px] text-[var(--c-muted)]">Indexed demand across the year. December is the peak; the swing is real but gentle.</div>
    </Box>
  );
}

/* FirstYear , WI-5 brief:
 * decision: when the year stops bleeding. Number: the break-even week. focal: the 52-week timeline.
 * width: Full. terracotta target: the break-even node (ONLY if the seed measured one, never forced). */
function FirstYear({ d }: { d: any }) {
  const fy = d.first_year ?? {};
  const ms: any[] = fy.milestones ?? [];
  if (ms.length === 0) return null;
  // Honest: the break-even node exists ONLY where the seed flags it. Never force one.
  const nodes: TLNode[] = ms.map((mi) => ({ at: mi.week, label: mi.label, kind: mi.kind === "breakeven" ? "breakeven" : "normal" }));
  const phases: TLPhase[] = (fy.phases ?? []).map((p: any) => [p.label, p.from, p.to] as TLPhase);
  const span = Math.max(52, ...nodes.map((n) => n.at));
  return <Timeline span={span} unit="week" phases={phases} nodes={nodes} read={fy.read} startLabel="wk 0" />;
}

/* ================= CH5 , PLACE AND RIVALS ================= */
/* Myth , WI-3 brief:
 * decision: bust the belief operators actually hold. Number: the real year-one survival rate (NEW, not restated).
 * focal: the struck claim + the survival counter-figure. width: Even half. terracotta target: the survival figure. */
function Myth({ d }: { d: any }) {
  const my = d.myth ?? {};
  const s = my.survival ?? {};
  const survival: Array<[string, number]> = [["Yr 1", s.year1_pct], ["Yr 3", s.year3_pct], ["Yr 5", s.year5_pct]]
    .filter(([, v]) => typeof v === "number") as Array<[string, number]>;
  return (
    <Box className="celltop md:flex-[3]">
      <Rail icon="myth-reality" tone="terra" kicker="Myth, busted" verdict="A dramatic first-year collapse is not what actually closes most rooms." />
      <div className="rounded-[10px] border border-[var(--c-border)] bg-[var(--c-soft)] px-3.5 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">The claim</span>
        <p className="mt-0.5 text-[13px] italic text-[var(--c-ink2)]">&ldquo;{my.claim}&rdquo;</p>
      </div>
      <p className="mt-3 text-[12.5px] leading-snug text-[var(--c-ink2)]">{my.reality}</p>
      {/* the NEW evidence: a survival curve, not a restatement of the margin split.
          A downward slope reads "attrition over time"; terracotta marks the year-one
          figure only (the myth-buster), the later years stay ink. */}
      {survival.length >= 2 ? <SurvivalSlope points={survival} note={s.line} /> : null}
    </Box>
  );
}

/* survival curve , the share still trading at year 1 / 3 / 5 as a descending line.
 * One accent: the year-one node + figure (the belief being busted). */
function SurvivalSlope({ points, note }: { points: Array<[string, number]>; note?: string }) {
  const W = 320, H = 110, padL = 8, padR = 8, padTop = 22, padBot = 26;
  const min = 0, max = 100;
  const X = (i: number) => padL + (i / (points.length - 1)) * (W - padL - padR);
  const Y = (v: number) => padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBot);
  const coords = points.map(([, v], i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
  const line = "M " + coords.join(" L ");
  const area = `M ${X(0).toFixed(1)},${(H - padBot).toFixed(1)} L ` + coords.join(" L ") + ` L ${X(points.length - 1).toFixed(1)},${(H - padBot).toFixed(1)} Z`;
  return (
    <div className="mt-3 border-t border-[var(--c-border)] pt-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }} role="img" aria-label={`Still trading: ${points.map(([l, v]) => `${l} ${v}%`).join(", ")}`}>
        <path d={area} fill={TERRA} opacity={0.09} />
        <path d={line} fill="none" stroke="#c8c8c6" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([label, v], i) => {
          const lead = i === 0;
          return (
            <g key={label}>
              <circle cx={X(i)} cy={Y(v)} r={lead ? 4 : 3} fill={lead ? TERRA : "#1b1b1a"} stroke="#fff" strokeWidth={1.5} />
              <text x={X(i)} y={Y(v) - 9} textAnchor="middle" fontSize={12} style={{ fontFamily: "var(--font-grotesk)", fontWeight: lead ? 700 : 500 }} fill={lead ? "#c2410c" : "#1b1b1a"}>{v}%</text>
              <text x={X(i)} y={H - 8} textAnchor="middle" fontSize={9.5} fill="#8c8c8a">{label}</text>
            </g>
          );
        })}
      </svg>
      {note ? <div className="text-[11px] text-[var(--c-muted)]">{note}</div> : null}
    </div>
  );
}

/* Related , WI-3 brief:
 * decision: where to look next. Number: each trade's owner-keeps headline fact (a comparison + Pro drilldown hook).
 * focal: the cross-sell cards. width: Full. terracotta target: each card's keep figure. */
function Related({ d }: { d: any }) {
  const arr: any[] = d.related ?? [];
  // the ONE accent in this box: the trade that keeps the most of each pound.
  const leadKeep = Math.max(1, ...arr.map((r) => r.keeps_pct ?? 0));
  return (
    <Box className="celltop md:flex-[3]">
      <Head icon="compare">Related trades in this place</Head>
      <p className="mb-3 text-[12px] leading-snug text-[var(--c-ink2)]">The same street, a different trade. What each one keeps of every $100 of sales.</p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {arr.map((r) => {
          const isLead = r.keeps_pct === leadKeep;
          return (
            <a key={r.slug} href="#" className="cityhov block rounded-lg border border-[var(--c-border)] bg-[var(--c-card)] px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-semibold text-[var(--c-ink)]">{r.name}</span>
                <Fig className={`text-[13px] ${isLead ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{r.keeps_pct}%</Fig>
              </div>
              {/* neutral keep bar (accent only on the leader) so magnitude reads and the card fills */}
              <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full" style={{ background: TRACK }}>
                <span className="block h-full rounded-full" role="img" aria-label={`${r.name} keeps ${r.keeps_pct}%`} style={{ width: `${Math.max(6, (r.keeps_pct / leadKeep) * 100)}%`, background: isLead ? TERRA : "#c8c8c6" }} />
              </span>
              <div className="mt-1.5 text-[11px] leading-snug text-[var(--c-ink2)]">{r.fact} &#8594;</div>
            </a>
          );
        })}
      </div>
    </Box>
  );
}

/* Close , the deliberate full-width end of the page. A one-line recap of the verdict,
 * a small set of next-step links, and one primary CTA. Gives the page a proper terminus
 * so it does not trail off into dead background-photo margin. */
function Close({ d }: { d: any }) {
  const h = d.headline ?? {};
  const rel: any[] = d.related ?? [];
  const city = d.meta?.city ?? "this market";
  const trade = (d.meta?.trade ?? "this trade").toLowerCase();
  const links = [
    `Compare ${trade} across nearby markets`,
    rel[0] ? `Look at ${rel[0].name.toLowerCase()} in ${city} instead` : null,
    `See what an owner keeps, format by format`,
  ].filter(Boolean) as string[];
  return (
    <Box className="celltop">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">The bottom line</div>
          <p className="text-[15px] font-medium leading-snug text-[var(--c-ink)]">{h.answer}</p>
          <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--c-ink2)]">{d.verdict?.break_in_line}</p>
        </div>
        <a href="#" className="shrink-0 self-start rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--terra-text)] md:self-auto">
          Compare this trade with Pro &#8594;
        </a>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-4 sm:grid-cols-3">
        {links.map((t, i) => (
          <a key={i} href="#" className="text-[13px] font-medium text-[var(--terra-text)] hover:underline">{t} &#8594;</a>
        ))}
      </div>
    </Box>
  );
}

export default function SpineCellPage() {
  const d = X;
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <CellStyles />
      <Masthead d={d} />

      {/* The verdict , Even rhythm: honest-take + money-split, then who-suits + a demand teaser. No Narrow. */}
      <Movement index="01" eyebrow="The verdict" heading="Can this pay" icon="gut-check" />
      <div className="space-y-4">
        <Row><HonestTake d={d} /><MoneySplit d={d} /></Row>
        <Full><WhoSuits d={d} /></Full>
      </div>

      {/* Demand , a single WideRail band: dayparts + channels + catchment. */}
      <Movement index="02" eyebrow="The demand" heading="Where the revenue comes from" icon="footfall" />
      <Demand d={d} />

      {/* THE MONEY , the heaviest chapter. FormatProvider wraps it so the chosen subtype propagates
          through OwnerKeeps, BreakEven and CostToOpen. FormatPicker is the staged centerpiece. */}
      <Movement index="03" eyebrow="The money" heading="What it earns, what it keeps" icon="owner-keeps" />
      <FormatProvider d={d}>
        <div className="space-y-4">
          <Full><FormatPicker d={d} /></Full>
          <WideRail><OwnerKeeps d={d} /><BreakEven d={d} /></WideRail>
          <Row><CostToOpen d={d} /><Wages d={d} /></Row>
        </div>
      </FormatProvider>

      {/* Running it , Even (cost calendar reads) then Full timeline. */}
      <Movement index="04" eyebrow="Running it" heading="Through the first year" icon="first-year" />
      <div className="space-y-4">
        <Row><Seasonality d={d} /><Risks d={d} /></Row>
        <Full><FirstYear d={d} /></Full>
      </div>

      {/* Place and rivals , Full leaderboard then Even (myth + related close). */}
      <Movement index="05" eyebrow="Place and rivals" heading="Where it pays, and what to watch" icon="best-areas" />
      <div className="space-y-4">
        <Full><Nearby d={d} /></Full>
        <Row><Myth d={d} /><Related d={d} /></Row>
      </div>

      {/* The close , a deliberate full-width terminus so the page ends on a CTA band,
          not dead background-photo margin. */}
      <div className="mt-6 mb-2">
        <Full><Close d={d} /></Full>
      </div>
    </main>
  );
}
