/**
 * Common questions.
 *
 * WHY THIS PAGE IS SHAPED THE WAY IT IS.
 *
 * The questions are the ones a person deciding where to open a business
 * actually arrives with, not the ones that are comfortable to answer. Four of
 * the eight are about what the numbers cannot carry. That ratio is the point:
 * this site's whole argument is that it says what it knows and what it does
 * not, and a confident FAQ on a set of pages with real coverage gaps would be
 * worth less than no FAQ at all.
 *
 * It renders in the same shell as privacy, terms, cookies and contact, because
 * a reader who has become suspicious reads all five and five shapes would read
 * as five afterthoughts.
 *
 * THE SCHEMA CANNOT DRIFT FROM THE COPY, BY CONSTRUCTION. Each answer is
 * authored once, as React nodes. The FAQPage JSON-LD text is derived from those
 * same nodes by walking them (nodeToText below), so there is no second copy of
 * an answer to fall out of step with the first. Two identical sentences written
 * in two places is this project's most expensive defect class, and a mismatch
 * here would be that defect in a machine-readable place, which is worse: search
 * engines penalise it and answer engines quote it.
 *
 * WHAT THIS PAGE DELIBERATELY DOES NOT DO. It does not restate the coverage
 * tier definitions at the length /about-data gives them, or re-explain the
 * headline-ratio method. Both are linked. A second, shorter telling of a
 * definition is how a definition drifts.
 *
 * ONE THING TO KNOW BEFORE EDITING THE LINKS. The dead-link gate finds route
 * references by matching an attribute written literally in the source. The
 * links below are written that way, inside the answer nodes, so the gate does
 * see them. Keep them literal; do not lift them into a lookup table.
 */
import * as React from "react";

import { FAQSchema } from "@/components/FAQSchema";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const revalidate = 86400;

export const metadata = {
  title: "Common questions | Margin Atlas",
  description:
    "Where the figures come from, how current they are, what the coverage words mean, what a missing number means, and how far you should lean on any of it.",
  alternates: { canonical: "/faq" },
};

const linkClass = "underline underline-offset-2 hover:text-atlas-600";

/**
 * Flattens an answer's React nodes to the plain text a reader sees, in order.
 * Only strings and elements appear in the answers below, so this is exact
 * rather than approximate: what it returns is what the paragraph renders.
 */
function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return nodeToText(node.props.children);
  }
  return "";
}

type Faq = {
  question: string;
  /** One entry per rendered paragraph. Joined with a space for the schema. */
  answer: React.ReactNode[];
};

const FAQS: Faq[] = [
  {
    question: "Where do these numbers come from?",
    answer: [
      <>
        They start from the official statistics each country publishes about its
        own businesses: how many exist in a trade, what they take in, what they
        pay out, how many people they employ. Those releases do not agree with
        each other about how a trade is defined or how a region is drawn, so
        most of the work here is standardising them until a bakery in one
        country can be set against a bakery in another and the comparison means
        something.
      </>,
      <>
        That standardising is where the interesting failures live, and it is the
        part worth reading before you rely on a figure.{" "}
        <a href="/about-data" className={linkClass}>
          About the data
        </a>{" "}
        sets out what is in the set and how each figure is graded. A separate{" "}
        <a href="/methodology/key-benchmarks" className={linkClass}>
          methodology note
        </a>{" "}
        explains why each trade is judged on one headline ratio rather than
        five.
      </>,
    ],
  },
  {
    question: "How current are they?",
    answer: [
      <>
        Statistics about small businesses are published well after the period
        they describe. That is true in every country and it is not a lag anyone
        here can shorten. So read a figure on this site as a recent settled
        picture of a trade, not as this month&rsquo;s trading.
      </>,
      <>
        Pages tell you they are showing the most recent data available rather
        than printing a year against each number. One page can carry figures
        drawn from releases on different cycles, and a single year stamped
        across all of them would be wrong for most of them. What that costs you
        is precision about age: you can see that a figure is the latest we hold,
        not which year it belongs to. If your decision turns on the year, take
        what is here as the baseline and check the current position where you
        are.
      </>,
    ],
  },
  {
    question: "What do measured, regional, estimated and modeled mean?",
    answer: [
      <>
        Four words for how a figure was built. They describe the route a number
        came down, not how sure anyone is about its exact digits.
      </>,
      <>
        <b>Measured.</b> Direct measurement of firms in that place and that
        activity.
      </>,
      <>
        <b>Regional.</b> A broader benchmark applied to that place.
      </>,
      <>
        <b>Estimated.</b> Built from country indicators and activity averages.
      </>,
      <>
        <b>Modeled.</b> No observation for that place and trade, so the figure
        is what we would expect on average.
      </>,
      <>
        You meet these words through the &ldquo;How we know this&rdquo; link
        beside a figure, which goes to the one that applies to what you are
        looking at, and they travel with a download.{" "}
        <a href="/about-data" className={linkClass}>
          About the data
        </a>{" "}
        carries the fuller version of each, with the inputs named.
      </>,
      <>
        What the word is not is a verdict on the number. It says which route a
        figure came down. It does not certify that the figure is right.
      </>,
    ],
  },
  {
    question: "Why is a figure missing on some pages?",
    answer: [
      <>
        Because there was not enough behind it to publish. When the inputs for
        one figure do not hold up, the site leaves that figure out rather than
        filling the space with something plausible. A blank is a decision, not a
        breakage.
      </>,
      <>
        The same rule runs at page level. Some pages are thin enough that they
        are deliberately kept out of the search listings, so a page you reach
        from inside the site can be one we would not put in front of a stranger.
      </>,
      <>
        A blank is the honest outcome and it is still a blank. On a thin page
        the few figures that remain are carrying more of the weight than they
        would on a full one, which is worth knowing before you read too much
        into them.
      </>,
    ],
  },
  {
    question: "Can I trust this enough to make a decision on it?",
    answer: [
      <>
        For direction, yes, and that is what it is built for. Use it to find out
        whether a trade earns twice what you assumed or half, to set one place
        against another on the same definition, and to notice you are out by an
        order of magnitude before you sign a lease.
      </>,
      <>
        For a document somebody else will rely on, no. Do not move a figure from
        here into a loan application, an investor pack or a valuation without
        checking it against something local: a quote, an operator already in the
        trade, an accountant who files in that country. Nothing here is audited
        and nothing here knows your street.
      </>,
      <>
        The line between those two runs through the words above. A figure taken
        from firms counted in that place carries further than one produced by a
        country-level model, and the &ldquo;How we know this&rdquo; link beside
        a figure is how you tell which one you are holding. Neither is a
        guarantee. If a number looks wrong to you, it may well be wrong, and
        what you know about your own trade beats anything printed on this site.
      </>,
    ],
  },
  {
    question: "Do you have my city and my trade?",
    answer: [
      <>
        Every country has a page. How far the numbers reach below that varies
        more than anyone would like. The{" "}
        <a href="/coverage" className={linkClass}>
          coverage report
        </a>{" "}
        groups countries by how deep the measurement actually goes, and it is
        the fastest way to see where you stand before you start reading figures.
      </>,
      <>
        Where a place is thin, a page can still exist and still print numbers,
        built from a broader benchmark or from a model rather than from
        businesses counted on that street. That is what the four words above are
        for. Check the &ldquo;How we know this&rdquo; link before you lean on
        anything.
      </>,
      <>
        If you looked for a place or a trade and did not find it, the{" "}
        <a href="/contact" className={linkClass}>
          contact form
        </a>{" "}
        is worth a minute. What people look for and cannot find is the clearest
        map of what is missing.
      </>,
    ],
  },
  {
    question: "Something looks wrong. How do I tell you?",
    answer: [
      <>
        Through the{" "}
        <a href="/contact" className={linkClass}>
          contact form
        </a>
        , or the correction link that sits on a data page, which reaches the
        same place. Say which page it was and what you would expect to see
        instead. A figure somebody can argue with is the most useful thing this
        site receives.
      </>,
      <>
        What happens next, in full. Every message is read, and a correction that
        holds up is acted on and the figure on the page changes. There is no
        staffed inbox behind it and no response time anyone could promise and
        keep, so assume you will not get a reply. If you are waiting on an
        answer before you decide something, decide without us.
      </>,
    ],
  },
  {
    question: "Is it free, and will it stay free?",
    answer: [
      <>
        Free to read, all of it, with no account and no card. The typical figure
        for a trade in a place, and the spread from the bottom tenth to the top
        tenth around it, are there for everybody wherever we hold them.
      </>,
      <>
        There are paid plans. What each one adds, and what it costs, is set out
        on the{" "}
        <a href="/pricing" className={linkClass}>
          pricing page
        </a>
        .
      </>,
      <>
        On whether it stays free: the free layer is the argument for this site
        existing, so we are not going to take a figure you can read today and
        put it behind a wall. That is a commitment about the reading. It is not
        a promise that nothing about the site will ever change.
      </>,
    ],
  },
];

const CLOSING_NOTE = (
  <>
    If your question is not here, the{" "}
    <a href="/contact" className={linkClass}>
      contact form
    </a>{" "}
    takes it, and{" "}
    <a href="/about-data" className={linkClass}>
      about the data
    </a>{" "}
    goes further into method than this page does.
  </>
);

export default function FaqPage() {
  return (
    <LegalPage
      title="Common questions"
      eyebrow="Trust"
      standfirst="What sits behind the numbers on this site, how far they carry, and where they stop."
      updated="1 August 2026"
      notice={CLOSING_NOTE}
    >
      {FAQS.map((faq) => (
        <LegalSection key={faq.question} heading={faq.question}>
          {faq.answer.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </LegalSection>
      ))}

      {/* Last child on purpose. A script element has no box, so the shell's
          vertical rhythm is untouched wherever it sits, and putting it after
          the sections keeps the reading order of the source the same as the
          reading order of the page. The answer strings are derived from the
          very nodes rendered above, so the two cannot disagree. */}
      <FAQSchema
        faqs={FAQS.map((faq) => ({
          question: faq.question,
          answer: faq.answer.map(nodeToText).join(" "),
        }))}
      />
    </LegalPage>
  );
}
