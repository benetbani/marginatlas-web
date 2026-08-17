/**
 * SubIndustryPicker (Plan v32 Sprint G — Phase 0e stub).
 *
 * Renders the chip-style variant selector when the parent industry on
 * a cell has at least one data_ready variant for the cell's country.
 *
 * Phase 0 deliverable: real markup, real types, real composition. Data
 * lookup uses the seed (no DB yet); Phase 1 swaps to DB-driven once
 * the sub_industries table is populated and the cell type carries the
 * sub_industry_id.
 *
 * Mobile behavior: chip row scrolls horizontally on narrow viewports;
 * no expander needed (it's compact by design).
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";
import { variantsForIndustry } from "@/lib/taxonomy/sub_industries_seed";

type Props = {
  cell: Cell;
};

export function SubIndustryPicker({ cell }: Props) {
  if (!cell.industry_id) return null;
  const variants = variantsForIndustry(cell.industry_id);
  if (variants.length === 0) return null;

  const activeId = cell.sub_industry?.sub_industry_id ?? null;
  const parentLabel = cell.industry_name ?? "All";

  return (
    <section
      aria-label="Sub-industry variants"
      className="border-y border-ink-100 py-4"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700 mb-2">
          Variant
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <VariantChip
            label={parentLabel}
            sublabel="All"
            active={activeId === null}
          />
          {variants.map((v) => (
            <VariantChip
              key={v.id}
              label={v.name}
              sublabel={v.description}
              active={v.id === activeId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function VariantChip({
  label,
  sublabel,
  active,
}: {
  label: string;
  sublabel?: string;
  active: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={[
        "group inline-flex flex-col items-start gap-0.5 px-3 py-2 rounded-md border text-left transition-colors",
        active
          ? "bg-ink-900 text-white border-ink-900"
          : "bg-white text-ink-900 border-ink-200 hover:border-atlas-500",
      ].join(" ")}
    >
      <span className="text-sm font-medium leading-none">{label}</span>
      {sublabel && (
        <span
          className={[
            "text-[10px] uppercase tracking-wide leading-tight",
            active ? "text-white/70" : "text-ink-500",
          ].join(" ")}
        >
          {sublabel}
        </span>
      )}
    </button>
  );
}
