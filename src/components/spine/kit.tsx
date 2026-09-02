/**
 * Spine kit , the shared visual primitives for the Margin Atlas page-type
 * rebuild (country / city / neighborhood / cell / industry). Composed, never
 * improvised. Geist text + Space Grotesk figures (.fig); soft terracotta fills only.
 * Raw hex + local CSS vars here for dev speed; tokenize to design-tokens.ts on
 * promotion. Pairs with SpineShell (shell.tsx): fonts + atmosphere + the CSS vars.
 *
 * LOYALTY DECISIONS (Final Ascent P2 central kit pass, 2026-07-03):
 *  - Disclosures (InlineDisclosure / Expand) DELIBERATELY stay native
 *    <details>/<summary>: they must work server-rendered and stay honest with
 *    JS off. This is the ratified exception to shadcn adoption, not a gap.
 *  - Chips: src/components/ui/pill.tsx is the one chip source. Chip here (and
 *    LockPill in kit-index.tsx) are thin spine-palette wrappers over Pill;
 *    exported names + signatures unchanged so call sites never fork.
 *  - Elevation: SUPERSEDED 2026-07-09 (rulebook v2 S14/decision e , see the Box doc
 *    comment below). Box no longer applies a DROP shadow at all (drop-shadow cards
 *    "look mediocre"); it keeps only a single local inset paper top-highlight. The
 *    tokenized elevation scale (Tailwind shadow-card / shadow-lift) still exists in
 *    design-tokens.ts for other consumers , Box just stops reading from it.
 *  - Tooltips: kit atoms are consumed by SERVER components, so no Radix
 *    ui/tooltip here. Law: no kit atom may hide sole-source data behind a
 *    native title= attribute; StackBar keeps its per-segment title= only when
 *    it renders WITHOUT its legend (the legend is the visible carrier).
 */
import * as React from "react";
import { AtlasIcon, type AtlasIconId } from "@/components/brand/icons";
import { Pill } from "@/components/ui/pill";
import { AtlasMark } from "./marks";

export const TERRA = "#fb8469"; // atlas-300 soft terracotta , the only fill color
export const TRACK = "#e6e6e6";
/* THE canonical money grammar, page-set-wide (Final Ascent P4): $680 / $43K / $1.4M ,
 * round K, one decimal above a million. Route hand-rolled money formatting here. */
export const usd = (v: number) => (v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : "$" + (v >= 1000 ? Math.round(v / 1000) + "K" : Math.round(v)));
export const usdMo = (vYr: number) => "$" + (vYr / 12 / 1000).toFixed(1) + "K";
export const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

export function Ico({ id, tone = "ink" }: { id: AtlasIconId; tone?: "ink" | "terra" }) {
  const terra = tone === "terra";
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border" style={{ background: terra ? "var(--terra-soft)" : "var(--c-soft)", borderColor: terra ? "var(--terra-border)" : "var(--c-border)" }}>
      {/* 18px at stroke 2.4 (was 16 at 1.9): founder 2026-08-30, "the icons
          should be bolder because right now they are very small." */}
      <AtlasIcon id={id} size={18} strokeWidth={2.4} className="spine-ic" style={{ color: terra ? "var(--terra-text)" : "var(--c-ink2)" }} />
    </span>
  );
}
export function Fig({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`fig ${className}`}>{children}</span>;
}
export function Gauge({ value, sub, endLabels, w = 150 }: { value: number; sub?: string; endLabels?: [string, string]; w?: number }) {
  if (value == null || !Number.isFinite(value)) return null;
  const v = Math.max(0, Math.min(100, value));
  const th = Math.PI * (1 - v / 100), R = 74, cx = 100, cy = 86;
  const ex = (cx + R * Math.cos(th)).toFixed(1), ey = (cy - R * Math.sin(th)).toFixed(1);
  const nx = (cx + (R - 14) * Math.cos(th)).toFixed(1), ny = (cy - (R - 14) * Math.sin(th)).toFixed(1);
  return (
    <div data-idea="I7" className="text-center">
      <svg viewBox="0 0 200 126" style={{ width: w }} className="mx-auto" role="img" aria-label={`${v} out of 100${sub ? ", " + sub : ""}`}>
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke={TRACK} strokeWidth={11} strokeLinecap="round" />
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${ex} ${ey}`} fill="none" stroke={TERRA} strokeWidth={11} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={4} fill="#1a1a1a" />
        {endLabels ? (<>
          <text x={20} y={101} textAnchor="start" fill="#8c8c8a" fontSize={8.5} style={{ textTransform: "uppercase", letterSpacing: ".04em" }}>{endLabels[0]}</text>
          <text x={180} y={101} textAnchor="end" fill="#8c8c8a" fontSize={8.5} style={{ textTransform: "uppercase", letterSpacing: ".04em" }}>{endLabels[1]}</text>
        </>) : null}
        <text x={cx} y={118} textAnchor="middle" fill="#1a1a1a" fontSize={24} style={{ fontFamily: "var(--font-grotesk)", fontWeight: 600 }}>{v}</text>
      </svg>
      {sub ? <div className="-mt-1 text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]">{sub}</div> : null}
    </div>
  );
}
/* the shared warm line-grey CSS var (shell.tsx, not a new hex literal) , distinct from
 * every color a caller passes for a real slice (TERRA, the GREY_RAMP family, arbitrary
 * segment colors) so the rolled-up "Other" slice never visually merges with a real one. */
const DONUT_OTHER_COLOR = "var(--c-line-strong)";
export function Donut({ segs, centerBig, centerSub }: { segs: Array<[string, number, string]>; centerBig: string; centerSub: string }) {
  if (!segs || segs.length === 0) return null;
  // Cap at 5 slices: a sparse country with many tiny consumer-segment shares must never
  // render as a wall of slivers or fall back to reading by color alone. Slices 5+ roll into
  // one "Other" wedge with a guaranteed-distinct color.
  const rendered: Array<[string, number, string]> = segs.length <= 5 ? segs : [
    ...segs.slice(0, 4),
    ["Other", Math.max(0, segs.slice(4).reduce((sum, s) => sum + (s[1] || 0), 0)), DONUT_OTHER_COLOR],
  ];
  const r = 54, C = 2 * Math.PI * r; let off = 0;
  return (
    <svg data-idea="I3" viewBox="0 0 160 160" className="w-[150px]" role="img" aria-label={`${centerBig} ${centerSub}`}>
      {rendered.map(([name, pct, color]) => {
        const len = (pct / 100) * C; const el = <circle key={name} cx={80} cy={80} r={r} fill="none" stroke={color} strokeWidth={24} strokeDasharray={`${len.toFixed(2)} ${(C - len).toFixed(2)}`} strokeDashoffset={(-off).toFixed(2)} transform="rotate(-90 80 80)" />; off += len; return el;
      })}
      <text x={80} y={76} textAnchor="middle" fill="#1a1a1a" fontSize={30} style={{ fontFamily: "var(--font-grotesk)", fontWeight: 600 }}>{centerBig}</text>
      <text x={80} y={95} textAnchor="middle" fill="#8c8c8a" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{centerSub}</text>
    </svg>
  );
}
/* score dots 0..max. Neutral ink fill by default; terracotta only when `accent`
 * marks THE one focal read (one accent per box). A row of maxed dots must not be
 * a wall of orange. The empty dots ARE the visible 0..max track (the honest scale);
 * `showTrack` (default true) keeps them , pass false only where an adjacent row
 * already draws the same scale and the repetition reads as noise. */
export function Dots({ score, max = 10, accent = false, showTrack = true }: { score: number; max?: number; accent?: boolean; showTrack?: boolean }) {
  return <div data-idea="I5" className="flex gap-[3px]" role="img" aria-label={`${score} out of ${max}`}>{Array.from({ length: max }).map((_, i) => <span key={i} className="h-[7px] w-[7px] rounded-full" style={{ background: i < score ? (accent ? TERRA : "#1a1a1a") : showTrack ? TRACK : "transparent" }} />)}</div>;
}
/* single 0-100 bar. Neutral grey by default; terracotta only when `accent` marks
 * the one focal figure in the box. */
export function MiniBar({ pct, accent = false }: { pct: number; accent?: boolean }) {
  return <div data-idea="I2" className="h-[7px] w-full overflow-hidden rounded-full" role="img" aria-label={`${Math.round(pct)} percent`} style={{ background: TRACK }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent ? TERRA : "#bdbdbd" }} /></div>;
}
/* IndexBar , the shared bar for a value that is either a TRUE PERCENTAGE (0-100,
 * "%" suffix, a plain rounded-full track, no tick) or an INDEX against a top-group
 * baseline (a bare number, no "%", a reference TICK drawn at 100, a squared-off
 * track). The two `kind`s deliberately do NOT share one visual language: a
 * 100/64/72/58 catchment index must never read like a 47/31/22 true-percentage
 * split , they are different number kinds. Replaces a bespoke hand-rolled inline
 * bar (the cell page's "where the covers come from" row) with one shared,
 * self-omitting primitive that renders the bar AND its trailing figure together;
 * the row label stays the caller's own text. Honest scaling: an index value ABOVE
 * 100 EXTENDS the domain to meet it (PhaseBar's pattern) rather than clipping the
 * bar at the edge and understating an above-baseline value. Self-omits on a
 * null/non-finite value. */
export function IndexBar({ value, kind = "pct", accent = false }: { value: number | null | undefined; kind?: "pct" | "index"; accent?: boolean }) {
  if (value == null || !Number.isFinite(value)) return null;
  const isIndex = kind === "index";
  const domainMax = isIndex ? Math.max(100, value) : 100;
  const pos = (v: number) => Math.max(0, Math.min(100, (v / domainMax) * 100));
  const shape = isIndex ? "rounded-sm" : "rounded-full";
  return (
    <span data-idea="I1" className="flex items-center gap-2.5">
      <span className={`relative block h-2 flex-1 overflow-hidden ${shape}`} role="img" aria-label={isIndex ? `index ${Math.round(value)}, top group is 100` : `${Math.round(value)} percent`} style={{ background: TRACK }}>
        <span className={`absolute inset-y-0 left-0 block ${shape}`} style={{ width: `${pos(value)}%`, background: accent ? TERRA : "var(--c-line-strong)" }} />
        {isIndex ? <span className="absolute -top-[2px] -bottom-[2px] w-px" style={{ left: `${pos(100)}%`, background: "var(--c-ink2)" }} /> : null}
      </span>
      <Fig className="shrink-0 text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{isIndex ? Math.round(value) : `${value}%`}</Fig>
    </span>
  );
}
/* 100%-stacked share bar , one horizontal track split into labelled colour segments
 * (terracotta on the kept/owner/leading slice), with an optional swatch legend row.
 * Canonicalises the hand-rolled cost-stack / tax-share / payment-mix bars. Knobs cover
 * the per-instance variations exactly: height/rounding via `h`+`rounded`, the inter-
 * segment white hairline via `segBorder`, raw-pct vs sum-normalised widths via `normalize`,
 * and the legend on/off + its gap via `legend`+`legendClassName`. With no legend it renders
 * the track alone (so a caller can place its own legend, e.g. inside a disclosure).
 *
 * HONESTY CONTRACT (Final Ascent, Visual Dictionary idiom #2): by default the
 * segments render size-ordered descending, with the kept/owner slice pinned LAST.
 * The kept slice is detected via seg.kept, a label match on `keptLabel`, or the
 * TERRA fill. When every non-kept segment is a plain grey, their greys are remapped
 * onto GREY_RAMP so darkness tracks magnitude (largest = darkest); semantic colors
 * pass through untouched. Callers needing the literal seed order pass sort={false}.
 * The per-segment native title= renders only when the legend does NOT (the legend
 * is the visible carrier of the same data). */
export type StackSeg = { label: string; pct: number; color: string; kept?: boolean };
/* magnitude grey ramp for sorted StackBars , index 0 (darkest) goes to the largest segment */
export const GREY_RAMP = ["#a3a3a1", "#b4b4b2", "#c4c4c2", "#d3d3d1", "#e0e0de", "#ebebe9"];
const isGreyHex = (c: string) => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((c || "").trim());
  if (!m) return false;
  const hex = m[1].length === 3 ? m[1].split("").map((ch) => ch + ch).join("") : m[1];
  const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  return Math.max(r, g, b) - Math.min(r, g, b) <= 10;
};
export function StackBar({ segments, sort = true, keptLabel, h = "h-8", rounded = "rounded-lg", segBorder = false, normalize = false, ariaLabel, className = "", legend = false, legendClassName = "mt-2 flex flex-wrap gap-x-4 gap-y-1" }: { segments: StackSeg[]; sort?: boolean; keptLabel?: string; h?: string; rounded?: string; segBorder?: boolean; normalize?: boolean; ariaLabel: string; className?: string; legend?: boolean; legendClassName?: string }) {
  const isKept = (s: StackSeg) => s.kept === true || (keptLabel != null && s.label === keptLabel) || (s.color || "").toLowerCase() === TERRA;
  let ordered = segments;
  if (sort) {
    let rest = segments.filter((s) => !isKept(s)).sort((a, b) => b.pct - a.pct);
    const kept = segments.filter(isKept);
    if (rest.length >= 2 && rest.every((s) => isGreyHex(s.color))) {
      rest = rest.map((s, i) => ({ ...s, color: GREY_RAMP[Math.round((i * (GREY_RAMP.length - 1)) / Math.max(1, rest.length - 1))] }));
    }
    ordered = [...rest, ...kept];
  }
  const sum = normalize ? (ordered.reduce((a, s) => a + s.pct, 0) || 1) : 1;
  const segCls = segBorder ? "h-full border-r border-white/70 last:border-0" : "h-full";

  /* ON-BAR LABELS, WHICH THIS FORM WAS SUPPOSED TO HAVE ALL ALONG. The written
     convention is a percentage on every segment at or above 12%, and the
     across-places page draws exactly that. This shared bar drew none, so the
     trade page's identical chart put all five of its figures in the legend and
     none on the bar: the same idea, on two pages, in two treatments, which is the
     site failing to read as one system. Found by looking at the two crops beside
     each other at 3x.

     SELF-LIMITING BY HEIGHT rather than by a flag somebody has to remember. One
     of the five callers is an eight-pixel progress sliver where a label would be
     absurd, so the labels appear only on a bar tall enough to hold one. A prop
     defaulting to off would have left the convention unenforced by default, which
     is how it came to be unenforced in the first place.

     The kept slice is labelled below the threshold too, because it is the answer
     the whole bar exists to deliver and the sibling page labels it at 7%. */
  const hNum = Number((h.match(/h-(\d+)/) || [])[1] || 0);
  const onBar = hNum >= 7;
  const share = (s: StackSeg) => (normalize ? (s.pct / sum) * 100 : s.pct);
  /* White on a dark segment, ink on a light one, from the segment's own colour. */
  const lightOn = (hex: string) => {
    const m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
    if (!m) return true;
    const n = parseInt(m[1], 16);
    const lin = (v: number) => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
    return L < 0.45;
  };
  return (
    <>
      <div data-idea="I3" className={`flex ${h} overflow-hidden ${rounded} border border-[var(--c-border)]${className ? " " + className : ""}`} role="img" aria-label={ariaLabel}>
        {ordered.map((s) => {
          const pctOfBar = share(s);
          const show = onBar && (pctOfBar >= 12 || (isKept(s) && pctOfBar >= 4));
          return (
            <div
              key={s.label}
              className={`${segCls} flex items-center justify-center overflow-hidden`}
              style={{ width: `${pctOfBar}%`, background: s.color }}
              title={legend ? undefined : `${s.label} ${s.pct}%`}
            >
              {show ? (
                <span
                  aria-hidden
                  className="fig whitespace-nowrap text-[length:var(--t-mark)] font-semibold leading-none"
                  style={{ color: lightOn(s.color) ? "#fff" : "var(--c-ink)" }}
                >
                  {s.pct}%
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      {/* THE LEGEND STOPS REPEATING THE BAR. Once the segments carry their own
          percentages, a legend that also carries them prints every figure twice:
          five on the bar and five underneath, on both pages that use this form. A
          legend's job is to say which name goes with which colour. It keeps the
          figures only when the bar is too short to hold them, which is the case
          it was written for. */}
      {/* THE LEGEND CARRIES WHAT THE BAR CANNOT, and nothing else. Once segments
          label themselves, a legend repeating those figures prints every value
          twice. But dropping the figures outright cost the 3% segment its value
          entirely: too narrow for an on-bar label, and now unlabelled in the
          legend too, so a reader could not find it anywhere. The figure appears
          exactly where the bar failed to show it. */}
      {legend ? (
        <div className={legendClassName}>{ordered.map((s) => {
          const labelled = onBar && (share(s) >= 12 || (isKept(s) && share(s) >= 4));
          return (
            <span key={s.label} className="inline-flex items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label}
              {labelled ? null : <> <Fig className="text-[var(--c-ink)]">{s.pct}%</Fig></>}
            </span>
          );
        })}</div>
      ) : null}
    </>
  );
}
/* ShareStack , a LONE percentage rendered as a compact 2-3 segment stacked bar
 * (replaces a bare "online 34%" figure sitting next to prose , rulebook v2 S7: a
 * chart must explain itself by its form, so a single percentage that deserves a
 * shape gets one). The LARGEST segment carries the terracotta fill (the leading
 * share); the rest render in two fixed neutral greys, darker to lighter as the
 * share shrinks. Labels + percentages are DIRECT-labelled inside each segment when
 * every segment is wide enough to hold them (>=24% each, a conservative width
 * floor so text never truncates on a narrow card); when any segment is narrower
 * than that the bar renders as color blocks alone and a one-line legend
 * underneath carries every label + percent instead (never a hover-only title as
 * the sole carrier of the data). Segment widths are proportionally normalised to
 * the true 100% so a pair that sums to 98 or 101 (real-world rounding) still fills
 * the bar edge to edge; the PRINTED percentages stay the caller's real numbers.
 * Self-omits: fewer than 2 segments, or the segments do not sum to within ~2 of
 * 100 , a stacked bar that does not sum to the whole misrepresents the split, so
 * it renders nothing rather than a dishonest shape. */
export type ShareSeg = { label: string; pct: number };
export function ShareStack({ segments }: { segments: ShareSeg[] }) {
  const clean = (segments ?? []).filter((s) => s && typeof s.pct === "number" && Number.isFinite(s.pct));
  if (clean.length < 2) return null;
  const sum = clean.reduce((a, s) => a + s.pct, 0);
  if (!Number.isFinite(sum) || Math.abs(sum - 100) > 2) return null;
  const ordered = [...clean].sort((a, b) => b.pct - a.pct);
  const greys = ["var(--c-line-strong)", "var(--c-soft2)"];
  const colored = ordered.map((s, i) => ({ ...s, color: i === 0 ? TERRA : greys[(i - 1) % greys.length] }));
  const inline = colored.every((s) => s.pct >= 24);
  const ariaLabel = colored.map((s) => `${s.label} ${s.pct}%`).join(", ");
  return (
    <div data-idea="I3">
      <div className="flex h-8 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={ariaLabel}>
        {colored.map((s) => (
          <div key={s.label} className="flex h-full items-center justify-center overflow-hidden border-r border-white/70 px-1.5 last:border-0" style={{ width: `${(s.pct / sum) * 100}%`, background: s.color }}>
            {inline ? <span className="truncate text-[length:var(--t-micro)] font-semibold text-[var(--c-ink)]">{s.label} <Fig>{s.pct}%</Fig></span> : null}
          </div>
        ))}
      </div>
      {!inline ? (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {colored.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label} <Fig className="text-[var(--c-ink)]">{s.pct}%</Fig>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
/* margin waterfall , each row a share of revenue, the kept slice terracotta. Cap 2 uses/page. */
export function Waterfall({ rows }: { rows: Array<[string, number, boolean?]> }) {
  return (
    <div data-idea="I2" className="space-y-2.5">{rows.map(([label, pct, kept]) => (
      <div key={label} className="grid grid-cols-[120px_1fr_44px] items-center gap-3">
        <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{label}</span>
        <div className="h-5 overflow-hidden rounded" style={{ background: "#f0f0f0" }}><div className="h-full rounded" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: kept ? TERRA : "#bdbdbd" }} role="img" aria-label={`${label} ${pct}%`} /></div>
        <Fig className="text-right text-[length:var(--t-body)] text-[var(--c-ink)]">{pct}%</Fig>
      </div>))}
    </div>
  );
}
/* percentile spread strip , p10..p90 with the typical (p50) marked. Cap 2 uses/page.
 * `neutral` renders the marker + track in ink/grey , for when the strip is SUPPORT beside
 * a box's one terracotta answer (the accent budget stays with the answer). */
export function SpreadStrip({ p10, p50, p90, fmt, basis = "modelled" }: { p10: number; p50: number; p90: number; fmt: (n: number) => string; basis?: "measured" | "modelled" }) {
  /* THE BAND SAYS WHERE ITS SHAPE CAME FROM. The ratified ruling on invented
     bands is explicit: an unmarked band is a claim about spread that the figures
     behind it do not support. One of the two paths that feeds this strip builds
     the band by multiplying the typical figure by fixed constants, so it draws
     the SAME SHAPE for a restaurant, a barbershop and a dental practice. That
     mark existed in the data and was being thrown away one layer above here.
     The strip prints no percentile words, so nothing a reader SEES changes. What
     changes is the description read aloud, which now says "modelled" when the
     shape is modelled, in the same words the other band component already uses.
     THE DEFAULT IS MODELLED, so a caller that forgets to pass it understates its
     own confidence rather than overstating it.
     THE ACCENT GRADIENT IS GONE. This strip had a second mode that ran the track
     from grey into a pale terracotta. It has exactly one caller and that caller
     always asked for the plain one, so the accent branch drew on no page at all,
     and it broke the same colour rule the risk scale broke. */
  const span = Math.max(1, p90 - p10);
  const mid = Math.max(2, Math.min(98, ((p50 - p10) / span) * 100));
  const aria =
    basis === "modelled"
      ? `Modelled range from ${fmt(p10)} to ${fmt(p90)}, typical ${fmt(p50)}.`
      : `Spread from ${fmt(p10)} at the bottom tenth to ${fmt(p90)} at the top tenth, typical ${fmt(p50)}.`;
  return (
    <div data-idea="I1">
      <div className="relative h-2 rounded-full" role="img" aria-label={aria} style={{ background: TRACK }}>
        <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${mid}%`, background: "var(--c-ink)", boxShadow: "0 0 0 1px var(--c-border)" }} />
      </div>
      {/* THE THREE FIGURES WRAP RATHER THAN COLLIDE. Pushed to the two ends with
          the typical in the middle, they had nothing stopping them meeting on a
          narrow masthead. */}
      <div className="mt-1 flex flex-wrap justify-between gap-x-3 text-[length:var(--t-micro)] text-[var(--c-muted)]"><span>{fmt(p10)}</span><span className="font-semibold text-[var(--c-ink)]">{fmt(p50)} typical</span><span>{fmt(p90)}</span></div>
    </div>
  );
}
/* Movement , chapter opener. Rulebook v2 corrections (2026-07-10, reverses S2 decision b):
 * the header is the muted .fig chapter INDEX plus ONE plain heading ONLY , no eyebrow. On
 * the built pages the eyebrow was always a vaguer restatement of its heading ("Trades and
 * character" sitting over "The trades and the character"), a second label carrying no
 * information, so it is deleted from render here. `eyebrow` is now OPTIONAL in the prop
 * type and stays as a tolerated no-op (accepted, never rendered) so the ~140 existing call
 * sites keep compiling without a page-by-page edit; do not delete it from the type. `icon`
 * remains a no-op HERE: rulebook v1 §R2 (2026-07-11) restores icons at SUBSECTION level
 * (Head/Rail) only; the chapter header stays index + one plain title.
 * The accent NEVER sits on the heading text (the founder reads terra-on-top as "orange on
 * top") , the leading .fig index (muted grey) is the only accent carrier. The heading stays
 * de-bolded (semibold 20/24px, not bold 24/30px , too loud to read as professional). */
export function Movement({ eyebrow, heading, sample, icon, index }: { eyebrow?: string; heading: string; sample?: boolean; icon?: AtlasIconId; index?: string }) {
  /* TWO PROPS ARE ACCEPTED AND DELIBERATELY NOT DRAWN, and saying so is the point
     of these two lines. Counted across the four page bodies that use this: 15 of
     the 23 chapter dividers pass an eyebrow and 22 pass an icon, and not one of
     them reaches a reader. Anyone reading a call site would reasonably think both
     do something.
     THE EYEBROW IS BANNED, by a ratified rule with a gate of its own that hunts
     for a small upper-case label sitting above a title. Voiding it here is that
     rule, enforced at the one place every chapter passes through.
     THE ICON IS A LEVEL DOWN. The subsection-icon rule covers the section openers,
     Head and Rail, and its gate scans exactly those two tags. Chapter dividers are
     outside it by design.
     Both props stay in the signature rather than being stripped from 37 call
     sites: the words and the icon names are authored choices, and deleting a
     design decision because the current rules do not render it is not this loop's
     call to make. Written down for the founder instead. */
  void eyebrow;
  void icon;
  return (
    <div className="mb-3 mt-12">
      <div className="mb-1.5 flex items-center gap-2.5">
        {index ? <span className="fig text-[length:var(--t-body)] font-semibold text-[var(--c-muted)]">{index}</span> : null}
        {sample ? <SampleTag /> : null}
      </div>
      {/* THE OPT-OUT IS NEEDED HERE, and I removed it before checking. The
          canonical heading tokens this gate wants are the PRE-SPINE serif scale:
          a display serif, an ink-900 colour, sizes in Tailwind steps. A spine
          heading is on the v2 ladder and cannot wear them, so every spine heading
          must opt out. That is what the typography file itself asks for, with an
          explanation, and this is the explanation. */}
      <h2 data-typography="custom" className="text-[length:var(--t-head)] font-semibold tracking-tight text-[var(--c-ink)]">{heading}</h2>
    </div>
  );
}
/* Box , the premium card: warm hairline + inner paper top-highlight + paper gradient +
 * a SLIGHT drop shadow. Radius 14px. No edge stripe. Rulebook v1 §R1 (founder, 2026-07-11):
 * the S14 no-shadow decision is REVERSED , "the shadow effect we should have on each
 * subsection is still missing". The pinned value is the July-3 pair the founder saw and
 * ratified as the baseline: `0 1px 1px rgba(43,28,22,0.04), 0 8px 24px -12px rgba(43,28,22,0.10)`,
 * composed with the inset paper top-highlight. `elevation` is kept in the prop type as a
 * tolerated no-op (both call sites, home2-view.tsx:261/309, keep compiling). */
const DENSITY_PAD: Record<"dense" | "default" | "lead", string> = { dense: "p-4", default: "p-5", lead: "p-7" };
/**
 * CARD_SURFACE , THE ONE CARD SURFACE, AND THERE IS EXACTLY ONE.
 *
 * Rulebook v2 §36. It lives here and is imported rather than copied, because the
 * copy is what failed: NeighborhoodExplorer carried its own duplicate of the
 * shadow string with a comment saying "matching Box in kit.tsx", and the moment
 * Box changed, the neighbourhood page went to SEVEN distinct card surfaces while
 * the city page held at one. A comment cannot keep two constants equal.
 *
 * THE CARD IS GLASS. The founder picked this on 2026-08-20, variant B of three
 * shots of his own homepage: .80 alpha with a real blur, background left alone.
 * It shipped to the homepage card and NEVER REACHED THE SPINE PAGES. Measured on
 * all four London pages before this change: ZERO elements carried a
 * backdrop-filter. He named it himself as the thing that had been forgotten.
 *
 * The alpha and the blur are read from the ratified tokens rather than retyped,
 * which also buys the three fallbacks written beside them in globals.css: no
 * backdrop-filter support takes the alpha to .94, and reduced-transparency or
 * increased-contrast takes it to 1 with the blur off.
 *
 * THE DOCTRINE THIS ANSWERS TO. The spine stylesheet's own header says "GLASS IS
 * THE FRAME, SOLID IS THE DATA , anything carrying a figure sits near-opaque so
 * the image can never cost us a number." This surface holds figures. That fear
 * was tested rather than argued: sampling the real composited pixels behind every
 * figure on the city page, the ground reads 252 to 255 and the worst contrast
 * measured is 5.10 against a 4.5 floor. The readable band under the content
 * column already carries the photograph to near-white before a card is reached,
 * so the number is never spent. If the band ever goes, this has to be re-measured.
 *
 * The fill is FLAT. Frosted glass over a flat field does not read as glass; it
 * needs something to refract, and the shell lays a photograph behind every page.
 * background-clip stops the fill at the padding box, because a border paints
 * OUTSIDE it and the default clip composites the fill UNDER the border, which
 * reads as a smudge rather than an edge.
 */
export const CARD_SURFACE: React.CSSProperties = {
  background: "rgba(255, 255, 255, var(--glass-alpha-spine, 0.80))",
  backgroundClip: "padding-box",
  WebkitBackdropFilter: "var(--glass-blur, blur(20px))",
  backdropFilter: "var(--glass-blur, blur(20px))",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 1px rgba(43,28,22,0.04), 0 8px 24px -12px rgba(43,28,22,0.10)",
};

/**
 * Band , TWO SECTIONS TO A ROW, WHICH IS THE DEFAULT AND NOT THE EXCEPTION.
 *
 * Founder, 2026-06-18: "bento two-up bands (never one section per row)."
 * Restated 2026-08-25 with the reason: a reader at a desk cannot sweep their eyes
 * from one edge of a 1072px card to the other, so a full-width section is a
 * section that does not get read.
 *
 * Two children sit side by side from `md` and stack below it. A single child
 * takes the LEFT half and leaves the right open, because a lone section that
 * stretches is the fault this exists to stop; if a section genuinely needs the
 * width it takes `wide`, and `wide` is for a form that cannot be halved: a
 * four-column table, a seven-row strip, a map.
 */
export function Band({
  children,
  split = "1-1",
  hero = false,
}: {
  children: React.ReactNode;
  /** How the row divides. Founder, 2026-08-25: "not all divides in width should
   *  be 50/50, there can be cases when a section only needs 30% and another 70%."
   *  The set is closed on purpose: four ratios is a rhythm, an open number is the
   *  fourteen-white-alphas problem again. */
  split?: "1-1" | "1-2" | "2-1" | "2-3" | "3-2";
  /** A CHROME band, and the only kind that may run the full width: the hero and
   *  the closing hand-off. Founder, same day: "for every subsection that
   *  stretches left to right full width, I think we should ban it except hero
   *  section." His rule is about READING DATA across a column; a hero states one
   *  answer and a terminus offers one link, and neither asks the eye to traverse
   *  a row of figures. Art direction D1. The gate reads the attribute, so a
   *  section cannot claim the width by looking like one. */
  hero?: boolean;
}) {
  /* THE SPACING LADDER (art direction D6). Measured on all four pages before
     this: the gap BETWEEN bands, the gap WITHIN a band and a card's own padding
     were all 20px, so three of the ladder's four rungs were the same number and
     a reader had nothing telling them where one band ended. The ladder is now
     chapter 48, band 32, card padding 16/20/28 by density, slot 8. Four rungs,
     each strictly smaller than the one outside it, which is what D6 is for.

     A BAND'S SPACING IS ONE VALUE IN BOTH DIRECTIONS. A first pass gave the
     column gap its own number, which invented a fifth rung and immediately
     collided with the lead card's padding: cards sitting 24px apart with 28px of
     padding inside them read as merged, because their contents were further from
     their own edges than the cards were from each other. */
  if (hero) return <div data-hero="1" className="mt-8">{children}</div>;
  /* THE RATIO WAITS FOR DESKTOP; TABLET GETS EQUAL HALVES.
     Measured at 768px, the first width where two-up switches on: the small side of
     an uneven band is about 229px, and three of the four pages had a chart in one
     of them, a log scale, a phase bar and a stacked bar. A third of a tablet is
     not a column, it is a sliver. Equal halves at 768 give each card about 352px,
     and the ratio takes over at 1024 where there is room for it to mean something.
     Art direction D4: the split follows the content, and at 768 the content does
     not fit the split. */
  const cols = {
    "1-1": "md:grid-cols-2",
    "1-2": "md:grid-cols-2 lg:grid-cols-[1fr_2fr]",
    "2-1": "md:grid-cols-2 lg:grid-cols-[2fr_1fr]",
    "2-3": "md:grid-cols-2 lg:grid-cols-[2fr_3fr]",
    "3-2": "md:grid-cols-2 lg:grid-cols-[3fr_2fr]",
  }[split];
  /* A BAND LEFT HOLDING ONE CARD TAKES A DELIBERATE TWO THIRDS. Several sections
     have a partner that renders for some cities and trades and not others, and
     when the partner is absent the survivor kept its declared share: a card at
     two fifths of the column with three fifths of nothing beside it, which is the
     one-sided white space the splitting exists to prevent. Spanning the full width
     instead is not available, because full width is banned for anything carrying a
     finding (D1).

     So a band with a single child re-templates to two thirds and one third, and
     the child lands in the larger column. It reads as an asymmetric composition
     rather than a row that lost something, and it is the same two thirds every
     time, which is what makes it read as a choice. */
  /* A LONE CARD THAT IS ALSO A LEAN ONE TAKES THE NARROW COLUMN, NOT THE WIDE ONE.
     Two thirds is right for a survivor that still has a table or a chart in it.
     It is wrong for a card holding one figure: photographed at 1280, "The typical
     operator" became a 705 by 154 box with a number in its top left corner and
     three quarters of the box empty, which is the wide-for-no-reason emptiness the
     splitting exists to prevent, just moved inside the border where it reads as a
     hole rather than as rhythm.
     A card may declare itself lean, and then the space falls OUTSIDE its edge,
     where an uneven band is a composition instead of a gap. The attribute carries
     higher specificity than the plain only-child rule, so it wins wherever both
     apply without depending on which order the classes were written in. */
  return (
    <div className={`mt-8 grid grid-cols-1 items-start gap-8 [&:has(>*:only-child)]:lg:grid-cols-[2fr_1fr] [&:has(>*:only-child[data-lean])]:lg:grid-cols-[1fr_2fr] ${cols}`}>
      {children}
    </div>
  );
}


export function Box({ children, className = "", elevation = "card", density = "default", ...rest }: { children: React.ReactNode; className?: string; elevation?: "card" | "lift"; density?: "dense" | "default" | "lead" } & React.HTMLAttributes<HTMLDivElement>) {
  void elevation;
  /* rest carries the data attributes a section uses to declare itself: the
     editorial exemption (art direction E1). Declaring is the point, so it has to
     reach the DOM where the gate can read it. */
  return (
    <div
      {...rest}
      className={`rounded-[14px] border border-[var(--c-border)] ${DENSITY_PAD[density]} ${className}`}
      style={{
        ...CARD_SURFACE,
      }}
    >
      {children}
    </div>
  );
}
/* one shared left-to-right scale with N labelled markers. Optional 4th tuple = a who-for
 * subtitle under the label. Optional `endLabels` names the two ends of the shared track
 * (small muted uppercase, Meter's pattern) so the scale is never anonymous; rendered once
 * under the row set, aligned to the track column. Default undefined = the historical render.
 * `plain` = a NEUTRAL flat track: use it when the right end is NOT better (a demands /
 * characteristics read), so the warm end never asserts a direction the data lacks (rule 10). */
export function EaseScale({ rows, endLabels }: { rows: Array<[string, number, string, string?]>; endLabels?: [string, string] }) {
  /* THE TRACK IS FLAT. It used to fade from grey into a pale terracotta at the
     right-hand end, which broke the site's one hard colour rule twice over: the
     accent marks the answer and nothing else, and decoration never sits on top
     of data. The fade also said the same thing the two end labels already say,
     in a second language, so it carried no reading of its own.
     THE VALUE LABEL IS ANCHORED AWAY FROM THE ENDS. It is centred on its own
     marker, so a reading at either extreme pushed half the label outside the
     card. The same fault, and the same fix, as the break-even marker. */
  const anchor = (p: number) => (p < 14 ? "0%" : p > 86 ? "-100%" : "-50%");
  return (
    /* THE KEY ARRIVES BEFORE THE VALUES IT EXPLAINS, not after them. The two ends
       of this scale, which are the only thing telling a reader which direction is
       good, were printed UNDER four rows of readings. A reader met four marks on
       four unlabelled tracks, worked out nothing, reached the bottom, and then had
       to go back up and read them again knowing what the sides meant.
       A chart's key is furniture and stays quiet, but quiet is about weight, not
       about order. */
    <div data-idea="I1" className="space-y-3.5">
      {endLabels ? (
        <div aria-hidden className="grid grid-cols-[minmax(0,7.5rem)_1fr] items-center gap-3 sm:grid-cols-[150px_1fr]">
          <span />
          <div className="flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>{endLabels[0]}</span><span>{endLabels[1]}</span></div>
        </div>
      ) : null}
      {rows.map(([label, pos, word, sub]) => (
      <div key={label} className="hov -mx-2 grid grid-cols-[minmax(0,7.5rem)_1fr] items-center gap-3 rounded-md px-2 py-1.5 sm:grid-cols-[150px_1fr]">
        <span className="min-w-0 text-[length:var(--t-body)] leading-tight text-[var(--c-ink2)]">{label}{sub ? <span className="mt-0.5 block text-[length:var(--t-micro)] text-[var(--c-muted)]">{sub}</span> : null}</span>
        <div className="relative h-1.5 rounded-full" role="img" aria-label={`${label}: ${word}`} style={{ background: TRACK }}>
          <div className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${pos}%` }}>
            <span className="h-3 w-3 rounded-full border-2 border-white" style={{ background: "var(--c-ink)", boxShadow: "0 0 0 1px var(--c-border)" }} />
          </div>
          {/* TABULAR NUMERALS. Art direction F1: these values stack vertically down
              the scale, one per row, and proportional numerals make 3/10 and 8/10
              sit at visibly different widths so the column reads as ragged. */}
          <span className="fig absolute -top-5 whitespace-nowrap text-[length:var(--t-micro)] font-medium text-[var(--c-ink2)]" style={{ left: `${pos}%`, transform: `translateX(${anchor(pos)})` }}>{word}</span>
        </div>
      </div>))}
    </div>
  );
}
/* a slim labelled meter for a single 0-100 read (NOT a dial) */
export function Meter({ value, left, right }: { value: number; left: string; right: string }) {
  return (
    <div data-idea="I1">
      <div className="relative h-2 rounded-full" role="img" aria-label={`${value} out of 100`} style={{ background: "#e6e6e6" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: TERRA }} />
        <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${value}%`, background: "#1a1a1a" }} />
      </div>
      <div className="mt-1 flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}
/* SampleTag , THE per-section sample marker (publish-critical, strategy 2026-07-07:
 * unsourced sections ship FILLED with sample data, clearly labeled, never shown as real).
 * Honest, unmissable, calm: the dashed "sample" AtlasMark + the word, in a dashed pill on
 * the soft wash , visibly different from every real chip, but quiet enough not to shout.
 * `note` renders as VISIBLE text when set (never title-only; mobile must see it too). */
export function SampleTag({ note }: { note?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--c-line-strong)] bg-[var(--c-soft)] px-2.5 py-0.5">
      <AtlasMark id="sample" size={12} />
      <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wider text-[var(--c-muted)]">sample</span>
      {note ? <span className="text-[length:var(--t-micro)] normal-case tracking-normal text-[var(--c-muted)]">{note}</span> : null}
    </span>
  );
}
/* Head , subsection header. Rulebook v1 §R2 (founder 2026-07-11, reverses the S2 icon
 * deletion at subsection level): subsection titles carry the Ico tile on the LEFT of the
 * title again , "the subsections generally, they need icons to function". Every call site
 * already passes its icon id, so this is a kit-only restore. */
export function Head({ children, sample, icon }: { children: React.ReactNode; sample?: boolean; icon?: AtlasIconId }) {
  return (
    // THE SLOT GAP IS THE 8 RUNG, NOT 12. The spacing ladder runs 48 > 32 >
    // card padding > 8, strictly descending, and 12 sits on no rung of it; at
    // mb-3 this margin was the single most common off-ladder gap on the city
    // page, measured on all nine top sections. The city blueprint's own
    // written fix: take Head and Rail bottom margin to the slot rung 8.
    // City finding #4 (2026-08-30), S1.
    <div className="mb-2 flex items-center gap-2">
      {icon ? <Ico id={icon} /> : null}
      {/* the other section opener, same level, same reasoning as Rail above */}
      <h3 data-typography="custom" className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{children}</h3>
      {sample ? <SampleTag /> : null}
    </div>
  );
}
/* InfoTip , THE educational "?" gloss (rule 24: teach as you inform; rule 7: jargon gets
 * a gloss). A focusable button trigger, so it works on TAP at 390px (focus shows the tip),
 * not just hover; the gloss also rides the aria-label for screen readers. Educational copy
 * only , never sole-source data (that stays visible text). Promoted from the country page. */
/* InfoTip MOVED to src/components/kit/InfoTip.tsx and re-exported here, so all
   thirteen call sites keep importing it from the kit unchanged.

   IT HAD TO MOVE BECAUSE IT HAD TO BECOME A CLIENT COMPONENT. The hand-rolled
   version was a CSS-only hover panel, which fails WCAG 1.4.13 (Level AA) three
   ways: it could not be dismissed with Escape, its panel carried
   pointer-events-none so it could not be hovered to read a long gloss, and it
   put the entire gloss in the trigger's aria-label AND left it permanently in
   the DOM, so a screen reader announced it twice, once as a button name. Radix
   fixes all three and needs the client; this file is server-rendered. */
import { InfoTip } from "@/components/kit/InfoTip";
export { InfoTip };

/* SpectraTable , the character two-pole spectra (promoted from the country page so city +
 * country share ONE idiom, rule 22). `gradient` = the track runs dark-gray (LEFT = worse
 * for business) to terracotta (RIGHT = better) and the right pole reads bold ink; without
 * it the track is neutral with a centre tick and BOTH poles carry equal weight (no implied
 * better end , form must not assert a direction the copy disclaims). `glossFor` supplies
 * the per-spectrum "?" gloss, rendered LEFT of the row per the founder's spec. */
export function SpectraTable({ rows, gradient = false, glossFor, dot = "ink", middle }: { rows: any[]; gradient?: boolean; glossFor?: (spectrum: string) => string | undefined; dot?: "ink" | "terra";
  /* THE MIDDLE IS A BAND WHEREVER THE CALLER READS IT AS ONE, and this prop
     exists because the drawing was contradicting the words above it. The neutral
     track carries ONE hairline at 50, which asserts a cut: everything left of it
     leans one way and everything right of it the other. A caller that composes
     English off these positions does not read the scale that way. The trade
     page's who-walks-in treats 41 to 59 as "mixed", on the stated ground that a
     cut at exactly 50 would make 49 and 51 print opposite portraits off a
     difference neither the data nor a reader can defend; so a persona at 45 sat
     visibly LEFT of the tick while the card called it middle-aged. Passing the
     caller's own thresholds moves the same hairline mark to each EDGE of the
     band, so the drawing says what the sentence says and a dot inside the pair
     reads as the middle rather than as a lean.
     IT IS OPT-IN AND UNDEFINED BY DEFAULT, so the country and city character
     tables render exactly the mark they render today. It has no effect on the
     `gradient` track, which carries no tick at all because its direction is the
     reading. */
  middle?: [number, number] | null }) {
  if (!rows?.length) return null;
  const band = middle && middle[0] < middle[1] ? middle : null;
  /* dot: the founder's 2026-08-30 split on the country page ("dealing with the
     state, the points should be black; dealing with the people, terracotta").
     Defaults to ink so every existing caller renders unchanged.
     A row carrying `name` takes the NAMED form (his same order: the pole
     words alone are not enough; the trait name leads, the explanatory poles
     sit under the track's ends). Rows without a name keep the compact form. */
  const dotBg = dot === "terra" ? "var(--terra)" : "var(--c-ink)";
  return (
    <div data-idea="I1" className="divide-y divide-[var(--c-border)]">
      {rows.map((r: any, i: number) => {
        const pos = Math.max(5, Math.min(95, Math.round((r.position_0_1 ?? 0.5) * 100)));
        const right = pos >= 50;
        /* THE ACCESSIBLE NAME FOLLOWS THE SAME BAND THE DRAWING DOES. Left to
           the >= 50 cut, a screen reader was told "leans Younger" about the very
           row a sighted reader saw sitting inside the middle band, which is the
           drawing-contradicts-the-words fault in the layer nobody photographs. */
        const lean = band ? (pos < band[0] ? r.left_label : pos > band[1] ? r.right_label : null) : right ? r.right_label : r.left_label;
        const gloss = glossFor?.(r.spectrum);
        const track = (
          <span className="relative block h-[6px] rounded-full" role="img" aria-label={`${r.name ? r.name + ": " : ""}${r.left_label} to ${r.right_label}: ${lean ? `leans ${lean}` : "in the middle"}`} style={{ background: gradient ? "linear-gradient(90deg, #6f6f6d, var(--terra))" : "#ecebe9" }}>
            {!gradient && !band ? <span className="absolute -bottom-[3px] -top-[3px] left-1/2 w-px" style={{ background: "var(--c-border)" }} /> : null}
            {!gradient && band
              ? band.map((edge) => (
                  <span key={edge} className="absolute -bottom-[3px] -top-[3px] w-px" style={{ left: `${edge}%`, background: "var(--c-border)" }} />
                ))
              : null}
            <span className="absolute top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos}%`, background: dotBg, boxShadow: "0 0 0 1px #e3e3e3" }} />
          </span>
        );
        if (r.name) {
          return (
            <div key={i} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center text-[length:var(--t-micro)] font-medium text-[var(--c-ink)]">
                {gloss ? <InfoTip gloss={gloss} className="mr-1.5" /> : null}
                {r.name}
              </div>
              <div className="mt-1.5">{track}</div>
              <div className="mt-1 flex justify-between gap-3 text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">
                <span>{r.left_label}</span>
                <span className="text-right">{r.right_label}</span>
              </div>
            </div>
          );
        }
        return (
          <div key={i} className="hov -mx-2 grid grid-cols-[130px_1fr_118px] items-center gap-2 rounded-md px-2 py-2">
            <span className={`flex items-center text-[length:var(--t-micro)] leading-tight ${gradient ? "text-[var(--c-muted)]" : "text-[var(--c-ink2)]"}`}>
              {gloss ? <InfoTip gloss={gloss} className="mr-1.5" /> : null}
              {r.left_label}
            </span>
            {track}
            <span className={`text-right text-[length:var(--t-micro)] leading-tight ${gradient ? "font-medium text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{r.right_label}</span>
          </div>
        );
      })}
    </div>
  );
}
/* Chip , thin spine-palette wrapper over the canonical ui/pill.tsx (loyalty decision,
 * see header). Signature unchanged; the hinted arbitrary classes override Pill's
 * neutral variant onto the spine CSS vars via tailwind-merge. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <Pill variant="neutral" className="border-[color:var(--c-border)] bg-[color:var(--c-soft)] px-2.5 py-0.5 text-[length:var(--t-micro)] font-normal text-[color:var(--c-ink2)]">
      {children}
    </Pill>
  );
}
export function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return <div data-idea="I8" className="flex gap-3 border-b border-[var(--c-border)] py-2 last:border-0"><span className="w-24 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{k}</span><span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{v}</span></div>;
}
/* S6 prevention tripwire (rulebook v2 K6): "Never hide a graphic behind a popup, expand,
 * or disclosure , graphics are always visible. Disclosures exist only to move BULLET TEXT
 * out of the first view." That sentence is the CONTRACT, enforced by convention at every
 * call site; this is a dev-only, non-throwing TRIPWIRE, not a gate , it walks only the
 * DIRECT children passed to a disclosure and console.warns (never in production) when one
 * of them is a kit graphic component. It cannot catch a graphic nested two levels deep
 * inside a caller's own wrapper, so the JSDoc rule on InlineDisclosure/Expand below remains
 * the real contract; this just catches the easy, common mistake. */
const GRAPHIC_TYPES: ReadonlySet<unknown> = new Set([
  Gauge, Donut, StackBar, ShareStack, Waterfall, SpreadStrip, EaseScale, Meter, SpectraTable, Spectrum, Timeline, Spark, StruckLine, Dots, MiniBar, IndexBar, PhaseBar,
]);
function assertNoGraphics(children: React.ReactNode, where: string) {
  if (process.env.NODE_ENV === "production") return;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && GRAPHIC_TYPES.has(child.type)) {
      const name = (child.type as { displayName?: string; name?: string })?.displayName ?? (child.type as { name?: string })?.name ?? "a kit graphic";
      console.warn(`[kit S6] ${where} renders ${name} directly as a child. Graphics must stay visible in the first view , never hide one behind a disclosure. Move only bullet/prose text here.`);
    }
  });
}
/* inline "+" disclosure , a flat ink summary line that rotates the + on open.
 * Links are chrome, not the answer: the summary reads ink2 and warms to terracotta
 * only on hover/open (terracotta stays reserved for answers, not affordances).
 * Canonicalises the hand-rolled "see the detail" rows (cost base / line-by-line tax /
 * discretionary split). The caller supplies its own body wrapper as children so each
 * instance keeps its exact body layout; `className` carries the per-instance details
 * styling (e.g. the top hairline). Distinct from Expand (the boxed single-open row).
 * CONTRACT (rulebook v2 S6): body is BULLET/PROSE TEXT ONLY , never place a kit graphic
 * inside; graphics stay visible in the first view, never hidden behind a disclosure. */
export function InlineDisclosure({ name, summary, className = "group mt-3", children }: { name: string; summary: React.ReactNode; className?: string; children: React.ReactNode }) {
  assertNoGraphics(children, "InlineDisclosure");
  return (
    <details name={name} className={className}>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]"><span className="text-[length:var(--t-lead)] text-[var(--c-muted)] transition group-open:rotate-45 group-open:text-[var(--terra-text)]">+</span> {summary}</summary>
      {children}
    </details>
  );
}
/* single-open expandable row , progressive disclosure. `title` accepts a node so a row
 * can lead with a small trade icon (the licensing pattern); strings render as before.
 * CONTRACT (rulebook v2 S6): body is BULLET/PROSE TEXT ONLY , never place a kit graphic
 * inside; graphics stay visible in the first view, never hidden behind a disclosure. */
export function Expand({ name, title, right, children, open }: { name: string; title: React.ReactNode; right?: React.ReactNode; children: React.ReactNode; open?: boolean }) {
  assertNoGraphics(children, "Expand");
  return (
    <details name={name} open={open} className="group overflow-hidden rounded-lg border border-[var(--c-border)] open:border-[var(--c-line-strong)] open:shadow-[0_1px_2px_rgba(27,24,22,0.04)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-[var(--c-soft)] px-3.5 py-2.5 transition hover:bg-[var(--c-soft2)] group-open:bg-[var(--terra-soft)]">
        <span className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)] group-open:text-[var(--terra-text)]">{title}</span>
        <span className="flex items-center gap-3">{right}<span className="text-[length:var(--t-lead)] text-[#c9c9c9] transition group-open:rotate-45 group-open:text-[var(--terra-text)]">+</span></span>
      </summary>
      <div className="px-3.5 pb-3 pt-1 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{children}</div>
    </details>
  );
}
/* bullet list , neutral dots (bullets are never the accent). */
export function Bullets({ items }: { items: string[] }) {
  return <ul className="space-y-2">{items.map((t, i) => <li key={i} className="relative pl-4 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]"><span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full" style={{ background: "#c9c9c9" }} />{t}</li>)}</ul>;
}
/* ===== WIDTH TIERS (WI-4) , one reading column, five derived tiers. Hard rule:
 * no two consecutive bands share a tier. Within a tier-group use space-y-4;
 * between tier-groups use space-y-6. Paired Boxes match height via items-stretch. */

/* T1 , full column: timelines, leaderboards, maps, a single stacked bar. */
export function Full({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}
/* T3 , 1:1: two peer reads of equal class. (Row is the historical name; Even is the tier name.) */
export function Row({ children }: { children: React.ReactNode }) {
  /* items-start for the reason on WideRail above (D7). */
  return <div className="flex flex-col gap-4 md:flex-row md:items-start [&>*]:flex-1">{children}</div>;
}
export const Even = Row;
/* T2 , 3:2: a chart (flex-[3]) paired with a SCHEMATIC rail (flex-[2]) , stats, chips, a
 * legend, KV rows. Rulebook v2 S7: a chart must explain itself by its form (direct labels,
 * axis units, a one-line legend); the rail beside it is NEVER an explanatory paragraph. If
 * the rail content is a paragraph, the chart's own labeling is the thing to fix. */
/* `empty:hidden` because BOTH FLANKS CAN SELF-OMIT AND THE RAIL STILL DREW. Every
   card in the spine leaves when its figures are absent, which is right, and this
   container had no matching behaviour: on seven of eight real city pages the
   customers chapter ended with a rail holding nothing, and its parent's spacing
   still gave it a gap. A reader saw dead space at the foot of the chapter. The
   guard is CSS rather than a count of children on purpose: the flanks decide for
   themselves whether to draw, and any condition restated here would be a copy of
   their guards, free to drift from them. `:empty` cannot drift and cannot hide a
   rail that has anything in it. */
/* ITEMS-START, NOT ITEMS-STRETCH. Art direction D7. Stretching a short card to
 * its taller neighbour's height is what MAKES the empty space the founder named
 * on 2026-08-25: measured that day, the trade page's team-costs card was 314px
 * tall with 154px of nothing under it, purely because the card beside it was
 * taller. A ragged bottom edge is honest; a crater is not. */
export function WideRail({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 empty:hidden md:flex-row md:items-start [&>*:first-child]:md:flex-[3] [&>*:last-child]:md:flex-[2] [&>*]:flex-1">{children}</div>;
}
/* T4 , 3-up: exactly three small homogeneous reads (never two Triptychs in a row). */
export function Triptych({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch">{children}</div>;
}
/* T5 , <=58%, centered: one verdict / one figure / a CTA, air around it. */
export function Narrow({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full md:max-w-[58%]">{children}</div>;
}
export function Spectrum({ rows }: { rows: any[] }) {
  return <div data-idea="I1" className="space-y-3">{rows.map((r: any, i: number) => (
    <div key={i}><div className="mb-1 flex justify-between text-[length:var(--t-micro)] text-[var(--c-ink2)]"><span>{r.left_label}</span><span>{r.right_label}</span></div>
      <div className="relative h-1.5 rounded-full" role="img" aria-label={`${r.left_label} to ${r.right_label}`} style={{ background: "linear-gradient(90deg,#fb8469,#d4d4d4 52%,#737373)" }}><div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--c-ink)]" style={{ left: `${Math.round((r.position_0_1 || 0) * 100)}%`, boxShadow: "0 0 0 1px #e3e3e3" }} /></div></div>))}</div>;
}
export function CatRows({ rows }: { rows: Array<[string, any]> }) {
  return <div data-idea="I8" className="divide-y divide-[var(--c-border)]">{rows.map(([k, v]) => v ? <div key={k} className="hov -mx-2 flex gap-3 rounded-md px-2 py-1.5"><span className="w-28 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{k}</span><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{v}</span></div> : null)}</div>;
}

/* ===== SECTION ANATOMY PRIMITIVES (WI-3) ===== */

/* Rail , the section opener: an Ico tile + kicker, one plain title line. Rulebook v1 §R2
 * (founder 2026-07-11): subsection titles carry their icon on the LEFT again , the S2 icon
 * deletion is reversed at subsection level. The 2026-07-10 corrections still stand for the
 * REST of the header: NO section header states a conclusion , the verdict slot stays a
 * no-op (the finding lives ON the visual), and no eyebrow returns. `tone` and `verdict`
 * stay in the prop type as tolerated no-ops so existing call sites keep compiling , do not
 * delete either from the type. */
export function Rail({ icon, kicker, verdict, tone = "ink", sample }: { icon?: AtlasIconId; kicker: string; verdict?: React.ReactNode; tone?: "ink" | "terra"; sample?: boolean }) {
  void tone;
  void verdict;
  return (
    // mb-2, the slot rung: same written kit fix as Head above (the spacing
    // ladder holds no 12). City finding #4 (2026-08-30), S1.
    <div className="mb-2">
      <div className="mb-1.5 flex items-center gap-2">
        {icon ? <Ico id={icon} /> : null}
        {/* A SECTION TITLE IS A HEADING. This was a span, and so is every other
            section opener in the spine, which means a page's heading outline
            stopped at its chapters. Counted on the two flagship pages: 8 heading
            elements against 14 section titles on one, 12 on the other. Skimming
            by heading is how a screen-reader user reads a long page, and on these
            pages it reached the chapter names and nothing inside them.
            The classes carry every pixel of the look, so the tag is the whole
            change and nothing moves.
            The opt-out attribute is the one this project's own typography file
            asks for, with the reason it asks for: the canonical heading tokens
            are the pre-spine serif scale, and a spine heading cannot wear them. */}
        <h3
          data-typography="custom"
          className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]"
        >
          {kicker}
        </h3>
        {sample ? <SampleTag /> : null}
      </div>
    </div>
  );
}

/* Stat , one figure with a locked scale contract. focal vs support keeps a >=1.6
 * type-scale contrast so the focal always dominates. Terracotta only on the focal. */
export function Stat({ value, label, sub, size = "support", accent = false }: { value: React.ReactNode; label?: string; sub?: string; size?: "focal" | "support"; accent?: boolean }) {
  const focal = size === "focal";
  return (
    <div data-idea="I9">
      {label ? <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</div> : null}
      {/* THE FOCAL'S TWO SIZES ARE OFF THE LADDER BY DECLARATION, NOT BY DRIFT.
          38 at phone and 42 at md sit between the 30 focal rung and the 48
          answer rung; the city blueprint's constants block records them as fact
          (b) and round 2026-08-27 recorded D4 good on every node that carries
          them, so they are the settled form, reproduced exactly. The trade
          masthead's clamp is the precedent: a responsive answer is never
          exactly one ladder size, and the custom marker is the escape hatch
          the ladder law provides for exactly this. The marker rides only the
          focal branch; the support branch sits on the body rung and needs no
          opt-out. City finding #3 (2026-08-30), T1. */}
      <div data-typography={focal ? "custom" : undefined} className={`fig leading-none ${focal ? "text-[38px] md:text-[42px]" : "text-[length:var(--t-body)]"}`} style={{ color: accent ? "var(--terra-text)" : "var(--c-ink)" }}>{value}</div>
      {sub ? <div className={`text-[var(--c-muted)] ${focal ? "mt-1.5 text-[length:var(--t-body)]" : "mt-0.5 text-[length:var(--t-micro)]"}`}>{sub}</div> : null}
    </div>
  );
}

/* Spark , a 28-30px terracotta area+line sparkline. Gives a single number a shape
 * ("mid-pack among peers"). values are plotted on a shared min/max; optional marker. */
export function Spark({ values, w = 96, h = 30, markerIndex }: { values: number[]; w?: number; h?: number; markerIndex?: number }) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const X = (i: number) => (i / (values.length - 1)) * (w - 2) + 1;
  const Y = (v: number) => h - 3 - ((v - min) / span) * (h - 6);
  const pts = values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
  const line = "M " + pts.join(" L ");
  const area = `M ${X(0).toFixed(1)},${(h - 1).toFixed(1)} L ` + pts.join(" L ") + ` L ${X(values.length - 1).toFixed(1)},${(h - 1).toFixed(1)} Z`;
  const mi = markerIndex == null ? values.length - 1 : Math.max(0, Math.min(values.length - 1, markerIndex));
  return (
    <svg data-idea="I4" viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }} role="img" aria-label="trend sparkline" preserveAspectRatio="none">
      <path d={area} fill={TERRA} opacity={0.12} />
      <path d={line} fill="none" stroke={TERRA} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(mi)} cy={Y(values[mi])} r={2.4} fill={TERRA} stroke="#fff" strokeWidth={1} />
    </svg>
  );
}

/* StruckLine , the shared "myth, busted , ON the chart" overlay (rulebook v2 S12:
 * the myth-busting device was "a schematic cliche", rework or cut it , this
 * replaces every standalone "Myth, busted" text box with a mark drawn directly on
 * the real chart the myth is about). A THIN, DASHED, low-contrast phantom line for
 * a folklore claim, crossed out by one confident stroke across its own bounding
 * box (the diagonal OPPOSITE the phantom's own slope, so the strike reads as an
 * intentional cross-out rather than a second data line), plus a small struck
 * caption. Renders INSIDE a host chart's own <svg viewBox=...>: the caller
 * (SurvivalSlope, SurvivalCurve, or any future line/area chart) projects the
 * phantom's own values through the SAME X()/Y() scale it uses for its real curve
 * and hands the resulting points here, so the phantom always shares the real
 * chart's exact axis, never a second invented one. No fill, never terracotta: the
 * phantom must read as strictly secondary to the real curve beside it (the accent
 * stays reserved for the truth). Self-omits on fewer than 2 points (nothing to
 * draw a line through). Decorative: the group is aria-hidden, so a caller that
 * passes a phantom folds its claim into the HOST svg's own aria-label. Pure /
 * stateless, no window/document reference , SSR-safe by construction. */
export function StruckLine({ points, label = "folklore", hideLabel = false }: { points: Array<[number, number]>; label?: string; hideLabel?: boolean }) {
  if (!points || points.length < 2) return null;
  const path = "M " + points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ");
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const x0 = Math.min(...xs) - 4, x1 = Math.max(...xs) + 4;
  const y0 = Math.min(...ys) - 4, y1 = Math.max(...ys) + 4;
  const [lx, ly] = points[points.length - 1];
  /* THE STRIKE MUST NOT LOOK LIKE DATA, and drawn corner to corner across the
     phantom's whole bounding box it does. On a flat folklore line that is a long,
     shallow, full-width stroke: a third trend line running through the plot, which
     is the opposite of cancelling something. Short, centred, steep and INKED, so
     it crosses the claim instead of joining the chart.

     ONE STRIKE, ON ONE OBJECT. This also carried a caption with a line through the
     TEXT, so a struck line and a struck caption struck the same idea twice and the
     pair read as a mistake rather than a finding. The founder, 2026-08-25, on
     exactly this pile: "you just create like a text and you slap like a line on
     top of it, what the fuck is that." The claim IS the dashed line; the strike
     crosses it and the caption NAMES it. The rank chart on the neighbourhood page
     was corrected this way the same day and this shared form was missed, so the
     defect he named stayed live on the trade page. */
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  /* THE SAME PROPORTIONS THE RANK CHART SETTLED ON: 34 across by 9 down, near
     enough 0.3. The first attempt here used 0.55 and the strike reached a third of
     the way up the plot, close enough to the real curve that it read as crossing
     BOTH lines. Steep enough to cancel, short enough to stay over the thing it
     cancels. */
  const halfW = Math.min(30, (x1 - x0) * 0.16);
  const halfH = Math.max(6, halfW * 0.3);
  return (
    <g data-idea="I4" aria-hidden="true">
      <path d={path} fill="none" stroke="var(--c-line-strong)" strokeWidth={1.3} strokeDasharray="3 3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <line x1={cx - halfW} y1={cy + halfH} x2={cx + halfW} y2={cy - halfH} stroke="var(--c-ink)" strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {/* hideLabel: when the caller draws its own text in the DOM instead, so the
          words are not scaled along with the drawing. */}
      {hideLabel ? null : <text x={lx} y={ly - 8} textAnchor="end" fontSize={9} fill="var(--c-muted)">{label}</text>}
    </g>
  );
}

/* ===== TIMELINE (WI-5) , one continuous time axis, milestones positioned by real
 * time. Desktop = SVG; mobile = CSS-only vertical rail (no JS, SSR-safe, no h-scroll).
 * `read`, rulebook v2 S7 (K7): a SINGLE one-glance verdict line, never an explanatory
 * paragraph , the axis, phase bands, and node labels must carry the story on their own.
 * Rendered with line-clamp-2 below as a soft cap; callers must not pass multi-sentence
 * prose here. */
export type TLPhase = [label: string, from: number, to: number];
export type TLNode = { at: number; label: string; sub?: string; kind?: "breakeven" | "normal" };

export function Timeline({ span, unit, phases = [], nodes, read, startLabel }: { span: number; unit: "week" | "day"; phases?: TLPhase[]; nodes: TLNode[]; read?: React.ReactNode; startLabel?: string }) {
  if (!nodes || nodes.length === 0) return null;
  const W = 680, H = 196, axisY = 100, padL = 28, padR = 28;
  const innerW = W - padL - padR;
  const safeSpan = span > 0 ? span : Math.max(1, ...nodes.map((n) => n.at));
  const X = (t: number) => padL + (Math.max(0, Math.min(safeSpan, t)) / safeSpan) * innerW;
  const uLabel = (t: number) => (unit === "week" ? `wk ${Math.round(t)}` : `day ${Math.round(t)}`);
  const sorted = [...nodes].sort((a, b) => a.at - b.at);

  /* Horizontal label de-collision. A label centered on its node needs roughly
   * its text width of clear space. When nodes pack closer than that, we lift the
   * crowded ones into stacked lanes (more than 2) instead of letting the text
   * overlap; if a node is still too tight after lane-stacking, it drops to a
   * numbered legend below the axis. The break-even node never drops and never
   * shares a lane, so it stays emphasized. */
  const MIN_GAP = 10; // px breathing room between two labels sharing a lane
  const LANE_STALK = [22, 40, 58]; // stalk lengths per stacked lane
  const estW = (s: string) => Math.max(30, (s ? s.length : 0) * 5.6 + 8); // approx label width at fontSize 10.5
  const anchorFor = (x: number): "start" | "middle" | "end" => (x < padL + innerW * 0.16 ? "start" : x > padL + innerW * 0.84 ? "end" : "middle");
  const edgesOf = (x: number, w: number, a: "start" | "middle" | "end") => (a === "start" ? { l: x, r: x + w } : a === "end" ? { l: x - w, r: x } : { l: x - w / 2, r: x + w / 2 });
  type Placed = { n: TLNode; i: number; x: number; be: boolean; lane: number; above: boolean; anchor: "start" | "middle" | "end"; legend?: number };
  const placed: Placed[] = [];
  let legendCount = 0;
  // Walk left to right. Place each label on the first lane (its own side first, then
  // the other side) whose previous label's RIGHT edge clears this label's LEFT edge.
  // Width-aware, so wide labels on close nodes never overlap; labels near the ends are
  // edge-anchored so they don't run off-canvas; anything that still cannot fit drops to
  // a numbered legend. The break-even node never shares a lane and never drops.
  let nextAbove = false;
  const lastRight: Record<string, number> = {};
  sorted.forEach((n, i) => {
    const x = X(n.at);
    const be = n.kind === "breakeven";
    if (be) { placed.push({ n, i, x, be: true, lane: 0, above: true, anchor: "middle" }); return; }
    const anchor = anchorFor(x);
    const e = edgesOf(x, estW(n.label), anchor);
    const above = nextAbove; nextAbove = !nextAbove;
    const order = above ? ["a", "b"] : ["b", "a"];
    let done = false;
    for (const side of order) {
      for (let L = 0; L < LANE_STALK.length; L++) {
        const key = `${side}-${L}`;
        if (lastRight[key] === undefined || e.l >= lastRight[key] + MIN_GAP) {
          lastRight[key] = e.r;
          placed.push({ n, i, x, be: false, lane: L, above: side === "a", anchor });
          done = true; break;
        }
      }
      if (done) break;
    }
    if (!done) { legendCount += 1; placed.push({ n, i, x, be: false, lane: 0, above, anchor, legend: legendCount }); }
  });
  const legendItems = placed.filter((p) => p.legend);

  return (
    <Box data-idea="I4">
      {/* Desktop SVG */}
      <svg className="hidden w-full sm:block" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="milestone timeline" preserveAspectRatio="xMidYMid meet">
        {/* phase bands */}
        {phases.map(([label, from, to], i) => {
          const x0 = X(from), x1 = X(to), bw = x1 - x0;
          const profit = /profit|break|surplus/i.test(label);
          return (
            <g key={`ph-${i}`}>
              <rect x={x0} y={axisY - 30} width={Math.max(0, bw)} height={60} fill={profit ? "#fff1ed" : i % 2 === 0 ? "#f4f4f3" : "#ededec"} />
              {bw >= 46 ? <text x={x0 + bw / 2} y={axisY - 38} textAnchor="middle" fill="#8c8c8a" fontSize={9} style={{ textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</text> : null}
            </g>
          );
        })}
        {/* axis */}
        <line x1={padL} y1={axisY} x2={W - padR} y2={axisY} stroke="#d8d0cb" strokeWidth={1.5} />
        <text x={padL} y={axisY + 18} textAnchor="start" fill="#8c8c8a" fontSize={9}>{startLabel || (unit === "week" ? "wk 0" : "day 0")}</text>
        <text x={W - padR} y={axisY + 18} textAnchor="end" fill="#8c8c8a" fontSize={9}>{uLabel(safeSpan)}</text>
        {/* nodes */}
        {placed.map((p) => {
          const { n, i, x, be } = p;
          if (be) {
            const topY = axisY - 50;
            return (
              <g key={`n-${i}`}>
                <line x1={x} y1={axisY} x2={x} y2={topY} stroke={TERRA} strokeWidth={1.5} />
                <circle cx={x} cy={topY} r={6} fill={TERRA} stroke="#fff" strokeWidth={2} />
                <circle cx={x} cy={topY} r={9} fill="none" stroke={TERRA} strokeWidth={1} opacity={0.45} />
                <text x={x} y={topY - 12} textAnchor="middle" fill="#c2410c" fontSize={11} fontWeight={600}>{n.label}</text>
                {n.sub ? <text x={x} y={topY - 24} textAnchor="middle" fill="#8c8c8a" fontSize={9}>{n.sub}</text> : null}
              </g>
            );
          }
          if (p.legend) {
            // crowded node: small numbered marker on the axis, text moves to the legend below
            const my = p.above ? axisY - 12 : axisY + 12;
            return (
              <g key={`n-${i}`}>
                <line x1={x} y1={axisY} x2={x} y2={my} stroke="#cfc8c3" strokeWidth={1} />
                <circle cx={x} cy={my} r={7} fill="#fff" stroke="#1b1b1a" strokeWidth={1} />
                <text x={x} y={my + 3.2} textAnchor="middle" fill="#1b1b1a" fontSize={8.5} fontWeight={600}>{p.legend}</text>
              </g>
            );
          }
          const stalk = LANE_STALK[p.lane] ?? 22;
          const ny = p.above ? axisY - stalk : axisY + stalk;
          const ty = p.above ? ny - 8 : ny + 14;
          const sy = p.above ? ny - 20 : ny + 26;
          return (
            <g key={`n-${i}`}>
              <line x1={x} y1={axisY} x2={x} y2={ny} stroke="#cfc8c3" strokeWidth={1} />
              <circle cx={x} cy={ny} r={3.5} fill="#1b1b1a" stroke="#fff" strokeWidth={1.5} />
              <text x={x} y={ty} textAnchor={p.anchor} fill="#1b1b1a" fontSize={10.5}>{n.label}</text>
              {n.sub ? <text x={x} y={sy} textAnchor={p.anchor} fill="#8c8c8a" fontSize={9}>{n.sub}</text> : null}
            </g>
          );
        })}
      </svg>

      {/* Numbered legend for any labels that were too crowded to sit on the axis */}
      {legendItems.length > 0 ? (
        <ol className="mt-2 hidden grid-cols-2 gap-x-6 gap-y-1 sm:grid">
          {legendItems.map((p) => (
            <li key={`lg-${p.i}`} className="flex items-baseline gap-2 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
              <span className="fig shrink-0 text-[var(--c-muted)]">{p.legend}.</span>
              <span className="min-w-0">{p.n.label} <span className="text-[var(--c-muted)]">({uLabel(p.n.at)})</span></span>
            </li>
          ))}
        </ol>
      ) : null}

      {/* Mobile vertical rail , CSS-only swap, no horizontal scroll */}
      <ol className="relative ml-1 space-y-3 border-l border-[var(--c-line-strong)] pl-4 sm:hidden">
        {sorted.map((n, i) => {
          const be = n.kind === "breakeven";
          return (
            <li key={`m-${i}`} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: be ? TERRA : "#1b1b1a", boxShadow: be ? "0 0 0 2px rgba(251,132,105,0.35)" : "0 0 0 1px #e7e2df" }} />
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-[length:var(--t-body)] ${be ? "font-semibold text-[var(--terra-text)]" : "font-medium text-[var(--c-ink)]"}`}>{n.label}</span>
                <span className="fig shrink-0 text-[length:var(--t-micro)] text-[var(--c-muted)]">{uLabel(n.at)}</span>
              </div>
              {/* the right-aligned fig already states the time , a sub that merely repeats
                  it ("day 1" twice on one row) is suppressed on this mobile rail */}
              {n.sub && n.sub.trim().toLowerCase() !== uLabel(n.at).toLowerCase() ? <div className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{n.sub}</div> : null}
            </li>
          );
        })}
      </ol>

      {read ? <div className="mt-3 line-clamp-2 border-t border-[var(--c-border)] pt-2.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{read}</div> : null}
    </Box>
  );
}

/* ===== PHASE BAR (WI-6) , rulebook v2 S10/D1/D4, founder decision a (2026-07-09):
 * the placeholder "first year, month by month" milestone Timeline is scrapped
 * everywhere it appeared. It invented weekly milestones ("Lease + licence",
 * "Soft opening", "First clean profit"...) that no seed could actually know. The
 * ONLY two things a first-year read can honestly claim are WHEN the doors open
 * (opening_archetypes.timeToOpenWeeks, modeled, place-invariant) and WHEN the
 * trade crosses break-even (a seed's own ramp_to_breakeven_months, counted from
 * week 0, never from opening). PhaseBar draws ONE bar on a week axis with up to
 * three segments derived ONLY from those two anchors , no milestone list, no
 * invented weeks in between:
 *   Fit-out  , week 0 to openWeek (omitted when openWeek is null/0)
 *   Ramp     , openWeek to breakevenWeek
 *   Profit   , breakevenWeek to the axis end
 * SELF-OMITS (the D-rule: no anchor, no bar) when breakevenWeek is not a finite
 * positive number , a page with no honest break-even source renders nothing
 * rather than fabricate a tick. The break-even tick is the ONE terracotta mark in
 * the box (rationed accent); the three segments stay neutral, darkest to
 * lightest, on EXISTING kit tokens only (var(--c-line-strong) / var(--c-border) /
 * TRACK , no new hex), so the read is schematic, not a chart that needs a
 * caption. When breakevenWeek falls beyond horizonWeeks
 * the axis EXTENDS to meet it and the axis-end label states the true week , a
 * tick never draws past the drawn axis, and the bar never clips a late break-even
 * into a comforting lie. Segment labels + week ranges render as a swatch legend
 * below the bar (StackBar's legend pattern), so the read never needs prose. */
export function PhaseBar({ openWeek, breakevenWeek, horizonWeeks = 52 }: { openWeek: number | null; breakevenWeek: number | null; horizonWeeks?: number }) {
  if (breakevenWeek == null || !Number.isFinite(breakevenWeek) || breakevenWeek <= 0) return null;
  const hasOpen = typeof openWeek === "number" && Number.isFinite(openWeek) && openWeek > 0;
  const openAt = hasOpen ? Math.min(openWeek as number, breakevenWeek) : 0;
  const horizon = Math.max(horizonWeeks, breakevenWeek);
  const pct = (w: number) => Math.max(0, Math.min(100, (w / horizon) * 100));
  const wk = (n: number) => `wk ${Math.round(n)}`;
  const segs: Array<{ label: string; from: number; to: number; color: string }> = [];
  /* THREE PHASES IN THREE NEAR-IDENTICAL GREYS. Line-strong, border and track
     differ by a few percent of luminance, so at the size this renders the three
     phases read as roughly two and the ramp-to-profit boundary vanishes entirely
     under the break-even marker sitting on it. The phases are a SEQUENCE, so they
     step from dark to light in the order they happen, which is also the order of
     how much is at stake. */
  if (openAt > 0) segs.push({ label: "Fit-out", from: 0, to: openAt, color: "var(--c-ink2)" });
  if (breakevenWeek > openAt) segs.push({ label: "Ramp", from: openAt, to: breakevenWeek, color: "var(--c-line-strong)" });
  if (horizon > breakevenWeek) segs.push({ label: "Profit", from: breakevenWeek, to: horizon, color: "var(--c-soft2)" });
  const tickPct = pct(breakevenWeek);
  /* THE ANSWER OUTRANKS THE LEGEND. This card measured a single type size across
     its whole height, so "Break-even, week 26", the one thing the section exists
     to say, carried exactly the same weight as "Fit-out wk 0-wk 16" underneath
     it. Nothing led, so a reader had to read all of it to find the sentence that
     mattered. The answer line below is set at body weight; the legend is not.
     THIS NOTE LIVES HERE, NOT IN THE MARKUP. It was first written inside the JSX
     as a plain block comment rather than a braced one, which is not a comment at
     all in JSX, it is a text child, so five lines of working notes were printed
     on the page for a reader to see. It also sat between the anchor below and the
     placement it protects, far enough apart that the scale-end gate could no
     longer see the clamp and counted the placement as unprotected. */
  const tickAnchor = tickPct < 14 ? "0%" : tickPct > 86 ? "-100%" : "-50%";
  const ariaLabel = `${segs.map((s) => `${s.label} ${wk(s.from)} to ${wk(s.to)}`).join(", ")}; break-even ${wk(breakevenWeek)}`;
  return (
    <div data-idea="I4">
      <div className="relative pt-7">
        <span className="absolute top-0 whitespace-nowrap text-[length:var(--t-body)] font-semibold text-[var(--terra-text)]" style={{ left: `${tickPct}%`, transform: `translateX(${tickAnchor})` }}>Break-even, week {Math.round(breakevenWeek)}</span>
        {/* THE MARKER SITS OUTSIDE THE TRACK, not inside it.
            The track hides its overflow so its segments keep the rounded ends,
            and the break-even dot used to live inside that same box. A dot is
            centred on its position, so at either extreme half of it was cut off
            by the very rounding it was sharing a box with. It reaches an extreme
            whenever break-even lands at or past the end of the horizon, which is
            any ramp of a year or longer.
            It cannot fire today: exactly one trade carries a ramp figure and it
            puts the dot at the halfway mark. This is for the day a slower trade
            gets one, which is the only day anybody would have noticed. */}
        <div className="relative">
          <div className="relative h-3 overflow-hidden rounded-full border border-[var(--c-border)]" role="img" aria-label={ariaLabel}>
            <div className="flex h-full w-full">
              {segs.map((s) => <div key={s.label} className="h-full border-r border-white/70 last:border-0" style={{ width: `${pct(s.to - s.from)}%`, background: s.color }} />)}
            </div>
          </div>
          <span aria-hidden className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${tickPct}%`, background: TERRA, boxShadow: "0 0 0 1px var(--c-border)" }} />
        </div>
        {/* BOTH ENDS OF A RULER ARE WRITTEN ALIKE. This one read "0" at the left and
            "WEEK 52" at the right, one bare and one carrying its unit, so a reader
            had to work out that the bare end was also weeks. Notation N6. */}
        <div className="mt-1.5 flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>week 0</span><span>week {Math.round(horizon)}</span></div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--c-border)] pt-2.5">
        {segs.map((s) => <span key={s.label} className="inline-flex items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label} <Fig className="text-[var(--c-ink)]">{wk(s.from)}-{wk(s.to)}</Fig></span>)}
      </div>
    </div>
  );
}
