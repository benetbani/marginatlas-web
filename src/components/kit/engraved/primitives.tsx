/**
 * kit/engraved/primitives.tsx — the engraved-almanac primitives.
 *
 * Detailed, reusable cartographic SVG linework plus the shared meaning scale
 * and the honest sample / not-held state. Ported faithfully from the design
 * export 2026-06-14-country-engraved (engraved/helpers.jsx). These are the
 * atoms every engraved country-page section composes from: a compass rosette,
 * a contour field, a surveyor's route line, a one-colour glyph set, a council
 * stamp seal, the meaning scale, and the eyebrow + sample state.
 *
 * The look: single-tone engraving on warm cream. Strokes read from the
 * engraved CSS-variable layer in globals.css (clay -> amber -> cocoa -> moss
 * meaning, ink strokes, the lone atlas accent). Color is referenced only via
 * var(--...); there is no raw hex in this file. SVG path/coordinate numbers are
 * geometry, not style tokens, so they stay inline like every other Atlas chart.
 *
 * Server-renderable: none of these primitives hold state, so the file carries
 * no "use client" directive. Tokens via the CSS vars, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";

/* ------------------------------------------------------------------ */
/* The quiet clay -> amber -> cocoa -> moss meaning scale.             */
/* ------------------------------------------------------------------ */

/** One step on the meaning scale: a foreground, a dot, and a soft surface. */
export type MeaningStep = {
  /** Foreground color (the read text), a var(--...) reference. */
  fg: string;
  /** Dot / marker color, a var(--...) reference. */
  dot: string;
  /** Soft surface tint, a var(--...) reference. */
  bg: string;
};

const MEANING: readonly MeaningStep[] = [
  { fg: "var(--clay-600)", dot: "var(--clay-500)", bg: "var(--clay-50)" },
  { fg: "var(--amber-700)", dot: "var(--amber-500)", bg: "var(--amber-50)" },
  { fg: "var(--cocoa-700)", dot: "var(--cocoa-500)", bg: "var(--cream-200)" },
  { fg: "var(--moss-600)", dot: "var(--moss-500)", bg: "var(--moss-50)" },
  { fg: "var(--moss-700)", dot: "var(--moss-600)", bg: "var(--moss-100)" },
];

/**
 * Resolve a 0..1 score to one of the five meaning steps. A score is mapped to
 * the nearest fifth and clamped; higher reads warmer-to-greener (better).
 */
export function meaningStep(s: number): MeaningStep {
  return MEANING[Math.max(0, Math.min(4, Math.round(s * 4)))];
}

/** The full five-step meaning scale, exposed for callers that want the ramp. */
export const ENGRAVED_MEANING: readonly MeaningStep[] = MEANING;

/* ------------------------------------------------------------------ */
/* Eyebrow — the small tracked uppercase label.                        */
/* ------------------------------------------------------------------ */

export type EyebrowProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

/** The small tracked uppercase label (styled by .atlas-eyebrow). */
export function Eyebrow({ children, style, className }: EyebrowProps) {
  return (
    <div className={["atlas-eyebrow", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CompassRosette — the brand glyph: 8 engraved rays, a double ring     */
/* with tick marks, a small centre. Tints via the tone / ring props.   */
/* ------------------------------------------------------------------ */

export type CompassRosetteProps = {
  /** Square size in px. @default 64 */
  size?: number;
  /** Ray color (a var(--...) reference). @default var(--accent-fill) */
  tone?: string;
  /** Ring + tick color (a var(--...) reference). @default var(--hairline-strong) */
  ring?: string;
  /** Number of ticks around the outer ring. @default 24 */
  ticks?: number;
  /** Fill the south ray (the orienting cue). @default true */
  filled?: boolean;
};

export function CompassRosette({
  size = 64,
  tone = "var(--accent-fill)",
  ring = "var(--hairline-strong)",
  ticks = 24,
  filled = true,
}: CompassRosetteProps) {
  const c = 50;
  const tickEls = Array.from({ length: ticks }).map((_, i) => {
    const a = (i / ticks) * Math.PI * 2;
    const r1 = 41;
    const r2 = i % (ticks / 4) === 0 ? 34 : 37.5;
    return (
      <line
        key={i}
        x1={c + Math.cos(a) * r1}
        y1={c + Math.sin(a) * r1}
        x2={c + Math.cos(a) * r2}
        y2={c + Math.sin(a) * r2}
        stroke={ring}
        strokeWidth={i % (ticks / 4) === 0 ? 1.1 : 0.6}
      />
    );
  });
  const ray = (ang: number, len: number, w: number) => {
    const a = (ang * Math.PI) / 180;
    const tipX = c + Math.cos(a) * len;
    const tipY = c + Math.sin(a) * len;
    const bx = c + Math.cos(a + Math.PI / 2) * w;
    const by = c + Math.sin(a + Math.PI / 2) * w;
    const bx2 = c + Math.cos(a - Math.PI / 2) * w;
    const by2 = c + Math.sin(a - Math.PI / 2) * w;
    return `M${c} ${c} L${bx} ${by} L${tipX} ${tipY} L${bx2} ${by2} Z`;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block" }}>
      <circle cx={c} cy={c} r="44" fill="none" stroke={ring} strokeWidth="1" />
      <circle cx={c} cy={c} r="31" fill="none" stroke={ring} strokeWidth="0.7" />
      {tickEls}
      {/* short intercardinal rays */}
      {[45, 135, 225, 315].map((d) => (
        <path key={d} d={ray(d, 22, 3)} fill="none" stroke={tone} strokeWidth="0.9" />
      ))}
      {/* long cardinal rays */}
      {[0, 90, 180, 270].map((d) => (
        <path
          key={d}
          d={ray(d, 30, 4.2)}
          fill={filled && d === 270 ? tone : "none"}
          stroke={tone}
          strokeWidth="1.1"
          opacity={d === 270 ? 1 : 0.85}
        />
      ))}
      <circle cx={c} cy={c} r="3.4" fill="var(--surface-card)" stroke={tone} strokeWidth="1.1" />
      <circle cx={c} cy={c} r="0.9" fill={tone} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ContourField — layered topographic hairlines, a cartographic        */
/* texture for behind a hero or a divider. Deterministic, faint.       */
/* ------------------------------------------------------------------ */

export type ContourFieldProps = {
  /** Internal viewBox width. @default 600 */
  w?: number;
  /** Height in px. @default 120 */
  h?: number;
  /** Number of contour lines. @default 7 */
  lines?: number;
  /** Stroke color (a var(--...) reference). @default var(--hairline-strong) */
  stroke?: string;
  /** Layer opacity. @default 0.5 */
  opacity?: number;
};

export function ContourField({
  w = 600,
  h = 120,
  lines = 7,
  stroke = "var(--hairline-strong)",
  opacity = 0.5,
}: ContourFieldProps) {
  const paths: React.ReactElement[] = [];
  for (let i = 0; i < lines; i++) {
    const baseY = (h / (lines + 1)) * (i + 1);
    const amp = 6 + (i % 3) * 5;
    const phase = i * 1.3;
    let d = `M0 ${baseY}`;
    const seg = 6;
    for (let s = 1; s <= seg; s++) {
      const x = (w / seg) * s;
      const y = baseY + Math.sin(s * 0.9 + phase) * amp;
      const cx = x - w / seg / 2;
      d += ` Q${cx} ${baseY + Math.sin((s - 0.5) * 0.9 + phase) * amp * 1.4} ${x} ${y}`;
    }
    paths.push(<path key={i} d={d} fill="none" stroke={stroke} strokeWidth={i % 2 ? 0.6 : 0.9} />);
  }
  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ opacity, display: "block" }}
    >
      {paths}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* RouteLine — a surveyor's traverse: a dashed line with engraved       */
/* station nodes, the last node tinted accent. Used by steppers +       */
/* the route divider. Renders as an SVG <g>, so wrap it in an <svg>.    */
/* ------------------------------------------------------------------ */

export type RouteLineProps = {
  /** Number of station nodes along the line. */
  nodes: number;
  /** Internal viewBox width the line spans. @default 600 */
  w?: number;
};

export function RouteLine({ nodes, w = 600 }: RouteLineProps) {
  const pad = 16;
  const span = w - pad * 2;
  const step = nodes > 1 ? span / (nodes - 1) : 0;
  return (
    <g>
      <line
        x1={pad}
        y1="20"
        x2={w - pad}
        y2="20"
        stroke="var(--hairline-strong)"
        strokeWidth="1"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />
      {Array.from({ length: nodes }).map((_, i) => {
        const x = pad + step * i;
        const isLast = i === nodes - 1;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy="20"
              r="9"
              fill="var(--surface-card)"
              stroke={isLast ? "var(--accent-fill)" : "var(--ink-700)"}
              strokeWidth="1.3"
            />
            <circle cx={x} cy="20" r="3.4" fill={isLast ? "var(--accent-fill)" : "var(--ink-700)"} />
          </g>
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Glyph — a small set of one-colour line icons (currentColor).        */
/* Each is a 24-box path set, regular weight.                          */
/* ------------------------------------------------------------------ */

/** The name of an engraved glyph in the GLYPHS set. */
export type GlyphName =
  | "coin"
  | "wallet"
  | "bank"
  | "clock"
  | "scale"
  | "ribbon"
  | "people"
  | "basket"
  | "pin"
  | "stamp"
  | "doc"
  | "bulb"
  | "key"
  | "hammer"
  | "leaf"
  | "flag";

const GLYPHS: Record<GlyphName, React.ReactNode> = {
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.5 9.5h3.2a1.8 1.8 0 0 1 0 3.6H9.5m0 0h3.6M11 7.5v9" />
    </>
  ),
  wallet: (
    <>
      <rect x="3.5" y="6.5" width="17" height="12" rx="2" />
      <path d="M16 12h2.5M3.5 9h13a1.5 1.5 0 0 1 0-3H6" />
    </>
  ),
  bank: (
    <>
      <path d="M4 10h16M5 10v7M9 10v7M15 10v7M19 10v7M4 19h16M12 3 4 8h16Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M6 8h12M6 8 3.5 14a3 3 0 0 0 5 0L6 8Zm12 0-2.5 6a3 3 0 0 0 5 0L18 8ZM8 20h8" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="5.2" />
      <path d="M9.4 13.5 8 21l4-2.3L16 21l-1.4-7.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7a3 3 0 0 1 0 6m1.5 2.2A5.5 5.5 0 0 1 20.5 19" />
    </>
  ),
  basket: (
    <>
      <path d="M5 9h14l-1.3 9.5a1.5 1.5 0 0 1-1.5 1.3H7.8a1.5 1.5 0 0 1-1.5-1.3L5 9Zm3.5 0L11 4m4.5 5L13 4M9 13v3m6-3v3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.3 6-10A6 6 0 0 0 6 11c0 4.7 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.3" />
    </>
  ),
  stamp: (
    <>
      <path d="M9 4.5a3 3 0 0 1 6 0c0 1.6-1.2 2.2-1.2 3.8L14 11h-4l.2-2.7C10.2 6.7 9 6.1 9 4.5ZM6 14.5h12M5 18h14v1.5H5Z" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4M9 12h6M9 15.5h6" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 16a5 5 0 1 1 6 0c-.6.5-1 1-1 2H10c0-1-.4-1.5-1-2Z" />
      <path d="M10 20h4M10.5 22h3" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="3.5" />
      <path d="M11.5 12H20l-2 2.2M16 12v2.4" />
    </>
  ),
  hammer: (
    <>
      <path d="M14 7l3-3 3 3-3 3-2-2-7.5 7.5a1.8 1.8 0 0 1-2.5-2.5L11 12.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14ZM5 19c4.5-4.5 7-7 11-9" />
    </>
  ),
  flag: (
    <>
      <path d="M6 21V4m0 1h11l-2.5 4L17 13H6" />
    </>
  ),
};

export type GlyphProps = {
  /** Which glyph to draw; an unknown name falls back to "doc". */
  name: GlyphName;
  /** Square size in px. @default 18 */
  size?: number;
  /** Stroke width. @default 1.5 */
  stroke?: number;
  /** Stroke color (a var(--...) reference or "currentColor"). @default currentColor */
  color?: string;
};

export function Glyph({ name, size = 18, stroke = 1.5, color = "currentColor" }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {GLYPHS[name] ?? GLYPHS.doc}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* StampSeal — a detailed engraved circular council stamp.             */
/* ------------------------------------------------------------------ */

export type StampSealProps = {
  /** Square size in px. @default 56 */
  size?: number;
  /** The headline word inside the seal. @default "FILED" */
  label?: string;
  /** Seal color (a var(--...) reference). @default var(--accent-fill) */
  tone?: string;
};

export function StampSeal({ size = 56, label = "FILED", tone = "var(--accent-fill)" }: StampSealProps) {
  const c = 50;
  const R = 38;
  const teeth = 40;
  const ring = Array.from({ length: teeth }).map((_, i) => {
    const a = (i / teeth) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={c + Math.cos(a) * R}
        y1={c + Math.sin(a) * R}
        x2={c + Math.cos(a) * (R + 4)}
        y2={c + Math.sin(a) * (R + 4)}
        stroke={tone}
        strokeWidth="1.2"
      />
    );
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ display: "block", opacity: 0.92 }}
    >
      {ring}
      <circle cx={c} cy={c} r={R} fill="none" stroke={tone} strokeWidth="2.2" />
      <circle cx={c} cy={c} r={R - 6} fill="none" stroke={tone} strokeWidth="0.8" />
      <text x={c} y={c - 8} textAnchor="middle" fill={tone} style={{ font: "700 13px var(--font-body)", letterSpacing: "1px" }}>
        {label}
      </text>
      <path
        d={`M${c - 14} ${c + 2} l8 8 l16 -17`}
        fill="none"
        stroke={tone}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x={c} y={c + 26} textAnchor="middle" fill={tone} style={{ font: "500 7px var(--font-body)", letterSpacing: "1.5px" }}>
        ATLAS REGISTRY
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SampleState — the honest not-held treatment.                        */
/* ------------------------------------------------------------------ */

export type SampleStateProps = {
  /** What would sit here, e.g. "Country metrics not held yet". */
  what: string;
  /** Optional one-line reason it is not held yet. */
  reason?: string | null;
  /** The glyph in the mark. @default "doc" */
  glyph?: GlyphName;
  /** Optional minimum height in px (keeps the asset's footprint). @default 0 */
  minH?: number;
};

export function SampleState({ what, reason, glyph = "doc", minH = 0 }: SampleStateProps) {
  return (
    <div className="eng-sample" style={minH ? { minHeight: minH } : undefined}>
      <span className="eng-sample__mark" aria-hidden="true">
        <Glyph name={glyph} size={20} stroke={1.3} />
      </span>
      <div>
        <div className="eng-sample__what">{what}</div>
        {reason ? <div className="eng-sample__why">{reason}</div> : null}
      </div>
      <span className="eng-sample__tag">sample</span>
    </div>
  );
}
