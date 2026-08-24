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
  const take = d.owner?.take_home_usd ?? 0;
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  const t = useCountUp(take, reduced, 620);

  return (
    <section className="overflow-hidden py-6 md:py-8">
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
        <h1 data-typography="custom" className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2.6rem]">{h.answer}</h1>

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
            <div className="fig leading-none text-[var(--terra-text)]" style={{ fontSize: "clamp(2.6rem, 7vw, 3.6rem)" }}>{money(reduced ? take : t)}</div>
            <div className="mt-1 text-[12.5px] text-[var(--c-ink2)]">a year, after every cost is paid.</div>
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
              <Fig className="text-[20px] text-[var(--c-ink)]">{breakWord}</Fig>
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
