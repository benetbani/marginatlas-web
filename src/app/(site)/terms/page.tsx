/**
 * Terms.
 *
 * The hard part of this page is not the boilerplate, it is the accuracy
 * disclaimer, and it has to be written without undermining the product. The
 * site's entire claim is that its figures are honest and their arithmetic is
 * shown. A terms page that then says "we make no representation as to accuracy"
 * in the usual way would contradict the thing being sold.
 *
 * So it says the true and more useful thing instead: the figures are modelled
 * and tiered, the page tells you which tier each one is, and a model is not a
 * promise about your business. That is a stronger position than a blanket
 * disclaimer, and it is what the product actually does.
 */
import { isPaywallOn } from "@/lib/feature_flags";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { LegalDraft } from "@/components/LegalDraft";
import { PRO_TERMS } from "@/lib/legal/pro_legal";

export const revalidate = 86400;

export const metadata = {
  title: "Terms | Margin Atlas",
  description:
    "The terms for using Margin Atlas: what you may do with the figures, what we promise, and what we do not.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  /* FROM LAUNCH DAY, THE TERMS OF PRO (masterplan step 30; his ruling 34): with the paywall's switch on, the draft he approves
     (src/lib/legal/pro_legal.ts); until then, the text below. */
  if (isPaywallOn()) return <LegalDraft doc={PRO_TERMS} />;
  return (
    <>
    <LegalPage
      title="Terms"
      standfirst="What you can do with what you find here, and what we do and do not promise."
      updated="29 July 2026"
    >
      <LegalSection heading="Using the site">
        <p>
          Reading is free and needs no account. You may quote our figures, cite
          them, and use them in your own work, including commercially, as long as
          you say where they came from. We would rather be quoted than hoarded.
        </p>
        <p>
          What you may not do is copy the site wholesale, scrape it at a rate
          that degrades it for other people, or republish it as though it were
          your own dataset.
        </p>
      </LegalSection>

      <LegalSection heading="What the figures are, and what they are not">
        <p>
          Many numbers here are <b>estimates</b>, built from published records.
          Where it matters, the line under a figure says whether it was counted,
          worked out, looked up or estimated.
        </p>
        <p>
          <b>A model of a typical business is not a forecast of yours.</b> Two
          shops on the same street with the same figures behind them can land in
          different places, and the difference is usually the operator. Use these
          numbers to understand the shape of a trade and to check your own
          assumptions. Do not use them as the basis of a decision you cannot
          afford to get wrong without checking them against your own quotes.
        </p>
        <p>
          Nothing here is financial, legal, tax or investment advice, and we are
          not licensed to give any of it.
        </p>
      </LegalSection>

      <LegalSection heading="When we are wrong">
        <p>
          We will be, sometimes. When you find it,{" "}
          <a
            href="/contact"
            className="underline underline-offset-2 hover:text-atlas-600"
          >
            tell us
          </a>
          . We correct figures rather than defending them, and we keep a record
          of what changed and why, because a number that quietly changes is
          worse than one that was wrong out loud.
        </p>
      </LegalSection>

      <LegalSection heading="Accounts">
        <p>
          Keep your sign-in to yourself.{" "}
          <a
            href="/contact"
            className="underline underline-offset-2 hover:text-atlas-600"
          >
            Tell us
          </a>{" "}
          if you think someone else is using it. We may close an account that is
          being used to attack the site or to strip it, and we will say why.
        </p>
      </LegalSection>

      <LegalSection heading="Paying">
        <p>
          Pro is billed through Stripe on the terms shown on the pricing page at
          the time you subscribe. You can cancel whenever you like and it takes
          effect at the end of the period you have paid for.{" "}
          {/* Ruling 17 from launch day (the paywall's switch, masterplan step 12); today's promise is true until then. */}
          {isPaywallOn() ? "Each UK chapter opens free. Pro opens the rest." : "Everything that is free today stays free."}
        </p>
      </LegalSection>

      <LegalSection heading="Availability">
        <p>
          We try to keep the site up and we do not promise that it always will
          be. It may be unavailable while we deploy, and a page may be withdrawn
          if we discover its data is unsound. Removing a page we cannot stand
          behind is the correct outcome, not a failure of service.
        </p>
      </LegalSection>

      <LegalSection heading="Liability">
        <p>
          We are responsible for the site being what this page says it is. We are
          not responsible for business decisions made after reading it, and our
          liability is limited to what you have paid us, which for most readers
          is nothing.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          If these terms change we will move the date at the top. If a change
          materially affects people who pay us, we will tell them rather than
          leaving them to notice.
        </p>
      </LegalSection>
    </LegalPage>
    </>
  );
}
