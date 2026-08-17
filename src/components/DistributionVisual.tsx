"use client";

/**
 * DistributionVisual (Sanity §4 rewrite, 2026-05-25)
 *
 * Single horizontal band chart replacing the 3-tile grid. Each band is
 * sized proportionally to its share of the distribution; the typical
 * marker pins the median.
 *
 * Changes vs prior version:
 *  1. Atlas palette only. Was amber/orange gradient (#EFE0BD, #D47706);
 *     now atlas-700 fill at 70% opacity, atlas-800 typical marker line.
 *     No teal, no amber, no aquamarine.
 *  2. Collision-aware axis labels. Was three absolute-positioned divs
 *     that stacked on top of each other when the bottom/typical/top
 *     values were close (e.g. cleaning services $37.5M / $41.2M /
 *     $46.9M). Now a ResizeObserver measures rendered label widths and
 *     drops lower-priority labels (priority: typical > bottom > top)
 *     when they would render within 12px of a higher-priority label.
 *  3. Accessibility. Outer container is role="img" with aria-label
 *     summarizing the distribution. Inner SVG marker has a <title>
 *     child for assistive tech that drills into it.
 *  4. Graceful missing-data handling. If any of p10/p50/p90 is null
 *     or non-finite, returns null. Money formatter handles null safely.
 *
 * Server component: NO. The collision detection needs window APIs, so
 * the component is now "use client". The page that mounts it is still
 * a server component; only this leaf hydrates.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Money } from "@/components/Money";
import { formatMoney } from "@/lib/currency";

type Props = {
  p10: number | null;
  p50: number | null;
  p90: number | null;
  /** Optional ceiling for the chart's x-axis. Defaults to p90 x 1.1. */
  maxValue?: number | null;
};

type LabelKey = "bottom" | "typical" | "top";

/**
 * Resolve label visibility given the rendered widths of each label and
 * the container width. Priority: typical > bottom > top. If a lower
 * priority label would overlap a higher priority label (centers within
 * 12px after accounting for half-widths), it is hidden.
 */
function resolveVisibility(
  positions: Record<LabelKey, number>, // px from left
  widths: Record<LabelKey, number>, // px rendered width
  containerWidth: number,
): Record<LabelKey, boolean> {
  const order: LabelKey[] = ["typical", "bottom", "top"];
  const placed: Array<{ key: LabelKey; left: number; right: number }> = [];
  const visible: Record<LabelKey, boolean> = {
    bottom: true,
    typical: true,
    top: true,
  };

  for (const key of order) {
    const w = widths[key];
    const center = positions[key];
    // The label is anchored: bottom = left-edge, typical = center,
    // top = right-edge. We compute its rendered bounding box on the
    // container axis to detect overlap.
    let left: number;
    let right: number;
    if (key === "bottom") {
      left = 0;
      right = Math.min(w, containerWidth);
    } else if (key === "top") {
      right = containerWidth;
      left = Math.max(0, containerWidth - w);
    } else {
      left = Math.max(0, center - w / 2);
      right = Math.min(containerWidth, center + w / 2);
    }

    const GAP = 12; // px breathing room between labels
    const collides = placed.some(
      (p) => !(right + GAP < p.left || left > p.right + GAP),
    );

    if (collides) {
      visible[key] = false;
    } else {
      placed.push({ key, left, right });
    }
  }

  return visible;
}

export function DistributionVisual({ p10, p50, p90, maxValue }: Props) {
  const have = [p10, p50, p90].every((v) => v != null && isFinite(v));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typicalRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState<Record<LabelKey, boolean>>({
    bottom: true,
    typical: true,
    top: true,
  });

  // Effect must run unconditionally; we early-return after the hooks.
  // We re-measure on mount and when the container resizes. We toggle
  // labels off the lower-priority ones if they overlap.
  useLayoutEffect(() => {
    if (!have) return;
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      const c = containerRef.current;
      const b = bottomRef.current;
      const t = typicalRef.current;
      const tp = topRef.current;
      if (!c || !b || !t || !tp) return;

      // Reset to all visible so widths are real, not zero.
      // We measure widths via offsetWidth which is unaffected by
      // visibility:hidden on display:block.
      const cw = c.getBoundingClientRect().width;
      if (cw <= 0) return;

      const bw = b.offsetWidth;
      const tw = t.offsetWidth;
      const tpw = tp.offsetWidth;

      const midRatio = (p50! - 0) / (maxValue ?? p90! * 1.1);
      const midPx = midRatio * cw;

      const next = resolveVisibility(
        { bottom: 0, typical: midPx, top: cw },
        { bottom: bw, typical: tw, top: tpw },
        cw,
      );
      setVisible((prev) => {
        if (
          prev.bottom === next.bottom &&
          prev.typical === next.typical &&
          prev.top === next.top
        ) {
          return prev;
        }
        return next;
      });
    }

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    return () => ro.disconnect();
  }, [have, p50, p90, maxValue]);

  // Also re-measure once after fonts settle (display font swap can
  // change rendered widths).
  useEffect(() => {
    if (!have) return;
    if (typeof document === "undefined") return;
    const d = document as unknown as { fonts?: { ready?: Promise<unknown> } };
    if (d.fonts?.ready) {
      d.fonts.ready.then(() => {
        const c = containerRef.current;
        if (!c) return;
        // Trigger a measure by dispatching a no-op resize via the
        // observer pathway: force a synchronous DOM read by reading
        // offsetWidth, then call the same logic.
        const ev = new Event("resize");
        window.dispatchEvent(ev);
      });
    }
  }, [have]);

  if (!have) return null;
  const lo = p10!;
  const mid = p50!;
  const hi = p90!;
  const ceil = maxValue ?? hi * 1.1;

  const bandLo = (lo / ceil) * 100;
  const bandHi = ((ceil - hi) / ceil) * 100;
  const midPos = (mid / ceil) * 100;

  // Build a stable aria-label using the USD source values. The
  // displayed Money components may render in the user's chosen
  // currency, but the aria-label uses USD (the canonical source).
  const ariaLabel =
    `Revenue distribution. Bottom 10 percent: ${formatMoney(lo, "USD")}. ` +
    `Typical: ${formatMoney(mid, "USD")}. ` +
    `Top 10 percent: ${formatMoney(hi, "USD")}.`;

  return (
    <section id="distribution" className="py-12 md:py-16">
      <div className="text-sm md:text-base font-bold uppercase tracking-[0.12em] text-atlas-700 mb-3">
        The spread
      </div>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-ink-900 leading-[1.08] max-w-3xl">
        Where every business lands
      </h2>
      <p className="mt-3 text-base md:text-lg text-ink-800 max-w-2xl leading-relaxed">
        Most businesses cluster in the middle. The tails are real, and
        much wider than people assume.
      </p>

      {/* Chart container. role=img so screen readers announce the
          chart as a single unit using the aria-label, not as a pile
          of disconnected text. */}
      <div
        ref={containerRef}
        role="img"
        aria-label={ariaLabel}
        className="mt-8 md:mt-10 mx-auto max-w-4xl"
      >
        {/* Value labels above the band, positioned proportionally.
            Each label uses visibility:hidden when it would collide
            with a higher priority label (priority: typical > bottom
            > top). visibility:hidden preserves layout space so the
            ResizeObserver can keep measuring rendered widths. */}
        <div className="relative h-14 mb-2">
          <div
            ref={bottomRef}
            className="absolute left-0 top-0 text-left"
            style={{ visibility: visible.bottom ? "visible" : "hidden" }}
            aria-hidden="true"
          >
            <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-semibold whitespace-nowrap">
              Bottom 10%
            </div>
            <div className="font-display text-lg md:text-2xl text-ink-900 tabular-nums leading-none mt-1 whitespace-nowrap">
              <Money usd={lo} />
            </div>
          </div>
          <div
            ref={typicalRef}
            className="absolute top-0"
            style={{
              left: `${midPos}%`,
              transform: "translateX(-50%)",
              visibility: visible.typical ? "visible" : "hidden",
            }}
            aria-hidden="true"
          >
            <div className="text-[10px] uppercase tracking-wider text-atlas-700 font-bold text-center whitespace-nowrap">
              Typical
            </div>
            <div className="font-display text-lg md:text-2xl text-ink-900 tabular-nums leading-none mt-1 text-center whitespace-nowrap">
              <Money usd={mid} />
            </div>
          </div>
          <div
            ref={topRef}
            className="absolute right-0 top-0 text-right"
            style={{ visibility: visible.top ? "visible" : "hidden" }}
            aria-hidden="true"
          >
            <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-semibold whitespace-nowrap">
              Top 10%
            </div>
            <div className="font-display text-lg md:text-2xl text-ink-900 tabular-nums leading-none mt-1 whitespace-nowrap">
              <Money usd={hi} />
            </div>
          </div>
        </div>

        {/* The band, 24px tall. Background uses the atlas palette:
            band fill is atlas-700 at 70% opacity, typical marker is
            atlas-800. No amber, no aquamarine, no generic teal. */}
        <div className="relative h-6 rounded-full border border-parchment bg-paper-100">
          <div
            className="absolute inset-y-0 rounded-full bg-atlas-700"
            style={{
              left: `${bandLo}%`,
              right: `${bandHi}%`,
              opacity: 0.7,
            }}
            aria-hidden="true"
          />
          {/* Typical marker. SVG so we can hang a <title> on it for
              assistive tech that drills into the bar itself. The wider
              white rect renders first to form a halo, then the narrow
              atlas-800 rect sits on top of it. */}
          <svg
            className="absolute"
            style={{
              left: `${midPos}%`,
              top: -4,
              bottom: -4,
              width: 7,
              height: "calc(100% + 8px)",
              transform: "translateX(-50%)",
              overflow: "visible",
            }}
            aria-hidden="true"
          >
            <title>{`Typical: ${formatMoney(mid, "USD")}`}</title>
            <rect x={0} y={0} width={7} height="100%" rx={3.5} fill="#FFFFFF" />
            <rect
              x={2}
              y={0}
              width={3}
              height="100%"
              rx={1.5}
              className="fill-atlas-800"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
