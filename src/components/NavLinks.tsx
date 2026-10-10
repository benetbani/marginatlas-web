"use client";

/**
 * NavLinks , the masthead's seven names from 1280 (plan 2026-10-10, the home reformed to ship, Task 1; the critique's section 5,
 * the ship audit's 1.5 and 1.14). One list (src/lib/nav.ts), each name a next/link, inside the bar's `<nav aria-label="Primary">`:
 * the bar's navigation had no name and nothing marked the page being read, and every click was a full document load.
 *
 * The page being read is marked for a screen reader (`aria-current="page"`) and for the eye: ink, a 2px ink underline 6px under the
 * words. Every other name is --c-ink2 and goes to ink with a 1px --c-line-strong underline on hover. Nothing here is terracotta
 * (MODEL.md PART 6: terracotta never marks a link or a hover; his ruling of 2026-07-11). A client island only because the page
 * being read comes from the address (usePathname, HeaderSearch.tsx's idiom).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, NAV_CURRENT, NAV_IDLE, currentNav } from "@/lib/nav";

export function NavLinks() {
  const current = currentNav(usePathname());
  return (
    <nav aria-label="Primary" className="hidden xl:flex items-center gap-6 text-base">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={current === item.href ? "page" : undefined}
          className={current === item.href ? NAV_CURRENT : NAV_IDLE}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
