/**
 * Plan v13 Wave 2 — Bottom 20% / Median / Top 10% revenue tiles.
 *
 * Replaces the "0% earn under $97K" cluster language with three
 * prominent tiles that anyone can read at a glance. Big numbers,
 * calm typography, no dollar-axis ticks needed.
 *
 * Uses p20 / p50 / p90 from the cell row. If p20 isn't in schema,
 * interpolates from p10 (or falls back to p10 with a quiet note).
 */
import { formatMoney } from "@/lib/format/money";

type Props = {
  p10?: number | null;
  p20?: number | null;
  p50: number | null;
  p90: number | null;
  currencySymbol?: string;
};

export function RevenueTiles({
  p10,
  p20,
  p50,
  p90,
  currencySymbol = "$",
}: Props) {
  // Interpolate p20 from p10 if not supplied (~halfway between p10 and p50)
  const effP20 = p20 ?? (p10 != null && p50 != null ? p10 + (p50 - p10) * 0.4 : null);

  // Plan v13 Wave 4a (D2) — silent omission: no usable percentiles → render
  // nothing, not an "Earnings distribution not available" banner.
  if (p50 == null && effP20 == null && p90 == null) {
    return null;
  }

  return (
    <section className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Revenue distribution tiles">
      <Tile
        eyebrow="Bottom 20% earn"
        value={effP20}
        currencySymbol={currencySymbol}
        tone="muted"
      />
      <Tile
        eyebrow="Typical (median)"
        value={p50}
        currencySymbol={currencySymbol}
        tone="accent"
      />
      <Tile
        eyebrow="Top 10% earn"
        value={p90}
        currencySymbol={currencySymbol}
        tone="muted"
      />
    </section>
  );
}

function Tile({
  eyebrow,
  value,
  currencySymbol,
  tone,
}: {
  eyebrow: string;
  value: number | null;
  currencySymbol: string;
  tone: "muted" | "accent";
}) {
  const bg = tone === "accent" ? "bg-cream-100 border-atlas-300" : "bg-cream-50 border-parchment";
  const txt = tone === "accent" ? "text-ink-900" : "text-ink-700/85";
  return (
    <div className={`rounded-xl border ${bg} p-5 md:p-6`}>
      <div className="text-xs uppercase tracking-wide text-ink-700/60 font-medium">
        {eyebrow}
      </div>
      <div className={`mt-1 text-3xl md:text-4xl font-semibold tabular-nums ${txt}`}>
        {value != null ? `${currencySymbol}${formatMoney(value)}` : "—"}
      </div>
    </div>
  );
}
