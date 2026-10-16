/**
 * THE BASIS LINE (plan 2026-10-12 rhythm-air-inside, Task 2B; spec section 2.1; MODEL PART 7: what the figure is and in what unit, never what it means): one line under a section's
 * rows or drawing, 24 from them, the group step. `beside`: it stands beside another group (the figure, the plus), whose arrangement gives the distance, so it takes no margin. The one
 * piece a section prints its basis with.
 *
 * A LINE WITH NO TEXT DRAWS NOTHING (plan 2026-10-12 rhythm-air-inside, Task 2C; the line-rule gate's EMPTY LINE): a card whose copy keeps no basis (an empty string, as the sales mix and the
 * trade notes) would draw an empty paragraph, and its 24 above would be 24 of air holding nothing. `hasText` reads strings, numbers, arrays and fragments; an element is taken to draw
 * what it draws.
 *
 * A MODULE OF ITS OWN, WITH NO IMPORT BUT REACT, and the kit re-exports it (src/components/spine/kit.tsx). It was split out for the home's server rows (CityRows.tsx),
 * which a test held to an import closure with no client module; both are retired (plan 2026-10-13), so nothing needs the split now. Every file imports it from the kit,
 * and only the kit imports this module.
 */
import * as React from "react";

/** Whether `node` holds anything a reader sees: text that is not only spaces, a number, or an element (an element is taken to draw what it draws). */
function hasText(node: React.ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (Array.isArray(node)) return node.some(hasText);
  if (React.isValidElement(node) && node.type === React.Fragment) return hasText((node.props as { children?: React.ReactNode }).children);
  return true;
}

export function Basis({ children, beside = false, className = "" }: { children: React.ReactNode; beside?: boolean; className?: string }) {
  if (!hasText(children)) return null;
  return <p data-basis="" className={`${beside ? "" : "mt-6 "}text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]${className ? ` ${className}` : ""}`}>{children}</p>;
}
