/**
 * Cookies and browser storage.
 *
 * Deliberately titled for what it describes rather than for the legal term: most of
 * what this site stores is localStorage, not cookies, and a page called
 * "Cookies" that omits localStorage would be misleading by construction.
 *
 * No consent banner is added here. That is a design decision with real cost to
 * every visitor and it belongs to the founder, not to this page. Backlog W3
 * carries it.
 */
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { LegalDraft } from "@/components/LegalDraft";
import { isPaywallOn } from "@/lib/feature_flags";
import { PRO_COOKIES } from "@/lib/legal/pro_legal";
import { WEB_ANALYTICS_ON } from "@/lib/site/web_analytics";

export const revalidate = 86400;

export const metadata = {
  title: "Cookies and browser storage | Margin Atlas",
  description:
    "What Margin Atlas stores in your browser, what it is for, and how to remove it.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  /* From launch day, the draft that names the sign-in cookie (masterplan step 30); the visit count behind the same switch. */
  if (isPaywallOn()) return <LegalDraft doc={PRO_COOKIES} webAnalytics={WEB_ANALYTICS_ON} />;
  return (
    <>
    <LegalPage
      title="Cookies and browser storage"
      standfirst="What gets stored in your browser, what each thing is for, and how to get rid of it."
      updated="29 July 2026"
    >
      <LegalSection heading="Why this page is not called just cookies">
        <p>
          Most of what this site keeps in your browser is not a cookie. It is
          local storage, which behaves differently: it stays on your device and
          is never attached to requests, so we never receive it. Calling the page
          Cookies and leaving that out would be the wrong shape of honest.
        </p>
      </LegalSection>

      <LegalSection heading="What we store, and why">
        <p>
          <b>Your saved pages, comparisons and watch list.</b> Local storage.
          Kept so the site remembers what you were looking at. Never sent to us.
        </p>
        <p>
          <b>Signing in.</b> If you have an account, Supabase sets what it needs
          to keep you signed in between visits. Without it you would sign in on
          every page.
        </p>
        <p>
          <b>Paying.</b> Stripe sets what it needs to run a checkout securely and
          to detect fraud. This only comes into play if you start a payment.
        </p>
        {/* Clarity's session identifiers left with Clarity (2026-10-04, milestone 1, M2); the visit count that may replace
            it sets nothing, so it is named here only once it runs, as on the privacy page. */}
        {WEB_ANALYTICS_ON ? (
          <p>
            <b>Counting visits.</b> Vercel Web Analytics counts page views without
            setting anything in your browser.
          </p>
        ) : null}
        <p>
          <b>Measuring speed.</b> Vercel Speed Insights measures how fast pages
          load for real visitors.
        </p>
      </LegalSection>

      <LegalSection heading="What we do not do">
        <p>
          We do not run advertising, so there are no advertising cookies. We do
          not share identifiers with ad networks or data brokers, and there is
          nothing here that follows you to other sites.
        </p>
      </LegalSection>

      <LegalSection heading="Getting rid of it">
        <p>
          Every browser can clear cookies and site data, usually under privacy or
          history settings, and doing so removes everything above. Your saved
          pages and watch list go with it, and we hold no copy to restore, which
          is the direct consequence of keeping them on your device instead of
          ours.
        </p>
        <p>
          Blocking storage for this site will not stop you reading anything. It
          will stop the site remembering you, and it will stop you signing in.
        </p>
      </LegalSection>
    </LegalPage>
    </>
  );
}
