"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    label: "The Space",
    title: "Adaptable and Resilient like the Yucca Plant.",
    body: "Packaging is universal, and we use it every day. No matter who or where we are, exceptional food is something we all appreciate.",
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&q=80&auto=format&fit=crop",
    alt: "Café interior — warm and welcoming",
    side: "right",
  },
  {
    label: "Certified Food Safety",
    title: "You can trust that your packaging will be 100% safe.",
    body: "Designed for superior durability, and compliant with global standards. Every product is tested and certified.",
    img: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=900&q=80&auto=format&fit=crop",
    alt: "Food served in sustainable packaging",
    side: "left",
  },
];

export function AtmosphereSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".atm-parallax").forEach((el) => {
        gsap.to(el, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest(".atm-wrap") as HTMLElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.fromTo(
        ".atm-text",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-sand-100" aria-label="Our atmosphere">
      {panels.map((panel, i) => (
        <div
          key={panel.label}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 ${
            i > 0 ? "border-t border-ink-100" : ""
          }`}
        >
          {/* Text side */}
          <div
            className={`flex flex-col justify-center ${
              panel.side === "right" ? "md:order-1" : "md:order-2"
            }`}
          >
            <p className="atm-text text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-5">
              {panel.label}
            </p>
            <h2 className="atm-text text-[clamp(1.8rem,3.2vw,2.8rem)] font-light tracking-[-0.02em] text-ink-900 leading-snug mb-6 max-w-sm">
              {panel.title}
            </h2>
            <p className="atm-text text-[14px] font-light text-ink-500 leading-relaxed max-w-xs">
              {panel.body}
            </p>
            {i === 0 && (
              <div className="atm-text mt-8">
                <svg
                  width="20"
                  height="32"
                  viewBox="0 0 20 32"
                  fill="none"
                  className="text-ink-400"
                >
                  <line
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="24"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <path
                    d="M4 20 L10 28 L16 20"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Image side — parallax only, no 3D tilt */}
          <div
            className={`atm-wrap relative ${
              panel.side === "right" ? "md:order-2" : "md:order-1"
            }`}
            style={{ height: "clamp(350px, 60vh, 600px)" }}
          >
            <motion.div
              className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Parallax image — driven solely by GSAP ScrollTrigger */}
              <div
                className="atm-parallax absolute inset-0 w-full"
                style={{ height: "120%", top: "-10%" }}
              >
                <Image
                  src={panel.img}
                  alt={panel.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Subtle overlay for depth */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.03) 100%)",
                }}
              />
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}