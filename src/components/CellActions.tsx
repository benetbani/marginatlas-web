"use client";

/**
 * CellActions — star (save), copy-link, download CSV, embed.
 * Lives on every cell page above the breadcrumb-style nav.
 *
 * Saved cells are kept in localStorage under "atlas.saved". Free tier
 * is capped client-side at 5 to nudge upgrade; the cap is also enforced
 * server-side when the saved-cells API is wired.
 */

import { useEffect, useState } from "react";

const SAVED_KEY = "atlas.saved";
const SAVE_CAP_FREE = 5;

type CellRef = { country: string; geo: string; industry: string; label: string };

export function CellActions({
  country,
  geo,
  industry,
  industryName,
  geoName,
}: {
  country: string;
  geo: string;
  industry: string;
  industryName: string;
  geoName: string;
}) {
  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [overCap, setOverCap] = useState(false);

  const cellKey = `${country}/${geo}/${industry}`;

  // Read on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      const list: CellRef[] = raw ? JSON.parse(raw) : [];
      setSavedCount(list.length);
      setSaved(list.some((c) => `${c.country}/${c.geo}/${c.industry}` === cellKey));
    } catch {}
  }, [cellKey]);

  function toggleSave() {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      let list: CellRef[] = raw ? JSON.parse(raw) : [];
      const exists = list.some((c) => `${c.country}/${c.geo}/${c.industry}` === cellKey);
      if (exists) {
        list = list.filter((c) => `${c.country}/${c.geo}/${c.industry}` !== cellKey);
        setSaved(false);
      } else {
        if (list.length >= SAVE_CAP_FREE) {
          setOverCap(true);
          setTimeout(() => setOverCap(false), 3500);
          return;
        }
        list.push({ country, geo, industry, label: `${industryName}: ${geoName}` });
        setSaved(true);
      }
      localStorage.setItem(SAVED_KEY, JSON.stringify(list));
      setSavedCount(list.length);
    } catch {}
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const csvUrl = `/api/export-csv?country=${country}&region=${geo}&industry=${industry}&history=1`;
  const embedUrl = `/embed/${country}/${geo}/${industry}`;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
      <button
        type="button"
        onClick={toggleSave}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
          saved
            ? "bg-atlas-50 border-atlas-300 text-atlas-700"
            : "bg-white border-ink-200 text-ink-800 hover:border-atlas-500"
        }`}
        aria-pressed={saved}
        aria-label={saved ? "Unsave this cell" : "Save this cell"}
        title={saved ? "Saved: click to unsave" : `Save this cell (${savedCount}/${SAVE_CAP_FREE})`}
      >
        <span aria-hidden>{saved ? "★" : "☆"}</span>
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-200 text-ink-800 hover:border-atlas-500 transition"
      >
        <span aria-hidden>🔗</span>
        <span>{copied ? "Copied" : "Copy link"}</span>
      </button>
      <a
        href={csvUrl}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-200 text-ink-800 hover:border-atlas-500 transition"
        download
      >
        <span aria-hidden>↓</span>
        <span>CSV</span>
      </a>
      <a
        href={embedUrl}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-ink-200 text-ink-800 hover:border-atlas-500 transition"
      >
        <span aria-hidden>⎘</span>
        <span>Embed</span>
      </a>
      <a
        href="/saved"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-ink-700/70 hover:text-atlas-600 transition"
      >
        {savedCount > 0 ? `${savedCount} saved` : ""}
      </a>
      {overCap && (
        <span className="text-xs text-rose-700">
          Free tier saves 5. <a className="underline" href="/pricing">Upgrade</a> for unlimited.
        </span>
      )}
    </div>
  );
}
