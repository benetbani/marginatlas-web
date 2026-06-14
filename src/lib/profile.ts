"use client";

/**
 * profile - the light, durable "context that follows you" around the Atlas.
 *
 * WHAT THIS IS FOR. The reader sets a few assumptions once (where they are
 * based, roughly what they can put in, whether they own the place or rent, what
 * venue they have in mind, what currency to read in) and the site stops asking.
 * Those choices PERSIST into the make-it-yours calculator, the venue switcher,
 * and the figures shown across pages, so a person does not re-key their context
 * on every cell. The masthead chip surfaces it; this store holds it.
 *
 * It is deliberately light: no account, no server, no PII. Just a handful of
 * coarse, shareable preferences in localStorage. The URL still owns the exact
 * per-view state (a specific slider position); the profile owns the DEFAULTS the
 * reader brings with them.
 *
 * SSR-safe (window-guarded, hydrates after mount), broadcasts changes so the
 * chip + calculator + /you stay in sync. Tokens-free, UI-free. No em-dashes,
 * no source-agency names.
 */
import * as React from "react";

/** Own the premises vs rent it: the single biggest swing in owner take-home,
 *  so the calculator wants it as a standing assumption, not a per-visit toggle. */
export type DrawMode = "owner" | "rent";

/** The venue the reader has in mind. Kept as an open string (the venue switcher
 *  owns the canonical list per industry); the profile just remembers the last
 *  meaningful pick so the switcher can land on it. */
export type ProfileVenue = string;

/** Read figures in the reader's own currency, or as the page's local currency. */
export type Units = "local" | "home";

export type Profile = {
  /** Where the reader is based (a country code, e.g. "US", "GB"). Drives the
   *  home-currency conversion and the "near you" defaults. */
  homeCountry?: string;
  /** Roughly what they can put in (a coarse band, stored as a round number in
   *  home currency). Seeds the calculator's starting capital. */
  budget?: number;
  /** Own the premises or rent. Seeds the take-home calculation. */
  draw?: DrawMode;
  /** The venue they have in mind (e.g. "high-street", "mall"). */
  venue?: ProfileVenue;
  /** Read in local currency or convert to home. Default "local". */
  units?: Units;
};

/** Empty profile: nothing set yet. The chip reads this as "Set your context". */
export const EMPTY_PROFILE: Profile = {};

const STORAGE_KEY = "atlas:profile:v1";
const SYNC_EVENT = "atlas:profile:changed";

/* ------------------------------------------------------------------ */
/* Storage plumbing (SSR-guarded).                                     */
/* ------------------------------------------------------------------ */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStorage(): Profile {
  if (!isBrowser()) return EMPTY_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    return sanitize(parsed);
  } catch {
    return EMPTY_PROFILE;
  }
}

/** Keep only known, well-typed fields, so a stale/garbled blob never poisons
 *  the calculator. Unknown keys are dropped. */
function sanitize(v: unknown): Profile {
  if (!v || typeof v !== "object") return EMPTY_PROFILE;
  const o = v as Record<string, unknown>;
  const out: Profile = {};
  if (typeof o.homeCountry === "string" && o.homeCountry.trim()) {
    out.homeCountry = o.homeCountry;
  }
  if (typeof o.budget === "number" && Number.isFinite(o.budget) && o.budget >= 0) {
    out.budget = o.budget;
  }
  if (o.draw === "owner" || o.draw === "rent") out.draw = o.draw;
  if (typeof o.venue === "string" && o.venue.trim()) out.venue = o.venue;
  if (o.units === "local" || o.units === "home") out.units = o.units;
  return out;
}

function writeStorage(profile: Profile): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* storage disabled: session-only, fail soft */
  }
  try {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  } catch {
    /* no-op */
  }
}

/** Is anything set? Drives the chip's "set your context" empty state. */
export function isProfileSet(profile: Profile): boolean {
  return (
    profile.homeCountry != null ||
    profile.budget != null ||
    profile.draw != null ||
    profile.venue != null ||
    profile.units != null
  );
}

/* ------------------------------------------------------------------ */
/* Imperative API.                                                     */
/* ------------------------------------------------------------------ */

/** Read the current profile. SSR-safe (empty on the server). */
export function getProfile(): Profile {
  return readStorage();
}

/** Merge a patch over the current profile. Passing a field as `undefined`
 *  CLEARS it (back to "not set"); other fields are left untouched. Returns the
 *  merged profile. */
export function setProfile(patch: Partial<Profile>): Profile {
  const current = readStorage();
  // Spread the patch over the current profile. A field passed as `undefined`
  // lands as an explicit undefined key, which sanitize() then drops, so passing
  // `undefined` cleanly CLEARS that field while other fields stay untouched.
  const merged = { ...current, ...patch };
  const clean = sanitize(merged);
  writeStorage(clean);
  return clean;
}

/** Wipe the profile entirely. Returns the empty profile. */
export function clearProfile(): Profile {
  writeStorage(EMPTY_PROFILE);
  return EMPTY_PROFILE;
}

/* ------------------------------------------------------------------ */
/* React hook.                                                         */
/* ------------------------------------------------------------------ */

export type UseProfile = {
  profile: Profile;
  /** True once read from storage (hold the chip's label until then). */
  hydrated: boolean;
  /** True when the reader has set at least one field. */
  isSet: boolean;
  /** Merge a patch (undefined clears a field). */
  set: (patch: Partial<Profile>) => void;
  /** Clear everything. */
  clear: () => void;
};

/**
 * useProfile - subscribe to the reader's standing context.
 *
 * The calculator reads this for its starting assumptions; the venue switcher
 * reads `venue`; the masthead chip both reads and writes it. All instances stay
 * in sync through SYNC_EVENT (same tab) and the `storage` event (other tabs).
 */
export function useProfile(): UseProfile {
  const [profile, setLocal] = React.useState<Profile>(EMPTY_PROFILE);
  const [hydrated, setHydrated] = React.useState(false);

  const refresh = React.useCallback(() => {
    setLocal(getProfile());
  }, []);

  React.useEffect(() => {
    refresh();
    setHydrated(true);

    const onLocal = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) refresh();
    };
    window.addEventListener(SYNC_EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SYNC_EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const set = React.useCallback((patch: Partial<Profile>) => {
    setLocal(setProfile(patch));
  }, []);

  const clear = React.useCallback(() => {
    setLocal(clearProfile());
  }, []);

  return {
    profile,
    hydrated,
    isSet: isProfileSet(profile),
    set,
    clear,
  };
}
