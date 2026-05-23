/**
 * Comparison primitives — shared by all four comparison pages.
 *
 * Visual contract:
 *   - SplitHero: two halves with a diagonal seam and a VS pill at center.
 *   - StatBand: side-by-side rows with a delta chip in the middle column.
 *   - DivergentBars: butterfly chart, mirrored bars across a center spine.
 *   - EditorialBlock: one calm paragraph with an amber left rule.
 *   - CrossLinkRibbon: 3-up "keep comparing" cards.
 *
 * All five sit on cream-50 / cream-100 / parchment / atlas tokens. No
 * em-dashes anywhere.
 */

import {
  ArrowUp, ArrowDown, ArrowsLeftRight, Equals, CaretRight,

} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function shortMoney(n: number, currency: "USD" | "EUR" | "GBP" | "JPY" = "USD"): string {
  const s = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "JPY" ? "¥" : "$";
  if (n >= 1_000_000_000) return `${s}${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${s}${v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : Math.round(v)}M`;
  }
  if (n >= 1_000) return `${s}${Math.round(n / 1_000)}K`;
  return `${s}${Math.round(n).toLocaleString()}`;
}

export function pctText(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function pctDelta(a: number, b: number): string {
  if (!b) return "0%";
  return `${Math.round((Math.abs(a - b) / Math.min(a, b)) * 100)}%`;
}

export function flagEmoji(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return "";
  const A = 0x1F1E6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(
    A + iso2.toUpperCase().charCodeAt(0) - a,
    A + iso2.toUpperCase().charCodeAt(1) - a
  );
}

// ---------------------------------------------------------------------------
// ComparisonEyebrow
// ---------------------------------------------------------------------------
export function ComparisonEyebrow({ kind }: { kind: string }) {
  return (
    <p className="text-[11px] tracking-[0.22em] uppercase font-semibold inline-flex items-center gap-1.5 text-atlas-700">
      <ArrowsLeftRight size={13} aria-hidden="true" />
      {kind} comparison
    </p>
  );
}

// ---------------------------------------------------------------------------
// SplitHero
// ---------------------------------------------------------------------------
export type SplitHeroSide = {
  eyebrow?: string;
  name: string;
  subtitle?: string;
  /** Render either a flag (string) or a Phosphor icon. */
  flagOrIcon?: React.ReactNode;
  /** When variant="photo", a CSS gradient string used as the panel background. */
  photo?: string;
};

export type SplitHeroProps = {
  kind: "Country" | "Industry" | "City";
  title: string;
  left: SplitHeroSide;
  right: SplitHeroSide;
  variant?: "solid" | "photo";
};

export function SplitHero({ kind, title, left, right, variant = "solid" }: SplitHeroProps) {
  const photoMode = variant === "photo";
  return (
    <section className="relative bg-cream-50 border-b border-parchment">
      <div className="mx-auto max-w-6xl px-6 pt-12 sm:pt-14 pb-10 sm:pb-14">
        <ComparisonEyebrow kind={kind} />
        <h1 className="font-display mt-3 text-balance text-4xl sm:text-5xl leading-[1.06] tracking-[-0.022em] font-semibold text-ink-900 max-w-4xl">
          {title}
        </h1>

        <div className="mt-8 relative rounded-2xl overflow-hidden border border-parchment">
          <div className="grid grid-cols-2 relative" style={{ minHeight: 220 }}>
            <HeroPanel side="left"  data={left}  photoMode={photoMode} bg="bg-cream-100" />
            <HeroPanel side="right" data={right} photoMode={photoMode} bg="bg-cream-50" />

            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0"
              style={{
                left: "50%",
                width: 1,
                transform: "skewX(-8deg) translateX(-0.5px)",
                background: photoMode ? "rgba(254, 251, 246, 0.6)" : "var(--parchment)",
              }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <span
                className="inline-flex items-center justify-center font-display rounded-full text-base font-bold text-white bg-atlas-700"
                style={{
                  width: 56,
                  height: 56,
                  letterSpacing: "0.08em",
                  boxShadow:
                    "0 1px 2px rgba(26,26,26,0.10), 0 8px 24px rgba(26,26,26,0.12), 0 0 0 4px rgba(254,251,246,0.85)",
                }}
              >
                VS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPanel({
  side,
  data,
  photoMode,
  bg,
}: {
  side: "left" | "right";
  data: SplitHeroSide;
  photoMode: boolean;
  bg: string;
}) {
  const align = side === "right" ? "text-right" : "text-left";
  const justify = side === "right" ? "justify-end" : "justify-start";
  return (
    <div className={`relative px-6 sm:px-8 py-8 sm:py-10 ${align} ${photoMode ? "" : bg}`}>
      {photoMode && data.photo && (
        <>
          <div className="absolute inset-0" style={{ background: data.photo }} aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(254,251,246,0.05) 0%, rgba(26,26,26,0.55) 100%)" }}
            aria-hidden="true"
          />
        </>
      )}
      <div className="relative">
        {data.eyebrow && (
          <p
            className={`text-[11px] tracking-[0.18em] uppercase font-semibold ${
              photoMode ? "text-cream-50/85" : "text-atlas-700"
            }`}
          >
            {data.eyebrow}
          </p>
        )}
        <div className={`mt-2 flex items-center gap-3 ${justify}`}>
          {side === "left" && data.flagOrIcon}
          <span
            className={`font-display text-3xl sm:text-4xl tracking-[-0.022em] font-semibold leading-[1.06] ${
              photoMode ? "text-white" : "text-ink-900"
            }`}
          >
            {data.name}
          </span>
          {side === "right" && data.flagOrIcon}
        </div>
        {data.subtitle && (
          <p className={`mt-2 text-sm ${photoMode ? "text-cream-50/85" : "text-cocoa-700"}`}>
            {data.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatBand
// ---------------------------------------------------------------------------
export type StatRow = {
  label: string;
  valueLeft: string;
  valueRight: string;
  /** true → left wins, false → right wins, null → no winner */
  leftWins?: boolean | null;
  sameish?: boolean;
  deltaText?: string;
  note?: string;
};

export function StatBand({ stats }: { stats: StatRow[] }) {
  return (
    <section className="bg-cream-50 border-b border-parchment">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
          At a glance
        </p>
        <div className="mt-5 grid grid-cols-1">
          {stats.map((s, i) => (
            <StatBandRow key={s.label} {...s} divider={i < stats.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatBandRow({
  label,
  valueLeft,
  valueRight,
  leftWins,
  sameish,
  deltaText,
  note,
  divider,
}: StatRow & { divider: boolean }) {
  const aWins = leftWins === true;
  const bWins = leftWins === false;
  return (
    <div
      role="group"
      aria-label={`${label}: left ${valueLeft}, right ${valueRight}${deltaText ? `, ${deltaText}` : ""}`}
      className={`grid grid-cols-12 items-center py-3 sm:py-4 ${divider ? "border-b border-parchment" : ""}`}
    >
      <div className="col-span-4 text-left">
        <div className="flex items-baseline gap-1.5">
          {aWins && <ArrowUp size={12} aria-hidden="true" className="text-atlas-700" />}
          <span
            className={`tabular-nums font-semibold text-base sm:text-lg ${aWins ? "text-atlas-700" : "text-ink-900"}`}
          >
            {valueLeft}
          </span>
        </div>
      </div>
      <div className="col-span-4 text-center">
        <p className="text-[11px] tracking-[0.18em] uppercase font-semibold text-cocoa-700/70">{label}</p>
        {(deltaText || sameish) && (
          <p className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums bg-cream-100 border border-parchment text-cocoa-700">
            {sameish ? (
              <Equals size={10} aria-hidden="true" />
            ) : aWins ? (
              <ArrowUp size={10} aria-hidden="true" />
            ) : (
              <ArrowDown size={10} aria-hidden="true" />
            )}
            {deltaText}
          </p>
        )}
        {note && <p className="mt-1 text-[11px] text-cocoa-700/60">{note}</p>}
      </div>
      <div className="col-span-4 text-right">
        <div className="flex items-baseline gap-1.5 justify-end">
          <span
            className={`tabular-nums font-semibold text-base sm:text-lg ${bWins ? "text-atlas-700" : "text-ink-900"}`}
          >
            {valueRight}
          </span>
          {bWins && <ArrowUp size={12} aria-hidden="true" className="text-atlas-700" />}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DivergentBars
// ---------------------------------------------------------------------------
export type DivergentRow = {
  label: string;
  valueA: number;
  valueB: number;
  currencyA?: "USD" | "EUR" | "GBP" | "JPY";
  currencyB?: "USD" | "EUR" | "GBP" | "JPY";
};

export type DivergentBarsProps = {
  title: string;
  lede?: string;
  leftLabel: string;
  rightLabel: string;
  rows: DivergentRow[];
  valueFmt?: (n: number, currency?: "USD" | "EUR" | "GBP" | "JPY") => string;
};

export function DivergentBars({
  title,
  lede,
  leftLabel,
  rightLabel,
  rows,
  valueFmt = shortMoney,
}: DivergentBarsProps) {
  const max = Math.max(...rows.flatMap((r) => [r.valueA, r.valueB]));
  return (
    <section className="bg-cream-50 border-b border-parchment">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
          By industry
        </p>
        <h2 className="font-display mt-3 text-balance text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900 max-w-3xl">
          {title}
        </h2>
        {lede && (
          <p className="mt-3 text-base sm:text-lg max-w-2xl text-cocoa-700 leading-relaxed">{lede}</p>
        )}

        <div className="mt-8 grid grid-cols-12 items-center pb-2 border-b border-parchment">
          <div className="col-span-4 text-right text-[11px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/70">
            {leftLabel}
          </div>
          <div className="col-span-4 text-center text-[11px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/70">
            Industry
          </div>
          <div className="col-span-4 text-left text-[11px] tracking-[0.16em] uppercase font-semibold text-cocoa-700/70">
            {rightLabel}
          </div>
        </div>

        <div className="mt-2">
          {rows.map((r, i) => {
            const wA = (r.valueA / max) * 100;
            const wB = (r.valueB / max) * 100;
            const aWins = r.valueA > r.valueB;
            return (
              <div
                key={r.label}
                className={`grid grid-cols-12 items-center py-2.5 ${
                  i < rows.length - 1 ? "border-b border-parchment/60" : ""
                }`}
              >
                <div className="col-span-4 flex items-center justify-end gap-3 pr-2">
                  <span
                    className={`text-sm tabular-nums font-semibold ${
                      aWins ? "text-atlas-700" : "text-ink-900"
                    }`}
                  >
                    {valueFmt(r.valueA, r.currencyA)}
                  </span>
                  <div
                    className="h-2.5 rounded-l-sm"
                    style={{
                      width: `${wA}%`,
                      background: aWins ? "#952509" : "#D73A14",
                      opacity: aWins ? 1 : 0.65,
                    }}
                  />
                </div>
                <div className="col-span-4 text-center text-sm font-medium text-ink-900">{r.label}</div>
                <div className="col-span-4 flex items-center justify-start gap-3 pl-2">
                  <div
                    className="h-2.5 rounded-r-sm"
                    style={{
                      width: `${wB}%`,
                      background: !aWins ? "#952509" : "#D73A14",
                      opacity: !aWins ? 1 : 0.65,
                    }}
                  />
                  <span
                    className={`text-sm tabular-nums font-semibold ${
                      !aWins ? "text-atlas-700" : "text-ink-900"
                    }`}
                  >
                    {valueFmt(r.valueB, r.currencyB)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// EditorialBlock
// ---------------------------------------------------------------------------
export function EditorialBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-cream-100 border-b border-parchment">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="atlas-editorial-line max-w-3xl">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
            What this means
          </p>
          <h2 className="font-display mt-2 text-balance text-2xl sm:text-3xl leading-[1.18] tracking-[-0.015em] font-semibold text-ink-900">
            {title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-cocoa-700 leading-relaxed">{body}</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CrossLinkRibbon
// ---------------------------------------------------------------------------
export type CrossLinkItem = { label: string; subtitle?: string; href: string };

export function CrossLinkRibbon({
  title,
  items,
}: {
  title: string;
  items: CrossLinkItem[];
}) {
  return (
    <section className="bg-cream-50">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
          Keep comparing
        </p>
        <h2 className="font-display mt-2 text-xl sm:text-2xl leading-[1.18] tracking-[-0.015em] font-semibold text-ink-900">
          {title}
        </h2>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {items.map((it) => (
            <li key={it.label}>
              <a
                href={it.href}
                className="block rounded-lg p-4 bg-cream-50 border border-parchment text-ink-900 transition-shadow hover:bg-white hover:shadow-[0_1px_2px_rgba(26,26,26,0.04),_0_6px_16px_rgba(26,26,26,0.05)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display font-semibold text-lg tracking-[-0.01em]">
                    {it.label}
                  </span>
                  <CaretRight size={14} aria-hidden="true" className="text-cocoa-700/55" />
                </div>
                {it.subtitle && <p className="mt-1 text-sm text-cocoa-700">{it.subtitle}</p>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
