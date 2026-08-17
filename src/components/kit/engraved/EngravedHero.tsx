/**
 * kit/engraved/EngravedHero.tsx — the engraved country hero band.
 *
 * A faded single-tone engraved skyline (drawn with lit windows and a contour
 * ground) dissolving into cream, with a per-continent compass cue, a crisp flag
 * chip and the country name in the display serif sitting on the calm edge.
 * Ported from the design export 2026-06-14-country-engraved
 * (engraved/hero-scorecard.jsx: engravedSkyline + SkylineSVG + CountryHero).
 *
 * The skyline is procedural and deterministic per profile, so the same country
 * always draws the same engraving. The flag uses the repo's CountryFlag
 * component (by ISO-2), not the asset's hardcoded flag map. Props are nullable;
 * a `sample` path renders the honest SampleState until art is approved.
 *
 * This is the engraved frame: warmth lives in the linework + the cream fade, and
 * the data (the name + caption) stays clean on the calm edge. Server-renderable,
 * no client JS. Color via the engraved CSS vars only, no raw hex. SVG geometry
 * numbers are inline. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { CountryFlag } from "@/components/CountryFlag";
import { CompassRosette, SampleState } from "./primitives";

/** The architectural character of the procedural skyline. */
export type SkylineProfile = "spires" | "domes" | "towers" | "pagoda" | "default";

type Building = {
  x: number;
  w: number;
  y: number;
  h: number;
  cap: "flat" | "spire" | "dome" | "pagoda";
  seed: number;
};

/**
 * Procedural single-tone skyline. Returns the building set + the ground line.
 * Deterministic (a hashed sine of the seed), so a profile renders identically
 * every time; `profile` sets the architectural character (cap shapes + heights).
 */
function engravedSkyline(profile: SkylineProfile, W: number, H: number): {
  buildings: Building[];
  ground: number;
} {
  const ground = H - 10;
  const rnd = (s: number) => {
    const x = Math.sin(s * 12.9898) * 43758.5;
    return x - Math.floor(x);
  };
  const buildings: Building[] = [];
  let x = -6;
  let i = 0;
  while (x < W + 6) {
    const r = rnd(i + profile.length * 7);
    const w = 26 + r * 34;
    let bh: number;
    let cap: Building["cap"] = "flat";
    if (profile === "spires") {
      bh = 50 + r * 120;
      cap = r > 0.6 ? "spire" : "flat";
    } else if (profile === "domes") {
      bh = 46 + r * 80;
      cap = i % 4 === 0 ? "dome" : "flat";
    } else if (profile === "towers") {
      bh = 80 + r * 150;
      cap = "flat";
    } else if (profile === "pagoda") {
      bh = 44 + r * 70;
      cap = i % 3 === 0 ? "pagoda" : "flat";
    } else {
      bh = 50 + r * 110;
      cap = r > 0.7 ? "spire" : "flat";
    }
    buildings.push({ x, w, y: ground - bh, h: bh, cap, seed: i });
    x += w + 2 + r * 8;
    i++;
  }
  return { buildings, ground };
}

type SkylineSVGProps = {
  profile: SkylineProfile;
  W?: number;
  H?: number;
  tone?: string;
};

function SkylineSVG({ profile, W = 900, H = 260, tone = "var(--ink-800)" }: SkylineSVGProps) {
  const { buildings, ground } = engravedSkyline(profile, W, H);
  return (
    <svg
      className="eng-hero__sky"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {/* faint contour sky lines */}
      {[0.3, 0.5, 0.7].map((f, k) => (
        <path
          key={k}
          d={`M0 ${H * f} Q${W * 0.3} ${H * f - 14} ${W * 0.6} ${H * f} T${W} ${H * f}`}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="0.8"
        />
      ))}
      {buildings.map((b, k) => {
        const cols = Math.max(2, Math.round(b.w / 11));
        const rows = Math.max(3, Math.round(b.h / 16));
        const winW = (b.w / (cols + 1)) * 0.6;
        const wins: React.ReactElement[] = [];
        for (let cc = 1; cc <= cols; cc++) {
          for (let rr = 1; rr <= rows; rr++) {
            const wx = b.x + (b.w / (cols + 1)) * cc - winW / 2;
            const wy = b.y + 11 + ((b.h - 16) / rows) * (rr - 0.5);
            if (wy > ground - 6) continue;
            const lit = (b.seed * 7 + cc * 3 + rr) % 5 === 0;
            /* The lit-window fill below was --amber-400, a warm gold: the
               literal colour of a lamp, and a banned hue. Terracotta is the
               site's one loud colour and is what this mark should have been
               reaching for, an on-brand accent in an ink drawing rather than a
               naturalistic glow. It carries no data, so nothing is traded
               away, and it was invisible to the palette gate because a
               var(--...) reference is not a hex, an rgb() or a class name. */
            wins.push(
              <rect
                key={`${cc}-${rr}`}
                x={wx}
                y={wy}
                width={winW}
                height={winW * 1.5}
                fill={lit ? "var(--accent-fill)" : "none"}
                stroke={tone}
                strokeWidth="0.5"
                opacity={lit ? 0.55 : 0.7}
              />,
            );
          }
        }
        let capEl: React.ReactElement | null = null;
        const cx = b.x + b.w / 2;
        if (b.cap === "spire") {
          capEl = (
            <path
              d={`M${cx} ${b.y - 26} L${cx - 3} ${b.y} L${cx + 3} ${b.y} Z`}
              fill="none"
              stroke={tone}
              strokeWidth="1"
            />
          );
        } else if (b.cap === "dome") {
          capEl = (
            <path
              d={`M${b.x + 3} ${b.y} Q${cx} ${b.y - b.w * 0.5} ${b.x + b.w - 3} ${b.y}`}
              fill="none"
              stroke={tone}
              strokeWidth="1.1"
            />
          );
        } else if (b.cap === "pagoda") {
          capEl = (
            <path
              d={`M${b.x - 3} ${b.y} L${cx} ${b.y - 14} L${b.x + b.w + 3} ${b.y} M${b.x + 4} ${b.y - 9} L${cx} ${b.y - 20} L${b.x + b.w - 4} ${b.y - 9}`}
              fill="none"
              stroke={tone}
              strokeWidth="1"
            />
          );
        }
        return (
          <g key={k}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="var(--surface-card)" stroke={tone} strokeWidth="1.1" />
            {capEl}
            {wins}
          </g>
        );
      })}
      {/* engraved ground hatching */}
      <line x1="0" y1={ground} x2={W} y2={ground} stroke={tone} strokeWidth="1.4" />
      {Array.from({ length: 40 }).map((_, k) => (
        <line
          key={k}
          x1={k * (W / 40)}
          y1={ground + 2}
          x2={k * (W / 40) - 7}
          y2={H}
          stroke={tone}
          strokeWidth="0.5"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}

export type EngravedHeroProps = {
  /** The country name, in the display serif. */
  country?: string | null;
  /** ISO-2 code; the flag is drawn by the repo CountryFlag component. */
  iso2?: string | null;
  /** The continent cue beside the compass, e.g. "Southern Europe". */
  continent?: string | null;
  /** Architectural character of the skyline. @default "default" */
  profile?: SkylineProfile;
  /** A short caption under the name, e.g. "10.3M people, 38 cities held". */
  caption?: string | null;
  /** Band height in px. @default 260 */
  height?: number;
  /** Render the honest sample state instead of a drawn hero. */
  sample?: boolean;
  className?: string;
};

export function EngravedHero({
  country,
  iso2,
  continent,
  profile = "default",
  caption,
  height = 260,
  sample,
  className,
}: EngravedHeroProps) {
  const cls = ["eng-hero", className].filter(Boolean).join(" ");
  if (sample) {
    return (
      <div className={cls}>
        <div style={{ padding: 20 }}>
          <SampleState
            glyph="flag"
            what={`Engraved skyline for ${country || "this country"}`}
            reason="A single-tone landmark engraving is drawn per country and dissolved into cream. Sample shown until the art is approved."
            minH={150}
          />
        </div>
      </div>
    );
  }
  return (
    <div className={cls} style={{ height }}>
      <div className="eng-hero__art">
        <SkylineSVG profile={profile} H={height} />
        <div className="eng-hero__fade" />
      </div>
      {continent ? (
        <div className="eng-hero__continent">
          <CompassRosette size={18} tone="var(--text-muted)" ring="var(--hairline-strong)" />
          {continent}
        </div>
      ) : null}
      <div className="eng-hero__body">
        <div className="eng-flagchip">
          {iso2 ? (
            <span className="eng-flagchip__flag">
              <CountryFlag iso2={iso2} className="w-full h-full" />
            </span>
          ) : null}
          <div>
            {/* typography-ok: the engraved hero name is the country-page H1, sized
               by the eng-hero__name rule in the engraved CSS layer (Fraunces
               display cut), the bespoke hero treatment, not a body heading. */}
            <h1 className="eng-hero__name">{country}</h1>
            {caption ? <div className="eng-hero__cap">{caption}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
