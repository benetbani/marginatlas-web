/**
 * src/components/cities/CitySearchBox.tsx
 *
 * The predictive city-name search on /cities. A reader types the first letters
 * of any covered city and the box offers up to eight matches, each a link to
 * that city's page. It sits directly under the world map: the map is the
 * spatial way in, this is the by-name way in.
 *
 * Client component. The page (a server component) passes the full covered-city
 * list as a prop; all filtering happens here in the browser, so there is no
 * query and no round-trip. It invents nothing: it only links to the same
 * /cities/{slug} pages the directory below already lists.
 *
 * Degrades without JavaScript: with JS off the input renders but does nothing
 * harmful, and the grouped directory below stays fully usable, so the box is
 * an accelerator rather than a dependency. The input carries the combobox
 * role, the dropdown the listbox role, and each row an option with
 * aria-selected, with aria-activedescendant tracking the highlighted row, so a
 * screen reader follows the keyboard.
 *
 * Keyboard: ArrowDown / ArrowUp move the highlight, Enter follows the
 * highlighted city, Escape closes the list. Tokens only, mobile-first; no
 * em-dashes.
 */
"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CountryFlag } from "@/components/CountryFlag";

/** One covered city, as the server hands it to the box. */
export type CitySearchItem = {
  name: string;
  slug: string;
  iso2: string;
};

/** How many matches the dropdown shows at most. */
const MAX_MATCHES = 8;

type RankedMatch = CitySearchItem & {
  /** 0 when the name starts with the query, 1 when it merely contains it. */
  startsWithRank: number;
};

/**
 * Filter the city list for a query: case-insensitive, name startsWith first
 * then contains, capped. A name that starts with the query sorts ahead of one
 * that only contains it, then ties break alphabetically, so the most likely
 * city leads.
 */
function matchesFor(query: string, cities: CitySearchItem[]): CitySearchItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const ranked: RankedMatch[] = [];
  for (const city of cities) {
    const name = city.name.toLowerCase();
    const idx = name.indexOf(needle);
    if (idx === -1) continue;
    ranked.push({ ...city, startsWithRank: idx === 0 ? 0 : 1 });
  }
  ranked.sort(
    (a, b) =>
      a.startsWithRank - b.startsWithRank || a.name.localeCompare(b.name),
  );
  return ranked.slice(0, MAX_MATCHES);
}

export function CitySearchBox({ cities }: { cities: CitySearchItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const matches = useMemo(() => matchesFor(query, cities), [query, cities]);
  const showList = open && matches.length > 0;
  const showEmpty = open && query.trim().length > 0 && matches.length === 0;

  function go(slug: string) {
    setOpen(false);
    router.push(`/cities/${slug}`);
  }

  function onChange(value: string) {
    setQuery(value);
    setOpen(true);
    setHighlighted(0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      const m = matches[highlighted];
      if (m) {
        e.preventDefault();
        go(m.slug);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative mt-6 md:mt-8 max-w-xl">
      <label htmlFor={`${baseId}-input`} className="sr-only">
        Search covered cities by name
      </label>
      <input
        ref={inputRef}
        id={`${baseId}-input`}
        type="text"
        value={query}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
        placeholder="Search a city by name"
        className="w-full rounded-lg border border-parchment bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-cocoa-500/70 focus:border-atlas-600 focus:outline-none focus:ring-2 focus:ring-atlas-300"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showList ? optionId(highlighted) : undefined
        }
      />

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Matching cities"
          className="absolute left-0 right-0 z-30 mt-1 max-h-80 overflow-y-auto rounded-lg border border-parchment bg-white py-1 shadow-lg"
        >
          {matches.map((m, i) => (
            <li key={m.slug} role="option" aria-selected={i === highlighted} id={optionId(i)}>
              <Link
                href={`/cities/${m.slug}`}
                onMouseEnter={() => setHighlighted(i)}
                onMouseDown={(e) => {
                  // Commit the navigation before the input blur can close the
                  // list, so a click always lands.
                  e.preventDefault();
                  go(m.slug);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  i === highlighted
                    ? "bg-atlas-100 text-atlas-900"
                    : "text-ink-900 hover:bg-cream-100"
                }`}
              >
                <CountryFlag iso2={m.iso2} className="w-5" />
                <span className="font-medium">{m.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {showEmpty ? (
        <div className="absolute left-0 right-0 z-30 mt-1 rounded-lg border border-parchment bg-white px-4 py-3 text-sm text-cocoa-700/80 shadow-lg">
          No city by that name yet. Try a nearby metro or use the map above.
        </div>
      ) : null}
    </div>
  );
}
