/**
 * Welcome email template
 * ======================
 *
 * Rendered HTML for the email sent to a new Atlas newsletter subscriber.
 * Inline CSS, no external stylesheets, Georgia/Times fallback for the
 * display serif (custom fonts don't load reliably across email clients).
 * Compatible with Gmail, Outlook desktop + web, Apple Mail, mobile.
 *
 * Usage:
 *
 *   import { welcomeEmail } from "@/lib/email/welcome-template";
 *
 *   const html = welcomeEmail({
 *     unsubscribeUrl: "https://marginatlas.com/u/abc123",
 *     webviewUrl:     "https://marginatlas.com/email/welcome/abc123",
 *     starterCells:   [{ ... }, { ... }, { ... }],
 *   });
 */

export type WelcomeEmailStarterCell = {
  /** Display title, e.g. "Restaurants in Madrid". */
  title: string;
  /** One-line subtitle, e.g. "Typical revenue $387K · margin 12%". */
  subtitle: string;
  /** Absolute URL to the cell page. */
  href: string;
};

export type WelcomeEmailParams = {
  unsubscribeUrl: string;
  webviewUrl: string;
  starterCells?: WelcomeEmailStarterCell[];
  /** Override the company address line in the footer if you move offices. */
  companyAddress?: string;
};

const DEFAULT_STARTERS: WelcomeEmailStarterCell[] = [
  { title: "Restaurants in Madrid",       subtitle: "Typical revenue $387K · margin 12%",  href: "https://marginatlas.com/es/madrid/restaurants" },
  { title: "Software studios in Berlin",   subtitle: "Typical revenue $1.24M · margin 18%", href: "https://marginatlas.com/de/berlin/software-studios" },
  { title: "Salons in Nairobi",             subtitle: "Typical revenue $18K · margin 21%",   href: "https://marginatlas.com/ke/nairobi/salons" },
];

const DEFAULT_ADDRESS = "Margin Atlas · Calle Sagasta 18 · 28004 Madrid · Spain";

export function welcomeEmail({
  unsubscribeUrl,
  webviewUrl,
  starterCells = DEFAULT_STARTERS,
  companyAddress = DEFAULT_ADDRESS,
}: WelcomeEmailParams): string {
  const cellsHtml = starterCells
    .map(
      (c, i) => `
            <tr><td style="padding-bottom:${i < starterCells.length - 1 ? "10px" : "0"};"><a href="${escapeAttr(c.href)}" style="display:block;text-decoration:none;background:#FEFBF6;border:1px solid #E8DDC7;border-radius:8px;padding:14px 16px;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:600;color:#1A1A1A;">${escapeHtml(c.title)}</span><br /><span style="font-size:13px;color:#78350F;">${escapeHtml(c.subtitle)}</span>
            </a></td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1"/><title>You're on the list</title></head>
<body style="margin:0;padding:0;background:#F8F2E4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1A1A1A;-webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden but indexed by some clients) -->
  <div style="display:none;max-height:0;overflow:hidden;visibility:hidden;mso-hide:all;">
    Welcome to the Margin Atlas newsletter. One email on the first of every month, around 600 words.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F2E4;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FEFBF6;border:1px solid #E8DDC7;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:24px 28px 8px 28px;">
          <table role="presentation" width="100%"><tr>
            <td>
              <span style="display:inline-block;width:22px;height:22px;background:#9A3412;border-radius:5px;vertical-align:middle;"></span>
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:600;letter-spacing:-0.01em;color:#1A1A1A;margin-left:8px;vertical-align:middle;">Margin Atlas</span>
            </td>
            <td align="right">
              <span style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#78350F;font-weight:600;">Newsletter</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Headline -->
        <tr><td style="padding:20px 28px 0 28px;">
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.1;letter-spacing:-0.02em;font-weight:600;color:#1A1A1A;margin:0;">You're on the list.</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:14px 28px 4px 28px;">
          <p style="font-size:15px;line-height:1.6;color:#78350F;margin:0 0 14px 0;">Thanks for joining the Margin Atlas newsletter. We send one email on the first of every month. Around 600 words. One benchmark deep-dive plus three short data hits. That is the entire pattern.</p>
          <p style="font-size:15px;line-height:1.6;color:#78350F;margin:0;">If a month goes by where we have nothing worth interrupting you for, we skip it. We would rather miss a send than waste your attention.</p>
        </td></tr>

        <!-- Start here -->
        <tr><td style="padding:28px 28px 8px 28px;">
          <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;font-weight:600;color:#9A3412;margin:0 0 12px 0;">Start here</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cellsHtml}
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:28px 28px 24px 28px;">
          <p style="font-size:12px;line-height:1.5;color:#78350F;margin:0 0 6px 0;">${escapeHtml(companyAddress)}</p>
          <p style="font-size:12px;line-height:1.5;color:#78350F;margin:0;">
            <a href="${escapeAttr(unsubscribeUrl)}" style="color:#9A3412;text-decoration:underline;">Unsubscribe</a>
            ·
            <a href="${escapeAttr(webviewUrl)}" style="color:#9A3412;text-decoration:underline;">View in browser</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function escapeAttr(s: string): string {
  return escapeHtml(s);
}
