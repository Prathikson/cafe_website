"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ABOUT_HERO_IMG = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80&auto=format&fit=crop";
const PLANT_IMG = "https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=800&q=80&auto=format&fit=crop";

const values = [
  { num: "01", title: "Direct Trade",    body: "Long-term relationships with farmers, paying above Fair Trade prices and visiting origin annually." },
  { num: "02", title: "Fresh Roasting",  body: "Our roastery runs Mondays and Thursdays. Coffee rests 24–72 hours, then serves a 2–4 week peak window." },
  { num: "03", title: "Reduce Waste",    body: "Compostable packaging, spent grounds go to local gardens, oat milk supplier runs on renewable energy." },
  { num: "04", title: "Community First", body: "10% of profits support local youth culinary programs. Free cupping events every first Sunday." },
];

const team = [
  { name: "Elena Voss",   role: "Head Roaster & Co-founder", bio: "Former Q Grader with 12 years in specialty coffee. Trained in Copenhagen and Melbourne." },
  { name: "Marcus Leigh", role: "Head Barista & Co-founder", bio: "UK Barista Champion finalist. Obsessed with extraction science and latte art." },
  { name: "Suki Park",    role: "Head of Food",              bio: "Pastry chef background, trained in Paris. Brings European technique to every bake." },
];

// Horizontal scroll gallery images
const galleryItems = [
  {
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80&auto=format&fit=crop",
    label: "The Roastery",
    year: "2020",
  },
  {
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=80&auto=format&fit=crop",
    label: "Origin Sourcing",
    year: "2018",
  },
  {
    img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&q=80&auto=format&fit=crop",
    label: "Farm Visits",
    year: "2022",
  },
  {
    img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&q=80&auto=format&fit=crop",
    label: "Community Days",
    year: "2023",
  },
  {
    img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=900&q=80&auto=format&fit=crop",
    label: "The Space",
    year: "2018",
  },
];

// ── Horizontal Scroll Section ──────────────────────────────────────────────
function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalWidth + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden" style={{ backgroundColor: "#0e1f17" }}>
      <div
        ref={trackRef}
        className="flex items-center gap-6 pl-12 md:pl-24"
        style={{ width: "max-content", paddingRight: "6rem", paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        {/* Intro card */}
        <div className="flex-shrink-0 w-[280px] md:w-[360px] mr-8">
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/30 mb-4">Our Journey</p>
          <h2 className="text-[clamp(2rem,3vw,3rem)] font-light text-white leading-tight tracking-[-0.02em]">
            Five years of moments that shaped us.
          </h2>
          <div className="mt-8 w-8 h-px bg-white/20" />
          <p className="mt-4 text-[12px] font-light text-white/40 tracking-widest uppercase">
            Scroll to explore →
          </p>
        </div>

        {/* Gallery cards */}
        {galleryItems.map((item, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 relative group"
            style={{ width: "clamp(280px, 30vw, 480px)", height: "clamp(280px, 30vw, 480px)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.05 }}
          >
            {/* Square image with rounded corners */}
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <Image
                src={item.img}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="480px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-1">{item.year}</p>
                <p className="text-[15px] font-light text-white">{item.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export function AboutPageClient() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Framer-motion parallax for hero text
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroScroll, [0, 1], [0, 80]);
  const heroImgY  = useTransform(heroScroll, [0, 1], [0, 120]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Plant image parallax
      gsap.to(".about-plant-img", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-plant-wrap",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Values stagger
      gsap.fromTo(".about-fade-el", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".about-values-section", start: "top 75%" },
      });

      // Team cards
      gsap.fromTo(".team-card", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".about-team-section", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} className="grid grid-cols-1 md:grid-cols-2 min-h-[90vh] overflow-hidden">
        {/* Text */}
        <motion.div
          style={{ y: heroTextY }}
          className="flex flex-col justify-center px-8 md:px-16 py-20 relative z-10"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-6"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,5vw,5rem)] font-light tracking-[-0.025em] text-ink-900 leading-tight mb-8"
          >
            Adaptable and Resilient like the Yucca Plant.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-[14px] font-light text-ink-500 leading-relaxed max-w-sm mb-6"
          >
            Packaging is universal, and we use it every day. No matter who or where we are, exceptional food is something we all appreciate.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-[13px] font-light text-ink-400 leading-relaxed max-w-sm"
          >
            To buy, preserve, and transport product that maintains its quality, appearance and taste, we need high-performance packaging. This is what we provide.
          </motion.p>
        </motion.div>

        {/* Parallax hero image — rounded square, not filling to edge */}
        <motion.div
          style={{ y: heroImgY }}
          className="relative flex items-center justify-center p-6 md:p-10"
        >
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{ aspectRatio: "1 / 1", maxHeight: "75vh" }}
          >
            <Image
              src={ABOUT_HERO_IMG}
              alt="Luminary Café interior"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Horizontal Gallery Scroll ────────────────────── */}
      <HorizontalGallery />

      {/* ── Timeline / Story ─────────────────────────────── */}
      <section className="px-6 md:px-10 py-20 md:py-28 bg-sand-200 border-t border-ink-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-5">Our Journey</p>
              <div className="space-y-0">
                {[
                  { year: "2016", title: "The Beginning",     text: "Elena and Marcus met at a cupping in Melbourne. Same obsessive goal: build a café where the coffee is truly extraordinary." },
                  { year: "2018", title: "Finding Our Space",  text: "After two years of pop-ups, we signed the lease on 42 Bloom Street. Six weeks renovation, then we opened our doors." },
                  { year: "2020", title: "The Roastery",      text: "We invested in a Giesen W6 roaster. Total control over flavor from farm to cup changed everything." },
                  { year: "2023", title: "Today",             text: "Suki joined as head of food. We now serve 300+ cups daily and visit origin farms in three countries every year." },
                ].map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.65 }}
                    className="flex gap-8 border-b border-ink-100 py-7 last:border-b-0"
                  >
                    <span className="text-[11px] font-mono text-ink-300 pt-1 flex-shrink-0 w-10">{m.year}</span>
                    <div>
                      <h3 className="text-[16px] font-light text-ink-900 mb-2">{m.title}</h3>
                      <p className="text-[13px] font-light text-ink-500 leading-relaxed">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Plant image with parallax — square + rounded */}
            <div className="about-plant-wrap relative overflow-hidden sticky top-24" style={{ aspectRatio: "1 / 1" }}>
              <div className="about-plant-img absolute inset-0 w-full rounded-2xl overflow-hidden" style={{ height: "125%" }}>
                <Image
                  src={PLANT_IMG}
                  alt="Yucca plant — strong and resilient"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 p-6 backdrop-blur-sm rounded-xl">
                    <svg width="50" height="50" viewBox="0 0 22 22" fill="none" className="text-white">
                      <path d="M11 2 L2 11 L7 11 L7 20 L15 20 L15 11 L20 11 Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────── */}
      <section className="about-values-section px-6 md:px-10 py-20 md:py-28 bg-sand-100 border-t border-ink-100">
        <div className="max-w-screen-xl mx-auto">
          <p className="about-fade-el text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-5">What We Stand For</p>
          <h2 className="about-fade-el text-[clamp(1.8rem,3vw,2.8rem)] font-light tracking-[-0.02em] text-ink-900 mb-14">Our values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-ink-100">
            {values.map((v) => (
              <motion.div
                key={v.num}
                className="about-fade-el px-0 lg:px-8 py-8 lg:py-0 first:lg:pl-0 last:lg:pr-0 group cursor-default"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-[11px] font-mono text-ink-300 block mb-4">{v.num}</span>
                <h3 className="text-[16px] font-light text-ink-900 mb-3 group-hover:text-ink-600 transition-colors">{v.title}</h3>
                <p className="text-[13px] font-light text-ink-500 leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────── */}
      <section className="about-team-section px-6 md:px-10 py-20 md:py-28 border-t border-ink-100" style={{ backgroundColor: "#12271D" }}>
        <div className="max-w-screen-xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/30 mb-5">The People</p>
          <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] font-light tracking-[-0.02em] text-white mb-14">Meet the team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {team.map((m) => (
              <motion.div
                key={m.name}
                className="team-card px-0 md:px-8 py-8 md:py-0 first:md:pl-0 last:md:pr-0"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Square rounded avatar */}
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-[20px] font-light text-white/60 mb-5">
                  {m.name[0]}
                </div>
                <h3 className="text-[16px] font-light text-white mb-1">{m.name}</h3>
                <p className="text-[11px] tracking-[0.15em] uppercase text-white/40 mb-4">{m.role}</p>
                <p className="text-[13px] font-light text-white/55 leading-relaxed">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}