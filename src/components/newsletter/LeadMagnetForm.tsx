/**
 * LeadMagnetForm — client island used by /download/2026-benchmarks.
 * Same form treatment and privacy line as NewsletterSignupVariants.
 */

"use client";

import { useState } from "react";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react/dist/ssr";

const PRIVACY_LINE = "No spam, no shilling. Unsubscribe with one click.";

export default function LeadMagnetForm({
  endpoint = "/api/lead-magnet/2026-benchmarks",
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
        <p className="font-display text-xl font-semibold text-ink-900">
          We just sent the PDF to {email}.
        </p>
        <p className="font-display italic mt-2 text-[15px] text-cocoa-700">
          Check your inbox. If it's not there in two minutes, the spam folder usually solves it.
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
              Send me the PDF
              <ArrowRight size={12} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
      <p className="mt-2 text-xs text-cocoa-700/70">{PRIVACY_LINE}</p>
    </>
  );
}
