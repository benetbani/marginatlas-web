/**
 * V5 variants B and C. Harness-only, colocated with the /dev route.
 *
 * A is not here. A is the real engraved `Scorecard`, imported untouched.
 *
 * THE CONSTRAINT THAT SHAPES B AND C. The charter records the country page as
 * blocked on DATA, not design: there is no honest country-level source for a
 * headline hero. So neither B nor C may invent a lead figure. Both lead with
 * something the page already holds, and the page says which one and why.
 *
 * TWO CELLS STAY UNSCORED IN ALL THREE. The country page passes
 * `score: null, read: null` for minimum wage and population deliberately, so
 * neither takes a good-or-bad tint. That is a founder ruling, not an oversight,
 * and demoting a cell must not quietly score it.
 */
import * as React from "react";

export type Cell = {
  label: string;
  value: string | null;
  unit?: string | null;
  /** null means deliberately unscored: no tint, no read word. */
  score: number | null;
  read: string | null;
  /** Which of the three clusters C files this under. */
  group: "cost of operating" | "people" | "market";
};

function Read({ read }: { read: string | null }) {
  if (!read) return null;
  return (
    <span className="text-[10px] font-medium uppercase tracking-wide text-ink-600">{read}</span>
  );
}

function Support({ c }: { c: Cell }) {
  return (
    <div className="min-w-0 border-t border-paper-400 pt-2">
      <div className="text-[10.5px] font-medium uppercase tracking-wide text-ink-600">
        {c.label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-base font-semibold tabular-nums text-ink-900">
          {c.value ?? "not held"}
        </span>
        {c.unit ? <span className="text-[11px] text-ink-600">{c.unit}</span> : null}
      </div>
      <Read read={c.read} />
    </div>
  );
}

function Lead({ lead, basis }: { lead: Cell; basis: string }) {
  return (
    <div className="mb-5">
      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-600">
        {lead.label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[2.5rem] font-semibold leading-none tabular-nums text-ink-900">
          {lead.value ?? "not held"}
        </span>
        {lead.unit ? <span className="text-sm text-ink-600">{lead.unit}</span> : null}
      </div>
      {lead.read ? (
        <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-atlas-700">
          {lead.read}
        </div>
      ) : null}
      <p className="mt-1.5 max-w-[46ch] text-[11px] leading-snug text-ink-600">{basis}</p>
    </div>
  );
}

/** B. One dominant figure, seven demoted to support weight. */
export function ScorecardB({ lead, rest, basis }: { lead: Cell; rest: Cell[]; basis: string }) {
  return (
    <div className="atlas-card p-4">
      <Lead lead={lead} basis={basis} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {rest.map((c) => (
          <Support key={c.label} c={c} />
        ))}
      </div>
    </div>
  );
}

/** C. One dominant figure, and the rest grouped under three short headings. */
export function ScorecardC({ lead, rest, basis }: { lead: Cell; rest: Cell[]; basis: string }) {
  const groups: Cell["group"][] = ["cost of operating", "people", "market"];
  return (
    <div className="atlas-card p-4">
      <Lead lead={lead} basis={basis} />
      <div className="flex flex-col gap-4">
        {groups.map((g) => {
          const items = rest.filter((c) => c.group === g);
          if (items.length === 0) return null;
          return (
            <div key={g}>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
                {g}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {items.map((c) => (
                  <Support key={c.label} c={c} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
