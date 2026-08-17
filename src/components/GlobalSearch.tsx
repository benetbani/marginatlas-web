"use client";

import { useState, useEffect, useRef, useId } from "react";

/**
 * How well a result answers the query. Lower is better.
 *
 * WHY THIS EXISTS. Results were sorted alphabetically, and the highlight starts
 * on the first one, so Enter went wherever the alphabet pointed rather than
 * where the reader was going. Measured against the real taxonomy:
 *
 *   "rest" gave Fast-casual restaurants, Forestry & logging, Restaurants, ...
 *   "bak"  gave Artisan bakery (wholesale), Bakeries (retail), ...
 *
 * Typing "rest" and pressing Enter landed on fast-casual restaurants, and
 * "bak" on an artisan wholesale bakery. Forestry ranked second on "rest"
 * because "fo-rest-ry" contains the letters, which is the kind of match that
 * should exist and should never outrank the word itself.
 *
 * It also fixes a quieter bug: the sort ran BEFORE slice(0, 8), so when more
 * than eight matched, the eight kept were the alphabetically first eight. A
 * strong match late in the alphabet could be cut from the list entirely rather
 * than merely ranked low.
 *
 * The tiers are deliberately blunt, and there is no fuzzy scoring: an exact
 * name, then a name that starts with the query, then any word in the name that
 * does, then the keyword aliases, then a bare substring anywhere. Alphabetical
 * inside a tier, so the order is still stable and explainable.
 */
function rankMatch(name: string, keywords: string[], q: string): number {
  const n = name.toLowerCase();
  if (n === q) return 0;
  if (n.startsWith(q)) return 1;
  if (n.split(/[^a-z0-9]+/i).some((w) => w.toLowerCase().startsWith(q))) return 2;
  if (keywords.some((k) => k.toLowerCase() === q)) return 3;
  if (keywords.some((k) => k.toLowerCase().startsWith(q))) return 4;
  if (n.includes(q)) return 5;
  return 6;
}
import { useRouter } from "next/navigation";
import { COUNTRIES, industryToSlug, visibleIndustries } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";

function readClientGate(): { revealMixed: boolean; revealCorp: boolean } {
  if (typeof window === "undefined") return { revealMixed: false, revealCorp: false };
  const params = new URLSearchParams(window.location.search);
  const cookie = document.cookie || "";
  const cookiePro = /(?:^|;\s*)atlas_pro=1(?:;|$)/.test(cookie);
  const showLarge = params.get("show_large") === "1" || params.get("show_large") === "true";
  const showMixed = params.get("show_mixed") === "1" || params.get("show_mixed") === "true";
  const pro = params.get("pro") === "1" || params.get("pro") === "true" || cookiePro;
  return {
    revealCorp: pro || showLarge,
    revealMixed: pro || showMixed || showLarge,
  };
}

type SearchResult = {
  kind: "industry" | "country";
  id: string;
  label: string;
  /** ISO-2 country code — set for kind === "country" so we can render <CountryFlag>. */
  iso2?: string;
  examples?: string[];
};

/**
 * GlobalSearch: header-bar search that matches industries and countries.
 * Triggered by ⌘K / Ctrl+K or by clicking the search icon.
 */
export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(0);
  const [gate, setGate] = useState({ revealMixed: false, revealCorp: false });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* ARIA ids. useId rather than a literal, because this is a shared component
     and two mounted copies would otherwise both answer to the same id. */
  const rid = useId();
  const listboxId = `${rid}-results`;
  const optionId = (i: number) => `${rid}-result-${i}`;

  // Read the client-side gate on mount (Plan v3.0 §P).
  useEffect(() => {
    setGate(readClientGate());
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 30);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Keep the highlighted result on screen. The list is max-h-96 with its own
     scrollbar, so arrowing past the visible rows moved a highlight the reader
     could not see. Same omission ComboField carried. */
  useEffect(() => {
    const el = listRef.current?.children[focusIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [focusIdx]);

  const q = query.trim().toLowerCase();
  const visible = visibleIndustries(gate);
  /* Ranked within each kind, capped per kind, then merged by rank.
     Industries still win a tie, which is the "industries have highest
     priority" rule this list has always carried, and the rule that matters:
     equal-quality match, trade first, on a site about trades.

     What changed is that priority is no longer unconditional. Industries were
     emitted before countries whatever they matched on, so "ger" returned eight
     weak substring hits, "linGERie" and a refrigeration keyword among them,
     ahead of Germany. That is the same defect as forestry outranking
     restaurants, one level up: a letters-happen-to-appear match should exist
     and should never beat the word itself. */
  const industryHits = !q
    ? []
    : visible
        .filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.keywords.some((k) => k.includes(q)) ||
            i.examples.some((e) => e.toLowerCase().includes(q))
        )
        .map((i) => ({
          rank: rankMatch(i.name, i.keywords, q),
          tie: 0,
          result: {
            kind: "industry" as const,
            id: i.id,
            label: i.name,
            examples: i.examples,
          },
        }))
        .sort((a, b) => a.rank - b.rank || a.result.label.localeCompare(b.result.label))
        .slice(0, 8);

  const countryHits = !q
    ? []
    : COUNTRIES.filter(
        (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q
      )
        .map((c) => ({
          rank: rankMatch(c.name, [c.code.toLowerCase()], q),
          tie: 1,
          result: {
            kind: "country" as const,
            id: c.code,
            label: c.name,
            iso2: c.code,
          },
        }))
        .sort((a, b) => a.rank - b.rank || a.result.label.localeCompare(b.result.label))
        .slice(0, 4);

  const results: SearchResult[] = [...industryHits, ...countryHits]
    .sort(
      (a, b) =>
        a.rank - b.rank ||
        a.tie - b.tie ||
        a.result.label.localeCompare(b.result.label)
    )
    .map((h) => h.result);

  function pickResult(r: SearchResult) {
    if (r.kind === "industry") {
      /* THE INDUSTRY'S OWN PAGE, not a state nobody asked for.
         This pushed /us/california/{slug}, so every trade searched from the
         masthead of a world atlas landed in California, with no comment saying
         why. A result row labelled "industry" carrying no place should not
         answer with a place: the reader picked a trade, not a trade in
         California.

         It was also inconsistent with the line below, which sends a country
         result to that country's own page. Countries resolved to the entity,
         industries resolved to one arbitrary cell of it.

         Same slug either way: /industries/[industry] is built from
         industryToSlug over the same taxonomy, and dynamicParams is true so a
         trade outside the prerendered smb_core cap still renders. Checked in
         production across a spread of eight slugs, core and not, including
         forestry-logging and lingerie-intimates: all 200. */
      router.push(`/industries/${industryToSlug(r.id)}`);
    } else if (r.kind === "country") {
      router.push(`/${r.id.toLowerCase()}`);
    }
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 30);
        }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ink-200 bg-white hover:border-atlas-500 text-sm text-ink-700 transition"
        aria-label="Search Margin Atlas"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <span className="hidden md:inline text-xs text-ink-500 ml-2">⌘K</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center pt-24 px-4 bg-ink-900/65"
          onClick={() => setOpen(false)}
        >
          {/* A DIALOG THAT DID NOT SAY IT WAS ONE. This overlay covers the page,
              takes focus and traps the Escape key, and announced none of it: a
              screen reader met an unlabelled div, with the page behind it still
              reachable in the reading order. role and aria-modal are what tell
              assistive tech that the rest of the document is inert while this is
              up, and the label names it once it is. */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search Margin Atlas"
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-ink-200">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-ink-500 mr-3"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                /* A placeholder is not a label: it disappears the moment
                   anyone types, and it is not reliably announced. This is the
                   site-wide search, so it is the one control every reader
                   meets. */
                aria-label="Search industries and countries"
                /* The combobox pattern, same as ComboField. This filters as you
                   type and moves a highlight with the arrow keys; without these
                   it was a plain text box and the results below it were an
                   unannounced list. aria-controls only while there is a list to
                   point at, so the IDREF cannot dangle. */
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls={results.length > 0 ? listboxId : undefined}
                aria-activedescendant={
                  results.length > 0 ? optionId(focusIdx) : undefined
                }
                aria-autocomplete="list"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocusIdx(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setFocusIdx((i) => Math.min(i + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setFocusIdx((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter" && results[focusIdx]) {
                    pickResult(results[focusIdx]);
                  }
                }}
                placeholder="Search industries and countries…"
                className="flex-1 outline-none text-sm text-ink-900 placeholder:text-ink-500"
              />
              <kbd className="text-xs text-ink-500 px-1.5 py-0.5 rounded border border-ink-200">Esc</kbd>
            </div>
            {results.length > 0 ? (
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label="Search results"
                className="max-h-96 overflow-auto py-1"
              >
                {results.map((r, i) => (
                  <li
                    key={`${r.kind}-${r.id}`}
                    id={optionId(i)}
                    role="option"
                    aria-selected={focusIdx === i}
                    onMouseEnter={() => setFocusIdx(i)}
                    onClick={() => pickResult(r)}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-3 ${
                      focusIdx === i ? "bg-atlas-50" : "hover:bg-ink-100/40"
                    }`}
                  >
                    <span className="pill bg-paper-200 text-cocoa-700">{r.kind}</span>
                    {r.iso2 && (
                      <CountryFlag iso2={r.iso2} label={r.label} className="w-5" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink-900">{r.label}</div>
                      {r.examples && r.examples.length > 0 && (
                        <div className="text-xs text-ink-700/60 mt-0.5">
                          ({r.examples.slice(0, 4).join(", ")})
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : query ? (
              <div className="px-4 py-8 text-sm text-ink-600 text-center">
                Nothing matches "{query}" yet. Try a broader term.
              </div>
            ) : (
              <div className="px-4 py-8 text-sm text-ink-600">
                <div className="mb-3 text-xs uppercase tracking-wide text-ink-500">Try searching for</div>
                <div className="flex flex-wrap gap-2">
                  {["restaurants", "bakeries", "plumbers", "software", "Germany", "France"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="px-2.5 py-1 rounded-full bg-ink-100 hover:bg-atlas-100 text-xs text-ink-700"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
