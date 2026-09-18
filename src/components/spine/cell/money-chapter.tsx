"use client";
/**
 * The money chapter's one remaining client card: the break-even ring
 * (`08 clears`'s seat until its own dispatch). THE COST TO OPEN LEFT THIS
 * FILE on plan step 33's second dispatch (2026-09-18): MODEL.md 8.6 `04
 * open` draws it on RankedBars in cell/turn-one.tsx from open_rows.ts. THE
 * OWNER-KEEPS WATERFALL AND THE FORMAT CONTEXT LEFT ON THE THIRD (2026-09-18):
 * `05 split` draws the one split on IncomeBreakdown from split_rows.ts (the
 * waterfall was a second drawing of the same figures, rescaled to close to
 * a hundred, which the residual law forbids), and the subtype control room
 * (format-picker.tsx: the picker, its provider and the Pro seam, never
 * populated on the live route) retired with it, so this card reads the seed
 * alone: `break_even.covers_per_day` against `typical_covers_per_day`, the
 * cell's own, never a format's. The count-up hooks the ring's one-figure
 * fallback uses moved here from that file. Terracotta is rationed to the
 * ring's closed sweep.
 */
import * as React from "react";
import { Box, Rail, Fig, InfoTip } from "@/components/spine/kit";
import { ClearanceRing } from "@/components/spine/forms-v2";

/* Count/draw the focal number toward its target. The RESTING value is always the real
 * target (SSR / no-JS / reduced-motion / not-yet-in-view all show the true number , never
 * a 0). `active` gates only the ANIMATION: pass a scroll-in flag for below-fold figures so
 * they show the real number until seen, then count up; above-fold callers leave it true.
 * First reveal tweens from 85% of the target (mirrors spine-city/motion, the sanctioned
 * pattern): a mid-tween capture must sit within rounding distance of the truth, never a
 * transient 0% beside settled context. Later target switches run prev -> target. */
function useCountUp(target: number, reduced: boolean, ms = 520, active = true) {
  const [v, setV] = React.useState(target);
  const from = React.useRef(0);
  const done = React.useRef(false);
  React.useEffect(() => {
    if (reduced || !active) { setV(target); from.current = target; return; }
    const start = performance.now();
    const a = done.current ? from.current : target * 0.85; // first reveal: 85% -> target; later switches: prev -> target
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setV(a + (target - a) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
      else { from.current = target; done.current = true; }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, ms, active]);
  return v;
}

/* run a callback once when the element first scrolls into view (for count-up-on-scroll) */
function useInView<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

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
 * THE FORMAT CONTEXT IS GONE (plan step 33's third dispatch): the numerator and
 * the denominator are the seed's own, one cell's day against one cell's
 * threshold, so the ring can never draw one subtype's threshold against
 * another's day, because there are no subtypes on the page. */
export function BreakEven({ d }: { d: any }) {
  const b = d.break_even ?? {};
  const covers = b.covers_per_day ?? 0;
  const typicalRaw = b.typical_covers_per_day;
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
      <Rail icon="break-even" kicker="When it clears costs" sample />
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
