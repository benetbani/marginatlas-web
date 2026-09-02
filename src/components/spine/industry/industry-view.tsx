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
import { Fig, Meter, Bullets, InfoTip, InlineDisclosure, Movement, Box, Rail, PhaseBar, StackBar, Full, Even, WideRail, TERRA, GREY_RAMP, usd, SampleTag, Band } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";
/* RankedTiles joins LollipopColumn here for C6: the trades-next-door card gave
   up its keep column to the benchmark card above it, and six named things with
   ONE figure each is a standing, not a table. The ui/table imports left with the
   columns they carried. */
import { LollipopColumn, RankedTiles } from "@/components/spine/forms-v2";
import { WherePaysExplorer } from "./where-pays";
import { MarginLadder, SurvivalCurve, SeasonRibbon, RangeBracket, CountFig } from "./forms";
import { deriveSubtypes } from "./subtypes";

const money = usd; // ONE money grammar page-set-wide (kit usd: exact below $10,000, $426K, $1.4M)

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
 * answer: the $7 keeps-per-100 figure, the ONE figure on this page at the 40 rung.
 * width: hero band, dissolved onto the atmosphere (no half-scrim); the margin
 *   ladder shows the collapse as a stair of three levels beside it.
 * terracotta: the $7 figure + the ladder's kept tread (one answer + the kept level).
 *
 * THE TWO SIZES IN THIS BAND WERE BOTH ABOVE THE LADDER'S CEILING (queue row C7),
 * and only one of them was visible to the gate. The figure was `md:text-[48px]`,
 * which `verify_type_ladder` counts; the h1 was `md:text-[2.75rem]`, which is 44px
 * and which that gate cannot see, because it reads px and this was written in rem.
 * The ladder tops at 40 with "NOTHING IS LARGER" beside it.
 *
 * SHRINKING THE FIGURE ALONE WOULD HAVE INVERTED THE BAND. At 48 against 44 the
 * answer outranked the name by 1.09x, which is two claimants and no answer (step
 * 5); at 40 against 44 the name would have won outright. Measured at 375 the
 * inversion was ALREADY SHIPPING: the h1 rendered at 33.6px over a 30px figure,
 * so on every phone the page's title outranked the page's answer, 0.89x.
 * Both are on the ladder now and neither carries a breakpoint: the answer takes
 * --t-answer (40) and the name takes --t-section (24), which is the rung the
 * ladder's own comment in globals.css assigns to "a naming h1". 1.67x at every
 * width, which clears step 5's floor of 1.6, and one grammar instead of two. */
function Masthead({ d }: { d: any }) {
  const mi = d.margin_index ?? {}; const m = d.margins ?? {};
  const hasLadder = [m.gross_pct, m.operating_pct, m.net_pct].every((v) => typeof v === "number" && Number.isFinite(v));
  return (
    <section className="pt-4 md:pt-6">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="fig text-[length:var(--t-body)] font-semibold text-[var(--c-muted)]">00</span>
      </div>
      <h1 data-typography="custom" className="text-[length:var(--t-section)] font-semibold leading-[1.05] tracking-tight text-[var(--c-ink)]">{d.meta?.name}</h1>
      <div className="mt-5 grid gap-5 md:grid-cols-[1.35fr_1fr] md:items-center">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <CountFig value={mi.keeps_per_100} prefix="$" className="text-[length:var(--t-answer)] leading-[1] text-[var(--terra-text)]" />
            {/* PROSE, NOT A SUBSECTION HEADING. This is the one use of the
                retired 18 rung, site-wide, that did not fold onto the head step
                with the other 23. It is a sentence a reader reads, set beside
                the figure it explains, so it takes the lead prose step and
                drops from 20 to 16. Everything else that wore the retired rung
                was a heading or a figure. */}
            <span className="max-w-[22rem] text-[length:var(--t-lead)] leading-snug text-[var(--c-ink2)]">kept by the owner from every <Fig className="text-[var(--c-ink)]">$100</Fig> a customer spends.</span>
          </div>
        </div>
        {/* the margin ladder: the gross-to-net collapse, seen as three shrinking bars */}
        {/* THE SECTION IDS ARE THE BLUEPRINT'S, NOT THIS FILE'S. Each of the ten
            cards carries the id its row declares in design/blueprints/industry.md,
            so the conformance gate can read the page's sections and their order
            straight off the rendered markup. An id born here without a row there,
            or a row there without an id here, is the drift the gate exists to
            catch: fix the file or fix the page, the same day. */}
        {/* THE CARD GOES WHEN THE LADDER GOES. Every other card on this page
            early-returns null when its figures are absent; this one printed its
            kicker and its sample tag over three NaN% rungs, because the three
            margins arrive from `d.margins ?? {}` and nothing checked them. The
            form self-omits on a partial set, so the Box has to as well or the
            masthead keeps an empty box beside its hero.
            THE HEAD GAP IS 8, NOT 12. Twelve sits between two rungs of the
            spacing ladder, and 8 is what the kit's own Rail leaves under every
            other kicker on the site. Sixth instance of that fault in this loop. */}
        {hasLadder ? (
          <Box id="ladder">
            <div className="mb-2 flex items-center gap-2"><h3 data-typography="custom" className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">The margin ladder</h3><SampleTag /></div>
            <MarginLadder gross={m.gross_pct} operating={m.operating_pct} net={m.net_pct} />
          </Box>
        ) : null}
      </div>
      <p className="mt-4 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{d.provenance_line}</p>
    </section>
  );
}


/* ============================================================
 * BENCHMARK (queue row A9) , the "vs the neighbours" USP, proving $7 is low.
 * decision: is $7 actually low? Number: this trade against the trades next door.
 * focal: the drawing , seven stems from one drawn zero, the subject's dot lit,
 *   the all-trades average as one dashed rule across the set.
 * width: the large side of a band; it earns it by the column count (see below).
 * terracotta: the subject's dot and figure, and nothing else.
 *
 * WHAT THIS REPLACED, AND WHY IT WAS THE WRONG DRAWING RATHER THAN A REPEATED ONE.
 * Eight hand-rolled horizontal tracks with a dot on each, stacked, carrying no
 * data-idea: the founder's own 2026-09-01 complaint in a single card, and eight
 * of the eleven undeclared drawings on this whole page. A dot ON a rail says
 * "somewhere between these two ends", and the two ends here were never named:
 * the left end was zero and the right end was 1.12 times the largest entry, a
 * ceiling nobody stated and no reader could infer. Height above a drawn zero
 * says "this much", which is the sentence the card is actually making.
 * The reference moved with it. It used to be a vertical tick on its OWN eighth
 * rail under a divider, so a reader had to compare a mark on one rail against
 * dots on seven others; it is one dashed rule across the whole set now, and the
 * four stems above it and three below are the reading. */
export function Benchmark({ d }: { d: any }) {
  const b = d.benchmark ?? {};
  const trades: any[] = (b.trades ?? []).slice().sort((a: any, c: any) => c.keeps_per_100 - a.keeps_per_100);
  if (!trades.length) return null;
  const avg: number | null = typeof b.all_trades_avg === "number" ? b.all_trades_avg : null;
  /* THE ACCENT GOES ON THE SUBJECT, NOT ON THE LEADER, and the form takes an
     index for it rather than this card drawing its own mark. The leader here is
     a trade the reader did not come for; the card's answer is where THEIRS
     lands. With no self row the index falls back to entry one, where the leader
     is the answer and the form's default is right. */
  const selfIdx = trades.findIndex((t: any) => !!t.self);
  const self = selfIdx >= 0 ? trades[selfIdx] : null;
  /* THE FINDING IS TWO COUNTS, WHICH IS WHAT THE DRAWING SHOWS AND DOES NOT
     SAY. Every figure in this card is printed exactly once: the seven keeps
     ride their own dots, the average rides the legend, and this sentence names
     none of them.
     THE SECOND CLAUSE EXISTS BECAUSE OF THE PHONE. Below `lg` the set drops to
     the four columns this card's width can hold at the 12px read floor, and
     the subject is fifth, so a phone reader sees neither the terracotta dot nor
     the stem sitting under the dashed rule. The sentence renders at EVERY
     width and carries both facts in words, which is the escape A6 took when its
     own tail dropped: the fact a reader loses from the drawing has to be
     within reach, and here it is one line above it. */
  const neighbours = trades.length - 1;
  const beat = self ? trades.filter((t: any) => !t.self && t.keeps_per_100 > self.keeps_per_100).length : 0;
  const word = (n: number) => COUNT_WORD[n] ?? `${n}`;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const vsAvg =
    self && avg != null
      ? avg > self.keeps_per_100
        ? " The atlas average is higher too."
        : avg < self.keeps_per_100
          ? " The atlas average is lower."
          : ""
      : "";
  const finding = self
    ? (beat === 0
        ? `Nothing next door keeps more.`
        : `${cap(word(beat))} of the ${word(neighbours)} trades next door ${beat === 1 ? "keeps" : "keep"} more.`) + vsAvg
    : `${trades[0].name} keeps the most.`;
  return (
    <Full>
      <Box id="kept">
        <Rail icon="benchmark" kicker="Kept per $100, by trade" verdict={b.verdict} sample />
        {/* THE HEAD, one baseline carrying two objects: what the ranking is
            ordered by at the left, what it found at the right.
            THEY STACK BELOW `lg` RATHER THAN BELOW `sm`, and the breakpoint was
            measured rather than copied from A7. Side by side they need about
            560px: the label is 250 and the finding is two sentences. This card
            has 584 at 1280 and 312 at the two-up md width, so a shared row
            anywhere below lg squeezes the finding to a column of two-word lines
            beside a block of capitals. Stacked, the label reads as a column head
            over the sentence, which is what it is. */}
        <div className="mb-4 flex flex-col gap-2 border-t border-[var(--c-border)] pt-2 lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
          <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)] lg:whitespace-nowrap">Ranked by what the owner keeps</span>
          <span className="text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{finding}</span>
        </div>
        <LollipopColumn
          rows={trades.map((t: any) => ({ name: t.name, value: t.keeps_per_100 }))}
          format={(n) => `$${n}`}
          accentIndex={selfIdx >= 0 ? selfIdx : 0}
          reference={avg != null ? { value: avg } : null}
          narrowCount={4}
          ariaLabel={`Trades ranked by what the owner keeps of every $100 of sales, most first${avg != null ? `, against an all-trades average of $${avg}` : ""}`}
        />
        {/* THE FOOT, one baseline: the reference's own legend at the left, the
            disclosure at the right when the seed carries the sentences for it.
            The legend is where the dashed rule is named, because inside the plot
            there is nowhere to put it: the tallest stem holds the left edge at
            every height and the shortest stems crowd the right. */}
        <div className="mt-4 flex flex-col gap-2 border-t border-[var(--c-border)] pt-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          {avg != null ? (
            <span className="inline-flex items-center gap-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
              {/* THE REFERENCE IS EVERY TRADE IN THE ATLAS, NOT EVERY FOOD TRADE,
                  and that is why the rule can sit above most of the set without
                  reading as the average of its own parts. It used to say "incl.
                  non-food", which is true on a restaurant page and false on every
                  page that is not about food: rule 21, a section has to hold in
                  Dhaka and Lagos as well as in London. */}
              <span aria-hidden className="inline-block w-4 border-t border-dashed border-[var(--c-line-strong)]" />
              Every trade in the atlas, <Fig className="text-[var(--c-ink2)]">${avg}</Fig>
            </span>
          ) : null}
          {trades.some((t: any) => t.why) ? (
            <InlineDisclosure name="bench" summary="Why each neighbour keeps what it keeps" className="group">
              <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
                {trades.map((t: any) => (
                  <div key={t.slug} className="grid grid-cols-[110px_1fr] items-baseline gap-3 py-2">
                    {/* NO FIGURE HERE. It rides its own dot four lines above, and
                        a card that prints one quantity twice is asking a reader
                        which of the two to believe. */}
                    <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{t.name}</span>
                    <span className="text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{t.why}</span>
                  </div>
                ))}
              </div>
            </InlineDisclosure>
          ) : null}
        </div>
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
      <Box id="spend">
        <Rail icon="spending-power" kicker="What a customer spends" sample />
        <div className={`grid gap-5 border-t border-[var(--c-border)] pt-4${both ? " sm:grid-cols-2 sm:divide-x sm:divide-[var(--c-border)]" : ""}`}>
          {hasSpend ? (
            <div className={both ? "sm:pr-6" : ""}>
              {/* THE CARD SAID ONE THING THREE TIMES in a hundred and fifty pixels: the
                  section is called "What a customer spends", the label under it read
                  "Spend per head", and the figure carried "per visit". A head and a
                  visit are the same person on the same occasion.
                  The label survives only when there are TWO figures side by side and it
                  is doing column-heading work. On its own the section name already
                  said it. Notation N8. */}
              {both ? <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Spend per head</div> : null}
              <div className="mt-1.5 flex items-baseline gap-2"><CountFig value={dm.spend_per_head_usd} prefix="$" className="text-[length:var(--t-focal)] leading-none text-[var(--terra-text)]" /></div>
            </div>
          ) : null}
          {hasVisits ? (
            <div className={both ? "sm:pl-6 sm:text-right" : ""}>
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Visits a year</div>
              {/* the support figure: half the size of the spend focal (rule 16 >=1.6 contrast,
                  so the single terracotta accent sits on ONE dominant answer, not one of two
                  equal siblings) and right-aligned so it fills the band's right edge (rule 17). */}
              <div className="mt-1.5 flex items-baseline gap-2 sm:justify-end"><CountFig value={dm.purchases_per_year} className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]" /><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">per diner</span></div>
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
 * WHAT THE DOOR COSTS (queue row C6) , the trades next door, ranked by the price
 * of getting in. A STANDING, six rows, cheapest first.
 * decision: whether paying more for the door buys a better business.
 * focal: the standing; the cheapest door carries the form's one accent.
 * width: the small side of a 2-3 band. terracotta: entry one only.
 *
 * WHAT THIS CARD GAVE UP, AND WHY IT HAD TO. It printed the SAME SIX TRADES'
 * KEEPS as the benchmark card one chapter above, in percent where that card
 * prints dollars: 12.0% here and $12 there, 10.0% and $10, 9.0% and $9, down to
 * 6.0% and $6. The adapter says so in its own comment, that one seed ships one
 * array twice. Six trade names printed twice and six keep figures printed twice
 * is the founder's "one quantity, one statement" broken six times over, and
 * restyling both cards would have left it exactly where it was.
 *
 * THE BENCHMARK CARD EARNS THE KEEP, on three counts and not on seniority. It
 * DRAWS the figure, as height above a zero, where this card only printed it. It
 * carries the reader's OWN trade in the set, which is the whole reason a keep
 * is worth ranking, and this card never could: its rows are the neighbours
 * only. And it carries the atlas average as a drawn reference, so a reader
 * learns whether $7 is normal. Nothing here could be given up to make room for
 * any of that.
 *
 * WHAT THIS CARD UNIQUELY HOLDS IS THE COST OF THE DOOR, and it is the only
 * place in the atlas a reader sees six of them side by side: $81K to $351K, a
 * four-fold spread inside one sector. Each neighbour's own page states its own
 * cost; not one of them states the spread.
 * The reading that needs BOTH quantities survives as a computed sentence rather
 * than as a second column of figures: in this sector the dearest door keeps
 * LESS, not more, which is the opposite of what a reader expects and is the one
 * thing neither card could say alone.
 *
 * Reads the derived subtype shape (capital_usd) via deriveSubtypes. The keeps
 * are still read, and only to decide which way that sentence runs. */
export function SubtypeDrill({ d }: { d: any }) {
  /* CHEAPEST FIRST, which is rule 29A satisfied by the ORDER rather than by an
     inversion, exactly as A6 and A7 did for a rent. A cost is a burden, the
     form's one accent lands on entry one, and entry one is therefore the good
     end. A door with no price is dropped rather than drawn at zero. */
  const items = deriveSubtypes(d)
    .filter((s) => Number.isFinite(s.capital_usd) && s.capital_usd > 0)
    .slice()
    .sort((a, b) => a.capital_usd - b.capital_usd);
  /* A RANKING OF ONE IS NOT A RANKING, and the form refuses it anyway. */
  if (items.length < 2) return null;
  const cheapest = items[0];
  const dearest = items[items.length - 1];
  const ratio = dearest.capital_usd / cheapest.capital_usd;
  /* THE ANSWER IS THE ONE THING NEITHER CARD COULD SAY ALONE, and it is a
     COMPARISON rather than a figure: the keeps themselves are printed once, one
     chapter above, in dollars. It is COMPUTED, never typed, for the reason A9
     gives for its own finding one card up: the same six rows render on all 23
     food-and-drink pages, so a sentence asserting a direction has to be read off
     the data or it is a claim about a page nobody checked.
     A WORD IS NOT A QUANTITY, so this takes the section rung and never focal
     (step 5, and A1's own answerKind="words" for the standing it shares). */
  const answer =
    dearest.keeps_pct < cheapest.keeps_pct
      ? "The dearest door keeps less than the cheapest."
      : dearest.keeps_pct > cheapest.keeps_pct
        ? "The dearest door keeps more than the cheapest."
        : "The dearest door keeps the same as the cheapest.";
  /* Under 1.15 the spread is not a finding and the note says so rather than
     dressing a rounding as a range. */
  const spread =
    ratio >= 1.15
      ? `It costs ${ratio.toFixed(1)} times as much to open.`
      : `Every door here costs about the same to open.`;
  const note: string | undefined = d?.subtypes?.note;
  return (
    <Full>
      <Box id="neighbours">
        <Rail icon="subtype" kicker="What the door costs, trades next door" sample />
        {/* A1'S COMPOSITION, NOT A9'S, AND THE PHOTOGRAPH IS WHY. The first
            build of this card wore the benchmark card's head row, a micro-caps
            label at the left and the finding at the right, because that card is
            one chapter up and sharing its grammar looked like step 9's
            predictability. Photographed at 1280 it was six rows of body type
            under two lines of body type: NOTHING in the card was larger than
            14px, so there was no first thing to see and no ratio to state.
            That escape belongs to a card with a DRAWING (A6, A7, A9, A10 all
            declare drawing-to-type), and a standing draws nothing at all, which
            the catalogue says in as many words. A1 settled the shape for this
            form: the answer at the section rung, its note under it, then the
            standing. */}
        <div className="text-[length:var(--t-section)] font-semibold leading-snug text-[var(--c-ink)]">{answer}</div>
        {/* THE ORDERING CLAUSE IS GONE, C22. It read "Ranked by what it costs to
            open one, cheapest first", which the standing states in its own rank
            numerals and its ascending money column, and which the rail states in
            its name. B7's rule, applied here: a clause whose value the evidence
            already carries is dropped. What is left is the one thing neither the
            answer nor the standing says, the size of the spread, and with the
            answer directly above it the "it" is the dearest door. */}
        <div className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{spread}</div>
        <div className="mt-4">
          <RankedTiles
            rows={items.map((s) => ({ name: s.name, value: money(s.capital_usd) }))}
            ariaLabel="Trades next door, ranked by what it costs to open one, cheapest first"
          />
        </div>
        {/* THE NOTE HAS NEVER REACHED A READER. The adapter has owned this
            string since 2026-08-18, calls it "the one string this module owns"
            and wrote it precisely to say that these rows are peer trades rather
            than formats inside this one; the card it was written for never
            rendered it. It carries the second half too, which is the half this
            card now depends on entirely: the cost is a modeled archetype for a
            baseline economy, not a quote for any one place. */}
        {note ? (
          <p className="mt-4 border-t border-[var(--c-border)] pt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">{note}</p>
        ) : null}
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
      <Box id="split">
        <Rail icon="cost-breakdown" kicker="Where each $100 goes" verdict={`The owner's slice is what ${nonKeptWord} bigger lines leave behind.`} sample />
        {/* THE ON-BAR LABELS MOVED INTO THE SHARED BAR. This page drew its own
            overlay, with the same rule the shared form now applies , at or above
            12%, plus the kept slice regardless, because the kept slice is the
            card's answer and must never be the one segment without a value.

            The trade page uses the same form and drew NO on-bar labels, so one
            idea rendered two ways on two pages. Fixing that in the shared bar
            duplicated every label here, ink over ink, until this overlay came
            out. The shared version also picks its text colour from each segment's
            own luminance instead of one ink at 80% opacity, so it holds on the
            dark grey as well as the light ones. */}
        <StackBar segments={parts.map((p) => ({ label: p.name, pct: p.pct, color: p.color, kept: !!p.kept }))} sort={false} h="h-11" ariaLabel={parts.map((p) => `${p.name} ${p.pct}%`).join(", ")} legend />
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
              <span className="whitespace-nowrap font-semibold uppercase tracking-wide text-[var(--c-ink2)]">{b.label} <Fig className="text-[var(--c-ink)]">{b.pct}%</Fig></span>
              {b.sub ? <span className="mt-0.5 block leading-tight text-[var(--c-muted)]">{b.sub}</span> : null}
            </>
          );
          return (
            <>
              <div /* MINMAX, SO A COLUMN NEVER GETS NARROWER THAN ITS OWN LABEL. The tracks
                     are proportional to the values, which is the point of the bracket, but
                     a 3fr track against a 90fr one is far too narrow to hold the words
                     FIXED 3% on one line. So two of the three labels wrapped and one did
                     not, and the row showed the same kind of information in two different
                     arrangements. Each track now starts at the width its text needs and
                     shares what is left in proportion. */
                className="mt-4 hidden gap-1 text-[length:var(--t-micro)] sm:grid sm:grid-cols-[minmax(min-content,var(--vc))_minmax(min-content,var(--fc))_minmax(min-content,var(--kc))]" style={{ ["--vc" as any]: `${variablePct}fr`, ["--fc" as any]: `${fixedPct}fr`, ["--kc" as any]: `${keptPct}fr` }}>
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
  /* THE ONE-YEAR SURVIVAL FIGURE IS NOT SHOWN HERE ANY MORE, because this page
     already printed it twice and drew it a third time. It reads as "89% survive
     yr 1" on this scorecard, as the refutation of "most fail within a year" in
     the myths card, and as the first point of the five-year curve. Three sections
     of one page carrying one number, and the scorecard is the only one of the
     three that does nothing with it: the myths card uses it to break a claim, and
     the curve needs it to have a curve at all.
     NOTHING TAKES ITS PLACE, and that was checked rather than assumed. The
     adapter also carries what the owner keeps, which the page prints in the myths
     card, in the close, and in the hundred-dollar split; and the five-year figure
     is already the label on the curve. Every candidate neighbour was itself a
     repeat, so a second fact here would only move the duplication rather than end
     it. The card states the one thing on it that appears nowhere else. */
  void o.survival_1yr_pct;
  if (typeof o.sale_multiple_low === "number" && typeof o.sale_multiple_high === "number") {
    facts.push([`x${o.sale_multiple_low}-${o.sale_multiple_high}`, "profit at sale"]);
  }
  // Nothing honest to show: no support fact survives.
  if (facts.length === 0) return null;
  const factCols = facts.length >= 3 ? "grid-cols-3" : facts.length === 2 ? "grid-cols-2" : "grid-cols-1";
  return (
    <Box id="open" {...(facts.length === 1 ? { "data-lean": "1" } : {})}>
      {/* THE CARD IS NAMED FOR WHAT IT SHOWS. It was called "The typical operator",
          which promises a portrait of a person, and after the duplicate survival
          figure came off it holds one number and that number describes the venture,
          not the owner: what it takes to open one.
          It was also repeating, word for word, the eyebrow of the movement it sits
          inside. A chapter opener and the first card under it saying the same three
          words is a reader being told twice where they are. */}
      <Rail icon="worked-example" kicker="What it takes to open" verdict={o.verdict} sample />
      <div className={`grid ${factCols} divide-x divide-[var(--c-border)] border-t border-[var(--c-border)] pt-3`}>
        {/* A SCORECARD OF ONE IS NOT A SCORECARD, IT IS AN ANSWER. Three facts side by
            side share a size because they are peers being compared. When only one
            survives, that size makes the card look like a scorecard with two cells
            missing, so the single fact takes answer size and the card reads as what
            it now is: one figure and what it means. */}
        {facts.map(([val, l]) => <div key={l} className="px-3 first:pl-0 last:pr-0"><Fig className={`${facts.length === 1 ? "text-[length:var(--t-focal)] leading-none" : "text-[length:var(--t-head)]"} text-[var(--c-ink)]`}>{val}</Fig><div className="mt-0.5 text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">{l}</div></div>)}
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
    <Box id="survival" className="flex flex-col">
      <Rail icon="trend" kicker="Five-year survival" verdict={s.verdict} />
      <SurvivalCurve curve={curve} />
    </Box>
  );
}

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
      {/* THE HERO, one of the two chrome bands that may run full width (art
          direction D1). Everything below it divides. */}
      <Band hero><Masthead d={d} /></Band>

      {/* SEVEN CHAPTERS BECOME FOUR, AND NOT ONE SECTION WAS CUT. Measured
          2026-08-25 at 1440, seven of this page's ten sections took the full
          column, and the cause was the same on every one: a chapter holding a
          single section has nothing to pair with, so it takes the width by
          default. Four of these seven chapters held exactly one. The headings
          consolidate; the content stays.

          No band repeats the split of the band before it (D3), and the split
          follows the content (D4): the seven-row leaderboard takes the large side
          of its band, the one-figure spend read takes the small one. */}
      {hasBenchmark || hasDemand ? <>
        <Movement index="01" eyebrow="Against the neighbours" heading="Against the trades next door" icon="benchmark" />
        <Band split="3-2">
          {hasBenchmark ? <Benchmark d={d} /> : null}
          {hasDemand ? <Demand d={d} /> : null}
        </Band>
      </> : null}

      {subCount > 0 || hasMoneySplit || hasBreakEven ? <>
        <Movement index="02" eyebrow="How the money works" heading="What a door costs, and where the money goes" icon="unit-economics" />
        {/* 2-1 TO 2-3, AND BOTH CARDS GAIN, WHICH IS THE STRONGEST KIND OF WIDTH
            ARGUMENT. C6 turned the first card into a STANDING, and A1 measured
            what a standing does past roughly 500px: the name sits at one edge and
            the figure at the other and the rows read as pairs marooned across a
            gap. At 693 this one put 386px between "Pizzerias" and its price. The
            money split beside it is a stacked bar, and a bar wants every pixel of
            width it can get. So the standing takes 416 and the bar takes 624.
            D3 pins the choice rather than leaving it to taste: the band above is
            3-2 and the band below is 1-2, so of the five legal splits only 1-1,
            2-1 and 2-3 remain, and 1-1 leaves the standing at 520 where A1's
            stranding is worse, not better. */}
        <Band split="2-3">
          {subCount > 0 ? <SubtypeDrill d={d} /> : null}
          {hasMoneySplit ? <MoneySplit d={d} /> : null}
        </Band>
        {hasBreakEven || hasRamp ? (
          <Band split="1-2">
            {hasBreakEven ? <BreakEven d={d} /> : null}
            {hasRamp ? <Ramp d={d} /> : null}
          </Band>
        ) : null}
      </> : null}

      {hasOperator || hasPayback || hasSurvival || hasWhoSuits ? <>
        <Movement index="03" eyebrow="The typical operator" heading="The owner's take, and the odds" icon="who-for" />
        <Band split="2-3">
          {hasOperator ? <Operator d={d} /> : null}
          {hasPayback ? <CapitalPayback d={d} /> : null}
        </Band>
        <Band>
          {hasSurvival ? <Survival d={d} /> : null}
          {hasWhoSuits ? <WhoItSuits d={d} /> : null}
        </Band>
      </> : null}

      {hasWherePays || hasSeasonality || hasCaveats ? <>
        <Movement index="04" heading="The place, and the year" icon="where-it-pays" />
        <WherePaysExplorer d={d} />
        <Band split="2-1">
          {hasCaveats ? <Caveats d={d} /> : null}
          {hasSeasonality ? <Seasonality d={d} /> : null}
        </Band>
      </> : null}

      {/* THE TERMINUS, the second and last chrome band (D1). */}
      <Movement index="05" heading="The next move" icon="bookmark" />
      <Band hero><Close d={d} /></Band>
    </main>
  );
}
