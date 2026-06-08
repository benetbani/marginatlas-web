"use client";
/**
 * HeaderAuth — the header's sign-in / account entry (Milestone 1).
 *
 * A client island so the server root layout stays statically prerendered (a
 * server-side session read in the layout would de-static the whole site). When
 * auth is OFF (default) it renders nothing, so the header is unchanged. When ON,
 * it checks the session client-side and shows "Sign in" or "Account".
 */
import * as React from "react";
import { isAuthEnabled } from "@/lib/feature_flags";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function HeaderAuth() {
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

  if (!authEnabled) return null;

  return signedIn ? (
    <a href="/account" className="hover:text-atlas-600 transition-colors">
      Account
    </a>
  ) : (
    <a href="/signin" className="hover:text-atlas-600 transition-colors">
      Sign in
    </a>
  );
}
