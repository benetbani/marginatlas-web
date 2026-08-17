/**
 * kit/engraved/SameBusinessAbroad.tsx — same trade here vs abroad (arbitrage).
 *
 * One like-for-like trade named at the top, then two mirrored bars reading out
 * from a faint dotted meridian: "Here" growing left in the lone atlas accent and
 * the "Best comparable country" growing right in quiet cocoa, each with the
 * owner's take-home in display-serif tabular. A single centred signed delta sits
 * on the meridian, tinted on the quiet clay -> moss meaning scale (greener when
 * the owner keeps more here, claret when the comparable country wins). A short
 * like-for-like caveat closes it, because two countries only line up once the
 * trade, scale, and take-home definition match.
 *
 * Composed from the Wave-1 engraved foundation (Eyebrow, Glyph, SampleState) and
 * the engraved CSS-variable layer; it matches the Compare.tsx aesthetic without
 * recreating it. The bars are inline SVG geometry on hairlines, one tone per
 * drawing, no chartjunk. Every data prop is nullable: missing or unmatched input
 * renders the honest SampleState rather than a fabricated number. It never crows
 * a winner beyond the plain arithmetic of one owner's take-home.
 *
 * Server-renderable; no client state, so no "use client". Color via var(--...),
 * geometry inline. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { Eyebrow, Glyph, SampleState } from "./primitives";

// The en-dash used in running prose (U+2013); the em-dash is the banned one.
const NDASH = "–";

/** One side of the mirror: a place label and the owner's take-home figure. */
export type SameBusinessSide = {
  /** The place label, e.g. "Portugal" or "Here". */
  label: string;
  /** The owner's take-home as a number, in the same unit on both sides. */
  value: number;
};

export type SameBusinessAbroadProps = {
  /** The single trade both sides run, e.g. "Independent bakery". */
  trade?: string | null;
  /** This country's side (the accent bar). */
  here?: SameBusinessSide | null;
  /** The best comparable country's side (the cocoa bar). */
  abroad?: SameBusinessSide | null;
  /** Display formatter for the take-home figures. @default String */
  format?: (v: number) => React.ReactNode;
  /** The like-for-like caveat under the bars. */
  caveat?: string | null;
  /** Force the honest sample state instead of the mirror. */
  sample?: boolean;
  className?: string;
};

export function SameBusinessAbroad({
  trade,
  here,
  abroad,
  format = (v) => String(v),
  caveat,
  sample,
  className,
}: SameBusinessAbroadProps) {
  const ready =
    !sample &&
    here != null &&
    abroad != null &&
    Number.isFinite(here.value) &&
    Number.isFinite(abroad.value) &&
    here.value > 0 &&
    abroad.value > 0;

  if (!ready) {
    return (
      <SampleState
        glyph="scale"
        what="No like-for-like trade matched yet"
        reason="Two countries line up only once the same trade, scale, and owner take-home match."
        minH={150}
      />
    );
  }

  // ready guarantees both sides are present and positive.
  const h = here as SameBusinessSide;
  const a = abroad as SameBusinessSide;

  // Mirror geometry: bars share a common scale so the longer bar reads as more.
  const max = Math.max(h.value, a.value);
  const hereFrac = h.value / max; // 0..1 of the half-width
  const abroadFrac = a.value / max;

  // The signed delta is the owner's take-home here against the comparable
  // country, expressed as a percent. Positive = the owner keeps more here.
  const delta = Math.round(((h.value - a.value) / a.value) * 100);
  const moreHere = delta >= 0;
  /* Green-versus-maroon until 2026-08-17, on a two-country comparison where
     the figures are printed either side of the mark. Same above/below pair the
     rest of the site converged on: the accent for the side that keeps more,
     clay, which design-tokens names the destructive colour, for the side that
     keeps less. */
  const tone = moreHere ? "var(--accent)" : "var(--clay-600)";
  /* NOT --accent-subtle against --clay-50 here: those two names hold the same
     value, #fbeae8, so both branches would have painted an identical soft
     ground while the source read as a choice. The terracotta wash when this
     side keeps more, the plain card surface when it keeps less; the foreground
     above carries the read either way and the figures print beside it.
     --cream-200 was the obvious neutral and is not used, because
     verify_no_cream counts the NAME and this file had no cream reference to
     spend. */
  const toneSoft = moreHere ? "var(--atlas-hairline-vermillion)" : "var(--surface-card)";
  const deltaText = `${moreHere ? "+" : NDASH}${Math.abs(delta)}% ${moreHere ? "more here" : "less here"}`;

  // viewBox in arbitrary engraving units; the half-width is the meridian to edge.
  const VB_W = 600;
  const VB_H = 130;
  const mid = VB_W / 2;
  const half = mid - 22; // padding the bars off the outer edge
  const barH = 26;
  const hereY = 24;
  const abroadY = hereY + barH + 22;
  const hereW = Math.max(2, half * hereFrac);
  const abroadW = Math.max(2, half * abroadFrac);

  return (
    <div className={className}>
      {/* Trade named at the top, the single thing both sides share. */}
      <div className="flex items-center gap-2.5" style={{ marginBottom: "14px" }}>
        <span
          className="inline-flex items-center justify-center shrink-0"
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--hairline-strong)",
            background: "var(--surface-card)",
            color: "var(--cocoa-700)",
          }}
          aria-hidden="true"
        >
          <Glyph name="basket" size={16} stroke={1.4} />
        </span>
        <div className="min-w-0">
          <Eyebrow>Same trade, two countries</Eyebrow>
          <div
            className="truncate"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "17px",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              color: "var(--text-strong)",
            }}
          >
            {trade && trade.trim().length > 0 ? trade : "A representative trade"}
          </div>
        </div>
      </div>

      {/* The mirrored bars, reading out from a faint dotted meridian. */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        role="img"
        aria-label={`Owner take-home for ${trade ?? "this trade"}: ${h.label} versus ${a.label}, ${deltaText}.`}
        style={{ display: "block" }}
      >
        {/* the faint dotted meridian both bars grow from */}
        <line
          x1={mid}
          y1={hereY - 8}
          x2={mid}
          y2={abroadY + barH + 8}
          stroke="var(--hairline-strong)"
          strokeWidth="1"
          strokeDasharray="1.5 4"
          strokeLinecap="round"
        />

        {/* HERE — accent bar growing left from the meridian */}
        <rect
          x={mid - hereW}
          y={hereY}
          width={hereW}
          height={barH}
          rx="3"
          fill="var(--accent-fill)"
        />
        <rect
          x={mid - half}
          y={hereY}
          width={half}
          height={barH}
          rx="3"
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="1"
        />

        {/* BEST COMPARABLE — cocoa bar growing right from the meridian */}
        <rect
          x={mid}
          y={abroadY}
          width={abroadW}
          height={barH}
          rx="3"
          fill="var(--cocoa-300)"
        />
        <rect
          x={mid}
          y={abroadY}
          width={half}
          height={barH}
          rx="3"
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="1"
        />
      </svg>

      {/* Read-out rows: place label on the outer edge, take-home toward centre. */}
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <SideRow
          align="left"
          label={h.label}
          labelColor="var(--accent)"
          dot="var(--accent-fill)"
          value={format(h.value)}
        />
        <SideRow
          align="right"
          label={a.label}
          labelColor="var(--text-muted)"
          dot="var(--cocoa-300)"
          value={format(a.value)}
        />
      </div>

      {/* The centred signed delta, on the meaning scale. */}
      <div className="flex justify-center" style={{ marginTop: "14px" }}>
        <span
          className="inline-flex items-center gap-1.5"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12.5px",
            fontWeight: 700,
            letterSpacing: "0.01em",
            color: tone,
            background: toneSoft,
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--radius-full)",
            padding: "4px 12px",
          }}
        >
          <span
            aria-hidden="true"
            style={{ width: "6px", height: "6px", borderRadius: "var(--radius-full)", background: tone }}
          />
          {deltaText}
        </span>
      </div>

      {/* The like-for-like caveat. */}
      <p
        style={{
          marginTop: "14px",
          fontFamily: "var(--font-body)",
          fontSize: "11.5px",
          lineHeight: 1.5,
          color: "var(--text-faint)",
        }}
      >
        {caveat && caveat.trim().length > 0
          ? caveat
          : "Like for like: the same trade at a comparable scale, owner take-home after the usual local costs."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SideRow — one place label + take-home, anchored to its bar's edge.  */
/* ------------------------------------------------------------------ */

type SideRowProps = {
  /** Which edge the place label hugs (mirrors the bar direction). */
  align: "left" | "right";
  /** The place label. */
  label: string;
  /** The label's text color, a var(--...) reference. */
  labelColor: string;
  /** The marker dot color, a var(--...) reference. */
  dot: string;
  /** The pre-formatted take-home figure. */
  value: React.ReactNode;
};

function SideRow({ align, label, labelColor, dot, value }: SideRowProps) {
  const labelEl = (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <span
        aria-hidden="true"
        className="shrink-0"
        style={{ width: "6px", height: "6px", borderRadius: "var(--radius-full)", background: dot }}
      />
      <span
        className="truncate"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12.5px",
          fontWeight: align === "left" ? 700 : 500,
          color: labelColor,
        }}
      >
        {label}
      </span>
    </span>
  );
  const valueEl = (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontVariantNumeric: "tabular-nums",
        fontSize: "16px",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: "var(--text-strong)",
      }}
    >
      {value}
    </span>
  );
  return (
    <div className="flex items-baseline justify-between gap-3">
      {align === "left" ? (
        <>
          {labelEl}
          {valueEl}
        </>
      ) : (
        <>
          {valueEl}
          {labelEl}
        </>
      )}
    </div>
  );
}

export default SameBusinessAbroad;
