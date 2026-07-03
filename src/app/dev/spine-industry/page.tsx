/**
 * Industry page (a trade across places) , SPINE rebuild (dev surface). Leg 4.
 * The cross-geography "can I make money doing Y" decision engine. The Margin Index
 * ("keeps $X of every $100") is the answer-first hero; the neighbours benchmark
 * proves it high; the SUBTYPE DRILL is the richness lever; the WherePays leaderboard
 * is the commercial heart. Composed from the shared spine kit + page-local forms
 * (forms.tsx) + the where-pays client island. Reads page-data/industries/restaurants.json.
 * On promotion this wires to industry_margins + the activity board.
 *
 * PAGE-LEVEL HIERARCHY (3 hero reads outweigh the rest): Margin Index masthead,
 * WherePays leaderboard, and the Subtype drill carry the most weight. The old subtype
 * triptych (drill + cost lollipop + who-accordion) is COLLAPSED into the one drill card
 * (Final Ascent P2): cost-to-open rides as the drill's second column, the format notes
 * live in its disclosure. The fixed-nut card is CUT (its notes fold into MoneySplit's
 * disclosure); CostDrivers, Related and the donut stay folded away.
 *
 * PERCEPTUAL-IDIOM CENSUS (as-built, cap 2 per family, by what the eye reads):
 *  - ranked track+fill bar list: SubtypeDrill + WherePays leaderboard = 2 (AT CAP).
 *  - dot-on-a-track lollipop: Benchmark = 1 (the capital lollipop merged into the drill).
 *  - stepped descending bars: MarginLadder = 1.
 *  - drawn curve/area on time: SurvivalCurve + SeasonRibbon = 2 (AT CAP).
 *  - fill-bar (single 0-100): break-even Meter = 1. Stacked share bar: MoneySplit = 1.
 *  - range bracket: CapitalPayback = 1. Timeline: Ramp = 1.
 *  - inline sparkline: the Demand trend (demand.trend_index) = 1.
 *  - big figure at HERO scale: the masthead $7 = 1 (section focals stay at 40-44px).
 * ONE canonical margin model (67/22/7, derived from money_split): the hero MarginLadder
 * is its only drawn statement; Operator shows a different cut (capital, survival, exit).
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { Fig, Meter, Bullets, InlineDisclosure, Movement, Box, Rail, Spark, Timeline, StackBar, Full, Even, WideRail, Narrow, TERRA, TRACK, usd, type TLPhase, type TLNode } from "@/components/spine/kit";
import { WherePaysExplorer } from "./where-pays";
import { MarginLadder, SurvivalCurve, SeasonRibbon, RangeBracket, CountFig } from "./forms";
import { deriveSubtypes } from "./subtypes";

export const dynamic = "force-static";
const I: any = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "../page-data/industries/restaurants.json"), "utf8"));
const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

/* ============================================================
 * MASTHEAD , THE MARGIN INDEX (hero, answer-first)
 * decision: does this trade make money? Number: the $7 kept per $100.
 * focal: the $7 keeps-per-100 figure (largest .fig on the page, top 20%).
 * width: hero band, dissolved onto the atmosphere (no half-scrim); the margin
 *   ladder shows the collapse as three descending bars beside it.
 * terracotta: the $7 figure + the ladder's kept bar (one focal + the kept slice). */
function Masthead({ d }: { d: any }) {
  const v = d.verdict ?? {}; const mi = d.margin_index ?? {}; const m = d.margins ?? {};
  return (
    <section className="pt-4 md:pt-6">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="fig text-[13px] font-semibold text-[var(--c-muted)]">00</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--c-ink2)]">The trade, worldwide</span>
      </div>
      <h1 data-typography="custom" className="text-[2.1rem] font-bold leading-[1.05] tracking-tight text-[var(--c-ink)] md:text-[2.75rem]">{d.meta?.name}</h1>
      <div className="mt-5 grid gap-5 md:grid-cols-[1.35fr_1fr] md:items-center">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <CountFig value={mi.keeps_per_100} prefix="$" className="text-[64px] leading-[0.9] text-[var(--terra-text)] md:text-[80px]" />
            <span className="max-w-[22rem] text-[16px] leading-snug text-[var(--c-ink2)]">kept by the owner from every <Fig className="text-[var(--c-ink)]">$100</Fig> a customer spends. A <b className="text-[var(--c-ink)]">{mi.rank_word}</b> keep, {mi.vs_typical}.</span>
          </div>
          <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-[var(--c-ink2)]">{v.lead}</p>
        </div>
        {/* the margin ladder: the gross-to-net collapse, seen as three shrinking bars */}
        <Box>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">The margin ladder</div>
          <MarginLadder gross={m.gross_pct} operating={m.operating_pct} net={m.net_pct} />
        </Box>
      </div>
      <p className="mt-4 text-[11px] leading-snug text-[var(--c-muted)]">{d.provenance_line}</p>
    </section>
  );
}

/* VERDICT LEDE , the single editorial beat (subhead folded in).
 * decision-support: why the model is hard, in one voice. focal: the pull-quote.
 * width: Narrow (T5), air around one idea. terracotta: the attribution dot only. */
function VerdictLede({ d }: { d: any }) {
  const v = d.verdict ?? {};
  return (
    <Narrow>
      <figure>
        <blockquote className="text-[19px] font-medium leading-snug text-[var(--c-ink)] md:text-[21px]">{v.close}</blockquote>
        <figcaption className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-[var(--c-ink2)]">
          <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: TERRA }} aria-hidden />
          <span>What the winners are actually good at.</span>
        </figcaption>
      </figure>
    </Narrow>
  );
}

/* ============================================================
 * BENCHMARK , the "vs the neighbours" USP, proving $7 is low (moved up, top 20%)
 * decision: is $7 actually low? Number: restaurants vs the food trades next door.
 * focal: the lollipop dots on one shared $ scale, restaurants (self) lit.
 * width: Full (T1), a ranked distribution; the rows ARE the links to those trades.
 * terracotta: the restaurants (self) dot only.
 * idiom: dot-on-a-track lollipop (1 of 2). Folds the old Related chips in (rows link). */
function Benchmark({ d }: { d: any }) {
  const b = d.benchmark ?? {};
  const trades: any[] = (b.trades ?? []).slice().sort((a: any, c: any) => c.keeps_per_100 - a.keeps_per_100);
  if (!trades.length) return null;
  // The scale spans only these food neighbours. The broad all-trades average ($12) is a
  // DIFFERENT, wider set, so it is NOT drawn as a tick on this five-trade axis (that would
  // misread); it is stated in prose (avg_note) instead. Honesty: draw only what belongs here.
  const max = Math.max(...trades.map((t) => t.keeps_per_100)) * 1.12;
  return (
    <Full>
      <Box>
        <Rail icon="benchmark" tone="terra" kicker="Against the trades next door" verdict="Even among its nearest food neighbours, restaurants keep the least per $100." />
        <div className="space-y-1.5">
          {trades.map((t) => {
            const pos = (t.keeps_per_100 / max) * 100;
            const self = !!t.self;
            const Tag: any = self ? "div" : "a";
            return (
              <Tag key={t.slug} href={self ? undefined : "#"} className="hov -mx-2 grid grid-cols-[110px_1fr_40px] items-center gap-3 rounded-md px-2 py-1.5">
                <span className={`min-w-0 truncate text-[12.5px] ${self ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)] hover:text-[var(--terra-text)]"}`} title={t.name}>{t.name}{self ? null : <span className="text-[var(--c-muted)]"> &#8594;</span>}</span>
                <div className="relative h-3 min-w-0" role="img" aria-label={`${t.name} keeps $${t.keeps_per_100} per $100`}>
                  <div className="absolute top-1/2 h-px w-full -translate-y-1/2" style={{ background: "#e7e2df" }} />
                  <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ left: 0, width: `${pos}%`, background: self ? TERRA : "#d4cdc8" }} />
                  <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos}%`, background: self ? TERRA : "#9a938e", boxShadow: "0 0 0 1px #e7e2df" }} />
                </div>
                <Fig className={`text-right text-[13px] ${self ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>${t.keeps_per_100}</Fig>
              </Tag>
            );
          })}
        </div>
        <InlineDisclosure name="bench" summary="Why each neighbour keeps more">
          <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
            {trades.map((t) => (
              <div key={t.slug} className="grid grid-cols-[110px_1fr] items-baseline gap-3 py-2">
                <span className="text-[12px] font-medium text-[var(--c-ink)]">{t.name} <Fig className="text-[var(--c-muted)]">${t.keeps_per_100}</Fig></span>
                <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{t.why}</span>
              </div>
            ))}
          </div>
        </InlineDisclosure>
        <div className="mt-2.5 text-[11px] leading-snug text-[var(--c-muted)]">{b.avg_note} {b.note}</div>
      </Box>
    </Full>
  );
}

/* ============================================================
 * DEMAND , the appetite drawn + the crowd sharing it (the audit's merge: one story,
 * one coherent WideRail pair, no half-empty boxes, no adjective standing in for a number).
 * decision: is demand there and is it shared too thin? Numbers: the demand trend index
 * (drawn as the page's one Spark, END VALUE beside it) + per-diner economics (spend/head,
 * visits/yr) in the appetite half; venues per 10k (the crowd) in the saturation rail.
 * focal: the Spark + its end value (chart half); the venues-per-10k figure (rail).
 * width: WideRail (T2). terracotta: the Spark (chart half) / the saturation figure (rail),
 * one mark per box. Honesty: the Spark draws demand.trend_index exactly as seeded (the
 * post-dip recovery, still under its pre-dip 100); the end value is printed, not implied. */
function Demand({ d }: { d: any }) {
  const dm = d.demand ?? {};
  const trend: number[] = dm.trend_index ?? [];
  const trendEnd = trend.length ? trend[trend.length - 1] : null;
  return (
    <WideRail>
      <Box className="flex flex-col justify-center">
        <Rail icon="spending-power" tone="terra" kicker="The appetite" verdict="The appetite is most of the way back, and still climbing." />
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          {trend.length > 1 ? (
            <div className="min-w-0">
              <div className="flex items-end gap-2.5">
                <Spark values={trend} w={172} h={46} />
                {trendEnd != null ? (
                  <span className="flex items-baseline gap-1"><Fig className="text-[26px] leading-none text-[var(--c-ink)]">{trendEnd}</Fig><span className="text-[10.5px] text-[var(--c-muted)]">of 100</span></span>
                ) : null}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-[var(--c-muted)]">Demand, indexed to the pre-dip 100</div>
            </div>
          ) : null}
          <div className="flex gap-6 sm:border-l sm:border-[var(--c-border)] sm:pl-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Spend per head</div>
              {typeof dm.spend_per_head_usd === "number" ? (
                <Fig className="mt-1 block text-[20px] leading-none text-[var(--c-ink)]">${dm.spend_per_head_usd}</Fig>
              ) : (
                <div className="mt-1 text-[13px] text-[var(--c-muted)]">Not modeled</div>
              )}
            </div>
            {typeof dm.purchases_per_year === "number" ? (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Visits a year</div>
                <Fig className="mt-1 block text-[20px] leading-none text-[var(--c-ink)]">{dm.purchases_per_year}</Fig>
              </div>
            ) : null}
          </div>
        </div>
        {dm.trend_note ? <div className="mt-3 border-t border-[var(--c-border)] pt-2.5 text-[11.5px] leading-snug text-[var(--c-ink2)]">{dm.trend_note}</div> : null}
      </Box>
      <Box className="flex flex-col justify-center">
        <Rail icon="competition" kicker="Saturation" verdict="New rooms do not create new appetite here; they divide it." />
        <div className="flex items-baseline gap-1.5"><CountFig value={dm.venues_per_10k} className="text-[40px] leading-none text-[var(--terra-text)]" /><span className="text-[12px] text-[var(--c-ink2)]">venues per 10k residents</span></div>
        {dm.venues_per_10k_band ? <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{dm.venues_per_10k_band}</div> : null}
        {dm.saturation_note ? <div className="mt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">{dm.saturation_note}</div> : null}
      </Box>
    </WideRail>
  );
}

/* ============================================================
 * SUBTYPE DRILL , the richness lever (hero) and, after the Final Ascent P2 collapse,
 * the chapter's ONE card: the old cost lollipop rides here as a second (To open) column
 * and the old who-accordion's format notes live in the disclosure (its "who" promise had
 * no seed copy behind it, so the card is cut until real operator-fit copy exists).
 * decision: which FORMAT to run, and what each door costs. Numbers: keep % (the ranked
 * bars, one decimal everywhere) + capital-to-open (right-aligned column).
 * focal: the keep-% ranked bars; format, not cuisine, moves the keep.
 * width: Full (T1), parallel reads on one shared scale; sort monotonic with the bars.
 * terracotta: the leading (best-keep) bar + its figure only; the cost column stays ink.
 * idiom: ranked track+fill bars (1 of 2, with the WherePays leaderboard).
 * Reads the derived subtype shape (keeps_pct + capital_usd) via deriveSubtypes. */
function SubtypeDrill({ d }: { d: any }) {
  const items = deriveSubtypes(d).slice().sort((a, b) => b.keeps_pct - a.keeps_pct);
  if (!items.length) return null;
  const max = Math.max(...items.map((s) => s.keeps_pct));
  const lead = items[0]?.slug;
  const cols = "grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)_3.4rem_3.9rem] sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_3.4rem_4.2rem]";
  return (
    <Full>
      <Box>
        <Rail icon="cost-breakdown" tone="terra" kicker="The subtypes" verdict="The format you choose moves the keep more than the menu ever does." />
        <div className={`grid ${cols} items-end gap-3 border-b border-[var(--c-border)] px-2 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]`}>
          <span>Format</span>
          <span aria-hidden />
          <span className="text-right">Keep</span>
          <span className="text-right">To open</span>
        </div>
        <div className="space-y-1 pt-1">
          {items.map((s) => {
            const isLead = s.slug === lead;
            return (
              <div key={s.slug} className={`hov -mx-2 grid ${cols} items-center gap-3 rounded-md px-2 py-2`}>
                <span className="min-w-0 truncate text-[12.5px] font-medium text-[var(--c-ink)]" title={s.name}>{s.name}</span>
                <span className="h-2.5 overflow-hidden rounded-full" style={{ background: TRACK }}>
                  <span className="block h-full rounded-full" role="img" aria-label={`${s.name} keeps ${s.keeps_pct.toFixed(1)}% of sales; ${money(s.capital_usd)} to open`} style={{ width: `${Math.max(4, (s.keeps_pct / max) * 100)}%`, background: isLead ? TERRA : "#c8c8c6" }} />
                </span>
                <Fig className={`text-right text-[13.5px] ${isLead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{s.keeps_pct.toFixed(1)}%</Fig>
                <Fig className="text-right text-[12.5px] text-[var(--c-ink2)]">{money(s.capital_usd)}</Fig>
              </div>
            );
          })}
        </div>
        <InlineDisclosure name="subtype-why" summary="Why each format keeps what it keeps">
          <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
            {items.map((s) => (
              <div key={s.slug} className="grid grid-cols-[minmax(0,10rem)_1fr] items-baseline gap-3 py-2">
                <span className="text-[12px] font-medium text-[var(--c-ink)]">{s.name}</span>
                <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{s.note}</span>
              </div>
            ))}
          </div>
        </InlineDisclosure>
        <div className="mt-2.5 text-[11.5px] leading-snug text-[var(--c-muted)]">{d.subtypes?.note}</div>
      </Box>
    </Full>
  );
}

/* ============================================================
 * MONEY SPLIT , where each $100 goes, the ONE carrier of the fixed/variable split
 * (the old fixed-nut card restated these three numbers one card below and is CUT;
 * its fixed_note/variable_note live in this card's disclosure now).
 * decision: what eats the sale. Number: the kept $7 slice of the stacked $100.
 * focal: the 100%-stacked bar, ON-BAR % labels on every segment >=12% (the audit's
 *   legend-round-trip fix); the legend stays as the name-to-colour mapping.
 * width: Full (T1) so the bar + its brackets have room. terracotta: the kept slice only.
 * Order + greys are OWNED HERE (sort={false}): the on-bar overlay and the fixed/variable
 * bracket row must align 1:1 under the drawn segments, so the caller sorts group-contiguous
 * (variable desc, fixed desc, kept last , the kit's own descending+kept-last order, which
 * this data satisfies) and maps grey darkness to magnitude with the kit ramp values. */
function MoneySplit({ d }: { d: any }) {
  const ms = d.money_split ?? {};
  const items: any[] = ms.items ?? [];
  if (!items.length) return null;
  const GREYS = ["#a3a3a1", "#b4b4b2", "#c4c4c2", "#d3d3d1", "#e0e0de"];
  const groupRank: Record<string, number> = { variable: 0, fixed: 1, kept: 2 };
  const ordered = items.slice().sort((a, b) => (groupRank[a.group] ?? 1) - (groupRank[b.group] ?? 1) || b.pct - a.pct);
  const sizeRank = new Map<string, number>(ordered.filter((i) => !i.kept).slice().sort((a, b) => b.pct - a.pct).map((s, i) => [s.name as string, i] as [string, number]));
  const parts = ordered.map((it) => ({ ...it, color: it.kept ? TERRA : GREYS[Math.min(GREYS.length - 1, sizeRank.get(it.name) ?? 0)] }));
  const variablePct = items.filter((i) => i.group === "variable").reduce((a, i) => a + i.pct, 0);
  const fixedPct = items.filter((i) => i.group === "fixed").reduce((a, i) => a + i.pct, 0);
  const keptPct = items.filter((i) => i.group === "kept").reduce((a, i) => a + i.pct, 0);
  return (
    <Full>
      <Box>
        <Rail icon="cost-breakdown" kicker="Where each $100 goes" verdict="The owner's slice is what four bigger lines leave behind." />
        {/* the stacked bar + the on-bar % overlay (ink on the light greys, AA-safe;
            the kept 7% slice is carried by the legend + the bracket row instead) */}
        <div className="relative">
          <StackBar segments={parts.map((p) => ({ label: p.name, pct: p.pct, color: p.color, kept: !!p.kept }))} sort={false} h="h-11" ariaLabel={parts.map((p) => `${p.name} ${p.pct}%`).join(", ")} legend />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex h-11 items-center">
            {parts.map((p) => (
              <span key={p.name} className="fig overflow-hidden whitespace-nowrap text-center text-[11px] font-semibold" style={{ width: `${p.pct}%`, color: "#1b1b1a", opacity: 0.8 }}>{p.pct >= 12 ? `${p.pct}%` : ""}</span>
            ))}
          </div>
        </div>
        {/* fixed / variable bracket row , folds the old donut into an annotation over the same $100 */}
        <div className="mt-4 grid grid-cols-[var(--vc)_var(--fc)_var(--kc)] gap-1 text-[10px]" style={{ ["--vc" as any]: `${variablePct}fr`, ["--fc" as any]: `${fixedPct}fr`, ["--kc" as any]: `${keptPct}fr` }}>
          {[["Variable", variablePct, "food + hourly wages, flex with covers"], ["Fixed", fixedPct, "rent, rates, salaried"], ["Kept", keptPct, "the owner's slice"]].map(([label, pct, sub]) => (
            <div key={label as string} className="border-t border-[var(--c-line-strong)] pt-1">
              <span className="font-semibold uppercase tracking-wide text-[var(--c-ink2)]">{label as string} <Fig className="text-[var(--c-ink)]">{pct as number}%</Fig></span>
              <span className="mt-0.5 block leading-tight text-[var(--c-muted)]">{sub as string}</span>
            </div>
          ))}
        </div>
        <InlineDisclosure name="split-notes" summary="What is fixed, and what flexes with covers">
          <div className="mt-2 space-y-2.5 border-t border-[var(--c-border)] pt-2.5">
            <div className="grid grid-cols-[4.5rem_1fr] gap-3">
              <span className="pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Fixed</span>
              <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{ms.fixed_note}</span>
            </div>
            <div className="grid grid-cols-[4.5rem_1fr] gap-3">
              <span className="pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Variable</span>
              <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{ms.variable_note}</span>
            </div>
          </div>
        </InlineDisclosure>
        <div className="mt-3 text-[11.5px] leading-snug text-[var(--c-ink2)]">{ms.annotation}</div>
      </Box>
    </Full>
  );
}

/* BREAK-EVEN , how full a typical day must run to clear costs (fill-bar meter).
 * decision: what share of a typical day's trade pays the nut. Number: breakeven_utilization_pct.
 * IDENTITY (matches the seed's _identity line): BE = fixed $27 / contribution ratio 0.34
 * (1 - variable $66 per $100) = ~79% of a typical day's takings. The seed field is
 * breakeven_utilization_pct; if it is absent the card renders nothing (never a 0).
 * The old fixed-nut rail beside this card restated the money-split bracket and is CUT.
 * focal: the utilisation figure over a filled Meter. width: Narrow (T5), one figure, air.
 * terracotta: the meter fill only. idiom: fill-bar (1 use on the page). */
function BreakEven({ d }: { d: any }) {
  const cs = d.cost_structure ?? {};
  const be: number | null = typeof cs.breakeven_utilization_pct === "number" ? cs.breakeven_utilization_pct : null;
  if (be == null) return null;
  return (
    <Narrow>
      <Box>
        <Rail icon="break-even" kicker="Break-even utilisation" verdict="Below this share of a typical day's trade, the day loses money." />
        <div className="mb-3 flex items-baseline gap-2.5"><CountFig value={be} suffix="%" className="text-[40px] leading-none text-[var(--c-ink)]" /><span className="text-[13px] text-[var(--c-ink2)]">of a typical day's takings, just to cover the costs.</span></div>
        <Meter value={be} left="empty" right="a typical day" />
        {cs.note ? <div className="mt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">{cs.note}</div> : null}
      </Box>
    </Narrow>
  );
}

/* ============================================================
 * RAMP , the realistic first year on one time axis (Timeline, one use).
 * decision: how long to break even, and the cash gap to survive. focal: the Timeline.
 * width: Full (T1). terracotta: the break-even node (atom-owned). */
function Ramp({ d }: { d: any }) {
  const fy = d.first_year ?? {};
  const phases: TLPhase[] = (fy.phases ?? []) as TLPhase[];
  const nodes: TLNode[] = (fy.nodes ?? []) as TLNode[];
  if (!nodes.length) return null;
  return (
    <Full>
      <Rail icon="first-year" tone="terra" kicker="The first year, month by month" verdict="Open soft, build covers, and survive the cash gap between full rota and full room." />
      <Timeline span={fy.span ?? 52} unit={fy.unit ?? "week"} phases={phases} nodes={nodes} startLabel="open" read={fy.note} />
    </Full>
  );
}

/* OPERATOR , what a typical owner walks away with (a DIFFERENT cut from the hero
 * margin ladder: durability + exit, not the gross->net collapse restated).
 * decision: what a typical owner actually sees. Number: the kept slice after a full year.
 * focal: ONE hero figure (owner keeps %); the support facts (capital, survival, exit)
 *   are the body, not a re-drawn 64/16/7 ladder. width: WideRail (T2) chart half.
 * terracotta: the owner-keeps hero figure only. */
function Operator({ d }: { d: any }) {
  const o = d.operator ?? {};
  const facts: Array<[string, string]> = [
    [money(o.capital_to_open_usd), "to open"],
    [`${o.survival_1yr_pct}%`, "survive yr 1"],
    [`x${o.sale_multiple_low}-${o.sale_multiple_high}`, "profit at sale"],
  ];
  return (
    <Box>
      <Rail icon="who-for" kicker="The typical operator" verdict="A normal owner works a full year to keep a thin slice." />
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
        <CountFig value={o.owner_keeps_pct} suffix="%" className="text-[40px] leading-none text-[var(--terra-text)]" />
        <span className="text-[13px] text-[var(--c-ink2)]">of sales reaches the owner, after a full year on the floor.</span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-[var(--c-border)] border-t border-[var(--c-border)] pt-3">
        {facts.map(([val, l]) => <div key={l} className="px-3 first:pl-0 last:pr-0"><Fig className="text-[18px] text-[var(--c-ink)]">{val}</Fig><div className="mt-0.5 text-[10.5px] leading-tight text-[var(--c-muted)]">{l}</div></div>)}
      </div>
      <p className="mt-4 text-[11.5px] leading-snug text-[var(--c-muted)]">The margin is thin, but the trade is durable and sells on a real multiple once the lease and covers are stable.</p>
    </Box>
  );
}

/* CAPITAL PAYBACK , how long the fit-out takes to return + the gearing depth (Pro-ish).
 * decision: when does the cash come back, and what does debt do to it. Number: payback months.
 * focal: the payback figure over a range BRACKET (not a dot-track). width: WideRail rail.
 * terracotta: the "34" figure ONLY (the bracket tick + label are neutral ink; the levered
 * keep in the disclosure is a supporting figure, kept neutral). Gearing in a disclosure. */
function CapitalPayback({ d }: { d: any }) {
  const p = d.payback ?? {};
  const lo = p.low_months ?? 0, hi = p.high_months ?? 1, mid = p.payback_months ?? 0;
  return (
    <Box className="flex flex-col justify-center">
      <Rail icon="first-year" kicker="Payback window" verdict="The fit-out returns in years, not months, and only if the room fills." />
      <div className="mb-1 flex items-baseline gap-2.5"><CountFig value={mid} className="text-[40px] leading-none text-[var(--terra-text)]" /><span className="text-[13px] text-[var(--c-ink2)]">months to return the <Fig className="text-[var(--c-ink)]">{money(p.capital_usd ?? 0)}</Fig> opening cost.</span></div>
      <RangeBracket lo={lo} hi={hi} mid={mid} unit="mo" midLabel={`${mid} mo`} accent={false} />
      <div className="mt-2 text-[11.5px] leading-snug text-[var(--c-muted)]">{p.note}</div>
      <InlineDisclosure name="gearing" summary="If the fit-out is borrowed">
        <div className="mt-2 grid grid-cols-2 gap-3 border-t border-[var(--c-border)] pt-2.5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Unlevered</div>
            <div className="mt-0.5 text-[12.5px] text-[var(--c-ink)]"><Fig>{p.unlevered_keep_pct}%</Fig> keep, back in <Fig>{p.unlevered_months}</Fig> mo</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">At {p.levered_ltv_pct}% borrowed</div>
            <div className="mt-0.5 text-[12.5px] text-[var(--c-ink)]"><Fig>{p.levered_keep_pct}%</Fig> keep, back in <Fig>{p.levered_months}</Fig> mo</div>
          </div>
        </div>
        <p className="mt-2 text-[11.5px] leading-snug text-[var(--c-ink2)]">{p.gearing_note}</p>
      </InlineDisclosure>
    </Box>
  );
}

/* SURVIVAL , how many last, as a decay CURVE on a zero baseline (honesty fix + new form).
 * decision: how durable is the trade. Number: the share still open at yr 5.
 * The curve derives from the REAL seed fields (survival.yr1/yr3/yr5 pcts); the 100% at
 * open is definitional, nothing is invented. Skips any year the seed does not carry.
 * focal: the falling curve. width: Even (T3), paired with who-it-suits.
 * terracotta: the curve line + its end dot. idiom: drawn curve (1 of 2, with SeasonRibbon). */
function Survival({ d }: { d: any }) {
  const s = d.survival ?? {};
  const curve: Array<{ yr: number; pct: number }> = [
    { yr: 0, pct: 100 },
    ...([[1, s.yr1_pct], [3, s.yr3_pct], [5, s.yr5_pct]] as Array<[number, unknown]>)
      .filter((e): e is [number, number] => typeof e[1] === "number")
      .map(([yr, pct]) => ({ yr, pct })),
  ];
  if (curve.length < 2) return null;
  return (
    <Box className="flex flex-col">
      <Rail icon="watch" kicker="Five-year survival" verdict="Most rooms outlive the folklore; the early winters decide who stays." />
      <SurvivalCurve curve={curve} note={s.note} />
    </Box>
  );
}

/* WHO IT SUITS , two columns: suits / think twice.
 * decision: is this operator you. focal: the two bullet columns as a contrast.
 * width: Even (T3), paired with survival. terracotta: the "suits" dots only. */
function WhoItSuits({ d }: { d: any }) {
  const w = d.who_suits ?? {};
  return (
    <Box>
      <Rail icon="gut-check" kicker="Who it suits" verdict="It rewards hands-on operators, and punishes absentee ownership." />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">Suits</div>
          <Bullets items={w.suits ?? []} />
        </div>
        <div className="sm:border-l sm:border-[var(--c-border)] sm:pl-5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Think twice</div>
          <ul className="space-y-2">{(w.think_twice ?? []).map((t: string, i: number) => <li key={i} className="relative pl-4 text-[12.5px] leading-snug text-[var(--c-ink2)]"><span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full border border-[var(--c-line-strong)]" />{t}</li>)}</ul>
        </div>
      </div>
    </Box>
  );
}

/* ============================================================
 * SEASONALITY , the year's shape as a single area RIBBON (honesty fix + new form).
 * decision: when the cash comes and when it is tight. focal: the ribbon over 12 months.
 * width: the chart half of a WideRail (T2), paired with Caveats , the page's tail
 * alternates tiers instead of running four Full bands in a row.
 * terracotta: the peak node only; the trough is derived + inked.
 * idiom: drawn ribbon (2 of 2, with SurvivalCurve). Returns a bare Box for WideRail. */
function Seasonality({ d }: { d: any }) {
  const se = d.seasonality ?? {};
  const months: number[] = se.months ?? [];
  if (!months.length) return null;
  return (
    <Box>
      <Rail icon="seasonality" kicker="Across the year" verdict="The year breathes: the high season pays for the quiet months." />
      <SeasonRibbon months={months} peakNote={se.peak_note} troughNote={se.trough_note} />
      <div className="mt-2 text-[11.5px] leading-snug text-[var(--c-muted)]">{se.note}</div>
    </Box>
  );
}

/* CAVEATS , folk-myths debunked (the honesty moat, fully free). Reads the seed shape
 * { myths: string[], honest_take } and renders the debunk lines plus one interpretive lead.
 * decision-support: the comfortable stories are wrong. focal: the honest-take lead.
 * width: the rail half of a WideRail (T2), beside the season ribbon.
 * terracotta: none on the surface (the section eyebrow icon carries it). */
function Caveats({ d }: { d: any }) {
  const c = d.caveats ?? {};
  const myths: string[] = c.myths ?? [];
  if (!myths.length && !c.honest_take) return null;
  return (
    <Box>
      <Rail icon="myth-reality" tone="terra" kicker="What people get wrong" verdict="The comfortable stories about this trade do not survive the maths." />
      {myths.length ? <Bullets items={myths} /> : null}
      {c.honest_take ? <p className="mt-3 border-t border-[var(--c-border)] pt-3 text-[12.5px] leading-snug text-[var(--c-ink2)]">{c.honest_take}</p> : null}
    </Box>
  );
}

/* CLOSE , a deliberate full-width capstone: a three-point recap of the page's verdict
 * (the keep, the format that keeps most, the place that keeps most) then the one next action.
 * focal: the CTA. terracotta: the recap figures + the button (the close is the one band
 * where the accent may sit on more than one mark, as the page-wide summary). */
function Close({ d }: { d: any }) {
  const mi = d.margin_index ?? {};
  const subs = deriveSubtypes(d).slice().sort((a, b) => b.keeps_pct - a.keeps_pct);
  const topFormat = subs[0];
  const places: any[] = (d.where_pays?.places ?? []).slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0));
  const topPlace = places[0];
  const recap: Array<[React.ReactNode, string]> = [
    [<>${mi.keeps_per_100}</>, "kept per $100, a thin keep won on volume"],
    ...(topFormat ? [[<>{topFormat.name}</>, `the format that keeps most, about ${topFormat.keeps_pct}%`] as [React.ReactNode, string]] : []),
    ...(topPlace ? [[<>{topPlace.name}</>, `keeps most of the modelled cities, ${topPlace.net_margin_pct}% net`] as [React.ReactNode, string]] : []),
  ];
  return (
    <Full>
      <Box>
        <Rail icon="bookmark" tone="terra" kicker="The close" verdict="A thin-margin trade that lives or dies on format, rent and a full room. Here is where it lands." />
        <div className="grid gap-4 sm:grid-cols-3">
          {recap.map(([fig, label], i) => (
            <div key={i} className="border-t border-[var(--c-line-strong)] pt-2.5">
              <div className="fig text-[22px] leading-none text-[var(--terra-text)]">{fig}</div>
              <div className="mt-1 text-[11.5px] leading-snug text-[var(--c-muted)]">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col items-center gap-3 border-t border-[var(--c-border)] pt-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="text-[14px] leading-snug text-[var(--c-ink)]">See {d.meta?.name?.toLowerCase()} in a specific city, with the local rent, wages and take-home.</div>
          <a className="shrink-0 cursor-pointer rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[var(--terra-text)]">Pick a place</a>
        </div>
      </Box>
    </Full>
  );
}

export default function SpineIndustryPage() {
  const d = I;
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <Masthead d={d} />
      <div className="mt-8"><VerdictLede d={d} /></div>

      <Movement index="01" eyebrow="Against the neighbours" heading="The keep, against the trades next door" icon="benchmark" />
      <Benchmark d={d} />

      <Movement index="02" eyebrow="The demand" heading="The appetite, and the crowd sharing it" icon="spending-power" />
      <Demand d={d} />

      <Movement index="03" eyebrow="The subtypes" heading="One trade, five different bets" icon="cost-breakdown" />
      <SubtypeDrill d={d} />

      <Movement index="04" eyebrow="How the money works" heading="The shape of the trade" icon="taxes" />
      <div className="space-y-6">
        <MoneySplit d={d} />
        <BreakEven d={d} />
      </div>

      <Movement index="05" eyebrow="The typical operator" heading="The owner's take, and the odds" icon="who-for" />
      <div className="space-y-6">
        <Ramp d={d} />
        <WideRail><Operator d={d} /><CapitalPayback d={d} /></WideRail>
        <Even><Survival d={d} /><WhoItSuits d={d} /></Even>
      </div>

      <Movement index="06" eyebrow="Where it pays best" heading="The same trade, place by place" icon="best-areas" />
      <div className="space-y-6">
        <WherePaysExplorer d={d} />
        <WideRail><Seasonality d={d} /><Caveats d={d} /></WideRail>
      </div>

      <Movement index="07" eyebrow="The close" heading="The next move" icon="bookmark" />
      <Close d={d} />
    </main>
  );
}
