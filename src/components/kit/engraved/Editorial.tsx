/**
 * kit/engraved/Editorial.tsx — the quiet editorial engraved sections.
 *
 * The understated end-of-page furniture: what locals know (a short visual list,
 * one insight per row), the honest take (a one-line verdict with supporting
 * ticks), the page-closing one-thing band (a compass-rosette mark, one warm
 * display sentence, a last-checked + flag-it sign-off), and the section divider
 * family (rosette / contour / route). Ported faithfully from the design export
 * 2026-06-14-country-engraved (engraved/editorial.jsx).
 *
 * These compose from the Wave-1 foundation (Glyph, CompassRosette, ContourField,
 * RouteLine, SampleState) and read color only through the engraved CSS vars.
 * LocalsKnow takes structured ReactNode text rather than raw HTML, so emphasis
 * is composed with JSX <b>, not injected. The interactive GutCheck triptych is a
 * separate client island (./GutCheck); these stay server-renderable. Props are
 * nullable; missing or empty input renders the honest SampleState. SVG geometry
 * is inline. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { Glyph, CompassRosette, ContourField, RouteLine, SampleState, type GlyphName } from "./primitives";

/* ------------------------------------------------------------------ */
/* LocalsKnow — a short visual list: glyph + one insight per row.      */
/* ------------------------------------------------------------------ */

/** One insight the figures don't carry. */
export type LocalInsight = {
  /** The engraved glyph beside the insight. */
  glyph: GlyphName;
  /**
   * The insight text. A ReactNode so callers compose emphasis with JSX
   * (e.g. <>{"Rent, not wages, "}<b>decides the margin</b></>), never raw HTML.
   */
  text: React.ReactNode;
};

export type LocalsKnowProps = {
  /** The insights, one per row. */
  items?: LocalInsight[] | null;
  /** Render the honest sample state instead of the list. */
  sample?: boolean;
  className?: string;
};

export function LocalsKnow({ items, sample, className }: LocalsKnowProps) {
  if (sample || !items || items.length === 0) {
    return (
      <SampleState
        glyph="bulb"
        what="Local insight not held yet"
        reason="A few things residents know that the figures don't say. Added as operators tell us."
        minH={100}
      />
    );
  }
  return (
    <div className={["eng-locals", className].filter(Boolean).join(" ")}>
      {items.map((it, i) => (
        <div className="eng-local" key={i}>
          <span className="eng-local__icon">
            <Glyph name={it.glyph} size={18} stroke={1.5} />
          </span>
          <span className="eng-local__text">{it.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HonestTake — a quiet one-line verdict + supporting ticks.           */
/* ------------------------------------------------------------------ */

export type HonestTakeProps = {
  /** The one-line verdict, the headline read. */
  verdict?: string | null;
  /** Two or three supporting ticks. */
  ticks?: string[] | null;
  /** Render the honest sample state instead of the take. */
  sample?: boolean;
  className?: string;
};

export function HonestTake({ verdict, ticks, sample, className }: HonestTakeProps) {
  if (sample || !verdict) {
    return (
      <SampleState
        glyph="leaf"
        what="Honest take not written yet"
        reason="A one-line verdict with a couple of supporting ticks. Deliberately quiet."
        minH={90}
      />
    );
  }
  return (
    <div className={["eng-take", className].filter(Boolean).join(" ")}>
      <div className="eng-take__verdict">{verdict}</div>
      {ticks && ticks.length > 0 ? (
        <div className="eng-take__ticks">
          {ticks.map((t, i) => (
            <div className="eng-take__tick" key={i}>
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 8.5l3 3 7-7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OneThing — the page-closing band.                                   */
/* ------------------------------------------------------------------ */

export type OneThingProps = {
  /** The one warm display-serif sentence that closes the page. */
  sentence?: string | null;
  /** The last-checked stamp, e.g. "June 2026". @default "June 2026" */
  lastChecked?: string;
  /** Href the "Flag something off" link points at (e.g. a flag-it form). */
  flagHref?: string | null;
  /** Render the honest sample state instead of the band. */
  sample?: boolean;
  className?: string;
};

/* NO DEFAULT DATE. `lastChecked = "June 2026"` here meant a caller who omitted
   the prop still printed a freshness stamp, so the stamp appeared on pages
   nobody had dated. It is a claim about provenance and it was a string literal,
   two months stale by 2026-08-21. The prop stays for the day a real date exists;
   until then the stamp self-omits, which is this site's sanctioned answer to a
   figure it does not hold. */
export function OneThing({ sentence, lastChecked, flagHref, sample, className }: OneThingProps) {
  if (sample || !sentence) {
    return (
      <SampleState
        glyph="leaf"
        what="Closing line not written yet"
        reason="One warm sentence to close the country page, with a quiet trust row."
        minH={90}
      />
    );
  }
  return (
    <div className={["eng-onething", className].filter(Boolean).join(" ")}>
      <div className="eng-onething__contour">
        <ContourField h={120} lines={6} opacity={0.45} />
      </div>
      <div className="eng-onething__rosette">
        <CompassRosette size={66} tone="var(--accent-fill)" ring="var(--hairline-strong)" />
      </div>
      <div className="eng-onething__body">
        <p className="eng-onething__sentence">{sentence}</p>
        <div className="eng-onething__signoff">
          <span className="eng-onething__stamp">Last checked {lastChecked}</span>
          {flagHref ? (
            <a className="eng-onething__flag" href={flagHref}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 21V4m0 1h11l-2.5 4L17 13H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Flag something off
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AtlasDivider — the section divider family.                          */
/* ------------------------------------------------------------------ */

/** Which divider motif to draw. */
export type AtlasDividerVariant = "rosette" | "contour" | "route";

export type AtlasDividerProps = {
  /** The divider motif. @default "rosette" */
  variant?: AtlasDividerVariant;
  /** Optional label (rosette variant) + the accessible separator label. */
  label?: string | null;
  className?: string;
};

export function AtlasDivider({ variant = "rosette", label, className }: AtlasDividerProps) {
  const ariaLabel = label || "divider";
  if (variant === "contour") {
    return (
      <div className={["eng-divider", className].filter(Boolean).join(" ")} role="separator" aria-label={ariaLabel}>
        <ContourField h={26} lines={3} opacity={0.6} />
      </div>
    );
  }
  if (variant === "route") {
    return (
      <div className={["eng-divider", className].filter(Boolean).join(" ")} role="separator" aria-label={ariaLabel}>
        <svg width="100%" height="40" viewBox="0 0 600 40" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <RouteLine nodes={5} w={600} />
        </svg>
      </div>
    );
  }
  return (
    <div
      className={["eng-divider eng-divider--rosette", className].filter(Boolean).join(" ")}
      role="separator"
      aria-label={ariaLabel}
    >
      <span className="eng-divrule" />
      <CompassRosette size={26} tone="var(--accent-fill)" ring="var(--hairline-strong)" />
      {label ? <span className="eng-divlabel">{label}</span> : null}
      <span className="eng-divrule" />
    </div>
  );
}
