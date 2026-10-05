"use client";
/**
 * src/components/monetization/ManagePlanButton.tsx
 *
 * One button to Stripe's billing portal (masterplan step 11; ruling 34, cancel any time): asks /api/stripe/portal for a session
 * and goes there. A failure says so in one line under the button. No modal, no toast (ruling 22).
 */
import * as React from "react";

export function ManagePlanButton() {
  const [state, setState] = React.useState<"idle" | "opening" | "failed">("idle");

  async function open() {
    setState("opening");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { url?: string };
      if (!res.ok || !body.url) throw new Error("no portal");
      window.location.assign(body.url);
    } catch {
      setState("failed");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={open}
        disabled={state === "opening"}
        className="rounded-full border border-paper-350 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:border-atlas-500 disabled:opacity-60"
      >
        Manage or cancel
      </button>
      {state === "failed" ? <p className="mt-2 text-xs text-clay-700">Could not open billing. Try again.</p> : null}
    </div>
  );
}
