/**
 * /dev/spine-kit , Wave 0 showcase for the shared uncovered-pages primitives
 * (kit-index.tsx). Renders every new primitive with realistic SAMPLE data inside
 * SpineShell, including a 360px framed proof that DecisionRow + CompareTable reflow
 * to stacked cards with NO horizontal scroll, and a LockVeil locked/unlocked demo.
 * Plan ref: docs/superpowers/plans/2026-06-30-uncovered-pages-design-plan.md.
 */
import * as React from "react";
import { SpineShell } from "@/components/spine/shell";
import { KitShowcase } from "./showcase";

export const dynamic = "force-static";

export default function SpineKitPage() {
  return (
    <SpineShell>
      <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
        <header className="mb-8">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--terra-text)]">
            <span>Spine kit-index &middot; Wave 0</span>
            <span className="rounded-full bg-[var(--c-soft2)] px-2 py-0.5 text-[9px] tracking-wider text-[var(--c-muted)]">sample data</span>
          </div>
          <h1 data-typography="custom" className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2.4rem]">Shared decision primitives</h1>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-snug text-[var(--c-ink2)]">One row, table, sort, and lock grammar for the homepage, AtlasIndex, decision engine, compare and geo-hub archetypes. Entity-scoped and share-based by construction, no cross-geography dollar ranking, no horizontal scroll.</p>
        </header>
        <KitShowcase />
        {/* spacer so the sticky CompareTray never covers the last section */}
        <div className="h-24" />
      </main>
    </SpineShell>
  );
}
