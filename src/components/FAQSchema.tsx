/**
 * FAQPage JSON-LD for cell pages.
 *
 * Injects schema.org FAQPage markup with 5 common questions per cell.
 * Wins Google's People-Also-Ask and AI Overviews. The actual question
 * text matches the phrase universe (T-C.1), so any organic search for
 * "how much does a pharmacy make in California" surfaces this page.
 *
 * Renders a single <script type="application/ld+json"> tag — no visible
 * DOM. Safe to place anywhere in the page tree.
 */
type FAQ = { question: string; answer: string };

type Props = {
  faqs: FAQ[];
};

export function FAQSchema({ faqs }: Props) {
  if (!faqs || faqs.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
