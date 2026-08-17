/**
 * Contact.
 *
 * WHY THIS EXISTS AND WHY IT HAS NO ADDRESS ON IT.
 *
 * The site had no contact route at all. The only correction channel was the
 * inline form on cell pages, and both the privacy page and the footer carried a
 * note saying a contact page was blocked on the founder supplying an address.
 * That blocker was not real. A form needs no address: it posts to our own
 * endpoint and lands in our own table. So this page exists, and there is
 * deliberately no address anywhere on it. Publishing one would be inventing a
 * channel nobody staffs.
 *
 * THE COPY IS THE HARD PART, not the markup. A contact form that implies a
 * reply nobody sends is worse than having no form, because it converts a
 * reader's goodwill into a wait. So the page says the true thing in plain
 * words: every message is read, a correction that holds up changes the figure,
 * and there is no inbox, no response time, and no promise of a reply. Nothing
 * here should be softened later into an implied service level.
 *
 * It renders inside the same shell as privacy, terms and cookies, because a
 * reader who is checking whether this is a real operation looks at all four and
 * three shapes would read as three afterthoughts.
 *
 * NO JAVASCRIPT. The form is a plain HTML POST to /api/contact, which 303s back
 * here with a state code, the same pattern /auth/signout and /api/go already
 * use. That is why this page reads searchParams and therefore renders
 * dynamically, and why it declares no `revalidate`: a form page answering a
 * submit must not be served from a cache.
 */
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "Contact | Margin Atlas",
  description:
    "Tell us a figure is wrong, or ask a question. One form, read by us, with no promise of a reply.",
  alternates: { canonical: "/contact" },
};

/** The closed set of codes /api/contact can redirect back with. */
const ERRORS: Record<string, string> = {
  short:
    "That message was too short to act on. A sentence or two saying what looks wrong, and where, is enough.",
  rate: "That is several messages in a very short time. Wait a minute and send it again.",
  server: "That did not go through. Try sending it again.",
};

const linkClass = "underline underline-offset-2 hover:text-atlas-600";
const labelClass = "block text-sm font-medium text-ink-900";
const hintClass = "mt-1 block text-sm text-ink-600";
const fieldClass =
  "mt-2 w-full rounded-lg border border-paper-350 bg-white px-3 py-2 text-base text-ink-900";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const error = sp.error ? ERRORS[sp.error] ?? ERRORS.server : null;

  if (sent) {
    return (
      <LegalPage
        title="Contact"
        eyebrow="Trust"
        standfirst="Your message is in the queue."
        updated="1 August 2026"
        notice={null}
      >
        <LegalSection heading="Message received">
          {/* Terracotta since 2026-08-17. Green was kept under review as the
              one place a red/green convention carries real meaning, and the
              pair had already broken: the error panel a hundred lines down is
              clay, an oxblood deliberately chosen NOT to be the stock error
              red. `role="status"` is what actually announces this to a screen
              reader, and the sentence inside says the same thing again, so no
              signal moves with the hue. Same treatment as CorrectionForm, so
              the two confirmations a reader might see in one session finally
              agree. */}
          <div
            role="status"
            className="rounded-xl border border-atlas-200 bg-atlas-50 px-4 py-3 text-atlas-700"
          >
            It is in the queue and it will be read.
          </div>
          <p>
            Assume no reply. If it was a correction and it holds up, the figure
            on the page changes, and that is the answer worth having.
          </p>
          <p>
            <a href="/contact" className={linkClass}>
              Send another message
            </a>
            , or go back to{" "}
            <a href="/" className={linkClass}>
              the atlas
            </a>
            .
          </p>
        </LegalSection>
      </LegalPage>
    );
  }

  return (
    <LegalPage
      title="Contact"
      eyebrow="Trust"
      standfirst="One form for everything. The most useful thing you can put in it is a figure that looks wrong to you."
      updated="1 August 2026"
      notice={null}
    >
      <LegalSection heading="What to send">
        <p>
          The most valuable message this site gets is that a number is wrong. If
          a figure does not match what you see in your own business, or in a
          market you know well, that is the message we want. Tell us which page
          it is on and what you would expect to see instead. A figure somebody
          can argue with is worth more here than a compliment.
        </p>
        <p>
          Everything else goes in the same form: a question about how a figure
          was built, a place or a trade you looked for and could not find, a page
          that will not load, or something you want to do with this data that the
          site does not support yet.
        </p>
      </LegalSection>

      <LegalSection heading="What happens next">
        <p>
          A form that implies a reply nobody sends is worse than no form, so here
          is the whole of it.
        </p>
        <p>
          Every message is read. A correction that holds up is acted on, and the
          figure on the page changes. That part we will stand behind.
        </p>
        <p>
          There is no staffed inbox behind this and no response time we could
          promise and keep, so assume you will not get a reply. If you are
          waiting on an answer before you decide something, decide without us.
        </p>
        <p>
          One exception, and it is not a service level. If you are asking what we
          hold about you, or asking us to delete it, the{" "}
          <a href="/privacy" className={linkClass}>
            privacy page
          </a>{" "}
          says we will answer. That still stands, and this form is how you ask.
        </p>
      </LegalSection>

      <LegalSection heading="Whether to leave an email address">
        <p>
          You do not need one. Leave the field empty and the message still
          arrives and still counts.
        </p>
        <p>
          What an address buys is the only route back to you. Corrections often
          turn on one detail: which year, which size of business, which page you
          were on. Without an address there is no way to ask, so a message we
          cannot interpret is a message we cannot act on. Leaving one is not a
          request for a reply and is not a promise of one.
        </p>
        <p>
          An address given here is used for that and nothing else. It does not
          subscribe you to anything. The{" "}
          <a href="/privacy" className={linkClass}>
            privacy page
          </a>{" "}
          says what we hold and for how long.
        </p>
      </LegalSection>

      <LegalSection heading="Send a message">
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-clay-300 bg-clay-50 px-4 py-3 text-clay-700"
          >
            {error}
          </div>
        ) : null}

        <form
          action="/api/contact"
          method="post"
          /* Canonical surface. LegalPage, which wraps this route, carries no
             surface of its own, so the form is the only carded thing on the
             page; that is worth fixing at LegalPage, in another agent's file,
             rather than here. The `fieldClass` bg-white above is a form input
             and stays one. */
          className="atlas-card p-5 space-y-5"
        >
          <fieldset className="space-y-2">
            <legend className={labelClass}>What is this about?</legend>
            <label className="flex items-center gap-2 text-base text-ink-800">
              <input type="radio" name="topic" value="correction" defaultChecked />
              A figure looks wrong
            </label>
            <label className="flex items-center gap-2 text-base text-ink-800">
              <input type="radio" name="topic" value="other" />
              Something else
            </label>
          </fieldset>

          <div>
            <label htmlFor="contact-page" className={labelClass}>
              Which page?
            </label>
            <span id="contact-page-hint" className={hintClass}>
              Optional. Paste the address, or just describe it.
            </span>
            <input
              id="contact-page"
              name="page"
              type="text"
              maxLength={500}
              autoComplete="off"
              aria-describedby="contact-page-hint"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>
              Your message
            </label>
            <span id="contact-message-hint" className={hintClass}>
              Required. For a correction: what looks wrong, and what you would
              expect to see instead.
            </span>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={4000}
              rows={6}
              aria-describedby="contact-message-hint"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Your email address
            </label>
            <span id="contact-email-hint" className={hintClass}>
              Optional. Only so we can ask a question if a correction needs one.
            </span>
            <input
              id="contact-email"
              name="email"
              type="email"
              maxLength={254}
              autoComplete="email"
              aria-describedby="contact-email-hint"
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="rounded-full bg-ink-900 px-5 py-2.5 text-base font-medium text-white hover:bg-ink-800 transition-colors"
            >
              Send message
            </button>
            <p className="text-sm text-ink-600">
              Sending this does not email anyone and does not sign you up for
              anything.
            </p>
          </div>
        </form>
      </LegalSection>
    </LegalPage>
  );
}
