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
      setErr("Tell us a bit more: what looks off?");
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

  /* THE SUCCESS PANEL, terracotta since 2026-08-17, green before it.
     A red/green pair is the one convention on this site that genuinely carries
     meaning to a reader, so it was weighed rather than swept, and the thing
     that decided it is that THE PAIR NO LONGER EXISTED. The error half of this
     very component, eight lines down, is already `text-clay-700`: a deep
     oxblood that design-tokens reserves as the destructive colour precisely
     BECAUSE it is not the stock error red. So what was left was a green beside
     a maroon, which is not the convention, it is half of one, and half a
     convention buys none of the recognition that justified keeping it.

     Nothing rides on the colour in any case. Every one of these panels prints
     an unambiguous sentence, and the message is what a reader acts on. The
     replacement is the bordered favourable step the AuPrimaryDataBadge and
     CityDistrictPicker already use, so success stops being a private colour.

     Contrast was computed, not assumed: atlas-700 on atlas-50 is 7.78:1, past
     AA and past AAA for body text. It is lower than the moss-900-on-moss-50 it
     replaces, which was near-maximal, and the floor is what matters. And for
     the roughly one man in twelve with a red-green deficiency, green-beside-
     maroon was the worst available pairing; terracotta and clay separate by
     lightness as well as hue. */
  if (state === "done") {
    return (
      <div className="my-6 rounded-xl border border-atlas-200 bg-atlas-50 px-4 py-3 text-sm text-atlas-700">
        ✓ Thank you: your note is in the queue. We review every correction.
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
      className="atlas-card my-6 p-5 space-y-3"
    >
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
        Send a correction
      </div>
      <label className="block">
        <span className="text-xs text-ink-700/70">What looks wrong?</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. 'The typical revenue for restaurants in Tirana is way too high: my own café does ~€60K, not the $1.2M shown.'"
          rows={3}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-paper-350 bg-white text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs text-ink-700/70">
          Email (optional: only if you want a reply)
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full px-3 py-2 rounded-lg border border-paper-350 bg-white text-sm"
        />
      </label>
      {err ? <div className="text-xs text-clay-700">{err}</div> : null}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="px-4 py-2 rounded-full bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 transition disabled:opacity-50"
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
