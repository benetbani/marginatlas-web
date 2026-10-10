"use client";
/**
 * HeaderAuth , the masthead's sign-in / account entry (Milestone 1), in the bar from 1280 and in the sheet under it (plan
 * 2026-10-10, the home reformed to ship, Task 1; the ship audit's 1.2 and 1.3).
 *
 * A client island so the server root layout stays statically prerendered (a server-side session read in the layout would
 * de-static the whole site). When auth is OFF (default) it renders nothing, so neither the bar nor the sheet draws a trace of
 * sign-in. When ON, it reads the session client-side, once, through one hook the bar and the sheet share (under 1280 nobody could
 * reach Sign in: the entry lived only inside the bar's names, which show from 1280), and shows "Sign in" or "Account".
 *
 * WHILE THE SESSION IS BEING READ the entry holds the width of its words, unseen and out of reach: it used to print "Sign in"
 * first, so a signed-in reader watched it turn into "Account".
 */
import * as React from "react";
import { isAuthEnabled } from "@/lib/feature_flags";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { NAV_IDLE } from "@/components/NavLinks";

/** Where a reader stands: accounts off; on, the session not read yet; signed in; signed out. */
export type AuthState = "off" | "checking" | "in" | "out";

/** The one session read the bar and the sheet share. */
export function useAuthState(): AuthState {
  const authEnabled = isAuthEnabled();
  const [signedIn, setSignedIn] = React.useState<boolean | null>(null);

  React.useEffect(() => {
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

  if (!authEnabled) return "off";
  return signedIn === null ? "checking" : signedIn ? "in" : "out";
}

/** The entry, styled by its caller: nothing while accounts are off; the words' width, unseen, while the session is read; then a link. */
export function AuthLink({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  const state = useAuthState();
  if (state === "off") return null;
  if (state === "checking") {
    return (
      <span aria-hidden="true" className={`invisible ${className}`}>
        Sign in
      </span>
    );
  }
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

/** The bar's entry from 1280, after Search, in the names' own style (NavLinks.tsx). SiteChrome draws it only while accounts are on. */
export function HeaderAuth() {
  return <AuthLink className={`hidden xl:inline-flex ${NAV_IDLE}`} />;
}
