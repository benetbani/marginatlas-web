/**
 * src/lib/legal/pro_legal.ts
 *
 * THE TERMS OF PRO, CANCELLING AND REFUNDS, PRIVACY AND COOKIES, DRAFTED FOR HIS APPROVAL (milestone 2, masterplan step 30; his
 * interview of 2026-09-26: 34, "the loop drafts terms, privacy and refund rules from standard UK subscription terms: cancel any
 * time, access to the end of the paid period, consent to immediate access at checkout; he approves"; 17, each UK chapter opens
 * free and Pro opens the rest). One source: the three legal pages draw these drafts when the paywall's switch is on (launch day)
 * and their current text until then, and scripts/legal/export_drafts.ts writes the same drafts to the file he reads.
 *
 * The law each part follows is in the research note of 5 October 2026 (E:/atlas/design/loop/build/m2/legal/
 * 2026-10-05-uk-subscription-law.md); where it could not settle a point, the draft takes the stricter reading. Every fact about
 * him the drafts need is a marked gap, [HIS: ...], never a value written here. Prices print through the plan, the consent line
 * through the checkout's own constant, so neither can drift from what the reader is charged or ticks.
 *
 * A paragraph is plain text, a link written [words](href) and a bold lead **words**; `when` holds a paragraph to the cookie-free
 * visit count's switch (src/lib/site/web_analytics.ts). No em dash, and no semicolon in a sentence a reader sees (gate pro-legal).
 */
import { CONSENT_LINE } from "@/lib/monetization/checkout_params";
import { priceLine } from "@/lib/monetization/plan";

export type LegalParagraph = { text: string; when?: "web-analytics" };
export type LegalBlock = { id: string; heading: string; paragraphs: LegalParagraph[] };
export type LegalDoc = { key: "terms" | "privacy" | "cookies"; title: string; standfirst: string; updated: string; blocks: LegalBlock[] };

/** The drafts' date. He moves it to the day he approves them. */
export const PRO_LEGAL_UPDATED = "5 October 2026";

const p = (text: string, when?: LegalParagraph["when"]): LegalParagraph => (when ? { text, when } : { text });

export const PRO_TERMS: LegalDoc = {
  key: "terms",
  title: "Terms",
  standfirst: "What you can do with what you find here, what Pro is, and how paying and cancelling work.",
  updated: PRO_LEGAL_UPDATED,
  blocks: [
    { id: "using", heading: "Using the site", paragraphs: [
      p("The first part of every UK chapter is free, and reading it needs no account. You may quote our figures, cite them and use them in your own work, including commercially, as long as you say where they came from."),
      p("What you may not do is copy the site wholesale, scrape it at a rate that slows it for other people, or republish it as though it were your own dataset."),
    ] },
    { id: "figures", heading: "What the figures are, and what they are not", paragraphs: [
      p("Many numbers here are estimates, built from published records. Where it matters, the line under a figure says whether it was counted, worked out, looked up or estimated."),
      p("A figure for a typical business is not a forecast of yours. Use these numbers to understand a trade and to check your own sums, and check them against your own quotes before a decision you cannot afford to get wrong."),
      p("Nothing here is financial, legal, tax or investment advice, and we are not licensed to give any of it."),
    ] },
    { id: "pro", heading: "What Pro is", paragraphs: [
      p("Pro opens the rest of every UK chapter, the parts a free reader sees locked, for as long as your plan is paid. It opens as soon as your payment goes through."),
    ] },
    { id: "price", heading: "The price", paragraphs: [
      p(`Pro costs ${priceLine("month")} or ${priceLine("year")}, charged in US dollars by Stripe, which runs our payments. [HIS: choose one, "The price includes VAT where it is due." or "VAT is added at checkout where it is due."]`),
    ] },
    { id: "renewal", heading: "Renewal", paragraphs: [
      p("Your plan renews at the end of each month or each year until you cancel. Before a yearly plan renews, we email you the date and the price, so you can cancel first if you want to."),
    ] },
    { id: "fourteen-days", heading: "Your right to cancel in the first 14 days", paragraphs: [
      p(`UK law usually gives you 14 days to cancel something bought online. Pro opens the moment you pay, so the checkout asks you to tick this box: "${CONSENT_LINE}" The receipt Stripe emails you confirms it.`),
      p("If you bought Pro without ticking that box, you can cancel within 14 days of buying, and we refund you in full within 14 days of your telling us."),
    ] },
    { id: "refunds", heading: "Cancelling and refunds", paragraphs: [
      p("You can cancel at any time. Open your [account](/account) and choose Manage or cancel. Your plan stops renewing, nothing more is charged, and Pro stays open to the end of the period you paid for."),
      p("We refund you if you were charged twice, if you were charged after you cancelled, or if Pro was not as described or did not work and we could not put it right. That last is your right under the Consumer Rights Act 2015."),
      p("To ask, write to us from the [contact page](/contact). A refund goes back to the card you paid with, within 14 days of our agreeing it."),
    ] },
    { id: "price-changes", heading: "If the price changes", paragraphs: [
      p("If the price of Pro changes, we email you at least 30 days before your plan renews at the new price, and you can cancel before then."),
    ] },
    { id: "accounts", heading: "Your account", paragraphs: [
      p("A Pro plan is for one person. Keep your sign-in to yourself, and [tell us](/contact) if you think someone else is using it. We may close an account that is shared, resold or used to copy the figures out in bulk, and we will say why."),
    ] },
    { id: "wrong", heading: "When we are wrong", paragraphs: [
      p("We will be, sometimes. When you find it, [tell us](/contact). We correct figures rather than defending them, and we keep a record of what changed and why."),
    ] },
    { id: "availability", heading: "Availability", paragraphs: [
      p("We try to keep the site up and we do not promise that it always will be. It may be unavailable while we deploy, and a page may be withdrawn if we find its data is unsound."),
    ] },
    { id: "liability", heading: "Liability", paragraphs: [
      p("Nothing in these terms takes away your rights as a consumer, or limits a liability the law does not allow us to limit. Apart from that, we are not responsible for business decisions made after reading the site, and our liability is limited to what you paid us for Pro in the 12 months before a claim."),
    ] },
    { id: "changes", heading: "Changes to these terms", paragraphs: [
      p("If these terms change, we move the date at the top. If a change affects people who pay us, we email them before it applies."),
    ] },
    { id: "law", heading: "The law", paragraphs: [
      p("These terms are under the law of England and Wales. If you live in Scotland or Northern Ireland, you can bring a claim in your own courts, and your own consumer law still protects you."),
    ] },
    { id: "who-we-are", heading: "Who we are", paragraphs: [
      p("Margin Atlas is run by [HIS: your name, or your company's name and number], of [HIS: the address for legal letters]. [HIS: the VAT number, if registered.] You can reach us from the [contact page](/contact)."),
    ] },
  ],
};

export const PRO_PRIVACY: LegalDoc = {
  key: "privacy",
  title: "Privacy",
  standfirst: "What we collect, why we collect it, and who else sees it. Short, because we do not do much.",
  updated: PRO_LEGAL_UPDATED,
  blocks: [
    { id: "short", heading: "The short version", paragraphs: [
      p("You can read the free part of every page without an account and without telling us anything about yourself. We do not sell data, we do not run advertising, and we do not build profiles to target you with."),
      p("If you make an account, buy Pro, subscribe to the newsletter or send a correction, we hold what you gave us and what we need to run your plan, and nothing more."),
    ] },
    { id: "account", heading: "Your account and your plan", paragraphs: [
      p("If you sign in, we hold your email address so we can recognise you next time. If you buy Pro, your account also holds your plan, when it renews or ends, and the customer number Stripe gives us, so the site knows to open Pro for you."),
    ] },
    { id: "payments", heading: "Payments", paragraphs: [
      p("Payments run through Stripe. Card details go straight to Stripe and never reach our servers. We see that a payment happened, for which plan and for how much. Stripe keeps its own record of each payment, as its own privacy notice explains."),
    ] },
    { id: "given", heading: "The newsletter and corrections", paragraphs: [
      p("**The newsletter.** If you subscribe, we store your email address so we can send it. Nothing else is attached to it."),
      p("**Corrections.** If you tell us a figure is wrong, we keep what you wrote so we can act on it and so we have a record of why a number changed."),
    ] },
    { id: "automatic", heading: "What is collected automatically", paragraphs: [
      p("**Counting visits.** Vercel Web Analytics counts which pages are read and where visitors come from. It sets no cookie and keeps no identifier that follows you, so it tells us what is read, not who reads it.", "web-analytics"),
      p("**Performance.** Vercel Speed Insights measures how quickly pages load for real visitors, so we can tell when we have made something slower."),
      p("**Server logs.** Requests to the site are logged by our host in the ordinary way, including IP address, for security and diagnosis."),
    ] },
    { id: "device", heading: "What stays on your device", paragraphs: [
      p("Your saved pages, your comparisons and your watch list are stored in your own browser. They are not sent to us and we cannot see them. Clearing your browser storage deletes them, and we have no copy to restore."),
    ] },
    { id: "others", heading: "Who else is involved", paragraphs: [
      p("Vercel hosts the site and measures its speed. Supabase stores accounts, newsletter addresses and corrections, on servers in the European Union (Ireland). Stripe takes payments. Each sees only what its job needs."),
      p("Vercel also counts visits, without cookies.", "web-analytics"),
      p("We do not pass your information to anyone else, and we do not sell it to anyone at all."),
    ] },
    { id: "bases", heading: "Why we may hold it", paragraphs: [
      p("We hold your account and your plan to provide Pro, which you asked for. We keep server logs to keep the site secure, our legitimate interest. We keep payment records because tax law requires it. We send the newsletter because you asked for it, and you can stop it at any time."),
    ] },
    { id: "keep", heading: "How long we keep things", paragraphs: [
      p("Your account is kept while it exists. Payment records are kept for six years after the end of the financial year they belong to, as tax law requires. Newsletter addresses are kept until you ask for yours to be removed. Corrections are kept for good, because the reason a figure changed is part of the record."),
    ] },
    { id: "rights", heading: "Your rights", paragraphs: [
      p("You can ask what we hold about you, have it corrected or deleted (apart from payment records the law makes us keep), and object to how we use it. Ask through the [contact page](/contact). If you are unhappy with our answer, you can complain to the Information Commissioner's Office, the UK's data protection regulator, at [ico.org.uk](https://ico.org.uk)."),
    ] },
    { id: "children", heading: "Children", paragraphs: [
      p("This site is for people running or planning a business. It is not aimed at children and we do not knowingly collect anything from them."),
    ] },
    { id: "changes", heading: "Changes", paragraphs: [
      p("If we change what we collect, we change this page and move the date at the top. We will not quietly start doing something this page says we do not do."),
    ] },
    { id: "controller", heading: "Who is responsible for your data", paragraphs: [
      p("[HIS: your name, or your company's name and number], of [HIS: the address for legal letters], decides how your data is used. Write to us from the [contact page](/contact)."),
    ] },
  ],
};

export const PRO_COOKIES: LegalDoc = {
  key: "cookies",
  title: "Cookies and browser storage",
  standfirst: "What gets stored in your browser, what each thing is for, and how to get rid of it.",
  updated: PRO_LEGAL_UPDATED,
  blocks: [
    { id: "why", heading: "Why this page is not called just cookies", paragraphs: [
      p("Most of what this site keeps in your browser is not a cookie. It is local storage, which stays on your device and is never sent with a request, so we never receive it."),
    ] },
    { id: "what", heading: "What we store, and why", paragraphs: [
      p("**Your saved pages, comparisons and watch list.** Local storage, kept so the site remembers what you were looking at. Never sent to us."),
      p("**Signing in.** If you sign in, Supabase sets a cookie that keeps you signed in and tells the site which plan you have. The site cannot open Pro for you without it, so it is strictly necessary and needs no consent. It is set only when you sign in."),
      p("**Paying.** Stripe runs the checkout on its own pages and sets what it needs there to take a payment securely and to detect fraud. Nothing of Stripe's is set on our pages."),
      p("**Counting visits.** Vercel Web Analytics counts page views without setting anything in your browser.", "web-analytics"),
      p("**Measuring speed.** Vercel Speed Insights measures how fast pages load for real visitors."),
    ] },
    { id: "not", heading: "What we do not do", paragraphs: [
      p("We do not run advertising, so there are no advertising cookies. We do not share identifiers with ad networks or data brokers, and nothing here follows you to other sites."),
    ] },
    { id: "remove", heading: "Getting rid of it", paragraphs: [
      p("Every browser can clear cookies and site data, usually under privacy or history settings, and doing so removes everything above. Your saved pages and watch list go with it, and we hold no copy to restore."),
    ] },
    { id: "plan", heading: "Your plan after clearing cookies", paragraphs: [
      p("Clearing cookies signs you out. Your plan stays with your account, so signing in again opens Pro."),
    ] },
  ],
};

export const PRO_LEGAL: readonly LegalDoc[] = [PRO_TERMS, PRO_PRIVACY, PRO_COOKIES];

/** The gaps he fills, in the order a document holds them. */
export function gapsIn(doc: LegalDoc): string[] {
  return doc.blocks.flatMap((b) => b.paragraphs.flatMap((x) => x.text.match(/\[HIS: [^\]]+\]/g) ?? []));
}

/** The drafts as one markdown file for him: each document, its date, its sections with their anchors, the switch a paragraph
 *  waits on, and the gaps listed first. */
export function toMarkdown(docs: readonly LegalDoc[]): string {
  const gaps = docs.flatMap((d) => gapsIn(d).map((g) => `- ${d.title}: ${g}`));
  const out = [
    "# The terms of Pro, cancelling and refunds, privacy and cookies: drafts for your approval",
    "",
    `Drafted ${PRO_LEGAL_UPDATED} (masterplan step 30) from src/lib/legal/pro_legal.ts, the one source the three legal pages draw from launch day, when the paywall's switch is on. Until then the live pages keep their current text. The law each part follows is in 2026-10-05-uk-subscription-law.md beside this file. Nothing here has been reviewed by a lawyer.`,
    "",
    "## The gaps only you can fill",
    "",
    ...gaps,
    "",
  ];
  for (const d of docs) {
    out.push(`# ${d.title}`, "", `_${d.standfirst}_`, "", `Last updated ${d.updated}.`, "");
    for (const b of d.blocks) {
      out.push(`## ${b.heading} {#${b.id}}`, "");
      for (const x of b.paragraphs) out.push(x.when === "web-analytics" ? `(Only while the cookie-free visit count is switched on.) ${x.text}` : x.text, "");
    }
  }
  return out.join("\n");
}
