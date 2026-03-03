"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function ContactPageClient() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[65vh] border-b border-ink-100">
        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-5">Visit Us</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
            className="text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-0.025em] text-ink-900 leading-tight mb-8">
            Come find us
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="space-y-6">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-ink-400 mb-2">Address</p>
              <address className="not-italic text-[14px] font-light text-ink-600 leading-relaxed">
                42 Bloom Street, San Francisco, CA 94102
              </address>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-ink-400 mb-2">Hours</p>
              <div className="text-[14px] font-light text-ink-600 space-y-1">
                <div className="flex gap-6"><span>Mon – Fri</span><span className="text-ink-900">7:00am – 6:00pm</span></div>
                <div className="flex gap-6"><span>Sat – Sun</span><span className="text-ink-900">8:00am – 5:00pm</span></div>
              </div>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-ink-400 mb-2">Contact</p>
              <div className="text-[14px] font-light text-ink-600 space-y-1">
                <p><a href="tel:+15551234567" className="hover:text-ink-900 transition-colors">+1 (555) 123-4567</a></p>
                <p><a href="mailto:hello@luminarycafe.com" className="hover:text-ink-900 transition-colors">hello@luminarycafe.com</a></p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map image */}
        <div className="relative overflow-hidden h-[50vw] md:h-auto bg-sand-200">
          <Image
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&q=80&auto=format&fit=crop"
            alt="Luminary Café location"
            fill
            className="object-cover opacity-70"
            sizes="50vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white px-6 py-4 shadow-lg">
              <p className="text-[11px] tracking-[0.2em] uppercase text-ink-400 mb-1">42 Bloom Street</p>
              <p className="text-[14px] font-light text-ink-900">Luminary Café</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact form — dark green ── */}
      <section className="px-6 md:px-10 py-16 md:py-24" style={{ backgroundColor: "#12271D" }}>
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-white/30 mb-5">Get in Touch</p>
            <h2 className="text-[clamp(1.8rem,3vw,3rem)] font-light tracking-[-0.02em] text-white mb-5">
              We&apos;d love to hear from you
            </h2>
            <p className="text-[14px] font-light text-white/50 leading-relaxed">
              Wholesale inquiries, private events, media requests, or just want to say hi — we respond to everything within 24 hours.
            </p>
          </div>
          <div>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {[{ id: "name", label: "Your Name", type: "text" }, { id: "email", label: "Email", type: "email" }].map(f => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-[11px] tracking-[0.2em] uppercase text-white/40 mb-2">{f.label}</label>
                    <input id={f.id} type={f.type} required
                      value={formData[f.id as keyof typeof formData]}
                      onChange={e => setFormData(p => ({ ...p, [f.id]: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white text-[13px] font-light placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block text-[11px] tracking-[0.2em] uppercase text-white/40 mb-2">Message</label>
                  <textarea id="message" rows={4} required
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white text-[13px] font-light placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors resize-none"
                  />
                </div>
                <button type="submit"
                  className="w-full px-6 py-3.5 bg-white text-[11px] tracking-widest uppercase font-light hover:bg-sand-100 transition-colors"
                  style={{ color: "#12271D" }}
                >
                  Send Message →
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="py-12">
                <p className="text-[14px] font-light text-white/70">✓ Message sent — we&apos;ll be in touch within 24 hours.</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
