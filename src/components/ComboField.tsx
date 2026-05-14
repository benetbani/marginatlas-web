"use client";

import { useEffect, useRef, useState } from "react";

export type ComboOption = {
  value: string;
  label: string;
  examples?: string[]; // shown in lighter tone as bracket examples
  keywords?: string[]; // not visible — used for search matching
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
  tooltip?: string; // ? icon explanation
  required?: boolean;
};

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
  tooltip,
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

  // Keyboard nav
  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setFocusIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && focusIdx >= 0) {
      e.preventDefault();
      const opt = filtered[focusIdx];
      if (opt) {
        onChange(opt.value);
        setOpen(false);
        setQuery("");
        setFocusIdx(-1);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <label htmlFor={id} className="block text-xs font-medium text-ink-700/80 mb-1">
        {label}
        {required && <span className="text-atlas-600 ml-0.5">*</span>}
        {tooltip && (
          <span
            title={tooltip}
            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200/70 text-ink-700/70 text-[10px] cursor-help"
            aria-label={tooltip}
          >
            ?
          </span>
        )}
      </label>
      <div
        className={`flex items-center px-3 py-2 rounded-lg border ${
          open ? "border-atlas-500 ring-2 ring-atlas-100" : "border-slate-200/80"
        } bg-white ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
        onClick={() => !disabled && setOpen(true)}
      >
        <input
          id={id}
          type="text"
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm text-ink-900 placeholder:text-ink-700/40"
        />
        <span className="text-ink-700/40 ml-2 text-xs">▼</span>
      </div>
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-20 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-slate-200/80 bg-white shadow-lg"
        >
          {filtered.slice(0, 50).map((o, i) => (
            <li
              key={o.value}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(o.value);
                setOpen(false);
                setQuery("");
                setFocusIdx(-1);
              }}
              onMouseEnter={() => setFocusIdx(i)}
              className={`px-3 py-2 cursor-pointer text-sm ${
                focusIdx === i ? "bg-atlas-50" : "hover:bg-slate-50"
              }`}
            >
              <span className="font-medium text-ink-900">{o.label}</span>
              {o.examples && o.examples.length > 0 && (
                <span className="text-ink-700/50 ml-1.5">
                  ({o.examples.slice(0, 3).join(", ")})
                </span>
              )}
            </li>
          ))}
          {filtered.length > 50 && (
            <li className="px-3 py-2 text-xs text-ink-700/50 italic">
              {filtered.length - 50} more — keep typing to narrow
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
