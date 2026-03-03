"use client";
import { motion } from "framer-motion";

const items = [
  "Specialty Coffee", "Single Origin", "Artisan Pastries",
  "Cold Brew", "Pour Over", "Matcha Latte", "Fresh Daily",
  "Flat White", "Espresso", "Seasonal Menu",
];

export function MarqueeSection() {
  const doubled = [...items, ...items];
  return (
    <section className="py-4 bg-ink-900 overflow-hidden" aria-hidden="true">
      <div className="flex">
        <motion.div
          className="flex gap-10 whitespace-nowrap flex-shrink-0"
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-10 text-sand-100/60 text-[11px] tracking-[0.2em] uppercase font-light">
              {item}
              <span className="text-sand-100/20 text-[8px]">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
