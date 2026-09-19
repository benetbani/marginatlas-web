/**
 * Industry page (a trade across places) , SPINE rebuild BODY (SpineIndustryBody).
 *
 * THE ORDER IS MODEL.md 8.7's (plan step 34, 2026-09-18, the first of four
 * dispatches): the opening full width (`00 take`), then the band `01 lasts
 * | 02 benchmark`; chapter turn one, what it costs to open and what it keeps
 * (`03 split | 04 open`, `05 pays` the bento); turn two, where it pays and
 * what to sell (`06 places` full width, `07 formats | 08 channels`); turn
 * three, what the trade is like (`09 know | 10 field`); the exit (`11 close`
 * full width, no chapter break). The trade view's idiom, exactly: the
 * builders built once at the top of the body, a band seated only when a card
 * exists, `Movement` with an index and a heading and nothing else, no rail.
 * Three full widths, R1: the take, the places table, the close.
 *
 * WHAT THE FIRST DISPATCH BUILT: `00 take` on the answer card in its trade
 * identity variant, `01 lasts` on the trade page's own survival card and
 * `02 benchmark` on RankedBars (opening.tsx says which law each obeys; the
 * builders are industry_hero_facts.ts, lasts_rows.ts at the world altitude
 * and benchmark_rows.ts, every figure off the one net builder or the shard,
 * marked modelled). WHAT IT RETIRED, each with what it drew: the old
 * Masthead and its `#ladder` box (the keeps-per-$100 count-up off
 * `margin_index`, the margins file's clamped net with a silent 5% default on
 * 39 trades, the prose sentence beside it, the three-rung MarginLadder, the
 * provenance line: `00` is its seat); `#kept`, the Benchmark (the
 * LollipopColumn over `foodDrinkSiblings()`'s eight food ids, 23 of 243
 * trades served with the same six rows, the atlas median as a dashed rule,
 * the computed finding sentence: `02` is its seat, the sector set from the
 * shards replaces the list, and the hardcoded list dies with the adapter's
 * `benchmark` and `subtypes` blocks); `#spend`, the Demand card (the spend
 * per head off `computeBreakeven`'s AOV, visits never fed on the live
 * route: `00`'s two companions are its seat, off the shard for 243); `#open`,
 * the Operator (its one live fact the archetype's cost to open, which `00`
 * prints as a companion and which on the 90 default trades printed the
 * table's 80,000 fill as a figure, clause 46; its sale multiple never fed on
 * the live route and is UNPLACED by 8.7 on two bases; its year-one survival
 * already off the card); `#survival` (the SurvivalCurve off the London
 * file's archetype for 20 of 243, R5's banned slope: `01` is its seat, the
 * shard's triple for 243) and the `survival` feed with it, which also fed
 * the myths card's struck claim and the adapter's folklore sentence, both
 * echoes of `01` that 8.7's inventory says stay dead; `#neighbours`, the
 * SubtypeDrill (the trades next door ranked by the archetype's cost to open
 * over the same eight food ids: its feed dies with `foodDrinkSiblings()`;
 * `07 formats` draws the shard's own formats at its dispatch, a different
 * feed). The old chapter headings (four with eyebrows and icons, and "The
 * next move" over the exit) left with the order: 8.7's three turns carry
 * the breaks and the exit carries none.
 *
 * WHAT THE SECOND DISPATCH BUILT (2026-09-18): turn one, `03 split | 04
 * open` at `2-1` stacked until lg and `05 pays` the bento, on turn-one.tsx
 * (it says which law each obeys; the builders are split_rows.ts at the
 * world altitude over the one net builder, industry_open_rows.ts over the
 * trade's permits and open builders, pays_rows.ts over the shard's roles,
 * first-year rows and cost stack, every figure marked modelled). WHAT IT
 * RETIRED, each with what it drew: `#split`, the MoneySplit (the $100 stack
 * as three stages off the margins file's clamped ladder, the file's 5%
 * default on 39 trades, a net that disagreed with the hero's by a point on
 * 8, the verdict sentence in its rail, the fixed-and-variable bracket and
 * its notes: `03` is its seat, the shard's drivers and the one net); the
 * BreakEven meter, the Ramp phase bar and the CapitalPayback bracket, none
 * of them fed on the live route (the adapter omitted `cost_structure`,
 * `first_year` and `payback` on purpose): `04`'s months cell and `05`'s two
 * metric cells are their seats, off the shard for 243. The adapter's
 * `money_split` block left with the MoneySplit.
 *
 * TODAY'S SURVIVORS KEEP THEIR SEATS IN 8.7's ORDER until their dispatches,
 * each mapped to its block: the WherePaysExplorer is `06 places` (it gates
 * on `rent_load_pct`, never set, so it has never drawn on the live route);
 * WhoItSuits and the Caveats are the two halves of `09 know`, the page's
 * one prose section, seated side by side until that dispatch merges them on
 * NoteList; the Seasonality ribbon's swing is `10 field`'s third cell (never
 * fed on the live route); the Close is `11 close` on Terminus at the fourth
 * dispatch (its recap figure left today with the `margin_index` and
 * `benchmark` feeds, 8.7's own cut: "no recap figure").
 *
 * THE THIRD CHAPTER BREAK draws when a card stands under it (the trade
 * view's own rule): the suits and the caveats build off the authored
 * character, the failure modes and the margins file, so on a trade holding
 * none of them the heading waits with them. Turn two's heading waits on the
 * places table, which no live trade draws today.
 *
 * THE SAMPLE MARK'S WIRING, said once for the render group: every card on
 * this page whose figures are modelled passes `sample` to the kit's `Rail`
 * (or `tagged` to RankedBars, `confidence` to the answer card's cells), and
 * the kit draws `SampleTag` there, behind his switch (MODEL.md, THE SAMPLE
 * MARK IS BEHIND ONE SWITCH); the sample-tags gate reads this group for that
 * name, and the mechanism it names is the one every card here uses.
 */
import * as React from "react";
import { spineIndustrySeed } from "@/lib/spine-seeds";
import { Fig, Bullets, InfoTip, InlineDisclosure, Movement, Box, Rail, Full, Band } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";
import { WherePaysExplorer } from "./where-pays";
import { SeasonRibbon } from "./forms";
import { Masthead, BenchmarkCard } from "./opening";
import { SplitCard, OpenCard, PaysBand } from "./turn-one";
import { LastsCard } from "@/components/spine/cell/turn-two";
import { industryHeroFacts } from "@/lib/spine/industry_hero_facts";
import { buildLasts } from "@/lib/spine/lasts_rows";
import { buildBenchmark } from "@/lib/spine/benchmark_rows";
import { buildIndustrySplit } from "@/lib/spine/split_rows";
import { buildIndustryOpen } from "@/lib/spine/industry_open_rows";
import { buildPays } from "@/lib/spine/pays_rows";
import { COPY } from "@/lib/spine/copy";

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

/* WHO IT SUITS , two columns: suits / think twice.
 * decision: is this operator you. focal: the two bullet columns as a contrast.
 * width: Even (T3), paired with survival. terracotta: the "suits" dots only. */
export function WhoItSuits({ d }: { d: any }) {
  const w = d.who_suits ?? {};
  const suits: string[] = w.suits ?? [];
  const thinkTwice: string[] = w.think_twice ?? [];
  if (!suits.length && !thinkTwice.length) return null;
  /* TWO COLUMNS ONLY WHEN THERE ARE TWO COLUMNS OF CONTENT.
     The live builder fills each side from a different fact about the trade, and
     it runs when EITHER one is present. So a trade with something to watch out
     for and no stated edge, or the reverse, produced a full-width band with its
     one list wrapping inside the left half and the right half empty. Same fault
     the customer-spend band had two rows ago, arrived at from a different
     direction: there the second figure was missing upstream, here either side
     can be. The dividing rule was already guarded, so what was left was the
     emptiness, not a line drawn through it. */
  const both = suits.length > 0 && thinkTwice.length > 0;
  return (
    /* THE ONE EDITORIAL SECTION ON THIS PAGE (art direction E1). A page built out
       of figures needs one place where a person speaks, and this is it: whether a
       trade suits the reader is a judgment, not a measurement, and cutting it to
       the 220-character prose budget would be cutting the only human voice on the
       page to satisfy a number. The exemption is capped at one per page, so
       declaring a second one here would fail rather than compound. */
    <Box id="suits" data-editorial="1">
      <Rail icon="who-for" kicker="Who it suits" verdict={w.verdict} sample />
      <div className={`grid gap-5${both ? " sm:grid-cols-2" : ""}`}>
        {suits.length ? (
          <div>
            {/* A COLUMN LABEL IS FURNITURE, NOT AN ANSWER. Rule 37: the accent marks
                answers only. "Suits" and "Think twice" are the two headings of a
                two-column read, and one of them was accented while its twin was
                muted, which told a reader the left column mattered more when the
                whole point of the pair is that both do. */}
            <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Suits</div>
            <Bullets items={suits} />
          </div>
        ) : null}
        {thinkTwice.length ? (
          <div className={both ? "sm:border-l sm:border-[var(--c-border)] sm:pl-5" : ""}>
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
    <Box data-block="seasonality">
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
    /* A ROW THAT WRAPS, NOT TWO COLUMNS THAT CANNOT.
       The claim sat in a flexible column beside a column sized to its own
       contents, and the thing on the right carries a long line of explanation.
       On a phone that leaves the claim about seventy pixels, and the claim is a
       sentence: photographed at 320, "a fat gross margin means good profit"
       came out over SIX lines of one or two words each, struck through, which
       reads as broken rather than as folklore being crossed out.
       The claim now asks for a sensible width and the pair wraps when it cannot
       have it, so on a phone the struck line takes the full row and the figure
       sits under it. No breakpoint: the row wraps when it must, at whatever
       width that turns out to be. */
    /* NO BOX AROUND EACH CLAIM. Founder verdict F1, "you have just boxed it": a
       bordered panel inside a bordered card is two edges around one idea. Each of
       these rows carried its own rounded border inside the card's border, and
       there are two of them, so the card held three nested outlines. Siblings are
       separated by a rule, not by being individually boxed.
       AND THE STRIKE READS AS A CANCELLATION NOW, not as a highlight. It was two
       pixels thick in a pale line colour laid across muted grey text, which is the
       shape of a highlighter pen: the eye read it as the claim being EMPHASISED,
       on a card whose entire job is to cross the claim out. One pixel, in ink dark
       enough to be a line rather than a wash. */
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5 first:pt-0 last:pb-0">
      <span className="min-w-0 flex-[1_1_11rem] text-[length:var(--t-body)] leading-snug text-[var(--c-muted)] line-through decoration-1 decoration-[var(--c-ink2)]">{claim}</span>
      <div className="ml-auto text-right">
        <Fig className={`block text-[length:var(--t-head)] leading-none ${accent ? "text-[var(--terra-text)]" : "font-semibold text-[var(--c-ink)]"}`}>{real}</Fig>
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
export function Caveats({ d }: { d: any }) {
  const c = d.caveats ?? {};
  const myths: string[] = c.myths ?? [];
  const s = d.survival ?? {};
  const m = d.margins ?? {};
  const hasSurvivalClaim = typeof s.yr1_pct === "number";
  const hasMarginClaim = typeof m.gross_pct === "number" && typeof m.net_pct === "number";
  if (!hasSurvivalClaim && !hasMarginClaim && !myths.length && !c.honest_take) return null;
  return (
    <Box id="myths">
      <Rail icon="myth-reality" tone="terra" kicker="What people get wrong" sample />
      {(hasSurvivalClaim || hasMarginClaim) ? (
        <div className="divide-y divide-[var(--c-border)]">
          {hasSurvivalClaim ? (
            <ClaimRow claim='"most fail within a year"' real={`${s.yr1_pct}%`} realLabel="actually trade past year one" accent />
          ) : null}
          {/* "that claim", not "that quote". The line read "the bills that quote does
              not mention", and "quote" is a verb as readily as a noun, so a reader
              parses "the bills that quote" as a relative clause and has to back up.
              "Claim" cannot be misread that way, and it names the struck line
              directly above it. One word, and the sentence stops garden-pathing.
              Art direction H7. */}
          {hasMarginClaim ? (
            <ClaimRow claim='"a fat gross margin means good profit"' real={`${m.net_pct}%`} realLabel="kept, after the bills that claim leaves out" />
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
export function Close({ d }: { d: any }) {
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
      <Box id="close">
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
                  <div className={`fig text-[length:var(--t-head)] leading-none ${accent ? "text-[var(--terra-text)]" : "font-semibold text-[var(--c-ink)]"}`}>{fig}</div>
                  <div className="max-w-[20rem] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{label}</div>
                </div>
              ))}
            </div>
          ) : null}
          {/* WHEN THERE IS NO RECAP, THIS BLOCK TAKES THE WHOLE ROW.
              The comment above states the rule this band is built to: one
              full-width band, both flanks carrying content, never a left-huddled
              lockup over a blank right. The recap on the left is OPTIONAL, and
              its guard lets it vanish whenever the trade carries no kept figure.
              With it gone, the row's spacing rule had one child to space and put
              it at the start, so the band failed its own stated rule: a lone call
              to action on the left and an empty right. Rendered without the recap
              to confirm it rather than reasoning about it.
              With no recap this block spans the row and pushes its own two halves
              apart instead, so both flanks carry something either way. */}
          <div className={`flex flex-col items-start gap-3 sm:flex-row sm:items-center${recap.length ? " sm:shrink-0" : " sm:w-full sm:justify-between"}`}>
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
 * field renders nothing.
 */
export function SpineIndustryBody({ data = spineIndustrySeed }: { data?: any } = {}) {
  const d = data ?? spineIndustrySeed;

  /* WHO IS HOME, ASKED ONCE (the trade view's idiom): the three opening
     builders over the taxonomy id the adapter carries (`meta.id`, the id the
     shard is filed under), so a band is drawn when its cards exist and a
     heading never sits over nothing. The take builds for every trade in the
     taxonomy (the one net builder resolves 243 of 243); the survival triple
     and the sector set build for every trade holding a shard, so the band
     `01 | 02` holds two children or does not draw. */
  const industryId: string | undefined = typeof d.meta?.id === "string" ? d.meta.id : typeof d.meta?.industry === "string" ? d.meta.industry : undefined;
  const hero = industryHeroFacts(industryId);
  const lasts = buildLasts(industryId, "world");
  const benchmark = buildBenchmark(industryId);
  /* TURN ONE'S THREE, off the same id (plan step 34's second dispatch): the
     split on the trade's builder at the world altitude (the one net builder
     with the engine absent, the hero's own figure), the open card over the
     trade's permits and open builders, the bento over the shard's roles,
     first-year rows and cost stack. Each builds for every trade holding a
     shard, so the band `03 | 04` holds two children or does not draw, and
     the bento draws its four cells or not at all. */
  const split = buildIndustrySplit(industryId);
  const open = buildIndustryOpen(industryId);
  const pays = buildPays(industryId);

  // Chapter-presence reads for today's survivors (each mirrors its card's own
  // null-guard) so a Movement header never floats over an empty chapter.
  const hasWhoSuits = (d.who_suits?.suits ?? []).length > 0 || (d.who_suits?.think_twice ?? []).length > 0;
  // Mirrors WherePaysExplorer's own guard: the list carries rent-load facts only
  // (founder D3, 2026-07-11), so a place without rent_load_pct contributes nothing.
  const hasWherePays = (d.where_pays?.places ?? []).some((p: any) => typeof p?.rent_load_pct === "number");
  const hasSeasonality = (d.seasonality?.months ?? []).length >= 2;
  // Mirrors Caveats' own guard: the margin claim off the margins file, the myths, the honest take.
  const hasCaveats = (d.caveats?.myths ?? []).length > 0 || !!d.caveats?.honest_take || (typeof d.margins?.gross_pct === "number" && typeof d.margins?.net_pct === "number");
  /* The turns, by whether a card stands under each. */
  const turnOne = (!!split && !!open) || !!pays;
  const turnTwo = hasWherePays;
  const turnThree = hasWhoSuits || hasCaveats || hasSeasonality;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
      {/* `00 take`, FULL WIDTH, the page's only 40 (8.7, loud one): the answer
          card draws its own hero band, the attribute the full-width gate reads. */}
      <Masthead facts={hero} />
      {/* `01 lasts | 02 benchmark`, the opening's one band (8.7): do they
          survive, and is that keep high or low. The survival grid LEFT, the
          bars RIGHT (fill-bar one of three, RIGHT, so it never shares a column
          with `03`, M10), both quiet. RULED BY MEASUREMENT 2026-09-18 (8.4 rule
          1, the closed set; the dispatch's report carries the numbers at three
          widths on restaurants, a two-member sector and a fill shard): see the
          split below. `stack="lg"` because at a tablet's equal halves the
          five bars stand past the three-cell grid. */}
      {lasts && benchmark ? (
        <Band split="1-2" stack="lg">
          <LastsCard lasts={lasts} />
          <BenchmarkCard benchmark={benchmark} />
        </Band>
      ) : null}

      {/* CHAPTER TURN ONE (8.7, "What it costs to open, and what it keeps", the
          spine's own string: 8.7's chapter-turns paragraph leaves the industry
          strings to the composition round and names no winner, and M7 bound
          the trade page alone; the controller may rule the site's words in):
          the kit's Movement, the muted index and one plain heading. */}
      {turnOne ? (
        <>
          <Movement index="01" heading={COPY.industryChapters.costs} />
          {/* `03 split | 04 open` (8.7): where each $100 goes before the owner
              sees any of it, beside what it takes to be allowed to open the
              doors. The breakdown LEFT and wide (fill-bar two of three, LEFT,
              so it never shares a column with `02`'s bars, M10), the licence
              grid RIGHT, both quiet. `2-1`, NOT 8.7's expected `3-2`, RULED
              BY MEASUREMENT 2026-09-18 (8.4 rule 1, the closed set), and the
              instrument had to be corrected first: probe_page and the page
              filter count a closed plus's hidden rows as ink (a closed
              <details>' rows still report client rects), so both read the
              licence card as full at every split; measured with those rows
              excluded (the art-direction gate's own inDeadDetails), the
              breakdown stands 360 of content at every split and every width
              on restaurants, hardware stores and watch repair, and the
              licence card 237 at `3-2` and at `1-1` (123 of air under its
              plus, over the filter's 120 floor to the eye) against 253 at
              `2-1` (108 of air, "The slowest licence" wrapping to two lines
              in the 347 seat), which is the one split in the set under the
              floor; E2 reads 66 and 70 percent ink. `stack="lg"`, as the
              trade page's split band: at a tablet's equal halves the legend
              goes to one column under 360px of card and the breakdown stands
              past the grid. */}
          {split && open ? (
            <Band split="2-1" stack="lg">
              <SplitCard split={split} />
              <OpenCard open={open} />
            </Band>
          ) : null}
          {/* `05 pays` (8.7): the bento, its own band; the payback lit, turn
              one's accent and the page's second, the crew, the fixed part of
              the costs and the day's share in ink. FOUR CELLS ON THE TRADE
              MARKET'S TILING, not 8.7's three on two columns: 8.7's crew cell
              was a 1072px card, full width by the section-bands gate and by
              his ban (0 to 1 on a baseline that may only fall), and a tall
              crew cell cannot hold a whole that runs 2 to 38; pays_rows.ts
              and turn-one.tsx carry the numbers, the controller the ruling
              (QUEUE industry:pays-fourth-cell). The cluster proves its own
              tiling (2 + 1 + 1 + 2 = 6 of 6 on three columns; BentoBand.tsx). */}
          <PaysBand pays={pays} />
        </>
      ) : null}

      {/* CHAPTER TURN TWO (8.7, "Where it pays, and what to sell"): `06 places`,
          the one table, full width at its dispatch; the explorer that holds
          its seat has never drawn on the live route, so the heading waits. */}
      {turnTwo ? (
        <>
          <Movement index="02" heading={COPY.industryChapters.where} />
          <WherePaysExplorer d={d} />
        </>
      ) : null}

      {/* CHAPTER TURN THREE (8.7, "What the trade is like"): `09 know`, held by
          its two halves side by side until that dispatch merges them on
          NoteList (who it suits, what people get wrong), and `10 field`'s
          swing (the ribbon, never fed on the live route). The heading draws
          when a card stands under it. `stack="lg"` on the pair, MEASURED
          2026-09-18 (8.4's tablet rule): at a tablet's equal halves the suits'
          two bullet columns wrap to 316 and the caveats stretch to them with a
          291 by 156 blank; stacked, each stands at its own height, and at 1280
          the pair holds 0 holes at 1-1. */}
      {turnThree ? (
        <>
          <Movement index="03" heading={COPY.industryChapters.trade} />
          {hasWhoSuits || hasCaveats ? (
            <Band split="1-1" stack="lg">
              {hasWhoSuits ? <WhoItSuits d={d} /> : null}
              {hasCaveats ? <Caveats d={d} /> : null}
            </Band>
          ) : null}
          {hasSeasonality ? (
            <Band split="2-1">
              <Seasonality d={d} />
            </Band>
          ) : null}
        </>
      ) : null}

      {/* THE EXIT (no chapter break, 8.7): `11 close`, FULL WIDTH on the hero
          band until its dispatch seats it on Terminus. */}
      <Band hero><Close d={d} /></Band>
    </main>
  );
}
