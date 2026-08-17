"use client";

/**
 * SavedClient.
 *
 * PALETTE, 2026-08-17: the two destructive controls ("Clear all", "Remove")
 * hovered to `rose-700`, a STOCK Tailwind ramp that no token file on this site
 * defines, so verify_palette_membership had no word for it until 443a938e.
 * They now hover to `clay-700`, which is not a nearest-match substitution:
 * design-tokens names clay "the DESTRUCTIVE color" in those words and reserves
 * red for the brand. The signal is unchanged and the token is now the right
 * one, which it was not before.
 */

import { useEffect, useState } from "react";

const SAVED_KEY = "atlas.saved";

type CellRef = { country: string; geo: string; industry: string; label: string };

export function SavedClient() {
  const [list, setList] = useState<CellRef[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      setList(raw ? JSON.parse(raw) : []);
    } catch {
      setList([]);
    }
  }, []);

  function remove(key: string) {
    if (!list) return;
    const next = list.filter((c) => `${c.country}/${c.geo}/${c.industry}` !== key);
    setList(next);
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {}
  }

  function clearAll() {
    setList([]);
    try {
      localStorage.removeItem(SAVED_KEY);
    } catch {}
  }

  if (list === null) {
    return <p className="text-sm text-ink-700/70">Loading…</p>;
  }
  if (list.length === 0) {
    return (
      <div className="card max-w-xl">
        {/* IT TOLD READERS TO CLICK A BUTTON THAT DOES NOT EXIST. The copy was
            "click the ★ Save button to add it here", and there is no Save
            control anywhere on the site: the only ★ in the codebase is the
            Australian primary-data badge and the confidence scale on
            /about-data.

            This is the whole page in practice. "atlas.saved", the key read
            above, is written by nothing, so the list is always empty and this
            paragraph is all that ever renders.

            What does exist is WATCH, on a different key (atlas:watch:v1),
            surfaced by the AddToWatch button and the floating tray. So the
            instruction now names the control a reader can actually find. */}
        <p className="text-sm text-ink-800">
          Nothing saved here yet. On any benchmark page, the{" "}
          <span className="font-medium">Watch</span> button keeps a place or a
          trade on your shortlist, and the tray at the bottom of the screen
          holds what you have picked.
        </p>
        <a
          href="/"
          className="mt-4 inline-block text-sm text-atlas-600 hover:underline"
        >
          Use the navigator to find your first benchmark →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-700/70">{list.length} saved</p>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-ink-700/60 hover:text-clay-700 transition"
        >
          Clear all
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((c) => {
          const key = `${c.country}/${c.geo}/${c.industry}`;
          return (
            <div
              key={key}
              className="card flex flex-col gap-2 hover:border-atlas-500 transition"
            >
              <a
                href={`/${key}`}
                className="block text-sm font-medium text-ink-900 hover:text-atlas-600"
              >
                {c.label}
              </a>
              <div className="text-xs text-ink-700/60">/{key}</div>
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-paper-350/60">
                <a
                  href={`/${key}`}
                  className="text-xs text-atlas-600 hover:underline"
                >
                  Open →
                </a>
                <button
                  type="button"
                  onClick={() => remove(key)}
                  className="text-xs text-ink-700/60 hover:text-clay-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
