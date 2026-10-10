"use client";
/**
 * HeaderAuth , the masthead's sign-in / account entry (Milestone 1), in the bar from 1280 and in the sheet under it (plan
 * 2026-10-10, the home reformed to ship, Task 1; the ship audit's 1.2 and 1.3).
 *
 * A client island so the server root layout stays statically prerendered (a server-side session read in the layout would
 * de-static the whole site). When auth is OFF (default) it renders nothing, so neither the bar nor the sheet draws a trace of
 * sign-in. When ON, it reads the session client-side, ONCE between the bar and the sheet (readSession below), through one hook they
 * share (under 1280 nobody could reach Sign in: the entry lived only inside the bar's names, which show from 1280), and shows
 * "Sign in" or "Account".
 *
 * WHILE THE SESSION IS BEING READ the entry is "Sign in", visible, a live link (critique pass 2, fix round C2, item P2.7). Plan 2026-10-10
 * Task 7 (amendment 8c; the Task 1 review's m2) had it hold the width of its longer word, "Account", unseen, so a signed-in reader's bar did
 * not grow when the read settled; on launch day's first paint that left about 110px blank between Search and Pricing, and "Sign in" is the
 * first state for nearly every visitor. A signed-in reader now sees the entry turn into "Account", and the bar grows a few pixels.
 *
 * ONE READ, AND ITS CLIENT LOADED ONLY THEN (plan 2026-10-10, Task 7; the ship audit's 3.1). The bar's entry and the sheet's each
 * asked Supabase on their own, so a page that drew both asked twice. readSession is one module-level promise: the first entry that
 * needs the answer starts it, every other takes the same one, and it holds until the page is left (a sign-in is a link in an email
 * and a sign-out a form post, so each loads a new page). The auth client is imported inside it, with import(), behind the accounts
 * switch: a static import shipped @supabase/ssr and supabase-js to every page while the switch was off, because a runtime test cannot
 * drop an import. With accounts off the effect returns before readSession is called, and the chunk is never requested
 * (NEXT_PUBLIC_AUTH_ENABLED is inlined at build). tests/app/head.test.ts holds the shape; tests/chrome/masthead.test.ts counts the
 * calls in a mounted tree.
 */
import * as React from "react";
import { isAuthEnabled } from "@/lib/feature_flags";
import { NAV_ENTRY } from "@/lib/nav";

/** Where a reader stands: accounts off; on, the session not read yet; signed in; signed out. */
export type AuthState = "off" | "checking" | "in" | "out";

/** The one session read every entry on the page shares: null until the first entry asks, then the promise of whether a user is signed in. */
let sessionRead: Promise<boolean> | null = null;

/** Starts the session read the first time it is called and hands every later caller the same promise. It never rejects: a read that
 *  fails (no network, no project address) is a signed-out reader. */
function readSession(): Promise<boolean> {
  if (!sessionRead) {
    sessionRead = (async () => {
      try {
        const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
        const { data } = await createSupabaseBrowserClient().auth.getUser();
        return !!data?.user;
      } catch {
        return false;
      }
    })();
  }
  return sessionRead;
}

/** The one session read the bar and the sheet share. */
export function useAuthState(): AuthState {
  const authEnabled = isAuthEnabled();
  const [signedIn, setSignedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (!authEnabled) return;
    let active = true;
    void readSession().then((signed) => {
      if (active) setSignedIn(signed);
    });
    return () => {
      active = false;
    };
  }, [authEnabled]);

  if (!authEnabled) return "off";
  return signedIn === null ? "checking" : signedIn ? "in" : "out";
}

/** The entry, styled by its caller: nothing while accounts are off; otherwise "Sign in", a live link to /signin, from the first paint and
 *  while the session is read, and "Account", a link to /account, once the read says the reader is signed in. */
export function AuthLink({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  const state = useAuthState();
  if (state === "off") return null;
  return state === "in" ? (
    <a href="/account" onClick={onClick} className={className}>
      Account
    </a>
  ) : (
    <a href="/signin" onClick={onClick} className={className}>
      Sign in
    </a>
  );
}

/** The bar's entry from 1280, after Search, in ink at weight 500 (NAV_ENTRY, src/lib/nav.ts), so it does not read as an eighth name.
 *  SiteChrome draws it only while accounts are on, and the names keep 1280 then (barFrom). */
export function HeaderAuth() {
  return <AuthLink className={`hidden xl:inline-flex ${NAV_ENTRY}`} />;
}
