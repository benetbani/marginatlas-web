/**
 * CityPicker — autocomplete combobox covering all 102 cities in
 * TOP_100_CITIES + 80 NEIGHBORHOOD_ALIASES (Plan v8 Track S.4).
 *
 * Client component. On selection, navigates to the city cell page for
 * the default industry (restaurants — universal anchor).
 */

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { TOP_100_CITIES, NEIGHBORHOOD_ALIASES, type CityEntry } from "@/lib/cities";

type Option = {
  label: string;       // "Madrid, Spain"
  href: string;        // "/es/madrid/restaurants"
  tier?: number;
  hint: string;        // "city" or "neighborhood"
};

function buildOptions(): Option[] {
  const out: Option[] = [];
  for (const c of TOP_100_CITIES as CityEntry[]) {
    out.push({
      label: `${c.name}, ${c.country_name}`,
      href: `/${c.country.toLowerCase()}/${c.slug}/restaurants`,
      tier: c.tier,
      hint: c.tier === 1 ? "Global metropolis" : c.tier === 2 ? "Major city" : "City",
    });
  }
  for (const [country, aliases] of Object.entries(NEIGHBORHOOD_ALIASES)) {
    for (const slug of Object.keys(aliases)) {
      out.push({
        label: `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} (${country})`,
        href: `/${country.toLowerCase()}/${slug}/restaurants`,
        hint: "Neighborhood",
      });
    }
  }
  return out;
}

const ALL_OPTIONS = buildOptions();

export function CityPicker() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return ALL_OPTIONS
      .filter((o) => o.label.toLowerCase().includes(needle))
      .sort((a, b) => (a.tier ?? 4) - (b.tier ?? 4))
      .slice(0, 8);
  }, [q]);

  useEffect(() => {
    setHighlighted(0);
  }, [q]);

  function go(href: string) {
    window.location.href = href;
  }

  return (
    <section className="my-12">
      <div className="rounded-2xl border border-parchment bg-cream-100 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-ink-900">
          Or pick a city directly
        </h2>
        <p className="mt-2 text-sm text-ink-800/80 max-w-2xl">
          Type the first letters of any city, borough, or neighborhood: over
          200 curated locations across all covered countries.
        </p>
        <div className="mt-5 relative max-w-xl">
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlighted((h) => Math.min(h + 1, matches.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlighted((h) => Math.max(h - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const m = matches[highlighted];
                if (m) go(m.href);
              }
            }}
            placeholder="Try: Westminster, Mumbai, Cuauhtémoc, Berlin, Tirana..."
            className="w-full px-4 py-3 rounded-lg border border-cream-400 focus:border-atlas-600 focus:ring-2 focus:ring-atlas-300 focus:outline-none text-sm bg-white text-ink-900 placeholder:text-ink-500/60"
            aria-autocomplete="list"
            aria-expanded={focused && matches.length > 0}
            role="combobox"
          />
          {focused && matches.length > 0 && (
            <div
              className="absolute z-30 left-0 right-0 mt-1 rounded-lg border border-cream-400 bg-white shadow-lg max-h-80 overflow-y-auto"
              role="listbox"
            >
              {matches.map((m, i) => (
                <button
                  key={m.href}
                  onClick={() => go(m.href)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition ${
                    i === highlighted
                      ? "bg-atlas-100 text-atlas-900"
                      : "text-ink-900 hover:bg-cream-100"
                  }`}
                  role="option"
                  aria-selected={i === highlighted}
                >
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-[10px] uppercase tracking-wider text-ink-700/60">
                    {m.hint}
                  </span>
                </button>
              ))}
            </div>
          )}
          {focused && q.trim() && matches.length === 0 && (
            <div className="absolute z-30 left-0 right-0 mt-1 rounded-lg border border-cream-400 bg-white shadow-lg px-4 py-3 text-sm text-ink-700/70">
              No city matches. Try a major metro or check spelling.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
