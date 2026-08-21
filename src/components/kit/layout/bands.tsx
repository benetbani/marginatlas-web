/**
 * The six-band layout shell (Brand Design Constitution 2026-06-16, section 2).
 *
 * A Margin Atlas page reads as a guided reference spread of narrative bands, not
 * a flat section stack. These primitives give a page that rhythm without changing
 * which sections exist or their order (the locked section order is immutable; a
 * band is a reading rhythm laid over it).
 *
 *   Band   a thematic band (Answer, Verdict, Economics, Operating, Comparison,
 *          Trust). Generous space above it (the `band` rhythm) so the reader feels
 *          the group boundary; an optional quiet band label.
 *   Lanes  the three reading lanes at >= 1280px: a quiet LEFT rail (section
 *          identity, source/method cues), a CENTRAL editorial column (the claim +
 *          its dominant visual), a RIGHT rail (calculator, comparison, tools).
 *          Below 1280 it is one column; below 768 the rails fold inline (left
 *          identity above, right tools in place), preserving order, no horizontal
 *          scroll. Props-based, server-renderable, no client JS.
 *
 * Tokens only (Tailwind atlas/cream/ink utilities + the section-spacing rhythm);
 * no raw hex/px, no em-dashes, no source-agency names.
 */
import * as React from "react";

/* ------------------------------------------------------------------ */
/* Band                                                                */
/* ------------------------------------------------------------------ */

export function Band({
  children,
  label,
  id,
  first = false,
  className,
}: {
  children: React.ReactNode;
  /** Quiet band label (e.g. "The economics"), shown above the band with a rule. */
  label?: string | null;
  /** Anchor id for the sticky section index. */
  id?: string;
  /** The first band sits tight under the masthead; later bands get the band gap. */
  first?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={[first ? "mt-10" : "mt-16", "scroll-mt-24", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? (
        <div className="mb-6 flex items-center gap-3.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-atlas-700">
            {label}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-parchment" />
        </div>
      ) : null}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Lanes (the three reading lanes)                                     */
/* ------------------------------------------------------------------ */

export function Lanes({
  left,
  center,
  right,
  className,
}: {
  /** Quiet identity / source rail. Folds inline above the center on mobile. */
  left?: React.ReactNode;
  /** The main claim and its dominant visual. The only required lane. */
  center: React.ReactNode;
  /** Tools, calculator, comparison summary. Folds inline after the center. */
  right?: React.ReactNode;
  className?: string;
}) {
  const hasLeft = left != null && left !== false;
  const hasRight = right != null && right !== false;
  return (
    <div
      className={[
        "grid grid-cols-1 gap-x-8 gap-y-5 xl:grid-cols-12",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasLeft ? (
        <div className="min-w-0 xl:col-span-3">
          <div className="text-sm text-cocoa-700">{left}</div>
        </div>
      ) : null}
      <div
        className={[
          "min-w-0",
          // the central editorial column: 6 cols when both rails are present,
          // wider when a rail is absent, so the read never feels pinched.
          hasLeft && hasRight
            ? "xl:col-span-6"
            : hasLeft || hasRight
              ? "xl:col-span-9"
              : "xl:col-span-12",
        ].join(" ")}
      >
        {center}
      </div>
      {hasRight ? <div className="min-w-0 xl:col-span-3">{right}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SectionIndex (the quiet sticky "on this page")                      */
/* ------------------------------------------------------------------ */

export type IndexItem = { id: string; label: string };

export function SectionIndex({
  items,
  heading = "On this page",
  className,
}: {
  items: IndexItem[];
  heading?: string;
  className?: string;
}) {
  const clean = (items ?? []).filter((i) => i && i.id && i.label);
  if (clean.length < 2) return null;
  return (
    <nav
      aria-label={heading}
      className={[
        "sticky top-[calc(var(--atlas-header-h,3.5rem)+1.5rem)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cocoa-500">
        {heading}
      </div>
      <ul className="space-y-1.5 border-l border-parchment pl-3.5">
        {clean.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="block text-[13px] leading-snug text-cocoa-700 transition-colors hover:text-atlas-700"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
