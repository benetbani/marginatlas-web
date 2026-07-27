/**
 * src/components/spine2/Archetypes.tsx
 *
 * The population by type, city 05: a proportional mix bar (width = share of
 * households), clickable archetype cards, and a detail panel. The only
 * describe-never-judge population form in the system.
 *
 * Tone is DERIVED, never passed in (M5): each segment's fill comes from the
 * pop's SpendTier via ONE mapping; data never supplies a colour. Terracotta
 * marks the SELECTION , the AUDIT-FIXLIST B31 fix: the mockup hard-coded
 * terracotta on the 'Very high' segment while the selected card was a
 * different pop, so the accent and the selection pointed at different groups.
 * Here the highlight follows the selection, so the answer mark is always the
 * thing the reader chose.
 *
 * Self-omit (M9): a pop missing sharePct never renders anywhere (it would
 * falsify the bar); detail-grid cells omit individually; the section omits
 * below 4 pops, because a "mix" of two archetypes is not a mix.
 */
"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";
import type { ReadingData } from "./Reading";

export type SpendTier =
  | "very-low"
  | "low"
  | "fixed"
  | "building"
  | "squeezed"
  | "low-spare"
  | "good-spare"
  | "high"
  | "very-high";

export interface Pop {
  id: string;
  /** "Young renters" */
  name: string;
  glyph?: GlyphId;
  /** Share of households; the sum across pops must equal 100 (asserted). */
  sharePct: number;
  /** Mix-bar tone and the card's spend line both derive from this (M5). */
  spend: SpendTier;
  incomeAfterTax?: number | null;
  savings?: number | null;
  /** "22 to 30" */
  ageRange?: string | null;
  /** "Renting, shared" */
  tenure?: string | null;
  /** "Coffee, takeaway, gyms, nights out" */
  buys?: string | null;
  /**
   * M1 readings: label + optional figure + optional href, so "Cafes, bars,
   * gyms" can become doors the day those pages exist.
   */
  trades: ReadingData[];
}

export interface ArchetypesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  pops: Pop[];
  /** The card open on load; the city mockup opens on Young professionals. */
  defaultSelectedId?: string;
  label?: string;
  sublabel?: string;
}

/** The ONE SpendTier-to-tone mapping (M5). Selection overrides with terracotta. */
const SPEND_TONE: Record<SpendTier, string> = {
  "very-low": "var(--n5)",
  low: "var(--n5)",
  fixed: "var(--n4)",
  building: "var(--n4)",
  squeezed: "var(--n4)",
  "low-spare": "var(--n3)",
  "good-spare": "var(--n2)",
  high: "var(--n2)",
  "very-high": "var(--n1)",
};

/** The card's spend line, derived from the same tier as the tone (M7). */
const SPEND_LABEL: Record<SpendTier, string> = {
  "very-low": "Very low",
  low: "Low",
  fixed: "Fixed",
  building: "Building",
  squeezed: "Squeezed",
  "low-spare": "Low spare cash",
  "good-spare": "Good spare cash",
  high: "High",
  "very-high": "Very high",
};

/**
 * Detail-grid money in the mockup's grammar: $34K, $1.2K, $400. One decimal
 * only under $10K, where the rounding would otherwise lie by half a grand.
 */
function usdFine(n: number | null | undefined): string | null {
  if (n == null || !Number.isFinite(n)) return null;
  const sign = n < 0 ? "−" : ""; // true minus
  const a = Math.abs(n);
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (a >= 1e4) return `${sign}$${Math.round(a / 1e3)}K`;
  if (a >= 1e3) return `${sign}$${(a / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return `${sign}$${Math.round(a)}`;
}

function renderTrade(t: ReadingData, i: number): React.ReactNode {
  const text = t.figure ? `${t.label} ${t.figure}` : t.label;
  const sep = i > 0 ? ", " : null;
  if (t.href) {
    return (
      <React.Fragment key={`${t.label}-${i}`}>
        {sep}
        <Link
          href={t.href}
          style={{
            textDecoration: "underline",
            textUnderlineOffset: 3,
            textDecorationColor: "var(--line)",
          }}
        >
          {text}
        </Link>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment key={`${t.label}-${i}`}>
      {sep}
      {text}
    </React.Fragment>
  );
}

export function Archetypes({
  pops,
  defaultSelectedId,
  label = "The mix of people, by type",
  sublabel = "width is share of households, click any card",
  className,
  ...props
}: ArchetypesProps) {
  // M9: a pop without a share never renders anywhere.
  const shown = pops.filter((p) => Number.isFinite(p.sharePct) && p.sharePct > 0);

  if (process.env.NODE_ENV !== "production" && shown.length >= 4) {
    const sum = shown.reduce((s, p) => s + p.sharePct, 0);
    if (Math.abs(sum - 100) > 0.5) {
      throw new Error(
        `Archetypes: sharePct must sum to 100 (got ${sum}). ` +
          `A proportional mix bar that does not partition is a lie.`,
      );
    }
  }

  const fallbackId =
    shown.find((p) => p.id === defaultSelectedId)?.id ?? shown[0]?.id ?? null;
  const [selectedId, setSelectedId] = React.useState<string | null>(fallbackId);
  const selected =
    shown.find((p) => p.id === selectedId) ??
    shown.find((p) => p.id === fallbackId) ??
    null;

  // M9: a mix of two archetypes is not a mix.
  if (shown.length < 4 || !selected) return null;

  const cells: { key: string; big: string | null; small: string; smallFig?: boolean }[] = [
    { key: "inc", big: usdFine(selected.incomeAfterTax), small: "income, after tax" },
    { key: "sav", big: usdFine(selected.savings), small: "in savings" },
    { key: "age", big: selected.ageRange ?? null, small: "age range" },
    { key: "ten", big: selected.tenure ?? null, small: "how they live", smallFig: true },
  ];
  const trades = selected.trades.filter((t) => t.label);

  return (
    <div className={cn("archetypes", className)} {...props}>
      <div style={{ padding: "16px 16px 0" }}>
        <div className="lab">
          {label}{" "}
          <span
            style={{
              textTransform: "none",
              letterSpacing: 0,
              color: "var(--muted)",
              fontWeight: 400,
            }}
          >
            {sublabel}
          </span>
        </div>
      </div>
      <div className="mixbar">
        {shown.map((p) => (
          <i
            key={p.id}
            style={{
              flex: p.sharePct,
              background:
                p.id === selected.id ? "var(--terra)" : SPEND_TONE[p.spend],
            }}
            title={`${p.name} , ${p.sharePct}%`}
            onClick={() => setSelectedId(p.id)}
          />
        ))}
      </div>
      <div className="cards">
        {shown.map((p) => (
          <button
            key={p.id}
            type="button"
            className={cn("pc", p.id === selected.id && "on")}
            onClick={() => setSelectedId(p.id)}
          >
            <span className="hd2">
              {p.glyph ? <GlyphIcon id={p.glyph} size={18} /> : null}
              {p.name}
            </span>
            <span className="sh fig">{p.sharePct}%</span>
            <span className="sp">{SPEND_LABEL[p.spend]}</span>
          </button>
        ))}
      </div>
      <div className="detail">
        <div className="dh">
          {selected.glyph ? <GlyphIcon id={selected.glyph} size={18} /> : null}
          {selected.name}{" "}
          <span style={{ fontFamily: "var(--fig)", color: "var(--terra-deep)" }}>
            {selected.sharePct}% of households
          </span>
        </div>
        <div className="dg">
          {cells.map((c) =>
            c.big == null || c.big === "" ? null : (
              <div className="c" key={c.key}>
                <div className="n fig" style={c.smallFig ? { fontSize: 13 } : undefined}>
                  {c.big}
                </div>
                <div className="k">{c.small}</div>
              </div>
            ),
          )}
        </div>
        {selected.buys || trades.length > 0 ? (
          <p className="note" style={{ marginTop: 14 }}>
            {selected.buys ? <>Tends to buy: {selected.buys}. </> : null}
            {trades.length > 0 ? (
              <b>Trades that index high against them: {trades.map(renderTrade)}.</b>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}
