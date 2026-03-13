"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
type MapProvider = "apple" | "google" | "openstreet";
type FaqItem = { q: string; a: string };

// ─── Constants ────────────────────────────────────────────────────────────────
const LAT = 53.4675;
const LNG = -113.5091;
const ADDRESS = "2225 111 St NW, Edmonton, AB T6J 4T9";
const PLACE_QUERY = encodeURIComponent("Luminary Café Edmonton South Common");

const MAP_URLS: Record<MapProvider, string> = {
  apple:       `https://maps.apple.com/?ll=${LAT},${LNG}&q=${PLACE_QUERY}&z=16`,
  google:      `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`,
  openstreet:  `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=17/${LAT}/${LNG}`,
};

const EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - 0.008},${LAT - 0.005},${LNG + 0.008},${LAT + 0.005}&layer=mapnik&marker=${LAT},${LNG}`;

const FAQS: FaqItem[] = [
  { q: "Do you offer wholesale or bulk orders?", a: "Yes — we work with local offices, restaurants, and event planners. Reach out via the form and mention 'wholesale' in your message for priority routing." },
  { q: "Can I book the café for a private event?", a: "Absolutely. We host intimate gatherings, brand activations, and coffee workshops. Capacity is up to 45 guests. We'll help you craft a bespoke menu." },
  { q: "How quickly do you respond to messages?", a: "Within 24 hours on weekdays. For urgent matters, give us a call — we pick up during café hours." },
  { q: "Do you have parking nearby?", a: "South Common has ample free surface parking directly outside. We're also a 5-minute walk from Century Park LRT." },
  { q: "Are your beans available to purchase?", a: "Yes — we carry rotating single-origin bags in-store and ship within Canada. Ask our baristas or check the menu page." },
  { q: "Do you cater to dietary needs?", a: "We offer oat, almond, soy, and coconut milk alternatives. Most pastries have gluten-free or vegan options — our staff knows every ingredient by heart." },
];

const PAYMENT_METHODS = [
  { id: "apple-pay",   label: "Apple Pay",    color: "#000",    textColor: "#fff",   icon: "apple" },
  { id: "google-pay",  label: "Google Pay",   color: "#fff",    textColor: "#3C4043", icon: "google" },
  { id: "samsung-pay", label: "Samsung Pay",  color: "#1428A0", textColor: "#fff",   icon: "samsung" },
  { id: "visa",        label: "Visa",         color: "#1A1F71", textColor: "#fff",   icon: "visa" },
  { id: "mastercard",  label: "Mastercard",   color: "#EB001B", textColor: "#fff",   icon: "mastercard" },
  { id: "amex",        label: "Amex",         color: "#007BC1", textColor: "#fff",   icon: "amex" },
  { id: "interac",     label: "Interac",      color: "#FFD100", textColor: "#000",   icon: "interac" },
];

// ─── Coffee Mini-Game ─────────────────────────────────────────────────────────
function CoffeeMiniGame() {
  const [shots, setShots] = useState(0);
  const [milk, setMilk] = useState(0);
  const [poured, setPoured] = useState(false);
  const [drink, setDrink] = useState<string | null>(null);
  const [steam, setSteam] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getDrink = (s: number, m: number): string => {
    if (s === 0 && m === 0) return "Nothing yet!";
    if (s >= 2 && m === 0) return "Long Black ☕";
    if (s === 1 && m === 0) return "Espresso ⚡";
    if (s === 1 && m >= 3) return "Latte 🥛";
    if (s === 2 && m >= 3) return "Double Latte 💪";
    if (s === 1 && m === 2) return "Flat White 🤍";
    if (s === 2 && m === 2) return "Cortado 🎯";
    if (s === 1 && m === 1) return "Piccolo ✨";
    if (s === 0 && m >= 2) return "Steamed Milk 🍼";
    return "Mystery Blend 🌀";
  };

  const pour = () => {
    if (poured) return;
    setPoured(true);
    setSteam(true);
    const name = getDrink(shots, milk);
    setDrink(name);
    setTimeout(() => setSteam(false), 3000);
  };

  const reset = () => {
    setShots(0); setMilk(0); setPoured(false); setDrink(null); setSteam(false);
  };

  const fillLevel = Math.min(100, shots * 20 + milk * 15);
  const liquidColor = shots > milk
    ? `rgba(${40 + shots * 10}, ${20 + shots * 5}, ${10}, 0.9)`
    : `rgba(${200 + milk * 8}, ${180 + milk * 5}, ${150}, 0.85)`;

  return (
    <div className="relative">
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1">Mini Barista Lab</p>
        <p className="text-[13px] font-light text-white/60 leading-relaxed">
          Build your perfect cup while you wait for our reply.
        </p>
      </div>

      {/* Cup visual */}
      <div className="flex justify-center mb-6">
        <div className="relative" style={{ width: 100, height: 120 }}>
          {/* Steam */}
          {steam && (
            <div className="absolute left-1/2 -top-8 -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-0.5 rounded-full bg-white/30"
                  style={{ height: 24, animation: `steamPuff 1.5s ease-in-out ${i * 0.4}s infinite` }} />
              ))}
            </div>
          )}

          <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
            <defs>
              <clipPath id="cup-clip">
                <path d="M12 22 L18 100 Q50 112 82 100 L88 22 Z" />
              </clipPath>
            </defs>
            {/* Cup body */}
            <path d="M12 22 L18 100 Q50 112 82 100 L88 22 Z"
              fill="#1a0f07" stroke="#E8E0C8" strokeWidth="1.5" />
            {/* Liquid fill */}
            {fillLevel > 0 && (
              <rect
                x="12" y={22 + (78 * (100 - fillLevel) / 100)} width="76" height={78 * fillLevel / 100}
                fill={liquidColor} clipPath="url(#cup-clip)"
                style={{ transition: "all 0.5s ease" }}
              />
            )}
            {/* Rim */}
            <ellipse cx="50" cy="22" rx="38" ry="9"
              fill="#1a0f07" stroke="#E8E0C8" strokeWidth="1.5" />
            {/* Handle */}
            <path d="M88 40 Q106 40 106 60 Q106 80 88 80"
              stroke="#E8E0C8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Saucer */}
            <ellipse cx="50" cy="108" rx="46" ry="8"
              fill="#120a04" stroke="#E8E0C8" strokeWidth="1" strokeOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4">
        {/* Espresso shots */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] tracking-[0.15em] uppercase text-white/40">Espresso Shots</span>
          <div className="flex items-center gap-2">
            <button onClick={() => !poured && setShots(Math.max(0, shots - 1))}
              className="w-7 h-7 rounded-full border border-white/15 text-white/50 hover:border-white/40 hover:text-white transition-all text-sm flex items-center justify-center">−</button>
            <span className="w-5 text-center text-[13px] text-white font-light tabular-nums">{shots}</span>
            <button onClick={() => !poured && setShots(Math.min(4, shots + 1))}
              className="w-7 h-7 rounded-full border border-white/15 text-white/50 hover:border-white/40 hover:text-white transition-all text-sm flex items-center justify-center">+</button>
          </div>
        </div>
        {/* Milk */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] tracking-[0.15em] uppercase text-white/40">Milk Parts</span>
          <div className="flex items-center gap-2">
            <button onClick={() => !poured && setMilk(Math.max(0, milk - 1))}
              className="w-7 h-7 rounded-full border border-white/15 text-white/50 hover:border-white/40 hover:text-white transition-all text-sm flex items-center justify-center">−</button>
            <span className="w-5 text-center text-[13px] text-white font-light tabular-nums">{milk}</span>
            <button onClick={() => !poured && setMilk(Math.min(5, milk + 1))}
              className="w-7 h-7 rounded-full border border-white/15 text-white/50 hover:border-white/40 hover:text-white transition-all text-sm flex items-center justify-center">+</button>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex gap-2">
        <button onClick={pour} disabled={poured || (shots === 0 && milk === 0)}
          className="flex-1 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-all border"
          style={{
            borderColor: poured ? "rgba(255,255,255,0.1)" : "rgba(232,224,200,0.4)",
            color: poured ? "rgba(255,255,255,0.2)" : "#E8E0C8",
            cursor: poured ? "not-allowed" : "pointer",
          }}>
          {poured ? "Served ✓" : "Pour & Serve →"}
        </button>
        <button onClick={reset}
          className="px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase text-white/30 border border-white/10 hover:border-white/20 hover:text-white/50 transition-all">
          Reset
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {drink && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 px-4 py-3 border border-white/10 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-0.5">You made</p>
            <p className="text-[15px] font-light text-white">{drink}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes steamPuff {
          0%   { transform: scaleX(1) translateY(0);   opacity: 0; }
          30%  { opacity: 0.6; }
          100% { transform: scaleX(1.5) translateY(-20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-6 md:px-10 py-20 md:py-28" style={{ backgroundColor: "#FAF7F2" }}>
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
              className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: "#8A7E72" }}>
              Frequently Asked
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-light leading-tight mb-6"
              style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", color: "#12271D", letterSpacing: "-0.025em" }}>
              Questions<br />we love<br />answering.
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
              className="text-[13px] font-light leading-relaxed" style={{ color: "#6B6258" }}>
              Still curious? The form above is always open. We write back personally — no bots here.
            </motion.p>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y" style={{ borderColor: "#E8E0D0" }}>
              {FAQS.map((faq, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6 }}>
                  <button onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-5 text-left group">
                    <span className="text-[15px] font-light leading-snug transition-colors"
                      style={{ color: open === i ? "#12271D" : "#3D3530" }}>
                      {faq.q}
                    </span>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mt-0.5 transition-all"
                      style={{
                        borderColor: open === i ? "#12271D" : "#C8C0B8",
                        color: open === i ? "#12271D" : "#C8C0B8",
                        transform: open === i ? "rotate(45deg)" : "rotate(0)",
                      }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <line x1="4" y1="0" x2="4" y2="8" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="0" y1="4" x2="8" y2="4" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden">
                        <p className="pb-5 text-[13px] font-light leading-relaxed" style={{ color: "#6B6258" }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Payment Methods ──────────────────────────────────────────────────────────
function PaymentSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleTap = (id: string) => {
    setTapped(id);
    setTimeout(() => setTapped(null), 1200);
  };

  const PaymentIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case "apple": return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      );
      case "google": return (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      );
      case "visa": return (
        <svg viewBox="0 0 48 48" className="w-8 h-5" fill="none">
          <text x="4" y="34" fontSize="22" fontWeight="700" fill="white" fontFamily="Arial">VISA</text>
        </svg>
      );
      case "mastercard": return (
        <svg viewBox="0 0 38 24" className="w-8 h-5" fill="none">
          <circle cx="15" cy="12" r="10" fill="#EB001B" />
          <circle cx="23" cy="12" r="10" fill="#F79E1B" />
          <path d="M19 5.4a10 10 0 0 1 0 13.2A10 10 0 0 1 19 5.4z" fill="#FF5F00"/>
        </svg>
      );
      case "amex": return (
        <svg viewBox="0 0 48 24" className="w-10 h-5" fill="none">
          <text x="2" y="18" fontSize="12" fontWeight="700" fill="white" fontFamily="Arial">AMEX</text>
        </svg>
      );
      case "interac": return (
        <svg viewBox="0 0 48 24" className="w-10 h-5" fill="none">
          <text x="2" y="18" fontSize="10" fontWeight="700" fill="black" fontFamily="Arial">INTERAC</text>
        </svg>
      );
      case "samsung": return (
        <svg viewBox="0 0 48 20" className="w-10 h-5" fill="none">
          <text x="1" y="15" fontSize="9" fontWeight="600" fill="white" fontFamily="Arial">SAMSUNG</text>
        </svg>
      );
      default: return null;
    }
  };

  return (
    <section ref={ref} className="px-6 md:px-10 py-16 md:py-24 border-t" style={{ backgroundColor: "#D4C9B8", borderColor: "#E8E0D0" }}>
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            className="text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: "#8A7E72" }}>
            Accepted Everywhere
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="font-light" style={{ fontSize: "clamp(1.8rem,3vw,3rem)", color: "#12271D", letterSpacing: "-0.02em" }}>
            Pay your way.
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
            className="text-[13px] font-light mt-3 max-w-md mx-auto" style={{ color: "#6B6258" }}>
            Tap, swipe, or wave — whatever feels most natural. We just want you to get your coffee.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {PAYMENT_METHODS.map((method, i) => {
            const isHovered = hovered === method.id;
            const isTapped = tapped === method.id;

            return (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.05 + i * 0.07, duration: 0.5, type: "spring", stiffness: 200 }}
                onHoverStart={() => setHovered(method.id)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => handleTap(method.id)}
                whileTap={{ scale: 0.93 }}
                className="relative flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-sm transition-shadow cursor-pointer overflow-hidden"
                style={{
                  backgroundColor: method.color,
                  border: method.id === "google-pay" ? "1px solid #E0E0E0" : "none",
                  minWidth: 140,
                  boxShadow: isHovered
                    ? `0 8px 30px ${method.color}55, 0 2px 8px rgba(0,0,0,0.08)`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {/* Tap ripple */}
                <AnimatePresence>
                  {isTapped && (
                    <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.div className="absolute rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                        initial={{ width: 0, height: 0 }}
                        animate={{ width: 200, height: 200 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <span style={{ color: method.textColor }} className="flex-shrink-0">
                  <PaymentIcon icon={method.icon} />
                </span>
                <span className="text-[12px] font-medium tracking-wide whitespace-nowrap"
                  style={{ color: method.textColor }}>
                  {method.label}
                </span>

                {/* Contactless wave */}
                {isHovered && ["apple-pay", "google-pay", "samsung-pay"].includes(method.id) && (
                  <motion.div className="absolute right-3 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7 Q4 4 4 7 Q4 10 2 7" stroke={method.textColor} strokeWidth="1.2" strokeOpacity="0.7" fill="none"/>
                      <path d="M5 7 Q8 3 8 7 Q8 11 5 7" stroke={method.textColor} strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
                      <path d="M9 7 Q12 2 12 7 Q12 12 9 7" stroke={method.textColor} strokeWidth="1.2" strokeOpacity="0.3" fill="none"/>
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
          className="text-center text-[11px] mt-8 tracking-wide" style={{ color: "#B0A898" }}>
          All transactions secured · Cash always welcome too
        </motion.p>
      </div>
    </section>
  );
}

// ─── Map Section ──────────────────────────────────────────────────────────────
function MapSection() {
  const [provider, setProvider] = useState<MapProvider>("openstreet");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const openMap = (p: MapProvider) => {
    window.open(MAP_URLS[p], "_blank", "noopener,noreferrer");
  };

  return (
    <section ref={ref} className="px-6 md:px-10 py-16 md:py-24" style={{ backgroundColor: "#12271D" }}>
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-10">
          <div className="lg:col-span-5">
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              className="text-[10px] tracking-[0.28em] uppercase text-white/30 mb-4">Find Us</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="font-light text-white leading-tight mb-5"
              style={{ fontSize: "clamp(1.8rem,3vw,3.2rem)", letterSpacing: "-0.02em" }}>
              South Common,<br />Edmonton.
            </motion.h2>
            <motion.address initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
              className="not-italic text-[13px] font-light text-white/50 mb-8 leading-relaxed">
              {ADDRESS}<br />
              <span className="text-white/30 text-[11px]">Near Century Park LRT · Free parking on-site</span>
            </motion.address>

            {/* Map provider toggles */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-3">Open in Maps</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { id: "apple" as MapProvider, label: "Apple Maps", icon: "🍎" },
                  { id: "google" as MapProvider, label: "Google Maps", icon: "📍" },
                  { id: "openstreet" as MapProvider, label: "OpenStreetMap", icon: "🗺" },
                ] as const).map((opt) => (
                  <button key={opt.id} onClick={() => openMap(opt.id)}
                    className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.12em] uppercase font-light border transition-all hover:scale-105 active:scale-95"
                    style={{
                      borderColor: "rgba(232,224,200,0.2)",
                      color: "rgba(232,224,200,0.7)",
                      backgroundColor: "rgba(232,224,200,0.04)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,224,200,0.5)";
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(232,224,200,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#E8E0C8";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,224,200,0.2)";
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(232,224,200,0.04)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,224,200,0.7)";
                    }}>
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                    <span className="opacity-40">↗</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hours quick ref */}
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
              className="border-t border-white/10 pt-5 space-y-2">
              {[
                { days: "Mon – Fri", hours: "7:00 am – 6:00 pm" },
                { days: "Saturday",  hours: "8:00 am – 5:00 pm" },
                { days: "Sunday",    hours: "8:00 am – 4:00 pm" },
              ].map((row) => (
                <div key={row.days} className="flex justify-between text-[12px] font-light">
                  <span className="text-white/35">{row.days}</span>
                  <span className="text-white/70">{row.hours}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Embedded map */}
          <motion.div className="lg:col-span-7" initial={{ opacity: 0, scale: 0.98 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="relative overflow-hidden" style={{ height: 400, border: "1px solid rgba(232,224,200,0.1)" }}>
              <iframe
                src={EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(0.85) hue-rotate(180deg) saturate(0.6)" }}
                title="Luminary Café location — South Common, Edmonton"
                loading="lazy"
              />
              {/* Pin overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -100%)" }}>
                  <div className="bg-[#E8E0C8] text-[#12271D] px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase font-light shadow-lg whitespace-nowrap">
                    Luminary Café ☕
                  </div>
                  <div className="w-0.5 h-4 bg-[#E8E0C8] mx-auto" />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-white/20 mt-2 tracking-wide">
              Map data © OpenStreetMap contributors · South Common, Edmonton AB
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const ref        = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Mouse tilt (same spring config as home page)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 100, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2));
    mouseY.set((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2));
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Scroll parallax
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP scroll-scrub on the image wrapper (mirrors home page)
  useEffect(() => {
    if (!imgWrapRef.current) return;
    const tl = gsap.to(imgWrapRef.current, {
      y: 50, ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "60% top", scrub: true },
    });
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  // GSAP text entrance
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-word",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.06, duration: 1.1, ease: "power4.out", delay: 0.1 });
      gsap.fromTo(".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.85, ease: "power3.out" });
      gsap.fromTo(".hero-meta",
        { opacity: 0 },
        { opacity: 1, stagger: 0.12, duration: 0.8, delay: 1.1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  const lines = [
    { words: ["Every", "great"],   italic: false },
    { words: ["conversation"],     italic: false },
    { words: ["starts", "with"],   italic: true  },
    { words: ["a", "cup."],        italic: false },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full pt-[80px] md:pt-[100px] overflow-hidden"
      style={{ backgroundColor: "#D4C9B8", minHeight: "100vh" }}
      aria-label="Contact Hero"
    >
      {/* Subtle radial texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 15% 85%, rgba(18,39,29,0.04) 0%, transparent 55%),
                          radial-gradient(circle at 85% 15%, rgba(107,63,30,0.05) 0%, transparent 55%)`,
      }} />

      {/* Top-left label */}
      <div className="hero-meta absolute top-[90px] left-6 md:left-10 flex items-center gap-3 opacity-0 z-10">
        <div className="w-px h-7" style={{ backgroundColor: "#C8C0B8" }} />
        <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: "#8A7E72" }}>Contact Us</p>
      </div>

      {/* Top-right location pill */}
      <div className="hero-meta absolute top-[90px] right-6 md:right-10 text-right opacity-0 z-10">
        <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: "#8A7E72" }}>South Common</p>
        <p className="text-[10px] tracking-[0.2em] uppercase mt-0.5"  style={{ color: "#B0A898" }}>Edmonton, AB</p>
      </div>

      {/* ── Two-column grid ── */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center
                          py-8 md:py-12 lg:py-16 lg:min-h-[calc(100vh-220px)]">

            {/* ── Left: Headline + sub-copy ── */}
            <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-center">
              {/* Staggered word reveal */}
              <div className="mb-10 relative z-10">
                {lines.map((line, li) => (
                  <div key={li} className="overflow-hidden">
                    <div className="flex flex-wrap" style={{ gap: "0 0.22em" }}>
                      {line.words.map((word, wi) => (
                        <span
                          key={wi}
                          className="hero-word inline-block opacity-0"
                          style={{
                            fontSize: "clamp(2.6rem, 5.5vw + 0.5rem, 7.5rem)",
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontWeight: 300,
                            fontStyle: line.italic ? "italic" : "normal",
                            color: "#12271D",
                            letterSpacing: "-0.025em",
                            lineHeight: 1.0,
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-copy 3-col */}
              <div className="hero-sub opacity-0 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 max-w-2xl">
                {[
                  { label: "We reply personally", body: "Every message is read by a human — no bots, no scripts." },
                  { label: "Within 24 hours",     body: "You'll hear back by morning, coffee in hand." },
                  { label: "Open daily",          body: "Or skip the inbox — we're here 7 days a week." },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] tracking-[0.22em] uppercase mb-1.5" style={{ color: "#8A7E72" }}>
                      {item.label}
                    </p>
                    <p className="text-[12px] font-light leading-relaxed" style={{ color: "#6B6258" }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: 3D tilt + parallax image card ── */}
            <div className="lg:col-span-7 xl:col-span-6">
              <div
                ref={imgWrapRef}
                className="relative w-full"
                style={{ height: "clamp(300px, 52vh, 660px)", perspective: "1500px" }}
              >
                <motion.div
                  ref={cardRef}
                  className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
                  }}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  whileHover={{ scale: 1.01, boxShadow: "0 28px 72px rgba(0,0,0,0.14)" }}
                >
                  {/* Parallax image */}
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transform: `translateY(${scrollY * 0.15}px) scale(1.12)` }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=85&auto=format&fit=crop"
                      alt="Luminary Café — warm interior, South Common Edmonton"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                    />
                  </motion.div>

                  {/* Gloss sheen */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.04) 100%)",
                    }}
                  />

                  {/* Floating info chip */}
                  <motion.div
                    className="absolute bottom-5 left-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.7 }}
                  >
                    <div
                      className="px-4 py-2.5 backdrop-blur-md"
                      style={{ backgroundColor: "rgba(18,39,29,0.75)", border: "1px solid rgba(232,224,200,0.15)" }}
                    >
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-0.5" style={{ color: "rgba(232,224,200,0.5)" }}>
                        Come visit
                      </p>
                      <p className="text-[12px] font-light" style={{ color: "#E8E0C8" }}>
                        South Common · Edmonton, AB
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ── Scroll indicator — mobile flows, desktop absolute ── */}
          <motion.div
            className="flex flex-col items-center gap-3 pb-10 pt-2 lg:hidden"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <HeroScrollCue />
          </motion.div>
        </div>
      </div>

      {/* Desktop scroll cue pinned to bottom */}
      <motion.div
        className="hidden lg:flex flex-col items-center gap-3 absolute bottom-10 xl:bottom-14 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <HeroScrollCue />
      </motion.div>
    </section>
  );
}

function HeroScrollCue() {
  return (
    <>
      <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" x2="6" y1="2" y2="4" />
          <line x1="10" x2="10" y1="2" y2="4" />
          <line x1="14" x2="14" y1="2" y2="4" />
        </svg>
      </motion.div>
      <motion.span
        className="text-sm font-light tracking-wide italic whitespace-nowrap text-gray-700"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Keep scrolling for more goodness ☕
      </motion.span>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
          <polyline points="7 13 12 18 17 13" />
          <polyline points="7 6 12 11 17 6" />
        </svg>
      </motion.div>
    </>
  );
}

// ─── Contact Form + Game ──────────────────────────────────────────────────────
function ContactFormSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const fields = [
    { id: "name",    label: "Your Name",    type: "text",  placeholder: "e.g. Alex Chen" },
    { id: "email",   label: "Email",        type: "email", placeholder: "you@example.com" },
    { id: "subject", label: "What's this about?", type: "text", placeholder: "Wholesale · Events · Just saying hi" },
  ];

  return (
    <section ref={ref} className="px-6 md:px-10 py-16 md:py-24" style={{ backgroundColor: "#12271D" }}>
      <div className="max-w-screen-xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.28em] uppercase text-white/30 mb-3">Get in Touch</p>
          <h2 className="font-light text-white leading-tight"
            style={{ fontSize: "clamp(2rem,4vw,4rem)", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.02em" }}>
            Say something.<br />
            <span className="italic text-white/50">We&apos;re listening.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Form */}
          <div className="lg:col-span-7">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {fields.slice(0, 2).map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id}
                        className="block text-[10px] tracking-[0.22em] uppercase mb-2 transition-colors"
                        style={{ color: focused === f.id ? "rgba(232,224,200,0.7)" : "rgba(255,255,255,0.3)" }}>
                        {f.label}
                      </label>
                      <input id={f.id} type={f.type} required placeholder={f.placeholder}
                        value={formData[f.id as keyof typeof formData]}
                        onFocus={() => setFocused(f.id)}
                        onBlur={() => setFocused(null)}
                        onChange={(e) => setFormData((p) => ({ ...p, [f.id]: e.target.value }))}
                        className="w-full px-0 py-3 bg-transparent border-b text-white text-[14px] font-light placeholder:text-white/15 focus:outline-none transition-all"
                        style={{ borderColor: focused === f.id ? "rgba(232,224,200,0.6)" : "rgba(255,255,255,0.12)" }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="subject"
                    className="block text-[10px] tracking-[0.22em] uppercase mb-2 transition-colors"
                    style={{ color: focused === "subject" ? "rgba(232,224,200,0.7)" : "rgba(255,255,255,0.3)" }}>
                    {fields[2].label}
                  </label>
                  <input id="subject" type="text" placeholder={fields[2].placeholder}
                    value={formData.subject}
                    onFocus={() => setFocused("subject")}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                    className="w-full px-0 py-3 bg-transparent border-b text-white text-[14px] font-light placeholder:text-white/15 focus:outline-none transition-all"
                    style={{ borderColor: focused === "subject" ? "rgba(232,224,200,0.6)" : "rgba(255,255,255,0.12)" }}
                  />
                </div>

                <div>
                  <label htmlFor="message"
                    className="block text-[10px] tracking-[0.22em] uppercase mb-2 transition-colors"
                    style={{ color: focused === "message" ? "rgba(232,224,200,0.7)" : "rgba(255,255,255,0.3)" }}>
                    Your Message
                  </label>
                  <textarea id="message" rows={5} required placeholder="Tell us what's on your mind…"
                    value={formData.message}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-0 py-3 bg-transparent border-b text-white text-[14px] font-light placeholder:text-white/15 focus:outline-none transition-all resize-none"
                    style={{ borderColor: focused === "message" ? "rgba(232,224,200,0.6)" : "rgba(255,255,255,0.12)" }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] font-light text-white/25">We reply within 24 hours, personally.</p>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-7 py-3.5 text-[11px] tracking-[0.2em] uppercase font-light transition-colors"
                    style={{ backgroundColor: "#E8E0C8", color: "#12271D" }}>
                    Send it →
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-16">
                <div className="text-[4rem] mb-6">☕</div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3">Message received</p>
                <p className="text-[1.4rem] font-light text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  We&apos;ll be in touch before your next cup gets cold.
                </p>
                <p className="text-[13px] font-light text-white/40">
                  Usually within 24 hours — check your inbox.
                </p>
              </motion.div>
            )}
          </div>

          {/* Coffee Game */}
          <div className="lg:col-span-5">
            <div className="border border-white/10 p-6 md:p-8">
              <CoffeeMiniGame />
            </div>

            {/* Info pills */}
            <div className="mt-6 space-y-3">
              {[
                { icon: "📞", label: "+1 (780) 555-0198", sub: "Call us during café hours" },
                { icon: "✉️", label: "hello@luminarycafe.com", sub: "For everything else" },
                { icon: "📍", label: "South Common · Edmonton", sub: ADDRESS },
              ].map((info) => (
                <div key={info.label} className="flex items-start gap-3 py-2 border-b border-white/5">
                  <span className="text-base mt-0.5">{info.icon}</span>
                  <div>
                    <p className="text-[13px] font-light text-white/70">{info.label}</p>
                    <p className="text-[11px] text-white/30">{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────
export function ContactPageClient() {
  return (
    <div>
      <HeroSection />
      <ContactFormSection />
      <FAQSection />
      <PaymentSection />
      <MapSection />
    </div>
  );
}