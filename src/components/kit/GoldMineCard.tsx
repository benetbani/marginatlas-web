/**
 * kit/GoldMineCard.tsx , the gold-mine intel card.
 *
 * The signature payoff: one non-obvious, defensible conclusion derived from
 * owned data (cross-dataset synthesis), shown as a terracotta-framed card with
 * an engraved-glyph badge, the claim, the evidence row it binds to (provenance),
 * and an as-of stamp. Reused on the map sidebar, the recommender, and pages.
 *
 * Provenance-bound: a claim is meant to be shown with the held figures it was
 * built from; with no claim the card self-omits to an honest not-held line.
 * Tokens-only (Tailwind token classes + the engraved Glyph), server-renderable,
 * no em-dashes, no raw hex, no source-agency names.
 */
import * as React from "react";
import { Glyph, type GlyphName } from "./engraved/primitives";

/** One held datum the claim binds to (a cell in the evidence row). */
export type GoldMineEvidence = {
  /** Short label, e.g. "Rent" or "Footfall". */
  label: string;
  /** The figure, preformatted, e.g. "80/100" or "30%". */
  value: string;
};

export type GoldMineCardProps = {
  /** The non-obvious conclusion. A ReactNode so callers compose emphasis with JSX. */
  claim?: React.ReactNode;
  /** The held figures the claim is built from (provenance). One to four. */
  evidence?: GoldMineEvidence[] | null;
  /** The vintage of the underlying data, e.g. "June 2026". */
  asOf?: string | null;
  /** The small eyebrow label. @default "Gold-mine intel" */
  eyebrow?: string;
  /** The engraved badge glyph. @default "bulb" */
  glyph?: GlyphName;
  /** Force the honest not-held state. */
  sample?: boolean;
  className?: string;
};

/**
 * The gold-mine intel card. Renders the claim + its evidence row when held;
 * otherwise an honest not-held line (the claim cannot stand without the data).
 */
export function GoldMineCard({
  claim,
  evidence,
  asOf,
  eyebrow = "Gold-mine intel",
  glyph = "bulb",
  sample,
  className,
}: GoldMineCardProps) {
  const shell = ["rounded-xl border border-atlas-200 bg-atlas-50 px-4 py-3.5", className]
    .filter(Boolean)
    .join(" ");

  if (sample || !claim) {
    return (
      <div className={shell}>
        <div className="flex items-center gap-2 text-atlas-700">
          <Glyph name={glyph} size={16} stroke={1.5} color="currentColor" />
          <span className="text-xs font-semibold uppercase tracking-[0.08em]">{eyebrow}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
          Not held here yet. Added as the data behind it lands.
        </p>
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-atlas-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-atlas-100">
            <Glyph name={glyph} size={15} stroke={1.5} color="currentColor" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.08em]">{eyebrow}</span>
        </div>
        {asOf ? (
          <span className="shrink-0 text-xs uppercase tracking-wide text-ink-500">as of {asOf}</span>
        ) : null}
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-ink-800">{claim}</p>

      {evidence && evidence.length > 0 ? (
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-atlas-200/60 pt-2.5">
          {evidence.map((e, i) => (
            <div key={i} className="flex items-baseline gap-1.5">
              <dt className="text-xs uppercase tracking-wide text-ink-500">{e.label}</dt>
              <dd className="font-display text-xs tabular-nums text-ink-800">{e.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
