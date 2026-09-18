"use client";
/**
 * The money chapter , the client half that reads the FormatContext so the chosen
 * subtype PROPAGATES: the owner-keeps stepped waterfall (derived from the $100 split,
 * always closing to 100) and the break-even headroom re-read for the format the
 * reader actually means. THE COST TO OPEN LEFT THIS FILE on plan step 33's second
 * dispatch (2026-09-18): MODEL.md 8.6 `04 open` draws it on RankedBars in
 * cell/turn-one.tsx from open_rows.ts, every setup line as one set with the
 * shard's own payback in the foot; the LollipopColumn card that stood here drew
 * five of nine lines and a payback derived from the picker, and retires with it. Focal figures count
 * up once on scroll-in (reduced-motion safe). Terracotta is rationed to exactly one
 * element per Box (the kept step / the payback figure / the break-even fill). The
 * owner's $ take appears at hero scale in the masthead + control-room trio ONLY ,
 * this file never restates it big (Final Ascent dedup).
 *
 * PROPAGATION IS TOTAL: every figure a format switch touches either recomputes from
 * the picked subtype (break-even numerator AND denominator, payback = capex / take)
 * or is format-neutral prose the seed keeps number-free (break_even.surface_line).
 * The signature interaction must never render side-by-side contradictions.
 *
 * All prose comes from the seed (owner.surface_line, break_even.surface_line),
 * so scaled cells read specific, not templated.
 */
import * as React from "react";
import { Box, Rail, Fig, InfoTip, InlineDisclosure } from "@/components/spine/kit";
import { ClearanceRing } from "@/components/spine/forms-v2";
import { AtlasWaterfall } from "@/components/kit/charts/AtlasWaterfall";
import { useFormat, useCountUp, useInView } from "./format-picker";

function useReduced() {
  const [r, setR] = React.useState(false);
  React.useEffect(() => { const mq = window.matchMedia("(prefers-reduced-motion: reduce)"); setR(mq.matches); }, []);
  return r;
}

/* a focal figure that counts up the first time it scrolls into view */
function CountFig({ value, fmt, className }: { value: number; fmt: (n: number) => React.ReactNode; className?: string }) {
  const reduced = useReduced();
  const { ref, seen } = useInView<HTMLSpanElement>();
  // rest at the real value; animate up only once it scrolls into view (never render 0)
  const v = useCountUp(value, reduced, 520, seen);
  return <span ref={ref} className={`fig ${className ?? ""}`}>{fmt(v)}</span>;
}

/* a small "reflecting: Fast casual" tag so the propagation is legible */
function FormatTag() {
  const ctx = useFormat();
  if (!ctx) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--c-ink2)]">
      {ctx.sel.name}
    </span>
  );
}

/* OwnerKeeps , WI-3/4 brief (merged, Final Ascent):
 * decision: how much of turnover actually reaches the owner. The headline $ figure is
 * REMOVED (it lives once at hero scale in the masthead and once in the control-room trio);
 * this card's unique content is the PATH, a true stepped gross-to-net waterfall derived
 * from the $100 split (the one margin source, so the numbers always close to 100).
 * Format propagation: the kept slice follows the picker; the cost steps re-scale
 * proportionally to close the identity (same contract as CostToOpen's line items).
 * width: WideRail chart half. terracotta target: the kept step only.
 * disclosure: the cost-driver notes (names + mechanisms, figures live in the chart). */
export function OwnerKeeps({ d }: { d: any }) {
  const ctx = useFormat();
  const items: any[] = d.money_split?.items ?? [];
  // The card's unique content is the gross-to-net waterfall drawn from the $100
  // split. With no honest split there is nothing to draw, so omit the whole card
  // rather than render an empty shell.
  if (items.length === 0) return null;
  const baseKeep = items.find((it) => it.kept)?.pct ?? d.margins?.net_pct ?? 0;
  const keepPct = ctx ? ctx.sel.keeps_pct : baseKeep;
  // re-scale the non-kept slices so steps + keep always sum to exactly 100
  // (largest-remainder rounding; at the blended default the seed integers pass through).
  const nonKept = items.filter((it) => !it.kept);
  const restSum = nonKept.reduce((a, it) => a + it.pct, 0) || 1;
  const target = 100 - keepPct;
  const exact = nonKept.map((it) => ({ name: it.name, raw: (it.pct * target) / restSum }));
  const floored = exact.map((e) => ({ name: e.name, pct: Math.floor(e.raw), frac: e.raw - Math.floor(e.raw) }));
  let remainder = target - floored.reduce((a, e) => a + e.pct, 0);
  const byFrac = [...floored].sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < byFrac.length && remainder > 0; i++, remainder--) byFrac[i].pct += 1;
  const costs = floored.map(({ name, pct }) => ({ name, pct })).sort((a, b) => b.pct - a.pct);
  const drivers: any[] = d.cost_drivers ?? [];
  return (
    <Box id="keeps" className="md:flex-[3]">
      <div className="flex items-start justify-between gap-2">
        <Rail icon="owner-keeps" kicker="What the owner keeps" sample />
        <FormatTag />
      </div>
      {/* THE MONEY IDENTITY, on the chart library rather than hand cut SVG.
          The drawing it replaced scaled its own TEXT with its box, so the same
          labels were unreadable on a phone and oversized in a wide band. This
          one holds a real size at every width, wraps a long cost name onto a
          second line instead of running it into its neighbour, and renders
          NOTHING at all if the split does not close to the opening figure. */}
      <AtlasWaterfall
        start={{ label: "Sales", value: 100 }}
        steps={costs.map((c) => ({ label: c.name, value: c.pct }))}
        end={{ label: "Keeps", value: keepPct }}
        prefix="$"
        height={190}
      />
      <InlineDisclosure name="ownerkeeps" summary="What moves the margin">
        <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
          {drivers.map((c) => (
            <div key={c.name} className="grid grid-cols-[130px_1fr] items-baseline gap-3 py-2">
              <span className="text-[12px] font-medium text-[var(--c-ink)]">{c.name}</span>
              <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{c.note}</span>
            </div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}

/* BreakEven , A4 of the subsection queue, rebuilt 2026-09-02 on the catalogue's
 * ClearanceRing (idea I7, area, cap 1 per page).
 *
 * WARRANT (subsection procedure, step 1). A visitor reads this to decide WHETHER
 * AN ORDINARY DAY IN THIS ROOM ALREADY COVERS THE COSTS, and how much slack sits
 * between a normal day and a bad one. Without it they would sign a lease against
 * a number of covers nobody has checked against the trade's own cost base, and
 * find out on the first slow week that a normal day WAS the break-even day.
 *
 * THE INFORMATION IS A THRESHOLD YOU MUST CLEAR, which is its own row in the
 * catalogue's index, and the form that row points at is this one. Version 2's
 * ThresholdBlock, two bars from one baseline, is struck: it was a two-row bar
 * chart, which is the exact silhouette the whole catalogue exists to stop the
 * pages repeating.
 *
 * WHAT WAS HERE, AND WHY IT HAD TO GO. A two-marker horizontal scale, the shape
 * the founder named on 2026-09-01: "in all sections you have just used this
 * horizontal bar with the points in between... you have overused it like crazy."
 * It was also hand-rolled inline rather than a kit form, so it carried no
 * data-idea and no budget could see it, which is the catalogue addendum's
 * "where the sameness actually lives" in one card.
 *
 * AND IT SAID ONE FACT THREE TIMES. A focal "16 covers a day to break even", a
 * track with both figures marked on it, and then two tiles reading "5 covers of
 * headroom" and "76% of a typical day". The headroom IS the gap between the two
 * marks, and the percentage IS the fill; the card spent three readings and a
 * hairline saying what one drawing says at a glance.
 *
 * WHAT THE RING FIXES THAT NO REWORDING COULD. The old track's own comment
 * records the bug at length: when break-even sits ABOVE a typical day, the
 * domain becomes the break-even value, so the typical-day tick lands at the
 * right-hand end and the picture shows a comfortable cushion drawn on exactly
 * the trades that have none. A ring cannot do that. The full circle IS the
 * threshold, so a day that does not cover costs leaves the ring OPEN, and there
 * is no end of a track for a mark to be pinned to.
 *
 * COMPOSITION: the ring, its clearance standing in the middle, the two figures
 * named in one line beneath. Nothing else. The clearance is the answer and the
 * line under it says what the answer was measured from.
 *
 * HIERARCHY: first the clearance at the focal rung inside the ring, second the
 * two named figures at micro. 30 over 12 is 2.5x, well over the 1.6 floor. There
 * is no second claimant, which is the point: the card used to have three.
 *
 * ACCENT: the closed sweep, and only when the day CLEARS. It is the card's one
 * accent now; before, the break-even figure and the track's dot both wore it.
 * A shortfall draws in ink and gets no red, because this palette has none.
 *
 * THE FALLBACK IS GONE, AND IT WAS A FABRICATED FINDING. The typical day used to
 * read `?? Math.max(covers, 1)`, so a cell holding a break-even and no typical
 * day rendered "0 covers of headroom" and "100% of a typical day" as though both
 * had been measured. On a ring the same fallback would close the circle exactly
 * and print "level", which is worse, because a drawing is the half a reader
 * believes. A cell with only the threshold now renders the threshold alone, as a
 * figure and its words, which is the catalogue's form for one number standing on
 * its own.
 *
 * PROPAGATION IS UNCHANGED AND STILL TOTAL: both the numerator and the
 * denominator follow the format picker, so the ring can never draw one subtype's
 * threshold against another's day. */
export function BreakEven({ d }: { d: any }) {
  const ctx = useFormat();
  const b = d.break_even ?? {};
  const covers = ctx ? ctx.sel.break_even_covers_per_day : (b.covers_per_day ?? 0);
  const typicalRaw = ctx ? ctx.sel.typical_covers_per_day : b.typical_covers_per_day;
  /* ROUNDED ONCE, HERE, AND THE DRAWING READS THE ROUNDED PAIR. Half a cover is
     not a thing that walks through a door, and a ring drawn from 16.4 against a
     caption saying 16 would be a drawing disagreeing with its own caption by a
     few degrees of arc: small, invisible, and exactly the kind of thing this
     page has been caught on before. */
  const need = Number.isFinite(covers) && covers > 0 ? Math.round(covers) : null;
  const takes =
    typeof typicalRaw === "number" && Number.isFinite(typicalRaw) ? Math.round(typicalRaw) : null;
  const gloss = "One cover is one customer served; a table of four is four covers.";
  return (
    <Box id="breakeven" className="md:flex-[2]">
      <div className="flex items-center justify-between gap-2">
        <Rail icon="break-even" kicker="When it clears costs" sample />
        <FormatTag />
      </div>
      {need != null && takes != null ? (
        <ClearanceRing
          needed={need}
          given={takes}
          neededLabel="break-even needs"
          givenLabel="a typical day takes"
          format={(n) => String(Math.round(n))}
          unit="covers"
          note={
            <>
              <Fig>{need}</Fig> covers
              <InfoTip gloss={gloss} /> to break even, about <Fig>{takes}</Fig> on a typical day
            </>
          }
        />
      ) : (
        <div className="flex items-baseline gap-2">
          <CountFig value={need ?? 0} fmt={(n) => Math.round(n)} className="text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]" />
          <span className="text-[13px] text-[var(--c-ink2)]">
            covers
            <InfoTip gloss={gloss} /> a day to break even
          </span>
        </div>
      )}
    </Box>
  );
}
