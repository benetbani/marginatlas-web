"use client";

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
        <p className="text-sm text-ink-800">
          No saved snapshots yet. Open any benchmark page and click the{" "}
          <span className="font-medium">★ Save</span> button to add it here.
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
          className="text-xs text-ink-700/60 hover:text-rose-700 transition"
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
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-ink-200/60">
                <a
                  href={`/${key}`}
                  className="text-xs text-atlas-600 hover:underline"
                >
                  Open →
                </a>
                <button
                  type="button"
                  onClick={() => remove(key)}
                  className="text-xs text-ink-700/60 hover:text-rose-700 transition"
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
