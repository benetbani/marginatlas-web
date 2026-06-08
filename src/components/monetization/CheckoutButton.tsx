"use client";
/**
 * CheckoutButton — the pricing-page CTA that starts a Stripe Checkout (M2).
 *
 * Posts { tier, interval } to /api/stripe/checkout and redirects to the returned
 * Checkout URL. The route is dormant until the founder sets STRIPE_SECRET_KEY +
 * the price IDs, so this button is only RENDERED (by PaidCard) once billing is
 * live; until then the pricing page keeps its newsletter CTA. Defensive fallbacks
 * keep it from ever dead-ending: a 401 sends the visitor to sign in, anything
 * else falls back to the newsletter anchor.
 */
import * as React from "react";

export function CheckoutButton({
  tier,
  interval = "month",
  className,
  children,
}: {
  tier: "basic" | "premium";
  interval?: "month" | "year";
  className?: string;
  children: React.ReactNode;
}) {
  const [busy, setBusy] = React.useState(false);

  async function go() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier, interval }),
      });
      if (res.ok) {
        const json = (await res.json()) as { url?: string };
        if (json?.url) {
          window.location.assign(json.url);
          return;
        }
      } else if (res.status === 401) {
        // Not signed in: send them to sign in, then back to pricing.
        window.location.assign("/signin?next=/pricing");
        return;
      }
      // 503 (billing not configured) / 500 / anything else: fall back to the
      // newsletter signup so the CTA never dead-ends.
      window.location.hash = "newsletter";
    } catch {
      window.location.hash = "newsletter";
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={go} disabled={busy} className={className}>
      {children}
    </button>
  );
}
