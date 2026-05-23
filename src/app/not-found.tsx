/**
 * Atlas-themed 404. Replaces Next.js's default error page via the special
 * not-found.tsx convention. Calm, declarative, never blaming. Six escape
 * hatches so the reader always has a way back into the atlas.
 */

import Link from "next/link";
import {
  MapPin, Storefront, Globe, BookOpen, ArrowsLeftRight, Calculator,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";

export const metadata = {
  title: "Not found | Margin Atlas",
};

type Hatch = { icon: PhIcon; label: string; desc: string; href: string };

const ESCAPE_HATCHES: Hatch[] = [
  { icon: MapPin,          label: "Browse cities",          desc: "245 measured cities across the atlas",       href: "/cities" },
  { icon: Storefront,      label: "Browse industries",      desc: "223 sectors, ranked and explained",          href: "/sectors" },
  { icon: Globe,           label: "Pick a country",         desc: "Start from the world map",                   href: "/" },
  { icon: BookOpen,        label: "Read the knowledge base", desc: "Methodology, glossary, atlas guides",       href: "/learn" },
  { icon: ArrowsLeftRight, label: "Compare two places",     desc: "Side-by-side country, city, or sector",      href: "/compare" },
  { icon: Calculator,      label: "Use the calculator",     desc: "Plug your numbers into the typical operator", href: "/calculator" },
];

export default function NotFound() {
  return (
    <main className="w-full bg-cream-50 min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
        <div className="text-center">
          <p
            aria-hidden="true"
            className="font-display tabular-nums font-bold text-atlas-700 leading-none tracking-[-0.04em]"
            style={{ fontSize: "clamp(72px, 12vw, 144px)" }}
          >
            404
          </p>
          <h1 className="sr-only">This page isn't part of the atlas.</h1>
          <p
            aria-hidden="true"
            className="font-display mt-3 font-semibold text-ink-900 tracking-[-0.018em] leading-tight"
            style={{ fontSize: "clamp(28px, 3.6vw, 40px)" }}
          >
            This page isn't part of the atlas.
          </p>
          <p
            className="font-display italic mt-3 max-w-xl mx-auto text-cocoa-700 text-balance leading-relaxed"
            style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}
          >
            Atlas might add this combination later, or the URL might be misspelled. Either way, here are six places that always work.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ESCAPE_HATCHES.map((h) => {
            const Icon = h.icon;
            return (
              <li key={h.label}>
                <Link
                  href={h.href}
                  className="block h-full rounded-lg p-5 bg-cream-50 border border-parchment text-ink-900 transition-shadow hover:bg-white hover:shadow-[0_1px_2px_rgba(26,26,26,0.04),_0_6px_16px_rgba(26,26,26,0.06)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 border border-amber-200 text-atlas-700">
                      <Icon size={18} weight="regular" aria-hidden="true" />
                    </span>
                    <ArrowRight size={14} className="text-cocoa-700/50" aria-hidden="true" />
                  </div>
                  <p className="font-display mt-4 text-lg font-semibold tracking-[-0.012em]">
                    {h.label}
                  </p>
                  <p className="mt-1 text-sm text-cocoa-700 leading-snug">{h.desc}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-12 text-center text-xs text-cocoa-700/60">
          <Link href="/contact?reason=broken-link" className="underline-offset-4 hover:underline">
            Report this broken link
          </Link>
        </p>
      </div>
    </main>
  );
}
