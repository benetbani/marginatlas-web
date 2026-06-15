/**
 * kit/engraved/YourLifeHere.tsx — "what your life looks like here".
 *
 * The human lens (accepted intake #20): the owner's lived reality rather than
 * the figures. A small engraved "day in the life" read — three or four
 * qualitative dimensions (typical hours, pace, how relationship-driven the
 * business is, the red-tape drag) shown as short engraved bars with a one-line
 * note each, closed by one warm display-serif line. It is a felt-sense read,
 * not a measured index, so it leans illustrative and is tagged as such; it
 * never invents a real-looking specific.
 *
 * Composes from the Wave-1 engraved foundation (meaningStep, Glyph, Eyebrow,
 * SampleState) and reads colour only through the engraved CSS vars, matching the
 * spectrum-track + Fraunces conventions established in Compare.tsx / Editorial.tsx.
 * All styling lives in this one file as inline style referencing var(--...),
 * Tailwind token utilities, and inline SVG geometry; no shared CSS is touched.
 * Props are nullable; missing or empty input renders the honest SampleState.
 * Server-renderable; no client JS. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { meaningStep, Glyph, Eyebrow, SampleState, type GlyphName } from "./primitives";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** One qualitative dimension of the lived reality, e.g. typical hours. */
export type LifeDimension = {
  /** The dimension label, e.g. "Typical hours". */
  label: string;
  /**
   * Where this sits on the quiet clay -> moss meaning scale, 0..1.
   * Higher reads easier / lighter / warmer; lower reads heavier / harder.
   * For a "drag" dimension, pass the relief (1 = light touch, 0 = heavy).
   */
  score: number;
  /** Optional short felt-sense note, e.g. "Long, but your own". */
  note?: string | null;
  /** Optional glyph; a sensible default is chosen from the label otherwise. */
  glyph?: GlyphName;
};

export type YourLifeHereProps = {
  /** The three or four dimensions. Null or empty renders the SampleState. */
  dimensions?: LifeDimension[] | null;
  /** One warm closing line in the display serif. Optional. */
  line?: string | null;
  /** Force the honest illustrative sample state. */
  sample?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Glyph inference — keep callers light without inventing specifics.   */
/* ------------------------------------------------------------------ */

/** Pick an engraved glyph from the dimension label when none is supplied. */
function inferGlyph(label: string): GlyphName {
  const l = label.toLowerCase();
  if (l.includes("hour") || l.includes("time") || l.includes("pace")) return "clock";
  if (l.includes("relation") || l.includes("people") || l.includes("network")) return "people";
  if (l.includes("tape") || l.includes("admin") || l.includes("paper") || l.includes("rule")) return "stamp";
  if (l.includes("stress") || l.includes("pressure") || l.includes("calm")) return "leaf";
  return "scale";
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function YourLifeHere({ dimensions, line, sample, className }: YourLifeHereProps) {
  if (sample || !dimensions || dimensions.length === 0) {
    return (
      <SampleState
        glyph="leaf"
        what="The lived reality is not written yet"
        reason="A felt-sense read of the hours, pace, and red-tape drag. Illustrative until operators tell us how it feels on the ground."
        minH={140}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <Eyebrow>A day in the life</Eyebrow>
        {/* The honest tag: this is a felt read, not a measured index. */}
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-faint)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "9999px",
            padding: "2px 9px",
            whiteSpace: "nowrap",
          }}
        >
          illustrative
        </span>
      </div>

      {/* The dimensions: glyph + label + short engraved bar + note. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {dimensions.map((d, i) => {
          const score = Math.max(0, Math.min(1, d.score));
          const t = meaningStep(score);
          const pct = Math.max(6, Math.min(100, Math.round(score * 100)));
          const glyph = d.glyph ?? inferGlyph(d.label);
          return (
            <div
              key={d.label + i}
              style={{
                display: "grid",
                gridTemplateColumns: "34px 1fr",
                gap: "13px",
                alignItems: "start",
                padding: "13px 0",
                borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
              }}
            >
              {/* The engraved circular glyph mark. */}
              <span
                aria-hidden="true"
                style={{
                  flex: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "9999px",
                  border: "1px solid var(--hairline-strong)",
                  background: "var(--cream-100)",
                  color: t.fg,
                  marginTop: "1px",
                }}
              >
                <Glyph name={glyph} size={17} stroke={1.5} color={t.fg} />
              </span>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "7px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "var(--text-body)",
                    }}
                  >
                    {d.label}
                  </span>
                  {d.note ? (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: t.fg,
                        textAlign: "right",
                        textWrap: "balance",
                      }}
                    >
                      {d.note}
                    </span>
                  ) : null}
                </div>

                {/* The short engraved bar: a hairline base over a tinted fill,
                    capped by a small surveyor node, on the meaning scale. */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "relative",
                    display: "block",
                    height: "5px",
                    borderRadius: "9999px",
                    background: t.bg,
                    border: "1px solid var(--hairline-strong)",
                    overflow: "visible",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${pct}%`,
                      borderRadius: "9999px",
                      background: t.dot,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${pct}%`,
                      width: "10px",
                      height: "10px",
                      borderRadius: "9999px",
                      background: t.dot,
                      border: "2px solid var(--surface-card)",
                      transform: "translate(-50%, -50%)",
                      boxShadow: "var(--elev-1)",
                    }}
                  />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* The one warm closing line, in the display serif. */}
      {line ? (
        <p
          style={{
            margin: 0,
            paddingLeft: "16px",
            borderLeft: "2px solid var(--accent-fill)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(16px, 2.2vw, 19px)",
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            textWrap: "pretty",
            color: "var(--text-strong)",
          }}
        >
          {line}
        </p>
      ) : null}
    </div>
  );
}

export default YourLifeHere;
