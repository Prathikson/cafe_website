import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Luminary Café",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-100 px-6">
      <div className="text-center">
        {/* SVG */}
        <div className="flex justify-center mb-8">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            className="opacity-20"
          >
            <circle cx="60" cy="60" r="59" stroke="#2C1810" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="40" stroke="#2C1810" strokeWidth="0.5" />
            <circle cx="60" cy="60" r="20" stroke="#2C1810" strokeWidth="0.5" />
            <line
              x1="60"
              y1="1"
              x2="60"
              y2="119"
              stroke="#2C1810"
              strokeWidth="0.5"
            />
            <line
              x1="1"
              y1="60"
              x2="119"
              y2="60"
              stroke="#2C1810"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <p
          className="font-display text-8xl font-light text-espresso-900/20 mb-6"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          404
        </p>

        <h1
          className="font-display text-3xl font-light text-espresso-900 mb-4"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          This cup is empty
        </h1>

        <p className="text-espresso-700/60 font-light mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for has wandered off. Let&apos;s get you
          back to something warm.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-espresso-900 text-cream-100 
                     text-sm tracking-widest uppercase font-light hover:bg-espresso-700 transition-colors"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}
