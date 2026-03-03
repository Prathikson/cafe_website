"use client";

import React, { createContext, useContext, useReducer, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  img: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string; size: string }
  | { type: "INCREMENT"; id: string; size: string }
  | { type: "DECREMENT"; id: string; size: string }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const key = `${action.item.id}-${action.item.size}`;
      const exists = state.items.find(
        (i) => i.id === action.item.id && i.size === action.item.size
      );
      if (exists) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.id === action.item.id && i.size === action.item.size
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }
      return { ...state, isOpen: true, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === action.id && i.size === action.size)
        ),
      };
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.size === action.size ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case "DECREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.size === action.size && i.qty > 1
            ? { ...i, qty: i.qty - 1 }
            : i
        ),
      };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
