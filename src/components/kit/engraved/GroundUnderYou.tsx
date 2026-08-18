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

      {/* Scoped styles for the meaning track, kept inside this one file: no
          globals.css edit and no shared-file edit. All names are new, so
          nothing in globals is overridden and no rule depends on which
          stylesheet the browser reads first. Every value here is the one the
          svg authored, read straight off the old 0..100 by 0..12 geometry:
          a 6px rail inside a 12px box, ticks 7.2px tall at each fifth, and a
          marker whose 6px is the diameter the vertical axis always gave it. */}
      <style>{`
        .eng-ground__track {
          position: relative;
          flex: 1;
          min-width: 0;
          height: 0.75rem;
          display: block;
        }
        .eng-ground__rail {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 6px;
          transform: translateY(-50%);
          background: var(--paper-200);
          border: 1px solid var(--hairline-strong);
          border-radius: var(--radius-full);
        }
        .eng-ground__tick {
          position: absolute;
          top: 50%;
          width: 1px;
          height: 7.2px;
          transform: translate(-50%, -50%);
          background: var(--hairline-strong);
          opacity: 0.7;
        }
        .eng-ground__fill {
          position: absolute;
          top: 50%;
          left: 0;
          height: 6px;
          max-width: 100%;
          transform: translateY(-50%);
          border: 1px solid;
          border-radius: var(--radius-full);
        }
        .eng-ground__marker {
          position: absolute;
          top: 50%;
          width: 6px;
          height: 6px;
          transform: translate(-50%, -50%);
          background: var(--surface-card);
          border: 1px solid;
          border-radius: 50%;
        }
      `}</style>
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
          {/* THE TRACK LEFT THE SVG 2026-08-18, same root cause as the setup
              stepper. It was `viewBox="0 0 100 12"` at
              `preserveAspectRatio="none"` with the height pinned at 0.75rem, so
              sy was always 1 and sx was whatever the column happened to be.
              Measured on the real /gb, rendered and read in a browser:

                375    box 173.4x12   sx 1.734   marker 7.6 x 4.4 px, 1.73:1
                768    box 344.8x12   sx 3.448   marker 15.2 x 4.4 px, 3.45:1
                1280   box 436.8x12   sx 4.368   marker 19.2 x 4.4 px, 4.37:1

              The worst distortion of the class anywhere in the kit. Three
              separate things were wrong and only one of them was the marker:
              the `rx="3"` pill ends became a 13px horizontal radius on a 6px
              bar, so the rounded ends were long tapers rather than
              semicircles; and the 0.6 hairline came out 2.6px on the two
              VERTICAL edges against 0.6px on the horizontal ones, a border
              four times heavier on two sides than the other two.

              A horizontal bar with a marker on it is a thing HTML lays out
              natively, so this needs no svg at all: percentage widths stretch
              the way a bar should, while a border-radius, a border weight and a
              round marker are all in CSS pixels and cannot be scaled by a
              viewBox. Every colour, position and proportion is the authored
              one; the marker keeps the 6px it always had VERTICALLY, which is
              the axis that was never distorted and therefore the authored
              intent. */}
          <span className="eng-ground__track" aria-hidden="true">
            <span className="eng-ground__rail" />
            {[20, 40, 60, 80].map((x) => (
              <span key={x} className="eng-ground__tick" style={{ left: `${x}%` }} />
            ))}
            <span
              className="eng-ground__fill"
              style={{
                width: `${pct}%`,
                background: isSample ? "var(--parchment)" : step.bg,
                borderColor: isSample ? "var(--cocoa-300)" : step.dot,
              }}
            />
            {/* the surveyor's marker at the read position */}
            <span
              className="eng-ground__marker"
              style={{
                left: `${Math.max(3, Math.min(97, pct))}%`,
                borderColor: isSample ? "var(--cocoa-300)" : step.dot,
              }}
            />
          </span>

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
