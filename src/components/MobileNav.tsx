"use client";

/**
 * MobileNav - the below-md header navigation (R5 Part 8 mobile-chrome fix).
 *
 * The desktop nav is `hidden md:flex`; before this component the header had
 * NO navigation at all on phones (only a logo and the search icon). This adds
 * a real hamburger button shown only below md that toggles a simple menu of
 * the same primary links the desktop nav carries. The dead MobileNavDrawer
 * (which pulled a banned icon dependency) is gone; this is the replacement.
 *
 * Token styling only. Inline SVG glyphs (no icon library, no emoji). The menu
 * closes on any link tap and on Escape. WCAG AA: aria-expanded on the toggle,
 * visible focus ring on every interactive element, >= 44px touch targets.
 */

import * as React from "react";

// Mirror of the desktop nav's primary links (kept in sync with layout.tsx).
// Pricing is included here as a normal row; the desktop CTA pill is a
// desktop-only visual treatment and does not need to be replicated on mobile.
const LINKS: { href: string; label: string }[] = [
  { href: "/countries", label: "Countries" },
  { href: "/industries", label: "Activities" },
  { href: "/cities", label: "Cities" },
  { href: "/extremes", label: "Extremes" },
  { href: "/tools", label: "Tools" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  // Close on Escape for keyboard users.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-800 transition-colors hover:text-atlas-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {open ? (
          // Close glyph.
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          // Hamburger glyph.
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div
          id="mobile-nav-menu"
          className="absolute inset-x-0 top-full z-dropdown border-b border-parchment bg-white shadow-card"
        >
          <nav aria-label="Primary" className="max-w-7xl mx-auto px-6 py-2">
            <ul className="flex flex-col">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center text-base text-ink-800 transition-colors hover:text-atlas-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
