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

/** Calm severity cue, never a red alarm. */
export type RiskSeverity = "watch" | "serious" | "rare";

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
 * The calm severity vocabulary. `steps` is how many of the three dots fill in
 * (a quiet ladder, watch < rare < serious), `fill` is the filled-dot tone, and
 * `text` is the AA-solid label tone. None of these is the loud brand red.
 */
const SEVERITY: Record<
  RiskSeverity,
  { label: string; steps: number; fill: string; text: string }
> = {
  watch: { label: "Watch", steps: 1, fill: "bg-amber-500", text: "text-amber-700" },
  rare: { label: "Rare", steps: 2, fill: "bg-cocoa-500", text: "text-cocoa-700" },
  serious: { label: "Serious", steps: 3, fill: "bg-clay-500", text: "text-clay-700" },
};

/** The 3-step severity dots: filled steps in tone, the rest a quiet hairline fill. */
function SeverityDots({ steps, fill }: { steps: number; fill: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={[
            "h-1.5 w-1.5 rounded-full",
            i < steps ? fill : "bg-cream-300",
          ].join(" ")}
        />
      ))}
    </span>
  );
}

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
          const sev = SEVERITY[r.severity ?? "watch"] ?? SEVERITY.watch;
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
                <SeverityDots steps={sev.steps} fill={sev.fill} />
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
