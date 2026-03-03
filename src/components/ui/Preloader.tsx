"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Only show once per session
    const seen = sessionStorage.getItem("luminary_loaded");
    if (seen) { setVisible(false); return; }

    let frame = 0;
    const interval = setInterval(() => {
      frame += Math.floor(Math.random() * 12) + 4;
      if (frame >= 100) {
        frame = 100;
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem("luminary_loaded", "1");
          setVisible(false);
        }, 600);
      }
      setCount(frame);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#12271D" }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* Animated coffee cup SVG */}
          <div className="relative mb-10">
            <svg
              width="80"
              height="90"
              viewBox="0 0 80 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cup body */}
              <motion.path
                d="M12 28 L18 76 Q40 84 62 76 L68 28 Z"
                stroke="#E8E0C8"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              {/* Rim */}
              <motion.ellipse
                cx="40"
                cy="28"
                rx="28"
                ry="7"
                stroke="#E8E0C8"
                strokeWidth="1.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              {/* Handle */}
              <motion.path
                d="M68 40 Q86 40 86 56 Q86 72 68 72"
                stroke="#E8E0C8"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
              {/* Steam wisps */}
              {[0, 1, 2].map((i) => (
                <motion.path
                  key={i}
                  d={`M${28 + i * 12} ${22 - i * 2} C${28 + i * 12} ${14 - i * 2} ${32 + i * 12} ${10 - i * 2} ${28 + i * 12} ${4 - i * 2}`}
                  stroke="#E8E0C8"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 0],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.6 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>
          </div>

          {/* Brand name */}
          <motion.div
            className="flex gap-1 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {"LUMINARY".split("").map((ch, i) => (
              <motion.span
                key={i}
                className="text-[13px] tracking-[0.4em] text-[#E8E0C8] font-light"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.div>

          {/* Progress bar */}
          <div className="w-40 h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#E8E0C8]/60"
              style={{ width: `${count}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <motion.span
            className="mt-3 text-[10px] tracking-[0.3em] text-[#E8E0C8]/30 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {String(count).padStart(2, "0")}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
