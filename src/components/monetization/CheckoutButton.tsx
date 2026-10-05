"use client";
/**
 * CheckoutButton: the pricing page's button that starts a Pro checkout (milestone 2; masterplan step 12; ruling 20, checkout
 * first).
 *
 * Posts { interval } to /api/stripe/checkout and goes to the Checkout URL it returns. No account is needed, so no sign-in branch
 * exists; any failure says so in one line under the button (no modal, ruling 22). The pricing page renders this only once billing
 * is live; until then it shows its notify-me link.
 */
import * as React from "react";

export function CheckoutButton({
  interval,
  className,
  children,
}: {
  interval: "month" | "year";
  className?: string;
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<"idle" | "busy" | "failed">("idle");

  async function go() {
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string };
      if (res.ok && json.url) {
        window.location.assign(json.url);
        return;
      }
      setState("failed");
    } catch {
      setState("failed");
    }
  }

  return (
    <>
      <button type="button" onClick={go} disabled={state === "busy"} className={className}>
        {children}
      </button>
      {state === "failed" ? <p className="mt-2 text-center text-xs text-clay-700">Checkout did not open. Try again.</p> : null}
    </>
  );
}
