"use client";

/**
 * CellActions — star (save), copy-link, download CSV, embed.
 * Lives on every cell page above the breadcrumb-style nav.
 *
 * Saved cells: when auth is OFF (default) they live in localStorage under
 * "atlas.saved", capped at 5 (the historical free-tier nudge) — this path is
 * unchanged. When auth is ON and the visitor is signed in, saves persist to
 * their account via /api/saved-cells; an anonymous save prompts sign-in and
 * returns to this page (intent preserved).
 */

import { useEffect, useState } from "react";
import { isAuthEnabled } from "@/lib/feature_flags";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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
  const authEnabled = isAuthEnabled();
  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [overCap, setOverCap] = useState(false);
  // null = unknown (auth on, session not yet resolved); false when auth is off.
  const [signedIn, setSignedIn] = useState<boolean | null>(authEnabled ? null : false);

  const cellKey = `${country}/${geo}/${industry}`;

  // Resolve the session once (auth on only).
  useEffect(() => {
    if (!authEnabled) return;
    let active = true;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        if (active) setSignedIn(!!data?.user);
      } catch {
        if (active) setSignedIn(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [authEnabled]);

  // Resolve the saved state: localStorage when auth is off (unchanged), the
  // server when signed in, empty when auth is on but signed out.
  useEffect(() => {
    if (!authEnabled) {
      try {
        const raw = localStorage.getItem(SAVED_KEY);
        const list: CellRef[] = raw ? JSON.parse(raw) : [];
        setSavedCount(list.length);
        setSaved(list.some((c) => `${c.country}/${c.geo}/${c.industry}` === cellKey));
      } catch {}
      return;
    }
    if (signedIn === true) {
      let active = true;
      (async () => {
        try {
          const res = await fetch("/api/saved-cells");
          const json = await res.json();
          const list: Array<{ country: string; geo: string; industry: string }> =
            json?.saved ?? [];
          if (!active) return;
          setSavedCount(list.length);
          setSaved(list.some((c) => `${c.country}/${c.geo}/${c.industry}` === cellKey));
        } catch {}
      })();
      return () => {
        active = false;
      };
    }
    // auth on, signed out / still resolving: nothing saved to show.
    setSaved(false);
    setSavedCount(0);
  }, [authEnabled, signedIn, cellKey]);

  // The original localStorage save toggle (the auth-off path), unchanged.
  function toggleSaveLocal() {
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

  function toggleSave() {
    if (!authEnabled) return toggleSaveLocal();
    if (signedIn !== true) {
      // Capture intent: sign in, then come back here to finish the save.
      const next = encodeURIComponent(window.location.pathname);
      window.location.href = `/signin?next=${next}`;
      return;
    }
    // Signed in: persist to the account, optimistic with rollback on failure.
    const wasSaved = saved;
    setSaved(!wasSaved);
    setSavedCount((c) => Math.max(0, c + (wasSaved ? -1 : 1)));
    (async () => {
      try {
        if (wasSaved) {
          await fetch(
            `/api/saved-cells?country=${encodeURIComponent(country)}&geo=${encodeURIComponent(
              geo,
            )}&industry=${encodeURIComponent(industry)}`,
            { method: "DELETE" },
          );
        } else {
          await fetch("/api/saved-cells", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              country,
              geo,
              industry,
              label: `${industryName}: ${geoName}`,
            }),
          });
        }
      } catch {
        setSaved(wasSaved);
        setSavedCount((c) => Math.max(0, c + (wasSaved ? 1 : -1)));
      }
    })();
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
  const savedHref = authEnabled ? "/account" : "/saved";

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
        title={saved ? "Saved: click to unsave" : "Save this cell"}
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
        href={savedHref}
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
