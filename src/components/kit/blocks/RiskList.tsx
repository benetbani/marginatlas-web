/**
 * RiskList - an honest "what could go wrong" read (design-system, blocks family).
 *
 * 3 to 5 risks, each a short bold title, a one-line plain explanation, and a
 * calm severity cue: a 3-step watch / serious / rare marker that informs rather
 * than scares. There is no red alarm here. The serious step borrows the deep
 * maroon destructive tone (clay), watch borrows the soft amber caution tone,
 * and rare reads as a quiet cocoa neutral. Risks are grouped by whitespace and
 * a hairline rule between rows, not by boxes.
 *
 * Nullable by contract: a missing or empty `risks` list renders the honest
 * empty state (a calm "no standout risks measured yet" line), never a fabricated
 * risk. Each row self-skips when it has no title. Below one real row the list
 * shows the empty state so the page never prints a lone half-filled rule.
 *
 * Server-renderable, no client JS. Reduces to a legible 375px form: the marker
 * drops under the title and note on narrow screens so nothing scrolls sideways.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { SeverityGlyph } from "@/components/kit/charts";

/** Calm severity cue, never a red alarm. Same union as the SeverityGlyph ladder. */
export type RiskSeverity = "rare" | "watch" | "serious";

export type RiskItem = {
  /** Short bold title, e.g. "Rent reviews". */
  title: string;
  /** One-line plain explanation. A string, or rich nodes when needed. */
  note: React.ReactNode;
  /** Which calm severity marker to show. Defaults to "watch" when omitted. */
  severity?: RiskSeverity;
};

export type RiskListProps = {
  /** The risks to read out. Null, undefined, or empty triggers the empty state. */
  risks?: RiskItem[] | null;
  /** Section eyebrow label. */
  title?: string;
  /** The calm line shown when no risks are held. */
  emptyNote?: string;
  /** Anchor id for the sticky section nav. */
  id?: string;
  className?: string;
};

/** True when a string has visible content. */
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/** True when a React node carries something to show. */
function hasNode(n: React.ReactNode): boolean {
  if (n == null || n === false || n === "") return false;
  if (typeof n === "string") return n.trim().length > 0;
  return true;
}

/**
 * The calm severity vocabulary: the plain word and its AA-solid label tone. The
 * graphical cue (the rising 3-step ladder) is the shared SeverityGlyph primitive,
 * so the meter reads the same here as everywhere it appears. Tones match the
 * glyph and none is the loud brand red.
 *
 * The middle step was amber-700 until 2026-08-17, which is banned. It is now
 * clay-500, so the ladder runs quiet cocoa into the destructive maroon and
 * darkens all the way: one thing deepening rather than three colours. Every tone
 * here clears AA on the card surface (cocoa-700 9.0:1, clay-500 7.9:1, clay-700
 * 13.5:1), which cocoa-500 at 4.3:1 would not have, so `rare` keeps cocoa-700
 * and the separation is carried by the glyph's filled-step count.
 */
const SEVERITY: Record<RiskSeverity, { label: string; text: string }> = {
  rare: { label: "Rare", text: "text-cocoa-700" },
  watch: { label: "Watch", text: "text-clay-500" },
  serious: { label: "Serious", text: "text-clay-700" },
};

export function RiskList({
  risks,
  title = "What could go wrong",
  emptyNote = "No standout risks measured for this trade yet. That is not the same as no risk, just that we have not held the common pitfalls here.",
  id,
  className,
}: RiskListProps) {
  // Keep only rows with a real title; a row needs a name to read as a risk.
  const clean = (risks ?? []).filter((r) => r != null && hasText(r.title));

  // The honest empty state: lead with a calm line, never a fabricated risk.
  if (clean.length === 0) {
    return (
      <section
        id={id}
        aria-label={title}
        className={["min-w-0", className].filter(Boolean).join(" ")}
      >
        <SectionEyebrow tone="muted" className="mb-3">
          {title}
        </SectionEyebrow>
        <p className="max-w-prose text-sm leading-relaxed text-cocoa-700">
          {emptyNote}
        </p>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-label={title}
      className={["min-w-0", className].filter(Boolean).join(" ")}
    >
      <SectionEyebrow tone="muted" className="mb-3">
        {title}
      </SectionEyebrow>
      <ul className="m-0 list-none p-0">
        {clean.map((r, i) => {
          const level = r.severity ?? "watch";
          const sev = SEVERITY[level] ?? SEVERITY.watch;
          return (
            <li
              key={i}
              className={[
                "flex flex-col gap-x-4 gap-y-1.5 py-3.5",
                "sm:flex-row sm:items-start sm:justify-between",
                i > 0 ? "border-t border-parchment" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="min-w-0 sm:flex-1">
                <div className="text-[15px] font-bold leading-snug text-ink-900">
                  {r.title}
                </div>
                {hasNode(r.note) ? (
                  <div className="mt-1 max-w-prose text-[13.5px] leading-relaxed text-cocoa-700">
                    {r.note}
                  </div>
                ) : null}
              </div>
              <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap sm:pt-0.5">
                <SeverityGlyph level={level} />
                <span className={["text-xs font-semibold", sev.text].join(" ")}>
                  {sev.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
