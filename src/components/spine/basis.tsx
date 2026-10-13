/**
 * THE BASIS LINE (plan 2026-10-12 rhythm-air-inside, Task 2B; spec section 2.1; MODEL PART 7: what the figure is and in what unit, never what it means): one line under a section's
 * rows or drawing, 24 from them, the group step. `beside`: it stands beside another group (the figure, the plus), whose arrangement gives the distance, so it takes no margin. The one
 * piece a section prints its basis with.
 *
 * A MODULE OF ITS OWN, WITH NO IMPORT BUT REACT, and the kit re-exports it (src/components/spine/kit.tsx): archetypes/CityRows.tsx is the home's server component, which
 * tests/home/foot.test.ts holds to a static import closure that reaches no client module, and the kit's closure does (Rail's gloss draws InfoTip, a client component), so the
 * home's rows could not import the line from the kit. Every other file imports it from the kit.
 */
import * as React from "react";

export function Basis({ children, beside = false, className = "" }: { children: React.ReactNode; beside?: boolean; className?: string }) {
  return <p data-basis="" className={`${beside ? "" : "mt-6 "}text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]${className ? ` ${className}` : ""}`}>{children}</p>;
}
