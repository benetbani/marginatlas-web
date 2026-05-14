import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ask — natural-language question, returns cited answer.
 *
 * For v1.19 scaffold, returns a polite "preview" response without invoking
 * the model. When ready to flip on, replace with an Anthropic client call.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const question = body?.question?.trim?.();
    if (!question) {
      return NextResponse.json({ error: "missing question" }, { status: 400 });
    }

    // PREVIEW: return a polite stub response while we build the real query layer
    const stub = `"${question}"

This question would normally trigger a real-time SQL query against our cells_master_global table, with results synthesized into a plain-English answer with inline citations.

The full Ask Atlas feature is in development. Join the waitlist at the bottom of this page to be notified when it goes live (Pro plan).

In the meantime: every cell page on Margin Atlas already shows the typical revenue, employee count, and distribution for any country × industry × size combination — just navigate to the relevant page.`;

    return NextResponse.json({
      answer: stub,
      preview: true,
    });
  } catch (e) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
