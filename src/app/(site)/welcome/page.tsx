/**
 * /welcome: where a checkout returns (milestone 2; masterplan step 11; his interview of 2026-09-26, ruling 20: checkout first,
 * the account made from the checkout email).
 *
 * Reads `session_id` from the address, asks Stripe for that checkout and, when it is complete, says Pro is the buyer's and offers
 * the sign-in link to the email Stripe holds for it. The email is never taken from the address and the session id is never
 * printed. Anything else (no Stripe key, an unknown or unfinished session) says the checkout could not be found and points back
 * to pricing. A private page: never listed, never followed, no canonical.
 */
import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { SignInForm } from "../signin/SignInForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Welcome to Pro | Margin Atlas",
  description: "Where a Margin Atlas checkout returns: the plan is yours, and the sign-in link opens it.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

/** The checkout's email when Stripe says the checkout is complete, else null. Any failure is null. */
async function completedCheckoutEmail(sessionId: string | undefined): Promise<string | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  try {
    const session = await new Stripe(secret).checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete") return null;
    const email = session.customer_details?.email ?? session.customer_email ?? null;
    return email ? email.trim() : null;
  } catch {
    return null;
  }
}

export default async function WelcomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = (await searchParams).session_id;
  const email = await completedCheckoutEmail(typeof raw === "string" ? raw : undefined);
  return (
    <article className="mx-auto max-w-md px-4 py-16 md:py-24">
      {email ? (
        <>
          <h1 className="mb-3 font-display text-3xl tracking-tight text-ink-900">Pro is yours</h1>
          <p className="mb-6 text-base leading-relaxed text-cocoa-700">Sign in with {email} to open it.</p>
          <SignInForm initialEmail={email} embedded />
        </>
      ) : (
        <>
          <h1 className="mb-3 font-display text-3xl tracking-tight text-ink-900">We could not find that checkout.</h1>
          <p className="text-base leading-relaxed text-cocoa-700">
            <Link href="/pricing" className="font-medium text-atlas-700 underline underline-offset-2 hover:text-atlas-900">
              Back to pricing
            </Link>
          </p>
        </>
      )}
    </article>
  );
}
