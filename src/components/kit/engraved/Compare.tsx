/**
 * kit/engraved/Compare.tsx — the comparison engraved sections.
 *
 * Four assets that place the country in context without ever crowning a winner:
 * the peer strip (like-for-like against economies of comparable size and market,
 * the home country tinted for orientation only), the cities grid (uniform equal-weight
 * cards, no ranking), the character panel (culture / government / demographics
 * spectrum bars plus a compact two-stat read), and vs-the-world (one bar against
 * a global median). Ported faithfully from the design export
 * 2026-06-14-country-engraved (engraved/compare.jsx).
 *
 * Each composes from the Wave-1 foundation (meaningStep, Glyph, SampleState) and
 * reads color only through the engraved CSS vars. The column flags use the
 * repo CountryFlag component by ISO-2 (not a hardcoded flag map), matching the
 * EngravedHero precedent. Props are nullable; missing or empty input renders the
 * honest SampleState. Server-renderable; no client JS. SVG / table geometry is
 * inline. No em-dashes, no source-agency names, no cross-geography ranking.
 */
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { meaningStep, Glyph, SampleState, type GlyphName } from "./primitives";

// The en-dash shown in a not-held cell (U+2013); the em-dash is the banned one.
const DASH = "–";

/* ------------------------------------------------------------------ */
/* Neighbours — like-for-like strip vs PEER countries.                 */
/*                                                                     */
/* THE SET IS PEERS, NOT NEIGHBOURS, AND THE DATA IS RIGHT. The only   */
/* caller, the country page, fills these columns from PEER_GROUPS,     */
/* which picks for comparable size and market rather than for a shared */
/* border: land adjacency computed from the shared arcs of the site's  */
/* own public/geo/countries-110m.json says only 7 of its 51 groups are */
/* made entirely of bordering countries. New Zealand's columns are     */
/* Australia, the United Kingdom, Canada and Singapore, deliberately.  */
/* Every visible string here therefore says peers, and this comment is */
/* the reason nobody should "fix" the list towards geography.          */
/*                                                                     */
/* The exported names still say Neighbour because the only consumer,   */
/* src/app/[country]/page.tsx, imports them and is not this file's to  */
/* rewrite. They are identifiers, not copy; renaming them is a         */
/* two-file change for whoever owns both.                              */
/* ------------------------------------------------------------------ */

/** One country column in the peer strip. */
export type NeighbourCountry = {
  /** Stable key the metric values are keyed by. */
  key: string;
  /** The display label, e.g. "Portugal". */
  label: string;
  /** ISO-2 code; the flag is drawn by the repo CountryFlag component. */
  iso2?: string | null;
};

/** One metric row across the peer countries. */
export type NeighbourMetric = {
  /** The metric label, e.g. "Business tax". */
  label: string;
  /** The engraved glyph for the row. */
  glyph: GlyphName;
  /** Per-country display values, keyed by country key; null shows a dash. */
  values: Record<string, string | null | undefined>;
};

export type NeighboursProps = {
  /** The metric rows. */
  metrics?: NeighbourMetric[] | null;
  /** The country columns. */
  countries?: NeighbourCountry[] | null;
  /** The key of the home country (tinted for orientation, never crowned). */
  homeKey?: string | null;
  /** An optional caveat under the strip. */
  caveat?: string | null;
  /** Render the honest sample state instead of the strip. */
  sample?: boolean;
  className?: string;
};

export function Neighbours({ metrics, countries, homeKey, caveat, sample, className }: NeighboursProps) {
  if (sample || !metrics || metrics.length === 0 || !countries || countries.length === 0) {
    return (
      <SampleState
        glyph="scale"
        what="Peer comparison not held yet"
        reason="A peer set is chosen for comparable size and market, not for sharing a border, and this country does not have one yet."
        minH={120}
      />
    );
  }
  return (
    <div className={className} style={{ overflowX: "auto" }}>
      <table className="eng-neigh">
        <colgroup>
          <col />
          {countries.map((c) => (
            <col key={c.key} className={c.key === homeKey ? "home" : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="k" />
            {countries.map((c) => (
              <th key={c.key} className={c.key === homeKey ? "home" : undefined}>
                <span className="eng-neigh__col">
                  {c.iso2 ? (
                    <span className="eng-neigh__flag">
                      <CountryFlag iso2={c.iso2} className="w-full h-full" />
                    </span>
                  ) : null}
                  {c.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.label}>
              <th>
                <Glyph name={m.glyph} size={14} stroke={1.4} color="var(--cocoa-500)" />
                {m.label}
              </th>
              {countries.map((c) => (
                <td key={c.key} className={c.key === homeKey ? "home" : undefined}>
                  {m.values[c.key] != null ? m.values[c.key] : DASH}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caveat ? <p className="eng-cap">{caveat}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CitiesGrid — uniform equal-weight city cards, no ranking.           */
/* ------------------------------------------------------------------ */

/** One city card. All cards are equal weight; none is ranked above another. */
export type CityCard = {
  /** The city name, e.g. "Lisbon". */
  name: string;
  /** A short meta line, e.g. "Capital, 545K". */
  meta: string;
  /** Climate on a 0..5 dot scale. */
  climate: number;
};

export type CitiesGridProps = {
  /** The cities to show, all equal weight. */
  cities?: CityCard[] | null;
  /** Render the honest sample state instead of the grid. */
  sample?: boolean;
  className?: string;
};

export function CitiesGrid({ cities, sample, className }: CitiesGridProps) {
  if (sample || !cities || cities.length === 0) {
    return (
      <SampleState
        glyph="pin"
        what="No cities held yet"
        reason="City pages appear here as they fill in. None is ranked above the others."
        minH={100}
      />
    );
  }
  return (
    <div className={["eng-cities", className].filter(Boolean).join(" ")}>
      {cities.map((c) => {
        const t = meaningStep(c.climate / 5);
        return (
          <div className="eng-citycard" key={c.name}>
            <div className="eng-citycard__top">
              <Glyph name="pin" size={16} stroke={1.5} />
              <span className="eng-citycard__name">{c.name}</span>
            </div>
            <div className="eng-citycard__meta">{c.meta}</div>
            <div className="eng-citycard__climate">
              <span className="eng-citycard__ck">Climate</span>
              <span className="eng-dots">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="d" style={i < c.climate ? { background: t.dot } : undefined} />
                ))}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CharacterPanel — spectrum bars + a compact two-stat read.           */
/* ------------------------------------------------------------------ */

/** One spectrum: a labelled axis with end-labels and a marker position. */
export type CharacterSpectrum = {
  /** The spectrum label, e.g. "Culture". */
  label: string;
  /** The marker position, 0..1 (left end to right end). */
  value: number;
  /** The low (left) end-label, e.g. "Traditional". */
  low: string;
  /** The high (right) end-label, e.g. "Cosmopolitan". */
  high: string;
  /** Optional one-word read, e.g. "Leans traditional". */
  read?: string | null;
};

/** One compact stat in the panel's two-stat read. */
export type CharacterStat = {
  /** The stat label, e.g. "Born abroad". */
  k: string;
  /** The figure as a display string, e.g. "11". */
  v: string;
  /** Optional unit, e.g. "%". */
  u?: string | null;
};

export type CharacterPanelProps = {
  /** The spectrum bars. */
  spectra?: CharacterSpectrum[] | null;
  /** The compact two-stat read. */
  stats?: CharacterStat[] | null;
  /** Render the honest sample state instead of the panel. */
  sample?: boolean;
  className?: string;
};

export function CharacterPanel({ spectra, stats, sample, className }: CharacterPanelProps) {
  if (sample || !spectra || spectra.length === 0) {
    return (
      <SampleState
        glyph="people"
        what="Country character not held yet"
        reason="These read on measured indices, so they stay blank rather than guess."
        minH={120}
      />
    );
  }
  return (
    <div className={["eng-char", className].filter(Boolean).join(" ")}>
      <div className="eng-char__spectra">
        {spectra.map((s) => {
          const pos = Math.max(5, Math.min(95, s.value * 100));
          return (
            <div key={s.label}>
              <div className="eng-spec__head">
                <span className="eng-spec__label">{s.label}</span>
                {s.read ? <span className="eng-spec__read">{s.read}</span> : null}
              </div>
              <div className="eng-spec__track">
                <span className="eng-spec__tickline" style={{ left: "0%" }} />
                <span className="eng-spec__tickline" style={{ left: "50%" }} />
                <span className="eng-spec__tickline" style={{ left: "100%" }} />
                <span className="eng-spec__node" style={{ left: `${pos}%` }} />
              </div>
              <div className="eng-spec__ends">
                <span className="eng-spec__end">{s.low}</span>
                <span className="eng-spec__end">{s.high}</span>
              </div>
            </div>
          );
        })}
      </div>
      {stats && stats.length > 0 ? (
        <div className="eng-char__stats">
          {stats.map((st) => (
            <div className="eng-char__stat" key={st.k}>
              <div className="k">{st.k}</div>
              <div className="v">
                {st.v}
                {st.u ? <span className="u">{st.u}</span> : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VsWorld — two bars, this country vs a global median.                */
/* ------------------------------------------------------------------ */

export type VsWorldProps = {
  /** The metric name, e.g. "average salary". */
  metric?: string | null;
  /** This country's figure. */
  here?: number | null;
  /** The global-median figure to anchor against. */
  world?: number | null;
  /** Optional display formatter for the figures. @default String */
  format?: (v: number) => React.ReactNode;
  /** Label for this country's bar. @default "Here" */
  hereLabel?: string;
  /** Label for the world bar. @default "Global median" */
  worldLabel?: string;
  /** An optional caveat under the bars. */
  caveat?: string | null;
  /** Render the honest sample state instead of the bars. */
  sample?: boolean;
  className?: string;
};

export function VsWorld({
  metric,
  here,
  world,
  format = (v) => String(v),
  hereLabel = "Here",
  worldLabel = "Global median",
  caveat,
  sample,
  className,
}: VsWorldProps) {
  if (sample || here == null || world == null || world === 0) {
    return (
      <SampleState
        glyph="bank"
        what="Global comparison not held yet"
        reason="We anchor against the world median once this country's figure is confirmed."
      />
    );
  }
  const max = Math.max(here, world) * 1.08;
  const delta = Math.round(((here - world) / world) * 100);
  const above = delta >= 0;
  return (
    <div className={className}>
      <div className="eng-vs__head">
        <div className="atlas-eyebrow">vs the world &middot; {metric}</div>
        <span className={"eng-vs__delta " + (above ? "eng-vs__delta--above" : "eng-vs__delta--below")}>
          {above ? "+" : "−"}
          {Math.abs(delta)}% {above ? "above" : "below"}
        </span>
      </div>
      <div className="eng-vs__row">
        <span className="eng-vs__k eng-vs__k--here">{hereLabel}</span>
        <span className="eng-vs__track">
          <span className="eng-vs__fill eng-vs__fill--here" style={{ width: `${(here / max) * 100}%` }} />
        </span>
        <span className="eng-vs__v eng-vs__v--here">{format(here)}</span>
      </div>
      <div className="eng-vs__row">
        <span className="eng-vs__k eng-vs__k--world">{worldLabel}</span>
        <span className="eng-vs__track">
          <span className="eng-vs__fill eng-vs__fill--world" style={{ width: `${(world / max) * 100}%` }} />
        </span>
        <span className="eng-vs__v eng-vs__v--world">{format(world)}</span>
      </div>
      {caveat ? <p className="eng-cap">{caveat}</p> : null}
    </div>
  );
}
