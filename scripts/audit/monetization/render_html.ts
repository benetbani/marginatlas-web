/**
 * render_html — produce coverage/monetization-coverage.html.
 *
 * Single static page that shows the per-page upgrade matrix as a
 * colour-coded grid. The founder reviews this before sign-off
 * (v34 Part 7.3).
 *
 * Colours mirror status:
 *   GREEN   = ✓ (passes)
 *   RED     = ✗ (hard fail)
 *   PENDING = · (not yet wired, fine during Phase 0Q)
 */

import { CoverageReport, ALL_GATES, GateName } from "./types";

const GATE_LABEL: Record<GateName, string> = {
  A_lock_primitives: "A. Locks",
  B_trust_copy: "B. Trust",
  C_no_orphan_locks: "C. No orphans",
  D_no_leaked_values: "D. No leakage",
  E_four_thing_reveal: "E. 4-thing reveal",
};

function badge(status: string): string {
  if (status === "GREEN")
    return `<span style="color:#0a7a0a;font-weight:bold">&#10003;</span>`;
  if (status === "RED")
    return `<span style="color:#b00020;font-weight:bold">&#10007;</span>`;
  return `<span style="color:#888">&middot;</span>`;
}

export function renderHtml(report: CoverageReport): string {
  const headerCells = ALL_GATES.map(
    (g) => `<th style="padding:8px 12px;text-align:center">${GATE_LABEL[g]}</th>`,
  ).join("");

  const rows = report.pages
    .map((p) => {
      const cells = ALL_GATES.map((g) => {
        const r = p.gates[g];
        return `<td title="${r.message}" style="padding:8px 12px;text-align:center">${badge(r.status)}</td>`;
      }).join("");
      return `<tr>
        <td style="padding:8px 12px;font-family:monospace">${p.pagePattern}</td>
        ${cells}
      </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Margin Atlas - monetization coverage (v34)</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 32px; max-width: 980px; margin: 0 auto; }
  h1 { font-weight: 600; letter-spacing: -0.02em; }
  table { border-collapse: collapse; width: 100%; margin-top: 24px; }
  th { background: #f5f0e6; text-align: left; padding: 8px 12px; border-bottom: 1px solid #ccc; }
  td { border-bottom: 1px solid #eee; }
  .totals { margin-top: 16px; color: #666; font-size: 14px; }
  .legend { margin-top: 24px; font-size: 13px; color: #555; }
</style>
</head>
<body>
  <h1>Monetization coverage &middot; plan ${report.planVersion}</h1>
  <p style="color:#666">Generated ${report.generatedAt}</p>
  <p class="totals">
    Green: <b>${report.totals.green}</b> &nbsp;
    Red: <b style="color:#b00020">${report.totals.red}</b> &nbsp;
    Pending: <b style="color:#888">${report.totals.pending}</b>
  </p>
  <table>
    <thead><tr><th>Page pattern</th>${headerCells}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="legend">
    Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md, Part 5.4.<br>
    GREEN = gate passes &nbsp; RED = hard fail (build blocked) &nbsp; PENDING = not yet wired (Phase 0Q stub)
  </p>
</body>
</html>`;
}
