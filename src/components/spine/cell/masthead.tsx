"use client";
/**
 * Masthead , the answer-first hero. The single most valuable number on the page,
 * what a typical owner KEEPS, is the dominant figure (focal .fig, counts up on
 * mount, top 20%). Net margin + break-in read as support beside it. The revenue
 * spread renders as a labeled p10/p50/p90 SpreadStrip BELOW the scorecard, neutral
 * (support, ink marker). Provenance is stated ONCE here as a calm line, not
 * per-card pills. terracotta: the take-home hero figure is the hero's ONLY accent.
 * The market-density count (n_firms, "how many already trade here") lives as the
 * scorecard's third tile (founder D7 + rulebook v1 section 17: the old half-width
 * HonestTake card was a lone figure swimming in white space, folded in here).
 */
import * as React from "react";
import { Fig, InfoTip, SampleTag, SpreadStrip, usd, CARD_SURFACE } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";
import { useCountUp } from "./format-picker";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

export function Masthead({ d }: { d: any }) {
  const h = d.headline ?? {};
  const breakWord = h.break_in_0_100 >= 45 ? "Manageable" : h.break_in_0_100 >= 30 ? "Demanding" : "Brutal";
  const hasFirms = typeof h.n_firms === "number" && Number.isFinite(h.n_firms);
  /* NO TAKE-HOME FIGURE MEANS NO TAKE-HOME FIGURE, NOT ZERO. Found by rendering
     this page for a trade and city that are not the exemplar: Mumbai cafes carry
     no owner take-home, and the masthead answered "$0 a year, after every cost is
     paid" in the largest type on the page. A missing measurement asserted as a
     measured nil is the worst kind of wrong number, and it was the FIRST thing a
     reader saw. Art direction F6, rulebook §0. */
  const takeRaw = d.owner?.take_home_usd;
  const hasTake = typeof takeRaw === "number" && Number.isFinite(takeRaw) && takeRaw > 0;
  const take = hasTake ? takeRaw : 0;
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  const t = useCountUp(take, reduced, 620);

  return (
    <section id="take" className="overflow-hidden py-6 md:py-8">
      <div className="rounded-[14px] border border-[var(--c-border)] p-5 md:p-6" style={CARD_SURFACE}>
        {/* crumb , real wayfinding: each segment carries its altitude mark, kept quiet (muted ink) */}
        {/* a trade/city/country wayfinding crumb, not a restated title; panel-approved (cell-00 passed) */}
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--c-ink2)]">{/* allow-eyebrow */}
          <span className="inline-flex items-center gap-1.5"><AtlasMark id="alt-business" size={13} className="opacity-55" />{d.meta?.trade}</span>
          <span aria-hidden>&middot;</span>
          <span className="inline-flex items-center gap-1.5"><AtlasMark id="alt-city" size={13} className="opacity-55" />{d.meta?.city}</span>
          <span aria-hidden>&middot;</span>
          <span className="inline-flex items-center gap-1.5"><AtlasMark id="alt-country" size={13} className="opacity-55" />{d.meta?.country_name}</span>
        </div>
        {/* rulebook v1 section 35: H1 is font-semibold, never bold (bold display reads cheap) */}
        {/* THE h1 IS THIS PAGE'S ANSWER IN WORDS, AND THAT IS PRECISELY WHY IT
            DOES NOT TAKE THE ANSWER RUNG. Step 5: "A WORD IS NOT A QUANTITY. A
            state, a name, a verdict phrase takes lead or section size, never
            focal or answer." This is a verdict phrase, so --t-section is the top
            rung open to it, and the quantity beside it, the take-home under "A
            typical owner keeps", is what carries the answer rung.
            It was text-3xl md:text-[2.6rem], 30 and 41.6, and 41.6 is above the
            ceiling: measured on the render the pair read 57.6 over 41.6 at 1280
            (1.38x) and 41.6 over 30 at 375 (1.39x), failing step 5's floor at
            both. One size now, and 40 over 24 is 1.67x at every width. */}
        <h1 data-typography="custom" className="max-w-3xl text-[length:var(--t-section)] font-semibold leading-tight tracking-tight text-[var(--c-ink)]">{h.answer}</h1>

        {/* the hero scorecard: owner-keeps dominant, the other two as support */}
        {/* THE TILE COLUMN IS SIZED BY ITS CONTENTS, not by a share of the row.
            Stacking them on a phone was only half the fault. Above the wide
            breakpoint the row splits one and a half to one, which hands the three
            tiles roughly two hundred and seventy pixels between them, and
            "Demanding" set at twenty needs more than that on its own. So the same
            word clipped to "Demandin" at nine hundred pixels wide as clipped to
            "Deman" at three hundred and twenty. Caught by photographing the first
            fix and finding it had solved one end of the range and not the other.
            The tiles now take the width they need and the headline figure takes
            what is left, which it has in abundance. */}
          <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1.5fr)_auto] md:items-end">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">A typical owner keeps</div>
            {hasTake ? (
              <>
                {/* THE CLAMP IS GONE AND THE RUNG IS DECLARED. clamp(2.6rem,
                    7vw, 3.6rem) resolved to 57.6px at 1280 and 41.6px at 375,
                    and BOTH ends sit above the ladder's ceiling of 40, whose own
                    comment reads "NOTHING IS LARGER". An inline fontSize is also
                    invisible to verify_type_ladder, which reads classes, so the
                    largest figure on this page was outside the instrument as
                    well as outside the ladder: the same blind spot C7 found in
                    rem and C17 found again on home. */}
                <div className="fig text-[length:var(--t-answer)] leading-[1] text-[var(--terra-text)]">{money(reduced ? take : t)}</div>
                <div className="mt-1 text-[12.5px] text-[var(--c-ink2)]">a year, after every cost is paid.</div>
              </>
            ) : (
              <>
                {/* THE DASH IS SIZED AS AN ABSENCE, NOT AS A FIGURE. At display
                    size an en-dash is a long thin bar that reads as a rule or a
                    stray mark rather than as "no value here", which is the
                    opposite of what it is for. It takes the same size as the
                    sentence it belongs to. */}
                <div className="fig mt-1 text-[length:var(--t-head)] leading-none text-[var(--c-muted)]">&ndash;</div>
                {/* A LADDER STEP, NOT 12.5px. The line above this one carries a
                    grandfathered off-ladder size; adding a second copy of it would
                    have grown a ratchet that only counts down, and it did, from
                    414 to 415. New text takes a declared step. */}
                <div className="mt-1.5 max-w-[46ch] text-[length:var(--t-body)] text-[var(--c-ink2)]">not measured for this trade in this city yet. The margin and the cost to open below are modeled from the trade&rsquo;s own shape.</div>
              </>
            )}
          </div>
          {/* THE TILES STACK BEFORE THEY CLIP.
            This was three fixed columns with no width rule at all, inside a box
            that hides its overflow. On a phone each tile got about fifty pixels
            of room for a figure set at twenty, so "Demanding" printed as "Deman"
            and the count of firms already trading here was cut off at its right
            edge. Two of the three readings in the page's own scorecard were
            unreadable on the width most people use, and the box quietly swallowed
            the evidence.
            The library's own stats grid stacks below its breakpoint and only
            then goes to three across. That convention is the fix; the block
            itself is a section-wide band with its own heading and does not
            belong inside a masthead. Structure adopted, block declined.
            NO BREAKPOINT, THOUGH. The first attempt used one, and the width gate
            failed the build for it: this repo already carries fifty-four grids
            whose second layout is pitched at a width no phone reaches, and it
            refuses to accept a fifty-fifth. It is right to. A tile that asks for
            the room it needs and wraps when it cannot get it works at EVERY
            width, not at two of them, and needs no breakpoint at all.
            A WRAPPING ROW, NOT A WRAPPING GRID. The grid version left a hole:
            three tiles on a half card fitted two across, and the third sat in one
            cell of a two-cell row with the empty half showing the hairline colour
            through it. A row that wraps has no cells to leave empty, so the last
            tile takes the rest of its line. Seen by photographing it at that
            exact width; the grid looked right at every other one.
            AND THE TILES SIZE THEMSELVES. A fixed minimum width is wrong in both
            directions: large enough to stop a word being crushed on a half card
            and it forces a wrap on a full one, small enough to keep three across
            on a full card and it crushes the word again on the half. Sized to
            their own contents they wrap exactly when they must and never before,
            with no number in the stylesheet to get wrong. */}
          <div className="flex flex-wrap gap-px overflow-hidden rounded-xl border border-[var(--c-border)]" style={{ background: "var(--c-border)" }}>
            <div className="flex-[1_1_auto] whitespace-nowrap bg-[var(--c-card)] px-3.5 py-3">
              <Fig className="text-[20px] text-[var(--c-ink)]">{d.margins?.net_pct}%</Fig>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">net margin<InfoTip gloss="Profit as a share of sales, after every cost." /></div>
            </div>
            <div className="flex-[1_1_auto] whitespace-nowrap bg-[var(--c-card)] px-3.5 py-3">
              {/* A WORD IS NOT A FIGURE AND MUST NOT BE DRESSED AS ONE. This tile sat
                  between two hard measurements, a net margin and a count of firms, and
                  it was set in the same numeral face at the same size, so a reader
                  scanning three tiles read three numbers and one of them was an
                  adjective.
                  The word stays a word. Printing the score behind it would be worse,
                  not better: rule 26 and the form catalogue both forbid a precise
                  marker on a rough measure, and one of that score's three inputs is
                  modeled everywhere. What changes is that it now LOOKS like the
                  judgment it is, in the reading face, so the eye stops counting it
                  among the measurements. */}
              <span className="block text-[20px] font-medium leading-none text-[var(--c-ink)]">{breakWord}</span>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">to break in</div>
            </div>
            {hasFirms ? (
              <div className="flex-[1_1_auto] whitespace-nowrap bg-[var(--c-card)] px-3.5 py-3">
                <Fig className="text-[20px] text-[var(--c-ink)]">{h.n_firms.toLocaleString()}</Fig>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">already trade here</div>
              </div>
            ) : null}
          </div>
        </div>

        {/* the turnover spread , SUPPORT below the scorecard (neutral ink marker), so the
            $43K take-home stays the hero's only terracotta */}
        {h.rev_p10_usd && h.rev_p50_usd && h.rev_p90_usd ? (
          <div className="mt-5 max-w-md">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Yearly turnover, comparable rooms</div>
            <SpreadStrip p10={h.rev_p10_usd} p50={h.rev_p50_usd} p90={h.rev_p90_usd} fmt={money} basis={h.rev_spread_basis === "measured" ? "measured" : "modelled"} />
          </div>
        ) : null}

        {/* provenance as the page-level sample marker (rulebook 4A): the hero figures
            are placeholder, so the tag carries the illustrative line, unmissable and calm. */}
        {d.meta?.provenance_line ? (
          <div className="mt-4">
            <SampleTag note={d.meta.provenance_line} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
