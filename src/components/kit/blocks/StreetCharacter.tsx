/**
 * StreetCharacter - a compact, scannable list of notable streets in a district.
 *
 * Each row carries the street name, a one-word character tag (high-footfall,
 * restaurant row, quiet residential, up-and-coming), a short trade-fit note, and
 * a tiny abstract street-line motif so the eye can travel the block at a glance.
 * The tag is the lone touch of meaning-color: terracotta for high-footfall, amber
 * for a restaurant row, a quiet cream chip for residential calm, moss for an
 * up-and-coming stretch. Everything else stays warm ink on warm paper.
 *
 * This is editorial scaffolding, not a chart: it has no figures and no animation,
 * so it is server-renderable with no client JS. It reduces to a legible 375px form
 * (the motif and tag never shrink; the note wraps under the name). Filled + empty
 * states. An unknown tag falls back to the neutral chip rather than crashing.
 *
 * Section: feeds the "street by street" block on the neighbourhood + city pages,
 * giving an operator the character of each block before they walk it.
 *
 * Tokens only, nullable inputs, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/** True when a string has visible content. */
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/**
 * True when a note is worth a row: a non-empty string, or any non-string node
 * the caller passed (we trust a rendered element over guessing at its text).
 */
function hasNote(note: React.ReactNode): boolean {
  if (note == null || note === false) return false;
  if (typeof note === "string") return note.trim().length > 0;
  return true;
}

/** The four known character tags. An unknown tag still renders, on the neutral chip. */
export type StreetTag =
  | "high-footfall"
  | "restaurant row"
  | "quiet residential"
  | "up-and-coming";

export type StreetItem = {
  /** The street name, e.g. "Rue de la Re". */
  name: string;
  /** One-word character tag. Unknown values fall back to a neutral chip. */
  tag: StreetTag | string;
  /** A short trade-fit note, e.g. "Best for impulse counter sales." */
  note?: React.ReactNode;
};

export type StreetCharacterProps = {
  streets: StreetItem[] | null | undefined;
  /** @default "Street by street" */
  title?: string;
  className?: string;
};

/**
 * Chip styling per known tag: a quiet surface plus a solid, AA-legible label.
 *
 * THESE ARE CATEGORIES, NOT A SCALE, and that is why the colour was never doing
 * the work. "restaurant row" was amber and "up-and-coming" was moss, which told
 * a reader nothing: there is no sense in which green ranks above orange here,
 * and both hues are banned outright as of the 2026-08-09 palette ruling. The
 * distinction a reader actually needs is BUSY versus QUIET, which the two
 * treatments below carry, and the tag word itself names the category exactly.
 */
const TAG_CHIP: Record<string, string> = {
  "high-footfall": "bg-atlas-50 text-atlas-700",
  "restaurant row": "bg-atlas-50 text-atlas-700",
  "up-and-coming": "bg-atlas-50 text-atlas-700",
  "quiet residential": "bg-cream-200 text-cocoa-700",
};
const NEUTRAL_CHIP = "bg-cream-200 text-cocoa-700";

/**
 * A tiny deterministic abstract street-line motif. A gentle warm-taupe polyline
 * with a terracotta dot at the far end, seeded by row index so each street reads
 * a little different without ever inventing a measurement. Decorative only.
 */
function StreetLine({ seed }: { seed: number }) {
  const pts: Array<[number, number]> = [];
  for (let x = 0; x <= 48; x += 8) {
    const y = 6 + ((seed * 7 + x * 3) % 12);
    pts.push([x, y]);
  }
  const last = pts[pts.length - 1];
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <polyline
        points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-cream-400"
      />
      <circle cx="46" cy={last[1]} r="2.4" className="fill-atlas-500" />
    </svg>
  );
}

export function StreetCharacter({
  streets,
  title = "Street by street",
  className,
}: StreetCharacterProps) {
  const clean = (streets ?? []).filter((s) => hasText(s?.name) && hasText(s?.tag));

  if (clean.length === 0) {
    return (
      <section className={className} aria-label={title}>
        <SectionEyebrow className="mb-3">{title}</SectionEyebrow>
        <div className="rounded-md border border-dashed border-cream-400 bg-cream-100 px-5 py-5 text-[13px] leading-relaxed text-cocoa-700">
          We have not mapped the streets in this district yet. Street character
          appears here once the blocks are walked.
        </div>
      </section>
    );
  }

  return (
    <section className={className} aria-label={title}>
      <SectionEyebrow className="mb-4">{title}</SectionEyebrow>
      <ul className="m-0 list-none p-0">
        {clean.map((s, i) => {
          const chip = TAG_CHIP[s.tag] ?? NEUTRAL_CHIP;
          return (
            <li
              key={`${s.name}-${i}`}
              className={[
                "grid grid-cols-[auto_1fr_auto] items-center gap-3.5 py-3 md:gap-4",
                i ? "border-t border-parchment" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <StreetLine seed={i + 1} />

              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink-900">{s.name}</div>
                {hasNote(s.note) ? (
                  <div className="mt-0.5 text-xs leading-relaxed text-cocoa-700">
                    {s.note}
                  </div>
                ) : null}
              </div>

              <span
                className={[
                  "inline-flex h-fit shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1",
                  "text-[11.5px] font-semibold leading-none",
                  chip,
                ].join(" ")}
              >
                {s.tag}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
