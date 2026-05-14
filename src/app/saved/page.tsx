import { SavedClient } from "./SavedClient";

export const metadata = {
  title: "Saved cells | Margin Atlas",
};

export default function SavedPage() {
  return (
    <div>
      <header className="py-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Saved cells
        </h1>
        <p className="mt-3 text-lg text-ink-800/80 max-w-2xl leading-relaxed">
          Your starred cells live in this browser. Free tier saves up to 5.
        </p>
      </header>
      <SavedClient />
    </div>
  );
}
