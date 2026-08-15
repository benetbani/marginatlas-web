/**
 * LeadMagnetForm — client island used by the home page and /download/2026-benchmarks.
 * Same form treatment and privacy line as NewsletterSignupVariants.
 */

"use client";

import { useState } from "react";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react/dist/ssr";

/* "Unsubscribe with one click" was not true and could not be. One-click
   unsubscribe means a link in an email, and this project has no email provider
   at all, so no message is ever sent and there is no link to click. There is
   also no unsubscribe route, handler or token anywhere in the app.

   It matters more than the other unbacked promises on this site because it is
   the assurance directly under the input, offered in exchange for the address,
   and addresses really are stored now. /contact is a working route that lands
   in Supabase for review, so asking is a real path. */
const PRIVACY_LINE = "No spam, no shilling. Ask and you are off the list.";

/* THE DEFAULT ENDPOINT DID NOT EXIST. It was
   /api/lead-magnet/2026-benchmarks, and there is no lead-magnet route in this
   app: the only signup endpoint is /api/newsletter, which the three
   NewsletterSignupVariants forms have been using all along.

   So every submission from the home page and from /download/2026-benchmarks
   threw on `!res.ok` and showed the error state. The one mercy is that check:
   without it a 404 would have set success and told the reader their PDF was on
   its way. Nothing was captured either, so the emails are gone.

   Points at the real route now, which writes to Supabase newsletter_signups,
   is rate limited, and reads only `email` from the body, so the `source` field
   below is carried harmlessly. */
export default function LeadMagnetForm({
  endpoint = "/api/newsletter",
}: { endpoint?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^.+@.+\..+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "lead_magnet_2026" }),
      });
      if (!res.ok) throw new Error("network");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-7 rounded-lg p-5 bg-cream-100 border border-parchment">
        {/* "We just sent the PDF to {email}. Check your inbox. If it's not
            there in two minutes, the spam folder usually solves it." stood
            here, and all three sentences were false. Nothing was sent, because
            this site has no email provider at all: no resend, nodemailer,
            sendgrid, postmark or SES anywhere in package.json. There is also no
            PDF to send, and no PDF library to build one with.

            Telling a reader to go hunting in their spam folder for a message
            that was never sent is the part that decided this rewrite. */}
        <p className="font-display text-xl font-semibold text-ink-900">
          {email} is on the list.
        </p>
        <p className="font-display italic mt-2 text-[15px] text-cocoa-700">
          The benchmarks PDF is still being put together. You will get it when
          it is done, and nothing else.
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submit} className="mt-7 flex flex-col sm:flex-row gap-2 max-w-md">
        <label className="sr-only" htmlFor="atlas-lead-magnet-email">Email address</label>
        <input
          id="atlas-lead-magnet-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@work.com"
          aria-invalid={status === "error"}
          className={`flex-1 h-11 px-3 rounded-md text-base bg-white text-ink-900 border ${
            status === "error" ? "border-atlas-700" : "border-cocoa-700/25"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 px-5 rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 bg-atlas-700 hover:bg-atlas-800 text-white disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              <CircleNotch size={12} aria-hidden="true" style={{ animation: "spin 900ms linear infinite" }} />
              Sending
            </>
          ) : (
            <>
              Send it to me
              <ArrowRight size={12} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
      <p className="mt-2 text-xs text-cocoa-700/70">{PRIVACY_LINE}</p>
    </>
  );
}
