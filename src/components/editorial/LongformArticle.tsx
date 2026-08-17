/**
 * LongformArticle
 * ===============
 *
 * On-brand long-form editorial template, re-skinned from the design export's
 * "Decade article" layout into Atlas tokens (cream / ink / amber / parchment,
 * Newsreader display + Inter sans). Gives blog posts real editorial typography:
 * a deck, hairline byline, drop cap, CSS-numbered section headings, blockquote
 * rule, figure captions, and a related-reading footer.
 *
 * The post body arrives as a trusted HTML string (already sanitized upstream in
 * lib/blog) and is injected into `.lf-body`, so the styles use descendant
 * selectors rather than direct-child selectors. Newsletter capture is NOT built
 * in here: the site already mounts a global FooterNewsletterBar, so a second one
 * would duplicate.
 *
 * No em-dashes anywhere (gate-scanned). Accent is Atlas amber, matching the
 * existing cell-page narrative drop cap and EditorialNote rule, so the blog
 * reads as the same publication.
 */
import * as React from "react";

export interface LongformRelated {
  slug: string;
  title: string;
  subtitle?: string;
}

export interface LongformArticleProps {
  seriesLabel?: string;
  title: string;
  deck?: string;
  publishDate: string;
  author: string;
  readMinutes: number;
  cover?: React.ReactNode;
  coverCaption?: string;
  bodyHtml: string;
  related?: LongformRelated[];
}

/**
 * A PRIVATE PAPER THEME THAT BOTH GATES WERE BLIND TO, corrected 2026-08-17.
 *
 * These six values are injected as a raw <style> string on the live
 * /blog/[slug] route, and they were a complete parallel palette: three creams
 * (#FEF9F0, #FBF8F2, #F4EAD5), a brown (#5A3A1A), a warm near-black and the
 * accent. verify_no_cream counts cream TOKEN references and these were raw
 * hex, so it could not see them. verify_palette_membership judges by hue and
 * returns legal above 93% lightness, so it passed the three creams and caught
 * only the brown and the line. The one surface printing the site's long-form
 * writing was therefore printing it on cream the founder banned outright,
 * with two gates green.
 *
 * Pointed at the real tokens rather than retoned by hand, so this stops being
 * a palette at all and starts being a reference. Each mapping is the nearest
 * EXISTING role, not a new value: the article ground becomes the canonical card
 * surface, the soft step the page ground, the ink and cocoa the ladder steps
 * they were already imitating (#1A1410 is ink-900 within a hair, #5A3A1A is
 * cocoa-700 within a hair), and the rule the neutral hairline every other
 * border on the site uses. --lf-accent was already atlas-700 and is unchanged.
 */
const LF_CSS = `
.lf {
  --lf-paper: var(--atlas-surface-card);
  --lf-soft: var(--atlas-surface-paper);
  --lf-ink: var(--ink-900);
  --lf-cocoa: var(--cocoa-700);
  --lf-accent: var(--accent-text);
  --lf-line: rgb(var(--border));
  background: var(--lf-paper);
  color: var(--lf-ink);
  font-family: var(--font-sans), Inter, system-ui, sans-serif;
}
.lf-shell { max-width: 720px; margin: 0 auto; padding: 40px 0 72px; }
.lf-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--lf-accent);
}
.lf-title {
  font-family: var(--font-display), Newsreader, Georgia, serif;
  font-weight: 500; font-size: 40px; line-height: 1.06;
  margin: 14px 0 0; color: var(--lf-ink); text-wrap: balance;
}
@media (min-width: 768px) { .lf-title { font-size: 52px; } }
.lf-deck {
  font-family: var(--font-display), Newsreader, Georgia, serif;
  font-style: italic; font-weight: 400; font-size: 20px; line-height: 1.4;
  margin: 18px 0 28px; color: var(--lf-cocoa); max-width: 32em; text-wrap: pretty;
}
.lf-rule { height: 1px; background: var(--lf-line); border: 0; margin: 0; }
.lf-byline {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 14px; color: var(--lf-cocoa); padding: 14px 0; gap: 16px; flex-wrap: wrap;
}
.lf-byline .lf-mark { color: var(--lf-accent); margin-right: 6px; }
.lf-byline-meta { font-variant-numeric: tabular-nums; }
.lf-cover { margin: 24px 0 0; }
.lf-cover-frame { width: 100%; max-height: 60vh; overflow: hidden; border-radius: 10px; background: var(--lf-soft); }
.lf-cover-frame > * { display: block; max-width: 100%; height: auto; }
.lf-cover-caption { font-size: 14px; line-height: 1.5; color: var(--lf-cocoa); margin: 10px 0 0; }
.lf-body { counter-reset: section; margin-top: 36px; }
.lf-body p {
  font-size: 18px; line-height: 1.7; color: var(--lf-ink); margin: 1.2em 0; text-wrap: pretty;
}
.lf-body > p:first-of-type::first-letter {
  font-family: var(--font-display), Newsreader, Georgia, serif;
  font-weight: 500; font-size: 4.4em; line-height: 0.9; float: left;
  margin: 0.04em 0.12em 0 0; color: var(--lf-accent); text-transform: uppercase;
}
.lf-body h2 {
  counter-increment: section;
  font-family: var(--font-display), Newsreader, Georgia, serif;
  font-weight: 500; font-size: 26px; line-height: 1.2; color: var(--lf-ink);
  margin: 52px 0 14px; padding-top: 26px; border-top: 1px solid var(--lf-line);
}
.lf-body h2::before {
  content: counter(section, decimal-leading-zero) ".";
  display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
  color: var(--lf-accent); margin-bottom: 10px;
}
.lf-body h3 {
  font-family: var(--font-display), Newsreader, Georgia, serif;
  font-weight: 500; font-size: 20px; line-height: 1.25; margin: 32px 0 10px; color: var(--lf-ink);
}
.lf-body blockquote {
  font-family: var(--font-display), Newsreader, Georgia, serif;
  font-style: italic; font-weight: 400; font-size: 22px; line-height: 1.45;
  color: var(--lf-cocoa); border-left: 3px solid var(--lf-accent);
  padding: 4px 0 4px 24px; margin: 40px 0; text-wrap: pretty;
}
.lf-body blockquote p { margin: 0; }
.lf-body figure { margin: 40px 0; text-align: center; }
.lf-body figure img, .lf-body figure svg, .lf-body figure picture {
  max-width: 100%; height: auto; margin: 0 auto; display: block; border-radius: 8px;
}
.lf-body figure figcaption {
  font-size: 14px; line-height: 1.55; color: var(--lf-cocoa);
  margin: 12px auto 0; max-width: 36em; text-wrap: pretty;
}
.lf-body ul, .lf-body ol { font-size: 18px; line-height: 1.7; color: var(--lf-ink); padding-left: 1.4em; margin: 1.2em 0; }
.lf-body li { margin: 0.4em 0; }
.lf-body a {
  color: var(--lf-ink); text-decoration: underline; text-decoration-color: var(--lf-line);
  text-underline-offset: 3px; text-decoration-thickness: 1px; transition: text-decoration-color 150ms ease;
}
.lf-body a:hover { text-decoration-color: var(--lf-accent); }
.lf-body strong { font-weight: 600; }
.lf-footer { margin-top: 72px; padding-top: 32px; border-top: 1px solid var(--lf-line); }
.lf-related-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--lf-cocoa); }
.lf-related-list { list-style: none; padding: 0; margin: 16px 0 0; }
.lf-related-list li + li { border-top: 1px solid var(--lf-line); }
.lf-related-link { display: flex; align-items: baseline; gap: 16px; padding: 18px 0; color: inherit; text-decoration: none; }
.lf-related-link:hover .lf-related-title { color: var(--lf-accent); }
.lf-related-mark { font-size: 11px; font-weight: 600; letter-spacing: 0.18em; color: var(--lf-accent); flex-shrink: 0; width: 44px; }
.lf-related-title {
  font-family: var(--font-display), Newsreader, Georgia, serif;
  font-weight: 500; font-size: 20px; line-height: 1.25; color: var(--lf-ink); transition: color 150ms ease;
}
.lf-related-sub { font-size: 14px; color: var(--lf-cocoa); margin-top: 4px; }
`;

export default function LongformArticle({
  seriesLabel = "Margin Atlas",
  title,
  deck,
  publishDate,
  author,
  readMinutes,
  cover,
  coverCaption,
  bodyHtml,
  related,
}: LongformArticleProps) {
  return (
    <article className="lf">
      <style dangerouslySetInnerHTML={{ __html: LF_CSS }} />
      <div className="lf-shell">
        <header>
          <div className="lf-eyebrow">{seriesLabel.toUpperCase()}</div>
          {/* typography-ok: longform uses scoped lf-* type via the style island, not the global token scale */}
          <h1 className="lf-title" data-typography="custom">{title}</h1>
          {deck && <p className="lf-deck">{deck}</p>}
          <hr className="lf-rule" />
          <div className="lf-byline">
            <span>
              <span className="lf-mark" aria-hidden="true">&bull;</span>
              {author}
            </span>
            <span className="lf-byline-meta">
              {publishDate} &middot; {readMinutes} min read
            </span>
          </div>
          <hr className="lf-rule" />
        </header>

        {cover && (
          <div className="lf-cover">
            <div className="lf-cover-frame">{cover}</div>
            {coverCaption && <p className="lf-cover-caption">{coverCaption}</p>}
          </div>
        )}

        <div className="lf-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {related && related.length > 0 && (
          <footer className="lf-footer">
            <div className="lf-related-eyebrow">Read more</div>
            <ul className="lf-related-list">
              {related.map((r, i) => (
                <li key={r.slug}>
                  <a href={`/blog/${r.slug}`} className="lf-related-link">
                    <span className="lf-related-mark">{String(i + 1).padStart(2, "0")}.</span>
                    <span>
                      <span className="lf-related-title">{r.title}</span>
                      {r.subtitle && <div className="lf-related-sub">{r.subtitle}</div>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </div>
    </article>
  );
}
