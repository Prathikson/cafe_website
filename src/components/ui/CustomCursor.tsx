"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorTheme = "light" | "dark" | "forest";

function getBgTheme(el: Element | null): CursorTheme {
  if (!el) return "light";
  // Walk up DOM to find a meaningful background
  let current: Element | null = el;
  while (current && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    const bg = style.backgroundColor;
    const inlineBg = (current as HTMLElement).style?.backgroundColor || "";
    const combined = inlineBg || bg;

    // Parse RGB values
    const match = combined.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const alpha = combined.includes("rgba") ? parseFloat(combined.split(",")[3]) : 1;
      if (alpha < 0.05) { current = current.parentElement; continue; }

      // Detect dark green (#12271D range)
      if (r < 40 && g < 55 && b < 40 && g > r) return "forest";
      // Detect dark / near-black
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (luminance < 0.25) return "dark";
      // Detect light / cream / sand
      if (luminance > 0.7) return "light";
    }
    current = current.parentElement;
  }
  return "light";
}

// Theme → color tokens
const THEMES: Record<CursorTheme, { ring: string; dot: string; blend: string }> = {
  light:  { ring: "#1A1A1A",  dot: "#12271D", blend: "mix-blend-multiply" },
  dark:   { ring: "#F5F0E8",  dot: "#F5F0E8", blend: "mix-blend-screen"   },
  forest: { ring: "#F5F0E8",  dot: "#F5F0E8", blend: "mix-blend-screen"   },
};

export function CustomCursor() {
  const [theme, setTheme] = useState<CursorTheme>("light");
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const themeRef = useRef<CursorTheme>("light");

  // Cursor position — tight spring for dot, looser for ring
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.4 });

  // Dot follows instantly (no spring lag)
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);

  useEffect(() => {
    let rafId: number;
    let lastX = -200, lastY = -200;

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;

      // Dot: instant
      dotX.set(e.clientX - 5);
      dotY.set(e.clientY - 5);

      // Ring: springs handle lag
      mouseX.set(e.clientX - 20);
      mouseY.set(e.clientY - 20);

      // Theme detection — throttled via rAF
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = document.elementFromPoint(lastX, lastY);
        const newTheme = getBgTheme(el);
        if (newTheme !== themeRef.current) {
          themeRef.current = newTheme;
          setTheme(newTheme);
        }
      });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea")
      );
      setIsHovering(isInteractive);
    };

    const onDown = () => setIsClicking(true);
    const onUp   = () => setIsClicking(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, [mouseX, mouseY, dotX, dotY]);

  const { ring, dot, blend } = THEMES[theme];

  const ringSize = isHovering ? 52 : isClicking ? 28 : 40;
  const dotSize  = isHovering ? 4  : isClicking ? 8  : 10;

  return (
    <>
      {/* ── Outer ring — lagging spring, expands on hover ── */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] ${blend}`}
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          border: `1px solid ${ring}`,
          // CSS transition for color change — instant, no jank
          borderColor: ring,
          transition: "border-color 0.25s ease, width 0.25s ease, height 0.25s ease",
          // Offset to stay centered
          marginLeft: (40 - ringSize) / 2,
          marginTop:  (40 - ringSize) / 2,
        }}
      />

      {/* ── Inner dot — no spring, pixel-perfect tracking ── */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] ${blend}`}
        style={{
          x: dotX,
          y: dotY,
          width:  dotSize,
          height: dotSize,
          backgroundColor: dot,
          // CSS for color/size transition only
          transition: "background-color 0.2s ease, width 0.18s ease, height 0.18s ease",
          // Center the dot at cursor tip
          marginLeft: (10 - dotSize) / 2,
          marginTop:  (10 - dotSize) / 2,
        }}
      />
    </>
  );
}
