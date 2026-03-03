"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickNav, setShowQuickNav] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { state, dispatch } = useCart();
  const itemCount = state.items.reduce((a, i) => a + i.qty, 0);

  const navBg = useTransform(scrollY, [0, 80], ["rgba(245,240,232,0)", "rgba(245,240,232,0.97)"]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <>
      <motion.header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: navBg }}>
        <motion.div className="absolute bottom-0 left-0 right-0 h-px bg-ink-100" style={{ opacity: borderOpacity }} />
        <div className="flex items-center justify-between h-[60px] px-6 md:px-10">
          {/* Logo */}
{/* Logo */}
<Link href="/" className="flex items-center gap-3">
  <Image
    src="/logo.svg"
    alt="Luminary Café Logo"
    width={36}
    height={36}
    priority
    className="h-9 w-auto"
  />

  <div className="leading-none">
    <div className="text-[13px] font-medium tracking-tight text-ink-900">
      Luminary
    </div>
    <div className="text-[10px] font-light tracking-[0.15em] text-ink-400 uppercase">
      Café
    </div>
  </div>
</Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={clsx("text-[13px] font-light tracking-wide transition-colors duration-200 relative group",
                  pathname === link.href ? "text-ink-900" : "text-ink-600 hover:text-ink-900"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-px bg-ink-900" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">


            {/* Cart button */}
            <button
              onClick={() => dispatch({ type: "TOGGLE" })}
              aria-label="Open cart"
              className="relative w-8 h-8 flex items-center justify-center border border-ink-200 rounded-lg hover:border-ink-900 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1h2l2 6h5l1-4H4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="6" cy="12" r="1" fill="currentColor"/>
                <circle cx="10" cy="12" r="1" fill="currentColor"/>
              </svg>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-ink-900 text-sand-100 text-[9px] flex items-center justify-center font-light"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Quick-nav "feature" button — opens a neat flyout with organic shortcuts */}
            <div className="relative">
              <button
                onClick={() => setShowQuickNav(!showQuickNav)}
                aria-label="Quick navigate"
                className="w-8 h-8 flex items-center justify-center border border-ink-200 rounded-lg hover:border-ink-900 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="6" cy="2" r="1.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="10" cy="2" r="1.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="2" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="10" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="2" cy="10" r="1.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="6" cy="10" r="1.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity="0.6"/>
                </svg>
              </button>

              <AnimatePresence>
                {showQuickNav && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowQuickNav(false)} />
                    <motion.div
                      className="absolute right-0 top-10 z-20 bg-sand-50 border border-ink-100 rounded-2xl shadow-xl p-4 w-56"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
                    >
                      <p className="text-[10px] tracking-[0.2em] uppercase text-ink-400 mb-3 px-1">Quick Access</p>
                      {[
                        { label: "☕  Today's Special", href: "/menu" },
                        { label: "🌿  Our Story", href: "/about" },
                        { label: "📍  Find Us", href: "/contact" },
                        { label: "📋  Full Menu", href: "/menu" },
                        { label: "✉️  Newsletter", href: "/contact" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setShowQuickNav(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-light text-ink-700 hover:bg-sand-200 hover:text-ink-900 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            <motion.span className="block w-5 h-px bg-ink-900" animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
            <motion.span className="block w-3 h-px bg-ink-900" animate={isOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.25 }} />
            <motion.span className="block w-5 h-px bg-ink-900" animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-sand-100 md:hidden flex flex-col justify-center px-8"
        initial={{ clipPath: "circle(0% at calc(100% - 44px) 30px)" }}
        animate={isOpen ? { clipPath: "circle(150% at calc(100% - 44px) 30px)" } : { clipPath: "circle(0% at calc(100% - 44px) 30px)" }}
        transition={{ duration: 0.55, ease: [0.16,1,0.3,1] }}
      >
        <nav className="flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }} transition={{ delay: isOpen ? 0.1 + i * 0.07 : 0, duration: 0.4 }}>
              <Link href={link.href} onClick={() => setIsOpen(false)} className="text-4xl font-light text-ink-900 hover:text-ink-500 transition-colors">{link.label}</Link>
            </motion.div>
          ))}
        </nav>
        <div className="absolute bottom-8">
          <button onClick={() => { dispatch({ type: "TOGGLE" }); setIsOpen(false); }} className="flex items-center gap-2 text-[13px] font-light text-ink-500">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1h2l2 6h5l1-4H4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="12" r="1" fill="currentColor"/>
              <circle cx="10" cy="12" r="1" fill="currentColor"/>
            </svg>
            Cart {itemCount > 0 && `(${itemCount})`}
          </button>
        </div>
      </motion.div>
    </>
  );
}
