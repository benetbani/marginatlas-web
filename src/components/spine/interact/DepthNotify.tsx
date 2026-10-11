"use client";
/**
 * DepthNotify, THE THIN PAGE'S ONE ASK (milestone 1, M9; his interview of 2026-09-26: "the 'notify me when my place reaches this
 * depth' capture on thinner pages"). An address field and one button under the last band of a page the floor census counted under
 * its floor; the address goes to the site's newsletter list with the page's depth tag (src/lib/seo/depth_source.ts), so the reader
 * is written to when that place gains the depth the UK pages have. Drawn by DepthNotifyFoot only on such a page.
 *
 * WITH `choices` (the home page's ask, the checkup of 2026-10-06): a place to choose first, each choice carrying its own tag from
 * the same bounded set (src/lib/home/depth_places.ts); the address is sent only with a place chosen. Without `choices`, the form
 * is the thin page's, unchanged except that, since fix round F1 (group G9), it stands in the page's foot band (the hook `data-page-foot` and padding, not a margin)
 * so the band that paints the licence and Report lines runs on under it.
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
  /* THE THIN PAGE'S FORM AND ITS SENT LINE ARE IN THE FOOT BAND (fix round F1, group G9; the D2 review's Minor 2): they carry the hook that paints the licence and Report
     lines (`data-page-foot`, globals.css THE ZONES) and pad themselves, the 24px that was a margin now padding and 24px under them, so the band runs on from the Report line to
     the newsletter bar and the grey no longer narrows back to the column for the form. The form with a place to choose (the home's ask) is a card's content and takes none. */
  if (state === "sent") return <p data-depth-notify="sent" data-page-foot className="pt-6 pb-6 text-[length:var(--t-body)] text-[var(--c-ink2)]">{words.sent}</p>;
  /* THE PICKER'S FIELD AND ITS BUTTON, ONE DEFINITION FOR BOTH FORMS (fix round F3, item M13, and its second commit): the thin page's address and the home's ask's place list and address stood on the faint
     field (the --c-border edge, 1.29:1 on white; 14px type, which iOS Safari zooms the page into under 16px; the browser's grey placeholder, 2.54:1) until round F3 gave them the field round F2 gave /compare and /you
     (commit 1d83a776): 48px, the 12px corner, the control token's 3:1 edge, 16px under 768 and 14 from it, an ink hover, and NO focus style of its own, so the floor in globals.css draws the 2px ink ring. An input
     (a select has none) also takes the picker's placeholder, muted in normal weight, written in its own className and not in a constant: the legacy-method-words gate reads a string outside a JSX attribute as
     copy, and that variant's name is a struck word. The button is the field's own height, min-h-12: at min-h-11 it stood 2px inside the field's edges in the thin page's row and 4px short of it stacked. */
  const field = "h-12 w-full min-w-0 rounded-xl border border-[var(--control-line)] bg-white px-4 text-base font-medium text-[var(--c-ink)] transition-colors hover:border-[var(--c-ink2)] md:text-sm";
  const button = "tap-y min-h-12 rounded-md bg-[var(--c-ink)] px-4 text-[length:var(--t-body)] font-semibold text-[var(--c-surface)] disabled:opacity-60";
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
        <input id="depth-notify-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={words.placeholder} className={`${field} placeholder:font-normal placeholder:text-[var(--c-muted)]`} />
        <button type="submit" disabled={state === "sending"} className={`mt-1 ${button}`}>
          {words.button}
        </button>
        {failed}
      </form>
    );
  }
  /* THE THIN PAGE'S FORM STACKS UNDER 640 (fix round F2, item F1-notify; the F1 report's concern 1 and the final review's M11): the label, then the address field on a row of its
     own, then the button under it, each as wide as the column. The field was `flex-1`, a flex item with a basis of 0, so at 375 it never forced a wrap and shared the label's row at about
     56px (about "Your"), the button wrapping under it. `w-full flex-none` makes its basis the whole row, and `min-w-0` (as the footer's newsletter bar keeps its field inside the screen at
     320) lets it shrink with the column and never push past it. From 640 it is the row it was: the field takes the leftover up to `max-w-xs`, the button its own width. */
  /* THE THIN PAGE'S LABEL AND FIELD ARE THE PICKER'S (fix round F3, item M13; the final review, part 3): round F2 (P2.5) took /compare's and /you's forms to the picker's label and field, and this
     form stayed on the old system on every thin city and trade page: the field's edge was --c-border (1.29:1 on white, 1.19:1 on the foot band), its type 14px (iOS Safari zooms the page into a field under 16px),
     its placeholder 2.54:1 and its label the body ink at weight 400. The field is `field` above with the placeholder round F2 gave /you's revenue input, and the layout classes round F2 gave it
     follow, unchanged. The label takes the picker's own type (text-sm font-medium text-[var(--c-ink2)]) WITHOUT its `mb-2 block`: that pair stacks a label over a field, and this form's own
     gap-3 and items-center place the label (the margin lifted its middle 4px above the field's from 640 and opened the gap to 20px from 12 under 640). */
  return (
    <form data-depth-notify="" data-page-foot onSubmit={submit} className="flex flex-wrap items-center gap-3 pt-6 pb-6">
      <label htmlFor="depth-notify-email" className="text-sm font-medium text-[var(--c-ink2)]">{words.label}</label>
      <input
        id="depth-notify-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={words.placeholder}
        className={`${field} placeholder:font-normal placeholder:text-[var(--c-muted)] flex-none sm:w-auto sm:max-w-xs sm:flex-1`}
      />
      <button type="submit" disabled={state === "sending"} className={`${button} w-full sm:w-auto`}>
        {words.button}
      </button>
      {failed}
    </form>
  );
}
