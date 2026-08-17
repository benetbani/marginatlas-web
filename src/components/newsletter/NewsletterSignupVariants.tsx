/**
 * NewsletterSignupVariants
 * ========================
 *
 * Three signup surfaces shipped as one bundle so they share form styling,
 * submit states, and privacy copy:
 *
 *   - FooterNewsletterBar : slim parchment bar at the bottom of every page.
 *   - InlineMidArticle    : editorial card that drops into /learn posts.
 *   - ExitIntentModal     : calm dismissible modal triggered by real
 *                           desktop exit intent, gated to once per visitor.
 *
 * All three POST to the same endpoint:
 *
 *   POST /api/newsletter
 *   { email: string, source: "footer" | "inline" | "exit_intent" }
 *
 * Override `endpoint` at the call site if your route differs.
 */

"use client";

import { useEffect, useState } from "react";
import {
  X, ArrowRight, CheckCircle, EnvelopeOpen, CircleNotch,
} from "@phosphor-icons/react/dist/ssr";

/* "Unsubscribe with one click" was not true and could not be. One-click
   unsubscribe means a link in an email, and this project has no email provider
   at all, so no message is ever sent and there is no link to click. There is
   also no unsubscribe route, handler or token anywhere in the app.

   It matters more than the other unbacked promises on this site because it is
   the assurance directly under the input, offered in exchange for the address,
   and addresses really are stored now. /contact is a working route that lands
   in Supabase for review, so asking is a real path. */
const PRIVACY_LINE = "No spam, no shilling. Ask and you are off the list.";

type Source = "footer" | "inline" | "exit_intent";
type Status = "idle" | "loading" | "success" | "error";

type Props = { endpoint?: string };

// ---------------------------------------------------------------------------
// Shared submit hook
// ---------------------------------------------------------------------------
function useNewsletterSubmit(source: Source, endpoint: string) {
  const [status, setStatus] = useState<Status>("idle");
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
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error("network");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return { status, email, setEmail, submit };
}

// ---------------------------------------------------------------------------
// FooterNewsletterBar
// ---------------------------------------------------------------------------
export function FooterNewsletterBar({ endpoint = "/api/newsletter" }: Props) {
  const { status, email, setEmail, submit } = useNewsletterSubmit("footer", endpoint);
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
    <div
      id="newsletter"
      className="relative w-full bg-white border-t border-parchment scroll-mt-20"
    >
      <form
        onSubmit={submit}
        className="mx-auto max-w-6xl px-6 h-14 flex items-center gap-3 sm:gap-5 flex-wrap sm:flex-nowrap"
      >
        <p className="font-display italic text-sm sm:text-base flex-1 min-w-0 text-cocoa-700">
          A calm monthly read for people who use Atlas.
        </p>
        {status === "success" ? (
          <p className="text-sm font-semibold inline-flex items-center gap-1.5 text-atlas-700">
            <CheckCircle size={14} weight="regular" aria-hidden="true" />
            You're on the list.
          </p>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="sr-only" htmlFor="atlas-footer-email">Email address</label>
            <input
              id="atlas-footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@work.com"
              aria-invalid={status === "error"}
              className={`h-9 px-3 rounded-md text-sm flex-1 sm:flex-none sm:w-64 bg-white text-ink-900 border ${
                status === "error" ? "border-atlas-700" : "border-cocoa-700/25"
              }`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-9 px-3 rounded-md text-sm font-semibold inline-flex items-center gap-1.5 bg-ink-900 text-white disabled:opacity-70"
            >
              {status === "loading" ? (<><Spinner /> Joining</>) : "Join"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InlineMidArticle
// ---------------------------------------------------------------------------
export function InlineMidArticle({ endpoint = "/api/newsletter" }: Props) {
  const { status, email, setEmail, submit } = useNewsletterSubmit("inline", endpoint);
  return (
    <aside
      aria-label="Atlas newsletter signup"
      className="atlas-card my-8 p-5 sm:p-6"
      style={{ paddingLeft: 28 }}
    >
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-3 w-[2px] rounded-full bg-atlas-500" />
      <h3 className="font-display text-xl font-semibold tracking-[-0.012em] text-ink-900">
        Like this kind of writing?
      </h3>
      <p className="font-display italic mt-1.5 text-[15px] text-cocoa-700 leading-relaxed">
        Once a month we send one deep-dive on a single benchmark plus three short data hits. Around 600 words. That is the entire pitch.
      </p>

      {status === "success" ? (
        <p className="mt-4 text-sm font-semibold inline-flex items-center gap-1.5 text-atlas-700">
          <CheckCircle size={14} weight="regular" aria-hidden="true" />
          You're on the list. Check your inbox for a hello.
        </p>
      ) : (
        <>
          <form onSubmit={submit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <label className="sr-only" htmlFor="atlas-inline-email">Email address</label>
            <input
              id="atlas-inline-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@work.com"
              aria-invalid={status === "error"}
              className={`flex-1 h-10 px-3 rounded-md text-sm bg-white text-ink-900 border ${
                status === "error" ? "border-atlas-700" : "border-cocoa-700/25"
              }`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-10 px-4 rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 bg-atlas-500 text-white disabled:opacity-70"
            >
              {status === "loading" ? (
                <><Spinner /> Joining</>
              ) : (
                <>Join the list <ArrowRight size={12} aria-hidden="true" /></>
              )}
            </button>
          </form>
          <p className="mt-2 text-xs text-cocoa-700/70">{PRIVACY_LINE}</p>
        </>
      )}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// ExitIntentModal
// ---------------------------------------------------------------------------
const EXIT_STORAGE_KEY = "atlas.exitIntent.seen.v1";

export type ExitIntentModalProps = Props & {
  /** Skip the storage gate. Useful for tests and design review. */
  forceOpen?: boolean;
};

export function ExitIntentModal({
  endpoint = "/api/newsletter",
  forceOpen = false,
}: ExitIntentModalProps) {
  const [open, setOpen] = useState(false);
  const { status, email, setEmail, submit } = useNewsletterSubmit("exit_intent", endpoint);

  useEffect(() => {
    if (forceOpen) { setOpen(true); return; }
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch
    if (localStorage.getItem(EXIT_STORAGE_KEY)) return;

    function onLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setOpen(true);
        try { localStorage.setItem(EXIT_STORAGE_KEY, "1"); } catch { /* ignore */ }
        document.removeEventListener("mouseleave", onLeave);
      }
    }
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, [forceOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className="fixed inset-0 z-40"
        style={{ background: "rgba(26, 26, 26, 0.32)" }}
      />
      <div
        role="dialog"
        /* NO aria-modal. See PaywallModalRoot.tsx for the full reasoning: the
           attribute promises assistive technology that the rest of the page is
           inert, and nothing here contains focus, so the promise was false. */
        aria-labelledby="atlas-exit-h"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md rounded-2xl p-6 sm:p-7 bg-white border border-parchment shadow-[0_1px_2px_rgba(26,26,26,0.05),_0_24px_60px_rgba(26,26,26,0.18)]"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md text-cocoa-700"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="flex justify-center text-atlas-700">
          <EnvelopeOpen size={28} weight="regular" aria-hidden="true" />
        </div>

        <h2
          id="atlas-exit-h"
          className="font-display mt-3 text-center text-xl sm:text-2xl font-semibold tracking-[-0.012em] text-ink-900"
        >
          Get the next benchmark we publish?
        </h2>
        <p className="font-display italic mt-2 text-center text-[15px] text-cocoa-700 leading-relaxed">
          One email on the first of every month with a single deep-dive plus three short data hits. Around 600 words.
        </p>

        {status === "success" ? (
          <p className="mt-5 text-center text-sm font-semibold inline-flex items-center justify-center gap-1.5 w-full text-atlas-700">
            <CheckCircle size={14} weight="regular" aria-hidden="true" />
            You're on the list.
          </p>
        ) : (
          <>
            <form onSubmit={submit} className="mt-5 flex flex-col gap-2">
              <label className="sr-only" htmlFor="atlas-exit-email">Email address</label>
              <input
                id="atlas-exit-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@work.com"
                aria-invalid={status === "error"}
                className={`h-10 px-3 rounded-md text-sm bg-white text-ink-900 border ${
                  status === "error" ? "border-atlas-700" : "border-cocoa-700/25"
                }`}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-10 rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 bg-atlas-500 text-white disabled:opacity-70"
              >
                {status === "loading" ? (<><Spinner /> Joining</>) : "Send me the next one"}
              </button>
            </form>
            <p className="mt-2 text-center text-xs text-cocoa-700/70">{PRIVACY_LINE}</p>
          </>
        )}

        <p className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-cocoa-700 underline-offset-4 hover:underline"
          >
            No thanks
          </button>
        </p>
      </div>
    </>
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
