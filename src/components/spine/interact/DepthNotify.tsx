"use client";
/**
 * DepthNotify, THE THIN PAGE'S ONE ASK (milestone 1, M9; his interview of 2026-09-26: "the 'notify me when my place reaches this
 * depth' capture on thinner pages"). An address field and one button under the last band of a page the floor census counted under
 * its floor; the address goes to the site's newsletter list with the page's depth tag (src/lib/seo/depth_source.ts), so the reader
 * is written to when that place gains the depth the UK pages have. Drawn by DepthNotifyFoot only on such a page.
 *
 * WITH `choices` (the home page's ask, the checkup of 2026-10-06): a place to choose first, each choice carrying its own tag from
 * the same bounded set (src/lib/home/depth_places.ts); the address is sent only with a place chosen. Without `choices`, the form
 * is the thin page's, unchanged.
 */
import * as React from "react";

type Words = { label: string; placeholder: string; button: string; sent: string; failed: string; choose?: string; pick?: string };
type Choice = { label: string; source: string };

export function DepthNotify({ source = "", words, choices }: { source?: string; words: Words; choices?: Choice[] }) {
  const [email, setEmail] = React.useState("");
  const [picked, setPicked] = React.useState("");
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "failed">("idle");
  const tag = choices ? picked : source;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!tag || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setState("failed"); return; }
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email.trim(), source: tag }) });
      setState(res.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  }
  if (state === "sent") return <p data-depth-notify="sent" className="mt-6 text-[length:var(--t-body)] text-[var(--c-ink2)]">{words.sent}</p>;
  const field = "min-h-11 w-full min-w-0 rounded-md border border-[var(--c-border)] bg-[var(--c-card)] px-3 text-[length:var(--t-body)] text-[var(--c-ink)]";
  const button = "tap-y min-h-11 rounded-md bg-[var(--c-ink)] px-4 text-[length:var(--t-body)] font-semibold text-[var(--c-surface)] disabled:opacity-60";
  const failed = state === "failed" ? <p role="alert" className="w-full text-[length:var(--t-micro)] text-[var(--c-muted)]">{words.failed}</p> : null;
  /* WITH A PLACE TO CHOOSE, STACKED (photographed 2026-10-06): a label over each field and each field the column's width; in
     one wrapping row beside its label the city's list shrank to its arrow and the address to "you", at 1280 and at 375 alike. */
  if (choices) {
    const label = "text-[length:var(--t-micro)] font-semibold text-[var(--c-muted)]";
    return (
      <form data-depth-notify="" onSubmit={submit} className="grid gap-2">
        <label htmlFor="depth-notify-place" className={label}>{words.choose ?? "Place"}</label>
        <select id="depth-notify-place" value={picked} onChange={(e) => setPicked(e.target.value)} className={field}>
          <option value="">{words.pick ?? "Choose"}</option>
          {choices.map((c) => (
            <option key={c.source} value={c.source}>{c.label}</option>
          ))}
        </select>
        <label htmlFor="depth-notify-email" className={`mt-1 ${label}`}>{words.label}</label>
        <input id="depth-notify-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={words.placeholder} className={field} />
        <button type="submit" disabled={state === "sending"} className={`mt-1 ${button}`}>
          {words.button}
        </button>
        {failed}
      </form>
    );
  }
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
      <button type="submit" disabled={state === "sending"} className={button}>
        {words.button}
      </button>
      {failed}
    </form>
  );
}
