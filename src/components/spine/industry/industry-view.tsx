/**
 * Industry page (a trade across places) , SPINE rebuild BODY. Leg 4.
 * The cross-geography "can I make money doing Y" decision engine. The Margin Index
 * ("keeps $X of every $100") is the answer-first hero; the neighbours benchmark
 * proves it high; the SUBTYPE DRILL is the richness lever; the WherePays list keeps
 * the trade grounded place by place (rent-load facts + city links only, founder D3
 * 2026-07-11: per-city net margin for one trade is unknowable, rulebook v1 §5).
 * Composed from the shared spine kit + page-local forms (forms.tsx) + where-pays.
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
 * absent; WherePaysExplorer self-omits when no place carries a rent_load_pct (its
 * only remaining figure).
 *
 * PAGE-LEVEL HIERARCHY (3 hero reads outweigh the rest): Margin Index masthead,
 * the $100 money split, and the Subtype drill carry the most weight.
 */
import * as React from "react";
import { spineIndustrySeed } from "@/lib/spine-seeds";
import { timeToOpenWeeks } from "@/lib/markets/opening_archetypes";
import { Fig, Meter, Bullets, InfoTip, InlineDisclosure, Movement, Box, Rail, PhaseBar, StackBar, Full, Even, WideRail, TERRA, GREY_RAMP, usd, SampleTag } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const mi = d.margin_index ?? {}; const m = d.margins ?? {};
  return (
    <section className="pt-4 md:pt-6">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="fig text-[length:var(--t-body)] font-semibold text-[var(--c-muted)]">00</span>
      </div>
      <h1 data-typography="custom" className="text-[2.1rem] font-semibold leading-[1.05] tracking-tight text-[var(--c-ink)] md:text-[2.75rem]">{d.meta?.name}</h1>
      <div className="mt-5 grid gap-5 md:grid-cols-[1.35fr_1fr] md:items-center">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <CountFig value={mi.keeps_per_100} prefix="$" className="text-[30px] leading-[0.9] text-[var(--terra-text)] md:text-[48px]" />
            <span className="max-w-[22rem] text-[length:var(--t-sub)] leading-snug text-[var(--c-ink2)]">kept by the owner from every <Fig className="text-[var(--c-ink)]">$100</Fig> a customer spends.</span>
          </div>
        </div>
        {/* the margin ladder: the gross-to-net collapse, seen as three shrinking bars */}
        <Box>
          <div className="mb-3 flex items-center gap-2"><span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">The margin ladder</span><SampleTag /></div>
          <MarginLadder gross={m.gross_pct} operating={m.operating_pct} net={m.net_pct} />
        </Box>
      </div>
      <p className="mt-4 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{d.provenance_line}</p>
    </section>
  );
}


/* ============================================================
 * BENCHMARK , the "vs the neighbours" USP, proving $7 is low (moved up, top 20%)
 * decision: is $7 actually low? Number: restaurants vs the food trades next door.
 * focal: the lollipop dots on one shared $ scale, the self trade lit.
 * width: Full (T1), a ranked distribution; rows render UNLINKED (plain spans) until
 *   those trade pages exist , no dead hrefs (real links only).
 * terracotta: the self dot only.
 * idiom: dots on one shared $ scale, NO filled track (the July-3 lollipop, de-barred
 *   per rulebook v1 §25 bar rationing). Slate = modeled atlas trades only. */
export function Benchmark({ d }: { d: any }) {
  const b = d.benchmark ?? {};
  const trades: any[] = (b.trades ?? []).slice().sort((a: any, c: any) => c.keeps_per_100 - a.keeps_per_100);
  if (!trades.length) return null;
  // The broad all-trades average lands as a DRAWN reference tick on the same shared $ scale
  // (never a prose sentence): the food dots cluster low and the tick sits visibly right of
  // them, so the gap to the whole-universe average is read, not told. The domain stretches
  // to include the tick so it never falls off the axis.
  const avg: number | null = typeof b.all_trades_avg === "number" ? b.all_trades_avg : null;
  const max = Math.max(...trades.map((t) => t.keeps_per_100), avg ?? 0) * 1.12;
  return (
    <Full>
      <Box>
        <Rail icon="benchmark" kicker="Kept per $100, by trade" verdict={b.verdict} sample />
        <div className="space-y-1.5">
          {trades.map((t) => {
            const pos = (t.keeps_per_100 / max) * 100;
            const self = !!t.self;
            return (
              /* THREE FAULTS ON ONE ROW.
                 THE NAME WAS CUT AND THE REST HIDDEN BEHIND A HOVER. It was
                 clipped to a fixed 110 pixels with the full text moved into a
                 tooltip, which is not a carrier on a phone at all: there is no
                 hover on a touch screen, so the end of a trade name simply did
                 not exist for the reader most likely to be holding one. It wraps
                 now, and the tooltip is gone with the need for it.
                 THE SCALE HAD FIFTY-EIGHT PIXELS ON A PHONE. A fixed 110 for the
                 name and 40 for the figure leaves the drawing almost nothing on a
                 320 screen. Below the breakpoint the scale takes its own
                 full-width line under the name and its figure, the same shape the
                 pay brackets now use.
                 THE DOT WAS A WARM GREY. #9a938e is warmer in red than in blue,
                 on a palette whose rule is terracotta plus STRICTLY COOL
                 neutrals. Replaced by the cool neutral of the same weight, which
                 is also a token rather than a literal. */
              <div key={t.slug} className="-mx-2 grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-2 rounded-md px-2 py-1.5 sm:grid-cols-[minmax(0,110px)_1fr_40px] sm:items-center sm:gap-3">
                <span className={`min-w-0 leading-tight text-[length:var(--t-body)] ${self ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{t.name}</span>
                <Fig className={`order-2 text-right text-[length:var(--t-body)] sm:order-3 ${self ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>${t.keeps_per_100}</Fig>
                <div className="relative order-3 col-span-2 h-3 min-w-0 sm:order-2 sm:col-span-1" role="img" aria-label={`${t.name} keeps $${t.keeps_per_100} per $100`}>
                  <div className="absolute top-1/2 h-px w-full -translate-y-1/2" style={{ background: "var(--c-border)" }} />
                  <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos}%`, background: self ? TERRA : "var(--chart-4)", boxShadow: "0 0 0 1px var(--c-border)" }} />
                </div>
              </div>
            );
          })}
          {/* the all-trades average as a drawn reference tick on the SAME scale (a vertical
              rule, not a filled dot, so it never reads as one of the food trades). */}
          {avg != null ? (
            <div className="-mx-2 mt-1 grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-2 rounded-md border-t border-[var(--c-border)] px-2 pt-2.5 sm:grid-cols-[minmax(0,110px)_1fr_40px] sm:items-center sm:gap-3">
              {/* the reference is the WHOLE atlas (not just these four food trades), so it
                  is labeled "incl. non-food": that is why the tick can sit right of every
                  food dot without reading as "the average of its own parts". */}
              <span className="flex min-w-0 flex-col leading-tight text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">
                <span className="font-semibold">All trades</span>
                <span className="font-normal normal-case tracking-normal opacity-80">incl. non-food</span>
              </span>
              <Fig className="order-2 text-right text-[length:var(--t-body)] text-[var(--c-muted)] sm:order-3">${avg}</Fig>
              <div className="relative order-3 col-span-2 h-3.5 sm:order-2 sm:col-span-1" role="img" aria-label={`All trades average, including non-food trades, keeps $${avg} per $100`}>
                <div className="absolute top-1/2 h-px w-full -translate-y-1/2" style={{ background: "var(--c-border)" }} />
                <div className="absolute top-0 h-3.5 w-px -translate-x-1/2" style={{ left: `${(avg / max) * 100}%`, background: "var(--chart-4)" }} />
              </div>
            </div>
          ) : null}
        </div>
        {trades.some((t) => t.why) ? (
          <InlineDisclosure name="bench" summary="Why each neighbour keeps what it keeps">
            <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
              {trades.map((t) => (
                <div key={t.slug} className="grid grid-cols-[110px_1fr] items-baseline gap-3 py-2">
                  <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{t.name} <Fig className="text-[var(--c-muted)]">${t.keeps_per_100}</Fig></span>
                  <span className="text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{t.why}</span>
                </div>
              ))}
            </div>
          </InlineDisclosure>
        ) : null}
      </Box>
    </Full>
  );
}

/* ============================================================
 * DEMAND , what a customer is worth per visit. The multi-year "demand index" area-line
 * is REMOVED: it was an off-catalog chart stand-in on a faked zero baseline, and its
 * pandemic-recovery arc failed the universality test (false for grocery / pharmacy).
 * The saturation venues-per-10k half stays DELETED (rulebook v1 §5, founder G8: a
 * derived "crowding" score has no statistical basis). What remains is honest and
 * universal: spend per head + visits a year, as plain figures behind a SampleTag.
 * decision: what a diner is worth per visit. Number: spend per head (the terra focal).
 * width: Full (T1); the two figures split the band so nothing floats centered. */
export function Demand({ d }: { d: any }) {
  const dm = d.demand ?? {};
  const hasSpend = typeof dm.spend_per_head_usd === "number";
  const hasVisits = typeof dm.purchases_per_year === "number";
  if (!hasSpend && !hasVisits) return null;
  /* TWO COLUMNS ONLY WHEN THERE ARE TWO FIGURES.
     The live page supplies the spend figure and nothing else: the visits figure
     is deliberately omitted upstream for want of an honest source. The band was
     splitting into two halves regardless, so a reader on a real trade page got
     one figure sitting in the left half of a full-width band with the right half
     empty, and a dividing rule drawn down the middle of nothing. */
  const both = hasSpend && hasVisits;
  return (
    <Full>
      <Box>
        <Rail icon="spending-power" kicker="What a customer spends" sample />
        <div className={`grid gap-5 border-t border-[var(--c-border)] pt-4${both ? " sm:grid-cols-2 sm:divide-x sm:divide-[var(--c-border)]" : ""}`}>
          {hasSpend ? (
            <div className={both ? "sm:pr-6" : ""}>
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Spend per head</div>
              <div className="mt-1.5 flex items-baseline gap-2"><CountFig value={dm.spend_per_head_usd} prefix="$" className="text-[length:var(--t-focal)] leading-none text-[var(--terra-text)]" /><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">per visit</span></div>
            </div>
          ) : null}
          {hasVisits ? (
            <div className={both ? "sm:pl-6 sm:text-right" : ""}>
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Visits a year</div>
              {/* the support figure: half the size of the spend focal (rule 16 >=1.6 contrast,
                  so the single terracotta accent sits on ONE dominant answer, not one of two
                  equal siblings) and right-aligned so it fills the band's right edge (rule 17). */}
              <div className="mt-1.5 flex items-baseline gap-2 sm:justify-end"><CountFig value={dm.purchases_per_year} className="text-[length:var(--t-sub)] leading-none text-[var(--c-ink)]" /><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">per diner</span></div>
            </div>
          ) : null}
        </div>
        {dm.demand_note ? (
          <InlineDisclosure name="demand-why" summary="What moves demand">
            <p className="mt-2 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{dm.demand_note}</p>
          </InlineDisclosure>
        ) : null}
      </Box>
    </Full>
  );
}

/* ============================================================
 * SUBTYPE DRILL , the richness lever (hero) and the chapter's ONE card: a plain ranked
 * TABLE (format | keep % | capital to open), the July-3 figures-and-columns treatment.
 * The ranked track+fill bars are gone (rulebook v1 §25 bar rationing: a third bar list
 * in a row read as monotony; the figures rank themselves).
 * decision: which FORMAT to run, and what each door costs. Numbers: keep % (one decimal
 * everywhere) + capital-to-open (right-aligned column).
 * focal: the keep-% column, sorted best-first; format, not cuisine, moves the keep.
 * width: Full (T1). terracotta: the leading (best-keep) figure only; the cost column stays ink.
 * Reads the derived subtype shape (keeps_pct + capital_usd) via deriveSubtypes. */
export function SubtypeDrill({ d }: { d: any }) {
  const items = deriveSubtypes(d).slice().sort((a, b) => b.keeps_pct - a.keeps_pct);
  if (!items.length) return null;
  const lead = items[0]?.slug;
  // A skimmable three-column table (the founder's numbers-only "best-executed" table
  // idiom): the format, its keep, and the cost of the door. The prose "why it lands
  // there" column is cut (rule 26/19: no invented per-row sentences); the keep figures
  // rank themselves, sorted best-first with terracotta on the leader. No bar (the page
  // is at its 3-bar budget). The scope caveat lives in the Keep header's gloss.
  return (
    <Full>
      <Box>
        {/* "Trades next door", NOT "by format". These rows are the exact array
            `benchmark.trades` carries minus the self row: measured 2026-08-18,
            identical in 23 of the 23 seeds that hold either, and confirmed here
            on the real restaurants seed. One array, shipped twice, and its two
            consumers labelled it incompatibly. `benchmark` said "a neighbour in
            the same sector", which is true; this said "by format", which
            asserts a containment the taxonomy does not have.

            `Industry` has no parent-child relation, and the siblings come from
            eight hardcoded food-service ids, so grocery-stores,
            specialty-grocers-delis and wine-liquor-stores each received the
            SAME six rows. Those three pages were telling a reader that
            restaurants, bars and food trucks are formats inside a grocery
            store. Restaurants is the one trade where "format" happens to read
            true, which is why this survived.

            The FIELD stays `subtypes`: renaming it from here empties this
            block, which is a section drop. The labels are what a reader sees
            and they are what was false. */}
        <Rail icon="subtype" kicker="Keep and cost, trades next door" sample />
        {/* A REAL TABLE. This is trades down the side and two measures across the
            top, with a header row, and it was built out of plain boxes on a grid:
            ZERO table elements, no column headers, nothing tying a figure to the
            word naming it. Worse than the comparison table on the trade-in-a-place
            page, which at least carried a hidden label beside each figure for the
            phone layout; this had none at all, at any width. So the whole reading
            was a trade name followed by two bare numbers.
            The columns also carried FIXED widths that changed at a breakpoint. The
            two figure columns size to their own contents now, which needs no
            breakpoint and cannot crush a longer figure. */}
        <Table className="text-[length:var(--t-body)]">
          <caption className="sr-only">
            Trades next door, sorted by what the owner keeps, best first.
          </caption>
          <TableHeader>
            <TableRow className="border-[var(--c-border)] hover:bg-transparent">
              <TableHead scope="col" className="h-auto px-2 pb-1.5 text-left align-bottom text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Trade, best keep first
              </TableHead>
              <TableHead scope="col" className="h-auto w-px whitespace-nowrap px-2 pb-1.5 text-right align-bottom text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Keep<InfoTip gloss="Registered operators only; street and informal traders run on different economics and are not counted here." />
              </TableHead>
              <TableHead scope="col" className="h-auto w-px whitespace-nowrap px-2 pb-1.5 text-right align-bottom text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                To open
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s) => {
              const isLead = s.slug === lead;
              return (
                <TableRow key={s.slug} className="hov border-0 hover:bg-transparent">
                  <TableHead scope="row" className="h-auto min-w-0 px-2 py-2 text-left align-baseline text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">
                    {s.name}
                  </TableHead>
                  <TableCell className="w-px whitespace-nowrap px-2 py-2 text-right align-baseline">
                    <Fig className={`text-[length:var(--t-body)] ${isLead ? "font-semibold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{s.keeps_pct.toFixed(1)}%</Fig>
                  </TableCell>
                  <TableCell className="w-px whitespace-nowrap px-2 py-2 text-right align-baseline">
                    <Fig className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{money(s.capital_usd)}</Fig>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
export function MoneySplit({ d }: { d: any }) {
  const ms = d.money_split ?? {};
  const items: any[] = ms.items ?? [];
  if (!items.length) return null;
  /* THE SHARED RAMP, not a second copy of it. These five values were written out
     again here, identical to the ramp the spine kit already declares, so the two
     could drift apart without anything noticing. */
  const GREYS = GREY_RAMP.slice(0, 5);

  /* THE STACK MUST TOTAL A HUNDRED, and this one is built so that it does: the
     fixed stage is the residual of the other three, so rounding cannot escape.
     What CAN escape is a floor. Every stage is clamped at zero, and a clamp is a
     silent correction: measured margins are under no obligation to arrive in
     textbook order, and nothing upstream promises they will. Run the real
     arithmetic on a ladder where the net sits above the operating figure and the
     four parts total 107; on one where it sits above the gross, 135. The bar is
     a flex row, so it quietly squeezes itself back inside its own track and
     looks fine, while the printed percentages beside it add up to a third more
     than the hundred dollars the section is about.
     So it refuses to draw. The tolerance is ONE point rather than the four the
     cell page's version uses, and deliberately: that stack rounds each slice on
     its own and can drift by about a point in ordinary use, while this one is
     exact by construction. Anything off here means a floor fired, which is a
     real inconsistency in the ladder and not a rounding artefact. */
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
  const stackTotal = items.reduce((a, i) => a + (Number.isFinite(i.pct) ? i.pct : NaN), 0);
  if (!Number.isFinite(stackTotal) || Math.abs(stackTotal - 100) > 1) return null;
  return (
    <Full>
      <Box>
        <Rail icon="cost-breakdown" kicker="Where each $100 goes" verdict={`The owner's slice is what ${nonKeptWord} bigger lines leave behind.`} sample />
        {/* the stacked bar + the on-bar % overlay (ink on the light greys AND on the
            soft-terracotta kept slice, both AA-safe). The kept slice is the card's
            ANSWER, so it is never the one segment without a value: it labels on-bar
            regardless of the >=12% width threshold ("7%" fits 7%). */}
        <div className="relative">
          <StackBar segments={parts.map((p) => ({ label: p.name, pct: p.pct, color: p.color, kept: !!p.kept }))} sort={false} h="h-11" ariaLabel={parts.map((p) => `${p.name} ${p.pct}%`).join(", ")} legend />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex h-11 items-center">
            {parts.map((p) => (
              <span key={p.name} className="fig overflow-hidden whitespace-nowrap text-center text-[length:var(--t-micro)] font-semibold" style={{ width: `${p.pct}%`, color: "var(--c-ink)", opacity: 0.8 }}>{p.pct >= 12 || p.kept ? `${p.pct}%` : ""}</span>
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
              <div className="mt-4 hidden gap-1 text-[length:var(--t-micro)] sm:grid sm:grid-cols-[var(--vc)_var(--fc)_var(--kc)]" style={{ ["--vc" as any]: `${variablePct}fr`, ["--fc" as any]: `${fixedPct}fr`, ["--kc" as any]: `${keptPct}fr` }}>
                {bracket.map((b) => <div key={b.label} className="border-t border-[var(--c-line-strong)] pt-1">{cell(b)}</div>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[length:var(--t-micro)] sm:hidden">
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
                  <span className="pt-0.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Fixed</span>
                  <span className="text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{ms.fixed_note}</span>
                </div>
              ) : null}
              {ms.variable_note ? (
                <div className="grid grid-cols-[4.5rem_1fr] gap-3">
                  <span className="pt-0.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Variable</span>
                  <span className="text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{ms.variable_note}</span>
                </div>
              ) : null}
            </div>
          </InlineDisclosure>
        ) : null}
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
      {/* plain-words kicker (rulebook v1 §13: no jargon in titles; "utilisation" lives in the InfoTip) */}
      <Rail icon="break-even" kicker="When a day starts paying" verdict="Below this share of a typical day's trade, the day loses money." />
      <div className="mb-3 flex items-baseline gap-2.5"><CountFig value={be} suffix="%" className="text-[40px] leading-none text-[var(--c-ink)]" /><InfoTip gloss={GLOSS_UTILISATION} /></div>
      <Meter value={be} left="empty" right="a typical day" />
    </Box>
  );
}

/* ============================================================
 * RAMP , the phase bar (rulebook v2 S10/D4, founder decision a, 2026-07-09). The
 * placeholder month-by-month milestone Timeline is scrapped (its invented nodes ,
 * "Full rota on", "Cash gap opens", "Cash gap closes", "Year one done" , were
 * modeled narrative, not measured weeks). Replaced by PhaseBar, fed by the only
 * two honest anchors: the modeled time to open (opening_archetypes, place-
 * invariant) and the seed's own ramp_to_breakeven_months (counted from week 0,
 * never from opening).
 * decision: how long to break even. focal: the phase bar's break-even tick.
 * Self-omits when the seed carries no break-even anchor.
 * width: Full (T1). terracotta: the break-even tick (PhaseBar-owned). */
function breakevenWeekFor(d: any): number | null {
  const rampMonths = d?.first_year?.ramp_to_breakeven_months;
  return typeof rampMonths === "number" && Number.isFinite(rampMonths) && rampMonths > 0
    ? Math.round(rampMonths * (52 / 12))
    : null;
}
function Ramp({ d }: { d: any }) {
  const breakevenWeek = breakevenWeekFor(d);
  if (breakevenWeek == null) return null;
  const openWeek = timeToOpenWeeks(d.meta?.id ?? d.meta?.industry ?? null);
  return (
    <Full>
      <Rail icon="first-year" kicker="Getting to break-even" sample />
      <Box>
        <PhaseBar openWeek={openWeek} breakevenWeek={breakevenWeek} />
      </Box>
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
export function Operator({ d }: { d: any }) {
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
      <Rail icon="who-for" kicker="The typical operator" verdict={o.verdict} sample />
      <div className={`grid ${factCols} divide-x divide-[var(--c-border)] border-t border-[var(--c-border)] pt-3`}>
        {facts.map(([val, l]) => <div key={l} className="px-3 first:pl-0 last:pr-0"><Fig className="text-[length:var(--t-sub)] text-[var(--c-ink)]">{val}</Fig><div className="mt-0.5 text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">{l}</div></div>)}
      </div>
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
      <Rail icon="startup-cost" kicker="Payback window" verdict={p.verdict} sample />
      <div className="mb-1 flex items-baseline gap-2.5"><CountFig value={mid} className="text-[40px] leading-none text-[var(--terra-text)]" /><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">months to return the <Fig className="text-[var(--c-ink)]">{money(p.capital_usd ?? 0)}</Fig> opening cost.</span></div>
      <RangeBracket lo={lo} hi={hi} mid={mid} unit="mo" midLabel={`${mid} mo`} accent={false} />
      {hasGearing ? (
        <InlineDisclosure name="gearing" summary="If the fit-out is borrowed">
          <div className="mt-2 grid grid-cols-2 gap-3 border-t border-[var(--c-border)] pt-2.5">
            <div>
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Unlevered</div>
              <div className="mt-0.5 text-[length:var(--t-body)] text-[var(--c-ink)]"><Fig>{p.unlevered_keep_pct}%</Fig> keep, back in <Fig>{p.unlevered_months}</Fig> mo</div>
            </div>
            <div>
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">At {p.levered_ltv_pct}% borrowed</div>
              <div className="mt-0.5 text-[length:var(--t-body)] text-[var(--c-ink)]"><Fig>{p.levered_keep_pct}%</Fig> keep, back in <Fig>{p.levered_months}</Fig> mo</div>
            </div>
          </div>
          {p.gearing_note ? <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{p.gearing_note}</p> : null}
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
export function Survival({ d }: { d: any }) {
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
      <SurvivalCurve curve={curve} />
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
      <Rail icon="who-for" kicker="Who it suits" verdict={w.verdict} sample />
      <div className="grid gap-5 sm:grid-cols-2">
        {suits.length ? (
          <div>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--terra-text)]">Suits</div>
            <Bullets items={suits} />
          </div>
        ) : null}
        {thinkTwice.length ? (
          <div className={suits.length ? "sm:border-l sm:border-[var(--c-border)] sm:pl-5" : ""}>
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Think twice</div>
            <ul className="space-y-2">{thinkTwice.map((t: string, i: number) => <li key={i} className="relative pl-4 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full border border-[var(--c-line-strong)]" />{t}</li>)}</ul>
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
      <SeasonRibbon months={months} />
    </Box>
  );
}

/* ClaimRow , one claim-vs-reality pair (rulebook v2 S12 rework of the myth listicle):
 * the folklore claim struck through as plain text, the real figure beside it, en route
 * to a schematic device instead of a bullet list or a "myth busted" game-show tag. Both
 * fields the two call sites below feed it are real, already-measured page fields
 * (survival.yr1_pct, margins.gross_pct/net_pct), never a fabricated claim number , the
 * struck side stays a QUOTED PHRASE, not an invented statistic. `accent` opts the real
 * figure into terracotta; the page's other ClaimRow stays ink (terracotta once per box). */
function ClaimRow({ claim, real, realLabel, accent = false }: { claim: string; real: string; realLabel: string; accent?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border border-[var(--c-border)] px-3 py-2.5">
      <span className="text-[length:var(--t-body)] leading-snug text-[var(--c-muted)] line-through decoration-2 decoration-[var(--c-line-strong)]">{claim}</span>
      <div className="text-right">
        <Fig className={`block text-[20px] leading-none ${accent ? "text-[var(--terra-text)]" : "font-semibold text-[var(--c-ink)]"}`}>{real}</Fig>
        <div className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{realLabel}</div>
      </div>
    </div>
  );
}

/* CAVEATS , claim vs. reality (rulebook v2 S12: the old "3 myths + honest take" bullet
 * list was named a schematic cliche). Two universal claim/reality pairs carry the first
 * view, each backed by a real field measured elsewhere on the page (survival.yr1_pct,
 * margins.gross_pct/net_pct); the seed's own myth sentences + honest_take move into a
 * disclosure , supporting prose, never the first-view wall of text (S5/S6).
 * decision-support: the comfortable stories do not survive the maths.
 * width: the rail half of a WideRail (T2), beside the season ribbon.
 * terracotta: the survival reality figure only (one accent; the margin row stays ink). */
function Caveats({ d }: { d: any }) {
  const c = d.caveats ?? {};
  const myths: string[] = c.myths ?? [];
  const s = d.survival ?? {};
  const m = d.margins ?? {};
  const hasSurvivalClaim = typeof s.yr1_pct === "number";
  const hasMarginClaim = typeof m.gross_pct === "number" && typeof m.net_pct === "number";
  if (!hasSurvivalClaim && !hasMarginClaim && !myths.length && !c.honest_take) return null;
  return (
    <Box>
      <Rail icon="myth-reality" tone="terra" kicker="What people get wrong" sample />
      {(hasSurvivalClaim || hasMarginClaim) ? (
        <div className="space-y-2">
          {hasSurvivalClaim ? (
            <ClaimRow claim='"most fail within a year"' real={`${s.yr1_pct}%`} realLabel="actually trade past year one" accent />
          ) : null}
          {hasMarginClaim ? (
            <ClaimRow claim='"a fat gross margin means good profit"' real={`${m.net_pct}%`} realLabel="kept, after the bills that quote does not mention" />
          ) : null}
        </div>
      ) : null}
      {/* kit-InlineDisclosure markup: the seed's own myth sentences + honest_take, moved
          out of the first view (S5/S6, never a graphic hidden here , see kit.tsx assertNoGraphics).
          The "prime cost" jargon still carries its InfoTip gloss at first use. */}
      {(myths.length || c.honest_take) ? (
        <InlineDisclosure name="myths-full" summary="The claims, in full" className={(hasSurvivalClaim || hasMarginClaim) ? "group mt-4 border-t border-[var(--c-border)] pt-3" : "group mt-3"}>
          <div className="space-y-2.5">
            {myths.length ? (
              <ul className="space-y-2">
                {myths.map((t, i) => (
                  <li key={i} className="relative pl-4 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">
                    <span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full" style={{ background: "#c9c9c9" }} />
                    {glossTerm(t, "prime cost", GLOSS_PRIME_COST)}
                  </li>
                ))}
              </ul>
            ) : null}
            {c.honest_take ? <p className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{c.honest_take}</p> : null}
          </div>
        </InlineDisclosure>
      ) : null}
    </Box>
  );
}

/* CLOSE , a deliberate full-width capstone: the page's answer restated (the $ kept per
 * $100) then the one next action. The two "keeps most" recap lines (top format, top
 * city) are CUT (rulebook v1 §15: the cross-entity "X keeps the most of it" verdict
 * footer is banned, and the per-city line restated an unknowable per-city net margin).
 * focal: the CTA. terracotta: the $-kept recap figure only (the page's answer restated). */
function Close({ d }: { d: any }) {
  const mi = d.margin_index ?? {};
  // The keep recap label earns its words: read against the real all-trades average when
  // the benchmark carries one, else the plain fallback.
  const avg = d.benchmark?.all_trades_avg;
  const keepLabel = typeof avg === "number" && avg > 0
    ? `kept per $100, versus $${avg} for the typical trade`
    : "kept per $100, a thin keep won on volume";
  const recap: Array<[React.ReactNode, string, boolean]> = [
    ...(typeof mi.keeps_per_100 === "number" ? [[<>${mi.keeps_per_100}</>, keepLabel, true] as [React.ReactNode, string, boolean]] : []),
  ];
  return (
    <Full>
      <Box>
        <Rail icon="bookmark" kicker="The close" sample />
        {/* one full-width band, not a left-huddled recap over a blank right (rule 17):
            the answer restated on the left, the one next action on the right, both flanks
            carrying content. The recap figure keeps its own visible sample marker via the
            Rail above (the $ kept is modeled). */}
        <div className="flex flex-col gap-5 border-t border-[var(--c-line-strong)] pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          {recap.length ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-6 sm:gap-y-1">
              {recap.map(([fig, label, accent], i) => (
                <div key={i} className="flex items-baseline gap-2.5">
                  <div className={`fig text-[length:var(--t-sub)] leading-none ${accent ? "text-[var(--terra-text)]" : "font-semibold text-[var(--c-ink)]"}`}>{fig}</div>
                  <div className="max-w-[20rem] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{label}</div>
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col items-start gap-3 sm:shrink-0 sm:flex-row sm:items-center">
            <div className="max-w-[22rem] text-[length:var(--t-body)] leading-snug text-[var(--c-ink)]">See {d.meta?.name?.toLowerCase()} in a specific city, with the local rent, wages and take-home.</div>
            {/* the alt-city mark says what the button opens (city-level pages); its strokes
                are var(--c-ink), so remap that var to currentColor inside the dark pill */}
            <a href="/cities" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-[length:var(--t-body)] font-semibold text-white transition hover:bg-[var(--terra-text)]">
              <span style={{ ["--c-ink" as any]: "currentColor" }} className="inline-flex"><AtlasMark id="alt-city" size={14} /></span>
              Pick a place
            </a>
          </div>
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
  const hasDemand = ["spend_per_head_usd", "purchases_per_year"].some((k) => typeof dm[k] === "number");
  const hasBenchmark = (d.benchmark?.trades ?? []).length > 0;
  const subCount = deriveSubtypes(d).length;
  const hasMoneySplit = (d.money_split?.items ?? []).length > 0;
  const hasBreakEven = typeof d.cost_structure?.breakeven_utilization_pct === "number";
  const hasRamp = breakevenWeekFor(d) != null;
  const o = d.operator ?? {};
  const hasOperator = typeof o.capital_to_open_usd === "number" || typeof o.survival_1yr_pct === "number" || (typeof o.sale_multiple_low === "number" && typeof o.sale_multiple_high === "number");
  const hasPayback = typeof d.payback?.payback_months === "number";
  const hasSurvival = [d.survival?.yr1_pct, d.survival?.yr3_pct, d.survival?.yr5_pct].some((v) => typeof v === "number");
  const hasWhoSuits = (d.who_suits?.suits ?? []).length > 0 || (d.who_suits?.think_twice ?? []).length > 0;
  // Mirrors WherePaysExplorer's own guard: the list now carries rent-load facts only
  // (founder D3, 2026-07-11), so a place without rent_load_pct contributes nothing.
  const hasWherePays = (d.where_pays?.places ?? []).some((p: any) => typeof p?.rent_load_pct === "number");
  const hasSeasonality = (d.seasonality?.months ?? []).length >= 2;
  const hasCaveats = (d.caveats?.myths ?? []).length > 0 || !!d.caveats?.honest_take;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      <Masthead d={d} />

      {hasBenchmark ? <>
        <Movement index="01" eyebrow="Against the neighbours" heading="Against the trades next door" icon="benchmark" />
        <Benchmark d={d} />
      </> : null}

      {hasDemand ? <>
        <Movement index="02" eyebrow="The demand" heading="The appetite" icon="spending-power" />
        <Demand d={d} />
      </> : null}

      {subCount > 0 ? <>
        <Movement index="03" heading="The formats, compared" icon="subtype" />
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
        <Movement index="06" heading="The place, and the year" icon="where-it-pays" />
        <div className="space-y-6">
          <WherePaysExplorer d={d} />
          {hasSeasonality && hasCaveats
            ? <WideRail><Seasonality d={d} /><Caveats d={d} /></WideRail>
            : hasSeasonality || hasCaveats
              ? <Full>{hasSeasonality ? <Seasonality d={d} /> : <Caveats d={d} />}</Full>
              : null}
        </div>
      </> : null}

      <Movement index="07" heading="The next move" icon="bookmark" />
      <Close d={d} />
    </main>
  );
}
