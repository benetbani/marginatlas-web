/**
 * Industry page (a trade across places) , SPINE rebuild BODY. Leg 4.
 * The cross-geography "can I make money doing Y" decision engine. The Margin Index
 * ("keeps $X of every $100") is the answer-first hero; the neighbours benchmark
 * proves it high; the SUBTYPE DRILL is the richness lever; the WherePays leaderboard
 * is the commercial heart. Composed from the shared spine kit + page-local forms
 * (forms.tsx) + the where-pays client island.
 *
 * Body/route split (Phase B): this file holds the whole page body as the named
 * export SpineIndustryBody, so the live industry route can mount it with real data
 * (buildSpineIndustrySeed) while the thin dev route (page.tsx) renders it with the
 * bundled seed. Next forbids arbitrary named exports + custom props on a route file,
 * so the body lives here (a plain module) and page.tsx re-exports it as the default.
 * The default binding is the bundled spine seed, so the dev route stays byte-identical.
 *
 * NULL-GUARDS (real-data promotion): every card early-returns null when its data is
 * absent, so an omitted field renders NOTHING (never 0 / undefined / NaN / a broken
 * block). Demand guards the whole card down to the surviving AOV; CapitalPayback,
 * BreakEven, Seasonality, Ramp self-omit; Operator drops the sale-multiple fact when
 * absent; WherePaysExplorer hides its subtype-filter chips when the formats carry no
 * real rent_sensitivity (nothing re-ranks, so the chrome is dropped). The full seed
 * carries every field, so with it these guards never fire and the dev route is
 * unchanged.
 *
 * PAGE-LEVEL HIERARCHY (3 hero reads outweigh the rest): Margin Index masthead,
 * WherePays leaderboard, and the Subtype drill carry the most weight.
 */
import * as React from "react";
import { spineIndustrySeed } from "@/lib/spine-seeds";
import { Fig, Meter, Bullets, InfoTip, InlineDisclosure, Movement, Box, Rail, Spark, Timeline, StackBar, Full, Even, WideRail, Narrow, TERRA, TRACK, usd, type TLPhase, type TLNode } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";
import { WherePaysExplorer } from "./where-pays";
import { MarginLadder, SurvivalCurve, SeasonRibbon, RangeBracket, CountFig } from "./forms";
import { deriveSubtypes } from "./subtypes";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

/* count words shared by the count-derived sentences (kept in the component, never the seed) */
const COUNT_WORD: Record<number, string> = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven" };

/* glossTerm , attach the kit InfoTip after the FIRST occurrence of a jargon term inside
 * seed prose (rule 24: teach as you inform). Returns the text untouched when the term is
 * absent, so real-data prose that never says the word never grows a stray "?". */
function glossTerm(text: string | undefined, term: string, gloss: string): React.ReactNode {
  if (!text) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return text;
  const end = i + term.length;
  return <>{text.slice(0, end)}<InfoTip gloss={gloss} />{text.slice(end)}</>;
}
const GLOSS_COVERS = "Seated customers served; a table of four is four covers.";
const GLOSS_ROTA = "The staff shift plan.";
const GLOSS_PRIME_COST = "Food and labour together, the two big controllable costs.";
const GLOSS_UTILISATION = "Share of a typical day's trade.";

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
  if (!v.close) return null;
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
 * focal: the lollipop dots on one shared $ scale, the self trade lit.
 * width: Full (T1), a ranked distribution; rows render UNLINKED (plain spans) until
 *   those trade pages exist , no dead hrefs (real links only).
 * terracotta: the self dot only.
 * idiom: dot-on-a-track lollipop (1 of 2). Slate = modeled atlas trades only. */
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
        <Rail icon="benchmark" kicker="Against the trades next door" verdict={b.verdict} />
        <div className="space-y-1.5">
          {trades.map((t) => {
            const pos = (t.keeps_per_100 / max) * 100;
            const self = !!t.self;
            return (
              <div key={t.slug} className="-mx-2 grid grid-cols-[110px_1fr_40px] items-center gap-3 rounded-md px-2 py-1.5">
                <span className={`min-w-0 truncate text-[12.5px] ${self ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`} title={t.name}>{t.name}</span>
                <div className="relative h-3 min-w-0" role="img" aria-label={`${t.name} keeps $${t.keeps_per_100} per $100`}>
                  <div className="absolute top-1/2 h-px w-full -translate-y-1/2" style={{ background: "#e7e2df" }} />
                  <div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ left: 0, width: `${pos}%`, background: self ? TERRA : "#d4cdc8" }} />
                  <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos}%`, background: self ? TERRA : "#9a938e", boxShadow: "0 0 0 1px #e7e2df" }} />
                </div>
                <Fig className={`text-right text-[13px] ${self ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>${t.keeps_per_100}</Fig>
              </div>
            );
          })}
        </div>
        {trades.some((t) => t.why) ? (
          <InlineDisclosure name="bench" summary="Why each neighbour keeps what it keeps">
            <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
              {trades.map((t) => (
                <div key={t.slug} className="grid grid-cols-[110px_1fr] items-baseline gap-3 py-2">
                  <span className="text-[12px] font-medium text-[var(--c-ink)]">{t.name} <Fig className="text-[var(--c-muted)]">${t.keeps_per_100}</Fig></span>
                  <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{t.why}</span>
                </div>
              ))}
            </div>
          </InlineDisclosure>
        ) : null}
        {(b.avg_note || b.note) ? <div className="mt-2.5 text-[11px] leading-snug text-[var(--c-muted)]">{b.avg_note} {b.note}</div> : null}
      </Box>
    </Full>
  );
}

/* ============================================================
 * DEMAND , the appetite drawn + the crowd sharing it. On real-data promotion only the
 * spend-per-head (AOV) survives with an honest source; the demand trend Spark, the
 * visits-a-year, and the saturation venues-per-10k are OMITTED (no honest source), so
 * the whole card guards down to the one figure it can defend, or renders nothing.
 * decision: what a diner is worth per visit. Number: spend per head.
 * focal: the spend-per-head figure. terracotta: none on the surface when the trend is gone. */
function Demand({ d }: { d: any }) {
  const dm = d.demand ?? {};
  const trend: number[] = dm.trend_index ?? [];
  const trendEnd = trend.length ? trend[trend.length - 1] : null;
  const hasTrend = trend.length > 1;
  const hasSpend = typeof dm.spend_per_head_usd === "number";
  const hasVisits = typeof dm.purchases_per_year === "number";
  const hasSaturation = typeof dm.venues_per_10k === "number";
  // Guard the whole chapter when nothing honest survives (no appetite figure and no
  // saturation read): render nothing rather than an empty rail.
  if (!hasTrend && !hasSpend && !hasVisits && !hasSaturation) return null;
  // The appetite half needs at least one appetite figure (trend / spend / visits) to
  // earn its box; the saturation half needs the venues figure.
  const hasAppetite = hasTrend || hasSpend || hasVisits;
  // Trend direction from the REAL sign of the series (last minus first), carried by the
  // matching functional mark beside the end figure.
  const trendDelta = hasTrend ? trend[trend.length - 1] - trend[0] : 0;
  const trendMark = trendDelta > 0 ? "trend-rising" : trendDelta < 0 ? "trend-falling" : "trend-flat";
  // Start / end year labels under the Spark, derived from the seed's as_of (the series
  // ends at the as_of year and runs one point per year). Guarded: no honest year, no labels.
  const asOf: unknown = dm._meta?.as_of ?? d.meta?.as_of;
  const endYear = typeof asOf === "string" ? parseInt(asOf.slice(0, 4), 10) : NaN;
  const startYear = Number.isFinite(endYear) ? endYear - (trend.length - 1) : NaN;
  const appetiteBox = hasAppetite ? (
    <Box className="flex flex-col justify-center">
      <Rail icon="spending-power" kicker="The appetite, across the markets the atlas covers" verdict={hasTrend ? dm.trend_verdict : dm.spend_verdict} />
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        {hasTrend ? (
          <div className="min-w-0">
            <div className="flex items-end gap-2.5">
              <Spark values={trend} w={172} h={46} />
              {trendEnd != null ? (
                <span className="flex items-baseline gap-1"><Fig className="text-[26px] leading-none text-[var(--c-ink)]">{trendEnd}</Fig><span className="text-[10.5px] text-[var(--c-muted)]">of 100</span><AtlasMark id={trendMark} size={14} className="self-center" /></span>
              ) : null}
            </div>
            {Number.isFinite(startYear) && Number.isFinite(endYear) ? (
              <div className="mt-0.5 flex justify-between text-[9px] text-[var(--c-muted)]" style={{ width: 172 }}>
                <span className="fig">{startYear}</span>
                <span className="fig">{endYear}</span>
              </div>
            ) : null}
            <div className="mt-1 text-[10px] uppercase tracking-wide text-[var(--c-muted)]">Demand, indexed to the pre-dip 100</div>
          </div>
        ) : null}
        {(hasSpend || hasVisits) ? (
          <div className={`flex gap-6 ${hasTrend ? "sm:border-l sm:border-[var(--c-border)] sm:pl-6" : ""}`}>
            {hasSpend ? (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Spend per head</div>
                <Fig className="mt-1 block text-[20px] leading-none text-[var(--c-ink)]">${dm.spend_per_head_usd}</Fig>
              </div>
            ) : null}
            {hasVisits ? (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Visits a year</div>
                <Fig className="mt-1 block text-[20px] leading-none text-[var(--c-ink)]">{dm.purchases_per_year}</Fig>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {dm.trend_note ? <div className="mt-3 border-t border-[var(--c-border)] pt-2.5 text-[11.5px] leading-snug text-[var(--c-ink2)]">{dm.trend_note}</div> : null}
    </Box>
  ) : null;
  const saturationBox = hasSaturation ? (
    <Box className="flex flex-col justify-center">
      <Rail icon="competition" kicker="Saturation" verdict={dm.verdict} />
      <div className="flex items-baseline gap-1.5"><CountFig value={dm.venues_per_10k} className="text-[40px] leading-none text-[var(--terra-text)]" /><span className="text-[12px] text-[var(--c-ink2)]">venues per 10k residents</span></div>
      {dm.venues_per_10k_band ? <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{dm.venues_per_10k_band}</div> : null}
      {dm.saturation_note ? <div className="mt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">{glossTerm(dm.saturation_note, "covers", GLOSS_COVERS)}</div> : null}
    </Box>
  ) : null;
  // Both halves present: the coherent WideRail pair (the full-seed shape). One half
  // only: render it alone at Narrow so a lone appetite figure does not sit in a
  // half-empty two-up band.
  if (appetiteBox && saturationBox) {
    return <WideRail>{appetiteBox}{saturationBox}</WideRail>;
  }
  return <Narrow>{appetiteBox ?? saturationBox}</Narrow>;
}

/* ============================================================
 * SUBTYPE DRILL , the richness lever (hero) and the chapter's ONE card: keep % (the
 * ranked bars) + capital-to-open (right-aligned column).
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
  const hasNotes = items.some((s) => s.note);
  const cols = "grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)_3.4rem_3.9rem] sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_3.4rem_4.2rem]";
  return (
    <Full>
      <Box>
        <Rail icon="subtype" kicker="The subtypes" verdict={d.subtypes?.verdict} />
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
        {hasNotes ? (
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
        ) : null}
        {d.subtypes?.note ? <div className="mt-2.5 text-[11.5px] leading-snug text-[var(--c-muted)]">{d.subtypes.note}</div> : null}
      </Box>
    </Full>
  );
}

/* ============================================================
 * MONEY SPLIT , where each $100 goes, the ONE carrier of the fixed/variable split.
 * decision: what eats the sale. Number: the kept $7 slice of the stacked $100.
 * focal: the 100%-stacked bar, ON-BAR % labels on every segment >=12%; the legend
 *   stays as the name-to-colour mapping.
 * width: Full (T1). terracotta: the kept slice only. */
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
  const hasGroups = variablePct > 0 && fixedPct > 0 && keptPct > 0;
  const hasSplitNotes = !!(ms.fixed_note || ms.variable_note);
  // The verdict names how many cost lines the owner's slice sits behind, counted
  // from the real stack (four on the full seed, three on the reconciled real stack),
  // so the sentence is honest on both and byte-identical on the dev route.
  const nonKeptCount = items.filter((i) => !i.kept).length;
  const nonKeptWord = COUNT_WORD[nonKeptCount] ?? `${nonKeptCount}`;
  return (
    <Full>
      <Box>
        <Rail icon="cost-breakdown" kicker="Where each $100 goes" verdict={`The owner's slice is what ${nonKeptWord} bigger lines leave behind.`} />
        {/* the stacked bar + the on-bar % overlay (ink on the light greys AND on the
            soft-terracotta kept slice, both AA-safe). The kept slice is the card's
            ANSWER, so it is never the one segment without a value: it labels on-bar
            regardless of the >=12% width threshold ("7%" fits 7%). */}
        <div className="relative">
          <StackBar segments={parts.map((p) => ({ label: p.name, pct: p.pct, color: p.color, kept: !!p.kept }))} sort={false} h="h-11" ariaLabel={parts.map((p) => `${p.name} ${p.pct}%`).join(", ")} legend />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex h-11 items-center">
            {parts.map((p) => (
              <span key={p.name} className="fig overflow-hidden whitespace-nowrap text-center text-[11px] font-semibold" style={{ width: `${p.pct}%`, color: "#1b1b1a", opacity: 0.8 }}>{p.pct >= 12 || p.kept ? `${p.pct}%` : ""}</span>
            ))}
          </div>
        </div>
        {/* fixed / variable bracket row , folds the old donut into an annotation over the same
            $100. Subs arrive from the seed (trade-specific copy never hardcodes here) and each
            omits when absent. Below sm the value-proportional grid becomes a wrapped flex legend
            (three label+figure+sub stacks, border-top kept); the proportional bracket holds sm+. */}
        {hasGroups ? (() => {
          const bracket: Array<{ label: string; pct: number; sub?: string }> = [
            { label: "Variable", pct: variablePct, sub: ms.variable_sub },
            { label: "Fixed", pct: fixedPct, sub: ms.fixed_sub },
            { label: "Kept", pct: keptPct, sub: ms.kept_sub },
          ];
          const cell = (b: { label: string; pct: number; sub?: string }) => (
            <>
              <span className="font-semibold uppercase tracking-wide text-[var(--c-ink2)]">{b.label} <Fig className="text-[var(--c-ink)]">{b.pct}%</Fig></span>
              {b.sub ? <span className="mt-0.5 block leading-tight text-[var(--c-muted)]">{b.sub}</span> : null}
            </>
          );
          return (
            <>
              <div className="mt-4 hidden gap-1 text-[10px] sm:grid sm:grid-cols-[var(--vc)_var(--fc)_var(--kc)]" style={{ ["--vc" as any]: `${variablePct}fr`, ["--fc" as any]: `${fixedPct}fr`, ["--kc" as any]: `${keptPct}fr` }}>
                {bracket.map((b) => <div key={b.label} className="border-t border-[var(--c-line-strong)] pt-1">{cell(b)}</div>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] sm:hidden">
                {bracket.map((b) => <div key={b.label} className="min-w-[6rem] flex-1 border-t border-[var(--c-line-strong)] pt-1">{cell(b)}</div>)}
              </div>
            </>
          );
        })() : null}
        {hasSplitNotes ? (
          <InlineDisclosure name="split-notes" summary="What is fixed, and what flexes with covers">
            <div className="mt-2 space-y-2.5 border-t border-[var(--c-border)] pt-2.5">
              {ms.fixed_note ? (
                <div className="grid grid-cols-[4.5rem_1fr] gap-3">
                  <span className="pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Fixed</span>
                  <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{ms.fixed_note}</span>
                </div>
              ) : null}
              {ms.variable_note ? (
                <div className="grid grid-cols-[4.5rem_1fr] gap-3">
                  <span className="pt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Variable</span>
                  <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{ms.variable_note}</span>
                </div>
              ) : null}
            </div>
          </InlineDisclosure>
        ) : null}
        {ms.annotation ? <div className="mt-3 text-[11.5px] leading-snug text-[var(--c-ink2)]">{ms.annotation}</div> : null}
      </Box>
    </Full>
  );
}

/* BREAK-EVEN , how full a typical day must run to clear costs (fill-bar meter).
 * decision: what share of a typical day's trade pays the nut. Number: breakeven_utilization_pct.
 * The seed field is cost_structure.breakeven_utilization_pct; if it is absent the card
 * renders nothing (never a 0). No honest per-figure source at industry altitude, so it
 * OMITS on real-data promotion.
 * focal: the utilisation figure over a filled Meter. width: WideRail rail (paired with
 * MoneySplit, the chart), no width tier of its own (S8/S9: it no longer floats alone).
 * terracotta: the meter fill only. idiom: fill-bar (1 use on the page). */
function BreakEven({ d }: { d: any }) {
  const cs = d.cost_structure ?? {};
  const be: number | null = typeof cs.breakeven_utilization_pct === "number" ? cs.breakeven_utilization_pct : null;
  if (be == null) return null;
  return (
    <Box>
      <Rail icon="break-even" kicker="Break-even utilisation" verdict="Below this share of a typical day's trade, the day loses money." />
      <div className="mb-3 flex items-baseline gap-2.5"><CountFig value={be} suffix="%" className="text-[40px] leading-none text-[var(--c-ink)]" /><InfoTip gloss={GLOSS_UTILISATION} /></div>
      <Meter value={be} left="empty" right="a typical day" />
      {cs.note ? <div className="mt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">{cs.note}</div> : null}
    </Box>
  );
}

/* ============================================================
 * RAMP , the realistic first year on one time axis (Timeline, one use).
 * decision: how long to break even, and the cash gap to survive. focal: the Timeline.
 * No honest ramp source at industry altitude, so it OMITS on real-data promotion.
 * width: Full (T1). terracotta: the break-even node (atom-owned). */
function Ramp({ d }: { d: any }) {
  const fy = d.first_year ?? {};
  const phases: TLPhase[] = (fy.phases ?? []) as TLPhase[];
  // P5 overlap fix: the two ABOVE-axis node subs ("Cash gap opens" / "Year one done")
  // print over the phase-band captions, so drop those two subs (their claims already
  // live on the read line and the survival chapter). The below-axis subs stay.
  const NO_SUB = new Set(["Cash gap opens", "Year one done"]);
  const nodes: TLNode[] = ((fy.nodes ?? []) as TLNode[]).map((n) => (NO_SUB.has(n.label) ? { ...n, sub: undefined } : n));
  if (!nodes.length) return null;
  return (
    <Full>
      <Rail icon="first-year" kicker="The first year, month by month" verdict={glossTerm(fy.verdict, "rota", GLOSS_ROTA)} />
      <Timeline span={fy.span ?? 52} unit={fy.unit ?? "week"} phases={phases} nodes={nodes} startLabel="open" read={fy.note} />
    </Full>
  );
}

/* OPERATOR , what a typical owner walks away with (a DIFFERENT cut from the hero
 * margin ladder: durability + exit, not the gross->net collapse restated).
 * decision: what a typical owner actually sees. Numbers: the three facts (capital,
 *   survival, sale multiple) promoted to the card's figures; the owner-keeps lockup is
 *   GONE (it was the hero number's 5th appearance). Verdict line above, seed note below.
 * On real-data promotion the sale-multiple fact OMITS (no honest source); each held
 * fact is guarded so the strip never prints "x undefined" or a bare "%".
 * width: WideRail (T2) chart half. terracotta: none; the facts read in ink. */
function Operator({ d }: { d: any }) {
  const o = d.operator ?? {};
  const facts: Array<[string, string]> = [];
  if (typeof o.capital_to_open_usd === "number") facts.push([money(o.capital_to_open_usd), "to open"]);
  if (typeof o.survival_1yr_pct === "number") facts.push([`${o.survival_1yr_pct}%`, "survive yr 1"]);
  if (typeof o.sale_multiple_low === "number" && typeof o.sale_multiple_high === "number") {
    facts.push([`x${o.sale_multiple_low}-${o.sale_multiple_high}`, "profit at sale"]);
  }
  // Nothing honest to show: no support fact survives.
  if (facts.length === 0) return null;
  const factCols = facts.length >= 3 ? "grid-cols-3" : facts.length === 2 ? "grid-cols-2" : "grid-cols-1";
  return (
    <Box>
      <Rail icon="who-for" kicker="The typical operator" verdict={o.verdict} />
      <div className={`grid ${factCols} divide-x divide-[var(--c-border)] border-t border-[var(--c-border)] pt-3`}>
        {facts.map(([val, l]) => <div key={l} className="px-3 first:pl-0 last:pr-0"><Fig className="text-[24px] text-[var(--c-ink)]">{val}</Fig><div className="mt-0.5 text-[10.5px] leading-tight text-[var(--c-muted)]">{l}</div></div>)}
      </div>
      {o.note ? <p className="mt-4 text-[11.5px] leading-snug text-[var(--c-muted)]">{o.note}</p> : null}
    </Box>
  );
}

/* CAPITAL PAYBACK , how long the fit-out takes to return + the gearing depth (Pro-ish).
 * decision: when does the cash come back, and what does debt do to it. Number: payback months.
 * Needs a single-place take-home + an authored gearing model, neither of which exists at
 * industry altitude, so the whole card OMITS on real-data promotion (guards on d.payback).
 * focal: the payback figure over a range BRACKET. width: WideRail rail. */
function CapitalPayback({ d }: { d: any }) {
  const p = d.payback;
  if (!p || typeof p.payback_months !== "number") return null;
  const lo = p.low_months ?? 0, hi = p.high_months ?? 1, mid = p.payback_months ?? 0;
  const hasGearing = typeof p.unlevered_keep_pct === "number" && typeof p.levered_keep_pct === "number";
  return (
    <Box className="flex flex-col justify-center">
      <Rail icon="startup-cost" kicker="Payback window" verdict={p.verdict} />
      <div className="mb-1 flex items-baseline gap-2.5"><CountFig value={mid} className="text-[40px] leading-none text-[var(--terra-text)]" /><span className="text-[13px] text-[var(--c-ink2)]">months to return the <Fig className="text-[var(--c-ink)]">{money(p.capital_usd ?? 0)}</Fig> opening cost.</span></div>
      <RangeBracket lo={lo} hi={hi} mid={mid} unit="mo" midLabel={`${mid} mo`} accent={false} />
      {p.note ? <div className="mt-2 text-[11.5px] leading-snug text-[var(--c-muted)]">{p.note}</div> : null}
      {hasGearing ? (
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
          {p.gearing_note ? <p className="mt-2 text-[11.5px] leading-snug text-[var(--c-ink2)]">{p.gearing_note}</p> : null}
        </InlineDisclosure>
      ) : null}
    </Box>
  );
}

/* SURVIVAL , how many last, as a decay CURVE on a zero baseline.
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
      <Rail icon="myth-reality" kicker="Five-year survival" verdict={s.verdict} />
      <SurvivalCurve curve={curve} note={s.note} />
    </Box>
  );
}

/* WHO IT SUITS , two columns: suits / think twice.
 * decision: is this operator you. focal: the two bullet columns as a contrast.
 * width: Even (T3), paired with survival. terracotta: the "suits" dots only. */
function WhoItSuits({ d }: { d: any }) {
  const w = d.who_suits ?? {};
  const suits: string[] = w.suits ?? [];
  const thinkTwice: string[] = w.think_twice ?? [];
  if (!suits.length && !thinkTwice.length) return null;
  return (
    <Box>
      <Rail icon="who-for" kicker="Who it suits" verdict={w.verdict} />
      <div className="grid gap-5 sm:grid-cols-2">
        {suits.length ? (
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">Suits</div>
            <Bullets items={suits} />
          </div>
        ) : null}
        {thinkTwice.length ? (
          <div className={suits.length ? "sm:border-l sm:border-[var(--c-border)] sm:pl-5" : ""}>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Think twice</div>
            <ul className="space-y-2">{thinkTwice.map((t: string, i: number) => <li key={i} className="relative pl-4 text-[12.5px] leading-snug text-[var(--c-ink2)]"><span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full border border-[var(--c-line-strong)]" />{t}</li>)}</ul>
          </div>
        ) : null}
      </div>
    </Box>
  );
}

/* ============================================================
 * SEASONALITY , the year's shape as a single area RIBBON.
 * decision: when the cash comes and when it is tight. focal: the ribbon over 12 months.
 * No honest monthly source at industry altitude, so it OMITS on real-data promotion.
 * width: the chart half of a WideRail (T2), paired with Caveats.
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
      {se.note ? <div className="mt-2 text-[11.5px] leading-snug text-[var(--c-muted)]">{se.note}</div> : null}
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
      {/* kit-Bullets markup, rendered locally so the "prime cost" jargon can carry its
          InfoTip gloss at first use (glossTerm no-ops on myths that never say it) */}
      {myths.length ? (
        <ul className="space-y-2">
          {myths.map((t, i) => (
            <li key={i} className="relative pl-4 text-[12.5px] leading-snug text-[var(--c-ink2)]">
              <span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full" style={{ background: "#c9c9c9" }} />
              {glossTerm(t, "prime cost", GLOSS_PRIME_COST)}
            </li>
          ))}
        </ul>
      ) : null}
      {c.honest_take ? <p className="mt-3 border-t border-[var(--c-border)] pt-3 text-[12.5px] leading-snug text-[var(--c-ink2)]">{c.honest_take}</p> : null}
    </Box>
  );
}

/* CLOSE , a deliberate full-width capstone: a three-point recap of the page's verdict
 * (the keep, the format that keeps most, the place that keeps most) then the one next action.
 * focal: the CTA. terracotta: the $-kept recap figure only (the page's answer restated);
 * the other recap figures read bold ink so the band carries ONE accent plus the button. */
function Close({ d }: { d: any }) {
  const mi = d.margin_index ?? {};
  const subs = deriveSubtypes(d).slice().sort((a, b) => b.keeps_pct - a.keeps_pct);
  const topFormat = subs[0];
  const places: any[] = (d.where_pays?.places ?? []).slice().sort((a: any, b: any) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0));
  const topPlace = places[0];
  // The keep recap label earns its words: read against the real all-trades average when
  // the benchmark carries one, else the plain fallback.
  const avg = d.benchmark?.all_trades_avg;
  const keepLabel = typeof avg === "number" && avg > 0
    ? `kept per $100, versus $${avg} for the typical trade`
    : "kept per $100, a thin keep won on volume";
  const recap: Array<[React.ReactNode, string, boolean]> = [
    ...(typeof mi.keeps_per_100 === "number" ? [[<>${mi.keeps_per_100}</>, keepLabel, true] as [React.ReactNode, string, boolean]] : []),
    ...(topFormat ? [[<>{topFormat.name}</>, `the format that keeps most, about ${topFormat.keeps_pct.toFixed(1)}%`, false] as [React.ReactNode, string, boolean]] : []),
    ...(topPlace ? [[<>{topPlace.name}</>, `keeps most of the modelled cities, ${topPlace.net_margin_pct}% net`, false] as [React.ReactNode, string, boolean]] : []),
  ];
  const recapCols = recap.length >= 3 ? "sm:grid-cols-3" : recap.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
  return (
    <Full>
      <Box>
        <Rail icon="bookmark" kicker="The close" verdict={d.close?.verdict} />
        {recap.length ? (
          <div className={`grid gap-4 ${recapCols}`}>
            {recap.map(([fig, label, accent], i) => (
              <div key={i} className="border-t border-[var(--c-line-strong)] pt-2.5">
                <div className={`fig text-[22px] leading-none ${accent ? "text-[var(--terra-text)]" : "font-bold text-[var(--c-ink)]"}`}>{fig}</div>
                <div className="mt-1 text-[11.5px] leading-snug text-[var(--c-muted)]">{label}</div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="mt-5 flex flex-col items-center gap-3 border-t border-[var(--c-border)] pt-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="text-[14px] leading-snug text-[var(--c-ink)]">See {d.meta?.name?.toLowerCase()} in a specific city, with the local rent, wages and take-home.</div>
          {/* the alt-city mark says what the button opens (city-level pages); its strokes
              are var(--c-ink), so remap that var to currentColor inside the dark pill */}
          <a href="/dev/spine-city" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[var(--terra-text)]">
            <span style={{ ["--c-ink" as any]: "currentColor" }} className="inline-flex"><AtlasMark id="alt-city" size={14} /></span>
            Pick a place
          </a>
        </div>
      </Box>
    </Full>
  );
}

/**
 * The industry spine page body. `data` defaults to the bundled illustrative seed so
 * the dev route (page.tsx) renders it unchanged; the live route passes the real-data
 * seed from buildSpineIndustrySeed. Every card null-guards its own data, so an omitted
 * field renders nothing while the full seed is byte-identical to the pre-split page.
 */
export function SpineIndustryBody({ data = spineIndustrySeed }: { data?: any } = {}) {
  const d = data ?? spineIndustrySeed;

  // Chapter-presence reads (mirror each card's own null-guard) so a Movement header
  // never floats over an empty chapter, and a half-omitted WideRail pair degrades to
  // the survivor at Full width (never a blank half-row), the way Demand already does.
  const dm = d.demand ?? {};
  const hasDemand = (dm.trend_index ?? []).length > 1 || ["spend_per_head_usd", "purchases_per_year", "venues_per_10k"].some((k) => typeof dm[k] === "number");
  const hasBenchmark = (d.benchmark?.trades ?? []).length > 0;
  const subCount = deriveSubtypes(d).length;
  const hasMoneySplit = (d.money_split?.items ?? []).length > 0;
  const hasBreakEven = typeof d.cost_structure?.breakeven_utilization_pct === "number";
  const hasRamp = (d.first_year?.nodes ?? []).length > 0;
  const o = d.operator ?? {};
  const hasOperator = typeof o.capital_to_open_usd === "number" || typeof o.survival_1yr_pct === "number" || (typeof o.sale_multiple_low === "number" && typeof o.sale_multiple_high === "number");
  const hasPayback = typeof d.payback?.payback_months === "number";
  const hasSurvival = [d.survival?.yr1_pct, d.survival?.yr3_pct, d.survival?.yr5_pct].some((v) => typeof v === "number");
  const hasWhoSuits = (d.who_suits?.suits ?? []).length > 0 || (d.who_suits?.think_twice ?? []).length > 0;
  const hasWherePays = (d.where_pays?.places ?? []).length > 0;
  const hasSeasonality = (d.seasonality?.months ?? []).length >= 2;
  const hasCaveats = (d.caveats?.myths ?? []).length > 0 || !!d.caveats?.honest_take;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <Masthead d={d} />
      <div className="mt-8"><VerdictLede d={d} /></div>

      {hasBenchmark ? <>
        <Movement index="01" eyebrow="Against the neighbours" heading="The keep, against the trades next door" icon="benchmark" />
        <Benchmark d={d} />
      </> : null}

      {hasDemand ? <>
        <Movement index="02" eyebrow="The demand" heading="The appetite, and the crowd sharing it" icon="spending-power" />
        <Demand d={d} />
      </> : null}

      {subCount > 0 ? <>
        <Movement index="03" eyebrow="The subtypes" heading={`One trade, ${COUNT_WORD[subCount] ?? subCount} different bets`} icon="subtype" />
        <SubtypeDrill d={d} />
      </> : null}

      {hasMoneySplit || hasBreakEven ? <>
        <Movement index="04" eyebrow="How the money works" heading="The shape of the trade" icon="unit-economics" />
        <WideRail>
          <MoneySplit d={d} />
          <BreakEven d={d} />
        </WideRail>
      </> : null}

      {hasRamp || hasOperator || hasPayback || hasSurvival || hasWhoSuits ? <>
        <Movement index="05" eyebrow="The typical operator" heading="The owner's take, and the odds" icon="who-for" />
        <div className="space-y-6">
          <Ramp d={d} />
          {hasOperator && hasPayback
            ? <WideRail><Operator d={d} /><CapitalPayback d={d} /></WideRail>
            : hasOperator || hasPayback
              ? <Full>{hasOperator ? <Operator d={d} /> : <CapitalPayback d={d} />}</Full>
              : null}
          <Even><Survival d={d} /><WhoItSuits d={d} /></Even>
        </div>
      </> : null}

      {hasWherePays || hasSeasonality || hasCaveats ? <>
        <Movement index="06" eyebrow="Where it pays best" heading="The same trade, place by place" icon="where-it-pays" />
        <div className="space-y-6">
          <WherePaysExplorer d={d} />
          {hasSeasonality && hasCaveats
            ? <WideRail><Seasonality d={d} /><Caveats d={d} /></WideRail>
            : hasSeasonality || hasCaveats
              ? <Full>{hasSeasonality ? <Seasonality d={d} /> : <Caveats d={d} />}</Full>
              : null}
        </div>
      </> : null}

      <Movement index="07" eyebrow="The close" heading="The next move" icon="bookmark" />
      <Close d={d} />
    </main>
  );
}
