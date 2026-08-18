/**
 * kit/engraved/WhoHasMoney.tsx — the customer's-wallet engraved section.
 *
 * "Who has money to spend" (demand). Two reads, both honest about how real they
 * are. First the headline spending-power gauge: a single surveyor station riding
 * the quiet clay -> amber -> cocoa -> moss meaning scale, with the figure in the
 * display serif and a one-line read. This one is real, blended from net wealth,
 * salary, and the cost of living. Then the spend split: a few engraved
 * proportion bars showing what locals spend on vs skimp on. No country holds a
 * spend split today, so in practice that half of the card does not render.
 *
 * Composes from the Wave-1 foundation (meaningStep, Glyph, SampleState,
 * Eyebrow) and reads color only through the engraved CSS vars, matching
 * kit/engraved/Compare.tsx. Every data prop is nullable and never fabricated.
 * The two reads behave DIFFERENTLY on absence, and deliberately: a missing
 * spending-power gauge falls to the honest SampleState, because that gauge is
 * the point of the section, while an empty spend mix drops its whole block
 * including the rule above it, because no country holds a spend split and an
 * empty box under a real read is worse than no box.
 * Server-renderable, no client JS. SVG / track geometry is
 * inline. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { meaningStep, Glyph, SampleState, Eyebrow, type GlyphName } from "./primitives";

// The en-dash shown in a not-held read (U+2013); the em-dash is the banned one.
const DASH = "–";

/* ------------------------------------------------------------------ */
/* Props.                                                              */
/* ------------------------------------------------------------------ */

/** The headline spending-power read, blended from real inputs. */
export type SpendingPower = {
  /**
   * Spending power on a 0..1 scale (thin wallet -> deep wallet). Drives the
   * gauge node position and the meaning tint.
   */
  score: number;
  /** Optional display figure, e.g. "£2,140" or "Upper-middle". */
  value?: string | null;
  /** Optional one-line read, e.g. "Comfortable once rent is paid". */
  read?: string | null;
};

/** One slice of the spend mix: what a share of the wallet goes toward. */
export type SpendCategory = {
  /** The category label, e.g. "Eating out". */
  label: string;
  /** The share of spend, 0..1. */
  share: number;
};

export type WhoHasMoneyProps = {
  /**
   * The headline spending-power read. Real (net wealth + salary + cost of
   * living). Null renders the honest sample gauge.
   */
  spendingPower?: SpendingPower | null;
  /**
   * What locals spend on vs skimp on, as proportion bars. Sample until
   * consumer-spend data lands; null or empty renders the honest sample mix.
   */
  mix?: SpendCategory[] | null;
  /** Render the honest sample state for the whole section. */
  sample?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Small inline helpers (geometry only, all color via CSS vars).       */
/* ------------------------------------------------------------------ */

// Five labelled rungs along the wallet scale: thin -> deep.
const RUNGS: readonly string[] = ["Thin", "Modest", "Mid", "Comfortable", "Deep"];

// A glyph hint per mix row, cycled so the bars carry the engraved icon set
// without a caller having to choose. Order leans wallet / basket / coin.
const MIX_GLYPHS: readonly GlyphName[] = ["basket", "coin", "wallet", "leaf", "doc"];

/** The spending-power gauge: meaning-scale track with a single station node. */
function PowerGauge({ power }: { power: SpendingPower }) {
  const s = Math.max(0, Math.min(1, power.score));
  const t = meaningStep(s);
  // Node position in the track viewBox (kept off the very ends so it reads).
  const VBW = 600;
  const pad = 14;
  const x = pad + (VBW - pad * 2) * s;
  const rung = RUNGS[Math.max(0, Math.min(4, Math.round(s * 4)))];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div
          className="leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 500,
            color: "var(--ink-900)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.01em",
          }}
        >
          {power.value != null ? power.value : DASH}
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-sm"
          style={{ color: t.fg, fontFamily: "var(--font-body)", fontWeight: 600 }}
        >
          <span
            aria-hidden="true"
            className="inline-block rounded-full"
            style={{ width: 7, height: 7, background: t.dot }}
          />
          {rung}
        </span>
      </div>

      {/* The engraved meaning-scale track. */}
      <div className="eng-power__stage mt-3">
      <svg
        viewBox={`0 0 ${VBW} 56`}
        width="100%"
        height="44"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Spending power: ${rung}`}
        className="block"
        style={{ overflow: "visible" }}
      >
        {/* the five meaning rungs as soft tint bands under the baseline */}
        {Array.from({ length: 5 }).map((_, i) => {
          const seg = (VBW - pad * 2) / 5;
          const bx = pad + seg * i;
          const step = meaningStep(i / 4);
          return (
            <rect
              key={i}
              x={bx}
              y={22}
              width={seg - 2}
              height={8}
              fill={step.bg}
              stroke="var(--hairline-strong)"
              strokeWidth="0.6"
            />
          );
        })}
        {/* baseline rule */}
        <line x1={pad} y1={36} x2={VBW - pad} y2={36} stroke="var(--hairline-strong)" strokeWidth="1" />
        {/* tick marks at each rung boundary */}
        {Array.from({ length: 6 }).map((_, i) => {
          const seg = (VBW - pad * 2) / 5;
          const tx = pad + seg * i;
          return <line key={i} x1={tx} y1={36} x2={tx} y2={41} stroke="var(--hairline-strong)" strokeWidth="0.7" />;
        })}
        {/* THE STATION NODE MOVED OUT OF HERE 2026-08-18. The bands, the
            baseline and the ticks stay: a scale legitimately spans whatever
            width it is given, and this svg is `preserveAspectRatio="none"` for
            that reason. What cannot survive it is a ROUND mark. Measured on the
            real /gb, rendered and read in a browser:

              375    box 285x44   sx 0.475  sy 0.786   disc 8.1 x 13.4 px
              768    box 662x44   sx 1.103  sy 0.786   disc 18.8 x 13.4 px
              1280   box 754x44   sx 1.257  sy 0.786   disc 21.4 x 13.4 px

            The node is the read: it is the one mark saying where this country
            sits on the scale, and it was an ellipse standing on end at 375 and
            lying on its side at 1280, never a circle at any width. It is now an
            HTML overlay placed by the same percentage the viewBox used, which
            is the technique CountryShape's ring labels already use in this same
            kit. Nothing else about the graphic changes. */}
      </svg>

        {/* The station, placed by the same fraction the viewBox used. Its parts
            keep the authored PROPORTIONS: the disc was 17 user units across and
            the inner dot 6.4, a ratio of 2.66, and the svg's height is pinned
            at 44 so the vertical axis has always rendered the disc at 13.4px at
            every width. 14px and 5px hold both the ratio and what a reader has
            actually been seeing, on the one axis that was never in doubt. */}
        <span
          className="eng-power__station"
          style={{ left: `${(x / VBW) * 100}%`, color: t.fg }}
          aria-hidden="true"
        >
          <span className="eng-power__stem" />
          <span className="eng-power__disc" style={{ borderColor: t.fg }}>
            <span className="eng-power__dot" style={{ background: t.dot }} />
          </span>
        </span>
      </div>

      {/* Scoped styles, new names only, so globals is neither edited nor
          overridden and no rule depends on stylesheet order. The percentages
          are the viewBox's own y coordinates over its 56-unit height: the stem
          ran 8 to 30, the disc centred on 20. */}
      <style>{`
        .eng-power__stage {
          position: relative;
        }
        .eng-power__station {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 0;
          pointer-events: none;
        }
        .eng-power__stem {
          position: absolute;
          left: 0;
          top: 14.29%;
          height: 39.29%;
          width: 1px;
          transform: translateX(-50%);
          background: currentColor;
        }
        .eng-power__disc {
          position: absolute;
          left: 0;
          top: 35.71%;
          width: 14px;
          height: 14px;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-card);
          border: 1px solid;
          border-radius: 50%;
        }
        .eng-power__dot {
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
      `}</style>

      {/* rung end-labels */}
      <div className="mt-1 flex justify-between" style={{ paddingLeft: 2, paddingRight: 2 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", color: "var(--text-faint)" }}>
          {RUNGS[0]}
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", color: "var(--text-faint)" }}>
          {RUNGS[RUNGS.length - 1]}
        </span>
      </div>

      {power.read ? (
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "var(--text-muted)",
          }}
        >
          {power.read}
        </p>
      ) : null}
    </div>
  );
}

/** One engraved proportion bar in the spend split. */
function MixBar({ cat, glyph }: { cat: SpendCategory; glyph: GlyphName }) {
  const share = Math.max(0, Math.min(1, cat.share));
  const t = meaningStep(share);
  const pct = Math.round(share * 100);
  return (
    <div className="flex items-center gap-2.5">
      <span style={{ color: "var(--cocoa-500)" }} className="shrink-0">
        <Glyph name={glyph} size={15} stroke={1.4} />
      </span>
      <span
        className="shrink-0"
        style={{
          width: "5.5rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          color: "var(--text-body)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {cat.label}
      </span>
      <span
        className="relative flex-1 overflow-hidden"
        style={{
          height: 12,
          background: "var(--paper-100)",
          border: "1px solid var(--hairline-strong)",
        }}
      >
        <span
          className="absolute inset-y-0 left-0"
          style={{ width: `${pct}%`, background: t.dot, opacity: 0.85 }}
        />
      </span>
      <span
        className="shrink-0 text-right"
        style={{
          width: "2.5rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: t.fg,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {pct}
        <span style={{ fontWeight: 400, color: "var(--text-faint)" }}>%</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WhoHasMoney.                                                        */
/* ------------------------------------------------------------------ */

export function WhoHasMoney({ spendingPower, mix, sample, className }: WhoHasMoneyProps) {
  const hasPower = !sample && spendingPower != null && typeof spendingPower.score === "number";
  const hasMix = !sample && Array.isArray(mix) && mix.length > 0;

  // Nothing held at all: one honest sample for the whole section.
  if (!hasPower && !hasMix) {
    return (
      <SampleState
        glyph="wallet"
        what="Spending power not held yet"
        reason="The customer's wallet reads off net wealth, salary, and the cost of living. Shown once those basics are confirmed."
        minH={140}
      />
    );
  }

  return (
    <div
      className={["flex flex-col gap-6", className].filter(Boolean).join(" ")}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* The wallet: real spending-power read. */}
      <div>
        <Eyebrow style={{ marginBottom: "0.5rem" }}>The wallet</Eyebrow>
        {hasPower ? (
          <PowerGauge power={spendingPower as SpendingPower} />
        ) : (
          <SampleState
            glyph="coin"
            what="Spending power not held yet"
            reason="Blended from net wealth, salary, and the cost of living once confirmed."
            minH={110}
          />
        )}
      </div>

      {/* The split: what locals spend on vs skimp on. No country holds a spend
          split, so the whole block including its rule self-omits rather than
          printing an empty box under the real spending-power read. It returns
          the moment a real mix is passed. */}
      {hasMix ? (
        <>
          {/* hairline rule between the two reads */}
          <span
            aria-hidden="true"
            style={{ height: 1, background: "var(--hairline-strong)", opacity: 0.7 }}
          />
          <div>
            <div
              className="flex items-center justify-between gap-3 flex-wrap"
              style={{ marginBottom: "0.625rem" }}
            >
              <Eyebrow>What the wallet goes on</Eyebrow>
              <span
                className="inline-flex items-center"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  border: "1px solid var(--hairline-strong)",
                  borderRadius: 999,
                  padding: "0.0625rem 0.4375rem",
                }}
              >
                sample
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {(mix as SpendCategory[]).map((cat, i) => (
                <MixBar key={`${cat.label}-${i}`} cat={cat} glyph={MIX_GLYPHS[i % MIX_GLYPHS.length]} />
              ))}
            </div>
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                color: "var(--text-faint)",
              }}
            >
              Illustrative spend split. Real category shares land once consumer-spend data is confirmed.
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default WhoHasMoney;
