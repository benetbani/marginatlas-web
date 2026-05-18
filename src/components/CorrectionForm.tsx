"use client";

/**
 * CorrectionForm — small inline form on cell pages: "this looks off?".
 *
 * Posts to /api/correction. Optimistic — shows a thank-you state on 200.
 */
import { useState } from "react";

type Props = {
  cellUrl: string;
};

type State = "idle" | "open" | "sending" | "done" | "error";

export function CorrectionForm({ cellUrl }: Props) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message || message.length < 10) {
      setErr("Tell us a bit more — what looks off?");
      return;
    }
    setState("sending");
    setErr("");
    try {
      const r = await fetch("/api/correction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cellUrl, message, email }),
      });
      const j = await r.json();
      if (j.ok) {
        setState("done");
        setMessage("");
        setEmail("");
      } else {
        setErr(j.error || "Couldn't submit. Try again later.");
        setState("error");
      }
    } catch {
      setErr("Network error.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="my-6 rounded-xl border border-moss-300 bg-moss-50 px-4 py-3 text-sm text-moss-900">
        ✓ Thank you — your note is in the queue. We review every correction.
      </div>
    );
  }

  if (state === "idle") {
    return (
      <button
        type="button"
        onClick={() => setState("open")}
        className="my-6 text-sm text-atlas-700 hover:text-atlas-900 font-medium"
      >
        See something off? Send a correction →
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="my-6 rounded-2xl border border-parchment bg-cream-50 p-5 space-y-3"
    >
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
        Send a correction
      </div>
      <label className="block">
        <span className="text-xs text-ink-700/70">What looks wrong?</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. 'The typical revenue for restaurants in Tirana is way too high — my own café does ~€60K, not the $1.2M shown.'"
          rows={3}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs text-ink-700/70">
          Email (optional — only if you want a reply)
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full px-3 py-2 rounded-lg border border-ink-200 bg-white text-sm"
        />
      </label>
      {err ? <div className="text-xs text-clay-700">{err}</div> : null}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="px-4 py-2 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-ink-800 transition disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send correction"}
        </button>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="px-3 py-2 text-sm text-ink-700 hover:text-ink-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
