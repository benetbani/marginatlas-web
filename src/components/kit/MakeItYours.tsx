"use client";

/**
 * MakeItYours - the inline "place yourself on the spread" what-if calculator
 * (the agency primitives P1-P5 composed into one control).
 *
 * A reader looking at a typical owner take-home wants one honest question
 * answered: what if my rent ran higher, my payroll lighter, my own draw set
 * somewhere of my choosing. This is that what-if, and it is careful to stay a
 * what-if: it never invents a fake precise number, it always keeps the canonical
 * Atlas figure anchored beside the reader's own scenario, and it is labelled as
 * the reader's scenario in plain words ("Make it yours, a quick what-if").
 *
 * The model is deliberately transparent and linear (a what-if, not a forecast):
 *   adjusted take-home = canonical take-home
 *                        minus (your rent      minus typical rent)
 *                        minus (your payroll   minus typical payroll)
 * Every extra dollar of rent or payroll comes straight off take-home, dollar for
 * dollar, because in a small operation it does. When a "your monthly draw" lever
 * is offered it is the owner's own pay target and is shown as such; it does not
 * pretend to re-solve the whole P&L. Margin is simply adjusted take-home over the
 * same revenue. The assumptions are stated on screen so the number is never a
 * black box.
 *
 * Agency principles, honored:
 *  - P1: the sliders act on the visible take-home / margin in place.
 *  - P2: every recompute is a cheap client derivation, live, under 100ms, with NO
 *    Apply button (the kit Slider fires onChange on every move).
 *  - P3: reversible. The canonical figure rides beside the adjusted one via
 *    ResetAnchor, a visible "Reset to typical" clears it, and the levers live in
 *    the URL via useUrlStateMap as ONE coalesced write (shareable, Back-safe).
 *  - P4: each lever is labelled and anchored to its typical, so the reader stays
 *    oriented in what they are bending.
 *  - P5: disclosed not displayed. It sits collapsed behind a quiet opener and
 *    expands on intent.
 *
 * The derived take-home is pushed up through `onYouChange` so the page can feed
 * RangeStrip's `you` marker and the reader sees their own scenario land on the
 * signature spread.
 *
 * Constraint-safe: tokens only (no raw hex / px / ms), no em-dashes, no
 * source-agency names, USD figures, focus rings + 44px targets + AA, reduced
 * motion respected.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "./controls/Slider";
import { ResetAnchor } from "./controls/ResetAnchor";
import { useUrlStateMap } from "@/lib/url_state";

/** The canonical (typical) figures the what-if bends away from. revenue,
 *  takeHome and marginPct are required; the three levers are optional and each
 *  lever only renders when its typical anchor is supplied. */
export type MakeItYoursCanonical = {
  /** Typical annual revenue. The fixed base every margin is taken over. */
  revenue: number;
  /** Typical owner take-home (the lead figure the what-if bends). */
  takeHome: number;
  /** Typical margin, as a percent (take-home over revenue). */
  marginPct: number;
  /** Typical annual rent. Omit to hide the rent lever. */
  rent?: number;
  /** Typical annual payroll. Omit to hide the staff lever. */
  staff?: number;
  /** Typical owner monthly draw. Omit to hide the draw lever. */
  draw?: number;
};

export type MakeItYoursProps = {
  /** The typical figures the reader bends away from. */
  canonical: MakeItYoursCanonical;
  /** Formats every USD figure (e.g. (n) => fmtUSD(n)). */
  format: (n: number) => string;
  /**
   * Pushes the reader's derived take-home up so the page can feed RangeStrip's
   * `you` marker. Fires with the canonical take-home on mount and reset, and the
   * adjusted take-home on every move, so the marker tracks the scenario and
   * lands back on typical when cleared. (Pass the value straight into
   * <RangeStrip you={...} /> if the strip plots take-home.)
   */
  onYouChange?: (takeHome: number) => void;
  /** Stable id root for the sliders + disclosure (defaults to a generated id). */
  idBase?: string;
  className?: string;
};

/** A finite, real number. */
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/** Round-trip a non-negative integer through the URL; null drops it (back to the
 *  canonical fallback, keeping the address clean when a lever is untouched). */
function parseMoney(raw: string | null): number | null {
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
const serializeMoney =
  (canonical: number) =>
  (v: number): string | null =>
    Math.round(v) === Math.round(canonical) ? null : String(Math.round(v));

export function MakeItYours({
  canonical,
  format,
  onYouChange,
  idBase,
  className,
}: MakeItYoursProps) {
  const reactId = React.useId();
  const base = idBase ?? reactId;
  const regionId = `${base}-region`;
  const [open, setOpen] = React.useState(false);

  const hasRent = isNum(canonical.rent);
  const hasStaff = isNum(canonical.staff);
  const hasDraw = isNum(canonical.draw);

  // The three levers live in the URL as one coalesced write. Each falls back to
  // its canonical anchor, and serializes to null at the anchor so an untouched
  // lever leaves no query key. Lever ranges fan out around the typical so a
  // reader can lean the scenario either way without running off a hard floor.
  const rentTypical = canonical.rent ?? 0;
  const staffTypical = canonical.staff ?? 0;
  const drawTypical = canonical.draw ?? 0;

  const { values, set, reset } = useUrlStateMap<{
    rent: number;
    staff: number;
    draw: number;
  }>({
    rent: {
      parse: (raw) => parseMoney(raw) ?? rentTypical,
      serialize: serializeMoney(rentTypical),
      fallback: rentTypical,
    },
    staff: {
      parse: (raw) => parseMoney(raw) ?? staffTypical,
      serialize: serializeMoney(staffTypical),
      fallback: staffTypical,
    },
    draw: {
      parse: (raw) => parseMoney(raw) ?? drawTypical,
      serialize: serializeMoney(drawTypical),
      fallback: drawTypical,
    },
  });

  // The what-if model, transparent and linear. Each extra dollar of rent or
  // payroll over typical comes straight off take-home; under typical, it adds
  // back. Margin is the adjusted take-home over the same revenue. The draw lever
  // is the owner's own pay target and rides alongside; it does not re-solve the
  // P&L, so it does not move the take-home line (which already IS the owner's
  // pay). It is offered so the reader can sanity-check their intended draw
  // against the typical owner figure they are bending.
  const rentDelta = hasRent ? values.rent - rentTypical : 0;
  const staffDelta = hasStaff ? values.staff - staffTypical : 0;
  const adjustedTakeHome = canonical.takeHome - rentDelta - staffDelta;
  const adjustedMargin =
    canonical.revenue > 0
      ? (adjustedTakeHome / canonical.revenue) * 100
      : canonical.marginPct;

  const isAdjusted =
    Math.round(adjustedTakeHome) !== Math.round(canonical.takeHome);

  // Push the reader's figure up for RangeStrip's `you` marker. Emits canonical on
  // mount + reset (so the marker sits on typical until they move), adjusted on
  // every change. Guarded against re-emitting the same value each render.
  const onYouChangeRef = React.useRef(onYouChange);
  onYouChangeRef.current = onYouChange;
  const lastEmitted = React.useRef<number | null>(null);
  React.useEffect(() => {
    const v = Math.round(adjustedTakeHome);
    if (lastEmitted.current !== v) {
      lastEmitted.current = v;
      onYouChangeRef.current?.(adjustedTakeHome);
    }
  }, [adjustedTakeHome]);

  const handleReset = React.useCallback(() => {
    reset();
  }, [reset]);

  // Lever ranges: from zero (or a touch below typical for draw) up to a bit above
  // double typical, snapped to a readable step. Kept generous so the scenario can
  // lean hard either way; clamped non-negative by the Slider's own min.
  const moneyMax = (typical: number) => Math.max(typical * 2, typical + 1);
  const moneyStep = (typical: number) => {
    const rough = Math.max(typical, 1) / 50;
    const pow = Math.pow(10, Math.floor(Math.log10(rough)));
    return Math.max(1, Math.round(rough / pow) * pow);
  };

  return (
    <section
      className={cn(
        // Canonical surface: was "rounded-2xl border border-parchment bg-cream-50".
        // The radius is unchanged: --radius is 16px, which is what rounded-2xl was.
        "atlas-card",
        className,
      )}
    >
      {/* The quiet opener (P5: disclosed not displayed). Collapsed until intent;
          a real button with aria-expanded + aria-controls wiring. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={regionId}
        className={cn(
          "flex min-h-[44px] w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-cream-100 motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
        )}
      >
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-semibold text-ink-900">
            Make it yours
          </span>
          <span className="text-xs font-medium text-cocoa-700">
            A quick what-if. Your scenario, the typical figure kept beside it.
          </span>
        </span>
        <svg
          viewBox="0 0 16 16"
          className={cn(
            "h-4 w-4 shrink-0 text-cocoa-700 transition-transform motion-reduce:transition-none",
            open ? "rotate-180" : "rotate-0",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      <div id={regionId} hidden={!open} className="px-4 pb-4">
        {/* The live result: adjusted take-home with the canonical anchored beside
            it, and the adjusted margin read underneath. ResetAnchor collapses to
            the single value when the reader has not moved off typical. */}
        <div className="rounded-xl bg-cream-100 px-4 py-3">
          <ResetAnchor
            canonical={canonical.takeHome}
            adjusted={adjustedTakeHome}
            format={format}
            onReset={handleReset}
            label="Your owner take-home in this scenario"
          />
          <div className="mt-2 flex items-baseline gap-2 text-sm">
            <span className="font-semibold tabular-nums text-ink-900">
              {adjustedMargin.toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-cocoa-700">
              margin
            </span>
            {isAdjusted ? (
              <span className="inline-flex items-baseline gap-1.5 text-xs tabular-nums text-cocoa-500">
                <span className="text-[11px] font-medium uppercase tracking-wide text-cocoa-500">
                  Typical
                </span>
                <span className="line-through decoration-cream-400">
                  {canonical.marginPct.toFixed(1)}%
                </span>
              </span>
            ) : null}
          </div>
        </div>

        {/* The levers. Only the ones with a typical anchor render. Each is the kit
            Slider (range + paired typed input), driving a live client recompute,
            no Apply. */}
        <div className="mt-4 flex flex-col gap-5">
          {hasRent ? (
            <Slider
              id={`${base}-rent`}
              label="Your rent"
              min={0}
              max={moneyMax(rentTypical)}
              step={moneyStep(rentTypical)}
              value={values.rent}
              onChange={(n) => set({ rent: n })}
              format={format}
              ticks={[rentTypical]}
            />
          ) : null}

          {hasStaff ? (
            <Slider
              id={`${base}-staff`}
              label="Your payroll"
              min={0}
              max={moneyMax(staffTypical)}
              step={moneyStep(staffTypical)}
              value={values.staff}
              onChange={(n) => set({ staff: n })}
              format={format}
              ticks={[staffTypical]}
            />
          ) : null}

          {hasDraw ? (
            <Slider
              id={`${base}-draw`}
              label="Your monthly draw"
              min={0}
              max={moneyMax(drawTypical)}
              step={moneyStep(drawTypical)}
              value={values.draw}
              onChange={(n) => set({ draw: n })}
              format={format}
              ticks={[drawTypical]}
              suffix="/mo"
            />
          ) : null}
        </div>

        {/* The assumptions, stated plainly so the number is never a black box.
            Quiet, finance-student register; this is the reader's own scenario. */}
        <p className="mt-4 text-xs leading-relaxed text-cocoa-700">
          A rough what-if, not a forecast. Every dollar your rent or payroll runs
          above typical comes straight off take-home, and below typical adds back,
          over the same revenue. Your own figures, the typical Atlas number kept
          beside them.
        </p>
      </div>
    </section>
  );
}
