"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// Stagger variants for headline words
const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  }),
};

const headline = "Where Every Cup Tells a Story. Crafted with Love.".split(" ");

export function HeroSection() {
  const imgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // More subtle 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 100,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 100,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!imgRef.current) return;
    const tl = gsap.to(imgRef.current, {
      y: 50,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "60% top",
        scrub: true,
      },
    });
    return () => { tl.scrollTrigger?.kill(); };
  }, []);

  return (
    <section
      className="relative w-full pt-[80px] md:pt-[100px]"
      style={{
        backgroundColor: "#D4C9B8",
        minHeight: "100vh",
      }}
      aria-label="Hero"
    >
      <div className="w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1600px] mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 xl:gap-16 min-h-[calc(100vh-180px)] items-center py-8 md:py-12 lg:py-16">
            
            {/* ── Left: Big Headline ── */}
            <div className="lg:col-span-5 xl:col-span-6">
              <h1
                className="font-light tracking-tight leading-[0.9]"
                style={{
                  fontSize: "clamp(2.5rem, 5vw + 1rem, 7rem)",
                  color: "#1A1A1A",
                }}
              >
                {headline.map((word, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block mr-[0.12em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* ── Right: 3D Card with Parallax Image ── */}
            <div className="lg:col-span-7 xl:col-span-6">
              <div
                ref={imgRef}
                className="relative w-full"
                style={{
                  height: "clamp(350px, 60vh, 650px)",
                  perspective: "1500px",
                }}
              >
                <motion.div
                  ref={cardRef}
                  className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
                  }}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 25px 70px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {/* Parallax Image */}
                  <motion.div
                    className="relative w-full h-full"
                    style={{
                      transform: `translateY(${scrollY * 0.15}px) scale(1.1)`,
                    }}
                  >
                    <Image
                      src="/hero.jpg"
                      alt="Premium coffee drink"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
                    />
                  </motion.div>

                  {/* Glossy overlay effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.03) 100%)",
                      transform: `translateX(${mouseX.get() * 15}px) translateY(${mouseY.get() * 15}px)`,
                    }}
                  />
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Fun Scroll Indicator ── */}
      <motion.div
        className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        {/* Coffee Cup Icon */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-800"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" x2="6" y1="2" y2="4" />
            <line x1="10" x2="10" y1="2" y2="4" />
            <line x1="14" x2="14" y1="2" y2="4" />
          </svg>
        </motion.div>

        {/* Fun Text */}
        <motion.span
          className="text-sm md:text-base font-light tracking-wide text-gray-800"
          style={{
            fontStyle: "italic",
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Keep scrolling for more goodness ☕
        </motion.span>

        {/* Animated Arrow */}
        <motion.div
          className="flex flex-col gap-1"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}