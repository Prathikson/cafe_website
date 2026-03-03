"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sand-100 overflow-hidden">
      {/* Big headline section — Yucca footer style */}
      <div className="px-6 md:px-10 pt-20 pb-0 border-t border-ink-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-start justify-between mb-16">
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-light tracking-[-0.025em] text-ink-900 leading-[0.95] max-w-3xl">
              Innovated for<br />Industry Leaders.
            </h2>
            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-12 h-12 border border-ink-200 rounded-lg flex items-center justify-center hover:border-ink-900 hover:bg-ink-900 hover:text-sand-100 transition-all duration-300 text-ink-600 flex-shrink-0 mt-2"
              aria-label="Scroll to top"
            >
              ↑
            </button>
          </div>

          {/* Big Yucca-style logo mark + category cards */}
          <div className="grid grid-cols-12 gap-4 items-end pb-12">
            {/* Logo mark */}
            <div className="col-span-12 md:col-span-4">
              <svg width="160" height="170" viewBox="0 0 160 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-ink-900">
                {/* Luminary cup mark — large */}
                <path d="M80 10 L20 70 L50 70 L50 160 L110 160 L110 70 L140 70 Z" fill="currentColor" opacity="0.08" />
                <path d="M80 10 L20 70 L50 70 L50 160 L110 160 L110 70 L140 70 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="80" cy="160" r="4" fill="currentColor" opacity="0.4" />
              </svg>
            </div>

            {/* Category cards — like Yucca footer */}
            <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-3">
              {["Food Service", "Food Processing", "Agriculture"].map((cat) => (
                <Link
                  key={cat}
                  href="/menu"
                  className="border border-ink-200 rounded-2xl px-5 py-10 text-center text-[14px] font-light text-ink-700 hover:bg-ink-900 hover:text-sand-100 hover:border-ink-900 transition-all duration-500 group"
                >
                  <span className="group-hover:scale-105 inline-block transition-transform duration-300">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — Yucca style */}
      <div className="border-t border-ink-100 px-6 md:px-10 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-light text-ink-400 flex items-center gap-1.5">
              <span className="text-[10px] border border-ink-300 rounded-full w-4 h-4 flex items-center justify-center text-ink-400">C</span>
              Luminary {year}. All Rights Reserved
            </span>
            {/* Social icons */}
            <div className="flex gap-3 ml-2">
              {[
                { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "LinkedIn", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="text-ink-400 hover:text-ink-900 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex gap-5">
            {["Contact Us", "Privacy Policy", "Terms & Conditions"].map((item) => (
              <a key={item} href="#" className="text-[11px] font-light text-ink-400 hover:text-ink-700 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
