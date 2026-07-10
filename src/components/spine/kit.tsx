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
      <AtlasIcon id={id} size={16} className="spine-ic" style={{ color: terra ? "var(--terra-text)" : "var(--c-ink2)" }} />
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
    <div className="text-center">
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
    <svg viewBox="0 0 160 160" className="w-[150px]" role="img" aria-label={`${centerBig} ${centerSub}`}>
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
  return <div className="flex gap-[3px]" role="img" aria-label={`${score} out of ${max}`}>{Array.from({ length: max }).map((_, i) => <span key={i} className="h-[7px] w-[7px] rounded-full" style={{ background: i < score ? (accent ? TERRA : "#1a1a1a") : showTrack ? TRACK : "transparent" }} />)}</div>;
}
/* single 0-100 bar. Neutral grey by default; terracotta only when `accent` marks
 * the one focal figure in the box. */
export function MiniBar({ pct, accent = false }: { pct: number; accent?: boolean }) {
  return <div className="h-[7px] w-full overflow-hidden rounded-full" role="img" aria-label={`${Math.round(pct)} percent`} style={{ background: TRACK }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent ? TERRA : "#bdbdbd" }} /></div>;
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
const GREY_RAMP = ["#a3a3a1", "#b4b4b2", "#c4c4c2", "#d3d3d1", "#e0e0de", "#ebebe9"];
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
  return (
    <>
      <div className={`flex ${h} overflow-hidden ${rounded} border border-[var(--c-border)]${className ? " " + className : ""}`} role="img" aria-label={ariaLabel}>
        {ordered.map((s) => <div key={s.label} className={segCls} style={{ width: `${normalize ? (s.pct / sum) * 100 : s.pct}%`, background: s.color }} title={legend ? undefined : `${s.label} ${s.pct}%`} />)}
      </div>
      {legend ? (
        <div className={legendClassName}>{ordered.map((s) => <span key={s.label} className="inline-flex items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label} <Fig className="text-[var(--c-ink)]">{s.pct}%</Fig></span>)}</div>
      ) : null}
    </>
  );
}
/* margin waterfall , each row a share of revenue, the kept slice terracotta. Cap 2 uses/page. */
export function Waterfall({ rows }: { rows: Array<[string, number, boolean?]> }) {
  return (
    <div className="space-y-2.5">{rows.map(([label, pct, kept]) => (
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
export function SpreadStrip({ p10, p50, p90, fmt, neutral = false }: { p10: number; p50: number; p90: number; fmt: (n: number) => string; neutral?: boolean }) {
  const span = Math.max(1, p90 - p10);
  const mid = Math.max(2, Math.min(98, ((p50 - p10) / span) * 100));
  return (
    <div>
      <div className="relative h-2 rounded-full" role="img" aria-label={`${fmt(p10)} to ${fmt(p90)}, typical ${fmt(p50)}`} style={{ background: neutral ? "#ededed" : "linear-gradient(90deg,#ededed,#ffe1d8)" }}>
        <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${mid}%`, background: neutral ? "var(--c-ink)" : TERRA, boxShadow: "0 0 0 1px #e3e3e3" }} />
      </div>
      <div className="mt-1 flex justify-between text-[length:var(--t-micro)] text-[var(--c-muted)]"><span>{fmt(p10)}</span><span className="font-semibold text-[var(--c-ink)]">{fmt(p50)} typical</span><span>{fmt(p90)}</span></div>
    </div>
  );
}
/* Movement , chapter opener. Rulebook v2 S1/S2 (2026-07-09, founder decision b): the
 * header is index + eyebrow + heading ONLY , index + icon + eyebrow + heading read as
 * oversaturated, so the icon tile is gone. `icon` stays in the prop type as a tolerated
 * no-op (accepted, never rendered) so the ~140 existing call sites keep compiling without
 * a page-by-page edit; do not delete it. The accent NEVER sits on the eyebrow text (the
 * founder reads terra-on-top as "orange on top") , the leading .fig section index (muted
 * grey) is now the only accent carrier. Eyebrow is neutral. The heading is de-bolded
 * (decision b: semibold 20/24px, not bold 24/30px , S1 flagged the old size/weight as
 * too loud to read as professional). */
export function Movement({ eyebrow, heading, sample, icon, index }: { eyebrow: string; heading: string; sample?: boolean; icon?: AtlasIconId; index?: string }) {
  return (
    <div className="mb-3 mt-12">
      <div className="mb-1.5 flex items-center gap-2.5">
        {index ? <span className="fig text-[length:var(--t-body)] font-semibold text-[var(--c-muted)]">{index}</span> : null}
        <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-ink2)]">{eyebrow}</span>
        {sample ? <SampleTag /> : null}
      </div>
      <h2 data-typography="custom" className="text-[length:var(--t-sub)] font-semibold tracking-tight text-[var(--c-ink)]">{heading}</h2>
    </div>
  );
}
/* Box , the premium card: warm hairline + inner paper top-highlight + paper gradient.
 * Radius 14px. No edge stripe. Rulebook v2 S14/decision e (2026-07-09): the DROP shadow
 * is gone (cards with a drop-shadow "look mediocre"); this REVERSES the 2026-07-08
 * publish-pass "tokenized warm shadow" decision. The card keeps only the faint inset
 * paper top-highlight (`inset 0 1px 0 rgba(255,255,255,0.9)`) so it still reads as a
 * lifted sheet of paper, just without the 30px drop shadow or the 0.5px inner ring.
 * `shadow-card` / `shadow-lift` (Tailwind, design-tokens.ts) are NOT deleted here: other
 * pages still consume those tokens directly; Box just stops applying them. `elevation`
 * is kept in the prop type as a tolerated no-op (both call sites, home2-view.tsx:261/309,
 * keep compiling) , it no longer has a visual effect now that the drop shadow it
 * selected between is gone. */
const DENSITY_PAD: Record<"dense" | "default" | "lead", string> = { dense: "p-4", default: "p-5", lead: "p-7" };
export function Box({ children, className = "", elevation = "card", density = "default" }: { children: React.ReactNode; className?: string; elevation?: "card" | "lift"; density?: "dense" | "default" | "lead" }) {
  void elevation;
  return (
    <div
      className={`rounded-[14px] border border-[var(--c-border)] ${DENSITY_PAD[density]} ${className}`}
      style={{
        backgroundImage: "linear-gradient(180deg, #ffffff 0%, #fcfbfa 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
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
export function EaseScale({ rows, endLabels, plain = false }: { rows: Array<[string, number, string, string?]>; endLabels?: [string, string]; plain?: boolean }) {
  return (
    <div className="space-y-3.5">{rows.map(([label, pos, word, sub]) => (
      <div key={label} className="hov -mx-2 grid grid-cols-[150px_1fr] items-center gap-3 rounded-md px-2 py-1.5">
        <span className="text-[length:var(--t-body)] leading-tight text-[var(--c-ink2)]">{label}{sub ? <span className="mt-0.5 block text-[length:var(--t-micro)] text-[var(--c-muted)]">{sub}</span> : null}</span>
        <div className="relative h-1.5 rounded-full" role="img" aria-label={`${label}: ${word}`} style={{ background: plain ? "#e6e6e6" : "linear-gradient(90deg,#e6e6e6,#ffe1d8)" }}>
          <div className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${pos}%` }}>
            <span className="h-3 w-3 rounded-full border-2 border-white" style={{ background: "var(--c-ink)", boxShadow: "0 0 0 1px #e3e3e3" }} />
          </div>
          <span className="absolute -top-5 -translate-x-1/2 whitespace-nowrap text-[length:var(--t-micro)] font-medium text-[var(--c-ink2)]" style={{ left: `${pos}%` }}>{word}</span>
        </div>
      </div>))}
      {endLabels ? (
        <div aria-hidden className="grid grid-cols-[150px_1fr] items-center gap-3">
          <span />
          <div className="flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>{endLabels[0]}</span><span>{endLabels[1]}</span></div>
        </div>
      ) : null}
    </div>
  );
}
/* a slim labelled meter for a single 0-100 read (NOT a dial) */
export function Meter({ value, left, right }: { value: number; left: string; right: string }) {
  return (
    <div>
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
/* Head , subsection header. Rulebook v2 S2: no icon in any section header, so this is a
 * THIRD header the Movement fix does not reach (EasiestTrades/IncomeCurve/MarginKept/
 * CityRisks/Locals/Close etc. all open with Head, not Movement). `icon` stays in the prop
 * type as a tolerated no-op (accepted, never rendered) so the ~22 existing call sites keep
 * compiling. */
export function Head({ children, sample, icon }: { children: React.ReactNode; sample?: boolean; icon?: AtlasIconId }) {
  void icon;
  return <div className="mb-3 flex items-center gap-2"><span className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{children}</span>{sample ? <SampleTag /> : null}</div>;
}
/* InfoTip , THE educational "?" gloss (rule 24: teach as you inform; rule 7: jargon gets
 * a gloss). A focusable button trigger, so it works on TAP at 390px (focus shows the tip),
 * not just hover; the gloss also rides the aria-label for screen readers. Educational copy
 * only , never sole-source data (that stays visible text). Promoted from the country page. */
export function InfoTip({ gloss, className = "ml-1" }: { gloss: string; className?: string }) {
  return (
    <span className={`group/tip relative inline-flex align-middle ${className}`}>
      <button type="button" aria-label={gloss} className="grid h-3.5 w-3.5 cursor-help place-items-center rounded-full border border-[var(--c-line-strong)] text-[length:var(--t-micro)] font-semibold leading-none text-[var(--c-muted)]">?</button>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 w-44 -translate-x-1/2 rounded-lg border border-[var(--c-border)] bg-[var(--c-card)] px-2.5 py-1.5 text-[length:var(--t-micro)] font-normal normal-case leading-snug tracking-normal text-[var(--c-ink2)] opacity-0 shadow-[0_6px_18px_-8px_rgba(43,28,22,0.22)] transition-opacity group-focus-within/tip:opacity-100 group-hover/tip:opacity-100">{gloss}</span>
    </span>
  );
}
/* SpectraTable , the character two-pole spectra (promoted from the country page so city +
 * country share ONE idiom, rule 22). `gradient` = the track runs dark-gray (LEFT = worse
 * for business) to terracotta (RIGHT = better) and the right pole reads bold ink; without
 * it the track is neutral with a centre tick and BOTH poles carry equal weight (no implied
 * better end , form must not assert a direction the copy disclaims). `glossFor` supplies
 * the per-spectrum "?" gloss, rendered LEFT of the row per the founder's spec. */
export function SpectraTable({ rows, gradient = false, glossFor }: { rows: any[]; gradient?: boolean; glossFor?: (spectrum: string) => string | undefined }) {
  if (!rows?.length) return null;
  return (
    <div className="divide-y divide-[var(--c-border)]">
      {rows.map((r: any, i: number) => {
        const pos = Math.max(5, Math.min(95, Math.round((r.position_0_1 ?? 0.5) * 100)));
        const right = pos >= 50;
        const gloss = glossFor?.(r.spectrum);
        return (
          <div key={i} className="hov -mx-2 grid grid-cols-[130px_1fr_118px] items-center gap-2 rounded-md px-2 py-2">
            <span className={`flex items-center text-[length:var(--t-micro)] leading-tight ${gradient ? "text-[var(--c-muted)]" : "text-[var(--c-ink2)]"}`}>
              {gloss ? <InfoTip gloss={gloss} className="mr-1.5" /> : null}
              {r.left_label}
            </span>
            <span className="relative block h-[6px] rounded-full" role="img" aria-label={`${r.left_label} to ${r.right_label}: leans ${right ? r.right_label : r.left_label}`} style={{ background: gradient ? "linear-gradient(90deg, #6f6f6d, var(--terra))" : "#ecebe9" }}>
              {!gradient ? <span className="absolute -bottom-[3px] -top-[3px] left-1/2 w-px" style={{ background: "var(--c-border)" }} /> : null}
              <span className="absolute top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${pos}%`, background: "var(--c-ink)", boxShadow: "0 0 0 1px #e3e3e3" }} />
            </span>
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
  return <div className="flex gap-3 border-b border-[var(--c-border)] py-2 last:border-0"><span className="w-24 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{k}</span><span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{v}</span></div>;
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
  Gauge, Donut, StackBar, Waterfall, SpreadStrip, EaseScale, Meter, SpectraTable, Spectrum, Timeline, Spark, Dots, MiniBar, PhaseBar,
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
  return <div className="flex flex-col gap-4 md:flex-row md:items-stretch [&>*]:flex-1">{children}</div>;
}
export const Even = Row;
/* T2 , 3:2: a chart (flex-[3]) paired with a SCHEMATIC rail (flex-[2]) , stats, chips, a
 * legend, KV rows. Rulebook v2 S7: a chart must explain itself by its form (direct labels,
 * axis units, a one-line legend); the rail beside it is NEVER an explanatory paragraph. If
 * the rail content is a paragraph, the chart's own labeling is the thing to fix. */
export function WideRail({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 md:flex-row md:items-stretch [&>*:first-child]:md:flex-[3] [&>*:last-child]:md:flex-[2] [&>*]:flex-1">{children}</div>;
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
  return <div className="space-y-3">{rows.map((r: any, i: number) => (
    <div key={i}><div className="mb-1 flex justify-between text-[length:var(--t-micro)] text-[var(--c-ink2)]"><span>{r.left_label}</span><span>{r.right_label}</span></div>
      <div className="relative h-1.5 rounded-full" role="img" aria-label={`${r.left_label} to ${r.right_label}`} style={{ background: "linear-gradient(90deg,#fb8469,#d4d4d4 52%,#737373)" }}><div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--c-ink)]" style={{ left: `${Math.round((r.position_0_1 || 0) * 100)}%`, boxShadow: "0 0 0 1px #e3e3e3" }} /></div></div>))}</div>;
}
export function CatRows({ rows }: { rows: Array<[string, any]> }) {
  return <div className="divide-y divide-[var(--c-border)]">{rows.map(([k, v]) => v ? <div key={k} className="hov -mx-2 flex gap-3 rounded-md px-2 py-1.5"><span className="w-28 shrink-0 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{k}</span><span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{v}</span></div> : null)}</div>;
}

/* ===== SECTION ANATOMY PRIMITIVES (WI-3) ===== */

/* Rail , the section opener: kicker + one-glance verdict line. Replaces the Head-then-grid
 * pattern. Rulebook v2 S2: the icon is gone here too (this wave only removes Rail's icon ,
 * the verdict slot is the sanctioned answer-first line, decision f, and stays). `icon` and
 * `tone` stay in the prop type as tolerated no-ops (accepted, never rendered) so existing
 * call sites keep compiling. The verdict is plain present-tense English, no number-restating,
 * hard-capped at one sentence , fix multi-sentence offenders at the call site, not here. */
export function Rail({ icon, kicker, verdict, tone = "ink" }: { icon?: AtlasIconId; kicker: string; verdict?: React.ReactNode; tone?: "ink" | "terra" }) {
  void icon;
  void tone;
  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{kicker}</span>
      </div>
      {verdict != null ? <p className="text-[length:var(--t-lead)] font-medium leading-snug text-[var(--c-ink)]">{verdict}</p> : null}
    </div>
  );
}

/* Stat , one figure with a locked scale contract. focal vs support keeps a >=1.6
 * type-scale contrast so the focal always dominates. Terracotta only on the focal. */
export function Stat({ value, label, sub, size = "support", accent = false }: { value: React.ReactNode; label?: string; sub?: string; size?: "focal" | "support"; accent?: boolean }) {
  const focal = size === "focal";
  return (
    <div>
      {label ? <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</div> : null}
      <div className={`fig leading-none ${focal ? "text-[38px] md:text-[42px]" : "text-[length:var(--t-body)]"}`} style={{ color: accent ? "var(--terra-text)" : "var(--c-ink)" }}>{value}</div>
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
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }} role="img" aria-label="trend sparkline" preserveAspectRatio="none">
      <path d={area} fill={TERRA} opacity={0.12} />
      <path d={line} fill="none" stroke={TERRA} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(mi)} cy={Y(values[mi])} r={2.4} fill={TERRA} stroke="#fff" strokeWidth={1} />
    </svg>
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
    <Box>
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
  if (openAt > 0) segs.push({ label: "Fit-out", from: 0, to: openAt, color: "var(--c-line-strong)" });
  if (breakevenWeek > openAt) segs.push({ label: "Ramp", from: openAt, to: breakevenWeek, color: "var(--c-border)" });
  if (horizon > breakevenWeek) segs.push({ label: "Profit", from: breakevenWeek, to: horizon, color: TRACK });
  const tickPct = pct(breakevenWeek);
  const tickAnchor = tickPct < 14 ? "0%" : tickPct > 86 ? "-100%" : "-50%";
  const ariaLabel = `${segs.map((s) => `${s.label} ${wk(s.from)} to ${wk(s.to)}`).join(", ")}; break-even ${wk(breakevenWeek)}`;
  return (
    <div>
      <div className="relative pt-6">
        <span className="absolute top-0 whitespace-nowrap text-[length:var(--t-micro)] font-semibold text-[var(--terra-text)]" style={{ left: `${tickPct}%`, transform: `translateX(${tickAnchor})` }}>Break-even, week {Math.round(breakevenWeek)}</span>
        <div className="relative h-3 overflow-hidden rounded-full border border-[var(--c-border)]" role="img" aria-label={ariaLabel}>
          <div className="flex h-full w-full">
            {segs.map((s) => <div key={s.label} className="h-full border-r border-white/70 last:border-0" style={{ width: `${pct(s.to - s.from)}%`, background: s.color }} />)}
          </div>
          <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${tickPct}%`, background: TERRA, boxShadow: "0 0 0 1px var(--c-border)" }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[length:var(--t-micro)] uppercase tracking-wide text-[var(--c-muted)]"><span>0</span><span>week {Math.round(horizon)}</span></div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--c-border)] pt-2.5">
        {segs.map((s) => <span key={s.label} className="inline-flex items-center gap-1.5 text-[length:var(--t-micro)] text-[var(--c-ink2)]"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label} <Fig className="text-[var(--c-ink)]">{wk(s.from)}-{wk(s.to)}</Fig></span>)}
      </div>
    </div>
  );
}
