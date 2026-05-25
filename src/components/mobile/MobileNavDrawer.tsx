/**
 * MobileNavDrawer
 * ===============
 *
 * Replaces the standard hamburger menu. Library-spine pattern:
 *   - Top: one-line search input.
 *   - Middle: four large tappable categories with sector icons.
 *   - Bottom: small links (Account, About, Pricing, Methodology, Contact).
 *
 * Slides in from the right. 90vw on mobile, capped at 360px on tablet.
 * Dismiss: tap the cream backdrop, swipe right, or press Escape.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlass, X, Globe, Storefront, MapPin, BookOpen, CaretRight,

} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";

export type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Optional account link; pass undefined to hide the row. */
  accountHref?: string;
};

type Category = { icon: PhIcon; label: string; subtitle: string; href: string };

const CATEGORIES: Category[] = [
  { icon: Globe,      label: "Pick a country",    subtitle: "196 economies",                    href: "/" },
  { icon: Storefront, label: "Browse industries", subtitle: "223 sectors",                      href: "/sectors" },
  /* useless-tile-ok: dead component, not mounted anywhere; pending deletion */
  { icon: MapPin,     label: "Browse cities",     subtitle: "245 measured cities",              href: "/cities" },
  { icon: BookOpen,   label: "Knowledge base",    subtitle: "Methodology and atlas guides",     href: "/learn" },
];

export default function MobileNavDrawer({ open, onClose, accountHref }: MobileNavDrawerProps) {
  const startX = useRef<number | null>(null);
  const [drag, setDrag] = useState(0);

  // Lock body scroll while open. Close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; setDrag(0); };
  const onTouchMove  = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const d = e.touches[0].clientX - startX.current;
    if (d > 0) setDrag(d);
  };
  const onTouchEnd = () => {
    if (drag > 80) onClose();
    startX.current = null;
    setDrag(0);
  };

  const small: Array<{ label: string; href: string }> = [
    ...(accountHref ? [{ label: "Account", href: accountHref }] : []),
    { label: "About",       href: "/about" },
    { label: "Pricing",     href: "/pricing" },
    { label: "Methodology", href: "/methodology" },
    { label: "Contact",     href: "/contact" },
  ];

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{
          background: "rgba(254, 251, 246, 0.75)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-cream-50 border-l border-parchment shadow-[-1px_0_0_var(--parchment),_-16px_0_32px_rgba(26,26,26,0.06)]"
        style={{
          width: "90vw",
          maxWidth: 360,
          transform: open ? `translateX(${drag}px)` : "translateX(100%)",
          transition: "transform 200ms ease-out",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <span className="font-display font-semibold text-lg text-ink-900 tracking-tight">Margin Atlas</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="w-9 h-9 flex items-center justify-center rounded-md text-cocoa-700"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 pb-4">
          <label className="relative block">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-700/55" aria-hidden="true">
              <MagnifyingGlass size={16} />
            </span>
            <input
              type="search"
              placeholder="Search countries, cities, industries"
              aria-label="Search Margin Atlas"
              className="w-full h-11 pl-9 pr-3 rounded-md text-[15px] bg-cream-100 border border-parchment text-ink-900"
            />
          </label>
        </div>

        <nav className="px-2" aria-label="Main sections">
          <ul>
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    onClick={onClose}
                    className="flex items-center gap-3 h-14 px-3 rounded-md text-ink-900"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 border border-amber-200 text-atlas-700">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[15px] font-semibold leading-tight">{c.label}</span>
                      <span className="block text-xs mt-0.5 text-cocoa-700/75">{c.subtitle}</span>
                    </span>
                    <CaretRight size={16} className="text-cocoa-700/50" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto px-5 pt-6 pb-5 border-t border-parchment">
          <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
            {small.map((s) => (
              <li key={s.label}>
                <Link href={s.href} onClick={onClose} className="text-sm text-cocoa-700">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[11px] text-cocoa-700/50">© 2026 Margin Atlas</p>
        </div>
      </aside>
    </>
  );
}
