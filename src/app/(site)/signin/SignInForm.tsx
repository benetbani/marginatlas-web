"use client";
/**
 * The /signin form, split out of page.tsx.
 *
 * The split exists for one reason: a module marked "use client" may not export
 * `metadata`, and /signin needed to declare its own so it would stop inheriting
 * the root layout's canonical URL. The interactive half moved here, page.tsx
 * became a server component holding the metadata, and the rendered result is
 * byte-for-byte what it was. Same pattern as AccountPreview.tsx next door.
 *
 * Enter an email, we send a sign-in link (Supabase signInWithOtp). No password.
 * Honors a same-origin ?next= so a contextual sign-in returns the reader to where
 * they were. When auth is disabled (the M1 flag, default off in production), this
 * renders a quiet "coming soon" instead, so the route is inert until activation.
 */
import * as React from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isAuthEnabled } from "@/lib/feature_flags";

export function SignInForm() {
  const [next, setNext] = React.useState("/account");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  React.useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n && n.startsWith("/")) setNext(n);
  }, []);

  if (!isAuthEnabled()) {
    return (
      <article className="mx-auto max-w-md px-4 py-16 text-center md:py-24">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700">
          Sign in
        </div>
        <h1 className="mb-4 font-display text-3xl tracking-tight text-ink-900 md:text-4xl">
          Coming soon
        </h1>
        <p className="text-base leading-relaxed text-cocoa-700">
          Accounts are in build. Margin Atlas is fully usable without one today.
        </p>
      </article>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const supabase = createSupabaseBrowserClient();
      const safeNext = next.startsWith("/") ? next : "/account";
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            safeNext,
          )}`,
        },
      });
      setStatus(error ? "error" : "sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <article className="mx-auto max-w-md px-4 py-16 md:py-24">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700">
        Sign in
      </div>
      <h1 className="mb-3 font-display text-3xl tracking-tight text-ink-900 md:text-4xl">
        Sign in to Margin Atlas
      </h1>
      <p className="mb-6 text-base leading-relaxed text-cocoa-700">
        Enter your email and we will send you a sign-in link. No password.
      </p>
      {status === "sent" ? (
        /* Terracotta since 2026-08-17, matching CorrectionForm and /contact.
           This one only ever carried the hue on its border and fill, its type
           was already ink-900, so the reading was never green to begin with.
           The error line below is clay, so the red/green pair this would have
           belonged to did not exist here either. */
        <div className="rounded-xl border border-atlas-200 bg-atlas-50 p-4 text-sm text-ink-900">
          Check your email. We sent a sign-in link to {email}.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="rounded-full border border-paper-350 px-4 py-2.5 text-sm focus:border-atlas-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-atlas-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-atlas-700 disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Email me a sign-in link"}
          </button>
          {status === "error" ? (
            <p className="text-[13px] text-clay-700">
              We could not send the link. Please try again.
            </p>
          ) : null}
        </form>
      )}
    </article>
  );
}
