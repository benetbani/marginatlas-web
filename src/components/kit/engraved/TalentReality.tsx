/**
 * kit/engraved/TalentReality.tsx — the talent reality engraved section.
 *
 * Intake question #19 (people), the read beyond wage cost: can you find skilled
 * people, can you keep them, and what the work culture is like. It renders three
 * short meaning reads on the quiet clay -> amber -> cocoa -> moss scale
 * (availability, skill, retention) drawn as engraved survey gauges, then one
 * plain line on the work culture beneath a hairline rule.
 *
 * Composed entirely from the Wave-1 engraved foundation (meaningStep, Glyph,
 * Eyebrow, SampleState) plus the engraved CSS vars and inline SVG geometry, in
 * the manner of kit/engraved/Compare.tsx. No shared CSS is added: every style
 * lives in this file as a var(--...) reference or a Tailwind token class, and the
 * only inline numbers are SVG / layout geometry, not style tokens.
 *
 * Honest by default: labour availability and skill are not held data today, so
 * `signals` is largely sample. When `signals` is null or empty the component
 * renders the foundation SampleState (a clearly-tagged illustrative state) rather
 * than any fabricated real-looking number; it always renders a skeleton, never
 * blank, never crashes. Server-renderable, no client JS. No em-dashes, no
 * source-agency names, AA contrast, legible at 375px.
 */
import * as React from "react";
import { meaningStep, Glyph, Eyebrow, SampleState, type GlyphName } from "./primitives";

/* ------------------------------------------------------------------ */
/* Types.                                                              */
/* ------------------------------------------------------------------ */

/** One talent signal: a labelled meaning read on the 0..1 scale. */
export type TalentSignal = {
  /** The signal label, e.g. "Finding people" or "Keeping people". */
  label: string;
  /** The read on the 0..1 meaning scale (higher reads greener / easier). */
  score: number;
  /** Optional one-line note under the read, e.g. "Skilled trades are tight". */
  note?: string | null;
};

export type TalentRealityProps = {
  /**
   * The talent reads, in order (canonically availability, skill, retention).
   * Null or empty renders the honest SampleState; labour availability and skill
   * are not held yet, so this is largely sample today.
   */
  signals?: TalentSignal[] | null;
  /** One plain line on the work culture, e.g. "Long hours are the norm." */
  culture?: string | null;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Geometry helpers (no style tokens, just drawing maths).            */
/* ------------------------------------------------------------------ */

/** A short word read for a 0..1 score, so the gauge never shows a bare number. */
function readWord(s: number): string {
  if (s >= 0.8) return "Plentiful";
  if (s >= 0.6) return "Workable";
  if (s >= 0.4) return "Mixed";
  if (s >= 0.2) return "Tight";
  return "Scarce";
}

/** A per-signal glyph cue; falls back to people for an unknown position. */
const SIGNAL_GLYPHS: readonly GlyphName[] = ["people", "ribbon", "key"];

/* ------------------------------------------------------------------ */
/* Gauge — one engraved survey arc for a single 0..1 read.            */
/* A tone-only quarter dial: a faint full track, a tinted filled arc,  */
/* tick stations, and a needle to the read. Pure linework.            */
/* ------------------------------------------------------------------ */

function Gauge({ score, tone }: { score: number; tone: string }) {
  const s = Math.max(0, Math.min(1, score));
  // Semicircle dial from 180deg (left) sweeping to 0deg (right), radius 30.
  const cx = 36;
  const cy = 38;
  const r = 30;
  const ang = Math.PI - s * Math.PI; // 1 -> 0rad (right), 0 -> PI (left)
  const pt = (a: number, rr: number) => [cx + Math.cos(a) * rr, cy - Math.sin(a) * rr];
  const [sx, sy] = pt(Math.PI, r); // left end
  const [ex, ey] = pt(ang, r); // read end
  const large = s > 0.5 ? 1 : 0;
  const [nx, ny] = pt(ang, r - 4);
  const ticks = Array.from({ length: 5 }).map((_, i) => {
    const a = Math.PI - (i / 4) * Math.PI;
    const [t1x, t1y] = pt(a, r + 1.5);
    const [t2x, t2y] = pt(a, r - 2.5);
    return (
      <line
        key={i}
        x1={t1x}
        y1={t1y}
        x2={t2x}
        y2={t2y}
        stroke="var(--hairline-strong)"
        strokeWidth={i % 2 === 0 ? 1 : 0.6}
      />
    );
  });
  return (
    <svg width="72" height="46" viewBox="0 0 72 46" aria-hidden="true" style={{ display: "block" }}>
      {/* faint full track */}
      <path
        d={`M${sx} ${sy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--hairline-strong)"
        strokeWidth="1"
        opacity="0.7"
      />
      {/* tinted filled arc to the read */}
      <path
        d={`M${sx} ${sy} A${r} ${r} 0 ${large} 1 ${ex} ${ey}`}
        fill="none"
        stroke={tone}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {ticks}
      {/* needle + hub */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={tone} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="2.6" fill="var(--surface-card)" stroke={tone} strokeWidth="1.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* TalentReality.                                                      */
/* ------------------------------------------------------------------ */

export function TalentReality({ signals, culture, className }: TalentRealityProps) {
  const held = Array.isArray(signals) && signals.length > 0;

  return (
    <section
      className={className}
      style={{
        border: "1px solid var(--hairline)",
        borderRadius: 14,
        background: "var(--surface-card)",
        padding: 20,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            color: "var(--cocoa-700)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: 8,
            padding: 6,
            background: "var(--paper-100)",
          }}
        >
          <Glyph name="people" size={18} stroke={1.4} />
        </span>
        <div>
          <Eyebrow>The talent reality</Eyebrow>
          <p style={{ margin: 0, marginTop: 2, color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.4 }}>
            Beyond wage cost: can you find and keep skilled people.
          </p>
        </div>
      </header>

      {held ? (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
          {signals!.map((sig, i) => {
            const s = Math.max(0, Math.min(1, Number.isFinite(sig.score) ? sig.score : 0));
            const t = meaningStep(s);
            const glyph = SIGNAL_GLYPHS[i] ?? "people";
            return (
              <li
                key={`${sig.label}-${i}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "72px 1fr",
                  gap: 14,
                  alignItems: "center",
                  paddingBottom: i < signals!.length - 1 ? 14 : 0,
                  borderBottom: i < signals!.length - 1 ? "1px solid var(--hairline)" : "none",
                }}
              >
                <span style={{ color: t.fg }}>
                  <Gauge score={s} tone={t.dot} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span aria-hidden="true" style={{ color: "var(--cocoa-500)", display: "inline-flex" }}>
                      <Glyph name={glyph} size={14} stroke={1.4} />
                    </span>
                    <span style={{ color: "var(--text-strong)", fontSize: "0.9rem", fontWeight: 600 }}>
                      {sig.label}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        marginLeft: "auto",
                        color: t.fg,
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ width: 7, height: 7, borderRadius: 99, background: t.dot, display: "inline-block" }}
                      />
                      {readWord(s)}
                    </span>
                  </div>
                  {sig.note ? (
                    <p style={{ margin: 0, marginTop: 4, color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.45 }}>
                      {sig.note}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <SampleState
          glyph="people"
          what="We are still measuring the labour market here"
          reason="Whether skilled people are easy to find and keep is not held yet, so it stays blank rather than guess."
          minH={120}
        />
      )}

      {/* Work culture: one plain line beneath a hairline rule. */}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--hairline)" }}>
        <Eyebrow style={{ marginBottom: 6 }}>Work culture</Eyebrow>
        {culture ? (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span aria-hidden="true" style={{ color: "var(--accent)", display: "inline-flex", marginTop: 1 }}>
              <Glyph name="clock" size={16} stroke={1.4} />
            </span>
            <p style={{ margin: 0, color: "var(--text-body)", fontSize: "0.92rem", lineHeight: 1.5 }}>{culture}</p>
          </div>
        ) : (
          <p style={{ margin: 0, color: "var(--text-faint)", fontSize: "0.85rem", lineHeight: 1.5 }}>
            How people work here is not written up yet.
          </p>
        )}
      </div>
    </section>
  );
}
