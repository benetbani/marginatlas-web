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
 */
import * as React from "react";

export type SwitchView = { key: string; label: string; panel: React.ReactNode };

export function Switch({ id, label, views, className = "", panelClassName = "" }: { id: string; label: string; views: SwitchView[]; className?: string; panelClassName?: string }) {
  const [active, setActive] = React.useState(0);
  const tabs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const go = (i: number) => { const n = (i + views.length) % views.length; setActive(n); tabs.current[n]?.focus(); };
  return (
    <div data-switch={id} className={`flex flex-col ${className}`}>
      <div role="tablist" aria-label={label} className="mb-4 inline-flex self-start rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] p-0.5">
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
            className={`min-h-6 rounded-sm px-3 py-1 text-[length:var(--t-micro)] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)] ${i === active ? "bg-[var(--c-card)] text-[var(--c-ink)] shadow-sm" : "text-[var(--c-muted)] hover:text-[var(--c-ink)]"}`}
          >
            {v.label}
          </button>
        ))}
      </div>
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
