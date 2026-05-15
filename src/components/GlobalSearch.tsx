"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, SECTORS, industryToSlug, visibleIndustries } from "@/lib/taxonomy";
import { flagFromIso2 } from "@/lib/countries";

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
  kind: "industry" | "country" | "sector";
  id: string;
  label: string;
  flag?: string;
  icon?: string;
  examples?: string[];
};

/**
 * GlobalSearch — header-bar search that matches industries, countries, sectors.
 * Triggered by ⌘K / Ctrl+K or by clicking the search icon.
 */
export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(0);
  const [gate, setGate] = useState({ revealMixed: false, revealCorp: false });
  const inputRef = useRef<HTMLInputElement>(null);

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

  const q = query.trim().toLowerCase();
  const visible = visibleIndustries(gate);
  const results: SearchResult[] = !q
    ? []
    : [
        // Industries (highest priority, audience-gated, alphabetical tie-break)
        ...visible
          .filter(
            (i) =>
              i.name.toLowerCase().includes(q) ||
              i.keywords.some((k) => k.includes(q)) ||
              i.examples.some((e) => e.toLowerCase().includes(q))
          )
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 8)
          .map((i) => ({
            kind: "industry" as const,
            id: i.id,
            label: i.name,
            examples: i.examples,
          })),
        // Countries (alphabetical, flag-prefixed)
        ...[...COUNTRIES]
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(
            (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q
          )
          .slice(0, 4)
          .map((c) => ({
            kind: "country" as const,
            id: c.code,
            label: c.name,
            flag: flagFromIso2(c.code),
          })),
        // Sectors
        ...[...SECTORS]
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.examples.some((e) => e.toLowerCase().includes(q))
          )
          .slice(0, 4)
          .map((s) => ({
            kind: "sector" as const,
            id: s.id,
            label: s.name,
            icon: s.icon,
            examples: s.examples,
          })),
      ];

  function pickResult(r: SearchResult) {
    if (r.kind === "industry") {
      router.push(`/us/california/${industryToSlug(r.id)}`);
    } else if (r.kind === "country") {
      router.push(`/${r.id.toLowerCase()}`);
    } else if (r.kind === "sector") {
      router.push(`/sectors/${r.id}`);
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
          className="fixed inset-0 z-40 flex items-start justify-center pt-24 px-4 bg-ink-900/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
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
                placeholder="Search industries, countries, sectors…"
                className="flex-1 outline-none text-sm text-ink-900 placeholder:text-ink-500"
              />
              <kbd className="text-xs text-ink-500 px-1.5 py-0.5 rounded border border-ink-200">Esc</kbd>
            </div>
            {results.length > 0 ? (
              <ul className="max-h-96 overflow-auto py-1">
                {results.map((r, i) => (
                  <li
                    key={`${r.kind}-${r.id}`}
                    onMouseEnter={() => setFocusIdx(i)}
                    onClick={() => pickResult(r)}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-3 ${
                      focusIdx === i ? "bg-atlas-50" : "hover:bg-ink-100/40"
                    }`}
                  >
                    <span className="pill bg-cream-200 text-cocoa-700">{r.kind}</span>
                    {r.flag && (
                      <span className="flag text-lg" aria-hidden>{r.flag}</span>
                    )}
                    {r.icon && (
                      <span className="text-lg" aria-hidden>{r.icon}</span>
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
                  {["restaurants", "bakeries", "plumbers", "software", "Germany", "Manufacturing"].map((t) => (
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
