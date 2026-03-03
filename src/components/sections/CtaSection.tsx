"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".cta-parallax-img", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(".cta-text-el", { opacity: 0, y: 35 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      {/* ── Custom Solutions / Dark Green Block ── */}
      <section
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ backgroundColor: "#12271D" }}
        aria-label="Custom solutions"
      >
        {/* Full-bleed grid — no max-width constraint so image reaches the edge */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">

          {/* Left: Text — padded generously */}
          <div className="flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 py-16 md:py-24">
            <p className="cta-text-el text-[11px] tracking-[0.25em] uppercase text-white/40 mb-6">
              Custom Solutions
            </p>
            <h2 className="cta-text-el text-[clamp(2rem,3.5vw,3.5rem)] font-light tracking-[-0.025em] text-white leading-tight mb-8">
              Brands that thrive invest in custom-designed packaging. Let us help bring your vision to life.
            </h2>

            {/* Scrolling ticker */}
            <div className="cta-text-el border-t border-b border-white/10 py-4 overflow-hidden mb-8">
              <motion.div
                className="flex gap-10 whitespace-nowrap"
                animate={{ x: [0, "-50%"] }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="text-[12px] tracking-[0.15em] uppercase text-white/50 font-light flex items-center gap-10">
                    Not sure what&apos;s possible? Get in touch to find out.
                    <span className="text-white/20">↗</span>
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="cta-text-el flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-white text-[11px] tracking-widest uppercase font-light hover:bg-sand-100 transition-colors"
                style={{ color: "#12271D" }}
              >
                Get in Touch <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right: Image — absolutely fills its grid cell edge to edge */}
          <div className="relative overflow-hidden" style={{ minHeight: "50vw" }}>
            <div
              className="cta-parallax-img absolute inset-0 w-full"
              style={{ height: "130%", top: "-15%" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80&auto=format&fit=crop"
                alt="Custom coffee packaging solutions"
                fill
                className="object-cover opacity-70"
                sizes="50vw"
              />
              {/* Subtle dark gradient on left edge to blend into green */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to right, #12271D 0%, transparent 18%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter / final CTA ── */}
      <section className="py-16 md:py-24 bg-sand-200 border-t border-ink-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[clamp(1.6rem,3vw,2.8rem)] font-light tracking-[-0.02em] text-ink-900 mb-3">
                Get early access to<br /><em className="not-italic">seasonal menus</em>
              </h2>
              <p className="text-[14px] font-light text-ink-500">
                Be the first to know about new single origins, seasonal specials, and coffee events.
              </p>
            </div>
            <div>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-5 py-3.5 bg-white border border-ink-100 border-r-0 text-[13px] font-light text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-ink-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-ink-900 text-sand-100 text-[11px] tracking-widest uppercase font-light hover:bg-ink-700 transition-colors flex-shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[15px] font-light text-ink-700"
                >
                  ✓ You&apos;re on the list — we&apos;ll be in touch soon.
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}