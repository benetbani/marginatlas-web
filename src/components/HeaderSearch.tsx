"use client";

/**
 * HeaderSearch — Plan v14 A.1 (T-A1.1).
 *
 * Wraps <GlobalSearch /> with a pathname check that hides the header search
 * on the homepage ("/") only. The homepage hero (Wave 4e) already mounts
 * <GlobalSearch /> inside the rotating-headline card as the primary CTA;
 * showing the header version simultaneously produced two visible search
 * affordances on the same screen. Every other route still gets the
 * persistent header search.
 */

import { usePathname } from "next/navigation";
import { GlobalSearch } from "@/components/GlobalSearch";

export function HeaderSearch() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <GlobalSearch />;
}
