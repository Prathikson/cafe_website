"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";

export function CartSidebar() {
  const { state, dispatch } = useCart();
  const { items, isOpen } = state;

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const itemCount = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 z-[200] bg-ink-900/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => dispatch({ type: "CLOSE" })}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="cart-sidebar"
            className="fixed top-0 right-0 h-full w-full max-w-md z-[201] bg-sand-50 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
              <div className="flex items-center gap-3">
                <h2 className="text-[14px] font-light text-ink-900 tracking-wide">Your Order</h2>
                {itemCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-ink-900 text-sand-100 text-[10px] flex items-center justify-center font-light">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: "CLOSE" })}
                className="w-8 h-8 flex items-center justify-center border border-ink-100 hover:border-ink-900 transition-colors rounded-full"
                aria-label="Close cart"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-64 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* Empty cup SVG */}
                    <svg width="60" height="70" viewBox="0 0 60 70" fill="none" className="opacity-20">
                      <path d="M8 20 L13 58 Q30 64 47 58 L52 20 Z" stroke="#1A1A1A" strokeWidth="1" fill="none" />
                      <ellipse cx="30" cy="20" rx="22" ry="6" stroke="#1A1A1A" strokeWidth="1" fill="none" />
                      <path d="M52 30 Q64 30 64 42 Q64 54 52 54" stroke="#1A1A1A" strokeWidth="1" fill="none" />
                    </svg>
                    <p className="text-[13px] font-light text-ink-400">Your cup is empty</p>
                    <button
                      onClick={() => dispatch({ type: "CLOSE" })}
                      className="text-[11px] tracking-widest uppercase text-ink-600 hover:text-ink-900 transition-colors border-b border-current pb-0.5"
                    >
                      Browse Menu
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="flex gap-4 py-4 border-b border-ink-100"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-sand-200">
                        <Image src={item.img} alt={item.name} fill className="object-cover" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-light text-ink-900 leading-snug truncate">{item.name}</p>
                        <p className="text-[11px] text-ink-400 mb-2">{item.size}</p>
                        <div className="flex items-center gap-3">
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 border border-ink-100 rounded-full px-2 py-1">
                            <button
                              onClick={() => dispatch({ type: "DECREMENT", id: item.id, size: item.size })}
                              className="w-4 h-4 flex items-center justify-center text-ink-500 hover:text-ink-900"
                            >−</button>
                            <span className="text-[12px] font-light text-ink-900 w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => dispatch({ type: "INCREMENT", id: item.id, size: item.size })}
                              className="w-4 h-4 flex items-center justify-center text-ink-500 hover:text-ink-900"
                            >+</button>
                          </div>
                        </div>
                      </div>

                      {/* Price + remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => dispatch({ type: "REMOVE", id: item.id, size: item.size })}
                          className="text-ink-300 hover:text-ink-700 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <line x1="0.5" y1="0.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="9.5" y1="0.5" x2="0.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                        </button>
                        <p className="text-[13px] font-light text-ink-900">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-ink-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-ink-400">Subtotal</span>
                  <span className="text-[15px] font-light text-ink-900">${total.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-ink-400">Shipping & tax calculated at checkout</p>
                <button className="w-full py-3.5 bg-ink-900 text-sand-100 text-[11px] tracking-widest uppercase font-light hover:bg-ink-700 transition-colors rounded-full">
                  Checkout →
                </button>
                <button
                  onClick={() => dispatch({ type: "CLOSE" })}
                  className="w-full py-3 text-[11px] tracking-widest uppercase text-ink-500 hover:text-ink-900 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
