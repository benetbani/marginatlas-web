"use client";

import { useState } from "react";

type Props = {
  text: string;
  size?: "sm" | "md";
};

/**
 * Tooltip — a small `?` icon that reveals a one-sentence explanation on hover/click.
 * Used to explain unavoidable technical concepts inline.
 */
export function Tooltip({ text, size = "sm" }: Props) {
  const [open, setOpen] = useState(false);
  const dim = size === "md" ? "w-5 h-5 text-xs" : "w-4 h-4 text-[10px]";
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={text}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
        className={`ml-1 inline-flex items-center justify-center ${dim} rounded-full bg-parchment/70 text-ink-700/70 hover:bg-atlas-100 hover:text-atlas-600 transition cursor-help`}
      >
        ?
      </button>
      {open && (
        <span className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-1 w-64 px-3 py-2 rounded-lg bg-ink-900 text-cream-50 text-xs leading-relaxed shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
