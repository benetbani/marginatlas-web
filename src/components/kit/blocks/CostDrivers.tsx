/**
 * CostDrivers - "what moves the cost" for a trade (design-system, blocks family).
 *
 * The few levers that set the margin (rent, food cost, labour), each a labeled
 * row with a direction arrow and a one-line note. The arrow reads which way the
 * lever tends to push margin: up = pushes margin up (good, moss), down = pushes
 * margin down (amber). A 1-to-3 magnitude tick lets the eye rank the levers.
 * Quiet and scannable, no chartjunk, grouped by hairlines.
 *
 * Nullable inputs: drivers may be null/undefined/empty, and each row may be
 * missing its label. With no usable driver the block keeps its place with a calm
 * "not held yet" line rather than a fabricated lever. Direction defaults to down
 * (a cost lever) and impact defaults to 1 when not supplied.
 *
 * Server-renderable (no client JS). Reduces to a legible 375px form: the arrow
 * and tick never shrink, the label + note wrap in the middle column.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";

/** True when a string has visible content. */
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export type CostDriverDirection = "up" | "down";

export type CostDriver = {
  /** The lever name, e.g. "Rent and space". */
  label: string;
  /** A one-line note on the lever. Optional. */
  note?: React.ReactNode;
  /** Which way this lever tends to push margin. @default "down" */
  direction?: CostDriverDirection;
  /** Relative magnitude tick, 1 to 3. @default 1 */
  impact?: 1 | 2 | 3;
};

export type CostDriversProps = {
  drivers: CostDriver[] | null | undefined;
  /** Block eyebrow above the list. */
  title?: string;
  /** Line shown when no drivers are held for this trade. */
  emptyNote?: string;
  id?: string;
  className?: string;
};

/**
 * The direction arrow. Up sits on a faint terracotta surface (pushes margin up),
 * down on a true neutral (pushes margin down): the site's diverging grammar,
 * one hue for the side that favours the operator and none for the other. It was
 * moss and amber until 2026-08-17, both banned outright. The glyph is drawn so a
 * reader sees the direction without relying on color alone, and the row reads the
 * meaning in words via the visually-hidden label.
 */
function DirectionArrow({ dir }: { dir: CostDriverDirection }) {
  const up = dir === "up";
  return (
    <span
      aria-hidden="true"
      className={[
        "inline-flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full",
        up ? "bg-atlas-100 text-atlas-700" : "bg-parchment text-cocoa-900",
      ].join(" ")}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" role="presentation">
        <path
          d={up ? "M6 2.5 L6 9.5 M3 5.5 L6 2.5 L9 5.5" : "M6 9.5 L6 2.5 M3 6.5 L6 9.5 L9 6.5"}
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Three rising ticks; the first `level` are filled in cocoa, the rest quiet. */
function ImpactTicks({ level }: { level: number }) {
  const heights = ["h-1.5", "h-2.5", "h-[0.875rem]"];
  return (
    <span className="inline-flex shrink-0 items-end gap-[0.1875rem]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={[
            "w-1 rounded-[0.0625rem]",
            heights[i],
            i < level ? "bg-cocoa-700" : "bg-parchment",
          ].join(" ")}
        />
      ))}
    </span>
  );
}

export function CostDrivers({
  drivers,
  title = "What moves the cost",
  emptyNote = "Cost drivers for this trade are not held yet.",
  id,
  className,
}: CostDriversProps) {
  const clean = (drivers ?? []).filter((d): d is CostDriver => hasText(d?.label));

  /* THIS BLOCK HAD NO GROUND, AND IT IS THE ONE IN ITS STACK THAT DID NOT.

     Photographed at 1440x900 on /gb/london/restaurants, scrolled to 2100:
     the heading and all four driver rows painted straight onto the fixed
     photograph. The top two rows read because the crop is pale sea there; the
     bottom two sit over the cliff and the buildings, and the muted
     "weighs on margin" gloss and the impact ticks are close to gone against
     them. Exactly the failure the country page's section nav had: legible for
     its first items and not its last, because the picture is sky at the top and
     buildings lower down.

     Measured rather than eyeballed: every ancestor from this section up to the
     column reported `background-color: rgba(0, 0, 0, 0)`. Nothing was painting.

     It is not a styling preference, it is the standing rule that content lives
     in cards because the card is what sits over the picture. And every sibling
     in both stacks that mount this block already obeyed it: PlainTerms,
     MoneyGoesBreakdown, BreakEvenLine and WagesByRole each carry `atlas-card`,
     and on the industry page the neighbours are BeatCards. This was the only
     bare `w-full` section among them. The padding matches the siblings exactly
     so the stack keeps one rhythm. */
  const wrapper = (children: React.ReactNode) => (
    <section
      id={id}
      aria-label={title}
      className={["atlas-card w-full px-5 py-5 md:px-7 md:py-6", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700">
        {title}
      </div>
      {children}
    </section>
  );

  if (clean.length === 0) {
    return wrapper(
      <p className="m-0 rounded-md border border-dashed border-paper-400 bg-paper-100 px-5 py-5 text-[0.8125rem] leading-relaxed text-cocoa-700">
        {emptyNote}
      </p>,
    );
  }

  return wrapper(
    <ul className="m-0 list-none p-0">
      {clean.map((d, i) => {
        const dir: CostDriverDirection = d.direction === "up" ? "up" : "down";
        const level = d.impact === 2 || d.impact === 3 ? d.impact : 1;
        return (
          <li
            key={i}
            className={[
              "grid grid-cols-[auto_1fr_auto] items-center gap-3.5 py-3",
              i > 0 ? "border-t border-parchment" : "",
            ].join(" ")}
          >
            <DirectionArrow dir={dir} />
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-ink-900">{d.label}</span>
                <span className="text-[0.6875rem] font-medium text-cocoa-700">
                  {dir === "up" ? "lifts margin" : "weighs on margin"}
                </span>
              </div>
              {d.note ? (
                <div className="mt-0.5 text-[0.8125rem] leading-snug text-cocoa-700">
                  {d.note}
                </div>
              ) : null}
            </div>
            <ImpactTicks level={level} />
          </li>
        );
      })}
    </ul>,
  );
}
