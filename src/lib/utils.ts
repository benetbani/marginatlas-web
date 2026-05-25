// Canonical shadcn/ui className utility. Combines clsx (conditional
// class composition) with tailwind-merge (de-duplicates conflicting
// Tailwind utilities, keeping the last one wins). Used by every
// primitive under src/components/ui/.
//
// Note: a tiny legacy joiner exists at src/lib/cn.ts and is still used
// by older components. New shadcn primitives import from here.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
