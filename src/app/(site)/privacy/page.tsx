/**
 * Privacy. Written from a survey of what the code actually does, on 2026-07-29:
 * Microsoft Clarity in the root layout, Vercel Speed Insights, Supabase for auth
 * and for the newsletter_signups table, Stripe checkout and webhook routes, and
 * localStorage for the saved list, comparisons and watch tray.
 *
 * Nothing here is boilerplate. If a practice is not in this file, it is because
 * the site does not do it. That is the only thing that makes a privacy policy
 * worth reading.
 */
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const revalidate = 86400;

export const metadata = {
  title: "Privacy | Margin Atlas",
  description:
    "What Margin Atlas collects, why, who it goes to, and what it never does.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      standfirst="What we collect, why we collect it, and who else sees it. Short, because we do not do much."
      updated="29 July 2026"
    >
      <LegalSection heading="The short version">
        <p>
          You can read every page on this site without an account and without
          telling us anything about yourself. We do not sell data, we do not run
          advertising, and we do not build profiles to target you with.
        </p>
        <p>
          If you make an account, subscribe to the newsletter, send a correction
          or pay us, we hold what you gave us and nothing more.
        </p>
      </LegalSection>

      <LegalSection heading="What you give us deliberately">
        <p>
          <b>An account.</b> If you sign in, we hold your email address so we can
          recognise you next time. Authentication runs on Supabase.
        </p>
        <p>
          <b>The newsletter.</b> If you subscribe, we store your email address so
          we can send it. Nothing else is attached to it.
        </p>
        <p>
          <b>Corrections.</b> If you tell us a figure is wrong, we keep what you
          wrote so we can act on it and so we have a record of why a number
          changed.
        </p>
        <p>
          <b>Payment.</b> Payments run through Stripe. Card details go straight to
          Stripe and never reach our servers. We see that a payment happened and
          which plan it was for.
        </p>
      </LegalSection>

      <LegalSection heading="What is collected automatically">
        <p>
          <b>Session recording and heatmaps.</b> We use Microsoft Clarity to see
          how pages are actually used, which parts get read and where people get
          stuck. It records interactions such as scrolling, clicks and mouse
          movement, and it does this on every page. We use it to find where the
          site is confusing.
        </p>
        <p>
          <b>Performance.</b> Vercel Speed Insights measures how quickly pages
          load and render for real visitors, so we can tell when we have made
          something slower.
        </p>
        <p>
          <b>Server logs.</b> Requests to the site are logged by our host in the
          ordinary way, including IP address, for security and diagnosis.
        </p>
      </LegalSection>

      <LegalSection heading="What stays on your device">
        <p>
          Your saved pages, your comparisons and your watch list are stored in
          your own browser. They are not sent to us and we cannot see them.
          Clearing your browser storage deletes them, and we have no copy to
          restore.
        </p>
      </LegalSection>

      <LegalSection heading="Who else is involved">
        <p>
          Running the site means using other companies. Each one sees only what
          its job requires:
        </p>
        <p>
          <b>Vercel</b> hosts the site and measures its speed. <b>Supabase</b>{" "}
          stores accounts, newsletter addresses and corrections. <b>Stripe</b>{" "}
          takes payments. <b>Microsoft</b> provides Clarity, the session recording
          described above.
        </p>
        <p>
          We do not pass your information to anyone else, and we do not sell it
          to anyone at all.
        </p>
      </LegalSection>

      <LegalSection heading="How long we keep things">
        <p>
          Account and payment records are kept while your account exists and for
          as long afterwards as we need them for tax and accounting. Newsletter
          addresses are kept until you unsubscribe. Corrections are kept
          indefinitely, because the reason a figure changed is part of the
          record.
        </p>
      </LegalSection>

      <LegalSection heading="What you can ask for">
        <p>
          Ask us what we hold about you and we will tell you. Ask us to delete it
          and we will, except where we are required to keep a record of a
          payment. Unsubscribing from the newsletter is a link in every email and
          needs no explanation.
        </p>
        {/* Both channels named here verifiably exist and neither is an address.
            The contact page (built 2026-08-01) is a form posting to our own
            endpoint; the correction link on any data page posts to
            /api/correction. This page must never promise a route that does not
            exist, and must never imply a reply, which is why the sentence below
            stops at "read" and does not go on to "and we will get back to you". */}
        <p>
          The{" "}
          <a
            href="/contact"
            className="underline underline-offset-2 hover:text-atlas-600"
          >
            contact page
          </a>{" "}
          is how you ask, and the correction link on any data page reaches the
          same place. Both are forms. We read everything that comes through them.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>
          This site is for people running or planning a business. It is not aimed
          at children and we do not knowingly collect anything from them.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          If we change what we collect, we will change this page and move the
          date at the top. We will not quietly start doing something this page
          says we do not do.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
