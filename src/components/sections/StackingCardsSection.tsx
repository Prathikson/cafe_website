"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    num: "001",
    title: "Sourced with Care",
    body: "Long-term relationships with farmers across Ethiopia, Colombia, and Guatemala — paying above Fair Trade prices and visiting origin every year.",
    img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=85&auto=format&fit=crop",
    tag: "Origin",
    bg: "#EDE6D8",
    textColor: "#1A1A1A",
  },
  {
    num: "002",
    title: "Roasted Fresh",
    body: "Our in-house roastery runs twice a week. Beans rest 24–72 hours then enter their 2–4 week flavour peak. You always taste coffee at its absolute best.",
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=85&auto=format&fit=crop",
    tag: "Roastery",
    bg: "#D6CDB8",
    textColor: "#1A1A1A",
  },
  {
    num: "003",
    title: "Brewed with Precision",
    body: "Our baristas are trained obsessively. Every gram, every degree, every second of extraction is considered. Consistency is our craft.",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=85&auto=format&fit=crop",
    tag: "Craft",
    bg: "#12271D",
    textColor: "#E8E0C8",
  },
  {
    num: "004",
    title: "Served with Warmth",
    body: "A sanctuary — warm wood, natural light, unhurried service. We designed a space where time slows and mornings have room to breathe.",
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=85&auto=format&fit=crop",
    tag: "Space",
    bg: "#C8BFA8",
    textColor: "#1A1A1A",
  },
];

export function StackingCardsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Small scale-down on each card as the next one covers it
    const triggers: ScrollTrigger[] = [];

    cards.forEach((_, i) => {
      const card = document.querySelector<HTMLElement>(`.sc-card-${i}`);
      if (!card || i === cards.length - 1) return;

      const t = ScrollTrigger.create({
        trigger: `.sc-card-${i + 1}`,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate(self) {
          const s = 1 - self.progress * 0.04;
          card.style.transform = `scale(${s})`;
          card.style.transformOrigin = "top center";
        },
      });
      triggers.push(t);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} aria-label="Why choose Luminary">
      {/* Section label — sits above the sticky cards */}
      <div className="bg-sand-100 px-8 md:px-14 pt-20 pb-10">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-3">Why Luminary</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light tracking-[-0.025em] text-ink-900">
            The art of exceptional coffee
          </h2>
        </div>
      </div>

      {/* Each card is sticky — pure CSS, no GSAP position tricks */}
      {cards.map((card, i) => (
        <div
          key={card.num}
          className={`sc-card-${i} sticky rounded-2xl`}
          style={{
            top: `${60 + i * 12}px`,   // slight vertical offset so previous card peeks above
            zIndex: 10 + i,
            backgroundColor: card.bg,
          }}
        >
          {/* Full-width card, fixed comfortable height */}
          <div
            className="w-full grid grid-cols-1 md:grid-cols-2"
            style={{ minHeight: "min(88vh, 700px)" }}
          >
            {/* ── Left: Text ── */}
            <div
              className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-14 md:py-0"
              style={{ color: card.textColor }}
            >
              {/* Number */}
              <span
                className="block mb-6 text-[12px] tracking-[0.3em] opacity-40"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {card.num}
              </span>

              {/* Tag pill */}
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full border w-fit text-[11px] tracking-widest uppercase font-light mb-8"
                style={{
                  borderColor: `${card.textColor}22`,
                  color: `${card.textColor}70`,
                }}
              >
                {card.tag}
              </span>

              {/* Title */}
              <h3
                className="font-light tracking-[-0.025em] leading-[1.1] mb-7"
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  color: card.textColor,
                }}
              >
                {card.title}
              </h3>

              {/* Body — explicit color to ensure visibility on every card */}
              <p
                className="text-[15px] font-light leading-relaxed max-w-sm"
                style={{ color: card.textColor, opacity: 0.72 }}
              >
                {card.body}
              </p>

              {/* Progress dots */}
              <div className="flex items-center gap-2.5 mt-12">
                {cards.map((_, j) => (
                  <div
                    key={j}
                    style={{
                      height: "1px",
                      width: j === i ? "28px" : "8px",
                      backgroundColor:
                        j === i ? card.textColor : `${card.textColor}28`,
                      transition: "width 0.3s",
                    }}
                  />
                ))}
                <span
                  className="ml-1 text-[10px] opacity-35"
                  style={{
                    fontFamily: "DM Mono, monospace",
                    color: card.textColor,
                  }}
                >
                  {i + 1}/{cards.length}
                </span>
              </div>
            </div>

            {/* ── Right: Square image ── */}
            <div className="flex items-center justify-center px-8 md:px-12 lg:px-16 py-10 md:py-14">
              <div
                className="relative overflow-hidden rounded-2xl w-full"
                style={{ aspectRatio: "1 / 1", maxWidth: "480px" }}
              >
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 45vw"
                  priority={i === 0}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Spacer so next section starts after last sticky card */}
      <div
        aria-hidden
        style={{ height: `${cards.length * 12}px`, backgroundColor: cards[cards.length - 1].bg }}
      />
    </section>
  );
}
