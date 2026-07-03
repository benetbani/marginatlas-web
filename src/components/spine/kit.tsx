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
 *  - Elevation: Box's DROP shadows come from the tokenized elevation scale in
 *    design-tokens.ts (Tailwind shadow-card / shadow-lift). Only the paper
 *    insets (top highlight + 0.5px inner ring) remain local to Box.
 *  - Tooltips: kit atoms are consumed by SERVER components, so no Radix
 *    ui/tooltip here. Law: no kit atom may hide sole-source data behind a
 *    native title= attribute; StackBar keeps its per-segment title= only when
 *    it renders WITHOUT its legend (the legend is the visible carrier).
 */
import * as React from "react";
import { AtlasIcon, type AtlasIconId } from "@/components/brand/icons";
import { Pill } from "@/components/ui/pill";

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
  const v = Math.max(0, Math.min(100, value || 0));
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
      {sub ? <div className="-mt-1 text-[11px] uppercase tracking-wide text-[var(--c-muted)]">{sub}</div> : null}
    </div>
  );
}
export function Donut({ segs, centerBig, centerSub }: { segs: Array<[string, number, string]>; centerBig: string; centerSub: string }) {
  const r = 54, C = 2 * Math.PI * r; let off = 0;
  return (
    <svg viewBox="0 0 160 160" className="w-[150px]" role="img" aria-label={`${centerBig} ${centerSub}`}>
      {segs.map(([name, pct, color]) => {
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
        <div className={legendClassName}>{ordered.map((s) => <span key={s.label} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--c-ink2)]"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label} <Fig className="text-[var(--c-ink)]">{s.pct}%</Fig></span>)}</div>
      ) : null}
    </>
  );
}
/* margin waterfall , each row a share of revenue, the kept slice terracotta. Cap 2 uses/page. */
export function Waterfall({ rows }: { rows: Array<[string, number, boolean?]> }) {
  return (
    <div className="space-y-2.5">{rows.map(([label, pct, kept]) => (
      <div key={label} className="grid grid-cols-[120px_1fr_44px] items-center gap-3">
        <span className="text-[12px] text-[var(--c-ink2)]">{label}</span>
        <div className="h-5 overflow-hidden rounded" style={{ background: "#f0f0f0" }}><div className="h-full rounded" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: kept ? TERRA : "#bdbdbd" }} role="img" aria-label={`${label} ${pct}%`} /></div>
        <Fig className="text-right text-[13px] text-[var(--c-ink)]">{pct}%</Fig>
      </div>))}
    </div>
  );
}
/* percentile spread strip , p10..p90 with the typical (p50) marked. Cap 2 uses/page. */
export function SpreadStrip({ p10, p50, p90, fmt }: { p10: number; p50: number; p90: number; fmt: (n: number) => string }) {
  const span = Math.max(1, p90 - p10);
  const mid = Math.max(2, Math.min(98, ((p50 - p10) / span) * 100));
  return (
    <div>
      <div className="relative h-2 rounded-full" role="img" aria-label={`${fmt(p10)} to ${fmt(p90)}, typical ${fmt(p50)}`} style={{ background: "linear-gradient(90deg,#ededed,#ffe1d8)" }}>
        <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${mid}%`, background: TERRA, boxShadow: "0 0 0 1px #e3e3e3" }} />
      </div>
      <div className="mt-1 flex justify-between text-[10.5px] text-[var(--c-muted)]"><span>{fmt(p10)}</span><span className="font-semibold text-[var(--c-ink)]">{fmt(p50)} typical</span><span>{fmt(p90)}</span></div>
    </div>
  );
}
/* Movement , chapter opener. The accent NEVER sits on the eyebrow text (the founder
 * reads terra-on-top as "orange on top"). It moves onto two carriers only: a leading
 * .fig section index (muted grey) + the grounded terra icon tile. Eyebrow is neutral. */
export function Movement({ eyebrow, heading, sample, icon, index }: { eyebrow: string; heading: string; sample?: boolean; icon: AtlasIconId; index?: string }) {
  return (
    <div className="mb-3 mt-12">
      <div className="mb-1.5 flex items-center gap-2.5">
        {index ? <span className="fig text-[13px] font-semibold text-[var(--c-muted)]">{index}</span> : null}
        <Ico id={icon} tone="terra" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--c-ink2)]">{eyebrow}</span>
        {sample ? <span className="rounded-full bg-[var(--c-soft2)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--c-muted)]">sample data</span> : null}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-[var(--c-ink)] md:text-3xl">{heading}</h2>
    </div>
  );
}
/* Box , the premium card: warm hairline + tokenized warm shadow + inner top-highlight +
 * paper gradient. Radius 14px. Warm shadows only (never pure black). No edge stripe.
 * DROP shadows come from the design-tokens elevation scale (Tailwind shadow-card /
 * shadow-lift set --tw-shadow); the two INSET layers stay local and compose with the
 * token via var(--tw-shadow) in the inline box-shadow. `elevation` picks the resting
 * plane: "card" (default, the workhorse) or "lift" (cards floating over the photo margin). */
export function Box({ children, className = "", elevation = "card" }: { children: React.ReactNode; className?: string; elevation?: "card" | "lift" }) {
  return (
    <div
      className={`rounded-[14px] border border-[var(--c-border)] p-5 ${elevation === "lift" ? "shadow-lift" : "shadow-card"} ${className}`}
      style={{
        backgroundImage: "linear-gradient(180deg, #ffffff 0%, #fcfbfa 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(27,24,22,0.015), var(--tw-shadow, 0 0 #0000)",
      }}
    >
      {children}
    </div>
  );
}
/* one shared left-to-right scale with N labelled markers. Optional 4th tuple = a who-for
 * subtitle under the label. Optional `endLabels` names the two ends of the shared track
 * (small muted uppercase, Meter's pattern) so the scale is never anonymous; rendered once
 * under the row set, aligned to the track column. Default undefined = the historical render. */
export function EaseScale({ rows, endLabels }: { rows: Array<[string, number, string, string?]>; endLabels?: [string, string] }) {
  return (
    <div className="space-y-3.5">{rows.map(([label, pos, word, sub]) => (
      <div key={label} className="hov -mx-2 grid grid-cols-[150px_1fr] items-center gap-3 rounded-md px-2 py-1.5">
        <span className="text-[12.5px] leading-tight text-[var(--c-ink2)]">{label}{sub ? <span className="mt-0.5 block text-[10.5px] text-[var(--c-muted)]">{sub}</span> : null}</span>
        <div className="relative h-1.5 rounded-full" role="img" aria-label={`${label}: ${word}`} style={{ background: "linear-gradient(90deg,#e6e6e6,#ffe1d8)" }}>
          <div className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${pos}%` }}>
            <span className="h-3 w-3 rounded-full border-2 border-white" style={{ background: "var(--c-ink)", boxShadow: "0 0 0 1px #e3e3e3" }} />
          </div>
          <span className="absolute -top-5 -translate-x-1/2 text-[11px] font-medium text-[var(--c-ink2)]" style={{ left: `${pos}%` }}>{word}</span>
        </div>
      </div>))}
      {endLabels ? (
        <div aria-hidden className="grid grid-cols-[150px_1fr] items-center gap-3">
          <span />
          <div className="flex justify-between text-[10px] uppercase tracking-wide text-[var(--c-muted)]"><span>{endLabels[0]}</span><span>{endLabels[1]}</span></div>
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
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wide text-[var(--c-muted)]"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}
export function Head({ children, sample, icon }: { children: React.ReactNode; sample?: boolean; icon?: AtlasIconId }) {
  return <div className="mb-3 flex items-center gap-2">{icon ? <Ico id={icon} /> : null}<span className="text-[15px] font-semibold text-[var(--c-ink)]">{children}</span>{sample ? <span className="rounded-full bg-[var(--c-soft2)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--c-muted)]">sample</span> : null}</div>;
}
/* Chip , thin spine-palette wrapper over the canonical ui/pill.tsx (loyalty decision,
 * see header). Signature unchanged; the hinted arbitrary classes override Pill's
 * neutral variant onto the spine CSS vars via tailwind-merge. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <Pill variant="neutral" className="border-[color:var(--c-border)] bg-[color:var(--c-soft)] px-2.5 py-0.5 text-[11px] font-normal text-[color:var(--c-ink2)]">
      {children}
    </Pill>
  );
}
export function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex gap-3 border-b border-[var(--c-border)] py-2 last:border-0"><span className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{k}</span><span className="text-[13px] text-[var(--c-ink)]">{v}</span></div>;
}
/* inline "+" disclosure , a flat terracotta summary line that rotates the + on open.
 * Canonicalises the hand-rolled "see the detail" rows (cost base / line-by-line tax /
 * discretionary split). The caller supplies its own body wrapper as children so each
 * instance keeps its exact body layout; `className` carries the per-instance details
 * styling (e.g. the top hairline). Distinct from Expand (the boxed single-open row). */
export function InlineDisclosure({ name, summary, className = "group mt-3", children }: { name: string; summary: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <details name={name} className={className}>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[12px] font-medium text-[var(--terra-text)]"><span className="text-base text-[var(--c-muted)] transition group-open:rotate-45 group-open:text-[var(--terra-text)]">+</span> {summary}</summary>
      {children}
    </details>
  );
}
/* single-open expandable row , progressive disclosure */
export function Expand({ name, title, right, children, open }: { name: string; title: string; right?: React.ReactNode; children: React.ReactNode; open?: boolean }) {
  return (
    <details name={name} open={open} className="group overflow-hidden rounded-lg border border-[var(--c-border)] open:border-[var(--c-line-strong)] open:shadow-[0_1px_2px_rgba(27,24,22,0.04)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-[var(--c-soft)] px-3.5 py-2.5 transition hover:bg-[var(--c-soft2)] group-open:bg-[var(--terra-soft)]">
        <span className="text-[13px] font-semibold text-[var(--c-ink)] group-open:text-[var(--terra-text)]">{title}</span>
        <span className="flex items-center gap-3">{right}<span className="text-base text-[#c9c9c9] transition group-open:rotate-45 group-open:text-[var(--terra-text)]">+</span></span>
      </summary>
      <div className="px-3.5 pb-3 pt-1 text-[12.5px] leading-snug text-[var(--c-ink2)]">{children}</div>
    </details>
  );
}
/* bullet list , neutral dots (bullets are never the accent). */
export function Bullets({ items }: { items: string[] }) {
  return <ul className="space-y-2">{items.map((t, i) => <li key={i} className="relative pl-4 text-[12.5px] leading-snug text-[var(--c-ink2)]"><span className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full" style={{ background: "#c9c9c9" }} />{t}</li>)}</ul>;
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
/* T2 , 3:2: a chart that needs prose beside it (flex-[3] chart + flex-[2] rail). */
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
    <div key={i}><div className="mb-1 flex justify-between text-[11px] text-[var(--c-ink2)]"><span>{r.left_label}</span><span>{r.right_label}</span></div>
      <div className="relative h-1.5 rounded-full" role="img" aria-label={`${r.left_label} to ${r.right_label}`} style={{ background: "linear-gradient(90deg,#fb8469,#d4d4d4 52%,#737373)" }}><div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--c-ink)]" style={{ left: `${Math.round((r.position_0_1 || 0) * 100)}%`, boxShadow: "0 0 0 1px #e3e3e3" }} /></div></div>))}</div>;
}
export function CatRows({ rows }: { rows: Array<[string, any]> }) {
  return <div className="divide-y divide-[var(--c-border)]">{rows.map(([k, v]) => v ? <div key={k} className="hov -mx-2 flex gap-3 rounded-md px-2 py-1.5"><span className="w-28 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{k}</span><span className="text-[12.5px] text-[var(--c-ink2)]">{v}</span></div> : null)}</div>;
}

/* ===== SECTION ANATOMY PRIMITIVES (WI-3) ===== */

/* Rail , the section opener: icon + kicker + one-glance verdict line. Replaces the
 * Head-then-grid pattern. The verdict is plain present-tense English, no number-restating. */
export function Rail({ icon, kicker, verdict, tone = "ink" }: { icon?: AtlasIconId; kicker: string; verdict: React.ReactNode; tone?: "ink" | "terra" }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center gap-2">
        {icon ? <Ico id={icon} tone={tone} /> : null}
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{kicker}</span>
      </div>
      <p className="text-[15px] font-medium leading-snug text-[var(--c-ink)]">{verdict}</p>
    </div>
  );
}

/* Stat , one figure with a locked scale contract. focal vs support keeps a >=1.6
 * type-scale contrast so the focal always dominates. Terracotta only on the focal. */
export function Stat({ value, label, sub, size = "support", accent = false }: { value: React.ReactNode; label?: string; sub?: string; size?: "focal" | "support"; accent?: boolean }) {
  const focal = size === "focal";
  return (
    <div>
      {label ? <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</div> : null}
      <div className={`fig leading-none ${focal ? "text-[38px] md:text-[42px]" : "text-[13px]"}`} style={{ color: accent ? "var(--terra-text)" : "var(--c-ink)" }}>{value}</div>
      {sub ? <div className={`text-[var(--c-muted)] ${focal ? "mt-1.5 text-[12px]" : "mt-0.5 text-[11px]"}`}>{sub}</div> : null}
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
 * time. Desktop = SVG; mobile = CSS-only vertical rail (no JS, SSR-safe, no h-scroll). */
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
            <li key={`lg-${p.i}`} className="flex items-baseline gap-2 text-[11px] text-[var(--c-ink2)]">
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
                <span className={`text-[12.5px] ${be ? "font-semibold text-[var(--terra-text)]" : "font-medium text-[var(--c-ink)]"}`}>{n.label}</span>
                <span className="fig shrink-0 text-[10.5px] text-[var(--c-muted)]">{uLabel(n.at)}</span>
              </div>
              {n.sub ? <div className="text-[11px] text-[var(--c-muted)]">{n.sub}</div> : null}
            </li>
          );
        })}
      </ol>

      {read ? <div className="mt-3 border-t border-[var(--c-border)] pt-2.5 text-[12.5px] leading-snug text-[var(--c-ink2)]">{read}</div> : null}
    </Box>
  );
}
