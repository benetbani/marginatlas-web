"use client";

import { useEffect, useRef, useState } from "react";

export type ComboOption = {
  value: string;
  label: string;
  examples?: string[]; // shown in lighter tone as bracket examples
  keywords?: string[]; // not visible: used for search matching
  group?: string; // optional group header
};

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  options: ComboOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
};

/* NO `tooltip` PROP, AND IT IS NOT COMING BACK BY ACCIDENT.
   It rendered a small circular "?" badge beside the label. The founder ruled on
   2026-08-09, on the two fields that used it: "you have set two question marks
   at the country and at the city, which is like a massive mistake."
   The prop is deleted rather than merely unused at the call sites, because a
   loaded prop with no consumers is how this comes back in six weeks. A label
   that needs a "?" to be understood is a label that failed; fix the label, or
   put the sentence in the field, and do not add a badge.

   THE SECOND HALF OF THAT RULING WAS NEVER CARRIED OUT, until 2026-08-16. The
   badges went and the sentence never arrived: country and city kept the generic
   "Pick or type…" default while the business field beside them, which never had
   a badge, carried "Type a business: restaurants, barbers, plumbers" and was
   the only one of the three that told a reader anything. Both now carry a real
   placeholder, in the same shape as the one that already worked. That is what
   "put the sentence in the field" asks for.

   NO `onFocus` PROP EITHER, for the same stated reason. It existed so the home
   page could freeze the rotating pre-fill on first interaction; that rotation
   was removed on 2026-08-16 for changing the form's own answer while a reader
   was deciding, and with it the last three call sites. Nothing passed it
   afterwards, so it went in the same sweep rather than sitting here as a loaded
   prop with no consumers. */

/**
 * ComboField — a single field that's a dropdown AND a search-as-you-type filter.
 *
 * Searches match: label, examples, and keywords (case-insensitive).
 * Bracket examples render in a lighter tone after the bold label.
 */
export function ComboField({
  id,
  label,
  placeholder = "Pick or type…",
  options,
  value,
  onChange,
  disabled = false,
  required = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Resolve currently selected label
  const selected = options.find((o) => o.value === value);
  const displayValue = open ? query : selected?.label || "";

  /* ARIA ids for the combobox pattern below. Derived from the field id, which
     every call site already passes and which is unique per form. */
  const listboxId = `${id}-listbox`;
  const optionId = (i: number) => `${id}-option-${i}`;

  // Filter options by query
  const q = query.trim().toLowerCase();
  const filtered = !q
    ? options
    : options.filter((o) => {
        if (o.label.toLowerCase().includes(q)) return true;
        if (o.examples?.some((e) => e.toLowerCase().includes(q))) return true;
        if (o.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
        return false;
      });

  /* The popup is only "expanded" when there is something in it. An
     aria-expanded of true over an empty list tells a screen reader to go
     looking for options that are not there. */
  const expanded = open && filtered.length > 0;

  /* KEEP THE HIGHLIGHTED OPTION ON SCREEN.
     listRef was declared and attached to the <ul> and then never read, so the
     scrolling it was presumably added for was never written. It matters at the
     sizes these lists actually reach: the country field holds 195 options and
     the business field over 200, and arrowing down past the visible rows moved
     a highlight nobody could see. block: "nearest" scrolls the minimum needed,
     so it does nothing when the option is already visible. */
  useEffect(() => {
    if (focusIdx < 0) return;
    const el = listRef.current?.children[focusIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [focusIdx]);

  // Close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Commit on Enter (or blur) even when nothing is
  // focused. Founder reported "Show me the numbers" button unclickable
  // on Berlin nightclubs — root cause was ComboField never committing
  // a typed value to state unless the user explicitly clicked an
  // option. Now: pressing Enter or blurring auto-selects the top match
  // when the query is non-empty and the filtered list has at least one
  // entry, so typed input always lands somewhere usable.
  function commitTopMatch() {
    if (!q || filtered.length === 0) return;
    const candidate = focusIdx >= 0 ? filtered[focusIdx] : filtered[0];
    if (candidate) {
      onChange(candidate.value);
      setOpen(false);
      setQuery("");
      setFocusIdx(-1);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setFocusIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      // Commit the focused option, or fall back to the top match for
      // the current query. Only block default if we actually commit
      // — otherwise allow the form's normal Enter-to-submit behavior.
      if (focusIdx >= 0 || (q && filtered.length > 0)) {
        e.preventDefault();
        commitTopMatch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-cocoa-700 mb-1.5"
      >
        {label}
        {required && <span className="text-atlas-600 ml-0.5">*</span>}
      </label>
      <div
        className={`flex items-center px-3.5 py-3 rounded-xl border transition-all ${
          open
            ? "border-atlas-500 ring-2 ring-atlas-500/30 shadow-sm"
            : "border-parchment hover:border-atlas-300"
        } bg-white ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
        onClick={() => !disabled && setOpen(true)}
      >
        {/* THE COMBOBOX PATTERN, which this field implemented in behaviour and
            not in semantics. It filters as you type, opens a list, moves a
            highlight with the arrow keys and commits on Enter, and it announced
            none of that: no role, no expanded state, no listbox, no options. To
            a screen reader it was a plain text box, on the primary instrument
            of the home page and on four other surfaces that share it.

            Per the ARIA combobox pattern: the input owns the role and points at
            the listbox it controls, aria-activedescendant names the highlighted
            option WITHOUT moving real focus (focus stays in the input, which is
            what lets you keep typing), and each row is an option that reports
            whether it is the active one.

            aria-controls is set only while open, because the <ul> is unmounted
            when closed and an IDREF pointing at nothing is worse than no IDREF. */}
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={expanded ? listboxId : undefined}
          aria-activedescendant={
            expanded && focusIdx >= 0 ? optionId(focusIdx) : undefined
          }
          aria-autocomplete="list"
          autoComplete="off"
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
          }}
          onKeyDown={onKey}
          onBlur={() => {
            // Auto-commit the top match if the user typed something but
            // never picked an option. Fixes the Berlin-nightclubs button
            // (founder QA, 2026-05-22).
            commitTopMatch();
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm font-medium text-ink-900 placeholder:text-cocoa-700/40 placeholder:font-normal"
        />
        {/* CitiesFix2 sec 3: brand chevron (vermillion atlas-700 SVG)
            replaces the generic unicode glyph. Same affordance, on-brand. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          width="12"
          height="8"
          className={`ml-2 shrink-0 transition-transform ${
            open ? "rotate-180 text-atlas-700" : "text-atlas-600"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1.5 L6 6.5 L11 1.5" />
        </svg>
      </div>
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-1.5 w-full max-h-[60vh] overflow-auto rounded-xl border border-parchment bg-white shadow-[0_10px_30px_rgba(120,53,15,0.12),inset_0_1px_0_rgba(255,255,255,0.5)]"
        >
          {filtered.map((o, i) => (
            <li
              key={o.value}
              id={optionId(i)}
              role="option"
              aria-selected={focusIdx === i}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(o.value);
                setOpen(false);
                setQuery("");
                setFocusIdx(-1);
              }}
              onMouseEnter={() => setFocusIdx(i)}
              className={`px-3.5 py-2 cursor-pointer text-sm border-l-2 transition-colors ${
                focusIdx === i
                  ? "bg-atlas-50 border-atlas-500"
                  : "border-transparent hover:bg-cream-100"
              }`}
            >
              <span className="font-medium text-ink-900">{o.label}</span>
              {o.examples && o.examples.length > 0 && (
                <span className="text-cocoa-700/60 ml-1.5">
                  · {o.examples.slice(0, 3).join(", ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
