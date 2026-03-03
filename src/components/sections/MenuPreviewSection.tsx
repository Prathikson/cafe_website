"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/lib/CartContext";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const menuItems = [
  {
    category: "Coffee",
    items: [
      { id:"oat-flat-white",        name: "Oat Flat White",        description: "Double ristretto, steamed oat milk, 5oz",   price: 6.50, badge: "Bestseller", img: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&q=80&auto=format&fit=crop" },
      { id:"ethiopian-pour-over",   name: "Ethiopian Pour Over",   description: "Yirgacheffe, jasmine & blueberry notes",     price: 7.00, badge: "Single Origin", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80&auto=format&fit=crop" },
      { id:"cold-brew-reserve",     name: "Cold Brew Reserve",     description: "18hr steep, Brazil natural, over ice",       price: 6.00, badge: null, img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80&auto=format&fit=crop" },
      { id:"espresso",              name: "Espresso",              description: "Double shot, 18g, textbook extraction",      price: 4.00, badge: null, img: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80&auto=format&fit=crop" },
    ],
  },
  {
    category: "Food",
    items: [
      { id:"almond-croissant",      name: "Almond Croissant",      description: "Twice-baked, frangipane, toasted almonds",   price: 5.50, badge: "Fresh Daily", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80&auto=format&fit=crop" },
      { id:"avocado-board",         name: "Avocado Board",         description: "Smashed avo, poached egg, chilli, seeds",    price: 14.00,badge: null, img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80&auto=format&fit=crop" },
      { id:"sourdough-toast",       name: "Sourdough Toast",       description: "House sourdough, whipped ricotta, honey",    price: 9.00, badge: "Morning", img: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&q=80&auto=format&fit=crop" },
      { id:"granola-bowl",          name: "Granola Bowl",          description: "Coconut yoghurt, seasonal fruit, flowers",   price: 12.00,badge: "New", img: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=600&q=80&auto=format&fit=crop" },
    ],
  },
];

export function MenuPreviewSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".menu-preview-header", { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const active = menuItems[activeCategory];

  const handleAddToCart = (item: typeof active.items[0]) => {
    dispatch({
      type: "ADD",
      item: { id: item.id, name: item.name, price: item.price, size: "Regular", img: item.img, qty: 1 },
    });
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-sand-200" aria-labelledby="new-products-heading">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="menu-preview-header flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-2">What We Serve</p>
            <h2 id="new-products-heading" className="text-[clamp(1.8rem,3.5vw,3rem)] font-light tracking-[-0.02em] text-ink-900">
              New Products
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {menuItems.map((cat, i) => (
              <button key={cat.category} onClick={() => setActiveCategory(i)}
                className={`px-4 py-2 rounded-full text-[11px] tracking-widest uppercase font-light border transition-all duration-300 ${activeCategory === i ? "bg-ink-900 text-sand-100 border-ink-900" : "border-ink-200 text-ink-500 hover:border-ink-600 hover:text-ink-900"}`}>
                {cat.category}
              </button>
            ))}
            <Link href="/menu" className="px-5 py-2 rounded-full text-[11px] tracking-widest uppercase font-light border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-sand-100 transition-all duration-300">
              Shop now
            </Link>
          </div>
        </div>

        {/* Product cards — rounded like reference */}
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {active.items.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.5 }} className="group">
                {/* Rounded product card — like reference */}
                <div className="relative product-bg rounded-2xl aspect-square overflow-hidden mb-3">
                  {item.badge && (
                    <div className="absolute top-0 right-0 z-10 bg-badge-green px-2 py-3 flex items-center justify-center rounded-bl-xl">
                      <span className="badge-rotated text-[8px] tracking-[0.2em] uppercase text-white font-light">{item.badge}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <Image src={item.img} alt={item.name} fill className="object-cover" sizes="25vw" />
                  </div>
                  {/* Quick add overlay */}
                  <button onClick={() => handleAddToCart(item)}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur text-ink-900 text-[10px] tracking-widest uppercase px-4 py-2 rounded-full whitespace-nowrap hover:bg-white">
                    + Add to Order
                  </button>
                </div>
                <h3 className="text-[13px] font-light text-ink-800 mb-0.5 leading-snug">{item.name}</h3>
                <p className="text-[13px] font-medium text-ink-900">
                  From ${item.price.toFixed(2)} <span className="font-light text-ink-400 text-[11px]">incl. tax</span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
