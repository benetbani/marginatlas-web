/**
 * kit/engraved/Scorecard.tsx — the engraved 8-metric scorecard.
 *
 * A precise 4x2 grid (reflowing to 2x4 at the 375px column). Each cell carries a
 * tiny engraved glyph, the figure in display-serif tabular, and a one-word read
 * on the quiet clay -> amber -> cocoa -> moss meaning scale. Ported from the
 * design export 2026-06-14-country-engraved (engraved/hero-scorecard.jsx:
 * Scorecard).
 *
 * Honest by default: a held cell shows the value, its unit, and the meaning
 * read; a not-held cell shows a dash and a muted "not held" label, never a
 * fabricated number. A `sample` path renders the SampleState until the basics
 * are confirmed.
 *
 * This is DATA inside the engraved frame: the figures stay clean and tabular,
 * the engraving is the cell hairlines, no chartjunk. Server-renderable, no
 * client JS. Color via the engraved CSS vars (the read tint comes from the
 * meaning step), no raw hex. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { meaningStep, Glyph, SampleState, type GlyphName } from "./primitives";

/** A single scorecard metric. */
export type ScorecardMetric = {
  /** The metric label, e.g. "GDP per capita". */
  label: string;
  /** The figure as a display string, or null when not held. */
  value: string | null;
  /** Optional unit suffix, e.g. "/yr" or "/100". */
  unit?: string | null;
  /** The engraved glyph for this metric. */
  glyph: GlyphName;
  /** Optional one-word read, e.g. "Strong" (shown only when held + scored). */
  read?: string | null;
  /** Optional 0..1 score driving the meaning tint of the read. */
  score?: number | null;
};

export type ScorecardProps = {
  /** The metrics to show (the asset's canonical form is eight). */
  metrics?: ScorecardMetric[] | null;
  /** Render the honest sample state instead of the grid. */
  sample?: boolean;
  className?: string;
};

// The en-dash shown in a not-held cell (U+2013); the em-dash is the banned one.
const DASH = "–";
// A non-breaking space holds the read row's height in a held-but-unscored cell.
const NBSP = " ";

export function Scorecard({ metrics, sample, className }: ScorecardProps) {
  if (sample || !metrics || metrics.length === 0) {
    return (
      <SampleState
        glyph="coin"
        what="Country metrics not held yet"
        reason="The eight-cell card shows once the economic basics are confirmed."
        minH={120}
      />
    );
  }
  return (
    <div className={["eng-score", className].filter(Boolean).join(" ")}>
      {metrics.map((m, i) => {
        const held = m.value != null;
        const t = held && m.score != null ? meaningStep(m.score) : null;
        return (
          <div key={i} className={"eng-score__cell" + (held ? "" : " eng-score__cell--empty")}>
            <div className="eng-score__top">
              <Glyph name={m.glyph} size={15} stroke={1.4} />
              <span className="eng-score__label">{m.label}</span>
            </div>
            <div className="eng-score__val">
              {held ? (
                <>
                  {m.value}
                  {m.unit ? <span className="u">{m.unit}</span> : null}
                </>
              ) : (
                DASH
              )}
            </div>
            {held && t && m.read ? (
              <span className="eng-score__read" style={{ color: t.fg }}>
                <span className="d" style={{ background: t.dot }} />
                {m.read}
              </span>
            ) : (
              <span className="eng-score__read" style={{ color: "var(--text-faint)" }}>
                {held ? NBSP : "not held"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
