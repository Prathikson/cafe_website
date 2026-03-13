"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/lib/CartContext";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const PRODUCT_IMAGES: Record<string, string> = {
  "Espresso":                 "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80&auto=format&fit=crop",
  "Long Black":               "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=600&q=80&auto=format&fit=crop",
  "Flat White":               "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80&auto=format&fit=crop",
  "Oat Flat White":           "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&q=80&auto=format&fit=crop",
  "Cappuccino":               "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80&auto=format&fit=crop",
  "Latte":                    "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&q=80&auto=format&fit=crop",
  "Cortado":                  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80&auto=format&fit=crop",
  "Piccolo":                  "https://images.unsplash.com/photo-1508175800969-525c72a047dd?w=600&q=80&auto=format&fit=crop",
  "Ethiopian Yirgacheffe":    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80&auto=format&fit=crop",
  "Colombian Huila":          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80&auto=format&fit=crop",
  "Guatemalan Antigua":       "https://images.unsplash.com/photo-1516743619420-154b70a65fea?w=600&q=80&auto=format&fit=crop",
  "Cold Brew Reserve":        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80&auto=format&fit=crop",
  "Iced Oat Latte":           "https://images.unsplash.com/photo-1494314671902-399b18174975?w=600&q=80&auto=format&fit=crop",
  "Iced Matcha Latte":        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80&auto=format&fit=crop",
  "Sparkling Tonic Espresso": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80&auto=format&fit=crop",
  "Matcha Latte":             "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80&auto=format&fit=crop",
  "Turmeric Latte":           "https://images.unsplash.com/photo-1575937782168-5e1b9f0af6c1?w=600&q=80&auto=format&fit=crop",
  "Masala Chai":              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop",
  "Hot Chocolate":            "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&q=80&auto=format&fit=crop",
  "Almond Croissant":         "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80&auto=format&fit=crop",
  "Pain au Chocolat":         "https://images.unsplash.com/photo-1549931319-a545dcf3bc7f?w=600&q=80&auto=format&fit=crop",
  "Banana Bread":             "https://images.unsplash.com/photo-1605288505399-9d48bea9dd09?w=600&q=80&auto=format&fit=crop",
  "Sourdough Toast":          "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&q=80&auto=format&fit=crop",
  "Avocado Board":            "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80&auto=format&fit=crop",
  "Granola Bowl":             "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=600&q=80&auto=format&fit=crop",
  "Mushroom Toast":           "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80&auto=format&fit=crop",
};
const FALLBACK_IMG = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop";

const CUP_SIZES = [
  { id: "small",  label: "S", oz: "8oz",  price: 0 },
  { id: "medium", label: "M", oz: "12oz", price: 0.5 },
  { id: "large",  label: "L", oz: "16oz", price: 1 },
];

interface MenuItem { name: string; description: string; price: string; badge: string | null; }
interface MenuPageClientProps { menuData: Record<string, MenuItem[]>; }

// ─── Realistic cup SVG ────────────────────────────────────────────────────────
function CupSizeSVG({
  sizeId,
  active,
}: {
  sizeId: "small" | "medium" | "large";
  active: boolean;
}) {
  // Dimensions per size
  const dims = {
    small:  { W: 36, H: 44, rimRx: 14, rimRy: 4 },
    medium: { W: 44, H: 54, rimRx: 17, rimRy: 5 },
    large:  { W: 54, H: 66, rimRx: 21, rimRy: 6 },
  }[sizeId];

  const { W, H, rimRx, rimRy } = dims;
  const cx = W / 2;
  // Body: trapezoid — narrow at top, wider at bottom
  const topW = rimRx * 1.6;
  const botW = rimRx * 2.1;
  const bodyTop = rimRy + 2;
  const bodyBot = H - 10;

  const fill   = active ? "#12271D" : "none";
  const stroke = active ? "#12271D" : "#B0A898";
  const liq    = active ? "#4A7C59" : "none";
  const steam  = active ? "#12271D" : "#C8C0B8";

  // Liquid fill inside cup (60% full)
  const liqTop = bodyTop + (bodyBot - bodyTop) * 0.38;
  const liqTopW = topW + (botW - topW) * 0.38;

  return (
    <svg
      width={W + 20}
      height={H + 18}
      viewBox={`0 0 ${W + 20} ${H + 18}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* ── Steam wisps (active only) ── */}
      {active && (
        <>
          <path
            d={`M${cx + 4} ${bodyTop - 4} C${cx + 4} ${bodyTop - 9} ${cx + 8} ${bodyTop - 9} ${cx + 4} ${bodyTop - 14}`}
            stroke={steam} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.45"
          />
          <path
            d={`M${cx + 11} ${bodyTop - 6} C${cx + 11} ${bodyTop - 11} ${cx + 15} ${bodyTop - 11} ${cx + 11} ${bodyTop - 16}`}
            stroke={steam} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3"
          />
        </>
      )}

      {/* ── Cup body (trapezoid) ── */}
      <path
        d={`
          M${cx - topW / 2} ${bodyTop}
          L${cx - botW / 2} ${bodyBot}
          Q${cx} ${bodyBot + 8} ${cx + botW / 2} ${bodyBot}
          L${cx + topW / 2} ${bodyTop}
          Z
        `}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      {/* ── Liquid fill ── */}
      {active && (
        <>
          <clipPath id={`clip-${sizeId}`}>
            <path
              d={`
                M${cx - topW / 2} ${bodyTop}
                L${cx - botW / 2} ${bodyBot}
                Q${cx} ${bodyBot + 8} ${cx + botW / 2} ${bodyBot}
                L${cx + topW / 2} ${bodyTop}
                Z
              `}
            />
          </clipPath>
          <g clipPath={`url(#clip-${sizeId})`}>
            {/* Liquid body */}
            <path
              d={`
                M${cx - liqTopW / 2 - 2} ${liqTop}
                L${cx - botW / 2 - 1} ${bodyBot}
                Q${cx} ${bodyBot + 9} ${cx + botW / 2 + 1} ${bodyBot}
                L${cx + liqTopW / 2 + 2} ${liqTop}
                Z
              `}
              fill={liq}
              opacity="0.7"
            />
            {/* Foam top */}
            <ellipse
              cx={cx} cy={liqTop} rx={liqTopW / 2 + 1} ry={rimRy * 0.7}
              fill="#7DB88A" opacity="0.6"
            />
            {/* Gloss on liquid */}
            <ellipse
              cx={cx - liqTopW / 5} cy={liqTop + 2} rx={liqTopW / 6} ry={rimRy * 0.3}
              fill="white" opacity="0.15"
            />
          </g>
        </>
      )}

      {/* ── Rim ellipse (top) ── */}
      <ellipse
        cx={cx} cy={bodyTop} rx={rimRx} ry={rimRy}
        stroke={stroke} strokeWidth="1.3"
        fill={active ? "#12271D" : "none"}
      />

      {/* ── Gloss highlight on cup body ── */}
      {active && (
        <path
          d={`M${cx - topW / 2 + 5} ${bodyTop + 4} L${cx - botW / 2 + 7} ${bodyBot - 6}`}
          stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round"
        />
      )}

      {/* ── Handle ── */}
      <path
        d={`
          M${cx + topW / 2 - 2} ${bodyTop + (bodyBot - bodyTop) * 0.25}
          Q${cx + topW / 2 + 12} ${bodyTop + (bodyBot - bodyTop) * 0.25}
            ${cx + topW / 2 + 12} ${bodyTop + (bodyBot - bodyTop) * 0.55}
          Q${cx + topW / 2 + 12} ${bodyTop + (bodyBot - bodyTop) * 0.82}
            ${cx + topW / 2 - 2} ${bodyTop + (bodyBot - bodyTop) * 0.82}
        `}
        stroke={stroke} strokeWidth="1.3" fill="none" strokeLinecap="round"
      />

      {/* ── Saucer ── */}
      <ellipse
        cx={cx} cy={bodyBot + 9} rx={botW / 2 + 5} ry={rimRy * 0.8}
        stroke={stroke} strokeWidth="1" fill={active ? "#0d1f16" : "none"} opacity="0.7"
      />
    </svg>
  );
}

// ─── Product Modal ─────────────────────────────────────────────────────────────
function ProductModal({
  item,
  category,
  onClose,
}: {
  item: MenuItem;
  category: string;
  onClose: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState(CUP_SIZES[1]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { dispatch } = useCart();
  const isFood = category === "Food";
  const basePrice = parseFloat(item.price.replace("$", ""));
  const unitPrice = basePrice + (isFood ? 0 : selectedSize.price);
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    dispatch({
      type: "ADD",
      item: {
        id: item.name.replace(/\s+/g, "-").toLowerCase(),
        name: item.name,
        price: unitPrice,
        size: isFood ? "Regular" : `${selectedSize.oz} (${selectedSize.label})`,
        img: PRODUCT_IMAGES[item.name] || FALLBACK_IMG,
        qty,
      },
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 900);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal card */}
      <motion.div
        className="relative bg-[#FAF7F2] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden w-full sm:max-w-3xl z-10 shadow-2xl"
        style={{ maxHeight: "96dvh" }}
        initial={{ y: 80, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Hero image ── */}
        <div className="relative h-80 sm:h-96 overflow-hidden flex-shrink-0">
          <Image
            src={PRODUCT_IMAGES[item.name] || FALLBACK_IMG}
            alt={item.name}
            fill
            className="object-cover"
          />
          {/* Gradient fade into card */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/20 to-transparent" />

          {/* Badge */}
          {item.badge && (
            <div className="absolute top-5 left-5">
              <span className="text-[10px] tracking-[0.18em] uppercase bg-[#12271D] text-[#E8E0C8] px-3 py-1.5 rounded-full font-light">
                {item.badge}
              </span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#12271D] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <line x1="1" y1="1" x2="10" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="10" y1="1" x2="1" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Content ── */}
        <div className="px-8 sm:px-10 pb-10 pt-3 overflow-y-auto" style={{ maxHeight: "calc(96dvh - 340px)" }}>
          {/* Name + category */}
          <div className="mb-1">
            <span className="text-[10px] tracking-[0.22em] uppercase text-[#8A7E72] font-light">
              {category}
            </span>
          </div>
          <h3
            className="font-light tracking-[-0.025em] text-[#12271D] mb-2 leading-tight"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
          >
            {item.name}
          </h3>
          <p className="text-[14px] font-light text-[#6B6258] leading-relaxed mb-6">
            {item.description}
          </p>

          {/* ── Size selector (drinks only) ── */}
          {!isFood && (
            <div className="mb-7">
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#8A7E72] mb-4">
                Choose your size
              </p>
              <div className="flex gap-3 sm:gap-5">
                {CUP_SIZES.map((size) => {
                  const active = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className="relative flex flex-col items-center gap-3 flex-1 group"
                    >
                      {/* Selection ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                        animate={{
                          borderColor: active ? "#12271D" : "transparent",
                          backgroundColor: active ? "#12271D0D" : "transparent",
                        }}
                        transition={{ duration: 0.2 }}
                        style={{ top: "-10px", bottom: "-10px", left: "-8px", right: "-8px" }}
                      />
                      <div className="relative z-10 py-2">
                        <CupSizeSVG
                          sizeId={size.id as "small" | "medium" | "large"}
                          active={active}
                        />
                      </div>
                      <div className="relative z-10 text-center">
                        <div
                          className="text-[13px] font-light transition-colors"
                          style={{ color: active ? "#12271D" : "#8A7E72" }}
                        >
                          {size.oz}
                        </div>
                        <div
                          className="text-[11px] transition-colors mt-0.5"
                          style={{ color: active ? "#4A7C59" : "#B0A898" }}
                        >
                          {size.price === 0 ? "Base" : `+$${size.price.toFixed(2)}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Divider ── */}
          <div className="h-px bg-[#E8E0D0] mb-6" />

          {/* ── Qty + Add to order ── */}
          <div className="flex items-center gap-4">
            {/* Quantity stepper */}
            <div className="flex items-center gap-3 bg-[#F0EBE3] rounded-full px-4 py-2.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#E0D8CE] transition-colors text-[#12271D] font-light text-lg leading-none"
              >
                −
              </button>
              <span className="text-[15px] font-light text-[#12271D] w-5 text-center tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#E0D8CE] transition-colors text-[#12271D] font-light text-lg leading-none"
              >
                +
              </button>
            </div>

            {/* Add button */}
            <motion.button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-between px-6 py-3.5 rounded-full text-[13px] tracking-[0.08em] uppercase font-light transition-colors"
              style={{
                backgroundColor: added ? "#4A7C59" : "#12271D",
                color: "#E8E0C8",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{added ? "✓ Added to order" : "Add to order"}</span>
              <span className="font-light tabular-nums">
                ${totalPrice.toFixed(2)}
              </span>
            </motion.button>
          </div>

          {/* Tax note */}
          <p className="text-center text-[10px] text-[#B0A898] mt-3 tracking-wide">
            Price includes tax · Customise at the counter
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page client ─────────────────────────────────────────────────────────
export function MenuPageClient({ menuData }: MenuPageClientProps) {
  const categories = Object.keys(menuData);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ item: MenuItem; category: string } | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const sectionRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(
    () => categories.flatMap((cat) => menuData[cat].map((item) => ({ ...item, category: cat }))),
    [categories, menuData]
  );

  const filtered = useMemo(() => {
    let items = allItems;
    if (activeCategory !== "All") items = items.filter((i) => i.category === activeCategory);
    if (search) items = items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    );
    if (activeFilter.includes("New")) items = items.filter((i) => i.badge);
    if (activeFilter.includes("Bestseller")) items = items.filter((i) => i.badge === "Bestseller" || i.badge === "Popular");
    return items;
  }, [allItems, activeCategory, search, activeFilter]);

  const toggleFilter = (f: string) =>
    setActiveFilter((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".menu-hero-el", { opacity: 0, y: 45 }, {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* Hero */}
      <div className="px-6 md:px-10 py-14 md:py-20 border-b border-ink-100 bg-sand-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="menu-hero-el text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-4">Our Menu</p>
              <h1 className="menu-hero-el text-[clamp(3rem,7vw,6rem)] font-light tracking-[-0.025em] text-ink-900 leading-[0.95]">
                Shop all<br />products
              </h1>
            </div>
            <p className="menu-hero-el text-[14px] font-light text-ink-500 max-w-xs leading-relaxed">
              Everything made with care. Beans sourced direct. Pastries baked fresh each morning.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[60px] z-30 bg-sand-100/97 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="pl-8 pr-4 py-1.5 bg-sand-200 rounded-full text-[12px] font-light text-ink-700 placeholder:text-ink-400 focus:outline-none focus:bg-white border border-transparent focus:border-ink-200 transition-all w-36 focus:w-52"
              />
            </div>
            <div className="w-px h-4 bg-ink-100" />
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-light transition-all duration-200 ${activeCategory === "All" ? "bg-ink-900 text-sand-100" : "text-ink-500 hover:text-ink-900 hover:bg-sand-200"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-light transition-all duration-200 ${activeCategory === cat ? "bg-ink-900 text-sand-100" : "text-ink-500 hover:text-ink-900 hover:bg-sand-200"}`}
              >
                {cat}
              </button>
            ))}
            <div className="w-px h-4 bg-ink-100" />
            {["New", "Bestseller"].map((f) => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-light border transition-all duration-200 ${activeFilter.includes(f) ? "bg-badge-green text-white border-badge-green" : "border-ink-200 text-ink-500 hover:border-ink-500"}`}
              >
                {f}
              </button>
            ))}
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => setLayout("grid")}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${layout === "grid" ? "bg-ink-900 text-sand-100" : "text-ink-400 hover:text-ink-900"}`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0" y="0" width="4" height="4" rx="0.5" fill="currentColor" />
                  <rect x="6" y="0" width="4" height="4" rx="0.5" fill="currentColor" />
                  <rect x="0" y="6" width="4" height="4" rx="0.5" fill="currentColor" />
                  <rect x="6" y="6" width="4" height="4" rx="0.5" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${layout === "list" ? "bg-ink-900 text-sand-100" : "text-ink-400 hover:text-ink-900"}`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="0" y1="2" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 pt-6 pb-2">
        <p className="text-[11px] text-ink-400">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
          {search && ` for "${search}"`}
        </p>
      </div>

      {/* Product grid / list */}
      <div className="px-6 md:px-10 pb-16 bg-sand-100">
        <div className="max-w-screen-xl mx-auto">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" className="flex flex-col items-center justify-center py-24 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-[14px] font-light text-ink-400">Nothing matches your search</p>
                <button
                  onClick={() => { setSearch(""); setActiveCategory("All"); setActiveFilter([]); }}
                  className="text-[11px] tracking-widest uppercase text-ink-600 hover:text-ink-900 border-b border-current pb-0.5 transition-colors"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : layout === "grid" ? (
              <motion.div key="grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {filtered.map((item, i) => (
                  <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="group">
                    <button onClick={() => setSelectedItem({ item, category: item.category })} className="block w-full text-left">
                      <div className="relative product-bg rounded-2xl overflow-hidden aspect-square mb-3">
                        {item.badge && (
                          <div className="absolute top-0 right-0 z-10 bg-badge-green px-2 py-3 flex items-center justify-center rounded-bl-xl">
                            <span className="badge-rotated text-[8px] tracking-[0.2em] uppercase text-white font-light">{item.badge}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                          <Image src={PRODUCT_IMAGES[item.name] || FALLBACK_IMG} alt={item.name} fill className="object-cover" sizes="25vw" />
                        </div>
                        <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-[11px] tracking-widest uppercase bg-white/20 backdrop-blur px-4 py-2 rounded-full">View</span>
                        </div>
                      </div>
                      <h3 className="text-[13px] font-light text-ink-800 mb-0.5 leading-snug truncate">{item.name}</h3>
                      <p className="text-[13px] font-medium text-ink-900">
                        From {item.price}
                        <span className="font-light text-ink-400 text-[11px] ml-1">incl. tax</span>
                      </p>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="list" className="divide-y divide-ink-100 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {filtered.map((item, i) => (
                  <motion.button
                    key={item.name}
                    onClick={() => setSelectedItem({ item, category: item.category })}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="w-full text-left flex items-center gap-5 py-4 group hover:bg-sand-200/50 px-3 rounded-xl transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 product-bg">
                      <Image src={PRODUCT_IMAGES[item.name] || FALLBACK_IMG} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-light text-ink-900">{item.name}</h3>
                        {item.badge && <span className="text-[9px] tracking-widest uppercase bg-badge-green text-white px-1.5 py-0.5 rounded">{item.badge}</span>}
                      </div>
                      <p className="text-[12px] text-ink-400 truncate">{item.description}</p>
                    </div>
                    <p className="text-[14px] font-light text-ink-900 flex-shrink-0">{item.price}</p>
                    <span className="text-ink-300 group-hover:text-ink-700 transition-colors">→</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ProductModal
            item={selectedItem.item}
            category={selectedItem.category}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}