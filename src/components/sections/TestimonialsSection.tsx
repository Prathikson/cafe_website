"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Luminary has completely changed my morning ritual. The pour over here is the best in the city — clean, nuanced, never bitter. I come here before everything.",
    author: "Sarah Mitchell",
    role: "Creative Director at Studio M",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=80&auto=format&fit=crop&crop=face",
  },
  {
    quote: "I come here to write every Saturday. The space is calm, the espresso is exceptional, and the almond croissant is — honestly — life-changing. It's my sanctuary.",
    author: "James Kerrigan",
    role: "Freelance Writer & Journalist",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face",
  },
  {
    quote: "As a food blogger I've been to hundreds of cafés. Luminary stands apart — not just the coffee, but the atmosphere, the intention behind every single thing they serve.",
    author: "Priya Lalwani",
    role: "Food Blogger & Stylist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop&crop=face",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".testimonial-section-inner", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const t = testimonials[active];

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-ink-900 overflow-hidden" aria-label="Testimonials">
      <div className="testimonial-section-inner max-w-screen-xl mx-auto px-6 md:px-10">
        <p className="text-[11px] tracking-[0.25em] uppercase text-sand-100/30 mb-12">Testimonial</p>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          {/* Left */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="relative w-24 h-28 rounded-2xl overflow-hidden">
                <Image src={t.avatar} alt={t.author} fill className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div key={`info-${active}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <p className="text-[14px] font-light text-sand-100">{t.author}</p>
                <p className="text-[12px] text-sand-100/40 mt-0.5">{t.role}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 mt-2">
              <button onClick={prev} aria-label="Previous" className="w-10 h-10 rounded-full border border-sand-100/20 flex items-center justify-center text-sand-100/60 hover:border-sand-100/60 hover:text-sand-100 transition-all">←</button>
              <button onClick={next} aria-label="Next" className="w-10 h-10 rounded-full border border-sand-100/20 flex items-center justify-center text-sand-100/60 hover:border-sand-100/60 hover:text-sand-100 transition-all">→</button>
            </div>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className="h-px transition-all duration-300" style={{ width: i === active ? "24px" : "8px", backgroundColor: i === active ? "#F5F0E8" : "rgba(245,240,232,0.2)" }} />
              ))}
            </div>
          </div>
          {/* Right big quote */}
          <div className="md:col-span-9">
            <AnimatePresence mode="wait">
              <motion.blockquote key={`quote-${active}`} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }} className="text-[clamp(1.4rem,3vw,2.6rem)] font-light text-sand-100 leading-tight tracking-[-0.02em]">
                &ldquo;{t.quote}&rdquo;
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
