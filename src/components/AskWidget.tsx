/**
 * AskWidget — inline /ask query box for the home page (Plan v8 Track S.5).
 *
 * Client component. Submits to /api/ask, renders the streamed answer
 * inline. Falls back to a prompt-to-ask CTA if the production /ask
 * route is in preview-stub mode.
 */

"use client";

import { useState } from "react";

const EXAMPLES = [
  "How much do restaurants earn in Berlin?",
  "What does a typical bakery in California earn?",
  "Compare hairdressers in Madrid vs Mexico City",
  "How much do legal services earn in Westminster?",
];

export function AskWidget() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(q: string) {
    if (!q.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const d = await r.json();
      if (d.error) {
        setError(d.error);
      } else {
        setAnswer(d.answer);
        setPreview(!!d.preview);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="my-12">
      <div className="rounded-2xl border border-parchment bg-white p-6 md:p-8">
        <div className="text-xs uppercase tracking-wider text-atlas-700 font-semibold">
          Ask Atlas
        </div>
        <h2 className="mt-1 text-2xl md:text-3xl font-semibold text-ink-900">
          Ask anything about small-business benchmarks
        </h2>
        <p className="mt-2 text-sm md:text-base text-ink-800/80 leading-relaxed max-w-3xl">
          Plain English question, real numbers back. Free for everyone: 10
          questions per IP per hour.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(question);
          }}
          className="mt-5 flex gap-2 flex-col sm:flex-row"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How much do cafés earn in Amsterdam?"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg border border-cream-400 focus:border-atlas-600 focus:ring-2 focus:ring-atlas-300 focus:outline-none text-sm text-ink-900 placeholder:text-ink-500/60 bg-cream-50"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-5 py-3 rounded-lg bg-atlas-600 hover:bg-atlas-700 disabled:bg-cream-300 disabled:text-ink-500 text-cream-50 text-sm font-semibold transition whitespace-nowrap"
          >
            {loading ? "Thinking..." : "Ask →"}
          </button>
        </form>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-ink-700/60">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQuestion(ex);
                submit(ex);
              }}
              disabled={loading}
              className="text-xs px-2 py-1 rounded-full bg-cream-100 hover:bg-atlas-100 hover:text-atlas-700 border border-cream-300 text-ink-700 transition disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-clay-100 border border-clay-300 p-3 text-sm text-clay-700">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-5 rounded-xl bg-cream-100 border border-cream-300 p-4 md:p-5">
            {preview && (
              <div className="text-[10px] uppercase tracking-wider text-clay-600 font-semibold mb-2">
                Preview mode
              </div>
            )}
            <div className="text-sm leading-relaxed text-ink-900 whitespace-pre-wrap">
              {answer}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
