/**
 * NewsletterSignupVariants
 * ========================
 *
 * FooterNewsletterBar: the slim signup bar at the foot of every page (SiteChrome.tsx draws it between <main> and the footer). The
 * file keeps its name; it holds one surface now.
 *
 * IT PROMISES WHAT HAPPENS, AND NOTHING ELSE (plan 2026-10-10, the home reformed to ship, Task 8; the spec's decision 10, the ship
 * audit's 5.3). It read "A calm monthly read for people who use Atlas." and nothing sends: this project has no email provider, no
 * sender and no unsubscribe route, and the route behind the form (src/app/api/newsletter/route.ts) stores the address and does
 * nothing more. So it asks for an address to write to when new figures land, which is what the stored list is for, and names no
 * rhythm. The day a sender exists, the privacy page names it and this line may promise what it sends.
 *
 * IT SAYS WHAT HAPPENED (the ship audit's 4.2, 4.5, 4.6 and 5.4). A bad address or a failed post only turned the border red; now a
 * line says so, in a `role="alert"` that a screen reader reads out, and the field points at it (`aria-describedby`). Success is
 * said in a `role="status"` region that is always in the document, so its words are announced when they arrive. The field has a
 * name and `autocomplete="email"`, 16px type on a phone (iOS zooms the page into a smaller field), and a 3:1 edge
 * (--control-line); the field and the button are 44px tall. The bar is a `<section>` named by its own line, a landmark, and the
 * form is named by the same line. The line is set upright in --c-ink2: Space Grotesk ships no italic, so the italic was a
 * synthetic slant, in a brown.
 *
 * FIX ROUND 8 (Task 8's review). The button is disabled until a first effect has run: the field's new `name` made a native submit
 * before hydration a GET with the address in the URL. And the route's 400 (an address its stricter check refuses) shows the
 * bad-address line, where any non-OK answer said "Try again in a minute", which is for a 429 or a server error. CLEANUP ROUND 2:
 * `aria-invalid` is set only when the address itself is invalid (status "invalid"). After a 429 or a server error the address is
 * fine and the post did not go through: the alert still describes it and the field still points at it (`aria-describedby`), but a
 * screen reader is not told the address is wrong.
 *
 * InlineMidArticle, the card for /learn posts, was deleted the same day: nothing mounted it (its import in
 * src/app/[country]/[geo]/[industry]/page.tsx is a comment), and it promised "Once a month we send one deep-dive" and "Check your
 * inbox for a hello", neither of which can happen. The exit-intent pop-up went on 2026-10-06 (QUEUE ui:exit-intent-dead).
 *
 *   POST /api/newsletter   { email: string, source: "footer" }
 *
 * Override `endpoint` at the call site if your route differs.
 */

"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr/CircleNotch";

/** The bar's words: its line, its button and its answers, each twelve words or fewer (the copy rules). */
export const NEWSLETTER_COPY = {
  line: "Leave your email to hear when new figures land.",
  button: "Join the list",
  joining: "Joining",
  done: "You’re on the list.",
  badAddress: "Enter an email address, like name@example.com.",
  failed: "That did not go through. Try again in a minute.",
} as const;

type Status = "idle" | "loading" | "success" | "invalid" | "failed";

type Props = { endpoint?: string };

const LINE_ID = "atlas-newsletter-line";
const FIELD_ID = "atlas-footer-email";
const ERROR_ID = "atlas-footer-email-error";

export function FooterNewsletterBar({ endpoint = "/api/newsletter" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  /* THE BUTTON WAITS FOR THE PAGE (fix round 8). The field has a name, so a native submit before the page has hydrated, by Enter
     in the field or a tap on the button, is a GET to the page's own address with the email in the query string: the browser's
     history, the host's logs, and the page address any error report carries. A form whose default button is disabled submits
     nothing on Enter either. The first effect runs once the page has hydrated this component, so its handler is attached, and
     enables the button. */
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^.+@.+\..+$/.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      /* The route answers 400 for an address its own check refuses, which is stricter than this bar's ("a@b.c" passes here and
         not there): that is a bad address, not a post that did not go through. 429 (five a minute) and a server error are. */
      if (res.status === 400) {
        setStatus("invalid");
        return;
      }
      if (!res.ok) throw new Error("network");
      setStatus("success");
    } catch {
      setStatus("failed");
    }
  }

  const error = status === "invalid" ? NEWSLETTER_COPY.badAddress : status === "failed" ? NEWSLETTER_COPY.failed : null;
  // White-reset 2026-06-06: the newsletter band was warm parchment; it is now
  // white, separated from the content above by a hairline and from the
  // true-black footer directly below by the colour break.
  return (
    /* `relative` added 2026-08-17. This bar sits between <main> and the
       footer, painted a solid white ground, and was `position: static`, so
       AtlasFrame's fixed z-index:0 layers painted straight over it: measured
       in a browser, the strip between the last band and the footer was
       photograph, with neither the white ground nor the form on it. A static
       background is not drawn on this site. */
    <section
      id="newsletter"
      aria-labelledby={LINE_ID}
      className="relative w-full bg-white border-t border-[var(--c-border)]"
    >
      <form
        onSubmit={submit}
        aria-labelledby={LINE_ID}
        noValidate
        className="mx-auto max-w-content px-6 py-3 flex items-center gap-3 sm:gap-5 flex-wrap sm:flex-nowrap"
      >
        {/* A HEIGHT THAT GROWS ON A PHONE (2026-10-04, the UK page reform's design review): the bar was 56px tall exactly, and on a
            phone its line and its field wrap to two rows, so the field and the button hung under the bar, half under the footer. */}
        <p id={LINE_ID} className="flex-1 min-w-0 text-sm sm:text-base text-[var(--c-ink2)]">
          {NEWSLETTER_COPY.line}
        </p>
        <div role="status" className={status === "success" ? "" : "sr-only"}>
          {status === "success" ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--c-ink)]">
              <CheckCircle size={14} weight="regular" aria-hidden="true" />
              {NEWSLETTER_COPY.done}
            </span>
          ) : null}
        </div>
        {status === "success" ? null : (
          <div className="flex w-full flex-col gap-1 sm:w-auto">
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor={FIELD_ID}>Email address</label>
              <input
                id={FIELD_ID}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@work.com"
                aria-invalid={status === "invalid" ? true : undefined}
                aria-describedby={error ? ERROR_ID : undefined}
                className={`h-11 flex-1 rounded-md border bg-white px-3 text-base text-[var(--c-ink)] placeholder:text-[var(--c-muted)] sm:w-64 sm:flex-none md:text-sm ${
                  error ? "border-[var(--terra-text)]" : "border-[var(--control-line)]"
                }`}
              />
              <button
                type="submit"
                disabled={!ready || status === "loading"}
                className="h-11 shrink-0 rounded-md bg-[var(--c-ink)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--c-ink2)] disabled:opacity-70 inline-flex items-center gap-1.5"
              >
                {status === "loading" ? (<><Spinner /> {NEWSLETTER_COPY.joining}</>) : NEWSLETTER_COPY.button}
              </button>
            </div>
            {error ? (
              <p id={ERROR_ID} role="alert" className="text-sm text-[var(--c-ink)]">
                {error}
              </p>
            ) : null}
          </div>
        )}
      </form>
    </section>
  );
}

function Spinner() {
  return (
    <CircleNotch
      size={12}
      weight="regular"
      aria-hidden="true"
      className="text-white"
      style={{ animation: "spin 900ms linear infinite" }}
    />
  );
}

/* Add to globals.css:
   @keyframes spin { to { transform: rotate(360deg); } }
*/
