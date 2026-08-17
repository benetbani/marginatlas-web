/**
 * Atlas table family - shared atoms + the one density / alignment grammar.
 *
 * This is the Tailwind translation of the design's table-system.css (.atbl-*):
 * one hairline under the header, whitespace row grouping (no per-row gridline,
 * no zebra), tabular right-aligned figures, the quiet terracotta leader tint,
 * the honest dash, the faint warm hover wash, the caption-with-diamond. Every
 * value is a token (atlas / cocoa / cream / ink / clay), never a raw hex / px /
 * ms. moss and amber left this file on 2026-08-17; both hues are banned.
 *
 * The atoms here are the load-bearing pieces every variant composes from so the
 * whole family reads as one system: TableShell (card + eyebrow + heading + lede
 * + caption), Figure (the honest-dash cell value), MeaningChip (break-in ease),
 * InlineBar (cost split), RangeTrack (low-median-high), and the small format
 * helpers. No source-agency names, no em-dashes.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { stepChipTone } from "@/lib/scores/band_tone";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/* ------------------------------------------------------------------ */
/* tiny guards + the honest dash                                       */
/* ------------------------------------------------------------------ */

export function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
export function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/** The honest "not held yet" mark. An en dash, never a 0, never blank. */
export const DASH = "–";

/* ------------------------------------------------------------------ */
/* TableShell - the card frame every table sits in.                    */
/*   warm-frame-clean-data law: the FRAME (card, hairline border, the   */
/*   eyebrow + heading + lede + caption) carries the warmth; the table  */
/*   itself stays clean, opaque, high-contrast.                         */
/* ------------------------------------------------------------------ */

export type TableShellProps = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** The caption-with-diamond line under the table. */
  caption?: React.ReactNode;
  /** A second, quieter footnote line under the caption (no diamond). */
  footnote?: string;
  id?: string;
  /** When false, render bare (no card) so a table can sit inside a BeatCard. */
  framed?: boolean;
  className?: string;
  children: React.ReactNode;
  /** Accessible label when there is no visible heading. */
  ariaLabel?: string;
};

export function TableShell({
  eyebrow,
  heading,
  lede,
  caption,
  footnote,
  id,
  framed = true,
  className,
  children,
  ariaLabel,
}: TableShellProps) {
  const body = (
    <>
      {hasText(eyebrow) ? <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow> : null}
      {hasText(heading) ? (
        <h2 className="font-display text-xl font-medium tracking-tight text-balance text-ink-900 md:text-2xl">
          {heading}
        </h2>
      ) : null}
      {hasText(lede) ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
          {lede}
        </p>
      ) : null}

      <div className={cn(hasText(heading) || hasText(eyebrow) || hasText(lede) ? "mt-5" : "")}>
        {children}
      </div>

      {caption != null ? (
        <p className="mt-3.5 flex items-baseline gap-2 text-xs leading-relaxed text-cocoa-700">
          <span
            aria-hidden="true"
            className="mt-1.5 inline-block h-[5px] w-[5px] shrink-0 rotate-45 rounded-[1px] bg-atlas-500"
          />
          <span>{caption}</span>
        </p>
      ) : null}
      {hasText(footnote) ? (
        <p className="mt-2 text-[11px] leading-relaxed text-cocoa-700">{footnote}</p>
      ) : null}
    </>
  );

  if (!framed) {
    return (
      <div id={id} className={className}>
        {body}
      </div>
    );
  }

  return (
    <section
      id={id}
      aria-label={heading || eyebrow || ariaLabel || "Comparison"}
      className={cn(
        // Canonical surface: was "rounded-lg border border-parchment bg-cream-50".
        "atlas-card",
        "px-5 py-5 md:px-7 md:py-6",
        className,
      )}
    >
      {body}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Figure - one figure cell value, honest-dash aware.                  */
/*   right-aligned, tabular, high-contrast ink. The lone place data     */
/*   wears the accent is the leader tint (quiet terracotta wash).       */
/* ------------------------------------------------------------------ */

export type FigureTone = "default" | "pos" | "neg" | "accent" | "muted";

/* pos/neg is the signed-delta form of the same good-versus-bad axis, so it
   takes the same answer: terracotta for the side that favours the reader, a
   deepening cocoa for the side that does not. It was moss and amber until
   2026-08-17, both banned outright. `pos` and `accent` land on the same value
   because a figure that is both the leader and positive should not fight
   itself; the leader cell is separated by its own bg-atlas-50 tint. */
const FIGURE_TONE: Record<FigureTone, string> = {
  default: "text-ink-900",
  pos: "text-atlas-700",
  neg: "text-cocoa-900",
  accent: "text-atlas-700",
  muted: "text-cocoa-700",
};

/** The shared figure-cell className (used by the <td> variants directly). */
export function figureCellClass({
  held,
  leader = false,
  tone = "default",
  emphasis = false,
}: {
  held: boolean;
  leader?: boolean;
  tone?: FigureTone;
  emphasis?: boolean;
}): string {
  return cn(
    "px-3 py-3 text-right align-middle font-semibold tabular-nums",
    !held
      ? "font-medium text-cocoa-700"
      : leader
        ? "rounded-md bg-atlas-50 font-bold text-atlas-700"
        : emphasis
          ? "font-bold text-ink-900"
          : FIGURE_TONE[tone],
  );
}

/* ------------------------------------------------------------------ */
/* MeaningChip - the small break-in-ease / severity badge.             */
/*                                                                     */
/*   THIS IS THE SAME SCALE AS THE BREAK-IN BADGE, not a second one:    */
/*   the city page maps BreakInBand straight onto ChipTone, so a chip    */
/*   here and a pill on the country page describe one number. Its       */
/*   colour therefore comes from the family's one module rather than    */
/*   from a local table. It read moss / amber / clay, three banned or   */
/*   near-banned hues; it now runs terracotta draining to a true        */
/*   neutral, which is what the palette ruling asks for and what the    */
/*   pill on the other pages does.                                      */
/* ------------------------------------------------------------------ */

export type ChipTone = "easy" | "moderate" | "hard" | "neutral";

const CHIP_TONE: Record<ChipTone, { wrap: string; dot: string }> = {
  easy: stepChipTone(3),
  moderate: stepChipTone(2),
  hard: stepChipTone(0),
  /* "neutral" is NOT the bottom of the ladder: it means no verdict was made,
     which is a different statement from "this one is hard". It keeps its own
     quiet grey and its lighter dot so the two never read as the same chip. */
  neutral: { wrap: "bg-cream-200 text-cocoa-700", dot: "bg-cocoa-300" },
};

export function MeaningChip({
  tone = "neutral",
  dot = true,
  children,
}: {
  tone?: ChipTone;
  dot?: boolean;
  children: React.ReactNode;
}) {
  const t = CHIP_TONE[tone] ?? CHIP_TONE.neutral;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5",
        "text-[11.5px] font-semibold leading-tight",
        t.wrap,
      )}
    >
      {dot ? <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", t.dot)} /> : null}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* InlineBar - the proportional cost-split bar.                        */
/* ------------------------------------------------------------------ */

export function InlineBar({
  pct,
  accent = false,
  className,
}: {
  /** 0..100. */
  pct: number;
  accent?: boolean;
  className?: string;
}) {
  const w = Math.max(2, Math.min(100, pct));
  return (
    <div
      className={cn("relative h-[9px] overflow-hidden rounded-full bg-ink-900/[0.07]", className)}
      role="presentation"
    >
      <div
        className={cn("absolute inset-y-0 left-0 rounded-full", accent ? "bg-atlas-500" : "bg-ink-700")}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RangeTrack - the low-median-high range track (one row).             */
/*   a faint terracotta span between low and high, a vivid median tick. */
/* ------------------------------------------------------------------ */

export function RangeTrack({
  low,
  median,
  high,
  domainLow,
  domainHigh,
  className,
}: {
  low?: number | null;
  median?: number | null;
  high?: number | null;
  domainLow: number;
  domainHigh: number;
  className?: string;
}) {
  const span = domainHigh - domainLow || 1;
  const at = (v: number) => `${((v - domainLow) / span) * 100}%`;
  const left = isNum(low) ? low : isNum(median) ? median : null;
  const right = isNum(high) ? high : isNum(median) ? median : null;
  const showSpan = isNum(left) && isNum(right) && right > left;
  return (
    <div className={cn("relative h-1.5 rounded-full bg-ink-900/[0.07]", className)} role="presentation">
      {showSpan ? (
        <div
          className="absolute inset-y-0 rounded-full bg-atlas-500/[0.18]"
          style={{ left: at(left as number), right: `calc(100% - ${at(right as number)})` }}
        />
      ) : null}
      {isNum(median) ? (
        <div
          className="absolute top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-atlas-500"
          style={{ left: at(median) }}
          title="median"
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* formatters - the kit's money / percent helpers (plain, locale-pinned)*/
/* ------------------------------------------------------------------ */

export function money(n: number | null | undefined): string {
  if (!isNum(n)) return DASH;
  const neg = n < 0;
  const a = Math.abs(n);
  let s: string;
  if (a >= 1e6) s = `$${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
  else if (a >= 1e3) s = `$${Math.round(a / 1e3)}K`;
  else s = `$${Math.round(a)}`;
  return neg ? `−${s}` : s;
}
export function moneyFull(n: number | null | undefined): string {
  return isNum(n) ? `$${Math.round(n).toLocaleString("en-US")}` : DASH;
}
export function percent(n: number | null | undefined): string {
  return isNum(n) ? `${Math.round(n)}%` : DASH;
}

/* ------------------------------------------------------------------ */
/* leader resolution - the shared, honest leader-mark rule.            */
/*   never crowns across a tie; never crowns when the "best" equals the */
/*   worst (no real spread); caller suppresses entirely with noLeader.  */
/* ------------------------------------------------------------------ */

export function resolveLeaderKey(
  values: Record<string, number | null | undefined>,
  keys: string[],
  higherIsBetter: boolean,
): string | null {
  const present = keys
    .map((k) => ({ key: k, v: values[k] }))
    .filter((p): p is { key: string; v: number } => isNum(p.v));
  if (present.length < 2) return null;
  let best = present[0];
  let tie = false;
  for (const p of present.slice(1)) {
    if (p.v === best.v) tie = true;
    else if (higherIsBetter ? p.v > best.v : p.v < best.v) {
      best = p;
      tie = false;
    }
  }
  const worst = present.reduce((a, b) => ((higherIsBetter ? b.v < a.v : b.v > a.v) ? b : a));
  if (best.v === worst.v) return null;
  return tie ? null : best.key;
}
