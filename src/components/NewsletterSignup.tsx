"use client";

import { useState } from "react";

/**
 * NewsletterSignup — captures email into local API endpoint (posts to /api/newsletter).
 * Stores in Supabase newsletter_signups table once that exists; for now logs to console.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email.");
      setState("error");
      return;
    }
    setState("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (r.ok) {
        setState("success");
        setEmail("");
      } else {
        setErrorMsg("Couldn't sign you up. Try again later.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error.");
      setState("error");
    }
  }

  return (
    <div className="card bg-ink-100/30 border-ink-200">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
        Stay updated
      </div>
      <h3 className="mt-2 text-lg font-semibold text-ink-900">
        Get new countries + data refreshes by email
      </h3>
      <p className="mt-1 text-sm text-ink-700">
        One email a month. No marketing. Unsubscribe anytime.
      </p>
      {state === "success" ? (
        <p className="mt-4 text-sm text-atlas-600">✓ Thank you — you'll hear from us when v1.18 ships.</p>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
            placeholder="you@example.com"
            className="flex-1 px-3 py-2 rounded-lg border border-ink-200 bg-white outline-none focus:border-atlas-500 text-sm"
            required
            disabled={state === "loading"}
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="px-4 py-2 rounded-lg bg-atlas-500 hover:bg-atlas-600 text-white font-medium text-sm disabled:opacity-50 transition"
          >
            {state === "loading" ? "Signing up…" : "Sign up"}
          </button>
        </form>
      )}
      {state === "error" && (
        <p className="mt-2 text-xs text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}
