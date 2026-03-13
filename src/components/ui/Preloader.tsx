"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const MIN_DURATION_MS = 5000;

// ─── Interactive Coffee Cup ───────────────────────────────────────────────────
function InteractiveCup({ count }: { count: number }) {
  const cupRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Tilt from mouse
  const tiltX = useSpring(useTransform(mouseY, [-1, 1], [14, -14]), {
    stiffness: 110,
    damping: 18,
  });
  const tiltY = useSpring(useTransform(mouseX, [-1, 1], [-14, 14]), {
    stiffness: 110,
    damping: 18,
  });

  // Liquid slosh
  const liquidSkewX = useSpring(useTransform(mouseX, [-1, 1], [-7, 7]), {
    stiffness: 70,
    damping: 22,
  });

  // Liquid fill level (0–1)
  const fillSpring = useSpring(count / 100, { stiffness: 35, damping: 18 });

  // SVG coords: rim at y=28, bottom interior ~y=108
  const interiorHeight = 80;
  const rimY = 28;
  const fillY = useTransform(
    fillSpring,
    [0, 1],
    [rimY + interiorHeight, rimY]
  );
  const fillH = useTransform(fillSpring, [0, 1], [0, interiorHeight]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cupRef.current) return;
      const r = cupRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - r.left - r.width / 2) / (r.width / 2));
      mouseY.set((e.clientY - r.top - r.height / 2) / (r.height / 2));
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const hasFoam = count > 18;
  const haslatte = count >= 55;

  return (
    <motion.div
      ref={cupRef}
      className="relative"
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformStyle: "preserve-3d",
        perspective: 600,
        cursor: "crosshair",
        width: 130,
        height: 150,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <svg
        width="130"
        height="150"
        viewBox="0 0 130 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          <linearGradient id="lq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5230" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#4A2210" stopOpacity="1" />
            <stop offset="100%" stopColor="#200D04" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,210,140,0)" />
            <stop offset="50%" stopColor="rgba(255,210,140,0.14)" />
            <stop offset="100%" stopColor="rgba(255,210,140,0)" />
          </linearGradient>
          <linearGradient id="gloss" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(232,224,200,0.22)" />
            <stop offset="55%" stopColor="rgba(232,224,200,0.06)" />
            <stop offset="100%" stopColor="rgba(232,224,200,0)" />
          </linearGradient>
          <linearGradient id="saucer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2C1A0C" />
            <stop offset="100%" stopColor="#160A03" />
          </linearGradient>
          <radialGradient id="foam" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#DEC99A" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#A07A46" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#7A5530" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5230" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5230" stopOpacity="0" />
          </radialGradient>
          <clipPath id="interior">
            <path d="M26 28 L32 112 Q65 126 98 112 L104 28 Z" />
          </clipPath>
          <filter id="gl" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softgl" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow beneath */}
        <motion.ellipse
          cx="65" cy="132" rx="38" ry="6"
          fill="url(#glow2)"
          animate={{ opacity: [0.5, 0.9, 0.5], ry: [5, 8, 5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Saucer */}
        <motion.ellipse
          cx="65" cy="124" rx="52" ry="10"
          fill="url(#saucer)"
          stroke="#E8E0C8" strokeWidth="0.7" strokeOpacity="0.2"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
        />
        <motion.ellipse
          cx="65" cy="124" rx="36" ry="6"
          fill="none" stroke="#E8E0C8" strokeWidth="0.5" strokeOpacity="0.1"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        />

        {/* Cup body dark fill */}
        <motion.path
          d="M26 28 L32 112 Q65 126 98 112 L104 28 Z"
          fill="#180C05"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        />

        {/* Liquid fill (clipped) */}
        <g clipPath="url(#interior)">
          {/* Main liquid body */}
          <motion.rect
            x="20" width="94" height="110"
            fill="url(#lq)"
            style={{ y: fillY, height: fillH, skewX: liquidSkewX } as never}
          />

          {/* Shimmer sweep across liquid */}
          <motion.rect
            x="20" width="94" height="110"
            fill="url(#shimmer)"
            style={{ y: fillY, height: fillH } as never}
            animate={{ x: [-30, 110, -30] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Foam layer */}
          <AnimatePresence>
            {hasFoam && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.ellipse
                  cx="65" rx="30" ry="5"
                  fill="url(#foam)"
                  style={{ cy: fillY } as never}
                />
                {/* Foam bubbles */}
                {[38, 50, 60, 70, 82, 56, 44, 76].map((cx, i) => (
                  <motion.circle
                    key={i}
                    cx={cx}
                    r={1.5 + (i % 3) * 0.8}
                    fill={i % 2 === 0 ? "#C8A870" : "#DEC99A"}
                    fillOpacity="0.55"
                    style={{ cy: fillY } as never}
                    animate={{
                      cy: [`${26 + (100 - count) * 0.76}`, `${24 + (100 - count) * 0.76}`],
                    }}
                    transition={{
                      duration: 1.4 + i * 0.25,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Latte art (appears at 55%+) */}
          <AnimatePresence>
            {haslatte && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0 }}
              >
                <motion.path
                  d="M48 33 Q65 27 82 33"
                  stroke="#D4A96A" strokeWidth="1.5" fill="none" strokeLinecap="round"
                  style={{ y: fillY } as never}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                />
                <motion.path
                  d="M54 36 Q65 31 76 36"
                  stroke="#C49A5A" strokeWidth="1" fill="none" strokeLinecap="round"
                  style={{ y: fillY } as never}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.35, ease: "easeInOut" }}
                />
                <motion.path
                  d="M58 39 Q65 35 72 39"
                  stroke="#B48A4A" strokeWidth="0.8" fill="none" strokeLinecap="round"
                  style={{ y: fillY } as never}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.6, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="65" r="4"
                  fill="none" stroke="#C49A5A" strokeWidth="0.8"
                  strokeOpacity="0.6"
                  style={{ cy: fillY } as never}
                  animate={{ cy: [`${22 + (100 - count) * 0.76}`, `${22 + (100 - count) * 0.76}`] }}
                  initial={{ pathLength: 0, scale: 0 }}
                  whileInView={{ pathLength: 1, scale: 1 }}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Surface glint */}
          <motion.ellipse
            cx="65" rx="28" ry="3.5"
            fill="rgba(255,200,100,0.07)"
            style={{ cy: fillY } as never}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>

        {/* Cup outline */}
        <motion.path
          d="M26 28 L32 112 Q65 126 98 112 L104 28 Z"
          stroke="#E8E0C8" strokeWidth="1.8"
          fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          filter="url(#gl)"
        />

        {/* Rim ellipse */}
        <motion.ellipse
          cx="65" cy="28" rx="39" ry="11"
          stroke="#E8E0C8" strokeWidth="1.5"
          fill="#180C05"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.85, delay: 0.22 }}
        />

        {/* Gloss highlight */}
        <motion.path
          d="M34 34 L38 105"
          stroke="url(#gloss)" strokeWidth="9" strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.9 }}
        />

        {/* Handle */}
        <motion.path
          d="M104 52 Q130 52 130 74 Q130 98 104 98"
          stroke="#E8E0C8" strokeWidth="1.8"
          fill="none" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          filter="url(#gl)"
        />
        <motion.path
          d="M104 60 Q120 60 120 74 Q120 90 104 90"
          stroke="rgba(232,224,200,0.1)" strokeWidth="1.2"
          fill="none" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
        />

        {/* Steam */}
        {[
          { x1: 42, path: "M42 18 C39 9 46 5 42 -4", d: 0 },
          { x1: 65, path: "M65 16 C62 7 69 3 65 -6", d: 0.55 },
          { x1: 88, path: "M88 18 C85 9 92 5 88 -4", d: 1.1 },
        ].map((s, i) => (
          <motion.path
            key={i}
            d={s.path}
            stroke="#E8E0C8"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
              y: [0, -10, -22],
            }}
            transition={{
              duration: 2.6,
              delay: s.d,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// ─── Main Preloader ───────────────────────────────────────────────────────────
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem("luminary_loaded");
    if (seen) { setVisible(false); return; }

    const startTime = Date.now();
    let frame = 0;

    const interval = setInterval(() => {
      frame += Math.floor(Math.random() * 6) + 2;
      if (frame >= 100) {
        frame = 100;
        clearInterval(interval);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DURATION_MS - elapsed);
        setTimeout(() => {
          sessionStorage.setItem("luminary_loaded", "1");
          setVisible(false);
        }, remaining + 400);
      }
      setCount(frame);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#0E1A12" }}
          exit={{
            opacity: 0,
            scale: 0.97,
            transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* Ambient radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 54%, rgba(107,63,30,0.2) 0%, transparent 68%)",
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.18,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "160px 160px",
            }}
          />

          {/* Corner brackets */}
          {(["top-5 left-5 border-t border-l","top-5 right-5 border-t border-r","bottom-5 left-5 border-b border-l","bottom-5 right-5 border-b border-r"] as const).map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-7 h-7 ${cls} border-[#E8E0C8]/[0.14]`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.07, duration: 0.5, ease: "easeOut" }}
            />
          ))}

          {/* Cup */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <InteractiveCup count={count} />

            {/* Side fill readout */}
            <motion.div
              className="absolute -right-12 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }}
            >
              <div style={{ fontSize: "8px", letterSpacing: "0.18em", color: "rgba(232,224,200,0.22)", marginBottom: 2 }}>
                FILL
              </div>
              <motion.div
                key={count}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12 }}
                style={{ fontSize: "14px", letterSpacing: "0.04em", color: "rgba(232,224,200,0.6)" }}
              >
                {count}
                <span style={{ fontSize: "8px", opacity: 0.55 }}>%</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Brand name */}
          <motion.div
            className="flex mb-6"
            style={{ gap: "0.12em" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
          >
            {"LUMINARY".split("").map((ch, i) => (
              <motion.span
                key={i}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Didot', Georgia, serif",
                  fontSize: "22px",
                  letterSpacing: "0.52em",
                  color: "#E8E0C8",
                  fontWeight: 300,
                  display: "inline-block",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.45, ease: "easeOut" }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.div>

          {/* Italic tagline */}
          <motion.p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "11px",
              letterSpacing: "0.28em",
              color: "rgba(232,224,200,0.28)",
              marginBottom: "26px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.9 }}
          >
            brewing your experience
          </motion.p>

          {/* Progress track */}
          <motion.div
            style={{ width: 190 }}
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.65, duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="relative h-px overflow-hidden"
              style={{ background: "rgba(232,224,200,0.07)" }}
            >
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${count}%`,
                  transition: "width 0.18s ease-out",
                  background:
                    "linear-gradient(90deg, rgba(232,224,200,0.25), rgba(232,224,200,0.85), #fff)",
                  backgroundSize: "200% auto",
                }}
                animate={{ backgroundPosition: ["0% center", "200% center"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Milestone dots */}
            <div className="flex justify-between mt-3">
              {[0, 25, 50, 75, 100].map((m) => (
                <motion.div
                  key={m}
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background:
                      count >= m
                        ? "rgba(232,224,200,0.75)"
                        : "rgba(232,224,200,0.11)",
                    boxShadow:
                      count >= m ? "0 0 6px rgba(232,224,200,0.45)" : "none",
                    transition: "all 0.35s ease",
                  }}
                  animate={count >= m ? { scale: [1, 1.6, 1] } : {}}
                  transition={{ duration: 0.35 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Status */}
          <motion.div
            className="mt-5 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              fontFamily: "'DM Mono', 'Courier New', monospace",
              fontSize: "8px",
              letterSpacing: "0.28em",
              color: "rgba(232,224,200,0.2)",
              textTransform: "uppercase",
            }}
          >
            <motion.span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                display: "inline-block",
                background: count < 100 ? "#4ade80" : "#E8E0C8",
                boxShadow: count < 100 ? "0 0 8px #4ade80" : "none",
              }}
              animate={count < 100 ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
            <AnimatePresence mode="wait">
              <motion.span
                key={count < 28 ? "a" : count < 60 ? "b" : count < 92 ? "c" : "d"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
              >
                {count < 28
                  ? "Grinding beans"
                  : count < 60
                  ? "Brewing espresso"
                  : count < 92
                  ? "Frothing milk"
                  : "Ready to serve"}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}