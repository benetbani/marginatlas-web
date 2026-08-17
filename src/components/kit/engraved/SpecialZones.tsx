/**
 * kit/engraved/SpecialZones.tsx — the special-zones engraved callout.
 *
 * A callout card that appears only where a special zone materially changes the
 * arithmetic of setting up: a free zone, an enterprise district, a charter
 * area. Each zone is a single engraved card with an etched gate / boundary
 * motif, the zone name set in the display serif (Fraunces), two-to-three bullet
 * facts about what actually changes (tax, ownership, setup) each marked with a
 * small check Glyph, one "what it's worth" figure or phrase carried in the lone
 * atlas accent, and a faint StampSeal anchored top-right.
 *
 * Composed from the Wave-1 foundation (StampSeal, Glyph, SampleState, Eyebrow)
 * and the engraved CSS-variable layer in globals.css. Color is referenced only
 * via var(--...) or Tailwind token classes; SVG path / viewBox numbers are
 * geometry, not style tokens, so they stay inline like every other Atlas chart.
 *
 * Honest by default: the `zones` prop is nullable, and when no zone is held the
 * card renders the foundation SampleState rather than inventing a zone. Curated
 * per country (the Dubai free zones and similar); sample or empty for most.
 *
 * Server-renderable: this asset holds no state, so the file carries no
 * "use client" directive. No em-dashes, no source-agency names, AA contrast,
 * legible at 375px.
 */
import * as React from "react";
import { StampSeal, SampleState, Eyebrow } from "./primitives";

/* ------------------------------------------------------------------ */
/* Types.                                                              */
/* ------------------------------------------------------------------ */

/** One special zone whose rules change the setup math. */
export type SpecialZone = {
  /** The zone name, e.g. "Jebel Ali Free Zone". Set in the display serif. */
  name: string;
  /** Two or three short facts on what changes (tax, ownership, setup). */
  facts: string[];
  /** The single "what it is worth" figure or phrase, carried in the accent. */
  worth?: string | null;
  /** Optional one-line locator, e.g. "Coastal, west of the city". */
  where?: string | null;
  /** Optional word for the seal face. @default "ZONE" */
  seal?: string;
};

export type SpecialZonesProps = {
  /** The held zones, or null / empty when none is confirmed. */
  zones?: SpecialZone[] | null;
  /** Force the honest sample state regardless of input. */
  sample?: boolean;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* GateMotif — an etched gate / boundary mark drawn in one tone.       */
/* A surveyed boundary line broken by a gate post pair, the threshold  */
/* the zone's rules begin at. Single-tone engraving, faint.            */
/* ------------------------------------------------------------------ */

function GateMotif({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="var(--cocoa-500)"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* the boundary the zone sits behind: a dashed surveyor's line */}
      <line
        x1="2"
        y1="34"
        x2="46"
        y2="34"
        strokeWidth="1"
        strokeDasharray="1 4"
        strokeLinecap="round"
      />
      {/* two gate posts framing the threshold */}
      <line x1="15" y1="34" x2="15" y2="14" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="33" y1="34" x2="33" y2="14" strokeWidth="1.4" strokeLinecap="round" />
      {/* the lintel arching across the gate */}
      <path d="M13 14 Q24 6 35 14" strokeWidth="1.4" strokeLinecap="round" />
      {/* post caps */}
      <circle cx="15" cy="14" r="1.7" fill="var(--surface-card)" strokeWidth="1.2" />
      <circle cx="33" cy="14" r="1.7" fill="var(--surface-card)" strokeWidth="1.2" />
      {/* the threshold mark on the line, tinted to the accent: rules begin here */}
      <path
        d="M22 34 l2 -3 l2 3 Z"
        fill="var(--accent-fill)"
        stroke="var(--accent-fill)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CheckGlyph — a small engraved confirmation tick, one moss tone.     */
/* Marks each fact the zone confirms; drawn inside a faint hairline     */
/* ring so it reads as a stamped check, not a generic bullet.          */
/* ------------------------------------------------------------------ */

function CheckGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <circle cx="12" cy="12" r="9.5" stroke="var(--hairline-strong)" strokeWidth="1" fill="var(--accent-subtle)" />
      <path
        d="M7.5 12.3 l3 3 l6 -6.6"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ZoneCard — one engraved zone callout.                               */
/* ------------------------------------------------------------------ */

function ZoneCard({ zone }: { zone: SpecialZone }) {
  // Keep to the spec's two-to-three facts even if more are passed.
  const facts = (zone.facts ?? []).filter(Boolean).slice(0, 3);
  return (
    <div
      className="relative rounded-xl bg-[var(--surface-card)] overflow-hidden"
      style={{ border: "1px solid var(--hairline-strong)" }}
    >
      {/* faint council seal, top-right */}
      <div className="absolute top-3 right-3 opacity-70" aria-hidden="true">
        <StampSeal size={46} label={zone.seal ?? "ZONE"} tone="var(--cocoa-500)" />
      </div>

      <div className="p-4">
        {/* gate motif + name + locator */}
        <div className="flex items-start gap-3 pr-12">
          <span className="flex-none mt-0.5">
            <GateMotif size={40} />
          </span>
          <div className="min-w-0">
            <Eyebrow style={{ color: "var(--text-faint)" }}>Special zone</Eyebrow>
            <h4
              className="mt-1 leading-tight text-[var(--text-strong)] break-words"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "18px",
              }}
            >
              {zone.name}
            </h4>
            {zone.where ? (
              <div
                className="mt-0.5 text-[var(--text-faint)]"
                style={{ fontFamily: "var(--font-body)", fontSize: "12px", lineHeight: 1.45 }}
              >
                {zone.where}
              </div>
            ) : null}
          </div>
        </div>

        {/* what changes: two-to-three checked facts */}
        <ul className="mt-3.5 flex flex-col gap-2">
          {facts.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="flex-none mt-0.5" aria-hidden="true">
                <CheckGlyph size={16} />
              </span>
              <span
                className="text-[var(--text-body)]"
                style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.5 }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* the single "what it is worth" line, carried in the accent */}
        {zone.worth ? (
          <div
            className="mt-3.5 pt-3 flex items-baseline gap-2"
            style={{ borderTop: "1px solid var(--hairline)" }}
          >
            <span
              className="flex-none text-[var(--text-faint)]"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              What it is worth
            </span>
            <span
              className="text-[var(--accent)]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: 1.2,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {zone.worth}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SpecialZones — the section.                                         */
/* ------------------------------------------------------------------ */

export function SpecialZones({ zones, sample, className }: SpecialZonesProps) {
  const held = !sample && Array.isArray(zones) ? zones.filter((z) => z && z.name) : [];

  if (sample || held.length === 0) {
    return (
      <div className={className}>
        <SampleState
          glyph="key"
          what="No special zone changes the maths here that we hold yet"
          reason="A free zone or charter area shows here only where it moves tax, ownership, or setup. None is invented."
          minH={120}
        />
      </div>
    );
  }

  return (
    <div className={["flex flex-col gap-3", className].filter(Boolean).join(" ")}>
      {held.map((z, i) => (
        <ZoneCard key={`${z.name}-${i}`} zone={z} />
      ))}
    </div>
  );
}

export default SpecialZones;
