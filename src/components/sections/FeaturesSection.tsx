"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    number: "01",
    title: "Certified Food Safety",
    description: "You can trust that your packaging will be 100% safe for food, designed for superior durability, and compliant with global standards.",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop",
    alt: "Coffee being carefully brewed",
  },
  {
    number: "02",
    title: "Sourced with Care",
    description: "We work directly with small farms across Ethiopia, Colombia, and Guatemala. Every bean is traceable, ethically traded and sustainably grown.",
    img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80&auto=format&fit=crop",
    alt: "Coffee beans sourced from origin",
  },
  {
    number: "03",
    title: "Brewed with Precision",
    description: "Our baristas are trained in the art of extraction — every gram, every degree, every second matters to your final cup.",
    img: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800&q=80&auto=format&fit=crop",
    alt: "Barista crafting espresso",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Each feature image parallaxes independently
      gsap.utils.toArray<HTMLElement>(".feature-img-inner").forEach((el) => {
        gsap.to(el, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest(".feature-img-wrap") as HTMLElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.fromTo(".feature-text-block", { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-sand-100" aria-label="Features">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <div className="mb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-3">Why Luminary</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light tracking-[-0.02em] text-ink-900 leading-tight max-w-lg">
            The art of exceptional coffee
          </h2>
        </div>

        <div className="space-y-0">
          {features.map((feat, i) => (
            <div
              key={feat.number}
              className={`feature-block grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-ink-100 py-0 ${i === features.length - 1 ? "border-b" : ""}`}
            >
              {/* Text */}
              <div className={`feature-text-block flex flex-col justify-center py-12 md:py-16 ${i % 2 === 1 ? "md:order-2 md:pl-16" : "md:pr-16"}`}>
                <span className="text-[11px] font-mono text-ink-300 mb-6 block">{feat.number}</span>
                <h3 className="text-[1.6rem] font-light tracking-[-0.02em] text-ink-900 mb-4 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-[14px] font-light text-ink-500 leading-relaxed max-w-sm">
                  {feat.description}
                </p>
              </div>

              {/* Image with parallax */}
              <div className={`feature-img-wrap relative h-72 md:h-[440px] overflow-hidden ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="feature-img-inner absolute inset-0 w-full" style={{ height: "130%" }}>
                  <Image
                    src={feat.img}
                    alt={feat.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
