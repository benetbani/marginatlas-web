"use client";

/**
 * Switch, TWO TO FOUR VIEWS OF ONE SUBJECT, ONE AT A TIME (goal 2026-09-26, M4 of E:/atlas/design/loop/build/goal-2026-09-26/
 * PLAN.md; his clause 58: "a section with several parts reveals them on a click").
 *
 * THE LAW: never a drawing out of sight (his ruling of 2026-07-09, "never hide a graphic behind a popup, expand, or disclosure"):
 * a panel holds words and figures, or the drawing stays outside the switch and its data changes; the page laws red a drawing in a
 * hidden panel. Labels of three words at most. The first view is the one most readers need. The WAI tabs pattern: one tab stop,
 * the arrows move and select, Home and End jump; each panel is labelled by its tab.
 *
 * PROGRESSIVE: the server renders every panel, the first shown and the others `hidden`, so a page without script shows the first
 * view whole and the harness measures what a reader first sees.
 *
 * ASIDE (plan 2026-10-13 cost-simulator): words that stand at the end of the tab row (the calculator's month: the sales its bill is at), so the row's
 * empty end is not a gathered hole; without it the row is drawn exactly as before.
 */
import * as React from "react";

export type SwitchView = { key: string; label: string; panel: React.ReactNode };

export function Switch({ id, label, views, className = "", panelClassName = "", aside = null }: { id: string; label: string; views: SwitchView[]; className?: string; panelClassName?: string; aside?: React.ReactNode }) {
  const [active, setActive] = React.useState(0);
  const tabs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const go = (i: number) => { const n = (i + views.length) % views.length; setActive(n); tabs.current[n]?.focus(); };
  const tablist = (
      <div role="tablist" aria-label={label} className={`${aside ? "max-sm:w-full " : "mb-4 "}inline-flex self-start rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] p-0.5`}>
        {views.map((v, i) => (
          <button
            key={v.key}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${v.key}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${v.key}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1); }
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1); }
              else if (e.key === "Home") { e.preventDefault(); go(0); }
              else if (e.key === "End") { e.preventDefault(); go(views.length - 1); }
            }}
            className={`${aside ? "max-sm:flex-1 " : ""}tap-y min-h-6 rounded-sm px-3 py-1 text-[length:var(--t-body)] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)] ${i === active ? "bg-[var(--c-card)] text-[var(--c-ink)] shadow-subtle" : "text-[var(--c-muted)] hover:text-[var(--c-ink)]"}`}
          >
            {v.label}
          </button>
        ))}
      </div>
  );
  return (
    <div data-switch={id} className={`flex flex-col ${className}`}>
      {/* THE ASIDE IS A BASIS (the calculator's month): the group step holds round it (release 3 job C, 2026-10-16, the line rule once the calculator joined
          its scan set: the rows stood 16 under it, and on a phone, wrapped under the tabs, it stood 8 under them), so the row keeps 24 below and 24 between
          its wrapped lines. Under 640 the basis wraps under the tabs, so there the tabs take the row's width and share it (max-sm:w-full, max-sm:flex-1):
          the pill's empty end beside the stacked basis read as a 157 by 162 hole in the page filter at 375. Without an aside the row is drawn as before. */}
      {aside ? <div data-switch-row="" className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-6">{tablist}{aside}</div> : tablist}
      {views.map((v, i) => (
        <div
          key={v.key}
          role="tabpanel"
          id={`${id}-panel-${v.key}`}
          aria-labelledby={`${id}-tab-${v.key}`}
          hidden={i !== active}
          data-switch-panel={v.key}
          className={i === active ? `flex flex-1 flex-col ${panelClassName}` : undefined}
        >
          {v.panel}
        </div>
      ))}
    </div>
  );
}
