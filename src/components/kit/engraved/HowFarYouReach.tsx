/**
 * kit/engraved/HowFarYouReach.tsx — the addressable-market engraved section.
 *
 * The reach asset (accepted intake #14, market): how far a business can reach
 * from this country. It leads with the population figure set large in the
 * display serif with tabular numerals (the one real datum), then reads two or
 * three reach indicators as small engraved gauges on the quiet clay -> amber ->
 * cocoa -> moss meaning scale: urban density, e-commerce and delivery reach.
 *
 * Composed from the engraved foundation (meaningStep, CompassRosette, Glyph,
 * SampleState, Eyebrow) and the engraved CSS-variable layer in globals.css,
 * matching kit/engraved/Compare.tsx and Scorecard.tsx. No new globals classes
 * are added: layout uses Tailwind token utilities (ink / cocoa / moss / amber /
 * cream) and structure, the meaning tints and tabular figures come through inline
 * var(--...) references, and the gauge geometry is inline SVG.
 *
 * Honest by default: population renders only when held; when it is not held the
 * whole section falls to the SampleState. The reach gauges behave differently:
 * no country holds a delivery, online-reach or urban-density indicator, so an
 * empty reach array drops the gauge strip entirely rather than printing a tagged
 * empty box under a real figure. The strip returns when a real indicator lands.
 *
 * Server-renderable, no client JS. No raw hex / px / ms in the .tsx (SVG viewBox
 * and path geometry numbers are geometry, not style tokens). No em-dashes, no
 * source-agency names. AA contrast, legible at 375px with no horizontal scroll.
 */
import * as React from "react";
import { CompassRosette, Glyph, SampleState, Eyebrow, meaningStep, type GlyphName } from "./primitives";

/* ------------------------------------------------------------------ */
/* Props.                                                              */
/* ------------------------------------------------------------------ */

/** The population figure — the one real datum that anchors the section. */
export type ReachPopulation = {
  /** Pre-formatted display string, e.g. "67.0M" or "1,417,000,000". */
  value: string;
  /** Optional label under the figure, e.g. "people, the home market". */
  label?: string | null;
};

/** One reach indicator, drawn as a small engraved gauge with a meaning read. */
export type ReachIndicator = {
  /** The indicator label, e.g. "Urban density". */
  label: string;
  /** Strength on a 0..1 scale; drives the gauge sweep and the meaning tint. */
  score: number;
  /** Optional one-line meaning read, e.g. "Most people within easy delivery range." */
  note?: string | null;
  /** Optional engraved glyph; sensible defaults are picked from the label. */
  glyph?: GlyphName;
};

export type HowFarYouReachProps = {
  /** The population figure (real, from the country profile). Missing -> sample. */
  population?: ReachPopulation | null;
  /** Two or three reach indicators. Missing / empty -> a sample gauge strip. */
  reach?: ReachIndicator[] | null;
  /** An optional caveat under the section. */
  caveat?: string | null;
  /** Force the honest sample state for the whole section. */
  sample?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* The plain-language read words on the meaning scale (0..1 -> step).  */
/* ------------------------------------------------------------------ */

const READS = ["Narrow", "Limited", "Moderate", "Wide", "Very wide"] as const;

/** Resolve a 0..1 score to its read word (nearest fifth, clamped). */
function readWord(s: number): string {
  return READS[Math.max(0, Math.min(4, Math.round(s * 4)))];
}

/** Pick a default glyph from the indicator label when none is supplied. */
function glyphFor(label: string, fallback: GlyphName): GlyphName {
  const l = label.toLowerCase();
  if (l.includes("urban") || l.includes("densit") || l.includes("city") || l.includes("cities")) return "pin";
  if (l.includes("deliver") || l.includes("logist") || l.includes("ship")) return "basket";
  if (l.includes("commerce") || l.includes("online") || l.includes("digital") || l.includes("web")) return "wallet";
  if (l.includes("people") || l.includes("reach") || l.includes("audience")) return "people";
  return fallback;
}

/* ------------------------------------------------------------------ */
/* ReachGauge — a small engraved 200deg dial, one tone per drawing.    */
/* ------------------------------------------------------------------ */

type ReachGaugeProps = {
  /** Strength, 0..1; the share of the arc the needle sweeps. */
  score: number;
  /** Arc + needle color (a var(--...) reference). */
  tone: string;
  /** Square size in px. @default 96 */
  size?: number;
};

function ReachGauge({ score, tone, size = 96 }: ReachGaugeProps) {
  // 200deg open dial, drawn left-to-right across the top. Geometry only.
  const cx = 50;
  const cy = 54;
  const r = 36;
  const start = 160; // degrees, the left foot of the arc
  const sweep = 200; // total opening
  const clamped = Math.max(0, Math.min(1, score));
  const pt = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  };
  const [sx, sy] = pt(start);
  const [ex, ey] = pt(start + sweep);
  const [nx, ny] = pt(start + sweep * clamped);
  // Tick marks at each fifth of the arc, the engraved survey detail.
  const ticks = Array.from({ length: 5 }).map((_, i) => {
    const deg = start + (sweep / 4) * i;
    const a = (deg * Math.PI) / 180;
    const r1 = r + 2;
    const r2 = r + (i % 4 === 0 ? 8 : 5.5);
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * r1}
        y1={cy + Math.sin(a) * r1}
        x2={cx + Math.cos(a) * r2}
        y2={cy + Math.sin(a) * r2}
        stroke="var(--hairline-strong)"
        strokeWidth={i % 4 === 0 ? 1.1 : 0.6}
      />
    );
  });
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 100 78" aria-hidden="true" style={{ display: "block" }}>
      {ticks}
      {/* the track: the full open arc, faint */}
      <path
        d={`M${sx} ${sy} A${r} ${r} 0 1 1 ${ex} ${ey}`}
        fill="none"
        stroke="var(--hairline-strong)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* the read: the swept portion, in the meaning tone */}
      <path
        d={`M${sx} ${sy} A${r} ${r} 0 ${sweep * clamped > 180 ? 1 : 0} 1 ${nx} ${ny}`}
        fill="none"
        stroke={tone}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* the needle from the hub to the read point */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={tone} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3.2" fill="var(--surface-card)" stroke={tone} strokeWidth="1.3" />
      <circle cx={cx} cy={cy} r="0.9" fill={tone} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* HowFarYouReach.                                                     */
/* ------------------------------------------------------------------ */

export function HowFarYouReach({ population, reach, caveat, sample, className }: HowFarYouReachProps) {
  // The population figure is the spine of the section. Without it (or in the
  // forced sample path) the whole asset falls to the honest sample state.
  if (sample || !population || !population.value) {
    return (
      <SampleState
        glyph="people"
        what="Addressable market not held yet"
        reason="The reach read opens once this country's population is confirmed."
        minH={140}
      />
    );
  }

  const hasReach = Array.isArray(reach) && reach.length > 0;
  // Keep the strip to the asset's canonical two-or-three gauges.
  const indicators = hasReach ? reach!.slice(0, 3) : [];

  return (
    <div className={["bg-cream-50", className].filter(Boolean).join(" ")}>
      {/* ---- The population spine: the one real figure, set large ---- */}
      {/* The bottom rule is dropped only when a gauge strip follows and supplies
          its own top border; with no strip the block closes itself. */}
      <div
        className={[
          "relative overflow-hidden border border-[color:var(--hairline-strong)] px-5 py-6 sm:px-7",
          hasReach ? "border-b-0" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* engraved compass motif, the cartographic furniture, never the data */}
        <div className="pointer-events-none absolute right-3 top-3 opacity-60 sm:right-5">
          <CompassRosette size={56} tone="var(--cocoa-300)" ring="var(--hairline-strong)" />
        </div>
        <Eyebrow style={{ color: "var(--text-muted)" }}>How far you can reach</Eyebrow>
        <div className="mt-3 flex items-end gap-3">
          <span
            className="leading-none text-ink-900"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(2.6rem, 11vw, 4rem)",
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {population.value}
          </span>
          <span className="mb-1.5 inline-flex items-center text-cocoa-500" style={{ color: "var(--cocoa-500)" }}>
            <Glyph name="people" size={22} stroke={1.4} color="var(--cocoa-500)" />
          </span>
        </div>
        {population.label ? (
          <p
            className="mt-1.5 max-w-prose"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13.5px",
              lineHeight: 1.5,
              color: "var(--text-muted)",
            }}
          >
            {population.label}
          </p>
        ) : null}
      </div>

      {/* ---- The reach gauges: meaning, not raw numbers ---- */}
      {hasReach ? (
        <div
          className="grid border border-[color:var(--hairline-strong)]"
          style={{ gridTemplateColumns: `repeat(${indicators.length}, minmax(0, 1fr))` }}
        >
          {indicators.map((ind, i) => {
            const score = Math.max(0, Math.min(1, ind.score));
            const t = meaningStep(score);
            const glyph = ind.glyph ?? glyphFor(ind.label, "leaf");
            return (
              <div
                key={ind.label + i}
                className={[
                  "flex flex-col items-center px-3 py-5 text-center",
                  // engraved hairline gutters between gauges, never a trailing rule
                  i > 0 ? "border-l border-[color:var(--hairline-strong)]" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="inline-flex items-center gap-1.5" style={{ color: "var(--cocoa-500)" }}>
                  <Glyph name={glyph} size={14} stroke={1.4} color="var(--cocoa-500)" />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                      color: "var(--text-body)",
                    }}
                  >
                    {ind.label}
                  </span>
                </span>

                <div className="mt-1">
                  <ReachGauge score={score} tone={t.dot} size={92} />
                </div>

                <span
                  className="-mt-1 inline-flex items-center gap-1.5"
                  style={{ color: t.fg, fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600 }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "6.5px",
                      height: "6.5px",
                      borderRadius: "9999px",
                      background: t.dot,
                      display: "inline-block",
                    }}
                  />
                  {readWord(score)}
                </span>

                {ind.note ? (
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11.5px",
                      lineHeight: 1.45,
                      color: "var(--text-faint)",
                    }}
                  >
                    {ind.note}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
      {/* No reach indicators are held for ANY country (delivery, online reach
          and urban density are all unheld), so the strip self-omits rather than
          printing an empty gauge box under a real figure. It returns the moment
          a real indicator is passed. */}

      {caveat ? (
        <p
          className="px-5 pt-3 sm:px-7"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11.5px",
            lineHeight: 1.5,
            color: "var(--text-faint)",
          }}
        >
          {caveat}
        </p>
      ) : null}
    </div>
  );
}

export default HowFarYouReach;
