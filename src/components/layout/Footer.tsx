"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home",    href: "/" },
  { label: "Menu",    href: "/menu" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
];

const policyLinks = [
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy",   href: "/cookies" },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sand-100 overflow-hidden">

      {/* ── Top: Big headline + scroll-to-top ── */}
      <div className="px-6 md:px-10 pt-20 border-t border-ink-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-start justify-between mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,6vw,5.5rem)] font-light tracking-[-0.025em] text-ink-900 leading-[0.95] max-w-3xl"
            >
              Innovated for<br />Industry Leaders.
            </motion.h2>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-11 h-11 border border-ink-200 rounded-xl flex items-center justify-center hover:border-ink-900 hover:bg-ink-900 hover:text-sand-100 transition-all duration-300 text-ink-500 flex-shrink-0 mt-2 text-[13px]"
              aria-label="Scroll to top"
            >
              ↑
            </button>
          </div>

          {/* ── Mid: Logo mark + Nav links + CTA ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-ink-100">

            {/* Logo mark */}
            <div className="md:col-span-4 flex flex-col justify-between gap-8">
<div className="flex flex-col gap-6">
  <Image
    src="/logo.svg"
    alt="Luminary Café Logo"
    width={80}
    height={80}
    className="h-14 w-auto opacity-90"
  />

  <p className="text-[13px] font-light text-ink-400 leading-relaxed max-w-[220px]">
    A sanctuary for specialty coffee, artisan pastries, and slow mornings.
  </p>
</div>
            </div>

            {/* Nav links */}
            <div className="md:col-span-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-ink-300 mb-5">Navigate</p>
              <ul className="space-y-3">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      className="text-[14px] font-light text-ink-600 hover:text-ink-900 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-4 h-px bg-ink-300 group-hover:w-6 group-hover:bg-ink-900 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Policy links */}
            <div className="md:col-span-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-ink-300 mb-5">Legal</p>
              <ul className="space-y-3">
                {policyLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      className="text-[13px] font-light text-ink-400 hover:text-ink-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-ink-300 mb-5">Get in touch</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[13px] font-light text-ink-700 hover:text-ink-900 transition-colors group"
                >
                  <span>hello@luminary.co</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">↗</span>
                </Link>
              </div>
              {/* Social icons */}
              <div className="flex gap-3 mt-8 md:mt-0">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 border border-ink-200 rounded-lg flex items-center justify-center text-ink-400 hover:border-ink-900 hover:text-ink-900 transition-all duration-200"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="px-6 md:px-10 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-light text-ink-400 flex items-center gap-1.5">
            <span className="text-[10px] border border-ink-300 rounded-full w-4 h-4 flex items-center justify-center">
              C
            </span>
            Luminary {year}. All Rights Reserved.
          </span>
          <span className="text-[11px] font-light text-ink-300 tracking-wide">
            Designed with care. Built for industry.
          </span>
        </div>
      </div>
    </footer>
  );
}