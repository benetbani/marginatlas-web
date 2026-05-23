/**
 * MobileBreadcrumb
 * ================
 *
 * Horizontally scrollable breadcrumb that collapses long paths so the user
 * always sees where they are, even on a 320px screen.
 *
 * Path length policy:
 *   - Up to 4 items: render all items.
 *   - 5+ items: render first item, a "..." chip, last item. Tapping the
 *     "..." chip expands the full path inline.
 *
 * The breadcrumb is sticky under the page header. Caret-right between items.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

export type MobileBreadcrumbItem = {
  label: string;
  href: string;
};

export type MobileBreadcrumbProps = {
  items: MobileBreadcrumbItem[];
  /** Distance from the top of the viewport at which the bar sticks. */
  stickyTop?: number;
  className?: string;
};

export default function MobileBreadcrumb({
  items,
  stickyTop = 48,
  className,
}: MobileBreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = items.length > 4 && !expanded;

  const display: (MobileBreadcrumbItem & { isCollapsed?: boolean })[] = shouldCollapse
    ? [
        items[0],
        { label: "…", href: "#", isCollapsed: true },
        items[items.length - 1],
      ]
    : items;

  return (
    <div
      className={`sticky z-10 overflow-x-auto no-scrollbar bg-cream-50/92 backdrop-blur border-b border-parchment ${className ?? ""}`}
      style={{ top: stickyTop }}
    >
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 px-5 py-2.5 whitespace-nowrap text-xs font-medium text-cocoa-700"
      >
        {display.map((item, i) => {
          const isLast = i === display.length - 1;
          return (
            <span key={`${item.label}-${i}`} className="flex items-center gap-1 shrink-0">
              {item.isCollapsed ? (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  aria-label={`Show ${items.length - 2} hidden levels`}
                  className="h-6 px-2 rounded-full font-semibold bg-cream-100 border border-parchment text-cocoa-700"
                >
                  …
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`px-1 py-0.5 rounded ${isLast ? "font-semibold text-ink-900" : "text-cocoa-700"}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <CaretRight size={11} className="text-cocoa-700/45 shrink-0" aria-hidden="true" />
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}

/* Helper to hide the WebKit scrollbar — add to globals.css if not already:

   .no-scrollbar::-webkit-scrollbar { display: none; }
   .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
