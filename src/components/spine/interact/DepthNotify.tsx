"use client";
/**
 * DepthNotify, THE THIN PAGE'S ONE ASK (milestone 1, M9; his interview of 2026-09-26: "the 'notify me when my place reaches this
 * depth' capture on thinner pages"). An address field and one button under the last band of a page the floor census counted under
 * its floor; the address goes to the site's newsletter list with the page's depth tag (src/lib/seo/depth_source.ts), so the reader
 * is written to when that place gains the depth the UK pages have. Drawn by DepthNotifyFoot only on such a page.
 */
import * as React from "react";

type Words = { label: string; placeholder: string; button: string; sent: string; failed: string };

export function DepthNotify({ source, words }: { source: string; words: Words }) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "failed">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setState("failed"); return; }
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email.trim(), source }) });
      setState(res.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  }
  if (state === "sent") return <p data-depth-notify="sent" className="mt-6 text-[length:var(--t-body)] text-[var(--c-ink2)]">{words.sent}</p>;
  return (
    <form data-depth-notify="" onSubmit={submit} className="mt-6 flex flex-wrap items-center gap-3">
      <label htmlFor="depth-notify-email" className="text-[length:var(--t-body)] text-[var(--c-ink)]">{words.label}</label>
      <input
        id="depth-notify-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={words.placeholder}
        className="min-h-11 min-w-0 flex-1 rounded-md border border-[var(--c-border)] bg-[var(--c-card)] px-3 text-[length:var(--t-body)] text-[var(--c-ink)] sm:max-w-xs"
      />
      <button type="submit" disabled={state === "sending"} className="tap-y min-h-11 rounded-md bg-[var(--c-ink)] px-4 text-[length:var(--t-body)] font-semibold text-[var(--c-surface)] disabled:opacity-60">
        {words.button}
      </button>
      {state === "failed" ? <p role="alert" className="w-full text-[length:var(--t-micro)] text-[var(--c-muted)]">{words.failed}</p> : null}
    </form>
  );
}
