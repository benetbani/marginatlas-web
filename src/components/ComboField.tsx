"use client";

import * as React from "react";

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
  /** The options are on their way (the home picker loads its lists on first use). An open field draws one "Loading…" row and no list,
   *  whatever is typed, and keeps typed words in the field on Enter, instead of filtering the little it holds and saying "No match". */
  loading?: boolean;
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

/* IN THE SPINE'S TOKENS (plan 2026-10-10, home reform, Task 2; the critique's P0.4 and P1.3, the ship audit's 1b.1 to 1b.4). The label
   in sentence case at 14px, weight 500, ink2, 8px above its field, with no star (a required field says so to a screen reader with
   aria-required); the field 48px tall, its corner the card's 12, its edge the control token at 3:1 (WCAG 1.4.11), its type 16px under
   768 so a phone does not zoom; an ink ring whenever focus is inside, so a field that was picked from or escaped still shows where
   focus is; the list's rows 44px, the highlighted row the soft fill with an ink bar, the examples in the muted grey, the card's own
   shadow; a row that says when nothing matches, and says it to a screen reader through a polite live region; on focus the label
   stays and is selected, so typing replaces it and a tap never blanks the field. The brown and the terracotta left the field.
   A field told `loading` says "Loading…" in that same row and region until its options arrive (the Task 2 review: typing before the
   home picker's lists came filtered the one option it held, and "No match" flashed). */

/** The card's two drops (CARD_SURFACE in src/components/spine/kit.tsx), written here so this client file never carries the kit. */
const CARD_SHADOW = "shadow-[0_1px_1px_rgba(43,28,22,0.04),0_8px_24px_-12px_rgba(43,28,22,0.10)]";
/** The one-line row under the field that says "No match for ‘x’" or "Loading…". */
const NOTE_ROW = `absolute z-20 mt-2 w-full rounded-xl border border-[var(--c-line-strong)] bg-white px-4 py-3 text-sm leading-5 text-[var(--c-ink2)] ${CARD_SHADOW}`;

/**
 * ComboField: a single field that's a dropdown AND a search-as-you-type filter.
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
  loading = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  /* What the reader has typed, or null while they have typed nothing since the field last settled: then the field shows the picked
     option's label. */
  const [query, setQuery] = React.useState<string | null>(null);
  const [focusIdx, setFocusIdx] = React.useState(-1);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  /* A focus that a press brought: the browser's mouseup would put the caret down and undo the selection made on focus. */
  const pressFocus = React.useRef(false);

  // Resolve currently selected label
  const selected = options.find((o) => o.value === value);
  const displayValue = query ?? selected?.label ?? "";

  /* ARIA ids for the combobox pattern below. Derived from the field id, which
     every call site already passes and which is unique per form. */
  const listboxId = `${id}-listbox`;
  const optionId = (i: number) => `${id}-option-${i}`;

  // Filter options by query. While the options are on their way there is nothing to filter, and no row can be lit or chosen.
  const q = (query ?? "").trim().toLowerCase();
  const filtered = loading
    ? []
    : !q
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
  /* Nothing matches what was typed: one row says so, and the live region says it to a screen reader. */
  const noMatch = open && !loading && q !== "" && filtered.length === 0;
  const noMatchLine = `No match for ‘${(query ?? "").trim()}’`;
  /* The options are still coming: the same row and region say so, in place of a list or of "No match". */
  const waiting = open && loading;

  /* KEEP THE HIGHLIGHTED OPTION ON SCREEN.
     listRef was declared and attached to the <ul> and then never read, so the
     scrolling it was presumably added for was never written. It matters at the
     sizes these lists actually reach: the country field holds 195 options and
     the business field over 200, and arrowing down past the visible rows moved
     a highlight nobody could see. block: "nearest" scrolls the minimum needed,
     so it does nothing when the option is already visible. */
  React.useEffect(() => {
    if (focusIdx < 0) return;
    const el = listRef.current?.children[focusIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [focusIdx]);

  // Close on outside click
  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery(null);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  /* Choose an option: the parent hears it, the list closes, what was typed is dropped and the highlight goes. */
  function choose(o: ComboOption) {
    onChange(o.value);
    setOpen(false);
    setQuery(null);
    setFocusIdx(-1);
  }

  // Commit on blur even when nothing is lit. Founder reported "Show me
  // the numbers" button unclickable on Berlin nightclubs: root cause was
  // ComboField never committing a typed value to state unless the user
  // explicitly clicked an option. Now: blurring auto-selects the lit row,
  // or the top match, when the query is non-empty and the filtered list
  // has at least one entry, so typed input always lands somewhere usable.
  // Only blur keeps the empty-query guard: leaving a field with nothing
  // typed must never pick the row the mouse last crossed. Enter has its
  // own branch in onKey.
  function commitTopMatch(): boolean {
    if (!q || filtered.length === 0) return false;
    const candidate = focusIdx >= 0 ? filtered[focusIdx] : filtered[0];
    if (!candidate) return false;
    choose(candidate);
    return true;
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
      /* The lit row is chosen whatever is typed: the arrow keys alone reach a row, and the Enter that was stopped for it picked
         nothing while the query was empty (the Task 2 review). With words typed and no row lit, the top match. Over "No match", or
         over "Loading…" with words typed, the Enter stays in the field, so the form never sends the previous pick for words that
         matched nothing yet or ever. Any other Enter is the form's own submit. */
      const lit = focusIdx >= 0 ? filtered[focusIdx] : undefined;
      if (lit) {
        e.preventDefault();
        choose(lit);
      } else if (q && filtered.length > 0) {
        e.preventDefault();
        choose(filtered[0]);
      } else if (noMatch || (waiting && q !== "")) {
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery(null);
      setFocusIdx(-1);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      {label ? (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-[var(--c-ink2)]">
          {label}
        </label>
      ) : null}
      <div
        className={`flex h-12 items-center rounded-xl border bg-white px-4 transition-colors focus-within:border-[var(--c-ink)] focus-within:ring-2 focus-within:ring-[var(--c-ink)] ${
          disabled ? "cursor-not-allowed border-[var(--control-line)] opacity-50" : "cursor-text border-[var(--control-line)] hover:border-[var(--c-ink2)]"
        }`}
        onMouseDown={(e) => {
          /* A press on the box's edge or its chevron keeps the focus in the field, so the list does not close and reopen. */
          if (e.target !== inputRef.current) e.preventDefault();
        }}
        onClick={() => {
          if (disabled) return;
          inputRef.current?.focus();
          setOpen(true);
        }}
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
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={expanded ? listboxId : undefined}
          aria-activedescendant={
            expanded && focusIdx >= 0 ? optionId(focusIdx) : undefined
          }
          aria-autocomplete="list"
          aria-required={required || undefined}
          autoComplete="off"
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusIdx(-1);
            setOpen(true);
          }}
          onMouseDown={() => {
            pressFocus.current = document.activeElement !== inputRef.current;
          }}
          onMouseUp={(e) => {
            if (pressFocus.current) {
              pressFocus.current = false;
              e.preventDefault();
            }
          }}
          onFocus={(e) => {
            if (disabled) return;
            setOpen(true);
            /* The label stays, selected whole: typing replaces it, a tap never blanks the field (the ship audit's 1b.4). */
            const el = e.currentTarget;
            el.setSelectionRange(0, el.value.length);
          }}
          onKeyDown={onKey}
          onBlur={() => {
            // Auto-commit the top match if the user typed something but
            // never picked an option. Fixes the Berlin-nightclubs button
            // (founder QA, 2026-05-22). Typed words that match nothing
            // give way to the picked option's label again, and a row lit
            // on the way past does not stay lit for the next visit (Enter
            // chooses the lit row, so a stale one would be chosen unseen).
            if (!commitTopMatch()) {
              setQuery(null);
              setOpen(false);
              setFocusIdx(-1);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="h-full min-w-0 flex-1 bg-transparent text-base font-medium text-[var(--c-ink)] outline-none placeholder:font-normal placeholder:text-[var(--c-muted)] focus-visible:outline-none md:text-sm"
        />
        {/* The chevron in ink2 (the critique's P1.1: terracotta marks answers, not controls). */}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          width="12"
          height="8"
          className={`ml-2 shrink-0 text-[var(--c-ink2)] transition-transform motion-reduce:transition-none${open ? " rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1.5 L6 6.5 L11 1.5" />
        </svg>
      </div>
      {expanded && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label || undefined}
          onMouseDown={(e) => e.preventDefault()}
          className={`absolute z-20 mt-2 max-h-[60vh] w-full overflow-auto rounded-xl border border-[var(--c-line-strong)] bg-white py-1 ${CARD_SHADOW}`}
        >
          {filtered.map((o, i) => (
            <li
              key={o.value}
              id={optionId(i)}
              role="option"
              aria-selected={focusIdx === i}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(o);
              }}
              onMouseEnter={() => setFocusIdx(i)}
              className={`cursor-pointer border-l-2 px-4 py-3 text-sm leading-5 transition-colors ${
                focusIdx === i
                  ? "border-[var(--c-ink)] bg-[var(--c-soft)]"
                  : "border-transparent hover:bg-[var(--c-soft)]"
              }`}
            >
              <span className="font-medium text-[var(--c-ink)]">{o.label}</span>
              {o.examples && o.examples.length > 0 && (
                <span className="ml-1.5 text-[var(--c-muted)]">
                  · {o.examples.slice(0, 3).join(", ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {noMatch ? (
        <div aria-hidden="true" data-no-match="" className={NOTE_ROW}>
          {noMatchLine}
        </div>
      ) : null}
      {waiting ? (
        <div aria-hidden="true" data-loading="" className={NOTE_ROW}>
          Loading…
        </div>
      ) : null}
      <p role="status" aria-live="polite" className="sr-only">
        {waiting ? "Loading…" : noMatch ? noMatchLine : ""}
      </p>
    </div>
  );
}
