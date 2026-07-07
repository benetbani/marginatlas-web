/**
 * Spine kit-index , the load-bearing SHARED PRIMITIVES for the uncovered-pages
 * archetypes (homepage / AtlasIndex / decision-engine / compare / geo-hub).
 *
 * One canonical row / table / lock / sort grammar so the 6 archetypes do NOT each
 * fork their own. Composed READ-ONLY from kit.tsx atoms (Box, Stat, Fig, StackBar,
 * MiniBar, Ico, Chip). Geist text + Space Grotesk figures (.fig); soft terracotta
 * (#fb8469 fill / #c2410c accent) on the kept/leading/winning slice only.
 *
 * HARD LAWS baked in here so consumers cannot regress:
 *  - NEVER horizontal scroll. Multi-column rows + tables reflow to stacked mini-cards
 *    at <=375px (the cell-page Nearby pattern), proven on the /dev/spine-kit showcase.
 *  - NEVER rank business x geography, NEVER raw-USD across geographies. The comparison
 *    grammar is ENTITY-SCOPED and margin-%/share-based by construction (the value
 *    formatter is supplied per-row; callers pass shares, not cross-regime dollars).
 *  - Best-per-row/column = bold + terracotta text, no glyph. Home/neutral row tinted,
 *    never ranked , ENFORCED: bestEntityForRow never crowns an entity flagged
 *    home (or excludeFromBest); the best marker goes to the best NON-home entity.
 *  - In-cell bars only on a DRAWN scale: CellScaleBar declares its domain and draws
 *    a baseline tick (plus an optional reference tick), so truncation is visible.
 *
 * Raw hex OK on this dev surface (tokenize on promotion).
 * Chips: LockPill wraps the canonical ui/pill.tsx (see kit.tsx header loyalty notes).
 */
import * as React from "react";
import { AtlasIcon, type AtlasIconId } from "@/components/brand/icons";
import { Pill } from "@/components/ui/pill";
import { Box, Fig, Ico, MiniBar, Stat, StackBar, TERRA, TRACK } from "./kit";
import { AtlasMark } from "./marks";

/* ============================================================================
 * SHARED TYPES , one vocabulary for "a decision signal" across every primitive.
 * A SignalCell is one right-aligned tabular support figure (ease / cost / demand).
 * `higherIsBetter` lets SortHeader + best-in-column resolve a winner without
 * the caller restating direction per consumer.
 * ========================================================================== */
export type SignalKey = string;
export type SignalDef = {
  key: SignalKey;
  label: string;
  /** short unit shown muted in the header, e.g. "%", "/100". Indices carry NO inline
   * unit: bare figures in cells, the base named once in the header/caption. NEVER a
   * raw-USD cross-geo unit. */
  unit?: string;
  higherIsBetter?: boolean;
  /** optional in-cell bar UNDER the figure, drawn on a DECLARED domain (never a hidden
   * truncated one): a baseline tick marks the domain start, `refValue` (e.g. city = 100)
   * draws a reference tick. Without it the cell renders the figure alone, as before. */
  bar?: { domain: [number, number]; refValue?: number };
};
/** A support figure for one entity on one signal. value null = withheld (renders a dash). */
export type SignalValue = { key: SignalKey; value: number | null; display?: string };

const dash = "–";
const fmtSignal = (sv: SignalValue | undefined, unit?: string) =>
  !sv || sv.value == null ? dash : sv.display ?? `${sv.value}${unit ?? ""}`;

/* ============================================================================
 * CellScaleBar , the ONLY legal in-cell bar. An in-cell bar on a hidden truncated
 * domain lies about proportion; this one DECLARES its domain and draws it: a faint
 * baseline tick at the domain start (so a non-zero start is visible, not hidden)
 * and an optional ink reference tick at `refValue` (e.g. city = 100 for an index).
 * The adjacent Fig carries the number; the bar is aria-hidden shape only.
 * Exported so page-level tables can adopt the same drawn-scale grammar.
 * ========================================================================== */
export function CellScaleBar({ value, domain, refValue, accent = false }: { value: number | null | undefined; domain: [number, number]; refValue?: number; accent?: boolean }) {
  if (value == null) return null;
  const [lo, hi] = domain;
  const span = hi - lo || 1;
  const pos = (v: number) => Math.max(0, Math.min(100, ((v - lo) / span) * 100));
  /* With a refValue the bar renders as a DIVERGENCE from the reference tick (fill runs
   * from the tick to the value), because a length filled from a truncated domain's left
   * edge lies about proportion (a 120-vs-76 pair on a [60,130] domain drew ~3.7:1 for a
   * true 1.6:1). Without a refValue it stays the zero-based fill for true 0..N domains. */
  const from = refValue != null ? Math.min(pos(value), pos(refValue)) : 0;
  const width = refValue != null ? Math.abs(pos(value) - pos(refValue)) : pos(value);
  return (
    <span aria-hidden className="relative mt-1 block h-[5px] w-full rounded-full" style={{ background: TRACK }}>
      <span className="absolute inset-y-0 block rounded-full" style={{ left: `${from}%`, width: `${Math.max(width, 1)}%`, background: accent ? TERRA : "#bdbdbd" }} />
      {/* baseline tick , the drawn domain start */}
      <span className="absolute -bottom-[2px] -top-[2px] left-0 w-px" style={{ background: "var(--c-line-strong)" }} />
      {refValue != null ? <span className="absolute -bottom-[2px] -top-[2px] w-px -translate-x-1/2" style={{ left: `${pos(refValue)}%`, background: "var(--c-ink2)" }} /> : null}
    </span>
  );
}

/* small shared lock glyph (no padlock in the AtlasIcon set) , inline so LockVeil + LockPill share it */
function LockGlyph({ size = 16, color = "var(--terra-text)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-label="locked" style={{ color }}>
      <rect x={5} y={10.5} width={14} height={9.5} rx={2} stroke="currentColor" strokeWidth={1.8} />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={12} cy={15} r={1.4} fill="currentColor" />
    </svg>
  );
}

/* ============================================================================
 * 1. DecisionRow , the hairline decision/ranking list row.
 *
 * leading flag/AtlasIcon tile + name (optional href) + ONE focal signal cell
 * (terracotta StackBar + Stat = "margin kept") + N right-aligned .fig support
 * cells. Hover lift + terracotta top-edge. Home-row tint (never ranked).
 *
 * MANDATORY reflow: at <=375px it stacks to a mini-card , the focal stays
 * prominent, the support cells drop to a 2-up footer. NEVER horizontal scroll.
 * Implemented CSS-only (sm: breakpoint swap), so it is SSR-safe.
 * ========================================================================== */
export type DecisionDatum = {
  id: string;
  name: string;
  href?: string;
  /** leading glyph: a flag emoji string OR an AtlasIcon id. */
  flag?: string;
  icon?: AtlasIconId;
  /** the ONE focal signal: the kept share (0-100). Rendered as a terracotta StackBar + %. */
  keptPct: number;
  keptLabel?: string;
  keptKnown?: boolean; // false => the focal is unknown: render a dash, not "0%"
  /** N right-aligned support figures (ease / cost / demand). */
  support: SignalValue[];
  /** tint + "you are here" affordance. Never affects rank order. */
  home?: boolean;
};
export function DecisionRow({ d, signals }: { d: DecisionDatum; signals: SignalDef[] }) {
  const Tag: any = d.href ? "a" : "div";
  const lead = (
    <div className="flex min-w-0 items-center gap-2.5">
      {d.flag ? (
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] text-[15px]">{d.flag}</span>
      ) : d.icon ? (
        <Ico id={d.icon} />
      ) : null}
      <span className="min-w-0 truncate text-[14px] font-semibold text-[var(--c-ink)]">{d.name}</span>
    </div>
  );
  const focal = (
    <div>
      <div className="mb-1 flex items-baseline gap-1.5">
        {d.keptKnown === false ? (
          <Fig className="text-[15px] text-[var(--c-muted)]">{"–"}</Fig>
        ) : (
          <>
            <Fig className="text-[15px] text-[var(--terra-text)]">{d.keptPct}%</Fig>
            <span className="text-[10px] uppercase tracking-wide text-[var(--c-muted)]">{d.keptLabel ?? "kept"}</span>
          </>
        )}
      </div>
      {/* sort={false}: this is a kept-share METER (fill reads left-to-right), not a
       * cost stack, so the StackBar honesty sort must not pin the kept slice last. */}
      <StackBar h="h-2" rounded="rounded-full" sort={false} ariaLabel={d.keptKnown === false ? "figure pending" : `${d.keptPct}% ${d.keptLabel ?? "kept"}`} segments={[{ label: "kept", pct: d.keptKnown === false ? 0 : d.keptPct, color: TERRA }, { label: "spent", pct: 100 - (d.keptKnown === false ? 0 : d.keptPct), color: TRACK }]} />
    </div>
  );
  return (
    <Tag
      href={d.href}
      className="hovrow group relative -mx-2 block rounded-lg px-2 py-2.5 sm:grid sm:grid-cols-[1.5fr_1.4fr_repeat(var(--n),minmax(0,1fr))] sm:items-center sm:gap-3"
      style={{ ["--n" as any]: d.support.length, ...(d.home ? { background: "#fff4f1" } : {}) }}
    >
      {/* terracotta top-edge on hover (mirrors .cityhov language) */}
      <span aria-hidden className="topedge pointer-events-none absolute inset-x-2 top-0 h-[2px] rounded-full opacity-0 transition-opacity" style={{ background: TERRA }} />
      {/* leading */}
      <div className="flex items-center justify-between gap-2 sm:block">
        {lead}
        {d.home ? <span className="shrink-0 rounded-full bg-[var(--terra-soft)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--terra-text)] sm:hidden">here</span> : null}
      </div>
      {/* focal (full width on mobile, its own column on sm+) */}
      <div className="mt-2.5 sm:mt-0">{focal}</div>
      {/* support , a 2-up footer on mobile, right-aligned columns on sm+ */}
      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:contents sm:mt-0">
        {signals.map((s) => {
          const sv = d.support.find((x) => x.key === s.key);
          return (
            <div key={s.key} className="min-w-0 sm:text-right">
              <span className="block text-[9.5px] uppercase tracking-wide text-[var(--c-muted)] sm:hidden">{s.label}</span>
              <Fig className="text-[13px] text-[var(--c-ink)]">{fmtSignal(sv, s.unit)}</Fig>
              {s.bar ? <CellScaleBar value={sv?.value} domain={s.bar.domain} refValue={s.bar.refValue} /> : null}
            </div>
          );
        })}
      </div>
    </Tag>
  );
}
/** the header row that labels a DecisionRow list (desktop only). Pair with SortHeader for click-sort. */
export function DecisionRowHeader({ signals, sort, onSort }: { signals: SignalDef[]; sort?: SortState; onSort?: (key: string) => void }) {
  return (
    <div className="hidden grid-cols-[1.5fr_1.4fr_repeat(var(--n),minmax(0,1fr))] items-end gap-3 border-b border-[var(--c-border)] px-2 pb-2 sm:grid" style={{ ["--n" as any]: signals.length }}>
      <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Place</span>
      <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">Margin kept</span>
      {signals.map((s) =>
        onSort ? <SortHeader key={s.key} label={s.label} unit={s.unit} active={sort?.key === s.key} dir={sort?.dir} onClick={() => onSort(s.key)} /> : (
          <span key={s.key} className="text-right text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{s.label}{s.unit ? <span className="font-normal"> ({s.unit})</span> : null}</span>
        )
      )}
    </div>
  );
}

/* ============================================================================
 * 3. SortHeader , click-to-sort column header (direction arrow + active rule).
 * Shared by the DecisionRow list and the CompareTable. Pure presentational; the
 * caller owns the sort state (so it stays SSR-safe / no required client island).
 * ========================================================================== */
export type SortDir = "asc" | "desc";
export type SortState = { key: string; dir: SortDir };
export function SortHeader({ label, unit, active = false, dir = "desc", onClick, align = "right" }: { label: string; unit?: string; active?: boolean; dir?: SortDir; onClick?: () => void; align?: "left" | "right" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={`group flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide transition-colors ${align === "right" ? "justify-end text-right" : "text-left"} ${active ? "text-[var(--terra-text)]" : "text-[var(--c-muted)] hover:text-[var(--c-ink2)]"}`}
    >
      <span>{label}{unit ? <span className="font-normal lowercase tracking-normal"> ({unit})</span> : null}</span>
      <span aria-hidden className={`fig text-[10px] leading-none transition ${active ? "opacity-100" : "opacity-30 group-hover:opacity-60"}`}>{active ? (dir === "asc" ? "↑" : "↓") : "↕"}</span>
    </button>
  );
}

/* ============================================================================
 * 4. RankBars , a labelled horizontal ranking bar-list. Right-aligned values,
 * terracotta on the leading/kept slice (#1), grey on the rest, hover lift,
 * optional per-row href. ENTITY-SCOPED (one trade across places, or one place's
 * trades) , NEVER cross-geography ranking. Bars scale to the leader.
 * ========================================================================== */
export type RankDatum = { id: string; label: string; value: number; href?: string; display?: string; icon?: AtlasIconId };
export function RankBars({ rows, max, valueUnit = "", leaderId }: { rows: RankDatum[]; max?: number; valueUnit?: string; leaderId?: string }) {
  if (!rows.length) return null;
  const top = max ?? Math.max(...rows.map((r) => r.value));
  const lead = leaderId ?? rows.reduce((a, b) => (b.value > a.value ? b : a), rows[0]).id;
  const anyIcon = rows.some((r) => r.icon);
  return (
    <div className="space-y-1">
      {rows.map((r) => {
        const Tag: any = r.href ? "a" : "div";
        const isLead = r.id === lead;
        return (
          <Tag key={r.id} href={r.href} className="hov -mx-2 grid grid-cols-[minmax(0,1fr)_3.4rem] items-center gap-3 rounded-md px-2 py-1.5">
            <span className={`grid items-center gap-2.5 ${anyIcon ? "grid-cols-[18px_minmax(0,9rem)_minmax(0,1fr)]" : "grid-cols-[minmax(0,9rem)_minmax(0,1fr)]"}`}>
              {anyIcon ? (r.icon ? <AtlasIcon id={r.icon} size={16} className="spine-ic shrink-0" style={{ color: isLead ? "var(--terra-text)" : "var(--c-ink2)" }} /> : <span aria-hidden />) : null}
              <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink2)]">{r.label}</span>
              <span className="h-2 overflow-hidden rounded-full" style={{ background: TRACK }}>
                <span className="block h-full rounded-full" role="img" aria-label={`${r.label}: ${r.display ?? r.value}${valueUnit}`} style={{ width: `${Math.max(2, (r.value / (top || 1)) * 100)}%`, background: isLead ? TERRA : "#c8c8c6" }} />
              </span>
            </span>
            <Fig className={`text-right text-[13px] ${isLead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{r.display ?? `${r.value}${valueUnit}`}</Fig>
          </Tag>
        );
      })}
    </div>
  );
}

/* ============================================================================
 * 2. CompareTable / SortableFactsTable , ONE canonical comparison grammar.
 *
 * Entities as COLUMNS, decision metrics as ROWS. Best-per-row = bold + terracotta
 * (no glyph). Home/neutral column tinted, never ranked. Withheld cell = dash.
 * Entity-scoped + margin-%/share-based BY CONSTRUCTION: the table takes percent /
 * share / index rows only, NEVER raw USD across geographies (enforced by the
 * `CompareRow.unit` contract being a share/index unit, and the doc here).
 *
 * MANDATORY reflow: at <=375px it reflows to stacked per-entity mini-cards (the
 * cell-page Nearby pattern). NO horizontal scroll. CSS-only swap, SSR-safe.
 * ========================================================================== */
export type CompareEntity = {
  id: string;
  name: string;
  flag?: string;
  home?: boolean;
  /** exclude this entity from the best-per-row crown. DEFAULTS to the `home` flag,
   * so the caption's promise ("the home row is tinted, never ranked") is enforced
   * without call-site edits. Pass excludeFromBest={false} to opt a home entity back in. */
  excludeFromBest?: boolean;
};
export type CompareRow = {
  key: string;
  label: string;
  /** share unit only ("%", "/100"). Index rows carry NO unit (bare figures; name the
   * base once in the caption). NEVER a cross-geo USD unit. */
  unit?: string;
  higherIsBetter?: boolean;
  /** per-entity value keyed by entity id. null = withheld (dash). */
  values: Record<string, number | null>;
  display?: Record<string, string>;
  /** optional in-cell bar under each figure, on a DECLARED drawn domain (CellScaleBar:
   * baseline tick at the domain start, optional reference tick at `refValue`).
   * Desktop columns only; the mobile mini-cards stay figure-only. Omit = figures alone. */
  bar?: { domain: [number, number]; refValue?: number };
};
/* the best crown never lands on a home/excluded entity , the home row is tinted, never ranked */
function bestEntityForRow(row: CompareRow, entities: CompareEntity[]): string | null {
  const eligible = entities.filter((e) => !(e.excludeFromBest ?? e.home));
  const vals = eligible.map((e) => ({ id: e.id, v: row.values[e.id] })).filter((x) => x.v != null) as Array<{ id: string; v: number }>;
  if (vals.length < 2) return null;
  const hib = row.higherIsBetter !== false;
  return vals.reduce((a, b) => ((hib ? b.v > a.v : b.v < a.v) ? b : a), vals[0]).id;
}
const cellText = (row: CompareRow, id: string) => (row.values[id] == null ? dash : row.display?.[id] ?? `${row.values[id]}${row.unit ?? ""}`);
export function CompareTable({ entities, rows, caption }: { entities: CompareEntity[]; rows: CompareRow[]; caption?: string }) {
  const cols = `minmax(0,1.2fr) repeat(${entities.length},minmax(0,1fr))`;
  return (
    <div>
      {/* sm+ : entities as columns */}
      <div className="hidden sm:block">
        <div className="grid items-end gap-3 border-b border-[var(--c-border)] pb-2 text-[10.5px] font-semibold uppercase tracking-wide" style={{ gridTemplateColumns: cols }}>
          <span className="text-[var(--c-muted)]">Metric</span>
          {entities.map((e) => (
            <span key={e.id} className="text-right text-[var(--c-ink)]" style={e.home ? { color: "var(--terra-text)" } : undefined}>
              {e.flag ? <span className="mr-1">{e.flag}</span> : null}{e.name}
            </span>
          ))}
        </div>
        <div className="divide-y divide-[var(--c-border)]">
          {rows.map((row) => {
            const best = bestEntityForRow(row, entities);
            return (
              <div key={row.key} className="grid items-center gap-3 py-2.5" style={{ gridTemplateColumns: cols }}>
                <span className="text-[11.5px] font-medium text-[var(--c-ink2)]">{row.label}{row.unit ? <span className="text-[var(--c-muted)]"> ({row.unit})</span> : null}</span>
                {entities.map((e) => (
                  <span key={e.id} className="text-right" style={e.home ? { background: "#fff4f1", borderRadius: 6, paddingInline: 6 } : undefined}>
                    <Fig className={`text-[13px] ${e.id === best ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{cellText(row, e.id)}</Fig>
                    {row.bar ? <CellScaleBar value={row.values[e.id]} domain={row.bar.domain} refValue={row.bar.refValue} /> : null}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {/* <=375px : stacked per-entity mini-cards (Nearby pattern) */}
      <div className="grid grid-cols-1 gap-2.5 sm:hidden">
        {entities.map((e) => (
          <div key={e.id} className="rounded-lg border border-[var(--c-border)] p-3" style={e.home ? { background: "#fff4f1" } : undefined}>
            <div className="mb-2 flex items-center gap-2 border-b border-[var(--c-border)] pb-1.5">
              {e.flag ? <span className="text-[15px]">{e.flag}</span> : null}
              <span className="text-[13px] font-semibold text-[var(--c-ink)]">{e.name}</span>
              {e.home ? <span className="ml-auto rounded-full bg-[var(--terra-soft)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">here</span> : null}
            </div>
            <div className="space-y-1">
              {rows.map((row) => {
                const best = bestEntityForRow(row, entities);
                return (
                  <div key={row.key} className="flex items-baseline justify-between gap-3">
                    <span className="text-[11.5px] text-[var(--c-ink2)]">{row.label}{row.unit ? <span className="text-[var(--c-muted)]"> ({row.unit})</span> : null}</span>
                    <Fig className={`text-[13px] ${e.id === best ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{cellText(row, e.id)}</Fig>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {caption ? <div className="mt-2 text-[11px] text-[var(--c-muted)]">{caption}</div> : <div className="mt-2 text-[11px] text-[var(--c-muted)]">Best in each metric is bold. {`Shares and rates only, compared like for like. No cross-country dollar amounts.`}</div>}
    </div>
  );
}
/** alias , the plan names this SortableFactsTable in some archetypes; same grammar. */
export const SortableFactsTable = CompareTable;

/* ============================================================================
 * 5. LockVeil , the free/Pro gate. Renders the REAL wrapped content, blurred +
 * figure-masked (value is VISIBLE not hidden), with a centered lock tile + an
 * "Unlock with Pro" CTA. Standalone on the spine palette (BlurredOverlay uses the
 * old cream/atlas tokens, so we re-house the same idea here). `unlocked` flips it
 * to the real content for the showcase / post-purchase state.
 * ========================================================================== */
export function LockVeil({ unlocked = false, headline = "Pro depth", note, cta = "Unlock with Pro", onUnlock, children }: { unlocked?: boolean; headline?: string; note?: string; cta?: string; onUnlock?: () => void; children: React.ReactNode }) {
  if (unlocked) return <>{children}</>;
  return (
    <div className="relative overflow-hidden rounded-[12px]" data-lock="veil">
      {/* the real content, blurred + masked. Stays in the DOM for crawlers + a11y structure. */}
      <div aria-hidden className="pointer-events-none select-none" style={{ filter: "blur(5px)", opacity: 0.5 }}>{children}</div>
      {/* a calm warm wash, not a heavy scrim */}
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,241,237,0.62))" }} />
      {/* centered lock tile + CTA */}
      <div className="absolute inset-0 grid place-items-center px-4">
        <div className="w-full max-w-[300px] rounded-xl border border-[var(--terra-border)] bg-[var(--c-card)] p-4 text-center shadow-[0_8px_24px_-12px_rgba(43,28,22,0.18)]">
          <span className="mx-auto mb-2.5 grid h-9 w-9 place-items-center rounded-lg border border-[var(--terra-border)]" style={{ background: "var(--terra-soft)" }}><AtlasMark id="pro-lock" size={22} /></span>
          <div className="text-[13px] font-semibold text-[var(--c-ink)]">{headline}</div>
          {note ? <p className="mx-auto mt-1 max-w-[34ch] text-[11.5px] leading-snug text-[var(--c-ink2)]">{note}</p> : null}
          <button type="button" onClick={onUnlock} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--terra-text)" }}>
            <LockGlyph size={13} color="#fff" /> {cta}
          </button>
        </div>
      </div>
    </div>
  );
}
/** a compact inline lock chip for single masked cells (e.g. a dollar take-home figure in a
 * free row). Thin wrapper over the canonical ui/pill.tsx (loyalty decision, kit.tsx header):
 * Pill carries the chip anatomy; the hinted classes remap its subtle variant onto the spine
 * terra vars and undo the sm-size uppercase/tracking so the render is byte-identical. */
export function LockPill({ label = "Pro" }: { label?: string }) {
  return (
    <Pill variant="subtle" size="sm" className="normal-case tracking-normal border-[color:var(--terra-border)] bg-[color:var(--terra-soft)] px-2 py-0.5 text-[10px] text-[color:var(--terra-text)]">
      <LockGlyph size={11} /> {label}
    </Pill>
  );
}

/* ============================================================================
 * 6. ControlRail , sticky search + segmented signal-sort + facet chips + live
 * result count .fig. Client island, SSR-SAFE: it is a controlled component, so
 * the server renders a static first list and this rail hydrates over it. All
 * handlers are optional , with none wired it degrades to a static header.
 * ========================================================================== */
export type Facet = { key: string; label: string };
export function ControlRail({ query = "", onQuery, sortKey, sortOptions, onSort, facets = [], activeFacets = [], onToggleFacet, count, total, placeholder = "Search…" }: {
  query?: string; onQuery?: (v: string) => void;
  sortKey?: string; sortOptions: SignalDef[]; onSort?: (key: string) => void;
  facets?: Facet[]; activeFacets?: string[]; onToggleFacet?: (key: string) => void;
  count: number; total?: number; placeholder?: string;
}) {
  return (
    <div className="sticky top-2 z-10 rounded-[12px] border border-[var(--c-border)] bg-[var(--c-card)]/95 p-3 backdrop-blur-sm" style={{ boxShadow: "0 1px 1px rgba(43,28,22,0.04), 0 8px 24px -16px rgba(43,28,22,0.12)" }}>
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        {/* search */}
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-2.5 py-1.5 lg:max-w-[18rem]">
          <AtlasIcon id="search" size={14} style={{ color: "var(--c-muted)" }} />
          <input value={query} onChange={(e) => onQuery?.(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--c-ink)] outline-none placeholder:text-[var(--c-muted)]" />
        </label>
        {/* segmented signal-sort */}
        <div className="flex items-center gap-2">
          <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)] sm:inline">Rank by</span>
          <div className="inline-flex overflow-hidden rounded-lg border border-[var(--c-border)]">
            {sortOptions.map((o) => {
              const on = o.key === sortKey;
              return (
                <button key={o.key} type="button" onClick={() => onSort?.(o.key)} className={`px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${on ? "text-white" : "text-[var(--c-ink2)] hover:bg-[var(--c-soft)]"}`} style={on ? { background: "var(--terra-text)" } : undefined} aria-pressed={on}>
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {(facets.length > 0 || count != null) ? (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-[var(--c-border)] pt-2.5">
          {facets.map((f) => {
            const on = activeFacets.includes(f.key);
            return (
              <button key={f.key} type="button" onClick={() => onToggleFacet?.(f.key)} aria-pressed={on} className={`rounded-full border px-2.5 py-0.5 text-[11px] transition-colors ${on ? "border-[var(--terra-border)] bg-[var(--terra-soft)] text-[var(--terra-text)]" : "border-[var(--c-border)] bg-[var(--c-soft)] text-[var(--c-ink2)] hover:bg-[var(--c-soft2)]"}`}>
                {f.label}
              </button>
            );
          })}
          <span className="ml-auto text-[11px] text-[var(--c-muted)]"><Fig className="text-[var(--c-ink)]">{count}</Fig>{total != null ? <> of <Fig className="text-[var(--c-ink)]">{total}</Fig></> : null} shown</span>
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================================
 * 7. Pager , numbered pagination / load-more footer with .fig count. Handles
 * large-list overflow with NO infinite horizontal scroll (a fixed window of
 * page buttons with ellipses, plus an optional "Show more" affordance).
 * ========================================================================== */
function pageWindow(page: number, pages: number): Array<number | "gap"> {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: Array<number | "gap"> = [1];
  const lo = Math.max(2, page - 1), hi = Math.min(pages - 1, page + 1);
  if (lo > 2) out.push("gap");
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < pages - 1) out.push("gap");
  out.push(pages);
  return out;
}
export function Pager({ page, pages, onPage, total, perPage, onMore }: { page: number; pages: number; onPage?: (p: number) => void; total?: number; perPage?: number; onMore?: () => void }) {
  if (pages <= 1 && !onMore) return null;
  const shownTo = perPage ? Math.min((total ?? 0), page * perPage) : undefined;
  return (
    <div className="mt-4 flex flex-col items-center gap-2.5 border-t border-[var(--c-border)] pt-4 sm:flex-row sm:justify-between">
      <span className="text-[11.5px] text-[var(--c-muted)]">
        {total != null && perPage != null ? <>Showing <Fig className="text-[var(--c-ink)]">{shownTo}</Fig> of <Fig className="text-[var(--c-ink)]">{total}</Fig></> : <>Page <Fig className="text-[var(--c-ink)]">{page}</Fig> of <Fig className="text-[var(--c-ink)]">{pages}</Fig></>}
      </span>
      {onMore ? (
        <button type="button" onClick={onMore} disabled={page >= pages} className="rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] px-4 py-1.5 text-[12px] font-semibold text-[var(--c-ink2)] transition-colors hover:bg-[var(--c-soft2)] disabled:opacity-40">Show more</button>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-1">
          <button type="button" onClick={() => onPage?.(page - 1)} disabled={page <= 1} className="rounded-md px-2 py-1 text-[12px] text-[var(--c-ink2)] hover:bg-[var(--c-soft)] disabled:opacity-30">{"←"}</button>
          {pageWindow(page, pages).map((p, i) =>
            p === "gap" ? <span key={`g${i}`} className="px-1 text-[12px] text-[var(--c-muted)]">{"…"}</span> : (
              <button key={p} type="button" onClick={() => onPage?.(p)} aria-current={p === page} className={`fig min-w-[1.9rem] rounded-md px-2 py-1 text-[12px] transition-colors ${p === page ? "text-white" : "text-[var(--c-ink2)] hover:bg-[var(--c-soft)]"}`} style={p === page ? { background: "var(--terra-text)" } : undefined}>{p}</button>
            )
          )}
          <button type="button" onClick={() => onPage?.(page + 1)} disabled={page >= pages} className="rounded-md px-2 py-1 text-[12px] text-[var(--c-ink2)] hover:bg-[var(--c-soft)] disabled:opacity-30">{"→"}</button>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * 8. CompareTray , bottom sticky multi-select bar -> "Compare N" hand-off.
 * No horizontal scroll: the selected chips wrap (capped with a "+N more" pill).
 * Controlled; the parent owns selection state.
 * ========================================================================== */
export type TrayItem = { id: string; name: string };
export function CompareTray({ items, onRemove, onClear, onCompare, max = 3 }: { items: TrayItem[]; onRemove?: (id: string) => void; onClear?: () => void; onCompare?: () => void; max?: number }) {
  if (items.length === 0) return null;
  const shown = items.slice(0, 4);
  const overflow = items.length - shown.length;
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-3">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-2 rounded-[14px] border border-[var(--c-border)] bg-[var(--c-card)] px-3 py-2.5" style={{ boxShadow: "0 -2px 8px -4px rgba(43,28,22,0.10), 0 8px 24px -12px rgba(43,28,22,0.18)" }}>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Compare</span>
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {shown.map((it) => (
            <span key={it.id} className="inline-flex items-center gap-1 rounded-full border border-[var(--c-border)] bg-[var(--c-soft)] py-0.5 pl-2.5 pr-1 text-[11.5px] text-[var(--c-ink2)]">
              <span className="max-w-[8rem] truncate">{it.name}</span>
              <button type="button" onClick={() => onRemove?.(it.id)} aria-label={`Remove ${it.name}`} className="grid h-4 w-4 place-items-center rounded-full text-[var(--c-muted)] hover:bg-[var(--c-soft2)] hover:text-[var(--c-ink)]">{"×"}</button>
            </span>
          ))}
          {overflow > 0 ? <span className="rounded-full bg-[var(--c-soft2)] px-2 py-0.5 text-[11px] text-[var(--c-muted)]">+{overflow} more</span> : null}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={onClear} className="text-[11.5px] text-[var(--c-muted)] hover:text-[var(--c-ink2)]">Clear</button>
          <button type="button" onClick={onCompare} disabled={items.length < 2 || items.length > max} className="rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40" style={{ background: "var(--terra-text)" }}>Compare {items.length}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 9. WinnerCard , a verdict masthead naming a single ranked winner. Data-source
 * agnostic: works for "best trade IN a place" OR "best place FOR a trade".
 * focal keep .fig + one-line why + a 3-cell terra figure strip. The honesty
 * counterweight ("the catch") sits BESIDE the verdict (risk #5 in the plan).
 * ========================================================================== */
export type WinnerStrip = { value: string; label: string };
export function WinnerCard({ kicker, winner, keptPct, keptLabel = "owner keeps", why, catch: theCatch, strip, icon = "verdict" }: {
  kicker: string; winner: string; keptPct: number; keptLabel?: string; why: string; catch?: string; strip: [WinnerStrip, WinnerStrip, WinnerStrip]; icon?: AtlasIconId;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--terra-border)] bg-[var(--c-card)]">
      <div className="p-5 md:p-6">
        <div className="mb-1.5 flex items-center gap-2"><Ico id={icon} tone="terra" /><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--terra-text)]">{kicker}</span></div>
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <h2 data-typography="custom" className="text-2xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2rem]">{winner}</h2>
            <p className="mt-2 max-w-prose text-[13.5px] leading-snug text-[var(--c-ink2)]">{why}</p>
            {theCatch ? (
              <p className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2 text-[12.5px] leading-snug text-[var(--c-ink2)]">
                <span className="mt-0.5 shrink-0 text-[var(--terra-text)]"><AtlasIcon id="honest-take" size={14} /></span>
                <span><span className="font-semibold text-[var(--c-ink)]">The catch. </span>{theCatch}</span>
              </p>
            ) : null}
          </div>
          <div>
            <Stat size="focal" accent value={`${keptPct}%`} label={keptLabel} sub="of sales reaches the owner" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px border-t border-[var(--terra-border)]" style={{ background: "var(--terra)" }}>
        {strip.map((s) => (
          <div key={s.label} className="bg-[var(--c-card)] px-3 py-2.5"><Fig className="text-[15px] text-[var(--c-ink)]">{s.value}</Fig><div className="text-[9px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{s.label}</div></div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * 10. Podium , top-3 ranked cards. rank-index .fig + keep figure as a focal Stat
 * + MiniBar scaled to the leader. Terracotta ONLY on #1 (no progress-bar element;
 * MiniBar reuses the kit atom but the leader carries the accent via copy + index).
 * ========================================================================== */
export type PodiumDatum = { id: string; name: string; keptPct: number; sub?: string; href?: string };
export function Podium({ items, keptLabel = "kept" }: { items: [PodiumDatum, PodiumDatum, PodiumDatum] | PodiumDatum[]; keptLabel?: string }) {
  const top = items.slice(0, 3);
  const leader = Math.max(...top.map((t) => t.keptPct));
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {top.map((t, i) => {
        const first = i === 0;
        const Tag: any = t.href ? "a" : "div";
        return (
          <Tag key={t.id} href={t.href} className={`cityhov block rounded-[12px] border bg-[var(--c-card)] p-4 ${first ? "border-[var(--terra-border)]" : "border-[var(--c-border)]"}`} style={first ? { background: "linear-gradient(180deg,#ffffff,#fffaf8)" } : undefined}>
            <div className="mb-2 flex items-center justify-between">
              <span className={`fig text-[13px] font-semibold ${first ? "text-[var(--terra-text)]" : "text-[var(--c-muted)]"}`}>#{i + 1}</span>
              {first ? <span className="rounded-full bg-[var(--terra-soft)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">top pick</span> : null}
            </div>
            <div className="text-[14px] font-semibold text-[var(--c-ink)]">{t.name}</div>
            <div className="mt-2"><Stat size="focal" accent={first} value={`${t.keptPct}%`} sub={t.sub ?? keptLabel} /></div>
            <div className="mt-2.5" style={first ? undefined : { filter: "grayscale(1)", opacity: 0.85 }}><MiniBar pct={(t.keptPct / (leader || 1)) * 100} /></div>
          </Tag>
        );
      })}
    </div>
  );
}

/* ============================================================================
 * 11. MarginIndexBadge , the signature per-page score mark (strategy 2026-07-07:
 * ONE unified 0-100 composite score of keep/ease/risk/demand, shown as a prominent,
 * recognizable badge on every page and driving the leaderboard + recommender).
 * Anatomy: a ring whose terracotta arc IS the score (the box's one accent), the
 * .fig score centered, an ink compass tick at 12 o'clock (the brand's compass nod),
 * and an optional side label. CSS vars only; no raw hex. `score` null-safe: no
 * honest score -> render nothing (never a fabricated 0).
 * ========================================================================== */
export function MarginIndexBadge({ score, size = 62, label = "Margin Index", sub = "composite, 0 to 100", showLabel = true }: { score: number | null | undefined; size?: number; label?: string; sub?: string; showLabel?: boolean }) {
  if (score == null || !Number.isFinite(score)) return null;
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const r = 26;
  const C = 2 * Math.PI * r;
  const arc = (s / 100) * C;
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label={`${label}: ${s} of 100`} style={{ flexShrink: 0 }}>
        <circle cx="32" cy="32" r={r} fill="var(--c-card)" stroke="var(--c-border)" strokeWidth="3.5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--terra)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${arc.toFixed(1)} ${(C - arc).toFixed(1)}`} transform="rotate(-90 32 32)" />
        {/* the compass tick, the brand nod: a small ink needle at due north */}
        <path d="M32 2.6l2.3 4.6h-4.6z" fill="var(--c-ink)" />
        <text x="32" y="37.5" textAnchor="middle" fontSize="17.5" fontWeight="600" fill="var(--c-ink)" style={{ fontFamily: "var(--font-grotesk)", fontVariantNumeric: "tabular-nums" }}>{s}</text>
      </svg>
      {showLabel ? (
        <span className="leading-tight">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--c-ink)]">{label}</span>
          <span className="block text-[10px] text-[var(--c-muted)]">{sub}</span>
        </span>
      ) : null}
    </div>
  );
}

/* shared hover styles for the row primitives (top-edge reveal + lift). Injected once. */
export function KitIndexStyles() {
  return (
    <style>{`.spine-scope .hovrow{transition:background-color .15s ease-out,transform .15s ease-out}
.spine-scope .hovrow:hover{background:var(--c-soft);transform:translateY(-1px)}
.spine-scope .hovrow:hover .topedge{opacity:1}
@media (prefers-reduced-motion:reduce){.spine-scope .hovrow{transition:none}.spine-scope .hovrow:hover{transform:none}}`}</style>
  );
}
