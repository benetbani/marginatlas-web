/**
 * kit/engraved/GroundUnderYou.tsx — "the ground under you" composite read.
 *
 * An honest read of the footing a small operator stands on: stability, rule of
 * law, currency, and how much corruption quietly taxes a one-person shop. Three
 * to four short labelled meaning bars on the quiet clay -> amber -> cocoa ->
 * moss scale, then one plain summary line. Higher always reads as safer ground.
 *
 * Composed from the Wave-1 engraved foundation (meaningStep, Glyph, SampleState)
 * and styled only through the engraved CSS vars + a little inline SVG
 * geometry, matching the look of kit/engraved/Compare.tsx without touching any
 * shared stylesheet. Two factors lean on figures carried in the country profile
 * (a perception read on corruption and an ease-of-operating read); the currency
 * and rule-of-law factors may arrive as a tagged sample until they are held.
 *
 * Honest by default: a null or empty `factors` list renders the foundation
 * SampleState, never a fabricated real-looking score. The component always
 * renders something and never crashes. Server-renderable, no client JS. Color
 * via var(--...) only, no raw hex. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { meaningStep, Glyph, SampleState, type GlyphName } from "./primitives";

/* ------------------------------------------------------------------ */
/* Types.                                                              */
/* ------------------------------------------------------------------ */

/** One footing factor: a labelled meaning bar with an optional plain note. */
export type GroundFactor = {
  /** The factor label, e.g. "Rule of law" or "Currency". */
  label: string;
  /** The footing read on a 0..1 scale; higher reads as safer ground. */
  score: number;
  /** An optional one-line plain note under the bar, e.g. "stable, freely traded". */
  note?: string | null;
  /**
   * Whether this factor is a tagged illustrative sample rather than a held
   * figure. A sample bar is drawn faint and carries a small "sample" tag, so it
   * never reads as a confirmed number.
   */
  sample?: boolean | null;
};

export type GroundUnderYouProps = {
  /**
   * The footing factors (the asset's canonical form is three or four). A null
   * or empty list renders the honest sample state for the whole section.
   */
  factors?: GroundFactor[] | null;
  /** One plain summary line under the bars, e.g. "Solid footing for a small shop." */
  summary?: string | null;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Helpers.                                                            */
/* ------------------------------------------------------------------ */

/** A glyph cue per factor, matched on a loose read of the label. */
function glyphFor(label: string): GlyphName {
  const l = label.toLowerCase();
  if (l.includes("rule") || l.includes("law") || l.includes("court") || l.includes("legal")) return "scale";
  if (l.includes("currenc") || l.includes("money") || l.includes("exchange") || l.includes("fx")) return "coin";
  if (l.includes("corrupt") || l.includes("bribe") || l.includes("honest")) return "stamp";
  if (l.includes("stab") || l.includes("politic") || l.includes("govern") || l.includes("safe")) return "flag";
  if (l.includes("ease") || l.includes("operat") || l.includes("doing business") || l.includes("admin")) return "key";
  return "doc";
}

/** A quiet one-word read for the footing, from the same five-step scale. */
function readFor(score: number): string {
  const step = Math.max(0, Math.min(4, Math.round(score * 4)));
  return ["Shaky", "Uneven", "Workable", "Solid", "Firm"][step];
}

// A non-breaking space holds a row's note height when there is no note.
const NBSP = " ";

/* ------------------------------------------------------------------ */
/* GroundUnderYou.                                                     */
/* ------------------------------------------------------------------ */

export function GroundUnderYou({ factors, summary, className }: GroundUnderYouProps) {
  if (!factors || factors.length === 0) {
    return (
      <SampleState
        glyph="scale"
        what="The ground under you not held yet"
        reason="A footing read on stability, rule of law, currency, and how much corruption taxes a small shop appears once the basics are confirmed."
        minH={140}
      />
    );
  }

  return (
    <section
      className={className}
      style={{
        border: "1px solid var(--hairline-strong)",
        background: "var(--surface-card)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      {/* Header: the footing legend only.
          THE EYEBROW AND TITLE WERE PRINTED TWICE and are gone from here,
          2026-08-18. The only call site wraps this in a section that already
          gives it an eyebrow reading "The ground under you", VERBATIM the same
          words this block re-printed underneath, plus an h2 reading "How solid
          the footing is for a small shop". So the reader met the same label
          twice and two headings in a row before reaching a single bar.
          The outer pair is the one that survives, on information rather than
          position: its h2 names the subject (a small shop) and the measure (how
          solid the footing is), where the h3 here said "An honest read of your
          footing", which names neither and asserts the honesty the whole page
          is already claiming. The legend stays because it is the one thing in
          this row the section above cannot say: it decodes the bars. */}
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.75rem 1rem",
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid var(--hairline-strong)",
        }}
      >
        <FootingLegend />
      </header>

      {/* The meaning bars. */}
      <div style={{ display: "flex", flexDirection: "column", padding: "0.5rem 0" }}>
        {factors.map((f, i) => (
          <FactorBar key={`${f.label}-${i}`} factor={f} />
        ))}
      </div>

      {/* One plain summary line. */}
      {summary ? (
        <p
          style={{
            margin: 0,
            padding: "0.75rem 1.25rem 1rem",
            borderTop: "1px solid var(--hairline-strong)",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "var(--text-muted)",
          }}
        >
          <span aria-hidden="true" style={{ color: "var(--cocoa-500)", marginRight: "0.4rem" }}>
            {/* an en-dash leader (U+2013); the em-dash is the banned one */}
            &#8211;&nbsp;
          </span>
          {summary}
        </p>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FactorBar — one labelled meaning bar.                               */
/* ------------------------------------------------------------------ */

function FactorBar({ factor }: { factor: GroundFactor }) {
  const raw = Number.isFinite(factor.score) ? factor.score : 0;
  const score = Math.max(0, Math.min(1, raw));
  const isSample = factor.sample === true;
  const step = meaningStep(score);
  const read = readFor(score);

  // Fill geometry on a 0..100 viewBox; a small floor keeps a faint footing
  // visible even at the very bottom of the scale.
  const pct = Math.max(3, score * 100);

  return (
    <div
      /* Grid, gap, padding and rule now live on .eng-ground__row in globals.css,
         because this row must STACK below 40rem and an inline style cannot
         carry a media query. Only opacity stays here: it depends on props. */
      className="eng-ground__row"
      style={{ opacity: isSample ? 0.78 : 1 }}
    >
      {/* Label cell: glyph + label, with the sample tag when illustrative. */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
        <span style={{ color: "var(--cocoa-500)", flex: "none", display: "block" }} aria-hidden="true">
          <Glyph name={glyphFor(factor.label)} size={15} stroke={1.4} />
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--text-body)",
            lineHeight: 1.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {factor.label}
        </span>
        {isSample ? (
          /* typography-ok: 0.6875rem is 11px, the engraved family's micro label
             size (eng-score__label, and the "Thin"/"Deep" ends in Compare).
             IT WAS 0.5625rem, WHICH IS 9px, and measured off the rendered page
             that was the smallest text on this site: two elements, nothing else
             below 10. Worse, it is the SAMPLE marker, whose whole job is to
             stop a reader taking an illustrative bar for a held figure, set
             uppercase in --text-faint at nine pixels. An honesty marker that
             has to be hunted for is not doing the job it exists for. */
          <span
            style={{
              flex: "none",
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
              border: "1px solid var(--hairline-strong)",
              borderRadius: "999px",
              padding: "0.05rem 0.35rem",
              background: "var(--paper-100)",
            }}
          >
            sample
          </span>
        ) : null}
      </div>

      {/* Track + read cell. */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* The hairline meaning track with an engraved tick at each fifth. */}
          <svg
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ flex: 1, height: "0.75rem", display: "block", minWidth: 0 }}
          >
            <rect
              x="0.6"
              y="3"
              width="98.8"
              height="6"
              rx="3"
              fill="var(--paper-200)"
              stroke="var(--hairline-strong)"
              strokeWidth="0.6"
            />
            {[20, 40, 60, 80].map((x) => (
              <line key={x} x1={x} y1="2.4" x2={x} y2="9.6" stroke="var(--hairline-strong)" strokeWidth="0.5" opacity="0.7" />
            ))}
            <rect
              x="0.6"
              y="3"
              width={Math.max(0, pct - 1.2)}
              height="6"
              rx="3"
              fill={isSample ? "var(--parchment)" : step.bg}
              stroke={isSample ? "var(--cocoa-300)" : step.dot}
              strokeWidth="0.8"
            />
            {/* the surveyor's marker at the read position */}
            <circle
              cx={Math.max(3, Math.min(97, pct))}
              cy="6"
              r="2.2"
              fill="var(--surface-card)"
              stroke={isSample ? "var(--cocoa-300)" : step.dot}
              strokeWidth="1.1"
            />
          </svg>

          {/* The one-word footing read, tinted by the meaning step. */}
          <span
            style={{
              flex: "none",
              minWidth: "3.75rem",
              textAlign: "right",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: isSample ? "var(--text-faint)" : step.fg,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {read}
          </span>
        </div>

        {/* The optional plain note (a non-breaking space holds the row height). */}
        <div
          style={{
            marginTop: "0.2rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            lineHeight: 1.35,
            color: "var(--text-faint)",
          }}
        >
          {factor.note ? factor.note : NBSP}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FootingLegend — the quiet shaky -> firm scale cue.                  */
/* ------------------------------------------------------------------ */

function FootingLegend() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.625rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--text-faint)",
      }}
    >
      <span>Shaky</span>
      <span style={{ display: "flex", gap: "0.15rem" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const s = meaningStep(i / 4);
          return (
            <span
              key={i}
              style={{
                width: "0.4rem",
                height: "0.4rem",
                borderRadius: "999px",
                background: s.dot,
                border: "1px solid var(--hairline-strong)",
              }}
            />
          );
        })}
      </span>
      <span>Firm</span>
    </div>
  );
}
